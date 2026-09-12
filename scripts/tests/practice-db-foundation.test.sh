#!/usr/bin/env bash
# Host runner; Docker contains only isolated databases, never the test runner.
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
command -v restic >/dev/null
test_root=$(mktemp -d)
installed_release="$test_root/database-current"
mkdir -p "$test_root/releases/candidate/scripts/lib"
ln -s "$test_root/releases/candidate" "$installed_release"
for script in backup.sh restore-check.sh db-export.sh db-transfer.sh db-provision-roles.sh; do
  cp -p "$repo_dir/scripts/$script" "$installed_release/scripts/$script"
done
cp -p "$repo_dir/scripts/lib/application-db.sh" "$installed_release/scripts/lib/"
export RESTIC_TEST_CACHE="$test_root/restic-cache"
restic() { command restic --cache-dir "$RESTIC_TEST_CACHE" "$@"; }
export -f restic
export DB_ENV=test DB_PROJECT="infraege-db-test-$$"
source_name="$DB_PROJECT-source"
target_name="$DB_PROJECT-target"
source_volume="$source_name-data"
target_volume="$target_name-data"
transfer_volume="${DB_PROJECT}_postgres18-data"
cleanup() {
  docker rm -f "$source_name" "$target_name" >/dev/null 2>&1 || true
  docker volume rm "$source_volume" "$target_volume" "$transfer_volume" >/dev/null 2>&1 || true
  rm -rf -- "$test_root"
}
trap cleanup EXIT
export POSTGRES_PASSWORD DB_RUNTIME_PASSWORD DB_IMPORT_PASSWORD DB_MIGRATION_PASSWORD DB_BACKUP_PASSWORD
for credential in POSTGRES_PASSWORD DB_RUNTIME_PASSWORD DB_IMPORT_PASSWORD DB_MIGRATION_PASSWORD DB_BACKUP_PASSWORD; do
  printf -v "$credential" '%s' "$(od -An -N24 -tx1 /dev/urandom | tr -d ' \n')"
done
env_file="$test_root/environment"
{
  printf 'POSTGRES_USER=infraege\nPOSTGRES_DB=infraege\n'
  for credential in POSTGRES_PASSWORD DB_RUNTIME_PASSWORD DB_IMPORT_PASSWORD DB_MIGRATION_PASSWORD DB_BACKUP_PASSWORD; do
    printf '%s=%s\n' "$credential" "${!credential}"
  done
} >"$env_file"
chmod 600 "$env_file"
docker volume create "$source_volume" >/dev/null
docker volume create "$target_volume" >/dev/null
docker run -d --name "$source_name" --network none   --label "com.docker.compose.project=$DB_PROJECT" --label com.docker.compose.service=postgres   --mount "type=volume,source=$source_volume,target=/var/lib/postgresql/data"   --mount "type=bind,source=$repo_dir/scripts/db-provision-roles.sh,target=/docker-entrypoint-initdb.d/10-roles.sh,readonly"   --env-file "$env_file"   postgres:16-alpine@sha256:57c72fd2a128e416c7fcc499958864df5301e940bca0a56f58fddf30ffc07777 >/dev/null
wait_sql() {
  local container=$1 role=$2
  for _attempt in $(seq 1 60); do
    if docker exec "$container" pg_isready -h 127.0.0.1 -U "$role" >/dev/null 2>&1; then return; fi
    sleep 1
  done
  echo 'fixture database did not become ready' >&2
  exit 1
}
wait_sql "$source_name" infraege
db_select
db_sql <<'SQL'
SET ROLE infraege_migration;
CREATE TABLE practice.fixture (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, payload jsonb NOT NULL, happened_at timestamptz NOT NULL);
RESET ROLE;
SET ROLE infraege_import;
INSERT INTO practice.fixture (payload,happened_at) VALUES ('{"text":"Проверка","n":16}', '2026-09-12T12:00:00+03:00'), ('{"n":18}', now());
RESET ROLE;
SQL
assert_roles() {
  local container=$1 admin=$2
  docker exec -i "$container" psql -X -qAt -U "$admin" -d infraege -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
IF EXISTS (SELECT FROM pg_roles WHERE rolname IN ('infraege_runtime','infraege_import','infraege_migration','infraege_backup')
AND (rolsuper OR rolcreatedb OR rolcreaterole OR rolbypassrls)) THEN RAISE EXCEPTION 'elevated app role'; END IF;
IF NOT has_table_privilege('infraege_runtime','practice.fixture','SELECT')
OR has_table_privilege('infraege_runtime','practice.fixture','INSERT')
OR has_schema_privilege('infraege_runtime','practice','CREATE')
OR has_database_privilege('infraege_runtime','infraege','TEMP')
THEN RAISE EXCEPTION 'runtime privileges wrong'; END IF;
IF NOT has_table_privilege('infraege_import','practice.fixture','INSERT')
OR has_schema_privilege('infraege_import','practice','CREATE')
THEN RAISE EXCEPTION 'import privileges wrong'; END IF;
IF NOT has_table_privilege('infraege_backup','practice.fixture','SELECT')
OR has_table_privilege('infraege_backup','practice.fixture','UPDATE')
THEN RAISE EXCEPTION 'backup privileges wrong'; END IF;
END $$;
SQL
}
assert_roles "$source_name" infraege
mkdir "$test_root/backups"
export BACKUP_ROOT="$test_root/backups" RESTIC_REPOSITORY="$test_root/repository"
export RESTIC_PASSWORD_FILE="$test_root/restic-password" RESTIC_LOCK_FILE="$test_root/restic.lock"
export BACKUP_STATUS_FILE="$test_root/backup-status.json" RESTORE_STATUS_FILE="$test_root/restore-status.json"
printf '%s' "$POSTGRES_PASSWORD" >"$RESTIC_PASSWORD_FILE"
bash "$installed_release/scripts/backup.sh" "$env_file"
printf 'isolated operations-tag sentinel\n' >"$test_root/ops-fixture"
restic backup --tag infraege-ops "$test_root/ops-fixture" >/dev/null
DB_ENV=restore DB_PROJECT=infraege-restore bash "$installed_release/scripts/restore-check.sh"
jq -e '.status=="success" and .format==1' "$RESTORE_STATUS_FILE" >/dev/null
bash "$repo_dir/scripts/check-backup-freshness.sh" --backup
bash "$repo_dir/scripts/check-backup-freshness.sh" --restore
DB_ENV=prod DB_PROJECT=infraege bash "$installed_release/scripts/db-export.sh" "$test_root/export"
RESTIC_REPOSITORY="$test_root/export" restic snapshots --json |
  jq -e 'length == 1 and .[0].tags == ["infraege-application"]' >/dev/null
restic restore latest --tag infraege-application --target "$test_root/unpacked" >/dev/null
bundle=$(dirname -- "$(find "$test_root/unpacked" -name metadata.json -type f)")
db_validate_bundle "$bundle"
# Restore again for target-write and ownership/privilege evidence.
docker run -d --name "$target_name" --network none   --label com.infraege.db-purpose=restore --label "com.docker.compose.project=$DB_PROJECT"   --mount "type=volume,source=$target_volume,target=/var/lib/postgresql"   --env POSTGRES_USER=restore_admin --env POSTGRES_DB=postgres --env POSTGRES_PASSWORD   --env PGDATA=/var/lib/postgresql/18/docker "$DB_IMAGE" >/dev/null
wait_sql "$target_name" restore_admin
db_restore_bundle "$bundle" "$target_name"
assert_roles "$target_name" restore_admin
if db_restore_bundle "$bundle" "$source_name" >/dev/null 2>&1; then
  echo 'non-disposable destination accepted' >&2; exit 1
fi
if db_restore_bundle "$bundle" "$target_name" >/dev/null 2>&1; then
  echo 'populated restore destination accepted' >&2; exit 1
fi
docker exec "$target_name" psql -X -q -U restore_admin -d infraege -v ON_ERROR_STOP=1 -c   "SET ROLE infraege_import; INSERT INTO practice.fixture(payload,happened_at) VALUES ('{}',now());"
[[ $(docker exec "$source_name" psql -X -At -U infraege -d infraege -c 'SELECT count(*) FROM practice.fixture') == 2 ]]
[[ $(docker exec "$target_name" psql -X -At -U restore_admin -d infraege -c 'SELECT count(*) FROM practice.fixture') == 3 ]]
# A source return before writes was equal; after writes its two rows are stale.
export DEPLOY_SHA=0000000000000000000000000000000000000113 DB_REHEARSAL_STATE_DIR="$test_root"
bash "$installed_release/scripts/db-transfer.sh" --rehearse "$env_file"
jq -e '.status == "prepared" and .targetMajor == 18' "$test_root/db-transfer.json" >/dev/null
restic snapshots --tag infraege-ops --json | jq -e 'length == 1' >/dev/null
if bash "$installed_release/scripts/db-transfer.sh" --rehearse "$env_file" >/dev/null 2>&1; then
  echo 'transfer overwrote a retained candidate volume' >&2; exit 1
fi
[[ $(docker exec "$source_name" psql -X -At -U infraege -d infraege -c 'SELECT count(*) FROM practice.fixture') == 2 ]]
printf 'corruption' >>"$bundle/application.dump"
if db_validate_bundle "$bundle" >/dev/null 2>&1; then echo 'corrupt bundle accepted' >&2; exit 1; fi
if DB_ENV=prod DB_PROJECT=infraege bash "$repo_dir/scripts/restore-check.sh" >/dev/null 2>&1; then
  echo 'production destination accepted' >&2; exit 1
fi
RESTIC_REPOSITORY="$test_root/export" restic check --read-data >/dev/null
echo 'practice DB nonempty PG16 -> PG18, roles, restore, export and rejection contracts: PASS'
