#!/usr/bin/env bash
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
source "$repo_dir/scripts/lib/offsite-backup.sh"
: "${DB_ENV:?explicit DB_ENV required (restore)}"
: "${DB_PROJECT:?explicit DB_PROJECT required (infraege-restore)}"
[[ $DB_ENV == restore && $DB_PROJECT == infraege-restore ]] || {
  db_fail 'only disposable restore/infraege-restore destination accepted'; exit 64;
}
backup_root=${BACKUP_ROOT:-/var/backups/infraege}
export RESTIC_REPOSITORY=${RESTIC_REPOSITORY:-$backup_root/restic}
export RESTIC_PASSWORD_FILE=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
# Change 196: the monthly drill reads the off-site copy once it exists, which proves that copy restores.
restore_source=${RESTORE_SOURCE:-auto}
case $restore_source in
  auto) if offsite_configured; then restore_source=offsite; else restore_source=local; fi ;;
  local | offsite) ;;
  *) db_fail 'RESTORE_SOURCE must be local, offsite or auto'; exit 64 ;;
esac
if [[ $restore_source == offsite ]]; then
  offsite_load || exit 1
  export RESTIC_REPOSITORY=$OFFSITE_RESTIC_REPOSITORY
fi
echo "destination=restore project=infraege-restore source-tag=infraege-application source=$restore_source"
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
  docker exec "$container_name" pg_isready -h 127.0.0.1 -U restore_admin -d postgres >/dev/null 2>&1 && break
  sleep 1
done
docker exec "$container_name" pg_isready -h 127.0.0.1 -U restore_admin -d postgres >/dev/null
db_restore_bundle "$bundle" "$container_name"
db_restore_practice_smoke "$bundle" "$container_name"
cleanup
trap - EXIT
elapsed=$((SECONDS-started))
status_file=${RESTORE_STATUS_FILE:-/var/lib/infraege/restore-status.json}
jq -n --arg completedAt "$(date -u +%FT%TZ)" --argjson seconds "$elapsed" --arg source "$restore_source" \
  '{status:"success",completedAt:$completedAt,durationSeconds:$seconds,maxAgeHours:840,format:1,source:$source}' >"$status_file"
chmod 644 "$status_file"
bash "$repo_dir/scripts/backup-summary.sh" >/dev/null 2>&1 || true
echo "Application restore SQL verification passed in ${elapsed}s."
