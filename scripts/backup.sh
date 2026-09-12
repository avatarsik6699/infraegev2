#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
env_file=${1:-/etc/infraege/production.env}
backup_root=${BACKUP_ROOT:-/var/backups/infraege}
restic_repo=${RESTIC_REPOSITORY:-$backup_root/restic}
restic_password_file=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
snapshot_tag=infraege-application
restic_lock_file=${RESTIC_LOCK_FILE:-/run/lock/infraege-restic.lock}
backup_status_file=${BACKUP_STATUS_FILE:-/var/lib/infraege/backup-status.json}

umask 077
db_select

export RESTIC_REPOSITORY=$restic_repo
export RESTIC_PASSWORD_FILE=$restic_password_file
install -d -m 755 "$(dirname -- "$restic_lock_file")"
exec 9>"$restic_lock_file"
flock -n 9 || { echo 'another infraege Restic job is running' >&2; exit 1; }
work_dir=$(mktemp -d "$backup_root/work.XXXXXX")
trap 'rm -rf -- "$work_dir"' EXIT

db_bundle "$work_dir/bundle" "$env_file"

if ! restic snapshots >/dev/null 2>&1; then
  restic init
fi
restic backup --tag "$snapshot_tag" "$work_dir"
restic forget --tag "$snapshot_tag" --group-by host,tags \
  --keep-daily 7 --keep-weekly 4 --keep-monthly 3 --prune

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
