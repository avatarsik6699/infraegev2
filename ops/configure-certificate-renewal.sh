#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root after production Nginx is healthy." >&2
  exit 1
fi

challenge_status=$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
  http://infraege.ru/.well-known/acme-challenge/nonexistent)
[[ $challenge_status == 404 ]] || {
  echo "ACME webroot route returned HTTP $challenge_status, expected 404 for a missing token" >&2
  exit 1
}

certbot reconfigure --cert-name infraege.ru --webroot --webroot-path /var/www/certbot \
  --non-interactive --no-random-sleep-on-renew

install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
install -m 755 "$(dirname -- "${BASH_SOURCE[0]}")/bin/reload-nginx-certificate" \
  /etc/letsencrypt/renewal-hooks/deploy/reload-infraege-nginx

certbot renew --cert-name infraege.ru --dry-run --no-random-sleep-on-renew
systemctl enable --now certbot.timer
