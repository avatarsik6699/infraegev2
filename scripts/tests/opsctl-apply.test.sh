#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
opsctl="$repo_dir/ops/opsctl"
healthy="$repo_dir/ops/observability/fixtures/inventory-healthy.json"
test_root=$(mktemp -d)
trap 'jobs -p | xargs -r kill 2>/dev/null || true; rm -rf -- "$test_root"' EXIT
export INFRAEGE_OPS_NOW=2026-08-20T09:00:00Z

inventory="$test_root/inventory.json"
jq '(.components[] | select(.id == "beszel") | .state) = "exited"' "$healthy" >"$inventory"
plan="$test_root/plan.json"
INFRAEGE_OPS_INVENTORY_FILE="$inventory" "$opsctl" plan --json >"$plan"
jq -e '
  (.plan_id | test("^[a-f0-9]{64}$")) and
  .summary.change == 1 and
  .summary.destructive == 0 and
  .mutating == false
' "$plan" >/dev/null
"$opsctl" validate plan "$plan"

fake_bin="$test_root/bin"
ssh_log="$test_root/ssh.log"
mkdir -p "$fake_bin"
cat >"$fake_bin/ssh" <<'EOF'
#!/usr/bin/env bash
printf 'unexpected ssh call\n' >>"$SSH_LOG"
exit 99
EOF
chmod +x "$fake_bin/ssh"

sandbox="$test_root/sandbox"
result=$(PATH="$fake_bin:$PATH" SSH_LOG="$ssh_log" \
  "$opsctl" apply --plan-file "$plan" --inventory-file "$inventory" \
  --sandbox-root "$sandbox" --json)
[[ ! -e $ssh_log ]]
jq -e '.status == "applied" and .effects_applied == 1 and .rolled_back == false' \
  <<<"$result" >/dev/null
plan_id=$(jq -r .plan_id "$plan")
jq -e --arg plan_id "$plan_id" \
  '.plan_id == $plan_id and .status == "applied"' "$sandbox/revision.json" >/dev/null
jq -e \
  '.components[] | select(.id == "beszel") | .state == "running"' \
  "$sandbox/components.json" >/dev/null
jq -e --arg plan_id "$plan_id" \
  '.plan_id == $plan_id and (.components | length) == 10' \
  "$sandbox/checkpoints/$plan_id.json" >/dev/null
jq -e '.event_type == "ops.apply.applied" and .payload.rolled_back == false' \
  "$sandbox/outbox/$plan_id-applied.json" >/dev/null

make -s -C "$repo_dir" ops-apply-sandbox PLAN="$plan" INVENTORY="$inventory" \
  SANDBOX_ROOT="$test_root/make-sandbox" >"$test_root/make.out"
grep -Fq 'status: applied' "$test_root/make.out"

replay=$("$opsctl" apply --plan-file "$plan" --inventory-file "$inventory" \
  --sandbox-root "$sandbox" --json)
jq -e '.status == "no-op" and .effects_applied == 0' <<<"$replay" >/dev/null

stale_inventory="$test_root/stale-inventory.json"
jq '(.components[] | select(.id == "beszel") | .state) = "running"' "$inventory" \
  >"$stale_inventory"
if "$opsctl" apply --plan-file "$plan" --inventory-file "$stale_inventory" \
  --sandbox-root "$test_root/stale" >"$test_root/stale.out" 2>"$test_root/stale.err"; then
  echo 'opsctl apply accepted a stale plan' >&2
  exit 1
fi
grep -Fq 'stale_plan' "$test_root/stale.err"

modified_plan="$test_root/modified-plan.json"
jq '.changes[0].reason = "modified_after_review"' "$plan" >"$modified_plan"
if "$opsctl" apply --plan-file "$modified_plan" --inventory-file "$inventory" \
  --sandbox-root "$test_root/modified" >"$test_root/modified.out" \
  2>"$test_root/modified.err"; then
  echo 'opsctl apply accepted a modified saved plan' >&2
  exit 1
fi
grep -Fq 'stale_plan' "$test_root/modified.err"

destructive_plan="$test_root/destructive-plan.json"
drifted="$repo_dir/ops/observability/fixtures/inventory-drifted.json"
INFRAEGE_OPS_INVENTORY_FILE="$drifted" "$opsctl" plan --json >"$destructive_plan"
if "$opsctl" apply --plan-file "$destructive_plan" --inventory-file "$drifted" \
  --sandbox-root "$test_root/destructive" >"$test_root/destructive.out" \
  2>"$test_root/destructive.err"; then
  echo 'opsctl apply accepted a destructive plan without approval' >&2
  exit 1
fi
grep -Fq 'destructive_plan' "$test_root/destructive.err"

blocked_inventory="$test_root/blocked-inventory.json"
jq '.reachable = false | .components = [] | .error = {"code":"ssh_unreachable","message":"production inventory is unavailable"}' \
  "$healthy" >"$blocked_inventory"
blocked_plan="$test_root/blocked-plan.json"
if INFRAEGE_OPS_INVENTORY_FILE="$blocked_inventory" "$opsctl" plan --json >"$blocked_plan"; then
  echo 'opsctl plan did not preserve unreachable status' >&2
  exit 1
fi
if "$opsctl" apply --plan-file "$blocked_plan" --inventory-file "$blocked_inventory" \
  --sandbox-root "$test_root/blocked" >"$test_root/blocked.out" 2>"$test_root/blocked.err"; then
  echo 'opsctl apply accepted a blocked plan' >&2
  exit 1
fi
grep -Fq 'blocked_plan' "$test_root/blocked.err"

rollback_root="$test_root/rollback"
mkdir -p "$rollback_root"
printf 'infraege-ops-sandbox-v1\n' >"$rollback_root/.infraege-ops-sandbox"
jq '{schema_version: 1, components: .components}' "$inventory" >"$rollback_root/components.json"
before=$(sha256sum "$rollback_root/components.json")
if INFRAEGE_OPS_TEST_FAIL_AFTER=1 SYNTHETIC_PASSWORD=must-not-leak \
  "$opsctl" apply --plan-file "$plan" --inventory-file "$inventory" \
  --sandbox-root "$rollback_root" >"$test_root/failure.out" 2>"$test_root/failure.err"; then
  echo 'opsctl apply did not fail at the injected partial effect' >&2
  exit 1
fi
after=$(sha256sum "$rollback_root/components.json")
[[ $before == "$after" ]]
grep -Fq 'effect_failed' "$test_root/failure.err"
! grep -Fq 'must-not-leak' "$test_root/failure.err"
jq -e '.event_type == "ops.apply.failed" and .payload.rolled_back == true' \
  "$rollback_root/outbox/$plan_id-failed.json" >/dev/null
[[ -f $rollback_root/checkpoints/$plan_id.json ]]
[[ ! -f $rollback_root/revision.json ]]

second_inventory="$test_root/second-inventory.json"
jq '(.components[] | select(.id == "umami") | .state) = "exited"' "$healthy" \
  >"$second_inventory"
second_plan="$test_root/second-plan.json"
INFRAEGE_OPS_INVENTORY_FILE="$second_inventory" "$opsctl" plan --json >"$second_plan"
components_before=$(sha256sum "$sandbox/components.json")
revision_before=$(sha256sum "$sandbox/revision.json")
if INFRAEGE_OPS_TEST_FAIL_AFTER=1 \
  "$opsctl" apply --plan-file "$second_plan" --inventory-file "$second_inventory" \
  --sandbox-root "$sandbox" >"$test_root/second-failure.out" \
  2>"$test_root/second-failure.err"; then
  echo 'opsctl apply did not roll back over an existing revision' >&2
  exit 1
fi
[[ $components_before == "$(sha256sum "$sandbox/components.json")" ]]
[[ $revision_before == "$(sha256sum "$sandbox/revision.json")" ]]

lock_root="$test_root/locked"
mkdir -p "$lock_root"
printf 'infraege-ops-sandbox-v1\n' >"$lock_root/.infraege-ops-sandbox"
flock "$lock_root/ops.lock" -c 'sleep 3' &
lock_pid=$!
lock_seen=0
for _ in $(seq 1 100); do
  if ! flock -n "$lock_root/ops.lock" -c true; then
    lock_seen=1
    break
  fi
  sleep 0.01
done
[[ $lock_seen == 1 ]]
if "$opsctl" apply --plan-file "$plan" --inventory-file "$inventory" \
  --sandbox-root "$lock_root" >"$test_root/lock.out" 2>"$test_root/lock.err"; then
  echo 'opsctl apply ignored lock contention' >&2
  exit 1
fi
grep -Fq 'lock_held' "$test_root/lock.err"
wait "$lock_pid"

if "$opsctl" apply --plan-file "$plan" --inventory-file "$inventory" \
  >"$test_root/no-sandbox.out" 2>"$test_root/no-sandbox.err"; then
  echo 'opsctl apply accepted invocation without an explicit sandbox root' >&2
  exit 1
fi
grep -Fq -- '--sandbox-root' "$test_root/no-sandbox.err"

unmarked_root="$test_root/unmarked"
mkdir -p "$unmarked_root"
printf 'important local data\n' >"$unmarked_root/existing.txt"
if "$opsctl" apply --plan-file "$plan" --inventory-file "$inventory" \
  --sandbox-root "$unmarked_root" >"$test_root/unmarked.out" 2>"$test_root/unmarked.err"; then
  echo 'opsctl apply accepted a non-empty directory without a sandbox marker' >&2
  exit 1
fi
grep -Fq 'invalid_sandbox_root' "$test_root/unmarked.err"
grep -Fxq 'important local data' "$unmarked_root/existing.txt"

if find "$test_root" -type f -name '.*.json.*' -print -quit | grep -q .; then
  echo 'opsctl left an atomic-write temporary file behind' >&2
  exit 1
fi

for schema in revision apply-result; do
  "$opsctl" validate "$schema" "$repo_dir/ops/observability/fixtures/$schema.json"
done

echo 'opsctl sandbox reconcile tests: PASS'
