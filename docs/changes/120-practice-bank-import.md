# CHANGE 120 — Practice bank import

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `120` |
| Slug | `practice-bank-import` |
| Title | Practice bank import |
| Status | `active` |
| Branch | `feature/120-practice-bank-import` |

## Goal

Import the complete current KEGE type 5/16 selection into the dev catalog, with a portable
production package. Preserve source answers without independent solving; prepare missing
text explanations, private acquisition provenance, neutral stable IDs and lesson-level links.
Architect approved the revised plan in chat; production import/deploy is not authorized here.

## Backlog

### Backend
- [x] `B1` Add backward-compatible private provenance and optional theory sections, migrate schema and update public/operator projections, package validation and recovery contracts. — _Depends on:_ —

### Frontend
- [x] `F1` Consume regenerated contracts and link to whole lessons without hashes when section is absent; preserve existing anchored links and established practice UI. — _Depends on:_ B1

### Data
- [x] `D1` Capture sanitized source selection and stable UUID mapping, convert complete conditions/solutions, exclude video/user data, and produce deterministic portable packages with source answers and original comments. — _Depends on:_ B1
- [x] `D2` Prepare missing task-specific explanations/hints; report contradictions for manual review without replacing source answers or claiming independent verification. — _Depends on:_ D1
- [x] `D3` Validate/diff and import ready tasks into dev with pre/post backups; prove API/catalog/checker visibility and package replay. — _Depends on:_ D2, F1

### Other
- [x] `R1` Research current practice catalog/solving UX, compare primary-source guidance and document prioritized proposals; no UI implementation. — _Added from architect chat, 2026-09-13; [research](../artifacts/practice-ux-research.md)._
- [x] `T1` Verify populated/fresh migration, provenance privacy/export/restore and link compatibility; browser check desktop/mobile, run affected Critical Gate/LSP and repository hygiene. — _Depends on:_ B1, F1, D3
- [x] `T2` Document package identity, counts, exceptions, answer trust and production transfer procedure with environment-owned credentials/backups. — _Depends on:_ D3

## Files

### Create / modify
```
apps/api/app/core/database.py
apps/api/app/modules/practice/
apps/api/migrations/versions/
apps/api/tests/test_practice*
apps/web/src/pages/practice-task/
apps/web/src/entities/practice-task/
apps/web/src/shared/api/schema.ts
apps/web/tests/practice-task-parser.test.ts
contracts/openapi.json
content/practice-imports/
infra/database-schema
scripts/docker-dev-lifecycle.sh
scripts/lib/application-db-release.sh
scripts/tests/deploy-preflight.test.sh
scripts/lib/application_db/
scripts/tests/application_db_test.py
scripts/tests/practice-model-tooling.test.sh
.prettierignore
docs/SPEC.md
docs/STACK.md
docs/runbooks/practice.md
docs/runbooks/production.md
docs/runbooks/backup-restore.md
docs/changes/120-practice-bank-import.md
```

### Do NOT touch
- Existing staged lesson lists/reference images.
- Production services/data, archived changes and existing lesson memberships.

## Contracts

See `docs/SPEC.md` §3–§4 and the Files list above. Existing practice page is the visual reference;
reuse its source/theory/learning blocks, without a new layout or shared visual primitive.

## Gate Checks

Affected Critical Gate from [STACK](../STACK.md). Additional focused acceptance: isolated PG18
fresh/populated migration and restore invariants; actual dev import and repeat outcome;
all imported task API/checker projections and representative desktop/mobile browser journeys.
Do not run Full Gate or deploy. Human mathematical verification is explicitly deferred to architect.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Missing source solutions were authored as methodological explanations with task-specific
  targets and unchanged source answers. They are not independently verified worked calculations;
  mathematical review remains the architect's explicitly accepted manual step.
- The initial import remains immutable. A separate 192-task editorial package fixes false
  ratio classification caused by matching "отношени" inside "соотношениями", removes the
  irrelevant paragraph and adds selected concrete derivations. Apply both packages in order.
- Schema 120_01 adds a compatibility boundary: original 114_01 runtime rollback is not supported
  merely because tables were extended. Release proof is bound to both schema and candidate SHA.
- TypeScript MCP reported the known missing-realpath adapter diagnostics in the TanStack server
  function. Workspace tsc and a realpath-aware language-service host were used to verify it;
  application imports were not weakened to work around the external adapter.

### Verification

- Fresh PG18 upgrade to 120_01 and model drift check passed. Populated 114_01→120_01
  preserved 150 legacy tasks and their public provenance; existing memberships are unchanged.
- Focused API tests: 26 passed (model/operator, health, readers and complete source packages).
  Web focused tests: 39 passed; the strengthened lesson-link parser fixture also passed (17 tests).
- Application backup tests: 6 passed with isolated PostgreSQL, including 114_01 compatibility.
  Deploy-preflight and Docker lifecycle shell contracts passed.
- Ruff, app/maintenance Pyright, web tsc/lint, API contract drift and shell lint passed.
  Python LSP passed; TS LSP adapter qualification is above. Full Gate was not requested.
- All 547 task detail/checker projections verified against real dev PostgreSQL through ASGI;
  both complete catalogs match imported UUIDs, no acquisition provenance/checker leaks.
  Desktop/mobile browser checks covered filtering, pagination, source display, code/formulas,
  answer submission, persisted progress and both whole-lesson links; SSR privacy check passed.
- Dev has 697 total tasks / 547 catalog tasks. Both immutable packages replay as
  already_committed. Final snapshot a66e9096 restored into disposable PostgreSQL and verified
  all 697 tasks with the shipped reader/checker in 14 seconds (local evidence, not production RTO).
  Final make dev rebuilt changed image inputs and all application services became healthy.
- Format check and cleanup dry-run/clean/clean-check passed; disposable test databases were removed.
  Existing staged lesson-list/reference-image additions remain untouched. No commit, merge or deploy.

## Commit Message

```
feat(change-120): import exam practice bank with private provenance
```
