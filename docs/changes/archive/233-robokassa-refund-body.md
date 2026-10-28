# CHANGE 233 — Тело запроса возврата Robokassa

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `233` |
| Slug | `robokassa-refund-body` |
| Title | Тело запроса возврата Robokassa |
| Status | `archived` |
| Branch | `feature/233-robokassa-refund-body` |

---

## Goal

Первый боевой возврат 2026-10-28 (платёж `InvId` 1005, 1 ₽, 232 T4) упал с
`ProviderError("Robokassa refund unavailable")`, строка возврата осталась `requested`. Пробные
запросы паролем #3 на несуществующий `OpKey`, денег не двигают:
- JWT «как есть» → `400 BadRequest`;
- JWT как JSON-строка → `401` «Signature key is not exists or partner have not access to API».

Значит, формат тела должен быть JSON-строкой. Ответ 401 на фиктивный `OpKey` ничего не говорит о
доступе: проверка — настоящий возврат после релиза.

---

## Backlog

### Backend
- [x] `B1` Refund API получает JWT как JSON-строку (`json.dumps(token)`). — _Depends on:_ —
- [x] `B2` Отказ Robokassa с JSON-ответом (например 401) — это `failed` с её `message`, а не
  `ProviderError`. Причина видна в `billing.refund_executed`, повтор — `admin execute`. Без JSON
  по-прежнему `ProviderError`. — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/provider/robokassa.py, apps/api/tests/test_robokassa.py
~~~

### Do NOT touch
- Всё остальное; шаги 232 идут своей веткой.

---

## Contracts

See [billing runbook](../../runbooks/billing.md).

---

## Gate Checks

`cd apps/api && uv run pytest tests/test_robokassa.py`; после деплоя — `admin execute --refund
2d57b052-1fc7-4091-8a34-512214b18880` на проде.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| d5156bca+wt | format, python-format, api-lint, api-typecheck, api-contract, docs-links; pytest `test_robokassa.py` (12); body probe against the live Refund API with a fake `OpKey` (above) | PASS | 45 |

---

## Implementation Notes

---

## Commit Message

```
fix(change-233): Robokassa refund body is a JSON string, keep its refusal reason
```
