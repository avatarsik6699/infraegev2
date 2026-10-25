# CHANGE 217 — CI, инфраструктура и уборка

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `217` |
| Slug | `ci-infra-cleanup` |
| Title | CI, инфраструктура и уборка |
| Status | `done` |
| Branch | `feature/217-ci-infra-cleanup` |

---

## Goal

Первый блок комплексного аудита (план архитектора от 2026-10-25). Задачи:
- устранить ложно-красный еженедельный аудит безопасности;
- исправить дрейф деплоя, compose и dev nginx;
- удалить неиспользуемые скрипты;
- обновить действия CI;
- выполнить локальную уборку.

---

## Backlog

### CI
- [x] `T1` Аудит безопасности. Плановые запуски шли на старом коммите `e0d433fc`, ручной запуск на
  HEAD остановился на semgrep (29 срабатываний). Сделано:
  - в `security-gate.sh` из скана исключены данные банка задач и офлайн-инструменты
    `scripts/lesson_design` (eval/exec кода уроков — по назначению);
  - для ложных срабатываний добавлены точечные `nosemgrep` с причиной: SQL из констант в
    миграциях, `UPDATE … RETURNING`, экранированный RegExp, доверенный SVG, e2e-спек;
  - Trivy обновлён до 0.76.1 в `security-gate.sh` и `image-gate.sh`.

  Локально semgrep, `pnpm audit` и `pip-audit` проходят. — _Depends on:_ —
- [x] `T2` Версии actions из PR Dependabot: setup-uv 10.2.0, upload-artifact 7.0.1,
  pnpm/action-setup 6.1.0, setup-buildx 4.4.1, sbom-action 0.24.2. В `dependabot.yml` добавлен
  ignore: Node major, Python major/minor, nginx minor — то есть остаёмся на стабильной ветке. Digest
  postgres не трогаем: он закреплён в пяти местах и проверяется бандлом бэкапа. — _Depends on:_ —
- [x] `T3` `format:check` проверяет только Prettier, Python проверяет группа `python-format`, она
  добавлена в `quality.yml`. Теперь Full Gate совпадает с CI. — _Depends on:_ —

### Infra
- [x] `T4` Деплой и compose:
  - архив релиза исключает `infra/docker-compose.override.yml`;
  - в prod-overlay обязателен `GEOIP_DIR`;
  - в api передаётся `LOG_LEVEL`;
  - `install-backup-timers.sh` вызывается без лишнего аргумента. — _Depends on:_ —
- [x] `T5` Dev nginx: маршруты `/health`, `/health/live`, `/health/ready` как в production; убран
  устаревший комментарий про Uptime Kuma. — _Depends on:_ —

### Scripts
- [x] `T6` Удалены неиспользуемые `scripts/lib/production-env.sh` с тестом, скрипты
  `test:browser:smoke`, `test:browser:account`, `test:browser:layout` и `audit:a11y`.
  `check-release-target.sh` проверяет только `kodumka.ru`. `brand:generate` описан в README.
  Из `.gitignore` убраны записи `.vinxi/` и `C:\Users…`. — _Depends on:_ —

### Local (без коммита)
- [x] `T7` Удалено:
  - 76 веток, уже слитых в `main`;
  - stash change-164 (черновик и отчёт от 28.09);
  - `infra/.env`;
  - `infra/practice-import-120.local`;
  - `scripts/mascot/node_modules`;
  - `reports/`, `research_notes/`;
  - 11 файлов в `infra/task-files.local`, на которые банк задач больше не ссылается. — _Depends on:_ —

---

## Gate Checks

Группы: `format`, `python-format`, `tooling-lint`, `web-lint`, `web-typecheck`, `shell-lint`,
`api-lint`, `api-typecheck`, `docs-links`, `infra-config`, `api-contract`. Тесты:
- shell: `deploy-preflight`, `account-cutover`, `operator-command`, `clean-local-artifacts`;
- prod-overlay собран с тестовым окружением: `GEOIP_DIR` обязателен, `LOG_LEVEL` передаётся;
- локально semgrep, `pnpm audit`, `pip-audit`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 9094b16e+wt | 11 static groups | PASS | 75 |
| 9094b16e+wt | 4 shell contracts, prod compose render | PASS | 40 |
| 9094b16e+wt | semgrep p/default, pnpm audit, pip-audit | PASS | 420 |

---

## Implementation Notes

Ручной браузерный аудит на HEAD `9094b16e` нашёл две проблемы, обе вынесены в Change 218 и решение
архитектора:
1. Lighthouse на production:
   - LCP на `/courses` и `/courses/python` 5,6–6 с: главная картинка курса грузится лениво;
   - TBT на уроках около 700 мс: чанк уроков весит 5 МБ, в нём free-контент всех 25 тем.
2. 15 из 268 e2e-тестов отстали от интерфейса после релиза 198–209.

---

## Commit Message

```
chore(change-217): CI audit, infra drift and unused scripts
```
