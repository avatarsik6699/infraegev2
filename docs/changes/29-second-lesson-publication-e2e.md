# CHANGE 29 — Second Lesson Publication E2E

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `29` |
| Slug | `second-lesson-publication-e2e` |
| Title | Second Lesson Publication E2E |
| Status | `active` |
| Branch | `feature/29-second-lesson-publication-e2e` |

---

## Goal

Bring the browser contract in line with the already-approved publication of
`/ege/5-preobrazovanie-zapisey-chisel`: require the second lesson on public discovery surfaces and
verify its published metadata and resilient rendering. After the change passes its gates, release
the accumulated local `main` through the canonical release workflow.

---

## Backlog

### Backend

None.

### Frontend

- [x] `F1` Update the home and sitemap Page Object assertions to require the task-5 lesson as a published public route — _Depends on:_ —
- [x] `F2` Replace task-5 review fixtures and Page Object assertions with published-lesson contracts, preserving desktop, zoom, mobile, keyboard and no-JavaScript coverage — _Depends on:_ F1
- [x] `F3` Update the task-5 smoke journey and evidence names to describe the published route without expanding its behavioral scope — _Depends on:_ F2

### Infra

None.

### Data

None.

### Other

None.

---

## Files

### Create / modify

~~~
docs/changes/29-second-lesson-publication-e2e.md
apps/web/e2e/fixtures.ts
apps/web/e2e/pages/foundation.page.ts
apps/web/e2e/pages/public-discovery.page.ts
apps/web/e2e/pages/topic-lesson.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- Production application code, lesson content, publication registry or checker/API contracts
- Visual design, navigation behavior, analytics, infrastructure or production configuration
- Further lessons, Python content or broader application-readiness work

---

## Contracts

The existing publication registry remains the source of truth. E2E specs continue to import only
the project fixture and express browser behavior through fixtures and Page Objects.

---

## Gate Checks

Run the affected Critical Gate during `/work`. `/ship 29 --release` then runs the mandatory Full
and Release Gates before pushing `main` and verifying the deployment.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
test(change-29): cover second published lesson
```
