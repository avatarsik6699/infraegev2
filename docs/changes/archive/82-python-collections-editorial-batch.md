# CHANGE 82 — Python Collections Editorial Batch

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `82` |
| Slug | `python-collections-editorial-batch` |
| Title | Python Collections Editorial Batch |
| Status | `archived` |
| Branch | `feature/82-python-collections-editorial-batch` |

---

## Goal

Apply the approved Change 77 editorial contract to the complete Python course module «Строки и
коллекции»: strings, lists, sets, dictionaries, sorting/search and comprehensions. Build a calm
progression from processing one sequence to choosing and transforming the appropriate collection
without changing facts, teaching sequence, examples, practice, publication state or product
behavior, and stop before «Функции» for independent architect approval.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Audit and revise «Строки: символы, индексы и срезы» and «Списки: храним и изменяем
  последовательность»: connect digit-by-digit processing to sequence traversal, introduce
  indexing/slicing and mutability where they first matter, and preserve all authored reasoning,
  examples, code, section ids/order and practice sets — _Depends on:_ T1
- [x] `F2` Audit and revise «Множества: оставляем уникальные значения» and «Словари: связываем
  ключи и значения»: move from familiar lists to purpose-specific collections one distinction at
  a time, explain uniqueness, unordered traversal, keys and safe lookup in context, and preserve
  all authored reasoning, examples, code, section ids/order and practice sets — _Depends on:_ T1
- [x] `F3` Audit and revise «Сортировка и поиск в коллекции» and «Включения: собираем коллекции
  коротко»: connect the established collection models to deliberate search/order choices and only
  then to concise comprehensions, retaining explicit readable logic when compression would hide
  reasoning; preserve all examples, code, section ids/order and practice sets — _Depends on:_ T1
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
  shipping or beginning Change 83 — _Depends on:_ F5

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/changes/82-python-collections-editorial-batch.md
apps/web/src/entities/course/content/python-strings.lesson.tsx
apps/web/src/entities/course/content/python-lists.lesson.tsx
apps/web/src/entities/course/content/python-sets.lesson.tsx
apps/web/src/entities/course/content/python-dictionaries.lesson.tsx
apps/web/src/entities/course/content/python-sorting-search.lesson.tsx
apps/web/src/entities/course/content/python-comprehensions.lesson.tsx
apps/web/tests/course-foundation.test.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- `content/tasks/**`, task-owned assets, answer variants, checker tolerances, task ids or task
  associations
- Earlier CourseLessons, later Python modules, either TopicLesson or their authored content
- Course/lesson registries, route slugs, publication state, access tiers, mastery thresholds or
  progress/storage contracts
- Shared components, theme, tokens, layouts, public chrome or `/lab/**`
- Backend, API/OpenAPI, database, analytics, operations, delivery or infrastructure contracts
- Archived change files

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–§2.3, §5 and §8, `docs/FRONTEND.md` §6–§6.1, the learning-science
checklist and the Files list above. Changes 77–81 establish the editorial, visual and
rich-practice baselines; this change edits learner-facing narrative only and does not authorize
later Python modules or either TopicLesson.

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
- The existing loops-only Page Object helpers were renamed to editorial-lesson helpers so the same
  navigation, SSR/no-JavaScript, rhythm and overflow contract covers both batches without a second
  implementation.
- Comparison with SPEC §2.3 and the learning-science checklist found no factual, structural,
  practice or runtime deviation. Human review of the six rendered narratives remains the required
  Content Quality Gate before shipping or starting Change 83.

---

## Commit Message

```text
feat(change-82): refine Python collections narratives
```
