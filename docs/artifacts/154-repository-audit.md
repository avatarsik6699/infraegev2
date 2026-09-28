# Change 154 — repository audit evidence

Date: 2026-09-28. Active change: `feature/154-repository-audit-cleanup`.
This is evidence for the active audit, not a replacement architecture or release contract.
Source inspection covers repository-owned subsystems; focused executable checks cover changed
boundaries. It does not certify all runtime behavior or production, and it does not establish
that the project has no bugs. Findings A01–A22 and remediation are owned by the active change.

## Coverage matrix

| Area | Inspected sources and consumers | Evidence / disposition | Limit |
|---|---|---|---|
| Product/current docs | README, PRODUCT, SPEC, STACK, FRONTEND, GOTCHAS, template, all three playbooks, nine runbooks | Counts/publication, accounts, progress, analytics, migration head, browser and gate cadence reconciled against code; current links/anchors checked | No live production or legal approval claim |
| Frontend architecture | `app`, `routes`, `pages`, `widgets`, `features`, `entities`, `shared`; ESLint and three architecture policy runners | Routes/loaders, server adapters, public barrels, state ownership, browser adapters, generated contracts and component composition inspected; dead code individually triaged below | Account extraction checked by real synthetic account integration and desktop/mobile browser inspection; no exhaustive visual review of every route |
| Catalogs/course/topic content | Publication registries, seven TopicLessons, 28 CourseLessons, canonical bank and historical fixture consumers, asset generators | 735 canonical tasks validated; registry membership and assets checked; unchanged authored quality and future curriculum sources retained | No mathematical re-verification of all imported answers; Change 120's deferred review preserved |
| Frontend tests | Unit inventory, E2E fixtures/Page Objects/spec imports, browser portfolio/configuration | Existing tests mapped to owning modules below; architecture lint prevents low-level spec APIs; legacy progress fixtures isolated without deleting assertions | Test mappings below are source evidence, not a claim all named suites ran |
| API/core/health | `main.py`, `core`, `api/router.py`, health, tasks, practice, account and progress API/services | Readiness head `140_01`, no-store auth/progress, DB-backed public readers/checker, file validation and session/Origin/CSRF/context checks inspected | No live mail/provider/production verification |
| Backend models/migrations | Practice/account models; migrations `122_01` and `140_01`; DB dependencies and role provisioner | Runtime/app/import/migration boundaries expressed in schema and settings; historical Task schema moved to tests; shared block DTOs retained | Owning isolated PG18 suite migrated/seeded/drift-checked and asserted table/column denials; no production restore |
| Backend tests | API test inventory, checker/task pure suites, minimal-bank DB/account suite and provider protocol mocks | Existing privacy/paging/files/context/revision/consent/purge/mail/provider coverage inspected; 171 affected pure checker/API tests passed after fixture relocation | Final affected minimal-bank suite: 21 PASS; real provider operation remains unverified |
| Ops/infra | All Compose overlays/Dockerfiles, nginx config/auxiliary assets, `ops`, deploy/backup/restore/cutover scripts | Local ownership, data retention, exact-SHA release and specialized test boundaries inspected; mapped HTTP stylesheet false positives resolved below | No Docker lifecycle, backup, SSH, host mutation or production probes |
| Tooling/CI | Root/web/API manifests and locks, format/lint/type configs, workflows quality/browser/security/images/deploy/uptime, Dependabot | Pins inspected; routine history static coverage and cleanup shell coverage repaired; ordinary static CI vs weekly/manual/runtime suites reconciled | No vulnerability freshness or image scan claim; dependency versions/locks unchanged |
| Agent/plugin/wrappers | `.codex`, `.agents`, `.claude` tracked commands, SDD plugin, AGENTS, launcher | Wrappers point to canonical playbooks; browser required wording corrected; configured native roles reviewed | No claim a fresh session loaded roles |
| History/artifacts | Tracked inventory, v1 and sequential v2 snapshots, 128-file exact manifest, remaining authored sources | Every retired byte recoverable from verified Git source; old metadata and unresolved decisions retained; current audit evidence remains active | Requires preserved source Git objects; no off-site backup or Git size reduction |
| Local ignored/untracked | Filename-only inventory, cleanup allowlist and preservation contract | New untracked files are active change/test fixtures/current evidence. Dependencies, API environment, local bank/task files, `.env`, Athanor vault and editor state protected | Secret contents not inspected; no blanket ignored-file removal |

## Inventory and verification boundaries

After compaction, before adding this evidence file, the authored artifacts were seven files /
61,343 bytes: five lesson quality records, `lessons_list.md` and the brand SVG source. This report
is additional current evidence and is intentionally not counted as a retired artifact.
128 retired files are exact-byte recoverable; no runtime asset or persistent data was compacted.
Filename-only ignored inventory identified dependency/environment files, 41 local bank inputs,
26 task files, local `.env`, encrypted vault/manifest and editor state. Their values were not read.

Full enumerates its own contract set. Specialized local suites for account cutover/retention,
auth edge, practice throttling, lifecycle, environment rendering, security orchestration and
synthetic account server remain affected-area checks; the verification runbook now inventories
these explicitly. Ordinary quality CI is intentionally static. Neither an omitted test nor
an unconfigured detector is a PASS.

Role proof added during I6: the migrated isolated PostgreSQL instance rejects effective table
SELECT/INSERT/UPDATE/DELETE/TRUNCATE privileges for runtime/import on seven account/progress tables,
and INSERT/UPDATE/DELETE/TRUNCATE for app on four bank/checker tables. Column-level privileges are
also checked for forbidden SELECT/INSERT/UPDATE. These are read-only privilege inquiries, not
execution of destructive SQL. The owning DB suite passed 21 tests after correcting obsolete 697
and two-topic expectations. The bank now contains 735 tasks; public catalog visibility independently
remains 547, with no public exam-27 tasks. Fresh synthetic account browser integration also passed.
Real provider/mail delivery, broad security/image checks and production evidence remain outside
this local hygiene change. Historical legal and imported-answer review prerequisites stay open.

## Individual static dispositions

Fallow 3.28.0, no-cache combined analysis, before I3/I4: 61 dead-code signals, 57 health advisories,
45 clone groups. These tables preserve that complete signal set, including findings subsequently
fixed. Source locations refer to that analysis. I7 moved AccountForm, DeliverySent, ProviderLinks and
Profile (now AccountProfile) to separate owning files; account helpers now live in
account-page.helpers.ts. H5/H6/H9/H14/H34/H37/H38/H45–H49 retain their original-function identity
in the table; source movement is not an unresolved missing file. No inline suppressions
or blanket ignored-export configuration were added to manufacture a clean count.
Boundary and policy detectors were unconfigured; executable repository lint remains the actual
architecture policy check. Health coverage is **estimated**, not measured test coverage, and
`critical` below is a metric severity, not a confirmed security defect.

### Dead code / resolution / duplicate exports (61)

| ID | Signal / location | Disposition and evidence |
|---|---|---|
| D01 | unused_files: `` — `apps/web/playwright.account.config.ts` | Retain: script entry point in scripts/run-isolated-browser-audit.sh; not an import-graph leaf. |
| D02 | unused_files: `` — `apps/web/src/shared/styles/link.module.css` | Retain: composes consumed by action/external/fragment/download-link CSS. |
| D03 | unused_files: `` — `infra/nginx/auxiliary/assets/styles.css` | Retain: Nginx auxiliary location maps /_infraege/styles.css to infra/nginx/auxiliary/assets/styles.css; HTML public URL is intentional. |
| D04 | unused_exports: `Diagram` — `apps/web/src/shared/components/learning-content/diagram/diagram.tsx:5` | Retain: explicit educational primitive retained by Change 123 release-readiness decision (verified source in compacted snapshot); not deletion-authorized merely by current import reachability. |
| D05 | unused_exports: `Diagram` — `apps/web/src/shared/components/learning-content/diagram/index.ts:1` | Retain: explicit educational primitive retained by Change 123 release-readiness decision (verified source in compacted snapshot); not deletion-authorized merely by current import reachability. |
| D06 | unused_exports: `Diagram` — `apps/web/src/shared/components/learning-content/index.ts:2` | Retain: explicit educational primitive retained by Change 123 release-readiness decision (verified source in compacted snapshot); not deletion-authorized merely by current import reachability. |
| D07 | unused_exports: `stickyLessonRail` — `apps/web/src/shared/styles/patterns.module.css:12` | Retain: CSS composes consumer lesson-layout.module.css; textual lookup/composition not a JS export consumer. |
| D08 | unused_exports: `lessonSection` — `apps/web/src/shared/styles/patterns.module.css:23` | Retain: CSS composes consumer lesson-layout.module.css; textual lookup/composition not a JS export consumer. |
| D09 | unused_exports: `pageFrame` — `apps/web/src/shared/styles/patterns.module.css:31` | Retain: CSS composes consumer studyLessonFrame in same file.module.css; textual lookup/composition not a JS export consumer. |
| D10 | unused_exports: `lessonPage` — `apps/web/src/shared/styles/patterns.module.css:40` | Retain: CSS composes consumer studyLessonFrame in same file.module.css; textual lookup/composition not a JS export consumer. |
| D11 | unused_exports: `studyLessonFrame` — `apps/web/src/shared/styles/patterns.module.css:47` | Retain: CSS composes consumer lesson-layout.module.css; textual lookup/composition not a JS export consumer. |
| D12 | unused_exports: `lessonFooter` — `apps/web/src/shared/styles/patterns.module.css:55` | Retain: CSS composes consumer lesson-layout.module.css; textual lookup/composition not a JS export consumer. |
| D13 | unused_exports: `controlsRow` — `apps/web/src/shared/styles/patterns.module.css:93` | Retain: CSS composes consumer status-scene.module.css; textual lookup/composition not a JS export consumer. |
| D14 | unused_exports: `learningContentRoot` — `apps/web/src/shared/styles/patterns.module.css:100` | Retain: CSS composes consumer procedure.module.css; textual lookup/composition not a JS export consumer. |
| D15 | unused_exports: `learningContentHeading` — `apps/web/src/shared/styles/patterns.module.css:112` | Retain: CSS composes consumer checkpoint.module.css; textual lookup/composition not a JS export consumer. |
| D16 | unused_exports: `progressHeading` — `apps/web/src/shared/styles/patterns.module.css:119` | Retain: CSS composes consumer lesson-layout.module.css; textual lookup/composition not a JS export consumer. |
| D17 | unused_exports: `progressStatus` — `apps/web/src/shared/styles/patterns.module.css:129` | Retain: CSS composes consumer lesson-layout.module.css; textual lookup/composition not a JS export consumer. |
| D18 | unused_exports: `lessonNavigationLinks` — `apps/web/src/shared/styles/patterns.module.css:137` | Retain: CSS composes consumer lesson-layout.module.css; textual lookup/composition not a JS export consumer. |
| D19 | unused_types: `LessonProgressTypes` — `apps/web/src/features/lesson-progress/index.ts:9` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D20 | unused_types: `PersistedLessonProgress` — `apps/web/src/features/lesson-progress/model/lesson-progress-storage.ts:14` | Fixed I3: legacy helper moved to tests/fixtures/legacy-progress; type made private, historical migration assertions retained. |
| D21 | unused_types: `PracticeHistory` — `apps/web/src/features/practice-progress/model/practice-progress.ts:4` | Fixed I3: implementation-local type, export removed after repository consumer search. |
| D22 | unused_types: `PracticeProgressStatus` — `apps/web/src/features/practice-progress/model/practice-progress.ts:5` | Fixed I3: implementation-local type, export removed after repository consumer search. |
| D23 | unused_types: `ApiErrorKind` — `apps/web/src/shared/api/index.ts:3` | Fixed I3: unused root re-export removed; declaration retained because ApiError public fields/constructor use it. |
| D24 | unused_types: `components` — `apps/web/src/shared/api/index.ts:4` | Retain: owning typed transport/schema public contract; generated source remains authoritative. |
| D25 | unused_types: `operations` — `apps/web/src/shared/api/index.ts:4` | Retain: owning typed transport/schema public contract; generated source remains authoritative. |
| D26 | unused_types: `paths` — `apps/web/src/shared/api/index.ts:4` | Retain: owning typed transport/schema public contract; generated source remains authoritative. |
| D27 | unused_types: `webhooks` — `apps/web/src/shared/api/schema.ts:573` | Retain: generator-owned OpenAPI schema type output; no hand-edit of generated $defs/webhooks. |
| D28 | unused_types: `$defs` — `apps/web/src/shared/api/schema.ts:1266` | Retain: generator-owned OpenAPI schema type output; no hand-edit of generated $defs/webhooks. |
| D29 | unused_types: `AccordionTypes` — `apps/web/src/shared/components/accordion/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D30 | unused_types: `ActionLinkTypes` — `apps/web/src/shared/components/action-link/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D31 | unused_types: `BadgeTypes` — `apps/web/src/shared/components/badge/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D32 | unused_types: `ButtonTypes` — `apps/web/src/shared/components/button/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D33 | unused_types: `CalloutTypes` — `apps/web/src/shared/components/callout/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D34 | unused_types: `CodeBlockTypes` — `apps/web/src/shared/components/code-block/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D35 | unused_types: `ConfirmationDialogTypes` — `apps/web/src/shared/components/confirmation-dialog/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D36 | unused_types: `DownloadLinkTypes` — `apps/web/src/shared/components/download-link/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D37 | unused_types: `EmptyStateTypes` — `apps/web/src/shared/components/empty-state/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D38 | unused_types: `ExternalLinkTypes` — `apps/web/src/shared/components/external-link/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D39 | unused_types: `FieldTypes` — `apps/web/src/shared/components/field/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D40 | unused_types: `FragmentLinkTypes` — `apps/web/src/shared/components/fragment-link/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D41 | unused_types: `ImageTypes` — `apps/web/src/shared/components/image/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D42 | unused_types: `LessonTheoryTypes` — `apps/web/src/shared/components/learning-content/index.ts:5` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D43 | unused_types: `LessonTheoryTypes` — `apps/web/src/shared/components/learning-content/lesson-theory/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D44 | unused_types: `NotationTypes` — `apps/web/src/shared/components/notation/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D45 | unused_types: `PageContainerTypes` — `apps/web/src/shared/components/page-container/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D46 | unused_types: `PasswordFieldTypes` — `apps/web/src/shared/components/password-field/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D47 | unused_types: `ProgressTypes` — `apps/web/src/shared/components/progress/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D48 | unused_types: `StatusSceneTypes` — `apps/web/src/shared/components/status-scene/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D49 | unused_types: `TabsTypes` — `apps/web/src/shared/components/tabs/index.ts:5` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D50 | unused_types: `TypographyTypes` — `apps/web/src/shared/components/typography/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D51 | unused_types: `PublicHeaderProps` — `apps/web/src/widgets/public-header/index.ts:2` | Retain: root-qualified props/state type namespace follows FRONTEND §2; implementation and public component typing remain the same contract even when root type re-export has no standalone import. |
| D52 | unused_dev_dependencies: `@lhci/cli` — `package.json:32` | Retain: scripts/run-lighthouse-audit.sh invokes pnpm exec lhci; subprocess consumer. |
| D53 | unresolved_imports: `/_infraege/styles.css` — `infra/nginx/auxiliary/502.html:1` | Retain: Nginx auxiliary location maps /_infraege/styles.css to infra/nginx/auxiliary/assets/styles.css; HTML public URL is intentional. |
| D54 | unresolved_imports: `/_infraege/styles.css` — `infra/nginx/auxiliary/503.html:1` | Retain: Nginx auxiliary location maps /_infraege/styles.css to infra/nginx/auxiliary/assets/styles.css; HTML public URL is intentional. |
| D55 | unresolved_imports: `/_infraege/styles.css` — `infra/nginx/auxiliary/504.html:1` | Retain: Nginx auxiliary location maps /_infraege/styles.css to infra/nginx/auxiliary/assets/styles.css; HTML public URL is intentional. |
| D56 | duplicate_exports: `loadCoursePracticeSummary` — `apps/web/src/entities/practice-task/api/load-practice-tasks.server.ts:425; apps/web/src/entities/practice-task/api/server-loaders.ts:11` | Retain: `.server.ts` implements request-time reads; `api/server-loaders.ts` wraps it with createServerOnlyFn for the public execution boundary. |
| D57 | duplicate_exports: `loadLessonPractice` — `apps/web/src/entities/practice-task/api/load-practice-tasks.server.ts:398; apps/web/src/entities/practice-task/api/server-loaders.ts:7` | Retain: `.server.ts` implements request-time reads; `api/server-loaders.ts` wraps it with createServerOnlyFn for the public execution boundary. |
| D58 | duplicate_exports: `loadPracticeCatalog` — `apps/web/src/entities/practice-task/api/load-catalog.server.ts:6; apps/web/src/entities/practice-task/api/server-loaders.ts:14` | Retain: `.server.ts` implements request-time reads; `api/server-loaders.ts` wraps it with createServerOnlyFn for the public execution boundary. |
| D59 | duplicate_exports: `loadStandaloneTask` — `apps/web/src/entities/practice-task/api/load-catalog.server.ts:41; apps/web/src/entities/practice-task/api/server-loaders.ts:17` | Retain: `.server.ts` implements request-time reads; `api/server-loaders.ts` wraps it with createServerOnlyFn for the public execution boundary. |
| D60 | duplicate_exports: `loadTaskSitemapIndex` — `apps/web/src/entities/practice-task/api/load-discovery.server.ts:2; apps/web/src/entities/practice-task/api/server-loaders.ts:20` | Retain: `.server.ts` implements request-time reads; `api/server-loaders.ts` wraps it with createServerOnlyFn for the public execution boundary. |
| D61 | duplicate_exports: `loadTaskSitemapPage` — `apps/web/src/entities/practice-task/api/load-discovery.server.ts:11; apps/web/src/entities/practice-task/api/server-loaders.ts:23` | Retain: `.server.ts` implements request-time reads; `api/server-loaders.ts` wraps it with createServerOnlyFn for the public execution boundary. |

### Function health (57)

Each function below remains unless its legacy implementation was moved. The inspected branches
implement distinct state, validation or failure contracts. No reproducible behavior defect was
found in these signals. The account page component ownership/named effects/props violations were corrected under I7.
Complex account/catalog state branching remains a maintainability consideration;
this hygiene change does not redesign those flows solely to lower a heuristic metric.
Named tests are related owning-suite references, not measured function/branch coverage.
Only tests listed in final execution evidence were run; direct branch coverage is not established
where the row does not identify an assertion against the function itself.

| ID | Function / original source | Severity; cyclomatic | Individual disposition / owning evidence |
|---|---|---|---|
| H01 | `PracticeCatalogRow` — `apps/web/src/pages/practice-catalog/components/practice-catalog-row.tsx:31` | high; 40 | Retain: expanded/collapsed/loading/stale/solved task row states; practice-inline-solving and practice-catalog tests, minimal-application Page Object. |
| H02 | `search` — `apps/web/src/entities/practice-task/practice-catalog.ts:3` | critical; 38 | Retain: bounded query/topics/sort/paging validation; practice-catalog tests exercise invalid and normalized search. |
| H03 | `AccountOverview` — `apps/web/src/pages/account/components/account-overview.tsx:27` | critical; 34 | Retain: account summary projects separate courses/topics/standalone contexts; account-overview tests. |
| H04 | `PracticeTaskAnswer` — `apps/web/src/features/lesson-practice/components/practice-task-answer.tsx:29` | high; 29 | Retain: answer pending/stale/success/error and no-JS link states; practice-detail, practice-inline-solving and account integration scenarios. |
| H05 | `AccountPage` — `apps/web/src/pages/account/account-page.tsx:182` | critical; 29 | Retain: six account modes/session/delivery flow; account Page Object and guest session tests; auth boundary warrants focused review when changed. |
| H06 | `AccountForm` — `apps/web/src/pages/account/account-page.tsx:470` | critical; 24 | Retain: mode-specific enhanced/native form requirements; account Page Object covers register/login/recovery/password forms. |
| H07 | `CourseOverviewProgress` — `apps/web/src/pages/course-overview/components/course-overview-progress.tsx:14` | moderate; 22 | Retain: guest/loading/unavailable/ready progress display; course-overview and guest-progress-session tests. |
| H08 | `calculate` — `apps/web/src/pages/course-overview/model/course-overview-model.ts:19` | critical; 21 | Retain: publication completeness, module mastery and first-unmastered continuation; course-overview tests. |
| H09 | `submit` — `apps/web/src/pages/account/account-page.tsx:234` | critical; 20 | Retain: mode-specific account submission and failure cleanup; account Page Object and API account tests; no extraction of auth state in hygiene scope. |
| H10 | `html` — `apps/web/src/shared/lib/http-compression/http-compression.server.ts:2` | high; 18 | Retain: GET/public/no-cookie/no-transform/encoding guard ladder protects private HTML; http-compression tests. |
| H11 | `lessonNavigationGeometry` — `apps/web/e2e/pages/topic-lesson.page.ts:738` | high; 17 | Retain: browser measurement assertions require multiple independent landmarks; topic lesson Page Object. |
| H12 | `explanationText` — `apps/web/src/features/lesson-practice/api/check-practice-answer.ts:87` | high; 17 | Retain: exhaustive explanation-block text projection; practice-answer-api and practice-task-parser tests. |
| H13 | `renderContentBlock` — `apps/web/src/features/lesson-practice/components/practice-task-content.tsx:30` | high; 17 | Retain: exhaustive discriminated content-block rendering; practice-content-renderer and practice-task-parser tests. |
| H14 | `Profile` — `apps/web/src/pages/account/account-page.tsx:619` | critical; 15 | Retain: linking/password/unlink/delete profile states have different reauthentication requirements; account Page Object. |
| H15 | `rhythm` — `apps/web/e2e/pages/lesson-page.assertions.ts:239` | high; 14 | Retain: independent measured lesson rhythm invariants; owning E2E assertion helper, not app code. |
| H16 | `useTopicCatalog` — `apps/web/src/pages/topic-catalog/model/use-topic-catalog.ts:16` | moderate; 14 | Retain: summary/filter/retry/aborted-request state; topic-catalog tests and Page Object. |
| H17 | `expectPracticeToolbarStability` — `apps/web/e2e/pages/minimal-application.page.ts:226` | high; 13 | Retain: desktop/mobile expanded toolbar geometry assertions; minimal-application Page Object. |
| H18 | `adoptionViolations` — `apps/web/scripts/verify-design-system.mjs:61` | critical; 13 | Retain: explicit design adoption anti-pattern rules and embedded positive/negative self-tests; pnpm --filter web lint (verify-app-architecture imports verify-design-system). |
| H19 | `visibleTags` — `apps/web/src/app/route-state/app-document-head.tsx:24` | moderate; 13 | Retain: error/not-found route metadata removes stale title/canonical/social tags; no dedicated visibleTags branch test found in the inspected unit inventory. |
| H20 | `expectResendCooldownAndFailures` — `apps/web/e2e/pages/account.page.ts:263` | moderate; 12 | Retain: clock-controlled verification/recovery limit and transport failures; account Page Object. |
| H21 | `submit` — `apps/web/src/pages/account/components/email-method-form.tsx:26` | critical; 12 | Retain: email-method challenge/pending/verification outcomes; account Page Object. |
| H22 | `PracticeFilters` — `apps/web/src/pages/practice-catalog/components/practice-filters.tsx:18` | critical; 12 | Retain: query/topics/sort native and enhanced filter paths; practice-catalog and browser portfolio. |
| H23 | `ActionLinkRoot` — `apps/web/src/shared/components/action-link/action-link.tsx:9` | moderate; 12 | Retain: hierarchy/presentation/target/ref accessibility mapping; action-semantics and shared-components tests. |
| H24 | `checkAnswer` — `apps/web/src/features/lesson-practice/model/use-lesson-practice-model.ts:23` | moderate; 11 | Retain: duplicate-submit guard, revision conflict and saved-only progress; practice-content-renderer/practice-inline-solving provide related stale/saved-result assertions; API transport tests are separate. |
| H25 | `PracticeResults` — `apps/web/src/pages/practice-catalog/components/practice-results.tsx:14` | critical; 11 | Retain: source-inspected unavailable/invalid/empty/results and retry/filter links; minimal-application browser scenarios are related; pure practice-catalog unit tests do not render this component. |
| H26 | `validateTaskContentAssets` — `scripts/lib/task-content-assets.mjs:14` | critical; 11 | Retain: block-kind asset dispatch; content-asset tests and real-tree validation. |
| H27 | `validateImage` — `scripts/lib/task-content-assets.mjs:50` | critical; 11 | Retain: path/extension/dimensions/alt/caption/diagram-specific metadata rejection; content-asset tests. |
| H28 | `measurements` — `apps/web/e2e/pages/lesson-page.assertions.ts:98` | moderate; 10 | Retain: desktop rail landmark and sticky/scroll measurements; lesson-page E2E helper. |
| H29 | `publicUiExports` — `apps/web/scripts/verify-design-system.mjs:139` | critical; 10 | Retain: public-barrel AST validation; design-system policy checks/self-tests. |
| H30 | `isStoredProgress` — `apps/web/src/features/lesson-progress/model/lesson-progress-storage.ts:132` | moderate; 10 | Moved I3 unchanged into legacy-progress test fixture: guarded historical storage parsing; practice-revision-progress tests still verify migration. |
| H31 | `EmailMethodForm` — `apps/web/src/pages/account/components/email-method-form.tsx:13` | critical; 10 | Retain: email/link form status/pending/confirmation render; account Page Object. |
| H32 | `calculate` — `apps/web/src/pages/course-catalog/model/course-catalog-model.ts:8` | moderate; 10 | Retain: complete per-course summaries vs loading/unavailable aggregates; course-catalog tests. |
| H33 | `TopicCatalogProgressContent` — `apps/web/src/pages/topic-catalog/components/topic-catalog-progress.tsx:18` | moderate; 10 | Retain: guest zero vs member/loading projection and lock; topic-catalog and guest-progress-session tests. |
| H34 | `<arrow>` — `apps/web/src/pages/account/account-page.tsx:737` | high; 9 | Retain: provider-confirmation redirect selection; account Page Object reauthentication scenarios. |
| H35 | `PracticeActiveFilters` — `apps/web/src/pages/practice-catalog/components/practice-active-filters.tsx:12` | high; 9 | Retain: source-inspected query/topic/solved filters and clearing; pure practice-catalog tests check URL helpers, not this component; browser portfolio provides related filter scenarios. |
| H36 | `isSafeOwnedSource` — `scripts/lib/task-content-assets.mjs:131` | high; 8 | Retain: explicit traversal/query/hash/encoded/backslash/extension guards; content-asset negative tests. |
| H37 | `formLabel` — `apps/web/src/pages/account/account-page.tsx:76` | high; 7 | Retain: exhaustive account mode label selection; account Page Object form assertions. |
| H38 | `resend` — `apps/web/src/pages/account/account-page.tsx:322` | high; 7 | Retain: verification/recovery resend requests and cooldown error handling; account Page Object clock scenarios. |
| H39 | `CourseLessonProgress` — `apps/web/src/pages/course-lesson/components/course-lesson-progress.tsx:21` | high; 7 | Retain: source-inspected course context reset/unavailable/guest contract; course-foundation tests cover underlying course calculations, not this component; no direct reset unit test found. |
| H40 | `TopicLessonProgress` — `apps/web/src/pages/topic-lesson/components/topic-lesson-progress.tsx:21` | high; 7 | Retain: topic context reset/unavailable/guest contract; guest-lesson-progress and topic lesson Page Object. |
| H41 | `validateAttachment` — `scripts/lib/task-content-assets.mjs:95` | high; 7 | Retain: attachment ownership/MIME/metadata/byte validation; content-asset tests. |
| H42 | `themeViolations` — `apps/web/scripts/verify-design-system.mjs:13` | moderate; 6 | Retain: retired token/theme/private override guards and self-tests; design-system validator. |
| H43 | `PracticePagination` — `apps/web/src/pages/practice-catalog/components/practice-pagination.tsx:16` | moderate; 6 | Retain: previous/next/ellipsis/native navigation states; practice-pagination tests and minimal-application Page Object. |
| H44 | `handleNavigate` — `apps/web/src/widgets/lesson-outline/lesson-outline.tsx:17` | moderate; 6 | Retain: modified/middle clicks preserve browser defaults by the inspected guard; lesson E2E scenarios exercise outline navigation, but no direct unit assertion of this modifier guard was found. |
| H45 | `deletionError` — `apps/web/src/pages/account/account-page.tsx:49` | moderate; 5 | Retain: deletion maps expired vs wrong-password vs generic failure; account Page Object. |
| H46 | `providerDeletionError` — `apps/web/src/pages/account/account-page.tsx:58` | moderate; 5 | Retain: provider deletion distinguishes fresh reauthentication vs expired session; account Page Object. |
| H47 | `unlinkError` — `apps/web/src/pages/account/account-page.tsx:65` | moderate; 5 | Retain: unlink maps fresh reauthentication vs last-method protection; account Page Object. |
| H48 | `deliveryError` — `apps/web/src/pages/account/account-page.tsx:95` | moderate; 5 | Retain: mail throttling vs service unavailable vs generic failure; account resend scenarios. |
| H49 | `act` — `apps/web/src/pages/account/account-page.tsx:658` | moderate; 5 | Retain: profile provider action/link failure handling; account Page Object. |
| H50 | `LoginMethodIcon` — `apps/web/src/pages/account/components/login-method-icon.tsx:9` | moderate; 5 | Retain: explicit provider-to-icon mapping with email/default state; account UI scenarios. |
| H51 | `CourseLessonPage` — `apps/web/src/pages/course-lesson/course-lesson-page.tsx:26` | moderate; 5 | Retain: source-inspected published navigation ordering/course shell; course-foundation tests cover registry/models, lesson-route-data covers task projection; no direct navigation branch unit assertion found. |
| H52 | `tasks` — `apps/web/src/pages/site-discovery/api/sitemaps.server.ts:57` | moderate; 5 | Retain: source-inspected bounded sitemap page validation, empty404 and unavailable response; no direct branch assertions for tasks() found in the inspected unit inventory. |
| H53 | `head` — `apps/web/src/routes/practice.$taskId.tsx:9` | moderate; 5 | Retain: source-inspected available/unavailable task head metadata and noIndex; public-release tests cover generic pageHead helper, practice-detail tests render task UI, neither directly asserts this route head branch. |
| H54 | `ResponsiveDisclosure` — `apps/web/src/shared/components/responsive-disclosure/responsive-disclosure.tsx:8` | moderate; 5 | Retain: source-inspected SSR/desktop/mobile enhancement disclosure states; lesson browser journeys provide related layout checks; shared-components unit tests cover Accordion, not this wrapper. |
| H55 | `read` — `apps/web/src/shared/lib/form-values.ts:2` | moderate; 5 | Retain: source-inspected FormData multivalue aggregation and file exclusion; practice filter consumers exist, but no direct adapter unit assertion found. |
| H56 | `update` — `apps/web/src/shared/lib/section-observer/browser-adapter.ts:17` | moderate; 5 | Retain: rAF reading-line projection and change notification; observer ownership plus lesson-outline browser assertions. |
| H57 | `LessonOutline` — `apps/web/src/widgets/lesson-outline/lesson-outline.tsx:8` | moderate; 5 | Retain: semantic nested outline, active section, keyboard/click focus and responsive disclosure; lesson E2E assertions. |

### Clone groups (45)

Locations and fragment semantics were inspected individually. Generated output, font declarations,
legal text and independent E2E scenarios have different reasons to repeat; production duplicates
are small domain-local composition or state branches. Retention does not imply duplication is zero.

| ID | Locations | Disposition |
|---|---|---|
| C01 | `apps/web/src/app/styles/fonts.css:49–54`; `apps/web/src/app/styles/fonts.css:71–77`; `apps/web/src/app/styles/fonts.css:94–100` | Font-face unicode range repeats for distinct families/weights; CSS declarations require ranges per face. |
| C02 | `apps/web/src/shared/components/confirmation-dialog/confirmation-dialog.module.css:23–47`; `apps/web/src/shared/components/password-confirmation-dialog/password-confirmation-dialog.module.css:23–47` | Dialog popup/backdrop foundation repeats inside independent plain/password wrappers; no obsolete selector or conflicting rule found. |
| C03 | `apps/web/src/pages/course-lesson/course-lesson-page.tsx:32–55`; `apps/web/src/pages/topic-lesson/topic-lesson-page.tsx:33–55` | Separate Course/Topic published-order navigation and outline composition; each has distinct route/content owner. |
| C04 | `apps/web/src/features/lesson-progress/lesson-progress-provider.tsx:14–32`; `apps/web/src/features/practice-progress/practice-progress-provider.tsx:17–34` | Separate lesson/standalone progress stores fetch the same server result set and guard unmounted updates; context-separated projections are intentional. |
| C05 | `apps/web/src/shared/components/confirmation-dialog/confirmation-dialog.module.css:1–23`; `apps/web/src/shared/components/password-confirmation-dialog/password-confirmation-dialog.module.css:1–23` | Independent dialog backdrop/viewport foundation; no extraction required to remove an unreachable artifact. |
| C06 | `apps/web/src/pages/privacy/consent-page.tsx:25–73`; `apps/web/src/pages/privacy/privacy-page.tsx:71–130` | Privacy notice and consent are separate legal documents; repeated data/actions and withdrawal text remains explicit for each page. |
| C07 | `apps/web/src/app/styles/fonts.css:49–57`; `apps/web/src/app/styles/fonts.css:71–80` | Font-face range/format declarations repeat across faces; retain valid font CSS. |
| C08 | `apps/web/e2e/pages/course-catalog.page.ts:96–107`; `apps/web/e2e/pages/topic-catalog.page.ts:217–228` | Course/topic browser geometry checks deliberately exercise separate catalogs under delayed assets. |
| C09 | `apps/web/e2e/pages/account-integration.page.ts:6–15`; `apps/web/e2e/pages/account-integration.page.ts:54–63` | Independent guest/account integration journeys start from the same task; preserve both assertions. |
| C10 | `apps/web/e2e/pages/account.page.ts:414–426`; `apps/web/e2e/pages/account.page.ts:485–497` | Password-account and provider-account deletion mocks have different confirmation contracts; common setup retained. |
| C11 | `apps/web/src/pages/course-catalog/model/course-catalog-model.ts:52–67`; `apps/web/src/pages/course-overview/model/course-overview-model.ts:8–134` | Russian lesson-count inflection repeats in two owning page models; small maintainability opportunity, no behavioral disagreement found; course-progress rollups remain distinct. |
| C12 | `apps/web/src/pages/course-lesson/components/course-lesson-progress.tsx:21–31`; `apps/web/src/pages/topic-lesson/components/topic-lesson-progress.tsx:21–31` | Course/topic progress use same guest/session states with separate context ownership/headings. |
| C13 | `apps/web/e2e/pages/minimal-application.page.ts:13–29`; `apps/web/e2e/pages/minimal-application.page.ts:41–46` | Independent minimal-page and failure/no-JS checks share public routes; preserve scenario coverage. |
| C14 | `apps/web/e2e/pages/account.page.ts:89–99`; `apps/web/e2e/pages/account.page.ts:187–195` | Recovery request setup reused within separate response scenarios; preserve failure assertions. |
| C15 | `apps/web/src/shared/api/schema.ts:1451–1485`; `apps/web/src/shared/api/schema.ts:1732–1766` | Generated OpenAPI request/response contracts; do not hand-refactor schema output. |
| C16 | `apps/web/e2e/pages/topic-lesson.page.ts:645–651`; `apps/web/e2e/pages/topic-lesson.page.ts:1297–1306` | Topic lesson assertions overlap for enhanced and no-JS rendering; preserve both. |
| C17 | `apps/web/e2e/pages/topic-lesson.page.ts:581–590`; `apps/web/e2e/pages/topic-lesson.page.ts:596–605` | Recursion geometry assertions differ for task/input and code-variant scenarios; repeated guards remain readable. |
| C18 | `apps/web/src/routeTree.gen.ts:130–147`; `apps/web/src/routeTree.gen.ts:173–190` | Generated route maps for distinct router type surfaces; regenerate, never hand-deduplicate. |
| C19 | `apps/web/src/shared/components/confirmation-dialog/confirmation-dialog.module.css:49–71`; `apps/web/src/shared/components/password-confirmation-dialog/password-confirmation-dialog.module.css:44–66` | Plain/password dialog typography shares design tokens; wrappers own their semantics and error/input states. |
| C20 | `apps/web/src/shared/api/schema.ts:1574–1608`; `apps/web/src/shared/api/schema.ts:1609–1643` | Generated provider-link/unlink OpenAPI parameters and response skeletons; no hand-edit. |
| C21 | `apps/web/src/shared/components/confirmation-dialog/confirmation-dialog.tsx:26–45`; `apps/web/src/shared/components/password-confirmation-dialog/password-confirmation-dialog.tsx:37–56` | Dialog open/pending/error skeleton differs from password-specific input/validation; no unchecked generic wrapper extraction. |
| C22 | `apps/web/e2e/pages/account-integration.page.ts:72–78`; `apps/web/e2e/pages/account.page.ts:397–403` | Logout/account access assertions occur in mocked and real integration journeys; preserve distinct evidence. |
| C23 | `apps/web/src/entities/course/content/course-catalog.ts:58–68`; `apps/web/src/entities/topic-catalog/topic-catalog.ts:216–226` | Course/topic catalogs project independent publication registries with similar planned-status logic; separate domain identities. |
| C24 | `apps/web/e2e/pages/account.page.ts:93–102`; `apps/web/e2e/pages/account.page.ts:232–241` | Recovery request assertions in separate mail limit/failure scenarios; retain behavior coverage. |
| C25 | `apps/web/src/pages/course-lesson/components/course-lesson-progress.tsx:74–92`; `apps/web/src/pages/topic-lesson/components/topic-lesson-progress.tsx:74–92` | Course/topic reset branches scope writes to current context and propagate distinct headings; separate domains retained. |
| C26 | `apps/web/src/shared/api/schema.ts:1544–1573`; `apps/web/src/shared/api/schema.ts:1647–1676` | Generated provider route parameter skeleton; do not hand-edit. |
| C27 | `apps/web/e2e/pages/minimal-application.page.ts:600–610`; `apps/web/e2e/pages/minimal-application.page.ts:666–676` | Font/JS-delay scenarios share hold/release setup but test different UI failures; preserve finally cleanup. |
| C28 | `apps/web/e2e/pages/account-integration.page.ts:24–31`; `apps/web/e2e/pages/account.page.ts:158–165` | Registration mail-confirmation assertions appear in mocked and live integration scenario; retain both. |
| C29 | `apps/web/src/routeTree.gen.ts:129–144`; `apps/web/src/routeTree.gen.ts:150–165` | Generated route type projections; no hand-edit. |
| C30 | `apps/web/e2e/pages/minimal-application.page.ts:574–581`; `apps/web/e2e/pages/minimal-application.page.ts:598–605` | Independent responsive geometry scenarios intentionally repeat viewport/delay setup. |
| C31 | `apps/web/e2e/pages/topic-lesson.page.ts:459–466`; `apps/web/e2e/pages/topic-lesson.page.ts:505–512` | Integer/array lesson tests share file/no-JS checks with different lesson content; preserve authored regression coverage. |
| C32 | `apps/web/e2e/pages/course-catalog.page.ts:54–61`; `apps/web/e2e/pages/topic-catalog.page.ts:188–195` | Independent catalog delayed-image/font interception setup; each guards own asset predicates. |
| C33 | `apps/web/src/shared/components/accordion/accordion-native-fallback.tsx:20–35`; `apps/web/src/shared/components/accordion/accordion.tsx:75–90` | Accordion enhanced/native fallback intentionally preserve same icon/title layout and semantic targets; markup ownership differs. |
| C34 | `apps/web/e2e/pages/account.page.ts:202–208`; `apps/web/e2e/pages/account.page.ts:217–223` | Reset-token success/failure scenarios share password submission; retain independent outcomes. |
| C35 | `apps/web/e2e/pages/account.page.ts:649–659`; `apps/web/e2e/pages/account.page.ts:781–790` | Provider unlink/delete fixtures share authenticated session setup but assert different identity protection. |
| C36 | `apps/web/e2e/pages/account-integration.page.ts:20–25`; `apps/web/e2e/pages/account-integration.page.ts:43–48` | Register/login integration journeys use the same supplied credentials; actions/endpoints differ. |
| C37 | `apps/web/e2e/pages/minimal-application.page.ts:520–524`; `apps/web/e2e/pages/minimal-application.page.ts:559–563` | Standalone/lesson checker scenarios share correct-answer assertion; context-save invariants differ. |
| C38 | `apps/web/src/pages/privacy/consent-page.tsx:25–50`; `apps/web/src/pages/privacy/privacy-page.tsx:57–95` | Legal document repeated data/withdrawal statements; requires human legal decision before substantive editing. |
| C39 | `apps/web/src/entities/course/content/course-publication.mjs:518–528`; `apps/web/src/entities/course/content/course-registry.ts:74–84` | Build-time MJS publication lookup and runtime typed registry share member resolution; separate execution/type inputs, checked by publication validation. |
| C40 | `apps/web/src/entities/course/course.types.ts:6–26`; `apps/web/src/entities/lesson/lib/define-lesson.types.ts:6–46` | Course and Topic authored block DTOs have parallel shape; separate route/publication ownership. No contract merge required for cleanup. |
| C41 | `apps/web/e2e/pages/topic-catalog.page.ts:120–127`; `apps/web/e2e/pages/topic-catalog.page.ts:275–282` | Topic catalog healthy/delayed-assets scenarios repeat approved illustration presence assertions. |
| C42 | `apps/web/src/shared/api/schema.ts:1515–1538`; `apps/web/src/shared/api/schema.ts:1889–1912` | Generated no-content API response/header skeleton; no hand-edit. |
| C43 | `apps/web/src/pages/privacy/consent-page.tsx:9–18`; `apps/web/src/pages/privacy/privacy-page.tsx:9–22` | Privacy/consent pages use same public shell/typography while keeping distinct legal titles and content. |
| C44 | `apps/web/e2e/pages/account.page.ts:146–153`; `apps/web/e2e/pages/account.page.ts:246–253` | Email registration/unavailable-mail scenarios share form setup; preserve independent failure response tests. |
| C45 | `apps/web/e2e/pages/course-catalog.page.ts:198–204`; `apps/web/e2e/pages/topic-catalog.page.ts:424–431` | Course/topic geometry measurement helper repeats because each Page Object owns its selectors and layout assertions. |

## Final delta and execution evidence

After I3/I4, the repeated no-cache analysis reported 57 dead-code signals, 57 health advisories
and 45 clone groups. Exactly four unused type/export signals disappeared; no new dead-code
signals appeared. The retained set corresponds to the individually dispositioned rows above.

PASS after fixture relocation: web lint (including design-system/application/layer/E2E policy
self-tests), web TypeScript, 15 tests in practice-revision-progress, practice-answer-api and
guest-progress-session; API Ruff/Pyright, 171 pure checker/task API tests; LSP for changed
production boundaries and new fixtures; API contract drift and repository format check.
The affected API tests emitted one installed Starlette/httpx deprecation warning; tests passed,
and dependency migration was not folded into this hygiene change.
Both metadata snapshots still validate, next number is 155 with active 154; all 128 retired
source blobs remain readable. Current document relative links/anchors pass (29 Markdown files
in the final current-document traversal). Final review/cleanup is recorded in the active change.

PASS final follow-up: 21 tests in the isolated PG18 minimal-bank/account suite (migration,
seed, Alembic drift, actual HTTP/account contracts and new effective role/column privilege
checks); one real synthetic account integration browser journey; 19 related account unit tests.
Independent AST review confirmed all five extracted component bodies and eight helper bodies
preserve behavior, hook order/dependencies/cleanup and actions after prop/helper qualification.
Inferred native form event types follow the existing lesson-practice convention and remove the
three pre-existing FormEvent deprecation diagnostics in the account subtree.

Interactive observation: ordinary Windows Chrome Default with Playwriter; mocked guest session
and registration response, successful transition to confirmation/cooldown, no captured failed
requests or console/hydration errors. Playwriter screenshot capture timed out; Chrome DevTools
inline fallback supplied inspected screenshots at exact 1440×900 and 390×844 emulated viewports.
No clipping/overflow or changed form layout was observed. MCP path saving was rejected because
WSL /tmp was interpreted as C:\tmp; the documented inline screenshot path avoids filesystem writes.
Mobile emulation triggered a navigation timeout while the rendered form remained visible; this
was tool observation noise, not represented as a successful navigation command. Safari/real
devices and actual external mail/provider flows were not tested.


## Explicit Full Gate closure (2026-09-28)

The architect requested Full and final local ship after the audit follow-up. All STACK Full rows
completed; detailed row evidence and rerun boundaries are in Change 154. API: 226 passed; host
contracts: 48 passed across the standard suite and a subsequent explicit isolated fixture run of the initially skipped snapshot consistency test; frontend: 289 passed / 39 files; browser: full run
111 passed / one failure, then all ten affected practice-catalog scenarios passed after the
strict option selector was anchored. Accessibility and every published Python lesson's no-JS
check passed within Full. Build/prerender, fresh isolated migration/bootstrap, bank seed, drift,
content, smoke, nine operations contracts and final test lint/types/formatter passed.

I8 corrects a stale four-topic unit fixture and counts for seven current published topics, with
explicit links and preserved revision, removed-task and distinct-course-context exclusion.
Its task data is intentionally synthetic, not a claim about canonical task counts. I9 fixes the
Page Object's `/5 номер/` selector colliding with topic 25; production code is unchanged by either
remediation. Known isolated E2E LSP Playwright-resolution diagnostics remain supplementary:
workspace compiler reports zero diagnostics and the focused browser suite plus lint pass.

Generated failure trace/context was analyzed before cleanup. Installed Starlette/httpx, PostCSS
and color-mode notices remain non-failing dependency/tool advisories; no dependency upgrade was
introduced. Real mail/provider/production, broad security/performance and release-image evidence
remain outside this explicitly local Full contract. Gate containers are removed without volumes;
existing development storage, the prior gate volume, protected local files and Git sources remain.
