#!/usr/bin/env bash
set -euo pipefail

[[ ${EUID:-$(id -u)} -eq 0 ]] || {
  echo 'account artifact purge must run as root through its production timer' >&2
  exit 1
}

release_dir=/opt/infraege/current
env_file=/etc/infraege/production.env
[[ -L $release_dir && -r $env_file && -r $release_dir/infra/docker-compose.yml &&
  -r $release_dir/infra/docker-compose.prod.yml ]] || {
  echo 'current production release or protected environment is unavailable' >&2
  exit 1
}

# The running API container owns the least-privilege application role.  This
# command does not open PostgreSQL to the host or print the rendered environment.
docker compose --env-file "$env_file" --project-name infraege \
  -f "$release_dir/infra/docker-compose.yml" \
  -f "$release_dir/infra/docker-compose.prod.yml" \
  exec -T api python -m app.modules.account.purge
