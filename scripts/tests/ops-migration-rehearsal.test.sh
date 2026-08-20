#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
export INFRAEGE_OPS_NOW=2026-08-20T12:00:00Z
external_log="$test_root/external.log"
mkdir "$test_root/bin"
for command_name in docker ssh restic; do
  printf '#!/usr/bin/env bash\nprintf "%%s\\n" "$0" >>"$EXTERNAL_LOG"\nexit 99\n' \
    >"$test_root/bin/$command_name"
  chmod +x "$test_root/bin/$command_name"
done
export EXTERNAL_LOG="$external_log"
export PATH="$test_root/bin:$PATH"

bundle="$test_root/bundle.json"
preflight="$test_root/preflight.json"
source_manifest="$test_root/migration-source.json"
sandbox="$test_root/rehearsal"
python3 "$repo_dir/ops/observability/build-bundle.py" --output "$bundle" >/dev/null
bundle_id=$(jq -r .bundle_id "$bundle")
INFRAEGE_OPS_PREFLIGHT_FILE="$repo_dir/ops/observability/fixtures/preflight-healthy.tsv" \
  "$repo_dir/ops/opsctl" preflight --bundle-manifest "$bundle" --json >"$preflight"
mkdir "$test_root/migration"
cp "$repo_dir/ops/observability/fixtures/migration/"* "$test_root/migration/"
jq --arg bundle_id "$bundle_id" '.bundle_id = $bundle_id' \
  "$repo_dir/ops/observability/fixtures/migration-source.json" >"$source_manifest"
"$repo_dir/ops/opsctl" validate migration-source "$source_manifest"

run_rehearsal() {
  "$repo_dir/ops/opsctl" rehearse-migration \
    --bundle-manifest "$bundle" \
    --preflight-report "$preflight" \
    --source-manifest "$source_manifest" \
    --sandbox-root "$sandbox" --json
}

source_before=$(sha256sum "$test_root/migration/"*)
first=$(run_rehearsal)
second=$(run_rehearsal)
[[ $first == "$second" ]]
jq -e '
  .status == "rehearsed" and .production_mutated == false and
  .authorized_to_cutover == false and .rolled_back == true and
  .source_owner == .final_owner and
  [.phases[].id] == ["checkpoint","stage","verify","modeled-cutover","rollback"]
' <<<"$first" >/dev/null
"$repo_dir/ops/opsctl" validate migration-rehearsal <(printf '%s\n' "$first")
[[ ! -e $sandbox/staged-next-owner ]]
jq -e '.owner == "infraege application Compose"' "$sandbox/migration-state.json" >/dev/null
[[ $source_before == "$(sha256sum "$test_root/migration/"*)" ]]

jq '.artifacts[0].sha256 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"' \
  "$source_manifest" >"$test_root/stale-source.json"
if "$repo_dir/ops/opsctl" rehearse-migration --bundle-manifest "$bundle" \
  --preflight-report "$preflight" --source-manifest "$test_root/stale-source.json" \
  --sandbox-root "$test_root/stale" >/dev/null 2>&1; then
  echo 'rehearsal accepted stale source hash' >&2; exit 1
fi

jq '.ready_for_migration_planning = false | .summary.blocker = 1' "$preflight" \
  >"$test_root/blocked-preflight.json"
if "$repo_dir/ops/opsctl" rehearse-migration --bundle-manifest "$bundle" \
  --preflight-report "$test_root/blocked-preflight.json" --source-manifest "$source_manifest" \
  --sandbox-root "$test_root/blocked" >/dev/null 2>&1; then
  echo 'rehearsal accepted blocked preflight' >&2; exit 1
fi

jq '.bundle_id = "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"' \
  "$preflight" >"$test_root/stale-preflight.json"
if "$repo_dir/ops/opsctl" rehearse-migration --bundle-manifest "$bundle" \
  --preflight-report "$test_root/stale-preflight.json" --source-manifest "$source_manifest" \
  --sandbox-root "$test_root/stale-preflight" >/dev/null 2>&1; then
  echo 'rehearsal accepted stale preflight binding' >&2; exit 1
fi

jq '.assets[0].sha256 = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"' \
  "$bundle" >"$test_root/stale-bundle-unbound.json"
stale_identity=$(jq -cS '{schema_version,installation_id,compose_project,assets}' \
  "$test_root/stale-bundle-unbound.json")
stale_bundle_id=$(printf '%s' "$stale_identity" | sha256sum | cut -d' ' -f1)
jq --arg bundle_id "$stale_bundle_id" '.bundle_id = $bundle_id' \
  "$test_root/stale-bundle-unbound.json" >"$test_root/stale-bundle.json"
if "$repo_dir/ops/opsctl" rehearse-migration --bundle-manifest "$test_root/stale-bundle.json" \
  --preflight-report "$preflight" --source-manifest "$source_manifest" \
  --sandbox-root "$test_root/stale-bundle" >/dev/null 2>"$test_root/stale-bundle.err"; then
  echo 'rehearsal accepted stale bundle identity' >&2; exit 1
fi
grep -Fq 'bundle manifest asset hash does not match this checkout' "$test_root/stale-bundle.err"

mkdir "$test_root/unmarked"
touch "$test_root/unmarked/valuable"
if "$repo_dir/ops/opsctl" rehearse-migration --bundle-manifest "$bundle" \
  --preflight-report "$preflight" --source-manifest "$source_manifest" \
  --sandbox-root "$test_root/unmarked" >/dev/null 2>&1; then
  echo 'rehearsal accepted unmarked non-empty sandbox' >&2; exit 1
fi
[[ -f $test_root/unmarked/valuable ]]

exec 9>"$sandbox/migration.lock"
flock --nonblock 9
if run_rehearsal >/dev/null 2>&1; then
  echo 'rehearsal ignored lock contention' >&2; exit 1
fi
flock --unlock 9
exec 9>&-

if INFRAEGE_OPS_TEST_REHEARSAL_FAIL_AFTER=cutover run_rehearsal >/dev/null 2>&1; then
  echo 'injected rehearsal failure returned success' >&2; exit 1
fi
jq -e '.status == "failed" and .failure_code == "injected_failure" and .rolled_back == true and .source_owner == .final_owner' \
  "$sandbox/migration-rehearsal.json" >/dev/null
[[ ! -e $sandbox/staged-next-owner ]]
jq -e '.owner == "infraege application Compose"' "$sandbox/migration-state.json" >/dev/null
[[ $source_before == "$(sha256sum "$test_root/migration/"*)" ]]

if make --no-print-directory -C "$repo_dir" ops-rehearse-migration >/dev/null 2>&1; then
  echo 'Make target accepted missing rehearsal inputs' >&2; exit 1
fi
make --no-print-directory -C "$repo_dir" ops-rehearse-migration \
  BUNDLE="$bundle" PREFLIGHT="$preflight" SOURCE="$source_manifest" \
  SANDBOX_ROOT="$test_root/make-rehearsal" >"$test_root/make-output"
grep -Fq 'production mutated: no' "$test_root/make-output"
grep -Fq 'authorized to cutover: no' "$test_root/make-output"
[[ ! -s $external_log ]]

echo 'disposable migration rehearsal tests: PASS'
