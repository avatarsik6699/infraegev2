#!/usr/bin/env bash
# Shared disposable half of the account-schema cutover rehearsal.
# Callers must authenticate inputs and establish protected-host guards before invoking this file.

cutover_wait_postgres() {
  local container=$1
  for _attempt in $(seq 1 60); do
    if docker exec "$container" pg_isready -h 127.0.0.1 -U restore_admin >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  db_fail 'isolated PostgreSQL failed to become ready'
  return 1
}

cutover_create_isolated() {
  local container=$1 volume=$2 database=$3 assets=$4
  ! docker volume inspect "$volume" >/dev/null 2>&1 || {
    db_fail 'isolated volume name already exists'; return 1;
  }
  docker volume create --label com.infraege.db-purpose=restore "$volume" >/dev/null
  if [[ $container == "$CUTOVER_FIRST" ]]; then
    CUTOVER_CREATED_FIRST_VOLUME=true
  else
    CUTOVER_CREATED_SECOND_VOLUME=true
  fi
  local mount_args=()
  if [[ -n $assets ]]; then
    mount_args=(--mount "type=bind,source=$assets,target=/task-files,readonly")
  fi
  docker run --detach --name "$container" --network none \
    --label com.infraege.db-purpose=restore \
    --label "com.docker.compose.project=$CUTOVER_PROJECT" \
    --label com.docker.compose.service=postgres \
    --label "com.infraege.version=$CUTOVER_CANDIDATE_SHA" \
    --mount "type=volume,source=$volume,target=/var/lib/postgresql" \
    "${mount_args[@]}" \
    --env POSTGRES_USER=restore_admin --env "POSTGRES_DB=$database" \
    --env "POSTGRES_PASSWORD=$CUTOVER_ADMIN_PASSWORD" \
    --env PGDATA=/var/lib/postgresql/18/docker "$DB_IMAGE" >/dev/null
  if [[ $container == "$CUTOVER_FIRST" ]]; then
    CUTOVER_CREATED_FIRST=true
  else
    CUTOVER_CREATED_SECOND=true
  fi
  cutover_wait_postgres "$container"
}

cutover_cleanup_disposable() {
  local status=0
  if ${CUTOVER_CREATED_SECOND:-false}; then docker rm --force "$CUTOVER_SECOND" >/dev/null || status=1; fi
  if ${CUTOVER_CREATED_FIRST:-false}; then docker rm --force "$CUTOVER_FIRST" >/dev/null || status=1; fi
  if ${CUTOVER_CREATED_SECOND_VOLUME:-false}; then docker volume rm "$CUTOVER_SECOND_VOLUME" >/dev/null || status=1; fi
  if ${CUTOVER_CREATED_FIRST_VOLUME:-false}; then docker volume rm "$CUTOVER_FIRST_VOLUME" >/dev/null || status=1; fi
  rm -rf -- "$CUTOVER_WORK_DIR" || status=1
  return "$status"
}

cutover_disposable_phase() {
  : "${CUTOVER_REPO_DIR:?}" "${CUTOVER_SNAPSHOT_ID:?}" "${CUTOVER_WORK_DIR:?}"
  : "${CUTOVER_PROJECT:?}" "${CUTOVER_FIRST:?}" "${CUTOVER_SECOND:?}"
  : "${CUTOVER_FIRST_VOLUME:?}" "${CUTOVER_SECOND_VOLUME:?}" "${CUTOVER_CANDIDATE_SHA:?}"
  : "${CUTOVER_IMAGE:?}" "${CUTOVER_IMAGE_ID:?}" "${CUTOVER_ENV_FILE:?}"
  : "${CUTOVER_CURRENT_RELEASE:?}" "${CUTOVER_ADMIN_PASSWORD:?}"

  restic restore "$CUTOVER_SNAPSHOT_ID" --target "$CUTOVER_WORK_DIR/source-snapshot" >/dev/null
  local manifests=()
  mapfile -t manifests < <(find "$CUTOVER_WORK_DIR/source-snapshot" -type f -name metadata.json -print)
  [[ ${#manifests[@]} == 1 ]] || { db_fail 'requested snapshot must restore exactly one bundle'; return 1; }
  local source_bundle
  source_bundle=$(dirname -- "${manifests[0]}")
  [[ $source_bundle == "$CUTOVER_WORK_DIR/source-snapshot/"* && ! -L $source_bundle ]] || {
    db_fail 'restored bundle escaped the owned snapshot target'; return 1;
  }
  db_validate_bundle "$source_bundle"
  local metadata="$source_bundle/metadata.json"
  # Read by the sourcing production wrapper for its post-drill release re-attestation.
  # shellcheck disable=SC2034
  CUTOVER_SOURCE_METADATA=$metadata
  jq -e --arg schema 122_01 '
    .environment == "prod" and .project == "infraege" and .schemaVersion == $schema and
    (.release | test("^[a-f0-9]{40}$"))
  ' "$metadata" >/dev/null || { db_fail 'authenticated snapshot is not a production 122_01 bundle'; return 1; }
  [[ $(<"$CUTOVER_CURRENT_RELEASE") == "$(jq -r '.release' "$metadata")" ]] || {
    db_fail 'production release changed since source snapshot'; return 1;
  }

  cutover_create_isolated "$CUTOVER_FIRST" "$CUTOVER_FIRST_VOLUME" postgres "$source_bundle/task-files"
  db_restore_bundle "$source_bundle" "$CUTOVER_FIRST"
  db_restore_practice_smoke "$source_bundle" "$CUTOVER_FIRST"

  docker rm --force "$CUTOVER_FIRST" >/dev/null
  CUTOVER_CREATED_FIRST=false
  docker run --detach --name "$CUTOVER_FIRST" --network none \
    --label com.infraege.db-purpose=restore \
    --label "com.docker.compose.project=$CUTOVER_PROJECT" \
    --label com.docker.compose.service=postgres \
    --label "com.infraege.version=$CUTOVER_CANDIDATE_SHA" \
    --mount "type=volume,source=$CUTOVER_FIRST_VOLUME,target=/var/lib/postgresql" \
    --mount "type=bind,source=$source_bundle/task-files,target=/task-files,readonly" \
    --env POSTGRES_USER=restore_admin --env POSTGRES_DB=infraege \
    --env "POSTGRES_PASSWORD=$CUTOVER_ADMIN_PASSWORD" \
    --env PGDATA=/var/lib/postgresql/18/docker "$DB_IMAGE" >/dev/null
  CUTOVER_CREATED_FIRST=true
  cutover_wait_postgres "$CUTOVER_FIRST"

  docker run --rm --network "container:$CUTOVER_FIRST" \
    --mount "type=bind,source=$CUTOVER_REPO_DIR/scripts/db-provision-roles.sh,target=/db-provision-roles.sh,readonly" \
    --env POSTGRES_USER=restore_admin --env POSTGRES_DB=infraege \
    --env POSTGRES_PASSWORD --env DB_RUNTIME_PASSWORD --env DB_IMPORT_PASSWORD \
    --env DB_MIGRATION_PASSWORD --env DB_BACKUP_PASSWORD --env DB_APP_PASSWORD \
    --env PGHOST=127.0.0.1 --env "PGPASSWORD=$CUTOVER_ADMIN_PASSWORD" \
    --entrypoint /bin/bash "$DB_IMAGE" /db-provision-roles.sh >/dev/null
  docker run --rm --network "container:$CUTOVER_FIRST" \
    --env "MIGRATION_DATABASE_URL=postgresql://infraege_migration:$DB_MIGRATION_PASSWORD@127.0.0.1:5432/infraege" \
    --entrypoint /bin/sh "$CUTOVER_IMAGE_ID" -ec '.venv/bin/alembic upgrade head'
  [[ $(docker image inspect "$CUTOVER_IMAGE" --format '{{.Id}}') == "$CUTOVER_IMAGE_ID" ]] || {
    db_fail 'candidate image changed during rehearsal'; return 1;
  }

  docker exec -i "$CUTOVER_FIRST" psql -X -q -U restore_admin -d infraege -v ON_ERROR_STOP=1 \
    <"$CUTOVER_REPO_DIR/scripts/sql/account-cutover-fixture.sql"
  PRACTICE_TEST_IMAGE="$CUTOVER_IMAGE" python3 "$CUTOVER_REPO_DIR/scripts/application_db.py" bundle \
    "$CUTOVER_FIRST" "$CUTOVER_WORK_DIR/candidate-bundle" "$CUTOVER_ENV_FILE" test "$CUTOVER_PROJECT"
  [[ $(jq -r '.schemaVersion' "$CUTOVER_WORK_DIR/candidate-bundle/metadata.json") == 140_01 ]] || {
    db_fail 'candidate backup does not contain 140_01'; return 1;
  }
  docker rm --force "$CUTOVER_FIRST" >/dev/null
  CUTOVER_CREATED_FIRST=false
  docker volume rm "$CUTOVER_FIRST_VOLUME" >/dev/null
  CUTOVER_CREATED_FIRST_VOLUME=false

  cutover_create_isolated "$CUTOVER_SECOND" "$CUTOVER_SECOND_VOLUME" postgres ''
  db_restore_bundle "$CUTOVER_WORK_DIR/candidate-bundle" "$CUTOVER_SECOND"
  db_restore_practice_smoke "$CUTOVER_WORK_DIR/candidate-bundle" "$CUTOVER_SECOND"
  [[ $(docker exec -i "$CUTOVER_SECOND" psql -X -qAt -U restore_admin -d infraege \
    -v ON_ERROR_STOP=1 <"$CUTOVER_REPO_DIR/scripts/sql/account-cutover-assert.sql") == fixture-ok ]] || {
    db_fail 'synthetic account data did not survive candidate restore'; return 1;
  }
}
