# Practice operator workflow

Changes 114–116 implement the server model, operator tooling, lesson consumers and standalone
practice catalog locally. Topic/Course practice and course summaries read PostgreSQL without a
JSON fallback. Production activation remains separate; follow the
[transition readiness checklist](practice-transition.md) before the first release.

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

`infra/database-schema` and `SCHEMA_REVISION` declare the supported revision `121_01`.
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
and the owning production/backup runbooks. Lesson cutover, browser progress migration, public
Task HTTP integration and the practice catalog are implemented locally in Changes 115–116.
The [transition checklist](practice-transition.md) tracks the remaining release prerequisites.


## Change 115: explicit local bootstrap and cutover

`make dev` starts services and runs migrations/registration but never imports task content.
The development PostgreSQL port is allocated dynamically on loopback; `make practice-bootstrap`
resolves it from the exact `infraege-dev` Docker labels and uses the existing disposable dev roles.
The command only creates the original tasks. It never passes `--update`; replay uses the package
outcome and cannot overwrite later operator edits.

Prerequisites: host uv, Docker, jq and Restic. Prepare a private local backup location (the example
uses a new directory; keep it and its password while these snapshots are useful):

```bash
umask 077
practice_backup_dir=$(mktemp -d "$HOME/infraege-dev-backup.XXXXXX")
mkdir "$practice_backup_dir/backups"
openssl rand -hex 24 > "$practice_backup_dir/password"
printf 'POSTGRES_DB=infraege\n' > "$practice_backup_dir/environment"
export RESTIC_REPOSITORY="$practice_backup_dir/restic"
export RESTIC_PASSWORD_FILE="$practice_backup_dir/password"
export RESTIC_CACHE_DIR="$practice_backup_dir/cache"
export RESTIC_LOCK_FILE="$practice_backup_dir/restic.lock"
export BACKUP_ROOT="$practice_backup_dir/backups"
export BACKUP_STATUS_FILE="$practice_backup_dir/backup-status.json"
make dev
make practice-bootstrap ENV_FILE="$practice_backup_dir/environment"
```

The bootstrap calls the 114 operator handlers in order: register → convert/validate → diff →
pre-backup → import → outcome → reader/checker smoke → post-backup. A failed pre-backup prevents
DB writes. Inspect the outcome after any interrupted import before retrying. The frozen source
is `content/practice-migration/`: 150 task JSON files, one six-byte `numbers.txt`, ordered membership
for two Topic and 28 Course lessons, source checksums and first solution revisions. It is excluded
from formatting to preserve authored bytes. `legacy.py` produces a bounded deterministic package;
package validation rejects unresolved theory/file links before any persistent write. Unknown
provenance stays unknown, and every original exercise remains hidden from standalone catalog search.

For a prepared release, before activating web/API consumers: provision/migrate PG18 and register
the proposed release registry, convert the frozen snapshot using that release, validate/diff,
make a verified pre-backup, import, query outcome, compare all IDs/content/membership/revisions,
run public API/file smoke, then make a post-backup. Use the existing CLI with explicit `prod`
identity and selected credentials; `make practice-bootstrap` deliberately supports dev only.
Actual production activation remains stage 5 and requires the release workflow. Keep PG16/source
volumes and legacy source assets. Returning an old application does not revert DB links or edits;
run registry/schema preflight against the proposed rollback release before switching consumers.

Public material kinds are `topic` and `course`; kind is checked separately from the stable ID.
Published course membership also requires a published parent course. Lesson and course readers
use one SQL projection each, without per-card/per-lesson requests. POST-check reads checker,
explanation and solution revision together. `409` means refresh, `404` unavailable, `503` dependency
failure. Missing revision is `422` and can never earn success. An already-open pre-115 client
shows its existing generic failure message: its loaded JavaScript cannot display the new refresh
control until the user reloads the page. Versioned clients retain input and offer explicit refresh,
without automatic resubmission.

The new browser registry uses `infraege:lesson-progress:v2`. It migrates the old app registry and
per-lesson keys using the verified first-import mapping. Old successes and accepted answers remain
historical; only the displayed revision counts. A separate key prevents an old tab from stripping
new revision fields. Reset clears the current lesson in the new registry; old stored registries
are never read again once the new registry exists.

Task files are requested as `/api/tasks/{task_id}/files/{usage_id}`. The API validates task
availability and the immutable object reference, then returns `X-Accel-Redirect` to the internal
Nginx `/_task-files/` location. Nginx mounts the same persistent storage read-only, rejects direct
internal requests and symlinks, and preserves MIME, bytes and UTF-8 download filenames. Reads and
checker requests have separate rate-limit boundaries. API reads use `Cache-Control: no-store`.
Only `/` and `/ege` are prerendered; lessons, course overview and course catalog use request-time
SSR, with no build-time database access. A practice dependency failure leaves theory readable.

Local verification: `bash scripts/tests/practice-model-tooling.test.sh` now imports the full frozen
corpus and verifies transactional replay plus nonempty DB/file restore with the shipped readers
and checker. `practice-cutover.spec.ts` uses domain fixtures/Page Objects for stale refresh,
network retry, in-flight checks, migrated progress and mobile no-JS. Supply the isolated fixture's
runtime `DATABASE_URL` to the host Playwright backend; frontend server/API transport uses
`API_INTERNAL_URL`, while browser POSTs use the existing public API adapter.

Manual acceptance: read both Topic lessons and Python lessons, download `numbers.txt`, solve and
reset a lesson, compare overview/catalog mastery, and review changed-task messaging and preserved
input after an operator edit. Verify narrow screens, keyboard focus and dependency recovery.
Automation does not approve pedagogy, visual publication or production cutover.


## Independent catalog (Change 116)

The public `/practice` list uses `GET /api/tasks`: optional `skill`, `exam_number`, `difficulty`,
`limit` (30 by default, maximum 100), and `cursor`. Results contain task identity, title,
classification, estimated time and solution revision, with no statement/checker bodies. Newest
creation time and descending ID define stable order; a cursor is valid only with the same filters
and page size. Invalid or mismatched cursors return 422; the UI offers resetting filters. Empty
catalogs and no matches are normal states, distinct from dependency failure.

Publishing is explicit through the existing export/edit/validate/diff/apply/import CLI: change
`catalog_visible` in an operator package with its expected revision and reason, inspect the diff,
and retain the existing backup/outcome checks. No new editor or startup seed is introduced.
The original 150 lesson exercises remain hidden unless an operator deliberately publishes them.
Hidden tasks still work through published lesson links, but are noindex on standalone pages and
absent from the catalog/sitemap. Archived/unavailable tasks return 404.

`/practice/$taskId` reuses the reader/checker and Nginx file boundary. Browser storage
`infraege:practice-progress` records accepted values by task ID and solution revision independently
of lessons. Repeating creates a fresh answer form while retaining earned success; a changed
solution revision requires solving again. Stale/failed checks retain input, and failed explicit
refresh retains the previous task and entered answer. There is no attempt log or analytics event.

`/sitemap.xml` is a runtime index: `/sitemap-static.xml` retains code-owned public routes;
`/sitemap-practice/1`, etc. contain at most 1,000 visible task IDs and update timestamps each.
The bounded `/api/task-sitemap-index` and `/api/task-sitemap?page=...` projections serve discovery.
They live outside `/api/tasks/{id}` so they reserve no task IDs. Index capacity is 49,999 task
parts plus the static part; dependency failure returns 503 rather than silently dropping URLs.
These responses use no-store; task publication is reflected without rebuilding web assets.
Filtered/cursor catalog pages are noindex with the unfiltered canonical. Task pages have their
own canonical/social metadata. Conditions/help/downloads remain accessible without JavaScript.

Nginx limits direct task/discovery reads at 120 requests/minute/IP with burst 30 and 429 on excess,
separately from the existing checker limit. SSR uses the internal API transport. No schema change
was needed: isolated 10,000-task projections used one query and bounded results with the current
indexes; measure again before adding indexes for a materially larger bank.

Acceptance commands are in STACK. Manual review: open a visible task after an operator publishes
it, filter/page the catalog, solve/reload/repeat, compare lesson progress, inspect source links and
rich content/downloads, then review a changed task and failed request on desktop/mobile. Automated
fixtures and visual checks do not approve new task content or authorize production activation.


## Change 118: release-owned first import

The production deploy coordinator prepares the candidate's API environment with
`uv sync --frozen --no-dev` before downtime. Under its existing deployment lock, it stops old
consumers, migrates/registers the candidate schema and invokes the host `practice.release`
module before application startup. It uses the selected Compose database and the protected
runtime/import role credentials; migration authority stays in the separate migration job.
Production storage remains `/var/lib/infraege/task-files`.

The frozen package uses the same validate/diff/import writer as operator edits. Both pre- and
post-import backups must succeed. Before activation, verification checks the package journal,
all original task IDs and revision-one history/content/membership, original file bytes, and
current reader/checker behavior. History is used only for migration evidence, never public reads.
A retry after commit/post-backup interruption recognizes the same package checksum and preserves
subsequent operator edits, including their revisions. No automatic update or catalog publication
occurs. Corruption or mismatched outcomes block activation and use the deployment recovery path.

Use [the transition checklist](practice-transition.md) for exact-SHA and live recovery evidence.
Local testing uses the host runner `scripts/tests/practice-release.test.sh` with an explicitly
selected `PRACTICE_TEST_BASE_IMAGE` (a locally built current API image), host Restic and Docker.
It owns its disposable DB, image tag, backups and temporary files, and does not touch dev/prod data.


## Банк ЕГЭ 5 и 16 (Change 120)

Версионированный набор: `content/practice-imports/120-ege-5-16/`;
[состав и ограничения](../../content/practice-imports/120-ege-5-16/README.md).
Пакеты предназначены для operator CLI, не для публичной раздачи.

Перед импортом на целевом хосте установите совместимый релиз со схемой `120_01`,
выполните обычные migration/registry preflight и host CLI setup выше. Для production
действует отдельный Release Gate из [production](production.md): старый runtime
`114_01` не является совместимым автоматическим rollback. Не используйте dev credentials
или dev backup вместо конфигурации и резервных копий целевой среды.

Из `apps/api` выбранного релиза после установки защищённого окружения:

```bash
practice_bank="$PRACTICE_RELEASE_ROOT/content/practice-imports/120-ege-5-16"
# DB_ENV/DB_PROJECT: dev/infraege-dev либо явно выбранные prod/infraege.
# PRACTICE_BACKUP_ENV: защищённый файл окружения backup на выбранном хосте.
uv run python -m app.modules.practice.cli validate --environment "$DB_ENV" --project "$DB_PROJECT" --package "$practice_bank/package"
uv run python -m app.modules.practice.cli diff --environment "$DB_ENV" --project "$DB_PROJECT" --package "$practice_bank/package"
uv run python -m app.modules.practice.cli import --environment "$DB_ENV" --project "$DB_PROJECT" --package "$practice_bank/package" --backup-env "$PRACTICE_BACKUP_ENV"
uv run python -m app.modules.practice.cli validate --environment "$DB_ENV" --project "$DB_PROJECT" --package "$practice_bank/corrections"
uv run python -m app.modules.practice.cli diff --environment "$DB_ENV" --project "$DB_PROJECT" --package "$practice_bank/corrections" --update
uv run python -m app.modules.practice.cli apply --environment "$DB_ENV" --project "$DB_PROJECT" --package "$practice_bank/corrections" --update --backup-env "$PRACTICE_BACKUP_ENV"
uv run python -m app.modules.practice.cli smoke --environment "$DB_ENV" --project "$DB_PROJECT"
```

До первой записи diff должен показать 547 созданий, второй diff — 192 редакторских
обновления (только title/explanation, без смены solution_revision). Остановитесь при
неожиданном diff или revision conflict; не обходите его изменением UUID/manifest.
`import`/`apply` сами выполняют pre/post backups. Затем выполните штатный disposable
`make db-restore-check` с окружением restore, проверьте `/practice?exam_number=5`
и `/practice?exam_number=16`, одну отправку ответа и переход к теории.

При прерывании запросите `outcome --package-id` для соответствующего package_id из
README до повтора. Оба пакета повторяются идемпотентно. Позднейшие исправления задач
должны оформляться новым экспортом/пакетом, а не заменой этих файлов.

Локальный dev-прогон 2026-09-13: 547 новых задач, 150 прежних сохранены; оба пакета
повторены с `already_committed`; последняя копия восстановлена с проверкой 697 задач.
Защищённые настройки/резервные копии этого прогона находятся в игнорируемом
`infra/practice-import-120.local/`, объекты задач — в `infra/task-files.local/`.
Эти каталоги не являются частью переносимого пакета и не должны попадать в git.


### Practice UX editorial package (Change 121)

After both immutable Change 120 packages, apply
`content/practice-imports/121-practice-ux/package` with `--update` on schema `121_01`.
Use the same explicit target, validate/diff, pre-backup, apply, smoke and post-backup flow above.
The package adds previews, known skills and honest explanation classifications, and explicitly
marks formula spans/equivalent code groups. No answers, memberships or solution revisions change.
Details and reproducible preparation are in the package README. Do not regenerate the existing
120 packages to obtain these fields: their bytes/identity remain frozen.

Content version 1 remains readable. Version 2 permits `rich_text` (text/code/formula spans) and
`code_variants` (label/language/code, two to eight distinct labels). Old versions cannot render
these blocks; a pre-121 application is not an automatically compatible rollback. Release preflight
requires exact-version compatibility evidence and must reject unproved fallback, without database
rollback. Backup restore uses the verifier image recorded in that snapshot.

`short_description` is nullable and at most 300 characters; never include the answer or hints.
`explanation_kind`: `unclassified` → «Разбор», `method` → «Идея решения»,
`worked_solution` → «Решение». Review substance before marking a full worked solution.
Catalog facet labels live in the practice module's skill taxonomy; register a readable label when
introducing a new skill. Unknown legacy skill identifiers remain valid data but are not suggested
as unnamed filter choices. Mock durations/statistics belong exclusively to lab fixtures.
