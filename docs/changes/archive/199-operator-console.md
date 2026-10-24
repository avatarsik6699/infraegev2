# CHANGE 199 — Операторская консоль: сторона сайта и отказ от лимитов на чтение

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `199` |
| Slug | `operator-console` |
| Title | Операторская консоль: сторона сайта и отказ от лимитов на чтение |
| Status | `archived` |
| Branch | `feature/199-operator-console` |

---

## Goal

Решения архитектора от 2026-10-24:

1. Убрать лимиты против скачивания, которые может задеть активный ученик: дневной лимит решений
   на аккаунт и пороги сигналов по файлам и решениям. Счётчики остаются справочными числами;
   ограничение nginx от ботов остаётся.
2. Дать сайтовую сторону операторской консоли `sre.infraege.ru` (smotryashchiy Change 30, §4j там):
   - хостовый исполнитель разрешённых команд;
   - JSON-режим операторской CLI;
   - выгрузки `kodumka.operator/1` и `kodumka.account/1`.
3. Новая редакция политики: сервер мониторинга назван местом обработки.

Контракт: SPEC §3, §4, §6.2, §8.2 («Юридическое (152-ФЗ)»), §9 п. 4.

---

## Backlog

### Backend
- [x] `B1` Убрать лимиты на чтение:
  - `SOLUTIONS_PER_DAY` и ответ 429 в `account/progress_api.py`;
  - пороги `SIGNAL_PAID_CHUNKS` / `SIGNAL_SOLUTIONS` в `account/restrictions.py`;
  - тесты.

  Счётчики `paid_chunks` и `solutions` продолжают считаться. Пороги сигналов остаются только по
  городам, вытеснениям и новым устройствам.
  — _Depends on:_ —
- [x] `B2` Режим `--json` операторской CLI (`billing/admin.py`):
  - вход — объект аргументов в stdin, выход — один JSON-объект, ошибки — `{"error": …}` с
    ненулевым кодом;
  - команды `warn`, `suspend`, `terminate`, `lift` (`--compensate`), `refund_execute` (выполнить
    запрошенный возврат), `account_show`.
  — _Depends on:_ B1
- [x] `B3` `account-show --email|--user`, схема `kodumka.account/1`: аккаунт (ID, email, создан,
  способы входа), доступ, оплаты и возвраты, активные сеансы (метка, город, IP, последний IP,
  активность), устройства, меры, счётчики за 30 дней. — _Depends on:_ B2
- [x] `B4` `export-operator`, схема `kodumka.operator/1`:
  - сигналы (user_id, email, флаги, счётчики, активные сеансы с меткой, городом и IP);
  - активные меры;
  - открытые возвраты;
  - `generated_at`.

  Атомарная запись в `/var/lib/infraege/ops/operator.json` (640).
  — _Depends on:_ B1
- [x] `B5` pytest: схемы `kodumka.operator/1` и `kodumka.account/1`, JSON-режим каждой команды,
  отказ на неверные аргументы. — _Depends on:_ B2, B3, B4

### Frontend
- [x] `F1` Новая редакция `/privacy`:
  - сервер мониторинга оператора в России обрабатывает email, ID, IP и город для защиты аккаунтов и
    операторских мер;
  - результаты команд хранятся 30 дней, журнал действий — 3 года;
  - пароли и платёжные данные не передаются.

  Согласие повторно не запрашивается: это собственная система оператора.
  — _Depends on:_ —

### Infra
- [x] `I1` `scripts/operator-command.sh KIND` (root, хост):
  - белый список видов и строгие шаблоны аргументов: UUID, email, `days` 1–30, `compensate`
    boolean, причина 1–300 байт без управляющих символов;
  - только argv, без shell;
  - вызывает `docker compose … exec -T api … billing.admin <cmd> --json` текущего релиза;
  - контрактный тест `scripts/tests/operator-command.test.sh`: белый список, отказ, отсутствие
    инъекций.
  — _Depends on:_ B2
- [x] `I2` Таймер `infraege-operator-export.timer` (каждые 10 минут, `scripts/operator-export.sh`)
  в `ops/install-backup-timers.sh`. В `production.md` — флаги агента `--operator-command
  /opt/infraege/current/scripts/operator-command.sh` и `--document operator=/var/lib/infraege/ops/operator.json`.
  — _Depends on:_ B4

### Other
- [x] `T1` Документы:
  - `accounts.md`: консоль — основной путь, CLI — запасной;
  - `privacy-legal-checklist.md`: получатели, раздел об утечке со ссылкой на журнал инцидентов;
  - `billing.md`: таблица команд.
  — _Depends on:_ I1, I2

---

## Files

### Create / modify
~~~
apps/api/app/modules/account/{progress_api,restrictions}.py
apps/api/app/modules/billing/admin.py · apps/api/app/modules/account/operator_export.py (new)
apps/api/tests/test_devices_restrictions.py · apps/api/tests/test_operator_cli.py (new)
apps/web/src/pages/privacy/privacy-page.tsx
scripts/operator-command.sh · scripts/operator-export.sh (new) · scripts/tests/operator-command.test.sh (new)
ops/systemd/infraege-operator-export.{service,timer} · ops/install-backup-timers.sh
docs/runbooks/{accounts,billing,production,privacy-legal-checklist}.md
~~~

### Do NOT touch
- Схема БД `198_01` (новых таблиц не нужно).
- Оферта и согласие (их тексты не меняются).
- Лимит nginx `paid_reads`.

---

## Contracts

See `docs/SPEC.md` §3–§4, §6.2, §8.2 and the Files list above; the console side is
smotryashchiy `docs/SPEC.md` §4j.

---

## Gate Checks

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 2f43e85d+wt | format, python-format, web-lint, web-typecheck, shell-lint, api-lint, api-typecheck, docs-links, api-contract | PASS | ~66 |
| 2f43e85d+wt | pytest test_operator_cli (1), test_devices_restrictions (4); operator-command.test.sh, billing-jobs.test.sh; Playwriter /privacy 375 px | PASS | ~200 |

---

## Implementation Notes

- B2: the JSON mode is the subcommand `operator KIND` (args JSON on stdin) rather than a `--json`
  flag on every command; arguments are validated by pydantic before the database is opened, and
  every refusal is one JSON object with exit 2.
- I1: the executor accepts `INFRAEGE_RELEASE_DIR` / `INFRAEGE_ENV_FILE` and `OPERATOR_COMMAND_TEST`
  for its contract test only; the agent runs it with a clean environment (smotryashchiy §4j).
- Coverage decision: `ops/systemd/infraege-operator-export.{service,timer}` follow the existing
  timer units; the installer lists them (checked by reading, like the geoip units of Change 198).
- The refund comment sent to Robokassa still says «Возврат оплаты infraege»
  (`billing/service.py`); not in this Backlog.

---

## Commit Message

```
feat(change-199): operator console site side, no reading limits
```
