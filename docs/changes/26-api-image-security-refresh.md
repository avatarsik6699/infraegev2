# CHANGE 26 — API Image Security Refresh

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `26` |
| Slug | `api-image-security-refresh` |
| Title | API Image Security Refresh |
| Status | `active` |
| Branch | `feature/26-api-image-security-refresh` |

---

## Goal

Unblock the production release after the image gate detected fixed HIGH vulnerabilities in
util-linux packages inherited by the pinned Python base image. Install only the affected security
updates during the API image build while preserving the pinned base, application dependencies and
runtime behavior.

---

## Backlog

### Backend

None.

### Frontend

None.

### Infra

- [x] `I1` Update only the vulnerable util-linux package family from the Debian security
  repository in the API image, keep APT update/install/cleanup in one layer and verify the built
  image has the fixed package versions with no HIGH or CRITICAL findings — _Depends on:_ —

---

## Files

### Create / modify

~~~
docs/changes/26-api-image-security-refresh.md
apps/api/Dockerfile
~~~

### Do NOT touch

- Python dependencies, application code, API contracts or lesson content
- Frontend, Compose topology, production credentials or observability

---

## Contracts

See `docs/STACK.md` package and immutable-image policy. The pinned Python base and application
dependency locks remain unchanged; this change applies the already-published Debian security fix
inside the API runtime image.

---

## Gate Checks

In addition to the affected Critical Gate, build the API image, inspect the affected installed
package versions and run the repository image security gate.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The current official `python:3.12-slim` manifest still contains util-linux `2.41-5`; waiting for
  a future upstream rebuild would leave the release blocked, so the image applies only Debian's
  available `2.41.5-0+deb13u1` security update family.

---

## Commit Message

```text
fix(change-26): apply API base image security updates
```
