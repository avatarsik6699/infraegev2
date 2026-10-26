# CHANGE 227 — Вход и способы входа: повторное подтверждение, ошибки, полный прогон

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `227` |
| Slug | `account-sign-in-methods` |
| Title | Вход и способы входа: повторное подтверждение, ошибки, полный прогон |
| Status | `active` |
| Branch | `feature/227-account-sign-in-methods` |

---

## Goal

Бриф архитектора от 2026-10-25, пункты 4.1–4.3 и раздел 5. Оплата и тарифы вынесены в Change 228.

Причина дефектов 4.2 и 4.3 установлена по логам прода за 25.10. Менять способы входа можно только
в течение 10 минут после входа (`RECENT_AUTH`), а интерфейс этого не объясняет:
- «Подтвердить вход» висит постоянно. Сразу после входа она ничего не меняет;
- отвязка через 22 минуты после входа получает 403 «recent authentication required». Аккаунт без
  пароля в ответ не получает никакого понятного действия.

Ещё одна находка: ошибки callback провайдера показываются сырым JSON. Пример — VK уже
привязан к другому аккаунту.

Результат изменения:
- чувствительное действие само просит подтвердить вход любым подключённым способом и после
  возврата продолжается;
- ошибки входа объяснены по-русски;
- весь жизненный цикл аккаунта проверен автотестами на локальном подставном провайдере и вручную
  на проде с тестовыми VK и Яндекс архитектора. Платный доступ при этом не теряется.

Решения архитектора от 2026-10-25:
- два изменения: сначала 227, затем 228;
- настоящие VK и Яндекс проверяются на проде с его тестовыми аккаунтами. Основные аккаунты не
  трогаем.

---

## Backlog

### Backend
- [x] `B1` Сессия отдаёт срок окна повторного подтверждения (`recent_auth_until`). Интерфейс заранее
  знает, нужно ли подтверждение, без пробного 403. — _Depends on:_ —
- [x] `B2` Повторное подтверждение паролем без выхода: `POST /api/auth/reauth` (пароль, CSRF, Origin,
  лимит входа). Сейчас для этого надо выйти и войти заново. — _Depends on:_ —
- [x] `B3` Продолжение действия после подтверждения:
  - старт `reauth` принимает намерение из белого списка — `link:<p>`, `unlink:<p>`, `delete`,
    `email`;
  - после callback браузер возвращается на `/account?resume=…`. — _Depends on:_ —
- [x] `B4` Ошибки callback и привязки не показываются JSON-ом. Вместо этого редирект:
  - `login` → `/sign-in?auth_error=<code>`;
  - `link` и `reauth` → `/account?auth_error=<code>`;
  - коды: другой аккаунт, способ уже привязан, вход не удался, истёк. — _Depends on:_ —
- [x] `B5` Подставной провайдер VK и Яндекс только для dev (`AUTH_FAKE_PROVIDERS`):
  - production его отвергает так же, как fake-оплату;
  - страница выбора `subject` вместо внешнего сайта;
  - дальше тот же callback и тот же код, что у настоящих провайдеров. — _Depends on:_ —
- [x] `B6` pytest-матрица жизненного цикла:
  - первый вход каждым способом;
  - привязка и отвязка во всех комбинациях;
  - запрет отвязки последнего способа;
  - окно 10 минут и продолжение действия;
  - привязка способа, принадлежащего другому аккаунту;
  - `AccessGrant` переживает привязку и отвязку;
  - удаление с действующим доступом: доступ закрыт, возврат запрошен, платежи обезличены. — _Depends on:_ B1–B5

### Frontend
- [x] `F1` Постоянной кнопки «Подтвердить вход» больше нет. «Добавить», «Отвязать», «Удалить
  аккаунт» и «Добавить почту»:
  - при истёкшем окне открывают диалог «Подтвердите, что это вы» с каждым подключённым способом
    (пароль прямо в диалоге, VK ID, Яндекс ID);
  - после возврата действие продолжается: диалог подтверждения открыт снова. — _Depends on:_ B1, B2, B3
- [x] `F2` Понятные сообщения `auth_error` на `/account` и `/sign-in`. — _Depends on:_ B4
- [x] `F3` Иконки способов входа на одной линии с названием (4.1). — _Depends on:_ —
- [x] `F4` Окно удаления аккаунта, если доступ действует: «доступ до … закончится, деньги за
  неиспользованные дни вернём на карту». Отдельный текст для аккаунта без пароля. — _Depends on:_ —
- [x] `F5` vitest для F1–F4. — _Depends on:_ F1–F4

### Infra
- [x] `I1` Dev compose: `AUTH_FAKE_PROVIDERS=true`, `VK_ENABLED` и `YANDEX_ENABLED` включены локально.
  В production-compose и `.env.example` подставного провайдера нет. — _Depends on:_ B5

### Other
- [x] `T1` Изолированный e2e `account-lifecycle.spec.ts` на подставном провайдере и fake-оплате,
  сценарии 1–5 брифа:
  - первым способом входа — VK, Яндекс, почта;
  - привязка и отвязка, удаление;
  - несколько способов сразу;
  - оплаченный доступ до и после. — _Depends on:_ B5, F1, I1
- [x] `T2` Playwriter на локальном стеке, desktop и mobile: диалог подтверждения, сообщения об
  ошибках, иконки. — _Depends on:_ F1–F4
- ~~`T3`~~ (перенесено в Change 229 — релиз после активации Robokassa) После деплоя — прод в Playwriter с тестовыми VK и Яндекс архитектора, сценарии 1–3:
  - тестовые аккаунты Кодумки создаю и удаляю;
  - основные аккаунты не трогаю. — _Depends on:_ deploy
- [x] `T4` Документация: SPEC §6 (повторное подтверждение, подставной провайдер только в dev) и
  `accounts.md` § 5. В STACK нет таблицы переменных, поэтому `AUTH_FAKE_PROVIDERS` описан там же. — _Depends on:_ B1–B5

### Robokassa: активация магазина
Архитектор подал заявку на активацию магазина «Кодумка» 2026-10-26, статус — «Подана заявка на
активацию». Тестовые пароли работают и до активации. Чек-лист — `billing.md` § Launch checklist.

Пока идёт проверка:
- ~~`T5`~~ (перенесено в Change 229 — релиз после активации Robokassa) Прогон в тестовом режиме на проде (`ROBOKASSA_TEST=true`), через Playwriter в Chrome
  архитектора, аккаунт с подтверждённой почтой:
  - покупка «Месяц» → возврат на `/subscribe/return` → доступ открыт (`/account`, вкладка «Доступ»);
  - в `journalctl -u infraege-billing-hourly` нет `billing.notification_rejected`;
  - OpStateExt отвечает по тестовому счёту, коды состояния 5/10/50/100 совпадают. Реальный ответ
    записывается фикстурой в `apps/api/tests/test_robokassa.py`;
  - полный возврат тестового платежа через `admin refund … --amount full` завершается;
  - пункты отмечаются в `billing.md`. — _Depends on:_ —
- ~~`T6`~~ (перенесено в Change 229 — релиз после активации Robokassa) Тестовый вход для проверяющего Robokassa, если он попросит пройти оплату. Доступ
  оформляется только на аккаунт:
  - заранее готовлю аккаунт с почтой и паролем;
  - данные передаю архитектору, не в чат и не в git;
  - после активации аккаунт удаляю. — _Depends on:_ —
- ~~`T7`~~ (перенесено в Change 229 — релиз после активации Robokassa) Сайт не меняется в местах, которые смотрит проверяющий: `/pricing`, `/oferta`,
  `/vozvrat`, подвал с реквизитами. Поэтому Change 228 (новая редакция оферты, карточки тарифов,
  ссылки на возврат) деплоится только после активации. Код 228 можно готовить заранее. Деплои 227
  этих страниц не затрагивают. — _Depends on:_ —

После активации (выполняет агент с разрешения архитектора; запись — в активном на тот момент
change):
- ~~`T8`~~ (перенесено в Change 229 — релиз после активации Robokassa) В `/etc/infraege/production.env`:
  - боевые пароли #1 и #2 из athanor;
  - `ROBOKASSA_TEST=false`;
  - временно `BILLING_MONTH_PRICE_KOPECKS=100`;
  - перезапуск api. — _Depends on:_ активация
- ~~`T9`~~ (перенесено в Change 229 — релиз после активации Robokassa) Настоящая покупка за 1 ₽:
  - чек есть в «Мой налог» и в почте покупателя;
  - полный возврат аннулирует чек;
  - настоящие цены возвращены, api перезапущен. — _Depends on:_ T8
- ~~`T10`~~ (перенесено в Change 229 — релиз после активации Robokassa) Анонс платной части по темам, которые сегодня бесплатны, затем `PAYWALL_ENABLED=true`
  по решению архитектора. — _Depends on:_ T9

---

## Files

### Create / modify
~~~
apps/api/app/modules/account/{api,service,providers,schemas}.py
apps/api/app/modules/account/fake_provider.py            (new, dev only)
apps/api/app/core/config.py
apps/api/tests/test_account_lifecycle.py                  (new) + existing account/provider tests
contracts/openapi.json, apps/web generated schema
apps/web/src/pages/account/*                              (profile, helpers, dialogs)
apps/web/src/pages/sign-in or account sign-in mode        (auth_error)
apps/web/src/features/account/model/account-api.ts
apps/web/tests/account-*.test.tsx
apps/web/e2e/account-lifecycle.spec.ts                    (new)
infra/docker-compose.yml
docs/SPEC.md, docs/runbooks/accounts.md, docs/STACK.md
~~~

### Do NOT touch
- `/pricing`, `/subscribe`, оферта и правила возврата — это Change 228.
- Длительность `RECENT_AUTH` (10 минут) и запрет автоматического объединения аккаунтов (SPEC §6).
- `infra/docker-compose.prod.yml` — только без подставного провайдера.

---

## Contracts

See `docs/SPEC.md` §4 and §6 and the Files list above.

---

## Gate Checks

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 87695187+wt | format, python-format, web-lint, web-typecheck, api-lint, api-typecheck, docs-links, infra-config, api-contract | PASS | 160 |
| 87695187+wt | pytest `test_account_lifecycle.py` (6) + `test_minimal_bank.py -k "provider or account"` + `test_account_providers.py` (13) | PASS | 202 |
| 87695187+wt | vitest account-reauth (5), shared-components, guest-*, account-return-to, public-header (63) | PASS | 20 |
| 87695187+wt | isolated browser: `billing` (billing-integration + account-lifecycle, 3), `full` `e2e/account.spec.ts` (18) | PASS | 170 |
| 87695187+wt | Playwriter, local stack 1280/390: reauth dialog (provider, password, wrong password), resume link and unlink, auth_error, icon alignment; no page errors; impeccable detector clean | PASS | — |

---

## Implementation Notes

- Неизвестный `state` в callback не очищает cookie начатого входа этого браузера, иначе чужая
  или устаревшая ссылка ломала бы текущий вход (поймано существующим тестом).
- Продолжение после возврата от провайдера выполняется один раз (`useRef`): повторный запуск
  эффекта в dev стартовал второй `link`, и cookie второго старта отвергала первый callback.
- Страница подставного провайдера лежит под `/api/auth/`, поэтому на неё действует лимит nginx
  10/мин. Быстрые ручные прогоны его упираются (429), обычный путь пользователя — нет.
- Если единственный подключённый провайдер выключен флагом, окно подтверждения честно говорит,
  что подтвердить вход сейчас нельзя. Недоступный провайдер в окне не предлагается.
- `impeccable critique` — упрощённый прогон в одном контексте (блок настроек, без двух
  субагентов); детектор чистый до и после.

---

## Commit Message

```
feat(change-227): sign-in methods — re-confirmation, clear errors, lifecycle
```
