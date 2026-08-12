# infraege

Техническая платформа будущего веб-приложения для подготовки к ЕГЭ по информатике. Публичный
frontend временно сведён к нейтральному стенду переиспользуемого Table of Contents; учебные
страницы и конкретный контент будут спроектированы заново.

Технический контракт проекта находится в [`docs/SPEC.md`](docs/SPEC.md), команды и версии стека —
в [`docs/STACK.md`](docs/STACK.md). Production-контур для `infraege.ru` описан в
[`docs/runbooks/production.md`](docs/runbooks/production.md); до появления реального VPS/DNS это
готовая, но ещё не выполненная процедура.

## Быстрый старт — одна команда

Для запуска приложения нужны только запущенный Docker с Compose v2 и GNU Make. Из корня
репозитория выполните:

```bash
make dev
```

Команда сама:

- подставляет одноразовые локальные значения без создания `.env`;
- собирает frontend и backend со всеми зависимостями внутри Docker;
- запускает PostgreSQL, API, Vite dev server и Nginx;
- ждёт, пока healthchecks всех сервисов станут зелёными;
- печатает готовые URL.

После запуска откройте <http://localhost:8080/>. Изменения в `apps/web/src`, `apps/api/app` и
backend-контенте подхватываются контейнерами без ручной переустановки зависимостей.

Основные команды:

```bash
make dev      # собрать/запустить и дождаться готовности
make ps       # показать состояние и health сервисов
make logs     # смотреть общие логи, выход — Ctrl+C
make restart  # перезапустить весь dev-стек
make stop     # корректно остановить стек, сохранив данные PostgreSQL
make down     # совместимый алиас для make stop
make clean    # удалить локальные отчёты, build outputs и кэши; зависимости и данные сохраняются
make help     # показать доступные команды
```

## Требования

- Docker с Compose v2 и GNU Make — для `make dev`;
- Node.js 22.13+, pnpm 10.33.0 (закреплён в `packageManager`), Python 3.12+ и
  [uv](https://docs.astral.sh/uv/) — только если вы запускаете автоматические тесты на host;
- Chromium — только для локального Playwright E2E.

Проверить установленные версии:

```bash
node --version
pnpm --version
python3 --version
uv --version
docker --version
docker compose version
make --version
```

Все команды ниже выполняются из корня репозитория, если не указано иное.

## Установка зависимостей на host — только для тестов

Для обычного запуска через `make dev` этот раздел не нужен. Если требуется запускать lint,
typecheck или тесты непосредственно в WSL/на host:

```bash
pnpm install --frozen-lockfile
cd apps/api
uv sync
cd ../..
```

Для первого запуска Playwright отдельно установите Chromium:

```bash
pnpm --filter web test:e2e:install
```

## Альтернативный запуск без Docker

Этот вариант не обязателен и оставлен для отладки отдельных процессов. PostgreSQL для текущего
frontend-стенда не требуется.

Откройте два терминала.

Терминал 1 — backend:

```bash
cd apps/api
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Проверка backend:

```bash
curl -f http://127.0.0.1:8000/health
```

Ожидаемый ответ:

```json
{"status":"ok","version":"development"}
```

Терминал 2 — frontend:

```bash
pnpm dev
```

Откройте стенд UI foundation: <http://127.0.0.1:3000/>.

Остановить каждый локальный процесс можно сочетанием `Ctrl+C` в его терминале.

## Запуск через Docker Compose

Рекомендуемый интерфейс — Makefile:

```bash
make dev
```

Он использует отдельный `infra/docker-compose.dev.yml`. Никакие `.env`, пароли, токены или
локально установленные Node/Python-пакеты не требуются. Встроенные значения существуют только в
процессе команды и предназначены исключительно для локального disposable PostgreSQL.

Проверить состояние:

```bash
make ps
```

В контейнерном режиме открывайте приложение через Nginx:

- UI: <http://localhost:8080/>;
- health check: <http://localhost:8080/health>.

Остановить стек, сохранив volume PostgreSQL:

```bash
make stop
```

Команда посылает сервисам их штатные stop-сигналы, ждёт до 30 секунд на сервис, затем удаляет
остановленные контейнеры и dev-network. Named volume PostgreSQL не удаляется. `make down` оставлен
как алиас, а timeout при необходимости можно увеличить, например: `make stop STOP_TIMEOUT=60`.

Не запускайте unit- или E2E-тесты внутри контейнеров: по правилам проекта они выполняются только
локально в окружении разработчика.

## Автоматические проверки

Все JavaScript-workspace:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Форматирование всего поддерживаемого репозитория проверяется отдельно от линтеров:

```bash
pnpm format:check
pnpm format        # применить Prettier и Ruff
pnpm lint:fix      # применить безопасные ESLint fixes
```

Сборки остаются явными, потому что web и локальный operations dashboard имеют разные runtime:

```bash
pnpm build
pnpm --filter ops build
```

Backend:

```bash
cd apps/api
uv run ruff check app tests
pnpm exec pyright app tests
uv run pytest
cd ../..
```

Связи content-as-code:

```bash
pnpm validate:content
```

Проверить, что Playwright видит E2E-сценарии:

```bash
pnpm --filter web exec playwright test --list
```

Полный локальный E2E запускается командой:

```bash
pnpm --filter web test:e2e
```

Playwright сам поднимает свежие frontend/backend на изолированных адресах
`127.0.0.2:3100` и `127.0.0.2:8100`; заранее запускать серверы для него не нужно. Сценарии
проверяют ToC-стенд, no-JS anchors, оба viewport, общий 404 и безопасную отправку frontend-ошибок.

Production-гейты (подробные предусловия — в `docs/STACK.md`):

```bash
pnpm audit:a11y       # локальный Playwright + axe; никогда не запускается в CI
pnpm audit:performance
pnpm audit:security
pnpm audit:images
```

## Production и наблюдаемость

Production использует неизменяемые GHCR-образы с тегом полного commit SHA, Nginx с TLS,
PostgreSQL, Umami, Beszel, journald/fail2ban и Restic. GitHub Actions выполняет только статические
и security-проверки — unit/E2E тесты по контракту проекта остаются локальными. Деплой запускается
вручную для выбранного SHA через защищённое environment `production`, проверяет smoke/readiness и
откатывает неуспешный релиз.

`apps/ops` — отдельное локальное приложение, которое через WireGuard объединяет доступность,
нагрузку, контейнеры, аналитику, ошибки и fail2ban. Конфигурация нескольких проектов уже
поддерживается; секреты задаются только environment-переменными. Запуск и модель доступа описаны
в [`docs/runbooks/monitoring.md`](docs/runbooks/monitoring.md).

Runbook’и: [DNS/TLS](docs/runbooks/dns-tls.md),
[backup/restore](docs/runbooks/backup-restore.md),
[инциденты](docs/runbooks/incident-response.md). Уведомление РКН и реквизиты оператора отложены по
явному решению владельца; это принятый юридический риск. Локальный backup на том же VPS также не
считается disaster recovery — off-site backend остаётся обязательным до появления незаменимых
пользовательских данных.

## Полезные документы

- [`docs/SPEC.md`](docs/SPEC.md) — продуктовый и системный контракт;
- [`docs/STACK.md`](docs/STACK.md) — версии, команды Fast/Full/Release Gate и структура проекта;
- [`docs/KNOWN_GOTCHAS.md`](docs/KNOWN_GOTCHAS.md) — известные проблемы окружения;
- [`docs/changes/`](docs/changes/) — активный change; завершённые changes хранятся в
  [`docs/changes/archive/`](docs/changes/archive/).
