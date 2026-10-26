#!/usr/bin/env bash
# Change 229: a release must not change the production postgres service, or `compose up`
# recreates (restarts) the database on every deploy. Two releases render it byte for byte alike;
# the API, which does belong to the release, still differs.
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf "$test_root"' EXIT

cat >"$test_root/production.env" <<'ENV'
POSTGRES_PASSWORD=synthetic-postgres
DB_RUNTIME_PASSWORD=synthetic-runtime
DB_APP_PASSWORD=synthetic-app
DB_IMPORT_PASSWORD=synthetic-import
DB_MIGRATION_PASSWORD=synthetic-migration
DB_BACKUP_PASSWORD=synthetic-backup
AUTH_CSRF_SECRET=synthetic-csrf-secret-of-adequate-length-0000
TASK_FILES_DIR=/var/lib/infraege/task-files
GEOIP_DIR=/var/lib/infraege/geoip
ENV

render() {
  DEPLOY_SHA=$1 docker compose --env-file "$test_root/production.env" --project-name infraege \
    -f "$repo_dir/infra/docker-compose.yml" -f "$repo_dir/infra/docker-compose.prod.yml" \
    config --format json
}

render "$(printf 'a%.0s' {1..40})" >"$test_root/first.json"
render "$(printf 'b%.0s' {1..40})" >"$test_root/second.json"

jq -S '.services.postgres' "$test_root/first.json" >"$test_root/first-postgres.json"
jq -S '.services.postgres' "$test_root/second.json" >"$test_root/second-postgres.json"
if ! cmp -s "$test_root/first-postgres.json" "$test_root/second-postgres.json"; then
  echo 'postgres configuration changes with the release:' >&2
  diff "$test_root/first-postgres.json" "$test_root/second-postgres.json" >&2 || true
  exit 1
fi
if cmp -s <(jq -S '.services.api' "$test_root/first.json") \
  <(jq -S '.services.api' "$test_root/second.json"); then
  echo 'the API no longer carries its release; the check above proves nothing' >&2
  exit 1
fi

# The initdb role script comes from the stable path that deploy-remote.sh installs.
jq -e '.services.postgres.volumes[] |
  select(.target == "/docker-entrypoint-initdb.d/10-application-roles.sh") |
  select(.source == "/opt/infraege/shared/db-provision-roles.sh")' "$test_root/first.json" >/dev/null
grep -Fq 'install -m 755 "$release_dir/scripts/db-provision-roles.sh" "$root/shared/db-provision-roles.sh.new"' \
  "$repo_dir/scripts/deploy-remote.sh"
echo 'postgres release stability: PASS'
