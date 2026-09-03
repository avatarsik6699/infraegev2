# CHANGE 81 — Python Loops Editorial Batch

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `81` |
| Slug | `python-loops-editorial-batch` |
| Title | Python Loops Editorial Batch |
| Status | `active` |
| Branch | `feature/81-python-loops-editorial-batch` |

---

## Goal

Apply the approved Change 77 editorial contract to the complete Python course module «Циклы»:
`for`/`range`, `while`, loop state and digit processing. Improve entry points, first-use term
explanations and transitions without changing facts, teaching sequence, examples, practice,
publication state or product behavior, and stop before «Строки и коллекции» so this batch can
receive independent architect approval.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Audit and revise «for и range: повторяем известное число раз» and «while: повторяем,
  пока условие верно»: connect repetition to the already established conditions model, introduce
  each loop term and boundary where it first matters, and preserve all authored reasoning,
  examples, code, section ids/order and practice sets — _Depends on:_ T1
- [x] `F2` Audit and revise «Счётчики, накопители и границы цикла» and «Цифры числа: деление
  нацело и остаток»: move from tracing one iteration to accumulated state and digit processing one
  idea at a time, explain each operation in context, and preserve all authored reasoning,
  examples, code, section ids/order and practice sets — _Depends on:_ T1
- [x] `F3` Reconcile focused structural/content and Page Object assertions for all four lessons,
  proving unchanged publication, navigation, section anchors, task associations, progress,
  rich-practice rendering and SSR/no-JavaScript behavior — _Depends on:_ F1, F2
- [x] `F4` Verify the complete batch in the browser: render every lesson with clean console and no
  horizontal overflow, cover the batch boundaries at desktop, breakpoint/zoom and mobile widths,
  and retain keyboard/no-JavaScript practice access without expanding shared UI behavior —
  _Depends on:_ F3

### Infra

None

### Data

None

### Other

- [x] `T1` Inventory the four lessons against the approved Change 77 baseline and the active
  visual/rich-practice contracts, recording their immutable facts, distinctions, examples, code,
  section ids/order and five task ids before editing — _Depends on:_ —
- [x] `T2` Compare the completed batch against `docs/SPEC.md` §2.3 and the learning-science
  checklist, recording only non-obvious deviations or residual risks for architect review before
  shipping or beginning Change 82 — _Depends on:_ F4

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/changes/81-python-loops-editorial-batch.md
apps/web/src/entities/course/content/python-for-range.lesson.tsx
apps/web/src/entities/course/content/python-while.lesson.tsx
apps/web/src/entities/course/content/python-loop-state.lesson.tsx
apps/web/src/entities/course/content/python-number-digits.lesson.tsx
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
checklist and the Files list above. Changes 77–80 establish the editorial, visual and
rich-practice baselines; this change edits learner-facing narrative only and does not authorize
later Python modules or either TopicLesson.

---

## Gate Checks

Use the affected frontend Critical Gate for implementation work. F4 additionally requires focused
browser evidence for all four lessons, with desktop/breakpoint/mobile coverage across the batch,
keyboard and no-JavaScript practice access, overflow checks and clean console. Before shipping,
the architect reviews the four rendered narratives as this batch's human Content Quality Gate.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Pre-edit baseline: section ids stay `model/trace/pitfall/workflow`,
  `model/trace/pitfall/workflow`, `model/trace/other-state/pitfall/workflow` and
  `one-step/loop/zero/procedure`. Each lesson retains its five publication-owned task ids, all
  existing examples and code, `published` status, `free` access and `0.8` mastery threshold.
- The completed comparison found no structural, factual or runtime deviation: the rewrite adds
  familiar entry points, first-use definitions and bridges between concepts while retaining the
  approved visual and rich-practice contracts. Human review of all four rendered narratives
  remains the Content Quality Gate before shipping or beginning Change 82.

---

## Commit Message

```text
feat(change-81): refine Python loops narratives
```
