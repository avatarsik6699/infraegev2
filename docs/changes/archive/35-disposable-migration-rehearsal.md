# CHANGE 35 — Disposable Migration Rehearsal

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `35` |
| Slug | `disposable-migration-rehearsal` |
| Title | Disposable Migration Rehearsal |
| Status | `archived` |
| Branch | `feature/35-disposable-migration-rehearsal` |

---

## Goal

Prove the migration state sequence and rollback invariants against hash-bound disposable artifacts
inside an explicitly marked local sandbox, without Docker, SSH, credentials or production effects.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Define versioned source-manifest and rehearsal-result contracts bound to installation, bundle and ready preflight evidence, with production_mutated=false and authorized_to_cutover=false — _Depends on:_ —
- [x] `I2` Add a marked-sandbox rehearsal transaction with exclusive lock, checkpoint, hash-verified staging, modeled ownership cutover and mandatory rollback/cleanup — _Depends on:_ I1
- [x] `I3` Add `opsctl rehearse-migration` with explicit manifest/report/source/sandbox inputs and no environment-selected executor or remote transport — _Depends on:_ I1, I2
- [x] `I4` Add a fail-closed Make target and operator documentation that distinguishes transaction rehearsal from actual PostgreSQL/Restic restore and production approval — _Depends on:_ I3

### Data

- [x] `D1` Add safe disposable Umami/Beszel artifact fixtures, their hash manifest and JSON schemas; no production-derived data may be committed — _Depends on:_ I1

### Other

- [x] `T1` Test success, repeatability, stale bundle/preflight/source hashes, unmarked sandbox rejection, lock contention and injected failure rollback with unchanged source artifacts — _Depends on:_ I2, I3, D1
- [x] `T2` Synchronize STACK, README, migration/backup runbooks and bundle assets with the rehearsal sequence, limitations and next real-restore gate — _Depends on:_ I4, T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
README.md
docs/changes/35-disposable-migration-rehearsal.md
docs/runbooks/backup-restore.md
docs/runbooks/production.md
package.json
ops/observability/opsctl.py
ops/observability/migration_rehearsal.py
ops/__init__.py
ops/observability/__init__.py
ops/opsctl
ops/observability/bundle-assets.json
ops/observability/backup-cutover.json
ops/observability/schemas/migration-source.schema.json
ops/observability/schemas/migration-rehearsal.schema.json
ops/observability/fixtures/migration-source.json
ops/observability/fixtures/migration/umami.dump
ops/observability/fixtures/migration/beszel-data.db
scripts/tests/ops-migration-rehearsal.test.sh
Makefile
~~~

### Do NOT touch

- production VPS, SSH wrapper, credentials, real backups, databases, volumes or containers
- application/operations Compose definitions, production executor, data upload or cutover
- existing backup/restore execution scripts
- `apps/web/**`, `apps/api/**` and sre-kit source

---

## Contracts

See `docs/SPEC.md` §7.3 and §8 and the Files list above.

---

## Gate Checks

The Critical Gate is Python/shell/documentation scoped and uses only generated disposable roots.
No Docker or network command is allowed.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes


---

## Commit Message

```
feat(change-35): add disposable migration rehearsal
```
