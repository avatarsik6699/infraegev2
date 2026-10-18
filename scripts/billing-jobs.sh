#!/usr/bin/env bash
# Change 192: billing upkeep inside the running API container (hourly or daily).
set -euo pipefail

[[ ${EUID:-$(id -u)} -eq 0 ]] || {
  echo 'billing jobs must run as root through their production timers' >&2
  exit 1
}
kind=${1:-}
[[ $kind == hourly || $kind == daily ]] || {
  echo 'usage: billing-jobs.sh hourly|daily' >&2
  exit 2
}

release_dir=/opt/infraege/current
env_file=/etc/infraege/production.env
[[ -L $release_dir && -r $env_file && -r $release_dir/infra/docker-compose.yml &&
  -r $release_dir/infra/docker-compose.prod.yml ]] || {
  echo 'current production release or protected environment is unavailable' >&2
  exit 1
}

# The API container owns the application role and the provider credentials; the job is a
# no-op while BILLING_ENABLED is off. Its output names counts and states, never people.
docker compose --env-file "$env_file" --project-name infraege \
  -f "$release_dir/infra/docker-compose.yml" \
  -f "$release_dir/infra/docker-compose.prod.yml" \
  exec -T api /app/.venv/bin/python -m app.modules.billing.jobs "$kind"
