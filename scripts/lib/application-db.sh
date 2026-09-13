#!/usr/bin/env bash
# Shared application-only selection and portable logical bundle contract.
export DB_IMAGE=postgres:18.6-alpine3.24@sha256:d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2

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

# Python owns structured data, snapshot consistency and recovery invariants. These adapters
# intentionally return the subprocess status even when invoked from an if/! shell context.
db_tool() { python3 "$(dirname -- "${BASH_SOURCE[0]}")/../application_db.py" "$@"; }
db_fingerprint() { db_tool fingerprint "$DB_CONTAINER"; }
db_bundle() { db_tool bundle "$DB_CONTAINER" "$1" "$2" "$DB_ENV" "$DB_PROJECT"; }
db_verify_files() { db_tool files "$1"; }
db_verify_references() { db_tool references "$1"; }
db_validate_bundle() { db_tool validate "$1"; }
db_restore_practice_smoke() { db_tool smoke "$1" "$2"; }
db_restore_bundle() { db_tool restore "$1" "$2"; }
