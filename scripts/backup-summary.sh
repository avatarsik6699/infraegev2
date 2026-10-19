#!/usr/bin/env bash
# Backup summary for the smotryashchiy BACKUPS ledger (Change 196; schema `smotryashchiy.backup/1`,
# smotryashchiy Change 29). Built only from the status files the backup jobs write, `df` and
# `systemctl`: no Restic access, no credentials, no snapshot contents. Runs hourly and when a job ends.
set -euo pipefail

backup_root=${BACKUP_ROOT:-/var/backups/infraege}
backup_status=${BACKUP_STATUS_FILE:-/var/lib/infraege/backup-status.json}
offsite_status=${OFFSITE_STATUS_FILE:-/var/lib/infraege/offsite-backup-status.json}
offsite_check_status=${OFFSITE_CHECK_STATUS_FILE:-/var/lib/infraege/offsite-check-status.json}
restore_status=${RESTORE_STATUS_FILE:-/var/lib/infraege/restore-status.json}
summary=${BACKUP_SUMMARY_FILE:-/var/lib/infraege/ops/backups.json}
units=(infraege-backup.service infraege-offsite-check.service infraege-restore-check.service)

# A status file, or null when the job has never written one.
status_of() {
  if [[ -r $1 ]]; then jq -c . "$1"; else echo null; fi
}

# systemctl exits non-zero when a unit is not installed; that is not a failed unit.
failed_units=$({ systemctl --failed --plain --no-legend "${units[@]}" 2>/dev/null || true; } |
  awk '{print $1}' | jq -R . | jq -sc .)
read -r disk_free disk_total < <(df -B1 --output=avail,size "$backup_root" | tail -1)

install -d -m 750 "$(dirname -- "$summary")"
tmp=$(mktemp "$summary.XXXXXX")
trap 'rm -f -- "$tmp"' EXIT
jq -n \
  --arg now "$(date --utc +%FT%TZ)" \
  --argjson local "$(status_of "$backup_status")" \
  --argjson offsite "$(status_of "$offsite_status")" \
  --argjson check "$(status_of "$offsite_check_status")" \
  --argjson drill "$(status_of "$restore_status")" \
  --arg disk_path "$backup_root" --argjson disk_free "$disk_free" --argjson disk_total "$disk_total" \
  --argjson failed "$failed_units" '
  # A job that never wrote a status reads as never completed; the first job is the primary backup.
  def job($name; $lbl; $s; $max):
    {name:$name, "label":$lbl, max_age_hours:($s.maxAgeHours // $max)} +
    (if $s == null then {status:"success", completed_at:null}
     else {status:$s.status, completed_at:$s.completedAt}
       + (if $s.durationSeconds == null then {} else {duration_seconds:$s.durationSeconds} end)
       + (if $s.source == null then {} else {source:$s.source} end)
     end);
  def repo($name; $s): if $s == null or $s.snapshots == null then empty
    else {name:$name, snapshots:$s.snapshots, size_bytes:$s.sizeBytes} end;
  {
    schema: "smotryashchiy.backup/1",
    generated_at: $now,
    jobs: [
      job("local"; "local backup"; $local; 36),
      job("offsite"; "off-site copy"; $offsite; 36),
      job("offsite.check"; "off-site check"; $check; 192),
      job("restore"; "restore drill"; $drill; 840)
    ],
    repositories: [repo("local"; $local), repo("offsite"; (if $offsite.snapshots != null then $offsite else $check end))],
    holds: [($local.holds // [])[] | {name, created_at:.createdAt, review_after_days:30}],
    disk: {path:$disk_path, free_bytes:$disk_free, total_bytes:$disk_total},
    failed_units: $failed
  }' >"$tmp"
chmod 640 "$tmp"
mv "$tmp" "$summary"
trap - EXIT
