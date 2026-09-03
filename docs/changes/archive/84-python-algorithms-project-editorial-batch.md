# CHANGE 84 — Python Algorithms and Final Project Editorial Batch

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `84` |
| Slug | `python-algorithms-project-editorial-batch` |
| Title | Python Algorithms and Final Project Editorial Batch |
| Status | `archived` |
| Branch | `feature/84-python-algorithms-project-editorial-batch` |

---

## Goal

Complete the four-batch migration promised by `docs/SPEC.md` by applying the approved Change 77
editorial contract to the two algorithms lessons and the four-step final task-manager project.
Build a calm path from enumerating and selecting candidates to assembling, persisting, testing and
refining one coherent program without changing facts, teaching sequence, examples, practice,
publication state or product behavior; keep this final batch independently reviewable by the
architect.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Audit and revise «Полный перебор: строим и проверяем варианты» and «Отбор результата:
  ограничения, минимум и максимум»: connect familiar loops and conditions to candidate generation,
  admissibility and choosing the best result, introduce each distinction where it first matters,
  and preserve all authored reasoning, examples, code, section ids/order and practice sets —
  _Depends on:_ T1
- [x] `F2` Audit and revise «Добавляем дела и выводим список» and «Отмечаем выполненное,
  редактируем и удаляем»: turn familiar collections, functions and search into the first usable
  command loop, then explain stable identifiers and mutations through the learner's growing
  program while preserving all authored reasoning, examples, code, section ids/order and practice
  sets — _Depends on:_ T1
- [x] `F3` Audit and revise «Сохраняем дела между запусками» and «Проверяем весь сценарий и
  наводим порядок в коде»: connect files, JSON, expected errors and decomposition to persistence,
  recovery, whole-scenario testing and a final readable program without hiding intermediate
  reasoning; preserve all authored reasoning, examples, code, section ids/order and practice sets
  — _Depends on:_ T1
- [x] `F4` Reconcile focused structural/content and Page Object assertions for all six lessons,
  proving unchanged publication, navigation, section anchors, task associations, progress,
  rich-practice rendering and SSR/no-JavaScript behavior — _Depends on:_ F1, F2, F3
- [x] `F5` Verify the complete batch in the browser: render every lesson with clean console and no
  horizontal overflow, cover the batch boundaries and final-project sequence at desktop,
  breakpoint/zoom and mobile widths, and retain keyboard/no-JavaScript practice access without
  expanding shared UI behavior — _Depends on:_ F4

### Infra

None

### Data

None

### Other

- [x] `T1` Inventory the six lessons against the approved Change 77 baseline and the active
  visual/rich-practice contracts, recording their immutable facts, distinctions, examples, code,
  section ids/order and five task ids before editing — _Depends on:_ —
- [x] `T2` Compare the completed batch against `docs/SPEC.md` §2.3 and the learning-science
  checklist, recording only non-obvious deviations or residual risks for architect review and
  confirming that the scoped Changes 81–84 editorial migration is ready for final human approval
  — _Depends on:_ F5

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/changes/84-python-algorithms-project-editorial-batch.md
apps/web/src/entities/course/content/python-bruteforce.lesson.tsx
apps/web/src/entities/course/content/python-select-result.lesson.tsx
apps/web/src/entities/course/content/python-todo-start.lesson.tsx
apps/web/src/entities/course/content/python-todo-actions.lesson.tsx
apps/web/src/entities/course/content/python-todo-storage.lesson.tsx
apps/web/src/entities/course/content/python-independent-program.lesson.tsx
apps/web/tests/course-foundation.test.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- `content/tasks/**`, task-owned assets, answer variants, checker tolerances, task ids or task
  associations
- Earlier CourseLessons, including all Change 77–83 editorial lessons, either TopicLesson or their
  authored content
- Course/lesson registries, route slugs, publication state, access tiers, mastery thresholds or
  progress/storage contracts
- Shared components, theme, tokens, layouts, public chrome or `/lab/**`
- Backend, API/OpenAPI, database, analytics, operations, delivery or infrastructure contracts
- Archived change files

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–§2.3, §5 and §8, `docs/FRONTEND.md` §6–§6.1, the learning-science
checklist and the Files list above. Changes 77–83 establish the editorial, visual and
rich-practice baselines; this change edits learner-facing narrative only and does not authorize
earlier CourseLessons, either TopicLesson or any registry, publication or product-flow change.

---

## Gate Checks

Use the affected frontend Critical Gate for implementation work. F5 additionally requires focused
browser evidence for all six lessons, with desktop/breakpoint/mobile coverage across the batch,
keyboard and no-JavaScript practice access, overflow checks and clean console. Before shipping,
the architect reviews the six rendered narratives as this batch's human Content Quality Gate.

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work [XX] review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

- The executable baseline in `course-foundation.test.ts` records all six original section-id
  sequences and their five task ids; publication remains `published`/`free` with the explicit
  `0.8` threshold, while code snapshots, worked examples, mistakes and procedures are unchanged.
- The established editorial-lesson Page Object contract covers all six routes without a new
  route-specific helper; focused tests retain navigation, SSR/no-JavaScript, rhythm, keyboard and
  overflow evidence, and the existing final-project journeys continue to verify its four-step
  sequence.
- Comparison with SPEC §2.3 and the learning-science checklist found no factual, structural,
  practice or runtime deviation. Human review of the six rendered narratives remains the required
  Content Quality Gate before shipping.

---

## Commit Message

```text
feat(change-84): refine Python algorithms and project narratives
```
