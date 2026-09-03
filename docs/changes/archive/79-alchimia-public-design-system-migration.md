# CHANGE 79 — ALCHIMIA Public Design-System Migration

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `79` |
| Slug | `alchimia-public-design-system-migration` |
| Title | ALCHIMIA Public Design-System Migration |
| Status | `archived` |
| Branch | `feature/79-alchimia-public-design-system-migration` |

---

## Goal

Complete the deliberately deferred public rollout of the architect-approved Components and Widgets
contracts from `/lab/design-system`. Promote accepted visual defaults through existing shared and
widget boundaries, align every public page and both lesson compositions without copying the lab
dashboard, then remove only presentation code proven obsolete after migration. Preserve the white
monochrome profile, authored lesson copy and all domain/API/progress behavior.

---

## Design References

- `/lab/design-system` — approved executable source for System, Components and Widgets contracts;
  use its specimens as acceptance evidence, not as a production page template.
- `docs/artifacts/references/logo_with_transperant_bg.svg` — unchanged artistic authority for the
  already-active public identity.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Build `docs/artifacts/alchimia-public-migration-matrix.md` covering every accepted
  Components and Widgets catalog contract, its real public consumer, current
  active/candidate/obsolete status and owning style boundary. Include all public route families
  and distinguish live widget specimens from lab-only assembly diagrams; do not change
  presentation yet — _Depends on:_ —
- [x] `F2` Promote the approved Input, Accordion, Badge, Progress, Callout and related control/state
  defaults from lab-local aliases into their canonical semantic-token and shared-component
  boundaries. Preserve APIs, functional status colors, accessible states, reduced motion and the
  already-global long-CodeBlock disclosure; remove the corresponding lab-only overrides only when
  the shared result remains visually equivalent — _Depends on:_ F1
- [x] `F3` Promote the approved minimal learning-content presentation for Checkpoint, Diagram,
  Mistake, Procedure, WorkedExample and their surrounding lesson roles through the shared/entity
  boundaries used by both TopicLesson and CourseLesson. Preserve authored markup, sequence,
  diagrams, tasks and SSR/no-JavaScript readability — _Depends on:_ F2
- [x] `F4` Reconcile PublicHeader, PublicFooter, LessonOutline, LessonPracticeFlow and route-level
  layouts across home, course overview, CourseLesson, TopicLesson, privacy and application states
  with the accepted spacing, hierarchy and responsive composition. Reuse existing widgets and
  page contracts; do not reproduce dashboard tabs, catalog navigation or specimen framing on a
  public route — _Depends on:_ F3
- [x] `F5` Remove only fallback tokens, page-private presentation rules, duplicate styles and dead
  component code that the completed migration matrix proves have no remaining consumer. Keep
  compatibility or route-local rules whose removal would alter an intentional product, lab or
  accessibility contract, and record any retained legacy exception in Implementation Notes —
  _Depends on:_ F4
- [x] `F6` Reconcile focused component, page and E2E contracts and verify representative public
  routes at narrow mobile, structural breakpoints and wide desktop, including keyboard,
  focus-visible, hover-independent use, 150% zoom, reduced motion, no-JavaScript, overflow and
  console/accessibility evidence. Confirm `/lab/design-system` still truthfully represents the now
  live contracts and `/lab/lesson` has no unintended regression — _Depends on:_ F5
- [x] `F7` Recompose the shared lesson rail so its compact progress block sits below the table of
  contents and is anchored to the bottom of the desktop left column. Reduce the «Прогресс» label
  to the quiet UI-label role, preserve progress semantics and persistence, and keep the narrow
  layout in a natural reading order without viewport overflow — _Depends on:_ F6
- [x] `F8` Remove the redundant «Доступные материалы» wrapper and helper copy from every public
  lesson composition. Keep only previous lesson, «Все темы» and next lesson navigation where each
  destination exists, rendered through the established underlined link-with-icon contract rather
  than button-like controls — _Depends on:_ F7
- [x] `F9` Remove the «Теперь вы умеете» outcome-summary section from every public lesson
  composition without editing authored lesson source, changing task/progress behavior or leaving
  empty structural wrappers — _Depends on:_ F8
- [x] `F10` Simplify public lesson result navigation: remove the index link and top divider, use a
  compact wrapping flex composition, and remove the redundant next-lesson prefix — _Depends on:_ F9
- [x] `F11` Quiet the lesson-progress reset action and replace its in-flow confirmation panel with
  an accessible shared Base UI Dialog while preserving reset, persistence, no-JavaScript and
  keyboard contracts — _Depends on:_ F7
- [x] `F12` Stabilize LessonOutline geometry so activating an item or introducing overflow never
  changes its text measure, wrapping or surrounding layout — _Depends on:_ F7
- [x] `F13` Refine public lesson section hierarchy so numbered section labels are compact, quiet and
  typographically level, while subsection headings become clearer reading landmarks without an
  exaggerated scale jump — _Depends on:_ F3
- [x] `F14` Normalize Mistake and ConceptExample text roles: remove competing weight/color/size
  treatments from the former and give the latter's «Разберём на примере» label the intended quiet
  supporting emphasis — _Depends on:_ F3
- [x] `F15` Replace Mistake's sequential claim/explanation treatment with an accessible responsive
  comparison of «Неверно» and «Как правильно», using semantic error/success color together with
  distinct icons and labels while preserving authored `claim`/`explanation` content — _Depends on:_ F14
- [x] `F16` Apply the architect-approved uppercase treatment to compact numbered lesson-stage
  headings and lower their contrast further without separating the index from the stage name — _Depends on:_ F13
- [x] `F17` Strengthen lesson subsection landmarks through measured type contrast and vertical
  rhythm so adjacent concepts read as distinct units without card borders or ornamental rules — _Depends on:_ F13
- [x] `F18` Quiet the Mistake comparison without losing its «Неверно» / «Как правильно» structure:
  remove dominant status surfaces and colored body copy, reserve semantic color for compact
  labels and icons, and separate the two readings with standard neutral geometry — _Depends on:_ F15
- [x] `F19` Remove the redundant «Как действовать» presentation label from the general-method
  learning block without editing authored lesson content or weakening its actual title — _Depends on:_ F3
- [x] `F20` Rebalance lesson subsection rhythm so explicitly related prose, examples and learning
  blocks read as one unit while the larger separation remains reserved for the next subsection — _Depends on:_ F17
- [x] `F21` Reduce Mistake's footprint further through compact internal spacing and composition while
  preserving the accessible comparison, neutral body copy and status-label clarity from F18 — _Depends on:_ F18
- [x] `F22` Make lesson stage and subsection type overrides deterministic against the base
  Typography title selectors so CSS chunk order cannot collapse their intended hierarchy — _Depends on:_ F16, F17
- [x] `F23` Establish one parent-owned vertical-rhythm contract for every public lesson: distinguish
  12px content flow, 16px related learning blocks, responsive 48/32px concept separation and
  responsive 64/48px major-section separation; expose the four semantic roles in the System lab,
  remove component-owned outer spacing, and verify computed rhythm in both TopicLesson and
  CourseLesson without changing authored content or public component APIs — _Depends on:_ F20, F22
- [x] `F24` Correct the shared desktop lesson rail so the progress block is anchored to the actual
  bottom edge of its sticky column rather than to a mismatched viewport-derived minimum height; preserve
  the natural narrow-layout reading order and avoid new overflow — _Depends on:_ F23
- [x] `F25` Let LessonOutline item labels wrap naturally up to two lines while reserving stable
  scrollbar and active-state geometry; clamp longer labels with an ellipsis without reintroducing
  layout shifting or horizontal overflow — _Depends on:_ F24
- [x] `F26` Increase the parent-owned spacing between related standalone learning blocks within a
  lesson concept so prose, callouts, examples and comparisons no longer visually merge, while
  preserving the established content-flow, concept and major-section rhythm roles — _Depends on:_ F23

### Infra

None

### Data

None

### Other

None

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/SPEC.md
PRODUCT.md
docs/FRONTEND.md
docs/changes/79-alchimia-public-design-system-migration.md
docs/artifacts/alchimia-public-migration-matrix.md
apps/web/src/app/styles/**
apps/web/src/app/route-state/**
apps/web/src/shared/components/**
apps/web/src/shared/styles/**
apps/web/src/entities/learning-visual/**
apps/web/src/features/lesson-practice/**
apps/web/src/features/lesson-progress/**
apps/web/src/widgets/**
apps/web/src/pages/foundation/**
apps/web/src/pages/course-overview/**
apps/web/src/pages/course-lesson/**
apps/web/src/pages/topic-lesson/**
apps/web/src/pages/privacy/**
apps/web/src/pages/design-system-lab/**
apps/web/tests/**
apps/web/e2e/**
~~~

### Do NOT touch

- TopicLesson or CourseLesson authored copy, examples, tasks, ids, publication state or ordering
- Backend, API/OpenAPI, database, consent, analytics, operations, infrastructure or deployment
  contracts
- ALCHIMIA logo geometry, public naming, metadata, manifest, favicon or social assets
- `/lab/design-system` dashboard information architecture or `/lab/lesson` authored composition
- New dependencies, runtime theme switching, dark mode, copper activation or atlas decoration
- Archived change files

---

## Contracts

See `docs/SPEC.md` §5 and §9, `docs/FRONTEND.md` §4–§8 and the Files list above. Do not hand-copy
schema, endpoint, type or environment details into this file.

---

## Gate Checks

Use the affected frontend Critical Gate for implementation work. F6 additionally requires focused
browser evidence for every public route family named in F4 plus both lab regression boundaries;
automated green does not replace architect visual approval.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Lesson shells intentionally retain an `84ch` outer article measure: prose remains capped at
  `68ch`, while code and learning visuals need the extra width. Their context bars and responsive
  outline rails are route composition, not legacy component fallbacks.
- F10 supersedes F8's initially retained collection-index link: final lesson results keep only
  available adjacent-lesson links.
- F15 supersedes F14's interim linear Mistake typography: the final component is an explicit
  error/correction comparison and keeps the authored `claim`/`explanation` API intact.

---

## Commit Message

```text
feat(change-79): migrate ALCHIMIA components and widgets
```
