# CHANGE 38 — Simplified Fresh-Start Operations Lifecycle

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `38` |
| Slug | `fresh-start-ops-cutover` |
| Title | Simplified Fresh-Start Operations Lifecycle |
| Status | `archived` |
| Branch | `feature/38-fresh-start-ops-cutover` |

---

## Goal

Replace the premature generic operations control plane with the smallest target-owned lifecycle
needed by infraegev2: one independent Compose definition, explicit SSH-backed lifecycle commands,
a sanitized sre-kit Source template and concise operator documentation. Keep the current
production topology and VPS unchanged until a separately approved cutover change.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Correct SPEC, STACK, runbooks and gotchas so infraegev2 owns a small application-specific operations package while sre-kit remains an observational core; remove the generic reconcile/migration/cutover architecture — _Depends on:_ —
- [x] `I2` Keep a locally renderable independent `infraege-ops` Compose definition with private bindings, healthchecks, separate state and one explicit shared ingress network, without changing the active application Compose — _Depends on:_ I1
- [x] `I3` Replace desired-state, schema, bundle, sandbox, migration and snapshot machinery with explicit `config`, read-only `status`, `install`, `update` and `rollback` commands over the protected SSH transport — _Depends on:_ I2
- [x] `I4` Add a secret-free infraegev2 Source template matching the installed sre-kit adapter manifests; registration remains a separate operator action and sre-kit availability never blocks target lifecycle — _Depends on:_ I1

### Data

None. The new operations stack intentionally starts with empty volumes; no production data is
copied, restored or deleted by this change.

### Other

- [x] `T1` Replace obsolete control-plane tests with focused Compose and lifecycle contract tests proving local validation, fail-closed arguments, protected transport use and absence of production execution during the gate — _Depends on:_ I2, I3, I4
- [x] `T2` Remove superseded control-plane implementation, fixtures and schemas while preserving archived change documents as historical evidence — _Depends on:_ I3, T1

---

## Files

### Create / modify

~~~
README.md
Makefile
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/changes/38-fresh-start-ops-cutover.md
docs/runbooks/backup-restore.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/runbooks/incident-response.md
ops/opsctl
ops/observability/compose.yml
ops/observability/env.contract
ops/observability/manage.sh
ops/observability/remote-deploy.sh
ops/observability/remote-status.sh
ops/observability/sre-kit-sources.example.json
scripts/tests/ops-lifecycle.test.sh
scripts/tests/ops-stack-definition.test.sh
~~~

### Delete

~~~
infra/docker-compose.ops-detached.yml
ops/observability/__init__.py
ops/observability/opsctl.py
ops/observability/migration_rehearsal.py
ops/observability/remote-inventory.sh
ops/observability/remote-preflight.sh
ops/observability/remote-snapshot-candidate.sh
ops/observability/apply-contract.json
ops/observability/backup-cutover.json
ops/observability/build-bundle.py
ops/observability/bundle-assets.json
ops/observability/desired-state.json
ops/observability/fixtures/**
ops/observability/schemas/**
scripts/ops-data-fidelity-drill.sh
scripts/tests/fresh-start-cutover.test.sh
scripts/tests/opsctl.test.sh
scripts/tests/opsctl-apply.test.sh
scripts/tests/ops-preflight.test.sh
scripts/tests/ops-migration-rehearsal.test.sh
scripts/tests/ops-data-fidelity-drill.test.sh
~~~

### Do NOT touch

- VPS, production containers/networks/volumes, protected environment or Restic contents
- active `infra/docker-compose.prod.yml`, application deploy executor or release workflow
- sre-kit source code, database or runtime configuration
- `apps/web/**` and `apps/api/**`

---

## Contracts

See `docs/SPEC.md` §7.3 and the Files list above.

---

## Gate Checks

All lifecycle tests use fake `docker`, `ssh` and `scp` executables. The Critical Gate must not
open a production connection, create Docker resources or read a protected production env file.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The architect explicitly approved replacing the previous Change 38 cutover-contract direction
  after the repository-wide architecture review found that it duplicated Compose lifecycle with a
  generic control plane before a production executor existed.

---

## Commit Message

```
refactor(change-38): simplify operations lifecycle
```
