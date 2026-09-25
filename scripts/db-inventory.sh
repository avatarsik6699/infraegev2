#!/usr/bin/env bash
# Read-only application inventory. Credentials stay inside the selected container.
set -euo pipefail

environment=${1:?usage: db-inventory.sh dev|test|prod PROJECT}
project=${2:?explicit Compose project is required}
case "$environment:$project" in
  dev:infraege-dev | test:infraege-full-gate | prod:infraege) ;;
  *) echo 'environment/project identity mismatch' >&2; exit 64 ;;
esac
container=$(docker ps -aq --filter "label=com.docker.compose.project=$project" \
  --filter label=com.docker.compose.service=postgres)
[[ -n $container && $container != *$'\n'* ]] || {
  echo 'expected exactly one application postgres container' >&2; exit 1;
}
printf 'environment=%s project=%s\n' "$environment" "$project"
docker inspect "$container" --format 'image={{.Config.Image}} running={{.State.Running}} mounts={{json .Mounts}}'
[[ $(docker inspect "$container" --format '{{.State.Running}}') == true ]] || {
  echo 'SQL inventory unavailable: container stopped; no start or data mutation performed' >&2
  exit 3
}
docker exec -i "$container" sh -ec '
  test "$POSTGRES_DB" = infraege
  export PGOPTIONS="-c default_transaction_read_only=on -c statement_timeout=10000"
  exec psql -X -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1
' <<'SQL'
SELECT current_database(), current_user, version();
SELECT datname, pg_get_userbyid(datdba) AS owner, pg_database_size(oid) AS bytes
FROM pg_database WHERE datname = current_database();
SELECT nspname, pg_get_userbyid(nspowner) AS owner, nspacl
FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname <> 'information_schema';
SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolcanlogin
FROM pg_roles WHERE rolname = current_user OR rolname IN
('infraege_runtime', 'infraege_import', 'infraege_migration', 'infraege_backup', 'infraege_app');
SELECT schemaname, tablename, tableowner FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
SELECT extname, extversion FROM pg_extension;
SQL
docker exec "$container" df -Pk /var/lib/postgresql
if [[ $environment == prod ]]; then
  df -Pk /var/backups/infraege
  systemctl show infraege-backup.timer infraege-restore-check.timer \
    -p Id -p ActiveState -p LastTriggerUSec
  systemctl show infraege-backup.service infraege-restore-check.service \
    -p Id -p Result -p ExecMainStatus
  if [[ -r /var/lib/infraege/backup-status.json ]]; then
    jq '{status,completedAt,maxAgeHours}' /var/lib/infraege/backup-status.json
  fi
fi
