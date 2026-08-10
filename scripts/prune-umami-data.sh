#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
env_file=${1:-/etc/infraege/production.env}
set -a
# shellcheck disable=SC1090
source "$env_file"
set +a
: "${POSTGRES_USER:?POSTGRES_USER is required}"

docker compose --env-file "$env_file" --project-name infraege \
  -f "$repo_dir/infra/docker-compose.yml" -f "$repo_dir/infra/docker-compose.prod.yml" \
  exec -T postgres psql -U "$POSTGRES_USER" -d umami \
  < "$repo_dir/ops/postgres/umami-retention.sql"
