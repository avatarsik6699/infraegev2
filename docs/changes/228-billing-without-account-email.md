# CHANGE 228 — Оплата без почты в аккаунте, тарифы и страница оформления

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `228` |
| Slug | `billing-without-account-email` |
| Title | Оплата без почты в аккаунте, тарифы и страница оформления |
| Status | `active` |
| Branch | `feature/228-billing-without-account-email` |

---

## Goal

Бриф архитектора от 2026-10-25, разделы 2–4, кроме того, что вошло в Change 227.

Сейчас человек, вошедший через VK ID или Яндекс ID, не может купить доступ. Ему показывается
«Нужна подтверждённая почта». Robokassa сама спрашивает почту для чека на своей странице, если
магазин её не передал: в ResultURL приходит `EMail`, «Email, указанный покупателем при оплате».
Закон о самозанятых (422-ФЗ ст. 14) позволяет передать чек на адрес, который указал покупатель.

Изменение даёт:
- оплату без почты в аккаунте: Robokassa спрашивает адрес, мы храним его вместе с оплатой;
- новые редакции оферты, страницы «Возврат» и политики под это правило;
- спокойные карточки тарифов;
- понятную страницу оформления: к какому аккаунту привязан доступ и куда придёт чек;
- юридические ссылки только там, где они нужны.

Решения архитектора от 2026-10-25 и 2026-10-26:
- новая редакция оферты нужна;
- в «Год» остаётся только «≈ N ₽ в месяц»;
- проверка на проде — после активации Robokassa, одним релизом (Change 229).

---

## Backlog

### Backend
- [x] `B1` Checkout без подтверждённой почты:
  - есть подтверждённый адрес — он передаётся в Robokassa как `Email`;
  - нет адреса — `Email` не передаётся, Robokassa спрашивает его на своей странице.
  - отказ `email_required` уходит. — _Depends on:_ —
- [x] `B2` Адрес из уведомления:
  - `EMail` из ResultURL становится `contact_email` оплаты, если своего адреса не было;
  - письмо «Доступ открыт» уходит на этот адрес;
  - в журнал провайдера адрес не попадает;
  - при удалении аккаунта адрес обезличивается, как сейчас. — _Depends on:_ B1
- [x] `B3` Fake-провайдер спрашивает почту, если её не передали, и отдаёт её в уведомлении, как
  Robokassa. — _Depends on:_ B1
- [x] `B4` pytest: оплата аккаунтом только с VK ID, адрес из уведомления, письмо, обезличивание
  при удалении, прежний путь с подтверждённой почтой. — _Depends on:_ B1–B3
- [x] `B5` Операторский CLI находит покупателя по адресу из чека, а не только по почте аккаунта:
  `show` и меры по `--email`. Покупатель с VK ID пишет о возврате именно с этого адреса
  (находка при работе над B2). — _Depends on:_ B2

### Legal
- [x] `L1` Новая редакция оферты `content/legal/oferta/2026-10-26.md`, правки минимальные:
  - п. 3.3: чек — на адрес, указанный при оплате. По умолчанию это подтверждённый адрес учётной
    записи, иначе покупатель вводит его на странице Robokassa;
  - п. 7.2: просить о возврате можно с адреса учётной записи или с адреса, указанного при оплате.

  Принятые редакции не правятся. — _Depends on:_ —
- [x] `L2` «Возврат» (`vozvrat.md`) и политика (`/privacy`, раздел «Оплата доступа»):
  - откуда берётся адрес для чека;
  - Robokassa сообщает его нам, и мы храним его вместе с оплатой;
  - новая дата редакции. — _Depends on:_ L1

### Frontend
- [x] `F1` Макеты карточек `/pricing` на согласование, до кода:
  - подписи «Ваш план», «Для начала», «Выгоднее» — не бейджами (2.1);
  - иконки, которые отвечают тарифу (2.2);
  - «Месяц» — светлее оранжевый (2.3). — _Depends on:_ —
- [x] `F2` `/pricing` по согласованному макету. В «Год» нет зачёркнутой цены, «−X%» и сноски,
  остаётся «≈ N ₽ в месяц» (2.4). — _Depends on:_ F1
- [x] `F3` Ссылка «Условия возврата» убирается с `/pricing` (2.5, 3.3). Правила — в разделе 7
  оферты, ссылка на оферту стоит перед оплатой, «Возврат» остаётся в подвале. — _Depends on:_ —
- [x] `F4` `/subscribe` (3.2):
  - один аватар и одна подпись аккаунта с шапкой «Мой прогресс» (общий помощник);
  - явно: доступ привязан к аккаунту, войти можно любым подключённым способом, способы
    перечислены;
  - без почты в аккаунте: чек придёт на адрес, который вы укажете на странице оплаты. — _Depends on:_ B1
- [x] `F5` Вкладка «Доступ» в `/account`: без строки «Вернуть деньги за неиспользованные дни можно по
  правилам возврата» (4.4). — _Depends on:_ —
- [x] `F6` vitest для F2–F5. — _Depends on:_ F2–F5
- [x] `F7` Находка архитектора: новый светлый оранжевый `#ea6a12` во всех платных местах —
  `/pricing`, `/subscribe`, возврат после оплаты, платный оверлей, закрытая задача:
  - токен `--theme-cta`;
  - белая подпись основной кнопки — крупный текст 19 px жирным (`--text-cta`), которому WCAG
    достаточно 3:1 (здесь 3,6:1). — _Depends on:_ F2

### Other
- [x] `T1` e2e: аккаунт только с VK ID покупает месяц на fake-провайдере, вводит почту на его
  странице, доступ открыт. Это сценарий 6 брифа. — _Depends on:_ B3, F4
- [x] `T2` Playwriter, desktop и mobile: `/pricing`, `/subscribe` (с почтой и без), вкладка
  «Доступ». — _Depends on:_ F2–F5
- [x] `T3` Документация:
  - SPEC §6.1 («с подтверждённым email» → адрес для чека);
  - `billing.md`, `docs/legal/README.md`, `privacy-legal-checklist.md`. — _Depends on:_ B1, L1, L2

---

## Files

### Create / modify
~~~
apps/api/app/modules/billing/{api,service}.py, provider/{port,robokassa,fake}.py
apps/api/tests/test_billing.py, test_robokassa.py
content/legal/oferta/<new>.md, content/legal/vozvrat.md
apps/web/src/pages/{pricing,checkout,privacy}/*, apps/web/src/pages/account/components/account-access.tsx
apps/web/src/widgets/public-header/public-header-account-navigation.tsx (shared identity helper)
apps/web/tests/*, apps/web/e2e/account-lifecycle.spec.ts + page objects
docs/SPEC.md, docs/runbooks/billing.md, docs/legal/*
~~~

### Do NOT touch
- Принятые редакции оферты (`2026-10-17.md`, `2026-10-23.md`).
- Цены, сроки, флаги `BILLING_ENABLED` и `PAYWALL_ENABLED`, production.env — это Change 229.
- Деплой: изменение только в локальном `main`, релиз — после активации Robokassa (Change 229).

---

## Contracts

See `docs/SPEC.md` §4 and §6.1 and the Files list above.

---

## Gate Checks

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 8515a54f+wt | format, python-format, web-lint, web-typecheck, api-lint, api-typecheck, docs-links, api-contract | PASS | 105 |
| 8515a54f+wt | pytest test_billing, test_devices_restrictions, test_operator_cli (12), test_robokassa + test_account_lifecycle (8 + 9) | PASS | 490 |
| 8515a54f+wt | vitest plans-checkout (3), paywall, account-reauth, public-header, shared-components, practice-detail (69) | PASS | 20 |
| 8515a54f+wt | isolated browser `billing`: billing-integration + account-lifecycle (4, incl. VK-only purchase) | PASS | 60 |
| 8515a54f+wt | Playwriter, local stack with billing on: /pricing 1280/390, /subscribe, paywall gate; no page errors; impeccable detector — one advisory (month grid, kept by the architect) | PASS | — |

---

## Implementation Notes

- Подпись Robokassa в ResultURL покрывает только `OutSum:InvId:пароль #2`, поле `EMail` она не
  защищает. Адрес берётся только из уведомления с прошедшей подписью. Подменить его можно лишь
  перехватом самого запроса Robokassa, а он идёт по TLS.
- Адрес не записывается поверх подтверждённого адреса аккаунта и не возвращается оплате удалённого
  аккаунта (`user_id IS NULL`).
- Если уведомление не пришло и оплату закрыл почасовой опрос OpStateExt, адреса у нас нет. Чек всё
  равно уходит от Робочеков, письма «Доступ открыт» не будет.
- Редакция оферты названа `2026-10-26`. Опубликована она будет релизом Change 229 после активации
  Robokassa. Если релиз выйдет позже, файл и дату редакции стоит переименовать на день релиза до
  первой оплаты: принятых редакций с этой датой ещё нет.
- Детектор impeccable помечает сетку фона «Месяца» как «decorative grid». Сетка была на исходной
  карточке, и архитектор попросил сохранить декор.
- Мелкий оранжевый текст («Всё из Free, плюс») остаётся тёмным `#c24c00`: светлее при 12 px он
  не проходит 4,5:1.

---

## Commit Message

```
feat(change-228): pay without an account email — offer edition, plans, checkout
```
