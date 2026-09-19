# CHANGE 124 — Решение задач прямо в каталоге

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `124` |
| Slug | `practice-inline-solving` |
| Title | Решение задач прямо в каталоге |
| Status | `active` |
| Branch | `feature/124-practice-inline-solving` |

## Goal

Раскрывать и решать несколько задач в каталоге без перехода на отдельную страницу.
Подборка — выдача существующих фильтров; ввод сохраняется при сворачивании до смены
выдачи/ухода/перезагрузки. Детализация остаётся для прямых ссылок и no-JS.
Утверждено архитектором: implement the plan, 2026-09-17.

## Design References

`docs/artifacts/references/practice_catalog/`: (1) и (2) — раскрывающиеся строки,
(3) — теория, (4) — метаданные. Существующая минималистичная идентичность сохраняется.
Новый утверждённый follow-up добавляет поиск, мультивыбор тем, сортировку и пагинацию; избранное только как отключённая кнопка. Без сохранённых подборок и запуска кода.

## Backlog

### Frontend
- [x] F28 Remove verified unused legacy pagination ellipsis selector found during final audit — _Depends on:_ F27
- [x] F1 Общий widget решения, загрузка и детализация без изменения поведения — _Depends on:_ T1
- [x] F2 Строки каталога, метаданные, фильтры и независимая ленивая загрузка — _Depends on:_ F1
- [x] F3 Временное состояние, stale/error recovery, фокус, mobile и SSR — _Depends on:_ F2
- [x] F4 Единая GET-форма фильтров, компактные выбранные фильтры и пояснение о черновиках — _Depends on:_ T3
- [x] F5 Сетка строк по референсам: заголовок, полный второстепенный ID, метаданные, статус и стрелка — _Depends on:_ T3
- [x] F6 Две колонки решения в каталоге, локальный feedback и компактная помощь/теория/источники; прежний вид уроков и детализации — _Depends on:_ F5

- [x] F7 Поиск, grouped multi-combobox тем со счётчиками, справка и сортировка — _Depends on:_ B1
- [x] F8 Компактные строки, UUID, metadata, теория сверху и решение по новому референсу — _Depends on:_ B1
- [x] F9 Минималистичная пагинация, URL/no-JS и совместимость detail navigation — _Depends on:_ B1

- [x] F10 Visual review: compact heading/help, integrated search/clear, shared labels and monochrome focus/caret/selection, bounded topic popup/group hierarchy/Apply/Reset, removable badges and inline Base UI sort — _Depends on:_ F7, F9

- [x] F11 Remove topic group backing, compact filter chips, unify search autofill/focus/icon states and eliminate SSR/hydration swaps and full-document filter reloads — _Depends on:_ F10

- [x] F12 Intuitive pagination with neighbouring pages, clickable gap jumps and integrated quiet limit; compact row ID/title; stable solving/help/collapse toolbar, labelled help panels and no duplicate catalog sources — _Depends on:_ F11

- [x] F13 Center row identifiers, chip/difficulty icons and empty state; simplify catalog answer controls, inline success and adjacent retry/help with field-local errors — _Depends on:_ F12

- [x] F14 Show only active difficulty bars (one/two/three), retaining the current Lucide styling and alignment — _Depends on:_ F13

- [x] F15 Restore all three difficulty bars with a quieter background track and stronger active levels — _Depends on:_ F14

- [x] F16 Unify shared button/link hierarchy, neutral interaction states and navigation exceptions across public pages — _Depends on:_ F15
- [x] F17 Move catalog theory into the stable answer/help toolbar with differentiated actions — _Depends on:_ F16

- [x] F18 Remove duplicate answer instruction, align help styles, restore topic/theory header and center loading indicators without layout shifts — _Depends on:_ F17

- [x] F19 Expand/collapse all tasks on the current catalog page, preserving drafts and loading full statements for browser find — _Depends on:_ F18

- [x] F20 Replace bulk buttons with one accessible toggle in the right end of the list header, including mobile — _Depends on:_ F19

- [x] F21 Remove bulk toggle backing in resting, hover, pressed and expanded states while preserving keyboard focus — _Depends on:_ F20

- [x] F22 Show only Python for task code variants, remove language tabs, preserve ordinary code blocks and verify SSR/browser rendering — _Depends on:_ F21

- [x] F23 Unify task detail with compact catalog solving, compact metadata/theory, remove duplicate actions and next-task navigation — _Depends on:_ F22

- [x] F24 Make topic the sole detail heading; subordinate task title; compose back/theory and available metadata around the heading, reusing catalog difficulty — _Depends on:_ F23

- [x] F25 Separate detail heading/solving spacing, move theory into metadata and make return an icon-only link with accessible hover/focus tooltip — _Depends on:_ F24

- [x] F26 Group the task subtitle with its statement, preserving separation from topic metadata — _Depends on:_ F25

- [x] F27 Position the detail information icon immediately after the main topic heading — _Depends on:_ F26

### Other
- [x] T16 Correct test fixture types and unsupported role-query options exposed by final whole-diff language-service review — _Depends on:_ T14
- [x] T15 Final UI/UX and code audit and affected Critical Gate before explicitly authorized local ship — _Depends on:_ F27
- [x] T14 Verify detail layout, states, SSR/mobile and preserved progress; update contracts and run affected web Critical Gate — _Depends on:_ F23
- [x] T1 Обновить SPEC §5 и FRONTEND §5 по утверждённому плану — _Depends on:_ —
- [x] T2 Целевые тесты, браузерная приёмка и affected-area Critical Gate — _Depends on:_ F3
- [x] T3 Уточнить SPEC/FRONTEND по утверждённому UI/UX-плану и подходам HeroUI на существующем Base UI — _Depends on:_ —
- [x] T4 Целевые проверки фильтров/состояний, скриншоты desktop/mobile/degraded и Critical Gate для F4–F6 — _Depends on:_ F4, F5, F6

- [x] T5 Обновить утверждённые контракты и проверить web/API, E2E, LSP, browser и cleanup — _Depends on:_ F7, F8, F9

- [x] T6 Verify F10 controls, desktop/mobile/no-JS, targeted LSP and affected web Critical Gate — _Depends on:_ F10

- [x] T7 Verify loading stability with delayed/failed scripts, native no-JS, search states, focused regressions and web Critical Gate — _Depends on:_ F11

- [x] T8 Verify F12 navigation and feedback geometry, responsive screenshots, focused tests, LSP and affected web Critical Gate — _Depends on:_ F12

- [x] T9 Document the verified Playwriter Windows Chrome profile prerequisite and recovery in project/global Codex/Claude instructions, runtime guide and agent memory — _Depends on:_ —

- [x] T10 Verify F13 desktop/mobile, answer states, focused tests, LSP and affected Critical Gate — _Depends on:_ F13

- [x] T11 Update approved visual contracts and verify F16–F17 with focused tests, browser evidence and web Critical Gate — _Depends on:_ F16, F17

- [x] T12 Verify F18 button states and responsive task header with focused checks — _Depends on:_ F18

- [x] T13 Verify bulk disclosure, retained drafts, failures, responsive UI and affected web Critical Gate — _Depends on:_ F19

### Backend / Infra / Data
- [x] B1 Серверные поиск, темы с OR/счётчиками, сортировка, limit, публичные metadata и next-task; OpenAPI — _Depends on:_ —

## Files

### Create / modify
- `apps/web/src/widgets/practice-task/**`
- `apps/web/src/pages/practice-catalog/**`, `apps/web/src/pages/practice-task/**`
- `apps/web/src/features/lesson-practice/**`
- `apps/web/src/shared/components/badge/**` (opt-in quiet metadata surface)
- `apps/web/e2e/practice-catalog.spec.ts`, domain Page Objects / fixtures
- Focused web/API tests, `docs/SPEC.md`, `docs/FRONTEND.md`
- `apps/api/app/modules/practice/catalog.py`, generated OpenAPI/client types
- `apps/api/practice-catalog-topics.json`, `scripts/practice-catalog-topics.mjs`, publication registry check
- API Docker packaging and development input fingerprint; no database/data changes
- `apps/web/src/shared/components/multi-combobox/**`, `info-popover/**`
- App router search serialization for literal q and repeated topics
- `apps/web/src/shared/components/search-field/**`, `inline-select/**`, shared Field adornment/labels
- Shared theme focus/selection/input-border tokens and SelectField label composition
- Approved F16–F17: shared button/link styles and semantic wrappers, public navigation consumers, catalog theory toolbar, action semantics tests and visual contracts

### Do NOT touch
- Database schema/data, authored bank, imports, reference images.

Approved follow-up scope: API catalog/read contracts and generated client, publication-derived catalog topic registry, API packaging of that registry, shared Base UI combobox/popover and compact pagination, app router serialization for repeated topics parameters. No data publication or migration.

## Contracts

See `docs/SPEC.md` §3–§5, `docs/FRONTEND.md` §5 and Files above.

UI/UX follow-up approved 2026-09-19: reference (1) composition; one explicit-apply GET
form for exam/skill/difficulty; full IDs below titles; split statement/answer at 64rem,
stacked below; existing capabilities and state lifecycle. Adapt HeroUI interaction hierarchy
through existing Base UI wrappers and CSS Modules, without new packages or API changes.
F4/F5 own catalog page components/styles; F6 owns widget and standalone form presentation;
T4 verifies real catalog, detail and lesson consumers, plus existing focused suites.

## Gate Checks

Critical Gate per [STACK](../STACK.md). Focused catalog browser journeys additionally
cover concurrent disclosures, transient input, stale/error recovery, mobile and no-JS.
Final architect authorization (2026-09-19): run final audit and local Critical ship (commit, merge, archive). Full/Release Gate and deployment remain outside scope.

Verification 2026-09-17:
- Format, web lint / architecture policies, workspace typecheck: PASS.
- Focused Vitest: 25 tests in inline-solving, catalog and content-renderer suites: PASS.
- Focused Playwright catalog suite: 6 journeys PASS (including independent drafts,
  successful checks, reload, mobile and catalog-to-detail without JavaScript).
- MCP desktop/mobile screenshots and console: PASS; loading and injected 503/retry
  reviewed; 390px/720px and 200% CSS zoom have no page overflow. Lesson input smoke PASS.
- Required MCP LSP pass ran; adapter reproduces existing TanStack/pnpm and Playwright
  export-resolution defects (KNOWN_GOTCHAS). Realpath-aware TypeScript language service
  checked all 18 changed TS/TSX files, including tests and E2E: zero diagnostics.
- API regeneration: SKIPPED, HTTP contracts and generated consumers unchanged.
- Full/security/build/release gates: SKIPPED, outside this local affected-area scope.
- Repository hygiene: clean-dry-run reviewed; clean and clean-check PASS.
- Manual architect acceptance remains the next lifecycle step.

UI/UX follow-up verification 2026-09-19 (F4–F6, T3–T4):
- Format, web lint including design-system/layer policies, workspace typecheck: PASS.
- Focused Vitest: 26 tests PASS. Catalog E2E: 9 journeys PASS, including combined native
  GET filters with/without JS, retained selections and answer geometry through incorrect feedback.
- Playwriter extension unavailable (`extension_not_connected`); Playwright MCP fallback used.
  Captured original desktop and updated 1440/1024/768/390px layouts, incorrect answer,
  pending load and injected 503/retry. No horizontal overflow, including a 200% CSS-zoom probe.
  Lesson practice retains stacked layout and accepts input; detail/no-JS covered by E2E.
  Normal catalog/lesson console: no errors/warnings; injected 503 produced expected network error.
- MCP LSP ran on changed slices, shared Badge, focused test and E2E Page Object. Existing
  pnpm/realpath adapter defect reproduced for TanStack and Playwright; realpath-aware TS
  language service checked 19 changed TS/TSX files with zero diagnostics, followed by clean
  MCP diagnostics on the Badge extension and final catalog row. No import workarounds added.
- Impeccable scoped detector: zero findings. This is not manual visual acceptance.
- API regeneration and Full/Release/security gates: SKIPPED, no API/data/dependency changes.
- clean-dry-run inspected; clean and clean-check PASS. No commit, merge or deployment.
- Architect visual acceptance of the updated catalog remains pending.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

None.

## Commit Message

```
feat(change-124): solve practice tasks inside the catalog
```

## Approved follow-up 2026-09-19

Search is explicit Enter/button; topics use grouped Base UI multiple combobox with search and Done/cancel, counts below titles (including zero), OR semantics. Default order is stable UUID; optional difficulty directions. Limits 10/30/50/100, default 30. Question icon only visually, help on hover/click. Compact catalog rows and stacked solving actions; theory in upper right, lessons unchanged. Lucide icons; shadcn visual references only. Mini-course tasks remain hidden. Gate covers focused web/API and browser journeys. This approved plan supersedes earlier explicit-apply native single-select and split-layout decisions.

## Catalog controls follow-up verification 2026-09-19 (B1, F7–F9, T5)

- Format, web lint / architecture boundaries, web typecheck, Ruff and Python typecheck: PASS.
- 37 focused Vitest tests PASS. Ten catalog E2E journeys passed: nine in the final grouped
  run, then the remaining combined-filter journey after correcting its hydration wait and
  removing unnecessary onChange enhancement guards. Native no-JS multi-selection is covered.
- Nine existing PostgreSQL acceptance tests passed; the added catalog-search test passed,
  then search/topics/sort/limit plus next-task/membership tests passed after the final query changes.
  Tests use isolated PG18; development data was only read. No lesson tasks were published.
- API contract drift check PASS; publication/catalog registry check PASS. The registry check
  compares JSON structure so repository formatting cannot create false drift.
- MCP browser evidence: 1440/1024/768/390px, compact rows (about 69px desktop), multiple selection,
  second-line counts, zero topic, hover/click help, incorrect answer, mobile middle-page pagination,
  delayed task loading, injected 503 and successful retry. No horizontal overflow in checked views.
  Lesson input smoke retained its original presentation. Fresh catalog/lesson console: zero
  errors/warnings; the injected 503 generated the expected network error in the injection tab.
- Playwriter extension unavailable; Playwright MCP used. TS/Python LSP performed. Known MCP
  pnpm realpath issues recur for TanStack/Playwright; the realpath-aware TypeScript language
  service checked all 37 changed/new TS(X) files (including E2E/tests) with zero diagnostics.
- Development lifecycle test and bash syntax check PASS. `pnpm lint:shell` could not run:
  host `shellcheck` is not installed. The shell change only adds the generated registry path
  to the existing image-input fingerprint list; this tooling limitation is explicit.
- No Full/Release Gate, commit, merge, push or deployment. Manual visual acceptance pending.
- Repository hygiene: clean-dry-run reviewed; clean and clean-check PASS. Reference images preserved.

## Visual review scope 2026-09-19 (F10, T6)

Done when all six reported control/spacing issues are fixed. Shared Field owns label/adornment styling; shared search and inline select wrappers own behavior. Monochrome focus/selection/caret is explicitly approved across shared controls; error colors remain semantic. Files: catalog components/styles, shared field/search/select/multi-combobox/info-popover, app theme/tokens, affected POM/tests and frontend contracts. Implement controls then verify browser desktop/mobile and no-JS, web format/lint/types, focused tests and LSP. No API/data changes.

## Visual review verification 2026-09-19 (F10, T6)

- Format, web lint (including architecture policies), web typecheck and diff check PASS.
- 37 focused Vitest tests PASS (catalog, inline solving and content renderer). Existing E2E
  Page Object updated for Apply and Base UI sort; the automated E2E suite was not rerun in this
  affected-area pass. Equivalent changed-control journeys exercised through MCP on the local app.
- Playwriter extension unavailable; Playwright MCP fallback. Inspected screenshots at 1440×900
  and 390×844: aligned labels, integrated search with visible clear before submit, compact help,
  neutral focus/caret, badges and inline sort. Mobile popup bottom 715px within 844px viewport;
  scroll width 384px, no horizontal overflow. Topic counts use the existing smaller 2xs token.
- Search clear remains visible without hover and returns focus to the field. Mouse-open topic
  popup does not autofocus; keyboard-open focuses its input explicitly (Base UI boolean true
  otherwise skipped the input). Arrow/Enter selection, Apply, cancelled Reset, chip removal,
  sorting in both directions and return to default verified. Search/topics/sort GET works with
  JavaScript disabled. Fresh browser console: zero warnings/errors. A hydration warning observed
  during HMR did not recur after full navigation or submitted-filter reloads.
- Required MCP LSP clean for changed shared controls and catalog filters/chips. Known pnpm
  realpath defect recurred in catalog results and Playwright Page Object; complementary realpath-aware
  TS language service: 9 changed TS(X) files, zero diagnostics. Final combobox ref change also MCP-clean.
- Impeccable detector returned zero findings. No API/data changes; backend/API/Full/Release gates
  skipped. No commit, merge or deployment. Manual visual acceptance remains with the architect.
- Broad temporary-file discovery hit protected system directories; stopped per repository rule.
  Architect replied `continue`; resumed with explicit known file paths, without changing permissions.
- Repository hygiene: clean-dry-run reviewed (ESLint/Ruff caches only); clean and clean-check PASS.

## Loading stability follow-up (F11, T7)

Confirmed: useIsEnhanced renders a tall native topic select before replacing it with the short
combobox, and sort also changes controls. Row title links/buttons have different geometry; pagination
Apply disappears after hydration. GET form submissions reload the document. Search action buttons
inherit standalone hover/focus surfaces; browser autofill paints only the input.
Done when SSR emits the final JS-control geometry, native controls exist only for no-JS, filtering
uses retained-page router navigation, rows retain geometry, and search has one neutral surface.
Use existing shared wrappers and CSS scripting media capability with noscript fallbacks, rather
than a client-only placeholder or early inline script. Files: catalog filters/rows/pagination,
shared select/combobox/search/field/info wrappers, shared CSS patterns, contracts and focused tests.
Verify production first paint before/after hydration, delayed and failed JS, desktop/mobile/no-JS,
keyboard/autofill/actions, LSP, scoped format/lint/types/tests and cleanup. No API/data changes.

F11 architecture: preserve SSR geometry using existing controls plus `noscript` fallbacks and
[CSS scripting media](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/scripting).
No early DOM-mutating script or client-only placeholder. Filter submission reads form values through
a shared platform adapter and navigates via TanStack Router; API/state ownership unchanged.

## Stability follow-up verification 2026-09-19 (F11, T7)

- Removed native-to-enhanced topic/sort swaps, disappearing pagination Apply, and help DOM swaps.
  Native controls are noscript-only; row title link and button share geometry. Compact chips retain
  removal targets; group headings have no backing. Search icon buttons are transparent, keyboard
  outlines inset, and autofill paint uses the composite surface with its boundary painted above it.
- Filter and limit GET forms use typed router navigation after hydration; current results remain
  rendered during requests. Native submissions retain repeated topics without hidden-value duplicates.
- Production build PASS. New domain-POM regression `practice controls retain SSR geometry through
  hydration and filtering` PASS at 1440/390px, including same-document filter navigation. Before
  release, scripts are held; geometry is compared after actual popup interaction proves hydration.
  Initial test failure exposed missing Base UI SSR label linkage; explicit trigger aria-label fixes it.
- MCP production desktop screenshot with blocked scripts: filter height 61.274px, first row height
  68.812px and list y=421.286px before and after hydration (0px change). Delayed sort response retains
  list y and performance.timeOrigin. Failed JS on mobile retains styled geometry, no horizontal
  overflow; native no-JS search + two topics + sort returns 254 matching tasks without duplicates.
- Chromium native autofill pseudo-state forced through CDP (not mocked CSS): UA blue background is
  covered by white inset paint, with a continuous outer field boundary. Hover has transparent icon
  backing; keyboard focus is inset. Normal dev console: zero errors/warnings. Production console
  reports existing unused optional-font preload warnings; blocked-JS inspection has expected
  network abort errors. Test teardown emits request-aborted server logs, while assertions pass.
- Playwriter remained extension_not_connected; Playwright MCP fallback used. Shared/page TS files
  MCP-clean; known pnpm realpath issue affects the E2E adapter. Complementary realpath-aware TS
  language service checked 10 changed source/E2E files with zero diagnostics.
- 37 focused unit tests, formatting, web lint/architecture policies, typecheck and diff check PASS.
  Impeccable detector returned zero findings. API/backend/Full/Release checks skipped (no changes).
  No commit, merge, data mutation or deployment. Manual acceptance remains with the architect.
- Repository hygiene: reviewed clean-dry-run; clean and clean-check PASS. Temporary production server stopped; dev remains available on 8080.

## Review scope F12 / T8

Done when pagination exposes neighbours and actionable gaps without underlines, limit shares its visual group, and answer feedback never moves help/collapse actions. Keep native GET and detail/lesson presentation. Files: catalog pagination/model/styles/row, standalone practice answer/help, task widget and focused tests/POM. Implement navigation first, then compact content and stable toolbar; verify navigation boundaries, limit reset, incorrect/error/correct states at desktop/mobile, LSP and affected web gate.

## F12 / T8 verification 2026-09-19

- Pagination now keeps neighbouring pages and boundaries, fills single-page gaps, and exposes larger gaps as labelled midpoint links. Limit shares the quiet pagination group and preserves selection while resetting the page. Native GET fallback verified with topic + page + limit.
- Desktop row is about 56px; ID and heading have identical top coordinates. Statement spacing/type are compact only in catalog. Help/collapse actions precede feedback; help state is no longer remounted/automatically expanded on successful checking, so success preserves the user's disclosure choices. Detail and lesson help remain unchanged.
- 39 focused unit tests PASS. Production build PASS. Delayed-hydration/retained-filter geometry regression PASS; new toolbar regression PASS at 1440/390 for incorrect, injected 503 and accepted answers, gap navigation, help headings and repeat copy. Initial toolbar assertion compared viewport coordinates across automatic input scrolling; corrected to document coordinates, preserving the <1px assertion.
- MCP desktop/mobile screenshots inspected, no horizontal overflow, pagination computed text-decoration none. Hint/check feedback measured 0px movement. Native no-JS limit change preserved topic and reset page. Normal browser console zero warnings/errors; simulated 503 confined to isolated automated test.
- Format, web lint/architecture checks, typecheck and diff check PASS. MCP LSP clean on pagination, row, model and answer/help; widget reproduces known pnpm-derived implicit-any diagnostics. Complementary realpath-aware TS language service checked 12 source/test/POM files: zero diagnostics.
- Playwriter extension unavailable; Playwright MCP fallback used. No backend/API/data/dependency changes; Full/Release skipped. No commit, merge or deployment.
- Screenshot capture during hydration briefly produced an attribute warning for injected `style="caret-color: transparent"`; fresh navigation without early capture had zero console errors/warnings and working limit popup. Production geometry tests passed independently.
- Repository hygiene: clean-dry-run reviewed; clean and clean-check PASS. Local development remains on port 8080.

## T9 documentation verification 2026-09-19

- Resolved the earlier Playwriter fallback cause: ordinary Windows Chrome's
  extension-bearing `Default` profile was not running; only Playwright temporary
  profiles with `--disable-extensions` were present. Starting ordinary Chrome
  restored session creation and `/practice` navigation/snapshot/interaction.
- Updated project AGENTS/Claude adapter, STACK and KNOWN_GOTCHAS, global
  `~/.codex/AGENTS.md` and `~/.claude/CLAUDE.md`, the local runtime README and an
  explicitly requested Codex memory update note. Check/start the correct profile
  and retry before declaring Playwriter unavailable. Historical fallback reports
  above describe earlier attempts and remain intact.
- Documentation-only gate: format check, local link/heading integrity and diff
  whitespace checks passed. Code tests, LSP and API checks not applicable.

## F13 / T10 verification 2026-09-19

- Catalog IDs again align with progress icons; filter removal glyphs use a flex
  wrapper rather than an inline SVG baseline. Difficulty retains Lucide glyphs,
  normalizes their viewBox and shows the three-bar track with active levels.
- Empty results are centered with human wording and a bordered reset action.
  Catalog answer labels remain accessible but hidden. Removed the statement heading,
  lower collapse action and redundant visible success/progress copy. Retry replaces
  check beside the accepted input; green border/check plus an accessible status
  announce success. Help buttons share the desktop toolbar and retain panel headings.
  Wrong-answer and service errors sit under the input. Mobile reserves supporting
  message space to keep help actions stationary across these states.
- Playwriter connected to ordinary Windows Chrome; desktop/mobile screenshots covered
  empty, incorrect and accepted states. Synthetic accepted progress was restored to
  its prior value after inspection. Console had no application errors/warnings;
  an unrelated extension content script (`gcjikeldobhnaglcoaejmdlmbienoocg`) raised
  `TypeError: p is not a function`; its stack points to chrome-extension://, not app code.
- PASS: 39 focused unit tests; production build and desktop/mobile toolbar regression
  (incorrect/service failure/success, local error geometry, retry focus, pagination);
  web lint/typecheck, format check, diff whitespace and cleanup.
- TS MCP diagnostics performed; known pnpm resolution issue reported implicit-any in
  API-derived maps. Complementary realpath-aware TypeScript language service checked
  all 9 affected TS/TSX files including tests/POM with zero diagnostics.
  No API/data/dependency changes; Full/Release skipped. No commit or deployment.

## F14 verification 2026-09-19

Removed the background difficulty track; retained the existing Lucide active glyphs,
size and row placement. Playwriter screenshot and rendered-path counts confirmed
one/two/three visible bars for basic/medium/high. Format, lint, typecheck, TS LSP,
diff whitespace and cleanup passed. Pure presentation removal; no new tests needed.

## F15 verification 2026-09-19

Restored the three-bar Lucide track with color-rule (rendered #d4d4d4) and
active levels using color-text-soft (#606060). Playwriter screenshot and computed
styles confirmed the quieter track and distinct active bars. Format, lint,
typecheck, TS LSP and diff checks passed; no behavior changes or new tests.

## F16–F17 / T11 verification 2026-09-19

- Shared neutral link affordances and navigation/button presentations verified across practice,
  home, topic/course catalogs, Python overview, recursion lesson and privacy. Telegram arrow
  computed color is rgb(23,23,23); button keyboard outline is rgb(96,96,96).
- Playwriter session 5, ordinary Windows Chrome: desktop/mobile screenshots reviewed;
  press transform is scale(.98), reduced-motion transform is none. No application page errors;
  the pre-existing `p is not a function` stack belongs to chrome-extension content.js.
- Focused Vitest: 15 tests passed (action semantics, inline solving, content renderer, pagination).
  Production Playwright: 3 passed (delayed hydration/filtering, feedback toolbar, no-JS navigation).
  The hydration test caught and verified the fix for a 17.5px SSR title-link height mismatch.
- Build/prerender, format-check, web lint, typecheck and diff whitespace check passed.
  TypeScript MCP individual diagnostics clean for ActionLink and catalog help; widget inferred
  API types hit the known MCP resolver issue. Repository TypeScript language service checked
  140 relevant source files with zero diagnostics. Directory-wide MCP request was stopped after
  stalling; language-service and compiler results supply the complete diagnostics pass.
- Production delayed-request test logs an aborted request (ECONNRESET) during intentional navigation;
  all assertions passed. No API/schema/data changes in this follow-up.

## F18 / T12 verification 2026-09-19

- Removed the repeated standard decimal-integer instruction from task presentation, preserving
  authored statements and other answer-format guidance. Both help controls use soft hierarchy.
- Catalog topic labels supply the expanded heading; theory sits beside it, including mobile.
  Removed the now-unused toolbar slot. No bank/API changes.
- Shared Button loading uses a centered overlay and an opacity-hidden content footprint,
  preserving accessible names and icon/text geometry. Busy state no longer fades like disabled.
- Playwriter session 5 desktop/mobile/header and delayed-check screenshots reviewed.
  Production E2E passed on both widths through loading, incorrect, service error and success;
  assertions cover spinner centering and stable button dimensions, alongside existing toolbar checks.
- Focused suites: 13 tests passed; after adding instruction/header assertions, both affected
  suites passed again (8 tests). Build, format-check, lint, typecheck, diff check passed.
  TypeScript MCP Button, StandalonePractice and PracticeTaskAnswer diagnostics clean.

### F19 / T13 verification
- Current-page list owns disclosure; shared quiet bulk buttons preserve mounted forms and individual toggles.
- Seven inline-solving tests passed, including bulk/individual combinations, draft retention, selection reset and isolated loading failure. Format, lint, typecheck and diff checks passed.
- Playwriter desktop/mobile screenshots reviewed; 100/100 tasks loaded, native browser find located statement text, draft survived collapse/reopen, no horizontal overflow.
- Dev CSS module hashes briefly differed between SSR/client; normal stack restart cleared the stale state. Repeated 100-task pass had no application console warnings/errors. Known unrelated extension page error remains.
- TypeScript MCP list/row/results clean; MCP hook has the known server-function resolution false positives, while workspace TypeScript language service checked all 12 catalog files with zero diagnostics and compiler passed.
- No API changes; Full Gate/build not required for this focused change. Cleanup followed the repository allowlist.

### F20 verification
- Replaced the two bulk controls with one quiet Lucide icon toggle in the final header column; accessible name/title and disclosure state track the action. Partial selection expands all; fully open selection collapses all.
- Compact mobile header retains the same toggle. No-JS keeps it hidden.
- Seven focused tests, format/lint/typecheck, TypeScript MCP diagnostics and diff check passed. Playwriter desktop/mobile screenshots reviewed, toggle interactions and console checked. Repository cleanup completed.

### F21 verification
- Bulk toggle opts into shared Button bare surface, transparent for hover/active/expanded states; keyboard outline retained.
- Playwriter screenshot reviewed and computed hover/pressed/expanded backgrounds transparent; keyboard outline solid, application console clean. Format/lint/typecheck and TypeScript MCP passed. No new tests for this CSS-only behavior; cleanup completed.

### F22 verification
- All eight authored code-variant blocks contain Python. Shared task rendering now displays that variant directly with the existing CodeBlock; ordinary blocks and stored source variants remain unchanged.
- Five renderer tests passed, covering SSR and enhanced output without Pascal/C++ or language tabs, retaining authored non-code content and help.
- Playwriter real task desktop/mobile screenshots reviewed; Python code/copy control present, no language tabs. Format/lint/typecheck, TypeScript MCP and diff check passed. No API or bank mutation; allowlisted cleanup completed.

### F23 / T14 verification
- Detail now uses the shared compact solving layout, compact title/metadata, topic/theory header and field-local feedback. Public known sources remain in metadata; progress explanation lives in InfoPopover. One return link preserves catalog context. User explicitly chose to remove next-task navigation; frontend-only next-task plumbing removed, backend contract retained.
- Focused Vitest: detail, inline solving and content renderer — 15 passed. Covers SSR content, return context, help headings, one retry action, persisted success and checker failure. Updated the existing domain E2E Page Object for the new accessible field name and removed continuation expectation; full E2E not run (affected Critical Gate).
- Format, web lint/architecture policies, typecheck and diff check passed. TypeScript MCP clean for page/widget; workspace TypeScript language service checked 37 affected domain files without diagnostics (MCP server-function type-resolution limitation reproduced for the topic helper).
- Playwriter session 5: desktop/mobile, actual incorrect answer, mocked successful answer/retry (original progress restored), Python statement, course task with attachment, missing task and scripting-disabled readable help. No new application console warnings/errors on the settled page; existing unrelated extension pageerror remains. Initial extension-added empty html class caused one transient hydration warning, absent on the fresh reload.
- Screenshots inspected: /tmp/practice-f23-desktop-final.png, /tmp/practice-f23-mobile-cdp.png, /tmp/practice-f23-success.png. Direct CDP screenshot through Playwriter avoided the CLI screenshot clipping caused by the existing Chrome zoom. Production delayed-asset E2E/Full Gate not run for this local follow-up.
- Repository hygiene: allowlisted clean-dry-run, clean and clean-check passed.

### F24 verification
- Detail topic is the single h1; task name is muted subordinate text. Context-preserving back link sits immediately left of the topic (accessible icon on mobile), theory alongside. Wrapping metadata contains short ID, shared catalog difficulty scale, answer format, known sources, available duration and the existing info popover. Detail no longer repeats the widget header; help headings use h2.
- Extracted catalog difficulty into the owning task entity and reused it without changing its bars/colors. Detail projection retains the existing API difficulty field; no public API/data changes.
- 10 focused detail/inline tests passed, including semantic heading hierarchy, metadata and preserved return context. Format, lint/architecture, typecheck, LSP page/widget/difficulty and diff check passed.
- Playwriter desktop/mobile screenshots inspected (/tmp/practice-f24-desktop-final.png, /tmp/practice-f24-mobile.png); no horizontal overflow or new application console issues. Existing unrelated extension pageerror unchanged. Allowlisted cleanup passed.

### F25 verification
- Increased heading-to-solving separation to space-4 (32px measured), with space-1-5 internal heading rhythm. Theory now belongs to wrapping metadata. Back is an icon-only native anchor on desktop/mobile, retaining the catalog URL context and accessible name.
- Added a shared Base UI Tooltip wrapper (Context7 docs and installed types consulted); hover/focus show “К списку задач”, Escape dismisses it. No button/anchor nesting or layout-changing tooltip container.
- 4 focused detail tests passed, including keyboard tooltip and icon-only accessible navigation. Format, lint/architecture policies, typecheck, LSP tooltip/back-link and diff check passed.
- Playwriter desktop/mobile screenshots inspected (/tmp/practice-f25-desktop.png, /tmp/practice-f25-mobile.png), hover/focus/Escape verified; no overflow or new application console issues. Allowlisted cleanup passed.

### F26 verification
- Task subtitle moved into the statement group: space-1 (8px measured) before solving, space-4 (32px) between topic metadata and the task group. Catalog unchanged.
- 4 detail tests, format, lint, typecheck, page LSP and diff check passed. Playwriter desktop/mobile screenshots inspected (/tmp/practice-f26-desktop.png, /tmp/practice-f26-mobile.png); no overflow/new console issues. Allowlisted cleanup passed.

### F27 verification
- Information popover trigger moved immediately after the topic h1; title row keeps the icon beside wrapping title text on narrow screens. Metadata and solving spacing retained.
- 4 detail tests, format, lint, typecheck, page LSP and diff check passed. Playwriter desktop/mobile inspected, popover click/Escape checked and no new console issues. Screenshots: /tmp/practice-f27-desktop-top.png and /tmp/practice-f27-mobile.png. Allowlisted cleanup passed.


## Final audit and local ship gate — 2026-09-20

- Architect accepted the visual result and explicitly requested final review followed by local ship.
- Reviewed catalog/detail desktop and mobile through Playwriter in ordinary Chrome. Bulk expansion loaded 10/10 statements; collapse/reopen retained the answer; zero-count topic selection and reset worked. No horizontal overflow or application console warnings/errors. The existing unrelated extension content-script error remains outside application code. Screenshots inspected in `/tmp/practice-final-{desktop,mobile,detail-desktop,detail-mobile}.png`.
- UI audit: accessibility 3/4, performance 3/4, responsive 3/4, theming 4/4, implementation integrity 4/4 (17/20, scoped review, not WCAG certification or a performance benchmark). Shared neutral controls, semantic links, field-local feedback and responsive composition are consistent. Project-approved 40px targets remain. Impeccable detector returned no findings.
- Removed unused legacy pagination ellipsis selectors. Whole-diff language-service review exposed incomplete test fixtures and unsupported Testing Library role-query options; corrected those without changing product behavior.
- Fallow review examined shared link/header contracts, task exports and compact lesson styles; four anchored judgments validated without stale/rejected anchors. Raw audit remains `fail` under its advisory heuristics: CSS composition/reachability false positives, inherited utilities, complexity in row/form/search branching and duplicated test actions. These were manually reviewed; no blocking correctness, dependency or boundary issue was identified. Complexity remains a maintenance consideration, not a claim that Fallow is green. No suppression or speculative refactor was added.
- Critical Gate PASS: repository format; web lint/architecture policies and compiler; API Ruff and Pyright; 48 focused Vitest tests and 10 isolated-PostgreSQL acceptance tests; API schema/client drift and publication registry checks; shell syntax and development lifecycle contract. ShellCheck was initially absent; running the repository shell lint with temporary `uvx --from shellcheck-py` tooling passed, without changing dependencies. API test emitted one upstream TestClient deprecation warning.
- After test-fixture corrections, affected content/detail suites passed again (9 tests), followed by the final detail rerun (4 tests). Required TS/Python MCP diagnostics performed; complementary workspace TypeScript language service included all 77 changed/new TS/TSX files, including tests/E2E omitted from normal compiler scope.
- Existing focused production delayed-hydration/no-JS/feedback geometry and catalog E2E evidence above remains applicable; these expensive browser runners were not replayed for the final selector/test-fixture cleanup. Full/security/performance/Release gates SKIPPED: default local Critical ship, no release requested.
- No authored bank, database, checker answer, dependency or production mutation. Local ship includes supplied reference assets unchanged.
- Final whole-diff TypeScript language service: 77 files, zero diagnostics. Allowlisted clean-dry-run reviewed; clean and clean-check PASS. Backlog and Architect Review Notes have zero unresolved items.
