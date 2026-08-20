# CHANGE 33 — Independent Ops Stack Definition

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `33` |
| Slug | `independent-ops-stack-definition` |
| Title | Independent Ops Stack Definition |
| Status | `archived` |
| Branch | `feature/33-independent-ops-stack-definition` |

---

## Goal

Define the inactive, independently renderable `infraege-ops` Compose stack and an immutable,
secret-free release bundle manifest. Prove project/network/volume isolation and private bindings
locally without starting containers, changing the current application Compose or touching VPS state.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Add a dedicated Compose definition for operations Postgres, Umami, Beszel Hub/Agent and read-only Docker socket proxy under project `infraege-ops`, with immutable images, independent volumes, health contracts and operations ownership labels — _Depends on:_ —
- [x] `I2` Keep every UI/API host binding private to the configured WireGuard address, keep Postgres unexposed and preserve the socket proxy's deny-by-default mutation boundary — _Depends on:_ I1
- [x] `I3` Add a secret-name-only environment contract and local render command that fails on missing inputs while allowing disposable synthetic values for validation — _Depends on:_ I1, I2
- [x] `I4` Add a deterministic secret-free bundle manifest containing schema version, installation/project identity, repository-relative assets and SHA-256 hashes; generation must not archive credentials or mutable runtime state — _Depends on:_ I3

### Data

- [x] `D1` Add versioned backup/cutover metadata naming the future operations database and volumes while explicitly recording that current data ownership remains unchanged until migration — _Depends on:_ I1

### Other

- [x] `T1` Add focused tests proving Compose render success, missing-variable failure, project/volume separation, private-only ports, immutable digests, socket-proxy denial and deterministic bundle hashes without starting containers — _Depends on:_ I4, D1
- [x] `T2` Synchronize STACK, README and production/backup/onboarding runbooks with the inactive stack definition and the required remote-preflight → backup → migration → cutover sequence — _Depends on:_ T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
README.md
docs/changes/33-independent-ops-stack-definition.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
docs/runbooks/backup-restore.md
ops/observability/compose.yml
ops/observability/env.contract
ops/observability/backup-cutover.json
ops/observability/bundle-assets.json
ops/observability/build-bundle.py
ops/observability/schemas/bundle.schema.json
ops/observability/schemas/backup-cutover.schema.json
scripts/tests/ops-stack-definition.test.sh
Makefile
~~~

### Do NOT touch

- `infra/docker-compose*.yml`, application Nginx routes or current production ownership
- production VPS, protected environment files, databases, volumes, backup archives or containers
- remote apply/preflight executor, data copy, cutover or rollback execution
- `apps/web/**`, `apps/api/**`, content contracts and sre-kit source

---

## Contracts

See `docs/SPEC.md` §7.1–§7.3 and §8 and the Files list above.

---

## Gate Checks

The Critical Gate is Compose/shell/Python/documentation scoped. Render with synthetic values and
inspect the canonical model; do not run `up`, `create`, `pull` or any production command.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Upstream health contracts were verified before encoding them. Umami gets its official
  `/api/heartbeat` container healthcheck; Beszel exposes `/api/health` as bundle/preflight metadata
  rather than assuming an unverified curl/wget binary exists inside the pinned image.
- Beszel `0.18.7` is the patched version for CVE-2026-40077; the inactive stack deliberately keeps
  the current production version instead of combining lifecycle separation with an unrelated
  version upgrade.

---

## Commit Message

```
feat(change-33): define independent operations stack
```
