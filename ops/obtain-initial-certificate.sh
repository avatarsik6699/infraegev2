#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root after reg.ru DNS points to this VPS." >&2
  exit 1
fi

: "${PUBLIC_IPV4:?Set PUBLIC_IPV4 to the VPS address}"
: "${TLS_EMAIL:?Set TLS_EMAIL for certificate notices}"

# Change 193: kodumka.ru is the public origin; the former infraege.ru keeps its own
# certificate so its 301 still answers over HTTPS.
for cert_name in kodumka.ru infraege.ru; do
  for dns_resolver in 1.1.1.1 8.8.8.8; do
    apex_ip=$(dig +short "@$dns_resolver" A "$cert_name" | tail -n 1)
    www_ip=$(dig +short "@$dns_resolver" A "www.$cert_name" | tail -n 1)
    if [[ $apex_ip != "$PUBLIC_IPV4" || $www_ip != "$PUBLIC_IPV4" ]]; then
      echo "$cert_name DNS is not ready via $dns_resolver: apex=$apex_ip www=$www_ip expected=$PUBLIC_IPV4" >&2
      exit 1
    fi
  done

  if [[ -f /etc/letsencrypt/live/$cert_name/fullchain.pem ]]; then
    echo "$cert_name certificate already exists."
    continue
  fi

  # A running production Nginx answers every host on port 80 with the ACME webroot;
  # a fresh host has nothing on port 80 yet, so certbot serves the challenge itself.
  if ss -Hltn 'sport = :80' | grep -q .; then
    certbot certonly --webroot --webroot-path /var/www/certbot --non-interactive --agree-tos \
      --email "$TLS_EMAIL" --cert-name "$cert_name" -d "$cert_name" -d "www.$cert_name"
  else
    certbot certonly --standalone --non-interactive --agree-tos \
      --email "$TLS_EMAIL" --cert-name "$cert_name" -d "$cert_name" -d "www.$cert_name"
  fi
done

echo "Certificates for kodumka.ru and infraege.ru are present. Production Nginx can now start."
