#!/usr/bin/env bash

application_practice_environment() (
  cd "$1/apps/api" || exit $?
  uv sync --frozen --no-dev
)

application_practice_import() (
  local candidate=$1 environment_file=$2
  set -a
  # Protected operator environment, already validated by the deployment coordinator.
  # shellcheck disable=SC1090
  source "$environment_file" || exit $?
  set +a
  export PRACTICE_RELEASE_ROOT="$candidate"
  cd "$candidate/apps/api" || exit $?
  uv run --frozen --no-sync python -m app.modules.practice.release \
    --environment prod --project infraege --backup-env "$environment_file"
)

application_practice_activate() {
  local candidate=$1 candidate_sha=$2 environment_file=$3
  run_compose "$candidate" "$candidate_sha" run --rm --no-deps db-migrate || return $?
  application_practice_import "$candidate" "$environment_file" || return $?
  run_compose "$candidate" "$candidate_sha" up --detach --remove-orphans --wait --wait-timeout 180
}

application_schema_preflight() {
  local candidate=$1 previous=$2 proof=$3 previous_sha
  [[ $(cat "$candidate/infra/database-schema") == 114_01 ]] || return 1
  [[ -n $previous ]] || return 0
  if [[ $(cat "$previous/infra/database-schema" 2>/dev/null || true) == 114_01 ]]; then return 0; fi
  previous_sha=$(<"$previous/.deploy-sha")
  [[ $previous_sha =~ ^[a-f0-9]{40}$ && -f $proof &&
     $(stat -c '%u:%a' "$proof") == 0:600 && $(cat "$proof") == "$previous_sha" ]] || {
    echo 'schema rollback compatibility proof for the exact previous SHA is required' >&2; return 1;
  }
}

application_db_rollback() {
  local previous_release=$1 release_dir=$2 env_file=$3 db_switched=$4
  if [[ -n $previous_release && -r $previous_release/.deploy-sha ]]; then
    local previous_sha
    previous_sha=$(<"$previous_release/.deploy-sha")
    echo "Deploy failed; rolling back application to $previous_sha" >&2
    if [[ $db_switched == true ]]; then
      # Never reapply the previous PostgreSQL definition or restore/downgrade its data.
      DEPLOY_SHA="$previous_sha" docker compose --env-file "$env_file" --project-name infraege \
        -f "$previous_release/infra/docker-compose.yml" \
        -f "$previous_release/infra/docker-compose.prod.yml" \
        -f "$release_dir/infra/docker-compose.db-rollback.yml" \
        up --detach --no-deps --wait --wait-timeout 180 nginx web api || return $?
    else
      run_compose "$previous_release" "$previous_sha" up --detach --remove-orphans --wait --wait-timeout 180 || return $?
    fi
    curl --fail --silent --show-error --max-time 15 https://infraege.ru/health |
      jq -e --arg sha "$previous_sha" '.status == "ok" and .version == $sha' >/dev/null || return $?
    curl --fail --silent --show-error --max-time 15 https://infraege.ru/ >/dev/null || return $?
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
