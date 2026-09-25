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
grep -F 'exec -T api python -m app.modules.account.purge' "$purge_script" >/dev/null
grep -F 'infraege-account-purge.service' "$installer" >/dev/null
grep -F 'infraege-account-purge.timer' "$installer" >/dev/null
grep -F 'reconcile every self-service deletion completed after that timestamp' \
  "$repo_dir/docs/runbooks/backup-restore.md" >/dev/null
grep -F 'does **not** retain a separate deletion tombstone' \
  "$repo_dir/docs/runbooks/backup-restore.md" >/dev/null

echo 'account retention operational contract: PASS'
