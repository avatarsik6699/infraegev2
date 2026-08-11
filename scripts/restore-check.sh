#!/usr/bin/env bash
set -euo pipefail

backup_root=${BACKUP_ROOT:-/var/backups/infraege}
export RESTIC_REPOSITORY=${RESTIC_REPOSITORY:-$backup_root/restic}
export RESTIC_PASSWORD_FILE=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
work_dir=$(mktemp -d "$backup_root/restore.XXXXXX")
container_name="infraege-restore-check-$$"

cleanup() {
  docker rm --force "$container_name" >/dev/null 2>&1 || true
  rm -rf -- "$work_dir"
}
trap cleanup EXIT

restic restore latest --target "$work_dir"
application_dump=$(find "$work_dir" -type f -name application.dump -print -quit)
umami_dump=$(find "$work_dir" -type f -name umami.dump -print -quit)
[[ -n $application_dump && -n $umami_dump ]] || {
  echo "latest snapshot does not contain both PostgreSQL dumps" >&2
  exit 1
}

docker run --detach --name "$container_name" \
  --env POSTGRES_PASSWORD=restore-check-only postgres:16-alpine >/dev/null
for _attempt in $(seq 1 30); do
  docker exec "$container_name" pg_isready -U postgres >/dev/null 2>&1 && break
  sleep 1
done
docker exec "$container_name" pg_isready -U postgres >/dev/null

docker exec "$container_name" createdb -U postgres application_restore
docker cp "$application_dump" "$container_name:/tmp/application.dump"
docker exec "$container_name" pg_restore -U postgres --exit-on-error \
  -d application_restore /tmp/application.dump

docker exec "$container_name" createdb -U postgres umami_restore
docker exec "$container_name" psql -U postgres --set ON_ERROR_STOP=1 \
  --command 'CREATE ROLE umami NOLOGIN;'
docker cp "$umami_dump" "$container_name:/tmp/umami.dump"
docker exec "$container_name" pg_restore -U postgres --exit-on-error \
  -d umami_restore /tmp/umami.dump

echo "Restore check passed for application and Umami databases."
