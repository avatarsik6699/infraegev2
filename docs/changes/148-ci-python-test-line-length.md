# CHANGE 148 — CI Python test line length

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `148` |
| Slug | `ci-python-test-line-length` |
| Title | CI Python test line length |
| Status | `active` |
| Branch | `feature/148-ci-python-test-line-length` |

---

## Goal

Repair the two Ruff E501 failures in the Change 147 security selector test that blocked exact-SHA static quality CI after publication. Preserve test behavior and the proportional verification contract in `docs/SPEC.md` §8.3.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] I1 Split the two overlong Python test fixture strings without changing their bytes or assertions; verify Ruff, Python LSP and the focused security-gate contract tests. — _Depends on:_ —

### Data

None

### Other

None

---

## Files

### Create / modify

- `scripts/tests/security_gate_test.py`
- This change file

### Do NOT touch

- Runtime application code, dependencies, audit policy and unrelated user-owned artifacts

---

## Contracts

See `docs/SPEC.md` §8.3 and the Files list above. No product, API, schema or security contract changes.

---

## Gate Checks

Affected Critical only: repository formatting, the exact Ruff check from static quality CI, Python LSP, focused security-gate tests, and hygiene. Full, browser and Lighthouse are not selected. Release still requires fresh exact-SHA secrets, changed-dependency selection, CI and image evidence.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- SHA `4d2b49f7965c34cca0fa15103c5b83aed4fc993a` was published but not deployed:
  static quality run `36246217942` failed only at the two E501 lines fixed here; its image
  publication run `36246217981` passed. The exact-SHA `extract-zip` exception for that SHA
  does not transfer to this change's eventual merged SHA.

---

## Commit Message

```
fix(change-148): clear security test CI lint failure
```
