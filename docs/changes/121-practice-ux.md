# CHANGE 121 — Practice catalog and solving UX

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `121` |
| Slug | `practice-ux` |
| Title | Practice catalog and solving UX |
| Status | `active` |
| Branch | `feature/121-practice-ux` |

## Goal

Make the imported practice bank easier to browse and give each standalone task a continuous
solve → understand → continue flow. Preserve the infraege visual identity, source answers,
private provenance and independent revision-aware browser progress. Implement the architect's
approved UX plan, including explicitly labelled fictional statistics only in the design lab;
production transfer and authorship of full solutions for the entire bank are outside this change.

Source: chat-approved plan and [practice UX research](../artifacts/practice-ux-research.md),
following locally archived Change 120. Mode: `continue`; no new product/design baseline.

## Design References

- `/courses` and `/courses/python`: accepted paper/ink/orange identity, typography, open
  compositions and subordinate metadata.
- `/lab/design-system#system-visual-language`: `VisualLanguageLearning`, `VisualLanguageForm`
  and `VisualLanguageStates`; extend the existing standalone practice specimen for the full flow.
- Shared primitives: `PageContainer`, `Typography`, `ActionLink`, `Button`, existing form
  controls, `Accordion`, `CodeBlock`, `Notation`, `StatusScene` and structured practice renderer.
  Pages own reading width, spacing and catalog composition; no private theme or new math engine.
- Catalog: compact title → immediate exam choices → extra filters → count/active constraints →
  preview rows. Task: return → compact identity → statement → answer/instruction → feedback →
  help/theory → manual continuation. Decoration stays outside the reading stream.
- Lab scenarios: short formula, long statement, equivalent code variants and a task attachment;
  empty catalog, no matches, load failure, wrong answer, service failure and success.

## Backlog

### Backend

- [x] `B1` Add the approved nullable preview and explicit explanation classification to the
  task model, strict public/operator contracts and a forward Alembic migration. Preserve old
  package defaults, editorial solution revisions, optimistic concurrency, export/import and
  restore compatibility; update schema readiness/release compatibility markers together.
  — _Depends on:_ —
- [x] `B2` Extend bounded catalog reads with previews and filtered total, visible-bank facets
  and readable skill labels; implement next-task lookup in the same filtered order. Keep
  hidden/archived tasks and private provenance excluded, invalid context explicit, and no task
  bodies/checker in list queries. Regenerate OpenAPI and client contracts. — _Depends on:_ B1
- [x] `B3` Extend the strict content contract with explicit equivalent-language groups and safe
  formula notation; retain legacy blocks and linear SSR/no-JS rendering. Validate group members,
  language labels and markup without inferring equivalence from adjacency; cover operator
  round-trip and backward-compatible source packages. — _Depends on:_ B1

### Frontend

- [x] `F1` Build lab-first catalog/task compositions using the accepted specimens and shared
  primitives. Include clearly labelled fictional time/statistics only in lab fixtures, with
  complete/missing/partial/long values and desktop/mobile states. Establish reading hierarchy,
  answer placement, compact sources and error/success arrangements before production rollout.
  — _Depends on:_ —
- [x] `F2` Consume the extended contracts in the owning practice entity/loader. Add validated
  catalog return context and next-task loading, preserving page/filter/row identity, direct-entry
  fallback and local next-load failure. Keep routes thin, network in owning API adapters and
  navigation composition in pages; no arbitrary return URLs or whole-bank client load.
  — _Depends on:_ B2
- [x] `F3` Refactor the catalog: immediate visible-bank exam choices, readable advanced selects,
  mobile disclosure, apply/reset/removable constraints, result count and short preview rows.
  Show current/old revision progress only after hydration. Preserve GET/no-JS filters, cursor
  reset/pagination and distinct empty-bank/no-match/error states; no progress filter.
  — _Depends on:_ F1, F2
- [x] `F4` Refactor standalone solving into one compact reading column. Place instructions beside
  input, preserve entered values/deduplicated submission and distinguish wrong/service/stale
  feedback. Show one structured explanation with honest classification, immediately available
  help and compact source/theory metadata. Preserve repeat-solving history and lesson consumers;
  help disclosure must not mark a task solved. — _Depends on:_ F1, F2, B3
- [x] `F5` Complete manual next-task and return journeys, including page boundaries, solved next
  tasks, last task, direct entry and recoverable next-load failure. Restore catalog scroll or
  originating row and tab-scoped answer drafts keyed by task/revision through shared platform
  adapters; retain drafts across theory navigation without restoring them into a different version.
  — _Depends on:_ F3, F4
- [x] `F6` Render explicitly grouped code with Python selected when available and accessible
  language controls; retain all variants without JS. Use existing `Notation` for explicit math
  vs code, preserving symbols/indices/parentheses, table/file access and legacy lesson rendering.
  — _Depends on:_ B3, F4

### Data

- [x] `D1` Prepare a new deterministic immutable editorial package for the imported №5/№16 bank:
  distinctive answer-free previews, meaningful skills, honest explanation classification and
  explicitly verified presentation groups/notation. Do not manufacture full worked solutions or
  independently recompute answers. Preserve UUID, source answers, private acquisition provenance,
  condition meaning and solution revision; do not rewrite the applied Change 120 packages.
  — _Depends on:_ B1, B3
- [x] `D2` Validate/diff the new package, take a dev backup, apply through the existing operator
  flow, verify catalog/checker/privacy and replay, then take a post-import backup. Prove a
  nonempty restore retains new fields, files and checkability. Record actual package identity,
  counts and classification limitations without claiming mathematical verification.
  — _Depends on:_ D1, F3, F4, F6

### Infra

None. Schema compatibility markers may change under B1; no new service or production operation.

### Other

- [x] `T1` Run one affected-area Critical Gate for the completed implementation, required Python
  and TypeScript LSP diagnostics and browser MCP verification. Cover the focused matrix below;
  inspect evidence, update the backlog honestly and finish repository cleanup.
  — _Depends on:_ B2, B3, F3, F4, F5, F6, D2
- [x] `T2` Synchronize operator/schema documentation and record concise verification evidence and
  residual limitations. Leave the change active for the architect's manual product review;
  do not ship, push or deploy automatically. — _Depends on:_ T1

## Files

### Create / modify

Backend/data:
```text
apps/api/app/modules/practice/{models,schemas,catalog,api,readers,service,commands}.py
apps/api/app/modules/practice/ux_editorial.py
apps/api/app/modules/practice/{kompege,legacy}.py (preserve frozen encoding defaults)
apps/api/app/core/database.py
apps/api/migrations/versions/121_01_practice_ux.py
apps/api/tests/test_practice_*.py
contracts/openapi.json
content/practice-imports/121-practice-ux/
```

Frontend:
```text
apps/web/src/pages/practice-catalog/
apps/web/src/pages/practice-task/
apps/web/src/pages/design-system-lab/
apps/web/src/entities/practice-task/
apps/web/src/features/lesson-practice/
apps/web/src/features/practice-progress/
apps/web/src/shared/lib/ (owning storage/scroll adapters only)
apps/web/src/shared/components/ (only reused practice presentation capabilities)
apps/web/src/shared/api/schema.ts
apps/web/eslint.config.js
apps/web/scripts/verify-app-architecture.mjs
apps/web/tests/safe-ls-store.test.ts
apps/web/src/routes/practice*.tsx
apps/web/src/routeTree.gen.ts (generator-owned if needed)
apps/web/tests/*practice*.test.*
apps/web/e2e/fixtures.ts
apps/web/e2e/pages/practice*.page.ts
apps/web/e2e/practice*.spec.ts
```

Schema tooling, focused acceptance and documentation:
```text
infra/database-schema
scripts/docker-dev-lifecycle.sh (schema compatibility only)
scripts/lib/application-db-release.sh (schema compatibility only)
scripts/lib/application_db/ (restore compatibility only if required)
scripts/tests/{practice-catalog,practice-model-tooling,deploy-preflight}.test.sh
scripts/tests/application_db_test.py
docs/{SPEC,FRONTEND,STACK}.md
docs/runbooks/{practice,practice-transition,backup-restore}.md
docs/changes/121-practice-ux.md
```

### Do NOT touch

- Applied packages and frozen source/identity/editorial artifacts under
  `content/practice-imports/120-ege-5-16/` and `content/practice-migration/`.
- Existing lesson memberships, source answers and task solution revisions for presentation edits.
- Production services/data, legacy rollback volumes/assets and archived changes.
- The preserved reference PNG files and `docs/artifacts/lessons_list.md`.
- Statistics tables/APIs, user accounts, server attempt history, adaptive sessions or a new renderer engine.

## Contracts

See [SPEC](../SPEC.md) §3.2, §4.1 and §5.1, [FRONTEND](../FRONTEND.md) §3–§4 and
the Files list above. The agreed schema/API changes are within this change's authorized scope.

## Implementation Order and Ownership

1. F1 establishes the complete page/state composition in the lab. B1/B3 establish compatible
   data/content contracts before B2 and generated consumers; D1 uses those contracts.
2. F2 integrates transport/navigation types. F3 implements catalog selection; F4/F6 implement
   readable solving; F5 connects the complete journey. D2 installs the editorial package on dev.
3. T1 validates the complete target set once; T2 leaves an evidence-backed manual-review handoff.

Current flow is route/server function → practice entity API adapter → FastAPI practice module →
catalog projection or full public reader → PostgreSQL. The standalone page composes the existing
practice feature/checker and separate progress owner. Keep these boundaries. The page owns
return/next context; the practice feature owns attempt/help state; shared platform adapters own
storage/scroll access. Do not introduce a global store or peer-layer dependencies.

For continuation, a client-only page cache would fail at page boundaries and direct entry;
choose the server neighbor projection. For code variants, runtime heuristics would risk hiding
different algorithms; choose explicit editorial grouping. For solving UI, duplicating the checker
would fork behavior; retain shared attempt/checking behavior while isolating standalone composition.
Use additive fields/defaults for legacy packages, a separate editorial package and the existing
revision guard. If an older application cannot read new blocks, reject incompatible rollback via
release/schema preflight instead of silently losing content; verify the exact compatibility path.

## Gate Checks

One affected-area Critical Gate from [STACK](../STACK.md), with these acceptance targets:

- Fresh and populated migration, schema drift, old-package compatibility, editorial revision
  invariants, export/import/replay and nonempty restore of new fields/content.
- Catalog count/filter/cursor rules, hidden/archived exclusion, readable facets and bounded queries
  on the existing 10,000-task synthetic fixture. Verify next lookup under filters, page boundaries,
  unavailable current task, end of selection and no checker/private provenance exposure.
- Focused browser journeys for finding a task, wrong answer → help → success → next → return,
  repeat solving, service/stale/next-load errors, answer draft across theory and revision change.
  Regression-check shared lesson checker, progress and help rendering.
- Desktop and 390px mobile, keyboard/focus, zoom, delayed hydration/network and SSR/no-JS.
  Verify no false pre-hydration progress, duplicate success explanation or horizontal page overflow;
  inspect screenshot and console through browser MCP. Use fresh production output for affected
  loading/layout-stability cases per FRONTEND §4.2, not only settled dev screenshots.
- Demonstration label and full/missing/partial/long lab values; fake statistics remain absent from
  real `/practice` and task responses/pages in every environment, including dev.
- Regenerate contracts and prove `pnpm api:check`; use required Python/TypeScript LSP in addition
  to compiler gates. E2E specs use the existing domain fixture/POM policy.
- Finish with `make clean-dry-run`, review the allowlist, `make clean`, `make clean-check`.

Manual learner sessions proposed by the research are a follow-up, not fabricated acceptance
evidence or a blocker to implementation. Architect visual/product review precedes a later `/ship 121`.

## Architect Review Notes

- [x] No architect review issues recorded

## Verification — 2026-09-16

- Critical Gate: repository format, web lint/architecture policies, Ruff, TypeScript and Pyright,
  shell lint/syntax and API drift checks passed. Focused frontend: 50 tests; editorial/source
  package tests: 11 passed (DB-dependent legacy case covered separately). Isolated PostgreSQL:
  25 model/tooling tests plus 6 backup contracts; 10,000-task catalog tests and all 7 browser
  journeys passed. Deployment preflight and dev lifecycle contracts passed.
- Python MCP diagnostics passed. TypeScript MCP passed for entity, practice feature, storage and
  select/lab changes; server-function/E2E diagnostics reproduced the documented pnpm realpath
  adapter limitation. The realpath-aware workspace language service checked all 34 changed
  production TS files with zero diagnostics, alongside successful tsc, typed lint and build.
- Browser MCP screenshots/console checked dev and fresh production output: desktop 1440px,
  mobile 390px, reduced viewport/reflow, native filters, keyboard language controls, wrong/service
  feedback, success with one explanation, lab metrics and code/formula examples. No new browser
  warnings/errors or horizontal overflow. Delayed JavaScript kept catalog geometry unchanged;
  code groups retain all three authored variants before enhancement/no-JS and select Python after
  enhancement. Inputs stay disabled before hydration; no false solved marks were shown.
- Actual theory navigation `/ege/16-rekursiya` and back retained the tab draft. Unit coverage
  confirms drafts do not cross solution revisions; E2E covers filtered cross-page continuation,
  return to the original row, last task, repeat history and recoverable next-load failure.
- Dev: 547 editorial updates, 697 total tasks, 547 visible; no source answers or solution revisions
  changed. CLI replay returned `already_committed`; operator export retained new fields/groups.
  Pre/post backups completed; post-backup `5afa487b` restored and checked all 697 tasks in isolated
  PostgreSQL. Package identity and source/classification limits are in its README.
- Repository cleanup: inspected `make clean-dry-run`, then `make clean` and `make clean-check`
  passed; persistent dev data, backups and reference assets were retained.
- Full/Release Gate not requested. Production untouched. Manual architect review and learner
  sessions remain separate; this change stays active, with no automatic commit/ship.

## Implementation Notes

- The new 547-task package is immutable operator data, not frontend content. The applied Change
  120 packages and frozen lesson migration remain byte-for-byte untouched.
- Code groups deliberately change from linear SSR/no-JS listings to a selected language on
  enhancement; this preserves offline readability rather than hiding unhydrated alternatives.
- Facets expose only registered readable skill labels. Unknown legacy skill IDs remain accepted
  as filters, but are not suggested with untranslated identifiers.

## Commit Message

```text
feat(change-121): improve practice catalog and solving flow
```
