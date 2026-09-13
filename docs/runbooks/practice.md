# Practice operator workflow

Change 114 implements the server model and tooling locally. Existing lessons still use legacy
task JSON until their coordinated cutover; this guide does not make an imported task appear in
those lessons or introduce the public practice catalog. No production transfer follows from work.

## Runtime and ownership

PostgreSQL 18 owns tasks, typed metadata, JSONB content, classifications, source records,
material/task links, independent record/solution revisions, append-only history and package
outcomes. `practice` is owned by `infraege_migration`. The application uses only
`infraege_runtime`; `infraege_import` has no DDL and cannot change migration/material records or
rewrite file objects/history/outcomes. Runtime has SELECT and no writes. There is no attempt log.

Current normalized task/checker/relation rows are the runtime source. `TaskHistory.snapshot`
is append-only audit evidence, never the public read model. Public content has a concrete
`PublicTaskContent` type; its SQL projection never selects checker data. `EditPlan` is an explicit
immutable value. The pure answer comparator lives in `app/shared/checker.py` for both consumers.
CLI argument/error presentation stays in `cli.py`; `commands.py` owns host command orchestration.

`app/modules/practice/service.py` owns each package transaction. Writers acquire an advisory
lock and still check every expected revision; a competing stale update fails instead of replacing
the winner. Packages are bounded and processed one task/file at a time. There are no automatic
write retries or shared AsyncSessions. NullPool avoids retained connections across schema changes.

`infra/database-schema` and `SCHEMA_REVISION` declare the supported revision `114_01`.
The separate Compose `db-migrate` job invokes Alembic, then registers the release's materials;
API startup waits for successful completion. It never generates migrations at process startup.
`/health/ready` authenticates with the runtime role, takes a shared schema lock and executes SQL
against the version/task/checker tables with a two-second total deadline. `/health/live` is DB-independent.
Without a DB URL, only nonproduction host development retains the file-based readiness fallback.

## Material registry and migration maintenance

The application owns material IDs/sections; imports cannot invent them. Generate the release
registry after editing lesson publications or section anchors:

```bash
node scripts/practice-registry.mjs
pnpm exec prettier apps/api/practice-registry.json --write
node scripts/practice-registry.mjs --check
```

The generator reads publication modules and literal concept `id`/`navLabel` pairs in authored
TSX. It rejects unfamiliar shapes rather than guessing anchors. The generated JSON is copied
into the API image; CI checks drift without contacting a database. Registration adds identifiers
without deleting historical records or changing membership. Preflight rejects any active
membership/theory reference that the proposed application's registry cannot resolve.

For explicitly selected host development/test databases, use a separate
`MIGRATION_DATABASE_URL` with the migration role, never runtime/import/bootstrap credentials:

```bash
cd apps/api
uv sync --frozen
uv run alembic upgrade head
uv run alembic current
uv run alembic check
```

The URL must name `infraege` and an explicit host, without connection query overrides. Alembic
rejects other PostgreSQL majors and concurrent schema operations. Migration files are reviewed,
named, versioned and included in Ruff/Pyright/formatting. `downgrade` refuses destructive recovery.
No tool resets production or automatically removes old volumes. Local tests use the dedicated
host runner, not these commands against an arbitrarily selected database.

## Host CLI setup

Run the operator CLI on the selected host with uv, Docker, Restic, jq and the installed release
sources. On the VPS, use `/opt/infraege/database-current/apps/api` and `uv sync --frozen --no-dev`.
Use the same protected application backup environment and Restic credentials as the timers.
The runtime container does not receive importer/migration/backup credentials.

Set `PRACTICE_RELEASE_ROOT` to the selected absolute release directory, `PRACTICE_REGISTRY` to
its `apps/api/practice-registry.json`, and `TASK_FILES_DIR` to the actual host storage directory.
Production storage is `/var/lib/infraege/task-files`, outside images/releases; deployment creates
it for UID 1000. API and PostgreSQL mount it read-only at `/task-files`. Development uses
`infra/task-files.local`, protected by the ignored `*.local` boundary and excluded from cleanup.
Do not put persistent objects under `.output` or delete old objects as cleanup.

Supply `DATABASE_URL` with the read-only role and `IMPORT_DATABASE_URL` with the importer role
through protected environment configuration. Do not print or paste credentials into reports.
For the host CLI use the selected container's bridge IP, or its explicitly loopback-published
port in an isolated test. Host mutations/read exports compare the URL endpoint with Docker's
live project/service labels; a mismatched URL or multiple containers is rejected. `localhost`
aliases and URL query overrides are intentionally not accepted by this identity check.

Every command specifies `--environment dev|test|prod` and its matching project (`infraege-dev`,
`infraege-full-gate`/`infraege-db-test-*`, or `infraege`). Examples below use `$DB_ENV` and
`$DB_PROJECT` only after those identities and credentials have been set deliberately.

## Prepared packages

A package is a directory containing `manifest.json`, task edit JSON files and listed binary
objects. The exact versioned schema is `app/modules/practice/schemas.py`; unknown fields/formats
fail validation. Its manifest contains `format: 1`, a stable `package_id`, task paths/checksums,
and file paths/checksums/sizes/formats. A task edit contains `task`, `expected_revision`, `mode`
and a meaningful `reason`. New tasks require revision zero. Existing IDs require `--update`
and the currently exported revision, even when delivered by a new package.

Source fields explicitly use null for unknown information. Exactly one source is primary;
original and copy provenance are distinct. File usages own download names, descriptions and
attribution. Blocks reference usage IDs, never arbitrary HTML or external paths.

Default limits are 1000 tasks and 1 GiB including expanded archive contents; a task/manifest
JSON file is capped at 4 MiB, an image at 5 MiB and an attachment at 20 MiB. The environment
settings `PRACTICE_PACKAGE_MAX_BYTES`, `PRACTICE_IMAGE_MAX_BYTES` and
`PRACTICE_ATTACHMENT_MAX_BYTES` can lower the byte ceilings. Raising ceilings requires a
resource-budget review. Images are fully decoded by pinned Pillow, limited to one frame and
16 million pixels. ZIP/document contents are streamed with CRC/size checks; traversal,
symlinks, encrypted or nested archives and excessive entry counts are rejected. An archive
is an attachment, not an alternative unbounded package transport. Files are never executed.

Task-owned immutable objects are named by SHA-256 internally, written/fsynced before DB commit
and checked on reuse. Temporary writes live in `TASK_FILES_DIR/.staging` on the same filesystem;
only completed checksum-named objects are linked into the storage root. Backup copies objects
referenced by its DB snapshot, so an interrupted staging process cannot block it. Downloads retain
the author's filename. Failed transactions may leave
unreferenced immutable objects, intentionally retained until a separate collection policy exists.
After an abrupt process/host exit, `.staging/tmp*` may remain. Once all imports are stopped, inspect
that directory and remove only its stale regular temporary files. Do not remove the storage root,
checksum-named objects or anything while an importer is active. Staging is excluded from backups
and repository cleanup; this procedure is not a policy for collecting committed objects.

## Import, inspect and edit

```bash
uv run python -m app.modules.practice.cli validate --environment "$DB_ENV" --project "$DB_PROJECT" --package /absolute/package
uv run python -m app.modules.practice.cli diff --environment "$DB_ENV" --project "$DB_PROJECT" --package /absolute/package
uv run python -m app.modules.practice.cli import --environment "$DB_ENV" --project "$DB_PROJECT" --package /absolute/package --backup-env /absolute/protected.env
uv run python -m app.modules.practice.cli outcome --environment "$DB_ENV" --project "$DB_PROJECT" --package-id stable-package-id
```

`import` and `apply` share the same write path: validation/diff → backup → staged files and one
DB transaction → public projection/checker smoke → backup. A repeated matching package returns
`already_committed`; reuse of its ID with another checksum fails. After disconnect or a post-commit
smoke/backup failure, query `outcome` before retrying. `not_committed` is a current observation:
an operation still running may commit later. A retry serializes with that operation and rechecks
the journal. Confirm a committed outcome's checksum, repair the failed verification/backup and
repeat the same package to re-run its pre/post checks without duplicating history.

```bash
uv run python -m app.modules.practice.cli export --environment "$DB_ENV" --project "$DB_PROJECT" --task-id task-id --package-id new-edit-package-id --output /absolute/new-export
```

Exports contain private checker information and refuse existing output directories. Edit the
exported task JSON, keep its expected revision, supply a reason, then deliberately update that
entry's SHA-256 in `manifest.json` (`sha256sum /absolute/new-export/task.json`). This is package
preparation, not automatic repair of an untrusted package. Use `validate`, then `diff --update`
and `apply --update`. Diff reports changed fields and resulting revisions without printing answers.

Normal condition, input-file or checker edits advance solution revision. Metadata/explanation
edits preserve it. Explicit editorial mode permits a condition typo correction but forbids checker
or input-file replacement. Each successful edit increments record revision and appends history.
Catalog-hidden tasks remain readable for lesson use; archiving requires removing their membership
in the same revision-checked update. Physical deletion is not an operator command.

Exit codes: 0 success, 2 invalid input/configuration, 3 stale revision/package/schema conflict,
1 database or backup command failure. Validation output reports field locations/types without
private input values. Filesystem permission failures remain the repository handoff, not a retry.

## Verification and remaining transition

```bash
bash scripts/tests/practice-model-tooling.test.sh
```

Requires host uv/Restic/Docker and builds a disposable application image. Pytest runs on the host;
containers run PostgreSQL and the actual shipped operator smoke command. The runner verifies
fresh/populated migration, drift rejection, roles, concurrent/interrupted imports, CLI edits,
encrypted backup/export and a disposable restore with task/file/checker checks. It removes only
its own test resources. The tiny-fixture restore duration is not a production RTO.

Production installation/restore acceptance still requires an explicit Full + Release operation
and the owning production/backup runbooks. Existing lesson cutover, browser progress migration,
public Task HTTP integration and the practice catalog remain later stages of SPEC §9.2.
