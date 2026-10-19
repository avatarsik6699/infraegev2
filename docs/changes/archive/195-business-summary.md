# CHANGE 195 — Business summary for the monitoring «Продажи» view

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `195` |
| Slug | `business-summary` |
| Title | Business summary for the monitoring «Продажи» view |
| Status | `archived` |
| Branch | `feature/195-business-summary` |

---

## Goal

The architect reads sales and sign-ups in the monitoring dashboard, not by calling `admin funnel` on
the server (decision 2026-10-19). The site writes an aggregate summary file every hour; the
`smotryashchiy` agent ships it through its WireGuard tunnel (smotryashchiy Change 27). Counts and
sums only — no addresses, ids or names leave the database (SPEC §8 Observability).

---

## Backlog

### Backend
- [x] `B1` `admin export`: one JSON document, schema `kodumka.business/1` — funnel by day and plan
  (90 days), registrations by day with paying accounts, active access and access ending within
  7 days, НПД year income and limit, stuck orders and requested/pending/failed refunds, the
  billing and paywall flags — _Depends on:_ —
- [x] `B2` The daily reconciliation logs `billing.reconcile_done` with checked and mismatched
  counts, also when nothing was checked — _Depends on:_ —

### Infra
- [x] `I1` `billing-jobs.sh hourly` writes `/var/lib/infraege/business/summary.json` atomically
  (mode 640, root) after the jobs, also while billing is off, adding the last reconciliation;
  `daily` keeps that reconciliation in `reconcile.json` — _Depends on:_ B1, B2

### Other
- [x] `T1` Tests (export shape, no personal fields; shell contract of the job script) and docs
  (billing runbook, the agent setting in production runbook) — _Depends on:_ B1, B2, I1

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/admin.py, jobs.py, apps/api/tests/test_billing.py
scripts/billing-jobs.sh, scripts/tests/*billing*
docs/runbooks/billing.md, docs/runbooks/production.md, docs/SPEC.md
~~~

### Do NOT touch
- Database schema; `docs/changes/archive/`; the production host

---

## Contracts

See `docs/SPEC.md` §8 (Observability row) and the Files list above.

---

## Gate Checks

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| b8f293f+wt | format python-format shell-lint api-lint api-typecheck docs-links api-contract; pytest test_billing + test_robokassa (16); billing-jobs shell contract | PASS | ~240 |

---

## Implementation Notes

- The reconciliation result is not stored in the database: the daily host job keeps its
  `billing.reconcile_done` log line as `reconcile.json`, so no migration is needed.
- The summary is written also while billing is off: registrations matter before the first sale.

---

## Commit Message

```
feat(change-195): hourly business summary for the monitoring view
```
