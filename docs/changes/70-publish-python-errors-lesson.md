# CHANGE 70 — Publish Python Errors Lesson

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `70` |
| Slug | `publish-python-errors-lesson` |
| Title | Publish Python Errors Lesson |
| Status | `active` |
| Branch | `feature/70-publish-python-errors-lesson` |

---

## Goal

Publish the architect-approved «Ошибки: читаем сообщение и находим причину» as the third
CourseLesson in the early-access Python course. The existing registry must make the lesson
indexable, link it from the course plan and include it in available-course progress without
changing its teaching content, tasks or the independent CourseLesson contract.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Transition only the errors CourseLesson from `review` to `published`, preserving its
  route, metadata, free access, wording, five-task order and registry-derived ownership —
  _Depends on:_ T1
- [x] `F2` Update focused publication, discovery and course-progress coverage for exactly three
  published CourseLesson entries, including the errors route in public crawl surfaces and the
  course overview's available count — _Depends on:_ F1
- [x] `F3` Update the Python course Page Object and focused browser journey for the published
  overview link, indexable lesson metadata, desktop, 150% zoom, 390px mobile, keyboard,
  no-JavaScript and clean-console behavior — _Depends on:_ F2

### Infra

None

### Data

None

### Other

- [x] `T1` Re-run the Content Quality Gate for the existing errors lesson, including every
  authored Python example, checker normalization, content links and the completed human
  content/visual approval; do not publish if any prerequisite is unresolved — _Depends on:_ —
- [x] `T2` Synchronize PRODUCT and SPEC with three published Python CourseLesson entries and keep
  the next curriculum authoring step separate from this publication change — _Depends on:_ F3

---

## Files

### Create / modify

~~~
PRODUCT.md
docs/SPEC.md
docs/changes/70-publish-python-errors-lesson.md
apps/web/src/entities/course/content/course-publication.mjs
apps/web/tests/course-foundation.test.ts
apps/web/tests/public-release.test.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- Errors CourseLesson theory wording, learning outcomes, practice tasks or accepted answers
- Existing published CourseLesson or TopicLesson content and publication statuses
- Topic/CourseLesson relationships, progress persistence, checker API or analytics semantics
- New CourseLesson content, embedded Python execution, accounts, payments or search
- Infrastructure, production configuration, push or deployment

---

## Contracts

See `docs/SPEC.md` §2–§5 and §8 plus the Files list above. The codebase and `SPEC.md` remain the
sources of truth; this change only transitions the approved CourseLesson into public discovery.

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
feat(change-70): publish Python errors lesson
```
