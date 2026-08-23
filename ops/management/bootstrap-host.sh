#!/usr/bin/env bash
set -Eeuo pipefail

: "${MANAGEMENT_SSH_PORT:?set MANAGEMENT_SSH_PORT}"
[[ $MANAGEMENT_SSH_PORT =~ ^[0-9]+$ ]]
command -v docker >/dev/null
docker compose version >/dev/null

before=$(mktemp)
after=$(mktemp)
trap 'rm -f -- "$before" "$after"' EXIT
docker ps --format '{{.Names}} {{.Image}}' | sort > "$before"

if ! command -v ufw >/dev/null; then
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends ufw
fi
ufw allow "$MANAGEMENT_SSH_PORT/tcp" comment 'management ssh'
ufw allow 80/tcp comment 'sre-kit http challenge'
ufw allow 443/tcp comment 'sre-kit https'
ufw allow 443/udp comment 'sre-kit http3'
ufw --force enable

docker ps --format '{{.Names}} {{.Image}}' | sort > "$after"
cmp "$before" "$after"
ss -lntup | grep -Eq ":$MANAGEMENT_SSH_PORT([[:space:]]|$)"
echo 'management host bootstrap complete; unrelated containers preserved'
