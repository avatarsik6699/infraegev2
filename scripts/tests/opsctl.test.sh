#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
opsctl="$repo_dir/ops/opsctl"
fixtures="$repo_dir/ops/observability/fixtures"
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
export INFRAEGE_OPS_NOW=2026-08-20T08:00:00Z

"$opsctl" validate desired-state "$repo_dir/ops/observability/desired-state.json"
for schema in "$repo_dir"/ops/observability/schemas/*.schema.json; do
  jq -e '
    .["$schema"] == "https://json-schema.org/draft/2020-12/schema" and
    (.properties.schema_version.const == 1) and
    (.required | length > 0)
  ' "$schema" >/dev/null
done

healthy_json=$(INFRAEGE_OPS_INVENTORY_FILE="$fixtures/inventory-healthy.json" \
  "$opsctl" plan --json)
healthy_json_repeat=$(INFRAEGE_OPS_INVENTORY_FILE="$fixtures/inventory-healthy.json" \
  "$opsctl" plan --json)
[[ $healthy_json == "$healthy_json_repeat" ]]
jq -e '
  .schema_version == 1 and
  .mutating == false and
  .summary == {"blocked":0,"change":0,"create":0,"destructive":0,"no-op":10} and
  ([.changes[].effect] | unique) == ["no-op"]
' <<<"$healthy_json" >/dev/null

status_json=$(INFRAEGE_OPS_INVENTORY_FILE="$fixtures/inventory-healthy.json" \
  "$opsctl" status --json)
jq -e '.healthy == true and (.components | length) == 10' <<<"$status_json" >/dev/null

before=$(sha256sum "$fixtures/inventory-drifted.json")
drift_json=$(INFRAEGE_OPS_INVENTORY_FILE="$fixtures/inventory-drifted.json" \
  "$opsctl" plan --json)
after=$(sha256sum "$fixtures/inventory-drifted.json")
[[ $before == "$after" ]]
jq -e '
  .mutating == false and
  .summary.create == 1 and
  .summary.change == 1 and
  .summary.destructive == 1 and
  (.changes | any(.component_id == "beszel-agent" and .effect == "create")) and
  (.changes | any(.component_id == "beszel" and .effect == "change")) and
  (.changes | any(.component_id == "retired-exporter" and .effect == "destructive"))
' <<<"$drift_json" >/dev/null

inventory_human=$(INFRAEGE_OPS_INVENTORY_FILE="$fixtures/inventory-healthy.json" \
  "$opsctl" inventory)
grep -Fq 'inventory: infraege-production' <<<"$inventory_human"
grep -Fq 'reachable: yes' <<<"$inventory_human"

if INFRAEGE_PRODUCTION_DIR="$test_root/missing" "$opsctl" inventory --json \
  >"$test_root/unreachable.json" 2>"$test_root/unreachable.err"; then
  echo 'opsctl accepted unreachable SSH inventory' >&2
  exit 1
fi
jq -e '
  .reachable == false and
  .error == {"code":"ssh_unreachable","message":"production inventory is unavailable"} and
  .components == []
' "$test_root/unreachable.json" >/dev/null
! grep -Eqi 'password|permission denied|known_hosts.*missing:' "$test_root/unreachable.json"

for command in status plan; do
  if INFRAEGE_PRODUCTION_DIR="$test_root/missing" "$opsctl" "$command" --json \
    >"$test_root/unreachable-$command.json" 2>"$test_root/unreachable-$command.err"; then
    echo "opsctl $command accepted unreachable SSH inventory" >&2
    exit 1
  fi
done
jq -e '.healthy == false and .summary.blocked == 1' "$test_root/unreachable-status.json" >/dev/null
jq -e '.mutating == false and .summary.blocked == 1' "$test_root/unreachable-plan.json" >/dev/null

jq '.schema_version = 2' "$fixtures/inventory-healthy.json" >"$test_root/unknown-version.json"
if "$opsctl" validate inventory "$test_root/unknown-version.json" >/dev/null 2>&1; then
  echo 'opsctl accepted an unknown schema version' >&2
  exit 1
fi

jq '.password = "synthetic-sensitive-value"' "$fixtures/inventory-healthy.json" \
  >"$test_root/secret-bearing.json"
if "$opsctl" validate inventory "$test_root/secret-bearing.json" >/dev/null 2>&1; then
  echo 'opsctl accepted a secret-bearing field' >&2
  exit 1
fi

cat >"$test_root/checkpoint.json" <<'EOF'
{"schema_version":1,"installation_id":"infraege-production","revision":"abc123","created_at":"2026-08-20T08:00:00Z","components":[]}
EOF
cat >"$test_root/outbox.json" <<'EOF'
{"schema_version":1,"installation_id":"infraege-production","event_id":"evt-1","created_at":"2026-08-20T08:00:00Z","event_type":"ops.plan.completed","payload":{"result":"no-op"}}
EOF
"$opsctl" validate checkpoint "$test_root/checkpoint.json"
"$opsctl" validate outbox "$test_root/outbox.json"

for file in "$opsctl" "$repo_dir/ops/observability/remote-inventory.sh" "$0"; do
  bash -n "$file"
done

if rg -n '\b(docker (compose )?(up|down|restart|rm)|systemctl (start|stop|restart|enable|disable)|rm |mv |cp )' \
  "$repo_dir/ops/observability/remote-inventory.sh"; then
  echo 'remote inventory collector contains a mutating command' >&2
  exit 1
fi

echo 'opsctl contract and read-only planning tests: PASS'
