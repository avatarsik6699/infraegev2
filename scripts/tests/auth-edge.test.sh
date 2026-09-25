#!/usr/bin/env bash
# Isolated Nginx contract: auth abuse is bounded and callback query credentials never reach logs.
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/../.." && pwd)
test_dir=$(mktemp -d /tmp/infraege-auth-edge.XXXXXX)
container_name="infraege-auth-edge-test-$$"
cleanup() {
  docker rm -f "$container_name" >/dev/null 2>&1 || true
  rm -rf "$test_dir"
}
trap cleanup EXIT

mkdir "$test_dir/conf.d" "$test_dir/cert"
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj /CN=infraege.ru \
  -keyout "$test_dir/cert/privkey.pem" -out "$test_dir/cert/fullchain.pem" >/dev/null 2>&1
cp "$repo_dir/infra/nginx/conf.d/infraege.prod.conf" "$test_dir/conf.d/app.conf"
cat >"$test_dir/conf.d/upstream.conf" <<'NGINX'
server {
  listen 8000;
  access_log off;
  location / { return 204; }
}
NGINX

nginx_image=$(sed -n 's/^FROM //p' "$repo_dir/infra/nginx/Dockerfile")
docker run -d --name "$container_name" -p 127.0.0.1::443 \
  --add-host web:127.0.0.1 --add-host api:127.0.0.1 \
  -v "$repo_dir/infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$test_dir/conf.d:/etc/nginx/conf.d:ro" \
  -v "$repo_dir/infra/nginx/snippets:/etc/nginx/snippets:ro" \
  -v "$test_dir/cert:/etc/letsencrypt/live/infraege.ru:ro" \
  "$nginx_image" >/dev/null
port=$(docker port "$container_name" 443 | cut -d: -f2)
for _ in {1..30}; do
  if curl -ks --max-time 1 -H 'Host: infraege.ru' "https://127.0.0.1:$port/health" >/dev/null; then break; fi
  sleep 0.2
done
docker exec "$container_name" nginx -t

sentinel='oauth-secret-must-not-be-logged'
curl -ksS -o /dev/null -H 'Host: infraege.ru' -H "Referer: https://infraege.ru/account/verify?token=$sentinel" \
  "https://127.0.0.1:$port/api/auth/login?token=$sentinel"
curl -ksS -o /dev/null -H 'Host: infraege.ru' \
  "https://127.0.0.1:$port/api/auth/providers/vk/callback?code=$sentinel&state=$sentinel"
if docker logs "$container_name" 2>&1 | grep -Fq "$sentinel"; then
  echo 'auth query credential appeared in edge logs' >&2
  docker logs "$container_name" 2>&1 | sed "s/$sentinel/[redacted]/g" >&2
  exit 1
fi

python3 - "https://127.0.0.1:$port" <<'PY'
import concurrent.futures
import ssl
import sys
import urllib.error
import urllib.request

base = sys.argv[1]
context = ssl._create_unverified_context()
opener = urllib.request.build_opener(
    urllib.request.ProxyHandler({}), urllib.request.HTTPSHandler(context=context)
)

def status(_: int) -> int:
    request = urllib.request.Request(base + "/api/auth/password-reset/request", headers={"Host": "infraege.ru"})
    try:
        with opener.open(request, timeout=5) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code

with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
    assert 429 in list(pool.map(status, range(20)))
PY

grep -Fq -- '--no-access-log' "$repo_dir/apps/api/entrypoint.sh"
printf 'Auth edge contract: PASS (bounded auth, no callback query access logging, Uvicorn access disabled)\n'
