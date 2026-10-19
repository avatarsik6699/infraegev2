#!/usr/bin/env bash
# Change 192: billing timers call the API container's job module through Compose.
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
script=$repo_dir/scripts/billing-jobs.sh
installer=$repo_dir/ops/install-backup-timers.sh

bash -n "$script"
for kind in hourly daily; do
  grep -Fx "ExecStart=/opt/infraege/current/scripts/billing-jobs.sh $kind" \
    "$repo_dir/ops/systemd/infraege-billing-$kind.service" >/dev/null
  grep -Fx 'Persistent=true' "$repo_dir/ops/systemd/infraege-billing-$kind.timer" >/dev/null
done
grep -Fx 'OnCalendar=hourly' "$repo_dir/ops/systemd/infraege-billing-hourly.timer" >/dev/null
grep -F 'infraege-billing-hourly infraege-billing-daily' "$installer" >/dev/null
grep -F 'infraege-billing-daily.timer' "$installer" >/dev/null

test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
mkdir -p "$test_root/bin" "$test_root/business"
cat > "$test_root/bin/docker" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$BILLING_DOCKER_ARGS"
case "$*" in
  *"app.modules.billing.admin export"*)
    printf '{"schema":"kodumka.business/1","funnel":[]}\n' ;;
  *"app.modules.billing.jobs daily"*)
    printf '{"event":"billing.jobs_done","kind":"daily"}\n'
    printf '{"event":"billing.reconcile_done","checked":3,"mismatches":1,"timestamp":"2026-10-19T03:00:00Z"}\n' ;;
esac
FAKE
chmod +x "$test_root/bin/docker"
# Everything after the root/release checks, run against a fake Compose and a temporary directory.
body=$(sed -n '/^api() {/,$p' "$script")
run_kind() {
  PATH="$test_root/bin:$PATH" BUSINESS_DIR="$test_root/business" bash -c \
    'set -euo pipefail; release_dir=/opt/infraege/current; env_file=/etc/infraege/production.env; kind=$1; eval "$2"' \
    _ "$1" "$body"
}
export BILLING_DOCKER_ARGS="$test_root/docker-args"
run_kind daily >/dev/null
grep -Fq 'exec -T api /app/.venv/bin/python -m app.modules.billing.jobs daily' "$BILLING_DOCKER_ARGS"
jq -e '. == {checked_at: "2026-10-19T03:00:00Z", checked: 3, mismatches: 1}' \
  "$test_root/business/reconcile.json" >/dev/null
run_kind hourly
grep -Fq 'app.modules.billing.jobs hourly' "$BILLING_DOCKER_ARGS"
# Change 195: the summary carries the last reconciliation and is not world-readable.
jq -e '.schema == "kodumka.business/1" and .reconcile.mismatches == 1' \
  "$test_root/business/summary.json" >/dev/null
[[ $(stat -c '%a' "$test_root/business/summary.json") == 640 ]]
[[ ! -e $test_root/business/summary.json.tmp ]]
if bash "$script" weekly 2>/dev/null; then
  echo 'billing-jobs accepted an unknown kind' >&2
  exit 1
fi
echo 'billing jobs operational contract and business summary: PASS'
