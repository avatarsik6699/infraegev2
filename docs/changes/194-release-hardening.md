# CHANGE 194 — Release hardening before the kodumka.ru launch

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `194` |
| Slug | `release-hardening` |
| Title | Release hardening before the kodumka.ru launch |
| Status | `active` |
| Branch | `feature/194-release-hardening` |

---

## Goal

Close the code-side P0/P1 findings of the 2026-10-19 release audit (security advisories, SEO
defects, an analytics privacy gap, missing alerting and payment-conversion visibility) so the
site can launch on kodumka.ru with payments (SPEC §8 SEO and Observability rows). Ships in the
same release as Changes 192–193 and the later content audit.

---

## Backlog

### Backend
- [x] `B1` `admin funnel` in `app/modules/billing/admin.py`: per day and plan — orders created,
  paid, expired/failed, refunded, revenue; date range option; ids and counts only, no emails —
  _Depends on:_ —

### Frontend
- [x] `F1` `noIndex` heads for `/account`, `/sign-in`, `/register`, `/password-reset`,
  `/verify-email` — _Depends on:_ —
- [x] `F2` robots.txt: Disallow `/api/` and `/_serverFn/` (account pages rely on `noindex`, see
  notes); Yandex `Clean-param: returnTo&from&plan`; drop `/lab/` — _Depends on:_ —
- [x] `F3` Sitemap: each course lists only its own lessons (no 404 URLs); add `/pricing` while
  billing is on — _Depends on:_ —
- [x] `F4` Practice task pages: title and description from the task statement, distinct per
  task — _Depends on:_ —
- [x] `F5` Subtopic and «Практика и итог» pages get distinct descriptions — _Depends on:_ —
- [x] `F6` Internal links to a topic point at its first subtopic (no 301 hop) — _Depends on:_ —
- [x] `F7` Analytics: the tracker never records account/auth paths after in-app navigation
  from a public page — one `privatePaths` list skips the script on page load and is passed as
  `data-exclude`; the tracker honours it in the smotryashchiy change — _Depends on:_ —

### Infra
- [x] `I1` Crawl paths (`/sitemap*`, `/ege/`, `/courses`) leave the 120/min `practice_reads`
  zone for a crawler-friendly limit; `application/xml` and `text/plain` in `gzip_types` —
  _Depends on:_ —
- [x] `I2` `uptime.yml`: on failure send a Telegram message (secrets `TELEGRAM_BOT_TOKEN`,
  `TELEGRAM_CHAT_ID`; skipped with a warning when absent) — _Depends on:_ —

### Other
- [x] `T1` Security: `seroval` ≥ 1.6.3 and `source-map-js` ≥ 1.2.2 in `pnpm-lock.yaml`; security
  gate clean — _Depends on:_ —
- [x] `T4` Security (found while fixing T1): TanStack Start reflected XSS (CVE-2026-102989,
  critical) — `@tanstack/react-start` 1.168.61, `@tanstack/react-router` 1.170.42; dev-tool
  advisories (brace-expansion, basic-ftp, proxy-addr, compression) overridden; extract-zip (no
  fix, Lighthouse CI only) ignored with a reason — _Depends on:_ T1
- [x] `T2` Browser audit: `e2e/topic-reading.spec.ts:30` and `:51` failures reproduced on local
  main and fixed, or shown stale — _Depends on:_ —
- [x] `T3` Docs: billing runbook (`admin funnel`), production runbook (Telegram secrets, alert
  test) — _Depends on:_ B1, I2
- [x] `T5` Browser portfolio green on the candidate (found while verifying): e2e first-subtopic
  map covers all 25 topics, topic/dashboard counts follow the publications, task-strip tab count
  ignores self-check tabs, the detail test picks a task with help, topic links expect the first
  subtopic — _Depends on:_ F6

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/admin.py, apps/api/tests/test_billing*.py
apps/web/src/routes/{account,sign-in,register,password-reset,verify-email}.tsx
apps/web/src/routes/robots[.]txt.ts, apps/web/src/pages/site-discovery/*
apps/web/src/routes/practice.$taskId.tsx, ege_.$slug.$subtopic.tsx, ege_.$slug.praktika.tsx
topic link sources (catalog/home cards), apps/web/src/routes/__root.tsx
apps/web/tests/*, apps/web/e2e/*
infra/nginx/nginx.conf, infra/nginx/snippets/*, infra/nginx/conf.d/infraege.prod.conf
.github/workflows/uptime.yml, package.json / pnpm-lock.yaml
docs/runbooks/{billing,production}.md
~~~

### Do NOT touch
- `docs/changes/archive/`, generated lesson `.tsx` (pipeline-built), the production host
- smotryashchiy repository (its delivery fixes are a separate change)

---

## Contracts

See `docs/SPEC.md` §8 (SEO, Observability rows) and the Files list above.

---

## Gate Checks

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 2ea4c2a+wt | format python-format tooling-lint web-lint web-typecheck shell-lint api-lint api-typecheck docs-links infra-config api-contract; Vitest 561; pytest test_billing jobs; practice-read-limit nginx contract; Trivy lockfiles + pnpm audit clean; browser portfolios account, full (265), billing; headless UI/SEO check of the dev stack | PASS | ~2400 |

---

## Implementation Notes

- robots.txt does not disallow the account and sign-in pages: they carry `noindex`, and a
  disallowed page cannot show its `noindex` to a crawler. Only `/api/` and `/_serverFn/` are closed.
- `/subscribe` stays visible to the tracker: it has no tokens (the query is never sent) and its
  pageviews are the middle step of the pricing → checkout path.
- `pnpm install` re-resolved two Lighthouse-only packages (`legacy-javascript`, `third-party-web`)
  within the 7-day release-age rule.
- Topic links read the first subtopic from `topic-catalog.ts` (kept beside the subtopic counts so
  the prerendered home loads no lesson content); a test checks both against the lessons.
- The browser portfolio had drifted since earlier changes ran only focused specs (T5): stale topic
  map, counts and self-check disclosure. Auth pages and the delayed-hydration course test get a
  15 s window: on the dev server hydration under the full portfolio's load outlasts 5 s.
- UI verification used a headless Playwright script against the dev stack: the Playwriter
  extension did not connect (Chrome started with the Default profile, extension not attached).
- F7 is complete on this side only: the tracker ignores `data-exclude` until the smotryashchiy
  change ships; until then a public → account navigation can still be counted.

---

## Commit Message

```
feat(change-194): release hardening — CVEs, SEO, alerts, funnel
```
