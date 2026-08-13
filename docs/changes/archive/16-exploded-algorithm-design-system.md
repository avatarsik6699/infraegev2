# CHANGE 16 — Exploded Algorithm Design System

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `16` |
| Slug | `exploded-algorithm-design-system` |
| Title | Exploded Algorithm Design System |
| Status | `archived` |
| Branch | `feature/16-exploded-algorithm-design-system` |

---

## Goal

Establish the replacement public-web design system through one production-grade, unlisted lesson
lab. Prove the «Разобранный алгоритм» direction, accessible learning visuals, complete interaction
states and SSR/no-JS reading without publishing synthetic content or fixing future product routes.

---

## Design References

- Impeccable direction `ded7b27c` — «Разобранный алгоритм», Read mode, comp-led execution; the
  approved 1440×1024 comp becomes the implementation authority.

---

## Backlog

### Backend

None.

### Frontend

- [x] `F1` Complete the Impeccable three-comp round, persist the chosen surface brief and emitted direction contract, and obtain architect approval before UI code — _Depends on:_ F10
- [x] `F2` Replace the neutral Mantine baseline with the approved light-only theme, semantic tokens, self-hosted Cyrillic typography and component states — _Depends on:_ F1
- [x] `F3` Remove LearningPathTableOfContents and replace the root stand with a neutral SSR placeholder using the new foundation — _Depends on:_ F2
- [x] `F4` Build shared LearningVisualFrame and hierarchical LessonOutline primitives without binding them to free-form API JSON — _Depends on:_ F2
- [x] `F5` Build `/lab/lesson` as the approved responsive/no-JS four-section synthetic lesson with structured visual and local practice states — _Depends on:_ F3, F4
- [x] `F6` Exclude lab from discovery/prerender and add unlisted/noindex metadata without treating the route as access control — _Depends on:_ F5
- [x] `F7` Replace focused unit and fixture-owned E2E coverage for semantics, interactions, no-JS, responsive behavior and removed ToC — _Depends on:_ F3, F5, F6
- [x] `F8` Re-run the lesson comp round around the architect's editorial three-column reference, rejecting the initial A/B/C structures while preserving the approved learning contract — _Depends on:_ —
- [x] `F9` Combine Editorial Rail with Annotated Reading's section rhythm and scheme-to-margin leaders, and redesign the lesson outline from the architect's hierarchical path reference — _Depends on:_ F8
- [x] ~~`F10` Correct comp geometry so child outline branches originate at parent nodes with clear node gaps, and shorten/separate scheme-to-margin leaders for local visual continuity~~ (removed by architect; approved the earlier Editorial Rail candidate) — _Depends on:_ F9
- [x] `F11` Restore WCAG AA contrast for the approved warm palette without changing the Editorial Rail hierarchy — _Depends on:_ F2
- [x] `F12` Eliminate the early-interaction hydration warning on the local practice field — _Depends on:_ F5
- [x] `F13` Remove the redundant section kicker flagged by the Impeccable finish review — _Depends on:_ F5
- [x] `F14` Densify the approved Editorial Rail and make its structural rules continuous to viewport edges or line intersections across desktop, intermediate and mobile layouts — _Depends on:_ F13
- [x] `F15` Correct the reading typography and font-loading strategy so self-hosted Literata/Onest remain legible, contrast-safe and stable on slow connections without loading an unused italic face — _Depends on:_ F14
- [x] `F16` Extend focused geometry/font coverage, recapture bounded evidence, run the single Impeccable detector and finish review, and update the accepted design documentation — _Depends on:_ F14, F15
- [x] `F17` Rebalance the approved desktop lesson so the central reading track absorbs wide-screen growth while outline and marginalia remain content-sized, and replace the central/right divider with locally grouped marginal notes — _Depends on:_ F16
- [x] `F18` Extend wide-screen composition coverage, recapture bounded evidence, complete the Impeccable layout/finish checks, and synchronize the accepted design documentation — _Depends on:_ F17
- [x] `F19` Restore the lesson's four-level reading rhythm with semantic numbered section headings, subordinate theory headings, and consistent central-column rules and spacing across desktop and mobile — _Depends on:_ F18
- [x] `F20` Extend focused semantic and geometry coverage, recapture bounded browser evidence, run the single Impeccable detector and LSP/Critical Gate checks, and synchronize the accepted design documentation — _Depends on:_ F19, F21, F22
- [x] `F21` Refine the numbered hierarchy against the architect's compact editorial reference: orange structural headings, smaller muted subtopics, and equal-width lower-contrast section rules — _Depends on:_ F19
- [x] `F22` Increase the orange numbered headings to near-subtopic scale and replace inter-section rules with whitespace-only grouping — _Depends on:_ F21
- [x] `F23` Remove the remaining non-functional rules between the intro, learning visual, theory subtopic, visual steps and practice form, and replace them with a three-level proximity rhythm — _Depends on:_ F22
- [x] `F24` Restore the compact reference-sized orange section headings while preserving whitespace-only grouping — _Depends on:_ F23
- [x] `F25` Apply the final visual audit: localize marginalia labeling to the learning visual, align outline children with visible subtopic headings and the current reading position, cap ultrawide proof growth, and refine mobile title/caption/control density without restoring separators — _Depends on:_ F24
- [x] `F26` Rebuild LessonOutline as a standalone semantic HTML/SVG file-tree module with measured collision-free connectors, gap-separated solid nodes, active-branch highlighting, label-bound links, and a minimal list presentation when the outline leaves the desktop rail — _Depends on:_ F25
- [x] `F27` Extend focused semantic, scroll-state, geometry, no-JS and responsive coverage; capture bounded browser evidence; run the Impeccable detector, LSP and affected Critical Gate; and synchronize the accepted outline contract in design documentation — _Depends on:_ F26
- [x] `F28` Replace the lesson subheader actions and pseudo-breadcrumb with a responsive SSR-safe back-to-topics link, lesson context, discrete section counter and non-semantic reading-position indicator — _Depends on:_ F27
- [x] `F29` Add a reusable sticky lesson-progress presentation, five progressively harder synthetic tasks, 4-of-5 mastery feedback and versioned local persistence without conflating reading position with completion — _Depends on:_ F28
- [x] `F30` Extend focused persistence, practice, navigation-position, no-JS and responsive coverage; capture bounded browser evidence; run the Impeccable detector, LSP and affected Critical Gate; and synchronize the revised lab contract in product/design documentation — _Depends on:_ F29
- [x] `F31` Distill the lab site header to a brand-only composition, remove the unstyled topic/trainer placeholders, and refine the text wordmark into a memorable accessible brand signature without inventing public navigation — _Depends on:_ F30
- [x] `F32` Replace the vertically repeated practice forms with an accessible five-step difficulty ladder, one active task, explicit progression and task-specific theory support while preserving linear lesson navigation, progress semantics and SSR/no-JS content — _Depends on:_ F31
- [x] `F33` Extend focused interaction, persistence, focus, no-JS and responsive coverage; capture bounded browser evidence; run the Impeccable detector, LSP and affected Critical Gate; and synchronize the accepted practice contract in product/design documentation — _Depends on:_ F32
- [x] `F34` Replace the lesson outline counter's prohibited `aria-label` on a paragraph with valid assistive text while preserving the visible section position — _Depends on:_ F32
- [x] `F35` Replace the rejected five-step practice ladder with an accessible five-tab task switcher whose color, difficulty glyph and level copy make progression legible while preserving one active task, mounted drafts, progress semantics and SSR/no-JS content; the initial collapsed theory support is superseded by F38 — _Depends on:_ F34
- [x] `F36` Extend focused tab keyboard, theory-link, persistence, no-JS and responsive coverage; capture bounded browser evidence; run the Impeccable detector, LSP and affected Critical Gate; and synchronize the accepted tabs contract in product/design documentation — _Depends on:_ F35
- [x] `F37` Keep the outline's current section anchored to the viewport reading line when collapsed practice shortens the page and multiple later sections intersect simultaneously — _Depends on:_ F35
- [x] `F38` Distill the practice tablist into a compact navigation strip and replace the rejected theory-support card/disclosure with one or more task-heading links to the relevant theory fragments, using a multi-link content contract without changing the lesson outline or progress model — _Depends on:_ F35
- [x] `F39` Establish the `app` layer and durable import rules for application-wide providers, configuration and global styles; synchronize STACK and frontend conventions without changing product behavior — _Depends on:_ F38
- [x] `F40` Move Mantine/query/error/navigation composition and global typography/styles into `app`, emit normal font subsets as hashed build assets, and remove unused italic sources while preserving the accepted loading contract — _Depends on:_ F39
- [x] `F41` Re-home reusable lesson types and presentation into entities/features/widgets, keep only domain-agnostic adapters in shared, and replace the lab-specific progress singleton with an injected lesson-keyed store — _Depends on:_ F40
- [x] `F42` Decompose the lesson lab into page-private content/components over the new public APIs and adopt exact `@mantine/code-highlight` 9.5.1 without weakening SSR/no-JS, keyboard, focus, draft or mastery behavior — _Depends on:_ F41
- [x] `F43` Migrate focused unit/E2E coverage, verify architecture/complexity/font requests and bounded desktop/mobile parity with required tooling, and run the affected Critical Gate — _Depends on:_ F42
- [x] `F44` Verify the exact Mantine CodeHighlight integration and refine the lesson code-example surface with Impeccable while preserving syntax highlighting, SSR/no-JS readability and responsive overflow behavior — _Depends on:_ F43
- [x] `F45` Replace avoidable raw text headings/paragraphs, badge-like spans and inline SVG icons in the lesson slices with the established Typography policy, Mantine Badge and an approved tree-shakeable icon component — _Depends on:_ F44
- [x] `F46` Audit the refactored lesson surface for oversized mixed-responsibility components, decompose lesson-practice and practice-task-panel into shallow private components/hooks, and document a durable local-versus-store state ownership rule without introducing a global state dependency absent demonstrated need — _Depends on:_ F45
- [x] `F47` Extend focused coverage and verify architecture, complexity, desktop/mobile presentation, browser console and the affected Critical Gate with the required frontend tooling — _Depends on:_ F46

### Infra

None.

### Data

None.

### Other

- [x] `T1` Align PRODUCT/SPEC and the canonical plan playbook with the approved Impeccable baseline — _Depends on:_ —
- [x] `T2` Run the production-contract check, bounded desktop/mobile inspection, detector once, independent finish review and final DESIGN.md documentation — _Depends on:_ F7
- [x] `T3` Run the affected Critical Gate and record only non-obvious residual risks — _Depends on:_ T1, T2

---

## Files

### Create / modify

~~~
apps/web/PRODUCT.md
apps/web/DESIGN.md
apps/web/package.json
apps/web/public/fonts/**
apps/web/src/app/**
apps/web/src/entities/**
apps/web/src/features/**
apps/web/src/widgets/**
apps/web/src/routes/**
apps/web/src/shared/components/**
apps/web/tests/**
apps/web/e2e/**
apps/web/eslint.config.js
apps/web/vite.config.ts
pnpm-lock.yaml
docs/SPEC.md
docs/STACK.md
docs/FRONTEND_CONVENTIONS.md
docs/playbooks/plan.md
docs/changes/16-exploded-algorithm-design-system.md
.impeccable/**
~~~

### Do NOT touch

- `apps/api/`, generated OpenAPI schema/types, `apps/ops/`, content publications, infrastructure,
  auth/accounts and archived change files

---

## Contracts

See `docs/SPEC.md` §5–§8 and the Files list above. Do not hand-copy schema, endpoint, type or
environment details into this file.

---

## Gate Checks

In addition to the affected Critical Gate, verify the production build retains direction seed
`ded7b27c`, prerenders `/`, excludes `/lab/lesson`, and capture bounded 1440×1024 / 390×844 browser
evidence for the Impeccable finish review. Full Gate remains opt-in.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- React cannot hydrate a literal JSX comment as the first body child, so the production direction
  contract is emitted as an inert `<template data-impeccable-direction="ded7b27c">`; the build
  retains the complete contract without adding visible or executable UI.
- A cold emulated 3G pass loaded two preloaded Literata and two optional Onest normal subsets
  (about 128 KB total), requested no italic face, and measured zero font-induced CLS.
- `@mantine/code-highlight` needs a separate syntax adapter in 9.5.1; the shared code-block policy
  registers only Python in exact `highlight.js` 11.12.0 instead of shipping every grammar.
- Mantine CodeHighlight also renders an internal core ScrollArea: its component stylesheet is
  required, and the highlight.js theme's root layout declarations must be neutralized so Mantine
  remains the sole owner of padding, background and overflow.
- Practice drafts, active-tab selection and focus are instance-local interaction state owned by a
  slice model hook; persisted solved-task progress remains in the injected lesson store. MobX or
  Zustand would add a global owner without a second consumer, so no state dependency was added.
- Fallow's remaining changed-code failures are verified static-analysis limitations: CSS Modules
  `:global(...)` selectors for runtime Mantine/highlight.js classes are reported as unused, while
  duplicate font `unicode-range` declarations are required per independent `@font-face` rule.
- The Impeccable detector still reports the pre-existing global theme and foundation heading sizes
  as outside the lesson type ramp; they remain unchanged because this refactor preserves the
  accepted visual contract rather than redesigning those surfaces.

---

## Commit Message

```text
feat(change-16): establish exploded algorithm design system
```
