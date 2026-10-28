# CHANGE 230 — Проверки релиза 2026-10-28 и исправления оплаты

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `230` |
| Slug | `release-checks-and-live-payments` |
| Title | Проверки релиза 2026-10-28 и боевые платежи |
| Status | `archived` |
| Branch | `feature/230-release-checks-and-live-payments` |

---

## Goal

Изменения 227–229 выпущены 2026-10-28 одним релизом, прод на `ff8960fd`. Robokassa активировала
магазин, Робочеки СМЗ работают. Здесь шаги после деплоя, перенесённые из Change 229 (T2–T4, T6):
проверки прода, тестовый режим Robokassa и переход на боевые платежи. Порядок записан в SPEC §9.

---

## Backlog

### Backend
- [x] `B1` Возврат с Robokassa на нашу страницу: Robokassa ведёт покупателя на SuccessURL из настроек
  магазина и добавляет только `OutSum`, `InvId`, `SignatureValue`. `/subscribe/return` ждёт
  `?payment=<id>` и показывает «Не удалось проверить оплату». Передавать `SuccessUrl2` и `FailUrl2`
  (`GET`) из `PaymentRequest.success_url` и `fail_url`. Подпись:
  `MerchantLogin:OutSum:InvId:Receipt:SuccessUrl2:SuccessUrl2Method:FailUrl2:FailUrl2Method:Пароль#1`,
  адреса в ней URL-кодированы. Тест в `test_robokassa.py`. — _Depends on:_ —
- [x] `B2` Robokassa отклоняет почту с `+` («Некорректный E-mail»), а checkout передаёт подтверждённую
  почту аккаунта как есть. Покупатель может исправить поле, но видит ошибку на нашем адресе.
  Решение архитектора (2026-10-28): ссылка не передаёт `Email` с `+`, Robokassa сама спрашивает
  адрес, а `/subscribe` пишет, что чек придёт на адрес, указанный при оплате. — _Depends on:_ —
- [x] `B3` Фикстура настоящего ответа OpStateExt (BOM, пространство имён
  `http://merchant.roboxchange.com/WebService/`, `Result/Code 3`) в `test_robokassa.py`: неизвестный
  счёт остаётся `pending`. — _Depends on:_ —

### Frontend
- [x] `F1` `/verify-email`: после «Почта подтверждена.» на странице остаётся текст для браузера без
  JavaScript («Для подтверждения почты включите JavaScript и откройте эту ссылку снова.») — он
  должен исчезать после гидрации. — _Depends on:_ —

### Release
- ~~`T1`–`T5`~~ (перенесено в Change 231: проверки прода после релиза 2026-10-28, повторная тестовая
  покупка после `B1`, боевые платежи и ответ поддержки о частичном возврате. По playbook `/ship`
  архивирует изменение до деплоя. Результаты тестового прогона 2026-10-28 переносятся туда же)

---

## Files

### Create / modify
~~~
apps/api/tests/test_robokassa.py (фикстура OpStateExt), docs/runbooks/billing.md
/etc/infraege/production.env на проде (T4, через копию)
~~~

### Do NOT touch
- Схема БД и данные; основные аккаунты архитектора.

---

## Contracts

See `docs/SPEC.md` §2.2, §6.1, §7.3 and [billing runbook](../../runbooks/billing.md).

---

## Gate Checks

Фикстура OpStateExt: `cd apps/api && uv run pytest tests/test_robokassa.py`. Остальное — проверки на
проде.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 6c012851+wt | B1–B3, F1: format, python-format, web-lint, web-typecheck, api-lint, api-typecheck, api-contract, docs-links | PASS | 91 |
| 6c012851+wt | pytest `test_robokassa.py` (11); vitest plans-checkout, account-overview, account-return-to (18); isolated browser `billing` (4) | PASS | 160 |
| 6c012851+wt | Playwriter: `/verify-email` locally, the no-JS text hidden after hydration (it was visible on production) | PASS | — |

---

## Implementation Notes

- B1: в подписи адреса `SuccessUrl2` и `FailUrl2` URL-кодированы, в ссылке переданы как есть, как
  в примере Robokassa. Как Robokassa приклеит свои параметры к адресу с `?payment=`, неизвестно, поэтому
  маршрут `/subscribe/return` берёт из `payment` только ведущий UUID. Подтверждение — следующая
  тестовая покупка на проде.
- F1: `.panel[data-auth-surface] .secondary` (`display: flex`) специфичнее `.noScriptOnly`, поэтому
  скрывающий класс вынесен на обёртку.

---

## Commit Message

```
fix(change-230): return to the payment page, receipt address with «+», verify-email fallback
```
