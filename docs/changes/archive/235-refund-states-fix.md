# CHANGE 235 — Часовая задача не завершала возвраты

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `235` |
| Slug | `refund-states-fix` |
| Title | Часовая задача не завершала возвраты |
| Status | `archived` |
| Branch | `feature/235-refund-states-fix` |

---

## Goal

Первый настоящий частичный возврат (0,90 ₽ платежа 1005, `aabfba26…`, 2026-10-28) Robokassa
завершила (`finished`). Но `billing-jobs.sh hourly` падал с `MissingGreenlet` в `refund_states`:
он читал `refund.provider_ref` у строки после коммита её транзакции. Возврат остался `pending`,
письма покупателю и оператору не ушли. Ошибка была с Change 192: раньше ни один возврат не
доходил до `pending` на проде.

---

## Backlog

### Backend
- [x] `B1` `refund_states` выбирает `(id, provider_ref)` и берёт сумму и адрес внутри транзакции.
  Тест: возврат `pending` (как у Robokassa) завершается часовой задачей, письмо о чеке на остаток
  уходит. KNOWN_GOTCHAS дополнен. — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/jobs.py, apps/api/tests/test_billing.py, docs/KNOWN_GOTCHAS.md
~~~

### Do NOT touch
- Всё остальное.

---

## Contracts

See [billing runbook](../../runbooks/billing.md).

---

## Gate Checks

pytest `test_billing.py`; после деплоя — `billing-jobs.sh hourly` на проде завершает `aabfba26…`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 844e0bc2+wt | format, python-format, api-lint, api-typecheck, api-contract, docs-links; pytest test_billing, test_operator_cli, test_robokassa (21) | PASS | 230 |

---

## Implementation Notes

---

## Commit Message

```
fix(change-235): the hourly job finishes pending refunds
```
