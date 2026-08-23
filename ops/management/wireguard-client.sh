#!/usr/bin/env bash
set -Eeuo pipefail

action=${1:-}
config=/etc/wireguard/wg0.conf
private_key=/etc/wireguard/infraege-management.key

case $action in
  prepare)
    IFS= read -r server_public_key
    IFS= read -r endpoint
    [[ $server_public_key =~ ^[A-Za-z0-9+/]{43}=$ ]]
    [[ $endpoint =~ ^[A-Za-z0-9.-]+:[0-9]+$ ]]
    if ! command -v wg >/dev/null || ! command -v wg-quick >/dev/null; then
      apt-get update
      DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends wireguard-tools
    fi
    install -d -m 700 /etc/wireguard
    if [[ ! -f $private_key ]]; then
      umask 077
      wg genkey > "$private_key"
    fi
    [[ $(stat -c '%a' "$private_key") == 600 ]]
    client_public_key=$(wg pubkey < "$private_key")
    candidate=$(mktemp)
    trap 'rm -f -- "$candidate"' EXIT
    cat > "$candidate" <<EOF
[Interface]
Address = 10.77.0.3/32
PrivateKey = $(<"$private_key")
MTU = 1280

[Peer]
PublicKey = $server_public_key
Endpoint = $endpoint
AllowedIPs = 10.77.0.1/32
PersistentKeepalive = 25
EOF
    install -m 600 "$candidate" "$config"
    printf '%s\n' "$client_public_key"
    ;;
  activate)
    systemctl enable wg-quick@wg0
    systemctl restart wg-quick@wg0
    ip route get 10.77.0.1 | grep -Eq 'dev wg0([[:space:]]|$)'
    ping -c 1 -W 3 10.77.0.1 >/dev/null
    handshake=$(wg show wg0 latest-handshakes | awk 'NR == 1 { print $2 }')
    now=$(date +%s)
    [[ $handshake =~ ^[0-9]+$ ]] && (( handshake > 0 && now - handshake < 180 ))
    curl -fsS --max-time 5 http://10.77.0.1:8090/api/health >/dev/null
    echo 'management WireGuard peer active at 10.77.0.3/32'
    ;;
  *) echo 'usage: wireguard-client.sh prepare|activate' >&2; exit 2 ;;
esac
