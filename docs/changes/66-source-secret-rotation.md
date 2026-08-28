# CHANGE 66 — Source Secret Rotation

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `66` |
| Slug | `source-secret-rotation` |
| Title | Source Secret Rotation |
| Status | `active` |
| Branch | `feature/66-source-secret-rotation` |

---

## Goal

Make production Source reconciliation converge after an operator rotates a protected credential.
Existing secret references must never mask a newly supplied SSH, Beszel, or Umami credential; the
sre-kit API remains responsible for encrypting replacements and deleting superseded references.

---

## Backlog

### Infra
- [x] `I1` Refresh every secret-bearing Source from the current protected reconciliation input while preserving idempotent project, Source, and push-token ownership — _Depends on:_ —
- [x] `I2` Add regression coverage for repeated reconciliation and secret replacement without plaintext persistence — _Depends on:_ I1

### Other
- [x] `T1` Document the secret-rotation reconciliation rule and recurring stale-reference symptom — _Depends on:_ I2

---

## Files

### Create / modify

~~~
ops/management/reconcile-sources.py
scripts/tests/sre_kit_management_test.py
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/changes/66-source-secret-rotation.md
~~~

### Do NOT touch

- Product application frontend/backend/content
- sre-kit core, database, UI, or secret-store implementation
- Production credential values

---

## Contracts

See `docs/SPEC.md` §7–§9 and the Files list above.

---

## Gate Checks

After release, reconcile production Sources and require both SSH Sources to reach `ok` using the
current protected root password.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-66): reconcile rotated source secrets
```
