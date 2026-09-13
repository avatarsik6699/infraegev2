#!/usr/bin/env bash
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
: "${DB_ENV:?explicit DB_ENV required (restore)}"
: "${DB_PROJECT:?explicit DB_PROJECT required (infraege-restore)}"
[[ $DB_ENV == restore && $DB_PROJECT == infraege-restore ]] || {
  db_fail 'only disposable restore/infraege-restore destination accepted'; exit 64;
}
echo 'destination=restore project=infraege-restore source-tag=infraege-application'
backup_root=${BACKUP_ROOT:-/var/backups/infraege}
export RESTIC_REPOSITORY=${RESTIC_REPOSITORY:-$backup_root/restic}
export RESTIC_PASSWORD_FILE=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
exec 9>"${RESTIC_LOCK_FILE:-/run/lock/infraege-restic.lock}"
flock -n 9 || { db_fail 'another Restic job is running'; exit 1; }
work_dir=$(mktemp -d "$backup_root/restore.XXXXXX")
container_name="infraege-restore-check-$$"
volume_name="$container_name-data"
created_container=false
created_volume=false
cleanup() {
  if $created_container; then
    docker rm --force "$container_name" >/dev/null
    created_container=false
  fi
  if $created_volume; then
    docker volume rm "$volume_name" >/dev/null
    created_volume=false
  fi
  rm -rf -- "$work_dir"
}
trap cleanup EXIT
started=$SECONDS
restic restore latest --tag infraege-application --target "$work_dir"
mapfile -t manifests < <(find "$work_dir" -type f -name metadata.json)
[[ ${#manifests[@]} == 1 ]] || { db_fail 'expected one application bundle'; exit 1; }
bundle=$(dirname -- "${manifests[0]}")
db_validate_bundle "$bundle"
! docker volume inspect "$volume_name" >/dev/null 2>&1 || { db_fail 'restore volume already exists'; exit 1; }
docker volume create --label com.infraege.db-purpose=restore "$volume_name" >/dev/null
created_volume=true
export POSTGRES_PASSWORD
POSTGRES_PASSWORD=$(od -An -N24 -tx1 /dev/urandom | tr -d ' \n')
docker run --detach --name "$container_name" --network none   --label com.infraege.db-purpose=restore --label com.docker.compose.project=infraege-restore   --mount "type=volume,source=$volume_name,target=/var/lib/postgresql"   --env POSTGRES_USER=restore_admin --env POSTGRES_DB=postgres --env POSTGRES_PASSWORD   --env PGDATA=/var/lib/postgresql/18/docker "$DB_IMAGE" >/dev/null
created_container=true
for _attempt in $(seq 1 60); do
  docker exec "$container_name" pg_isready -h 127.0.0.1 -U restore_admin >/dev/null 2>&1 && break
  sleep 1
done
docker exec "$container_name" pg_isready -h 127.0.0.1 -U restore_admin >/dev/null
db_restore_bundle "$bundle" "$container_name"
db_restore_practice_smoke "$bundle" "$container_name"
cleanup
trap - EXIT
elapsed=$((SECONDS-started))
status_file=${RESTORE_STATUS_FILE:-/var/lib/infraege/restore-status.json}
jq -n --arg completedAt "$(date -u +%FT%TZ)" --argjson seconds "$elapsed"   '{status:"success",completedAt:$completedAt,durationSeconds:$seconds,maxAgeHours:840,format:1}' >"$status_file"
chmod 644 "$status_file"
echo "Application restore SQL verification passed in ${elapsed}s."
