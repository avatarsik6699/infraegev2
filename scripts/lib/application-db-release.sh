#!/usr/bin/env bash

application_db_rollback() {
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
        up --detach --no-deps nginx web api
    else
      run_compose "$previous_release" "$previous_sha" up --detach --remove-orphans
    fi
  fi
}
