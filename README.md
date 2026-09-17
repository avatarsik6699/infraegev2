# infraege

Веб-приложение для подготовки к ЕГЭ по информатике с двумя опубликованными полными темами,
завершённым самостоятельным мини-курсом Python из 28 уроков, server-owned практикой и локальным
прогрессом ученика. Темы ЕГЭ и CourseLesson остаются независимыми учебными траекториями.
Текущий candidate возвращает минимальное монохромное оформление; аналитический стек удалён.

Технический контракт проекта находится в [`docs/SPEC.md`](docs/SPEC.md), команды и версии стека —
в [`docs/STACK.md`](docs/STACK.md). Production-контур для `infraege.ru` описан в
[`docs/runbooks/production.md`](docs/runbooks/production.md). Production работает на
`infraege.ru`; application использует один Compose project; мониторинг удалён из текущего candidate.

Статус `complete`/`archived` в change-файлах описывает код в локальной истории репозитория, а не
факт публикации. GitHub может отставать от локального `main`, а production — от GitHub; фактически
развёрнутый SHA всегда проверяется через `/health/ready` и release evidence, а не выводится из
документационного статуса. Описание возможностей в этом README относится к текущему source tree;
до `/ship --release` одобренные изменения могут ещё отсутствовать в production.

## Быстрый старт

Для запуска приложения нужны только запущенный Docker с Compose v2 и GNU Make. Из корня
репозитория выполните:

```bash
make dev
make practice-bootstrap  # первый явный импорт учебного банка
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
make clean-dry-run  # показать точный allowlist удаляемых локальных артефактов
make clean          # удалить отчёты, build outputs и кэши; зависимости и данные сохраняются
make clean-check    # завершиться с ошибкой, если allowlisted-артефакты ещё остались
make help     # показать доступные команды
```

После тестов, линтинга, сборки или аудита сначала проанализируйте нужные отчёты, затем завершите
сессию последовательностью `make clean-dry-run`, `make clean`, `make clean-check`. Не используйте
вместо неё `git clean -fdX`: среди ignored-путей находятся зависимости, окружения, секреты и данные.

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
проверяют публичный вход, опубликованные уроки, no-JS чтение, desktop/mobile viewport, общий 404
и безопасную отправку frontend-ошибок.

Production-гейты (подробные предусловия — в `docs/STACK.md`):

```bash
pnpm audit:a11y       # локальный Playwright + axe; никогда не запускается в CI
pnpm audit:performance
pnpm audit:security
pnpm audit:images
```

## Production и эксплуатация

Один application Compose: Nginx с TLS, web, API и PostgreSQL. Сохраняются health, журналы,
fail2ban, application backup/restore и явный SHA deploy. Аналитический и monitoring стек удалён
из candidate; локальная работа не останавливает уже установленные сервисы VPS.

Практика хранится в PostgreSQL (`122_01`), импорт/экспорт описан в
[practice](docs/runbooks/practice.md), перенос на новую схему — в
[transition](docs/runbooks/practice-transition.md). `make practice-bootstrap` импортирует
полный проверенный банк в локальную базу. Перед повторным импортом экспортируйте свои правки.
[Production](docs/runbooks/production.md) и [backup/restore](docs/runbooks/backup-restore.md)
описывают действующие команды. Push и deploy не входят в локальный `/work`.

## Полезные документы

- [`docs/SPEC.md`](docs/SPEC.md) — продуктовый и системный контракт;
- [`docs/STACK.md`](docs/STACK.md) — версии, команды Critical/Full/Release Gate и структура проекта;
- [`docs/KNOWN_GOTCHAS.md`](docs/KNOWN_GOTCHAS.md) — известные проблемы окружения;
- [`docs/changes/`](docs/changes/) — активный change; завершённые changes хранятся в
  [`docs/changes/archive/`](docs/changes/archive/).
