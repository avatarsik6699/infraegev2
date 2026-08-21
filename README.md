# infraege

Веб-приложение для подготовки к ЕГЭ по информатике с двумя опубликованными полными уроками,
связанной практикой и локальным прогрессом ученика. Аудит learner journey и закрытие анонимного
progress/result/continuation loop завершены; перед выбором третьей темы или первого среза
мини-курса проект стабилизирует документацию и зафиксированные границы двух репозиториев.

Технический контракт проекта находится в [`docs/SPEC.md`](docs/SPEC.md), команды и версии стека —
в [`docs/STACK.md`](docs/STACK.md). Production-контур для `infraege.ru` описан в
[`docs/runbooks/production.md`](docs/runbooks/production.md). Production работает на
`infraege.ru`; application и operations используют независимые Compose projects.

Статус `complete`/`archived` в change-файлах описывает код в локальной истории репозитория, а не
факт публикации. GitHub может отставать от локального `main`, а production — от GitHub; фактически
развёрнутый SHA всегда проверяется через `/health/ready` и release evidence, а не выводится из
документационного статуса.

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
проверяют публичный вход, опубликованные уроки, no-JS чтение, desktop/mobile viewport, общий 404
и безопасную отправку frontend-ошибок.

Production-гейты (подробные предусловия — в `docs/STACK.md`):

```bash
pnpm audit:a11y       # локальный Playwright + axe; никогда не запускается в CI
pnpm audit:performance
pnpm audit:security
pnpm audit:images
```

## Production и наблюдаемость

Production использует неизменяемые GHCR-образы с тегом полного commit SHA. Application Compose
владеет Nginx с TLS, web, API и PostgreSQL; отдельный `infraege-ops` Compose владеет Umami, Beszel
и их gateways. journald/fail2ban и Restic остаются host-level prerequisites. GitHub Actions выполняет только статические
и security-проверки — unit/E2E тесты по контракту проекта остаются локальными. Деплой запускается
вручную для выбранного SHA через защищённое environment `production`, проверяет smoke/readiness и
откатывает неуспешный релиз.

Operations-контур принадлежит этому репозиторию, но намеренно остаётся маленьким:
`ops/observability/compose.yml`, контракт защищённого env, SSH-backed команды
`config/status/install/update/rollback` и secret-free Source template. Docker Compose является
desired state сервисов; отдельного plan/apply engine, migration harness или deployment UI нет.

`make ops-config ENV_FILE=... RELEASE=<full-sha>` локально проверяет definition.
`make ops-status` читает установленный project через pinned SSH. `ops-install`/`ops-update`
передают один Compose + maintenance release и выполняют `pull` + `up --wait`; `ops-rollback` возвращает предыдущий
release. Эти команды никогда не меняют application Compose.

По решению архитектора beta-данные Umami/Beszel не переносились. Split-stack cutover завершён:
новые operations volumes используются независимым `infraege-ops`, backup/restore и timers
проверены, а прежние volumes сохранены только как rollback-only. Их удаление остаётся отдельным
явно подтверждаемым destructive действием.

First-party sibling [sre-kit](https://github.com/avatarsik6699/sre-kit) остаётся универсальным
ядром наблюдаемости: adapters, Source configuration, normalization, alerts и monitoring UI. Он
читает источники infraegev2 через private API/WireGuard/read-only SSH, но не устанавливает и не
настраивает target stack. Deployment credentials и target lifecycle в sre-kit не передаются;
`ops/observability/sre-kit-sources.example.json` служит только операторской подсказкой. Текущий
шаблон описывает один Project, шесть pull Source и один coarse-aggregate push Source и согласован
со sre-kit Change 22. Ранее связанный Change 20 оставил ровно шесть уникальных enabled pull Sources
и доказал для каждой свежие polling/status, quiet success,
обратимый failure/recovery и authenticated Dashboard/Sources/detail без target-side mutations.
Этот proof не делает локальный sre-kit core круглосуточным: когда workstation выключен, polling и
alerts не выполняются. Source registration и token rotation являются операторскими действиями
внутри sre-kit; target producer лишь отправляет обезличенные versioned batches и не передаёт core
deployment authority.

Runbook’и: [DNS/TLS](docs/runbooks/dns-tls.md),
[backup/restore](docs/runbooks/backup-restore.md),
[инциденты](docs/runbooks/incident-response.md). Основной административный доступ к VPS —
password-only `root` с pinned host key, UFW, fail2ban и GitHub Environment approval; риск принят
владельцем без запланированного перехода на key-only identities. Уведомление РКН и реквизиты
оператора также отложены бессрочно до отдельного решения владельца. Локальный backup на том же VPS не
считается disaster recovery — off-site backend остаётся обязательным до появления незаменимых
пользовательских данных.

## Полезные документы

- [`docs/SPEC.md`](docs/SPEC.md) — продуктовый и системный контракт;
- [`docs/STACK.md`](docs/STACK.md) — версии, команды Critical/Full/Release Gate и структура проекта;
- [`docs/KNOWN_GOTCHAS.md`](docs/KNOWN_GOTCHAS.md) — известные проблемы окружения;
- [`docs/changes/`](docs/changes/) — активный change; завершённые changes хранятся в
  [`docs/changes/archive/`](docs/changes/archive/).
