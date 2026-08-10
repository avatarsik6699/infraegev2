#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root after reg.ru DNS points to this VPS." >&2
  exit 1
fi

: "${PUBLIC_IPV4:?Set PUBLIC_IPV4 to the VPS address}"
: "${TLS_EMAIL:?Set TLS_EMAIL for certificate notices}"

for dns_resolver in 1.1.1.1 8.8.8.8; do
  apex_ip=$(dig +short "@$dns_resolver" A infraege.ru | tail -n 1)
  www_ip=$(dig +short "@$dns_resolver" A www.infraege.ru | tail -n 1)
  if [[ $apex_ip != "$PUBLIC_IPV4" || $www_ip != "$PUBLIC_IPV4" ]]; then
    echo "DNS is not ready via $dns_resolver: apex=$apex_ip www=$www_ip expected=$PUBLIC_IPV4" >&2
    exit 1
  fi
done

if [[ -f /etc/letsencrypt/live/infraege.ru/fullchain.pem ]]; then
  echo "Certificate already exists; nothing to do."
  exit 0
fi

certbot certonly --standalone --non-interactive --agree-tos \
  --email "$TLS_EMAIL" -d infraege.ru -d www.infraege.ru

echo "Initial certificate obtained. Production Nginx can now start."
