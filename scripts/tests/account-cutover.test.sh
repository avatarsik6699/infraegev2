#!/usr/bin/env bash
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
mkdir -p "$test_root/bin"

# Validation may authenticate the requested Restic snapshot and inspect the exact candidate image,
# but must never restore, run, or contact a DB.
cat >"$test_root/bin/restic" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$CUTOVER_TEST_LOG"
if [[ $1 == cat && $2 == snapshot && $3 == "$CUTOVER_TEST_SNAPSHOT" ]]; then
  printf '{"time":"%s","tags":["%s"]}\n' \
    "$(date -u +%FT%TZ)" "${CUTOVER_TEST_TAG:-infraege-application}"
elif [[ $1 == stats && $2 == --mode && $3 == restore-size && $4 == --json &&
  $5 == "$CUTOVER_TEST_SNAPSHOT" ]]; then
  printf '%s\n' "${CUTOVER_TEST_STATS:-{\"total_size\":1,\"snapshots_count\":1}}"
else
  exit 97
fi
FAKE
cat >"$test_root/bin/git" <<'FAKE'
#!/usr/bin/env bash
args=("$@")
case " ${args[*]} " in
  *' rev-parse --verify HEAD '*) printf '%s\n' "$CUTOVER_TEST_SHA" ;;
  *' status --porcelain --untracked-files=all '*) ;;
  *' diff '*) exit 0 ;;
  *) exit 98 ;;
esac
FAKE
cat >"$test_root/bin/docker" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$CUTOVER_TEST_LOG"
[[ $1 == image && $2 == inspect && $3 == "ghcr.io/avatarsik6699/infraegev2-api:$CUTOVER_TEST_SHA" ]] || exit 96
printf '["ghcr.io/avatarsik6699/infraegev2-api@%s"]\n' "$CUTOVER_TEST_DIGEST"
FAKE
chmod +x "$test_root/bin/restic" "$test_root/bin/git" "$test_root/bin/docker"
export PATH="$test_root/bin:$PATH" CUTOVER_TEST_LOG="$test_root/calls.log"
sha=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
snapshot=$(printf 'c%.0s' {1..64})
digest="sha256:$(printf 'b%.0s' {1..64})"
export CUTOVER_TEST_SHA=$sha CUTOVER_TEST_SNAPSHOT=$snapshot CUTOVER_TEST_DIGEST=$digest

# The production image contains only runtime dependencies. Neither migration path may cause
# uv to sync the default development group in a network-isolated cutover or during deploy.
for migration_source in "$repo_dir/scripts/rehearse-account-cutover.sh" \
  "$repo_dir/infra/docker-compose.yml" "$repo_dir/infra/docker-compose.prod.yml"; do
  grep -Fq '.venv/bin/alembic upgrade head' "$migration_source"
  if grep -Fq 'uv run --frozen alembic upgrade head' "$migration_source"; then
    echo "migration would sync dependencies at runtime: $migration_source" >&2
    exit 1
  fi
done

reject() {
  : >"$CUTOVER_TEST_LOG"
  if bash "$repo_dir/scripts/rehearse-account-cutover.sh" "$@" >"$test_root/output" 2>&1; then
    echo 'unsafe cutover input was accepted' >&2
    exit 1
  fi
  [[ ${CUTOVER_REQUIRE_NO_CALLS:-true} == false || ! -s $CUTOVER_TEST_LOG ]]
}

reject --validate short "$sha" "$digest"
reject --validate "$snapshot" short "$digest"
reject --validate "$snapshot" "$sha" invalid-digest

# Neither a legacy bundle path nor `latest` can reach Restic.
reject --validate /absolute/protected/bundle "$sha" "$digest"
reject --validate latest "$sha" "$digest"

: >"$CUTOVER_TEST_LOG"
if ! bash "$repo_dir/scripts/rehearse-account-cutover.sh" --validate \
  "$snapshot" "$sha" "$digest" >"$test_root/output" 2>&1; then
  sed -n '1,40p' "$test_root/output" >&2
  exit 1
fi
[[ $(<"$test_root/output") == *'authenticated snapshot and exact candidate source/image inputs: PASS'* ]]
[[ $(sed -n '1p' "$CUTOVER_TEST_LOG") == "cat snapshot $snapshot" ]]
[[ $(sed -n '2p' "$CUTOVER_TEST_LOG") == "stats --mode restore-size --json $snapshot" ]]
[[ $(sed -n '3p' "$CUTOVER_TEST_LOG") == "image inspect ghcr.io/avatarsik6699/infraegev2-api:$sha --format {{json .RepoDigests}}" ]]
[[ $(wc -l <"$CUTOVER_TEST_LOG") -eq 3 ]]

# Missing or ambiguous snapshot stats fail before image inspection or any restore.
export CUTOVER_REQUIRE_NO_CALLS=false
for bad_stats in '{"snapshots_count":1}' '{"total_size":-1,"snapshots_count":1}' \
  '{"total_size":1,"snapshots_count":2}' 'not-json'; do
  export CUTOVER_TEST_STATS=$bad_stats
  reject --validate "$snapshot" "$sha" "$digest"
  [[ $(wc -l <"$CUTOVER_TEST_LOG") -eq 2 ]]
done
unset CUTOVER_TEST_STATS

# A missing tag, wrong source SHA, or non-matching immutable image digest fails before any run.
export CUTOVER_TEST_TAG=not-application
reject --validate "$snapshot" "$sha" "$digest"
[[ $(<"$CUTOVER_TEST_LOG") == "cat snapshot $snapshot" ]]
unset CUTOVER_TEST_TAG
export CUTOVER_TEST_SHA=dddddddddddddddddddddddddddddddddddddddd
reject --validate "$snapshot" "$sha" "$digest"
[[ $(wc -l <"$CUTOVER_TEST_LOG") -eq 2 ]]
wrong_digest="sha256:$(printf 'e%.0s' {1..64})"
export CUTOVER_TEST_SHA=$sha CUTOVER_TEST_DIGEST=$wrong_digest
reject --validate "$snapshot" "$sha" "$digest"
[[ $(wc -l <"$CUTOVER_TEST_LOG") -eq 3 ]]

# In an ordinary non-root shell, --run must stop before a restore or any disposable Docker action.
if [[ $EUID != 0 ]]; then
  export CUTOVER_TEST_DIGEST=$digest
  : >"$CUTOVER_TEST_LOG"
  if bash "$repo_dir/scripts/rehearse-account-cutover.sh" --run "$snapshot" "$sha" "$digest" \
    >"$test_root/output" 2>&1; then
    echo 'non-root cutover run was accepted' >&2
    exit 1
  fi
  [[ $(<"$test_root/output") == *'cutover rehearsal must run as root'* ]]
  [[ $(wc -l <"$CUTOVER_TEST_LOG") -eq 3 ]]
fi

echo 'account cutover authenticated-snapshot and candidate-evidence contracts: PASS'
