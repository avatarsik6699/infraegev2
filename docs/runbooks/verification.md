# Verification and release evidence

This project favors a short development loop over a custom verification platform. Use the
`scripts/gate.py` command groups, existing package commands, GitHub Actions and release workflows;
do not add a result cache, snapshot runner, audit importer, evidence TTL ledger or scheduler.
Commands live in [STACK](../STACK.md#gate-command-groups); this runbook owns selection policy.

## Local work

For one coherent `/work` set:

1. `python3 scripts/gate.py affected` maps changed paths to groups (docs-only → `docs-links`;
   web → format, web lint/typecheck; API → API lint/typecheck, `api-contract` for app code; content
   → `content-static`; lesson media manifests and `scripts/lesson_design` → `lesson-media` (+ host
   Python for the tooling); lesson/course content and the Vite config → `paid-leak`; shell → `shell-lint`;
   infra → `infra-config` plus nginx contracts). It prints reminders and unmatched paths.
2. Run the suggested groups once with `python3 scripts/gate.py run --group …`; read only the
   summary and, on failure, the printed tail or `.output/gate/<group>.log`.
3. Run focused tests that directly exercise changed behavior and the required browser/LSP checks.
4. Fill the active change's **Gate evidence** block (HEAD, groups, result, seconds).

At local `/ship`, compare the diff since that recorded HEAD. Do not repeat an unchanged check;
re-run only checks whose inputs changed, whose evidence is missing or whose environment is
uncertain. Runtime/browser/database checks are fresh when selected. A command result is not
production proof. An unmatched path requires a written coverage decision or a focused architect
question; it never invokes Full. Full is only `/ship --full`.

## Scope reminders

- UI: Playwriter desktop/mobile; focused no-JS/a11y/layout specs only when relevant. Lighthouse is
  weekly/manual or a specific performance investigation, not every CSS change.
- Auth/progress: negative/owner-isolation coverage and real account integration before release.
- Schema/data: owning isolated migration/restore and permission checks.
- Dependencies: changed-ecosystem audit; candidate images are scanned once by `images.yml`.
- Host scripts: owning fake contracts and relevant real boundary checks, not web performance.
- Run browser specs once before ship and only the affected ones; the full portfolio only on request.

Full's STACK rows enumerate their contract set. Select these additional local contracts when their
owner changes:

| Owner | Specialized contract |
|---|---|
| Account cutover | `bash scripts/tests/account-cutover.test.sh` (also `python3 -m unittest scripts.tests.account_cutover_drill_test`) |
| Account artifact retention | `bash scripts/tests/account-retention.test.sh` |
| Nginx auth/progress edge | `bash scripts/tests/auth-edge.test.sh` |
| Nginx paid-chunk gate and payment notifications (Change 192) | `bash scripts/tests/paid-gate.test.sh` |
| Nginx auxiliary error pages | `bash scripts/tests/auxiliary-pages.test.sh` (Docker nginx) |
| Practice read throttling | `bash scripts/tests/practice-read-limit.test.sh` |
| Local Docker lifecycle | `bash scripts/tests/docker-dev-lifecycle.test.sh` |
| Restore readiness | `bash scripts/tests/restore-readiness.test.sh` |
| Lighthouse wrapper | `bash scripts/tests/run-lighthouse-audit.test.sh` |
| Security selection/orchestration | `python3 -m unittest scripts.tests.security_gate_test` |
| Synthetic account server | `python3 -m unittest scripts.tests.test_account_server` |

These remain affected-area checks, alongside the isolated manual Restic integration. Their absence
from an unrelated check's command is not evidence that their behavior passed.

## Full Gate environment

Run in one host shell with the frozen pnpm/API environments installed and a fresh isolated
`infraege-full-gate` database; never supply production credentials or reuse development storage.
Before bootstrap, export `POSTGRES_USER=infraege`, `POSTGRES_DB=infraege` and distinct random
URL-safe values of at least 16 characters for `POSTGRES_PASSWORD`, `DB_RUNTIME_PASSWORD`,
`DB_APP_PASSWORD`, `DB_IMPORT_PASSWORD`, `DB_MIGRATION_PASSWORD`, `DB_BACKUP_PASSWORD`, plus an
independent `AUTH_CSRF_SECRET` of at least 32 characters (`openssl rand -hex 24`). Keep them
process-scoped or in a mode-600 file outside Git; never print them or rendered Compose secrets.
Set `TASK_FILES_DIR` to a dedicated absolute temporary directory, `APP_ENV=development` and
`DEPLOY_SHA=development`.

After bootstrap, wait for PostgreSQL/API/web/Nginx health and the migration job. From `apps/api`,
use `MIGRATION_DATABASE_URL` (`infraege_migration`, port 15432) for the migration row and import
`../../content/practice-bank` with `IMPORT_DATABASE_URL` (`infraege_import`). URL shape:
`postgresql://ROLE:PASSWORD@127.0.0.1:15432/infraege`. The migration job alone creates an empty
schema and is not a seeded-bank acceptance. For Playwright/axe export the read-only `DATABASE_URL`
(`infraege_runtime`) and `ACCOUNT_DATABASE_URL` (`infraege_app`) on port 15432 and keep
`TASK_FILES_DIR`; for Lighthouse and host SSR set `API_INTERNAL_URL=http://127.0.0.1:18000`. Run
security scans after browser/build/performance jobs (their reports change the tree). Keep the same
environment for `run-host-web-gate.sh`. Finish by removing only the owned gate containers/network,
retaining volumes, then `make clean` after reports are analyzed.

## CI and periodic audits

`quality.yml` runs the static `gate.py` groups listed in STACK Full (no pytest, Vitest, DB or
browser suites). A main-branch run is never cancelled, so each pushed SHA keeps its evidence. Use
native dependency caching; do not cache test validity or add required path filters that can leave
a check Pending.

`audit-security.yml` and `audit-browser.yml` run weekly (Tuesday 03:23 UTC browser, 04:23 UTC security) and manually and
report through GitHub Actions status/notifications. A missed run is noticed and rerun manually; it is
not green and does not trigger Full for unrelated work. A confirmed critical account/data finding or
applicable candidate-image vulnerability blocks the affected release; noncritical findings become
ordinary Backlog work. Local equivalents: `bash scripts/security-gate.sh weekly`,
`bash scripts/run-isolated-browser-audit.sh` and `INFRAEGE_LIGHTHOUSE_TARGET=production pnpm
audit:performance`; these are not the routine work/ship handoff. History of the first 2026-09-26
audit run (four approved Gitleaks exceptions) is in [COMPACTED](../changes/archive/COMPACTED.md).

## Release

`/ship --release` keeps the existing separation:

1. Run missing affected local checks and merge locally after the change is accepted.
2. Before pushing the final merged SHA, scan its complete unpublished commit range for secrets and
   audit changed dependencies (STACK Release Gate). Missing or ambiguous range blocks publication.
3. After push, `python3 scripts/release_checkpoint.py predeploy --sha <SHA>` requires successful
   exact-SHA `quality.yml` and `images.yml` runs; images owns digest scan, SBOM and provenance.
4. A candidate that changes the production schema head needs the schema transition attestation
   (STACK Release Gate) before dispatch.
5. Dispatch deploy once for that SHA; `release_checkpoint.py postdeploy --sha <SHA>` verifies the
   deploy run plus fresh public readiness and homepage. Saved evidence is never current production
   health, and a mutation is never repeated automatically.

Finish with `make clean`. Do not use `git clean -fdX`.
