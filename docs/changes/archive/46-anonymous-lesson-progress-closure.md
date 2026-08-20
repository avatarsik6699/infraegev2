# CHANGE 46 — Anonymous Lesson Progress Closure

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `46` |
| Slug | `anonymous-lesson-progress-closure` |
| Title | Anonymous Lesson Progress Closure |
| Status | `archived` |
| Branch | `feature/46-anonymous-lesson-progress-closure` |

---

## Goal

Close the learner-facing loop identified by Change 45 without adding accounts, analytics or new
content. The result of either published lesson must explain the existing browser-local solved and
mastery state, let the learner reset only that lesson, and expose truthful registry-derived paths
to the other published lesson and all topics. The existing checker, per-lesson localStorage store,
SSR/no-JavaScript content and publication registry remain the owners of their current concerns.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Adapt the existing `LessonProgress` presentation for result-section hierarchy without
  changing its solved/mastery semantics, persistence schema or ownership; keep the public lesson
  page as the single creator of the injected per-lesson store — _Depends on:_ —
- [x] `F2` Add a focused result-progress component that subscribes to the injected store and shows
  solved count plus the existing not-started/in-progress/mastered/all-solved state for the current
  lesson, while authored result content and SSR/no-JavaScript reading remain truthful — _Depends
  on:_ F1
- [x] `F3` Add an explicit, keyboard-accessible confirmation flow that clears only the current
  lesson's accepted answers and solved ids, immediately restores its practice/result UI, supports
  cancellation and leaves the other lesson untouched — _Depends on:_ F2
- [x] `F4` Add result navigation derived only from `lessonPublications`: a real SSR/no-JavaScript
  link to all topics and links to other `published` lessons, labelled as available materials rather
  than personalized or semantic recommendations — _Depends on:_ F2
- [x] `F5` Integrate progress, reset and continuation into the existing result section at desktop,
  150% zoom and narrow mobile widths without moving progress into the title/outline, adding a card
  stack, hiding learning content or weakening the 40px target/focus/overflow rules — _Depends on:_
  F3, F4
- [x] `F6` Reset the practice feature's transient active-task selection when registry navigation
  reuses the public lesson page for another lesson, so the destination immediately exposes its
  first task without changing persisted progress, drafts or auto-advance semantics — _Depends on:_
  F4

### Infra

None

### Data

None

### Other

- [x] `T1` Add focused Vitest coverage for result hierarchy and every progress state, confirmed and
  cancelled lesson-only reset, immediate subscriber updates, persisted accepted-answer removal,
  and cross-lesson isolation — _Depends on:_ F3, F5
- [x] `T2` Extend the existing topic Page Object and fixture-owned Playwright journey to cover an
  incorrect submission, one recoverable checker failure with no hidden retry, explicit retry,
  accepted-answer reload persistence, visible result/mastery, lesson-only reset and navigation to
  the other published lesson and all topics; specs must not use low-level Playwright APIs —
  _Depends on:_ T1
- [x] `T3` Verify both published lessons with TypeScript LSP plus the affected Critical Gate and
  required browser tooling: current console, screenshots, keyboard/focus, desktop, 150% zoom,
  narrow mobile and SSR/no-JavaScript continuity — _Depends on:_ T2

---

## Files

### Create / modify

~~~
apps/web/src/features/lesson-progress/lesson-progress.tsx
apps/web/src/features/lesson-progress/lesson-progress.types.ts
apps/web/src/features/lesson-progress/lesson-progress.module.css
apps/web/src/features/lesson-practice/model/use-lesson-practice-model.ts
apps/web/src/pages/topic-lesson/topic-lesson-page.tsx
apps/web/src/pages/topic-lesson/topic-lesson-page.module.css
apps/web/src/pages/topic-lesson/components/topic-lesson-result.tsx
apps/web/src/pages/topic-lesson/components/topic-lesson-progress.tsx
apps/web/tests/lesson-design-system.test.tsx
apps/web/e2e/pages/topic-lesson.page.ts
apps/web/e2e/smoke.spec.ts
docs/changes/46-anonymous-lesson-progress-closure.md
~~~

### Do NOT touch

- `apps/api/**`, generated OpenAPI contracts or checker response semantics
- `content/**`, lesson wording, tasks, publication status or new relationship data
- `apps/web/src/pages/lesson-design-lab/**` or the lab's isolated progress contract
- Accounts, synchronized progress, analytics/Umami events, catalogs, search or global stores
- Lesson outline/title progress, task auto-advance or invented recommendation semantics
- Infrastructure, production runtime, credentials or operations/sre-kit state

---

## Contracts

See `docs/SPEC.md` §1.4, §3 and §5.2–§5.4, Change 45's `PR-01`–`PR-03`/`PR-06`, and the Files list
above. The existing publication registry, progress store and checker boundary remain the source of
truth; do not hand-copy their schemas or introduce a parallel state model.

---

## Gate Checks

In addition to the affected frontend Critical Gate, run one fixture/Page-Object browser journey
covering incorrect → recoverable failure → explicit retry → accepted reload → visible result →
lesson-only reset → other published lesson → all topics. Verify current console and screenshots at
desktop, 150% zoom and narrow mobile widths, keyboard confirmation/focus behavior, no horizontal
overflow and SSR/no-JavaScript availability of authored result content plus continuation links.
Exercise both published lesson configurations and prove a reset never clears the other lesson.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- TanStack reuses the dynamic lesson-page component between published slugs; the practice model
  therefore derives a valid first-task fallback when its transient selection belongs to the prior
  lesson, without clearing either lesson's persisted progress.

---

## Commit Message

```
feat(change-46): close anonymous lesson progress loop
```
