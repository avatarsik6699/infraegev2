# CHANGE 117 — Practice transition readiness

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `117` |
| Slug | `practice-transition-readiness` |
| Title | Practice transition readiness |
| Status | `archived` |
| Branch | `feature/117-practice-transition-readiness` |

## Goal

Prepare the fifth approved practice stage with an evidence-based release and retirement plan.
Identify remaining legacy consumers and the exact prerequisite order for production activation,
restore and rollback proof before removal. This documentation slice does not claim completion of
stage 5 or authorize production writes. Mode: `continue`; source: `auto: SPEC roadmap + change history`.
SPEC behavior and design remain unchanged.

## Design References

None; no UI changes.

## Backlog

### Other

- [x] `T1` Trace legacy task runtime, image mounts, validators, fixtures and migration sources;
  classify removal candidates versus still-used contracts, with source evidence — _Depends on:_ —
- [x] `T2` Document candidate/previous-SHA selection, PG18/schema rollback prerequisites,
  initial bank import ordering, production acceptance and the later removal gate; identify
  unsupported automation and distinguish local evidence from pending live proof — _Depends on:_ T1
- [x] `T3` Synchronize stale current-state wording in the practice runbook; verify links and the
  documentation Critical Gate, preserving historical archives and authored data — _Depends on:_ T2

## Files

### Create / modify

```text
docs/changes/117-practice-transition-readiness.md
docs/runbooks/practice-transition.md
docs/runbooks/practice.md
docs/runbooks/production.md (link to the transition checklist)
```

### Do NOT touch

- Application code, schema, deployment workflows and production credentials/data.
- `content/tasks`, `content/practice-migration`, rollback volumes and immutable archives.
- User-owned staged `docs/artifacts/` files.

## Contracts

See `docs/SPEC.md` §3–§4, §8 and §9.2; the Files list above.

## Gate Checks

Documentation Critical Gate from [STACK](../../STACK.md): format and local link integrity,
then allowlisted cleanup. Code lint/typecheck, tests, LSP, browser and API regeneration are
not applicable. Full/Release execution and live production evidence remain separate.

Verified: repository format, local document link targets, diff whitespace and allowlisted
cleanup passed. The user-owned staged artifact diff remained byte-for-byte unchanged.
The source audit identified an initial-import coordination gap; it is documented, not fixed
or certified by this documentation change.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

## Commit Message

```text
docs(change-117): prepare practice transition release
```
