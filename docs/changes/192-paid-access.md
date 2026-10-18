# CHANGE 192 — Paid access: plans, soft paywall, gated content and payments

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `192` |
| Slug | `paid-access` |
| Title | Paid access: plans, soft paywall, gated content and payments |
| Status | `active` |
| Branch | `feature/192-paid-access` |

---

## Goal

Make the site ready to sell access at release (SPEC §2.2, §3, §4, §5 «Paid access UI», §6.1, §7.3,
§8.2, §11). The scope covers:
- two one-time plans: month 490 ₽ and year 2 990 ₽, with no auto-renewal;
- a soft paywall over the approved free/paid matrix;
- paid theory in `.paid.` lazy chunks that Nginx serves only after an access check;
- paid practice closed by the API;
- Robokassa payments for a самозанятый seller, plus operator refunds and the НПД revenue guard.

Everything ships to `main` with `PAYWALL_ENABLED` and `BILLING_ENABLED` off, so production stays free until launch.

Source plan: architect sessions 2026-10-16/17
([plan doc](https://claude.ai/code/artifact/b5e337fa-55c1-4956-b1eb-51c27492a8c5)).

---

## Design References

- Soft paywall reference supplied by the architect: a Medium «members only» story whose text fades out above an account card. It is dark; ours is the light Clean Textbook version (DESIGN.md).
- Mockups for paywall card, tree lock, locked task, `/pricing` and checkout are approved before frontend code (F1).

---

## Backlog

### Data / content
- [x] D1 `access` per subtopic, `final_access` per topic in `content/lesson-design/topic-*/topic.json` and per lesson in `course-*/course.json` by the SPEC §2.2 matrix (free: Python; Excel 1–6; topics 1–11, 14, 16; elsewhere the first ~third of subtopics) — _Depends on:_ —
- [x] D2 Exporters (`scripts/lesson_design/export_lesson.py`, `export_course.py`): emit `accessTier` from sources, split each paid subtopic/lesson into `<id>.paid.<slug>.tsx` + `.media.ts` loaded via `React.lazy`, keep free blocks, metadata and a preview (lead + opening paragraph) in the main module; `--check` stays green — _Depends on:_ D1
- [x] D3 Pilot one partly paid topic, review the output, then re-export all topics and the Excel course; no hand edits to TSX — _Depends on:_ D2
- [x] D4 Practice registry v2 (`scripts/practice-registry.mjs` → `apps/api/practice-registry.json`) carries subtopic/lesson/final access and reads `.paid.` modules; validator in `scripts/validate-content-links.mjs` enforces the matrix and web/API agreement — _Depends on:_ D2

### Backend
- [x] B1 Settings: `PAYWALL_ENABLED`, `BILLING_ENABLED`, plan prices/durations, Robokassa credentials (`SecretStr`), operator email, НПД limit; validation (paywall requires billing; production billing requires provider secrets) — _Depends on:_ —
- [x] B2 Migration `192_01_billing` (offer acceptance, payment, access grant, refund, provider event; grants per SPEC §3) and schema head bump everywhere (`core/database.py`, `infra/database-schema`, `scripts/lib/application-db-release.sh`, dev lifecycle, restore-check SQL) — _Depends on:_ — — _Note:_ restore-check SQL moved to I4
- [x] B3 `entitlement` module: `has_access`, task access from registry v2, `GET /api/access`, internal `GET /api/access/asset` — _Depends on:_ B1, B2, D4
- [x] B4 Practice enforcement: locked stubs in lesson practice; 403 `subscription_required` for detail/check/check-and-save/files of paid tasks; standalone bank free — _Depends on:_ B3
- [x] B5 `billing` module: provider port, fake adapter (disabled in production), offer/plan endpoint, checkout (session, CSRF, origin, verified email, offer version, idempotency, НПД pause), webhook (signature, dedup, status re-fetch, idempotent grant), payment status/history; grant stacking — _Depends on:_ B1, B2
- [x] B6 Robokassa adapter from current docs (Context7/primary docs): payment URL and signature, Result URL Password #2, `OpStateExt` status, refund API, receipt link; contract tests on recorded fixtures — _Depends on:_ B5 — _Note:_ fixtures are synthetic in the documented shapes; recording real test-mode answers is a launch step (`docs/runbooks/billing-provider-selection.md`); receipts come from Робочеки by mail, no link in our data
- [x] B7 Operator CLI `python -m app.modules.billing.admin`: `refund --amount auto|full` (proportional unused days; shortens grant), `show --user`, `revenue --year`; jobs entry `python -m app.modules.billing.jobs` (settle pending, expire unpaid, daily reconcile, НПД thresholds 70/85/95 %, «доступ заканчивается через 3 дня» mail) — _Depends on:_ B5
- [x] B8 Account deletion hook: end access, refund request for unused part, pseudonymize billing rows; mail templates (paid with receipt, ending soon, refunded) via `account/mail.py`; regenerate OpenAPI/client — _Depends on:_ B5

### Infra
- [x] I1 Vite/Rolldown chunk rule: `*.paid.*` chunks into `assets/paid/`, never merged into shared chunks; no public sourcemaps; `scripts/check-paid-leak.mjs` in the gate (sentinel phrases absent outside `assets/paid/` and prerendered HTML) — _Depends on:_ D2
- [x] I2 Nginx (`infra/nginx/conf.d/infraege.prod.conf` + dev conf): `auth_request` for `/assets/paid/` → `/api/access/asset` with `private, no-store`; webhook location with own limit zone and small body — _Depends on:_ B3, B5
- [x] I3 Systemd `infraege-billing.{service,timer}` + script (pattern `infraege-account-purge`), installer, `infra/.env.example` keys and production runbook steps — _Depends on:_ B7

### Frontend
- [x] F1 Mockups (impeccable, DESIGN): paywall card with fading preview, tree lock, locked task card, topic/course free-part note, `/pricing` (Free «Ваш план», Месяц, Год with ~~5 880 ₽~~ −49 %, 249 ₽/мес, 8 ₽/день), checkout, account «Доступ»; architect approval — _Depends on:_ — — _Note:_ approved 2026-10-18 after 13 rounds (artifact GEaQy7LtnsJ8ksha2DnFsu v15): orange CTA `#c95000`, no catalog notes, «урок» only in paid-access texts, month plan featured; per-day price and topic/course free-part notes dropped by the architect
- [x] F2 SSR access state: server function forwarding only the session cookie to `GET /api/access`; preload paid chunk for viewers with access; `private, no-store` on their HTML — _Depends on:_ B3
- [x] F3 `features/paywall`: lazy paid sections with preview + paywall card for topic subtopics, «Практика и итог» and course lessons; tree locks; locked practice cards; free-part notes; JSON-LD `isAccessibleForFree`/`hasPart` — _Depends on:_ F1, F2, D3, B4 — _Note:_ `features/paywall` (gate, preview fade, locked tasks), locks in both lesson trees and «На этой странице», paid-article JSON-LD with `.paywall`; self-check counts come from the exporters (`selfCheck`/`checkpoint` are numbers now); the four scenes are baked into `public/images/mascot`
- [x] F4 `/pricing`, `/subscribe?plan=&from=` (one «Оплатить», small offer line, no checkboxes), payment return page (polls status, returns to `from`), account «Доступ» (until, history with receipts, «Продлить») — _Depends on:_ F1, B5 — _Note:_ `/pricing`, `/subscribe`, `/subscribe/return` (polls the API, never trusts the query), profile tab «Доступ» (`/account?tab=access`); prices from `/api/billing/offer` (year compared with twelve month prices)
- [x] F5 Legal pages from `content/legal/*.md`: `/oferta` (current + dated versions, «Реквизиты исполнителя» at the end, age/guardian clause, full refund on parent request), `/vozvrat`; privacy policy update (payment provider as recipient, billing retention); footer «Тарифы», «Оферта», «Возврат» — _Depends on:_ B5 — _Note:_ `/oferta` (+ `/oferta/<date>`), `/vozvrat` render `content/legal` (copied into the web image, mounted in dev); privacy page «Оплата доступа»; footer links follow `BILLING_ENABLED` via the root loader
- [x] F6 Remove the always-on «По подписке» labels (`lesson-intro.tsx`, `course-lesson-page.tsx`); every paid marker follows the flag — _Depends on:_ F3 — _Note:_ the «По подписке» labels were already gone; every paid marker follows `accessState.locks`

### Other
- [x] T1 Docs: `docs/runbooks/billing.md` (operations, refunds, webhook outage, НПД limit, launch checklist), `docs/runbooks/billing-provider-selection.md` (Robokassa questions), FRONTEND/DESIGN entries for the paywall pattern, STACK gate row for `check-paid-leak`, KNOWN_GOTCHAS — _Depends on:_ B7, F3 — _Note:_ `billing.md` gained the launch checklist; FRONTEND «Paid access»; DESIGN paywall/plans, CTA Orange and the billing scenes; STACK and KNOWN_GOTCHAS already carried the gate and chunk rules; no lawyer review (architect, 2026-10-18)
- [x] T3 Pre-existing: the `test_tasks_api` checker stub lacks the Change 191 `answers` argument (found while running the API suite) — _Depends on:_ —
- [x] T4 Found in /work: `billing/documents.py` built its checkout-path candidate eagerly and crashed the API at import inside the image (`IndexError: 5`); candidates now follow the path depth — _Depends on:_ B5
- [x] T5 Found in /work: `/api/billing/offer` compared the year with 365/30 months (~~5 962 ₽~~, 246 ₽/мес); it now counts whole month passes (twelve: ~~5 880 ₽~~, 249 ₽), with a pytest — _Depends on:_ B5
- [x] T6 Found in /work: the standalone task page did not forward the session cookie, so a paying learner got «Не удалось загрузить задачу» on a paid task; it now forwards it (HTML `private, no-store`) and shows a locked state on 403 — _Depends on:_ B4
- [x] T7 Found in /work (T2 e2e): the «оплата прошла» notice was sent over SMTP inside the webhook/return request, under the account database's 8 s limit, so a slow relay turned a recorded payment into 503; in requests it is now sent detached after the data is read (`mail_paid(..., detach=True)`), the hourly job still awaits it — _Depends on:_ B5
- [x] T8 Found in /work (T2 e2e): the dev `/api` proxy (Nitro route rule) followed redirects, leaving the browser on `/api/billing/fake/pay/…` with the return page's HTML; it now passes redirects through (`fetchOptions.redirect: "manual"`), as Nginx does — _Depends on:_ F4
- [x] I4 Backup/restore tooling (`scripts/lib/application_db/`) recognises schemas after 140_01 (191_01, 192_01) and restore-checks the billing tables and grants; release preflight allows the multi-step 140_01 → 192_01 transition production needs — _Depends on:_ B2 — _Note:_ `bundle.py` knows 191_01/192_01, `sql.BILLING_RESTORE` (no DELETE/TRUNCATE, append-only acceptances, no runtime/import access) proven `t` on the dev 192_01 database; `APPLICATION_SKIPS=("140_01 192_01")` with preflight and rehearsal tests; the production rehearsal itself is a launch step (`docs/runbooks/backup-restore.md`)
- [x] T2 Tests: pytest (grant stacking, proportional refund, webhook replay/out-of-order/bad signature, double checkout, pending settle, deletion pseudonymization, append-only grants, flags off = free, access matrix guest/no access/access); Vitest for paywall components; E2E on the fake provider (pay → paid subtopic opens → access expires → preview + card); production-build check that `/assets/paid/*` is 401/403 without access; Playwriter desktop/mobile/no-JS — _Depends on:_ B4, B8, F4, F5, I2 — _Note:_ `e2e/billing-integration.spec.ts` (`playwright.billing.config.ts`, `scripts/run-isolated-browser-audit.sh billing`): guest paywall → register → member paywall → /pricing → /subscribe → fake pay → «Доступ открыт» → lesson without paywall → profile «Доступ»; access expiry stays with pytest (grant end) rather than a browser clock; the production-build gate is `scripts/tests/paid-gate.test.sh` (I2)

---

## Files

### Create / modify
~~~
docs/SPEC.md, docs/STACK.md, docs/FRONTEND.md, DESIGN.md, docs/KNOWN_GOTCHAS.md
docs/runbooks/billing.md, docs/runbooks/billing-provider-selection.md, docs/runbooks/production.md
content/lesson-design/topic-*/topic.json, content/lesson-design/course-*/course.json, content/legal/*.md
scripts/lesson_design/export_lesson.py, scripts/lesson_design/export_course.py
scripts/practice-registry.mjs, scripts/validate-content-links.mjs, scripts/check-paid-leak.mjs
apps/api/app/core/{config,database}.py, apps/api/app/api/router.py
apps/api/app/modules/{entitlement,billing}/**, apps/api/app/modules/practice/**, apps/api/app/modules/account/{service,api,mail}.py
apps/api/migrations/versions/192_01_billing.py, apps/api/tests/**, apps/api/practice-registry.json
contracts/openapi.json, apps/web/src/shared/api/schema.ts
apps/web/vite.config.ts, apps/web/src/entities/{lesson,course}/content/**, apps/web/src/routes/**
apps/web/src/features/{paywall,access-pass}/**, apps/web/src/entities/access-pass/**
apps/web/src/pages/{pricing,checkout,checkout-return,legal,account,topic-lesson,course-lesson,privacy}/**
apps/web/src/widgets/{public-footer,subtopic-navigation,course-navigation}/**, apps/web/e2e/**
infra/nginx/**, infra/.env.example, infra/database-schema, ops/systemd/infraege-billing.*, scripts/billing-jobs.sh
scripts/lib/application-db-release.sh, scripts/docker-dev-lifecycle.sh, scripts/lib/application_db/sql.py
~~~

### Do NOT touch
- `docs/changes/archive/**`
- Lesson TSX by hand: content changes go through stand sources and re-export
- Production host, `/etc/infraege/production.env` and deploy workflows; flags stay off

---

## Contracts

See `docs/SPEC.md` §2.2–§6.1 (and §7.3, §8.2, §11) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
> Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
> `python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

- Schema head changes (`192_01`): migration + isolated restore-check covering billing tables and grants.
- `check-paid-leak` must pass on a production web build.

### Gate evidence

<!-- Filled by /work from the gate.py summary; /ship compares the diff since this HEAD. -->

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 8c2d7e9 + worktree | format, python-format, tooling-lint, web-lint, web-typecheck, shell-lint, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config, api-contract, paid-leak | PASS | ~150 |
| 8c2d7e9 + worktree | pytest `test_billing.py`, `test_robokassa.py`, `test_tasks_api.py` (180) | PASS | 89 |
| 8c2d7e9 + worktree | Vitest full web suite (549) | PASS | ~60 |
| 8c2d7e9 + worktree | `scripts/tests/{paid-gate,billing-jobs,account-retention,auth-edge,auxiliary-pages,docker-dev-lifecycle,host-access-policy,release-retention}.test.sh`; unittest `gate_test`, `release_checkpoint_test` | PASS | ~200 |

| 8c2d7e9 + worktree (F1, F3–F6) | format, python-format, tooling-lint, web-lint, web-typecheck, shell-lint, api-lint, api-typecheck, host-ruff, host-python, docs-links, content-static, lesson-media, infra-config, api-contract, paid-leak | PASS (format, web-lint, api-contract after fixes: two files reformatted, literal mask colours and font sizes → tokens, client regenerated) | ~200 |
| 8c2d7e9 + worktree (F1, F3–F6) | Vitest full web suite (557, incl. `tests/paywall.test.tsx`); pytest `test_billing.py -k "offer_year or flags_off or disabled"` (2); exporter `--check` for every topic and course | PASS | ~180 |
| 8c2d7e9 + worktree (F1, F3–F6) | Playwriter, dev stack with `PAYWALL_ENABLED=BILLING_ENABLED=true`, fake provider: paid subtopic (member), «Практика и итог», /pricing 1280 and 390 (no horizontal scroll), /oferta, /subscribe → fake pay → /subscribe/return → lesson unlocked, /account?tab=access; guest SSR checked with curl (guest paywall, JSON-LD, locks, no paid text) | PASS | — |

| 8c2d7e9 + worktree (I4, T1, T2, T7, T8) | all 16 affected groups | PASS | ~175 |
| 8c2d7e9 + worktree (I4, T1, T2, T7, T8) | pytest `test_billing.py` (7); unittest `application_db_test` (9); `scripts/tests/{deploy-preflight,account-cutover,backup-restore,restore-readiness,release-retention}.test.sh`; `BILLING_RESTORE`/`ACCOUNT_RESTORE` = `t` on the dev 192_01 DB | PASS | ~600 |
| 8c2d7e9 + worktree (I4, T1, T2, T7, T8) | `run-isolated-browser-audit.sh billing` (1 passed); `… account` (1 passed on rerun; the first run timed out on cold-start hydration) | PASS | ~400 |

Coverage decision: `ops/systemd/infraege-billing-{hourly,daily}.{service,timer}` have no gate rule;
`scripts/tests/billing-jobs.test.sh` checks their script and installer wiring. Not yet run: isolated
migration/restore check of `192_01` (I4), F3–F5 UI, Playwriter desktop/mobile (after F1 approval).

---

## Implementation Notes

- Client chunks are served from `/assets/`, not `/_build/`; the gate is `/assets/paid/` (SPEC fixed).
- Paid modules are preloaded in route loaders and read through `use()` on a settled promise, so SSR
  never streams a suspended boundary (no-JS HTML stays complete); during hydration a paid boundary
  waits for its chunk with the server HTML in place.
- `check-paid-leak` ignores paid lines that a public module also carries (the preview paragraph,
  term hints), comparing whitespace-collapsed text.

---

## Commit Message

```
feat(change-192): paid access — plans, soft paywall, gated chunks
```
