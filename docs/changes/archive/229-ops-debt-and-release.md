# CHANGE 229 — Отложенные ops-задачи и релиз после активации Robokassa

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `229` |
| Slug | `ops-debt-and-release` |
| Title | Отложенные ops-задачи и релиз после активации Robokassa |
| Status | `archived` |
| Branch | `feature/229-ops-debt-and-release` |

---

## Goal

Решения архитектора от 2026-10-26:
- отложенное, что не ждёт внешних сторон, сделать сейчас;
- 227, 228 и это изменение выкатить одним релизом после того, как Robokassa активирует магазин;
- после релиза проверить всё на проде.

Отложенные задачи:
- Postgres пересоздаётся на каждом деплое. Три причины меняются с каждым релизом: `DEPLOY_SHA` в
  окружении контейнера, метка `com.infraege.version` и путь к скрипту ролей внутри
  `releases/<sha>`. На метку опирается бэкап: `bundle.py` выбирает по ней образ, которым проверяет
  дамп;
- `body-parser` 1.20.9 (GHSA-27r3-jxmh-p828). Исправленная версия моложе семидневного правила pnpm,
  архитектор разрешил разовое исключение;
- recovery hold `3dd0ba47…` (снимок до миграции 140 → 198). Архитектор решил снять его сейчас,
  локально и во внешней копии.

Сюда же перенесены релизные пункты T3 и T5–T10 из Change 227. Порядок шагов после активации записан
в SPEC §9 Roadmap.

---

## Backlog

### Infra
- [x] `I1` `body-parser`:
  - `minimumReleaseAgeExclude: body-parser@1.20.9`;
  - override `"body-parser@<1.20.9": "1.20.9"`;
  - GHSA-27r3 убирается из `ignoreGhsas`;
  - `pnpm install`, `pnpm audit` чистый. — _Depends on:_ —
- [x] `I2` Postgres не пересоздаётся, пока не сменились его образ или настоящая конфигурация:
  - у postgres-сервиса нет `DEPLOY_SHA` в окружении и нет метки версии;
  - скрипт ролей для initdb монтируется из стабильного пути, который деплой обновляет до старта;
  - тест: `docker compose config` у postgres одинаков для двух разных SHA. — _Depends on:_ —
- [x] `I3` Бэкап берёт релиз базы из ссылки `database-current`, которую деплой ставит после
  миграции. Метка и `DEPLOY_SHA` контейнера остаются запасным путём для dev и test. Тесты бэкапа
  обновлены. — _Depends on:_ I2
- [x] `I4` Документация: комментарий в `deploy-remote.sh`, `backup-restore.md`, KNOWN_GOTCHAS. — _Depends on:_ I2, I3
- [x] `I5` (находка `/ship --release` 2026-10-28) `shell-lint`: SC2016 в
  `postgres-release-stability.test.sh`, где `grep` ищет буквальную строку. Подавление с причиной,
  как в соседних тестах. — _Depends on:_ I2
- [x] `I6` (находка Release Gate 2026-10-28) gitleaks `generic-api-key` на синтетическом
  `AUTH_CSRF_SECRET` в `postgres-release-stability.test.sh` (коммит `931c3aad`). Точное исключение
  путь + значение в `.gitleaks.toml`, как у прочих публичных значений. — _Depends on:_ I2

### Ops (прод, сейчас)
- [x] `O1` Снять recovery hold по `backup-restore.md` § Recovery hold review and release:
  - перед снятием: схема, здоровье, свежий бэкап и проверка восстановления, нет открытых инцидентов,
    `forget --dry-run`;
  - снять тег с точного ID локально и с копии во внешнем репозитории;
  - записать новые ID. Ручного `prune` нет.

  Выполнено 2026-10-26:
  - проверено: здоровье, схема `198_01`, бэкап и внешняя копия от 26.10, восстановление из
    внешней копии 24.10, упавших юнитов нет;
  - локально: `3dd0ba47…` → `0ac53147c85fec5923ecda9bdb81b2ed0eaa8034e06ab51106842f01d8127005`;
  - во внешней копии: `12fe98a8…` → `73cfe4320ba99fa53d9c44d6fe071c231381efbb2dbccf29280dfa0966102220`;
  - тем же днём, с разрешения архитектора, снято и удержание с `94c5a3e7…` от 25.09. Его цепочка
    `original` начинается с `63049c5f…`, копия сверена по времени и дереву:
    - локально → `7faa0d5dd180a60b9b9593d5b37c471e72226aeb59bc73912664f9d953909706`;
    - во внешней копии `0d52658a…` → `87c0373bf971a68f61dae66322d8fdbb2aefd5911b8e3866ecc7d200c810c2b9`;
  - удержаний не осталось ни в одном репозитории. — _Depends on:_ —

### Privacy (из smotryashchiy Change 35, выпускается тем же релизом)
- [x] `P1` `/privacy`, раздел «Аналитика посещений»: сервис мониторинга теперь хранит страну и регион
  (из IP по офлайн-базе, сам IP не сохраняется), UTM-метки перехода, группу ширины экрана, версии
  браузера и системы. Визиты связываются в пределах дня. Новая дата редакции; `docs/legal` и
  `privacy-legal-checklist.md`. — _Depends on:_ —

### Billing (после активации Robokassa 2026-10-28)
- [x] `B1` Номенклатура чека для Робочеков СМЗ. Письмо Robokassa об активации предупреждает, что без
  номенклатуры чек формируется неправильно.
  - Ссылка на оплату передаёт `Receipt` из одной позиции:
    - название «Доступ к учебным материалам Кодумки на N дней»;
    - количество 1, сумма равна `OutSum`;
    - `full_payment`, `service`, `tax: none`, без `sno`.

    `Receipt` в URL-кодированном виде входит в подпись `MerchantLogin:OutSum:InvId:Receipt:Пароль#1`.
  - Возврат передаёт `InvoiceItems` с той же позицией на сумму возврата. Без неё Robokassa
    возвращает только деньги, без чека.
  - Тесты в `test_robokassa.py`.

  Частичный возврат при НПД ждёт ответа поддержки Robokassa (вопрос архитектора от 2026-10-28). — _Depends on:_ —

### Release (после активации Robokassa)
- [x] `T1` Перед релизом:
  - оферта `2026-10-26` → `2026-10-28`, правила возврата и политика тоже от 28.10 (релиз 2026-10-28);
  - `/ship 229 --release`: push `main`, predeploy, деплой выбранного SHA. — _Depends on:_ I1–I4, активация
- ~~`T2`–`T4`, `T6`~~ (перенесено в Change 230: проверки на проде после деплоя, тестовый и боевой
  режим Robokassa. По playbook `/ship` архивирует изменение до деплоя)
- ~~`T5`~~ (removed: архитектор 2026-10-26 — демо-аккаунт для проверяющего Robokassa не нужен, в требованиях к активации его нет)

---

## Files

### Create / modify
~~~
pnpm-workspace.yaml, pnpm-lock.yaml
infra/docker-compose.yml, infra/docker-compose.prod.yml, scripts/deploy-remote.sh
scripts/lib/application_db/bundle.py (+ its tests), scripts/tests/*
docs/runbooks/backup-restore.md, docs/KNOWN_GOTCHAS.md, docs/runbooks/billing.md
~~~

### Do NOT touch
- Схема БД и данные. Prune и forget вручную не запускаются.
- `/pricing`, `/oferta`, `/vozvrat` на проде до активации (деплоя нет до T1).
- `athanor.yaml` smotryashchiy (`expose: true` остаётся, решение 2026-10-25).

---

## Contracts

See `docs/SPEC.md` §7 and the Files list above.

---

## Gate Checks

`infra-config`, `shell-lint`, тесты бэкапа и деплоя (`scripts/tests/*backup*`, `restore-readiness`,
`account-cutover`), `pnpm audit`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 7e23e116+wt | format, python-format, shell-lint, host-ruff, host-python, tooling-lint, docs-links, infra-config | PASS | 45 |
| 7e23e116+wt | shell tests: postgres-release-stability (fails on the old config), backup-retention, backup-restore, restore-readiness, account-cutover, deploy-preflight, release-retention, billing-jobs, operator-command; unittest application_db_test (+3), deploy_orchestration_test | PASS | 300 |
| 7e23e116+wt | `pnpm audit --audit-level high` clean; high 4 → 3 (the 3 left are the listed ignores); 14 moderate unchanged and below the gate level | PASS | 10 |
| d1a4c601+wt | B1, P1: format, python-format, api-lint, api-typecheck, docs-links, api-contract, web-lint, web-typecheck | PASS | 73 |
| d1a4c601+wt | pytest `test_robokassa.py` (+1, Receipt and InvoiceItems), `test_billing.py`; `/privacy` in Playwriter: text and edition date, no page errors except the absent local API | PASS | 92 |
| d1a4c601+wt (release, base prod `de541684`) | all 12 static groups (shell-lint first FAILED: SC2016 → I5, then PASS) | PASS | 75 |
| d1a4c601+wt (release) | pytest test_billing, test_robokassa, test_operator_cli, test_account_lifecycle (26); vitest plans-checkout (3); `postgres-release-stability.test.sh` | PASS | 290 |
| d1a4c601+wt (release) | isolated browser `billing`: billing-integration + account-lifecycle (4) | PASS | 155 |

---

## Implementation Notes

- Ops-скрипты (`billing-jobs.sh`, `operator-command.sh` и другие) вызывают Compose через
  `/opt/infraege/current`. Они только делают `exec` в api, поэтому postgres не трогают.
- Предмиграционный бэкап деплоя идёт до переключения `database-current`. Теперь он пишет в
  метаданные прежний релиз — тот, чья схема в базе. Раньше postgres успевали пересоздать с новой
  меткой, и в бэкапе оказывался релиз, чья схема ещё не накатана.
- В dev у postgres больше нет `DEPLOY_SHA`, поэтому релиз dev-бэкапа — `unknown`. Проверяющий образ
  dev от него не зависит (`infraege-dev-api`).
- B1: в GET-примерах Robokassa `Receipt` закодирован дважды. Один раз его URL-кодируем мы, в этом
  виде он входит в подпись. Второй раз его кодирует строка запроса. `InvoiceItems` уходят с каждым
  возвратом на сумму возврата, с частичным `auto` тоже. Как Робочеки обработают частичный возврат
  при НПД, ждём от поддержки Robokassa.

---

## Commit Message

```
fix(change-229): postgres survives releases, body-parser fix, release checklist
feat(change-229): receipt nomenclature for Робочеки, privacy analytics, offer edition 2026-10-28
```
