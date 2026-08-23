#!/usr/bin/env bash
set -Eeuo pipefail

config=${WG_CONFIG:-/etc/wireguard/wg0.conf}
wg_command=${WG_COMMAND:-wg}
IFS= read -r peer_public_key
[[ $peer_public_key =~ ^[A-Za-z0-9+/]{43}=$ ]]
[[ -f $config ]]
grep -Fq 'AllowedIPs = 10.77.0.2/32' "$config"

begin='# BEGIN infraegev2 management peer'
end='# END infraegev2 management peer'
if grep -Fq "$begin" "$config"; then
  grep -A4 -F "$begin" "$config" | grep -Fq "PublicKey = $peer_public_key"
  grep -A4 -F "$begin" "$config" | grep -Fq 'AllowedIPs = 10.77.0.3/32'
else
  candidate=$(mktemp)
  trap 'rm -f -- "$candidate"' EXIT
  cp "$config" "$candidate"
  printf '\n%s\n[Peer]\nPublicKey = %s\nAllowedIPs = 10.77.0.3/32\n%s\n' \
    "$begin" "$peer_public_key" "$end" >> "$candidate"
  install -m 600 "$candidate" "$config"
fi
"$wg_command" set wg0 peer "$peer_public_key" allowed-ips 10.77.0.3/32
"$wg_command" show wg0 allowed-ips | grep -Fq "$peer_public_key"$'\t''10.77.0.3/32'
grep -Fq 'AllowedIPs = 10.77.0.2/32' "$config"
echo 'application WireGuard management peer persisted'
