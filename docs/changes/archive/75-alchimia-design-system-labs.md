# CHANGE 75 — ALCHIMIA Design System Lab

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `75` |
| Slug | `alchimia-design-system-labs` |
| Title | ALCHIMIA Design System Lab |
| Status | `archived` |
| Branch | `feature/75-alchimia-design-system-labs` |

---

## Goal

Develop the ALCHIMIA visual direction only on `/lab/design-system`, through small dependent
increments that the architect reviews one at a time. Do not change `/lab/lesson`, public identity,
authored lessons or shared production presentation while the visual foundation is unsettled.
F26's explicitly approved long-CodeBlock disclosure is the sole shared production-presentation
exception.

---

## Design References

The files in `docs/artifacts/references/` are visual input, not permission to reproduce every
element at once.

- `logo_with_transperant_bg.svg` — sole artistic authority for the ALCHIMIA mark; the filename is
  preserved as supplied by the architect.
- `design_system.png` — composition, light parchment palette and serif display direction.
- `lesson_structure.png` — reference for future learning composition, outside the current route.
- `icons.png` — thin-line icon direction for a later isolated increment.
- `patterns_lines.png` — historical visual input retained in documentation; the active lab does
  not render it or keep an application-local copy.

---

## Execution Protocol

- Invoke `/work 75 F[N]` with one explicit item. Do not use an unscoped `/work 75`.
- Complete at most one unchecked frontend item per iteration.
- Show desktop evidence for that item, then stop for architect review. Change 75 does not define
  or gate a mobile dashboard shell; narrow component frames may still be used inside specimens.
- Start the next item only after the architect accepts the current one.
- Rejection means revise or revert that item; it does not authorize work on its dependants.
- Keep ALCHIMIA consumers isolated to `/lab/design-system`. The reusable header, self-hosted font
  files and inactive candidate theme/token roles may live at their enforced architecture
  boundaries, but public components and existing production roles remain unchanged.
- F26 may add inert component-level CSS aliases with public-preserving fallbacks and activate the
  approved long-CodeBlock disclosure globally; no other F26 candidate styling reaches public
  consumers.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Close the rejected hero-scale identity experiment as superseded by F11. Preserve its
  source-fidelity decision—the transparent SVG remains authoritative and obsolete `logo.svg` stays
  removed—but do not restore the large mark-above-wordmark composition — _Depends on:_ T1, T2
- [x] `F2` Apply the architect-selected Athanor typography across `/lab/design-system`:
  self-hosted Cormorant SC for display headings, Literata for reading, and IBM Plex Mono only for
  code, data and service UI. Use one achromatic primary and one achromatic secondary text role, preserve the
  accepted compact header and do not restyle public consumers — _Depends on:_ F11
- [x] `F3` Consolidate the current monochrome roles without changing the accepted page background:
  keep ink, secondary text and structural rules neutral, leave copper inactive, and verify contrast
  without adding decorative prose colors; fulfilled by the corrective F13 implementation — _Depends on:_ F13
- [x] `F4` Demonstrate three spacing levels—content flow, concept separation and major-section
  separation—using a small neutral specimen within the lab — _Depends on:_ F3, F14
- [x] `F5` Define and demonstrate the lab's surfaces, borders and section separators without
  adding ornamental imagery — _Depends on:_ F4
- [x] `F6` Introduce one restrained page-local geometric ornament vocabulary derived from the
  references; it must be decorative, `aria-hidden` and removable without information loss —
  _Depends on:_ F5
- [x] `F7` Restyle the lab's existing control and state specimens using only the accepted
  typography, color, spacing, surface and ornament decisions — _Depends on:_ F6
- [x] `F8` Assemble the accepted pieces into one representative learning-content specimen inside
  `/lab/design-system`; do not change or imitate `/lab/lesson` — _Depends on:_ F20
- [x] `F9` Perform the final route-local desktop, zoom, keyboard, no-JavaScript, overflow and
  accessibility pass without promoting the system to shared or public consumers — _Depends on:_ F8
- [x] `F11` Revise the pending identity experiment as a compact production-shaped
  `AlchimiaHeader` widget: derive its brand typography from Athanor, reduce the mark and wordmark,
  and make `/lab/design-system` its only consumer. Keep the existing `PublicHeader` and every
  public route unchanged until a later activation change — _Depends on:_ T1, T2
- [x] `F12` Close the rejected Foundation/Interface/Learning/Flow taxonomy as superseded by F14;
  retain only its proven controlled-tabs and linear SSR/no-JavaScript mechanics — _Depends on:_ F2, F13
- [x] `F13` Remove the unintended Athanor color inheritance from `/lab/design-system`: restore the
  original white background, convert ink, secondary text and rules to achromatic values, remove the
  copper specimen and copper interaction states, and preserve the Athanor-derived font roles. Do
  not change public consumers — _Depends on:_ F2
- [x] `F14` Recompose `/lab/design-system` as a desktop-only architecture-led catalog with three
  peer views—System, Components and Widgets—plus a sticky in-view table of contents. System owns
  app-wide identity, typography, palette, tokens, icons and patterns; Components groups public
  visual contracts from shared/entities/features by meaning; Widgets demonstrates the public
  widget layer and representative assemblies. Preserve white monochrome, the accepted header,
  keyboard tabs and linear SSR/no-JavaScript output; do not activate context-bound side effects or
  change public consumers — _Depends on:_ F2, F3, F11
- [x] `F15` Replace the improvised F6–F7 dots, dividers, corner marks and geometric patterns with
  the source-faithful fading, hand-drawn ornamental vocabulary from the architect-updated
  transparent `patterns_lines.png`. Audit the whole lab for incompatible decorative geometry;
  keep the approved source route-local, `aria-hidden` and removable without information loss —
  _Depends on:_ F7
- [x] `F16` Audit every visible line, frame, divider and decorative geometric element in
  `/lab/design-system`, then replace the remaining mechanically uniform lab-local linework with a
  coherent fading and lightly hand-drawn treatment derived from `patterns_lines.png`. Preserve
  clear interactive affordances, semantic status colors, accessibility and public consumers —
  _Depends on:_ F15
- [x] `F17` Correct the excessive F16 application: reserve the reference atlas for fading
  horizontal and vertical section dividers only, and restore standard one-pixel borders for
  frames, diagram internals, swatches, widget canvases and interactive tab indicators. Reduce the
  patterns specimen to that accepted divider vocabulary while preserving accessibility, layout
  and public consumers — _Depends on:_ F16
- [x] `F18` Remove the remaining decorative atlas lines above and below the primary dashboard
  tablist. Tabs must use only their standard active indicator; keep fading dividers elsewhere in
  the page composition unchanged — _Depends on:_ F17
- [x] `F19` Remove every remaining atlas-derived element from the active `/lab/design-system` UI
  and restore the preceding standard neutral borders and dividers for the header, catalog
  navigation, identity, surfaces, contract rows and control specimens. Remove the unused lab-local
  atlas copy and crop component, retain the architect-owned reference only in documentation, and
  verify that catalog navigation no longer creates either scrollbar — _Depends on:_ F18
- [x] `F20` Refine the active design-system catalog in one route-local iteration: remove the intro
  section and its page title entirely; compose core and tonal colors as two clearly separated
  groups on one desktop row; apply every listed semantic and spacing CSS variable to a visible
  specimen; and replace the textual icon inventory with the twelve Lucide components currently
  imported by `apps/web/src`, each paired with a visible label. Preserve SSR/no-JavaScript output,
  monochrome ALCHIMIA styling, reduced motion, zoom behavior and public consumers — _Depends on:_
  F19
- [x] `F21` Complete the System catalog foundation in one route-local iteration: add visual layout
  and responsive rules; demonstrate accessibility and browser-level states; reorganize the token
  catalog into an explicit theme-to-semantic-to-component map with live previews for the relevant
  app-wide roles; and add a compact content-language specimen based on the approved calm,
  step-by-step Russian learning-copy contract. Keep component and widget demonstrations in their
  owning tabs, preserve SSR/no-JavaScript output, monochrome ALCHIMIA styling and public consumers,
  and do not implement the postponed representative lesson specimen — _Depends on:_ F20
- [x] `F22` Close the pre-checkpoint audit findings in one route-local cleanup: repair the verified
  dead selector on the wide layout specimen, remove obsolete CSS contracts left by superseded lab
  compositions, disambiguate the dashboard tab definition from its CSS-module class, and replace
  the branch-heavy semantic-token preview renderer with a typed declarative preview map. Preserve
  the accepted rendering, public consumers and Change 75 boundaries; rerun the affected Critical
  Gate and focused browser evidence before the intermediate commit — _Depends on:_ F21
- [x] `F23` Complete the Components catalog in one route-local iteration: reconcile its inventory
  with the actual public barrels from `shared/components`, `entities` and `features`; give every
  safe standalone contract a visible specimen with its meaningful states; and identify
  context-bound contracts without activating consent, storage, network or scroll side effects.
  Remove stale or misclassified names, keep the existing domain-based groups, and preserve
  monochrome styling, SSR/no-JavaScript output, public consumers, the Widgets boundary and the
  postponed representative lesson specimen — _Depends on:_ F22
- [x] `F24` Close the Components catalog audit in one route-local iteration: eliminate duplicate
  DOM ids between the standalone practice specimen and the Widgets flow; repair its theory
  fragment; demonstrate the meaningful LessonProgress states and secure deterministic
  LessonPractice feedback/error behavior; make the public visual-barrel inventory test fail on
  future unclassified exports; and restore readable contract-name wrapping plus the 40px catalog
  navigation target floor. Preserve the accepted catalog composition, SSR/no-JavaScript output,
  monochrome styling, context-bound side-effect boundary, public consumers and postponed lesson
  specimen — _Depends on:_ F23
- [x] `F25` Complete the Widgets catalog in one route-local iteration: reconcile every public
  widget barrel with a shared catalog contract map; distinguish the ALCHIMIA candidate from live
  production widgets; demonstrate application chrome, lesson navigation and a reproducible
  LessonPracticeFlow integration with isolated persisted progress and reset; and replace generic
  layout boxes with truthful public-page and lesson-page assembly maps. Preserve the accepted
  monochrome composition, SSR/no-JavaScript output, production widget APIs, public consumers and
  postponed representative lesson specimen — _Depends on:_ F24
- [x] `F26` Refine the accepted component specimens in one focused iteration: reduce the ALCHIMIA
  wordmark and add the secondary identity line «ЕГЭ информатика»; remove the unused Divider
  contract; present Input, Accordion, Badge, Progress, Callout and the learning-content family as
  restrained, internally consistent lab candidates inspired by the supplied shadcn/ui references
  without adding dependencies or changing their public-route presentation; and give long
  CodeBlock instances an accessible hydrated expand/collapse treatment with icon-only copy state
  while retaining complete SSR/no-JavaScript code. Preserve standard neutral geometry, public
  component APIs and the postponed representative lesson specimen — _Depends on:_ F25
- [x] `F27` Correct the F26 component polish in one focused iteration: make the hydrated CodeBlock
  disclosure a surface-free text-and-icon action; give Accordion its reference-aligned title
  underline, chevron rotation and reduced-motion-safe panel animation; restore Callout's restrained
  semantic indication; and remove avoidable frames from the learning-content specimens. Keep the
  learning-content visual correction isolated to `/lab/design-system`, preserve public APIs and
  public lesson presentation, and add no dependencies — _Depends on:_ F26
- [x] `F28` Perform the final code, architecture and visual-quality audit of Change 75, fix every
  verified in-scope defect, reconcile the later Components and Widgets work with the postponed F8
  learning specimen, and complete the F9 desktop, zoom, keyboard, no-JavaScript, overflow and
  accessibility evidence required for local ship. Preserve the lab-only boundary, public behavior
  and dependency set — _Depends on:_ F27

### Infra

None

### Data

None

### Other

- [x] `T1` Reconcile PRODUCT, SPEC, FRONTEND and brand-asset requirements with ALCHIMIA as the
  target identity and Change 75 as a single-route, incremental exploration — _Depends on:_ —
- [x] `T2` Remove the rejected implementation and its generated evidence while preserving
  planning documentation, user-owned references and unrelated pre-existing worktree changes —
  _Depends on:_ —

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
PRODUCT.md
docs/SPEC.md
docs/FRONTEND.md
docs/BRAND_ASSET_REQUIREMENTS.md
docs/artifacts/references/**
docs/changes/75-alchimia-design-system-labs.md
apps/web/src/pages/design-system-lab/**
apps/web/src/widgets/alchimia-header/**
apps/web/public/fonts/alchimia/**
apps/web/src/app/styles/theme.css
apps/web/src/app/styles/tokens.css
apps/web/src/app/styles/fonts.css
apps/web/tests/**design-system-lab**
apps/web/tests/**alchimia-header**
apps/web/tests/shared-components.test.tsx
apps/web/e2e/pages/design-system-lab.page.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/lab.spec.ts
apps/web/e2e/smoke.spec.ts
apps/web/src/entities/learning-visual/learning-visual-frame.*
apps/web/src/shared/components/{accordion,badge,callout,code-block,input,progress}/**
apps/web/src/shared/components/learning-content/{checkpoint,diagram,mistake,procedure,worked-example}/**
apps/web/src/shared/styles/patterns.module.css
~~~

A focused test file may use the nearest existing test naming convention. Supporting test changes
must exercise only `/lab/design-system`, except F26's shared CodeBlock unit and public runtime
journey.

### Do NOT touch

- `/lab/lesson` page, components, styles, Page Object or browser scenarios
- Existing production theme/token roles, image primitives or lesson outline; F11/F2/F13 may add
  isolated ALCHIMIA candidate roles, font declarations, self-hosted files and one reusable widget,
  provided `/lab/design-system` remains their only consumer. F26 may add public-preserving CSS
  aliases to its named components and the explicitly approved global CodeBlock disclosure
- Public header, footer, metadata, manifest, favicon or social-preview consumers
- TopicLesson or CourseLesson content, tasks, ids, publication state or progress
- Backend, API/OpenAPI, database, analytics, infrastructure, operations or deployment contracts
- Archived change files

---

## Contracts

See `docs/SPEC.md` §5.3 and §9, `docs/FRONTEND.md` §6.1, the Execution Protocol and Files list
above. Public runtime identity remains `infraege`. Change 75 is exploratory until every visual
increment has explicit architect approval.

---

## Gate Checks

For each `F[N]`, run only the affected frontend Critical Gate plus a focused desktop browser check
of `/lab/design-system`, including zoom where layout structure changes. Capture the changed
specimen and inspect the console. A 390px dashboard shell is not a Change 75 gate. Automated green
does not replace architect approval and does not authorize the next item.

---

## Architect Review Notes

- [x] Reconcile the current public `infraege` master asset with the ALCHIMIA source-of-truth
  documentation: retain the public source required by `brand:generate` until public activation and
  describe the two identities without contradictory “sole source” claims.
- [x] Close the rejected F1 composition as superseded by F11, align F2 with the accepted
  achromatic typography treatment, and close F3 where F13 already satisfies its contract.
- [x] Align the Execution Protocol and Do NOT touch boundary with the accepted isolated widget,
  self-hosted fonts and inactive candidate theme/token roles that have no public consumer.
- [x] Remove transient `.impeccable` screenshots from the delivery, including evidence for
  rejected or superseded visual states; browser captures remain reproducible gate evidence rather
  than durable product artifacts.

---

## Implementation Notes

- The first broad implementation was rejected and fully removed. Change 75 now uses isolated,
  architect-reviewed increments on one lab route.
- F26 exposes the component candidates through inherited CSS aliases whose fallbacks preserve the
  current public presentation. CodeBlock is the deliberate exception: its internal nine-line
  threshold adds hydrated disclosure globally while SSR/no-JavaScript always renders full code.
- F27 keeps Accordion motion and hover treatment lab-only through the existing candidate aliases;
  its Base UI integration uses `data-panel-open` plus transition-state attributes, while closed
  `hidden` panels retain native visibility semantics. Callout and learning specimens return to
  their public-preserving fallback styles instead of carrying F26's lab frames.
- The architect replaced the former opaque-canvas `logo.svg` with
  `logo_with_transperant_bg.svg`; F1 uses that new source unchanged and removes the obsolete file.
- The initial F1 experiment used a decorative page-local CSS image so it remained visible without
  JavaScript; F11 retained the source fidelity and accessible live `ALCHIMIA` text at compact scale.
- The architect rejected F1's hero scale and requested a production-shaped reusable header.
  F11 supersedes that composition without activating ALCHIMIA on public routes; its Athanor-derived
  Cormorant role remains isolated inside the new widget until manual approval.
- F11 initially placed Athanor-derived candidate colors at the enforced theme/token boundary; F13
  removes that unintended color inheritance while retaining the approved type roles.
- The architect selected Athanor's role split directly after reviewing F11, so the former F2
  comparison/F10 selection pair was collapsed into one lab-wide F2 implementation.
- F2 self-hosts only the Cyrillic/Latin Cormorant SC and IBM Plex Mono subsets it uses, reuses the
  existing local Literata files, and remaps typography only inside `/lab/design-system`.
- After accepting F2 typography, the architect froze color exploration at a monochrome treatment
  on the original white background. The architect rejected F12's content taxonomy; F14 retains
  its controlled-tabs and linear SSR mechanics but replaces the dashboard with the three
  architecture-led System, Components and Widgets views.
- During F12 review the architect identified that F2 had also imported Athanor's cream background
  and warm brown/copper palette. F13 removes that inheritance while retaining the accepted
  typography.
- F14 keeps the catalog composition route-local: three panel modules share one sticky
  table-of-contents shell, production contracts are demonstrated through their public APIs, and
  analytics/reading-position features remain named but inactive because their live behavior owns
  browser consent or scroll context.
- F4 demonstrates the approved rhythm with existing `--space-1-5`, `--space-4` and `--space-6`
  tokens; it intentionally leaves the catalog-wide section gap unchanged so F4 does not pre-empt
  the surface and separator decisions owned by F5.
- F5 keeps its accepted base, quiet-fill, bounded-region and separator roles as lab-local
  specimens; it does not remap existing component surfaces before F7 applies the complete accepted
  profile to controls and states.
- F6's initial CSS orbit vocabulary was superseded by F15 after the architect supplied a complete
  transparent pattern atlas; no improvised orbit geometry remains.
- F7 remaps interaction accents only at the lab root and groups existing component demos with
  separators and quiet state surfaces; semantic error and success colors remain functional, while
  shared component implementations stay unchanged. F15 replaces its improvised line-node markers.
- F15 copies the approved `patterns_lines.png` byte-for-byte into the lab; its initial broad
  ornament catalogue was narrowed after visual review.
- F16's broad frame and diagram treatment was rejected as visually excessive. F17 keeps one
  source-faithful divider crop for horizontal and vertical section rhythm, while ordinary frames,
  swatches, diagram internals and interactive indicators use their standard borders.
- F18 removes atlas decoration from the primary tablist entirely; tabs use only their standard
  active indicator, while accepted fading dividers remain elsewhere in the page composition.
- F19 retires the atlas experiment from the active lab entirely. The architect-owned source stays
  in documentation, while its lab-local copy and crop renderer are removed and ordinary neutral
  borders again define structural separation.
- F20 follows the architect's explicit choice to remove the intro title from the DOM rather than
  retain a visually hidden page-level heading; the catalog's tablist and per-view headings remain
  its navigation and document landmarks.
- F22 removes the verified dead CSS surface and reduces `SemanticTokenPreview` from twelve render
  branches to a typed preview map. F28 further splits its static and motion renderers, decomposes
  the final browser audit by catalog level, exports the two internal prop contracts reported by
  Fallow and reconciles stale alias-aware tests. Fallow now reports no introduced dead code or
  complexity findings; its remaining advisory duplication is intentional declarative repetition
  in font faces, paired specimens and learning variants.
- The architect's explicit final-review-and-ship request authorizes F28 to close the previously
  postponed F8/F9 evidence in the same final iteration rather than pause between those checklist
  items.

---

## Commit Message

```text
feat(change-75): develop ALCHIMIA design-system lab
```
