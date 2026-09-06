# CHANGE 95 — infraege identity and home redesign

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `95` |
| Slug | `infraege-home-redesign` |
| Title | infraege identity and home redesign |
| Status | `archived` |
| Branch | `feature/95-infraege-home-redesign` |

---

## Goal

Restore the public `infraege` identity and three-stone mark, then make `/` the first reference-led
surface of the renewed visual system. Preserve the approved Alegreya/Golos Text/JetBrains Mono
typography, published content and application behavior while replacing the ALCHIMIA public brand.

---

## Backlog

### Frontend

- [x] `F1` Draw and visually validate the new transparent three-stone master SVG from
  `docs/artifacts/references/base.jpg`: orange top stone, two charcoal stones, no text, canvas or
  baseline; prove the same geometry at 512/48/32/16 px before generating derivatives — _Depends on:_ —
- [x] `F2` Rework the deterministic brand generator and focused asset tests around the approved
  infraege master; generate the SVG/PNG/ICO favicon set, Apple/manifest icons and 1200×630 social
  lockup, then remove superseded ALCHIMIA public derivatives only after all consumers move — _Depends on:_ F1
- [x] `F3` Restore `infraege` across shared public identity, route metadata, manifest and WebSite
  JSON-LD while preserving technical domain/storage/analytics/infrastructure names; keep the
  compact internal-page header and add the reference-led home header with one real Python-course
  link plus visibly labelled inert future destinations — _Depends on:_ F2
- [x] `F4` Add the reference palette through the existing theme-to-semantic boundary without
  changing font files or typography roles; scope warm canvas and orange composition to the home
  surface so internal page composition and controls stay unchanged — _Depends on:_ F3
- [x] `F5` Replace the current registry catalog on `/` with the approved single-hero composition:
  real Python-course CTA, left product statement and honest demo social proof, plus a noninteractive
  accessible learning-path diagram built from crisp local SVG/CSS geometry — _Depends on:_ F4
- [x] `F6` Complete responsive, zoom, keyboard, SSR/no-JS, reduced-motion and contrast behavior;
  update the fixture-owned Playwright journey and focused component/contracts, inspect desktop and
  390px screenshots with a clean console, and run the affected Critical Gate — _Depends on:_ F5
- [x] `F7` Refine the expanded home identity lockup: use the wordmark display face for its subtitle,
  add the three-part benefit line with orange separators and replace the tall hairline divider with
  the shorter reference-led separator while preserving compact internal identity — _Depends on:_ F6
- [x] `F8` Remove every visible «скоро» label and the home account placeholders; retain only the real
  mini-course link while unavailable home sections remain noninteractive, secondary and visibly
  disabled in desktop and native mobile navigation — _Depends on:_ F7
- [x] `F9` Restore the reference hero hierarchy with one display face for the statement and lead,
  a substantially larger desktop scale and a custom drawn underline/arrow CTA; remove the complete
  social-proof block and its demonstration claim — _Depends on:_ F8
- [x] `F10` Rebuild the decorative desktop learning map as one coherent reference-proportioned SVG:
  hand-drawn icons and paths, faded code/formula/graph fragments, rotated paper slips, central stages
  and the architect-approved literal «72% курса» illustration — _Depends on:_ F9
- [x] `F11` Preserve the accessible textual map summary and implement the approved narrow-screen
  linear stage path; verify disabled semantics, focus, reduced motion, increased contrast, 150% zoom,
  390px layout and no horizontal overflow — _Depends on:_ F10
- [x] `F12` Update focused unit/E2E contracts, inspect desktop/mobile rendering and console through
  required browser tooling, run one Impeccable detector pass and the affected Critical Gate — _Depends on:_ F11
- [x] `F13` Correct the expanded home lockup and hero typography: keep Alegreya only for the
  wordmark and statement, use Golos Text for subtitle, benefits and lead, soften the brand divider,
  and render the statement with the architect-requested ASCII hyphen — _Depends on:_ F12
- [x] `F14` Replace the CTA's uniform SVG strokes with authored tapered and fading underline/arrow
  geometry while preserving its real link, focus treatment, hover intent and reduced-motion
  behavior — _Depends on:_ F13
- [x] `F15` Recompose the four desktop map cards and their icons, proportions, rotations, type,
  border and paper depth to match the approved reference more closely — _Depends on:_ F14
- [x] `F16` Redraw the desktop map's main and branch trajectories with individual organic curves,
  irregular dash rhythms, tapered/fading endpoints and non-mechanical arrowheads while retaining
  the accepted faded background notation — _Depends on:_ F15
- [x] `F17` Make the complete desktop map respond to both available column width and viewport
  height, with explicit wide, compact-desktop, stacked and narrow linear modes and no transform-
  scale layout residue or horizontal overflow — _Depends on:_ F16
- [x] `F18` Update focused unit/E2E contracts and verify reference, compact/short desktop, 150%
  zoom and 390px rendering with required browser tooling, clean console, LSP diagnostics, one
  final Impeccable detector pass and the affected Critical Gate — _Depends on:_ F17
- [x] `F19` Prototype one existing desktop trajectory as a controlled A/B comparison: preserve one
  authored SVG geometry and add the same line with a small monochrome raster dry-ink mask; keep
  composition, cards and responsive map sizing unchanged, then capture both variants at 1628×967,
  1366×768 and 150% zoom for architect selection — _Depends on:_ F18
- [x] `F20` Remove the architect-rejected raster trajectory treatment and extract a small
  domain-agnostic `SvgDrawing` component family for fading paths, authored tapered outlines and
  composed arrows; migrate only the home CTA and desktop/mobile learning-map trajectories while
  keeping scene geometry and responsive composition page-owned — _Depends on:_ F19
- [x] `F21` Extract a small domain-agnostic `SvgPattern` component family for declarative authored
  background marks with reusable hand-drawn variation and directional fade; migrate only the home
  learning-map background patterns while keeping formula/icon geometry and responsive scene
  composition page-owned — _Depends on:_ F20
- [x] `F22` Extract the four approved card symbols from
  `docs/artifacts/references/recraft-vectorize-477c595e.svg` into a small domain-agnostic custom SVG
  icon boundary, migrate the home theory/practice/tasks/statistics cards to it, and refine those
  decorative paper surfaces with restrained border depth, highlight and responsive fidelity —
  _Depends on:_ F21
- [x] `F23` Polish the remaining home learning-map system as one coherent authored composition:
  audit every trajectory endpoint against its connected stage/card, correct branch and main-line
  geometry, enrich line/arrow/pattern depth without raster texture, and refine the theory,
  practice, tasks and illustrative 72% stage surfaces with restrained gradients, highlights and
  responsive fidelity — _Depends on:_ F22
- [x] `F24` Recalibrate the learning map against the approved visual-schema crop: remove the
  active-stage background tint and trajectory echo strokes, use the bright reference orange for
  decorative labels and paths, make every branch fade only from its origin, restore the larger
  step-number hierarchy and safe practice/check spacing, and simplify graph/recursion patterns
  into quiet broken fading marks — _Depends on:_ F23
- [x] `F25` Increase the right-side breathing room in the theory/practice stages and all four
  satellite cards, while strengthening the 01/02/03 number hierarchy without changing the map's
  copy, typography roles or responsive composition — _Depends on:_ F24
- [x] `F26` Remove every connector from the home learning-map composition, spread its cards and
  stages into a calmer edge-to-edge field, and replace the weak recursion/graph background marks
  with reusable declarative SVG presets derived from the approved binary, graph and logic pattern
  references; keep raster assets out of the runtime and migrate only the home page — _Depends on:_ F25
- [x] `F27` Enlarge and left-expand the complete home learning-map composition while preserving its
  two-axis desktop fit, increase the separation between the central stages and all four satellite
  cards, add only quiet supporting notation where it closes real visual gaps, and replace the
  narrow four-stage substitute with the same complete SVG scene scaled to fit mobile without
  clipping or horizontal overflow — _Depends on:_ F26
- [x] `F28` Push the practice and tasks satellite cards farther toward opposite canvas edges, give
  every notation preset a restrained authored rotation, and make the stacked intermediate layout
  switch from desktop viewport-height fitting to available-width fitting so the complete scene
  avoids unnecessary side gutters without introducing a duplicate tablet composition — _Depends on:_ F27
- [x] `F29` Eliminate root-page horizontal overflow and the exposed white canvas across fluid resize,
  zoom and breakpoint transitions by containing decorative SVG/filter overflow inside the home
  visual boundary and replacing viewport-width bleed math with parent-bounded sizing; do not hide
  unrelated layout defects through a global document overflow rule — _Depends on:_ F28
- [x] `F30` Recompose the desktop learning-map field into a wider asymmetric constellation: enlarge
  the satellite cards slightly, push left/right cards and notation toward the usable scene edges,
  vary their vertical rhythm and rotations, and tighten the central cluster only enough to remove
  dead zones while keeping every element visible and the map connector-free — _Depends on:_ F29
- [x] `F31` Review the complete Change 95 frontend diff, remove only proven-unused prototype code,
  runtime assets and generated evidence, and retain every source reference still needed to explain
  or reproduce the accepted infraege identity and home composition — _Depends on:_ T11
- [x] `F32` Restore the homepage display-heading cascade after audit cleanup: keep a semantic local
  class while giving it enough specificity to override the shared Typography title default at all
  responsive sizes — _Depends on:_ F31

### Backend

None

### Infra

None

### Data

None

### Other

- [x] `T1` Replace current public-brand/design contracts in `docs/SPEC.md`, `PRODUCT.md`,
  `docs/FRONTEND.md` and `docs/BRAND_ASSET_REQUIREMENTS.md`; retain archived ALCHIMIA history and
  record `/lab/design-system` as a historical checkpoint pending a separate migration — _Depends on:_ F6
- [x] `T2` Reconcile the public-home contracts with the first correction pass: no «скоро» or social
  proof, expanded lockup, restored hero hierarchy, illustrative literal progress and a narrow
  border-plus-shadow exception for the map's decorative paper slips — _Depends on:_ F12
- [x] `T3` Reconcile `PRODUCT.md`, `docs/SPEC.md` and `docs/FRONTEND.md` with the corrected mixed
  typography roles, subtle separator, tapered SVG linework and two-axis desktop-map fit — _Depends on:_ F18
- [x] `T4` Record the raster-mask trajectory as a bounded A/B prototype rather than an adopted
  design-system direction; keep the authored SVG variant as the documented fallback until the
  architect selects one — _Depends on:_ F19
- [x] `T5` Reconcile the product and frontend contracts with the rejected raster experiment and
  the incremental authored-SVG primitive boundary; retain the rejection rationale without shipping
  the temporary runtime asset or A/B evidence — _Depends on:_ F20
- [x] `T6` Document the incremental shared background-pattern boundary and the home-only migration;
  keep future pattern variants and adoption on other pages outside this change — _Depends on:_ F21
- [x] `T7` Document the shared custom-icon ownership contract and keep card composition, copy,
  geometry and visual treatment page-owned; migrate only the home learning-map cards in this
  change — _Depends on:_ F22
- [x] `T8` Reconcile the product and frontend contracts with the connector-free interim map and
  reusable declarative pattern preset boundary, while keeping future semantic trajectories outside
  the current iteration — _Depends on:_ F26
- [x] `T9` Reconcile the product and frontend contracts with one complete responsive learning-map
  scene across desktop and mobile, preserving every satellite card and background preset while
  keeping scene geometry page-owned — _Depends on:_ F27
- [x] `T10` Document the content-driven learning-map sizing modes: two-axis fitting in the desktop
  split and width-led fitting after the composition stacks, with the same scene and page-owned
  geometry in both modes — _Depends on:_ F28
- [x] `T11` Reconcile the home visual contract with strict parent-bounded overflow containment and
  the wider asymmetric desktop constellation while retaining the complete-scene mobile contract —
  _Depends on:_ F30
- [x] `T12` Record the accepted stable-result boundary, review findings and any residual risks in
  concise Implementation Notes after the affected frontend gate passes — _Depends on:_ F32

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/SPEC.md
PRODUCT.md
docs/FRONTEND.md
docs/BRAND_ASSET_REQUIREMENTS.md
docs/artifacts/references/base.jpg
docs/artifacts/references/main-page.png
docs/artifacts/references/infraege-mark.svg
docs/artifacts/references/visual_schema.png
docs/artifacts/references/recraft-vectorize-477c595e.svg
docs/artifacts/references/exec-51732868-6ea7-4bbe-a873-6c5603023eed.png
docs/artifacts/references/exec-5b753307-dbb0-4586-9e36-80f4fec62c00.png
docs/artifacts/references/exec-615bde2c-6f44-4595-86d0-7ac3d4fc1359.png
docs/artifacts/references/exec-80200717-77ac-48ee-a2ba-634ac917a479.png
scripts/generate-brand-assets.mjs
apps/web/public/**
apps/web/src/app/styles/**
apps/web/src/shared/components/svg-drawing/**
apps/web/src/shared/components/svg-pattern/**
apps/web/src/shared/components/custom-icon/**
apps/web/src/shared/config/site.ts
apps/web/src/widgets/public-header/**
apps/web/src/pages/foundation/**
apps/web/src/routes/**
apps/web/tests/**
apps/web/e2e/**
~~~

### Do NOT touch

- Auth/backend/API/database, consent, analytics, operations, infrastructure or deployment behavior
- Published Topic/CourseLesson copy, tasks, ids, ordering, progress or storage semantics
- Alegreya/Golos Text/JetBrains Mono font files, role assignments or loading behavior
- Internal lesson/course/privacy page composition beyond the shared identity swap
- Archived change files or a full `/lab/design-system` redesign
- New dependencies, runtime theme switching or fabricated production claims

---

## Contracts

See `docs/SPEC.md` §5 and §9, `docs/FRONTEND.md` §4–§6 and the Files list above.

---

## Gate Checks

Use the affected frontend Critical Gate. F1 requires architect-visible 512/48/32/16 px mark
evidence before derivative generation. F6 additionally requires Playwright/chrome-devtools desktop,
150% zoom, 390px and no-JS evidence plus one Impeccable detector pass. Automated green does not
replace final visual approval.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Reference orange `#FF6A00` remains the mark and decorative-path color; small accent text,
  functional underlines and focus rings use contrast-safe `#B84400` over the warm canvas.
- The F19 raster-mask comparison was reviewed and rejected. F20 removes its runtime asset and A/B
  evidence, keeps authored scene geometry page-local, and limits the first shared SVG boundary to
  fading lines, authored tapered outlines and composed arrows rather than a general scene engine.
- F21 deliberately keeps hand-drawn variation deterministic: shared pattern fields own fade masks
  and stroke composition, while each consumer authors its own primary and echo contours instead of
  relying on procedural jitter or texture filters.
- F22 preserves the four selected reference contours as authored path data but replaces literal
  source fills with semantic `currentColor` plus paper/accent hooks. The combined source SVG remains
  design evidence only; card copy, placement, surface gradients and responsive composition stay
  page-local.
- F23 keeps scene coordinates in one page-local geometry module, including computed edge anchors
  for rotated cards. The later connector-free direction removed the temporary connection metadata;
  browser assertions now protect the final card/stage spacing and complete-scene responsive fit.
- The stabilization audit found no unused files, exports, types, dependencies, cycles, boundary
  violations or complexity findings. Cleanup removed duplicated stage markup and centralized SVG
  resource ids plus fade-gradient rendering; the remaining authored reference files are retained as
  reproducible design evidence, not runtime payload.
- Fallow's public-contract review was resolved without caller migration: `PublicHeader.home` and
  the BrowserSession viewport helpers are additive, while `siteConfig`, route metadata and E2E
  identity assertions retain their existing shapes and change only infraege-owned values.
- The home page contains decorative SVG/filter bleed locally, moves the split-layout breakpoint
  before fixed column minima can overflow, and uses the same complete scene at every width. No
  global document overflow rule masks unrelated layout defects.

---

## Commit Message

```text
feat(change-95): restore infraege identity and redesign home
```
