# Practice operator workflow

Migration head `191_01` retains the bank introduced by `122_01`: current task JSON, a separate
private checker, ordered lesson memberships and content-addressed files; it adds accounts and
server progress, and `191_01` adds stored generated catalog columns (exam numbers, order,
difficulty, skills, normalized search text) maintained by PostgreSQL from task JSON. PostgreSQL is the only runtime bank. Theory/publication definitions
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
counter; stale submissions return 409. Metadata-only edits preserve it. Account progress
is associated with learning context + task ID + solution revision; guests do not save results.
There is no editorial audit log or automatic conflict merge.

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

## One-time KEGE import (Change 188)

The source is `https://kompege.ru/task`; the page reads public
`/api/v1/task/number/{number}` collections. Collect only the explicitly mapped current sections,
never the archive sections or 110/112. The dated FIPI 2027 project is authoritative; Sdamgia is a
cross-check. In particular 10 is networks, 12 Turing machines, 13 program counting and 23 graphs;
27 must have the current two-number, one-row answer format. A task's year alone is not a filter.

Prepare with `uv run python -m app.modules.practice.kompege --help` from `apps/api` after exporting
the selected local target. Raw downloads and exports stay in a private scratch directory outside
Git and public assets. The converter reconciles source identities against both the canonical bank
and the DB export, skips every existing task, and emits only new tasks plus a per-record report.
Do not use a whole-bank bootstrap for this transfer: operator edits in retained rows must survive.
Analyze all exclusions/corrections and resolve preparation errors before validating the delta.
Games 19/20/21 become individually solvable tasks with their common game setup and own question.
Statements become native blocks; assets are stored by SHA-256, including original `.xls` and GIF. Source assets and projected attachments are bounded at 64 MiB;
the large #17 source datasets are approximately 30.5 MiB each, and #24 source 587 is approximately 47.8 MiB.
Do not fabricate explanations from checker answers. Missing authored help is represented by an
empty list. No lesson memberships or theory links are inferred from the exam number.

Run ordinary `validate`, rehearse the delta and replay in disposable PostgreSQL, then import the
delta into the exported local target with one operator. Compare retained tasks/checkers/revisions,
memberships and account/progress state before and after. Add only the prepared new entries/files
to the canonical bank. Keep the pre-import private export until the local result is accepted;
remove raw scratch downloads after analyzing their evidence. This is not a synchronization service
and never authorizes production import.

Practice exam labels are owned by `apps/web/src/shared/config/exam-topics.mjs` rather than lesson
publication. `node scripts/practice-catalog-topics.mjs` regenerates the API taxonomy; `--check`
verifies it. All numbers 1–27 stay selectable even when their theory lesson is not published.

## Bank repair (Change 191)

`uv run python -m app.modules.practice.bank_repair content/practice-bank EXAM_TOPICS_JSON` (from
`apps/api`; the JSON is `examTopicDefinitions` exported by node from `exam-topics.mjs`) rewrites
the canonical bank once: Change 188 titles become the FIPI topic name, imported and empty
summaries come from the statement question, catalog tasks without theory get a topic-level
«Теория» link, and every kompege 19/20/21 game becomes one multi-part task while its split parts
stay archived. It is idempotent; format with prettier, then `make practice-bootstrap` and
`pnpm validate:content`. Editorial fields keep `solution_revision`.

## Checks and recovery

`cd apps/api && uv run pytest tests/test_minimal_bank.py` runs host tests against disposable PG18.
`pnpm api:generate` updates HTTP contracts; `pnpm api:check` detects drift. The catalog uses numbered
pages (10/30/50/100 per page), stable ID order and existing filters; there is no next-task
navigation. Invalid input is 422,
missing content 404 and unavailable storage/database 503.

Backup/restore is documented in [backup-restore](backup-restore.md). Local import never deploys.
