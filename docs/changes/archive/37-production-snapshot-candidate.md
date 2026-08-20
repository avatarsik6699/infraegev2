# CHANGE 37 — Production Snapshot Candidate

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `37` |
| Slug | `production-snapshot-candidate` |
| Title | Production Snapshot Candidate |
| Status | `archived` |
| Branch | `feature/37-production-snapshot-candidate` |

---

## Goal

Select and validate one immutable production Restic snapshot through a fixed read-only SSH
protocol before any protected data is transferred. Prove that the same snapshot contains exactly
one Umami dump and one Beszel data root, while failing closed and granting no restore or cutover
authority.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Add a fixed remote collector limited to read-only Restic snapshot/list operations and an allowlisted TSV response with no secrets, artifact contents or raw stderr — _Depends on:_ —
- [x] `I2` Add `opsctl snapshot-candidate` parsing, validation and fail-closed unreachable/malformed reports with every mutation, transfer, restore and cutover authorization false — _Depends on:_ I1
- [x] `I3` Expose a Make target and operator documentation that clearly separates snapshot selection from the later protected streaming and disposable restore change — _Depends on:_ I2
- [x] `I4` Select the globally newest snapshot by timestamp because Restic `--latest 1` returns one snapshot per group when backup work paths are unique — _Depends on:_ I1
- [x] `I5` Correct the repository-owned backup status marker to record the globally newest immutable full snapshot id instead of an arbitrary deprecated short id — _Depends on:_ I4

### Data

- [x] `D1` Add a versioned snapshot-candidate schema binding one full snapshot id/time to exactly the Umami dump and Beszel data-root metadata — _Depends on:_ I2

### Other

- [x] `T1` Add focused fixture and fake-transport tests for complete, missing, duplicate, unsafe-path, malformed and unreachable candidates, plus a static no-mutation assertion for the remote collector — _Depends on:_ I1, I2, D1
- [x] `T2` Run the command against production as a read-only operator proof and record only sanitized pass/blocker evidence; do not transfer snapshot contents — _Depends on:_ I3, I4, T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
README.md
docs/changes/37-production-snapshot-candidate.md
docs/runbooks/backup-restore.md
docs/runbooks/production.md
ops/observability/bundle-assets.json
ops/observability/opsctl.py
ops/observability/remote-snapshot-candidate.sh
ops/observability/schemas/snapshot-candidate.schema.json
scripts/tests/opsctl.test.sh
scripts/backup.sh
Makefile
~~~

### Do NOT touch

- production Restic repository contents, credentials, snapshots, application/operations services or systemd units
- production artifact contents, local data transfer or any restore/cutover executor
- application/operations Compose definitions and sre-kit source
- `apps/web/**` and `apps/api/**`

---

## Contracts

See `docs/SPEC.md` §7.3 and §8 and the Files list above.

---

## Gate Checks

The focused gate uses fixtures/fake SSH. The production proof is a separate read-only operator
check and is never replayed automatically by `/ship`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The sanitized production proof passed on 2026-08-20 without reading artifact contents; no
  snapshot id or repository path is retained in git.
- Python LSP was unavailable in the active tool catalog; repository Ruff and Pyright checks passed.

---

## Commit Message

```
feat(change-37): add production snapshot candidate gate
```
