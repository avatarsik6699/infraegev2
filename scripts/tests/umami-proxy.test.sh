#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
config="$repo_dir/infra/nginx/conf.d/infraege.prod.conf"
nginx_config="$repo_dir/infra/nginx/nginx.conf"
compose="$repo_dir/ops/observability/compose.yml"

script_block=$(sed -n '/^[[:space:]]*location = \/stats\/script\.js {/,/^[[:space:]]*}/p' "$config")
collector_block=$(sed -n '/^[[:space:]]*location = \/stats\/api\/send {/,/^[[:space:]]*}/p' "$config")
private_block=$(sed -n '/^[[:space:]]*location \^~ \/stats\/ {/,/^[[:space:]]*}/p' "$config")
umami_block=$(sed -n '/^  umami:/,/^  beszel:/p' "$compose")

grep -Fq 'resolver 127.0.0.11 valid=10s ipv6=off;' "$nginx_config"
grep -Fq 'zone umami_backend 64k;' "$nginx_config"
grep -Fq 'server umami:3000 resolve;' "$nginx_config"
grep -Fq 'proxy_pass http://umami_backend/script.js;' <<<"$script_block"
grep -Fq 'proxy_pass http://umami_backend/stats/api/send;' <<<"$collector_block"
! grep -Fq 'set $umami_origin' "$config"
grep -Fq 'return 404;' <<<"$private_block"
grep -Fq 'BASE_PATH: /stats' <<<"$umami_block"
grep -Fq 'COLLECT_API_ENDPOINT: /api/send' <<<"$umami_block"
grep -Fq 'aliases: [umami]' <<<"$umami_block"

if grep -Fq 'proxy_pass http://umami:3000/stats/script.js;' <<<"$script_block"; then
  echo 'tracker script must use the Umami root upstream path' >&2
  exit 1
fi
if grep -Fq 'COLLECT_API_ENDPOINT: /stats/api/send' <<<"$umami_block"; then
  echo 'collector endpoint must be relative to the Umami base path' >&2
  exit 1
fi

echo 'Umami public proxy allowlist is valid.'
