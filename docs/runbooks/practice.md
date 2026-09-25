# Practice operator workflow

Schema `122_01` stores current task JSON, a separate private checker, ordered lesson memberships
and content-addressed files. PostgreSQL is the only runtime bank. Theory/publication definitions
remain authored in the web tree and `apps/api/practice-registry.json` (generated/checkable with
`node scripts/practice-registry.mjs --check`). There is no history/package/release-import engine.

## Local use

```bash
make dev
make practice-bootstrap
python3 scripts/practice-local.py export /absolute/path/to/new-private-export
```

Bootstrap explicitly imports `content/practice-bank`; it can update existing tasks. Export edits
before reimporting the checked-in baseline. Export contains answers/private sources; keep outside
web public assets. The helper selects only the labelled local dev container and loopback port.
The original database volume is retained; the new volume is `infraege-dev_postgres122-data`.

## Validation and import/export contract

`pnpm validate:content` checks authored publications, registry drift and the complete canonical
`content/practice-bank`, including schema, material/section references, lesson positions and file
checksums. It uses Node plus the frozen uv/API environment, without database access or credentials.
For a prepared directory, run `uv run python -m app.modules.practice.cli validate DIRECTORY` from
`apps/api`. This is read-only validation, not a simulation against existing database state;
conflicts with retained DB rows are still rejected transactionally during import.


Use `uv run python -m app.modules.practice.cli import DIRECTORY` or `export DIRECTORY` from
`apps/api`, with `IMPORT_DATABASE_URL` for `infraege_import` and `TASK_FILES_DIR` supplied from a
protected environment. Production requires explicit environment/project selection and prior backup.
Never print credentials. Export destination must not exist and is created private (0700).

A directory contains `bank.json` (format 1) and `files/<sha256>`. Each task has full authored content,
checker, private/public provenance and `solution_revision`. Publication metadata is supplied with
the bank; the CLI exports the release registry. CLI rejects mismatched publication metadata. Keep imported material/course metadata aligned
with that registry and regenerate it when authored publication changes. Do not import a bank from
a different content release without reconciling the registry.

Import validates schema, IDs, references and file checksums. All DB changes commit in one
transaction; failure rolls back every task. Referenced immutable bytes are copied first; a failed
import may leave unreferenced files, which are harmless and not automatically collected. Omitted
tasks are retained. To withdraw a task explicitly set archived=true, catalog_visible=false and
clear its lessons. Concurrent editorial writes are unsupported: run one operator at a time.

Solution-affecting changes (statement, instruction, file usages, checker) advance the solution
counter; stale submissions return 409. Metadata-only edits preserve it. Existing local progress
is associated with task ID + solution revision. There is no audit log or automatic conflict merge.

Runtime role is read-only; migration/import/backup credentials stay out of web/API runtime.
Account/progress records are not part of a practice-bank import or export: `infraege_app` alone
writes them, and no submitted answer text or guest attempt belongs in the database. A bank import
may advance a task solution revision; account progress remains historical and projections select the
current revision rather than mutating account facts.
Public projections omit checker and nonpublic provenance. Nginx serves only validated file usages
through internal X-Accel-Redirect; it cannot list the storage directory. Import sets the dedicated
attachment directory to 0755 and validated attachment bytes to 0644 for the separate Nginx UID.
Keep this directory free of exports/secrets. Private exports remain 0700 with 0600 files; host
parent directories must permit traversal for the operator, while containers mount only storage.

## Checks and recovery

`cd apps/api && uv run pytest tests/test_minimal_bank.py` runs host tests against disposable PG18.
`pnpm api:generate` updates HTTP contracts; `pnpm api:check` detects drift. The catalog uses numbered
pages of 30, stable ID order, existing filters and next-task navigation. Invalid input is 422,
missing content 404 and unavailable storage/database 503.

Backup/restore is documented in [backup-restore](backup-restore.md). Before the first production
switch follow [practice-transition](practice-transition.md). Local import never deploys.
