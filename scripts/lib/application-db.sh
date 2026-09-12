#!/usr/bin/env bash
# Shared application-only selection and portable logical bundle contract.
DB_IMAGE=postgres:18.6-alpine3.24@sha256:d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2

db_fail() { echo "application DB: $*" >&2; return 1; }

db_select() {
  : "${DB_ENV:?explicit DB_ENV required}"
  : "${DB_PROJECT:?explicit DB_PROJECT required}"
  case "$DB_ENV:$DB_PROJECT" in
    dev:infraege-dev | test:infraege-full-gate | prod:infraege) ;;
    test:infraege-db-test-*) [[ $DB_PROJECT =~ ^infraege-db-test-[a-z0-9-]+$ ]] || return 1 ;;
    *) db_fail 'environment/project mismatch'; return 1 ;;
  esac
  DB_CONTAINER=$(docker ps -q --filter "label=com.docker.compose.project=$DB_PROJECT" \
    --filter label=com.docker.compose.service=postgres)
  [[ -n $DB_CONTAINER && $DB_CONTAINER != *$'\n'* ]] || {
    db_fail 'expected exactly one running application postgres'; return 1;
  }
  [[ $(docker exec "$DB_CONTAINER" sh -ec 'printf "%s" "$POSTGRES_DB"') == infraege ]] || {
    db_fail 'unexpected application database'; return 1;
  }
  printf 'environment=%s project=%s database=infraege\n' "$DB_ENV" "$DB_PROJECT"
}

db_sql() {
  docker exec -i "$DB_CONTAINER" sh -ec '
    export PGOPTIONS="-c statement_timeout=60000"
    exec psql -X -qAt -U "$POSTGRES_USER" -d infraege -v ON_ERROR_STOP=1
  '
}

db_fingerprint() {
  db_sql <<'SQL'
BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT format('SELECT %L || ''|'' || count(*) || ''|'' || coalesce(md5(string_agg(row_hash, '''' ORDER BY row_hash)), md5('''')) FROM (SELECT md5(row_to_json(t)::text) row_hash FROM %I.%I t) s', schemaname || '.' || tablename, schemaname, tablename)
FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema') ORDER BY schemaname, tablename \gexec
COMMIT;
SQL
}

db_bundle() {
  local bundle=$1 env_file=$2
  [[ -f $env_file && $(stat -c %a "$env_file") == 600 ]] || {
    db_fail 'bundle environment file must exist with mode 600'; return 1;
  }
  [[ $(db_sql <<<'SELECT pg_get_userbyid(datdba) FROM pg_database WHERE datname=current_database();') == infraege ]] || {
    db_fail 'unapproved application database owner'; return 1;
  }
  mkdir -m 700 "$bundle"
  # Refuse silently omitting a non-application owner or grantee. Never export shared globals.
  local unknown_roles
  unknown_roles=$(db_sql <<'SQL'
SELECT DISTINCT r.rolname FROM pg_shdepend d JOIN pg_roles r ON r.oid=d.refobjid
WHERE d.dbid=(SELECT oid FROM pg_database WHERE datname=current_database())
AND d.refclassid='pg_authid'::regclass AND r.rolname NOT IN
('infraege','infraege_runtime','infraege_import','infraege_migration','infraege_backup')
AND r.rolname NOT LIKE 'pg_%';
SQL
)
  [[ -z $unknown_roles ]] || { db_fail 'unapproved role dependency; inventory required'; return 1; }
  db_sql >"$bundle/roles.sql" <<'SQL'
SELECT format('CREATE ROLE %I %s %s %s %s NOLOGIN;', rolname,
CASE WHEN rolsuper THEN 'SUPERUSER' ELSE 'NOSUPERUSER' END,
CASE WHEN rolcreatedb THEN 'CREATEDB' ELSE 'NOCREATEDB' END,
CASE WHEN rolcreaterole THEN 'CREATEROLE' ELSE 'NOCREATEROLE' END,
CASE WHEN rolbypassrls THEN 'BYPASSRLS' ELSE 'NOBYPASSRLS' END)
FROM pg_roles WHERE rolname IN
('infraege','infraege_runtime','infraege_import','infraege_migration','infraege_backup') ORDER BY rolname;
SELECT format('ALTER ROLE %I SET %I = %L;', rolname, split_part(setting,'=',1), substr(setting,strpos(setting,'=')+1))
FROM pg_roles CROSS JOIN LATERAL unnest(rolconfig) setting WHERE rolname IN
('infraege','infraege_runtime','infraege_import','infraege_migration','infraege_backup') ORDER BY rolname,setting;
SELECT format('GRANT %I TO %I%s;', granted.rolname, member.rolname,
CASE WHEN m.admin_option THEN ' WITH ADMIN OPTION' ELSE '' END)
FROM pg_auth_members m JOIN pg_roles granted ON granted.oid=m.roleid JOIN pg_roles member ON member.oid=m.member
WHERE granted.rolname IN ('infraege','infraege_runtime','infraege_import','infraege_migration','infraege_backup')
AND member.rolname IN ('infraege','infraege_runtime','infraege_import','infraege_migration','infraege_backup')
ORDER BY granted.rolname,member.rolname;
SQL
  # SQL fingerprints are compared around the dump, so concurrent writes fail closed.
  # The release transfer stops writers; this foundation contains no runtime writers yet.
  db_fingerprint >"$bundle/data-checks.txt"
  docker exec "$DB_CONTAINER" sh -ec '
    if test -n "${DB_BACKUP_PASSWORD:-}"; then
      export PGPASSWORD="$DB_BACKUP_PASSWORD"
      exec pg_dump -h 127.0.0.1 -U infraege_backup --create -Fc "$POSTGRES_DB"
    fi
    exec pg_dump -U "$POSTGRES_USER" --create -Fc "$POSTGRES_DB"
  ' \
    >"$bundle/application.dump"
  db_fingerprint >"$bundle/data-after.txt"
  cmp -s "$bundle/data-checks.txt" "$bundle/data-after.txt" || {
    db_fail 'database changed during dump; stop writers and retry'; return 1;
  }
  rm "$bundle/data-after.txt"
  db_sql >"$bundle/schema.txt" <<'SQL'
SELECT nspname || '|' || pg_get_userbyid(nspowner) || '|' || coalesce(nspacl::text,'')
FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname <> 'information_schema' ORDER BY nspname;
SQL
  local server_version release source_image
  server_version=$(db_sql <<<'SHOW server_version_num;')
  release=$(docker inspect "$DB_CONTAINER" --format '{{index .Config.Labels "com.infraege.version"}}')
  if [[ -z $release ]]; then
    release=$(docker exec "$DB_CONTAINER" sh -ec 'printf "%s" "${DEPLOY_SHA:-unknown}"')
  fi
  [[ $DB_ENV != prod || $release =~ ^[0-9a-f]{40}$ ]] || {
    db_fail 'production release metadata is unknown'; return 1;
  }
  source_image=$(docker inspect "$DB_CONTAINER" --format '{{.Image}}')
  jq -n --arg environment "$DB_ENV" --arg project "$DB_PROJECT" --arg version "$server_version" \
    --arg release "$release" --arg image "$DB_IMAGE" --arg sourceImage "$source_image" --arg createdAt "$(date -u +%FT%TZ)" \
    '{format:1,database:"infraege",environment:$environment,project:$project,serverVersion:$version,
      release:$release,sourceImage:$sourceImage,restoreImage:$image,createdAt:$createdAt,schemaVersion:"pre-alembic",assets:"not-yet-introduced"}' \
    >"$bundle/metadata.json"
  cp "$env_file" "$bundle/production.env"
  chmod 600 "$bundle/production.env"
  (cd "$bundle" && sha256sum application.dump roles.sql data-checks.txt schema.txt metadata.json production.env >SHA256SUMS)
}

db_validate_bundle() {
  local bundle=$1 file
  for file in application.dump roles.sql data-checks.txt schema.txt metadata.json production.env SHA256SUMS; do
    [[ -f $bundle/$file && ! -L $bundle/$file ]] || {
      db_fail 'incomplete bundle or symlink'; return 1;
    }
  done
  (cd "$bundle" && sha256sum application.dump roles.sql data-checks.txt schema.txt metadata.json production.env) |
    cmp -s - "$bundle/SHA256SUMS" || { db_fail 'bundle checksum mismatch'; return 1; }
  jq -e --arg image "$DB_IMAGE" '.format == 1 and .database == "infraege" and
    .schemaVersion == "pre-alembic" and .restoreImage == $image' "$bundle/metadata.json" >/dev/null || {
    db_fail 'unsupported bundle/schema/image'; return 1;
  }
}

db_restore_bundle() {
  local bundle=$1 container=$2
  db_validate_bundle "$bundle"
  [[ $(docker inspect "$container" --format '{{index .Config.Labels "com.infraege.db-purpose"}}') == restore ]] || {
    db_fail 'restore destination lacks disposable identity'; return 1;
  }
  [[ $(docker inspect "$container" --format '{{index .Config.Labels "com.docker.compose.project"}}') != infraege ]] || {
    db_fail 'production restore destination rejected'; return 1;
  }
  [[ $(docker exec "$container" psql -X -At -U restore_admin -d postgres -c     "SELECT count(*) FROM pg_database WHERE datname='infraege'") == 0 ]] || {
    db_fail 'restore target already contains application database'; return 1;
  }
  docker exec -i "$container" psql -X -q -U restore_admin -d postgres -v ON_ERROR_STOP=1 <"$bundle/roles.sql"
  docker exec -i "$container" pg_restore -U restore_admin --exit-on-error --create -d postgres <"$bundle/application.dump"
  local DB_CONTAINER=$container
  db_fingerprint | cmp -s - "$bundle/data-checks.txt" || { db_fail 'restored data mismatch'; return 1; }
  db_sql <<'SQL' | cmp -s - "$bundle/schema.txt" || return 1
SELECT nspname || '|' || pg_get_userbyid(nspowner) || '|' || coalesce(nspacl::text,'')
FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname <> 'information_schema' ORDER BY nspname;
SQL
}
