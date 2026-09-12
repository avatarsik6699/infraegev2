#!/usr/bin/env bash
# Invoked inside the application postgres container (also an initdb hook).
set -euo pipefail
: "${POSTGRES_USER:?bootstrap user required}"
: "${POSTGRES_DB:?application database required}"
: "${DB_RUNTIME_PASSWORD:?runtime password required}"
: "${DB_IMPORT_PASSWORD:?import password required}"
: "${DB_MIGRATION_PASSWORD:?migration password required}"
: "${DB_BACKUP_PASSWORD:?backup password required}"
[[ $POSTGRES_DB == infraege ]] || { echo 'unexpected application database' >&2; exit 64; }
for credential in DB_RUNTIME_PASSWORD DB_IMPORT_PASSWORD DB_MIGRATION_PASSWORD DB_BACKUP_PASSWORD; do
  [[ ${!credential} =~ ^[A-Za-z0-9_-]{16,}$ ]] || {
    echo 'application passwords require at least 16 URL-safe characters' >&2; exit 64;
  }
done
[[ $DB_RUNTIME_PASSWORD != "$POSTGRES_PASSWORD" &&
   $DB_IMPORT_PASSWORD != "$POSTGRES_PASSWORD" &&
   $DB_MIGRATION_PASSWORD != "$POSTGRES_PASSWORD" &&
   $DB_BACKUP_PASSWORD != "$POSTGRES_PASSWORD" &&
   $DB_RUNTIME_PASSWORD != "$DB_IMPORT_PASSWORD" &&
   $DB_RUNTIME_PASSWORD != "$DB_MIGRATION_PASSWORD" &&
   $DB_RUNTIME_PASSWORD != "$DB_BACKUP_PASSWORD" &&
   $DB_IMPORT_PASSWORD != "$DB_MIGRATION_PASSWORD" &&
   $DB_IMPORT_PASSWORD != "$DB_BACKUP_PASSWORD" &&
   $DB_MIGRATION_PASSWORD != "$DB_BACKUP_PASSWORD" ]] || {
  echo 'database credentials must be distinct' >&2; exit 64;
}
# Do not expose a failing password-bearing SQL statement in container/deploy logs.
if ! psql -X -q -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 >/dev/null 2>&1 <<'SQL'
BEGIN;
SELECT pg_advisory_xact_lock(113, 1);
SELECT format('CREATE ROLE %I NOLOGIN', role_name)
FROM unnest(ARRAY['infraege_runtime','infraege_import','infraege_migration','infraege_backup']) role_name
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = role_name) \gexec
\getenv runtime_password DB_RUNTIME_PASSWORD
\getenv import_password DB_IMPORT_PASSWORD
\getenv migration_password DB_MIGRATION_PASSWORD
\getenv backup_password DB_BACKUP_PASSWORD
ALTER ROLE infraege_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD :'runtime_password';
ALTER ROLE infraege_import LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD :'import_password';
ALTER ROLE infraege_migration LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD :'migration_password';
ALTER ROLE infraege_backup LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD :'backup_password';
REVOKE ALL ON DATABASE infraege FROM PUBLIC;
REVOKE ALL ON DATABASE postgres FROM PUBLIC;
REVOKE ALL ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE infraege TO infraege_runtime, infraege_import, infraege_migration, infraege_backup;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
CREATE SCHEMA IF NOT EXISTS practice AUTHORIZATION infraege_migration;
GRANT USAGE ON SCHEMA practice TO infraege_runtime, infraege_import, infraege_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA practice TO infraege_runtime, infraege_backup;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA practice TO infraege_import;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA practice TO infraege_import;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA practice TO infraege_backup;
ALTER DEFAULT PRIVILEGES FOR ROLE infraege_migration IN SCHEMA practice GRANT SELECT ON TABLES TO infraege_runtime, infraege_backup;
ALTER DEFAULT PRIVILEGES FOR ROLE infraege_migration IN SCHEMA practice GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO infraege_import;
ALTER DEFAULT PRIVILEGES FOR ROLE infraege_migration IN SCHEMA practice GRANT USAGE, SELECT ON SEQUENCES TO infraege_import;
ALTER DEFAULT PRIVILEGES FOR ROLE infraege_migration IN SCHEMA practice GRANT SELECT ON SEQUENCES TO infraege_backup;
ALTER DEFAULT PRIVILEGES FOR ROLE infraege_migration REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER ROLE infraege_runtime SET default_transaction_read_only = on;
COMMIT;
SQL
then
  echo 'application role provisioning failed; inspect ownership and credential inputs privately' >&2
  exit 1
fi
echo 'application roles provisioned'
