# CHANGE 231 — Подпись адресов возврата Robokassa

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `231` |
| Slug | `robokassa-return-signature` |
| Title | Подпись адресов возврата Robokassa |
| Status | `archived` |
| Branch | `feature/231-robokassa-return-signature` |

---

## Goal

Change 230 B1 передаёт `SuccessUrl2` и `FailUrl2`, а в подпись кладёт их URL-кодированными, как в
примере документации Robokassa. На проде (`b8fd83a3`) тестовая покупка 2026-10-28 (`InvId` 1002)
получила «Код ошибки: 29». Проверка вариантов подписи тестовым паролем #1 на неиспользуемом
`InvId` 900101 показала:
- адреса как есть — страница оплаты открывается;
- URL-кодированные в верхнем и нижнем регистре, а также адрес без запроса — ошибка 29;
- только `Receipt` без адресов — страница открывается.

---

## Backlog

### Backend
- [x] `B1` Подпись ссылки на оплату берёт `SuccessUrl2` и `FailUrl2` как есть:
  `MerchantLogin:OutSum:InvId:Receipt:SuccessUrl2:GET:FailUrl2:GET:Пароль#1`. Тест и комментарий
  в `robokassa.py`. — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/provider/robokassa.py, apps/api/tests/test_robokassa.py
~~~

### Do NOT touch
- Всё остальное. Шаги после релиза — следующее изменение.

---

## Contracts

See [billing runbook](../../runbooks/billing.md).

---

## Gate Checks

`cd apps/api && uv run pytest tests/test_robokassa.py`; после деплоя — тестовая покупка на проде
с возвратом на `/subscribe/return?payment=…`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| b8fd83a3+wt | format, python-format, api-lint, api-typecheck, api-contract, docs-links | PASS | 40 |
| b8fd83a3+wt | pytest `test_robokassa.py` (11); signature variants against the live shop in test mode (above) | PASS | — |

---

## Implementation Notes

---

## Commit Message

```
fix(change-231): Robokassa signs the return addresses as they are
```
