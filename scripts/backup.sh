#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
source "$repo_dir/scripts/lib/offsite-backup.sh"
[[ $# -le 2 && ( $# -lt 2 || $2 == --recovery-hold ) ]] || {
  echo "usage: $0 [ENV_FILE] [--recovery-hold]" >&2
  exit 64
}
env_file=${1:-/etc/infraege/production.env}
recovery_hold=false
[[ ${2:-} != --recovery-hold ]] || recovery_hold=true
backup_root=${BACKUP_ROOT:-/var/backups/infraege}
restic_repo=${RESTIC_REPOSITORY:-$backup_root/restic}
restic_password_file=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
snapshot_tag=infraege-application
recovery_hold_tag=infraege-recovery-hold
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
backup_output=$(mktemp "$backup_root/backup-output.XXXXXX")
# Whatever happens, the dashboard's backup summary (Change 196) is rewritten from the status files.
trap 'rm -rf -- "$work_dir"; rm -f -- "$backup_output"; bash "$repo_dir/scripts/backup-summary.sh" >/dev/null 2>&1 || true' EXIT

db_bundle "$work_dir/bundle" "$env_file"

# Change 224: only a repository that does not exist is initialised; a locked or unreadable one
# stops the backup. (2026-10-25: a stale lock failed `restic snapshots` and `init` was tried.)
if ! restic --no-lock cat config >/dev/null 2>&1; then
  restic init
fi
# A job killed mid-run (a lost deploy session) leaves a stale lock; the flock above proves no local
# Restic job runs, and `restic unlock` never removes a live lock.
restic unlock
backup_tags=(--tag "$snapshot_tag")
if [[ $recovery_hold == true ]]; then
  backup_tags+=(--tag "$recovery_hold_tag")
fi
restic backup --json "${backup_tags[@]}" "$work_dir" > "$backup_output"
snapshot_id=$(jq -ser '
  [.[] | select(.message_type == "summary") | .snapshot_id] |
  if length == 1 and (.[0] | type == "string" and test("^[0-9a-f]{64}$"))
  then .[0] else error("missing or ambiguous backup snapshot ID") end
' "$backup_output")
restic cat snapshot "$snapshot_id" | jq -e \
  --arg application "$snapshot_tag" --arg hold "$recovery_hold_tag" \
  --argjson protected "$recovery_hold" \
  '(.tags | index($application)) != null and
   (if $protected then (.tags | index($hold)) != null else true end)' >/dev/null
restic forget --tag "$snapshot_tag" --group-by host,tags \
  --keep-daily 7 --keep-weekly 4 --keep-monthly 3 \
  --keep-tag "$recovery_hold_tag" --prune

# A successful forget/prune is not proof that this exact pre-migration point survived.
restic cat snapshot "$snapshot_id" >/dev/null
snapshot_count=$(restic snapshots --json --tag "$snapshot_tag" | jq 'length')
repository_bytes=$(restic stats --json --mode raw-data | jq '.total_size')
holds=$(restic snapshots --json --tag "$recovery_hold_tag" | jq -c '[.[] | {name:.short_id, createdAt:.time}]')
jq -n \
  --arg status success \
  --arg completedAt "$(date --utc +%FT%TZ)" \
  --arg snapshotId "$snapshot_id" \
  --argjson recoveryHold "$recovery_hold" \
  --argjson snapshots "$snapshot_count" \
  --argjson sizeBytes "$repository_bytes" \
  --argjson holds "$holds" \
  '{status:$status,completedAt:$completedAt,snapshotId:$snapshotId,recoveryHold:$recoveryHold,maxAgeHours:36,
    snapshots:$snapshots,sizeBytes:$sizeBytes,holds:$holds}' \
  > "$backup_status_file"
chmod 644 "$backup_status_file"

# Off-site copy (Change 196). The local backup above stays valid whatever happens here; a failed
# copy records its failure and fails this run (and the systemd unit, or the deploy before migrating).
if ! offsite_configured; then
  offsite_write "$offsite_status_file" not-configured 36
  exit 0
fi
if ! offsite_load || ! offsite_snapshot=$(offsite_copy "$restic_repo" "$snapshot_id") ||
  ! offsite_facts=$(offsite_repository_facts); then
  offsite_write "$offsite_status_file" failed 36 "$(jq -cn --arg id "$snapshot_id" '{snapshotId:$id}')"
  echo 'off-site copy failed; the local backup succeeded' >&2
  exit 1
fi
offsite_write "$offsite_status_file" success 36 \
  "$(jq -cn --arg id "$snapshot_id" --arg offsite "$offsite_snapshot" --argjson facts "$offsite_facts" \
    '{snapshotId:$id, offsiteSnapshotId:$offsite} + $facts')"
