# CHANGE 166 — PCRE2 release security patches

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `166` |
| Slug | `pcre2-security-patches` |
| Title | PCRE2 release security patches |
| Status | `active` |
| Branch | `feature/166-pcre2-security-patches` |

## Goal

Unblock the authorized Change 165 production release after its published API/Nginx
images failed the security gate. Apply exact patched PCRE2 OS package versions,
following the existing STACK policy; product and deployment contracts stay unchanged.

## Backlog

### Infra
- [x] I1 Pin Debian libpcre2-8-0 to 10.46-1~deb13u3 and Alpine pcre2 to 10.49-r0; verify package availability and built-image scans — _Depends on:_ —
- [x] I2 Refresh unavailable Alpine libcrypto3/libssl3 3.5.8-r0 pins to available 3.5.9-r0 so the patched image builds — _Depends on:_ —

## Files

### Create / modify
- `apps/api/Dockerfile`
- `infra/nginx/Dockerfile`
- `docs/changes/166-pcre2-security-patches.md`

### Do NOT touch
- Application code, schema, base-image digests, paused Change 164 and other package pins.

## Contracts

See `docs/SPEC.md` §7–§8 and `docs/STACK.md` image patch policy.

## Gate Checks

See [STACK](../STACK.md). Build/scan the two affected images, verify their package
versions, API imports and Nginx configuration. No application-code, type, UI or schema
checks are invalidated. Exact-SHA published-image scans and deploy checkpoints remain
mandatory for release.

## Implementation Notes

- Candidate f46c92a6041517f6cddf28c0f23417e82cdc6df1 was not deployed: image run
  36991231414 found CVE-2026-103111 in both images and three older PCRE2 findings in
  Nginx. Debian's security tracker confirms the patched package version.

## Commit Message

```
fix(change-166): patch PCRE2 in production images
```
