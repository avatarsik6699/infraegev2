# CHANGE 114 — Practice model and operator tooling

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `114` |
| Slug | `practice-model-tooling` |
| Title | Server-owned practice model and operator tooling |
| Status | `archived` |
| Branch | `feature/114-practice-model-tooling` |

## Goal

Deliver the second approved practice stage: a migrated PostgreSQL model and one transactional
service for validated imports and operator edits, with immutable files and recovery evidence.
An operator can validate, inspect a diff, apply a package and determine its committed outcome
after interruption. Existing lesson consumers switch in the subsequent change.

Planning mode: `continue`. Source: `auto: SPEC roadmap + change history`, following the
architect's instruction to continue after locally shipped change 113. SPEC contracts are
unchanged. The architect authorized branch creation with the existing staged artifacts preserved.

Implementation plan: D1 establishes migrations and typed persistence; D2 validates bounded
on-disk packages and stages immutable files; B1/B2 implement transactions and CLI; B3 adds
private/public read boundaries; I1/I2 integrate lifecycle and recovery. T1/T2 verify these
contracts on disposable PostgreSQL and finish the affected Critical Gate. Files and required
tools are listed below; completion means the operator round trip and restore both preserve
task versions, answers, references, history and bytes under the intended roles.

## Design References

None — no new frontend surface.

## Backlog

### Data

- [x] `D1` Add the approved pinned SQLAlchemy/asyncpg/Alembic dependencies and reviewed initial
  migration with typed models for tasks, checker, classifications, material identities,
  membership/theory references, provenance, files/usages, edit history and import outcomes.
  Use named constraints, JSONB, explicit timezone-aware columns, one Alembic head and migration-role
  ownership; preserve the separate runtime/import/backup grants — _Depends on:_ —
- [x] `D2` Implement content/package validation and immutable file ingestion with verified
  bytes, format, checksum, limits and safe paths; stage files before the DB transaction.
  Validate supported blocks, attribution, file usages and material/section references against
  an explicit application registry. Reject unknown formats and incomplete packages before
  publication; do not execute imported code or collect old objects — _Depends on:_ D1

- [x] `D3` Isolate temporary staging from immutable objects on the same filesystem. An abruptly
  terminated import must not block subsequent backup; preserve committed objects and document
  safe stale-staging cleanup. Prove the process-crash path — _Depends on:_ D2

### Backend

- [x] `B1` Implement operation-local async sessions and a shared task service with atomic package
  application, expected-revision checks, solution/editorial revision rules, reasoned edit history,
  archive/link integrity and durable package idempotency/outcome lookup. All writers use this
  boundary; conflicting or partially invalid batches leave no partial DB publication
  — _Depends on:_ D1, D2
- [x] `B2` Implement the operator CLI export/validate/diff/apply/import and outcome inspection
  using B1. Require explicit environment/identity, separate writer credentials, explicit updates
  and expected revisions; provide sanitized actionable errors and documented exit behavior.
  Export supports a round trip without losing private checker or provenance data
  — _Depends on:_ B1
- [x] `B3` Add server-owned read/check projections for import smoke and future HTTP consumers,
  keeping checker values out of public DTOs and reading/checking one solution revision
  consistently. Preserve existing lesson HTTP behavior until its coordinated consumer cutover;
  do not expose an administrative HTTP API — _Depends on:_ B1

- [x] `B4` Replace dynamic edit plans and public content dictionaries with explicit types;
  make normalized current tables the runtime source and keep history for audit.
  Move the shared pure checker to its permanent shared owner; split CLI command handlers without
  changing existing lesson HTTP contracts — _Depends on:_ B1, B2, B3

### Infra

- [x] `I1` Wire separate explicit migration execution, bounded SQL/schema readiness and
  application-registry compatibility preflight into local/release lifecycle. Serialize migration
  execution, reject incompatible schema/application rollback, and keep liveness independent.
  No automatic startup autogeneration, destructive downgrade or production mutation during work
  — _Depends on:_ D1, B3
- [x] `I2` Extend backup/restore/export to include persistent task files, Alembic revision and
  application compatibility metadata. Connect CLI writes to the documented pre/post-backup and
  smoke sequence; verify restored nonempty tasks, files and answers under restored role grants.
  Preserve the operations boundary, retention, old volumes and explicit environment selection
  — _Depends on:_ B2, B3, I1

- [x] `I3` Make deployment failure handling explicit and rollback exactly once, including errors
  inside Compose helpers and conditional env validation; preserve the original failure and verify rollback health. Cover the
  actual orchestration path with fake transport failures, not direct rollback calls alone
  — _Depends on:_ I1
- [x] `I4` Move application backup format, metadata, checksums, file/reference validation and
  recovery rules into a small typed Python maintenance module. Keep Bash as command/lifecycle
  adapters, preserve legacy bundles and Make entry points, and replace three whole-DB fingerprint
  scans with one consistent snapshot shared by dump and verification metadata. No new runtime
  service, framework or automatic data deletion — _Depends on:_ I2, D3

### Frontend

None — lesson cutover, browser progress, catalog and task pages remain subsequent stages.

### Other

- [x] `T1` Add focused host-run PostgreSQL tests covering fresh/populated migration paths and
  schema drift, SQL/role failures, lock/compatibility rejection, JSONB/timezone/constraints,
  concurrent updates, transactional rollback, repeated/interrupted imports and outcome lookup.
  Cover editorial versus substantial edits, unsupported/malformed blocks, corrupt/missing files,
  traversal/expanded package limits and invalid links, plus private checker projection boundaries
  — _Depends on:_ D2, B1, B2, B3, I1
- [x] `T2` Prove the operator export/edit/apply and nonempty restore journeys with isolated
  fixtures, synchronize STACK and owning runbooks with actual commands, and record manual checks
  and remaining release acceptance. Run one affected-area Critical Gate with Python LSP;
  distinguish local evidence from production readiness — _Depends on:_ I2, T1

- [x] `T3` Add ShellCheck for the affected operational scripts and static CI, targeted crash,
  rollback, snapshot/restore and typed projection checks. Record audit findings, ownership and
  maintenance constraints in canonical docs; run the affected Critical Gate and hygiene
  — _Depends on:_ D3, B4, I3, I4

## Audit follow-up (2026-09-13)

Architect requested all review findings fixed now, within 114, before lesson cutover. Confirmed:
`ERR` did not propagate from `run_compose` (inherited pre-113 defect); abrupt staging left `tmp*`
objects that blocked backup. Follow-up verification also found masked `source` failure in the
production conditional env check, addressed by I3. Structural findings: dynamic DTO/edit plans, runtime reads from audit
snapshots, legacy checker ownership, mixed CLI handlers, broad Bash backup ownership, repeated
fingerprint scans, and syntax-only shell lint. D3/B4/I3/I4/T3 own these findings. No ship/release.

Plan: D3 separates staging; B4 establishes typed current-state readers and handlers; I3 makes
failure recovery a tested explicit boundary; I4 extracts maintenance and snapshot ownership;
T3 completes static/integration/LSP checks and documents residual production acceptance.

## Files

### Create / modify

```text
Backend:
  apps/api/pyproject.toml
  apps/api/uv.lock
  apps/api/alembic.ini (new)
  apps/api/practice-registry.json (generated)
  apps/api/migrations/env.py (new)
  apps/api/migrations/script.py.mako (new)
  apps/api/migrations/versions/ (new initial revision)
  apps/api/app/core/database.py (new)
  apps/api/app/core/config.py
  apps/api/app/main.py
  apps/api/app/modules/practice/ (models, schemas, service, files, CLI/command handlers)
  apps/api/app/modules/tasks/service.py
  apps/api/app/shared/checker.py (pure comparison shared with DB checker)
  apps/api/app/modules/health/api.py
  apps/api/tests/test_practice_*.py (new focused contracts)
  apps/api/tests/test_tasks_api.py (health compatibility only)
Infrastructure:
  package.json (include migrations in formatting)
  .github/workflows/quality.yml (migration static checks and generated registry drift; no DB/tests)
  infra/database-schema (new compatibility declaration)
  apps/api/Dockerfile
  Makefile
  infra/.env.example
  infra/docker-compose*.yml (application only)
  scripts/db-provision-roles.sh
  scripts/practice-registry.mjs (new release registry generator)
  scripts/docker-dev-lifecycle.sh
  scripts/deploy-remote.sh
  scripts/lib/application-db.sh
  scripts/application_db.py and scripts/lib/application_db/ (typed stdlib maintenance)
  scripts/tests/application_db_test.py
  scripts/tests/deploy_orchestration_test.py
  scripts/check-shell.sh
  scripts/pyrightconfig.json
  scripts/lib/application-db-release.sh
  scripts/backup.sh
  scripts/restore-check.sh
  scripts/db-export.sh
  scripts/tests/practice-model-tooling.test.sh (new host fixture runner)
  scripts/tests/backup-restore.test.sh
  scripts/tests/deploy-preflight.test.sh
  scripts/tests/practice-db-foundation.test.sh
  scripts/tests/host-web-gate.test.sh
Documentation:
  docs/STACK.md
  docs/runbooks/practice.md (new operator guide)
  docs/runbooks/production.md
  docs/runbooks/backup-restore.md
  docs/KNOWN_GOTCHAS.md (confirmed findings only)
  docs/changes/114-practice-model-tooling.md
```

### Do NOT touch

- User-staged `docs/artifacts/` content or staging.
- Authored lessons, `content/tasks/` and existing frontend task/progress consumers.
- Public practice catalog/pages, accounts, attempts, editor or new analytics.
- Operations data/lifecycle, sibling repositories, historical archives, rollback volumes.
- Production databases or secrets through local implementation/testing.

## Contracts

See `docs/SPEC.md` §3.2, §4.1, §8.1, §9.2 and the Files list above.

## Gate Checks

Critical Gate is defined in [STACK](../../STACK.md); Full/Release remain explicit ship modes.
Use isolated PostgreSQL 18 with a host test runner, never SQLite or production.
The focused contracts must prove actual SQL state, file integrity and restored answer checks.
Python LSP, Ruff, type-check and formatting apply; API regeneration applies if the implemented
public schema changes. Browser checks are not applicable without frontend changes.
Finish all test artifacts with the reviewed repository hygiene sequence.

Verified locally (2026-09-12):

- `pnpm format:check`, Ruff and Pyright for app/tests/migrations, generated registry drift,
  affected shell syntax and `make config`: PASS.
- Python LSP: no issues across app (32 files), tests (6) and migrations (2). The enclosing
  `apps/api` directory invocation selected the wrong environment and reported missing installed
  packages; the scoped checks and canonical Pyright both resolved the frozen environment cleanly.
- Existing checker/task API focused tests: 170 passed. New practice/health contracts: 17 passed
  against isolated PostgreSQL 18.6, including real authentication failures and cancelled writes.
- `practice-model-tooling.test.sh`: PASS. The application image used Python 3.12.14; the host
  test runner used its existing Python 3.13 environment. Actual Compose migration-before-API and
  both HTTP health endpoints passed. Fresh/populated migration and schema drift rejection passed.
  CLI export/edit/validate/diff/apply/outcome, pre/post Restic backups, encrypted portable export
  and restored task/file/checker verification passed. The last small-fixture restore plus cleanup
  took 7 seconds; five active tasks were checked, and the archived record remained in the SQL
  fingerprint. Conditional bundle validation rejected a deliberately corrupted copied object.
- `practice-db-foundation.test.sh`: PASS with host Restic 0.16.4, nonempty PG16→PG18 transfer,
  retained source, role checks, pre-Alembic restore/export and unchanged operations-tag retention.
- Focused `backup-restore`, `deploy-preflight`, `production-ops-topology`, `host-web-gate` and
  `docker-dev-lifecycle` shell contracts: PASS, including incompatible schema rollback rejection.
- Reviewed `make clean-dry-run`, then `make clean` and `make clean-check`: PASS. Fixture containers,
  volumes, temporary application image tags, downloaded tools and owned pytest workspaces cleaned.
  The model runner now places pytest's temporary files inside its own cleanup root.
- API regeneration/frontend type-check/browser checks: SKIPPED, no changed public HTTP schema,
  generated consumer or frontend code. Full/Release Gate and production changes: not requested.
  The 14 pre-existing staged artifacts retain the same cached-diff checksum.


Audit follow-up verified locally (2026-09-13):

- D3: process-crash regression leaves temporary bytes only inside `.staging`. The subsequent
  real Restic backup/restore succeeds against that same storage with the leftovers present.
- B4: `EditPlan` and `PublicTaskContent` are explicit types. A rolled-back fixture invalidates
  the audit snapshot and proves current private/public reads still use normalized rows. The
  task membership lookup has its own index. CLI parsing is separate from command handlers;
  existing and DB consumers share `app/shared/checker.py`.
- I3: five host-only tests cover actual Compose helper failure, explicit exit, failed rollback,
  wrong-SHA rollback health and conditional env validation. Recovery runs once and preserves
  the original status; legacy `/health` remains the compatible rollback readiness alias.
- I4: the shell DB library is 42 lines of selection/command adapters (268 before review).
  Standard-library Python owns metadata, checksums, snapshot transport and recovery contracts.
  One exported REPEATABLE READ snapshot feeds dump and verification queries. A concurrent write
  test proves both old-snapshot queries and the resulting dump exclude the new committed row.
  Backup copies only snapshot-referenced immutable files; format 1 and pre-Alembic remain supported.
- Critical Gate: 170 existing checker/API tests and 19 practice/health tests PASS; five maintenance
  unittest checks (including live snapshot concurrency) and five deploy unittest checks PASS.
  Fresh/populated migration, drift rejection, actual CLI edit/apply/outcome, pre/post backup,
  encrypted export, restored current tasks/files/checker and PG16→PG18 foundation journeys PASS.
  Focused backup/restore, deploy-preflight, production topology, host web gate and dev lifecycle
  shell contracts PASS. `make config`, registry drift, Ruff, scoped Pyright, `pnpm lint:shell`
  (ShellCheck 0.11.0), formatting and Python LSP PASS. LSP covers app/tests/migrations and the new
  maintenance package, entry point and tests.
- Reviewed hygiene dry-run, `make clean` and `make clean-check`: PASS. Isolated fixture resources,
  downloaded host tools and owned temporary test/report files were cleaned.
- API generation and browser checks remain not applicable: the internal DTO changed, not the
  existing public HTTP routes/schema or frontend consumers. Full/Release and production acceptance
  were not run. No commits/ship/deploy; pre-existing staged artifacts retain their original hash.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Pillow 12.3.0 was added for actual bounded image verification/decoding. Signature-only checks
  were insufficient; stored input bytes are never transcoded. Byte limits can be lowered, while
  raising their ceilings or accepting animated/nested-archive inputs needs a resource review.
- The model/checker projections are internal server boundaries in this stage. Existing lesson
  HTTP/browser consumers remain on their prior source until the next coordinated cutover.
- Production schema/PG18 compatibility proof for the exact prior SHA, installed timer acceptance
  and the actual weekly off-VPS copy remain release/operator actions, not local-work evidence.

## Commit Message

```text
feat(change-114): add practice model and operator tooling
```
