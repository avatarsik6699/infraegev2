#!/usr/bin/env bash
set -Eeuo pipefail

backup_root=${OPS_BACKUP_ROOT:-/var/backups/infraege-ops}
export RESTIC_REPOSITORY=${RESTIC_REPOSITORY:-/var/backups/infraege/restic}
export RESTIC_PASSWORD_FILE=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
snapshot_tag=infraege-ops
restic_lock_file=${RESTIC_LOCK_FILE:-/run/lock/infraege-restic.lock}
work_dir=$(mktemp -d "$backup_root/restore.XXXXXX")
container_name="infraege-ops-restore-check-$$"

cleanup() {
  docker rm --force "$container_name" >/dev/null 2>&1 || true
  rm -rf -- "$work_dir"
}
trap cleanup EXIT

install -d -m 755 "$(dirname -- "$restic_lock_file")"
exec 9>"$restic_lock_file"
flock -n 9 || { echo 'another infraege Restic job is running' >&2; exit 1; }
restic restore latest --tag "$snapshot_tag" --target "$work_dir"
umami_dump=$(find "$work_dir" -type f -name umami.dump -print -quit)
beszel_data=$(find "$work_dir" -type d -name beszel-data -print -quit)
[[ -n $umami_dump && -n $beszel_data ]] || {
  echo 'latest operations snapshot does not contain Umami and Beszel artifacts' >&2
  exit 1
}

docker run --detach --name "$container_name" \
  --env POSTGRES_PASSWORD=restore-check-only postgres:16-alpine >/dev/null
for _attempt in $(seq 1 30); do
  docker exec "$container_name" pg_isready -U postgres >/dev/null 2>&1 && break
  sleep 1
done
docker exec "$container_name" pg_isready -U postgres >/dev/null
docker exec "$container_name" psql -U postgres --set ON_ERROR_STOP=1 \
  --command 'CREATE ROLE umami NOLOGIN;'
docker exec "$container_name" createdb -U postgres -O umami umami_restore
docker cp "$umami_dump" "$container_name:/tmp/umami.dump"
docker exec "$container_name" pg_restore -U postgres --exit-on-error \
  -d umami_restore /tmp/umami.dump

echo 'Restore check passed for Umami and restored the Beszel state directory.'
