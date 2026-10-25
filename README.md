# Кодумка (kodumka.ru)

Веб-приложение для подготовки к ЕГЭ по информатике: темы ЕГЭ, опубликованные в source tree
(список — `apps/web/src/entities/lesson/content/lesson-registry.ts`), мини-курсы
Python (30 уроков) и Excel, server-owned практика и необязательный аккаунт для сохранения прогресса на
сервере. Гости читают и проверяют ответы без сохранения результатов. Темы ЕГЭ и CourseLesson
остаются независимыми учебными траекториями.

Технический контракт проекта — [`docs/SPEC.md`](docs/SPEC.md), версии, команды и gate —
[`docs/STACK.md`](docs/STACK.md), правила работы агентов — [`AGENTS.md`](AGENTS.md).
Production работает на `kodumka.ru` (бренд «Кодумка», `infraege.ru` переадресует) в одном application Compose project
([`docs/runbooks/production.md`](docs/runbooks/production.md)); внешняя cookieless-аналитика —
отдельный сервис.

После тестов, линтинга, сборки или аудита проанализируйте отчёты и выполните `make clean` (удаляет
allowlisted артефакты и проверяет, что их не осталось). Не используйте вместо него
`git clean -fdX`: среди ignored-путей находятся зависимости, окружения, секреты и данные.

## Требования

Docker с Compose v2 и GNU Make — для `make dev`; для host-проверок — Node.js 22.13+, pnpm 10.33.0,
Python 3.12+, uv и ShellCheck; Chromium — только для локального Playwright. Полный список с
проверочными командами — [STACK § Prerequisites](docs/STACK.md#prerequisites). Все команды
выполняются из корня репозитория.

## Запуск

```bash
pnpm install --frozen-lockfile   # host-зависимости: нужны только для проверок и тестов
make dev                         # dev-стек: UI http://localhost:8080/, health /health
make practice-bootstrap          # импорт банка задач в локальную базу (после первого make dev)
make stop                        # быстрая остановка; make down удаляет контейнеры, данные остаются
```

`make dev` сам пересобирает образы при изменении lock-файлов, Dockerfile и других входов;
`make rebuild` — принудительно. Код `apps/web/src`, `apps/web/public` и `apps/api/app` подключён
bind-mount. Перед повторным импортом банка экспортируйте свои правки. Детали lifecycle, Athanor/SMTP
и запуск отдельных процессов без Docker — [STACK § Initial setup](docs/STACK.md#initial-setup) и
[accounts](docs/runbooks/accounts.md).

## Проверки

```bash
python3 scripts/gate.py affected          # какие группы проверок нужны для текущих изменений
python3 scripts/gate.py run --group …     # запустить их; краткая сводка, полный лог в .output/gate/
pnpm format | pnpm lint:fix               # применить Prettier/Ruff и безопасные ESLint fixes
pnpm --filter web test                    # Vitest
cd apps/api && uv run pytest              # backend
pnpm --filter web test:e2e                # Playwright; нужен засеянный банк (STACK § Testing)
pnpm brand:generate                       # пересобрать иконки и картинки бренда из знака
```

Тесты запускаются только на host, не в контейнерах. Gate-таблицы и периодические аудиты —
[STACK](docs/STACK.md) и [verification](docs/runbooks/verification.md).

## Production и эксплуатация

Один application Compose: Nginx с TLS, web, API и PostgreSQL. Сохраняются health, журналы,
fail2ban, application backup/restore и явный SHA deploy. Аналитический и monitoring стек не входит
в application; публичный tracker обращается к отдельному cookieless-сервису. Локальная работа
не изменяет сервисы VPS.

Практика хранится в PostgreSQL (migration head `198_01`, исходная схема банка `122_01`), импорт/экспорт описан в
[practice](docs/runbooks/practice.md). `make practice-bootstrap` импортирует
полный проверенный банк в локальную базу. Перед повторным импортом экспортируйте свои правки.
[Production](docs/runbooks/production.md) и [backup/restore](docs/runbooks/backup-restore.md)
описывают действующие команды. Push и deploy не входят в локальный `/work`.

## Полезные документы

- [`docs/SPEC.md`](docs/SPEC.md) — продуктовый и системный контракт;
- [`docs/STACK.md`](docs/STACK.md) — версии, команды Critical/Full/Release Gate и структура проекта;
- [`docs/KNOWN_GOTCHAS.md`](docs/KNOWN_GOTCHAS.md) — известные проблемы окружения;
- [`docs/changes/`](docs/changes/) — активный change; завершённые changes хранятся в
  [`docs/changes/archive/`](docs/changes/archive/).
