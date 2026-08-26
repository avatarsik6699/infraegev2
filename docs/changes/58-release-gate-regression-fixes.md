# CHANGE 58 — Release Gate Regression Fixes

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `58` |
| Slug | `release-gate-regression-fixes` |
| Title | Release Gate Regression Fixes |
| Status | `active` |
| Branch | `feature/58-release-gate-regression-fixes` |

---

## Goal

Restore release readiness after the first Change 57 Full Gate exposed three regressions: stale
backend checker fixtures, stale analytics-consent E2E expectations/interference, and an LCP budget
failure on the published recursion lesson. Preserve the current product and privacy contracts,
reduce the route-loading regression, and apply the architect-approved revised LCP ceiling.

---

## Backlog

### Backend

- [x] `B1` Update checker test fixtures to satisfy the existing strict Task ownership contract
  without changing checker production behavior — _Depends on:_ —

### Frontend

- [x] `F1` Synchronize the analytics-consent Page Object assertion with the current approved
  prompt copy and its privacy guarantees — _Depends on:_ —
- [x] `F2` Make the cross-topic progress E2E journey handle the expected fixed consent prompt
  through the owning fixture/Page Object before following the bottom lesson link — _Depends on:_ F1
- [x] `F3` Diagnose and reduce `/ege/16-rekursiya` LCP with an evidence-based route-loading fix;
  do not remove route coverage — _Depends on:_ —
- [x] `F4` Raise the Lighthouse LCP ceiling from 2.5 s to 2.8 s per the architect's explicit
  acceptance decision, retaining the route coverage and median-of-three assertion — _Depends on:_ F3

### Other

- [x] `T1` Re-run focused checker, consent/progress browser and recursion Lighthouse evidence,
  then complete the affected-area Critical Gate — _Depends on:_ B1, F1, F2, F3
- [x] `D1` Synchronize the architect-approved 2.8 s LCP ceiling across `SPEC.md`, `STACK.md`
  and the executable Lighthouse configuration — _Depends on:_ F4

---

## Files

### Create / modify

~~~
docs/changes/58-release-gate-regression-fixes.md
docs/SPEC.md
docs/STACK.md
apps/api/tests/test_checker.py
apps/web/e2e/pages/privacy.page.ts
apps/web/e2e/pages/topic-lesson.page.ts
apps/web/e2e/pages/browser-session.page.ts (only if the shared consent action belongs here)
apps/web/src/** (only the evidence-backed recursion LCP fix)
apps/web/tests/course-foundation.test.ts
apps/web/vite.config.ts
lighthouserc.cjs
~~~

### Do NOT touch

- Task ownership validation or checker production behavior
- Analytics consent semantics, approved user-facing copy or data-collection allowlist
- Python CourseLesson, Topic lesson teaching content or publication statuses
- Full/Release Gate definitions or deployment infrastructure

---

## Contracts

See `docs/SPEC.md` §2–§5 and §8 plus `docs/FRONTEND.md` §§3–6 and §8. The existing ownership,
privacy and E2E architecture contracts remain unchanged; the LCP ceiling is revised by `F4`.

---

## Gate Checks

In addition to the affected backend/frontend Critical Gate, run the focused checker test file and
the analytics-consent/cross-topic Playwright journeys. Diagnose the recursion lesson and prove the
revised route-level LCP budget before the mandatory Full Gate in `/ship --release`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Course route metadata and validation use a lightweight publication projection, while full
  lesson content stays in matched course route chunks; this removes the course chunk from EGE
  lesson preloads without changing product behavior.
- After measured recursion LCP remained between 2.56 s and 2.71 s, the architect explicitly
  accepted a 2.8 s median ceiling rather than extending this release with further optimization.

---

## Commit Message

```
fix(change-58): restore release gate readiness
```
