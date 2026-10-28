# CHANGE 232 — Боевые платежи и уведомления оператора о возвратах

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `232` |
| Slug | `live-payments` |
| Title | Проверки после релиза и боевые платежи |
| Status | `active` |
| Branch | `feature/232-live-payments` |

---

## Goal

2026-10-28 вышли три релиза: 227–229 (`ff8960fd`), 230 (`b8fd83a3`) и 231 (`d5156bca`).
Здесь шаги после них, перенесённые из 230 (T1–T5): проверки прода, остаток тестового режима
Robokassa, переход на боевые платежи и включение paywall. Порядок записан в SPEC §9.

---

## Backlog

### Backend
- [x] `B1` Фикстура настоящего ответа OpStateExt по первому боевому платежу (`InvId` 1005, 1 ₽,
  `State 100`, `OutSum` `1.000000`), номер карты, RRN и `OpKey` замаскированы; тест в
  `test_robokassa.py`. — _Depends on:_ —
- [x] `B2` Письмо оператору о неудачном возврате. Когда Robokassa отказывает (`execute`, консоль
  или часовой опрос), оператор получает письмо: номер возврата, счёт, сумма и причина Robokassa.
  Для 8401 — подсказка: на балансе меньше суммы возврата с комиссией, нужно пополнить баланс или
  дождаться оплат и повторить `execute`. Срок по ст. 31 ЗоЗПП — 10 дней. Журнал
  `billing.refund_failed`. — _Depends on:_ —
- [x] `B3` Чек на остаток после частичного возврата. Ответ поддержки Robokassa от 2026-10-28: Робочеки
  аннулируют исходный чек целиком, а чек на оставшийся доход выдаёт сам продавец в «Мой налог».
  Когда возврат завершился `succeeded` и вернули меньше оплаты, оператор получает письмо: что
  выдать (наименование, сумма остатка = оплата − все успешные возвраты), дата оплаты, адрес для
  чека. Журнал `billing.remainder_receipt_due`. — _Depends on:_ —
- [x] `B4` Видимость без изменения схемы: `admin refunds` и выгрузка `kodumka.operator/1` показывают
  частичные возвраты за 30 дней с суммой остатка (`remainder_receipts`). Отметки «чек выдан» нет:
  для неё нужна колонка и аттестация перехода схемы, это несоразмерно. Показ в консоли
  smotryashchiy — отдельное изменение в том репозитории. — _Depends on:_ B3
- [x] `B5` Документация: `billing.md` — резерв на балансе, 8401, порядок частичного возврата и чека на
  остаток; памятка оператора в `privacy-legal-checklist.md` не меняется. Удержание комиссии из
  возврата отклонено (ст. 32 ЗоЗПП, п. 1 ст. 782 ГК: удерживаются только расходы на исполнение
  договора; см. Implementation Notes). — _Depends on:_ B2, B3

### Frontend
- [x] `F1` `/subscribe/return` после оплаты пишет «Чек придёт на почту аккаунта». У аккаунта без почты
  и у адреса с `+` (230 B2) чек уходит на адрес, введённый на странице Robokassa. Текст должен быть
  верен для всех случаев. Увидено 2026-10-28 на аккаунте только с VK. Сделано: «Чек придёт на почту,
  указанную при оплате.» Проверка в Playwriter на проде — в Change 234 после релиза. — _Depends on:_ —

### Release
- [x] `T3` (из 229 T4) Тестовый режим Robokassa на проде, 2026-10-28, два новых тестовых аккаунта:
  - с почтой `+kodumka-test1` (подтверждена через Gmail) и только с VK;
  - `Receipt` принят;
  - уведомление с тестовым паролем #2 принято, доступ выдаётся (`InvId` 1000, 1001, 1003);
  - Robokassa спрашивает почту, если `Email` не передан (VK-only и адрес с `+` после 230 B2,
    `InvId` 1004);
  - после 231 возврат ведёт на `/subscribe/return?payment=…`, Robokassa дописывает свои параметры,
    страница показывает «Доступ открыт»;
  - OpStateExt не находит тестовые операции (код 3, фикстура 230 B3). Значит, тестовый возврат
    невозможен, он проверяется в `T4`;
  - ошибки, найденные по ходу: 230 B1, B2, F1, 231 B1. — _Depends on:_ —
- [x] `T5` Ответ поддержки Robokassa о частичном возврате при НПД (вопрос архитектора 2026-10-28).
  Получен 2026-10-28: исходный чек аннулируется целиком, чек на остаток выдаёт продавец → `B3`.
  Если нужен другой состав `InvoiceItems`, отдельная правка `robokassa.py`. — _Depends on:_ —
- ~~`T1`, `T2`, `T4`, `T7`, `T6`~~ (перенесено в Change 234: проверки и шаги после релиза 232. По playbook `/ship`
  архивирует изменение до деплоя)
---

## Files

### Create / modify
~~~
apps/web/src/pages/checkout/checkout-return-page.tsx (F1), docs/runbooks/billing.md
/etc/infraege/production.env на проде (T4, через копию)
~~~

### Do NOT touch
- Схема БД и данные; основные аккаунты архитектора.

---

## Contracts

See `docs/SPEC.md` §2.2, §6.1, §7.3 and [billing runbook](../runbooks/billing.md).

---

## Gate Checks

F1: Vitest страницы возврата и Playwriter. Остальное — проверки на проде.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 3b77b0f2+wt | B2–B5: format, python-format, web-lint, web-typecheck, api-lint, api-typecheck, api-contract, docs-links | PASS | 64 |
| 3b77b0f2+wt | pytest test_billing (refund refused with 8401 → operator mail, retry → remainder mail and `remainder_receipts`), test_operator_cli, test_robokassa (21) | PASS | 173 |
| 3b77b0f2+wt | isolated browser `billing` (4): first run 2 failed on the cold-Vite dynamic import, rerun PASS | PASS | 58 |
| 0cbf0a7f+wt | F1: format, web-lint, web-typecheck, docs-links | PASS | 92 |
| 45b92e6a+wt | B1: python-format; pytest `test_robokassa.py` (12) | PASS | 1 |
| 0cbf0a7f+wt | isolated browser `billing` (4): first run 2 failed on «Failed to fetch dynamically imported module» in the cold Vite server, rerun PASS | PASS | 150 |

---

## Implementation Notes

- Удержание комиссии эквайринга из возврата отклонено 2026-10-28. По ст. 32 ЗоЗПП и п. 1 ст. 782 ГК
  удерживаются только фактические расходы на исполнение договора, а комиссия — это расход на приём
  оплаты. Условие в оферте рискует быть ущемляющим по ст. 16 ЗоЗПП. Нехватку баланса оно бы и не
  решило: возврат требует денег на балансе с учётом комиссии. Вместо этого — резерв на балансе,
  письмо оператору (B2) и повтор в пределах 10 дней.

---

## Commit Message

```
fix(change-232): operator alerts for refused refunds and receipts for the rest, return page note
```
