# CHANGE 230 — Проверки релиза 2026-10-28 и боевые платежи

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `230` |
| Slug | `release-checks-and-live-payments` |
| Title | Проверки релиза 2026-10-28 и боевые платежи |
| Status | `active` |
| Branch | `feature/230-release-checks-and-live-payments` |

---

## Goal

Изменения 227–229 выпущены 2026-10-28 одним релизом, прод на `ff8960fd`. Robokassa активировала
магазин, Робочеки СМЗ работают. Здесь шаги после деплоя, перенесённые из Change 229 (T2–T4, T6):
проверки прода, тестовый режим Robokassa и переход на боевые платежи. Порядок записан в SPEC §9.

---

## Backlog

### Release
- [ ] `T1` (из 229 T2) Прод после деплоя:
  - сделано 2026-10-28: `/health/ready` отдаёт `ff8960fd`; `/oferta`, `/privacy`, `/vozvrat` показывают редакцию от
    28.10, `/oferta/2026-10-23` открывается;
  - postgres был пересоздан этим деплоем: его конфигурация изменилась (229 I2). Следующий деплой
    не должен менять его `StartedAt`;
  - ночной бэкап 28→29.10 записывает релиз `ff8960fd` из `database-current`. — _Depends on:_ —
- [ ] `T2` (из 229 T3) Playwriter на проде с тестовыми VK ID и Яндекс ID архитектора, сценарии 1–3
  брифа 227. Тестовые аккаунты Кодумки создаются и удаляются, основные не трогаются. — _Depends on:_ —
- [ ] `T3` (из 229 T4) Тестовый режим Robokassa на проде:
  - покупка «Месяц» аккаунтом с почтой и аккаунтом только с VK. Robokassa спрашивает почту для чека
    и принимает подпись с `Receipt`;
  - `/subscribe/return` открывает доступ, нет `billing.notification_rejected`;
  - ответ OpStateExt сохраняется фикстурой в `test_robokassa.py`;
  - тестовый полный возврат. Пароль #3 только боевой, поэтому ошибка здесь не баг: тогда возврат
    проверяется на платеже в 1 ₽. — _Depends on:_ —
- [ ] `T4` (из 229 T6) Боевой режим:
  - копия `production.env`, боевые пароли #1 и #2 из athanor, `ROBOKASSA_TEST=false`;
  - покупка за 1 ₽ (`BILLING_MONTH_PRICE_KOPECKS=100`): чек с номенклатурой в «Мой налог» и в
    почте. Проверяет архитектор;
  - полный возврат аннулирует чек;
  - настоящие цены;
  - анонс платной части, затем `PAYWALL_ENABLED=true` по решению архитектора. — _Depends on:_ T3
- [ ] `T5` Ответ поддержки Robokassa о частичном возврате при НПД (вопрос архитектора 2026-10-28):
  если нужен другой состав `InvoiceItems`, отдельная правка в `robokassa.py`. — _Depends on:_ —

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

See `docs/SPEC.md` §2.2, §6.1, §7.3 and [billing runbook](../runbooks/billing.md).

---

## Gate Checks

Фикстура OpStateExt: `cd apps/api && uv run pytest tests/test_robokassa.py`. Остальное — проверки на
проде.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|

---

## Implementation Notes

---

## Commit Message

```
chore(change-230): release checks and live payments
```
