# CHANGE 198 — Юридический минимум и защита платного доступа перед запуском

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `198` |
| Slug | `legal-launch` |
| Title | Юридический минимум и защита платного доступа перед запуском |
| Status | `archived` |
| Branch | `feature/198-legal-launch` |

---

## Goal

Закрыть юридический минимум для запуска kodumka.ru с оплатой без юриста и затруднить совместное
использование одной подписки и выкачивание платного контента, не ухудшая опыт честного ученика.

Источник — исследование и решения архитектора от 2026-10-23
(`~/.claude/plans/reflective-hugging-lecun.md`). Принцип: каждый юридический пункт подаётся в самой
незаметной законной форме. Новые условия уходят в оферту; отдельная галочка ставится только там,
где закон требует отдельного действия.

Решения архитектора:
- вход через Telegram удаляется, основные способы входа — Яндекс ID и VK ID;
- не больше трёх устройств на аккаунт, письмо при входе с нового устройства;
- ограничения аккаунта только вручную, с возможностью обжаловать;
- реквизиты: ФИО, ИНН и email, без адреса;
- согласие на распространение данных для будущих профилей и рейтинга готовится сейчас.

Контракт: SPEC §3, §4, §6.2, §8.2 и §11.

---

## Backlog

### Backend
- [x] `B1` Удалить вход через Telegram:
  - провайдер и проверку ID token/JWKS в `account/providers.py`;
  - настройки в `core/config.py`;
  - миграцию, которая сужает CHECK `provider` до `vk`, `yandex`; перед этим убедиться, что строк с `telegram` нет;
  - тесты.
  — _Depends on:_ —
- [x] `B2` Первый вход через провайдера без привязанного аккаунта больше не создаёт аккаунт сразу:
  - ожидающее состояние хранится в cookie провайдера;
  - `POST /api/auth/provider/register` с текущей версией согласия создаёт аккаунт и записывает `privacy_consent_version` и `privacy_consented_at`.
  — _Depends on:_ B1
- [x] `B3` Новая версия согласия: обновить её в `account/schemas.py`; прежние пользователи согласие повторно не дают. — _Depends on:_ —
- [x] `B4` Миграция `account_session`:
  - новые поля: `device_id`, `device_label`, `ip`, `city`, `last_ip`, `last_seen_at`;
  - cookie `__Host-kodumka_device` (случайный id, 400 дней);
  - метка «браузер · ОС» из User-Agent;
  - город — по локальной офлайн-базе DB-IP Lite;
  - `last_*` обновляется не чаще раза в 10 минут;
  - `purge.py` стирает IP и город старше 90 дней.
  — _Depends on:_ —
- [x] `B5` Лимит в три устройства: вход с нового устройства, когда активных уже три, отзывает сессию, которая дольше всех не использовалась. Вход с нового `device_id` отправляет служебное письмо «Вход с нового устройства». Темы всех писем переименовываются с infraege на «Кодумка». — _Depends on:_ B4
- [x] `B6` Эндпоинты `GET /api/auth/sessions`, `DELETE /api/auth/sessions/{id}`, `DELETE /api/auth/sessions?others=1`: только для владельца, ответ `no-store`, с CSRF-защитой. — _Depends on:_ B4
- [x] `B7` Решения платных задач: публичная проекция отдаёт `explanation` пустым. Решение приходит в ответах check и check-and-save или через `GET /api/tasks/{id}/solution`: нужен доступ, действует лимит на аккаунт, ответ `no-store`. Бесплатные задачи не меняются. OpenAPI и типы клиента пересобираются. — _Depends on:_ —
- [x] `B8` Таблица `account_restriction` и операторская CLI `signals`, `warn`, `suspend`, `terminate`, `lift`:
  - `entitlement` учитывает активную приостановку;
  - `GET /api/access` отдаёт срок приостановки, причину и контакт для обжалования;
  - `terminate` создаёт возврат через существующий `refund`;
  - письма отправляются при предупреждении, приостановке и снятии ограничения.
  — _Depends on:_ B4
- [x] `B9` `/api/access/asset` ведёт суточный счётчик разных платных чанков на аккаунт; данные попадают в `signals`, автоматической реакции нет. — _Depends on:_ B8

### Frontend
- [x] `F1` Убрать Telegram из `provider-links.tsx`, `account-page.helpers.ts` и связанных тестов. — _Depends on:_ B1
- [x] `F2` Добавить шаг согласия при первом входе через провайдера: маршрут `/register/provider`, на нём та же галочка, что в `account-form.tsx`. — _Depends on:_ B2
- [x] `F3` Добавить блок «Где выполнен вход» в `account-profile.tsx`: список устройств (город · браузер · время, отметка текущего), кнопки «Выйти» и «Выйти на других устройствах». — _Depends on:_ B6
- [x] `F4` Кнопка «Решение» у платной задачи загружает решение через `/solution`; после проверки показывается решение из ответа проверки. Бесплатные задачи и режим без JS не меняются. — _Depends on:_ B7
- [x] `F5` Показывать плашку приостановки или прекращения доступа на платных страницах и в разделе «Доступ» аккаунта: дата, причина и контакт для обжалования. Предупреждение показывается уведомлением в аккаунте. — _Depends on:_ B8
- [x] `F6` Юридические тексты:
  - `/privacy`: заголовок «Политика обработки персональных данных», оператор, правовые основания, права субъекта и сроки ответа, получатели (хостинг, Postbox, Robokassa, Object Storage, аналитика), cookie, устройства и IP (90 дней), новая дата;
  - `/consent`: оператор и новая версия, место галочки прежнее;
  - новая редакция оферты: личный доступ, три устройства, запрет копирования и автоматического скачивания, ступени ограничения и обжалование, ссылка на Политику;
  - дата редакции на `/vozvrat`.
  — _Depends on:_ B3, B5, B8

### Infra
- [x] `I1` Отдельная зона nginx для `/assets/paid/`: 120 запросов в минуту, запас 110, ответ 429. — _Depends on:_ —
- [x] `I2` Проверить на хосте, доходят ли баны fail2ban через ufw до портов Docker. Если нет, перевести действие на цепочку `DOCKER-USER` в `ops/fail2ban/`. — _Depends on:_ —
- [x] `I3` Добавить офлайн-базу городов DB-IP Lite: как она попадает в образ или на хост, как обновляется, атрибуция CC BY. — _Depends on:_ —

### Other
- [x] `T1` Обновить `docs/runbooks/privacy-legal-checklist.md`:
  - итоги исследования с источниками;
  - готовый текст уведомления в РКН;
  - ручная памятка на случай утечки (24 и 72 часа, без автоматизации);
  - подтверждение оператором происхождения 516 платных задач.
  — _Depends on:_ F6
- [x] `T2` `content/legal/consent-public.md`: согласие на распространение по ст. 10.1, пока не публикуется. — _Depends on:_ —
- [x] `T3` `docs/runbooks/accounts.md`: сигналы, ступени ограничения и обжалование. `billing.md`: в список запуска добавить «уведомление в РКН подано» и «приложения Яндекс ID и VK ID зарегистрированы». FRONTEND.md: Telegram больше нет. — _Depends on:_ B8
- [x] `T4` Stale layout e2e expectations after Change 197 (found by the isolated run before ship): the topic 16 outline now reads «1 из 6»; the practice layout tests take the first catalog task, which is now an imported KEGE task without help — pick the first task that has «Подсказка»; the practice-controls test looked for a `searchbox`, but the search field is the suggestions combobox «Поиск задач». — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/api/app/modules/account/{providers,api,service,models,schemas,mail,purge}.py
apps/api/app/modules/account/sessions_api.py (new) · device.py (new)
apps/api/app/modules/practice/{readers,api,schemas}.py
apps/api/app/modules/entitlement/{service,api}.py
apps/api/app/modules/billing/admin.py · account/restrictions.py (new)
apps/api/alembic/versions/198_*.py
apps/api/tests/…
apps/web/src/pages/account/{provider-links,account-profile,account-page.helpers}.ts(x)
apps/web/src/pages/account/provider-consent-page.tsx (new) · routes/register.provider.tsx (new)
apps/web/src/features/lesson-practice/components/practice-task-help.tsx
apps/web/src/features/account/model/account-api.ts
apps/web/src/pages/privacy/{privacy-page,consent-page}.tsx
apps/web/src/pages/checkout/… · entities/access/…
content/legal/oferta/<дата>.md · content/legal/vozvrat.md · content/legal/consent-public.md
infra/nginx/snippets/{practice-read-zone,billing}.conf
ops/fail2ban/…
docs/SPEC.md · docs/runbooks/{privacy-legal-checklist,accounts,billing}.md · docs/FRONTEND.md
~~~

### Do NOT touch
- Прежние редакции оферты `content/legal/oferta/2026-10-17.md` (не меняются).
- Подвал, форма регистрации по email и страница оплаты — визуально без изменений.
- Уроки и банк задач.

---

## Contracts

See `docs/SPEC.md` §3–§4 and §6.2, §8.2, §11, plus the Files list above.

---

## Gate Checks

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 65823de5+wt | format, python-format, web-lint, web-typecheck, shell-lint, api-lint, api-typecheck, host-ruff, host-python, docs-links, infra-config, api-contract | PASS | ~95 |
| 65823de5+wt | pytest: test_devices_restrictions, test_billing, test_account_providers (16); test_minimal_bank (25) | PASS | ~680 |
| 65823de5+wt | isolated browser audit: account.spec (1 + 18), layout + production smoke (6) after T4 | PASS | ~240 |
| 65823de5+wt | Vitest 79 files / 543 tests; check-paid-leak; nginx paid-gate, practice-read-limit; deploy-preflight, host-access-policy, billing-jobs, account-cutover, restore-readiness, backup-restore; application_db_test | PASS | — |

---

## Implementation Notes

- B4: IP and city live with the session row (at most 30 days, a day after sign-out), not in a
  separate 90-day log; the 90 days apply to `account_device` (no IP). Evidence for a measure is the
  operator's `--note` with the `signals` numbers.
- B9: the daily counter counts served paid chunks (requests), not distinct ones; the threshold
  (400/day) is set for that.
- B8: offer 6.3 promises extending access after an upheld appeal; `lift --compensate` does it.
- I2: the Nginx jail now bans in `DOCKER-USER`; applying it on the host is a runbook step
  (production.md step 7). Host state read on 2026-10-24: the jail used `ufw`, `DOCKER-USER` was
  empty, iptables on nf_tables, no ban ever made — the fix is needed and compatible.
- Verified 2026-10-24: both VPSes are in RU (RIPE); the architect confirmed authorship of the
  516 paid-only tasks. The operator console on sre.infraege.ru (signals, measures, refunds,
  incidents, account search, action log) follows as smotryashchiy Change 30 + infraegev2 Change 199.
- F-items: `impeccable` critique/polish/audit not run — the UI reuses existing account rows,
  paywall copy and tokens without new visual language; Playwriter checked /privacy, /consent,
  /oferta, /register/provider and «Где выполнен вход» at 1280 and 375 px (no horizontal scroll).
  The restriction notice on paid pages is covered by Vitest only (the dev stack runs with the
  paywall off).
- The isolated browser audit before ship also ran the layout suite; its three failures came from
  Change 197 content (topic 16 outline, unhinted first catalog task, search combobox) and were
  fixed as T4.

---

## Commit Message

```
feat(change-198): legal minimum and paid-access protection
```
