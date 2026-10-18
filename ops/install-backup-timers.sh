#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "Run as root after /opt/infraege/current exists." >&2
  exit 1
fi

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
[[ -L /opt/infraege/database-current &&
   -r /opt/infraege/database-current/scripts/lib/application-db.sh ]] || {
  echo 'application timers require the verified database-current maintenance release' >&2
  exit 1
}

install -m 644 "$repo_dir/ops/systemd/infraege-backup.service" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-backup.timer" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-restore-check.service" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-restore-check.timer" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-account-purge.service" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-account-purge.timer" /etc/systemd/system/
# Change 192: billing upkeep; a no-op until BILLING_ENABLED is on
for unit in infraege-billing-hourly infraege-billing-daily; do
  install -m 644 "$repo_dir/ops/systemd/$unit.service" /etc/systemd/system/
  install -m 644 "$repo_dir/ops/systemd/$unit.timer" /etc/systemd/system/
done
systemctl daemon-reload
systemctl enable --now infraege-backup.timer infraege-restore-check.timer infraege-account-purge.timer \
  infraege-billing-hourly.timer infraege-billing-daily.timer
