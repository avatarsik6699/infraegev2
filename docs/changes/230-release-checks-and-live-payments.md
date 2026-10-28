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
- [ ] `T1` (из 229 T2) Прод после деплоя:
  - сделано 2026-10-28: `/health/ready` отдаёт `ff8960fd`; `/oferta`, `/privacy`, `/vozvrat`
    показывают редакцию от 28.10, `/oferta/2026-10-23` открывается;
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
    проверяется на платеже в 1 ₽.

  Прогон 2026-10-28 в Playwriter, оба тестовых аккаунта Кодумки новые:
  - аккаунт с почтой (`InvId` 1000) и аккаунт только с VK (`InvId` 1001);
  - Robokassa приняла подпись с `Receipt` в демо-режиме;
  - для аккаунта только с VK `Email` не передан, Robokassa потребовала почту для чека;
  - оба платежа «Успешно», доступ выдан до 27.11, то есть уведомление на ResultURL с тестовым
    паролем #2 принято;
  - `/subscribe/return` в обоих случаях показал «Не удалось проверить оплату» → `B1`;
  - аккаунт с почтой `+`-адреса упёрся в «Некорректный E-mail» → `B2`;
  - OpStateExt с тестовым паролем #2 на счёт 1000 отвечает `Result/Code 3` («Не удалось найти
    операцию»): тестовые операции он не находит. Поэтому тестовый возврат невозможен, наш возврат
    берёт `OpKey` из OpStateExt. Возврат проверяется на 1 ₽ (`T4`). Ответ — фикстура (`B3`).

  VK ID архитектора был привязан к старому аккаунту без почты и без платежей (вход ещё через
  Яндекс ID). По решению архитектора VK отвязан кнопкой «Отвязать», Яндекс ID у того аккаунта
  остался. — _Depends on:_ —
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
chore(change-230): release checks and live payments
```
