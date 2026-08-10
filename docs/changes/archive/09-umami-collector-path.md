# CHANGE 09 — Umami Collector Path

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `09` |
| Slug | `umami-collector-path` |
| Title | Restore production Umami event ingestion |
| Status | `active` |
| Branch | `feature/09-umami-collector-path` |

---

## Goal

Make the public Umami tracker send pageviews and allowlisted application events to the single
public collector route `/stats/api/send`. Preserve the private-by-default `/stats/` boundary and
verify the real production browser channel that exposed the duplicated `/stats/stats/api/send`
path after Change 08 deployed successfully.

---

## Backlog

### Backend
None

### Frontend
None

### Infra
- [x] `I1` Configure Umami's collector endpoint relative to `BASE_PATH=/stats`, so the generated
  tracker targets exactly `/stats/api/send` instead of `/stats/stats/api/send` — _Depends on:_ —
- [x] `I2` Strengthen the public-proxy regression test to reject the duplicated collector path and
  validate the Compose environment contract — _Depends on:_ I1

### Data
None

### Other
- [x] `T1` Record the BASE_PATH plus COLLECT_API_ENDPOINT duplication symptom and fix in
  KNOWN_GOTCHAS — _Depends on:_ I1

---

## Files

### Create / modify
~~~
infra/docker-compose.prod.yml
scripts/tests/umami-proxy.test.sh
docs/KNOWN_GOTCHAS.md
docs/changes/09-umami-collector-path.md
~~~

### Do NOT touch
- Umami database contents, website identity or credentials
- application analytics event payloads
- private ops authentication or WireGuard configuration
- unrelated frontend/backend behavior

---

## Contracts

The browser-visible collector is exactly `/stats/api/send`. `/stats/script.js` remains public;
every other `/stats/` route remains 404. `BASE_PATH` owns the `/stats` prefix, while
`COLLECT_API_ENDPOINT` supplies the unprefixed collector route `/api/send`.

---

## Gate Checks

The focused shell regression must validate both the Compose environment and Nginx allowlist.
Production acceptance requires observable browser request/response evidence, not curl-only route
availability: after deployment the tracker must load, expose `umami.track`, POST successfully to
exactly `/stats/api/send`, and produce no console errors.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-09): restore Umami collector path
```
