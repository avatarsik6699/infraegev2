# CHANGE 22 — Recursion Lesson Content System

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `22` |
| Slug | `recursion-lesson-content-system` |
| Title | Recursion Lesson Content System |
| Status | `active` |
| Branch | `feature/22-recursion-lesson-content-system` |

---

## Goal

Deliver the first real, review-only EGE lesson at `/ege/16-rekursiya` from the complete authored
recursion artifact. Superseded the original Markdown-plus-JSON-manifest content boundary with
**TSX-as-content**: lesson theory is authored directly as typed React components
(`defineLesson(...)` + `ConceptBlock[]`) instead of a hand-rolled Markdown DSL/parser, a JSON
section manifest and a runtime role-order invariant. `content/tasks/**` (server-owned answer
checking) is unaffected — it stays JSON+pydantic because the backend must read it too and the
answer must not ship in the client bundle. Reuses reusable lesson rendering and server-owned answer
checking without publishing the lesson or replacing the separate synthetic `/lab/lesson` surface.

Also reorders the recursion lesson's theory into `ConceptBlock`s that build on each other
(concreteness before formal justification, each common mistake placed next to the concept it
belongs to, the loop/memoization alternatives motivated by the cost they actually solve — not
introduced as unmotivated alternatives) and introduces a formative `Checkpoint` self-check
(think-then-reveal, not graded, not counted toward `masteryThreshold`) between concept clusters.
See `docs/SPEC.md` §3 for the full contract.

---

## Backlog

### Backend

- [x] `B1` Extend the strict task content model with public lesson presentation fields while preserving the existing answer-check HTTP contract — _Depends on:_ T4
- [x] `B2` Add focused API coverage for the three recursion tasks, normalization, wrong answers and unknown ids — _Depends on:_ B1, D3

### Frontend

- ~~`F1` Add validated LessonDocument contracts and a server-only content loader that returns public task projections without checker secrets~~ (removed — superseded by `defineLesson`/typed import, no runtime FS content loader for theory)
- ~~`F2` Build the restricted Markdown renderer and reusable Editorial Rail theory primitives for GFM, math, code, tables, callouts and structured recursion visuals~~ (removed — superseded by `F8`)
- ~~`F3` Build the generic `/ege/$slug` topic page, content-derived outline and six-role responsive SSR/no-JS composition~~ (removed — superseded by `F10`)
- [x] `F4` Refactor shared practice around an injected async checker, connect the recursion lesson to the generated API client and preserve the lab through a local adapter — _Depends on:_ B1, F10, D3
- ~~`F5` Add review/noindex metadata, publication-aware prerender exclusion and focused unit/E2E coverage for content fidelity, accessibility, mobile, no-JS and error states~~ (removed — superseded by `F12`)
- ~~`F6` Introduce a small typed semantic-block contract and renderer for callouts, worked examples, procedures, mistakes and learning visuals while keeping ordinary authored prose in Markdown~~ (removed — components are now TSX directly, no separate directive contract/parser)
- ~~`F7` Update the lesson outline and focused coverage for coarse theory groups, embedded examples and unchanged SSR/no-JS readability~~ (removed — superseded by `F10`)

> `F8` and `F14`–`F18` below are completed Mantine-era exploration history. Their implementation
> details are superseded by the binding Base UI/CSS Modules baseline in `F19`–`F26`; they are not
> current frontend guidance.

- [x] `F13` Scaffold the private, minimalist design-system stand page shell (`/lab/design-system`, unlisted, `noindex,nofollow`, following the `/lab/lesson` convention) with color/font/typography sections sourced from `tokens.css` and real heading/body/code styles (no fabricated scale); components land here incrementally as `F8` builds them — _Depends on:_ —
- [x] `F8` Build the lesson content design-system library as typed React components, one at a time directly on the `F13` stand for review before moving on, respecting the existing FSD-like layer boundaries (`docs/STACK.md` "Frontend layers"): domain-agnostic pieces (`Callout`, `Divider`) as `shared/components/*` Mantine wrappers matching the existing convention (`empty-state`, `code-block`, `typography`); lesson-domain pieces (`WorkedExample`, `Procedure`, `Mistake`, `Diagram` — asset-based, `src`/`alt`/`caption`/`purpose` required, Light-only baseline, no dark variant — and `Checkpoint`, rendering `CheckpointItem[]` as a vertical think-then-reveal list, not tabs) under `entities/lesson/components/*`; also mirrored the existing `features/lesson-practice` task/task-list UI (`LessonPractice`) onto the stand for a single review surface — _Depends on:_ F13
- [x] `F9` Build `defineLesson(...)` typed constructor and `ConceptBlock` composition contract (named required fields replace the section-array `role` + runtime order invariant) — _Depends on:_ F24
- [x] `F10` Rebuild the generic `/ege/$slug` topic page and lesson outline to consume `defineLesson` output directly (outline derived from `ConceptBlock[].id`/`navLabel`, no regex heading extraction) — _Depends on:_ F9
- [x] `F11` Remove `lesson-markdown.tsx`, `content-files.server.ts`, the `LessonContentTypes`/`LessonTypes` double model and the `roleOrder` runtime invariant — _Depends on:_ F10
- [x] `F14` Consolidate a numeric `--text-*` type-scale token set (`tokens.css`, documented as `type-scale` in `DESIGN.md`), wire it into the Mantine theme (`fontSizes`, full `h1`–`h6` `headings.sizes` — `h4`–`h6` were previously unset), and extend `shared/components/typography` (`Text`/`Title`) with `truncate`/`lineClamp` passthrough; fixed a dead `--color-highlight` reference found along the way — _Depends on:_ F13
- [x] `F15` Regenerate the accent ramp (Mantine `ember` palette) as a perceptually-even 10-step OKLCH ramp anchored at the two brand hexes already in use (`--color-accent`, `--color-accent-dark`), replace the hand-picked `--color-accent-soft` hex with a `color-mix(in oklch, …)` token tied to the accent, and add a two-tier elevation system to `DESIGN.md`/`tokens.css` — `--surface-tonal-1`/`-2` (tonal elevation, no shadow, for static content) plus `--shadow-overlay-sm`/`-md`/`-lg` (tinted-from-ink, reserved for future transient overlays only — not applied to any static content, since real shadows on static blocks was rejected as a "dashboard of raised cards" risk) — _Depends on:_ F13
- [x] `F16` Lighten `--color-accent` (`#bd4326` → `#c44a2d`, OKLCH L 0.549 → 0.57 at fixed hue/chroma, re-anchoring the `F15` ramp) within the AA floor for white button text (contrast ~4.8:1, verified); `--color-accent-dark` unchanged since it exists specifically for high-contrast text-on-light and lightening it would work against that job; raised `--color-accent-soft`'s `color-mix` share 16%→20% for a less washed background; fixed `Callout` title/icon sharing one tone-tinted color (passed WCAG numerically but read as blending due to same-hue text-on-background) — title/body now plain `--color-text` ink, only the icon keeps the tone color — _Depends on:_ F15
- [x] `F17` Revised `F16`'s title-color and `F15`'s "flat static content" elevation call after review: `Callout` tones now carry the actual semantic weight (`warning` = the one-voice evidence-orange wash, since caution is the "evidence and action" case; `idea` = neutral quiet-paper, not alarm-colored — the two tones had been backwards) and titles are tone-colored again (matching Mantine `Alert`'s own convention) since the background swap removes the same-hue blending `F16` fixed. Formalized a third, narrowly-scoped elevation tier in `DESIGN.md`/`tokens.css`: `--shadow-annotation` — a "pinned note attached to the page" exception for `Callout` specifically (tight shadow, border dropped so elevation is declared once), distinct from the still-unused-and-reserved `--shadow-overlay-*` tier; considered and re-rejected a colored border-left/edge-tab for the same role (generic card tell, wrong tone for the product) — _Depends on:_ F16
- [x] `F18` Tried and reverted a full accent hue swap: architect reported the red-orange/burgundy family reads as anxious rather than the intended cozy/calm mood, research (`docs/changes/22-*.md` session, not persisted as a doc) confirmed dark+saturated red-orange is the strongest danger-coded color combination; built three live comparison candidates on the `F13` stand (muted terracotta, ochre, honey/warm-gold) plus a full honey re-skin (renamed Mantine palette `ember`→`honey`) for review — architect picked honey, then reverted the same session ("текущий вариант был самый лучший... более светлое, не багровое"), so the stand comparison and the `honey` rename were both undone back to `ember`/red-orange. Landed instead on a corrected anchor within the original hue: `--color-accent` `#c44a2d`→`#c3482b` (L 0.57→0.565) — this also **fixed a real bug `F16` introduced**: at L 0.57, `--color-accent` used directly as text-on-paper (rail nodes, wordmark) measured 4.45:1, just under the 4.5 AA floor; 0.565 is the lightest point in this hue where both that job and white-button-text stay ≥4.5:1 simultaneously — documented as a hard ceiling in `DESIGN.md` Colors; further lightening in this hue needs desaturation, not more L, and is left open/unimplemented — _Depends on:_ F16
- [x] `F12` Add review/noindex metadata, publication-aware prerender exclusion and focused unit/E2E coverage (content fidelity, accessibility, mobile, no-JS, error states) for the TSX-rendered lesson — _Depends on:_ F10, F4
- [x] `F19` Replace the Mantine-first frontend foundation with exact Base UI subpath primitives, CSS Modules and a three-layer theme contract (primitive values → semantic tokens → component CSS), landing the replaceable light-only “Engineering notebook” baseline without theme-specific public APIs — _Depends on:_ T6, T7
- [x] `F20` Recompose `/lab/design-system` into the SSR/no-JS catalog with Foundations, Primitives, Feedback & Disclosure, Lesson Patterns and Composite Flows; add a sticky desktop rail and an in-flow table of contents below `72rem`, and enhance disclosure only after mount through one `data-enhanced` state — _Depends on:_ F19
- [x] `F21` Migrate Foundations and Primitives (`Typography`, `Button`, `ActionLink`, `Badge`, `PageContainer`, `Divider` and surfaces) to the local semantic API/CSS contract and prove the family on the stand — _Depends on:_ F20
- [x] `F22` Migrate Feedback, Forms and Disclosure (`Field`/`Input`, validation, `Progress`, `Accordion`, `Tabs`, callouts and empty states) to Base UI behavior where an equivalent primitive exists, preserving keyboard, focus, SSR and no-JS behavior — _Depends on:_ F21, A1
- [x] `F23` Migrate Lesson Patterns and Composite Flows, including lesson-domain blocks, practice and code presentation, to the new system without changing domain/API/content state contracts — _Depends on:_ F22, A2
- [x] `F24` Remove all Mantine packages/providers/styles/imports and replace `highlight.js` with exact `@speed-highlight/core@2.0.0` synchronous Python tokenization rendered as React nodes; retain the global cooldown with an exact-version exception and prove theme/vendor isolation — _Depends on:_ F23, A3
- [x] `F25` Refine the pre-A1 theme toward a restrained warm-monochrome baseline: replace the cool accent with one orange signal, reduce decorative color roles, round controls and badges, and add compact contrast-backed elevation only to interactive controls (starting with buttons and action links) while static surfaces stay flat — _Depends on:_ F21
- [x] `F26` Replace the pre-A1 orange/raised experiment with a shadcn-oriented neutral monochrome baseline: use ink, muted surfaces and borders for hierarchy; retain color only for semantic feedback; replace hard control backing with restrained border plus soft low-contrast shadow; and re-audit every implemented Foundations/Primitives state on `/lab/design-system` across desktop, mobile and keyboard interaction — _Depends on:_ F25
- [x] `F27` Close the design-system audit findings: make Tabs and Accordion content semantic linear blocks before enhancement instead of visually-unhidden Base UI `hidden`/`inert` panels; fix the lab contrast and navigation name, practice heading hierarchy and accessible tab names, remove the idle navigation progressbar from the accessibility tree, and align answer-field copy with the adopted Kontur guidance — _Depends on:_ F24
- [x] `F28` Add fixture/Page Object E2E coverage for `/lab/design-system` across desktop, mobile, axe and JavaScript-disabled linear content, including screenshots, overflow, metadata and clean-console evidence — _Depends on:_ F27
- [x] `F29` Distill the implemented web visual system toward a quieter minimal baseline: reduce the effective typography scale, weights and text-color roles; remove non-essential component decoration and nested-surface noise; preserve accessibility, responsive behavior, public component APIs and theme-level redesign flexibility; update `/lab/design-system` proofs and the binding frontend contract — _Depends on:_ F28
- [x] `F30` Apply a second dense-minimal pass to every component family demonstrated on `/lab/design-system`: remove non-essential divider lines, let spacing and composition carry grouping, tighten component-internal rhythm consistently, and retain Kontur-aligned semantics, target sizes, responsive behavior and accessible states — _Depends on:_ F29
- [x] `F31` Replace the blue inline `Notation` treatment for authored code and formulas with one restrained neutral ink/gray treatment whose foreground and background preserve contrast without creating a separate chromatic accent — _Depends on:_ F30
- [x] `F32` Distill the real recursion lesson typography and vertical rhythm: reduce visible font-family/size/weight/color variation, keep a clear but compact heading hierarchy, and apply one small spacing scale consistently across the title, section headings, prose and semantic blocks — _Depends on:_ F31
- [x] `F33` Restore a linear central reading flow on `/ege/16-rekursiya`: move mistakes and other explanatory semantic blocks out of the right marginal column, flatten their backgrounds/emphasis where possible, and keep the right rail free of blocks that disrupt the content rhythm — _Depends on:_ F32
- [x] `F34` Refine code-related explanations and procedures without changing the teaching sequence: place concise code-local explanations as comments inside code blocks where that improves comprehension, retain surrounding prose where it carries conceptual meaning, prevent adjacent text from visually sticking together, and number the steps in «Общий алгоритм решения» — _Depends on:_ F33
- [x] `F35` Simplify lesson-level navigation and status: remove the result-side «Вернуться к теории» and «Освоение темы» blocks, remove progress from the left rail, place compact progress beside the title metadata, and restore the recursion lesson's useful badges/meta information in the header — _Depends on:_ F33
- [x] `F36` Synchronize the binding SPEC/FRONTEND contracts and focused unit/E2E evidence for the manual-review refinements; verify desktop/mobile/no-JS, rail overflow, clean console, LSP, Impeccable detector and the affected Critical Gate without publishing the lesson — _Depends on:_ F31, F32, F33, F34, F35
- [x] `F37` Restore the desktop three-column lesson shell with a deliberately empty right rail, keep mistakes and other authored content in the central reading column, remove the lesson-progress block entirely, and remove the duplicated «После урока вы сможете» introduction — _Depends on:_ F36
- [x] `F38` Refine mistake and code presentation: add a restrained warning icon and thin yellow right rule to mistakes, remove «Пример» from code-block headers, render the one-previous-value template as highlighted Python, and simplify the copy control hover treatment — _Depends on:_ F37
- [x] `F39` Rebalance formative checks and reading components: add checkpoints after meaningful theory groups, keep the transition into practice logical, fix disclosure chevron containment, and unify authored list typography and spacing for compact readability — _Depends on:_ F38
- [x] `F40` Unify page and nested scrollbars with the same thin neutral square-ended treatment across the document and scrollable navigation regions — _Depends on:_ F37
- [x] `F41` Synchronize focused tests and binding frontend documentation for this review pass; verify desktop/mobile/no-JS, three-column layout, empty right rail, clean console, LSP, Impeccable detector and the affected Critical Gate without publishing the lesson — _Depends on:_ F37, F38, F39, F40
- [x] `F42` Give `Checkpoint` a distinct but restrained informational treatment: place one question icon beside «Проверьте себя», add a thin left rule in soft blue tones, preserve the flat central reading flow, and verify the component across desktop/mobile, console, LSP, focused tests and the affected Critical Gate — _Depends on:_ F39
- [x] `F43` Compact the lesson shell gutters with one shared responsive value for the article and table of contents, keeping their content edges aligned across desktop, intermediate and mobile layouts; verify spacing, overflow, console, Impeccable detector and the affected Critical Gate — _Depends on:_ F37
- [x] `F44` Harmonize `Mistake` and `Checkpoint` around the same compact semantic-block structure: align each icon with its colored heading label, match the left-rule weight while preserving warning/information colors, and add multiple questions to selected recursion checkpoints so stacked disclosure rhythm can be reviewed; verify focused tests, desktop/mobile interaction, console, LSP, Impeccable detector and the affected Critical Gate — _Depends on:_ F42

### Infra

- ~~`I1` Make git-based content available to the web development, build and production runtimes without changing normal resumable lifecycle commands~~ (removed — theory content is compiled TSX, not a git-mounted content directory; `content/tasks/**` mounting for the backend is a pre-existing capability, unaffected)
- [x] `I2` Simplify dev/build/prod content mounting to serve only `content/tasks/**`, dropping the `content/topics/**` special-casing added for the Markdown loader — _Depends on:_ F11
- [x] `I3` Diagnose and stabilize the Docker Desktop development lifecycle: make `make stop` terminate the owned Compose stack promptly and reliably, and make `make dev` surface and prevent nginx startup failures with focused lifecycle verification — _Depends on:_ —

### Data

- ~~`D1` Define and validate the Markdown plus typed-manifest authoring contract, stable heading anchors, role ordering and content references~~ (removed — superseded by the `defineLesson`/`ConceptBlock` TypeScript contract, SPEC §3)
- ~~`D2` Adapt all 23 authored chapters and final synthesis into the approved six-role recursion lesson with source-faithful wording and one structured recursion trace~~ (removed — superseded by `D5`, which reorders rather than preserves the original section split)
- [x] `D3` Add the three authored tasks with server-owned accepted answers, public hints/explanations and a review-only quality record — _Depends on:_ B1
- ~~`D4` Recompose the recursion lesson into a small set of numbered theory groups, move examples into the theory flow and mark only reusable pedagogical fragments as semantic blocks without shortening the authored material~~ (removed — superseded by `D5`)
- [x] `D5` Rewrite `docs/artifacts/lessons/16-rekursiya.md` into TSX `ConceptBlock`s, reordered so concrete worked examples precede formal justification, each common mistake sits next to its concept, and the loop/memoization alternatives are introduced by the cost they solve (recursion depth limit, repeated subcomputation) rather than as unmotivated alternatives; add two `Checkpoint` self-checks — _Depends on:_ F9
- [x] `D6` Produce `Diagram` SVG assets (recursion call/return trace, recurrence derivation, others as the `ConceptBlock` split identifies a need) with required `alt`/`caption`/`purpose` — _Depends on:_ F8

### Other

- ~~`T1` Synchronize SPEC and PRODUCT with the approved flexible learning flow, hybrid content boundary and first review-only product route~~ (removed — superseded by `T4`)
- [x] `T2` Complete required browser, design-quality, LSP and affected Critical Gate evidence while retaining human publication approval — _Depends on:_ B2, F12, D3, D5, D6, I2, F24
- ~~`T3` Synchronize the lesson structure contract after removing `guided_examples` as a standalone stage and adopting coarse theory navigation with semantic islands~~ (removed — superseded by `T4`)
- [x] `T4` Synchronize `docs/SPEC.md` §3/§5.2 with the TSX-as-content boundary — _Depends on:_ —
- ~~`T5` Synchronize `apps/web/PRODUCT.md` with the TSX-as-content authoring boundary~~ (removed — superseded by `T6`; durable product truth belongs to `docs/SPEC.md`, while the Impeccable-owned frontend artifact is removed)
- [x] `T6` Consolidate durable documentation ownership: migrate unique product truth to `docs/SPEC.md`, create `docs/FRONTEND.md`, keep `docs/STACK.md` executable/tool-focused, remove `docs/FRONTEND_CONVENTIONS.md`, `apps/web/DESIGN.md`, `apps/web/PRODUCT.md` and `.impeccable/**`, and update every binding reference — _Depends on:_ —
- [x] `T7` Audit every former frontend convention through an explicit keep/adapt/drop matrix; seed the single binding contract from the Kontur accessibility, responsive, screen-typography and validation guides, retaining compatible project code-style/naming/state/boundary rules wherever the guides do not cover them — _Depends on:_ T6
- [x] `T8` Reconcile the active frontend documentation after the design-system audit: mark the Mantine-era F8/F14–F18 descriptions as historical, remove the stale T4 sync note, correct the F22 SSR/no-JS implementation note, and document syntax-color plus adopted component-guide exceptions in `docs/FRONTEND.md` — _Depends on:_ F27

### Architect checkpoints

- [x] `A1` Architect manually approves Foundations and Primitives on `/lab/design-system` — _Depends on:_ F26
- [x] `A2` Architect manually approves Feedback, Forms and Disclosure on `/lab/design-system` — _Depends on:_ F22
- [x] `A3` Architect manually approves Lesson Patterns and Composite Flows on `/lab/design-system` — _Depends on:_ F23

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/artifacts/lessons/16-rekursiya.md
docs/changes/22-recursion-lesson-content-system.md
docs/FRONTEND.md
apps/web/package.json
apps/web/src/routes/lab.design-system.tsx  // new: private design-system stand route
apps/web/src/pages/design-system-lab/**    // new: design-system stand page
apps/web/src/shared/components/**          // extended: domain-agnostic F8 components (Callout, ...)
apps/web/src/entities/lesson/**            // extended: lesson-domain F8 components (entities/lesson/components/*),
                                            // defineLesson/ConceptBlock contract, authored rekursiya.lesson.tsx;
                                            // trimmed: lesson-markdown.tsx, lesson-content.types.ts,
                                            // api/topic-content.server.ts removed; lesson.types.ts kept/adjusted
apps/web/src/shared/config/content-files.server.ts   // removed
apps/web/src/features/lesson-practice/**
apps/web/src/pages/topic-lesson/**
apps/web/src/routes/ege.$slug.tsx
apps/web/tests/**
apps/web/e2e/**
apps/web/vite.config.ts
apps/web/Dockerfile
apps/api/app/modules/content/**            // unaffected, listed for T2 gate evidence only
apps/api/tests/**
content/topics/**                          // removed (theory moves into apps/web/src/entities/lesson)
content/tasks/**                           // unaffected
infra/docker-compose.dev.yml
Makefile
scripts/validate-content-links.mjs
pnpm-lock.yaml
~~~

The earlier `apps/web/DESIGN.md`/`PRODUCT.md` and project `.impeccable/**` artifacts are removed by
`T6`; `docs/SPEC.md` and `docs/FRONTEND.md` own their durable product/frontend truths.

### Do NOT touch

- Public home/catalog/legal/sitemap UI, authentication/accounts, database schema and production credentials
- `/lab/lesson` page-private content, layout and visual proof beyond the minimal shared-practice adapter
- Publication status, push/deploy and archived change files

---

## Contracts

See `docs/SPEC.md` §3–§5 and the Files list above. Do not hand-copy schema, endpoint, type or
environment details into this file.

---

## Gate Checks

In addition to the affected Critical Gate, verify `/ege/16-rekursiya` directly with desktop,
mobile and JavaScript-disabled browser journeys; confirm `noindex,nofollow`, no checker secrets in
loader data, exclusion from prerender/public navigation and unchanged `/lab/lesson` behavior.

---

## Architect Review Notes

- [x] Recompose `/ege/$slug` around the approved `/lab/lesson` editorial shell: brand/context chrome, persistent desktop rail, wide reading column plus marginalia, and responsive in-flow adaptation without changing lesson content order or state contracts.
- [x] Make inline code and formulas use a reusable blue `Notation` treatment; redesign `Mistake` and `Checkpoint` for clearer semantic emphasis without strike-through, the redundant divider, duplicate heading or decorative question icon.
- [x] Simplify practice tabs and task panels while preserving Base UI behavior, difficulty growth, SSR/no-JS forms, answer checking and accessible field semantics; remove redundant visible labels/copy and make Hint an obvious disclosure.
- [x] Replace the plain result and verbose topic-progress presentation with compact mastery metadata, learning outcomes and current-lesson theory links, without inventing related lesson routes or changing the lesson definition contract.
- [x] Simplify `LessonOutline` to semantic text navigation without measured SVG connectors, add a visible reading-position indicator, and adopt a restrained system-wide scrollbar with rail overflow only when needed.
- [x] Remove recursion diagrams from the real lesson and defer their authored assets to a later change while retaining the reusable `Diagram` contract and a working design-system catalog example.
- [x] Synchronize SPEC/FRONTEND and complete focused unit, desktop/mobile/no-JS, keyboard, axe, console, LSP, Impeccable detector and affected Critical Gate evidence without publishing the lesson.
- [x] Fix the web container's lesson-task root so Docker SSR reads the mounted `/content/tasks` files instead of the host-only `/repo/content/tasks` fallback; verify the real route through Nginx on port `8080` after container recreation.

---

## Implementation Notes

- F24 keeps the global dependency cooldown and grants only `@speed-highlight/core@2.0.0` an exact
  exception. Its synchronous tokenizer feeds escaped React text nodes, so syntax markup exists in
  SSR/no-JavaScript output without an HTML-injection boundary or public `CodeBlock` API change.
- F22/F27 render tab panels and accordion content as ordinary semantic blocks during SSR/no-JS;
  after enhancement the local wrappers switch to Base UI, which owns selection, disclosure,
  keyboard behavior and inactive `hidden`/`inert` state. Non-functional controls stay hidden before
  enhancement.
- F26 supersedes F25's short-lived orange/raised visual experiment before A1; no public component
  API changed, only the replaceable theme and local component CSS contract.
- Base UI imports remain confined to local `shared/components` wrappers; lint and architecture
  proofs reject any restored `@mantine/*` import and keep literal theme values out of component CSS.
- The real recursion lesson intentionally carries no diagrams in this review pass. The generic
  `Diagram` component stays in the catalog, while recursion-specific assets are deferred to the
  later lesson-polish change instead of remaining as unused production files.
- The pinned Base UI 1.7.0 `Field.Control` adds a benign empty `style` object only on the client;
  the local `Input` wrapper contains `suppressHydrationWarning` for that single vendor-generated
  attribute difference while value, validation and accessible field semantics remain identical.
- **2026-08-16 — superseded.** The Markdown-plus-JSON-manifest approach below was fully implemented
  once (all Backlog items checked, ~1300 lines of authored Markdown + a ~470-line hand-rolled
  parser), then replaced by TSX-as-content after an architecture review surfaced that the custom
  parser, the double `LessonContentTypes`/`LessonTypes` model and the runtime `roleOrder` invariant
  cost more to maintain than the flexibility they bought — for a single developer who is also the
  sole content author, writing lesson theory as typed React components removes the parsing layer
  entirely and lets the compiler enforce the lesson's shape. The notes immediately below describe
  the superseded implementation and are kept for history, not as current guidance.
- Adding third-party Markdown/math packages was rejected when the repository supply-chain cooldown
  blocked an unrelated immature locked TanStack patch. The renderer therefore used a restricted,
  replaceable internal parser behind `LessonDocument`; no cooldown exception or lockfile downgrade
  was introduced. This constraint no longer applies under TSX-as-content: no new markdown/math
  rendering dependency is introduced, so the cooldown question does not resurface.
- Theory permitted consecutive coarse `theory` groups; ordinary prose stayed in Markdown while a
  deliberately small directive vocabulary marked only reusable callouts, worked examples,
  procedures and mistakes.

---

## Commit Message

```text
feat(change-22): TSX-as-content lesson system with ConceptBlock/Checkpoint
```
