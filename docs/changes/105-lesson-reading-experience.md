# CHANGE 105 — Lesson reading experience

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `105` |
| Slug | `lesson-reading-experience` |
| Title | Lesson reading experience |
| Status | `active` |
| Branch | `feature/105-lesson-reading-experience` |

## Goal

Develop the current infraege lesson identity with readable structural boundaries, title-first
mobile composition, collapsible contents and coherent learning/practice surfaces. Implement the
approved lab-first plan from chat; public activation follows visual approval of the working lab.
SPEC remains unchanged: domain behavior, publications and persistence are preserved.

## Design References

`/courses`, `/courses/python`, and `/lab/design-system` → System → Visual language are the
accepted material references. `/lab/lesson` demonstrates the complete revised reading journey;
the design-system learning specimen uses the same opt-in production components. Use existing
paper semantic tokens; static learning surfaces deliberately omit glints. Page composition stays
page-owned; outline disclosure state stays in its widget, platform work in shared adapters.

## Backlog

### Backend
None.

### Frontend
- [x] F1 Prepare opt-in study introduction, worked-example and practice presentation using shared tokens; preserve installed public defaults. — _Depends on:_ —
- [x] F2 Add opt-in mobile outline disclosure with SSR/full-list fallback, close-and-focus anchor navigation, stable desktop behavior and non-overlapping 40px targets. — _Depends on:_ —
- [x] F3 Compose title-first `/lab/lesson` with structural context/rail rules, compact progress, real shared example/procedure/mistake/checkpoint/practice states and link it from the design-system lab. — _Depends on:_ F1, F2
- [x] F4 Verify the lab via focused behavior tests, browser mobile/breakpoint/desktop, keyboard, actual 200% text scaling, no-JS, console and LSP; run the affected Critical Gate and update the frontend contract with the staged adoption boundary. Browser chrome zoom remains an explicit F5 manual check (see evidence). — _Depends on:_ F3
- [x] F5 Architect visually approves the concrete lab and authorizes adoption on the two published Topic lessons (chat: «Да, переноси на уроки Рекурсивные алгоритмы и Преобразование записей чисел»). Actual browser zoom remains an unverified manual check; approval is not evidence of that check. — _Depends on:_ F4
- [x] F6 Activate approved composition on the two published TopicLessons only: context/rail separators, topic intro before navigation, disclosure, compact progress and learning/practice material. Preserve independent domain models, content, anchors, routes and state. — _Depends on:_ F5
- [x] F7 Verify recursion and number-record Topic lessons; extend existing Page Objects/domain fixtures, verify 390px/breakpoints/desktop/200%/keyboard/no-JS/anchors/progress recovery and preserve default presentation for deferred CourseLesson adoption. — _Depends on:_ F6

- [x] F8 Resolve accessibility findings from two-Topic axe verification: contextual navigation landmark and repeated Mistake blocks as local notes instead of duplicate page landmarks. Shared semantic correction only; no CourseLesson visual adoption. — _Depends on:_ F6

- [x] F9 Restore flat original WorkedExample surfaces and unframed practice in Topic lessons and both lab specimens; remove obsolete paper variants. — _Depends on:_ F8
- [x] F10 Apply scoped matte learning palette, smaller notation treatment and no nested notation fills in semantic blocks; retain CourseLesson colors. — _Depends on:_ F9
- [x] F11 Use non-overlapping 32px study outline rows for mouse and 40px for any touch capability, tighter gaps/indent/weights; preserve keyboard/mobile navigation. — _Depends on:_ F8
- [x] F12 Restore full progress below the outline with confirmed reset; hide only empty status using opt-in hideEmptyStatus, remove duplicate result progress. — _Depends on:_ F8
- [x] F13 Fix global 6px square scrollbars with neutral light/dark colors, mutually exclusive native/WebKit styling and forced-colors fallback. — _Depends on:_ F8
- [x] F14 Synchronize frontend contract and verify palette contrast, desktop/touch/hybrid layouts, state recovery, no-JS, enlarged text, shared scrollbar consumers and affected Critical Gate. — _Depends on:_ F9, F10, F11, F12, F13

- [x] F15 Reduce resting global scrollbar contrast on light and dark surfaces; retain square 6px geometry, clearer hover and forced-colors behavior. Architect correction supersedes the previous resting-thumb contrast target. — _Depends on:_ F14

- [x] F16 Strengthen existing study semantic/neutral fills while keeping readable text; make global resting scrollbars barely visible, with restrained hover. Preserve unframed practice and flat examples. — _Depends on:_ F15

- [x] F17 Align study examples, mistakes and checkpoints with the reading/code measure; remove example and procedure fills and use spacing instead. Review both published Topic lessons and matching lab specimens at desktop/mobile widths. — _Depends on:_ F16
- [x] F18 Use the expanded shared public header and natural page frame on Topic lessons and lesson lab; continue the outline separator through the shared footer to the page bottom without changing sticky navigation or mobile ordering. Verify browser geometry, console and affected checks. — _Depends on:_ F17

- [x] F19 Fix the shared expanded header's navigation overflow exposed by F18 at 200% text scaling: allow section links to wrap within available width, preserving public header identity and mobile menu. — _Depends on:_ F18

- [x] F20 Unify practice theory links and previous/next lesson navigation with shared drawn underlines, orange practice link icons and the shared directional drawn arrows. Preserve fragment behavior and destinations; include equivalent CourseLesson navigation and lab specimens. — _Depends on:_ F19

- [x] F21 Restore inline formula/code highlights on study semantic surfaces using 8% matching learning ink, and on neutral callouts using 5% primary ink. Preserve compact notation geometry, dark code blocks and non-study defaults; verify the approved palette in the browser and affected checks. — _Depends on:_ F20

- [x] F22 Place previous and next lesson links at the left and right edges of their navigation container, respectively, including single-link states and mobile reflow; apply consistently to Topic and Course lessons. — _Depends on:_ F20

- [x] F23 Apply the complete accepted study presentation to every remaining lesson, including all CourseLessons: shared public chrome and continuous rail, title-first disclosure, compact outline, progress bar with hydration fallback, matte semantic/notation palette, reading-width unframed examples/procedures and study practice. Preserve independent course navigation, content, publication state and progress; verify all published routes and representative responsive interactions. — _Depends on:_ F21, F22

### Auxiliary pages — approved extension

- [x] F24 Unify expanded public chrome and illustrated open compositions for 404, route error and pending; retain responsive, SSR/no-JS and accessible semantics. Generate transparent raster scenes and a quiet engineering pattern; keep authored PNG sources and bounded delivery assets. — _Depends on:_ F23
- [x] F25 Implement genuine loader/render/chunk recovery, route-state metadata restoration, and delayed accessible loading without artificial progress. — _Depends on:_ F24
- [x] F26 Unframe EmptyState, handle empty practice explicitly, distinguish service failure from answer validation, and keep decorative image failures silent while informative failures retain their description. Add lab specimens. — _Depends on:_ F24

- [x] F32 Remove the global 320px body floor causing scrollbar-width overflow at the supported 320px viewport; preserve content geometry and verify enlarged text. — _Depends on:_ F30

### Infra / Data

- [x] F33 Remove all icon cards and connection/status figures from code-error scenes; add quiet background SVG motifs to all auxiliary states and subtle activity-aware outline glints. Mirror static code documents with no-JS decoration. — _Depends on:_ F30, I3
- [x] F34 Top-align and compact pending outline groups; verify code scenes, pattern contrast, motion/reduced-motion and pending geometry with the affected gate. — _Depends on:_ F31, F33

F33–F34: retain the accepted numeral/copy placement and the error/pending cards; only code
screens lose their foreground artwork. A private clipped SVG field owns peripheral arcs,
ticks and sparse notation. Numeral-only light uses a masked duplicate outline, never filled
type; app activity pauses motion, autonomous documents remain static. Outline groups use
start alignment and a fixed compact gap instead of distributing unused height.

- [x] F30 Recompose all six auxiliary scenes against new_pages references: outlined Alegreya error codes, distinct simple icon-card arrangements, no graphs/timer/server drawings; preserve quiet recovery controls. — _Depends on:_ F29
- [x] F31 Implement dense pending layout with subtitle, three-dot indicator and activity-aware shimmer; reduced-motion/no-JS remain static. Preview all six states in lab. — _Depends on:_ F30
- [x] I3 Mirror the distinct 502/503/504 compositions in autonomous documents with local shared-icon geometry and unchanged delivery contracts. — _Depends on:_ I2, F30
- [x] T4 Verify new reference compositions, responsive/text-scale/motion and recovery behavior; synchronize contracts and run affected Critical Gate. — _Depends on:_ F31, I3

F30–T4 implementation: new_pages images are composition authority; keep Alegreya/Golos,
outline numerals only, CustomIcon Book/Checklist/Braces/BarChart and simple line details.
StatusScene owns per-code placement; its private card primitive has no actions/state.
Pending copy belongs to a real grid row; element-activity gates shimmer. Static documents
reuse local icon exports with no client runtime. Lab exposes six states for paired browser
review, followed by focused recovery/Nginx tests, lint/typecheck/format, LSP and cleanup.

- [x] F27 Unify privacy quiet consent controls and drawn external links; widen shared lesson navigation with container-responsive stacking. — _Depends on:_ F26
- [x] F28 Introduce one quiet SVG page grid across public pages, lessons, labs and route states; remove duplicate page grids and raster small-pattern consumers. — _Depends on:_ F27
- [x] F29 Replace auxiliary raster scenes with large error-code compositions, SVG interrupted-route error art and a substantial responsive loading skeleton; preserve recovery and accessibility. Update lab examples. — _Depends on:_ F28
- [x] I2 Apply the new SVG error compositions and quiet refresh controls to autonomous 502/503/504 documents; remove obsolete raster delivery wiring while preserving failure isolation. — _Depends on:_ F29
- [x] T3 Verify F27–F29/I2 through browser, LSP, focused tests and affected Critical Gate; synchronize visual contracts and asset provenance. — _Depends on:_ I2

Implementation plan: existing auxiliary-state lab is the specimen; Button, ExternalLink,
SvgPattern.Grid and SvgDrawing own reusable mechanisms. App owns the page background;
StatusScene owns private code/error/loading compositions, never retry state. Static Nginx
documents reproduce only presentation without a React dependency. Browser checks cover
wide/narrow/short/200%-text layouts, navigation, consent and recovery; focused existing unit
and Nginx contracts plus format/lint/typecheck/LSP form the affected gate.

- [x] I1 Add independent illustrated 502, 503 and 504 HTML documents served directly by Nginx with local assets, original status codes, no-store/noindex and document-only interception. Preserve API, health, server-function and resource responses, application 404/500, and production security headers. Test isolated failures without stopping the working environment. — _Depends on:_ F24
None.

### Other

- [x] T6 Align the lesson lab recovery assertion with the accepted service-error alert semantics from F26; rerun the affected journey. — _Depends on:_ F26

- [x] T5 Resolve ship-gate documentation drift: add StatusScene to the public-contract migration table and remove obsolete static-card wording; verify the catalog contract test. — _Depends on:_ F34

- [x] T2 Verify the auxiliary-page extension with targeted unit/integration/E2E, browser screenshots and console, TS LSP, Nginx failure contracts and one affected Critical Gate; synchronize FRONTEND and the UI migration matrix. — _Depends on:_ F25, F26, I1
- [x] T1 Synchronize the named live UI catalog and append post-101 additions to the migration evidence; retain the historical baseline rather than claiming new primitives shipped in Change 101. — _Depends on:_ F3

## Files

### Create / modify
- `apps/web/src/app/styles/{theme,tokens,globals}.css`, `shared/components/{notation,tabs,code-block,progress}/`, `features/lesson-progress/` (approved matte palette and global scrollbars)
- `apps/web/src/shared/components/learning-content/{lesson-intro,worked-example,mistake,checkpoint}/`, `shared/components/callout/callout.module.css`
- `apps/web/src/shared/components/responsive-disclosure/`
- `apps/web/src/shared/lib/{media-query,fragment-navigation}/`
- `apps/web/eslint.config.js`, `apps/web/scripts/verify-app-architecture.mjs` (narrow adapter allowlists and positive/negative policy tests)
- `apps/web/src/widgets/lesson-outline/`, `widgets/public-header/public-header.module.css` (expanded-navigation reflow)
- `apps/web/src/features/lesson-practice/`
- `apps/web/src/pages/{lesson-design-lab,design-system-lab}/`
- `apps/web/src/routes/lab.lesson.tsx` (restore unlisted route; existing `/lab/` prerender exclusion)
- `apps/web/src/pages/topic-lesson/` (approved two-Topic rollout)
- `apps/web/src/shared/components/{action-link,fragment-link}/`, `pages/course-lesson/` (complete approved F23 adoption)
- `apps/web/src/shared/styles/patterns.module.css`, focused `apps/web/tests/` and existing E2E fixtures/Page Objects/specs
- `docs/FRONTEND.md`, this change
- `docs/artifacts/infraege-ui-migration.md` (subsequent adoption evidence)
- `apps/web/src/app/route-state/`, `app/providers/components/navigation-progress*`, shared auxiliary-state presentation, document-recovery adapter, image/empty-state components, public header, auxiliary-page tests and lab specimens
- `apps/web/public/images/route-states/`, `docs/artifacts/route-states/` (generated raster sources and prompts)
- `infra/nginx/`, `infra/docker-compose.yml`, `scripts/tests/auxiliary-pages*` (approved autonomous fallback delivery)

### Do NOT touch
- Published lesson/task content, registry/publication state, checker API and progress schema.
- Infrastructure outside the approved Nginx fallback delivery, homepage/catalog composition, unrelated untracked authored assets.

## Contracts

See `docs/SPEC.md` §3–§5, `docs/FRONTEND.md` and the Files list above.

## Gate Checks

Affected Critical Gate: [STACK.md](../STACK.md). The approved plan additionally requests focused
browser/E2E/accessibility evidence for changed lesson behavior; not a Full Gate. Inspect screenshots
inline through MCP (Windows-hosted file saving is unavailable). Final allowlisted repository cleanup
must preserve all pre-existing untracked authored references.

## Verification evidence

- `pnpm format:check`: PASS; `pnpm --filter web lint`: PASS (50 catalog contracts,
  16 rejected platform patterns); `pnpm --filter web typecheck`: PASS.
- Focused unit tests: 20/20 (`lesson-design-system.test.tsx`, `design-system-lab.test.ts`).
- Four `lesson-reading-preview.spec.ts` journeys passed: navigation and breakpoint crossing,
  failure/incorrect/retry/accepted-answer reload plus keyboard access to task five, complete no-JS,
  and actual 200% root-text scaling plus axe (zero violations). The corrected practice assertion
  was rerun separately after the other three passed; no claim of a Full Gate.
- Chrome MCP inline screenshots: actual 390×844 mobile and 1440×1000 desktop, reading/example/
  practice composition; console has no errors/warnings. E2E also verifies 960/961px behavior.
- Impeccable detector: `[]`. Production source LSP: zero diagnostics. The E2E Page Object is
  outside the configured src TS project; LSP's inferred project reports missing Playwright exports.
  The installed compiler checks that file successfully with Bundler resolution, and actual E2E
  execution passes. Do not change valid imports to accommodate the inferred-project diagnostic.
- Browser chrome zoom could not be driven through MCP (`Control++` left viewport/DPR unchanged).
  Actual text scaling to 32px passed; this is not represented as browser zoom. That manual check remains unverified; the architect subsequently authorized the two-Topic rollout.
- Temporary host Vite on port 3101 was stopped after generating the restored route. Docker dev
  remains running. Its generator initially hit EXDEV between image-owned temp files and the src
  bind mount; host generation produced the same tracked route tree without infrastructure edits.
- API regeneration: SKIPPED (no API changes). Full Gate/build/release: not requested.
- Repository hygiene: reviewed `make clean-dry-run`, then `make clean` and `make clean-check`
  passed. Pre-existing untracked lesson/reference assets remain untouched; `git diff --check` passed.

### Approved two-Topic rollout

- Activated on `/ege/16-rekursiya` and `/ege/5-preobrazovanie-zapisey-chisel`; authored content, routes, checker and progress schema unchanged. CourseLesson visual adoption remains deferred.
- Affected Critical Gate passed: format, web lint/typecheck, 20 focused unit tests and zero production LSP diagnostics.
- Five focused E2E journeys passed across the final runs: both Topic mobile-anchor/961–960px breakpoint/200% text-scaling/axe checks, recursion practice and isolated progress reset/reload, and both lessons across narrow/no-JS runtimes. Axe reports zero violations on both published lessons.
- Playwright MCP screenshots inspected for both lessons at 390×844 and 1440×1000, plus recursion practice/result; browser console has no warnings or errors. Chrome screenshot acquisition stalled, so visual inspection used the available Playwright MCP instead.
- Actual browser chrome zoom remains unverified; 200% text scaling is separately verified.
- Accessibility verification exposed pre-existing duplicate Mistake landmarks and the unlabelled context region. F8 converts comparisons into local notes and makes Topic context a labelled navigation region, with no visual/content change.

### Matte palette and density refinement (F9–F14)

- Original flat example surface restored; practice unframed. Scoped study palette is composed only by Topic lessons and lab; CourseLesson defaults verified unchanged.
- Progress bar, count and confirmed reset restored below the outline. `hideEmptyStatus` defaults false and hides only the zero-solved sentence in opted-in consumers.
- 21 focused unit tests passed. Eleven distinct E2E journeys passed across the final runs: original ten lesson/lab/state/no-JS/200%-text/axe journeys, plus square-scrollbar and forced-colors verification. The two runtime smoke journeys were rerun after tightening the shared target-size assertion so CourseLesson keeps its 40px floor.
- Desktop mouse 32px and touch/hybrid 40px study rows verified without overlapping hit areas. Current axe checks report zero violations. Browser geometry confirms 6px scrollbars, 0px end radius, hidden arrows and a separate dark-code thumb; forced-colors resets native width.
- Measured contrast: incorrect label 5.32:1, correct label 5.51:1; light scrollbar 4.26:1 and dark-code scrollbar 6.21:1. Nested notation has transparent fill with unchanged font size.
- MCP screenshots inspected for both Topic lessons, mobile practice, catalog and first Python lesson. Clean-navigation browser console is clear. Docker HMR retained stale composed CSS hashes after formatting; `make restart` refreshed the dev stack, and clean hydration was rechecked. The lifecycle rebuilt cached dev images because its input fingerprint had changed.
- Format, web lint/typecheck, production LSP and detector pass. Browser chrome zoom and actual Firefox native geometry were not verified; text scaling and Chromium forced-colors were verified. No release, API or persistence changes.

### Quiet scrollbar correction (F15)

- Architect requested less prominent resting scrollbars: light #c5c1ba (hover #a49e94), dark #505050 (hover #777777). This supersedes F14 resting contrast measurements as a design target; semantic text contrast remains unchanged.
- MCP screenshot and computed thumb color verified; console clean. Focused square-scrollbar/forced-colors E2E passed, as did format, web lint/typecheck and diff checks. No production TypeScript logic changed.

### Stronger fills and barely visible scrollbars (F16)

- Semantic backgrounds now mix 14% of standard status colors into the matte page; flat neutral panels use 5% primary ink and notation 6%. Muted example captions use a scoped #605e59 role and info labels #3e5e76 to retain readable contrast. No global text-color overrides.
- Resting light/dark scrollbars are #e4e1dc/#2d2d2d; hover #d2cec7/#414141. This intentionally supersedes F15 resting contrast.
- Both Topic accessibility/navigation/text-scaling checks passed after the final scoped-color correction. Hybrid targets and square/forced-colors scrollbar checks also passed; format, lint, typecheck and diff checks passed. MCP inspected stronger semantic and neutral fills, with a clean console. No production TypeScript behavior changed.

### Compact reading blocks and shared chrome (F17–F19)

- Browser audit measured 724.8px example/mistake surfaces beside 640px explanation/code. Study components now share the 40rem reading measure, retain semantic fills, and remove only example/procedure panels and example padding. Existing content rhythm separates unframed steps. Matching lab specimens use the same roles; CourseLesson defaults remain unchanged.
- Topic lessons and lesson lab use the expanded PublicHeader with topics active, shared page-frame composition and the existing PublicFooter. The footer row continues the outline rule in an identically sized first grid column, eliminating the 56px line gap while keeping the footer outside main. Mobile hides the continuation and retains title-first disclosure order.
- Expanded header navigation exposed a pre-existing overflow at 200% root text; section wrapping fixes it in the shared component. No catalog composition or authored content changes.
- Affected Critical Gate passed: format, web lint/typecheck, 21 focused unit tests, zero diagnostics on five changed production TSX files. Five focused E2E journeys passed: both published Topic navigation/breakpoint/200%-text/axe checks including new block-width and footer-continuity assertions; lab navigation, no-JS and enlarged-text/axe checks.
- MCP screenshots inspected Topic examples, mistakes, procedure, shared header, footer end, mobile title/navigation and lab; catalog confirms the same public header. Measured rail/footer edges meet and continuation spans the footer height. Mobile menu opens without horizontal overflow. Browser consoles have no warnings/errors; detector returned [].
- API regeneration and Full/Release Gates skipped (unchanged API; no release requested). Reviewed cleanup allowlist, removed only regenerable outputs/caches and passed clean-check. Browser chrome zoom remains separate from tested text scaling.

### Unified lesson links (F20)

- Practice selects the shared drawn FragmentLink variant with the existing orange brand icon and DrawnLinkUnderline; plain outline anchors keep their default presentation. Topic/Course previous-next links select drawn ActionLink. The shared back direction now mirrors the same authored arrow used for forward navigation.
- MCP screenshots inspected desktop/mobile practice and next/previous links; actual next-lesson and native theory-fragment clicks reached their intended destinations. No horizontal overflow at 390px; browser console clean. LSP diagnostics are empty on all six changed production component files; detector returned [].
- Affected gate passed: web lint/typecheck, 48 focused component tests, formatting and diff checks. API regen and Full/Release Gates skipped (no API/release scope). Allowlisted cleanup reviewed and completed.

### Surface-aware notation and directional navigation (F21–F22)

- Study Mistake/Checkpoint notation uses 8% matching learning ink mixed into its semantic fill; neutral idea Callouts use 5% primary ink into their quiet fill and primary text. Separate roles replace the transparent nested-notation override, preserving non-study defaults and warning callouts. Compact notation geometry and dark code blocks remain unchanged.
- Shared two-column previous/next navigation anchors links to their respective edges for both Topic and Course lessons. A lone link can use the full width while retaining its direction; paired long titles wrap independently.
- Both focused Topic browser journeys passed after the complete changes, covering mobile/breakpoints, 200% text scaling and axe. MCP inspected computed non-transparent matching notation colors and primary text, desktop semantic blocks, mobile next-only navigation and a CourseLesson with both links. Link edges align with the container, mobile has no horizontal overflow, clean browser consoles and detector [].
- Affected format, web lint/typecheck and diff checks passed. Production changes are CSS only: no new unit tests or TS LSP pass required; API regeneration and Full/Release Gates skipped. Dev restart completed and required allowlisted cleanup passed.

### Complete course adoption (F23)

- The architect explicitly expanded the accepted study presentation to all remaining lessons. All 28 published Python lessons now use the existing study intro/outline/practice, shared frame and palette; course context and previous/next destinations stay course-owned. Course progress uses the same hydration fallback, bar and confirmed reset as Topic lessons.
- MCP visited all 28 routes on desktop (HTTP 200, study consumers, rail and footer present) and at 390px (disclosure available, no horizontal overflow). Screenshots inspected first-lesson mobile identity and desktop/mobile rich comprehension content; semantic blocks match the code measure. Rail and footer edges meet, and the footer continuation is present. Breakpoint and 200% root-text checks passed. Clean hydrated browser console has no errors/warnings; detector returned [].
- Focused first-lesson and numbers E2E journeys passed (2/2): practice/reset, keyboard contents opening and close/focus anchor navigation, responsive reading and no-JS content/progress fallback. Existing Page Objects now open the study disclosure before measuring its targets and expect the honest no-JS progress fallback. Component tests passed (17/17); format, web lint/typecheck and production TSX LSP diagnostics passed. API/schema unchanged; no Full/Release Gate.

### Auxiliary pages (F24–F26, I1, T2)

- Implemented the approved illustrated 404/error/pending compositions, expanded privacy/public chrome,
  real loader/render/chunk recovery and single-owner route metadata. Transparent PNG sources and
  bounded WebP delivery assets are recorded with prompts. The lab owns representative specimens.
- Autonomous 502/503/504 documents use packaged fonts, mark and art. Isolated Nginx tests verify
  original status, HEAD, no-store/noindex/security headers, disconnected upstream, and unmodified
  API/resource/server-function bodies; application 404/500 pass through. Fixed-name auxiliary
  assets require cache revalidation so a later deployment cannot leave stale CSS or illustrations.
- Real browser failure injection caught two recovery ambiguities: loader failures also carry a
  component stack, and generic fetch failures must not be classified as missing JavaScript chunks.
  Route status now determines loader recovery, with focused regression coverage.
- Browser screenshots inspected desktop 404/loading/error, all three static states at 1440/768/390,
  mobile menus, reduced motion and 200% root text. The latter exposed the existing rem-based body
  minimum; its intended 320px floor is now independent of font scaling and mobile chrome can wrap.
  Browser chrome zoom and non-Chromium native rendering remain outside this verification.
- Focused units: 45 passed; E2E: three recovery/loading/no-JS journeys passed. Affected formatting, web lint/typecheck and production LSP passed.
  Nginx contracts passed after the final interception/cache correction; mobile/no-JS E2E also
  verifies 200% text. Clean navigation to privacy/lab has no application console errors; injected
  failures produce the expected development error reports. Decorative image failure stays silent.
  Allowlisted cleanup was reviewed and completed. An unrelated staged lesson-list draft retains
  Markdown hard-break whitespace; implementation diff checks pass when excluding that draft. Full/Release and API regeneration are
  excluded (no release requested, no API contract change).

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- F5 initially narrowed adoption to the two published Topic lessons; F23 explicitly supersedes that boundary and extends the accepted presentation to every CourseLesson. Shared defaults remain available to non-lesson consumers. The subsequent approved F9–F14 refinement supersedes the paper surfaces and compact solved-only progress from the initial rollout. Authored content remains unchanged.
- The existing lab page had survived as test-only source after its route was removed. F3 restores
  `/lab/lesson` with `noindex,nofollow`; the existing `/lab/` prerender exclusion remains in force.
- The historical migration matrix had omitted the already-shipped SurfaceMaterial/SurfaceGlint
  additions. T1 records subsequent adoption separately instead of rewriting Change 101 history.

## Commit Message

```text
feat(change-105): improve lesson reading and navigation
```

### SVG auxiliary compositions and universal grid (F27–F29, I2, T3)

- Approved error/loading references now inform SVG geometry and native skeleton structure;
  all seven runtime raster variants and their Nginx mounts/copies are retired. PNG sources remain
  historical provenance. The app owns one SSR-stable SVG page grid, with local illustration grids
  intentionally preserved; private StatusScene children own the replacement compositions.
- Browser inspection covered 404/privacy/server errors at 1440/768/390/320, desktop/mobile
  error/loading lab scenes, enlarged text, actual consent enable/withdraw, and long paired course
  navigation. Measured desktop gap is 64px; narrow links stack with 24px separation. Privacy's
  intrinsic grid sizing at 200% text was corrected. Public routes each have one page grid;
  forced colors hides it. The final normal-page console is clean; document error statuses produce
  expected resource errors. Actual browser chrome zoom is still a separate manual check.
- 39 focused component tests and three auxiliary E2E journeys passed, including no-JS 404,
  metadata recovery and delayed loader failure/retry. Updated isolated Nginx contracts passed
  with SVG MIME and no-raster checks. Format, web lint/typecheck, shell syntax and diff checks
  passed; LSP reported zero diagnostics for changed production TypeScript components.
- API generation and Full/Release Gates were not applicable/requested. No commit, merge,
  push or deployment was performed. The isolated Nginx preview was cleaned after inspection.

### New-reference compositions (F30–F32, I3, T4)

- Six distinct previews now follow `references/new_pages`; only numerals are outlined.
  Existing CustomIcon geometry is shared with private decorative cards and exported unchanged
  into local static SVG assets. No graph, timer dial, complex server drawing or raster generation.
- Pending status/subtitle/dots occupy their own grid row; skeleton shimmer pauses offscreen and
  under hidden-document activity, with static reduced-motion/no-JS output. Short layouts show six
  code rows, normal layouts nine. Content-driven heading rows and bounded code rows preserve text scaling.
- Eight focused foundation tests and four auxiliary E2E cases passed (three existing recovery/no-JS
  journeys plus the new motion/compact-layout case). The new test verifies running/paused motion,
  reduced-motion, 1440/768/390/320 and 200%-text bounds of the scene. Unrelated lab swatch/tab
  overflow at 320px/200% is not claimed fixed; the assertion is scoped to the new scene.
- Browser screenshots inspected error/pending/outlined codes and autonomous server compositions.
  Normal-size 404/502/503/504 fit 1440/768/390/320; enlarged-text word wrapping and the body width
  floor were corrected. Final lab console has no errors/warnings. Nginx contracts passed with
  new scene CSS and icon delivery. Preview cleaned on exit.
- Format, lint, typecheck and shell/diff checks passed. Production TS LSP diagnostics are empty;
  standalone E2E LSP still misresolves Playwright exports (existing tooling issue), while project
  typecheck and actual Playwright execution pass. API generation and Full/Release Gates skipped:
  no API changes or release request. No commit/merge/push/deploy.


### Quiet code scenes and compact outline (F33–F34)

- Code scenes now omit cards and foreground symbols in both app and autonomous documents.
  Error and pending retain their existing icon cards. A low-contrast peripheral SVG field is
  shared visually across all states; outline glints and the field breathe slowly only while
  app scenes are active. Static documents deliberately have no animation or runtime dependency.
- Outline groups stay top-aligned with a fixed 24px gap. Focused browser coverage verifies
  grouping within 360px, absent code cards, 1440/768/390/320 layouts, reduced motion and recovery.
  Eight component tests, four E2E cases and Nginx failure/delivery contracts passed.
- Desktop/mobile screenshots inspected the pending and code compositions; autonomous
  502/503/504 fit 1440/390/320. Production TypeScript LSP, web lint and typecheck passed.
  Backend/API gates are skipped because their contracts are unchanged.


### Local ship verification (2026-09-10)

- Critical Gate: format, web lint/architecture policies, typecheck and shell syntax passed.
  Focused tests: 67 component tests and 12 E2E journeys passed across final runs.
  T5 corrected missing catalog-table documentation; T6 aligned the existing recovery assertion
  with the accepted alert semantics. No production-code changes were needed during closure.
- Fresh LSP diagnostics were attempted for the source tree and a narrow component directory,
  but the MCP requests did not complete and were stopped. This row is SKIPPED (unresponsive tool);
  earlier production LSP evidence above remains valid for unchanged production files, and the
  current compiler typecheck passed. No claim of a fresh LSP pass.
- API/backend generation and Full/Release Gates are SKIPPED: no API/backend edits and local
  Critical ship only. Prior unrelated staged lesson-list/catalog reference assets are preserved
  outside this change's commit.
- Nginx failure/delivery contracts and final allowlisted cleanup passed. Backlog and architect
  review notes have zero unresolved items. Local closure does not publish or deploy.
