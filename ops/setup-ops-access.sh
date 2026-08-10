#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root after WireGuard is active." >&2
  exit 1
fi

: "${OPS_READER_SSH_PUBLIC_KEY:?Set OPS_READER_SSH_PUBLIC_KEY}"
: "${WIREGUARD_IP:?Set WIREGUARD_IP, for example 10.77.0.1}"
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
ops_user=ops-reader

if ! id "$ops_user" >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash "$ops_user"
fi
usermod -aG systemd-journal "$ops_user"
install -m 755 "$repo_dir/ops/bin/infraege-ops-query" /usr/local/bin/infraege-ops-query

install -d -m 700 -o "$ops_user" -g "$ops_user" "/home/$ops_user/.ssh"
printf 'restrict,command="/usr/local/bin/infraege-ops-query" %s\n' \
  "$OPS_READER_SSH_PUBLIC_KEY" | install -m 600 -o "$ops_user" -g "$ops_user" \
  /dev/stdin "/home/$ops_user/.ssh/authorized_keys"

install -m 440 "$repo_dir/ops/sudoers/infraege-ops-reader" \
  /etc/sudoers.d/infraege-ops-reader
visudo -cf /etc/sudoers.d/infraege-ops-reader

install -d -m 755 /etc/systemd/system/systemd-journal-gatewayd.socket.d
sed "s/REPLACE_WIREGUARD_IP/$WIREGUARD_IP/" \
  "$repo_dir/ops/systemd/journal-gatewayd-listen.conf" > \
  /etc/systemd/system/systemd-journal-gatewayd.socket.d/listen.conf
systemctl daemon-reload
systemctl enable --now systemd-journal-gatewayd.socket

ufw allow in on wg0 to "$WIREGUARD_IP" port 19531 proto tcp
echo "Read-only operations access is available on WireGuard only."
