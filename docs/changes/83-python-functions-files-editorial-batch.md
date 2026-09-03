# CHANGE 83 — Python Functions and Files Editorial Batch

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `83` |
| Slug | `python-functions-files-editorial-batch` |
| Title | Python Functions and Files Editorial Batch |
| Status | `active` |
| Branch | `feature/83-python-functions-files-editorial-batch` |

---

## Goal

Apply the approved Change 77 editorial contract to the six remaining lessons between collections
and algorithms: functions, program decomposition, iterators/generators, expected exceptions, files
and tables. Build a calm path from naming one computation to processing external rows without
changing facts, teaching sequence, examples, practice, publication state or product behavior;
preserve the already-approved recursion lesson and stop before the algorithms module for
independent architect approval.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Audit and revise «Функции: параметры и возвращаемый результат» and «Разбиваем
  программу на понятные части»: introduce a named computation from logic the learner already
  writes, distinguish parameters/arguments and `return`/printing where they first matter, then
  show decomposition through explicit data flow while preserving all authored reasoning,
  examples, code, section ids/order and practice sets — _Depends on:_ T1
- [x] `F2` Audit and revise «Итераторы и генераторы: значения по одному» and «Ожидаемые ошибки:
  try и except»: reveal the existing `for` model one step at a time, keep generators optional,
  reconnect expected exceptions to the earlier debugging model and explain recovery boundaries in
  context; preserve all authored reasoning, examples, code, section ids/order and practice sets —
  _Depends on:_ T1
- [x] `F3` Audit and revise «Читаем данные из файла» and «Обрабатываем строки и таблицы»: connect
  strings, iterators, exceptions and collection records to external text processing, introduce
  resource/format boundaries only when used, and preserve all authored reasoning, examples, code,
  section ids/order and practice sets — _Depends on:_ T1
- [x] `F4` Reconcile focused structural/content and Page Object assertions for all six lessons,
  proving unchanged publication, navigation, section anchors, task associations, progress,
  rich-practice rendering and SSR/no-JavaScript behavior — _Depends on:_ F1, F2, F3
- [x] `F5` Verify the complete batch in the browser: render every lesson with clean console and no
  horizontal overflow, cover the batch boundaries at desktop, breakpoint/zoom and mobile widths,
  and retain keyboard/no-JavaScript practice access without expanding shared UI behavior —
  _Depends on:_ F4

### Infra

None

### Data

None

### Other

- [x] `T1` Inventory the six lessons against the approved Change 77 baseline and the active
  visual/rich-practice contracts, recording their immutable facts, distinctions, examples, code,
  section ids/order and five task ids before editing — _Depends on:_ —
- [x] `T2` Compare the completed batch against `docs/SPEC.md` §2.3 and the learning-science
  checklist, recording only non-obvious deviations or residual risks for architect review before
  shipping or beginning Change 84 — _Depends on:_ F5

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/changes/83-python-functions-files-editorial-batch.md
apps/web/src/entities/course/content/python-functions.lesson.tsx
apps/web/src/entities/course/content/python-program-parts.lesson.tsx
apps/web/src/entities/course/content/python-iterators-generators.lesson.tsx
apps/web/src/entities/course/content/python-exceptions.lesson.tsx
apps/web/src/entities/course/content/python-files.lesson.tsx
apps/web/src/entities/course/content/python-tables.lesson.tsx
apps/web/tests/course-foundation.test.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- `content/tasks/**`, task-owned assets, answer variants, checker tolerances, task ids or task
  associations
- Earlier CourseLessons, the already-approved `python-recursion.lesson.tsx`, later algorithms and
  final-project lessons, either TopicLesson or their authored content
- Course/lesson registries, route slugs, publication state, access tiers, mastery thresholds or
  progress/storage contracts
- Shared components, theme, tokens, layouts, public chrome or `/lab/**`
- Backend, API/OpenAPI, database, analytics, operations, delivery or infrastructure contracts
- Archived change files

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–§2.3, §5 and §8, `docs/FRONTEND.md` §6–§6.1, the learning-science
checklist and the Files list above. Changes 77–82 establish the editorial, visual and
rich-practice baselines; this change edits learner-facing narrative only and does not authorize
the recursion lesson, algorithms/final-project modules or either TopicLesson.

---

## Gate Checks

Use the affected frontend Critical Gate for implementation work. F5 additionally requires focused
browser evidence for all six lessons, with desktop/breakpoint/mobile coverage across the batch,
keyboard and no-JavaScript practice access, overflow checks and clean console. Before shipping,
the architect reviews the six rendered narratives as this batch's human Content Quality Gate.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The executable baseline in `course-foundation.test.ts` records all six original section-id
  sequences and their five task ids; publication remains `published`/`free` with the explicit
  `0.8` threshold, while the authored code, worked examples, mistakes and procedures are unchanged.
- The established editorial-lesson Page Object contract covers all six routes without a new
  route-specific helper; focused tests retain navigation, SSR/no-JavaScript, rhythm, keyboard and
  overflow evidence in separate browser contexts.
- Comparison with SPEC §2.3 and the learning-science checklist found no factual, structural,
  practice or runtime deviation. Human review of the six rendered narratives remains the required
  Content Quality Gate before shipping or beginning Change 84.

---

## Commit Message

```text
feat(change-83): refine Python functions and files narratives
```
