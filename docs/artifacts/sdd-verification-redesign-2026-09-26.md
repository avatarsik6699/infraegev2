# Пересмотр SDD и проверок: исследование и проект внедрения

Дата: 2026-09-26. Статус: предложение для архитектурного согласования, не действующий контракт.

Документ подготовлен по запросу на углублённое исследование. Он не меняет SPEC, STACK,
активный Change 145, правила выпуска или расписания. Команды, профили и файлы, обозначенные
как предлагаемые, ещё не реализованы. В ходе исследования новые gate, тесты и деплой не запускались.

## 1. Решение, которое предлагается принять

Разделить проверку изменений, проверку релизного кандидата и периодический аудит.
Перестать считать Full универсальным набором всех имеющихся инструментов.
Каждое обязательство должно иметь причину запуска, владельца, наблюдаемый результат,
условия актуальности и заранее определённую реакцию на отказ.

Рекомендуемые изменения политики:

- Lighthouse: еженедельный локальный аудит плюс обязательные измерения при риске
  производительности. Не запускать для обычных исправлений backup/CLI/документации.
- Security: разделить secrets, SAST, зависимости, конфигурацию и образы. Полный локальный
  security-комбайн исключить из функционального Full; обязательные проверки соответствующего
  риска и проверки публикации сохраняются. Добавить независимый от коммитов аудит production.
- Full: полный функциональный регресс и статические проверки, без автоматического включения
  всех периодических аудитов. Release: состав обязательств по рискам конкретного выпуска.
- Work и ship: потребляют общий набор результатов; ship повторно выполняет только то,
  для чего результат отсутствует, устарел или изменились входы.
- Кеш: отдельный ключ каждой проверки, явные зависимости и объяснимое инвалидирование.
- SDD: одна релизная попытка переживает исправления и закрытие отдельных changes.
- Сначала исправить состав проверок и позднее обнаружение ошибок; затем оптимизировать
  кеширование и параллельность. Новый распределённый оркестратор не нужен.

Это изменение принятой политики, включая SPEC §8 и AGENTS. До внедрения текущие требования
Full/Release продолжают действовать. Расписания ниже — инженерные предложения для этого
проекта, а не требования внешнего стандарта.

## 2. Доказательная база и границы измерений

Первое исследование обнаружило восемь Full-запусков за 25 сентября: пять PASS, три FAIL,
3305.545 секунды команд, без переиспользования. В обновлённом снимке есть девятый,
прерванный запуск: всего 3690.864 секунды, то есть 61 минута 31 секунда команд.
Даты здесь соответствуют UTC в JSON. Отчёты продолжают появляться в ходе параллельной работы.

Источник: локальные JSON в `~/.local/state/infraegev2/gates/7ad70e2954adc183`.
Это не полное время доставки: подготовка Docker/БД, исправления, агентные действия,
ожидание CI и production rehearsal учитываются отдельно либо пока не учитываются.

Пример успешного Full `full-20260925T202106.182853Z-252647-f69c3101958a.json`:

| Стадия | Секунды команд |
|---|---:|
| Lighthouse | 187.300 |
| E2E | 110.165 |
| API tests | 78.469 |
| Security | 61.938 |
| Остальное | 44.896 |
| Итого | 482.768 |

Последние проверенные публикации образов укладывались приблизительно в 1–1.5 минуты.
Это ограниченная выборка, не SLO и не доказательство отсутствия медленных сборок.
Старый `updatedAt` workflow нельзя автоматически интерпретировать как время выполнения jobs.

### Дополнительные находки

| Наблюдение | Значение для проекта | Источник |
|---|---|---|
| Full не включает весь lint/typecheck CI | Дорогой PASS допускает дешёвый отказ после push; Changes 141–142 это продемонстрировали | `scripts/lib/gate/core.py`, `.github/workflows/quality.yml`, archive 141–142 |
| Full/release не добавляют переданные focused tests так, как Critical | Дополнительная проверка может оставаться только ручным обязательством; Full не доказывает её выполнение | `scripts/lib/gate/core.py`, `scripts/gate.py` |
| Default E2E исключает layout-stability; runner не запускает отдельный layout suite | Высокая стоимость не означает полное покрытие rendering-рисков | `apps/web/playwright.config.ts`, `playwright.layout.config.ts`, `scripts/lib/gate/core.py` |
| Account UI E2E использует перехваты API; provider tests используют MockTransport | Эти результаты не доказывают работу реального browser→API→DB или реального провайдера | `apps/web/e2e/pages/account.page.ts`, `apps/api/tests/test_account_providers.py` |
| Full shell bundle содержит семь выбранных контрактов, но не все тесты account cutover/retention/auth edge | Перечень отстал от продуктовой архитектуры | `OPERATIONS_CONTRACTS`, `scripts/tests/` |
| Cutover tests проверяют validate/mocks и отдельные строки команд; не всю успешную цепочку run | Restic compatibility, offline runner и stdin выявлялись на поздних репетициях | `scripts/tests/account-cutover.test.sh`, changes 143–145 |
| Lighthouse включает a11y=1 и SEO=1 наряду с LCP/CLS/TBT | Удаление Lighthouse из gate требует явного перераспределения этих обязательств | `lighthouserc.cjs` |
| Security workflow запускается по push/PR, images — по push main | В этих workflow нет периодического пересканирования уже опубликованной версии | `.github/workflows/quality.yml`, `images.yml` |
| Gitleaks запускается с no-git, даже при fetch-depth 0 в CI | Проверка итогового дерева не равна проверке публикуемой истории коммитов | `scripts/security-gate.sh`, `quality.yml` |
| Security локально и в CI определён отдельно; локальный Trivy не сохраняет контейнерный кеш | Дублирование политики и повторная подготовка scanner data | `scripts/security-gate.sh`, `quality.yml` |
| Fingerprint включает весь HEAD/tree, все env и версии восьми утилит; пересчитывается между шагами | Независимые результаты теряют актуальность вместе; мелкое изменение запускает большой повтор | `scripts/lib/gate/core.py:114` |
| Cleanup удаляет output, ESLint/Ruff cache | Политика гигиены конфликтует с повторным использованием результатов | `scripts/clean-local-artifacts.sh` |
| Checkpoint хранит успешность image scan jobs, но не сами OCI digests | Для точного переноса evidence и пересканирования production нужны явные идентификаторы артефактов | `scripts/release_checkpoint.py:132` |

Успешность всего images job уже косвенно покрывает обязательные SBOM/provenance steps.
Нельзя утверждать, что они совсем не проверяются. Проблема — отсутствие явной связи
SHA → digest → scan/artifacts в checkpoint, удобной для повторной проверки и передачи в rehearsal.

Работающие решения сохранить: единственную сборку перед performance, дедупликацию E2E
между затронутыми доменами, изоляцию production-данных, exact-SHA deploy acceptance,
проверку восстановимости и локальное исполнение тестов.

## 3. Модель рисков и профили

У проверки есть две независимые причины запуска:

1. Изменились входы, способные сломать конкретное поведение.
2. Прошло время или изменились внешние данные: CVE, окружение, сертификат, backup.

Периодическое измерение старой версии не доказывает корректность новой. В то же время
неизменный код не доказывает отсутствие новых известных уязвимостей.

Предлагаемые профили:

| Профиль | Назначение | Что не входит автоматически |
|---|---|---|
| Critical | Быстрая проверка законченного набора изменений: static + targeted contracts/tests | Полный браузерный обход, Lighthouse, полный security-комбайн |
| Regression / обновлённый Full | Все объявленные функциональные suites и static baseline в изолированной локальной среде | Периодический Lighthouse, повторная полная история secrets, production restore |
| Release | Полное покрытие рисков разницы с production; переиспользование совместимых результатов; актуальное доказательство публикации и deploy | Повтор всего из-за нового change ID или archive commit |
| Audit | Явно выбранные периодические проверки; полный вариант объединяет все зарегистрированные локальные аудиты | Автоматический merge/push/deploy/production mutations |

Названия CLI фиксируются при внедрении. Старый `--full` нельзя молча переопределить:
обновить help, playbooks, template и объявить миграцию; на переходный период оставить явно
названный legacy-профиль для сопоставления. После пилота удалить ненужную совместимость.

Unknown path не означает автоматический запуск каждого инструмента. Он означает неполную
классификацию и блокирует признание дешёвого плана достаточным. Runner предлагает
консервативное покрытие возможных доменов; неразрешённая неоднозначность не превращается
в SKIP. Для shared dependencies/build/config — широкая проверка затронутых потребителей.

## 4. Матрица запусков

| Проверка | По изменению | Перед релизом | Периодически |
|---|---|---|---|
| Format/lint/typecheck | Затронутые workspace + общая конфигурация | Совместимый PASS или запуск отсутствующих проверок | Самостоятельное расписание не нужно |
| Unit/детерминированные contracts | Владелец поведения и потребители изменённого контракта | Релевантное покрытие; общий регресс при широком влиянии | Еженедельный локальный полный регресс |
| API + PostgreSQL integration | Accounts/progress/checker/repository/roles/migrations/config | Обязательно для этих рисков | В составе локального регресса |
| Core browser journeys | Пользовательский поток, SSR, маршруты, API-интеграция | Короткий production-build smoke для app-релизов | Полный локальный browser audit еженедельно |
| 28 no-JS lesson cases | Контент, publication registry, общие lesson-шаблоны/SSR | При соответствующем влиянии | Полный локальный browser audit |
| A11y | Изменённый экран/форма/диалог и общий компонент | Затронутые маршруты; полный набор при изменении shell/design system | Все маршруты еженедельно |
| Layout/hydration/fonts | CSS, шрифты, изображения, shared shell, SSR/hydration | Обязательно для затронутого rendering-контракта | Еженедельно |
| Lighthouse | Только performance-risk inputs | При performance risk или просроченном обязательном evidence для него | Еженедельно, локально, стабильный стенд |
| SEO contracts | Маршруты, metadata, robots/sitemap, индексирование | Затронутые SEO-контракты | Полный Lighthouse SEO audit еженедельно |
| Secrets | Новые/изменённые исходники и предлагаемый commit | Вся ещё не опубликованная история + точное публикуемое дерево до push | После обновления правил; плановый полный аудит ежемесячно |
| SAST | Релевантный production/ops код; высокий приоритет auth/data/deploy | Совместимое evidence или exact-candidate CI перед deploy | Полный scan еженедельно и после обновления rules |
| Dependency audit | Lock/manifests/base image/toolchain | Evidence тех же входов не старше 24 часов либо свежий scan | Ежедневно runtime; полный build/dev inventory еженедельно |
| Infrastructure misconfig | Docker/Compose/Nginx/workflow/deploy config | При изменении этих входов | Полный аудит еженедельно |
| Image vulnerability scan | Новые опубликованные digests | Каждый новый digest до deploy; перед поздним deploy evidence не старше 24 часов | Ежедневно deployed digests и доступного rollback-кандидата |
| Migration/restore | Schema/roles/backup/restore/deploy boundary | Обязательная репетиция соответствующего перехода | Текущий ежемесячный restore drill |
| Availability/TLS/backup freshness | Изменение эксплуатационного контракта | Свежая целевая health/config проверка | Текущие probe/backup timers + контроль давности их успеха |

24 часа — предлагаемый предел возраста vulnerability evidence. Это осознанное окно,
а не доказательство, что за него ничего не изменилось. Известная новая релевантная CVE,
новые правила или изменившиеся входы отменяют перенос PASS раньше срока.
Для первой авторизации и других высокорисковых переходов использовать свежий scan.

Полный функциональный регресс остаётся доступен вручную. Его запуск не требует
бессмысленного повторения scanner downloads, внешних проверок или неизменившегося Lighthouse.

### 4.1 Триггеры Lighthouse

Высокий риск: новые тяжёлые зависимости/runtime JS, bundle/code splitting, SSR loaders,
глобальные CSS/fonts, крупные above-the-fold assets, image sizing/loading, router shell,
кеширование/compression Nginx, API latency на SSR hot path, существенный объём DOM.

Низкий риск: SQL whitespace, исправление stdin host-команды, backup metadata parsing,
документация, небольшой текст без изменения структуры/ресурсов.

Для локального изменения измерять затронутые маршруты. Для shared shell/build/font —
полный набор пяти текущих маршрутов. Новый класс страниц должен добавить представителя.
Сохранять три измерения и median; одно измерение не делает проверку надёжнее.
Порог LCP 4.0s, CLS 0.1 и TBT 200ms не повышать в рамках этой оптимизации.
Добавить дешёвое наблюдение за размерами JS/CSS/assets в существующую сборку;
порог изменений определить по baseline, а не произвольным числом. Это сигнал для
Lighthouse, не замена измерениям и не доказательство INP реальных пользователей.

A11y и SEO перенести явно: route-level axe + keyboard/forms contracts и детерминированные
metadata/sitemap/noindex checks по изменениям; полный Lighthouse audit сохраняет более
широкое периодическое покрытие. Axe и Lighthouse не считать полностью эквивалентными.

## 5. Security: ответственность, актуальность, отказ

### 5.1 Убрать монолитную семантику audit:security

Зарегистрировать отдельные шаги secrets, sast, dependencies-js, dependencies-python,
infra-config, image-scan. Существующую aggregate-команду оставить для явного полного аудита.
В первой итерации использовать те же инструменты: замена scanner stack не является целью.

Выделить владельца каждого класса: Gitleaks — основной secrets; Semgrep — SAST;
pnpm/pip-audit — ecosystem dependencies; Trivy — image OS/application vulnerabilities
и инфраструктурные ошибки. Пересекающиеся filesystem secret/vulnerability scans Trivy
не удалять до инвентаризации уникальных находок и проверки fixture-набора; после неё
оставить только обоснованное пересечение. Это не утверждение равенства scanner databases.

SAST сначала запускать целиком по небольшому production/ops scope при изменении кода.
Оптимизацию до changed-file scan внедрять только после проверки покрытия, конфигураций и
ограничений установленного движка. Не обещать межфайловое доказательство от текущего scan.
Зафиксировать rules/config digest: версия CLI при `p/default` сама по себе не фиксирует правила.

### 5.2 Один release-evidence на одну обязанность

Локально обязательны проверки до появления риска публикации: в частности secrets до push.
Для SAST и зависимостей допускается authoritative CI evidence того же кандидата до deploy;
локальный прогон остаётся быстрым feedback при соответствующих изменениях.
Не требовать одинаковый полный scan и локально, и в CI как два независимых условия релиза.
Если локальная проверка опциональна, до push честно писать «ожидается CI», не «release PASS».

Каждый новый образ сканируется по digest после публикации и до deploy. При повторной
проверке неизменившегося digest обновлять vulnerability evidence без пересборки образа.
Периодический scan должен уметь выбрать реально deployed manifest: main может опережать
production. Проверка latest main не доказывает состояние работающего сервиса.

### 5.3 Что блокирует

- Secrets в публикуемой истории/дереве: блокируют публикацию; не откладывать на неделю.
- Нарушение auth/authorization/session/CSRF/data-isolation теста: блокирует релевантный выпуск.
- Новая фиксируемая HIGH/CRITICAL уязвимость: сохранить существующую блокирующую политику.
- Нефиксируемые HIGH/CRITICAL: отдельный отчёт и ручная оценка воздействия; ignore-unfixed
  в gate не должен делать их невидимыми в аудите.
- Ошибка scanner/network != «уязвимостей нет»: отдельный статус ERROR/UNKNOWN.
- Просроченное vulnerability evidence: запуск только нужного scan, без всего Full.
- Периодическая находка: owner, конкретный объект/digest, срок решения, tracking;
  применимая блокирующая находка отменяет старый PASS.
- Исключение: узкий scope, обоснование, владелец, срок истечения; не глобальный skip.

### 5.4 Кеш scanner data

Сохранять vulnerability DB и служебные данные Trivy вне удаляемого контейнера;
сохранять обычную проверку обновлений. Разделить кеши при конфликтующем параллельном доступе.
Записывать engine/rules/DB identity и время наблюдения. Для сервисов, не отдающих revision
advisory DB, записывать источник, время ответа и короткий срок актуальности; не выдумывать digest.
Не хранить исходные secrets/ответы пользователей/DB URL в отчётах.

## 6. Тестовый портфель: менять границы, а не число assertions

### Backend

Разделить `api-unit`, `api-integration-db`, protocol mocks и transport/rehearsal tests.
Unit должны исполняться без Docker. DB suite сохраняет PostgreSQL, миграции, роли,
rollback, приватность checker и account/progress semantics. Общий fixture сейчас имеет
module scope; сначала измерить длительность setup и отдельных тестов, не размножать БД
и не объединять suites вслепую. Не снижать production password-hash параметры ради тестов.

### Browser

Выделить core journeys, account-client, account-integration, content/no-JS, a11y и layout.
Сохранить архитектуру fixtures/POM. Account-client с mocks честно пометить как UI evidence.
Добавить минимальный настоящий локальный browser→API→PostgreSQL сценарий login/check/save/read
с изолированной тестовой учётной записью и детерминированным локальным email transport.
Реальные внешние OAuth-провайдеры проверяются при включении/изменении интеграции;
ежедневный тест с production-учётными данными и письмами не предлагается.

Core smoke должен проверить production build, а не только dev Vite. Для API/ops-only
изменения не создавать потребность в полном frontend обходе. Полный список опубликованных
уроков нужен при content/publication/shared lesson изменениях и в периодическом аудите.
Layout suite сделать обнаруживаемым по triggers; убрать ненужное повторение catalog journeys.

### Эксплуатационные сценарии

Каждый `scripts/tests/*` классифицировать как pure contract, disposable integration,
explicit-fixture integration или production rehearsal. Добавить coverage mappings для
account cutover/retention/auth edge/read limit/production env и tooling tests.
Не запускать все контейнерные сценарии только потому, что они лежат рядом с быстрыми shell tests.

Для cutover нужен локальный синтетический сквозной drill той же исполняемой цепочки:
старый bundle → restore → roles/migration из production API image без внешней сети →
account fixture → backup → второй restore → реальный SQL assertion → cleanup.
Использовать тот же код и adapters, не вторую независимую реализацию rehearsal.
Тестировать поддерживаемый host Restic, передачу stdin и отсутствие runtime downloads.
Поддержать инъекцию сбоев в ключевых переходах: отсутствующий assertion output, ошибка
миграции, restore и cleanup не дают attestation. Синтетический drill не создаёт production proof.
Реальная exact-candidate репетиция остаётся отдельным обязательством первого перехода.

### Flaky tests

Фиксировать test ID, first-pass outcome, длительность setup/test/teardown и trace на отказ.
Разрешить максимум один диагностический retry в подходящих suites; итог обозначать
FLAKY_PASS, а не обычный PASS. Для critical auth/data assertions такой результат требует
разбора до релиза. Не перезапускать весь Full для получения зелёного browser run.
Любая временная quarantine имеет владельца, срок и замещающее покрытие; критический
сценарий нельзя просто убрать. Retry policy и таймауты объявить явно.

## 7. Реестр проверок и evidence

Минимальная реализация остаётся stdlib Python внутри `scripts/lib/gate`.
Не вводить сервис, Redis, универсальный workflow DSL или обязательный remote cache.

Описание проверки содержит: ID, команду, input groups, tools/config, dependencies,
environment contract, exclusive resources, triggers, evidence kind, expiry policy,
artifact outputs и типичные способы восстановления после отказа.
Команды CI и local runner используют один источник; platform-specific setup остаётся адаптером.
Версионированная декларация в change ссылается на ID проверок и дополнительных acceptance
условий. Backlog и архитектурные решения остаются читаемыми людьми.
Для v1 это фиксированная типизированная структура Check и allowlist command IDs в Python,
а не исполняемый YAML/Markdown DSL. Нестандартная команда может дать одноразовое evidence,
но не переносимый cache entry до объявления её входов в реестре.

Пример логической структуры результата, не окончательный формат API:

```text
check_id; policy_version; command_digest; inputs_digest; tools_digest
environment_contract_digest; fixture_schema_digest; artifact_digest
started_at; finished_at; outcome; failure_class; reused_from
freshness_deadline; findings; redacted_log_reference
```

Два baseline: production SHA определяет объём выпуска; verified inputs определяют
возможность переиспользования отдельных результатов. Ключ включает фактическое содержимое
и зависимости проверки, в том числе её тесты и fixtures. HEAD/change number сохраняются
как provenance, но не сбрасывают независимые результаты сами по себе.

Не хешировать весь ambient environment. Проверки запускаются в объявленном окружении
с контролируемым PATH/toolchain и явно перечисленными переменными. Релевантные secrets
не писать в отчёт; ротация/смена контекста должна инвалидировать соответствующее наблюдение
через безопасный environment identity. Простое исключение всех env из ключа небезопасно.

Добавления, удаления, переименования, untracked-код и изменение тестовой конфигурации
учитываются. Неизвестный dependency edge расширяет покрытие. Renderer/generated outputs,
lockfiles и policy changes имеют явные широкие edges. Archive-only metadata не отменяет
app test evidence, но по-прежнему входит в проверку публикуемого дерева на secrets.

Уровни переносимости:

1. Static/unit/build: по точным релевантным входам и наличию проверенных outputs.
2. Integration/browser: сначала fresh runtime evidence в пределах попытки; перенос между
   попытками включать только после воспроизводимых fixture/environment contracts и пилота.
3. Production health, доступ, готовность cutover: свежие наблюдения; не брать из source cache.
4. Vulnerabilities: тот же артефакт плюс актуальность внешних данных и отсутствие новых findings.

Все обязательства получают PASS, REUSED, FAIL, ERROR, STALE, FLAKY_PASS, NOT_APPLICABLE или
DEFERRED_AUDIT. NOT_APPLICABLE объясняется политикой; DEFERRED не превращается в PASS.
Повреждённый/неполный report, несовместимая policy version или отсутствующий артефакт —
cache miss. Проверка хранит timestamps неизменными при reuse; свежесть нельзя продлить чтением.
На чужой машине локальному JSON не доверять как trusted CI evidence.

## 8. Исполнение, кеши и SDD

### Исполнение

Быстрый environment preflight → static/focused contracts → domain integration →
production build/core smoke → выбранные quality/security obligations → publication/deploy.
Порядок не обязан быть полностью последовательным. Начать максимум с двух независимых
local jobs; описать resource locks. Lighthouse выполняется без конкурирующей тяжёлой нагрузки.
Security сканирует стабильный snapshot исходников, не меняющиеся browser reports.
Не кешировать произвольные пользовательские shell-команды без объявленных зависимостей.
Параллельные jobs одной попытки читают один immutable source snapshot, включающий выбранные
изменённые и untracked исходники, либо используют checkout с исключительной блокировкой
изменений на время запуска. В общей активно редактируемой рабочей копии параллельный reuse
не включать. Проверка хеша после шага обнаруживает некоторые гонки, но не заменяет snapshot.

### Хранилище

Cache и подтверждённые artifacts — вне рабочей копии, в выделенном локальном каталоге.
Кеши можно удалить без потери корректности; отсутствие приводит к повтору проверки.
Evidence и диагностические отчёты имеют отдельную retention policy. Предлагаемый старт:
diagnostics 14 дней, successful evidence 30 дней, cache/artifacts до 10 GiB с LRU;
live run и используемый candidate защищены от GC. Числа уточняются по фактическому размеру.
Evidence, истёкшее как release proof, может храниться дольше как история измерений.
Текущие потребители ожидают `apps/web/.output`. В v1 после clean сборка повторяется,
если нет отдельного этапа восстановления точно проверенного output в isolated checkout.
Позже этот этап проверяет digest до и после materialization. Наличие внешнего cache entry
само по себе не означает, что performance уже может использовать локальную сборку.

`make clean` очищает временные файлы рабочего дерева. Отдельная команда обслуживания кешей
имеет dry-run и строгий allowlist. Не запускать общую очистку поверх чужого активного runner.
Локальные cookies, письма, account state и DB volumes не становятся общим кешем тестов.

### Work / ship / release

- На старте work читать текущий contract bundle один раз; перечитывать при его изменении,
  расширении scope или новом существенном решении. Не повторять весь набор на каждый checkbox.
- Agent исследует и выбирает scope; runner строит команды и собирает статусы.
- Один target set получает один итоговый план. Отдельные focused runs при отладке учитываются.
- Ship проверяет актуальность evidence и незакрытые acceptance items; не воспроизводит
  work-проверки по одному лишь факту перехода между командами.
- LSP оставить инструментом исследования/диагностики; обязательным блокирующим доказательством
  типов сделать воспроизводимый compiler check. Дополнительный LSP проход нужен при
  symbol-aware refactor или расхождении инструментов. Это явное изменение текущего Required Tooling.
- Интерактивный browser review обязателен для нового UX/визуального поведения; один
  снимок/console check на осмысленный набор, без повторения из-за переименования change.
  Автоматические функциональные assertions и human review решают разные задачи.
- Документацию библиотеки получать при новой/изменившейся API-зависимости или сомнении;
  внутри задачи переиспользовать найденные документы зафиксированной версии.
- Findings в Backlog сохраняются; обычная диагностика не требует нового plan/change.
- Release имеет отдельный ID и набор candidates. Закрытие feature change не уничтожает
  release state. Исправления могут оставаться в одном change до local close, либо в одном
  release-repair change после него. Не открывать отдельный change на каждую попытку команды.
- Auth/schema/API contract changes требуют только действительно нового решения; ранее
  согласованное действие не должно заново получать разрешение на каждом этапе.
- Local ship и production release остаются разными полномочиями.

Все эти правила следует синхронно изменить в AGENTS/CLAUDE, playbooks, STACK, шаблоне и
тонких wrappers при наличии текста, который перестал быть верным. Не создавать ещё одну
ручную копию контрактов в новом документе; данный draft после внедрения становится evidence.

## 9. Release continuation и ранняя эксплуатационная проверка

Перед длинными app suites выявлять недостающие tools, неподдерживаемый Restic,
disk/ports, образ без мигратора, runtime dependency download, неполную конфигурацию и
отсутствующий маршрут получения backup evidence. Preflight читает состояние; не мигрирует live DB.

Состояния release: candidate prepared → local obligations satisfied → published →
CI/images verified → rehearsal satisfied if applicable → dispatched → independently verified.
Хранить failure class: source, environment, flaky measurement, external service,
production compatibility, policy ambiguity. Возобновление предлагает следующий разрешённый
шаг и минимальный набор повторов; никогда автоматически не повторяет push/dispatch/restore.
Каждый candidate имеет immutable SHA и release-input manifest; исправление или archive commit
создаёт следующий candidate, связанный с предыдущим. Перед push/deploy явно сопоставить
финальный SHA и проверенные inputs. Перенос результатов разрешён только по ключам отдельных
проверок; состояние published/dispatched нельзя переносить на новый SHA.

Images workflow должен выдавать небольшой manifest: candidate SHA, workflow run ID,
web/API/Nginx digests и ссылки на scan/SBOM/provenance. Checkpoint проверяет provenance
источника и совпадение digests. Не доверять произвольному локальному manifest.
Использовать уже существующий механизм attestations; новый сервис подписей не нужен.
Trust predicate явно проверяет repository, разрешённый workflow и ref, точный candidate SHA,
успешный run и subject digest каждого артефакта. Artifact из стороннего fork/workflow или
с несовпадающим subject не становится release evidence даже при валидном формате JSON.
Rehearsal получает digest из этого evidence, а не из повторного ручного поиска.
Развёртывание связывается с теми же артефактами; SHA tag не считается immutable сам по себе.

Read-only pre-dispatch проверка host proof предотвращает бесполезный dispatch при его
отсутствии. Deploy-side проверка остаётся окончательным барьером от гонок.
Host preflight выполняет отдельный adapter в рамках разрешённого release-доступа;
сам checkpoint не получает production credentials и не инициирует SSH/rehearsal автоматически.
Результат adapter связывается с candidate и временем, а окончательная проверка остаётся на хосте.
Proof первого cutover должен однозначно связывать схему, candidate, API digest и snapshot;
его актуальность и условия повторного использования определяются отдельно от общего test cache.

## 10. Периодические аудиты, которые действительно будут выполняться

Тесты остаются локальными: pytest/Vitest/Playwright/Lighthouse не переносить в CI без
отдельного пересмотра этого решения. Для них предлагается локальный weekly audit на
контролируемом immutable checkout со своим disposable окружением.
WSL/Chrome рабочего пользователя не считать постоянно доступными.

Локальный планировщик хранит due-state: при недоступной машине аудит остаётся overdue;
после возвращения среды запускается один catch-up, не все пропущенные интервалы.
Не изменять пользовательские вкладки и не запускать production journeys с записями данных.
Если отдельный checkout/env недоступен, показать причину и доступный ручной запуск.

Security без тестовых runners выполняется в существующем GitHub контуре:
daily dependencies + deployed/rollback image digests; weekly SAST/config/full inventory.
Default-branch schedule сам по себе не выбирает production revision — его нужно получить
из проверенного release manifest. Dependabot alerts полезны дополнительно; наличие
weekly update configuration не доказывает, что alerts включены. Настройку требуется проверить.

У каждого аудита: owner, last successful timestamp, next due, target identity, result,
срок реакции и канал уведомления. На старте использовать существующие GitHub notifications
и локальный отчёт; подключение внешнего канала — отдельная настройка, не выполнена этим планом.
Предлагаемый ответственный — архитектор/оператор проекта; локальный measurement host —
текущая WSL-станция с отдельным audit checkout, host test runners и disposable PostgreSQL.
До активации нужно проверить доступность среды и выбрать поддерживаемый локальный scheduler,
провести один успешный audit и искусственный missed-run/notification drill с подтверждённым
получателем. Если машина регулярно недоступна, локальный due-state не заменяет расписание:
сначала обеспечить другой разрешённый measurement host либо сохранить ручной обязательный
аудит в окне обслуживания. Недоступное расписание не является основанием удалить покрытие.

Предлагаемая реакция: security daily просрочен более чем на 48 часов — заметный alert;
перед релизом нужный security evidence старше 24 часов — точечное обновление.
Weekly performance/browser audit старше 14 дней — задача диагностики/обслуживания;
сам возраст не блокирует несвязанный backup-only fix. Релевантный performance-trigger
требует собственного evidence независимо от due-state.
Подтверждённая критическая functional/security регрессия блокирует соответствующие выпуски.

Нельзя удалять обязательную gate-строку до появления работающего нового владельца,
расписания, наблюдения за пропущенным аудитом и процедуры разбора находок.

## 11. Единый change, этапы и критерии приёмки

Рекомендуется один cohesive change с этапами ниже после согласования направления и
урегулирования текущего активного change. Номер сейчас не резервируется. Этот документ
можно передать будущему `/plan` как brief; он не требует немедленной реализации всех улучшений.

| Этап | Работы и основные файлы | Проверяемый результат |
|---|---|---|
| A. Policy | SPEC §7–8, STACK, AGENTS/CLAUDE, work/ship playbooks, CHANGE_TEMPLATE, verification runbook | Определены profiles/triggers/freshness/blocking; local-only tests и release boundary сохранены; legacy semantics явно описана |
| B. Registry/parity | `scripts/lib/gate`, gate CLI/tests, package commands, quality workflow | Local и CI получают один набор static commands; Full включает обязательные focused IDs; change overrides не исчезают; неизвестные пути видимы |
| C. Coverage repairs | test configs/fixtures, ops contracts и selectors | Layout, auth edge, retention, cutover имеют владельцев; production-build smoke и unmocked account round-trip; cutover stdin/offline/version ошибки ловятся локально |
| D. Cadence/security split | security script, scanner policy/config, Lighthouse config, audit workflow/runner | Ops-only plan без Lighthouse; scanners имеют отдельные результаты; daily deployed image scan и weekly local audit имеют due-state |
| E. Evidence/cache | per-check identity/store, cleanup, verification runbook | Archive-only change сохраняет app evidence; relevant source/test/config/env change инвалидирует нужные шаги; security freshness не продлевается reuse |
| F. Release continuation | release_checkpoint, images manifest, ship playbook, predispatch/cutover proof | Known workflow не dispatch повторно; scanned digest совпадает с deploy/rehearsal; missing proof блокирует до dispatch |
| G. Execution/telemetry | runner resource locks, timing/reporting, agent-workflow | Ограниченная параллельность, отдельное время setup/commands/wait/agent/retries; одна ошибка не перезапускает независимые доказательства |
| H. Pilot/closure | Replay классификации + пять реальных изменений, финальный аудит | Нет потерянных обязательств, измерено сокращение повторов, убраны переходные дубли, docs соответствуют выполнению |

Зависимости: A → B; B → C/D; C/D → E; B/E → F; E → G; все → H.
Часть telemetry добавить уже в B, чтобы измерять остальные этапы. C и D можно выполнять
параллельно с раздельным владением файлами; родитель владеет интеграцией и общими gate.

Registry и triggers сначала прогнать в shadow mode: печатать старый и новый план и объяснять
разницу без двойного исполнения тяжёлых проверок. Сначала разрешить reuse static/build,
затем отдельно доказать переносимость runtime suites. До этого оставлять их fresh при выборе.

### Обязательные сценарии проверки новой системы

1. Docs/archive-only: нет API/DB/E2E/Lighthouse; publish history secrets остаётся.
2. SQL whitespace в host maintenance: static + owning contract; нет web/performance.
3. Cutover stdin fix: owning contract + синтетический реальный drill; exact-candidate
   production rehearsal остаётся; несвязанный Lighthouse не выбран.
4. Session/CSRF/account change: DB/API/security + настоящий browser round-trip;
   mocked UI test не заменяет integration; performance только при влиянии на hot path.
5. Shared font/shell change: layout/a11y/core browser + весь Lighthouse route set.
6. Lesson text change: content validators и соответствующий no-JS; большой asset/template
   change дополнительно запускает layout/performance.
7. Migration/roles change: migration from supported baseline + restore/account isolation;
   unit-only PASS недостаточен.
8. Dependency lock change: consumers/build/security повторяются; toolchain-wide impact расширяет scope.
9. Evidence нового HEAD с теми же inputs переиспользуется; изменение теста/fixture не игнорируется.
10. Новая CVE для неизменного deployed digest обнаруживается daily audit; старый PASS не подавляет finding.
11. Недоступная vulnerability DB даёт UNKNOWN; поздний retry не запускает E2E.
12. Пропущенное расписание даёт overdue и один catch-up; периодический main не выдаётся за production.
13. Gitleaks обнаруживает synthetic secret, добавленный и удалённый в промежуточном непубличном commit.
14. Missing/corrupt cache, output или evidence приводит к пересчёту, не ложному PASS.
15. Переименование/удаление/untracked файл учитываются; пустой diff после merge не теряет release obligations.
16. Gate policy/check-command change отменяет подходящие evidence; произвольный scope override не скрывает риск.
17. Missing/mismatched image manifest/proof блокирует deploy; успешный существующий workflow наблюдается без replay.
18. Browser retry виден как FLAKY_PASS; critical failure не скрывается зелёной второй попыткой.
19. Контракт local-only подтверждается: CI не устанавливает и не запускает test/browser runners.
20. Cleanup/GC не удаляет dependencies, secrets, data, чужую работу и pinned artifacts активной попытки.

Эти проверки runner/policy в основном выполняются на fake commands и синтетических inputs.
Для их отладки не требуется многократно выполнять настоящий Full приложения.
Реальные DB/browser/image сценарии нужны только там, где проверяется соответствующая граница.

## 12. Метрики, ограничения и порядок принятия решения

Метрики: end-to-end time до готового change/release; время каждого этапа; число executions
и REUSED; first-pass rate; расходы на setup/recovery; частота flaky; число пропущенных
аудитов; дефекты, пойманные после публикации, и источник обнаружения.
Token/cost учитывать только по реальным данным клиента; время gate не равно цене модели.

Первые критерии успеха лучше сделать причинными, а не обещанием процентов:

- Zero local-PASS/CI-FAIL из-за разных static command lists.
- Zero несвязанных Lighthouse запусков для docs/host-only fixes в пилоте.
- Zero повторов полного gate только из-за archive commit или change ID.
- Все релевантные obligations присутствуют в плане; missed audit виден.
- Cutover-класс ошибок последних трёх исправлений воспроизводится до production rehearsal.
- Исправление одной проверки повторяет её dependency closure, а не весь pipeline.
- Перенос security в расписание не лишает новый image обязательного предрелизного scan.

В известном прогоне один Lighthouse стоил 187 секунд: исключение несвязанного запуска
убирает именно эту работу. Это не прогноз сокращения всех релизов на 39%: часть релизов
по-прежнему затрагивает performance, а добавляемые реальные integration checks тоже стоят времени.
Численные SLO зафиксировать после baseline на сопоставимых пяти изменениях и холодном/тёплом запуске.

Главные риски новой системы: неполная карта зависимостей, stale security data, непосещаемые
scheduled audits, доверие mutable tags/чужому cache, чрезмерно сложный registry.
Ответы: консервативные edges, ограниченный reuse, freshness/watchdog, digest binding,
маленький stdlib runner и доказательные fixtures. Автоматический rollback приложения из-за
неуспеха периодического аудита не предлагается.

До реализации нужно принять именно policy-пакет: новую семантику Full, cadence/24h window,
LSP как вспомогательный инструмент, reuse в ship и локальный механизм weekly audit.
Это предмет будущего архитектурного согласования; подготовка данного плана его не подменяет.

## 13. Внешние источники

Документация проверена во время исследования; Lighthouse CI дополнительно проверен через Context7.

- [Lighthouse: variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md):
  влияние среды и конкуренции за ресурсы, несколько измерений и агрегирование.
- [Lighthouse CI: troubleshooting](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/troubleshooting.md):
  воспроизводимая среда, несколько runs, измеримые факты вместо одного score.
- [Lighthouse CI: configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md):
  numberOfRuns и median aggregation.
- [GitHub: scheduled workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule):
  schedule может задерживаться/пропускаться; default branch не равна deployed revision.
- [GitHub: Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts):
  реакция на новые advisories и изменения dependency graph; ограничения покрытия.
- [Gitleaks](https://github.com/gitleaks/gitleaks#commands): отдельные режимы Git history и directory;
  проверка истории публикуемых commits решает другую задачу, чем scan конечного дерева.
- [Trivy: cache](https://trivy.dev/docs/latest/configuration/cache/): отдельно scanner data и scan cache;
  кеширование не означает отключение обновления vulnerability DB.
- [Semgrep: analysis scope](https://docs.semgrep.dev/semgrep-code/semgrep-pro-engine-intro):
  возможности движка ограничивают то, что можно считать доказанным scan.

Предлагаемые частоты, TTL и migration stages являются выводами для этого проекта,
а не прямыми предписаниями этих источников.
# Status: historical research baseline

The architect-approved implementation contract is now
[Change 146](../changes/146-verification-redesign.md) and SPEC §7–§8.
Its scheduled GitHub audit decision supersedes this research's local-only periodic proposal.
Timings below are historical observations, not current results or promised savings.
