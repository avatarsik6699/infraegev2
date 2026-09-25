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
systemctl daemon-reload
systemctl enable --now infraege-backup.timer infraege-restore-check.timer infraege-account-purge.timer
