# CHANGE 36 — Disposable Data Fidelity Drill

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `36` |
| Slug | `disposable-data-fidelity-drill` |
| Title | Disposable Data Fidelity Drill |
| Status | `shipped` |
| Branch | `feature/36-disposable-data-fidelity-drill` |

---

## Goal

Prove with pinned target binaries that synthetic Umami PostgreSQL dumps and stopped Beszel volumes
survive restore into fresh disposable targets, while guaranteeing local resource cleanup and zero
production-data access.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Add a self-contained local Docker drill using the exact pinned PostgreSQL and Beszel image digests, unique labeled resources, loopback random ports and cleanup on every exit — _Depends on:_ —
- [x] `I2` Generate a synthetic Umami-owned schema, custom-format dump and fresh-database restore, then verify rows, sequence/view behavior and restored object ownership — _Depends on:_ I1
- [x] `I3` Initialize a real Beszel source volume, stop its writer, copy it read-only into a fresh target volume and verify target health plus preserved instance identity/state files — _Depends on:_ I1
- [x] `I4` Emit a versioned sanitized result with production_data_used=false and authorized_to_cutover=false, and expose a fail-closed Make target — _Depends on:_ I2, I3

### Data

- [x] `D1` Add a result schema containing only synthetic counts, boolean fidelity checks, immutable image references and cleanup status — _Depends on:_ I4

### Other

- [x] `T1` Add focused real-Docker tests for successful PostgreSQL/Beszel fidelity and injected-failure cleanup with no remaining drill containers, volumes or host work directories — _Depends on:_ I2, I3, D1
- [x] `T2` Synchronize STACK, README, production and backup/restore runbooks with prerequisites, limitations and the remaining production-snapshot/Source-cross-check gates — _Depends on:_ I4, T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
README.md
docs/changes/36-disposable-data-fidelity-drill.md
docs/runbooks/backup-restore.md
docs/runbooks/production.md
ops/observability/backup-cutover.json
ops/observability/bundle-assets.json
ops/observability/opsctl.py
ops/observability/schemas/data-fidelity-result.schema.json
scripts/ops-data-fidelity-drill.sh
scripts/tests/ops-data-fidelity-drill.test.sh
Makefile
~~~

### Do NOT touch

- production VPS, SSH wrapper, Restic repository/password, real dumps, databases or volumes
- application/operations Compose lifecycle, production executor, upload or cutover
- existing installed backup/restore scripts and sre-kit source
- `apps/web/**` and `apps/api/**`

---

## Contracts

See `docs/SPEC.md` §7.3 and §8 and the Files list above.

---

## Gate Checks

The Critical Gate includes the focused real-Docker drill against pinned local images. It must
prove cleanup after success and injected failure; it must not use network/SSH/Restic or production
paths.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes


---

## Commit Message

```
feat(change-36): add disposable data fidelity drill
```
