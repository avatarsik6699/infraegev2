#!/usr/bin/env bash
# Isolated Nginx contract (Change 192): gated paid chunks, provider notifications, checkout budget.
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/../.." && pwd)
test_dir=$(mktemp -d /tmp/infraege-paid-gate.XXXXXX)
container_name="infraege-paid-gate-test-$$"
cleanup() {
  docker rm -f "$container_name" >/dev/null 2>&1 || true
  rm -rf "$test_dir"
}
trap cleanup EXIT

mkdir "$test_dir/conf.d" "$test_dir/cert"
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj /CN=kodumka.ru \
  -keyout "$test_dir/cert/privkey.pem" -out "$test_dir/cert/fullchain.pem" >/dev/null 2>&1
cp "$repo_dir/infra/nginx/conf.d/infraege.prod.conf" "$test_dir/conf.d/app.conf"
# The access check answers 204 only for a session cookie the fake API accepts.
cat >"$test_dir/conf.d/upstream.conf" <<'NGINX'
server {
  listen 8000;
  access_log off;
  location = /api/access/asset {
    if ($http_cookie ~ "__Host-infraege_session=granted") { return 204; }
    return 403;
  }
  location / { return 200 "api"; }
}
server {
  listen 3000;
  access_log off;
  location / {
    add_header Cache-Control "public, max-age=31536000, immutable";
    return 200 "chunk";
  }
}
NGINX

nginx_image=$(sed -n 's/^FROM //p' "$repo_dir/infra/nginx/Dockerfile")
docker run -d --name "$container_name" -p 127.0.0.1::443 \
  --add-host web:127.0.0.1 --add-host api:127.0.0.1 \
  -v "$repo_dir/infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$test_dir/conf.d:/etc/nginx/conf.d:ro" \
  -v "$repo_dir/infra/nginx/snippets:/etc/nginx/snippets:ro" \
  -v "$test_dir/cert:/etc/letsencrypt/live/infraege.ru:ro" \
  -v "$test_dir/cert:/etc/letsencrypt/live/kodumka.ru:ro" \
  "$nginx_image" >/dev/null
port=$(docker port "$container_name" 443 | cut -d: -f2)
for _ in {1..30}; do
  if curl -ks --max-time 1 -H 'Host: kodumka.ru' "https://127.0.0.1:$port/health" >/dev/null; then break; fi
  sleep 0.2
done
docker exec "$container_name" nginx -t

base="https://127.0.0.1:$port"
request() { curl -ks -o /dev/null -w '%{http_code}' -H 'Host: kodumka.ru' "$@"; }
expect() {
  local want=$1 got=$2 what=$3
  [[ $got == "$want" ]] || { echo "$what: expected $want, got $got" >&2; exit 1; }
}

expect 403 "$(request "$base/assets/paid/topic.paid.subtopic-AbC123.js")" 'paid chunk without access'
expect 403 "$(request -H 'Cookie: __Host-infraege_session=other' "$base/assets/paid/x.js")" \
  'paid chunk for an account without access'
expect 200 "$(request -H 'Cookie: __Host-infraege_session=granted' "$base/assets/paid/x.js")" \
  'paid chunk with access'
cache=$(curl -ks -D - -o /dev/null -H 'Host: kodumka.ru' -H 'Cookie: __Host-infraege_session=granted' \
  "$base/assets/paid/x.js" | tr -d '\r' | grep -i '^cache-control:')
[[ $cache == *private* && $cache == *no-store* && $cache != *immutable* ]] || {
  echo "gated chunk cache policy: $cache" >&2
  exit 1
}
expect 200 "$(request "$base/assets/public-chunk.js")" 'public chunk'
expect 404 "$(request "$base/_entitlement")" 'internal access check is not public'

big=$(head -c 40000 /dev/zero | tr '\0' 'a')
expect 413 "$(request -X POST --data "InvId=1&pad=$big" "$base/api/billing/webhooks/robokassa")" \
  'oversized notification'
expect 200 "$(request -X POST --data 'InvId=1' "$base/api/billing/webhooks/robokassa")" \
  'notification'
echo 'paid gate contract passed'
