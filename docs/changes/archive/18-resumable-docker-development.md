# CHANGE 18 — Resumable Docker Development

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `18` |
| Slug | `resumable-docker-development` |
| Title | Resumable Docker Development |
| Status | `archived` |
| Branch | `feature/18-resumable-docker-development` |

## Goal

Make the normal local Docker workflow resume existing containers without an unconditional image
build or teardown. Keep image rebuild and container/network removal explicit, preserve PostgreSQL
data in every ordinary lifecycle path, and document the ownership boundary clearly.

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Separate fast `dev`, explicit `rebuild`, resumable `stop`, and explicit `down` targets while preserving health waits, bounded shutdown and PostgreSQL data — _Depends on:_ —
- [x] `I2` Synchronize the README, stack contract, infrastructure blueprint and recurring gotcha with the resumable lifecycle — _Depends on:_ I1
- [x] `I3` Verify the effective Compose model and prove that stop/start reuses the development containers without invoking an image build — _Depends on:_ I1

### Data

None

### Other

None

## Files

### Create / modify

~~~
Makefile
README.md
docs/STACK.md
docs/INFRASTRUCTURE_BLUEPRINT.md
docs/KNOWN_GOTCHAS.md
docs/changes/18-resumable-docker-development.md
~~~

### Do NOT touch

- `infra/docker-compose.dev.yml`
- `apps/web/Dockerfile`
- `apps/web/package.json`
- `pnpm-lock.yaml`
- `content/`
- Application source under `apps/api/`, `apps/web/src/` and `apps/ops/`

## Contracts

See `docs/SPEC.md` §7 and the Files list above. The codebase and `SPEC.md` are the source of truth;
this file only tracks what to build and what is left.

## Gate Checks

In addition to the applicable Critical Gate rows, verify the effective Compose model and the
resumable lifecycle against the real local stack. The verification must preserve the PostgreSQL
named volume and leave the development stack healthy.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

None

## Commit Message

```
feat(change-18): make local Docker lifecycle resumable
```
