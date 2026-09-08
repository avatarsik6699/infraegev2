# CHANGE 104 — Home and topic visual cohesion

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `104` |
| Slug | `home-topic-visual-cohesion` |
| Title | Home and topic visual cohesion |
| Status | `active` |
| Branch | `feature/104-home-topic-visual-cohesion` |

## Goal

Bring the homepage and topic catalog into the material/light language of the current mini-course
catalog and Python overview. The approved brief retains the learning map but permits recomposition,
with expressive coordinated motion and quiet intervals. Preserve content, routes and publication truth.

## Design References

- `/courses`: paper material, substantial illustration, contour light, bounded once-only effects.
- `/courses/python`: engineering field, contact depth, soft light and quiet intervals.
- `/lab/design-system` → Система → Визуальный язык: catalog and overview specimens.
- Current homepage: authored curved orange learning map; preserve its subject and icon vocabulary.

## Backlog

### Backend
None.

### Frontend
- [x] F1 Recompose the homepage: clean heading/scene separation, balanced height, visible engineering field, paper depth and a compact mobile geometry retaining stages and cards. — _Depends on:_ —
- [x] F2 Coordinate a 12-second sequence (main path 0–4s, branch/light response 4–7s, rest 7–12s), bounded card drift with attached connections, stable pause/resume and complete static/reduced-motion rendering. — _Depends on:_ F1
- [x] F3 Recompose `/ege`: content-led planned cards, complete published descriptions and separated artwork/action, responsive gutter-owned patterns/routes, once-only published frame light; preserve the ordered 25 topics and 3/2/1 columns. — _Depends on:_ F2
- [x] F4 Verify the two changed routes and compare both course references in the browser: responsive breakpoints, low-height desktop, zoom, keyboard, no-JS, reduced motion, offscreen/hidden pause, image failure and consent overlay; update focused geometry/browser coverage. — _Depends on:_ F3
- [x] F5 Architect follow-up: research and amplify the homepage composition and copy; extend a legible perspective grid, distributed subject patterns and quiet traveling light across the entire page, keeping the reading/action area clear. — _Depends on:_ F1
- [x] F6 Architect follow-up: enlarge satellite cards, differentiate their depth and motion, engrave their surfaces and stage blocks, and replace the rectangular illustrative progress with a dimensional circular indicator; keep connections attached and static fallbacks complete. — _Depends on:_ F5
- [x] F7 Verify the amplified homepage against the course references on desktop/mobile, keyboard, SSR/reduced motion and motion lifecycle; synchronize visual contracts and run the affected Critical Gate. — _Depends on:_ F6
- [x] F8 Architect correction: rebuild satellite card composition with substantially larger centered icons/content, explicit perspective/Z planes and depth-dependent shadows; add subtle surface patterns to cards and stages; simplify the progress dial to the same paper language. — _Depends on:_ F6
- [x] F9 Architect correction: restore «Информатика - это система», remove the three-verb lead, retain the explanatory paragraph and offer Python versus topic entry; fade every background layer smoothly through chrome boundaries and fit the complete desktop composition within the viewport. — _Depends on:_ F8
- [x] F10 Verify corrected card projection/attachment, desktop fit at representative short/tall sizes, mobile reflow, both keyboard routes, static/reduced motion and motion lifecycle; update contracts and run the affected Critical Gate. — _Depends on:_ F9
- [x] F11 Architect clarification superseding F8 tilt: remove perspective distortion; communicate depth only with scale, sharpness and shadows. Give cards/stages distinct restrained arc, dot and edge-line material patterns; move progress arc to the disc perimeter and enlarge stage numbers/titles without collisions. — _Depends on:_ F9
- [x] F12 Replace tasks edge hatching; add fine material texture to cards, stages and progress. Remove blur and strong size hierarchy, retain modest size variation. Enlarge cropped stage numerals and titles, harmonize both entry links with standard drawn arrows, and verify responsive composition and affected frontend checks.
- [x] F13 Restore 40-unit stage numbers, 24-unit titles and centered 24-unit checks; replace both entry choices with one standard drawn-arrow «Начать готовиться» link to `/ege`. Remove obsolete choice/cropped-number styling, update contracts and existing assertions, verify desktop/mobile and the affected frontend gate.
- [x] F14 Enlarge the four satellite CustomIcons with bounded left-edge overflow, keeping copy and connector clearance. Preserve the shared glyphs and existing material/motion; verify desktop/mobile screenshots, containment and affected frontend checks.
- [x] F15 Follow visual_schema.png: restore contained 88-unit icons, reduce satellite padding/dimensions, remove satellite shadow/thickness/highlight and use a quiet flat surface. Keep central stages intact; update attached route endpoints and verify desktop/mobile, geometry and affected checks.
- [x] F16 Remove shared foreground translation so central stages, their text and progress remain stationary. Retain only satellite card drift and coordinated branch deformation, plus background/light effects. Verify positions through the motion cycle, responsive output and affected frontend checks.
- [x] F17 Remove the progress caption; enlarge and center the illustrative 72% value in brand orange. Update the existing browser assertion and verify the dial.
- [x] F18 Reduce card/stage texture and engraving contrast; remove all decorative texture/arc engraving inside the 72% dial. Preserve its value and perimeter track/arc; verify the final combined adjustment.
- [x] F19 Refine `/ege`: add very subtle varied card material and distributed ambient motifs; replace vertical orange trails with quiet field illumination and retain bounded published-card glints. Give published topics 5/16 a top artwork region around two thirds of the card, with readable overlaid number metadata and full separate copy/action. Preserve 25-topic order, planned semantics and responsive/SSR/reduced-motion behavior; verify layout, routes, lifecycle and affected frontend checks.
- [x] F20 Architect correction to F19: preserve ordinary single-cell card footprint; do not span rows/columns or impose tall fixed heights. Expand the image inside that footprint, overlay title/number on quiet paper backing, and keep complete summary/action below.
- [x] F21 Replace repeated ambient arc tiles with distributed varied vector compositions inspired by the supplied binary/graphs/logic/code references. Keep them faint, static and separate from content; retain soft background illumination.
- [x] F22 Standardize all 25 topic cards: identical media/content/footer layout and equal card heights, neutral artwork placeholder where no image exists. Keep published links and planned «Скоро» semantics; verify all-card alignment, responsive copy and existing catalog journeys.
- [x] F23 Separate image/title/summary zones: equal image area and reserved two-line title space for every card, aligned title and description starts, no title overlay obscuring variable image portions. Add feathered artwork edges and regression assertions for text alignment/containment.
- [x] F24 Enlarge the actual illustrations for topics 5/16 within the standardized media track, restrict alpha feathering to a narrow edge band and preserve all text/card alignment. Verify artwork cropping and the existing catalog geometry checks.
- [x] F25 Make artwork occupy a literal two thirds of each standard card. Architect approved concise page-local descriptions and smaller headings. Preserve the compact uniform template, allocate exactly 2:1 media/content tracks and retain narrow edge fade.
- [x] F26 Increase card headings slightly, restore full source descriptions with one-line ellipsis, and tighten title/description spacing while preserving exact 2:1 media/content tracks and uniform alignment.
- [x] F27 Make summaries compact two-line excerpts and align heading text to the bottom of its shared slot, eliminating the apparent blank line while retaining equal cards and two-thirds artwork.
- [x] F28 Reduce artwork to 58% of the unchanged card, restore comfortable text/action spacing, and move planned status beside the task badge over the artwork.
- [x] F29 Match the planned «Скоро» badge to the adjacent task label using one shared page-local style.
- [x] F30 Apply the accepted image-first topic-card format to all four mini-courses: uniform responsive cards, upper artwork with metadata, separated readable copy/action, and faint material/varied patterns. Preserve actual publication links, progress hydration, motion and failed-image behavior.
- [x] F31 Restore the original asymmetric course mosaic and make artwork fill its assigned region with bounded edge overflow, retaining quiet textures and clear copy.
- [x] F32 Strengthen course-card grain slightly, restore restrained original arc engravings, and add a subtle silver-neutral gradient and bounded soft material glint without changing layout or planned affordances.
- [x] F33 Remove Excel top-edge fade, enlarge course-card headings, soften the upper staircase, and remove central/right orange trail segments that visually join the cards.
- [x] F34 Increase mini-course card headings to 32px, giving their natural wrapping more space from the artwork while retaining the asymmetric card frames and readable spacing.
- [x] F35 Replace Excel and algorithms artwork with architect-supplied transparent PNG derivatives, preserve alpha in WebP delivery and bypass the obsolete paper-removal filter for these two assets.
- [x] F36 Display the complete Excel illustration without cover cropping or edge masking, preserving card geometry.
- [x] F37 Restore full-width Excel artwork without cropping: size its transparent canvas at intrinsic 3:2 aspect ratio, anchor it above the text and allow the necessary upward overflow.
- [x] F38 Swap Excel and advanced-problems in catalog order and mosaic slots; give Excel the wide closing frame, restore narrow edge fading and bounded artwork overflow instead of the large upward escape.
- [x] F39 Place the wide Excel card patterns and status at the left edge, and top-align its title/summary with comfortable clearance below the status.
- [x] F40 Complete the final architecture/code audit: normalize class composition, remove obsolete illustration metadata, clarify current progress placement, synchronize the stale 2-card unit expectation with all 25 media/footer slots, retry the computed-style assertion after client navigation, explicitly type the router mock import callback for isolated LSP analysis, and verify the complete affected frontend scope before local ship.

### Infra / Data
None.

### Other
- [x] T1 Synchronize FRONTEND, SPEC visual details and PRODUCT with the accepted implementation and report affected-area Critical Gate evidence. — _Depends on:_ F4

## Files

### Create / modify
- Frontend: `apps/web/src/pages/foundation/*`, `apps/web/src/pages/topic-catalog/*`.
- Focused verification: `apps/web/tests/home-learning-map-geometry.test.ts`, `apps/web/tests/topic-catalog.test.tsx`, `apps/web/e2e/pages/foundation.page.ts`, `apps/web/e2e/pages/topic-catalog.page.ts`, their owning fixtures/specs if needed; `apps/web/e2e/pages/topic-lesson.page.ts` home-return heading expectations.
- Documentation: `docs/FRONTEND.md`, `docs/SPEC.md` §5.3 visual details, `PRODUCT.md`, this change.

### Do NOT touch
- Authored learning content, API, dependencies, deployments and user-provided `docs/artifacts/`.
- Course catalog/overview composition; use as regression references.

## Contracts

See `docs/SPEC.md` §3–§5, `docs/FRONTEND.md` §4.1 and the Files list above.
No new domain APIs, dependencies or learner state. SPEC §5.3 updates only superseded visual details under the approved brief (continue mode).

## Task plan

F8–F10: the latest architect brief supersedes the previous headline, dial and natural desktop-scroll
decisions. Keep the lab paper/grid/light specimens and page-owned SVG scene. Center icon/copy as one
group, use explicit perspective/depth values with corresponding route anchors and projected shadows;
remove the dial's stacked metallic-looking rims. Use a height-bounded desktop map inside the existing
header/main/footer grid, with ordinary scrolling reserved for narrow/reflow accessibility states.
Fade the page field to zero before opaque chrome edges. Verify browser geometry and projected Z planes/attachment matrices,
screenshots, both links, no-JS and reduced motion, then LSP, focused tests and web Critical Gate.

F1/F2: adjust layout and page-owned SVG geometry first, then coordinated CSS motion; use existing
SvgDrawing/SvgPattern and element activity. Keep one textual map description; adaptive decoration
must not depend on hydration. F3: use SurfaceMaterial/SurfaceGlint and the existing paper recipes;
keep material clipping independent from artwork and keyboard focus. All composition stays page-owned,
with no shared API additions. F4/T1: use chrome-devtools/Playwright MCP, TypeScript LSP and focused
existing test coverage, then synchronize contracts. Done means readable complete static layouts,
no collisions/overflow/unjustified blank fields, and paused decorative effects outside their scene.

## Gate Checks

### Follow-up research — F5–F7

Current-page inspection found the old grid compounded low opacity (18–28% ink × 23% preset ×
edge fades) with a fixed sliced viewBox, while semantic patterns lived almost entirely in the
right-hand map. Satellite cards had near-identical dimensions/shadows and synchronized four-unit
motion, making their planes indistinguishable. The Python overview instead uses visible skewed
cell geometry, field placement in gutters, contact depth and slow independent light.

Use the incumbent paper/SVG world; retain fonts and publication truth. The enlarged cards carry
engravings below their text, with the connected near plane moving independently from background
notation. The foreground's meaningful 12-second sequence keeps quiet intervals while a separate
22-second edge light spans the page. Continuous layout-affecting animation is avoided, consistent
with [web.dev's rendering guidance](https://web.dev/articles/animations-guide); decorative motion
is absent under [the reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39).
React's current refs documentation was consulted through Context7 before code edits.

### Follow-up plan — F5–F7

The architect explicitly authorizes homepage composition/copy and illustrative progress changes.
Use the lab overview/catalog material specimens, existing SvgPattern.Grid/Preset, SvgDrawing and
elementActivity. Files: foundation slice, its geometry test and browser Page Object, visual docs.
First replace the weak cropped field with viewport-wide grid/pattern layers and edge-owned routes;
then compose a stronger editorial statement and a larger near-plane card constellation over the
existing learning sequence. Use bounded differential drift for parallax depth, attached animated
curves, internal engraving and a recessed illustrative progress dial. Finish with desktop/mobile
MCP screenshots, animation/static checks, LSP and the web Critical Gate. Done when the field is
visible on both sides, depth is legible without motion, cards have distinct layers, all reading
content and the real Python action remain clear, and no decoration expands the document canvas.

Critical Gate from [STACK](../STACK.md), web scope. The approved brief additionally requires the
focused browser geometry/motion scenarios above; no Full Gate or publication.

### Verification — 2026-09-08

| Check | Evidence |
|-------|----------|
| Format | `pnpm format:check` — PASS |
| Web lint / architecture | `pnpm --filter web lint` — PASS |
| Web types | `pnpm --filter web typecheck` — PASS |
| Focused tests | home-learning-map-geometry + topic-catalog: 9 PASS; element-activity: 2 PASS |
| LSP | foundation 18 files, topic-catalog 5 files and changed geometry test: no diagnostics. E2E-only Playwright declaration misresolution matches KNOWN_GOTCHAS; runtime verification below passes |
| Browser journeys | topic catalog navigation/geometry/no-JS and published-link journey + home reduced motion: 3 PASS on dev; complete public-root smoke: PASS against built server |
| Build / prerender | `VITE_UMAMI_WEBSITE_ID=e2e-website scripts/run-host-web-gate.sh pnpm --filter web build` — PASS |
| MCP inspection | desktop/mobile screenshot review of both changed routes; 320–1920px and structural transitions; 720px equivalent reflow for 200% desktop zoom; no overflow or intro/map overlap |
| Fallbacks / motion | no-JS and reduced motion: complete static content, zero running animations; failed topic artwork preserves descriptions/actions; offscreen pause/resume and simulated document-hidden event pass; timeline sampled at 0.5/2/3.5/5.5/9s confirms the approved sequence; completed topic glint stays finished on reentry |
| Reference comparison | `/courses` and `/courses/python` checked at 390/720/1440px; no horizontal overflow, same existing source composition |
| Impeccable | mechanical detector over both changed page slices: no findings |
| API regeneration | SKIPPED — no API/transport changes |
| Repository hygiene | `make clean-dry-run` reviewed, `make clean` and `make clean-check` — PASS |

The original dev-server root smoke hit `ERR_INSUFFICIENT_RESOURCES` during repeated navigations
on both the combined and isolated run. No assertions were suppressed: the unchanged root scenario
passed with the repository Playwright config's webServer replaced by the built Node server at
127.0.0.2:3100. Its temporary configuration/reports are removed after analysis. Visual acceptance
remains architect-owned; this evidence does not publish or approve the design.

### Follow-up verification — F5–F7, 2026-09-08

- `pnpm format:check`, `pnpm --filter web lint`, `pnpm --filter web typecheck`: PASS.
- Focused geometry and element-activity tests: 9 PASS. The obsolete unrendered ambient preset and
  its implementation-shaped test were retired. Wide/compact curve crossing and endpoint checks pass.
- Public-root smoke: PASS on the ordinary dev test server (20.3s), including desktop/mobile,
  reload, no-JS and unknown routes. Reduced-motion scenario: PASS (2.0s). The initial root run
  exposed an obsolete rectangular-progress width assertion; it now distinguishes the circular
  dial (48px minimum diameter) from text-bearing cards/stages (90px minimum width).
- Playwright and chrome-devtools MCP: desktop/mobile screenshots compared with the existing
  course reference; 320–1920px geometry matrix has no horizontal overflow, title overflow or
  intro/map overlap. Card captions retain at least 45 SVG units of right-side space.
- Real keyboard focus/Enter opens the published Python overview. No-JS retains all four cards,
  statement and action, with zero running animations. Reduced motion also has zero running
  animations. Offscreen and simulated hidden-document transitions pause all effects and resume
  them; distinct card lifts/delays are verified in computed styles. Browser console: no warnings/errors.
- TypeScript LSP: foundation source and geometry test clean. Foundation/topic-lesson E2E Page
  Objects have the documented isolated `@playwright/test` declaration misresolution; web tsc,
  typed lint and actual browser execution pass (KNOWN_GOTCHAS § TypeScript LSP).
- Impeccable detector: no findings. API regeneration and Full Gate/build skipped: no API or
  dependency/runtime configuration changes; affected frontend checks and focused browser checks pass.
- Repository hygiene: `make clean-dry-run` reviewed, `make clean` and `make clean-check`: PASS.
  Temporary execution scripts/logs removed after analysis.

### Corrected depth/material verification — F8–F11, 2026-09-08

At this checkpoint F11 defined the visual contract (subsequently superseded by F12): no perspective deformation, depth by
uniform scale/sharpness/shadows, distinct material motifs and perimeter progress. F8 tilt and the
previous internal grid treatment were superseded during this invocation.

- Final format, web lint/architecture and web typecheck: PASS. Geometry + element activity: 10 PASS,
  including centered near/far scale and all wide/compact connector intersection checks.
- Public-root smoke: PASS (14.3s); reduced-motion scenario: PASS (1.7s). The larger stage type
  exposed a tight title/check gap; the number/title group was recentered before the passing run.
  Enlarging the foreground card exposed a crossing with the truth-table branch; the branch's
  control points now clear it and the focused intersection test passes.
- MCP desktop/mobile screenshots: differentiated near/far scale and sharpness, four material
  motifs (arcs/dots/edge hatching/curves), larger centered icons, 40-unit stage numbers and 24-unit
  titles. Both keyboard entry links reach their published destinations; no-JS retains both.
- Desktop fit verified at 1024×600, 1280×600/720, 1366×768, 1440×480/900, 1536×864 and 1920×1080.
  Header, composition and footer remain in the viewport (at most one pixel browser rounding in
  the 480px emulated viewport). Narrow 320/390px layouts scroll naturally, without horizontal
  overflow or overlapping stage numbers/titles. Extreme-height/reflow states retain access to content.
- Perimeter geometry: arc centerline 62.25 + half-width 1.75 = the disc radius 64; no backing margin.
  Animated attachment errors sampled at 5.5 seconds are below 0.001 screen pixels. Offscreen pause,
  resumed activity, complete no-JS output and zero running reduced-motion animations verified.
- LSP: foundation 20 files and geometry test clean. E2E-only declaration resolution retains the
  documented `@playwright/test` limitation; typed lint, tsc and the actual browser scenario pass.
  Browser console has no warnings/errors. No new shared API or dependency; API regen/Full Gate/build
  skipped as in the preceding scoped invocation.
- Repository hygiene: `make clean-dry-run` reviewed, `make clean` and `make clean-check`: PASS.

### Material and typography refinement — F12, 2026-09-08

- Removed distance projection/blur and near/far shadow variants; connector anchors now use only
  card translation and planar rotation. Retained modest authored width/height differences.
- Replaced tasks border hatching with a small woven-loop motif. Cards, stages and the progress
  disc share deterministic fine fiber texture; the disc adds quiet arc engraving within its perimeter.
- Stage numerals are 72 SVG units and clipped to the rounded edge; titles are 28 units, with
  measured number/title gaps above 10 units. Both entry actions use standard drawn arrows and
  an «или» separator; short desktop layouts place them in one row to preserve viewport fit.
- Format, web lint/architecture and typecheck: PASS. Focused geometry/activity tests: 10 PASS.
  Public-root browser smoke and reduced-motion scenario: 2 PASS (33.7s), including mobile and no-JS.
  Foundation LSP: 20 files, zero diagnostics. MCP browser console: zero warnings/errors.
- MCP screenshots inspected at 1440×900, 1440×480 and narrow 320/390px layouts. Geometry checks
  at 1024×600, 1280×600 and 1920×1080 also pass: desktop intro clears footer, document fits the
  viewport, and mobile reflows without horizontal overflow. All four card planes are fully opaque
  and unfiltered; both links have the same arrow treatment and correct real destinations.
- Scope remains visual frontend only; API regeneration, build and Full Gate are not required.
- Repository hygiene: reviewed `make clean-dry-run`; `make clean` and `make clean-check` PASS.
  Temporary editing scripts removed after verification.

### Compact stages and single entry — F13, 2026-09-08

- Restored 40-unit numbers, 24-unit titles and centered 24-unit checks with 20 units of right
  padding. Removed numeral clipping and obsolete two-choice layout/copy.
- One standard drawn-arrow «Начать готовиться» action leads to `/ege`. Keyboard Enter verified
  the actual transition. Existing browser assertions now check this destination and restored spacing.
- Format, web lint/architecture, typecheck and foundation LSP (20 files): PASS. Public-root and
  reduced-motion browser scenarios: 2 PASS (33.7s), including mobile and no-JS coverage.
- MCP screenshots: 1440×900 and 390px; viewport fit also checked at 1440×480 and 1024×600.
  No horizontal overflow; compact numbers/checks stay within their stages. Browser console clean.
- No geometry, API or motion logic changed; geometry unit reruns, API generation and Full Gate
  are unnecessary for this correction.
- Repository hygiene: dry-run reviewed; `make clean` and `make clean-check` PASS.

### Satellite icon overflow — F14, 2026-09-08

- Satellite icons enlarged from 88 to 128 SVG units, centered vertically at x=-24. Their
  unclipped artwork crosses the left contour while reserving 24 units before the text column.
  Shared glyphs, card dimensions, stage checks and motion remain unchanged.
- MCP desktop/mobile screenshots inspected at 1440×900 and 390px: no cropped artwork, text
  overlap or horizontal overflow. Console has zero warnings/errors. Source LSP clean.
- Format, web lint/architecture and typecheck PASS. Existing public-root browser smoke PASS
  (14.3s), including mobile containment and no-JS output. No new tests needed for this bounded
  decorative adjustment; no API, geometry or motion logic changed.
- Cleanup dry-run reviewed; `make clean` and `make clean-check` PASS.

### Quiet compact satellite cards — F15, 2026-09-08

- The supplied `docs/artifacts/references/visual_schema.png` supersedes F14's overflowing icons.
  Restored contained 88-unit glyphs; reduced satellite surfaces to 282–290 × 108–116 units,
  with 12-unit left and icon/text spacing. Removed their drop-shadow resources, thickness and
  static highlight. Flat canvas fill and a quiet outline keep them subordinate to central stages.
- Updated wide attachment points from the new card dimensions and shortened the compact practice
  attachment. Central stages, progress, copy and glyph artwork remain unchanged.
- Format, web lint/architecture, typecheck and foundation LSP (20 files): PASS. Geometry: 8 PASS;
  public-root browser smoke: PASS (16.4s), including responsive composition and no-JS coverage.
- MCP screenshots inspected at 1440×900 and 390px. No text overlap or horizontal overflow;
  all four satellite surfaces report filter:none. Browser console: zero warnings/errors.
- API generation and Full Gate skipped: no API/runtime/dependency changes.
- Cleanup dry-run reviewed; `make clean` and `make clean-check` PASS.

### Stationary main route and simplified dial — F16–F17, 2026-09-08

- Removed the shared foreground translation/keyframes that moved central stages and their text.
  Satellite drift and attached branch deformation remain; background/light motion remains independent.
- Browser timeline samples at 0/3/6/9/12/18 seconds show exactly zero displacement for all central
  stages, titles, numbers and progress at 1440px and 390px. Satellites still move by 3–10 screen
  pixels in the desktop sample. Reduced-motion browser scenario PASS (1.5s).
- Dial caption removed; one centered orange 40-unit «72%» replaces the smaller two-line treatment.
  MCP close-up confirms the new value fits within the perimeter.

- F18 refinement: reduced fiber opacity from .16 to .07 and engraving opacity from .34/.24
  to .20/.14 for cards/stages. Removed the dial's texture circle and decorative arcs entirely;
  it retains only its clean paper disc, perimeter track/light and centered orange value.
- Final format, web lint/architecture and typecheck PASS; changed source LSP clean. Updated
  public-root smoke PASS (16.8s), including mobile and no-JS. Browser screenshot confirms the
  final treatment; console has zero warnings/errors. No new API or dependency changes.
- Cleanup dry-run reviewed; `make clean` and `make clean-check` PASS.

### F19 implementation plan (layout superseded by F20)

- Files: topic-catalog page, card, ambient field and CSS; retire its trail component; update
  the topic-catalog Page Object and FRONTEND/SPEC/PRODUCT descriptions.
- Reuse SurfaceMaterial, SurfaceGlint(frame), Image and ActionLink, as in the accepted courses
  surfaces and their `/lab/design-system` specimens. Keep all composition page-owned.
- Published cards span two grid rows with an approximately 2:1 image/content split. Number metadata
  sits on a small opaque paper label; titles/descriptions/actions occupy the lower content region.
  Planned cards retain their metadata and full summaries; no publication state or ordering changes.
- Verify wide/two-column/mobile composition and artwork share, text containment, real topic links,
  no-JS/reduced-motion/offscreen behavior with browser MCP and focused E2E; run LSP and web gate.

### Catalog refinement — F19–F21, 2026-09-08

- Final F20 layout preserves normal single-cell cards and the original 3/2/1-column order;
  the rejected two-row/two-column design is removed. Published media is a full-width 13rem upper
  region, with paper-backed number/title overlays and complete summary/action below. Across
  320–1440px, published cards are approximately 307–366px high, with artwork regions around
  57–68% of height; full readable copy takes precedence over an exact two-thirds ratio.
- All 25 cards receive very faint fine-grain texture plus alternating arc/dot/diagonal engraving.
  Removed the vertical orange trail component and animation. Eight distinct page-owned vector
  compositions follow the supplied binary/graph/logic/code references, without a repeating arc tile.
  Shared SvgPattern renders them; existing SurfaceMaterial/SurfaceGlint/Image/ActionLink own their
  mechanisms. Broad field illumination runs on a quiet 24-second cycle.
- Format, web lint/architecture and typecheck PASS. Topic source LSP: five files, zero diagnostics.
  Catalog E2E: 2 PASS (13.2s), covering desktop/mobile/no-JS, 25-topic availability/order, ordinary
  grid spans, image share/containment, full summaries, material layers and real topic navigation.
- MCP screenshots inspected for published topics and page field at desktop/mobile; responsive
  geometry sampled at 320/390/720/1024/1440px without horizontal overflow or clipped copy.
  Eight named background compositions are present. Reduced motion has zero running animations;
  published glints pause offscreen and retain one iteration. Browser console clean.
- No API/dependency/runtime changes; Full Gate/build and API regeneration are not required.

### Standard catalog cards — F22, 2026-09-08

- All 25 cards now share one component branch for media, number/title, full summary and bottom
  row. The 23 entries without artwork use a neutral CustomIcon.Book placeholder. Published cards
  keep real links and a one-time glint; planned cards retain a noninteractive «Скоро» badge.
- Equal fractional grid rows and a common 13rem media track align all card sizes, content starts
  and bottom rows. Heights adapt to the longest full description at each breakpoint rather than
  clipping content. Measured heights: 335px at 1024px, 354px at 1440/390px, 374px at 320px;
  each viewport has one consistent card height, with no clipped copy or horizontal overflow.
- Format, web lint/architecture, typecheck and source LSP (five files) PASS. Catalog E2E: 2 PASS
  (14.8s), including desktop/mobile/no-JS, equal dimensions/media/content offsets, 23 placeholders,
  availability and navigation. MCP desktop/mobile screenshots inspected; browser console clean.
- Cleanup dry-run reviewed; `make clean` and `make clean-check` PASS. Temporary editing scripts removed.

### Independent aligned card zones — F23, 2026-09-08

- Root cause: bottom-positioned title overlays grew upward with wrapping, obscuring different
  amounts of otherwise equal image regions. Titles now occupy a separate two-line slot below
  a shared 11rem artwork region; descriptions start below that slot. An elliptical alpha mask
  feathers artwork edges into the card, without fading metadata or copy.
- All-card MCP measurements at 320/390/720/1024/1440px: title top 184px and summary top 234px
  relative to every card, no horizontal overflow. Card heights remain equal within each viewport
  (349–388px according to available text width). Desktop/mobile screenshots inspected.
- Regression assertions now cover title/summary alignment and title completeness in addition
  to equal image/card sizes. Catalog browser journeys: 2 PASS (17.2s), including mobile/no-JS
  and real navigation. Format, lint/architecture, typecheck and source LSP (five files) PASS.
  Browser console clean. No API/dependency/runtime changes or Full Gate required.
- Cleanup dry-run reviewed; `make clean` and `make clean-check` PASS.

### Larger artwork with narrow feathering — F24, 2026-09-08

- Published artwork expands from 168 to 196 CSS pixels in height (about 17%), with bounded
  12px top and 8px side/bottom overflow. The card, media track, title and description positions
  remain unchanged. Broad elliptical fading is replaced by intersecting 8px edge gradients,
  retaining full interior contrast. Placeholder layout is unchanged.
- Desktop/mobile MCP screenshots confirm larger artwork and a clear title area; measured top
  overflow is under 12px and the artwork box ends at the title boundary, with its final 8px faded.
  Updated containment assertion allows this intentional overflow. Catalog E2E: 2 PASS (14.2s).
  Format, lint/architecture and typecheck PASS; browser console clean.
- E2E LSP retains the documented isolated `@playwright/test` export-resolution limitation;
  typed lint, project tsc and actual Playwright execution pass. No source TypeScript logic changed.
- Cleanup dry-run reviewed; `make clean` and `make clean-check` PASS.

### Literal two-thirds artwork — F25, 2026-09-08

- With architect approval, card descriptions are now concise page-local phrases and headings use
  the base type size. Full entity/publication descriptions remain intact outside this catalog.
  Uniform cards retain a 23rem minimum height and now use exact 2:1 media/content tracks; narrow
  edge fading and the previously accepted slight artwork overflow remain.
- Browser measurements at 320/390/720/1024/1440px: all 25 cards are 368px high and media occupies
  66.67%, with no clipped title/description or horizontal overflow. Desktop/mobile screenshots
  confirm significantly larger illustrations and unchanged shared text alignment.
- Ratio regression assertion tightened to 66–67%. Catalog E2E: 2 PASS (15.0s), including no-JS,
  mobile and real navigation. Format, lint/architecture, typecheck and source LSP (six files) PASS.
  Browser console clean. No API, publication-state or dependency changes.
- Cleanup dry-run reviewed; `make clean` and `make clean-check` PASS.

### Heading and description balance — F26, 2026-09-08

- Headings use 18px; full source summaries are restored and visually clamped to one line with
  ellipsis. Removed the superseded page-local short-copy map and tightened the content gap to zero.
- Browser verification at 320/390/720/1024/1440px confirms all 25 cards remain 368px high, with
  66.67% media, no clipped titles and no horizontal overflow. Desktop/mobile screenshots reviewed;
  browser console has no warnings or errors.
- Format, web lint/architecture and typecheck PASS; catalog E2E: 2 PASS (14.0s). Source LSP: five
  files, no diagnostics. The existing isolated E2E LSP resolution limitation remains unchanged.
- Cleanup dry-run reviewed; `make clean` and `make clean-check` PASS.

### Compact two-line descriptions — F27, 2026-09-08

- Preserve 18px headings and 14px full-source summaries; summaries now use 1.2 line-height and a
  two-line clamp. Bottom-align heading text within its shared slot to remove the apparent blank
  line between short headings and descriptions. Actions retain the FRONTEND 40px target floor.
- Browser measurements at 320/390/720/1024/1440px: uniform 368px cards, 66.67% artwork, zero
  heading/summary box gap, no clipped headings or horizontal overflow. Desktop/mobile screenshots
  reviewed; console clean. Format, lint/architecture and typecheck PASS.
- E2E LSP retains the documented Playwright export-resolution limitation; project typecheck passes.
  Updated the previous 44px action assertion to the binding 40px target floor.
- Catalog E2E: 2 PASS (13.3s). Cleanup dry-run reviewed; clean and clean-check PASS.

### Restore text spacing and move planned badges — F28, 2026-09-08

- Artwork now occupies 58% of the unchanged 23rem card; content uses 8px gaps/padding and
  1.4 summary line-height. Planned status moves beside the task label in the artwork metadata row.
  Shared title/description alignment and two-line ellipsis remain.
- Browser measurements at 320/390/720/1024/1440px confirm uniform 368px heights and 58% media,
  without horizontal overflow. Mobile text/action gaps meet 8px and headings fit. Desktop/mobile
  screenshots reviewed; browser console clean. Format, lint/architecture, typecheck and component
  LSP PASS. Catalog E2E: 2 PASS (13.8s), including status placement in the media area.
- Cleanup dry-run reviewed; clean and clean-check PASS.

### Matching metadata badges — F29, 2026-09-08

- Task and planned-status labels share one CSS rule for type, padding, background, radius and
  shadow; removed the separate outlined/heavier status treatment. Browser computed styles match
  across all 23 planned cards. Desktop/mobile screenshots reviewed; labels align and fit at 320px.
- Format, web lint/architecture and typecheck PASS; browser console clean. CSS-only refinement:
  no TypeScript/API changes or additional automated test suite required.
- Cleanup dry-run reviewed; clean and clean-check PASS.

### Image-first mini-course cards — F30, 2026-09-08

- Replaced the asymmetric catalog mosaic with equal two/one-column cards. All four existing
  illustrations occupy the upper 58% of a 26rem-minimum frame; metadata and hydrated progress
  use quiet labels above, while titles, two-line summaries and the real Python action stay below.
  Shared SurfaceMaterial now carries very faint grain and varied patterns; shared Image and
  SurfaceGlint retain asset-failure and activity/reduced-motion behavior.
- Browser measurements at 320/390/720/1024/1440px: all cards 416px high, 58% media, no clipped
  titles or horizontal overflow. Desktop/mobile screenshots reviewed; browser console clean.
  Catalog E2E: 3 PASS (15.2s), covering responsive/no-JS, stored progress, reduced motion and
  failed artwork. Source LSP: eight files, no diagnostics. E2E LSP retains the known isolated
  Playwright export-resolution limitation; runtime tests and project checks provide complementary evidence.
- Format, web lint/architecture and typecheck PASS. Cleanup dry-run reviewed; clean and clean-check PASS.

### Restore asymmetry and fill artwork regions — F31, 2026-09-08

- F31 supersedes F30's equal desktop grid: restore Python across seven columns/two rows, two
  five-column cards on the right and a full-width closing card with 60% media on the right.
  Medium and narrow layouts retain the original responsive ordering. Existing artwork now uses
  cover cropping to fill its region, with bounded 16px top/8px side overflow and narrow edge fade.
  Quiet textures and separate copy/action regions remain.
- Browser screenshots and measurements at 320/390/720/1024/1440px show no clipped titles or
  horizontal overflow. Catalog E2E: 3 PASS (14.5s), including restored mosaic geometry, artwork/copy
  separation, no-JS/progress, reduced motion and failed images. Source LSP: eight files clean.
- Format, lint/architecture, typecheck and browser console PASS. Cleanup dry-run reviewed;
  clean and clean-check PASS.

### Restrained silver material and original patterns — F32, 2026-09-08

- Strengthened grain from 4% to 7% and varied patterns from 4.5% to 6.5%; restored three original
  corner arcs with alternating placement. All materials receive a low-contrast neutral-silver
  gradient and a four-second, once-only shared soft glint, activity-gated behind artwork and text.
  Python retains its separate frame glint; planned cards gain no interactive affordance.
- Desktop/mobile screenshots reviewed; console clean. Format, lint/architecture, typecheck and
  source LSP (eight files) PASS. Catalog E2E: 3 PASS (17.2s), now checking all shared glints for
  bounded duration and reduced motion. Layout and image regions remain unchanged.
- Cleanup dry-run reviewed; clean and clean-check PASS.

### Excel edge, headings and quieter background — F33, 2026-09-08

- Excel keeps side/bottom fading but has no top alpha fade. Card titles increase from 18px to
  20px. Upper staircase opacity drops to 25% (20% narrow) with downward fading; removed the
  central and right orange path segments and their two central nodes, retaining only the lower route.
- Desktop/mobile screenshots and five widths (320–1440px) checked: no clipped headings or
  horizontal overflow; console clean. Format, web lint/architecture, typecheck and source LSP
  (eight files) PASS. Catalog E2E: 3 PASS (15.2s).
- Cleanup dry-run reviewed; clean and clean-check PASS.

### 32px course headings — F34, 2026-09-08

- Added a page-private 32px heading token. Natural title wrapping takes space from the flexible
  artwork track; the wide closing card gives text 45% instead of 40%. Asymmetric frames, material
  and spacing remain. Five browser widths (320–1440px) show 32px titles without clipping or
  horizontal overflow; media still occupies at least 49% of card area in measured layouts.
- Desktop/mobile screenshots reviewed; console clean. Format, lint/architecture and typecheck
  PASS; catalog E2E: 3 PASS (20.5s). Production changes are CSS-only.
- Cleanup dry-run reviewed; clean and clean-check PASS.

### Prepared transparent Excel and sorting artwork — F35, 2026-09-08

- Replaced Excel/algorithms WebP assets from the architect's excel_from_scratch.png and
  sorting-array-transparent.png. Retained original 1536×1024 dimensions and verified exact alpha
  equality after WebP encoding (quality 92, alpha quality 100). Original PNG sources are untouched.
  These two images bypass paper-removal filtering and keep the existing planned saturation.
- Both assets load in browser; desktop/mobile screenshots reviewed and console clean. Format,
  lint/architecture and typecheck PASS. No TypeScript or behavior changes; no extra test suite.
- Cleanup dry-run reviewed; clean and clean-check PASS.

### Complete Excel artwork — F36, 2026-09-08

- Excel now uses contain in both shared Image props and page CSS, with no alpha edge mask.
  The previous cover crop removed the top despite the transparent source being complete.
  All artwork fits inside its reserved region; card dimensions remain unchanged.
- Desktop/mobile screenshots verify the complete illustration, including its upper arrow.
  Computed fit is contain and mask is none; browser console clean. Format, lint/architecture,
  typecheck and changed-component LSP PASS.
- Cleanup dry-run reviewed; clean and clean-check PASS.

### Full-width uncropped Excel canvas — F37, 2026-09-08

- F37 supersedes F36's shrinking contain box: the Excel canvas has full media width and intrinsic
  3:2 aspect ratio, anchored at the media bottom. Desktop allows necessary upward overflow;
  medium/mobile reserve its full height to avoid overlapping preceding cards.
- Five widths (320–1440px) confirm full-width 3:2 artwork without horizontal overflow or collisions
  with card titles, summaries and links. Desktop/tablet screenshots reviewed; console clean.
  Format, lint/architecture and typecheck PASS; catalog E2E: 3 PASS (15.1s). CSS-only change.
- Cleanup dry-run reviewed; clean and clean-check PASS.

### Swap Excel into the wide closing card — F38, 2026-09-08

- Catalog DOM and visual order now match: Python, advanced problems, algorithms, Excel. Advanced
  problems takes the upper-right compact slot; Excel takes the full-width 24rem-minimum closing
  frame with 55% media. Removed the special oversized Excel canvas and restored shared 8px
  overflow/fading, using top-aligned cover sizing to preserve its upper arrow on desktop.
- Five widths (320–1440px) confirm correct order, no clipped headings or horizontal overflow.
  Desktop/mobile screenshots reviewed; browser console clean. Catalog E2E: 3 PASS (15.6s),
  including new mosaic positions. Both changed source TypeScript files pass LSP.
- Format, lint/architecture and typecheck PASS. Cleanup dry-run reviewed; clean and clean-check PASS.

### Left-aligned Excel details — F39, 2026-09-08

- Excel engraving and dots now concentrate at the left. Metadata anchors to the card frame so
  its badge shares the 24px left inset with copy. Desktop copy starts 64px below the card top,
  rather than vertically centered; mobile retains the image-above-text layout.
- Desktop/mobile screenshots reviewed; final desktop geometry confirms aligned badge/title left
  edges and 22px clearance below the badge. Console, format, lint/architecture, typecheck and
  component LSP PASS. Catalog E2E: 3 PASS (14.9s).
- Cleanup dry-run reviewed; clean and clean-check PASS.

### Final audit and local Critical Gate — F40, 2026-09-08

- Fixed manual class concatenation to use the existing `cssUtils.cx` contract, removed unused
  illustration positioning data, and corrected the current progress placement in FRONTEND.
- Synchronized the stale unit expectation (2 media/footer regions) with the accepted 25-card
  template and 23 placeholders. The first final browser run exposed a one-shot computed-style
  assertion during client navigation; it now polls the same expected canvas color. Added an
  explicit async import callback type to the router mock so isolated TypeScript LSP analysis is clean.
- Fallow graph review: four anchored judgments accepted, zero rejected, snapshot current.
  No introduced unused exports, dependency cycles or layer-boundary violations. Its advisory
  audit remains non-green for complexity/duplication heuristics: finite SVG preset construction
  and geometry assertions were reviewed; page-owned masks/material recipes intentionally remain
  local (FRONTEND keeps responsive masking in its consumer). Reported dead keyframes have live
  CSS animation references. No suppression or threshold changes were introduced.
- Format, web lint (including design-system/application/E2E/layer policies), web typecheck:
  PASS. Focused geometry, topic catalog, course foundation and element activity: 28 tests PASS.
  The topic test was rerun after its type-only correction: PASS.
- TypeScript LSP: foundation 20 files, topic catalog 5, course catalog 8, course metadata and
  both changed unit tests: clean. Known isolated Playwright declaration limitations remain
  complementary to typed ESLint and passing browser execution, as documented in KNOWN_GOTCHAS.
- Focused Playwright: 7 PASS, covering homepage navigation/composition/static and reduced motion,
  topic catalog/lesson navigation, mini-course responsive mosaic/progress/no-JS, reduced motion
  and failed artwork. Expected synthetic error telemetry from root smoke is test input.
  MCP screenshot review of the final course mosaic and browser warning/error console: clean.
- API regeneration, backend/shell checks: SKIPPED (no API/backend/shell changes).
  Full/build/release/security/infra suites: SKIPPED (default local Critical Gate, no release).
- Repository hygiene: reviewed `make clean-dry-run`, then `make clean` and `make clean-check`: PASS.
- Architect approved the final visual result in chat. No unresolved Backlog or Review Notes.
  Local ship only; user reference originals and unrelated untracked notes remain outside the commit.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- F12 supersedes the F11 distance model: no card blur or distance scaling. Authored dimensions
  provide modest size variation; original planar rotations and coordinated drift remain. F13 restores
  compact fully contained numerals and centered checks, and supersedes the two-entry layout with
  a single «Начать готовиться» link to `/ege`.


## Commit Message

```
feat(change-104): unify home and catalog composition and motion
```
