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
elif [[ $1 == restore && $2 == "$CUTOVER_TEST_SNAPSHOT" && $3 == --target ]]; then
  bundle="$4/fixture-bundle"
  mkdir -p "$bundle/task-files"
  printf '{"environment":"prod","project":"infraege","schemaVersion":"122_01","release":"%s"}\n' \
    "$CUTOVER_TEST_SHA" >"$bundle/metadata.json"
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
if [[ $1 == image && $2 == inspect && $3 == "ghcr.io/avatarsik6699/infraegev2-api:$CUTOVER_TEST_SHA" ]]; then
  if [[ ${4:-} == --format && ${5:-} == '{{.Id}}' ]]; then printf 'sha256:fixture-image\n';
  else printf '["ghcr.io/avatarsik6699/infraegev2-api@%s"]\n' "$CUTOVER_TEST_DIGEST"; fi
elif [[ $1 == volume && $2 == inspect ]]; then exit 1
elif [[ $1 == exec ]]; then
  if [[ $* == *pg_isready* ]]; then exit 0; fi
  input=$(cat)
  if [[ $* == *'qAt'* ]]; then
    grep -Fq "fixture-ok" <<<"$input" || exit 91
    if [[ ${CUTOVER_TEST_ASSERT_FAIL:-false} == true ]]; then printf 'fixture-missing\n';
    else printf 'fixture-ok\n'; fi
  else
    grep -Fq "Synthetic facts are inserted" <<<"$input" || exit 92
  fi
elif [[ $1 == run && $* == *'.venv/bin/alembic upgrade head'* ]]; then
  [[ $* != *'uv sync'* && $* != *'uv run'* ]] || exit 93
fi
FAKE
cat >"$test_root/bin/python3" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "python3 $*" >>"$CUTOVER_TEST_LOG"
[[ $2 == bundle ]] || exit 94
mkdir -p "$4"
printf '{"schemaVersion":"140_01"}\n' >"$4/metadata.json"
FAKE
chmod +x "$test_root/bin/restic" "$test_root/bin/git" "$test_root/bin/docker" "$test_root/bin/python3"
export PATH="$test_root/bin:$PATH" CUTOVER_TEST_LOG="$test_root/calls.log"
sha=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
snapshot=$(printf 'c%.0s' {1..64})
digest="sha256:$(printf 'b%.0s' {1..64})"
export CUTOVER_TEST_SHA=$sha CUTOVER_TEST_SNAPSHOT=$snapshot CUTOVER_TEST_DIGEST=$digest

# The production image contains only runtime dependencies. Neither migration path may cause
# uv to sync the default development group in a network-isolated cutover or during deploy.
for migration_source in "$repo_dir/scripts/lib/account-cutover.sh" \
  "$repo_dir/infra/docker-compose.yml" "$repo_dir/infra/docker-compose.prod.yml"; do
  grep -Fq '.venv/bin/alembic upgrade head' "$migration_source"
  if grep -Fq 'uv run --frozen alembic upgrade head' "$migration_source"; then
    echo "migration would sync dependencies at runtime: $migration_source" >&2
    exit 1
  fi
done
# Check a literal shell variable in the reviewed script.
# shellcheck disable=SC2016
grep -Fq 'docker exec -i "$CUTOVER_SECOND" psql -X -qAt' \
  "$repo_dir/scripts/lib/account-cutover.sh"

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

# This is deliberately not production evidence. It sources and executes the production
# disposable phase against an entirely fake command transport and fixture-only paths.
source "$repo_dir/scripts/lib/application-db.sh"
source "$repo_dir/scripts/lib/account-cutover.sh"
db_validate_bundle() { :; }
db_restore_bundle() { printf 'restore %s %s\n' "$1" "$2" >>"$CUTOVER_TEST_LOG"; }
db_restore_practice_smoke() { printf 'smoke %s %s\n' "$1" "$2" >>"$CUTOVER_TEST_LOG"; }
fixture_work="$test_root/cutover-work"
fixture_release="$test_root/current-release"
printf '%s\n' "$sha" >"$fixture_release"
export CUTOVER_REPO_DIR=$repo_dir CUTOVER_SNAPSHOT_ID=$snapshot CUTOVER_WORK_DIR=$fixture_work
export CUTOVER_PROJECT=infraege-db-test-cutover-fixture CUTOVER_FIRST=fixture-first CUTOVER_SECOND=fixture-second
export CUTOVER_FIRST_VOLUME=fixture-first-data CUTOVER_SECOND_VOLUME=fixture-second-data
export CUTOVER_CANDIDATE_SHA=$sha CUTOVER_IMAGE="ghcr.io/avatarsik6699/infraegev2-api:$sha"
export CUTOVER_IMAGE_ID=sha256:fixture-image CUTOVER_ENV_FILE="$test_root/production.env"
export CUTOVER_CURRENT_RELEASE=$fixture_release CUTOVER_ADMIN_PASSWORD=fixture-admin
export POSTGRES_PASSWORD=fixture DB_RUNTIME_PASSWORD=fixture DB_IMPORT_PASSWORD=fixture
export DB_MIGRATION_PASSWORD=fixture DB_BACKUP_PASSWORD=fixture DB_APP_PASSWORD=fixture
CUTOVER_CREATED_FIRST=false CUTOVER_CREATED_SECOND=false
CUTOVER_CREATED_FIRST_VOLUME=false CUTOVER_CREATED_SECOND_VOLUME=false
: >"$CUTOVER_TEST_LOG"
cutover_disposable_phase
[[ -f "$fixture_work/candidate-bundle/metadata.json" ]]
grep -Fq "restore $fixture_work/source-snapshot/fixture-bundle fixture-first" "$CUTOVER_TEST_LOG"
grep -Fq "restore $fixture_work/candidate-bundle fixture-second" "$CUTOVER_TEST_LOG"
grep -Fq 'exec -i fixture-first psql' "$CUTOVER_TEST_LOG"
grep -Fq 'exec -i fixture-second psql' "$CUTOVER_TEST_LOG"
grep -Fq '.venv/bin/alembic upgrade head' "$CUTOVER_TEST_LOG"
cutover_cleanup_disposable
[[ ! -e $fixture_work ]]

# A failed second-stage assertion is not an attestation; the caller must still remove only its
# owned disposable resources. This exercises the same cleanup function used by the wrapper trap.
CUTOVER_CREATED_FIRST=false CUTOVER_CREATED_SECOND=false
CUTOVER_CREATED_FIRST_VOLUME=false CUTOVER_CREATED_SECOND_VOLUME=false
export CUTOVER_TEST_ASSERT_FAIL=true
: >"$CUTOVER_TEST_LOG"
if cutover_disposable_phase 2>/dev/null; then
  echo 'fixture assertion failure unexpectedly passed' >&2
  exit 1
fi
cutover_cleanup_disposable
[[ ! -e $fixture_work ]]
grep -Fq 'rm --force fixture-second' "$CUTOVER_TEST_LOG"
unset CUTOVER_TEST_ASSERT_FAIL

echo 'account cutover authenticated-snapshot and candidate-evidence contracts: PASS'
