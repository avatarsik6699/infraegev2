# CHANGE 232 — Проверки после релиза и боевые платежи

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

### Frontend
- [ ] `F1` `/subscribe/return` после оплаты пишет «Чек придёт на почту аккаунта». У аккаунта без почты
  и у адреса с `+` (230 B2) чек уходит на адрес, введённый на странице Robokassa. Текст должен быть
  верен для всех случаев. Увидено 2026-10-28 на аккаунте только с VK. Сделано: «Чек придёт на почту,
  указанную при оплате.» Отмечается после проверки в Playwriter на проде, после релиза 232. — _Depends on:_ —

### Release
- [ ] `T1` Прод после релизов 2026-10-28:
  - сделано: `/health/ready` на каждом SHA; `/oferta`, `/privacy`, `/vozvrat` показывают редакцию
    от 28.10, `/oferta/2026-10-23` открывается;
  - postgres пересоздан деплоем `ff8960fd` (229 I2). Деплои `b8fd83a3` и `d5156bca` не должны были
    менять его `StartedAt`. Root-доступа по SSH у агента нет, проверяет архитектор;
  - ночной бэкап 28→29.10 записывает релиз `d5156bca` из `database-current`. — _Depends on:_ —
- [ ] `T2` (из 227 T3) Сценарии входа 1–3 брифа 227 на проде через VK ID и Яндекс ID архитектора.
  Тестовые аккаунты Кодумки создаются и удаляются, основные не трогаются.

  Сделано 2026-10-28:
  - VK ID архитектора был привязан к старому аккаунту без почты и без платежей (там же Яндекс ID). По
    решению архитектора VK отвязан кнопкой «Отвязать»;
  - новый вход через VK создал аккаунт через согласие на `/register/provider`. — _Depends on:_ —
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
- [ ] `T4` (из 229 T6) Боевой режим:
  - копия `production.env`, боевые пароли #1 и #2 из athanor, `ROBOKASSA_TEST=false`;
  - покупка за 1 ₽ (`BILLING_MONTH_PRICE_KOPECKS=100`): чек с номенклатурой «Доступ к учебным
    материалам Кодумки на 30 дней» в «Мой налог» и в почте. Проверяет архитектор;
  - полный возврат (`admin refund … --amount full`) аннулирует чек; это и первая проверка API
    возвратов с `InvoiceItems`;
  - настоящие цены;
  - анонс платной части, затем `PAYWALL_ENABLED=true` по решению архитектора. — _Depends on:_ T3
- [ ] `T5` Ответ поддержки Robokassa о частичном возврате при НПД (вопрос архитектора 2026-10-28).
  Если нужен другой состав `InvoiceItems`, отдельная правка `robokassa.py`. — _Depends on:_ —
- [ ] `T6` Удалить два тестовых аккаунта Кодумки после `T4`. У них тестовый доступ: удаление создаст
  запросы на возврат, которые выполнить нельзя. Отметить их в консоли оператора как тестовые. — _Depends on:_ T4

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
| 0cbf0a7f+wt | F1: format, web-lint, web-typecheck, docs-links | PASS | 92 |
| 0cbf0a7f+wt | isolated browser `billing` (4): first run 2 failed on «Failed to fetch dynamically imported module» in the cold Vite server, rerun PASS | PASS | 150 |

---

## Implementation Notes

---

## Commit Message

```
chore(change-232): post-release checks and live payments
```
