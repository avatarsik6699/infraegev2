# Recursion pilot: learning blocks review

Scope: `/ege/16-rekursiya`, F14–F15. Wording, teaching sequence and approved semantic
colors retained. Shared component defaults remain unchanged for other lessons.

## Findings and changes

| Area | Finding | Result |
| --- | --- | --- |
| Checkpoint | Smaller, heavier questions; unused indentation; nested heading inherited outcome rules | Questions and answers 16px/400/1.68; label 14px/500; full available width; question rows have only disclosure separators |
| Hint / solution | Small, muted explanatory text | 16px/400, normal reading color; clear spacing and independent disclosure controls |
| Concept mistake | 14px body and icon column reduced reading width | 16px body across full panel; red/green labels 14px/500; surfaces/icons preserved |
| Applicability callout | Heavy heading and narrow body column | Quiet 14px/500 heading; 16px body spans panel width |
| SSR disclosures | All answers rendered linearly before enhancement / without scripts | Existing native disclosure fallback enabled in pilot; answers hidden until requested |
| Mobile relation | Short `n > 1` condition split across lines | Existing semantic term wrapper keeps short conditions together |

## Visual evidence

| Block | Desktop 1440×900 | Mobile 390×844 |
| --- | --- | --- |
| Checkpoint | [Desktop](desktop-checkpoint.png) | [Mobile](mobile-checkpoint.png) |
| Mistake | [Desktop](desktop-mistake.png) | [Mobile](mobile-mistake.png) |
| Applicability | [Desktop](desktop-callout.png) | [Mobile](mobile-callout.png) |
| Practice help | [Desktop](desktop-help.png) | [Mobile](mobile-help.png) |

[Initial mobile checkpoint](before-mobile-checkpoint.png). Final captures use repository Chromium for exact dimensions; Playwriter supplied
live inspection and the initial comparison. Its final screenshot timed out, so the
mobile checkpoint was recaptured with repository Chromium after short-condition polish. All final captures inspected.

## Acceptance evidence

- `pnpm --filter web lint`, `pnpm --filter web typecheck`, `pnpm format:check`: PASS.
- Explicit TypeScript compiler for changed E2E files: PASS; source LSP diagnostics clean.
- `pnpm --filter web exec vitest run tests/lesson-content-contract.test.ts tests/shared-components.test.tsx`: 40 PASS.
- Topic-reading: 8 existing scenarios PASS; 2 new learning-block scenarios PASS.
  New pair rerun after final short-condition change. A test locator initially assumed
  a mounted panel; corrected to use the trigger's stable id. No production bypass.
- `pnpm validate:content`: PASS, 735 tasks / 7 topic lessons / 28 course lessons.
- Keyboard Enter opens/closes answers; focus remains on trigger; chevron updates.
  Multiple checkpoint answers and hint/solution can remain open independently.
- No-JS native disclosure tested; answers and help initially hidden.
- 320/390/768/1440 widths: typography, available width and overflow assertions PASS.
- Reduced motion and actual 200% text sizes covered; existing global header limit
  at combined 320px + 200% text remains documented in the active change.
- Fresh real-Chrome reload: application errors and failed resources absent.
  Chromium capture batch: console/page errors [], failed resources 0.
- Independent read-only review and final wrap follow-up: no findings.
- Impeccable type detector: []; no graph-analysis claim.

Native-to-enhanced disclosure replacement uses the existing component mechanism.
Persistence of focus/open state during delayed hydration was not added or claimed;
settled JavaScript and no-JavaScript behavior is covered.

No backend/schema/dependencies/Full/build gate: unchanged boundaries. No commit,
merge, push or deployment performed. Repository hygiene checked after evidence analysis.
