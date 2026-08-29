# CHANGE 69 — Python Errors CourseLesson

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `69` |
| Slug | `python-errors-course-lesson` |
| Title | Python Errors CourseLesson |
| Status | `archived` |
| Branch | `feature/69-python-errors-course-lesson` |

---

## Goal

Deliver the next standalone Python CourseLesson, «Ошибки: читаем сообщение и находим причину»,
as a complete review-only learning unit. A beginner should learn to read the final traceback line,
find the referenced source line, distinguish several basic causes and make one small verified fix;
publication remains a separate architect-approved change.

---

## Backlog

### Backend

- [x] `B1` Add focused checker coverage for the five new error-reading tasks, including strict,
  incorrect and normalized accepted answers without changing the public HTTP contract —
  _Depends on:_ D1

### Frontend

- [x] ~~`F1`~~ (removed) Replace the typed product-event allowlist; the architect confirmed that
  existing visits/pageviews and paths are sufficient.
- [x] ~~`F2`~~ (removed) Reconcile `lesson_completed` with mastery semantics.
- [x] ~~`F3`~~ (removed) Add a production emitter for `continuation_opened`.
- [x] ~~`F4`~~ (removed) Add event-level browser coverage.
- [x] `F5` Register `python-errors` as a review-only CourseLesson at
  `/courses/python/oshibki`, preserving its existing curriculum row while keeping it unlisted,
  `noindex,nofollow` and outside published course progress — _Depends on:_ D1
- [x] `F6` Add focused unit coverage for course membership, review discovery, five-task loading,
  public projection secrecy and the unchanged two-published-lesson count — _Depends on:_ F5
- [x] `F7` Extend the existing Python course fixture/Page Object journey for direct review-route
  rendering, desktop, 150% zoom, 390px mobile, keyboard, no-JavaScript, overflow and clean-console
  evidence without publishing the lesson — _Depends on:_ F6
- [x] `F8` Simplify the shared CourseLesson result for every course lesson: render the authored
  result directly without «Что теперь понятно» and remove the redundant «Что вы уже умеете»
  outcome list while preserving progress and continuation — _Depends on:_ F7
- [x] `F9` Render backtick-delimited code fragments in every practice-task statement through the
  existing inline `Notation` treatment, with focused unit and browser evidence for the errors
  lesson examples — _Depends on:_ F8

### Infra

- [x] ~~`I1`~~ (removed) Reconcile Product analytics Source event manifests.
- [x] ~~`I2`~~ (removed) Mutate and re-prove the live Product analytics Source.

### Data

- [x] `D1` Author the complete beginner lesson and five progressively harder server-owned tasks
  for reading a basic Python traceback, locating the source line, recognizing `SyntaxError`,
  `NameError`, `TypeError` and `ValueError`, fixing one small program and checking the result;
  keep `try/except`, custom exceptions, debugger tooling and multi-file stack analysis out of
  scope — _Depends on:_ T4

### Other

- [x] ~~`T1`~~ (removed) Document an expanded event-level analytics contract.
- [x] ~~`T2`~~ (removed) Run analytics reconciliation gate evidence.
- [x] `T3` Apply the architect's scope correction: the live Umami stack, public tracker and recent
  pageview/session/path aggregates are healthy, so stop event-level analytics refinement and
  redirect Change 69 to the next standalone Python CourseLesson — _Depends on:_ —
- [x] `T4` Define and apply a source-backed teaching sequence for a learner who has only the first
  program and conditions lessons: what an error message contains, how to read it from the last
  line back to the source line, how the four basic error families differ, and how to fix then
  rerun without guessing — _Depends on:_ —
- [x] `T5` Validate every authored example with the repository's supported Python 3.12+ runtime,
  complete the learning-science/Content Quality Gate, run required browser/LSP tooling and leave
  the lesson in `review` for architect content and visual approval — _Depends on:_ B1, F7

---

## Files

### Create / modify

~~~
PRODUCT.md
docs/SPEC.md
docs/changes/69-python-errors-course-lesson.md
apps/api/tests/test_tasks_api.py
apps/web/src/entities/course/content/course-publication.d.mts
apps/web/src/entities/course/content/course-publication.mjs
apps/web/src/entities/course/content/course-registry.ts
apps/web/src/entities/course/content/python-errors.lesson.tsx
apps/web/tests/course-foundation.test.ts
apps/web/tests/public-release.test.ts
apps/web/src/pages/course-lesson/components/course-lesson-result.tsx
apps/web/src/pages/course-lesson/course-lesson-page.module.css
apps/web/src/features/lesson-practice/components/practice-task-answer.tsx
apps/web/src/features/lesson-practice/components/practice-task-statement.tsx
apps/web/tests/practice-task-statement.test.tsx
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
content/tasks/python-errors-*.json
~~~

### Do NOT touch

- Existing lesson wording, tasks, accepted answers or publication statuses
- Topic/CourseLesson relationships, progress persistence, checker API or analytics implementation
- Product analytics Source configuration, Umami/sre-kit runtime or privacy/retention contracts
- `try/except`, custom exceptions, debugger/IDE-specific workflows, multi-file tracebacks or an
  embedded Python runner
- Publication of `python-errors`, infrastructure, accounts, payments, search, push or deployment

---

## Contracts

See `docs/SPEC.md` §1.2–§1.4, §2–§5 and §8–§10 and the Files list above. The codebase and
`SPEC.md` remain the source of truth; this change adds one review-only CourseLesson without
changing analytics, API or Topic relationships.

---

## Gate Checks

In addition to the affected frontend/backend Critical Gate, run
`node scripts/validate-content-links.mjs`, execute every authored Python example on Python 3.12+
and use the project Playwright fixtures plus required browser/LSP tooling. The lesson must remain
unlisted and `noindex,nofollow`; Full Gate and publication are not requested.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Event-level reconciliation was deliberately removed after live evidence showed that consented
  pageviews/sessions and path aggregates already answer the architect's current analytics need.

---

## Commit Message

```
feat(change-69): add review-only Python errors lesson
```
