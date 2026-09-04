# CHANGE 93 — Web Image Cache Recovery 2

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `93` |
| Slug | `web-image-cache-recovery-2` |
| Title | Web Image Cache Recovery 2 |
| Status | `archived` |
| Branch | `feature/93-web-image-cache-recovery-2` |

---

## Goal

"Publish production images" (`.github/workflows/images.yml`) fails deterministically on the `web`
image with `ERR_PNPM_VERIFY_DEPS_BEFORE_RUN Setting overrides of lockfile in /repo is outdated`
during `RUN pnpm --filter web build`, blocking the Change 90–92 release. This is the exact stale
GHA BuildKit cache symptom already documented in `docs/KNOWN_GOTCHAS.md` (recorded by Change 73):
the `web-v2` cache scope now holds an internally inconsistent dependency layer. Reproduced twice in
CI (fresh push + rerun); a local `docker build --no-cache --target builder -f apps/web/Dockerfile .`
against the same commit succeeds cleanly, proving the source tree/lockfile are correct and the
poisoned cache is CI-side only. Per the documented fix, move only the `web` image to a new cache
generation.

---

## Backlog

### Infra

- [x] `I1` Bump `web`'s `cache_scope` from `web-v2` to `web-v3` in
  `.github/workflows/images.yml`, preserving cache reuse for `api` and `nginx` — _Depends on:_ —

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify
~~~
.github/workflows/images.yml
~~~

### Do NOT touch
- `api`/`nginx` cache scopes — unaffected, already building successfully
- Any application code — the stale cache is CI-side only, already proven by a clean local
  `--no-cache` build

---

## Contracts

See `docs/KNOWN_GOTCHAS.md` (stale GHA BuildKit cache entry) and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](./STACK.md) — this section only records
> change-specific overrides.

Infra-only, workflow-config change. Verification is the CI run itself (`images.yml` on push to
`main`), not a local gate row — already have a local `docker build --no-cache` cold-build proof
per `docs/KNOWN_GOTCHAS.md`'s documented recovery procedure.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-93): isolate stale web image cache scope (recurrence of change-73)
```
