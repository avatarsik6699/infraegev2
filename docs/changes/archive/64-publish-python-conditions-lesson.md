# CHANGE 64 — Publish Python Conditions Lesson

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `64` |
| Slug | `publish-python-conditions-lesson` |
| Title | Publish Python Conditions Lesson |
| Status | `archived` |
| Branch | `feature/64-publish-python-conditions-lesson` |

---

## Goal

Publish the architect-approved «Условия: сравнения и выбор из двух вариантов» as the second
CourseLesson in the early-access Python course. The existing registry must make the lesson
indexable, link it from the course plan and include it in available-course progress without
changing its teaching content, tasks or the independent CourseLesson contract. After publication,
pause further content authoring for an evidence-first course/product application-gap audit.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Transition only the conditions CourseLesson from `review` to `published`, preserving
  its route, metadata, free access, wording, five-task order and registry-derived ownership — _Depends on:_ T1
- [x] `F2` Update focused publication, discovery and course-progress coverage for exactly two
  published CourseLesson entries, including the conditions route in public crawl surfaces and the
  course overview's available count — _Depends on:_ F1
- [x] `F3` Update the Python course Page Object and focused browser journey for the published
  overview link, indexable lesson metadata, desktop, 150% zoom, 390px mobile, keyboard,
  no-JavaScript and clean-console behavior — _Depends on:_ F2

### Infra

None

### Data

None

### Other

- [x] `T1` Re-run the Content Quality Gate for the existing conditions lesson, including every
  authored Python example, checker normalization, content links and human content/visual approval;
  do not publish if any publication prerequisite is unresolved — _Depends on:_ —
- [x] `T2` Synchronize PRODUCT and SPEC with two published Python CourseLesson entries and record
  an evidence-first course/product application-gap audit as the next step before authoring a third
  CourseLesson — _Depends on:_ F3

---

## Files

### Create / modify

~~~
PRODUCT.md
docs/SPEC.md
docs/changes/64-publish-python-conditions-lesson.md
apps/web/src/entities/course/content/course-publication.mjs
apps/web/tests/course-foundation.test.ts
apps/web/tests/public-release.test.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- Conditions CourseLesson theory wording, learning outcomes, practice tasks or accepted answers
- First Python CourseLesson or Topic lesson content and publication statuses
- Topic/CourseLesson relationships, progress persistence, checker API or analytics semantics
- New CourseLesson content, embedded Python execution, accounts, payments or search
- Infrastructure, production configuration, push or deployment

---

## Contracts

See `docs/SPEC.md` §2–§5 and §8 plus the Files list above. Do not hand-copy schema, route, SEO or
publication details into this file; current code and `SPEC.md` remain the sources of truth.

---

## Gate Checks

In addition to the affected frontend Critical Gate, run `node scripts/validate-content-links.mjs`,
execute every authored Python example on Python 3.12+, and run the focused Python course
Playwright journey. Use the project browser/LSP tooling and prove production build/prerender
includes the newly published route. Full Gate remains opt-in through `/ship --full` or
`/ship --release`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
feat(change-64): publish Python conditions lesson
```
