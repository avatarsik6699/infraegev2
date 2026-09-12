#!/usr/bin/env bash
set -euo pipefail

marker=${BACKUP_STATUS_FILE:-/var/lib/infraege/backup-status.json}
case ${1:---backup} in
  --backup) ;;
  --restore) marker=${RESTORE_STATUS_FILE:-/var/lib/infraege/restore-status.json} ;;
  *) echo 'usage: check-backup-freshness.sh [--backup|--restore]' >&2; exit 64 ;;
esac
[[ -r $marker ]] || { echo "backup marker is missing" >&2; exit 1; }
jq -e '.status == "success" and (.maxAgeHours | type == "number" and . > 0)' "$marker" >/dev/null

completed_at=$(jq -r '.completedAt' "$marker")
max_age_hours=$(jq -r '.maxAgeHours' "$marker")
completed_epoch=$(date --date "$completed_at" +%s)
now_epoch=$(date +%s)
age_seconds=$((now_epoch - completed_epoch))

if (( age_seconds < 0 || age_seconds > max_age_hours * 3600 )); then
  echo "latest backup is stale: $completed_at" >&2
  exit 1
fi

echo "latest backup is fresh: $completed_at"
