#!/usr/bin/env bash
# Isolated Nginx contract for lesson videos: Range (206), MIME, caching. Never contacts production.
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/../.." && pwd)
test_dir=$(mktemp -d /tmp/infraege-lesson-media.XXXXXX)
container_name="infraege-lesson-media-test-$$"
cleanup() {
  docker rm -f "$container_name" >/dev/null 2>&1 || true
  rm -rf "$test_dir"
}
trap cleanup EXIT
cat > "$test_dir/nginx.conf" <<'NGINX'
events {}
http {
  include /etc/nginx/mime.types;
  server {
    listen 8080;
    include /etc/nginx/snippets/lesson-media.conf;
  }
}
NGINX
nginx_image=$(sed -n 's/^FROM //p' "$repo_dir/infra/nginx/Dockerfile")
docker run --rm -d --name "$container_name" -p 127.0.0.1:18083:8080 \
  -v "$test_dir/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$repo_dir/infra/nginx/snippets:/etc/nginx/snippets:ro" \
  -v "$repo_dir/apps/web/public/lesson-media:/usr/share/nginx/lesson-media:ro" \
  "$nginx_image" >/dev/null
for attempt in {1..30}; do
  if curl -s http://127.0.0.1:18083/lesson-media/missing >/dev/null; then break; fi
  sleep 0.2
done
docker exec "$container_name" nginx -t
base=http://127.0.0.1:18083/lesson-media
clip=rekursiya/rekursiya-call-tree
for ext_type in mp4:video/mp4 webm:video/webm; do
  ext=${ext_type%%:*}
  type=${ext_type#*:}
  curl -sSI "$base/$clip.$ext" > "$test_dir/headers"
  grep -qi "Content-Type: $type" "$test_dir/headers"
  grep -qi 'Accept-Ranges: bytes' "$test_dir/headers"
  grep -qi 'Cache-Control: public, max-age=86400' "$test_dir/headers"
  grep -qi 'X-Content-Type-Options: nosniff' "$test_dir/headers"
  grep -qi 'Strict-Transport-Security: max-age=31536000' "$test_dir/headers"
  status=$(curl -sS -o "$test_dir/body" -D "$test_dir/range" -w '%{http_code}' -H 'Range: bytes=0-99' "$base/$clip.$ext")
  test "$status" = 206
  grep -qi '^Content-Range: bytes 0-99/' "$test_dir/range"
  test "$(wc -c < "$test_dir/body")" = 100
done
curl -sSI "$base/rekursiya/rekursiya-call-tree-poster.webp" | grep -qi 'Content-Type: image/webp'
test "$(curl -sS -o /dev/null -w '%{http_code}' "$base/rekursiya/none.mp4")" = 404
test "$(curl -sS -o /dev/null -w '%{http_code}' "$base/../etc/passwd")" != 200
printf 'Lesson media Nginx contract: PASS (206 Range, video/image MIME, caching, 404)\n'
