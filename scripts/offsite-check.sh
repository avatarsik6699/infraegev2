#!/usr/bin/env bash
# Weekly integrity check of the off-site Restic repository (Change 196): reads a sample of the
# stored data, so a damaged or silently truncated copy shows up before a restore needs it.
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/offsite-backup.sh"
export RESTIC_PASSWORD_FILE=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
umask 077
exec 9>"${RESTIC_LOCK_FILE:-/run/lock/infraege-restic.lock}"
flock -n 9 || { echo 'another infraege Restic job is running' >&2; exit 1; }
trap 'bash "$repo_dir/scripts/backup-summary.sh" >/dev/null 2>&1 || true' EXIT

if ! offsite_configured; then
  offsite_write "$offsite_check_status_file" not-configured 192
  exit 0
fi
started=$SECONDS
if ! offsite_load || ! offsite_restic check --read-data-subset=10% >/dev/null ||
  ! facts=$(offsite_repository_facts); then
  offsite_write "$offsite_check_status_file" failed 192
  echo 'off-site repository check failed' >&2
  exit 1
fi
offsite_write "$offsite_check_status_file" success 192 \
  "$(jq -cn --argjson seconds $((SECONDS - started)) --argjson facts "$facts" '{durationSeconds:$seconds} + $facts')"
