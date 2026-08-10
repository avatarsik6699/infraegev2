#!/usr/bin/env bash
set -euo pipefail

marker=${BACKUP_STATUS_FILE:-/var/lib/infraege/backup-status.json}
[[ -r $marker ]] || { echo "backup marker is missing" >&2; exit 1; }

completed_at=$(jq -r '.completedAt' "$marker")
max_age_hours=$(jq -r '.maxAgeHours' "$marker")
completed_epoch=$(date --date "$completed_at" +%s)
now_epoch=$(date +%s)
age_seconds=$((now_epoch - completed_epoch))

if (( age_seconds > max_age_hours * 3600 )); then
  echo "latest backup is stale: $completed_at" >&2
  exit 1
fi

echo "latest backup is fresh: $completed_at"
