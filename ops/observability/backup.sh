#!/usr/bin/env bash
set -Eeuo pipefail

release_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
release=$(basename -- "$release_dir")
env_file=${1:-/etc/infraege/ops/$release.env}
backup_root=${OPS_BACKUP_ROOT:-/var/backups/infraege-ops}
restic_repo=${RESTIC_REPOSITORY:-/var/backups/infraege/restic}
restic_password_file=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
snapshot_tag=infraege-ops
restic_lock_file=${RESTIC_LOCK_FILE:-/run/lock/infraege-restic.lock}
backup_status_file=${OPS_BACKUP_STATUS_FILE:-/var/lib/infraege-ops/backup-status.json}

export RESTIC_REPOSITORY=$restic_repo
export RESTIC_PASSWORD_FILE=$restic_password_file
install -d -m 755 "$(dirname -- "$restic_lock_file")" "$(dirname -- "$backup_status_file")"
install -d -m 700 "$backup_root"
exec 9>"$restic_lock_file"
flock -n 9 || { echo 'another infraege Restic job is running' >&2; exit 1; }

compose=(docker compose --env-file "$env_file" --project-name infraege-ops
  -f "$release_dir/compose.yml")
work_dir=$(mktemp -d "$backup_root/work.XXXXXX")
trap 'rm -rf -- "$work_dir"' EXIT

OPS_RELEASE=$release "${compose[@]}" exec -T postgres pg_dump -U umami -Fc umami \
  > "$work_dir/umami.dump"
mkdir -p "$work_dir/beszel-data"
OPS_RELEASE=$release "${compose[@]}" cp beszel:/beszel_data/. "$work_dir/beszel-data"
cp "$env_file" "$work_dir/operations.env"
chmod 600 "$work_dir/operations.env"

if ! restic snapshots >/dev/null 2>&1; then
  restic init
fi
restic backup --tag "$snapshot_tag" "$work_dir"
restic forget --tag "$snapshot_tag" --keep-daily 7 --keep-weekly 4 --keep-monthly 3 --prune

snapshot_id=$(restic snapshots --tag "$snapshot_tag" --json | jq -er '
  if length > 0 then max_by(.time).id else error("no snapshots") end
')
jq -n \
  --arg status success \
  --arg completedAt "$(date --utc +%FT%TZ)" \
  --arg snapshotId "$snapshot_id" \
  '{status:$status,completedAt:$completedAt,snapshotId:$snapshotId,maxAgeHours:36}' \
  > "$backup_status_file"
chmod 644 "$backup_status_file"
