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

При первом запуске команда сама:

- подставляет одноразовые локальные значения без создания `.env`;
- собирает отсутствующие frontend/backend-образы со всеми зависимостями внутри Docker;
- запускает PostgreSQL, API, Vite dev server и Nginx;
- ждёт, пока healthchecks всех сервисов станут зелёными;
- печатает готовые URL.

После запуска откройте <http://localhost:8080/>. Изменения в `apps/web/src`, `apps/api/app` и
backend-контенте подхватываются контейнерами без ручной переустановки зависимостей.

Основные команды:

```bash
make dev      # запустить/возобновить и дождаться готовности
make rebuild  # явно пересобрать образы и запустить стек
make ps       # показать состояние и health сервисов
make logs     # смотреть общие логи, выход — Ctrl+C
make restart  # перезапустить весь dev-стек
make stop     # остановить стек, сохранив контейнеры для быстрого запуска
make down     # удалить контейнеры и dev-network, сохранив PostgreSQL
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

Остановить стек для последующего быстрого запуска:

```bash
make stop
```

Команда посылает сервисам их штатные stop-сигналы и ждёт до 30 секунд на сервис. Контейнеры,
dev-network, собранные образы, build cache и named volume PostgreSQL сохраняются. Следующий
`make dev` запустит существующие контейнеры и дождётся их готовности, не запуская сборку. Изменения
в `apps/web/src`, `apps/api/app` и `content` подключены bind-mount и доступны без пересборки.

После изменения lock-файлов, package manifests, Dockerfile, Vite config или другого файла вне
bind-mount выполните явную пересборку:

```bash
make rebuild
```

Docker использует build cache, поэтому неизменившиеся слои `pnpm install` и `uv sync` при этом не
выполняются заново.

Для явного удаления контейнеров и dev-network используйте:

```bash
make down
```

`make down` также сохраняет named volume PostgreSQL; удаление данных не входит в обычный локальный
lifecycle. Timeout при необходимости можно увеличить для обеих команд, например:
`make stop STOP_TIMEOUT=60`.

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

```bash
pnpm build
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

Автоматизация operations-контура принадлежит этому репозиторию: `ops/opsctl inventory`, `status`
и `plan` читают pinned-SSH inventory, сравнивают его с versioned secret-free desired state и не
изменяют VPS. Будущий production apply также останется infraegev2-specific; сейчас реализован
только sandbox executor для проверки lock/checkpoint/revision/outbox и rollback контрактов.

Транзакционный reconcile engine теперь доступен только для disposable sandbox: сначала сохраните
`ops/opsctl plan --json`, затем передайте этот файл, соответствующий inventory и явный
`--sandbox-root` в `ops/opsctl apply`. Engine проверяет fingerprint, блокирует stale/destructive
plan по умолчанию, создаёт checkpoint, атомарный revision и sanitized outbox, а при ошибке
откатывает sandbox. Новый/пустой state root получает marker; существующий непустой каталог без
marker отклоняется. Это не production apply: SSH/Compose/systemd executor отсутствует.

Неактивное определение будущего отдельного stack находится в
`ops/observability/compose.yml`. `make ops-config` только render/validate его с переданными через
environment защищёнными значениями, а `make ops-bundle` печатает детерминированный secret-free
manifest и hashes repository-owned assets. Эти команды не запускают и не загружают контейнеры;
параллельный старт рядом с текущим application Compose запрещён до отдельной миграции.

Перед проектированием этой миграции сохраните manifest через
`python3 ops/observability/build-bundle.py --output /tmp/infraege-ops-bundle.json` и запустите
`make ops-preflight BUNDLE=/tmp/infraege-ops-bundle.json`. Это только санитизированная read-only
проверка; даже полностью зелёный отчёт содержит `authorized_to_apply: false`.

После сохранения зелёного preflight можно отдельно проверить transaction sequence командой
`make ops-rehearse-migration BUNDLE=... PREFLIGHT=... SOURCE=... SANDBOX_ROOT=...`. Она принимает
только hash-bound disposable artifacts, моделирует смену owner и обязательно откатывает её внутри
маркированного sandbox. Это не реальный restore и не разрешение на production cutover.

Совместимость target binaries проверяется отдельно через `make ops-data-fidelity-drill`. Команда
использует только синтетическую Umami-схему и новый Beszel volume, точные локальные digest-образы,
динамические loopback-порты и удаляет все созданные ресурсы. Она не читает Restic/production data;
успешный результат по-прежнему содержит `authorized_to_cutover: false`.

First-party sibling [sre-kit](https://github.com/avatarsik6699/sre-kit) остаётся универсальным
ядром наблюдаемости: adapters, Source configuration, normalization, alerts и monitoring UI. Он
читает источники infraegev2 через private API/WireGuard/read-only SSH, но не устанавливает и не
настраивает target stack. Deployment credentials и target lifecycle в sre-kit не передаются.

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
