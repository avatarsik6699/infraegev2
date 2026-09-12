#!/usr/bin/env bash
# Export an independently encrypted, portable Restic repository; password travels separately.
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
: "${DB_ENV:?explicit DB_ENV required}"
: "${DB_PROJECT:?explicit DB_PROJECT required}"
[[ $DB_ENV == prod && $DB_PROJECT == infraege ]] || {
  echo 'export selects installed application backup: prod/infraege required' >&2; exit 64;
}
echo 'environment=prod project=infraege source-tag=infraege-application'
destination=${1:?new absolute destination directory required}
[[ $destination == /* && ! -e $destination ]] || {
  echo 'export destination must be a new absolute path' >&2; exit 64;
}
export RESTIC_REPOSITORY=${RESTIC_REPOSITORY:-/var/backups/infraege/restic}
export RESTIC_PASSWORD_FILE=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}
exec 9>"${RESTIC_LOCK_FILE:-/run/lock/infraege-restic.lock}"
flock -n 9 || { echo 'another infraege Restic job is running' >&2; exit 1; }
snapshot=$(restic snapshots --tag infraege-application --json | jq -er 'max_by(.time).id')
[[ $snapshot =~ ^[0-9a-f]{64}$ ]] || { echo 'invalid snapshot identity' >&2; exit 1; }
work_dir=$(mktemp -d)
trap 'rm -rf -- "$work_dir"' EXIT
restic restore "$snapshot" --target "$work_dir" >/dev/null
mapfile -t manifests < <(find "$work_dir" -type f -name metadata.json)
[[ ${#manifests[@]} == 1 ]] || { db_fail 'export requires one complete application bundle'; exit 1; }
db_validate_bundle "$(dirname -- "${manifests[0]}")"
source_repository=$RESTIC_REPOSITORY
mkdir -m 700 "$destination"
RESTIC_REPOSITORY="$destination" restic init
RESTIC_REPOSITORY="$destination" restic copy --from-repo "$source_repository" \
  --from-password-file "$RESTIC_PASSWORD_FILE" "$snapshot"
RESTIC_REPOSITORY="$destination" restic check --read-data
echo 'Encrypted application export verified. Copy the entire directory; retain its password separately off VPS.'
