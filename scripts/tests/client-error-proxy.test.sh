#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)

grep -Fq 'limit_req_zone $binary_remote_addr zone=client_errors:10m rate=10r/m;' \
  "$repo_dir/infra/nginx/nginx.conf"

for config in \
  "$repo_dir/infra/nginx/conf.d/infraege.conf" \
  "$repo_dir/infra/nginx/conf.d/infraege.prod.conf"; do
  block=$(sed -n \
    '/^[[:space:]]*location = \/api\/client-errors {/,/^[[:space:]]*}/p' \
    "$config")
  grep -Fq 'client_max_body_size 4k;' <<<"$block"
  grep -Fq 'limit_req zone=client_errors burst=5 nodelay;' <<<"$block"
  grep -Fq 'proxy_pass http://api:8000;' <<<"$block"
done

echo 'Client error proxy limits are valid.'
