#!/usr/bin/env bash
set -Eeuo pipefail

[[ ${EUID:-$(id -u)} -eq 0 ]] || {
  echo 'setup-journal-gateway must run as root after WireGuard is active' >&2
  exit 1
}
: "${WIREGUARD_IP:?Set WIREGUARD_IP, for example 10.77.0.1}"
[[ $WIREGUARD_IP =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]] || {
  echo 'WIREGUARD_IP must be a plain IPv4 address' >&2
  exit 64
}
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)

install -d -m 755 /etc/systemd/system/systemd-journal-gatewayd.socket.d
sed "s/REPLACE_WIREGUARD_IP/$WIREGUARD_IP/" \
  "$repo_dir/ops/systemd/journal-gatewayd-listen.conf" > \
  /etc/systemd/system/systemd-journal-gatewayd.socket.d/listen.conf
systemctl daemon-reload
systemctl enable --now systemd-journal-gatewayd.socket
ufw allow in on wg0 to "$WIREGUARD_IP" port 19531 proto tcp

echo 'Journal gateway is available on WireGuard only.'
