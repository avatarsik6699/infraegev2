# CHANGE 72 — Python Course Release

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `72` |
| Slug | `python-course-release` |
| Title | Python Course Release |
| Status | `archived` |
| Branch | `feature/72-python-course-release` |

---

## Goal

Reconcile `docs/SPEC.md` with the completed and locally merged Change 71, then provide a canonical
release boundary for publishing the accumulated local `main`. This change does not alter course
content, analytics, application behavior, API contracts, or production topology.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

None

### Other

- [x] `T1` Record Change 71 as approved, committed, and locally merged while keeping external publication as a separate release step — _Depends on:_ —

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/changes/72-python-course-release.md
~~~

### Do NOT touch

- `apps/`
- `content/`
- `infra/`
- `ops/`
- `scripts/`
- Release configuration and protected environment files

---

## Contracts

See `docs/SPEC.md` §1.3 and §9 and the Files list above. The application and deployment contracts
remain unchanged.

---

## Gate Checks

No change-specific override. `/work 72` is documentation-only and uses the applicable Critical
Gate rows. `/ship 72 --release` must run every Full Gate and Release Gate row from
`docs/STACK.md`; production publication is permitted only after both gates pass.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```text
docs(change-72): reconcile Python course release state
```
