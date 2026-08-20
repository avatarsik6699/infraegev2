#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "Run as root after /opt/infraege/current exists." >&2
  exit 1
fi

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
mode=${1:-application}
[[ $mode == application || $mode == activate-operations ]] || {
  echo 'usage: ops/install-backup-timers.sh [application|activate-operations]' >&2
  exit 64
}

install -m 644 "$repo_dir/ops/systemd/infraege-backup.service" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-backup.timer" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-restore-check.service" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-restore-check.timer" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now infraege-backup.timer infraege-restore-check.timer

if [[ $mode == activate-operations ]]; then
  [[ -L /opt/infraege-ops/current ]] || {
    echo 'activate-operations requires an installed infraege-ops release' >&2
    exit 1
  }
  for unit in \
    infraege-ops-backup.service infraege-ops-backup.timer \
    infraege-ops-restore-check.service infraege-ops-restore-check.timer \
    infraege-ops-analytics-retention.service infraege-ops-analytics-retention.timer; do
    install -m 644 "$repo_dir/ops/systemd/$unit" /etc/systemd/system/
  done
  systemctl disable --now infraege-analytics-retention.timer >/dev/null 2>&1 || true
  rm -f /etc/systemd/system/infraege-analytics-retention.service \
    /etc/systemd/system/infraege-analytics-retention.timer
  systemctl daemon-reload
  systemctl enable --now infraege-ops-backup.timer infraege-ops-restore-check.timer \
    infraege-ops-analytics-retention.timer
fi
