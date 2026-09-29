# Change 156: approved style rollout

2026-09-28. Local implementation on `feature/156-recursion-style-pilot`.
This report supersedes the earlier lesson-only pilot evidence for current styling.

## Implemented

The approved recursion style now belongs to shared tokens and components. All
7 published EGE lessons and 28 Python lessons consume it without lesson-ID or
pilot selectors. Authored wording, sequence and existing emphasis are preserved.

- Existing three font families retained. Lesson body16/400/1.68; contextual
  labels14/500; code and formulas0.9 (inline0.9em, block0.9rem).
- Blue textual links and current outline marker; underline only on hover/focus;
  nearby arrows shift slightly with reduced-motion support. Tabs, buttons,
  header links and composite navigation surfaces retain neutral roles.
- Shared green success/red error roles. Account email confirmation has a green
  check; errors have a red alert icon. Informational mail requests remain neutral.
- Neutral transparent checkpoints with icon; native fallback enabled by default
  for checkpoints/practice help. Accordion titles500, body400; answer indentation
  retained without a side rule. Course overview keeps its first module open.
- Worked-example icon and consistent labels/numbers, thin subsection/outcome
  rules, unified prose/code sizing, common practice explanation rhythm.
- Home links, course metadata font, legal-page subsection hierarchy, empty/error
  states and responsive text reflow reconciled with the same roles.

The 200% text review found and fixed intrinsic sizing in topic cards, course
cards/progress, practice heading/sort/pagination and profile identity. Course cards stack at
constrained container widths; ordinary desktop/mobile and820px tablet were
visually reviewed. Pagination switches its fixed mobile grid to wrapping full-size controls in narrow containers.
Text remains available; code retains local scrolling.

## Affected acceptance

| Check | Result |
| --- | --- |
| `pnpm format:check` | PASS |
| `pnpm --filter web lint` | PASS, including E2E/app/layer/design-system policies |
| `pnpm --filter web typecheck` | PASS |
| Explicit strict E2E TypeScript compiler | PASS |
| Source LSP | Changed production TS/TSX clean |
| Focused Vitest | 47 PASS across6 files |
| `pnpm validate:content` | PASS:735 tasks,7 topics,28 course lessons |
| Impeccable type detector | `[]` |
| Published-lesson production acceptance | 70 PASS:35 lessons with/without JavaScript |
| Site-family acceptance | 61 cases pass after focused corrections/reruns |
| Final catalog reflow regression | Course11 PASS; topic/practice23 PASS |
| Final feedback/profile regression | 2 PASS |
| Final pagination navigation regression | 1 PASS |
| Production layout/degraded acceptance | 5 PASS |
| Fresh production email confirmation | JS1 PASS; native recovery1 PASS |
| Production build | PASS, final build23:36:34 local |
| Independent read-only review | No remaining findings, including F29–F32 |

The lesson registry suite checks390px, keyboard/native disclosures, subsection
rules, code14.4px, actual200% text/code28.8px and horizontal overflow. The existing
topic-reading suite additionally checks desktop,320px, outline, touch, neutral
tabs, feedback, link/arrow behavior and reduced motion.

Focused unit files: `course-overview`, `lesson-content-contract`,
`practice-content-renderer`, `practice-detail`, `practice-inline-solving`,
`topic-lesson-unavailable-practice`. The last needed a partial router mock that
retains real exports including `createLink`; runtime was unchanged. Standalone
practice status assertions now select main content separately from header
session status, retaining error/input/retry checks.

Production layout checks cover pending/failed fonts, lesson mobile SSR height,
practice SSR controls/filtering, busy-spinner feedback width and no-JS practice.
The temporary production config preserves repository reduced-motion settings.
The local server used the running API through localhost8080; no Docker restart,
database migration or production deployment occurred.

## Browser evidence

Playwriter was used first with ordinary Windows Chrome Default. Its screenshot
capture timed out; repository Chromium supplied the final captures. The owned
tab/session were closed without closing the user's Chrome.

Final production captures:1440×900 and390×844 for17 routes/states, plus820px
course catalog and enlarged-text views. Each page was measured at ordinary and
200% root text. See [observations](browser-observations.json). All34 normal/enlarged observations have no horizontal overflow and no unexpected
resource or application errors. Pagination also passes390px/200% with JavaScript
and native GET controls. The enlarged sort popup was visually inspected. Expected document
404 and deliberately mocked verification400 are recorded explicitly.

Browser fixtures isolate guest sessions during full registry traversal, avoiding
Nginx auth-rate429 unrelated to reading. Profile/progress and email verification
states are mocked; no live account was created or token consumed. Local API read
requests use the running8080 service. Visual captures stub analytics collection
with204; no claim is made about the external analytics collector.

| Family | Desktop | Mobile |
| --- | --- | --- |
| Home | [image](home-desktop.png) | [image](home-mobile.png) |
| EGE catalog | [image](ege-desktop.png) | [image](ege-mobile.png) |
| Courses | [image](courses-desktop.png) | [image](courses-mobile.png) |
| Course program | [image](python-overview-desktop.png) | [image](python-overview-mobile.png) |
| Practice catalog | [image](practice-desktop.png) | [image](practice-mobile.png) |
| Practice detail | [image](practice-detail-desktop.png) | [image](practice-detail-mobile.png) |
| Recursion | [image](recursion-desktop.png) | [image](recursion-mobile.png) |
| Python lesson | [image](python-lesson-desktop.png) | [image](python-lesson-mobile.png) |
| Sign-in | [image](sign-in-desktop.png) | [image](sign-in-mobile.png) |
| Register | [image](register-desktop.png) | [image](register-mobile.png) |
| Recovery | [image](password-reset-desktop.png) | [image](password-reset-mobile.png) |
| Profile | [image](account-desktop.png) | [image](account-mobile.png) |
| Privacy | [image](privacy-desktop.png) | [image](privacy-mobile.png) |
| Consent | [image](consent-desktop.png) | [image](consent-mobile.png) |
| Not found | [image](not-found-desktop.png) | [image](not-found-mobile.png) |
| Confirmation success | [image](verification-success-desktop.png) | [image](verification-success-mobile.png) |
| Confirmation error | [image](verification-error-desktop.png) | [image](verification-error-mobile.png) |

## Boundaries and limitations

No API, auth behavior, schema, dependency, authored-content or release boundary
changed. Corresponding Critical rows are skipped. No Full Gate, commit, merge,
push or release. Chromium evidence does not claim Safari/physical-device or live
identity-provider coverage. Existing PostCSS `from` warning remains; build passes.
An early host-wrapper attempt lacked required Compose environment; the final
build/server were run directly with the existing API and left Docker untouched.

Final hygiene: `make clean-dry-run` reviewed, `make clean` and `make clean-check`
PASS. Reports were analyzed before allowlisted removal; authored evidence retained.
Owned production server stopped, Playwriter session closed and temporary runners
removed. `git diff --check` PASS.
