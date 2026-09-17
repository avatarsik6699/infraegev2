#!/usr/bin/env bash
# Isolated Nginx contract: never stop the application or contact production.
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/../.." && pwd)
test_dir=$(mktemp -d /tmp/infraege-auxiliary.XXXXXX)
container_name="infraege-auxiliary-test-$$"
cleanup() {
  docker rm -f "$container_name" >/dev/null 2>&1 || true
  rm -rf "$test_dir"
}
trap cleanup EXIT
cat > "$test_dir/nginx.conf" <<'NGINX'
events {}
http {
  include /etc/nginx/mime.types;
  include /etc/nginx/snippets/auxiliary-maps.conf;
  server {
    listen 8081;
    location /502 { return 502; }
    location /503 { return 503; }
    location /504 { return 504; }
    location /missing { return 404 'application missing'; }
    location /broken { return 500 'application error'; }
    location /api/ { default_type application/json; return 503 '{"detail":"unavailable"}'; }
    location /health { return 503 'not ready'; }
    location /_serverFn/ { default_type application/json; return 503 '{"error":"server function"}'; }
    location / { return 503 'upstream unavailable'; }
  }
  server {
    listen 8080;
    include /etc/nginx/snippets/auxiliary-locations.conf;
    location /api/ { proxy_pass http://127.0.0.1:8081; }
    location /health { proxy_pass http://127.0.0.1:8081; }
    location /down {
      include /etc/nginx/snippets/auxiliary-proxy.conf;
      proxy_pass http://127.0.0.1:9;
    }
    location / {
      include /etc/nginx/snippets/auxiliary-proxy.conf;
      proxy_pass http://127.0.0.1:8081;
    }
  }
}
NGINX
nginx_image=$(sed -n 's/^FROM //p' "$repo_dir/infra/nginx/Dockerfile")
docker run --rm -d --name "$container_name" -p 127.0.0.1:18082:8080 \
  -v "$test_dir/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$repo_dir/infra/nginx/snippets:/etc/nginx/snippets:ro" \
  -v "$repo_dir/infra/nginx/auxiliary:/usr/share/nginx/auxiliary:ro" \
  -v "$repo_dir/apps/web/public/brand/infraege-mark.svg:/usr/share/nginx/auxiliary/assets/infraege-mark.svg:ro" \
  -v "$repo_dir/apps/web/public/fonts:/usr/share/nginx/auxiliary/assets/fonts:ro" \
  "$nginx_image" >/dev/null
for attempt in {1..30}; do
  if curl -s http://127.0.0.1:18082/missing >/dev/null; then break; fi
  sleep 0.2
done
docker exec "$container_name" nginx -t
for code in 502 503 504; do
  status=$(curl -sS -H 'Accept: text/html' -D "$test_dir/headers" -o "$test_dir/body" -w '%{http_code}' "http://127.0.0.1:18082/$code")
  test "$status" = "$code"
  ! grep -q "scenes/.*webp" "$test_dir/body"
  ! grep -q 'class="card"' "$test_dir/body"
  ! grep -q 'class="patternField"' "$test_dir/body"
  grep -q 'class="refresh"' "$test_dir/body"
  grep -q "data-server-state=\"$code\"" "$test_dir/body"
  grep -qi 'Cache-Control: no-store' "$test_dir/headers"
  grep -qi 'X-Robots-Tag: noindex' "$test_dir/headers"
  grep -qi 'Content-Security-Policy:' "$test_dir/headers"
  grep -qi 'Content-Type: text/html' "$test_dir/headers"
  test "$(curl -sSI -H 'Accept: text/html' "http://127.0.0.1:18082/$code" | head -1 | awk '{print $2}')" = "$code"
done
curl -sS -H 'Accept: text/html' http://127.0.0.1:18082/down | grep -q 'data-server-state="502"'
for target in /api/503 /health /_serverFn/example /images/missing.webp /503.js /503; do
  curl -sS -H 'Accept: application/json' "http://127.0.0.1:18082$target" > "$test_dir/body"
  ! grep -q 'data-server-state' "$test_dir/body"
done
for target in /_serverFn/example /images/missing.webp /503.js; do
  curl -sS -H 'Accept: text/html' "http://127.0.0.1:18082$target" > "$test_dir/body"
  ! grep -q 'data-server-state' "$test_dir/body"
done
curl -sS -X POST -H 'Accept: text/html' http://127.0.0.1:18082/503 > "$test_dir/body"
! grep -q 'data-server-state' "$test_dir/body"
curl -sS -H 'Accept: text/html' -H 'Sec-Fetch-Dest: script' http://127.0.0.1:18082/503 > "$test_dir/body"
! grep -q 'data-server-state' "$test_dir/body"
curl -sS -H 'Accept: text/html' http://127.0.0.1:18082/_serverFn/example | grep -q 'server function'
curl -sS -H 'Accept: application/json' http://127.0.0.1:18082/asset.js | grep -q 'upstream unavailable'
for target in missing broken; do
  curl -sS -H 'Accept: text/html' "http://127.0.0.1:18082/$target" | grep -q 'application'
done
for asset in styles.css infraege-mark.svg fonts/alegreya/alegreya-cyrillic-wght-normal.woff2 fonts/golos-text/golos-text-cyrillic-wght-normal.woff2; do
  test "$(curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:18082/_infraege/$asset")" = 200
done
curl -sSI http://127.0.0.1:18082/_infraege/infraege-mark.svg | grep -qi 'Content-Type: image/svg+xml'
printf 'Auxiliary Nginx contracts: PASS (502/503/504, real disconnected upstream, methods, resources, API and original application errors)\n'
if [[ ${1:-} == --preview ]]; then
  printf 'Preview at http://localhost:18082/{502,503,504}; press Enter to clean up.\n'
  read -r _
fi
