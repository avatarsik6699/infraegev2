# CHANGE 78 — Python Foundations Editorial Batch

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `78` |
| Slug | `python-foundations-editorial-batch` |
| Title | Python Foundations Editorial Batch |
| Status | `active` |
| Branch | `feature/78-python-foundations-editorial-batch` |

---

## Goal

Apply the approved Change 77 editorial contract to the four remaining published lessons in the
Python course modules «Старт и отладка» and «Условия»: numbers, errors, simple conditions and
compound conditions. Improve entry points, term introductions and transitions without changing
facts, teaching sequence, examples, tasks, publication state or product behavior, and stop before
the «Циклы» module so this first migration batch can receive independent architect approval.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Audit and revise «Числа, типы и арифметические выражения» and «Ошибки: читаем сообщение
  и находим причину»: begin from behavior already established by «Первая программа», explain each
  unfamiliar term where it first matters and connect adjacent concepts while preserving all
  authored reasoning, examples, code, section ids/order and practice sets — _Depends on:_ T1
- [x] `F2` Audit and revise «Условия: сравнения и выбор из двух вариантов» and «Несколько ветвей и
  составные условия»: move from familiar comparisons to branching and compound logic one idea at a
  time, explain syntax/terms in context and preserve all authored reasoning, examples, code,
  section ids/order and practice sets — _Depends on:_ T1
- [x] `F3` Reconcile focused structural/content and Page Object assertions for all four lessons,
  proving unchanged publication, navigation, section anchors, task associations, progress and
  SSR/no-JavaScript behavior — _Depends on:_ F1, F2
- [x] `F4` Verify the complete batch in the browser: render every lesson with clean console and no
  horizontal overflow, cover the batch boundaries at desktop, breakpoint/zoom and mobile widths,
  and retain keyboard/no-JavaScript practice access without expanding shared UI behavior —
  _Depends on:_ F3

### Infra

None

### Data

None

### Other

- [x] `T1` Inventory the four lessons against the Change 77 acceptance baseline and record their
  immutable facts, distinctions, examples, code samples, section ids/order and five task ids before
  editing — _Depends on:_ —
- [x] `T2` Compare the completed batch against `docs/SPEC.md` §2.3 and the learning-science
  checklist, recording only non-obvious deviations or residual risks for architect review before
  shipping or beginning Change 79 — _Depends on:_ F4

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/changes/78-python-foundations-editorial-batch.md
apps/web/src/entities/course/content/python-numbers.lesson.tsx
apps/web/src/entities/course/content/python-errors.lesson.tsx
apps/web/src/entities/course/content/python-conditions.lesson.tsx
apps/web/src/entities/course/content/python-compound-conditions.lesson.tsx
apps/web/tests/course-foundation.test.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- `content/tasks/**`, answer variants, checker tolerances, task ids or task associations
- «Первая программа», later Python CourseLessons, either TopicLesson or their authored content
- Course/lesson registries, route slugs, publication state, access tiers, mastery thresholds or
  progress/storage contracts
- Shared components, theme, tokens, layouts, public chrome or `/lab/**`
- Backend, API/OpenAPI, database, analytics, operations, delivery or infrastructure contracts
- Archived change files

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–§2.3, §5 and §8, `docs/FRONTEND.md` §6–§6.1, the learning-science
checklist and the Files list above. Change 77 is the editorial baseline; this batch remains a
learner-facing narrative migration and does not authorize the later course modules or TopicLesson.

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

- Pre-edit baseline: section ids stay `types/operations/precedence/workflow`,
  `error-as-clue/read-bottom-up/syntax-error/name-error/type-or-value/fix-and-rerun`,
  `comparison-result/if-branch/if-else/comparison-boundaries/test-both-branches` and
  `model/trace/pitfall/workflow`. Each lesson retains its five publication-owned task ids, all
  existing code samples and examples, `published` status, `free` access and `0.8` mastery threshold.
- The completed comparison found no structural, factual or runtime deviation: the rewrite adds
  bridges and first-use definitions, while focused tests preserve the baseline above. Visual-learning
  checklist items are not applicable because the batch adds no visual; course-wide interleaving stays
  outside this editorial scope. The architect approved all four rendered narratives on 2026-09-02,
  completing the human Content Quality Gate before shipping.

---

## Commit Message

```text
feat(change-78): refine Python foundation narratives
```
