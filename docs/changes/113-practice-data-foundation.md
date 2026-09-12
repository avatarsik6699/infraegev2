# CHANGE 113 — Practice data foundation

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `113` |
| Slug | `practice-data-foundation` |
| Title | PostgreSQL 18 foundation for the practice bank |
| Status | `active` |
| Branch | `feature/113-practice-data-foundation` |

## Goal

Prepare the application PostgreSQL 18 foundation before importing the task bank: isolated
environments, least-privilege roles, a rehearsed 16 → 18 transfer and verified recovery.
The full approved practice architecture lives in SPEC §3.2, §4.1, §8.1 and §9.2.
This is its first bounded implementation change, not authorization to implement all later phases.

Planning mode: `continue`. Source brief: architect's chat decisions and final plan, 2026-09-12.
Local implementation is verified; production cutover and installed PG18 acceptance remain
the explicit release path.

## Design References

None — no frontend surface changes. Later practice UI follows FRONTEND and the accepted public
catalogs; its lab specimen selection belongs to that later change.

## Backlog

### Data

- [x] `D1` Record sanitized read-only inventory of application DB versions, databases, schemas,
  roles, volumes, size, free disk, backup timers and restore evidence; distinguish local and live
  evidence and prove ownership before any migration. Do not infer an empty DB from missing ORM
  models or inspect/copy operations data. Produce a concrete transfer/recovery procedure in the
  owning runbook — _Depends on:_ —
- [x] `D2` Rehearse logical transfer of a nonempty PostgreSQL 16 source into a separate PG18
  volume, including roles/privileges and data checks. Verify both retained-source return before
  target writes and recovery limitations after target writes; keep the old volume intact.
  Installed/live cutover remains the explicit release path — _Depends on:_ D1, I1, I2, I3

### Infra

- [x] `I1` Pin and verify the approved PG18 application image/digest across dev, test and restore;
  implement the version-specific data layout and distinct PG18 volume. Preserve explicit Compose
  project ownership and resumable dev lifecycle. Keep operations PostgreSQL untouched
  — _Depends on:_ D1
- [x] `I2` Add reproducible application runtime/import/migration/backup role provisioning and
  separate credentials without printing secrets. Runtime is read-only; ordinary writer has no
  DDL. Define future-schema grants/default privileges without inventing Task tables. Isolate
  dev/test/prod/restore identities and make reset/restore targets reject production destinations
  — _Depends on:_ D1, I1
- [x] `I3` Implement the planned db-inventory/backup/restore-check/export operator interfaces
  using existing Make/script/runbook conventions. Update application backup and disposable restore
  for PG18, roles/privileges, schema/release metadata, checksums, installed-path fidelity and portable
  manual PC export. Preserve retention/Restic locking and operations tag. Task assets join the
  bundle in the later task-storage change, not as fictitious current evidence
  — _Depends on:_ I1, I2
- [x] `I4` Prepare a serialized release transfer path with preflight backup, target restore and
  verification, explicit cutover, compatible application rollback and protected old volume.
  Prevent automatic destructive DB downgrade/restore; document failure recovery and disk headroom.
  Do not deploy merely by running /work — _Depends on:_ D2, I3

### Backend

None — ORM, Alembic schema, SQL readiness and Task API belong to the next model/tooling change.
Only environment wiring in the infrastructure may prepare the future role boundary.

### Frontend

None.

### Other

- [x] `T1` Add focused contracts for Compose isolation/layout, role permissions, production-target
  rejection, backup/export completeness and migration failure recovery. Run database evidence on
  isolated nonempty fixtures with a host test runner; verify restores by actual SQL, not just file
  presence or TCP health — _Depends on:_ I1, I2, I3, I4
- [x] `T2` Synchronize STACK and production/backup runbooks with implemented commands and limits;
  keep future task/schema plans explicitly pending. Record measured restore time, accepted same-VPS
  risk and manual weekly export procedure. Replace speculative readiness claims only when the
  corresponding implementation exists — _Depends on:_ D2, I4, T1

## Files

### Create / modify

```text
Infrastructure:
  .github/workflows/deploy.yml
  Makefile
  infra/.env.example
  infra/database-major (new)
  infra/docker-compose.db-rollback.yml (new)
  infra/docker-compose.yml
  infra/docker-compose.dev.yml
  infra/docker-compose.override.yml
  infra/docker-compose.prod.yml
  scripts/deploy-remote.sh
  scripts/backup.sh
  scripts/restore-check.sh
  scripts/check-backup-freshness.sh
  scripts/db-inventory.sh (new)
  scripts/db-provision-roles.sh (new)
  scripts/db-transfer.sh (new)
  scripts/db-export.sh (new)
  scripts/lib/application-db.sh (new)
  scripts/lib/application-db-release.sh (new)
  scripts/docker-dev-lifecycle.sh
  ops/install-backup-timers.sh
  ops/systemd/infraege-backup.service
  ops/systemd/infraege-backup.timer
  ops/systemd/infraege-restore-check.service
  ops/systemd/infraege-restore-check.timer
Verification:
  scripts/tests/backup-restore.test.sh
  scripts/tests/deploy-preflight.test.sh
  scripts/tests/docker-dev-lifecycle.test.sh
  scripts/tests/practice-db-foundation.test.sh (new)
  scripts/tests/production-ops-topology.test.sh
  scripts/tests/host-web-gate.test.sh
Documentation:
  docs/SPEC.md
  docs/STACK.md
  docs/runbooks/production.md
  docs/runbooks/backup-restore.md
  docs/KNOWN_GOTCHAS.md (only confirmed new traps)
  docs/changes/113-practice-data-foundation.md
```

### Do NOT touch

- Existing staged user artifacts under `docs/artifacts/`; preserve their content and staging.
- `apps/web/src/`, authored lessons, `content/tasks/`, current public checker/API behavior.
- Task schema/ORM implementation, lesson membership migration, catalog, upload/editor features.
- Operations/Umami/Beszel database volumes or versions; sibling sre-kit repository.
- Archives, old PostgreSQL volumes, production data through destructive cleanup.

## Contracts

See `docs/SPEC.md` §3.2, §4.1, §8.1, §9.2 and the Files list above. Do not mirror schemas or
endpoint definitions here. First-stage boundary intentionally excludes the later application model.

## Gate Checks

Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
with `--full` or `--release`. Commands are defined in [STACK](../STACK.md).

Additional acceptance: nonempty PG16 → PG18 restore proof, role assertions, production-target
rejection and installed backup/export fidelity. A fake-transport contract is not live restore proof.
Remote mutations/cutover are only the explicit release/maintenance operation; local implementation
readiness must distinguish these pending release checks. No test runner in Docker or CI.

Local verification (2026-09-12): `pnpm format:check`, affected shell `bash -n`, `make config`,
and six focused contract scripts passed: `backup-restore`, `deploy-preflight`,
`docker-dev-lifecycle`, `production-ops-topology`, `host-web-gate`, `practice-db-foundation`.
The real database contract used PG16.14 → PG18.6 and host Restic 0.16.4, matching the installed
VPS version; the final restore including disposable cleanup took 5 seconds for the small fixture.
Maintenance scripts ran from a separate installed-release tree through a `database-current`
symlink. Encrypted PC export contained only the application snapshot; a synthetic operations-tag
snapshot survived application retention. Source and target SQL/role checks, target-write divergence,
corruption rejection, protected candidate volumes and application-only rollback passed.
Repository hygiene passed after reviewed `make clean-dry-run`, `make clean` and `make clean-check`.
Temporary host tools and their initial external test caches were moved to trash; fixture-owned
database containers, volumes and later caches were cleaned by the host runner.

Type-check/LSP/API regeneration/browser checks are not applicable: no TS/Python, public API or UI
code changed. Full/Release Gates and live mutations were not run. Before production transfer,
verify the exact previous application's PG18 compatibility, then perform the explicit release and
installed timer/restore/export acceptance described in the production runbook.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

None

## Commit Message

```text
feat(change-113): prepare practice database foundation
```
