# CHANGE 240 — Причина сбоя Robokassa в журнале

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `240` |
| Slug | `provider-error-reason` |
| Title | Причина сбоя Robokassa в журнале |
| Status | `archived` |
| Branch | `feature/240-provider-error-reason` |

---

## Goal

Разбор 234 B2 (обрывы TLS к Robokassa) упёрся в журнал: `billing.settle_unavailable` и
`billing.refund_state_unavailable` пишут только номер, и по прошлым записям не понять, сеть это или
ответ Robokassa. Теперь причина пишется рядом.

---

## Backlog

### Backend
- [x] `B1` `ProviderError` от Robokassa несёт причину: `HTTP 502`, `ConnectError [SSL: …]`,
  `ReadTimeout`. Адрес запроса с подписью в текст не попадает. Часовая задача пишет её полем
  `reason`. Тест в `test_robokassa.py`. — _Depends on:_ —
- [x] `B2` Сводка для бизнеса читала строки через `Result.tuples()`, который sqlalchemy 2.1 объявил
  устаревшим; предупреждение падало в журнал каждый час. Теперь `.all()`. — _Depends on:_ —
- [x] `B3` `billing.md` § Incidents: что значит `reason` и когда писать в поддержку. — _Depends on:_ B1

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/{jobs,admin}.py, apps/api/app/modules/billing/provider/robokassa.py,
apps/api/tests/test_robokassa.py, docs/runbooks/billing.md
~~~

### Do NOT touch
- Схема БД; поведение повторов (следующий час спрашивает снова).

---

## Contracts

See [billing runbook](../../runbooks/billing.md#incidents).

---

## Gate Checks

pytest `test_robokassa.py`, `test_billing.py`, `test_operator_cli.py`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 51fbe66b+wt | format, python-format, api-lint, api-typecheck, docs-links, api-contract | PASS | 44 |
| 51fbe66b+wt | pytest test_robokassa (13), test_billing + test_operator_cli (9) | PASS | 222 |

---

## Implementation Notes

---

## Commit Message

```
fix(change-240): the job log names why Robokassa was unavailable
```
