# CHANGE 193 — Кодумка: new public domain and brand

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `193` |
| Slug | `kodumka-domain` |
| Title | Кодумка: new public domain and brand |
| Status | `active` |
| Branch | `feature/193-kodumka-domain` |

---

## Goal

Move the public site from `infraege.ru` to `https://kodumka.ru` under the brand «Кодумка» before
paid access goes live (SPEC Metadata, §7.1). The old domain and `www` hosts answer 301 to the new
origin with path and query kept. `infraege` stays the internal code name. Ships together with
Change 192 in one `/ship --release`.

Already done outside the repo (2026-10-18): `kodumka.ru` bought at reg.ru with A records for `@`
and `www` → the VPS; Postbox address `kodumka.ru` created with two DKIM CNAMEs, SPF and DMARC
added; Yandex Webmaster and Google Search Console properties created with DNS TXT verification
records; mailbox `kodumka@mail.ru`.

---

## Backlog

### Frontend
- [x] `F1` Brand in the UI: `siteConfig` name/origin, header wordmark and aria labels, footer,
  every route title suffix «— Кодумка», home title, document-head fallbacks; show the wordmark
  to the architect before merging — _Depends on:_ —
- [x] `F2` Social image and app icons carry the new name (`/brand/*`, manifest names); the stone
  mark stays — _Depends on:_ F1
- [x] `F3` Contact `kodumka@mail.ru` in privacy, consent, offer and refund texts; offer and
  privacy name the site `kodumka.ru` (no payment yet, so the current offer edition is edited) —
  _Depends on:_ —
- [x] `F4` Brand leftovers from the release audit: course lesson titles end with «— Кодумка»;
  Nginx 502/503/504 pages carry the new name — _Depends on:_ F1

### Infra
- [x] `I1` Nginx: `kodumka.ru` serves the app; `www.kodumka.ru`, `infraege.ru`,
  `www.infraege.ru` → 301 `https://kodumka.ru$request_uri`; CSP unchanged except origins —
  _Depends on:_ —
- [x] `I2` Certificates for both domains: initial issue script and renewal configuration cover
  `kodumka.ru`, `www.kodumka.ru` and the old pair — _Depends on:_ I1
- [x] `I3` Deploy and release scripts, target checks, `.env.example` (`PUBLIC_ORIGIN`,
  `MAIL_FROM=accounts@kodumka.ru`), compose prod defaults — _Depends on:_ —
- [x] `I4` CI: uptime, browser audit and Lighthouse targets use the new origin; uptime also
  checks that `infraege.ru` redirects — _Depends on:_ I1

### Other
- [x] `T1` Tests and e2e page objects that pin the origin, the Robokassa test fixtures, shell
  tests of deploy/auth scripts — _Depends on:_ F1, I1, I3
- [x] `T2` Docs: README, STACK, production/billing/privacy runbooks (Robokassa Result/Success/
  Fail URLs, OAuth callback URLs, cutover steps: certificate, `production.env`, Postbox check,
  Webmaster/Search Console «переезд сайта», Telegram `/setdomain` only when that login is
  enabled), DESIGN brand note — _Depends on:_ I1, I2, I3
- [x] `T3` Analytics: confirm the `smotryashchiy` site accepts `kodumka.ru` as its host, or
  record the needed change in that product — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/web/src/shared/config/site.ts
apps/web/src/routes/*.tsx (titles), apps/web/src/app/route-state/app-document-head.tsx
apps/web/src/widgets/public-header/*, apps/web/src/widgets/public-footer/*
apps/web/src/shared/lib/seo/page-head.ts, apps/web/src/routes/__root.tsx
apps/web/public/brand/*, web manifest
apps/web/src/pages/privacy/*, content/legal/**
apps/web/tests/*, apps/web/e2e/pages/*, apps/api/tests/test_robokassa.py
infra/nginx/conf.d/infraege.prod.conf, infra/docker-compose.prod.yml, infra/.env.example
ops/obtain-initial-certificate.sh, ops/configure-certificate-renewal.sh
scripts/check-release-target.sh, scripts/deploy-remote.sh, scripts/release_checkpoint.py,
scripts/lib/application-db-release.sh, scripts/docker-dev-lifecycle.sh, scripts/tests/*
.github/workflows/{deploy,uptime,audit-browser}.yml, lighthouserc.cjs
README.md, docs/STACK.md, docs/runbooks/*, DESIGN.md
~~~

### Do NOT touch
- Internal names: Compose project, volumes, DB roles, `/etc/infraege`, cookie names,
  `localStorage` keys, GitHub repository, `sre.infraege.ru`
- `docs/changes/archive/`
- The production host (cutover runs in the release, by the runbook)

---

## Contracts

See `docs/SPEC.md` Metadata and §7.1 and the Files list above.

---

## Gate Checks

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 06dffa3+wt | format python-format tooling-lint web-lint web-typecheck shell-lint api-lint api-typecheck host-ruff host-python docs-links infra-config; vitest brand-assets/public-release/public-header/design-token-contract; pytest test_robokassa; unittest release_checkpoint_test; auth-edge, paid-gate, practice-read-limit, docker-dev-lifecycle; Playwriter header/footer | PASS | ~180 |

---

## Implementation Notes

- Asset file names (`/brand/infraege-*`, `infraege-mark.svg`) and `data-infraege-*` hooks keep the
  code name; only their rendered text changes.
- The consent text keeps version `2026-09-25`: only the site name and contact address changed, not
  the operator, purposes or data. Accepted without a new consent version (no lawyer, 2026-10-18).
- Redirects use 301, not the former 308, because Yandex documents a site move by 301.
- `check-release-target.sh` accepts a healthy target on `infraege.ru` too, so the first
  kodumka.ru release passes its preflight; the deploy needs both certificates on the host.
- T3: `smotryashchiy` drops beacons whose Origin is not the registered site domain
  (`OriginMatchesSite`) and has no site update, so a new site `kodumka.ru` was created through its
  API (2026-10-19) and `data-site` points to it; the old site keeps the infraege.ru history.
  Uptime targets for kodumka.ru are a cutover step (they would be red until the release).

---

## Commit Message

```
feat(change-193): Кодумка — kodumka.ru origin, 301 from infraege.ru
```
