#!/usr/bin/env bash
# Explicit release-only preparation. No destructive restore, cutover or volume deletion here.
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
case ${1:-}:${DB_ENV:-}:${DB_PROJECT:-} in
  --prepare-release:prod:infraege)
    [[ ${EUID:-$(id -u)} == 0 ]] || { db_fail 'installed release preparation requires root'; exit 1; }
    state_dir=/var/lib/infraege
    ;;
  --rehearse:test:infraege-db-test-*)
    : "${DB_REHEARSAL_STATE_DIR:?explicit local rehearsal state directory required}"
    state_dir=$DB_REHEARSAL_STATE_DIR
    ;;
  *) db_fail 'requires explicit release prod/infraege or isolated test rehearsal'; exit 64 ;;
esac
env_file=${2:?target environment required}
: "${DEPLOY_SHA:?release SHA required}"
[[ $DEPLOY_SHA =~ ^[0-9a-f]{40}$ ]] || exit 64
if [[ ${DB_DEPLOY_LOCK_HELD:-} != 1 ]]; then
  transfer_lock=/run/lock/infraege-deploy.lock
  [[ $DB_ENV != test ]] || transfer_lock="$state_dir/transfer.lock"
  exec 7>"$transfer_lock"
  flock -n 7 || { db_fail 'another deployment/transfer is active'; exit 1; }
fi
db_select
[[ $(db_sql <<<'SHOW server_version_num;') == 16* ]] || {
  db_fail 'source must be PG16'; exit 1;
}
# The release coordinator must already have stopped all current application writers.
[[ -z $(docker ps -q --filter "label=com.docker.compose.project=$DB_PROJECT" --filter label=com.docker.compose.service=api) &&
   -z $(docker ps -q --filter "label=com.docker.compose.project=$DB_PROJECT" --filter label=com.docker.compose.service=web) ]] || {
  db_fail 'stop application API/web writers before transfer'; exit 1;
}
volume="${DB_PROJECT}_postgres18-data"
container="$DB_PROJECT-transfer-$DEPLOY_SHA"
! docker volume inspect "$volume" >/dev/null 2>&1 || {
  db_fail 'PG18 volume exists; preserve it and review recovery, never overwrite'; exit 1;
}
# Require 30% free disk plus three database sizes for dump/target/WAL on the Docker filesystem.
size=$(db_sql <<<'SELECT pg_database_size(current_database());')
read -r total available < <(docker exec "$DB_CONTAINER" df -Pk /var/lib/postgresql | awk 'NR==2 {print $2,$4}')
(( available * 100 >= total * 30 && available * 1024 >= size * 3 )) || {
  db_fail 'insufficient disk headroom'; exit 1;
}
bash "$repo_dir/scripts/backup.sh" "$env_file"
work_dir=$(mktemp -d "${BACKUP_ROOT:-/var/backups/infraege}/transfer.XXXXXX")
created_container=false
cleanup() {
  if $created_container; then
    docker rm -f "$container" >/dev/null
    created_container=false
  fi
  # Keep both source and candidate volume on every failure for explicit recovery review.
  rm -rf -- "$work_dir"
}
trap cleanup EXIT
db_bundle "$work_dir/bundle" "$env_file"
db_validate_bundle "$work_dir/bundle"
docker volume create --label "com.docker.compose.project=$DB_PROJECT" \
  --label com.docker.compose.volume=postgres18-data \
  --label com.infraege.db-origin=logical-transfer "$volume" >/dev/null
docker run -d --name "$container" --network none   --label com.infraege.db-purpose=restore --label com.docker.compose.project=infraege-transfer   --mount "type=volume,source=$volume,target=/var/lib/postgresql"   --env-file "$env_file" --env POSTGRES_USER=restore_admin --env POSTGRES_DB=postgres   --env PGDATA=/var/lib/postgresql/18/docker "$DB_IMAGE" >/dev/null
created_container=true
for _attempt in $(seq 1 60); do
  docker exec "$container" pg_isready -h 127.0.0.1 -U restore_admin >/dev/null 2>&1 && break
  sleep 1
done
docker exec "$container" pg_isready -h 127.0.0.1 -U restore_admin >/dev/null
db_restore_bundle "$work_dir/bundle" "$container"
docker exec -i --env POSTGRES_DB=infraege "$container" bash <"$repo_dir/scripts/db-provision-roles.sh"
# The bootstrap owner was restored NOLOGIN, with no exported password hash.
if ! docker exec -i "$container" psql -X -q -U restore_admin -d infraege -v ON_ERROR_STOP=1 >/dev/null 2>&1 <<'SQL'
\getenv bootstrap_password POSTGRES_PASSWORD
ALTER ROLE infraege LOGIN PASSWORD :'bootstrap_password';
ALTER ROLE restore_admin NOLOGIN;
SQL
then
  db_fail 'target bootstrap activation failed'; exit 1
fi
cleanup
trap - EXIT
jq -n --arg release "$DEPLOY_SHA" --arg source "$DB_CONTAINER" --arg volume "$volume" \
  '{status:"prepared",release:$release,sourceContainer:$source,targetVolume:$volume,targetMajor:18}' \
  >"$state_dir/db-transfer.json"
echo 'PG18 candidate restored and verified; source volume retained. Release coordinator owns cutover.'
