# CHANGE 23 — Recursion Practice Expansion

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `23` |
| Slug | `recursion-practice-expansion` |
| Title | Recursion Practice Expansion |
| Status | `active` |
| Branch | `feature/23-recursion-practice-expansion` |

---

## Goal

Bring the review-only recursion topic to the SPEC §1.3 minimum of five progressively ordered
practice tasks by adding two original production-response tasks for concepts not independently
exercised by the current three-task set. Give every task separate, immediately available Hint and
expanded Solution disclosures while preserving server-owned accepted answers, the lesson layout
and publication boundary; make content quality and answer verification explicit and reviewable.

---

## Backlog

### Backend

- [x] `B1` Extend the focused recursion checker coverage to all five task files, proving every declared accepted answer, a known wrong answer and strict task validation without changing the HTTP/schema contract — _Depends on:_ D1

### Frontend

- [x] `F1` Add the two task ids to `rekursiyaLesson.practiceTaskIds` in a deliberate nondecreasing difficulty/teaching order and update focused route-data/content tests for five public projections with no checker secrets — _Depends on:_ D1
- [x] `F2` Extend the existing TopicLesson Page Object and focused journey to prove five-task navigation, the added theory links, mobile tab overflow and SSR/no-JS sequential readability without changing the lesson shell — _Depends on:_ F1
- [x] `F3` Extend the server-loaded public task projection and `LessonPractice` contract so every task exposes an independent «Решение» disclosure alongside «Подсказка»: render the authored structured explanation (including code blocks where pedagogically useful) in SSR/no-JS HTML, keep it collapsed only after enhancement, and prove no `answer_variants`/checker secrets enter loader data — _Depends on:_ D1, F1

### Infra

None.

### Data

- [x] `D1` Author two original recursion `production` tasks with complete hints, theory links and expanded structured solutions: one exercises recursive code/call-stack tracing and one exercises repeated subcalls/storage; include code fragments where they clarify the reasoning, form a five-task progression with the existing tasks, and manually verify arithmetic/accepted answers — _Depends on:_ —
- [x] `D2` Add an adjacent recursion content-quality record covering all five tasks: pedagogical role, originality, theory-anchor integrity, answer variants/normalization, difficulty order and human verification items required before publication — _Depends on:_ D1

### Other

- [x] `T1` Complete content-link validation, required LSP/browser tooling and the affected Critical Gate; verify desktop/mobile/no-JS, Hint/Solution keyboard behavior, clean console and retained `noindex,nofollow`/non-publication behavior — _Depends on:_ B1, F2, F3, D2
- [x] `T2` Bring `scripts/validate-content-links.mjs` in line with the shipped TSX publication registry so task `topic_ids` resolve review/draft lessons without restoring the removed topic JSON manifest; preserve existing JSON course/task/asset checks while focused lesson tests continue to cover TSX practice ids and theory anchors — _Depends on:_ F1
- [x] `T3` Keep long lines in the shared `CodeBlock` inside its mobile scroll area so code in lesson theory and expanded solutions cannot widen the document — _Depends on:_ F3

---

## Files

### Create / modify

~~~
content/tasks/rekursiya-*.json
docs/artifacts/lessons/16-rekursiya.quality.md
apps/api/tests/test_tasks_api.py
apps/web/src/entities/lesson/api/load-lesson-practice-tasks.server.ts
apps/web/src/entities/lesson/content/rekursiya.lesson.tsx
apps/web/src/entities/lesson/content/lesson-publication.{mjs,d.mts}
apps/web/src/entities/lesson/lesson.types.ts
apps/web/src/features/lesson-practice/**
apps/web/src/pages/{design-system-lab,lesson-design-lab,topic-lesson}/**
apps/web/src/shared/components/code-block/code-block.module.css
apps/web/tests/lesson-route-data.test.ts
apps/web/tests/lesson-design-system.test.tsx
apps/web/e2e/pages/topic-lesson.page.ts
apps/web/e2e/smoke.spec.ts
scripts/validate-content-links.mjs
docs/FRONTEND.md
docs/SPEC.md
docs/changes/23-recursion-practice-expansion.md
~~~

### Do NOT touch

- Lesson theory wording/order, lesson-shell styling and shared component APIs
- Backend checker/OpenAPI schemas, database schema and production infrastructure
- Umami/product analytics, observability, `apps/ops` or external operations tooling
- Publication status, public home/catalog/legal surfaces, sitemap discovery, push or deploy

---

## Contracts

See `docs/SPEC.md` §2.3–§5 and the Files list above. Do not hand-copy the schema, endpoint or type
details into this file.

---

## Gate Checks

In addition to the affected Critical Gate, run content-link validation and verify
`/ege/16-rekursiya` with five tasks on desktop, mobile and JavaScript-disabled journeys. Confirm
the browser console is clean, answers remain server-owned and the lesson remains excluded from
public discovery.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Expanded solutions are projected from existing task content on the server; the checker HTTP and OpenAPI contracts remain unchanged.

---

## Commit Message

```text
feat(change-23): expand recursion practice to five tasks
```
