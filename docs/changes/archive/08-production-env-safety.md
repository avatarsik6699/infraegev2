# CHANGE 08 — Production Environment Safety

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `08` |
| Slug | `production-env-safety` |
| Title | Shell-safe production environment lifecycle |
| Status | `archived` |
| Branch | `feature/08-production-env-safety` |

---

## Goal

Prevent operator helpers from writing Docker Compose environment values that fail when trusted
production scripts source the same protected file. Fail closed before any release-side container
mutation, repair the confirmed Beszel key line without exposing secrets, and restore the blocked
Change 07 production deployment under the existing SPEC section 7 security boundary.

---

## Backlog

### Backend
None

### Frontend
None

### Infra
- [x] `I1` Add a reusable production dotenv formatter that emits Bash-sourceable and Docker
  Compose-compatible literal values, preserves Beszel key spaces/punctuation and rejects line
  breaks or single quotes that cannot share one unambiguous syntax — _Depends on:_ —
- [x] `I2` Use the formatter when atomically replacing Beszel token/key values and add focused
  regression coverage for an SSH public key containing spaces without printing secret material —
  _Depends on:_ I1
- [x] `I3` Validate the protected production environment before release extraction, pulls or
  container changes, with a focused deploy-order regression test — _Depends on:_ I1
- [x] `I4` Atomically normalize the existing Beszel key assignment on the VPS through pinned SSH,
  validate it without displaying values, and confirm the previous production SHA remains healthy
  before retrying release — _Depends on:_ I2, I3

### Data
None

### Other
- [x] `T1` Document the malformed-env symptom, safe recovery and early-preflight invariant in
  KNOWN_GOTCHAS — _Depends on:_ I2, I3
- [x] `T2` Correct the recovery documentation to name the implemented single-quoted literal
  dotenv representation — _Depends on:_ T1

---

## Files

### Create / modify
~~~
scripts/lib/production-env.sh
scripts/configure-beszel-agent.sh
scripts/deploy-remote.sh
scripts/repair-beszel-env.sh
scripts/tests/production-env.test.sh
scripts/tests/deploy-preflight.test.sh
Makefile
docs/KNOWN_GOTCHAS.md
docs/changes/08-production-env-safety.md
~~~

### Do NOT touch
- application frontend/backend behavior or content
- database schema or stored application data
- GitHub workflow/environment configuration
- `docs/changes/archive/`
- protected production values other than the atomic `BESZEL_AGENT_KEY` normalization in I4

---

## Contracts

See `docs/SPEC.md` §7 and the Files list above. Do not hand-copy secret values into this file; the
codebase and protected production environment remain the sources of truth.

---

## Gate Checks

Focused tests must use temporary environment files and stub SSH/remote commands. They must not
contact production or print protected values. I4 is the only live step and must change only the
existing Beszel key assignment atomically through the pinned deploy identity.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-08): harden production environment handling
```
