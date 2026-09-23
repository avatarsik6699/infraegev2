# CHANGE 137 — Web image builds when its install layer comes from cache

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `137` |
| Slug | `web-image-cached-install` |
| Title | Web image builds when its install layer comes from cache |
| Status | `archived` |
| Branch | `feature/137-web-image-cached-install` |

---

## Goal

The Changes 135–136 release push (`74094bb`, 2026-09-23) failed `images.yml` for `web` at
`pnpm --filter web build` with `ERR_PNPM_VERIFY_DEPS_BEFORE_RUN  Setting overrides of lockfile in
/repo is outdated`; `api` and `nginx` published. Dependency inputs are identical to the deployed
`2cf106e`, and a cold `docker build --no-cache --target builder` passes. Reproduced locally and
deterministically: in the builder image, making any manifest newer than the install
(`touch apps/web/package.json`) makes pnpm 10.33.0 run its deep dependency check, which reports the
overrides as outdated although the lockfile and `node_modules/.modules.yaml` carry the same
overrides. In CI this is exactly what happens when the `pnpm install` layer is restored from the
GHA cache and `COPY apps/web` is fresh. The existing gotcha ("internally stale layer", fix: new
`cache_scope`) misread it: a new scope only helped because it forced one cold install, and the
failure returns on the next web change with unchanged dependencies. Fix the builder stage instead,
keeping `verifyDepsBeforeRun: error`. Deploy stays blocked until this ships; production remains on
`2cf106e`. No SPEC contract changes.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Infra
- [x] `I1` Tests first: `scripts/tests/web-image-build.test.sh` asserts that the `apps/web/Dockerfile`
      builder stage runs `pnpm install --frozen-lockfile --offline` after `COPY apps/web apps/web`
      and before `pnpm --filter web build`, and that `pnpm-workspace.yaml` keeps
      `verifyDepsBeforeRun: error`. — _Depends on:_ —
- [x] `I2` `apps/web/Dockerfile` builder: re-run the frozen install offline (store already in the
      layer, ~1 s, no network) after copying the web sources, so pnpm's install state is newer than
      every manifest whether or not earlier layers came from cache. Acceptance: in the built
      builder image, `touch apps/web/package.json package.json` followed by the same two commands
      builds under `--network none`; the unpatched sequence fails with the CI error. —
      _Depends on:_ I1
- [x] `T1` `docs/KNOWN_GOTCHAS.md`: rewrite "GitHub BuildKit can restore an internally stale pnpm
      install layer" with the real cause (manifest newer than install → pnpm 10.33 deep check
      false positive on overrides) and the builder-stage fix; bumping `cache_scope` is no longer
      the remedy. — _Depends on:_ I2

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
apps/web/Dockerfile                    (I2)
scripts/tests/web-image-build.test.sh  (I1, new)
docs/KNOWN_GOTCHAS.md                  (T1)
~~~

### Do NOT touch
- `pnpm-workspace.yaml` (`verifyDepsBeforeRun` stays `error`), `pnpm-lock.yaml`.
- `.github/workflows/images.yml` cache scopes.
- The `development` stage (sources are bind-mounted; not on the release path).

---

## Contracts

See `docs/SPEC.md` and the Files list above. Do not hand-copy the schema, endpoints, types, or env
vars into this file — the codebase and `SPEC.md` are the source of truth; this file only tracks
what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or when release risk selection requires it. All gates are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

Release acceptance: `images.yml` for the release SHA succeeds for all three images while the web
install layer is restored from cache (the log shows the install step cached and the build step
green).

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work [XX] review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-137): rerun offline frozen install after copying web sources
```
