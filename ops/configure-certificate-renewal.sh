#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root after production Nginx is healthy." >&2
  exit 1
fi

# Change 193: both the public kodumka.ru and the redirecting infraege.ru renew by webroot.
cert_names=(kodumka.ru infraege.ru)
for cert_name in "${cert_names[@]}"; do
  challenge_status=$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    "http://$cert_name/.well-known/acme-challenge/nonexistent")
  [[ $challenge_status == 404 ]] || {
    echo "ACME webroot route for $cert_name returned HTTP $challenge_status, expected 404 for a missing token" >&2
    exit 1
  }

  certbot reconfigure --cert-name "$cert_name" --webroot --webroot-path /var/www/certbot \
    --non-interactive --no-random-sleep-on-renew
done

install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
install -m 755 "$(dirname -- "${BASH_SOURCE[0]}")/bin/reload-nginx-certificate" \
  /etc/letsencrypt/renewal-hooks/deploy/reload-infraege-nginx

for cert_name in "${cert_names[@]}"; do
  certbot renew --cert-name "$cert_name" --dry-run --no-random-sleep-on-renew
done
systemctl enable --now certbot.timer
