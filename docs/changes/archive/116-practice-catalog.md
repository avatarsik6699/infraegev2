# CHANGE 116 — Independent practice catalog

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `116` |
| Slug | `practice-catalog` |
| Title | Independent practice catalog |
| Status | `archived` |
| Branch | `feature/116-practice-catalog` |

## Goal

Deliver the approved fourth practice stage: a server-backed catalog and standalone task pages,
with filters, bounded pagination, repeat solving and independent browser progress. Reuse the
115 reader/checker/file boundary; keep lesson content, membership and progress independent.
Mode: `continue`. Source: `auto: SPEC roadmap + change history`, explicitly approved in chat.
SPEC behavior is unchanged. Production activation and legacy deletion remain stage 5.

## Design References

Extend the accepted `/courses`, `/courses/python` and `/lab/design-system` visual language.
Catalog: compact heading, labelled filters and open task rows; page-owned paper/grid composition,
Typography, ActionLink, Field and Button. Task: quieter learning/practice-flow
specimen, existing structured statement/help/download rendering and accessible answer feedback.
This working list deliberately uses readable rows rather than illustrated course cards; tasks
have no invented cover art. Keep source attribution subordinate to the task and preserve SSR/no-JS.
No new visual direction, assets, persistence library or competing design documentation.

## Backlog

### Backend

- [x] `B1` Implement bounded typed catalog projections with skill/exam/difficulty filters,
  stable cursor pagination bound to filters and newest-first ordering. Return compact metadata
  without statement/checker payloads; exclude hidden/archived tasks. Add only necessary additive
  indexes and migration/compatibility support, and prove query plans at 10,000 synthetic tasks
  — _Depends on:_ —
- [x] `B2` Expose catalog API and bounded discovery projections for runtime sitemap partitioning.
  Preserve individual-task availability, checker revision and immutable file delivery. Update
  OpenAPI/client together, validate input and cursor errors, and separate Nginx read limits from
  checker limits — _Depends on:_ B1

### Frontend

- [x] `F1` Add `/practice` with URL-owned filters, paginated real links, typed server loading,
  visible classification and current revision progress; public chrome links to the real route.
  Handle empty/invalid/unavailable states and keyboard/mobile/SSR/no-JS through shared primitives
  — _Depends on:_ B2
- [x] `F2` Add `/practice/$taskId` with the existing content/help/checker/file components, compact
  provenance and available theory links. Implement independent task ID/revision browser progress,
  historical success, explicit repeat-solving, stale refresh preserving input and local retry.
  Do not grant or reset lesson progress; hidden lesson tasks remain unindexed
  — _Depends on:_ B2, F1
- [x] `F3` Add canonical/social metadata and bounded runtime sitemap index/part routes for visible
  tasks without build-time DB reads; exclude arbitrary filter combinations and unavailable tasks.
  Preserve existing publication routes and make dependency failures explicit — _Depends on:_ F1, F2

### Other

- [x] `T1` Add focused isolated PostgreSQL/API tests for pagination/filter ties and invalid cursors,
  hidden/archived/shared tasks, bounded queries/payloads/plans and sitemap growth. Frontend tests
  cover URL state, independent revision history/repeat and safe projection. Browser journeys use
  domain fixtures/Page Objects for filtering, paging, solving, reload, stale/errors and no-JS
  — _Depends on:_ F3
- [x] `T2` Run one affected Critical Gate plus required Python/TypeScript LSP and browser screenshot/
  console checks on desktop/mobile, keyboard, delayed/failed requests and file delivery. Verify a
  production build without API access, synchronize STACK/FRONTEND/runbook ownership, record manual
  acceptance steps and clean analyzed artifacts — _Depends on:_ T1

## Files

### Create / modify

```text
apps/api/app/modules/practice/{catalog,api,readers,models,schemas}.py
apps/api/migrations/ (only additive catalog indexes and version compatibility if needed)
apps/api/tests/test_practice_catalog.py and focused existing reader/API fixtures
apps/api/app/modules/practice/service.py (schema compatibility only if migration needed)
apps/web/src/entities/practice-task/ (typed catalog/task/server adapters)
apps/web/src/features/practice-progress/ (independent revision-aware store)
apps/web/src/features/lesson-practice/ (shared standalone/repeat capability only)
apps/web/src/pages/practice-catalog/ and practice-task/
apps/web/src/pages/design-system-lab/ (owning reusable specimen if changed)
apps/web/src/routes/practice* and sitemap* (thin wiring)
apps/web/src/shared/lib/seo/ and pages/site-discovery/
apps/web/src/app/providers/app-providers.tsx (independent progress provider)
apps/web/src/widgets/public-header/ and owning navigation configuration
apps/web/src/shared/api/schema.ts, contracts/openapi.json (generated)
apps/web/tests/, apps/web/e2e/{fixtures.ts,practice-catalog.spec.ts,pages/}
scripts/tests/practice-catalog.test.sh (isolated host-run DB/browser fixture)
infra/nginx/ (read limits only)
docs/STACK.md, docs/FRONTEND.md, docs/runbooks/practice.md
```

### Do NOT touch

- User-owned `docs/artifacts/` content and staged state; archives and frozen migration snapshots.
- Authored theory/tasks, lesson membership/publication, automatic catalog publication of the 150 exercises.
- Production credentials/data/deployment, accounts, editor, sessions, learner analytics or attempt storage.
- Legacy source/runtime deletion, rollback volumes and sibling repositories.

## Contracts

See `docs/SPEC.md` §3.2, §4.1, §5, §8 and §9.2; `docs/FRONTEND.md`; Files above.

## Gate Checks

Use the affected Critical Gate in [STACK](../../STACK.md), isolated PostgreSQL and host test runners.
Prove bounded reads at 10,000 synthetic tasks; no whole-bank payload or N+1. Synthetic tasks are
isolated fixtures only, never production or automatic dev content. Reuse existing reader/checker
contracts and domain browser fixtures. Full/Release and human visual/content approval remain separate.

Verified locally: formatting, web lint/typecheck, Ruff/Pyright, shell lint/syntax and API drift
passed; 69 focused web tests, 165 checker API tests, 2 isolated catalog DB/API tests and 6 browser
journeys passed. The legacy imported-bank reader test requires its separate 114 fixture and was
skipped in the direct pytest run; the 116 fixture verifies real DB reads/checks independently.
Production build succeeded with an unreachable API. Nginx configuration passed, and the six-byte
download matched the frozen source with attachment/nosniff headers. Desktop/mobile MCP screenshots,
keyboard, no-JS and delayed/failed requests were checked. Temporary fixture servers and databases
were stopped; analyzed outputs were removed with the repository allowlisted cleanup.

Python LSP and ordinary TypeScript source diagnostics passed. TanStack server-function MCP errors
were reproduced as the installed adapter's missing-realpath defect; the same language-service
host with realpath and the workspace compiler report no errors (KNOWN_GOTCHAS).
An additional broad privacy browser journey stopped at an existing 6px public-chrome geometry
expectation; its stylesheet/assertion are unchanged. Publication discovery was then verified by
its dedicated passing journey. Full privacy regression is not claimed by this change.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Existing indexes were sufficient at 10,000 synthetic visible tasks: one projected SQL query,
  31/101 rows for default/maximum page probes, approximately 12/18 ms in the initial local run.
  No schema revision or migration was added; no whole-bank object payload or process cache exists.
- Runtime discovery endpoints live outside `/api/tasks/{id}` to preserve all existing task IDs.
  Public entity exports wrap server loaders in `createServerOnlyFn` so the new browser search
  helpers cannot retain server imports through the shared barrel.
- Independent visual finish review found no material defects in desktop/mobile catalog and task
  screenshots. The named impeccable agent types were unavailable; isolated default/worker agents
  performed the read-only review and canonical FRONTEND documentation handoff instead.
- All 150 original exercises remain hidden from the standalone catalog. Synthetic acceptance data
  exists only in disposable test databases. Human content/visual acceptance and release remain separate.

## Commit Message

```text
feat(change-116): add independent practice catalog
```
