#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
env_file=${1:-/etc/infraege/production.env}

set -a
# shellcheck disable=SC1090
source "$env_file"
set +a
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${UMAMI_DB_PASSWORD:?UMAMI_DB_PASSWORD is required}"

compose=(docker compose --env-file "$env_file" --project-name infraege
  -f "$repo_dir/infra/docker-compose.yml" -f "$repo_dir/infra/docker-compose.prod.yml")

role_exists=$(
  "${compose[@]}" exec -T postgres psql -U "$POSTGRES_USER" -d postgres -tAc \
    "SELECT 1 FROM pg_roles WHERE rolname = 'umami'"
)
if [[ $role_exists != 1 ]]; then
  "${compose[@]}" exec -T postgres psql -U "$POSTGRES_USER" -d postgres \
    -v ON_ERROR_STOP=1 -v role_password="$UMAMI_DB_PASSWORD" \
    -c "CREATE ROLE umami LOGIN PASSWORD :'role_password'"
fi

database_exists=$(
  "${compose[@]}" exec -T postgres psql -U "$POSTGRES_USER" -d postgres -tAc \
    "SELECT 1 FROM pg_database WHERE datname = 'umami'"
)
if [[ $database_exists != 1 ]]; then
  "${compose[@]}" exec -T postgres createdb -U "$POSTGRES_USER" -O umami umami
fi

echo "Umami database and role are ready."
