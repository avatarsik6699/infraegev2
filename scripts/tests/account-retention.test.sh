#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
purge_script=$repo_dir/scripts/purge-account-artifacts.sh
service=$repo_dir/ops/systemd/infraege-account-purge.service
timer=$repo_dir/ops/systemd/infraege-account-purge.timer
installer=$repo_dir/ops/install-backup-timers.sh

bash -n "$purge_script"
grep -Fx 'OnCalendar=hourly' "$timer" >/dev/null
grep -Fx 'Persistent=true' "$timer" >/dev/null
grep -Fx 'ExecStart=/opt/infraege/current/scripts/purge-account-artifacts.sh' "$service" >/dev/null
grep -F 'exec -T api /app/.venv/bin/python -m app.modules.account.purge' "$purge_script" >/dev/null
if grep -Eq 'exec -T api python -m app.modules.account.purge' "$purge_script"; then
  echo 'account purge still uses the system Python' >&2
  exit 1
fi

# Execute the production Compose invocation with a fake Docker binary. The
# root-only guard and installed paths are exercised by the actual timer.
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
mkdir -p "$test_root/bin"
cat > "$test_root/bin/docker" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$@" > "$PURGE_DOCKER_ARGS"
FAKE
chmod +x "$test_root/bin/docker"
purge_command=$(sed -n '/^docker compose /,/^  exec -T api /p' "$purge_script")
[[ $purge_command == *'/app/.venv/bin/python -m app.modules.account.purge' ]] || exit 1
export PURGE_DOCKER_ARGS="$test_root/docker-args"
PATH="$test_root/bin:$PATH" bash -c 'release_dir=/opt/infraege/current; env_file=/etc/infraege/production.env; eval "$1"' _ "$purge_command"
grep -Fxq '/app/.venv/bin/python' "$PURGE_DOCKER_ARGS"
grep -Fxq 'app.modules.account.purge' "$PURGE_DOCKER_ARGS"
grep -F 'infraege-account-purge.service' "$installer" >/dev/null
grep -F 'infraege-account-purge.timer' "$installer" >/dev/null
grep -F 'reconcile every self-service deletion completed after that timestamp' \
  "$repo_dir/docs/runbooks/backup-restore.md" >/dev/null
grep -F 'does **not** retain a separate deletion tombstone' \
  "$repo_dir/docs/runbooks/backup-restore.md" >/dev/null

echo 'account retention operational contract: PASS'
