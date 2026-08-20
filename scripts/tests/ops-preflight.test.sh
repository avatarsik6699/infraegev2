#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
export INFRAEGE_OPS_NOW=2026-08-20T10:00:00Z
python3 "$repo_dir/ops/observability/build-bundle.py" --output "$test_root/bundle.json" >/dev/null

healthy=$(INFRAEGE_OPS_PREFLIGHT_FILE="$repo_dir/ops/observability/fixtures/preflight-healthy.tsv" \
  "$repo_dir/ops/opsctl" preflight --bundle-manifest "$test_root/bundle.json" --json)
jq -e '.ready_for_migration_planning == true and .authorized_to_apply == false and .summary == {"blocker":0,"pass":11,"warning":0}' <<<"$healthy" >/dev/null
"$repo_dir/ops/opsctl" validate preflight <(printf '%s\n' "$healthy")

if INFRAEGE_OPS_PREFLIGHT_FILE="$repo_dir/ops/observability/fixtures/preflight-blocked.tsv" \
  "$repo_dir/ops/opsctl" preflight --bundle-manifest "$test_root/bundle.json" --json >"$test_root/blocked.json"; then
  echo 'blocked preflight returned success' >&2; exit 1
fi
jq -e '.ready_for_migration_planning == false and .summary.blocker == 5 and .summary.warning == 1' "$test_root/blocked.json" >/dev/null

printf 'unknown\tpass\tavailable\n' >"$test_root/malformed.tsv"
if INFRAEGE_OPS_PREFLIGHT_FILE="$test_root/malformed.tsv" "$repo_dir/ops/opsctl" preflight --bundle-manifest "$test_root/bundle.json" --json >/dev/null 2>&1; then
  echo 'malformed fixture returned success' >&2; exit 1
fi

jq '.password = "synthetic"' "$test_root/bundle.json" >"$test_root/secret.json"
if INFRAEGE_OPS_PREFLIGHT_FILE="$repo_dir/ops/observability/fixtures/preflight-healthy.tsv" \
  "$repo_dir/ops/opsctl" preflight --bundle-manifest "$test_root/secret.json" --json >/dev/null 2>&1; then
  echo 'secret-bearing bundle returned success' >&2; exit 1
fi

if INFRAEGE_PRODUCTION_DIR="$test_root/missing" "$repo_dir/ops/opsctl" preflight \
  --bundle-manifest "$test_root/bundle.json" --json >"$test_root/unreachable.json" 2>/dev/null; then
  echo 'unreachable preflight returned success' >&2; exit 1
fi
jq -e '.reachable == false and .authorized_to_apply == false and .checks[0].code == "ssh-unreachable"' "$test_root/unreachable.json" >/dev/null

bash -n "$repo_dir/ops/observability/remote-preflight.sh"
if rg -n '\b(docker (compose )?(up|down|restart|rm|create|pull)|systemctl (start|stop|restart|enable|disable)|rm |mv |cp |install )' "$repo_dir/ops/observability/remote-preflight.sh"; then
  echo 'remote preflight collector contains a mutating command' >&2; exit 1
fi

echo 'read-only remote preflight tests: PASS'
