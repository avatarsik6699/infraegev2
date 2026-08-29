# CHANGE 73 — Web Image Cache Recovery

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `73` |
| Slug | `web-image-cache-recovery` |
| Title | Web Image Cache Recovery |
| Status | `active` |
| Branch | `feature/73-web-image-cache-recovery` |

---

## Goal

Recover the blocked production release after GitHub BuildKit repeatedly restored an internally
stale web dependency layer that failed pnpm's pre-run lockfile verification. Isolate the web image
from the poisoned cache generation without disabling caching or changing application behavior.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Move only the web image job to a new explicit GHA BuildKit cache generation while preserving the existing API and Nginx scopes — _Depends on:_ —
- [x] `I2` Record the stale-cache symptom, cold-build proof, and narrow recovery procedure in `docs/KNOWN_GOTCHAS.md` — _Depends on:_ I1

### Other

None

---

## Files

### Create / modify

~~~
.github/workflows/images.yml
docs/KNOWN_GOTCHAS.md
docs/changes/73-web-image-cache-recovery.md
~~~

### Do NOT touch

- `apps/`
- `content/`
- `infra/`
- `ops/`
- Production environment files or secrets

---

## Contracts

See `docs/SPEC.md` §7 and the Files list above. Image tags, provenance, scans, deployment inputs,
and production topology remain unchanged.

---

## Gate Checks

In addition to the applicable Critical Gate rows:

```bash
docker build --no-cache --target builder \
  --build-arg VITE_UMAMI_WEBSITE_ID=00000000-0000-0000-0000-000000000000 \
  -f apps/web/Dockerfile .
# expected: pnpm frozen install, production build, and 33-page prerender pass
```

`/ship 73 --release` must pass the canonical Full and Release Gates before another push/deploy.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```text
fix(change-73): isolate stale web image cache
```
