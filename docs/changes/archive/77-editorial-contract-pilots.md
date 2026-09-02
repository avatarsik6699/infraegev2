# CHANGE 77 — Editorial Contract Pilots

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `77` |
| Slug | `editorial-contract-pilots` |
| Title | Editorial Contract Pilots |
| Status | `archived` |
| Branch | `feature/77-editorial-contract-pilots` |

---

## Goal

Prove the ALCHIMIA lesson editorial contract on two deliberately different published lessons:
the introductory Python CourseLesson «Первая программа» and the advanced EGE TopicLesson
«Рекурсивные алгоритмы». Make both narratives easier to enter and follow by introducing ideas
gradually, explaining terminology at first use and connecting adjacent sections, while preserving
the approved facts, learning sequence, examples, tasks and all product/runtime behavior.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Audit and revise «Первая программа» as the beginner-side pilot: establish a familiar
  starting point, introduce every new term in context, make transitions between concept blocks
  explicit and keep the existing factual content, examples, section order, ids and practice set
  intact — _Depends on:_ T1
- [x] `F2` Audit and revise «Рекурсивные алгоритмы» as the advanced-side pilot: bridge from concrete
  computation to recursive terminology and implementation choices step by step, strengthen
  transitions and keep the existing mathematics, examples, section order, ids and practice set
  intact — _Depends on:_ T1
- [x] `F3` Reconcile focused content and browser contracts for both pilots, proving unchanged
  publication/navigation/progress behavior, stable section anchors and task associations, readable
  desktop/breakpoint/mobile/zoom layouts, keyboard access, no-JavaScript output and clean browser
  console — _Depends on:_ F1, F2
- [x] `F4` Stabilize the browser evidence after Change 77 exposed an overloaded recursion journey
  exhausting its global timeout while entering the viewport recheck: keep the strict instant
  top-of-document assertion and separate stateful practice from responsive/runtime coverage without
  fixed waits, longer timeouts or weaker observable checks — _Depends on:_ F3

### Infra

None

### Data

None

### Other

- [x] `T1` Record the shared editorial acceptance baseline from `docs/SPEC.md` §1.4 and §2.3,
  `docs/FRONTEND.md` §6–§6.1 and the learning-science checklist: calm human narration, one new idea
  at a time, terms explained at first use, purposeful examples and no decorative or factual scope
  expansion — _Depends on:_ —
- [x] `T2` Compare both completed pilots against the same baseline and document only non-obvious
  deviations or residual risks for architect review before any remaining-lesson migration begins
  — _Depends on:_ F3

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/changes/77-editorial-contract-pilots.md
apps/web/src/entities/course/content/python-first-program.lesson.tsx
apps/web/src/entities/lesson/content/rekursiya.lesson.tsx
apps/web/tests/course-foundation.test.ts
apps/web/tests/lesson-content-contract.test.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/pages/topic-lesson.page.ts
apps/web/e2e/pages/lesson-page.assertions.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- `content/tasks/**`, answer variants, checker tolerances, task ids or task associations
- Course/lesson registries, route slugs, publication state, access tiers, mastery thresholds or
  progress/storage contracts
- Shared components, theme, tokens, layouts, public chrome or `/lab/**`
- Other TopicLesson or CourseLesson authored content
- Backend, API/OpenAPI, database, analytics, operations, delivery or infrastructure contracts
- Archived change files

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–§2.3, §5 and §8, `docs/FRONTEND.md` §6–§6.1, the learning-science
checklist and the Files list above. The two published lessons remain structurally and behaviorally
the same; this change edits learner-facing narrative only and does not authorize the migration
planned for Changes 78–82.

---

## Gate Checks

Use the affected frontend Critical Gate for implementation work. F3 additionally requires focused
browser evidence for both pilot lessons at desktop, breakpoint/zoom and mobile widths, plus
no-JavaScript, keyboard, overflow and console checks. Before shipping, the architect reviews both
rendered narratives as the human content-quality checkpoint for the remaining migration.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Both pilots use the same editorial baseline: familiar situation → term at first use → concrete
  demonstration → generalization/brief retrieval → practice → observable result. The rewrite adds
  connective prose but deliberately retains every section id, example, code sample, practice id,
  publication field and runtime boundary.
- Automated comparison found no structural deviation between the two pilots. Human approval of
  the rendered narratives remains the checkpoint before shipping Change 77 or beginning Changes
  78–82.
- The original recursion smoke journey could consume its complete 30-second budget before viewport
  checks. Stateful practice/reading evidence and responsive/runtime evidence now run as independent
  journeys, while `openLessonAtTop` uses instant scrolling so the strict top assertion cannot be
  restarted by the application's smooth-scroll style.

---

## Commit Message

```text
feat(change-77): refine two lesson narratives
```
