# CHANGE 211 — Магазин Robokassa и продажа в тестовом режиме

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `211` |
| Slug | `robokassa-shop` |
| Title | Магазин Robokassa и продажа в тестовом режиме |
| Status | `archived` |
| Branch | `feature/211-robokassa-shop` |

---

## Goal

Архитектор 2026-10-24 вошёл в кабинет Robokassa (самозанятый, Робочеки) и попросил создать магазин.
Затем — включить продажу в тестовом режиме, чтобы Robokassa проверила сайт с тарифами, офертой,
возвратом и реквизитами. Код не меняется, только операционная настройка и документация.

---

## Backlog

### Ops
- [x] `O1` Robokassa (Playwriter, кабинет архитектора):
  - магазин «Кодумка», `kodumka`, `https://kodumka.ru`;
  - SHA256 для боевого и тестового режима;
  - Result URL — `/api/billing/webhooks/robokassa`, POST; Success/Fail URL — `/subscribe/return`, GET;
  - пять паролей сгенерированы в кабинете и сохранены в athanor.

  — _Depends on:_ —
- [x] `O2` Прод: в `production.env` `BILLING_ENABLED=true`, `ROBOKASSA_TEST=true`, тестовая пара
  паролей, `PAYWALL_ENABLED=false`, перезапуск API. `/pricing` отвечает 200, в подвале тарифы, оферта,
  возврат и реквизиты. — _Depends on:_ O1

### Docs
- [x] `T1` `billing.md`: тестовые пароли и состояние магазина. `privacy-legal-checklist.md` § 4:
  местонахождение БД для уведомления в РКН. — _Depends on:_ O1

---

## Gate Checks

docs-links. Прод: `/api/billing/offer` → `billing: true`, тарифы 49000 и 299000; `/pricing`,
`/oferta`, `/vozvrat` — 200; строка «Самозанятый … ИНН …» в подвале.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 8a013d14+wt | docs-links; прод: offer, `/pricing` 200, подвал | PASS | — |

---

## Implementation Notes

- Снимок формы на миг показал в журнале сессии значения пароля #1 и части пароля #2. Все пять
  паролей перегенерированы до сохранения в кабинете, показанные значения нигде не используются.
- Запрос на активацию магазина и способ вывода средств (банковские реквизиты) остаются за
  архитектором.

---

## Commit Message

```
docs(change-211): Robokassa shop created, billing in test mode
```
