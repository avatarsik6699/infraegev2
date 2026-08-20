#!/usr/bin/env bash
set -Eeuo pipefail

release_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
release=$(basename -- "$release_dir")
env_file=${1:-/etc/infraege/ops/$release.env}

OPS_RELEASE=$release docker compose --env-file "$env_file" --project-name infraege-ops \
  -f "$release_dir/compose.yml" exec -T postgres psql -U umami -d umami \
  < "$release_dir/umami-retention.sql"
