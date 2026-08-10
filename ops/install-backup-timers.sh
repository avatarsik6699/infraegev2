#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root after /opt/infraege/current exists." >&2
  exit 1
fi

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
install -m 644 "$repo_dir/ops/systemd/infraege-backup.service" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-backup.timer" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-restore-check.service" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-restore-check.timer" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-analytics-retention.service" /etc/systemd/system/
install -m 644 "$repo_dir/ops/systemd/infraege-analytics-retention.timer" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now \
  infraege-backup.timer infraege-restore-check.timer infraege-analytics-retention.timer
