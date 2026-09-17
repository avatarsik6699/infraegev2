#!/usr/bin/env bash

application_schema_preflight() {
  local candidate=$1 previous=$2 proof=$3
  [[ $(cat "$candidate/infra/database-schema") == 122_01 ]] || return 1
  if [[ -n $previous && $(cat "$previous/infra/database-schema" 2>/dev/null || true) == 122_01 ]]; then return 0; fi
  [[ -f $proof && $(stat -c '%u:%a' "$proof") == 0:600 &&
     $(cat "$proof") == "122_01 $DEPLOY_SHA" ]] || {
    echo 'Change 122 requires explicit bank transfer/restore acceptance for this exact SHA before deployment' >&2
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
