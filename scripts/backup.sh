#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
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
trap 'rm -rf -- "$work_dir"; rm -f -- "$backup_output"' EXIT

db_bundle "$work_dir/bundle" "$env_file"

if ! restic snapshots >/dev/null 2>&1; then
  restic init
fi
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
jq -n \
  --arg status success \
  --arg completedAt "$(date --utc +%FT%TZ)" \
  --arg snapshotId "$snapshot_id" \
  --argjson recoveryHold "$recovery_hold" \
  '{status:$status,completedAt:$completedAt,snapshotId:$snapshotId,recoveryHold:$recoveryHold,maxAgeHours:36}' \
  > "$backup_status_file"
chmod 644 "$backup_status_file"
