# CHANGE 59 — Refresh API Base Image

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `59` |
| Slug | `refresh-api-base-image` |
| Title | Refresh API Base Image |
| Status | `active` |
| Branch | `feature/59-refresh-api-base-image` |

---

## Goal

Restore the Release Gate after its image scan found fixed HIGH OpenSSL vulnerabilities in the
pinned Python base image, without changing application behavior or weakening the security gate.

---

## Backlog

### Infra

- [x] `I1` Refresh the immutable `python:3.12-slim` digest and explicitly upgrade its three
  OpenSSL packages to the fixed Debian security version — _Depends on:_ —
- [x] `I2` Explicitly upgrade the Nginx image's two OpenSSL packages to the fixed Alpine security
  version discovered by the complete image scan — _Depends on:_ —

### Other

- [x] `T1` Rebuild and scan all production images, proving zero fixed HIGH/CRITICAL findings
  before repeating the Full and Release Gates — _Depends on:_ I1, I2

---

## Files

### Create / modify

~~~
docs/changes/59-refresh-api-base-image.md
apps/api/Dockerfile
infra/nginx/Dockerfile
~~~

### Do NOT touch

- Application behavior, dependencies, and public API contracts
- Release Gate thresholds or scanner suppressions

---

## Contracts

See `docs/SPEC.md` §7–§8 and `docs/STACK.md` Release Gate and production image policy.

---

## Gate Checks

Run the repository formatting check and `pnpm audit:images`, then repeat the mandatory Full and
Release Gates through `/ship 59 --release`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The refreshed official digest still shipped Debian OpenSSL 3.5.6; its security repository
  already provides 3.5.7, so the existing explicit upgrade list now pins all three fixed packages
  instead of weakening Trivy policy.
- The complete scan then exposed the same new CVE in Nginx's Alpine OpenSSL packages; the image
  now upgrades both packages to Alpine's fixed 3.5.8 release.

---

## Commit Message

```text
fix(change-59): refresh API base image
```
