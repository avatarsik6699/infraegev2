# CHANGE 56 — Python Course Foundation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `56` |
| Slug | `python-course-foundation` |
| Title | Python Course Foundation |
| Status | `archived` |
| Branch | `feature/56-python-course-foundation` |

---

## Goal

Deliver the first complete, review-only vertical slice of the standalone «Python с нуля для ЕГЭ»
mini-course: a course overview, one real CourseLesson, independent practice ownership, local
progress and truthful early-access UX. Course data and navigation must not link to or duplicate an
EGE Topic, and no untrusted Python code is executed by the product.

---

## Backlog

### Backend

- [x] `B1` Extend strict Task ownership with `course_lesson_ids`, reject orphan tasks and preserve
  the existing checker HTTP contract and secret boundary — _Depends on:_ D1

### Frontend

- [x] `F1` Add distinct typed Course/CourseModule/CourseLesson definitions, registries and
  cross-boundary validation without introducing a generic lesson engine or Topic relationship —
  _Depends on:_ T1
- [x] `F2` Build the SSR/no-JS Course overview and derived progress/continue behavior for only
  published CourseLesson stores, with truthful `early_access` copy and no course-wide reset —
  _Depends on:_ F1, D1
- [x] `F3` Build the SSR/no-JS CourseLesson route and page by reusing the existing content,
  practice, checker and progress primitives while keeping course-specific composition and mobile
  hierarchy — _Depends on:_ F1, B1, D1
- [x] `F4` Extend consented analytics and registry-driven SEO/discovery so review course routes
  stay direct-only/noindex and a later status flip can expose them through home, sitemap and
  prerender without hand-maintained route lists — _Depends on:_ F2, F3
- [x] `F5` Add focused Vitest and fixture/Page-Object Playwright coverage for overview, first
  lesson, incorrect/correct/reload/result navigation, keyboard, mobile, zoom and no-JS behavior —
  _Depends on:_ F4
- [x] `F6` Humanize the Python course overview copy, replace button-like course CTAs with links,
  and present the nine numbered modules with truthful unavailable states — _Depends on:_ F2
- [x] `F7` Decompose the course overview into readable local components and remove redundant page
  styles without globalizing course-specific CSS — _Depends on:_ F6
- [x] `F8` Review course and lesson progress ownership, retain the smallest domain stores without a
  new state dependency, and remove only confirmed duplicate or unused surface — _Depends on:_ F7
- [x] `F9` Replace manual Course/Lesson external stores with one SSR-safe persisted Zustand
  registry, semantic hooks and backward-compatible lesson progress hydration — _Depends on:_ F8
- [x] `F10` Remove nested ternaries across the web workspace and enforce the rule in ESLint without
  changing existing user-visible behavior — _Depends on:_ F9
- [x] `F11` Enforce strict same-layer slice boundaries for entities, features, widgets and pages,
  including aliased and relative imports, and remove the existing Course/Topic/practice boundary
  crossings through explicit shared primitives and page/widget composition — _Depends on:_ F10
- [x] `F12` Extract reusable SSR-safe external-store, scoped Zustand and persistence lifecycle
  infrastructure into shared, leaving lesson progress as concise domain state and preserving all
  existing progress keys and migrations — _Depends on:_ F11
- [x] `F13` Consolidate analytics consent and product events into one feature, keep only the browser
  analytics adapter in shared, and replace the layout-shifting consent UI with an unobtrusive fixed
  bottom prompt plus an accessible public-header settings popover — _Depends on:_ F12
- [x] `F14` Update architecture documentation and focused tests for the new boundaries, persistence
  primitives, analytics UX and no-JavaScript behavior, then run the affected frontend Critical
  Gate and required browser/tooling checks — _Depends on:_ F13
- [x] `F15` Restore the project-owned containerized development lifecycle so `make dev` starts a
  healthy application and `make stop`/`make down` stop or tear down only `infraege-dev`, with live
  HTTP and container-state evidence — _Depends on:_ F14
- [x] `F16` Minimize the public data-processing disclosure, move analytics choice management from
  the header to `/privacy`, and add the architect-approved Telegram invitation to every public
  footer with accessible responsive evidence — _Depends on:_ F15
- [x] `F17` Replace the analytics prompt chart marker with the architect-requested pointing-fingers
  emoji and clarify its benefit, data exclusions and refusal consequence without changing consent
  semantics — _Depends on:_ F16
- [x] `F18` Humanize the complete first CourseLesson copy, its five practice tasks and the shared
  learner-facing practice/progress labels used on the page while preserving lesson structure,
  checker answers, ownership and review-only publication semantics — _Depends on:_ F17
- [x] `F19` Remove the redundant standalone CourseLesson checkpoint heading while preserving its
  local checkpoint label and outline anchor, renumber the remaining major sections, and codify the
  approved humanized lesson-copy style in the binding frontend contract — _Depends on:_ F18
- [x] `F20` Remove dead Popover infrastructure and unused public exports found by the final
  graph-grounded review without changing runtime behavior — _Depends on:_ F19

### Infra

None

### Data

- [x] `D1` Author the broad independent Python curriculum, the complete «Первая программа: ввод,
  вычисление и вывод» CourseLesson and five server-owned tasks using local Python 3 as the primary
  workspace and Programiz only as an explicit third-party fallback — _Depends on:_ T1

### Other

- [x] `T1` Refresh SPEC, FRONTEND and product context for independent Course/CourseLesson
  ownership, early-access progress semantics, routes and publication boundary — _Depends on:_ —
- [x] `T2` Validate every example and accepted answer with Python 3.12+, run content-link and
  documentation checks, and leave Course/CourseLesson in `review` for human content/visual
  approval — _Depends on:_ B1, F5

---

## Files

### Create / modify

~~~
PRODUCT.md
docs/SPEC.md
docs/FRONTEND.md
docs/changes/56-python-course-foundation.md
apps/api/app/modules/content/schemas.py
apps/api/tests/test_tasks_api.py
apps/web/src/entities/course/**
apps/web/src/entities/lesson/**
apps/web/src/features/course-progress/**
apps/web/src/features/lesson-progress/**
apps/web/src/features/lesson-practice/**
apps/web/src/features/product-analytics/**
apps/web/src/features/analytics-consent/**
apps/web/src/features/analytics/**
apps/web/src/entities/practice-task/**
apps/web/src/widgets/lesson-practice-flow/**
apps/web/src/app/providers/**
apps/web/src/pages/course-overview/**
apps/web/src/pages/course-lesson/**
apps/web/src/pages/topic-lesson/**
apps/web/src/pages/lesson-design-lab/**
apps/web/src/pages/design-system-lab/**
apps/web/src/app/route-state/**
apps/web/src/shared/components/code-block/**
apps/web/src/shared/components/popover/**
apps/web/src/shared/components/text-link/**
apps/web/src/shared/lib/**
apps/web/scripts/verify-layer-boundaries.mjs
apps/web/src/pages/foundation/**
apps/web/src/routes/courses.*
apps/web/src/routes/__root.tsx
apps/web/src/routes/sitemap[.]xml.ts
apps/web/tests/**
apps/web/e2e/**
apps/web/eslint.config.js
apps/web/package.json
pnpm-lock.yaml
content/tasks/python-first-program-*.json
scripts/validate-content-links.mjs
~~~

### Do NOT touch

- Existing Topic lesson wording, practice answers, publication status or `/ege/*` route behavior
- `content/topics/**` or a `content/courses/*.json` shadow model
- Production infrastructure, database, accounts, payments, analytics consent semantics or secrets
- Built-in Python runner, sandbox, code submission, hard course locks or Topic/CourseLesson links
- Public publication status for the course or CourseLesson before architect review

---

## Contracts

See `docs/SPEC.md` §2–§5 and the Files list above. Do not hand-copy the schema or route contracts
into this file; the codebase and `SPEC.md` are the source of truth.

---

## Gate Checks

In addition to the affected Critical Gate, run `node scripts/validate-content-links.mjs`, execute
all authored Python examples on Python 3.12+, and use the required browser tooling for desktop,
150%-zoom, 390px mobile, keyboard, no-JavaScript and console evidence. Review routes must remain
absent from home and sitemap while still returning complete direct-route SSR.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Topic, CourseLesson, Course overview and labs proved a shared cross-route progress owner, so one
  provider-scoped Zustand registry now owns subscriptions and persistence; course progress remains
  a pure derived selector, and legacy lesson keys migrate lazily on first access.
- Course layout/state CSS stays local; existing Typography resets, global anchor behavior and the
  neutral Badge own the reusable parts instead of widening `app/styles.css`.

---

## Commit Message

```
feat(change-56): add Python course foundation
```
