#!/usr/bin/env bash

# Ordered schema heads; a transition is allowed only from the immediately previous head, or
# along a reviewed skip below.
APPLICATION_SCHEMAS=(122_01 140_01 191_01 192_01 198_01)
# Change 192: production runs 140_01 (191_01 was never released). Both later heads are
# additive, so one isolated rehearsal of 140_01 -> 192_01 proves the whole step.
# Change 198: neither 192_01 was released; one rehearsal of 140_01 -> 198_01 proves it.
APPLICATION_SKIPS=("140_01 192_01" "140_01 198_01")

application_known_schema() {
  local schema
  for schema in "${APPLICATION_SCHEMAS[@]}"; do [[ $1 == "$schema" ]] && return 0; done
  return 1
}

application_previous_schema() {
  local index
  for index in "${!APPLICATION_SCHEMAS[@]}"; do
    if [[ ${APPLICATION_SCHEMAS[$index]} == "$1" ]] && (( index > 0 )); then
      printf '%s\n' "${APPLICATION_SCHEMAS[$((index - 1))]}"
      return 0
    fi
  done
  return 1
}

# Whether a deployment may migrate from schema $1 to schema $2.
application_allowed_transition() {
  local skip
  [[ $(application_previous_schema "$2") == "$1" ]] && return 0
  for skip in "${APPLICATION_SKIPS[@]}"; do [[ $skip == "$1 $2" ]] && return 0; done
  return 1
}

application_backup_mode() {
  local candidate=$1 previous=$2 candidate_schema previous_schema
  candidate_schema=$(cat "$candidate/infra/database-schema") || return 1
  previous_schema=$(cat "$previous/infra/database-schema" 2>/dev/null || true)
  application_known_schema "$candidate_schema" || return 1
  if [[ $candidate_schema == "$previous_schema" ]]; then
    printf 'ordinary\n'
  else
    printf 'recovery-hold\n'
  fi
}

application_schema_preflight() {
  local candidate=$1 previous=$2 proof=$3
  local candidate_schema previous_schema
  candidate_schema=$(cat "$candidate/infra/database-schema")
  previous_schema=$(cat "$previous/infra/database-schema" 2>/dev/null || true)
  application_known_schema "$candidate_schema" || return 1
  # Each head is additive over its predecessor (140_01 accounts, 191_01 generated catalog
  # columns, 192_01 billing tables, 198_01 devices and restrictions; its narrower provider
  # CHECK only drops the never-enabled Telegram): a retained previous release reads its own
  # schema after a failed activation. A first deployment of a new head still needs a fresh isolated restore
  # acceptance for this exact image before migration is allowed.
  if [[ $candidate_schema == "$previous_schema" ]]; then return 0; fi
  application_allowed_transition "$previous_schema" "$candidate_schema" || return 1
  [[ -f $proof && $(stat -c '%u:%a' "$proof") == 0:600 &&
     $(cat "$proof") == "$candidate_schema $DEPLOY_SHA" ]] || {
    echo "Schema $candidate_schema requires explicit isolated restore acceptance for this exact SHA before deployment" >&2
    return 1
  }
}

application_db_rollback() {
  local previous_release=$1
  if [[ -n $previous_release && -r $previous_release/.deploy-sha ]]; then
    local previous_sha
    previous_sha=$(<"$previous_release/.deploy-sha")
    echo "Deploy failed; rolling back application to $previous_sha" >&2
    run_compose "$previous_release" "$previous_sha" up --detach --remove-orphans --wait --wait-timeout 180 || return $?
    curl --fail --silent --show-error --max-time 15 https://kodumka.ru/health |
      jq -e --arg sha "$previous_sha" '.status == "ok" and .version == $sha' >/dev/null || return $?
    curl --fail --silent --show-error --max-time 15 https://kodumka.ru/ >/dev/null || return $?
    # Maintenance must follow the restored database schema, including a first-cutover failure.
    ln -sfn "$previous_release" "${root:?}/current" || return $?
    ln -sfn "$previous_release" "$root/database-current" || return $?
  else
    echo 'No previous release available for automatic rollback' >&2
    return 1
  fi
}

# EXIT is a single process boundary: errors inside helpers and explicit exits all reach it.
# Disable it before recovery, so rollback failure never retries or replaces the original status.
application_deploy_exit() {
  local original_status=$1
  shift
  trap - EXIT INT TERM
  if (( original_status != 0 )); then
    if application_db_rollback "$@"; then
      echo 'Previous application release restored and verified' >&2
    else
      echo 'Rollback failed; manual recovery required. Database volumes were preserved.' >&2
    fi
  fi
  exit "$original_status"
}
