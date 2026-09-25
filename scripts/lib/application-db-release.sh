#!/usr/bin/env bash

application_schema_preflight() {
  local candidate=$1 previous=$2 proof=$3
  local candidate_schema previous_schema
  candidate_schema=$(cat "$candidate/infra/database-schema")
  previous_schema=$(cat "$previous/infra/database-schema" 2>/dev/null || true)
  [[ $candidate_schema == 122_01 || $candidate_schema == 140_01 ]] || return 1
  # 140_01 is additive: a retained 122_01 application release can read its own task schema
  # after a failed activation. A first account-schema deployment still needs a fresh isolated
  # restore acceptance for this exact image before migration is allowed.
  if [[ $candidate_schema == 140_01 && $previous_schema == 140_01 ]]; then return 0; fi
  if [[ $candidate_schema == 122_01 && $previous_schema == 122_01 ]]; then return 0; fi
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
    curl --fail --silent --show-error --max-time 15 https://infraege.ru/health |
      jq -e --arg sha "$previous_sha" '.status == "ok" and .version == $sha' >/dev/null || return $?
    curl --fail --silent --show-error --max-time 15 https://infraege.ru/ >/dev/null || return $?
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
