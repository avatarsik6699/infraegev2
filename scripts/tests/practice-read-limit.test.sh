#!/usr/bin/env bash
# Host assertions against disposable Nginx and stub upstreams; no application DB.
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/../.." && pwd)
test_dir=$(mktemp -d /tmp/infraege-read-limit.XXXXXX)
container_name="infraege-read-limit-test-$$"
cleanup() {
  docker rm -f "$container_name" >/dev/null 2>&1 || true
  rm -rf "$test_dir"
}
trap cleanup EXIT
mkdir "$test_dir/conf.d" "$test_dir/cert"
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj /CN=infraege.ru \
  -keyout "$test_dir/cert/privkey.pem" -out "$test_dir/cert/fullchain.pem" >/dev/null 2>&1
cat > "$test_dir/conf.d/upstream.conf" <<'NGINX'
server {
  listen 3000;
  listen 8000;
  location / { return 204; }
}
NGINX
nginx_image=$(sed -n 's/^FROM //p' "$repo_dir/infra/nginx/Dockerfile")
for profile in infraege.conf infraege.prod.conf; do
  cp "$repo_dir/infra/nginx/conf.d/$profile" "$test_dir/conf.d/app.conf"
  container_port=80
  scheme=http
  if [[ $profile == infraege.prod.conf ]]; then container_port=443; scheme=https; fi
  docker run --rm -d --name "$container_name" -p "127.0.0.1::$container_port" \
    --add-host web:127.0.0.1 --add-host api:127.0.0.1 \
    -v "$repo_dir/infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
    -v "$test_dir/conf.d:/etc/nginx/conf.d:ro" \
    -v "$repo_dir/infra/nginx/snippets:/etc/nginx/snippets:ro" \
    -v "$test_dir/cert:/etc/letsencrypt/live/infraege.ru:ro" \
    "$nginx_image" >/dev/null
  port=$(docker port "$container_name" "$container_port" | cut -d: -f2)
  for _attempt in {1..30}; do
    if curl -ks --max-time 1 -H 'Host: infraege.ru' "$scheme://127.0.0.1:$port/health" >/dev/null; then break; fi
    sleep 0.2
  done
  docker exec "$container_name" nginx -t
  python3 - "$scheme://127.0.0.1:$port" <<'PY'
import concurrent.futures
import ssl
import sys
import urllib.error
import urllib.request

# Disposable self-signed fixture only; production config and certificate paths are unchanged.
base = sys.argv[1]
context = ssl._create_unverified_context()
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), urllib.request.HTTPSHandler(context=context))

def status(path):
    request = urllib.request.Request(base + path, headers={"Host": "infraege.ru"})
    try:
        with opener.open(request, timeout=5) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code

assert status("/practice?limit=100") == 204
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
    assert set(pool.map(status, [f"/_serverFn/task?id={i}" for i in range(100)])) == {204}
# The same budget is consumed regardless of the page/function/API path or query string.
paths = ["/practice?q=x", "/_serverFn/task?id=x", "/api/tasks", "/api/tasks/facets",
         "/api/topics/practice-summary", "/api/learning-materials/topic/x/practice", "/ege/topic", "/courses/python",
         "/sitemap.xml", "/sitemap-practice/1"]
for path in paths:
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
        codes = list(pool.map(status, [path] * 20))
    assert 429 in codes, (path, codes)
for path in ["/", "/privacy", "/_build/app.js", "/fonts/test.woff2", "/health"]:
    assert status(path) == 204, path
# Read exhaustion does not exhaust the independently protected checker.
assert status("/api/tasks/test/check") == 204
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    assert 503 in list(pool.map(status, ["/api/tasks/test/check"] * 20))
print("100-task burst, shared read limit, unaffected assets/health and independent checker: PASS")
PY
  docker rm -f "$container_name" >/dev/null
done
