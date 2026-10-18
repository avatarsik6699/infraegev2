"""Reviewed read-only queries and restored role definitions."""

FINGERPRINT = r"""
SELECT format('SELECT %L || ''|'' || count(*) || ''|'' || coalesce(md5(string_agg(row_hash,
'''' ORDER BY row_hash)), md5('''')) FROM (SELECT md5(row_to_json(t)::text) row_hash FROM
%I.%I t) s', schemaname || '.' || tablename, schemaname, tablename)
FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema') ORDER BY
schemaname, tablename \gexec
"""

UNKNOWN_ROLES = r"""
SELECT DISTINCT r.rolname FROM pg_shdepend d JOIN pg_roles r ON r.oid=d.refobjid
WHERE d.dbid=(SELECT oid FROM pg_database WHERE datname=current_database())
AND d.refclassid='pg_authid'::regclass AND r.rolname NOT IN
('infraege','infraege_runtime','infraege_import','infraege_migration',
 'infraege_backup','infraege_app')
AND r.rolname NOT LIKE 'pg_%';
"""

ROLES = r"""
SELECT format('CREATE ROLE %I %s %s %s %s NOLOGIN;', rolname,
CASE WHEN rolsuper THEN 'SUPERUSER' ELSE 'NOSUPERUSER' END,
CASE WHEN rolcreatedb THEN 'CREATEDB' ELSE 'NOCREATEDB' END,
CASE WHEN rolcreaterole THEN 'CREATEROLE' ELSE 'NOCREATEROLE' END,
CASE WHEN rolbypassrls THEN 'BYPASSRLS' ELSE 'NOBYPASSRLS' END)
FROM pg_roles WHERE rolname IN
('infraege','infraege_runtime','infraege_import','infraege_migration',
 'infraege_backup','infraege_app') ORDER
BY rolname;
SELECT format('ALTER ROLE %I SET %I = %L;', rolname, split_part(setting,'=',1),
substr(setting,strpos(setting,'=')+1))
FROM pg_roles CROSS JOIN LATERAL unnest(rolconfig) setting WHERE rolname IN
('infraege','infraege_runtime','infraege_import','infraege_migration',
 'infraege_backup','infraege_app') ORDER
BY rolname,setting;
SELECT format('GRANT %I TO %I%s;', granted.rolname, member.rolname,
CASE WHEN m.admin_option THEN ' WITH ADMIN OPTION' ELSE '' END)
FROM pg_auth_members m JOIN pg_roles granted ON granted.oid=m.roleid JOIN pg_roles member ON
member.oid=m.member
WHERE granted.rolname IN
('infraege','infraege_runtime','infraege_import','infraege_migration','infraege_backup','infraege_app')
AND member.rolname IN
('infraege','infraege_runtime','infraege_import','infraege_migration','infraege_backup','infraege_app')
ORDER BY granted.rolname,member.rolname;
"""

SCHEMAS = r"""
SELECT nspname || '|' || pg_get_userbyid(nspowner) || '|' || coalesce(nspacl::text,'')
FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname <> 'information_schema' ORDER BY
nspname;
"""

REFERENCES = r"""
SELECT checksum || ' ' || size_bytes FROM practice.file_object ORDER BY checksum;
"""

ACTIVATE_RUNTIME = r"""
\getenv password RESTORE_RUNTIME_PASSWORD
ALTER ROLE infraege_runtime LOGIN PASSWORD :'password';
"""

ACCOUNT_RESTORE = r"""
WITH expected(tablename) AS (
  VALUES ('account_user'), ('account_identity'), ('account_password'), ('account_session'),
         ('account_token'), ('account_provider_challenge'), ('progress_result')
), actual AS (
  SELECT tablename FROM pg_tables WHERE schemaname = 'practice'
), answer_columns AS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'practice' AND table_name = 'progress_result'
    AND column_name ILIKE '%answer%'
)
SELECT (SELECT count(*) FROM expected) =
  (SELECT count(*) FROM expected JOIN actual USING (tablename))
  AND NOT EXISTS (SELECT 1 FROM answer_columns)
  AND has_schema_privilege('infraege_app', 'practice', 'USAGE')
  AND has_table_privilege(
    'infraege_app', 'practice.account_user', 'SELECT, INSERT, UPDATE, DELETE')
  AND has_table_privilege(
    'infraege_app', 'practice.account_identity', 'SELECT, INSERT, UPDATE, DELETE')
  AND has_table_privilege(
    'infraege_app', 'practice.account_password', 'SELECT, INSERT, UPDATE, DELETE')
  AND has_table_privilege(
    'infraege_app', 'practice.account_session', 'SELECT, INSERT, UPDATE, DELETE')
  AND has_table_privilege(
    'infraege_app', 'practice.account_token', 'SELECT, INSERT, UPDATE, DELETE')
  AND has_table_privilege(
    'infraege_app', 'practice.account_provider_challenge', 'SELECT, INSERT, UPDATE, DELETE')
  AND has_table_privilege(
    'infraege_app', 'practice.progress_result', 'SELECT, INSERT, UPDATE, DELETE')
  AND has_table_privilege('infraege_app', 'practice.task', 'SELECT')
  AND has_table_privilege('infraege_app', 'practice.task_checker', 'SELECT')
  AND has_table_privilege('infraege_app', 'practice.lesson_task', 'SELECT');
"""

# Change 192: payments, grants, refunds and provider events are evidence kept for 5 years. The
# application may add and update them but never delete; offer acceptances are append-only; the
# runtime and import roles see none of them.
BILLING_RESTORE = r"""
WITH expected(tablename) AS (
  VALUES ('billing_offer_acceptance'), ('billing_payment'), ('access_grant'),
         ('billing_refund'), ('billing_provider_event')
), actual AS (
  SELECT tablename FROM pg_tables WHERE schemaname = 'practice'
), evidence(name) AS (
  SELECT 'practice.' || tablename FROM expected
)
SELECT (SELECT count(*) FROM expected) =
  (SELECT count(*) FROM expected JOIN actual USING (tablename))
  AND has_table_privilege('infraege_app', 'practice.billing_offer_acceptance', 'SELECT, INSERT')
  AND NOT has_table_privilege('infraege_app', 'practice.billing_offer_acceptance', 'UPDATE')
  AND has_table_privilege('infraege_app', 'practice.billing_payment', 'SELECT, INSERT, UPDATE')
  AND has_table_privilege('infraege_app', 'practice.access_grant', 'SELECT, INSERT, UPDATE')
  AND has_table_privilege('infraege_app', 'practice.billing_refund', 'SELECT, INSERT, UPDATE')
  AND has_table_privilege(
    'infraege_app', 'practice.billing_provider_event', 'SELECT, INSERT, UPDATE')
  AND NOT EXISTS (
    SELECT 1 FROM evidence
    WHERE has_table_privilege('infraege_app', name, 'DELETE')
       OR has_table_privilege('infraege_app', name, 'TRUNCATE')
       OR has_table_privilege('infraege_runtime', name, 'SELECT')
       OR has_table_privilege('infraege_import', name, 'SELECT')
  );
"""
