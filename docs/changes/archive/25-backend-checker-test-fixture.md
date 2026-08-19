# CHANGE 25 — Backend Checker Test Fixture

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `25` |
| Slug | `backend-checker-test-fixture` |
| Title | Backend Checker Test Fixture |
| Status | `archived` |
| Branch | `feature/25-backend-checker-test-fixture` |

---

## Goal

Restore the backend checker regression suite after the `Task` content contract gained required
learner-facing fields. Keep the repair limited to the test fixture so production validation,
checker behavior and the public API remain unchanged.

---

## Backlog

### Backend

- [x] `B1` Update the checker test helper with minimal valid defaults for every required `Task`
  field, preserving the existing checker scenarios and strict schema validation — _Depends on:_ —

### Frontend

None.

### Infra

None.

---

## Files

### Create / modify

~~~
docs/changes/25-backend-checker-test-fixture.md
apps/api/tests/test_checker.py
~~~

### Do NOT touch

- Production checker logic, content schemas, API contracts or generated clients
- Lesson content, frontend behavior, infrastructure or observability

---

## Contracts

See `docs/SPEC.md` §2–§4 and the Files list above. The current strict `Task` model remains the
source of truth; this change only brings its focused test fixture back into conformance.

---

## Gate Checks

No change-specific override. Run the backend affected-area Critical Gate from `docs/STACK.md`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```text
test(change-25): repair backend checker test fixture
```
