# CHANGE 71 — Complete and Publish Python Course

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `71` |
| Slug | `complete-python-course` |
| Title | Complete and Publish Python Course |
| Status | `archived` |
| Branch | `feature/71-complete-python-course` |

---

## Goal

Complete a coherent 28-step «Python с нуля для ЕГЭ» curriculum without splitting every
CourseLesson into separate authoring and publication changes. Audit and deepen the existing path,
add the missing EGE/Python foundations and finish with a four-lesson terminal task manager that
grows one working program step by step. Publish all lessons locally for final architect evaluation;
commit, merge, push and deploy still require the normal ship boundary.

---

## Backlog

### Backend

- [x] `B1` Add parameterized checker/API coverage for all 80 new server-owned practice tasks,
  including accepted, incorrect and normalized answers without changing the public checker
  contract — _Depends on:_ D1, D2, D3, D4, D5, D6
- [x] `B2` Extend parameterized checker/API coverage to the final 140-task course, including every
  new final-project and foundation answer variant without changing the public checker contract —
  _Depends on:_ D7, D8, D9

### Frontend

- [x] `F1` Author the review-only CourseLesson «Несколько ветвей и составные условия» with its
  complete theory, checkpoints, result and five-task sequence — _Depends on:_ D1
- [x] `F2` Author the three review-only «Циклы» CourseLesson entries (`for`/`range`, `while`, loop
  state) with complete theory, checkpoints, results and five-task sequences — _Depends on:_ D2
- [x] `F3` Author the four review-only «Строки и коллекции» CourseLesson entries (strings, lists,
  sets, dictionaries) with complete theory, checkpoints, results and five-task sequences —
  _Depends on:_ D3
- [x] `F4` Author the three review-only function/recursion CourseLesson entries (functions,
  program decomposition, recursion) with complete theory, checkpoints, results and five-task
  sequences — _Depends on:_ D4
- [x] `F5` Author the two review-only «Файлы и таблицы» CourseLesson entries with complete theory,
  checkpoints, results and five-task sequences — _Depends on:_ D5
- [x] `F6` Author the three review-only final algorithmic CourseLesson entries (brute force,
  result selection, independent program) with complete theory, checkpoints, results and
  five-task sequences — _Depends on:_ D6
- [x] `F7` Register all 16 CourseLesson definitions against their existing curriculum rows and
  add focused contract coverage proving unique membership, matching titles, private checker data,
  review-only metadata and the unchanged three-lesson public count before approval — _Depends on:_
  F1, F2, F3, F4, F5, F6, B1
- [x] `F8` After explicit architect approval, publish the 16 reviewed lessons together, move the
  course stage to `complete`, and update registry-derived overview links, aggregate progress,
  continuation, metadata, sitemap and prerender expectations for exactly 19 published lessons —
  _Depends on:_ F7, T2
- [x] `F9` Extend the Python course Page Object and browser journey to crawl every published
  lesson with clean console, canonical/indexable metadata, keyboard and no-JavaScript coverage;
  verify representative content at desktop, 150% zoom and 390px mobile without introducing
  per-lesson low-level Playwright code — _Depends on:_ F8
- [x] `F10` Allow authored code blocks with longer lines to shrink inside the CourseLesson
  explanation column so the 390px review route has no page-level horizontal overflow —
  _Depends on:_ F1
- [x] `F11` Restore the truthful review boundary after the architect superseded the original
  19-lesson approval: keep the three already public lessons published, return the other 16 lessons
  to `review`, return the course to `early_access`, and extend the ordered plan to the approved
  28-lesson trajectory — _Depends on:_ —
- [x] `F12` Audit and deepen the existing lessons from «Первая программа» through «Цифры числа» so
  each step reuses prior knowledge, has topic-proportional depth and avoids the repeated generated
  four-section rhythm without discarding sound explanations — _Depends on:_ F11, T4
- [x] `F13` Audit and deepen the existing lessons from «Строки» through «Отбор результата» with
  cumulative examples, non-duplicated retrieval checks and calm human Russian — _Depends on:_
  F11, T4
- [x] `F14` Author six review-only CourseLesson entries for numbers and expressions, digit
  processing, sorting and searching, comprehensions, iterators and generators, and expected
  exception handling — _Depends on:_ D8, F11, T4
- [x] `F15` Replace the short independent-program lesson with four review-only task-manager CourseLessons:
  add/show tasks, complete/edit/delete them, persist them in JSON, then validate and test the whole
  terminal program; every lesson starts from the prior canonical solution and ends with a complete
  next snapshot — _Depends on:_ D9, F13, F14
- [x] `F16` Register the complete 28-lesson review curriculum and update focused contracts for
  order, unique membership, stable public task ids, private checker data and the unchanged
  three-lesson public count before renewed approval — _Depends on:_ B2, F12, F13, F14, F15
- [x] `F17` With the architect's explicit local-publication authorization, publish all 25 reviewed
  lessons together, move the
  course to `complete`, and update overview, progress, continuation, metadata, sitemap and
  prerender expectations for exactly 28 lessons — _Depends on:_ F16, T8
- [x] `F18` Extend the domain Page Object and browser journeys for all 28 published routes, with
  focused responsive/no-JS/keyboard coverage for the four final project stages — _Depends on:_
  F17, F19
- [x] `F19` Remove `Todo` from the learner-facing course language, public route slugs and sample
  filename in favor of «Менеджер задач» and «Список дел», while preserving stable internal
  `python-todo-*` lesson/task ids and source filenames — _Depends on:_ F16
- [x] `F20` Rewrite the ninth module heading, summary and four lesson titles in natural Russian so
  the module names the shared final project once and each lesson row describes only its next
  meaningful step; keep overview and lesson-page titles consistent — _Depends on:_ F19
- [x] `F21` Audit and humanize all four final-project lessons end to end: replace mechanical
  exposition, repetitive transitions and template-like practice copy with calm conversational
  Russian while preserving the cumulative program, technical accuracy, task ids and checker
  contracts — _Depends on:_ F20

### Infra

None

### Data

- [x] `D1` Author five server-owned production-first tasks for compound conditions, covering
  `elif`, `and`, `or`, `not`, boundary values and one local Python run — _Depends on:_ —
- [x] `D2` Author five tasks for each of the three loop lessons, covering trace, range boundaries,
  while termination, counters, accumulators and one local Python run per lesson — _Depends on:_ —
- [x] `D3` Author five tasks for each of the four strings/collections lessons, covering indexing,
  slices, mutation, uniqueness, membership, key/value access and one local Python run per lesson —
  _Depends on:_ —
- [x] `D4` Author five tasks for each of the functions, program-parts and recursion lessons,
  covering calls, parameters, return values, decomposition, base cases, traces and one local
  Python run per lesson — _Depends on:_ —
- [x] `D5` Author five tasks for each of the files and tables lessons, using deterministic local
  fixtures/examples for reading, parsing and aggregating data without adding uploads or runtime
  code execution — _Depends on:_ —
- [x] `D6` Author five tasks for each of the brute-force, result-selection and independent-program
  lessons, covering candidate generation, constraints, min/max selection, decomposition and one
  local Python run per lesson — _Depends on:_ —
- [x] `D7` Audit the existing 90 pre-capstone tasks for cumulative use of earlier material,
  meaningful production, useful explanations and stable ids for the three already public lessons;
  revise only tasks whose audit finding is concrete — _Depends on:_ T4
- [x] `D8` Author five server-owned tasks for each of the six new foundation lessons, moving from
  trace and completion through debugging, transfer and a local Python 3.12+ run — _Depends on:_ T4
- [x] `D9` Replace the five independent-program tasks with five tasks for each task-manager stage; local
  milestones ask for observable behavior and always provide the exact code needed by the next
  lesson through hint/solution — _Depends on:_ F11, T4

### Other

- [x] `T1` Run the complete Content Quality Gate over all 16 authored lessons and 80 tasks:
  learning-science checklist, factual and checker correctness, theory links, originality,
  age-appropriate Russian, and execution of every Python example on the supported Python 3.12+
  runtime; keep failed lessons in `review` — _Depends on:_ B1, F7
- [x] `T2` Record the architect's explicit content and visual approval for every new lesson before
  any of the 16 statuses or the course stage become public — _Depends on:_ T1
- [x] `T3` Synchronize PRODUCT and SPEC with the completed 19-lesson course and leave analytics,
  Topic relationships and the next post-course product decision outside this change — _Depends
  on:_ F9
- [x] `T4` Record a lesson-by-lesson curriculum audit covering prerequisites, depth, voice,
  example/practice progression, repetition and current FIPI coverage; classify every current
  lesson as keep, deepen, rewrite or replace — _Depends on:_ —
- [x] `T5` Run the complete Content Quality Gate over all 28 lessons and 140 tasks, including every
  Python example and all four task-manager snapshots on Python 3.12+; keep failures in `review` — _Depends
  on:_ B2, D7, D8, D9, F16
- [x] `T6` Record renewed architect content and visual approval for every changed lesson after the
  expanded curriculum review; the earlier T2 approval does not satisfy this checkpoint — _Depends
  on:_ T5
- [x] `T7` Synchronize PRODUCT and SPEC with the locally published 28-lesson trajectory for final
  evaluation, without adding analytics or Topic relationships; final approval remains `T6` —
  _Depends on:_ F18
- [x] `T8` Record the architect's explicit authorization to publish all 28 lessons locally for
  final evaluation before `T6`; this supersedes the former approval-before-publication ordering
  without authorizing commit, merge, push or deploy — _Depends on:_ T5

---

## Files

### Create / modify

~~~
PRODUCT.md
docs/SPEC.md
docs/changes/71-complete-python-course.md
apps/api/tests/test_tasks_api.py
apps/web/src/entities/course/content/course-publication.d.mts
apps/web/src/entities/course/content/course-publication.mjs
apps/web/src/entities/course/content/course-registry.ts
apps/web/src/entities/course/content/python-compound-conditions.lesson.tsx
apps/web/src/entities/course/content/python-for-range.lesson.tsx
apps/web/src/entities/course/content/python-while.lesson.tsx
apps/web/src/entities/course/content/python-loop-state.lesson.tsx
apps/web/src/entities/course/content/python-strings.lesson.tsx
apps/web/src/entities/course/content/python-lists.lesson.tsx
apps/web/src/entities/course/content/python-sets.lesson.tsx
apps/web/src/entities/course/content/python-dictionaries.lesson.tsx
apps/web/src/entities/course/content/python-functions.lesson.tsx
apps/web/src/entities/course/content/python-program-parts.lesson.tsx
apps/web/src/entities/course/content/python-recursion.lesson.tsx
apps/web/src/entities/course/content/python-files.lesson.tsx
apps/web/src/entities/course/content/python-tables.lesson.tsx
apps/web/src/entities/course/content/python-bruteforce.lesson.tsx
apps/web/src/entities/course/content/python-select-result.lesson.tsx
apps/web/src/entities/course/content/python-independent-program.lesson.tsx
apps/web/src/entities/course/content/python-numbers.lesson.tsx
apps/web/src/entities/course/content/python-number-digits.lesson.tsx
apps/web/src/entities/course/content/python-sorting-search.lesson.tsx
apps/web/src/entities/course/content/python-comprehensions.lesson.tsx
apps/web/src/entities/course/content/python-iterators-generators.lesson.tsx
apps/web/src/entities/course/content/python-exceptions.lesson.tsx
apps/web/src/entities/course/content/python-todo-start.lesson.tsx
apps/web/src/entities/course/content/python-todo-actions.lesson.tsx
apps/web/src/entities/course/content/python-todo-storage.lesson.tsx
apps/web/tests/course-foundation.test.ts
apps/web/tests/public-release.test.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
apps/web/src/pages/course-lesson/course-lesson-page.module.css
content/tasks/python-compound-conditions-*.json
content/tasks/python-for-range-*.json
content/tasks/python-while-*.json
content/tasks/python-loop-state-*.json
content/tasks/python-strings-*.json
content/tasks/python-lists-*.json
content/tasks/python-sets-*.json
content/tasks/python-dictionaries-*.json
content/tasks/python-functions-*.json
content/tasks/python-program-parts-*.json
content/tasks/python-recursion-*.json
content/tasks/python-files-*.json
content/tasks/python-tables-*.json
content/tasks/python-bruteforce-*.json
content/tasks/python-select-result-*.json
content/tasks/python-independent-program-*.json
content/tasks/python-numbers-*.json
content/tasks/python-number-digits-*.json
content/tasks/python-sorting-search-*.json
content/tasks/python-comprehensions-*.json
content/tasks/python-iterators-generators-*.json
content/tasks/python-exceptions-*.json
content/tasks/python-todo-start-*.json
content/tasks/python-todo-actions-*.json
content/tasks/python-todo-storage-*.json
docs/artifacts/python-course-curriculum-audit-2026-08-29.md
~~~

### Do NOT touch

- Existing three CourseLesson or two TopicLesson wording, tasks, accepted answers and publication
  status
- Topic/CourseLesson relationships, progress persistence, checker API or analytics semantics
- Embedded arbitrary Python execution, uploads, accounts, payments, search or a second course
- Infrastructure, observability, production configuration, push or deployment

---

## Contracts

See `docs/SPEC.md` §1–§5 and §8–§10 plus the Files list above. The reviewed 28-step curriculum is
the source of truth; this change deepens it without introducing Topic relationships or a new
runtime execution model. Until renewed approval, only the original three lessons are public and
the course remains in `early_access`.

---

## Gate Checks

In addition to the affected frontend/backend Critical Gate, run
`node scripts/validate-content-links.mjs`, execute every authored Python example and all four task-manager
snapshots on Python 3.12+, and run the focused Python course Playwright journey across the three
public routes plus representative review routes at desktop and 390px. Before renewed approval,
production build/prerender must still include only the three public CourseLesson pages. Required
browser/LSP tooling applies. Human content and visual approval of every changed lesson is a
publication prerequisite; automated green cannot satisfy `T6`. Full Gate remains opt-in through
`/ship --full` or `/ship --release`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The original `T2` approval was superseded by the architect before Change 71 shipped, so the
  truthful three-public-lesson review boundary was restored until the later `T8` authorization.
- The architect later explicitly authorized local publication of all 28 lessons for final
  evaluation before `T6`; this does not authorize commit, merge, push or deploy.
- The final-project copy audit replaced template transitions, internal editorial language and
  artificial metaphors across all four lessons and 20 tasks; Python snapshots, checker answers and
  stable content ids were intentionally left unchanged.
- The architect completed the renewed content and visual review after the final-project copy pass
  and approved the complete 28-lesson course for the Change 71 ship boundary.

---

## Commit Message

```
feat(change-71): complete and publish Python course
```
