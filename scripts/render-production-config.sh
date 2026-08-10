#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
env_file=${1:-/etc/infraege/production.env}

docker compose \
  --env-file "$env_file" \
  --project-name infraege \
  -f "$repo_dir/infra/docker-compose.yml" \
  -f "$repo_dir/infra/docker-compose.prod.yml" \
  config
