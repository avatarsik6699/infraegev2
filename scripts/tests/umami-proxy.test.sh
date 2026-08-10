#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
config="$repo_dir/infra/nginx/conf.d/infraege.prod.conf"

script_block=$(sed -n '/^[[:space:]]*location = \/stats\/script\.js {/,/^[[:space:]]*}/p' "$config")
collector_block=$(sed -n '/^[[:space:]]*location = \/stats\/api\/send {/,/^[[:space:]]*}/p' "$config")
private_block=$(sed -n '/^[[:space:]]*location \^~ \/stats\/ {/,/^[[:space:]]*}/p' "$config")

grep -Fq 'proxy_pass http://umami:3000/script.js;' <<<"$script_block"
grep -Fq 'proxy_pass http://umami:3000/stats/api/send;' <<<"$collector_block"
grep -Fq 'return 404;' <<<"$private_block"

if grep -Fq 'proxy_pass http://umami:3000/stats/script.js;' <<<"$script_block"; then
  echo 'tracker script must use the Umami root upstream path' >&2
  exit 1
fi

echo 'Umami public proxy allowlist is valid.'
