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

snapshot_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
newer_snapshot_id=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
selected_snapshot_id=$(jq -nr \
  --arg older "$snapshot_id" --arg newer "$newer_snapshot_id" '
  [
    {id:$newer,time:"2026-08-20T08:00:00Z"},
    {id:$older,time:"2026-08-19T08:00:00Z"}
  ] | max_by(.time).id
')
[[ $selected_snapshot_id == "$newer_snapshot_id" ]]
printf 'snapshot\t%s\t2026-08-20T07:55:00Z\n' "$snapshot_id" \
  >"$test_root/snapshot-valid.tsv"
printf 'artifact\tumami-dump\tfile\t/var/backups/infraege/work.A1b2C3/umami.dump\n' \
  >>"$test_root/snapshot-valid.tsv"
printf 'artifact\tbeszel-data\tdirectory\t/var/backups/infraege/work.A1b2C3/beszel-data\n' \
  >>"$test_root/snapshot-valid.tsv"
candidate_json=$(INFRAEGE_OPS_SNAPSHOT_CANDIDATE_FILE="$test_root/snapshot-valid.tsv" \
  "$opsctl" snapshot-candidate --json)
jq -e --arg id "$snapshot_id" '
  .reachable == true and .eligible == true and .snapshot.id == $id and
  .production_mutated == false and .data_transferred == false and
  .authorized_to_restore == false and .authorized_to_cutover == false and
  ([.artifacts[].id] | sort) == ["beszel-data","umami-dump"]
' <<<"$candidate_json" >/dev/null
printf '%s\n' "$candidate_json" >"$test_root/snapshot-valid.json"
"$opsctl" validate snapshot-candidate "$test_root/snapshot-valid.json"

for case_name in missing duplicate unsafe malformed; do
  case "$case_name" in
    missing)
      sed '/beszel-data/d' "$test_root/snapshot-valid.tsv" >"$test_root/$case_name.tsv"
      ;;
    duplicate)
      sed -n '1,2p' "$test_root/snapshot-valid.tsv" >"$test_root/$case_name.tsv"
      sed -n '2p' "$test_root/snapshot-valid.tsv" >>"$test_root/$case_name.tsv"
      sed -n '3p' "$test_root/snapshot-valid.tsv" >>"$test_root/$case_name.tsv"
      ;;
    unsafe)
      sed 's#/var/backups/infraege/work.A1b2C3/umami.dump#/etc/passwd#' \
        "$test_root/snapshot-valid.tsv" >"$test_root/$case_name.tsv"
      ;;
    malformed)
      printf 'unexpected\tdata\n' >"$test_root/$case_name.tsv"
      ;;
  esac
  if INFRAEGE_OPS_SNAPSHOT_CANDIDATE_FILE="$test_root/$case_name.tsv" \
    "$opsctl" snapshot-candidate --json >"$test_root/$case_name.json"; then
    echo "opsctl accepted $case_name snapshot candidate" >&2
    exit 1
  fi
  jq -e '
    .reachable == true and .eligible == false and .snapshot == null and .artifacts == [] and
    .error.code == "invalid_response" and .production_mutated == false and
    .data_transferred == false and .authorized_to_restore == false and
    .authorized_to_cutover == false
  ' "$test_root/$case_name.json" >/dev/null
done

if INFRAEGE_PRODUCTION_DIR="$test_root/missing" "$opsctl" snapshot-candidate --json \
  >"$test_root/snapshot-unreachable.json" 2>"$test_root/snapshot-unreachable.err"; then
  echo 'opsctl accepted unreachable snapshot candidate transport' >&2
  exit 1
fi
jq -e '
  .reachable == false and .eligible == false and .error.code == "ssh_unreachable" and
  .production_mutated == false and .data_transferred == false
' "$test_root/snapshot-unreachable.json" >/dev/null

for file in "$opsctl" "$repo_dir/ops/observability/remote-inventory.sh" \
  "$repo_dir/ops/observability/remote-snapshot-candidate.sh" "$0"; do
  bash -n "$file"
done

if rg -n '\b(docker (compose )?(up|down|restart|rm)|systemctl (start|stop|restart|enable|disable)|rm |mv |cp )' \
  "$repo_dir/ops/observability/remote-inventory.sh"; then
  echo 'remote inventory collector contains a mutating command' >&2
  exit 1
fi

if rg -n '\b(restic (backup|restore|dump|forget|prune|init|copy|mount)|docker |systemctl |rm |mv |cp |install |chmod |chown )' \
  "$repo_dir/ops/observability/remote-snapshot-candidate.sh"; then
  echo 'remote snapshot candidate collector contains a mutating or content-reading command' >&2
  exit 1
fi

echo 'opsctl contract and read-only planning tests: PASS'
