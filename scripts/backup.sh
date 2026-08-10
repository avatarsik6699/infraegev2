#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
env_file=${1:-/etc/infraege/production.env}
backup_root=${BACKUP_ROOT:-/var/backups/infraege}
restic_repo=${RESTIC_REPOSITORY:-$backup_root/restic}
restic_password_file=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}

set -a
# shellcheck disable=SC1090
source "$env_file"
set +a
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"

export RESTIC_REPOSITORY=$restic_repo
export RESTIC_PASSWORD_FILE=$restic_password_file
compose=(docker compose --env-file "$env_file" --project-name infraege
  -f "$repo_dir/infra/docker-compose.yml" -f "$repo_dir/infra/docker-compose.prod.yml")
work_dir=$(mktemp -d "$backup_root/work.XXXXXX")
trap 'rm -rf -- "$work_dir"' EXIT

"${compose[@]}" exec -T postgres pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB" \
  > "$work_dir/application.dump"
"${compose[@]}" exec -T postgres pg_dump -U "$POSTGRES_USER" -Fc umami \
  > "$work_dir/umami.dump"
"${compose[@]}" cp beszel:/beszel_data/. "$work_dir/beszel-data"
cp "$env_file" "$work_dir/production.env"
chmod 600 "$work_dir/production.env"

if ! restic snapshots >/dev/null 2>&1; then
  restic init
fi
restic backup "$work_dir"
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 3 --prune

snapshot_id=$(restic snapshots --latest 1 --json | jq -r '.[0].short_id')
jq -n \
  --arg status success \
  --arg completedAt "$(date --utc +%FT%TZ)" \
  --arg snapshotId "$snapshot_id" \
  '{status:$status,completedAt:$completedAt,snapshotId:$snapshotId,maxAgeHours:36}' \
  > /var/lib/infraege/backup-status.json
chmod 644 /var/lib/infraege/backup-status.json
