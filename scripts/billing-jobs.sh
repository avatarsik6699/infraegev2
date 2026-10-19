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

api() {
  docker compose --env-file "$env_file" --project-name infraege \
    -f "$release_dir/infra/docker-compose.yml" \
    -f "$release_dir/infra/docker-compose.prod.yml" \
    exec -T api /app/.venv/bin/python -m "$@"
}

# Change 195: the business summary the smotryashchiy agent ships to the «Продажи» view.
# Counts and sums only; root-owned, readable by the agent (root) and nobody else.
business_dir=${BUSINESS_DIR:-/var/lib/infraege/business}
install -d -m 750 "$business_dir"

# The API container owns the application role and the provider credentials; the job is a
# no-op while BILLING_ENABLED is off. Its output names counts and states, never people.
if [[ $kind == daily ]]; then
  output=$(mktemp)
  trap 'rm -f "$output"' EXIT
  status=0
  api app.modules.billing.jobs daily >"$output" || status=$?
  cat "$output"
  # The last reconciliation result, kept for the hourly summary.
  jq -c 'select(.event? == "billing.reconcile_done")
    | {checked_at: .timestamp, checked, mismatches}' "$output" 2>/dev/null | tail -n 1 |
    { read -r line && printf '%s\n' "$line" >"$business_dir/reconcile.json.tmp" &&
      chmod 640 "$business_dir/reconcile.json.tmp" &&
      mv "$business_dir/reconcile.json.tmp" "$business_dir/reconcile.json"; } || true
  exit "$status"
fi

status=0
api app.modules.billing.jobs hourly || status=$?
summary=$business_dir/summary.json
reconcile=$business_dir/reconcile.json
[[ -r $reconcile ]] || reconcile=/dev/null
if api app.modules.billing.admin export |
  jq --slurpfile reconcile "$reconcile" '. + {reconcile: ($reconcile[0] // null)}' \
    >"$summary.tmp"; then
  chmod 640 "$summary.tmp"
  mv "$summary.tmp" "$summary"
else
  rm -f "$summary.tmp"
  echo 'business summary export failed' >&2
  status=1
fi
exit "$status"
