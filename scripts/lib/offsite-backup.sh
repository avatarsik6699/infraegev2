#!/usr/bin/env bash
# Off-site Restic repository (Change 196): the root-only credentials file, loading it without
# executing it, and the status files every off-site job writes. Sourced by backup.sh,
# offsite-check.sh and restore-check.sh; values are never printed.

offsite_env_file=${OFFSITE_ENV_FILE:-/etc/infraege/offsite-backup.env}
# Status paths are shared with the scripts that source this file.
# shellcheck disable=SC2034
offsite_status_file=${OFFSITE_STATUS_FILE:-/var/lib/infraege/offsite-backup-status.json}
# shellcheck disable=SC2034
offsite_check_status_file=${OFFSITE_CHECK_STATUS_FILE:-/var/lib/infraege/offsite-check-status.json}

# Absent file = off-site storage not set up yet; that is reported, not an error.
offsite_configured() {
  [[ -e $offsite_env_file || -L $offsite_env_file ]]
}

# Exports OFFSITE_RESTIC_REPOSITORY and the backend keys from KEY=VALUE lines. Only known keys are
# read and nothing is evaluated, so the file cannot run code. Owner root (the shell tests name
# their own uid), mode 600, a regular file.
offsite_load() {
  local line key value
  if [[ -L $offsite_env_file || ! -f $offsite_env_file ]]; then
    echo "off-site: $offsite_env_file must be a regular file" >&2
    return 1
  fi
  if [[ $(stat -c '%u:%a' "$offsite_env_file") != "${OFFSITE_ENV_OWNER:-0}:600" ]]; then
    echo "off-site: $offsite_env_file must be owned by root with mode 600" >&2
    return 1
  fi
  unset OFFSITE_RESTIC_REPOSITORY AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_DEFAULT_REGION
  while IFS= read -r line || [[ -n $line ]]; do
    [[ $line =~ ^[[:space:]]*(#|$) ]] && continue
    if [[ ! $line =~ ^(OFFSITE_RESTIC_REPOSITORY|AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_DEFAULT_REGION)=(.*)$ ]]; then
      echo "off-site: unexpected line in $offsite_env_file (only OFFSITE_RESTIC_REPOSITORY and AWS_* keys)" >&2
      return 1
    fi
    key=${BASH_REMATCH[1]}
    value=${BASH_REMATCH[2]}
    export "$key=$value"
  done <"$offsite_env_file"
  if [[ -z ${OFFSITE_RESTIC_REPOSITORY:-} || -z ${AWS_ACCESS_KEY_ID:-} || -z ${AWS_SECRET_ACCESS_KEY:-} ]]; then
    echo "off-site: $offsite_env_file needs OFFSITE_RESTIC_REPOSITORY, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY" >&2
    return 1
  fi
}

# Restic against the off-site repository; the password file is the one shared with the local one.
offsite_restic() {
  RESTIC_REPOSITORY=$OFFSITE_RESTIC_REPOSITORY restic "$@"
}

# offsite_write FILE STATUS MAX_AGE_HOURS [JSON_EXTRA]: one status file, replaced atomically.
offsite_write() {
  local tmp
  tmp=$(mktemp "$1.XXXXXX")
  jq -n --arg status "$2" --arg completedAt "$(date --utc +%FT%TZ)" --argjson maxAgeHours "$3" \
    --argjson extra "${4:-"{}"}" \
    '{status:$status, completedAt:$completedAt, maxAgeHours:$maxAgeHours} + $extra' >"$tmp"
  chmod 644 "$tmp"
  mv "$tmp" "$1"
}

# offsite_repository_facts: snapshot count and stored size of the off-site repository, as JSON.
offsite_repository_facts() {
  local snapshots size
  snapshots=$(offsite_restic snapshots --json --tag infraege-application | jq 'length') || return
  size=$(offsite_restic stats --json --mode raw-data | jq '.total_size') || return
  jq -n --argjson snapshots "$snapshots" --argjson size "$size" '{snapshots:$snapshots, sizeBytes:$size}'
}

# offsite_copy LOCAL_REPOSITORY SNAPSHOT_ID: copies every application snapshot the off-site
# repository lacks (a missed day catches up), proves the new one arrived, applies the local
# retention there too, and prints the off-site ID of the copied snapshot.
offsite_copy() {
  local local_repo=$1 snapshot_id=$2 copied
  if ! offsite_restic cat config >/dev/null 2>&1; then
    # Same chunker parameters as the local repository, so the copy deduplicates the same way.
    offsite_restic init --from-repo "$local_repo" --from-password-file "$RESTIC_PASSWORD_FILE" \
      --copy-chunker-params >/dev/null || return
  fi
  offsite_restic copy --from-repo "$local_repo" --from-password-file "$RESTIC_PASSWORD_FILE" \
    --tag infraege-application --quiet || return
  offsite_restic forget --tag infraege-application --group-by host,tags \
    --keep-daily 7 --keep-weekly 4 --keep-monthly 3 \
    --keep-tag infraege-recovery-hold --prune --quiet || return
  # A copy keeps its source ID as `original`; it must exist after retention, exactly once.
  copied=$(offsite_restic snapshots --json --tag infraege-application |
    jq -er --arg id "$snapshot_id" '[.[] | select(.original == $id or .id == $id) | .id] |
      if length == 1 then .[0] else error("copied snapshot missing or ambiguous") end') || return
  offsite_restic cat snapshot "$copied" >/dev/null || return
  printf '%s\n' "$copied"
}
