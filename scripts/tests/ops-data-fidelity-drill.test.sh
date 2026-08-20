#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
drill="$repo_dir/scripts/ops-data-fidelity-drill.sh"

assert_no_drill_resources() {
  [[ -z $(docker ps --all --quiet --filter label=com.infraege.ops.drill=true) ]]
  [[ -z $(docker volume ls --quiet --filter label=com.infraege.ops.drill=true) ]]
  [[ -z $(find "${TMPDIR:-/tmp}" -maxdepth 1 -type d -name 'infraege-data-fidelity.*' -print -quit) ]]
}

assert_no_drill_resources
if "$drill" --unsupported >/dev/null 2>&1; then
  echo 'data fidelity drill accepted an unknown argument' >&2
  exit 1
fi
assert_no_drill_resources
result=$("$drill" --json)
"$repo_dir/ops/opsctl" validate data-fidelity-result <(printf '%s\n' "$result")
jq -e '
  .schema_version == 1 and .status == "passed" and
  .production_data_used == false and .authorized_to_cutover == false and
  .postgres == {"event_total":10,"ownership_preserved":true,"row_count":3,"sequence_preserved":true,"status":"passed"} and
  .beszel == {"identity_preserved":true,"source_healthy":true,"state_files_present":true,"status":"passed","target_healthy":true} and
  .cleanup == {"containers_removed":true,"volumes_removed":true,"workspace_removed":true}
' <<<"$result" >/dev/null
while IFS= read -r image; do
  grep -Fq "image: $image" "$repo_dir/ops/observability/compose.yml"
done < <(jq -r '.images[]' <<<"$result")
assert_no_drill_resources

exec 9>"${TMPDIR:-/tmp}/infraege-data-fidelity.lock"
flock --nonblock 9
if "$drill" --json >/dev/null 2>&1; then
  echo 'data fidelity drill ignored lock contention' >&2
  exit 1
fi
flock --unlock 9
exec 9>&-
assert_no_drill_resources

if INFRAEGE_OPS_TEST_FIDELITY_FAIL_AFTER=postgres "$drill" --json >/dev/null 2>&1; then
  echo 'data fidelity drill accepted injected failure' >&2
  exit 1
fi
assert_no_drill_resources

if INFRAEGE_OPS_TEST_FIDELITY_FAIL_AFTER=beszel-target "$drill" --json >/dev/null 2>&1; then
  echo 'data fidelity drill accepted late injected failure' >&2
  exit 1
fi
assert_no_drill_resources

grep -Fq -- '--pull=never' "$drill"
grep -Fq -- '--publish 127.0.0.1::8090' "$drill"
! rg -n '/var/backups/infraege|/etc/infraege|production-root-ssh|restic (restore|backup)' "$drill"
make --no-print-directory -C "$repo_dir" --dry-run ops-data-fidelity-drill | \
  grep -Fq './scripts/ops-data-fidelity-drill.sh'

bash -n "$drill" "$0"
echo 'disposable data fidelity drill tests: PASS'
