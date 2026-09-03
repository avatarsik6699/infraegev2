# CHANGE 85 — Final Release Reconciliation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `85` |
| Slug | `final-release-reconciliation` |
| Title | Final Release Reconciliation |
| Status | `archived` |
| Branch | `feature/85-final-release-reconciliation` |

---

## Goal

Prepare one auditable release candidate from locally shipped Changes 74–84: reconcile repository,
documentation and architecture contracts; remove only confirmed obsolete code and allowlisted local
artifacts; close missing validation coverage; and leave the branch ready for architect approval and
`/ship 85 --release`. Preserve product behavior, approved ALCHIMIA/editorial content and the current
production deployment until the release workflow explicitly replaces it.

The planning baseline is intentionally split: local `main` is `7150078fe1e6886df05c76ff8668991dd6dd6c14`
and 25 commits ahead of `origin/main`; both `origin/main` and live `/health/ready` currently report
`0cb949d1d9a1949e883a26cf1972954150352d83`.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Review the release diff's public contracts and all out-of-diff consumers identified by
  Fallow — rich `PracticeTaskTypes`, lesson-practice styles, the learning-content barrel and
  route-local lesson-lab styles — and fix only demonstrated contract, layer, SSR/no-JS,
  accessibility or consumer regressions; preserve the intentional TopicLesson/CourseLesson and
  lab/production ownership boundaries — _Depends on:_ T1
- [x] `F2` Classify every current dead-code, CSS, complexity and clone signal against executable
  imports, CSS Modules `composes`, convention loading and generated/public contracts; remove the
  confirmed obsolete `Onest Fallback`, unused `learningContentEyebrow` pattern and unnecessary
  external export on `expectMigratedLearningControls`, while retaining documented false positives
  and avoiding metric-only abstraction — _Depends on:_ F1
- [x] `F3` Review the measured production hotspots, especially practice rendering/model/API paths,
  and the oversized lab/test helpers; make only the smallest behavior-preserving refactors whose
  release-risk reduction is proven, and record why intentional linear switches, catalog code or
  domain-specific Page Object flows remain when extraction would obscure ownership — _Depends on:_ F1
- [x] `F4` Verify the final frontend candidate on representative home, TopicLesson, CourseLesson,
  rich-practice and lab routes with clean console, desktop/mobile/zoom geometry, keyboard access
  and no-JavaScript readability; confirm the cleanup causes no font, layout, task-content or
  progress regression — _Depends on:_ F2, F3, F5, F6, T3
- [x] `F5` Raise the mobile lesson-outline, progress-reset, practice return-link and analytics
  consent-detail hit areas that browser verification confirmed below the 40 px frontend contract;
  preserve the established visual hierarchy and add focused geometry assertions — _Depends on:_ F1
- [x] `F6` Increase the Python course module headings such as «Старт и отладка» so they read as
  section headings rather than compact labels; preserve the approved type family, shared scale,
  curriculum density and responsive hierarchy — _Depends on:_ F1
- [x] `F7` Reduce the `LessonOutline` widget's vertical rhythm — the current per-item `2.5rem`
  min-height makes short single-line labels look sparse — without dropping the `40 × 40px`
  interactive-target floor from `docs/FRONTEND.md`; use the invisible-hit-area technique that
  contract already allows for compact visuals instead of shrinking the real click box. Verify with
  browser evidence at desktop and mobile widths, including a long two-line label and keyboard
  focus — _Depends on:_ —
- [x] `F8` Superseded by `F10` below: a precise full-codebase census (30 `*.lesson.tsx` files, 145
  steps, 58 checkpoint arrays) replaced the earlier ~20-file estimate with 3 confirmed adjacent
  single-item `Checkpoint` instances — see `F10` — _Depends on:_ —
- [x] `F9` Unify the `LessonOutline` invisible-hit-area technique (`F7`) across every other dense
  text-link list/row in the app that still uses a visible `min-height: 2.5rem`: `back-link.module.css`
  `.root`; `action-link.module.css` `.root[data-hierarchy="text"]` only (leave `default`/
  `secondary`/`quiet` control-button variants at real 40px); `public-footer.module.css` `.links a`;
  `analytics.module.css` `.privacyLink`; `lesson-practice.module.css` `.taskTheoryLinks a`;
  `course-overview-page.module.css` `.courseLink`; `tabs.module.css` `.tab` (verify the active-tab
  bottom-border indicator still reads correctly against the smaller visible box).
  Preserve the `40 × 40px` interactive-target floor via the same invisible `::after` hit area;
  change only the height mechanism, not color/hover/focus/active-state rules. Verify each surface
  with browser evidence at desktop and mobile widths — _Depends on:_ —
- [x] `F10` Fix the 3 confirmed adjacent single-item `Checkpoint` pairs found by the full census:
  `python-conditions.lesson.tsx` (`comparison-boundaries`/`checkpoint-boundary` +
  `test-both-branches`/`checkpoint-tests`), `python-errors.lesson.tsx` (`name-error`/
  `checkpoint-name-error` + `type-or-value`/`checkpoint-type-value`), and
  `preobrazovanie-zapisey-chisel.lesson.tsx` (`branched-base-three`/`checkpoint-branch-condition` +
  `safe-search-bounds`/`checkpoint-safe-bound`). For each pair, move the first step's checkpoint
  item into the second step's `checkpoint` array (append after its own item) and delete the first
  step's `checkpoint` field, matching the existing multi-item pattern already proven in
  `rekursiya.lesson.tsx`. Preserve every id/prompt/reveal verbatim. Add a rule to `docs/FRONTEND.md`
  documenting that adjacent steps must not each render a single-item `Checkpoint` — _Depends on:_ —

### Infra

- [x] `I1` Re-run `make clean-dry-run`, approve the exact allowlist, execute `make clean`, and prove
  with the cleanup contract test and a post-clean inventory that build outputs, caches and tool
  reports are gone while dependencies, environments, secrets, data and tracked evidence remain —
  _Depends on:_ T1
- [x] `I2` After read-only reachability verification, delete only the merged local
  `feature/74-*` through `feature/84-*` refs; preserve `main`, the active Change 85 branch, all
  remote refs and every commit — _Depends on:_ I1

### Data

None

### Other

- [x] `T1` Freeze and record the final audit inventory across local `main`, `origin/main`, live
  production health/deploy evidence, archived Changes 74–84, tracked/untracked/ignored files,
  dependency and generated-contract metadata, and the current Fallow review surface before any
  deletion or refactor — _Depends on:_ —
- [x] `T2` Put `scripts/tests/task-content-assets.test.mjs` under a canonical repository command
  and the appropriate Critical/Full Gate contract so its path traversal, metadata, MIME, size and
  ownership checks cannot silently become an orphaned test; keep `validate:content` responsible
  for validating the real content tree — _Depends on:_ T1
- [x] `T3` Run the repository-owned frontend architecture/layer/test verifiers, API drift check,
  content validation and focused tests; reconcile every confirmed violation without weakening a
  rule, inline-bypassing a platform boundary or suppressing a scanner finding — _Depends on:_ F1, T2
- [x] `T4` Synchronize README, PRODUCT, SPEC roadmap/milestones and STACK gate wording with the
  verified three-state release model; mark roadmap items 19–20 and the M5 implementation outcome
  truthfully, remove volatile equality claims between local, remote and production state, and
  retain health/release evidence as the authority for the deployed SHA — _Depends on:_ T1, T2, T3
- [x] `T5` Re-run Fallow dead-code, health/CSS, duplication, audit and graph-grounded review after
  cleanup; leave no unclassified release finding, document intentional convention/generated/domain
  exceptions, and present the exact candidate plus residual risks for architect approval before
  `/ship 85 --release` — _Depends on:_ F2, F3, F4, F5, F6, I2, T4

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full/Release Gates. -->

---

## Files

### Create / modify

~~~
README.md
PRODUCT.md
docs/SPEC.md
docs/STACK.md
docs/FRONTEND.md (only if an executable architecture contract is demonstrably stale)
docs/KNOWN_GOTCHAS.md (only for a newly confirmed recurring pitfall)
docs/changes/85-final-release-reconciliation.md
package.json
scripts/tests/task-content-assets.test.mjs
apps/web/src/app/styles/fonts.css
apps/web/src/shared/styles/patterns.module.css
apps/web/e2e/pages/lesson-page.assertions.ts
apps/web/src/entities/practice-task/** (only for a confirmed contract defect)
apps/web/src/features/lesson-practice/** (only for a confirmed contract or hotspot defect)
apps/web/src/features/analytics/analytics.module.css (hit-area geometry only)
apps/web/src/shared/components/confirmation-dialog/confirmation-dialog.module.css
apps/web/src/shared/components/learning-content/** (only for a confirmed boundary defect)
apps/web/src/shared/components/back-link/back-link.module.css (F9 hit-area geometry only)
apps/web/src/shared/components/action-link/action-link.module.css (F9 hit-area geometry only)
apps/web/src/shared/components/tabs/tabs.module.css (F9 hit-area geometry only)
apps/web/src/widgets/lesson-outline/lesson-outline.module.css
apps/web/src/widgets/public-footer/public-footer.module.css (F9 hit-area geometry only)
apps/web/src/pages/lesson-design-lab/** (only for a confirmed route-local boundary defect)
apps/web/src/pages/course-overview/** (F6 module-heading typography, F9 hit-area geometry only)
apps/web/src/entities/course/content/python-conditions.lesson.tsx (F10 checkpoint grouping only)
apps/web/src/entities/course/content/python-errors.lesson.tsx (F10 checkpoint grouping only)
apps/web/src/entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx (F10 checkpoint
  grouping only)
apps/web/tests/** and apps/web/e2e/** (focused regression coverage only)
allowlisted ignored build/cache/tool artifacts (delete through make clean)
merged local feature/74-* through feature/84-* refs (delete after reachability proof)
~~~

### Do NOT touch

- Authored CourseLesson/TopicLesson narratives, `content/tasks/**`, answer variants, ids,
  associations, publication state, mastery thresholds or progress/storage semantics
- Approved ALCHIMIA source assets or generated public brand assets
- Backend/API/OpenAPI behavior unless the audit first proves a release-blocking contract defect
- Analytics, privacy, security, Nginx, operations, backup, SSH or deployment behavior (the F5
  consent-detail hit-area geometry does not change analytics behavior)
- Dependencies, lockfiles or tool versions without a separately proven need
- Archived change files, retained audit evidence, remote branches or production runtime

---

## Contracts

See `docs/SPEC.md` §1–§5 and §9, `docs/FRONTEND.md`, `docs/STACK.md` Critical/Full/Release Gate
tables and the Files list above. This change may reconcile implementation and documentation drift
but does not authorize new product behavior, domain coupling, content rewriting, infrastructure
changes or deployment outside `/ship 85 --release`.

---

## Gate Checks

Use one affected frontend/tooling/documentation Critical Gate for `/work 85`, plus:

```bash
bash scripts/tests/clean-local-artifacts.test.sh
pnpm test:content-assets
pnpm validate:content
pnpm api:check
pnpm --filter web test
pnpm --filter web exec playwright test --list
```

Run the repository architecture verifiers through the canonical web lint command. Re-run Fallow
dead-code, health/CSS, duplication, audit and walkthrough validation with JSON output; all retained
signals require explicit evidence-based classification. Browser evidence is mandatory for any
frontend/CSS edit. The Full and Release Gates are intentionally deferred to `/ship 85 --release`.

---

## Architect Review Notes

Use this section after manual product, UX, API or workflow verification. The agent resolves added
notes through `/work 85 review`; leave an item unchecked until it is re-verified.

- [x] No architect review issues recorded

---

## Implementation Notes

- `F9`: applied the `F7` invisible-`::after` hit-area technique to `back-link`, `action-link`
  (`text` variant only — `default`/`secondary`/`quiet` stayed at real 40px per FRONTEND.md's
  "ordinary interactive controls" rule), `public-footer`, `analytics` consent link,
  `lesson-practice` theory links, `course-overview` `.courseLink`, and `tabs`. Deliberately left
  `course-overview-page.module.css` `.lessonRow` unchanged: it always renders a 2-line title +
  outcome (`course-overview-module.tsx`), so its `min-height: 2.5rem` is already exceeded by real
  content and isn't inflating anything — converting it would have been a no-op with added risk.
  Browser evidence (desktop 1440px, mobile 390px, tabs active-indicator, footer, consent banner)
  confirmed no regression; no console errors/warnings.
- `F10`: a precise full-codebase census (30 `*.lesson.tsx`, 145 steps, 58 checkpoint arrays) found
  only 3 adjacent single-item `Checkpoint` pairs — not the ~20-file systemic pattern the earlier
  loose regex scan suggested. Fixed all 3 by moving the first step's item into the second step's
  `checkpoint` array; verified in-browser that each renders as one block with both questions and
  that unrelated lesson-level/rekursiya checkpoints are unaffected (`lesson-design-system.test.tsx`
  still passes its hardcoded `rekursiya` `[2,2,2,1]` assertion). Documented the rule in
  `docs/FRONTEND.md`.
- `F7`: `LessonOutline` links now satisfy the `40 × 40px` interactive-target floor
  (`docs/FRONTEND.md` § Interactive targets) via an invisible `::after` hit area
  (`inset: -0.5rem 0`) rather than a visible `min-height`, so short one-line labels no longer force
  ~40px-tall visible rows. Browser evidence (desktop 1440px and mobile 390px, a two-line-wrapped
  label, keyboard focus, and the active-item rule indicator) confirmed no regression; no console
  errors/warnings.
- `F8` was investigated but left undone: the architect's screenshot instance
  (`checkpoint-branch-condition` / `checkpoint-safe-bound` in
  `preobrazovanie-zapisey-chisel.lesson.tsx`) is not an isolated authoring slip — a repo-wide scan
  found one `Checkpoint` question per lesson step is the prevailing pattern across roughly 20
  `*.lesson.tsx` files. Writing a blanket "merge adjacent single-item Checkpoints" rule or applying
  it broadly would rewrite established curriculum structure without architect sign-off, so no
  FRONTEND.md rule was added and the flagged instance was left unchanged pending direction.
- The candidate remains an uncommitted worktree on
  `7150078fe1e6886df05c76ff8668991dd6dd6c14`, as required by `/work`; `/ship 85 --release` creates
  the exact release commit. At audit time local `main` was 25 commits ahead of `origin/main`, while
  `origin/main`, the last successful deploy and live `/health/ready` all reported
  `0cb949d1d9a1949e883a26cf1972954150352d83`.
- `make clean` removed only the reviewed allowlist. The cleanup contract preserved dependencies,
  the API environment, local settings and scheduled lock. Merged local branches 74–84 were proven
  ancestors of `main` before their refs were deleted; commits and remote refs remain.
- Fallow's Change 85 audit against `main` passes and its final graph walkthrough accepted all four
  judgments. The wider release audit against `origin/main` still reports classified historical
  signals from Changes 74–84: convention-loaded CSS/Lighthouse files, public/generated type
  exports, linear domain/test flows and intentional clones. Health remains B/78.3 because of churn
  and unit-size penalties; styling is A/96.3. No metric-only extraction or scanner suppression was
  added because it would obscure established ownership without reducing release risk.
- Browser verification exposed sub-40 px lesson and consent hit areas; F5 records the finding and
  the fix. Focused Playwright journeys now pass for desktop, zoom, mobile, keyboard and no-JavaScript
  operation. The editor LSP still mis-resolves Playwright's `expect`/`Page` exports in E2E files,
  while repository `tsc`, ESLint, architecture checks and Playwright collection/execution pass.
- Architect review added F6 before release: course module headings now use the shared 20 px display
  role instead of matching 16 px lesson titles. Desktop and 390 px browser evidence confirms the
  hierarchy, including the longest module title, without overflow or console errors.

---

## Commit Message

```text
chore(change-85): reconcile final release candidate
```
