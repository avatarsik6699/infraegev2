# CHANGE 28 — Second Lesson Publication

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `28` |
| Slug | `second-lesson-publication` |
| Title | Second Lesson Publication |
| Status | `archived` |
| Branch | `feature/28-second-lesson-publication` |

---

## Goal

Publish the architect-approved lesson `/ege/5-preobrazovanie-zapisey-chisel` through the existing
registry-driven discovery contract. Keep the change deliberately compact: record the human content
approval, expose the lesson on the already-built public surfaces, and establish two published lessons
as the checkpoint before a separate application-readiness assessment and any further content growth.

---

## Backlog

### Backend

None.

### Frontend

- [x] `F1` Change the approved task-5 lesson's single publication-registry status to `published`, preserving the existing route, metadata and registry-driven home/sitemap/prerender behavior — _Depends on:_ D1
- [x] `F2` Update focused publication tests to require both approved lessons in public discovery without changing lesson content, checker contracts or UI composition — _Depends on:_ F1

### Infra

None.

### Data

- [x] `D1` Record the architect's explicit factual, visual, originality, progression and publication approval in the adjacent task-5 quality record — _Depends on:_ —

### Other

- [x] `T1` Update `docs/SPEC.md` to pause content expansion at two published lessons and make an application-readiness assessment the next decision point before a third topic or Python mini-course — _Depends on:_ —

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/artifacts/lessons/5-build-and-analyze-algos-for-executors.quality.md
docs/changes/28-second-lesson-publication.md
apps/web/src/entities/lesson/content/lesson-publication.mjs
apps/web/src/entities/lesson/content/lesson-publication.d.mts
apps/web/tests/lesson-content-contract.test.ts
apps/web/tests/public-release.test.ts
~~~

### Do NOT touch

- Lesson theory, task statements, answers, checker/API contracts or generated client types
- Public page composition, design-system components, analytics, infrastructure or production configuration
- A third EGE topic, Python mini-course, accounts, search/catalog or unrelated product features

---

## Contracts

See `docs/SPEC.md` §1.2–§2.3, §5 and §9 and the Files list above. The publication registry remains
the single source for public discovery; this file does not duplicate its schema or route contracts.

---

## Gate Checks

In addition to the affected Critical Gate, run content-link validation. Focused tests must prove
that both lessons are `published`; production deployment remains outside this default local ship.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
feat(change-28): publish second lesson
```
