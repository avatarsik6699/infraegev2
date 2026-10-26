# CHANGE 229 — Отложенные ops-задачи и релиз после активации Robokassa

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `229` |
| Slug | `ops-debt-and-release` |
| Title | Отложенные ops-задачи и релиз после активации Robokassa |
| Status | `active` |
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

### Release (после активации Robokassa)
- [ ] `T1` Перед релизом:
  - редакцию оферты `2026-10-26` переименовать на дату релиза, если она другая (Change 228);
  - `/ship 229 --release`: push `main`, predeploy, деплой выбранного SHA. — _Depends on:_ I1–I4, активация
- [ ] `T2` Прод после деплоя:
  - `/health/ready` на новом SHA;
  - postgres не перезапускался (`StartedAt` до и после);
  - ночной бэкап записал правильный релиз;
  - новая редакция оферты на `/oferta`. — _Depends on:_ T1
- [ ] `T3` (из 227 T3) Playwriter на проде с тестовыми VK ID и Яндекс ID архитектора, сценарии 1–3
  брифа. Тестовые аккаунты Кодумки создаются и удаляются, основные не трогаются. — _Depends on:_ T1
- [ ] `T4` (из 227 T5) Тестовый режим Robokassa на проде:
  - покупка «Месяц» аккаунтом с почтой и аккаунтом только с VK. Robokassa должна спросить почту
    для чека;
  - `/subscribe/return` открывает доступ;
  - нет `billing.notification_rejected`;
  - OpStateExt отвечает, его ответ сохраняется фикстурой в `test_robokassa.py`;
  - тестовый полный возврат. — _Depends on:_ T1
- ~~`T5`~~ (removed: архитектор 2026-10-26 — демо-аккаунт для проверяющего Robokassa не нужен, в требованиях к активации его нет)
- [ ] `T6` (из 227 T8–T10) Боевой режим:
  - боевые пароли #1 и #2, `ROBOKASSA_TEST=false`;
  - покупка за 1 ₽ (`BILLING_MONTH_PRICE_KOPECKS=100`): чек в «Мой налог» и в почте;
  - полный возврат аннулирует чек;
  - настоящие цены;
  - анонс платной части, затем `PAYWALL_ENABLED=true` по решению архитектора. — _Depends on:_ T4

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

---

## Implementation Notes

- Ops-скрипты (`billing-jobs.sh`, `operator-command.sh` и другие) вызывают Compose через
  `/opt/infraege/current`. Они только делают `exec` в api, поэтому postgres не трогают.
- Предмиграционный бэкап деплоя идёт до переключения `database-current`. Теперь он пишет в
  метаданные прежний релиз — тот, чья схема в базе. Раньше postgres успевали пересоздать с новой
  меткой, и в бэкапе оказывался релиз, чья схема ещё не накатана.
- В dev у postgres больше нет `DEPLOY_SHA`, поэтому релиз dev-бэкапа — `unknown`. Проверяющий образ
  dev от него не зависит (`infraege-dev-api`).

---

## Commit Message

```
fix(change-229): postgres survives releases, body-parser fix, release checklist
```
