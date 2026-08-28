# CHANGE 63 — Python Curriculum and Conditions Lesson

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `63` |
| Slug | `python-curriculum-conditions` |
| Title | Python Curriculum and Conditions Lesson |
| Status | `active` |
| Branch | `feature/63-python-curriculum-conditions` |

---

## Goal

Turn the Python course's broad nine-module outline into a truthful public early-access map of 19
ordered learning steps, then deliver the second complete CourseLesson about comparisons and
`if/else` in review. The stage and planned rows expose unfinished work without a separate
disclaimer, while only published lessons become links or progress units; the new lesson follows
the human learning-copy and Content Quality Gate contracts in `docs/FRONTEND.md` §6 and
`docs/SPEC.md` §2.3.

---

## Backlog

### Backend

- [x] `B1` Add focused checker coverage for the five new condition tasks, including correct,
  incorrect and normalized accepted answers without changing the HTTP contract — _Depends on:_ D1

### Frontend

- [x] `F1` Replace module `lessonIds` with one ordered typed lesson-plan contract, update course
  registries/publication helpers and validate unique membership while allowing future plan entries
  without CourseLesson definitions — _Depends on:_ T1
- [x] `F2` Render all 19 public lesson-plan entries in course order, linking and counting only
  published lessons while showing every other entry as plain «В плане» content without a separate
  evolving-program disclaimer — _Depends on:_ F1, D1
- [x] `F3` Register the review-only conditions CourseLesson and add focused unit coverage for
  membership, publication, progress, SSR discovery and the five-task contract — _Depends on:_ F1, D1
- [x] `F4` Extend fixture/Page-Object browser coverage for the public roadmap and direct review
  lesson across desktop, 390px mobile, 150% zoom, keyboard, no-JavaScript and clean-console states
  without publishing the lesson — _Depends on:_ F2, F3
- [x] `F5` Refine the public lesson-plan hierarchy: remove the evolving-program note and published
  status label, keep numbering outside links, strengthen available lesson titles and mute every
  planned row without relying on color alone — _Depends on:_ F2
- [x] `F6` Remove the shared public header's bottom rule while retaining only the contextual and
  structural lesson separators that distinguish navigation, reading and footer regions; keep
  frozen lab headers unchanged — _Depends on:_ T3
- [x] `F7` Keep lesson-plan titles at `text-base` while making outcomes inherit the row's UI family
  at `text-sm`, preserving the approved size, weight and color hierarchy — _Depends on:_ F5

### Infra

None

### Data

- [x] `D1` Author the approved 19-step Python curriculum metadata, the complete «Условия:
  сравнения и выбор из двух вариантов» lesson and five progressively harder server-owned tasks;
  keep `elif`, compound conditions, Topic links and an embedded runner out of scope — _Depends on:_ T1

### Other

- [x] `T1` Synchronize PRODUCT, SPEC and FRONTEND with the public evolving-roadmap contract while
  retaining the existing human learning-copy, independent-course and review-before-publication
  rules — _Depends on:_ —
- [x] `T2` Validate every example with Python 3.12+, complete the learning-science/content-quality
  checklist, run required frontend tooling and leave the new lesson in `review` for architect
  content and visual approval — _Depends on:_ B1, F4
- [x] `T3` Synchronize PRODUCT, SPEC, FRONTEND and browser contracts with the approved borderless
  public header and implicit early-access roadmap truth — _Depends on:_ —

---

## Files

### Create / modify

~~~
PRODUCT.md
docs/SPEC.md
docs/FRONTEND.md
docs/changes/63-python-curriculum-conditions.md
apps/api/tests/test_tasks_api.py
apps/web/src/entities/course/**
apps/web/src/pages/course-overview/**
apps/web/src/widgets/public-header/**
apps/web/tests/course-foundation.test.ts
apps/web/e2e/pages/public-header.assertions.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
content/tasks/python-conditions-*.json
scripts/validate-content-links.mjs
~~~

### Do NOT touch

- Existing Topic lesson wording, practice answers, publication statuses or `/ege/*` behavior
- First Python CourseLesson wording, tasks, accepted answers or publication status
- Topic/CourseLesson relationships, progress persistence, checker API or analytics semantics
- Embedded Python execution, accounts, payments, infrastructure or production deployment
- Publication status of the new conditions CourseLesson before architect approval

---

## Contracts

See `docs/SPEC.md` §2–§5 and the Files list above. Do not hand-copy the schema, endpoints, types,
or env vars into this file — the codebase and `SPEC.md` are the source of truth.

---

## Gate Checks

In addition to the affected frontend/backend Critical Gate, run `node scripts/validate-content-links.mjs`,
execute every authored Python example on Python 3.12+, and use the project Playwright fixtures plus
required browser/LSP tooling. Full Gate remains opt-in through `/ship --full` or `/ship --release`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
feat(change-63): expand Python curriculum and add conditions lesson
```
