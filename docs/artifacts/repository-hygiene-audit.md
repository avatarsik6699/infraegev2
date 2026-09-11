# Аудит избыточности репозитория infraegev2

Дата: 2026-09-11. Снимок: `main`, `3ded8cdd7b8b7dfc14a070c55348cd1d643ee9b2`.
Статус снимка: исследование и рекомендации; на дату снимка исправления не выполнялись.
Результаты DS-консолидации: [Change 107](../changes/archive/107-frontend-design-system-consolidation.md).
Текущая runtime/infra cleanup: [Change 108](../changes/archive/108-runtime-hygiene.md).
Ниже сохранены исходные находки и диагностический baseline.

**Общая последовательность работ — §11:** приоритеты всех исследований, зависимости,
единые владельцы повторяющихся находок и условия безопасной очистки. Она заменяет ранние
локальные последовательности §6/§8.5/§9.6/§10.5.

**Полный frontend охват — §10:** сплошная source/dependency проверка всех 51 публичных
UI-контрактов, 13 новых находок DS09–DS21, диагностические unit/E2E и браузерные воспроизведения.
План исправлений: [Change 107](../changes/archive/107-frontend-design-system-consolidation.md).
Выводы о немногочисленном мёртвом коде в исходном аудите не означают отсутствия ошибок поведения:
подтверждены no-JS submit в URL, потеря ожидаемого фокуса и перекрытие modal consent-баннером.

**Расширение по уточнению архитектора:** §8 исследует удаление исторических референсов из
рабочего дерева, консолидацию дополнительных документов и свёртку архива changes. Его рекомендации
заменяют исходное консервативное решение §§2/4–6 оставлять все исторические материалы на диске.
Сохранить историю теперь предлагается через проверенный Git snapshot, а не обязательно через
сохранение каждого файла в текущем checkout. Удаление пока не выполнялось.

**Расширение по дизайн-системе:** §9 проверяет связь `/lab/design-system` с production UI,
варианты ссылок, переопределения компонентов и дублирование представления. Подтверждены
системные пробелы владения стилями и приёмки миграций; вывод о небольшом количестве мёртвого
кода ниже не означает отсутствия архитектурного долга. §9 содержит отдельную последовательность
исправлений, которую следует согласовать с документной консолидацией §8.

Основные источники: [SPEC](../SPEC.md), [FRONTEND](../FRONTEND.md), [STACK](../STACK.md),
[Change 94](../changes/archive/94-repository-reconciliation-and-cleanup.md),
[Change 98](../changes/archive/98-repository-hygiene-and-reconciliation.md),
[Change 105](../changes/archive/105-lesson-reading-experience.md),
[Change 106](../changes/archive/106-navigation-progress.md).

## Вывод

Массового накопления удаляемого кода или временных файлов не обнаружено. Штатная очистка на
старте не находила своих артефактов. Главная проблема — повторение и смешение текущих правил,
подробностей реализации и истории в документации. Это уже привело к противоречиям после
последних изменений интерфейса. В коде подтверждены небольшие остатки CSS, а также полное
дублирование стилей двух страниц уроков. Они заслуживают отдельных небольших changes.

Первый шаг — сверка действующих контрактов, затем сокращение документов и исторических файлов
по §8. Основной выигрыш — уменьшение обязательного контекста и числа мест, которые приходится
синхронизировать. Свёртка рабочего дерева также убирает визуальную свалку; размер Git history
при этом не уменьшается.

## 1. Границы, метод и исходное состояние

Исследованы Git-индекс и рабочее дерево, frontend, API, контент, скрипты, конфигурации CI/Docker,
локальные артефакты, актуальная документация и история завершённых changes. Серверы, Docker
storage, соседний sre-kit и внешняя память агентов не входят в инвентаризацию. Значения локальных
секретов и персональных настроек не читались. Внешние ссылки и актуальность сторонних сервисов
не проверялись: выводы относятся к локальному репозиторию.

Использованы `git ls-files`, `git status`, SHA-256 файлов, размеры и поиск потребителей;
Fallow MCP 3.14.0 (`analyze`, `find_dupes`, `check_health`, `project_info`, `trace_export`);
сопоставление с Changes 94, 98, 101, 105 и 106; проверки локальных Markdown-ссылок и
репозиторные команды. Для Fallow передавался корень репозитория и `no_cache=true` в основных
анализах; baseline, автоматические исправления и настройки инструмента не создавались.
Обзор существующего кода не меняет API библиотек и не предлагает обновления зависимостей.

На старте:

- В архиве **105 файлов**, номера 01–106, без 17. Пропуск 17 намеренный и объяснён в
  `docs/KNOWN_GOTCHAS.md:3`; активных changes нет. Количество файлов не равно последнему номеру.
- В индексе **14 пользовательских добавлений**, 17 660 772 байта: `lessons_list.md` и 13 PNG
  в `docs/artifacts/references/`, включая четыре `mini-courses-patterns/exec-*.png`.
  Они включены в размеры ниже, но исключены из рекомендаций удаления.
- Остальной tracked diff пуст; обычных untracked-файлов нет.
- Ignored: зависимости, API `.venv`, `infra/.env`, `.claude/settings.local.json` и
  `.claude/scheduled_tasks.lock`. Локальный lock без сведений о владельце не классифицируется как мусор.
- `make clean-dry-run` ничего не выбрал. Единственный найденный пустой каталог вне защищённых
  деревьев — `apps/web/public/images/route-states/`; действующий allowlist его не включает.
- SHA-256 исходного `git diff --cached --binary`:
  `3dc8c028ecabae414a54491d251e8777c39b3e3eebdbc136c3da878dbcbc60f4`.

### Размеры

Размеры индексируемых файлов — сумма содержимого, не размер Git history и не размер browser bundle.

| Область | Файлов | Байтов | Интерпретация |
|---|---:|---:|---|
| Весь Git-индекс | 1 097 | 52 131 635 | 49,72 MiB, включая пользовательские добавления |
| `docs/artifacts` | 57 | 46 377 707 | 44,23 MiB; около 89% индексируемого объёма |
| `docs/artifacts/references` | 36 | 38 128 148 | Авторские референсы и источники |
| `docs/artifacts/route-states` | 8 | 8 094 210 | Явно сохранённая история отвергнутой raster-реализации |
| `docs/changes/archive` | 105 | 794 470 | 16 122 строки истории; около 0,76 MiB |
| `apps/web` | 563 | 3 572 267 | Включая исходники, тесты и public assets |
| `apps/api` | 34 | 171 285 | Включая lockfile; собственно `app/` — 18 900 байт |
| `content/tasks` | 150 | 183 408 | Активный server-owned контент |
| Все Markdown-файлы | 165 | 1 450 322 | 25 876 строк; без archive — 655 852 байта |

Отдельный `du -sk` показал примерно 512 MiB root `node_modules`, 9,4 MiB web `node_modules`,
78,3 MiB API `.venv` и 78,7 MiB `.git`. Это зависимости и история, не кандидаты очистки;
hardlinks/symlinks и размещение файлов делают эти цифры несопоставимыми с размером скачивания.
Удаление tracked PNG в новом commit также не освободит их старые Git blobs.

## 2. Реестр находок

Статусы: **подтверждено** — есть прямое локальное доказательство; **кандидат** — предложение
с оговорённой проверкой; **сохранить** — найден потребитель или намеренное назначение.
P1 означает риск неверного следующего решения; P2 — полезное упрощение; P3 — косметический остаток.
Даже подтверждённое отсутствие статического потребителя не заменяет проверку после удаления.

| ID | Статус / приоритет | Находка и доказательство | Действие и проверка |
|---|---|---|---|
| D01 | Подтверждено / P1 | `SPEC.md:621–623` требует skeleton на медленных переходах; `STACK.md:420–422` тоже называет delayed skeletons. `FRONTEND.md:702–705`, `apps/web/src/router.tsx` и Change 106 закрепляют сохранение страницы и только progress после 150 ms. | Синхронизировать описание loading с Change 106; убрать двусмысленность также из SPEC §5.2. Проверить поиск `skeleton/pending`, отличая исторические записи от текущих правил. |
| D02 | Подтверждено / P1 | `SPEC.md:500–503` и `PRODUCT.md:60–62` называют CTA главной переходом в мини-курс; далее эти же документы описывают `/ege`. Реальный `foundation-page.tsx:38–40` ведёт в `/ege`. | Оставить одно точное назначение CTA. Проверить согласованность с маршрутом; продукт не менять. |
| D03 | Подтверждено / P1 | `SPEC.md:243–244` помещает WorkedExample/Diagram/Checkpoint в `entities/lesson/components`; реальные экспорты находятся в `shared/components/learning-content/index.ts`. `SPEC.md:351,422` и API `tasks/service.py:1` ссылаются на отсутствующий §11.1; нормализация сейчас описана в §4. | Исправить указатели и ownership. Проверить существование путей и заголовков, сохранив сами контракты контента и checker. |
| D04 | Подтверждено / P1 | `SPEC.md:3` требует полного чтения перед любым change; `playbooks/work.md:40–41` задаёт §3–§4 и релевантные разделы. | Установить единое правило чтения и короткий обязательный набор. Это изменение агентского контракта, не разрешение игнорировать нынешние требования. |
| D05 | Подтверждено / P2 | `PRODUCT` Brand Commitments, SPEC §5.3 и FRONTEND §4/§4.1/§6.1 многократно описывают композицию, материалы, размеры и motion одной UI-системы. | Сжать PRODUCT до устойчивых продуктовых/брендовых принципов; оставить визуальные требования у одного владельца. Сохранность правил проверить по карте переноса из §5 этого отчёта. |
| D06 | Подтверждено / P2 | `docs/artifacts/infraege-ui-migration.md:65,76,87,95–104` всё ещё описывает pending/skeleton и шесть lab scenes. Тест `apps/web/tests/design-system-lab.test.ts:52–67` читает этот документ, но проверяет только присутствие имён и маршрутов. | Определить документ как historical snapshot либо актуальную matrix. Рекомендация: snapshot с датой и прекращением обязательной актуализации; executable catalog остаётся текущим источником. Изменение тестовой связи — отдельный code change. |
| D07 | Подтверждено / P2 | В STACK описана работа ESLint «обоих JavaScript workspaces» (`:191–194,204`), но `pnpm-workspace.yaml` содержит только `apps/web`; API использует Ruff/Pyright. | Уточнить формулировки: root tooling и web package не равны двум lint-workspaces. Проверить команды и редакторские настройки. |
| D08 | Кандидат / P2 | SPEC §1.3 и §9.1 содержат подробную историю релизов; FRONTEND §6.1/§9 — миграционную хронологию; STACK Initial setup — длинные эксплуатационные детали. | Заменить пересказ ссылками на archive/runbooks, сохранив текущее состояние, ограничения и причины ещё действующих решений. |
| C01 | Подтверждено / P3 | `.learning` в `visual-language-specimen.module.css:15,104` не используется. Fallow trace даёт `is_used=false`; `visual-language-learning.tsx:6` использует `patterns.studyLessonPalette`. | Удалить только `.learning` из группы и её ветку focus-селектора. Сохранить `.form`, `.reading`, `.learningGlint`: у form есть реальные потребители. Проверить lab learning/form и клавиатурный фокус. |
| C02 | Подтверждено / P2 | В `infra/nginx/auxiliary/assets/styles.css` классы `.code`, `.art`, `.visual`, `.diagram`, `.route`, `.break-disc` отсутствуют во всех трёх обслуживаемых HTML. Остались после смены raster/старых SVG scenes; документы не используют JS. | Удалить правила этих классов, включая media-варианты и `.diagram text`; не удалять весь stylesheet. Проверить 502/503/504, узкие экраны, forced-colors и Nginx isolation через существующий auxiliary-pages test. |
| C03 | Подтверждено / P3 | `code-block.module.css:44` задаёт `--button-height-compact`, `course-catalog-page.module.css:3` — `--page-frame-background`. Поиск точных имён во всех tracked CSS/TS/TSX/MJS/HTML не обнаруживает чтения; shared button/pageFrame их не потребляют. | Удалить две неработающие декларации; проверить геометрию Copy и каталога. Это не повод вводить поддержку прежних параметров. |
| C04 | Кандидат / P2 | 16 глобальных tokens имеют определения, но не имеют точных статических чтений; список в §3. | Провести отдельное сужение token API с проверкой динамической lab-карты и runtime computed styles. Не удалять по общему числу Fallow. |
| C05 | Подтверждено / P2 | `course-lesson-page.module.css` и `topic-lesson-page.module.css` побайтово одинаковы: 212 строк, 3 780 байт каждый; clone `dup:74dc5695`. | Вынести общую presentation-геометрию в существующую shared styles boundary; домены и registry не объединять. Проверить оба вида уроков, rail, footer, progress, мобильную компоновку и no-JS. |
| A01 | Подтверждено / P3 | Пустой `apps/web/public/images/route-states/` остался после удаления delivery WebP; он не входит в cleanup allowlist. | Удалять только если каталог всё ещё пуст, отдельным разрешённым cleanup change; добавить точечный empty-only target при необходимости. |
| A02 | Кандидат / P3 | `infra/nginx/auxiliary/assets/scenes/.gitkeep` сохраняет старый mountpoint. В текущих Compose и auxiliary-pages test mounts `scenes` больше нет. | После точного поиска mounts удалить только этот placeholder; уточнить gotcha `:523`. `fonts/.gitkeep` и SVG mountpoint сохранить. |
| A03 | Сохранить | 7 PNG и README в `docs/artifacts/route-states/` занимают 8,09 MB; README прямо объявляет historical source archive, F29/I2 заменили raster. | Не поставляются браузеру. Сохранить историю; сделать её статус заметным в будущей навигации. Не выдавать за runtime savings. |
| A04 | Сохранить / кандидат на каталогизацию | У ряда референсов нет индивидуальных filename-ссылок. Для `references/new_pages/` есть ссылка на всю группу в FRONTEND и Change 105. Для `code_block_ref.png`, `error_page.png`, `loading_page.png` индивидуальное назначение не установлено поиском. | Групповое использование исключает простую эвристику «нет имени — удалить». Последние три файла оставить с пометкой «происхождение/актуальность требуют решения владельца». |
| G01 | Сохранить | Три одинаковых delivery SVG по 694 байта обслуживают public URL, header asset и read-only Nginx mountpoint; `.mcp.json` и plugin `.mcp.json` — разные entrypoints. | Не дедуплицировать через symlinks без проверки упаковки и mounts. Это доставка/интеграция, не мёртвый код. |
| G02 | Сохранить | Python `__init__.py`, `fonts/.gitkeep`, действующие bootstrap/migration scripts, disabled local fallback timer имеют назначение. | Не удалять по размеру, возрасту или отсутствию прямого TS-импорта. Связи приведены ниже. |

## 3. Код и зависимости: расшифровка анализа

### Мёртвый код

Fallow сообщил 56 сигналов: 3 unused files, 16 unused exports, 30 unused types,
1 unused dev dependency, 6 unresolved imports. Циклов, unresolved package dependencies,
unlisted dependencies и duplicate exports не найдено. Это результат охваченного графа,
не доказательство отсутствия всех возможных архитектурных проблем.

| Группа | Классификация всех сигналов |
|---|---|
| 3 unused files | `lighthouserc.cjs` читается LHCI; `infra/nginx/auxiliary/assets/{styles,scenes}.css` загружаются HTML через Nginx alias. Все сохранить. |
| 16 unused exports | 15 классов `shared/styles/patterns.module.css` имеют `composes`-потребителей, включая внутреннюю композицию `pageFrame lessonPage`. Сохранить. Оставшийся `.learning` — C01. |
| 30 unused types | Сохраняемые public/generated type exports: перечень ниже. Не являются browser runtime payload. Отсутствие внешнего потребителя barrel не означает ненужность исходного типа. |
| 1 dependency | `@lhci/cli`: `package.json` → `audit:performance` → `scripts/run-lighthouse-audit.sh` → `lhci autorun`. Сохранить вместе с convention-loaded config. |
| 6 unresolved imports | По два `/_infraege/{styles,scenes}.css` в 502/503/504 HTML. `auxiliary-locations.conf:2–3` задаёт alias, Dockerfile копирует assets. Это HTTP URL, не потерянные module imports. |

Перечень 30 type-сигналов: `LessonProgressTypes`; в shared API — `ApiErrorKind`, `components`,
`operations`, `paths`, generated `webhooks` и `$defs`; public namespace types компонентов
`Accordion`, `ActionLink`, `Badge`, `Button`, `Callout`, `CodeBlock`, `ConfirmationDialog`,
`DownloadLink`, `EmptyState`, `ExternalLink`, `Field`, `FragmentLink`, `Image`, `Notation`,
`PageContainer`, `Progress`, `StatusScene`, `SurfaceDecoration`, `Tabs`, `Typography`;
`LessonTheoryTypes` в двух barrel; `PublicHeaderProps`.
Их можно пересматривать только как явное сужение public type API, с typecheck всех потребителей,
а не как автоматическое удаление реализации.

### CSS и tokens

Health просмотрел 62 CSS-файла, 1 511 правил и 4 887 деклараций. Отдельные CSS-эвристики
дали 5 unreferenced keyframes и 9 unreferenced classes. Все пять keyframes имеют явное
`animation:`-использование: `route-draw`, `card-drift`, `route-drift`, `indeterminate`,
`artwork-drift`. Сохранить. Восемь классов из девяти принадлежат уже проверенным CSS `composes`;
девятый `.break-disc` входит в C02. Поиск по HTML дополнительно нашёл остальные классы C02.

16 token-кандидатов C04 из `apps/web/src/app/styles/tokens.css`:

```text
--text-state-title       --text-md
--text-lab-brand         --text-lab-signal
--text-lab-context       --text-lab-micro
--text-lab-display       --text-lab-summary
--text-lab-heading       --text-lab-mobile-display
--color-info-rule        --color-danger-rule
--shadow-annotation      --text-state-status
--text-state-formula     --color-state-shimmer
```

Точные имена проверены с границей token: `--text-state-title-compact` не считается чтением
`--text-state-title`. `--max-content-width` и `--surface-tonal-2` в этот список не входят:
их имена присутствуют в lab-модели, где возможна динамическая демонстрация. Частично похожие
имена и строковая генерация делают простое сравнение `definition`/`var()` недостаточным.

Дополнительные 86 styling signals: 19 предложений заменить raw values (все в автономном
Nginx CSS), 21 duplicate declaration block, 46 complex selectors. Их статус — advisory:
автономные документы намеренно не зависят от app tokens, дубли пересекаются с C05 и общими
размерами, сложные селекторы сами по себе не мертвы. Не предлагать импорт приложения в Nginx
или ослабление focus/forced-colors правил ради зелёного счётчика.

### Дублирование и сложность

Fallow: 31 clone group, 64 экземпляра, 22 файла с клонами из 351 в duplication scan;
1 209 duplicated lines из 40 994, reported percentage **2,95%**. Это метрика данного запуска,
не доля ненужного кода и не ожидаемое уменьшение bundle. Default detection исключает часть
test/fixture/generated файлов; другие анализы охватывают иной набор.

| Группы | Количество | Решение |
|---|---:|---|
| E2E Page Objects, геометрия и assertions | 13 | Низкий приоритет. Только повторение одной семантической проверки переносить в существующие page assertions; независимые journeys сохранять. |
| Font faces | 2 | Сохранить: разные шрифты/subsets, не общий runtime helper. |
| Course/Topic metadata, типы, publication/registry | 3 | Сохранить доменную независимость и build/runtime boundary; похожая форма не доказывает общее владение. |
| CSS двух каталогов | 2 | Кандидат на нейтральные presentation patterns; не объединять разные layout/catalog модели. |
| Страницы CourseLesson/TopicLesson | 3 | C05 — точное совпадение CSS; 2 JSX-клона оставить до доказанной выгоды от общей композиции. |
| Lab surface/widgets examples | 4 | Намеренная демонстрационная повторяемость; не строить универсальный renderer ради сокращения строк. |
| StatusScene CSS / автономный Nginx scenes.css | 4 | Сохранить независимую поставку error documents. При будущем изменении сравнивать обе реализации. |

Health просмотрел 540 файлов/1 635 функций и отметил 24 функции. У всех этих сигналов
`coverage_source=estimated`: фактический coverage не собирался. Только
`home-learning-map-material.ts:create` пересёк cognitive threshold (16 при пороге 15);
остальные flags связаны с оценочным CRAP. Пример ограничения: `task-content-assets.mjs`
помечен как не покрытый, хотя `scripts/tests/task-content-assets.test.mjs` импортирует и проверяет
его; `verify-design-system.mjs` имеет встроенные assert cases и вызывается architecture gate.
Числа не доказывают отсутствие тестов и не обосновывают массовый рефакторинг.
Большие lab/POM функции — кандидаты сопровождения при следующем изменении соответствующей области.

### API, Python, shell и доставка

- AST-инвентаризация Python imports/definitions и поиск вызовов не выявили подтверждённого
  мёртвого runtime-модуля. Однократно названные endpoint-функции зарегистрированы декораторами;
  приватные helpers используются внутри файла. Это проверка модулей и верхнеуровневых функций,
  не исчерпывающий Python call graph или динамическое покрытие всех ветвей.
- Все пять API runtime dependencies имеют кодовый либо launch-потребитель: FastAPI,
  Pydantic, pydantic-settings, structlog, Uvicorn. `httpx` сейчас dev-only, `pytest-asyncio`
  отсутствует — исправления Change 94 не откатились. Ops Python использует стандартную библиотеку.
- Пустые Python package markers сохранить. `app/shared/__init__.py` — намеренный placeholder,
  а не приглашение добавлять абстракции.
- Postgres не хранит контент, но `modules/health/api.py:18–39` проверяет TCP-доступность через
  DATABASE_URL. Удаление Postgres изменит readiness/infra contract и не является очисткой мёртвого кода.
- Query client создаётся в `src/router.tsx` и подключён к SSR. Отсутствие product queries
  документировано в STACK; это принятый инфраструктурный задел, не unused dependency.
  `openapi-fetch` реально используется checker transport.
- У проверенных shell/Python файлов вне тестов найден хотя бы runtime, test или runbook consumer.
  Скан filename references — эвристика; bootstrap и operator entrypoints дополнительно прослежены.
  `ops/opsctl` вызывается Make; `build-traffic-telemetry.py` описан в analytics runbook;
  `prune-umami-data.sh` и SQL пакуются `manage.sh`, используются retention unit;
  `wireguard-server-peer.sh` загружается management wrapper;
  `migrate-root-password-access.sh` остаётся bootstrap/incident entrypoint.
- `fonts/.gitkeep` и Nginx SVG нужны для вложенных read-only mounts. `scenes/.gitkeep`
  отличается: его mount уже удалён. Нельзя удалять все placeholders одним правилом.
- Все public illustrations нашли потребителей; в частности `advanced.webp` и `excel.webp`
  загружаются динамически через `courseArtwork` в `course-catalog-study.tsx:7–17`.
  Шрифты и их OFL-файлы сохранить.
- CI, package scripts и Make изучены как точки входа. `quality.yml` запускает static checks,
  content/API checks, security и audits; unit/E2E suites не запускает, что соответствует STACK.
  Версии не обновлялись, безопасность/свежесть пакетов не оценивалась. GitHub settings и deploy
  не проверялись, поэтому локальные совпадения не объявляются доказательством production state.

## 4. Документация и контекст

### Карта владельцев

| Документ / группа | Сейчас | Рекомендуемая роль |
|---|---|---|
| AGENTS + CLAUDE/wrappers | Правила работы и адаптеры | Оставить короткие обязательные правила; подробная процедура у playbook |
| SPEC: 941 строка, 80 033 символа | Стратегия, модель, UI детали, ops, история | Продуктовые/системные решения, доменные ограничения, текущий roadmap |
| FRONTEND: 721 строка, 64 756 символов | Архитектура, визуальные правила, page recipes, история | Общий frontend contract + чёткие ссылки на тематические binding sections |
| STACK: 481 строка, 34 367 символов | Команды/gates плюс длинный ops рассказ | Точные технологии, команды, инструменты, gates; эксплуатация через runbooks |
| KNOWN_GOTCHAS: 531 строка, 36 898 символов | Плоский список frontend, ops, WSL, истории | Короткий индекс симптомов, область применимости, подробности по необходимости |
| PRODUCT: 139 строк, 9 470 символов | Product summary плюс 6 025 символов Brand Commitments | Небольшой design brief, без отдельного покадрового описания UI |
| Guides: 10 файлов, 884 строки | Самостоятельный учебный маршрут observability | Сохранить последовательность обучения; не превращать в обязательный agent context |
| Runbooks: 7 файлов, 785 строк | Действия оператора | Каноническое место процедур и примеров конкретного окружения |
| Archive: 105 файлов | История решений и acceptance | Сохранить; читать по конкретному вопросу, а не весь архив подряд |
| Artifacts | Референсы, исследование, исторические matrices | Явно различать active source / historical evidence / snapshot / unresolved provenance |

Строгое чтение AGENTS + SPEC + STACK + GOTCHAS + work + FRONTEND составляет
**3 106 строк, 239 456 Unicode-символов, 281 319 UTF-8 байт**, ещё до активного change и исходников.
Это оценка объёма обязательных документов для frontend change, не измерение токенов модели.
После Change 98 FRONTEND вырос с 519 строк/43 369 байт до 721/65 284, SPEC — с
861/106 075 до 941/120 988. Рост подтвердился Git diff; он не означает, что весь новый текст лишний.

Особенно важно: FRONTEND §9 назван Migration record, но **содержит действующий Auxiliary
document states contract**. Нельзя перенести или удалить весь §9 как историю: действующие
правила retry, metadata, no-JS и error isolation необходимо сохранить в текущем контракте.

### Проверка ссылок и статуса

Проверены 120 явных локальных Markdown destinations вне fenced code: 95 в неархивных файлах,
25 в archive. Отсутствующих файлов среди них не найдено. Это не проверка всех backtick-путей,
URL, anchors или смысловой актуальности ссылок. Ручная проверка обнаружила отсутствующий §11.1
(D03) и устаревший component ownership. Упоминание `apps/ops` в SPEC само объяснено как логический
контур, а не существующий каталог; не записано в broken paths.

`workflow-init.md` уже помечен source-package reference only и запрещает запуск в integrated
project. Его 23 KB не являются активной командой установки здесь. Сохранить как reference,
убрать из обычного маршрута чтения; удаление почти ничего не улучшит в текущем коде.
Одинаковые абзацы `.agents`/`.claude` wrappers намеренны: оба адаптера указывают на один playbook.
Их дальнейшая генерация или объединение не приоритетны.

Gotcha про asyncpg/SQLAlchemy явно pre-emptive, а не утверждение об установленной ORM.
Его стоит убрать из обязательного frontend чтения, сохранив в DB-тематике.
Исторические snapshots observability уже имеют дату и оговорку о live state; переписывать
учебный guide в очередной deploy-state mirror не нужно.

## 5. Как сократить документы без потери решений

Предлагаются последовательные, проверяемые изменения. Ни одно правило пока не перенесено.

### Распределение материала

| Источник | Что оставить | Что заменить / куда перенести |
|---|---|---|
| SPEC §1.3, §9.1 | Текущий baseline: 2 TopicLesson, 28 CourseLesson, реальные незавершённые outcomes | Пошаговую release/authoring историю заменить ссылками на соответствующие archive changes |
| SPEC §3–§4 | Владение данными, недопустимые связи, server-owned answers, семантика checker | Исправить D03; не переписывать schema в новую параллельную model-документацию |
| SPEC §5.3 | Идентичность infraege, публичные продуктовые ограничения, авторитет референсов | Детальную композицию/размеры/motion держать только в FRONTEND и его тематических разделах |
| PRODUCT Brand Commitments | Знак, аудитория, читаемость, truthful state, отсутствие выдуманного social proof | 88-unit icons, длительности фаз, 58:42, 8px fades заменить ссылкой на frontend recipes |
| FRONTEND §4, §4.1, §6.1 | Общие токены, доступность, архитектура, правила текста и motion | Свести повторы и сгруппировать page-specific recipes внутри FRONTEND; новый файл не вводить (§8) |
| FRONTEND §9 | Действующие auxiliary states правила | Историческую migration table оставить короткой ссылкой на archive; текущие правила переместить в semantic section |
| STACK Initial setup / ops paragraphs | Local dev prerequisites, ownership, команды и обязательные gates | Подробные reconcile/install/restore процедуры разместить только в существующих runbooks, со ссылками из STACK |
| KNOWN_GOTCHAS | Короткий индекс: симптом → категория → ссылка; permission handoff остаётся видимым | Frontend/WSL и operations детали — тематические разделы, читаемые по области задачи; дубли объединить |
| UI migration artifact | Дата, scope Change 101/105, historical status | Текущее перечисление contracts доверить `catalog-contracts.ts` и architecture gate; устранить тестовую обязанность дописывать snapshot |

После уточнения архитектора новый page-recipes документ не рекомендуется: это увеличило бы
число контрактных файлов. Отдельно измерять удалённые дубли и уменьшение обязательного чтения;
один огромный файл из механически склеенных документов тоже не является сокращением.

### Примеры итоговых формулировок

**PRODUCT Brand Commitments**, вместо подробной хореографии главной:

> infraege использует знак из трёх камней, тёплую бумагу, ink и сдержанный оранжевый акцент.
> Знак и исходные референсы перечислены в FRONTEND. Alegreya отвечает за
> заголовки и wordmark, Golos Text — за чтение и интерфейс, JetBrains Mono — за код и данные.
> Главная ведёт к `/ege`; карта обучения декоративна, её «72%» не является прогрессом ученика.
> Статическая композиция остаётся полной без JavaScript и анимации. Действующие page recipes,
> параметры и визуальные ограничения принадлежат FRONTEND, а не этому product brief.

**SPEC loading contract**, после сверки с Change 106:

> При клиентском переходе текущая страница остаётся видимой до готовности следующей.
> После 150 ms ожидания показывается верхний progress bar; отдельный глобальный skeleton и
> минимальная задержка отображения страницы не используются. Initial SSR, error/retry и
> reduced-motion поведение определены в актуальном frontend contract.

**SPEC исторический baseline**, вместо пересказа промежуточных публикаций:

> В исходном дереве опубликованы две TopicLesson и самостоятельный Python-курс из 28 уроков.
> CourseLesson и Topic независимы. История содержательного одобрения и публикации находится в
> соответствующих archive changes. Текущий production SHA определяется live readiness и release
> evidence; наличие урока в локальном registry не доказывает совпадение развёрнутого состояния.

Примеры — предложения для будущего change; они не заменяют действующие документы автоматически.
Для каждого сокращаемого требования нужна строка «старое место → новое место / точный дубль /
устарело по конкретному change». Изменение намерения нельзя маскировать под редактуру.

### Ожидаемый эффект и навигация

Ориентир для первой редакторской итерации: сократить обязательный frontend набор с 239 тыс.
символов примерно до **140–170 тыс.**, то есть на 29–42%. Это целевой диапазон, не обещание
достигнутой экономии. PRODUCT Brand Commitments можно уменьшить с 6 025 до примерно
900–1 400 символов. Фактические значения измерять после rule-preservation review; процент
не является основанием удалять уникальное правило.

Обновлённая рекомендация — один архивный checkpoint вместо нового README рядом со 105
документами (§8.3). Он же указывает, где найти выведенные из checkout historical artifacts.
Отдельный индекс каждой PNG и ещё один файл состояния проекта не нужны.

Новый порядок чтения следует закрепить одновременно в SPEC и playbooks: базовые запреты и
scope → нужный контракт → тематические recipes/gotchas → точечная история по вопросу.
Обязательность FRONTEND перед frontend-кодом сохраняется; уменьшать нужно сам общий контракт,
а не негласно пропускать его.

## 6. Последовательность следующих changes

Историческая локальная очередь; заменена общей последовательностью §11.

Номера назначать при `/plan` по актуальному архиву; исследование не резервирует номер и не
создаёт implementation Backlog. Все пользовательские staged assets остаются вне этих задач.

| Пакет | Зависимость | Конкретный результат | Проверка |
|---|---|---|---|
| 1. Reconcile current docs | Нет | D01–D03, D07; явно различить snapshot и current matrix D06; уникальные действующие требования сохранены | Markdown destinations, точные section/path refs, сопоставление с кодом/Change 106; format |
| 2. Сжатие рабочего контекста | 1 | D04–D05/D08, ownership table и rule-preservation map, краткий архивный указатель; без изменения намерений | До/после chars/lines; проверка трёх сценариев чтения: frontend edit, API edit, release; gates/security/human approval не потеряны |
| 3. Узкая очистка CSS и пустых targets | Независим от 2 | C01–C03, отдельно проверенные C04, A01/A02; не удалять stylesheet/assets wholesale | Affected Critical Gate, LSP для TS при его изменении; lab/code block/catalog browser pass; auxiliary-pages test; cleanup contract |
| 4. Общие стили уроков | После 3 либо независимо при неизменном baseline | C05: одна presentation boundary, отдельные Course/Topic registries и props | Web lint/typecheck, соответствующие lesson tests и fixtures/POM browser journeys, desktop/narrow/no-JS/progress |

Не включать в эти пакеты «заодно»: пересмотр dependencies, универсальный lesson renderer,
новую theme system, переписывание обучения, новые analytics events или release. Архивная уборка
теперь исследована и выделена в отдельную последовательность §8.5, а не добавлена в CSS change.
Неустранённые вопросы происхождения трёх reference PNG остаются в A04 до решения владельца.

## 7. Проверки исследования и ограничения

| Проверка | Результат |
|---|---|
| Fallow dead code / duplication / health / CSS | Выполнены; классификация выше, без auto-fix |
| SHA-256 duplicates, tracked/untracked/ignored inventory | Выполнены; generated delivery copies отличены от C05 |
| Локальные Markdown destinations | 120 проверено, missing targets 0; semantic drift зарегистрирован отдельно |
| `pnpm validate:content` | PASS: 2 TopicLesson, 150 tasks, 1 Course, 28 CourseLesson |
| `pnpm format:check` | PASS: Prettier; Ruff — 34 files already formatted |
| `bash scripts/tests/clean-local-artifacts.test.sh` | PASS: apply/check/dry-run и защита окружений в изолированном fixture |
| `make clean-dry-run` → `make clean` → `make clean-check` | PASS: после анализа удалены только созданные аудитом `.fallow` и `apps/api/.ruff_cache` |
| Финальная сверка Git | PASS: исходный staged diff SHA-256 совпал; tracked unstaged diff пуст; единственный новый untracked-файл — этот отчёт |
| Typecheck, LSP, browser, полный unit/E2E, API regeneration | Не запускались: изменён только отчёт; соответствующие проверки указаны для будущих исправлений |
| Full/Release Gate, production, sibling repos | Вне утверждённых границ |

Граница доказательства: static scan не видит все динамические consumers; AST/поиск Python и
shell не эквивалентен runtime coverage; Markdown parser не доказывает истинность содержания.
Показательный пример — Fallow `project_info` вернул 11 entry entries, а полный analyze — 82:
это разные поверхности discovery, не 71 доказанно потерянная точка входа. Для результатов
использован полный analyze и прямые потребители.

Исторические численные показатели Fallow из Changes 94/98 не сравниваются как строгая регрессия:
изменились дерево, CSS/HTML охват и tool version. Повторно проверены конкретные сигналы
LHCI/composes/public types; новые остатки Nginx и loading-документации относятся к последующим
переделкам. Удаление кода только ради восстановления прежнего счётчика необоснованно.

Исследование завершено. В реестре 19 записей с доказательствами и ограничениями. Код, архив,
пользовательский индекс и ветка `main` сохранены; commit, push и deploy не выполнялись.
Пустой каталог A01 и все остальные кандидаты оставлены для отдельных implementation changes.

## 8. Расширенное исследование: меньше файлов, один исторический checkpoint

### 8.1. Какие artifacts можно убрать из checkout

Ранее «сохранить историческое доказательство» слишком консервативно трактовалось как
«сохранить файл в рабочем дереве навсегда». Это разные требования. Файл, воспроизводимо доступный
в сохранённом commit, можно убрать из нового дерева после переноса действующих требований и
обновления ссылок. Ни название `reference`, ни отсутствие runtime import сами по себе не
решают вопрос; нужны назначение и проверяемый источник восстановления.

Проверено побайтовое чтение через `git show` всех **148 файлов**: 43 artifacts, уже находящихся
в HEAD, и 105 архивных changes. Содержимое совпало с текущими файлами. Snapshot:
`3ded8cdd7b8b7dfc14a070c55348cd1d643ee9b2`. Эта проверка **не покрывает 14 staged additions**:
их содержимого нет в данном commit. Ссылка на HEAD не является их резервной копией.

Полная классификация 57 индексируемых artifacts (сам этот untracked-отчёт считается отдельно):

| Группа | Файлов / байтов | Решение |
|---|---:|---|
| Текущий master и основные референсы: `infraege-mark.svg`, `base.jpg`, `main-page.png`; шесть `references/new_pages/exec-*.png` | 9 / 7 938 299 | Оставить: generator/tests читают master, FRONTEND называет остальные текущими visual authorities. `new_pages` — активная группа, а не прежние отвергнутые raster scenes. |
| Исторические материалы, перечисленные ниже | 29 / 19 596 349 | Кандидаты вывода из checkout после переноса оставшихся решений и перевода ссылок на snapshot. Это 18,69 MiB, не экономия browser bundle или `.git`. |
| `infraege-ui-migration.md` | 1 / 16 613 | Вывести после отвязки теста `design-system-lab.test.ts:53`; текущая проверка каталога должна опираться на executable catalog, не на наличие слов в старом отчёте. |
| `learning-science-principles.md` | 1 / 26 920 | Сначала перенести уникальные действующие педагогические правила и их источники в SPEC §2.3; затем убрать отдельный документ. Не сжимать авторские уроки под видом этого переноса. |
| `code_block_ref.png`, `error_page.png`, `loading_page.png` | 3 / 1 138 754 | Сохранить до установления назначения. Они уже есть в Git, но отсутствие ссылки ещё не доказывает, что архитектор больше не использует их как визуальный источник. |
| `lessons_list.md` и 13 staged PNG | 14 / 17 660 772 | Отдельный незавершённый пользовательский набор. Не удалять и не считать сохранённым в snapshot; окончательная disposition после фиксации/сверки source → используемый derivative. |

Точный набор 29 кандидатов, относительно `docs/artifacts/`:

```text
alchimia-public-migration-matrix.md
course-overview-image-prompts.md
course-overview-ui-audit.md
lessons/16-rekursiya.md
lessons/16-rekursiya.quality.md
lessons/5-build-and-analyze-algos-for-executors.md
lessons/5-build-and-analyze-algos-for-executors.quality.md
product-readiness-audit-2026-08-20.md
python-course-application-gap-audit-2026-08-29.md
python-course-curriculum-audit-2026-08-29.md
references/design_system.png
references/exec-51732868-6ea7-4bbe-a873-6c5603023eed.png
references/exec-5b753307-dbb0-4586-9e36-80f4fec62c00.png
references/exec-615bde2c-6f44-4595-86d0-7ac3d4fc1359.png
references/exec-80200717-77ac-48ee-a2ba-634ac917a479.png
references/icons.png
references/lesson_structure.png
references/logo.svg
references/patterns_lines.png
references/recraft-vectorize-477c595e.svg
references/visual_schema.png
route-states/404.png
route-states/502.png
route-states/503.png
route-states/504.png
route-states/README.md
route-states/error.png
route-states/loading.png
route-states/pattern.png
```

Обоснование по назначению: старые ALCHIMIA/migration/design references имеют исторические
consumers; `patterns_lines.png` прямо исключён из runtime в FRONTEND; `route-states/README`
объявляет raster scenes заменёнными. Markdown-уроки в `artifacts/lessons` — прежние источники и
quality evidence, а текущая теория принадлежит TSX. Аудиты и image prompts — результаты
завершённых исследований. Для последних групп обязательно извлечь ещё открытые выводы и причины
решений: не считать весь аудит «исправленным» только потому, что завершился change.

Ссылки из SPEC на readiness/application-gap/learning-science и ссылка FRONTEND на atlas должны
быть исправлены в том же пакете. Исторические ссылки внутри старого Git snapshot сохраняются
там как были; для их просмотра нужен контекст того дерева. Простое перемещение 29 файлов в
`artifacts/old/` не достигает цели: они останутся в поиске и checkout.

### 8.2. Дополнительные документы: что объединить и что вывести

Эти документы не все возникли случайно: blueprint был явной задачей Change 10,
observability guide — Change 52, брендовый документ появился в Change 60.
Вопрос теперь в необходимости их самостоятельного сопровождения, а не в отсутствии прежнего
разрешения на создание. Само наличие файла вне базового SDD набора не делает его конфликтующим.

| Документ / группа | Проверенные потребители и уникальная роль | Рекомендация |
|---|---|---|
| `BRAND_ASSET_REQUIREMENTS.md`, 61 строка | Текущие ссылки из SPEC/FRONTEND; код не читает документ. Есть уникальные размеры favicon/ICO/social, alpha/background и acceptance. | Объединить с разделом brand delivery в FRONTEND. Команду генерации/проверки оставить в STACK, не копировать реализацию генератора. Удалить отдельный файл после переноса этих уникальных условий. |
| `INFRASTRUCTURE_BLUEPRINT.md`, 446 строк | Только текущая ссылка из STACK; вводная прямо адресует документ **другим приложениям**. Change 10 подтверждает именно этот scope. | Вывести из рабочего дерева в Git history. Не вливать все 446 строк в STACK и не превращать универсальные советы в новый infraege contract. При будущей работе над отдельным шаблоном извлечь оттуда; сейчас новый репозиторий не создавать. |
| `playbooks/plan.md`, `work.md`, `ship.md` | Канонические процедуры, на которые ссылаются AGENTS и runtime wrappers | Сохранить три файла. Их склейка в AGENTS увеличит обязательный контекст и заставит все workflows читать чужую процедуру. |
| `playbooks/workflow-init.md`, 392 строки | В integrated project явно запрещён к исполнению, `project-files/` отсутствует; текущие упоминания только в STACK/README playbooks | Вывести в Git history; удалить bootstrap-пункт из местной навигации. Не считать этот файл дополнительным активным workflow. |
| `playbooks/README.md`, 18 строк | Навигация, уже существующая в AGENTS/CLAUDE | Удалить после проверки ссылок: отдельная навигационная копия для трёх файлов не нужна. |
| `runbooks/production.md` + `production-onboarding.md` + `dns-tls.md` + `incident-response.md` | Bootstrap и onboarding повторяют DNS/SSH/env; incident содержит уникальный порядок восстановления и ограничения | Свести в существующий `production.md`: последовательный bootstrap, routine deploy, DNS/TLS, incident triage. Сохранить точные inputs, host verification и ownership; исторические cutover повествования отправить в checkpoint. |
| `runbooks/backup-restore.md` | Уникальная процедура backup/restore и принятие результата; ссылка из incident response | Сохранить отдельно: восстановление должно оставаться доступным по короткому пути, не теряться внутри общего рассказа. Убрать только повторяющуюся историю cutover. |
| `runbooks/analytics.md` + `SRE_KIT_MANAGEMENT.md` | Publisher/fallback и отдельный management lifecycle; оба связаны с operating integration | Свести в существующий `analytics.md` с разделами target / management / workstation fallback. Чётко разделить владельцев и protected inputs трёх сред. Не объединять их команды в общий безадресный lifecycle. |
| `guides/observability/` — README и главы 01–09, 884 строки | Связный учебный курс; большинство ссылок внутренние, нет runtime consumer; README отличает обучение от контракта | Для компактного репозитория вывести все 10 файлов в Git history с одной записью в checkpoint. Не склеивать учебные объяснения в STACK. Сохранить возможность извлечь весь каталог с прежней последовательностью для чтения. |
| `PRODUCT.md` | Краткий контекст для design work, сейчас повторяет FRONTEND | Сначала оставить коротким brief, как предложено в §5. Не создавать рядом новый product summary; удаление потребовало бы отдельной проверки внешних design-skill consumers. |

В рассмотренной группе из 24 дополнительных файлов (`2 + 5 + 7 + 10`) остаются **6**:
три canonical playbooks и три runbooks. Это минус 18 файлов без добавления новых каталогов
`legacy/`, `reference/` или очередного `CONTEXT.md`. Условия объединения важнее числа:
не потерять единственный recovery recipe, проверку владения или human gate.

Blueprint не является уже доказанным конфликтом: он явно объявлен переносимым материалом,
а его требования для нового проекта могут отличаться от принятых исключений infraege.
Проблема — смешение такой справки с точкой входа в текущий STACK. Brand requirements тоже
нельзя удалить без переноса конкретных delivery-требований, которых нет целиком в общей
формулировке «три камня».

### 8.3. Squash документации changes

| Вариант | Эффект | Оценка |
|---|---|---|
| Склеить 105 Markdown-файлов в один | Меньше файлов, те же 16 122 строки и противоречивые промежуточные состояния | Не рекомендуется: контекст не сокращается |
| Добавить summary, оставив все 105 в checkout | Улучшает навигацию, но не убирает накопление файлов | Первоначальный консервативный вариант; не полностью отвечает уточнённой цели |
| Один компактный historical checkpoint + оригиналы в фиксированном Git commit | Убирает старые документы из обычного поиска, сохраняет точную историю по запросу | **Рекомендуется** |
| Squash/rebase всей Git history | Меняет commit identities и исторические release/evidence references | Не нужен для поставленной задачи и не предлагается |

Целевая форма — **`docs/changes/archive/COMPACTED.md`** вместо 105 завершённых документов.
Это одна замена многих файлов, не ещё один актуальный SPEC. В начале checkpoint указать:

- `covered_through: 106`, фактически 105 changes, `17` intentionally absent;
- полный `source_commit` приведённого snapshot и каталоги оригиналов;
- дату свёртки, смысл статуса «archived» и отсутствие утверждения о текущем deployed SHA;
- тематические итоги: learning/content, frontend/brand, infrastructure, workflow;
- ещё действующие причины решений, принятые риски и неразрешённые вопросы со ссылкой на
  точный change/item; актуальные правила остаются в SPEC/FRONTEND/STACK;
- список выведенных групп artifacts/справочных документов и способ их извлечения.

Ориентир — 200–300 строк содержательного summary вместо 16 122 строк. Это предполагаемое
уменьшение архивного текста на 98–99%, **не** обещание такого же уменьшения контекста каждой
сессии: весь архив сейчас не должен загружаться при каждой задаче. Итоговый размер допускает
увеличение ради реально важных решений; нельзя достигать квоты удалением неудобных фактов.

Что summary обязано различать, установлено текущим чтением:

- Change 13 имеет unchecked I10, Change 21 — I3, Change 92 — F1–F4. Архивный статус не означает
  исполнение всех пунктов. Зафиксировать их прежний статус и последующую судьбу только при
  доказательстве из последующих changes; не превращать автоматически в новый Backlog.
- Change 106 записывает наблюдённый telemetry `422` при injected `503` как неразобранный вопрос.
  Он не должен исчезнуть при сжатии. В summary отметить «наблюдалось; причина не подтверждена»,
  а не объявлять regression исправленной или воспроизводимой сейчас.
- Retired key-only access, ALCHIMIA, raster scenes и pending skeleton — исторические решения,
  не варианты, которые можно снова выбрать по старому документу.
- Accepted risks и human content approvals нельзя заменить общей фразой «всё прошло gates».
  Deployment evidence всегда привязано к конкретному SHA и дате.

### 8.4. Что необходимо изменить в SDD перед свёрткой

Сейчас AGENTS объявляет archive источником shipped history, а `plan.md:143–144` вычисляет номер
по максимальному имени файла. `ship.md:71–74` запрещает переписывать исторический текст.
Поэтому свёртка — **явное изменение документного контракта**, а не обычный `make clean`.
Текущий запрос разрешает исследование; эти правила и файлы этим аудитом не изменены.

В будущем change следует закрепить:

1. `COMPACTED.md` содержит только завершённый диапазон; source commit хранит оригиналы.
   Новые changes по-прежнему создаются отдельно и попадают в archive через `/ship`.
2. `/plan` получает номер как максимум `covered_through`, номеров активных changes и новых
   архивных files, плюс один. Нечисловой checkpoint не является активным change. Отсутствующие
   или повреждённые metadata при компактном архиве — ошибка, не повод начать с 01.
3. Исключение из immutable archive разрешает только отдельную документную компактизацию
   с source snapshot и проверкой сохранности; обычный `/ship` исторические итоги не переписывает.
4. Обновляются AGENTS, canonical plan/work/ship, ссылки из STACK/README/SPEC/FRONTEND/GOTCHAS
   и действительно затронутые wrappers. Runtime consumers конкретных `changes/archive/*.md`
   в исследованном коде не найдены; человеческие/document ссылки есть и требуют миграции.
5. Извлечение оригиналов не зависит от moving branch/tag. Сначала проверить доступность
   source commit; в shallow clone он может отсутствовать. Ошибку нельзя подменять выдуманным
   summary; нужно получить нужную историю либо сообщить об ограничении.

Проверенный пример чтения (ничего не восстанавливает поверх рабочего дерева):

```bash
git show 3ded8cdd7b8b7dfc14a070c55348cd1d643ee9b2:docs/changes/archive/106-navigation-progress.md
git ls-tree -r --name-only 3ded8cdd7b8b7dfc14a070c55348cd1d643ee9b2 -- docs/artifacts
```

Не нужны force-push, удаление Git objects или глобальное переписывание commit history.
Если scope до реализации вырастет, covered range/source SHA надо определить заново.
Этот untracked-отчёт и staged references сначала должны получить собственное сохранённое
состояние, прежде чем их можно будет выводить тем же способом.

### 8.5. Обновлённая последовательность и приёмка

Очередность ниже относится к документному исследованию до полного DS-аудита.
Для выполнения использовать §11; условия сохранности и списки файлов здесь остаются действующими.

1. **Документная консолидация:** устранить D01–D08; объединить brand и runbooks по §8.2;
   перенести уникальные learning principles, убрать повторяющиеся описания. Новые contract
   файлы не добавлять. Для каждого исходного раздела указать destination либо исторический источник.
2. **Подготовить checkpoint и SDD:** извлечь решения/риски, проверить полноту source snapshot,
   изменить нумерацию и правила archive. Не удалять originals, пока проверка summary не завершена.
3. **Вывести исторические файлы:** точный список 29 artifacts, затем matrix/learning document
   после устранения зависимостей; 105 changes заменить checkpoint; справочные документы
   и объединённые runbooks удалить согласно §8.2. Все обновления ссылок выполняются в том же пакете.
4. **Продолжить узкие code changes C01–C05**, независимо от решения о хранении исторических PNG.

Проверки для будущей реализации:

- Все покрытые snapshot файлы доступны через `git show` и имеют ожидаемые bytes/hash;
  staged-only материалы не включены в список удаления по этому snapshot.
- Нумерация: compacted 106 без новых files → 107; новый archive 110 → 111; active 112 → 113;
  пропуск 17 сохраняется; invalid metadata останавливает выбор номера.
- `/work` находит активный change; `/ship` архивирует только его; обычное закрытие не меняет checkpoint.
- Проверяются Markdown links **и plain/backtick paths**, а не только destinations;
  ссылки на исторические источники явно отделены от путей текущего дерева.
- Branding generator/test по-прежнему читает сохранённый master; каталог lab не зависит от
  удалённой matrix. Соответствующие code изменения проходят свой Critical Gate/LSP.
- Отдельный review сохраняет incident/restore procedures, privacy restrictions, принятые риски,
  content approvals и unresolved outcomes. Green lint не доказывает сохранность этих смыслов.
- Отчёт до/после различает количество files, объём текущего checkout, объём обязательного
  контекста и размер Git history. Сжатие Git history не заявляется.

При полном выполнении предложенной формы artifacts уменьшаются с 57 до 26 индексируемых файлов
(29 historical + matrix + learning document выведены), при этом 14 staged файлов и три неясных
референса всё ещё сохраняются. Archive: 105 → 1; рассмотренные дополнительные docs: 24 → 6.
Это **153 файла меньше суммарно** по этим группам, до учёта нового implementation change и самого
аудита. Число описывает потенциальную структуру, не выполненную очистку.

После использования этот отчёт тоже должен стать historical evidence того implementation
change, который реализует решения, а не четвёртым постоянно синхронизируемым контрактом.
При следующей компактизации его можно выводить по тем же правилам.

Проверки дополнения: чтение 148 оригиналов из snapshot с побайтовым сравнением — PASS;
точный список 29 кандидатов, его сумма байтов и локальные ссылки отчёта — PASS;
`pnpm format:check` — PASS. Исходный staged diff SHA-256 совпал, tracked unstaged diff пуст.
Статический анализ кода не повторялся: дополнение касается хранения документов и workflow.

## 9. Дизайн-система и её потребители в apps/web

### 9.1. Вывод и границы проверки

Это первоначальная выборочная проверка. Её охват расширен сплошной матрицей в §10;
результаты ранних проверок ниже относятся к соответствующему этапу исследования.

**Гипотеза архитектора частично подтверждается, причина системная.** Общая основа уже есть:
одна активная тема, semantic tokens, локальные UI-компоненты, общая SVG-декорация, независимые
доменные слои и лаборатория, импортирующая настоящие компоненты. Но наличие общего компонента
ещё не гарантирует общего оформления: потребители меняют его CSS, часть визуальных ролей
вообще отсутствует в публичном API, а проверки не требуют завершённого перехода потребителей.

На примере внешних ссылок не обнаружены два конкурирующих компонента old/new: это один
`ExternalLink` с двумя живыми вариантами. Называть каждый `default` устаревшим было бы неверно:
текущий FRONTEND разрешает optional `drawn`, и лаборатория показывает оба. Не хватает правила,
когда выбирать каждый вариант, и проверяемой границы завершения визуальной миграции.

Исследованы исходники foundation, shared components/styles, consumers в entities/features/widgets/
pages, соответствующие lint/test contracts, Fallow graph и TypeScript LSP references.
В дополнение к §1 поднят **только локальный** Docker dev через `make dev` и просмотрены
`/lab/design-system`, `/courses/python/pervaya-programma`, `/courses`, `/ege`.
Production и внешний контент ссылок не проверялись. Это аудит DS-архитектуры, не полный
аудит WCAG, производительности или каждого состояния всех 51 публичных UI-контрактов.

### 9.2. Реестр подтверждённых находок

Приоритеты здесь архитектурные: P1 — устранить до следующей широкой UI-миграции,
P2 — включить в последовательную консолидацию. Они не означают найденную WCAG-ошибку.
Итого: **3 P1 и 5 P2**, P0 не обнаружены в проверенном объёме.

| ID | Приоритет | Подтверждение и влияние | Предлагаемое исправление |
| --- | --- | --- | --- |
| DS01 | P1 | **Нет контракта выбора вариантов ссылок.** `shared/components/external-link/external-link.tsx:8` сохраняет default; `entities/course/content/python-first-program.lesson.tsx:240` и `:246` его используют. Footer, privacy и `/ege` явно выбирают drawn. В `pages/design-system-lab/components-catalog.tsx:156` и `:191` представлены оба без правила выбора. Одно и то же семейство визуально расходится, при этом все consumers формально используют shared. | Описать смысловые роли: ссылка внутри текста, отдельное навигационное действие, возврат, download. Для каждой выбрать текущий вариант, показать длинный текст и переносы в lab, затем мигрировать весь список consumers. Не заменять inline на inline-flex без проверки переноса. |
| DS02 | P1 | **Каталоги переоформляют Badge через внутренний DOM.** `pages/course-catalog/course-catalog-page.module.css:300` и `pages/topic-catalog/topic-catalog-page.module.css:294` обращаются к `[data-badge]`, меняя min-height, padding, border, background, font и shadow. Базовый `shared/components/badge/badge.module.css:1` продолжает показывать другое оформление в lab. Общий API не выражает metadata-over-image роль. | Перенести принятую повторяющуюся роль в Badge variant; отделить tone от presentation. Странице оставить размещение группы. Свести одинаковые части, сохранив допустимые различия обычного статуса и подписи на иллюстрации. |
| DS03 | P1 | **Gate проверяет наличие имени, а не согласованность реализации.** `scripts/verify-design-system.mjs:14` проверяет несколько token prefixes, далее — named exports против `catalog-contracts.ts`. `tests/design-system-lab.test.ts:53` считает Markdown-вхождения имён/маршрутов evidence миграции. `e2e/pages/design-system-lab.page.ts:819` проверяет карточки с именами; другие методы действительно проверяют отдельные состояния, но нет общей проверки соответствия consumers вариантам. | Сохранить полезные boundary/state проверки, заменить Markdown-evidence связью с исполняемыми specimens и consumers. Проверять поддержанные variants и закрытие deprecated usages. Паритет visual roles проверять на lab и реальных маршрутах. |
| DS04 | P2 | **Typography часто служит оболочкой над локальной типографикой.** `typography.types.ts` даёт Title только `order`, без визуальной роли. Каталоги задают `.cardTitle[data-order]` собственные font family/size/weight/line-height; course catalog использует локальный `--text-catalog-card-title: 2rem`. `:where` в общем Title намеренно позволяет такое переопределение. Это пробел модели, а не просто ошибочная специфичность. | Отделить семантический heading level от ограниченного набора визуальных ролей. Сначала извлечь повторяющиеся реальные роли заголовков, описаний и metadata; уникальная композиция homepage не обязана выглядеть как карточка. Не усиливать specificity и не фиксировать все h2 одним размером. |
| DS05 | P2 | **Дублирование lesson shell.** CSS course-lesson и topic-lesson совпадает побайтово: по 212 строк, 3780 байт; подтверждает C05. Header/result также имеют сходную разметку. Исправление колонки/ритма приходится повторять в двух местах. | Общая нейтральная презентация shell/slots или общие presentation classes в существующей системе. Course/Topic сохраняют модели, загрузку, публикацию, прогресс и маршруты. Не создавать универсальную доменную Lesson-сущность ради устранения CSS-копии. |
| DS06 | P2 | **Часть link presentation живёт вне общей семьи.** `features/analytics/analytics-consent-notice.tsx:26` использует Router Link с локальной `.privacyLink` (`analytics.module.css:51`). `BackLink` отдельно владеет стрелкой/стилями; topic lesson использует его, course lesson — drawn ActionLink. ESLint разрешает Router Link напрямую, поэтому декларативная обязательность shared policy не закрывает этот путь. | Дать внутренней inline-ссылке явный shared contract; consent перевести на него. BackLink сохраняет history/fallback semantics, но использует принятую общую презентацию. Логотип-ссылка header — осмысленная отдельная композиция, не повод безусловно запретить все Router Link. |
| DS07 | P2 | **Композиция дочерних controls опирается на CSS-детали.** `shared/components/code-block/code-block.module.css:42` меняет Button background/color/border, а `:52` отдельно переписывает hover/active. Там же неработающий `--button-height-compact`. У Button есть hierarchy/density, но нет роли действия на code surface. Для разных link wrappers дублируются transition/focus правила. | Добавить минимально необходимую роль/контекст control и общий presentation recipe; конкретные имена выбрать при проектировании API. Кодовый блок должен выбирать вариант, а не исправлять состояния дочерней кнопки. Сохранить читаемость code surface и keyboard focus. |
| DS08 | P2 | **Лаборатория отражает API, но не задаёт завершённый процесс его развития.** FRONTEND §4 называет authority принятые homepage/catalogs; §6.1 требует живые примеры. Нет lifecycle для экспериментального варианта, срока совместимости, списка миграции и удаления старого оформления. Page-private `--text-*` прямо разрешены, но критерия их перевода в foundation нет. | Зафиксировать в FRONTEND: accepted DS contracts реализуются в shared, lab показывает их, pages выбирают варианты. В Backlog изменения DS включать полный список затронутых consumers и итоговую судьбу прежних вариантов. Эксперименты явно изолировать и не показывать как действующий стандарт. |

DS01/DS06 не требуют слияния external/internal/download/history navigation в один
полиморфный компонент: поведение различается. Нужна общая визуальная реализация там, где
совпадает роль, с сохранением раздельных безопасных семантических границ.

### 9.3. Карта потребителей и границы переиспользования

Пути в этой таблице относятся к `apps/web/src/`.

| Семейство | Текущие владельцы и потребители | Целевая граница |
| --- | --- | --- |
| Ссылки | ExternalLink: 5 source consumers — first-program lesson, lab catalog, privacy, topic catalog, public footer; шестой import consumer у Fallow — тест. LSP подтверждает эти references. ActionLink также используется в header, catalogs, course overview, lesson results и route states. | Отдельные behavior wrappers + общая декорация/роли; default и поддерживаемые варианты одинаково определены в API, lab и миграционном Backlog. |
| Возврат | Topic header → BackLink с history/fallback; Course header → ActionLink с известным course route; lab показывает оба. | Одинаковая визуальная роль не должна менять адрес назначения, modified-click или history behavior. «К курсу» и «Назад» не взаимозаменяемые операции. |
| Badge / metadata | Shared Badge + локальные `[data-badge]` overrides в двух catalogs; прогресс и номера рядом частично повторяют те же декларации. | Shared presentation variant для повторяющейся роли; доменный текст и вычисление прогресса остаются выше. Не превращать номер задания в интерактивный badge. |
| Typography | Shared Text имеет body/lead/caption/interface; Title привязывает defaults к order. Каталоги, overview, homepage и lesson context меняют presentation локально. | Семантические роли из наблюдаемых повторений; HTML order независим от оформления. Placement/measure могут принадлежать композиции. |
| Lesson layout | `patterns.module.css` уже содержит studyLessonFrame/studyLessonPalette/lessonSection; два page CSS дописывают одинаковый shell. | Общая presentation-структура или CSS-рецепт с явными slots. Доменные controllers и содержимое по-прежнему независимы. |
| Surfaces / decorations | SurfaceMaterial, SurfaceGlint, SvgDrawing, SvgPattern и `patterns.module.css` уже переиспользуются в production и lab. | Сохранить механизм. Индивидуальная иллюстрация, траектория и placement принадлежат странице; повторяющаяся геометрия/контроль состояния — shared. |
| Buttons / inputs / feedback | Локальные primitives уже централизуют behavior и states; CodeBlock дооформляет Button снаружи. | Существующие primitives развивать необходимыми семантическими вариантами, не менять библиотеку и не плодить параллельную линейку. |

**Не классифицировать как нарушения автоматически:** разные размеры заголовков в разных ролях;
inline links внутри прозы; page-specific artwork; нативные table/list/figure; отдельные Course и
Topic модели; component-scoped CSS variables для согласованных surface recipes. Наличие токена
или `composes` само по себе тоже не доказывает, что роль правильно выбрана.

### 9.4. Проверка в браузере и ограничения автоматизации

Chrome DevTools MCP, локальный dev, исходники того же snapshot. Desktop фактически
`innerWidth=1442`, `innerHeight=757`; mobile emulation 390×844 дала `innerHeight=845`.
Снимки desktop lab и mobile lesson просмотрены непосредственно в сессии. В репозиторий
дополнительные screenshots не добавлялись: воспроизводимые selectors и измерения ниже.

| Сценарий | Наблюдение |
| --- | --- |
| Lab → Components → Actions, desktop | Одновременно показаны drawn external, default external, text/quiet/secondary/drawn ActionLink и отдельный BackLink. У drawn ActionLink в строке 14px, у adjacent ExternalLink 16px вследствие наследования. Это видимый сигнал отсутствия общей scale-роли, не самостоятельное доказательство, что размеры обязаны совпасть во всех контекстах. |
| `/courses/python/pervaya-programma`, desktop и mobile | `python.org` и Programiz: `data-hierarchy=default`, inline, underline, 16px. В том же документе footer Telegram: drawn, без native underline, с SVG underline, 14px. `_blank` + `noopener noreferrer` и предупреждение о новой вкладке сохранены. На 390px Programiz занимает две строки без горизонтального overflow. |
| Lab neutral badge против `/courses` и `/ege`, mobile | Lab: 12px / weight 500 / min-height 22px / padding 1.6px 8px / line-height 14.4px. Courses: 13px / 400 / min-height 0 / padding 4px 8px / line-height 18.2px. Ege: 13px / 400 / min-height 0 / padding 4px 8px / line-height normal. Это реальные computed styles одного Badge после consumer CSS. |
| Responsive sample | На 390px document scrollWidth=clientWidth=390 для lab, урока и обоих каталогов; desktop lab/lesson также без document overflow. Это не проверка всех элементов, zoom, клавиатуры и комбинаций состояния. |
| Console sample | На desktop lab/lesson и mobile courses при отдельном чтении console не было error/warn. Это наблюдение локальной выборки, не полный runtime gate. |

Fallow из §3 уже обнаружил CSS-дубли; дополнительно `trace_file` проверил реальную достижимость
ExternalLink и потребителей. Impeccable static detector по `apps/web/src` вернул `[]` (exit 0).
Этот результат **не отменяет DS01–DS08**: generic detector не знает принятую роль badge или
правило миграции variant. TypeScript LSP использован для references, исходники TS не менялись.

Численный общий UX/WCAG/performance score не выставляется: замеров для него недостаточно.
Подтверждённый результат — частично централизованная DS с пробелами adoption и style ownership.
Сохраняются полезные foundation, accessibility behavior wrappers, theme boundaries и реальные
browser assertions; заменять их одним screenshot или только проверкой export names нельзя.

### 9.5. Целевая архитектура и выбор подхода

Запрос архитектора принимается как направление: клиент строится из единой системы,
`/lab/design-system` служит её визуальным исполняемым представлением. Конкретные API/variants
ниже — предложение для следующего change, а не уже принятые изменения действующего FRONTEND.

```text
theme values → semantic tokens → shared primitives + presentation recipes
                                      ↓                    ↓
                         entities → features → widgets → pages
                                      ↑                    ↑
                         lab демонстрирует те же публичные контракты
```

Стрелка от lab не означает импорт из `pages/design-system-lab`: production и lab независимо
импортируют владельца из допустимого нижнего слоя. Состояние прогресса, consent, loader/SSR и
publication остаются у текущих доменных владельцев; DS определяет presentation и interaction
contract. Lab fixtures используют изолированное состояние и не изменяют данные пользователя.

Рассмотрены два жизнеспособных пути:

1. **Усилить существующую систему**: извлечь семантические variants и повторяющиеся recipes,
   мигрировать consumers семействами, усилить текущие gates. Меньший diff и сохранение FSD,
   SSR и тестовых границ; требует отдельно пройти существующие CSS overrides.
2. **Выделить отдельный UI package и заново строить каталог**: технически возможно, полезно при
   нескольких независимых приложениях-потребителях. Сейчас добавит сборку, версии и ещё одну
   границу синхронизации; сам по себе не предотвратит consumer overrides.

**Рекомендован первый путь.** Доказательств необходимости нового UI kit/framework/package нет.
Новая система документов, универсальный глобальный store или перенос бизнес-логики в shared
для этой задачи не нужны.

Правило владения: primitive владеет внутренней геометрией, типографикой своей роли, состояниями,
focus и decoration; composition владеет расположением, шириной области и расстоянием между
дочерними блоками. Если потребителю нужен новый повторяющийся внешний вид — сначала variant
владеющего компонента и specimen, затем применение. `className` остаётся для композиции, но
не становится неограниченным обходом design contract через descendant/data-attribute selectors.
Component-local CSS variables разрешены только как явный API, а не случайный способ вмешательства.

### 9.6. Последовательность реализации и критерии завершения

Следующий implementation change нужно оформить через `/plan` и `/work`; этот раздел остаётся
аудитом. Работу следует разделить на проверяемые этапы, не выполнять массовую замену JSX/CSS.

1. **Договориться о ролях и владельцах.** Обновить существующий FRONTEND: статус lab,
   primitive/composition границы, правила вариантов и завершения migration. В активном Backlog
   держать таблицу consumer → роль → старый путь → новый путь → проверка. Отдельный постоянный
   `DESIGN_SYSTEM.md`, `page-recipes.md` или новый Markdown migration mirror не добавлять.
2. **Пилот — семейство ссылок.** Решить inline/action presentation, scale и default; сохранить
   external/new-tab, history/fallback, download semantics. Показать варианты и состояния в lab,
   перенести first-program, privacy, footer, consent, catalogs и lesson navigation. Если прежний
   вариант сохраняется, дать ему назначение; если выводится — удалить после последнего consumer.
3. **Badge и Typography.** Ввести только подтверждённые повторяющиеся роли; перенести catalog
   overrides и metadata, разделить heading semantics/presentation. Lab показывает тот же Badge,
   что размещён над иллюстрацией, и тот же обычный neutral/status Badge.
4. **Shared composition.** Устранить копию lesson shell, затем согласовать code-surface Button
   и общие link-state recipes. Не связывать CourseLesson с Topic и не менять authored copy,
   маршруты, вычисление прогресса или публикацию при переносе представления.
5. **Закрыть обходы и старые варианты.** Расширить имеющиеся lint/policy checks для известных
   primitive overrides и неразрешённых direct primitives; разрешённые исключения узкие и объяснимые.
   Убрать тестовую зависимость от `infraege-ui-migration.md`, перенести полезные проверки в
   runtime/source contracts, затем выполнить соответствующую очистку §8.

Приёмка каждого семейства:

- У каждого поддерживаемого варианта есть семантическое назначение, живой specimen, список
  production consumers либо явное обоснование отсутствия потребителя. Карточка с именем не
  считается примером состояния. Лаборатория не содержит недекларированный production standard.
- Повторяемое оформление меняется в одном владельце. В consumers не остаются переопределения
  проверяемых primitive internals; разрешённые placement/measure правила не блокируются.
- Фокус, hover/active, disabled/loading где применимы, длинная русская подпись, inline wrapping,
  keyboard, reduced motion и narrow viewport проверены на нужных экземплярах. Не требовать
  44px от каждой ссылки в тексте и не выводить WCAG-ошибку только из такого измерения.
- Browser comparison сравнивает одинаковые роли lab/production, включая прямой вход и client
  navigation: поздняя загрузка CSS страницы не должна менять primitive на соседнем маршруте.
  Проверить SSR/no-JS и отсутствие потери контента; не принимать green lint за визуальную приёмку.
- Backlog явно закрывает каждого consumer и судьбу прежнего API. Compatibility alias, если
  необходим, ограничен этим change и удаляется после миграции. Новые exports не равны её завершению.
- Один affected-area Critical Gate на полный набор задач `/work`, инструменты из STACK,
  frontend browser evidence и ручная приёмка архитектором. Full Gate только по принятому workflow.

Сначала извлечь текущие визуальные решения и migration obligations из истории, затем сворачивать
документы/референсы по §8. Общая чистка мёртвого кода может уменьшить шум, но сама не устраняет
параллельное владение стилями. Порядок DS-работы: контракт → shared реализация + lab → все
затронутые consumers → проверка → удаление старого пути.

Проверки дополнения §9: `pnpm --filter web lint` — PASS, включая design-system policy
для 51 public UI contracts и layer boundaries. Подтверждённые расхождения при этом остаются,
что демонстрирует границу текущего gate. `pnpm format:check` и локальные Markdown-ссылки — PASS.
Изменён только этот отчёт; implementation, новые тесты, merge, push и deployment не выполнялись.

## 10. Сплошной аудит публичного UI и план консолидации

### 10.1. Что изменилось относительно §9

§9 был выборочным исследованием причин расхождений. Это дополнение проверяет **все 51
публичный UI-контракт**, перечисленный текущей design-system policy: реализации, props/types,
private children и связанные стили, прямых потребителей и прохождение через barrel exports.
Для каждого выполнен `trace_export`; все 51 достижимы. Это не означает, что все они используются
в продукте: у Diagram и LearningVisualFrame потребители только в лабораториях.

Дополнительно проверены общие tokens/theme/patterns, app-owned page background, route states и
navigation progress, CSS страниц, authored lesson consumers и действующие unit/E2E assertions.
Поиск обходов и статические анализаторы охватывали дерево исходников; ручное чтение consumers
фокусировалось на вызовах компонентов, props, DOM и CSS, а не на повторном аудите всей бизнес-логики.

Объём UI-деревьев: shared/components — 55 TSX / 33 CSS, entities — 31 / 1,
features — 16 / 4, widgets — 7 / 3, pages — 76 / 10, app — 9 / 8.
Это **194 TSX и 59 CSS**, а не 194 независимых переиспользуемых компонента.
Namespace members Typography, CustomIcon, SvgDrawing и SvgPattern рассмотрены внутри своих
контрактов; число 51 не является числом всех их публичных вариантов.

Матрица ниже фиксирует завершённое source/dependency review. Числа — уникальные файлы,
непосредственно импортирующие export: **src / tests**. Они включают lab и shared intermediates,
не являются числом экземпляров в DOM и не доказывают покрытие тестами.
«Не подтверждено» означает отсутствие отдельной находки в проведённой проверке, а не гарантию
безошибочности. Браузерное покрытие и его ограничения приведены отдельно в §10.4.

### 10.2. Матрица всех 51 контрактов

| Публичный контракт / владелец | Src / tests | Проверенная область и результат |
|---|---:|---|
| [Typography](../../apps/web/src/shared/components/typography/typography.ts) | 95 / 1 | Title/Text/Prose: semantics, role, CSS consumers; DS04, DS13 |
| [PageContainer](../../apps/web/src/shared/components/page-container/page-container.tsx) | 6 / 1 | Width/gutter, page frame composition; отдельного нарушения не подтверждено |
| [Notation](../../apps/web/src/shared/components/notation/notation.tsx) | 21 / 1 | Code/variable/data, prose wrapping; DS13 |
| [Button](../../apps/web/src/shared/components/button/button.tsx) | 11 / 1 | Variants, disabled/checking, code surface; DS07, DS14, DS15 |
| [ActionLink](../../apps/web/src/shared/components/action-link/action-link.tsx) | 17 / 0 | Action/drawn roles, route semantics; DS01, DS21 |
| [BackLink](../../apps/web/src/shared/components/back-link/back-link.tsx) | 2 / 0 | History/fallback; сохранить отдельную семантику при DS06 |
| [ExternalLink](../../apps/web/src/shared/components/external-link/external-link.tsx) | 5 / 1 | Inline/drawn, safe new-tab; DS01, DS21 |
| [FragmentLink](../../apps/web/src/shared/components/fragment-link/fragment-link.tsx) | 4 / 0 | Anchor semantics, decoration/state recipes; DS01 |
| [ConfirmationDialog](../../apps/web/src/shared/components/confirmation-dialog/confirmation-dialog.tsx) | 4 / 0 | Focus/portal, reset consumers; DS16 |
| [DownloadLink](../../apps/web/src/shared/components/download-link/download-link.tsx) | 2 / 0 | Download semantics, standalone presentation; DS21 |
| [Input](../../apps/web/src/shared/components/input/input.tsx) | 2 / 0 | Native attrs, dimensions, invalid state; DS15, DS20 |
| [Field](../../apps/web/src/shared/components/field/field.tsx) | 3 / 1 | Label/error association, value retention; DS15 |
| [Accordion](../../apps/web/src/shared/components/accordion/accordion.tsx) | 3 / 1 | Single/multiple/open/disabled API; DS20 |
| [ResponsiveDisclosure](../../apps/web/src/shared/components/responsive-disclosure/responsive-disclosure.tsx) | 1 / 0 | Native details, responsive presentation; DS20 |
| [TabsRoot](../../apps/web/src/shared/components/tabs/tabs-root.tsx) | 3 / 1 | State/composition; DS20 |
| [TabsList](../../apps/web/src/shared/components/tabs/tabs-list.tsx) | 3 / 1 | Accessible grouping; DS20 |
| [TabsTab](../../apps/web/src/shared/components/tabs/tabs-tab.tsx) | 3 / 1 | Keyboard/disabled API; DS20 |
| [TabsPanel](../../apps/web/src/shared/components/tabs/tabs-panel.tsx) | 3 / 1 | Panel ownership; DS20 |
| [StatusScene](../../apps/web/src/shared/components/status-scene/status-scene.tsx) | 3 / 0 | 404/503/error, copies/recovery; DS19 |
| [Badge](../../apps/web/src/shared/components/badge/badge.tsx) | 5 / 1 | Tone and catalog overlays; DS02 |
| [Progress](../../apps/web/src/shared/components/progress/progress.tsx) | 3 / 1 | Determinate/indeterminate and progress consumers; отдельного нарушения не подтверждено |
| [Callout](../../apps/web/src/shared/components/callout/callout.tsx) | 5 / 0 | Tone and inherited learning palette; DS09 |
| [EmptyState](../../apps/web/src/shared/components/empty-state/empty-state.tsx) | 3 / 1 | Typography and actions composition; отдельного нарушения не подтверждено |
| [SurfaceMaterial](../../apps/web/src/shared/components/surface-decoration/surface-material.tsx) | 4 / 0 | Surface tokens and consumer placement; не путать декоративный recipe с primitive override |
| [SurfaceGlint](../../apps/web/src/shared/components/surface-decoration/surface-glint.tsx) | 7 / 0 | Once/loop/activity, reduced motion; отдельного нарушения не подтверждено |
| [CodeBlock](../../apps/web/src/shared/components/code-block/code-block.tsx) | 34 / 1 | Copy, long/short, line numbers, code surface; DS07 |
| [Image](../../apps/web/src/shared/components/image/image.tsx) | 9 / 1 | Alt/decorative, loading/error/fallback, fit; DS12 |
| [CustomIcon](../../apps/web/src/shared/components/custom-icon/custom-icon.ts) | 5 / 1 | Root и пять glyph members, labels; DS18, DS20 |
| [DrawnLinkUnderline](../../apps/web/src/shared/components/link-decoration/drawn-link-underline.tsx) | 3 / 0 | Общий SVG, разные consumer states; DS01 |
| [SvgDrawing](../../apps/web/src/shared/components/svg-drawing/svg-drawing.ts) | 12 / 1 | Arrow/FadeGradient/Line/TaperedLine, resource IDs; DS20 |
| [SvgPattern](../../apps/web/src/shared/components/svg-pattern/svg-pattern.ts) | 8 / 1 | Field/Grid/Preset/Strokes, resource IDs; DS20 |
| [Checkpoint](../../apps/web/src/shared/components/learning-content/checkpoint/checkpoint.tsx) | 5 / 0 | Think/reveal и место в уроке; DS09, DS10 |
| [Diagram](../../apps/web/src/shared/components/learning-content/diagram/diagram.tsx) | 1 / 0 | Figure/annotated/float API; единственный consumer — lab; DS11 |
| [LearningVisualFrame](../../apps/web/src/shared/components/learning-content/learning-visual-frame/learning-visual-frame.tsx) | 2 / 1 | Purpose/caption/description; оба consumers — labs; DS11 |
| [LessonIntro](../../apps/web/src/shared/components/learning-content/lesson-intro/lesson-intro.tsx) | 4 / 0 | Default/study и metadata; DS09 |
| [LessonSectionHeading](../../apps/web/src/shared/components/learning-content/lesson-section-heading.tsx) | 8 / 1 | Numbered/default/lesson presentation; DS04, DS09 |
| [LessonTheory](../../apps/web/src/shared/components/learning-content/lesson-theory/lesson-theory.tsx) | 3 / 0 | Concept composition и obsolete checkpoint branch; DS10 |
| [Mistake](../../apps/web/src/shared/components/learning-content/mistake/mistake.tsx) | 32 / 0 | Learning recipe и palette inheritance; DS09 |
| [Procedure](../../apps/web/src/shared/components/learning-content/procedure/procedure.tsx) | 32 / 0 | Learning recipe, authored consumers; DS09 |
| [WorkedExample](../../apps/web/src/shared/components/learning-content/worked-example/worked-example.tsx) | 33 / 0 | Prompt/solution и различие двух lab specimens; DS09 |
| [AnalyticsConsentNotice](../../apps/web/src/features/analytics/analytics-consent-notice.tsx) | 2 / 0 | Fixed banner, links/actions; DS06, DS16 |
| [AnalyticsConsentPrompt](../../apps/web/src/features/analytics/analytics-consent-prompt.tsx) | 1 / 0 | Consent ownership и portal/dialog coexistence; DS16 |
| [AnalyticsConsentControl](../../apps/web/src/features/analytics/analytics-consent-control.tsx) | 1 / 0 | Consent reset/action semantics; DS06, DS16 |
| [LessonProgressProvider](../../apps/web/src/features/lesson-progress/lesson-progress-provider.tsx) | 1 / 1 | Storage adapter/domain boundary, SSR state; сохранить независимость Course/Topic |
| [LessonPractice](../../apps/web/src/features/lesson-practice/lesson-practice.tsx) | 2 / 1 | Task rendering, submit, readonly/solved states; DS11, DS14, DS15, DS20 |
| [LessonProgress](../../apps/web/src/features/lesson-progress/lesson-progress.tsx) | 4 / 1 | Zero/partial/mastered/complete, reset; отдельного нарушения не подтверждено |
| [ReadingPositionIndicator](../../apps/web/src/features/reading-position/reading-position-indicator.tsx) | 3 / 0 | Reading-only semantics, layer/motion; DS16, DS20 |
| [PublicHeader](../../apps/web/src/widgets/public-header/public-header.tsx) | 11 / 1 | Desktop/mobile, expanded default, native details; DS17 |
| [PublicFooter](../../apps/web/src/widgets/public-footer/public-footer.tsx) | 11 / 1 | Links, study grid placement; DS01, DS17 |
| [LessonOutline](../../apps/web/src/widgets/lesson-outline/lesson-outline.tsx) | 4 / 1 | Default/study, mobile disclosure, active section; DS09, DS20 |
| [LessonPracticeFlow](../../apps/web/src/widgets/lesson-practice-flow/lesson-practice-flow.tsx) | 4 / 0 | Practice/progress composition; DS14, DS15, DS16 |

### 10.3. Дополнительные подтверждённые находки

Идентификаторы продолжают DS01–DS08 из §9. P1 — поведение пользователя, противоречие
действующему контракту или препятствие достоверной приёмке; P2 — консолидация и предотвращение
дальнейшего расхождения. Приоритет не является оценкой уязвимости.

**DS09 · P1 — у lab и продукта разные неявные learning defaults.**
`shared/styles/patterns.module.css:169` задаёт `studyLessonPalette`; реальные страницы уроков
наследуют её, а самостоятельные learning specimens во вкладке «Компоненты» — не все.
Один WorkedExample во вкладке «Система» имеет прозрачный фон и padding 0, во вкладке
«Компоненты» — фон `oklch(0.962012 0.00400175 none)` и padding 8px 16px.
`components-catalog.tsx:466,481,628,640` и `widgets-catalog.tsx:87` показывают default
LessonIntro/Heading/Practice/Outline, тогда как реальные lessons используют study.
Наследование tokens допустимо, но scope, default и поддерживаемые роли должны быть явными.
Согласовать один текущий lesson recipe; дополнительные варианты сохранять только с назначением
и полноценным specimen. Не объявлять все исторические defaults актуальным продуктовым стандартом.

**DS10 · P1 — LessonTheory сохраняет отменённый concept-level checkpoint.**
[Тип](../../apps/web/src/shared/components/learning-content/lesson-theory/lesson-theory.types.ts)
содержит `Concept.checkpoint`, а
[рендерер](../../apps/web/src/shared/components/learning-content/lesson-theory/lesson-theory-concept.tsx)
его выводит. SPEC §5.2 допускает один lesson-level checkpoint в «Итогах» после result.
Domain ConceptBlock уже не содержит этого поля; остаток находится в shared API и ветке рендера.
Удалить obsolete concept API после проверки consumers. LessonDefinition.checkpoint и сам
переиспользуемый Checkpoint остаются действующими и не являются мёртвым кодом.

**DS11 · P2 — media-контракты лаборатории не дошли до production composition.**
Diagram импортирует только `components-catalog.tsx`; LearningVisualFrame — design-system lab
и lesson lab. В
[PracticeTaskContent](../../apps/web/src/features/lesson-practice/components/practice-task-content.tsx)
изображение и diagram отдельно собираются через figure/Image/figcaption и описание с указателями.
Shared Diagram предлагает ещё annotated/float варианты, но не принимает intrinsic width/height
как task images. Это разные DTO и разные возможности, поэтому механическая замена опасна.
Выделить подтверждённую общую presentation-композицию или сократить lab-only API; task adapter
оставить в feature. Для сохранённого annotated варианта проверить узкий контейнер:
его multi-column geometry и viewport breakpoint пока не доказаны браузерным тестом.
Последнее — риск для приёмки, а не воспроизведённый overflow.

**DS12 · P2 — consumers Image управляют его внутренним img.**
[Image CSS](../../apps/web/src/shared/components/image/image.module.css) назначает
`height:auto`; fit задаёт object-fit, но сам по себе не определяет заполнение фиксированного
контейнера. Course catalog, topic catalog, course overview и visual-language lab задают
внутреннему `img` height/width через descendant selectors, иногда повышая specificity
через `[data-status]`. Эти overrides поддерживают нужный вид, но распределяют один контракт
по страницам. Добавить явное владение media geometry у Image/общей композиции, перенести consumers.
Placement, mask/filter декоративной иллюстрации могут оставаться у страницы.
Существующие alt/decorative, cache, fallback и SSR guarantees сохранить.

**DS13 · P2 — учебная лаборатория обходит Notation.**
В `pages/lesson-design-lab` найдено семь raw code в учебной прозе и четыре raw var;
`lesson-design-lab.module.css:88` создаёт собственное оформление inlineCode/article var.
В components catalog есть и учебный prompt с raw code. При этом 30 authored lesson файлов
используют общий Notation, raw code/var в них не обнаружены. Перенести учебные обозначения
лаборатории на тот же контракт. Raw code внутри CodeBlock и технические API labels каталога
не являются автоматически нарушениями: запрет по одному имени HTML-тега был бы ложным.

**DS14 · P1 — практика без JavaScript отправляет ответ в URL.**
В SSR форма [PracticeTaskAnswer](../../apps/web/src/features/lesson-practice/components/practice-task-answer.tsx)
оставляет input и «Проверить» активными, а предотвращение submit существует только в JS.
При отключённом JS на `/courses/python/pervaya-programma` форма имеет method=get;
ввод синтетического `AUDIT_SYNTHETIC_7` и submit открыли
`/courses/python/pervaya-programma?answer=AUDIT_SYNTHETIC_7` вместо проверки.
Это также помещает введённое значение в адрес/историю и потенциально логи запроса.
До enhancement представить статическое содержимое задач и понятное состояние недоступной
проверки; исключить native submit с ответом. Текущий no-JS E2E проверяет наличие форм и текста
прогресса, но не проверяет действие кнопки.

**DS15 · P1 — невалидный submit не переводит фокус к ошибке.**
На lab LessonPractice после `WRONG_AUDIT` и «Проверить» input получает
`aria-invalid=true` и связанный error description, значение сохраняется, но фокус остаётся
на BUTTON. FRONTEND §7 требует focus first invalid field при submit.
В [модели практики](../../apps/web/src/features/lesson-practice/model/use-lesson-practice-model.ts)
нет соответствующего перехода. Дать Field/Input подходящий контракт фокуса и применить его
в feature. Разделять ошибку ответа и транспортную ошибку; проверка не должна красть фокус
при обычном редактировании.

**DS16 · P1 — consent banner перекрывает confirmation dialog.**
[Consent CSS](../../apps/web/src/features/analytics/analytics.module.css) использует z-index 1000,
[диалог](../../apps/web/src/shared/components/confirmation-dialog/confirmation-dialog.module.css)
— backdrop 20 и viewport 21. В свежем контексте с pending consent, lab → «Компоненты» →
«Сбросить пример», viewport 390×600: dialog y=210.57…396.96, banner y=364.25…600.20.
Пересечение по высоте — 32.72px, включая нижнюю часть кнопок. При 390×844 пересечения
диалога нет, но banner остаётся над modal backdrop.
Нужны общие роли слоёв и проверка комбинации consent/modal/navigation/reading indicators,
включая короткий viewport, scroll, keyboard и возврат фокуса. Простое увеличение случайного
z-index в одном месте не завершает контракт.

**DS17 · P1 — три устаревших ожидания делают baseline красным и скрывают следующие проверки.**
Unit PublicHeader ожидает старый compact default. Lab E2E ожидает собственный непрозрачный
фон page root, хотя текущий фон рисуется общим body/page-background. Recursion E2E требует
footer от x=0, хотя study grid размещает его с x=260.
Это подтверждается текущими owners и принятым study layout, а не предположением, что любой
красный тест устарел. Сначала сверить assertions с FRONTEND/Changes 105–106 и исправить
уровень проверки, затем повторно выполнить сценарии до конца. Lab тест останавливается
ещё на каталожной структуре; его поздние interaction/no-JS assertions в этом запуске не исполнены.

**DS18 · P2 — CustomIcon обходит theme семантическими fallback-цветами в TSX.**
`custom-icon-glyphs.tsx:5–6` использует `#fefdfc` и `#fd6702` как fallback paper/accent.
Они сейчас похожи на принятую палитру, но не следуют изменениям её tokens.
Привязать defaults к семантическим tokens; явные consumer overrides оставить только с назначением.
Официальные Telegram brand colors и чёрно-белая геометрия SVG masks — отдельные допустимые
категории. CSS-only scanner не обнаруживает этот TSX источник drift.

**DS19 · P2 — недостижимый CSS selector в StatusScene.**
`status-scene.module.css:124`:
`.root[data-scene="503"] .root[data-scene="error"] .copy`.
Он требует вложения error scene внутрь 503 scene, которого нет в компоненте и его consumers.
Декларации align-self/padding-bottom не применяются. Проверить задуманный error/503 layout
и исправить selector либо удалить правило; предположение о пропущенной запятой не является
само по себе утверждённым дизайном.

**DS20 · P2 — полнота каталога проверяется по exports, а не по поддерживаемым состояниям.**
51 карточка не доказывает покрытие namespace members и props combinations.
Не показаны некоторые реально публичные состояния, например disabled Accordion/Tabs;
самостоятельный LessonPractice specimen не переходит в solved/readonly, поскольку
получает фиксированные solvedTaskIds/acceptedAnswers. Stateful PracticeFlow покрывает часть,
но не делает все specimens эквивалентными. App-owned NavigationProgress не входит в реестр51;
его поведение нужно показывать в подходящей композиции, а не переносить app ownership вниз.
Нужны исполняемые specimens существенных состояний и review вариантов в существующих тестах.
Не строить полный декартов набор всех props и не вводить ещё один постоянный Markdown registry.

**DS21 · P2 — у самостоятельных link actions нет согласованной геометрии.**
На action specimens lab высота ActionLink drawn около 40px, ExternalLink drawn и DownloadLink
— около 18.94px. Последние не получают action target только от размещения рядом с кнопками.
FRONTEND задаёт минимум 40px обычным controls; inline prose links следует рассматривать отдельно.
Определить inline/action роль и обеспечить размер самостоятельного действия общим владельцем,
не добавляя минимальную высоту каждой ссылке внутри предложения.

### 10.4. Проверки, результаты и границы уверенности

На неизменённом коде текущего HEAD выполнены:

- `pnpm --filter web typecheck` — PASS.
- `pnpm --filter web lint` — PASS, включая layer boundaries и policy для всех 51 контрактов.
- Fallow analyze — 56 сигналов прежнего профиля: 3 unused files, 16 exports, 30 types,
  1 dependency, 6 unresolved imports. Разбор ложных срабатываний — §3; автоматическое
  удаление не выполнялось. В частности, CSS composes не считать отсутствием потребителя.
- Fallow duplication — 351 проанализированный файл, 31 clone group / 64 instances,
  1 209 duplicate lines из 40 994 (2.949%). Это кандидаты, а не 31 дефект:
  тестовые сценарии, автономный nginx fallback и независимые domain DTO требуют отдельного решения.
- Целевая unit-выборка: **82 PASS, 1 FAIL**, 10 файлов / 83 теста.
- Целевая Chromium E2E-выборка: **8 PASS, 2 FAIL**, 10 сценариев. Причины — DS17.
  Это диагностический запуск, не завершённый Critical/Full Gate.

Воспроизводимые команды выборок:

```bash
pnpm --filter web exec vitest run tests/shared-components.test.tsx tests/lesson-design-system.test.tsx tests/practice-content-renderer.test.tsx tests/public-header.test.tsx tests/custom-icon.test.tsx tests/svg-drawing.test.tsx tests/svg-pattern.test.tsx tests/design-system-lab.test.ts tests/brand-control-colors.test.ts tests/back-navigation.test.ts
pnpm --filter web exec playwright test e2e/smoke.spec.ts e2e/auxiliary-pages.spec.ts --grep 'design-system catalog|first published Python lesson|published recursion lesson|files lesson exposes|privacy and crawl|error preview|missing page|delayed successful navigation'
```

Точки падения: `tests/public-header.test.tsx:129–142`,
`e2e/pages/design-system-lab.page.ts:223`,
`e2e/pages/public-header.assertions.ts:38`.
Успешные E2E проверили missing page, mobile/no-JS recovery, error preview/reduced motion,
первый Python lesson с progress/reset, delayed navigation, privacy/crawl,
readability recursion across runtimes и attachment files lesson.
Прохождение readability не подменяет упавший сценарий practice/reading state.

Через Playwright/chrome-devtools MCP отдельно исследованы lab System/Components,
computed styles и геометрия, desktop и mobile, invalid submit, no-JS native form,
pending consent с открытым reset dialog. Для probes использованы отдельные browser contexts,
только локальное приложение и синтетические ответы. Эти проверки дали DS09, DS14–16, DS21.

**Ограничения:** это полный source/dependency охват указанного публичного UI, но выборочное
runtime покрытие. Не выполнены все сочетания ширины/высоты/zoom/клавиатуры/состояний,
screen-reader и cross-browser matrix, все поздние шаги упавших E2E, редакторская проверка
каждой строки 30 уроков, новый backend/security/performance audit.
Нельзя утверждать «найдены вообще все возможные проблемы». Можно утверждать, что исследование
больше не ограничено названными пользователем компонентами, а оставшиеся проверки указаны явно.

### 10.5. План реализации и связь с очисткой репозитория

Конкретный Backlog: [Change 107 — Frontend design-system consolidation](../changes/archive/107-frontend-design-system-consolidation.md).
Он объединяет DS01–DS21 в последовательные задачи с зависимостями и критериями приёмки.
Стратегическое намерение SPEC менять не требуется; минимальная коррекция устаревших
описаний D01–D03 добавлена в T5 согласно общей очереди §11.
Это план реализации существующего контракта; исправления приложения в ходе исследования не делались.

Порядок: восстановить достоверные assertions → закрыть no-JS/focus/modal ошибки →
уточнить роли и defaults → мигрировать shared семьи вместе со всеми consumers и lab →
удалить obsolete API/CSS → закрепить проверки против повторного расхождения.
В каждом переносе проверять владение presentation и остаточные callers, а не только появление export.

Документная консолидация, очистка reference artifacts и squash архива остаются отдельной
последовательностью §8. Их нельзя выполнять до извлечения актуальных визуальных решений и
migration obligations. Change 107 не даёт разрешения удалять staged пользовательские референсы,
менять Git history или сворачивать архив. Он также не создаёт новую дизайн-систему с нуля:
сохраняются бренд, текущая типографика, SVG assets и независимость Course/Topic.

## 11. Единая приоритизация всех исследований

**Эта последовательность заменяет очередность в §6, §8.5, §9.6 и §10.5.**
Их доказательства, перечни файлов и критерии сохранности остаются действующими.
Основание приоритета: сначала устранить противоречия, способные направить исправления
по старому пути, и ошибки поведения; затем свести владельцев UI; после стабилизации
сократить код, документы и историю. Объём удаляемых строк/байтов не определяет срочность.

Change 107 завершён и архивирован локально. Этап 3 завершён и архивирован в Change 108. Этап 4 реализуется в Change 109.
Этапы 4–6 остаются будущими changes; номера им назначает `/plan` после закрытия предыдущего. Не создавать несколько
активных changes на одних FRONTEND/STACK/tokens и не запускать независимые массовые
правки этих файлов одновременно.

### 11.1. Очередь и обязательные условия перехода

| Этап | Приоритет / scope | Задачи и зависимости | Условие перехода |
|---|---|---|---|
| 0. Минимальная сверка текущего контракта | P1, начало Change 107 | T5: D01–D03, D07 и historical marking D06. Исправить loading/CTA/ownership/section refs по уже принятому поведению; полное сжатие документов отложить | Нет конкурирующих актуальных указаний, влияющих на DS и проверки. Старые доказательства остаются доступны |
| 1. Достоверные проверки и ошибки поведения | P1, Change 107 | T1 → F1 → F2 → F3: baseline DS17, no-JS DS14, focus DS15, modal DS16 | Упавшие assertions приведены к принятому контракту; поздние шаги выполнены либо новые находки заведены явно; три ошибки воспроизводимо закрыты |
| 2. Общие владельцы компонентов и полная миграция | P1/P2, Change 107 | T2 → F4 → F5 → F6 → F7 → F8 → F9 → F10 → F11 → F12 → F13 → F14 → T3 → T4 | Все DS01–DS21 имеют итог; lab и реальные consumers совпадают по роли, obsolete API/overrides удалены; affected-area gate и review по workflow |
| 3. Оставшаяся runtime/infra hygiene | P2/P3, [Change 108](../changes/archive/108-runtime-hygiene.md) | C02, оставшаяся часть C03, повторно проверенные C04, A01/A02. Проверять актуальный diff после DS, а не старые численные списки | Web/auxiliary states не изменили нужное поведение, живые tokens/mounts сохранены; узкий gate и cleanup allowlist |
| 4. Консолидация действующей документации | P2, следующий change после 3 | D04, D05, D08; brand/runbooks/learning rules по §8.2. Текущие API/roles уже стабилизированы. Перенести уникальные правила, затем сократить дубли и навигацию | Для каждого удаляемого раздела есть владелец или проверяемая историческая причина. Frontend/API/release reading paths и recovery procedures сохранены |
| 5. Подготовка SDD к компактной истории | P2, следующий change после 4 | Обновить archive/numbering/read-source правила §8.4 и consumers AGENTS/playbooks/wrappers. Проверить оба формата архива: обычный и compacted. Originals пока оставить | Нумерация, поиск active change, обычное архивирование, invalid metadata и shallow-history failure проверены; источник оригиналов доступен |
| 6. Вывод истории и reference artifacts | P2/P3, следующий change после 5 | Точный allowlist §8.1–§8.3; snapshot, rule-preservation review, checkpoint, ссылки и удаления в одном change | Snapshot bytes/hash совпадают; текущие пути и восстановление из Git работают; уникальные решения/риски/content approvals сохранены |

Этап 2 намеренно имеет один последовательный порядок даже там, где локальная зависимость
позволяла бы параллельность. F4/F5/F9 затрагивают одни каталоги; F6/F8/F11 — одни уроки
и patterns; F3/F13 — общие tokens. Каждая семья мигрируется целиком и обновляет свой
specimen сразу. F14 закрывает оставшиеся пробелы каталога, а не откладывает всю lab работу
до конца. T3 усиливает проверки после появления поддерживаемого API, чтобы gate не запрещал
ещё не перенесённых действующих consumers.

Этап 3 выполняется до большого редакторского сжатия: сначала удалить реальные старые пути,
затем описать их итоговое состояние. Этапы 5 и 6 разделены, чтобы смена формата хранения
не ломала инструмент, который должен закрыть и заархивировать сам cleanup change.
Точная верхняя граница compacted range вычисляется в этапе 6 заново; 106 — номер исходного
снимка аудита, а не будущая фиксированная граница. Активный cleanup change в свёртку не входит.

### 11.2. Один владелец для каждой находки

Не суммировать одинаковую проблему из нескольких исследований как независимые задачи.

| Находки | Единственный владелец реализации / дальнейшее действие |
|---|---|
| D01–D03, D07 | Change 107 / T5; более позднее сжатие не исправляет их заново |
| D04, D05, D08 | Этап 4, консолидация правил и чтения |
| D06 | T5 отмечает snapshot; 107/T3 убирает runtime/test зависимость; физическое удаление — только этап 6 |
| C01 | 107/F13; исключён из будущей массовой CSS очистки |
| C02 | Этап 3, автономные nginx auxiliary pages |
| C03: button-height-compact | 107/F12 совместно с DS07 |
| C03: page-frame-background | Этап 3, только если F9/другой перенос 107 ещё не убрал декларацию; повторная проверка обязательна |
| C04 | Этап 3: кандидаты проверяются после 107, потому что новые semantic roles могут получить эти tokens |
| C05 | 107/F8 совместно с DS05; отдельного повторного «lesson shell change» нет |
| A01, A02 | Этап 3, empty-only target / старый placeholder с проверкой mounts |
| A03 | Этап 6: сохранить исторический source в Git, вывести raster-файлы из checkout по §8; исходное «оставить на диске» заменено |
| A04 | Активные new_pages/master/base/main-page сохранить; три неясных PNG и staged набор исключены из удаления до решения об их назначении |
| G01, G02 | Сохранить; это ограничения для всех cleanup этапов, а не задачи дедупликации |
| DS01, DS06, DS21 | 107/F4 |
| DS02, DS04 | 107/F5 |
| DS03 | 107/T3 |
| DS05 | 107/F8 |
| DS07 | 107/F12 |
| DS08, DS09 | 107/T2, F6; завершение миграции подтверждают T3/T4 |
| DS10 | 107/F7 |
| DS11 | 107/F10 |
| DS12 | 107/F9 |
| DS13 | 107/F11 |
| DS14 | 107/F1 |
| DS15 | 107/F2 |
| DS16 | 107/F3 |
| DS17 | 107/T1 |
| DS18, DS19 | 107/F13 |
| DS20 | 107/F14 и T3: живые состояния и проверка их использования — разные части одной находки |
| Дополнительные brand/infra/playbook/runbook/guide файлы §8.2 | Этап 4 переносит уникальное действующее содержание; этап 6 выводит исторические originals после проверки ссылок |
| Archive squash §8.3–§8.4 | Этап 5 готовит workflow; этап 6 выполняет compacted snapshot и удаления |
| Прежние readiness/course/UX audits из 29 artifacts | На этапе 4 сверить ещё открытые рекомендации с текущим кодом и shipped evidence. Сохранить незакрытые outcomes у текущего владельца; не возобновлять уже исправленные findings только из-за старого отчёта |

### 11.3. Коллизии, которые этот порядок предотвращает

- **Старый документ диктует новый UI.** T5 устраняет противоречия loading/ownership до
  изменения assertions и roles; краткая сверка не смешивается с переписыванием SPEC.
- **Удаление evidence раньше завершения миграции.** Migration matrix, исторические changes
  и visual sources доступны в течение 107. Тестовая связь с matrix снимается раньше файла.
- **Двойное исправление CSS.** C01/C05 и code-button C03 закреплены за задачами107.
  C04 повторно исследуется после token/role изменений; предварительные unused counts не являются allowlist.
- **Одновременный rename API и новый lint запрет.** Сначала общий API и перенос callers,
  затем ужесточение policy; никакого широкого suppression для завершения gate.
- **Две редакции FRONTEND.** В 107 уточняются текущие правила и роли; сжатие/перенос brand
  выполняется позже поверх его результата, с сохранением этих правил.
- **Сломанная нумерация после squash.** Поддержка compacted metadata появляется до удаления
  файлов; новый source SHA включает нужные originals, ссылки мигрируются вместе с удалением.
- **Потеря операционных процедур при «уборке документов».** Backup/restore остаётся отдельным
  runbook; incident и management ownership переносятся с проверкой, а не по количеству строк.
- **Смешение пользовательской работы с cleanup.** 14 staged additions защищены на всех
  этапах; сохранение их в Git само по себе не означает разрешения удалить рабочие источники.

Очистку воспроизводимых build/test caches по штатному allowlist продолжать после каждой
проверки: она не зависит от этапа 6 и не включает authored artifacts.
Release/push/deploy и новая продуктовая функциональность не добавляются в эту очередь автоматически.

### 11.4. Проверка подготовленного плана

Локальные Markdown destinations и пути Files проверены; матрица содержит ровно 51 уникальный
UI-контракт. В Change 107 — 19 уникальных задач (F1–F14, T1–T5), все dependency IDs существуют,
циклов нет. Format check — PASS. Unit/E2E baseline остаётся красным, как указано в §10.4;
исследование не исправляет его и не объявляет implementation gate пройденным.

Локальный dev stack после браузерных проверок остановлен, как было до исследования;
контейнеры и PostgreSQL data сохранены. Отчёты проанализированы, затем выполнены
`make clean-dry-run`, проверка списка, `make clean`, `make clean-check` — PASS.
Authored artifacts, зависимости и окружения не удалялись.

Git: tracked unstaged diff пуст, SHA-256 исходного staged diff совпадает с §1.
Подготовлены только этот отчёт и новый план107; код, тесты и действующие контракты не изменены.
Ветка остаётся `main`: перенос существующих staged изменений на feature-ветку требует
подтверждения по `docs/playbooks/plan.md` §6 и не выполнен. Commit/merge/push/deploy отсутствуют.
