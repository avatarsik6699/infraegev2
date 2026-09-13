# CHANGE 115 — Existing lesson practice cutover

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `115` |
| Slug | `lesson-practice-cutover` |
| Title | Existing lesson practice cutover |
| Status | `active` |
| Branch | `feature/115-lesson-practice-cutover` |

## Goal

Move existing TopicLesson and CourseLesson practice to the server-owned bank while preserving
task IDs, content, ordering and previously earned progress. Lesson practice, course overview and
course catalog must agree about the current task versions and mastery, including after an edit
or a request from an old tab. Theory, publication and curriculum stay in code.

Mode: `continue`. Source: `auto: SPEC roadmap + change history`, following the architect's
instruction to proceed after local ship 114. SPEC behavior is unchanged; its stale active-113
link is corrected to the shipped archives. No production deployment follows from this change.

## Design References

Use `/lab/design-system` learning/practice-flow specimen and the existing Topic/Course lesson
practice as the study reference; `/courses` and `/courses/python` remain the catalog/overview
references. Reuse LessonPracticeFlow, existing feedback, Field, Button, Progress, Badge and Image.
Pages retain composition; the owning practice/progress features add stale-version and dependency
failure states. No new visual direction or decorative capability is planned.

## Backlog

### Data

- [x] `D1` Inventory the existing task corpus, files, checker values, membership/order and theory
  references. Build a deterministic bounded conversion into the 114 import package through the
  existing writer service, with stable IDs and an explicit first-import revision mapping for
  browser progress. Preserve authored bytes/text and unknown provenance rather than inventing
  sources; keep imported exercises hidden from the future standalone catalog. Store the migration
  input/membership snapshot outside runtime publication definitions so removing practiceTaskIds
  does not destroy reproducibility. Prove complete parity and idempotent replay; reject unresolved
  references or ambiguous conversion before writing — _Depends on:_ —

### Backend

- [x] `B1` Extend the release-owned material registry with the kind, publication and course
  membership information needed by the approved readers. Implement typed service projections
  for ordered lesson practice and batched course summaries from current DB relations, with
  bounded query counts instead of per-task/per-lesson reads. Preserve independent Topic/Course
  identity and reject unavailable materials/tasks using the current release registry
  — _Depends on:_ D1
- [x] `B2` Expose the approved lesson practice/course summary and individual task reads; switch
  the existing checker to the shared DB service and mandatory solution revision. Read checker,
  explanation and revision consistently; return the documented stale/unavailable/dependency
  outcomes without leaking checker values or storing learner answers. Update OpenAPI and its
  generated consumer together; define and test the pre-cutover client response path when the
  request has no revision. Keep catalog search/pagination for the next stage — _Depends on:_ B1
- [x] `B3` Connect public file usages to persistent immutable storage and the existing Nginx
  delivery boundary. Preserve filenames, bytes, MIME, image geometry and accessible descriptions;
  resolve only validated object references, including availability and traversal rejection.
  Public rendering must not require access to the legacy content mount — _Depends on:_ D1, B2

### Frontend

- [x] `F1` Replace lesson JSON reads with the owning slice's typed server/API adapters; remove
  runtime practiceTaskIds from lesson definitions/publication and course progress metadata once
  D1 preserves the migration source. Load course summaries at the owning page boundary and reuse
  them for overview/catalog calculation without requests per card/lesson. Keep theory readable
  during practice dependency failure, avoid build-time production DB access and permanent task
  caches, and retain SSR/no-JS content and publication visibility — _Depends on:_ B2, B3
- [x] `F2` Migrate both existing registry and per-lesson browser progress formats to task ID plus
  solution revision using the verified first-import mapping. Preserve historical successes,
  accepted answers and lesson isolation; count only the current revision toward mastery, explain
  when a changed task needs repetition, and keep reset/continuation consistent across lesson,
  overview and course catalog. Use the existing app-scoped store and one shared domain calculation;
  no new persistence framework or standalone catalog progress yet — _Depends on:_ D1, F1
- [x] `F3` Send the displayed solution revision when checking answers. On stale revision retain
  input, offer an explicit refresh and do not automatically resubmit or grant success; handle
  unavailable task and network/DB failure with accessible local feedback and retry. Cover an
  already-open pre-cutover tab as well as a versioned tab. Preserve the established study layout,
  keyboard/focus behavior and neutral progress semantics; update the owning lab specimen if its
  reusable states change — _Depends on:_ B2, F1, F2

### Infra

- [x] `I1` Document and rehearse the explicit local bootstrap and release cutover sequence:
  register/migrate, convert/validate/diff, pre-backup, import/outcome, parity/API smoke, post-backup,
  then activate consumers. Reuse the 114 CLI and Python maintenance owners, keeping shell thin.
  Separate test/dev credentials; make fresh local setup reproducible without implicitly importing
  at every API startup or overwriting operator edits. Preserve rollback compatibility checks and
  source data/volumes; actual production cutover and final legacy deletion remain stage 5
  — _Depends on:_ D1, B1, B2, B3, F1

### Other

- [x] `T1` Add focused host-run PostgreSQL/API and frontend tests for migration parity/replay,
  hidden/shared/archived tasks, publication boundaries, revision-consistent checking, legacy and
  versioned stale tabs, both stored progress formats, substantial/editorial edits, reset and
  equal lesson/overview/catalog results. Prove bounded read queries, no checker in public
  API/SSR payloads and no runtime legacy fallback when DB is unavailable — _Depends on:_ F2, F3, I1
- [x] `T2` Run the affected Critical Gate with API generation, Python/TypeScript LSP and focused
  browser journeys through domain fixtures/Page Objects. Verify Topic and Python lessons,
  overview/catalog consistency, mobile/keyboard, no-JS, slow/failed requests, stale-tab refresh
  and actual file delivery. Rehearse nonempty restore with the shipped readers/checker; document
  manual review steps, synchronize STACK/owning runbooks and clean analyzed artifacts. Separate
  local verification from outstanding human/release acceptance — _Depends on:_ T1

## Files

### Create / modify

```text
Backend:
  apps/api/app/modules/practice/ (read projections, registry, API, legacy package conversion)
  apps/api/app/modules/tasks/api.py and schemas.py
  apps/api/app/api/ (router composition)
  apps/api/app/core/database.py and config.py (only required lifecycle/settings)
  apps/api/practice-registry.json (generated)
  apps/api/tests/test_practice_*.py and test_tasks_api.py
  apps/api/migrations/ (only if registry/reader needs a reviewed additive change)
Data/tooling:
  content/practice-migration/ (new immutable initial migration inputs/membership mapping)
  scripts/practice-registry.mjs
  scripts/validate-content-links.mjs and scripts/lib/task-content-assets.mjs
  scripts/tests/practice-*.test.sh (focused host fixture integration)
Frontend:
  apps/web/src/entities/practice-task/
  apps/web/src/entities/lesson/lib/define-lesson.types.ts
  apps/web/src/entities/lesson/content/*.lesson.tsx (membership field only)
  apps/web/src/entities/course/ (publication, types, progress, catalog metadata)
  apps/web/src/entities/course/content/*.lesson.tsx (membership field only)
  apps/web/src/features/lesson-practice/ and lesson-progress/
  apps/web/src/widgets/lesson-practice-flow/
  apps/web/src/pages/topic-lesson/, course-lesson/, course-overview/, course-catalog/
  apps/web/src/pages/design-system-lab/widget-practice-flow-specimen.tsx
  apps/web/src/routes/ (thin route loader wiring only)
  apps/web/src/shared/api/schema.ts (generated) and owning transport adapter
  apps/web/tests/ (affected practice, lesson, progress and course contracts)
  apps/web/e2e/fixtures.ts, focused specs and owning Page Objects
Infrastructure/documentation:
  infra/nginx/ (task file delivery and scoped API rate limits)
  infra/docker-compose*.yml, apps/api/Dockerfile, apps/web/Dockerfile
  Makefile and scripts/docker-dev-lifecycle.sh (explicit local initialization if needed)
  docs/SPEC.md (archive link correction only)
  docs/STACK.md, docs/runbooks/practice.md, backup-restore.md, production.md
  docs/KNOWN_GOTCHAS.md (confirmed findings only)
  docs/changes/115-lesson-practice-cutover.md
```

### Do NOT touch

- User-owned `docs/artifacts/` files or their index state.
- Authored theory, task wording/checker semantics and curriculum/publication decisions.
- `/practice` catalog/task pages, search/filter/pagination, new accounts or attempts/analytics.
- Production secrets/data, operations or sibling repositories, rollback volumes.
- Historical archives and final removal of legacy source/runtime compatibility assets before
  the stage-5 production/restore/rollback proof. Existing consumers switch without a JSON fallback.

## Contracts

See `docs/SPEC.md` §3.2, §4.1, §5, §8.1 and §9.2; `docs/FRONTEND.md`; the Files list above.

## Gate Checks

Critical Gate is defined in [STACK](../STACK.md); Full/Release remain explicit modes.
Use isolated PostgreSQL and host test runners, never production or SQLite substitution.
API generation and browser/LSP checks apply because this change switches public consumers.
Capture before/after migration parity and a real DB/file restore using the current application.
A green gate does not replace manual UX/content review or authorize production cutover.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Architect completed manual product verification and approved continuing to local ship on
  2026-09-13. This does not authorize production activation.

- Architect approved rejecting pre-cutover requests without a revision (`422`) and manual page
  reload on 2026-09-13. An already-open old tab retains its generic error message; no preliminary
  client release is required. Versioned clients show explicit refresh without automatic resubmission.
- Progress uses a new app-scoped storage key so old tabs cannot overwrite revision-aware history.
  Legacy successes migrate only through the frozen first-import membership/revision mapping.
- Local verification passed: 165 API tests, 24 PostgreSQL/import/restore checks, 63 focused frontend
  tests and five domain-fixture browser journeys. Production build succeeded with an unreachable
  API address, proving no build-time practice dependency. Browser inspection covered desktop/mobile,
  DB failure/recovery and console; real Nginx delivery preserved the six-byte attachment.
- Required Python LSP and targeted TypeScript LSP checks passed. The broad TypeScript directory
  request was too slow; a fresh instance of the same MCP server verified the affected adapters,
  progress storage, practice model and widget instead. Repository type checks passed in full.
- Bootstrap and nonempty restore were rehearsed with disposable credentials, isolated PostgreSQL
  and local Restic snapshots. Production cutover, pedagogy/visual approval and final legacy deletion
  remain outside this local implementation. Manual review steps are in the practice runbook.

## Commit Message

```text
feat(change-115): move lesson practice to the server-owned bank
```
