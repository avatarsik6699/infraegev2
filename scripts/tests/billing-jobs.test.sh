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
mkdir -p "$test_root/bin"
cat > "$test_root/bin/docker" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$@" > "$BILLING_DOCKER_ARGS"
FAKE
chmod +x "$test_root/bin/docker"
command=$(sed -n '/^docker compose /,/^  exec -T api /p' "$script")
export BILLING_DOCKER_ARGS="$test_root/docker-args"
PATH="$test_root/bin:$PATH" bash -c \
  'release_dir=/opt/infraege/current; env_file=/etc/infraege/production.env; kind=daily; eval "$1"' \
  _ "$command"
grep -Fxq '/app/.venv/bin/python' "$BILLING_DOCKER_ARGS"
grep -Fxq 'app.modules.billing.jobs' "$BILLING_DOCKER_ARGS"
grep -Fxq 'daily' "$BILLING_DOCKER_ARGS"
if bash "$script" weekly 2>/dev/null; then
  echo 'billing-jobs accepted an unknown kind' >&2
  exit 1
fi
echo 'billing jobs operational contract: PASS'
