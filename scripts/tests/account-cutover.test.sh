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
[[ $1 == cat && $2 == snapshot && $3 == "$CUTOVER_TEST_SNAPSHOT" ]] || exit 97
printf '{"time":"%s","tags":["infraege-application"],"summary":{"total_bytes_processed":1}}\n' \
  "$(date -u +%FT%TZ)"
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
[[ $(sed -n '2p' "$CUTOVER_TEST_LOG") == "image inspect ghcr.io/avatarsik6699/infraegev2-api:$sha --format {{json .RepoDigests}}" ]]
[[ $(wc -l <"$CUTOVER_TEST_LOG") -eq 2 ]]

# A missing tag, wrong source SHA, or non-matching immutable image digest fails before any run.
export CUTOVER_REQUIRE_NO_CALLS=false
sed -i 's/infraege-application/not-application/' "$test_root/bin/restic"
reject --validate "$snapshot" "$sha" "$digest"
[[ $(<"$CUTOVER_TEST_LOG") == "cat snapshot $snapshot" ]]
sed -i 's/not-application/infraege-application/' "$test_root/bin/restic"
export CUTOVER_TEST_SHA=dddddddddddddddddddddddddddddddddddddddd
reject --validate "$snapshot" "$sha" "$digest"
[[ $(<"$CUTOVER_TEST_LOG") == "cat snapshot $snapshot" ]]
wrong_digest="sha256:$(printf 'e%.0s' {1..64})"
export CUTOVER_TEST_SHA=$sha CUTOVER_TEST_DIGEST=$wrong_digest
reject --validate "$snapshot" "$sha" "$digest"
[[ $(wc -l <"$CUTOVER_TEST_LOG") -eq 2 ]]

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
  [[ $(wc -l <"$CUTOVER_TEST_LOG") -eq 2 ]]
fi

echo 'account cutover authenticated-snapshot and candidate-evidence contracts: PASS'
