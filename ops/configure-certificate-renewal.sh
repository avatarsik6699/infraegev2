#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root after production Nginx is healthy." >&2
  exit 1
fi

curl --fail --silent --show-error \
  http://infraege.ru/.well-known/acme-challenge/nonexistent >/dev/null || true

certbot reconfigure --cert-name infraege.ru --webroot-path /var/www/certbot \
  --non-interactive

install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
install -m 755 "$(dirname -- "${BASH_SOURCE[0]}")/bin/reload-nginx-certificate" \
  /etc/letsencrypt/renewal-hooks/deploy/reload-infraege-nginx

certbot renew --cert-name infraege.ru --dry-run
systemctl enable --now certbot.timer
