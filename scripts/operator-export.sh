#!/usr/bin/env bash
# Change 199: the kodumka.operator/1 report for the operator console on sre.infraege.ru. The
# smotryashchiy agent ships it as `--document operator=/var/lib/infraege/ops/operator.json`.
# It names people (email, IP, city) by the architect's decision of 2026-10-24: root-owned,
# readable by the agent (root) and nobody else; replaced on every run.
set -euo pipefail

[[ ${EUID:-$(id -u)} -eq 0 ]] || {
  echo 'the operator export must run as root through its production timer' >&2
  exit 1
}
release_dir=/opt/infraege/current
env_file=/etc/infraege/production.env
[[ -L $release_dir && -r $env_file && -r $release_dir/infra/docker-compose.yml &&
  -r $release_dir/infra/docker-compose.prod.yml ]] || {
  echo 'current production release or protected environment is unavailable' >&2
  exit 1
}

ops_dir=${OPS_DIR:-/var/lib/infraege/ops}
install -d -m 750 "$ops_dir"
report=$ops_dir/operator.json
if docker compose --env-file "$env_file" --project-name infraege \
  -f "$release_dir/infra/docker-compose.yml" \
  -f "$release_dir/infra/docker-compose.prod.yml" \
  exec -T api /app/.venv/bin/python -m app.modules.billing.admin export-operator |
  jq -e 'select(.schema == "kodumka.operator/1")' >"$report.tmp"; then
  chmod 640 "$report.tmp"
  mv "$report.tmp" "$report"
else
  rm -f "$report.tmp"
  echo 'operator report export failed' >&2
  exit 1
fi
