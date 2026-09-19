# TECHNICAL SPECIFICATION (SPEC.md): `infraege`

> **For AI agents:** read the active change and the SPEC sections it affects; §3–§4 for data/API,
> §2.3 for authoring, §5 plus FRONTEND for web, §7–§8 for operations. Read SPEC in full for initial
> product planning or a product/system pivot. Read STACK gate/tooling rows and relevant GOTCHAS;
> do not load unrelated archive history by default.

## Metadata

| Field | Value |
|-------|-------|
| Document Version | `v2.16` |
| Date | `2026-09-17` |
| Architect / Owner | `v.godlevskiy` |
| Stack | See [docs/STACK.md](./STACK.md) |
| Domain | Платформа подготовки к ЕГЭ по информатике — самостоятельные темы экзамена и мини-курсы с теорией, визуализацией и практикой |

---

## 1. Project Overview and Goals

### 1.1 Problem

Ниша не занята ни платными школами (продают преподавателя, теория — приложение к урокам), ни
бесплатными банками заданий (теория есть, но текстовая простыня без структуры — ctege.info,
sdamgia.ru, kpolyakov.spb.ru), ни новыми AI-ботами (решают конкретную задачу, не учат понимать
тему). Продукт закрывает разрыв между «есть теория» и «понятно, почему так, и что с чем связано».

Три принципа, обязательные к соблюдению в каждом архитектурном решении:

1. **Понимание, а не заучивание шаблонов.** Каждая тема объясняет *почему так*, а не только
   *делай так*. Практика внутри урока закрепляет теорию; самостоятельный банк задач допускает
   тренировку без обязательного прохождения урока. Связи с теорией задаются явно по содержанию.
2. **Связи только там, где они доказаны содержанием.** Темы ЕГЭ и мини-курсы самостоятельны и не
   дублируют друг друга. Если реальная педагогическая связь появится, она вводится отдельным
   решением и становится частью модели, а не рекламной ссылкой в тексте.
3. **Проверяемая единица качества.** Каждый TopicLesson или CourseLesson отдельно проходит полный
   путь «теория → практика → результат» и Content Quality Gate. После доказанного early-access
   flow архитектор может объединить завершение связной программы в один change, но публикация
   каждого входящего урока всё равно требует содержательного и визуального одобрения. Пока change
   не завершён, публичный курс честно показывает только действительно доступные уроки.

### 1.2 Goal and Success Metrics

Цель MVP — подтвердить, что органический поиск приводит трафик на темы, сделанные по этим
принципам, и что ученики реально проходят путь Теория → Практика → Что важно для ЕГЭ → Результат,
а затем продолжают обучение, а не уходят после первого экрана.

Числовые цели не зафиксированы. Сейчас проверяем полезность уроков и практики непосредственным
использованием и обратной связью. Аналитический стек и сбор браузерных событий удалены;
необходимые журналы сервера служат эксплуатации, а не оценке учебного прогресса.

### 1.3 Project Boundaries

| Included (MVP) | Excluded (сознательно не входит в MVP) |
|-----------------|------------------------------------------|
| Полная публичная карта заданий ЕГЭ и 2 проверенные TopicLesson как содержательный MVP baseline | Аккаунты и синхронизация прогресса между устройствами |
| 1 мини-курс — Python (закрывает больше всего номеров: 6, 8, 11, 14, 15, 16, 17, 18, 20–27) | Полноценный тренажёр-пробник ЕГЭ с таймером на весь вариант |
| Завершённый самостоятельный мини-курс Python с отдельным Course/CourseLesson flow | Платные функции любого вида |
| Публичные, индексируемые страницы тем и уроков (SSR/SSG) | AI внутри продукта (только как инструмент автора при подготовке контента) |
| Практика по каждой опубликованной TopicLesson: 5–10 заданий с проверкой ответа, без адаптивного подбора сложности | Мини-курс Excel и полные TopicLesson для остальных заданий ЕГЭ — вторая волна, по той же структуре |
| Прогресс на уровне браузера (localStorage), без обязательной регистрации | i18n/локализация (аудитория исключительно русскоязычная) |
| | Полноценный поиск по сайту (линейная карта из 25 тем остаётся обозримой без отдельного поиска) |

Текущий baseline: два опубликованных TopicLesson, независимый Python Course с 28
последовательными CourseLesson и 140 server-owned задачами; финал — четыре стадии одного
терминального менеджера задач. Все уроки прошли содержательную и визуальную оценку.
Первоначальная 19-шаговая редакция не получила финального одобрения и не является baseline.
Лаборатории удалены. Новые Topic-связи и аккаунты не следуют из публикации курса.
Релизная история хранится в archive; текущий deployed SHA проверяется через `/health/ready`,
а не выводится из local `main`, `origin/main` или старого успешного релиза.

### 1.4 Durable Learning Flow

Этот flow относится к урокам. Модуль «Практика» (§3, §4)
содержит самостоятельный каталог и страницы задач без обязательной теории и тренировочных сессий.

Учебная траектория является продуктовым контрактом и не зависит от URL, page composition или
визуальной системы. Тема и урок собираются из упорядоченных learner-facing ролей:

1. **Теория** (`theory`, обязательна, может состоять из нескольких последовательных крупных
   групп) вводит идею и объясняет, что происходит и почему это работает, без искусственного
   переключателя «кратко/подробно». Примеры, промежуточные вычисления, способы решения и
   разобранные ошибки располагаются непосредственно рядом с теорией, которую они поясняют, а не
   образуют отдельный этап. Локальной самопроверки внутри отдельного `ConceptBlock` больше нет —
   каждая теоретическая группа читается подряд, без прерывающих retrieval-практик.
2. **Что важно для ЕГЭ** (`exam_focus`, опциональна) объединяет требования формата, универсальный
   алгоритм, типичные ловушки, лайфхаки и общие подсказки.
3. **Практика** (`practice`, обязательна) содержит постепенно усложняющиеся самостоятельные
   задачи с приоритетом свободного ввода, доступными подсказками и решениями.
4. **Результат** (`result`, обязательна) завершает материал итогами, освоенными умениями,
   результатом практики, текущим mastery-состоянием и registry-derived списком доступных
   опубликованных материалов. Формативная самопроверка (`checkpoint`, опциональна) — единственная
   на весь урок, собирает вопросы по всем теоретическим идеям и рендерится внутри этой секции,
   после итогового текста; не учитывается как выполненная практика.

Роли идут только в этом порядке; опциональные роли можно пропускать, но нельзя переставлять.
Контент включается только когда помогает понять материал, решить задачу или выбрать следующий шаг.

Подсказки и решение доступны сразу и не меняют прогресс. Прогресс хранит только принятые ответы и
вычисленные из них solved/mastery-состояния текущего урока; `result` показывает этот итог и
registry-derived список доступных опубликованных материалов, не выдавая его за персональную
рекомендацию. Отдельного финального испытания без подсказок, таймеров, задержек,
assisted-solution scoring, оценки уверенности или персонализированного повторения нет. Их нельзя
добавлять без нового решения архитектора. Глубина разделов зависит от сложности материала, но
линейная модель предпочтительнее скрытого адаптивного ветвления.

Reset удаляет конкретные публикации и UI-решения, но не этот контракт и не предметную область
продукта. Сохраняются нейтральные сущности Topic/Course/CourseLesson/Task и mastery-семантика;
CourseLesson принадлежит Course, но не связан с Topic без отдельного будущего решения. Slug,
тексты, ассеты, маршруты и композиции удалённой публикации не являются основанием для нового
дизайна.

---

## 2. Domain Context

### 2.1 Roles and Permissions

| Role | Capabilities | Restrictions |
|------|-------------|--------------|
| `Anonymous learner` | Читает теорию, решает практику, прогресс сохраняется в localStorage браузера | Нет аккаунта на MVP — прогресс не синхронизируется между устройствами |
| `Content author` (архитектор + AI как инструмент) | Пишет типизированную теорию в `apps/web/src/entities/lesson/content/*.lesson.tsx` и практику в `content/practice-bank/bank.json`, ревьюит AI-черновики через git diff; для теории переводит `draft → review → published`, для задач использует операторский импорт | Публикация теории проходит Content Quality Gate (§2.3); импорт задач — по §3 и runbook practice; AI не публикует напрямую |
| `Architect` | Владеет `docs/SPEC.md`, принимает архитектурные решения, ревьюит контент перед `published` | — |
| `AI_Agent` | Реализует изменения через `/work`, генерирует черновики контента по промптам с чек-листом из [Content Quality Gate](#23-content-quality-gate-definition-of-done) (§2.3), запускает гейты через `/ship` | Не переводит контент в `published` самостоятельно; нет прямого push в `main` вне `/ship` |

### 2.2 Key Entities

Теория и публикация уроков остаются content-as-code; действующий банк задач хранится в
PostgreSQL (§3). Задача самостоятельна и может иметь упорядоченные связи с уроками.

`TopicCatalogEntry` (учебная тема) `→` непустой упорядоченный `taskNumbers[]` (один или несколько
номеров ЕГЭ) `→` опциональный опубликованный `TopicLesson`
`TopicLesson` `→` `ConceptBlock[]` (смысловые разделы типизированной TSX-теории)
`Course` `→` `CourseModule[]` `→` `CourseLesson[]` (упорядоченная самостоятельная траектория)
`TopicLesson` / `CourseLesson` `→` `Task[]` через `lessons[{material_id, position}]`

Связи `Topic ↔ CourseLesson` отсутствуют в текущей модели намеренно. Их нельзя имитировать через
совместное владение Task, prerequisites, unlocks или навигационные рекомендации.

Теория и publication metadata живут в типизированном TSX/модулях `apps/web`; практика и checker
читаются из PostgreSQL. `content/practice-bank` — проверяемый исходный банк для явного импорта,
а `content/tasks` — исторические тестовые fixtures без runtime-потребителей. Course metadata и CourseLesson theory имеют
единственного frontend-consumer и поэтому остаются типизированным content-as-code, а не получают
параллельную JSON-модель. Состояние пользователя (прогресс) — на MVP только localStorage на
клиенте в едином app-scoped lesson-progress registry; course progress вычисляется из записей
опубликованных уроков в этом реестре и отдельно не сохраняется.

Публичный каталог тем хранит 25 записей, которые покрывают номера ЕГЭ 1–27 ровно по одному разу.
Запись 19–21 — одна тема «Выигрышная стратегия»; другие объединения требуют отдельного
педагогического решения. Каталог использует проект спецификации ФИПИ ЕГЭ 2027 как датированный
редакционный источник, но не делает будущие уроки доступными до статуса `published`.

Публичный каталог мини-курсов хранит отдельный упорядоченный список направлений. Опубликованный
Python подставляет title, summary, route и состав уроков из Course publication registry; Excel,
«Алгоритмы и структуры данных» и «Решение задач повышенной сложности» остаются catalog-only
записями `planned`, не создают фиктивных Course/CourseLesson definitions и не получают URL.

### 2.3 Content Quality Gate (Definition of Done)

Для теории и публикации уроков сохраняется следующий human gate. Для банка задач принят отдельный
операторский путь (§3): подготовка → проверка `validate` без записи → импорт → немедленная доступность.
Редактор и отдельное согласование публикации задач не вводятся. Автоматическая валидация не
доказывает корректность решения: содержательная проверка и происхождение — ответственность
подготовки пакета. Переезд старого упражнения в БД сам по себе не включает его в общий каталог.

Этот checklist обязателен в AI authoring prompt и до `review`; публикация дополнительно требует
ручной проверки фактов и визуального результата. Формальная автоматизация не заменяет human gate.

**Педагогика:**
- [ ] Для нового понятия: полный worked example → completion problem → самостоятельная задача;
  помощь сокращается с опытом (expertise reversal). Productive failure допустим только при
  настоящих смежных знаниях, с последующим разбором ошибочного подхода, не для нового синтаксиса.
- [ ] Подписи расположены на схеме или непосредственно рядом; связанные части синхронизированы,
  ключевые элементы выделены, декоративный шум и бессмысленное дублирование убраны. Семантический
  текстовый эквивалент для доступности сохраняется; мультимедиа не требует обязательного audio.
- [ ] Ученик извлекает знание сам; лёгкость чтения не считается mastery. Предусмотрена рекомендация
  возврата/повторения. Spacing и interleaving по изученным темам — направление при расширении
  практики, а не уже установленный scheduler/adaptive engine или разрешение добавить его сейчас.
- [ ] Явный mastery threshold означает продемонстрированное владение, но не блокирует следующий
  урок: действующий flow рекомендательный, без hard locks. Исторические проценты/2-sigma оценки
  не являются обещанием эффективности продукта или доказательством learner outcomes.
- [ ] Верно/неверно сообщается сразу; разбор объясняет причину ошибки. Глубина feedback важнее
  искусственной задержки; эффект задержанного feedback зависит от обработки учеником.
- [ ] Материал реализует обязательные роли §1.4 — Теория → Практика → Результат — и только
  полезные для темы опциональные роли в каноническом порядке; внутренние блоки соответствуют
  назначению роли, а глубина — сложности темы, не искусственному лимиту длины.
- [ ] Каждое изображение или diagram объясняет конкретную закономерность, сравнение, процесс,
  ошибку или этап алгоритма; его ключевые элементы имеют прямую смысловую связь с соседним текстом.
- [ ] Задачи используют `interaction_type: production`, кроме случаев, где сам формат ЕГЭ требует
  выбора варианта.
- [ ] `mastery_threshold` осознанно выставлен, не оставлен дефолтом бездумно.
- [ ] `explanation` каждой задачи — содержательный разбор с объяснением типичной ошибки, а не
  строка «правильный ответ: X».
- [ ] Помощь доступна без искусственной задержки; правильное решение с подсказкой учитывается в
  прогрессе, а слабый результат вызывает рекомендацию повторения, не штраф или скрытый scoring.
- [ ] Medium (текст, код, таблица, raster image/diagram или authored-файл) выбран по учебной
  эффективности, а не удобству реализации; визуал имеет самостоятельный вес в объяснении и не
  используется как декорация.

**Фактическая корректность:**
- [ ] Математика/логика в `worked_example`/`completion_exercise` проверена человеком вручную, не
  принята на веру из AI-черновика.
- [ ] Все `answer_variants` каждой задачи реально протестированы через checker локально, включая
  нормализацию (§4: ё/е, запятая/точка, обрезка пробелов) — не только «выглядит правильным».
- [ ] Точные данные изображения/diagram и итоговое представление проверены человеком в браузере на
  лишние/пропущенные связи, подписи, числа и смысловые искажения.

**Технически:**
- [ ] `lessons[].material_id` и `theory_links[].material_id/section` банка ссылаются на
  существующие материалы/разделы; позиции задач в уроке уникальны. `pnpm validate:content`
  проверяет текущий банк, файлы и согласованность с генерируемым publication registry (§3).
- [ ] Заполнены `title`/`summary` для корректных meta-тегов (§8) — не заглушки вида «TODO».
- [ ] Image/diagram имеет alt и caption; raster также имеет явные intrinsic dimensions и
  существующий оптимизированный task-owned ассет, а сложные точные данные доступны семантически.
- [ ] Authored-вложение открывается/скачивается без JavaScript, соответствует allowlist
  расширений/MIME и объявленному размеру, а его label/description объясняют назначение файла.

**Юридически:**
- [ ] Текст темы и формулировки задач не являются близким пересказом источника — переформулированы
  самостоятельно (§8, «Юридическое (оригинальность контента)»).

Чек-лист хранится рядом с контентом (например, как шаблон PR при добавлении новой темы), а не
только в этом документе.

#### Источники педагогического checklist

Перенесённая библиография исходного исследования; это provenance, не новые продуктовые обещания.

Ниже — источники, на которые опирается документ (для дальнейшего самостоятельного погружения в тему):

- Sweller, J. — работы по Cognitive Load Theory и worked-example effect (обзор: en.wikipedia.org/wiki/Worked-example_effect)
- Cognitive Load Theory — обзор для практиков: education.nsw.gov.au (CESE, 2017), uky.edu (Cognitive Load & Instructional Design)
- Mayer, R. E. — Cognitive Theory of Multimedia Learning, обзоры принципов: learning-theories.com, theelearningcoach.com, litfl.com, springer.com (The Past, Present, and Future of CTML)
- Roediger, H. L. & Karpicke, J. D. — testing effect: psychnet.wustl.edu (The Power of Testing Memory)
- Pan, S. C. & Rickard, T. C. (2018) — spaced retrieval practice meta-анализ
- Rohrer, D. и коллеги — interleaving в математике: pubmed.ncbi.nlm.nih.gov/24578089, aft.org (Interleaving in Math)
- Bjork, E. L. & Bjork, R. A. — Desirable Difficulties: structural-learning.com, unh.edu, researchschool.org.uk
- Bloom, B. (1984) — 2 Sigma Problem: en.wikipedia.org/wiki/Bloom%27s_2_sigma_problem, nintil.com (系统ematический обзор эффективности mastery learning)
- Kapur, M. — Productive Failure: boldscience.org, pubmed.ncbi.nlm.nih.gov/31089856
- Kulik, J. A. & Kulik, C.-L. C. — мета-анализ по timing обратной связи; edsurge.com, learningscientists.org — практические разборы
- Duolingo Research — research.duolingo.com, github.com/duolingo/halflife-regression, pnas.org (Enhancing human learning via spaced repetition optimization)


---

## 3. Data Model

Change 122, approved 2026-09-17, supersedes the former practice transition and decorative
roadmap. Theory remains authored content; PostgreSQL 18 owns the full existing task bank.
Stable task IDs, exact checker answers, content blocks, private provenance, attachments and
ordered lesson memberships survive the transition to a new isolated volume.

The current-state model has task, private checker, lesson membership and file records. Small
metadata collections (skills, exam numbers, sources, theory links) use JSONB. There is one
solution counter for stale submissions and progress, without historical task snapshots.
One trusted operator imports/exports JSON using host tooling. Import updates selected IDs
transactionally, never deletes omitted tasks, and does not duplicate replayed data. Basic
structure, database integrity, bounded input and safe file paths remain mandatory. Concurrent
editing, package ledgers, revision history, background jobs and garbage collection are deferred.
Old database volumes and source snapshots are retained; no destructive in-place migration.

## 4. API / Backend Contract

Existing `/api/tasks` detail/check/file and lesson-practice/course-summary capabilities remain.
Catalog supports server search in title, summary, visible statement and ID (numeric queries also
match exam numbers), grouped multi-topic OR selection, default stable ID order or difficulty
ascending/descending with ID tie-break, and numbered pages of 10/30/50/100 (default 30).
Topic counts include only catalog-visible nonarchived tasks, independent of search; zero topics
remain selectable. Course sections derive from publication metadata without publishing lesson-only
tasks. Legacy exam/skill/difficulty links remain supported. Next task uses the same selection/order.
Public projections exclude
checker answers and private sources. Wrong answers, missing tasks, stale solution counters and
unavailable services remain distinct. Regenerate OpenAPI/client types with implementation.
Runtime reads PostgreSQL, never silently falls back to historical JSON. API owns comparison and
normalization; browser state records only local learning progress. No public write/admin API.

## 5. Frontend / Client Contract

All public learning routes remain: `/`, `/ege`, `/courses`, course overview, published topic and
course lessons, `/practice`, task detail and `/privacy`. Planned entries remain non-links.
Internal `/lab/design-system` and `/lab/lesson` and their demos are retired.

The reference is production commit `a5b0bf5`: white canvas, ink, compact text lists and quiet
reading. Keep infraege stone identity, current self-hosted Alegreya/Golos Text/JetBrains Mono,
and small orange accents for brand identity. Controls and navigation remain monochrome. Remove decorative imagery, grids,
textures, light effects and animation infrastructure. Keep educational figures and attachments.
Shared semantic controls, accessible focus/errors/loading, stable fonts and retained-page
navigation stay. FRONTEND is the binding implementation contract.

Practice uses the catalog as its primary solving surface: multiple independently expandable
rows expose statements, checking, help, files, published theory links and public sources.
“Раскрыть все” and “Свернуть все” affect only the current page; bulk expansion loads full
statements into visible document content for browser find. Individual disclosure remains available.
Details load only on first expansion and remain mounted while collapsed. Transient input
and help state survive collapse, but reset on selection/page changes, leaving or reloading.
The detail route remains for direct links and no-JS reading; catalog IDs link there with the
filter/page context. Real task IDs remain canonical; rows show eight-character UUID prefixes with accessible full IDs.
The catalog heading says “Решай задачи и закрепляй теорию”; a question icon opens draft/progress
information. Search applies explicitly. Topic selection uses a grouped searchable multiple combobox,
counts below labels, and Apply/cancel; selected topics appear as removable chips. Default sorting is
stable UUID order; optional difficulty directions and compact numbered pagination retain URL context.
No-JS retains GET controls, native multiple selection and detail reading. Empty topics show ordinary
no-results feedback. Compact rows show difficulty, actual answer format, public sources and a disabled
favorite affordance. Expanded statements precede answer/check/help actions; theory sits beside the topic heading above the statement. Catalog and detail share compact solving controls; lessons keep their presentation. Base UI owns controls,
Lucide owns icons, and shadcn/HeroUI are visual references only, without added dependencies.
Existing filters, numbered pagination, local progress remain. Detail pages have one context-preserving return link and no next-task navigation. Remove persisted answer drafts and special row/scroll restoration; return links
carry filters and page. No telemetry consent, analytics or client-error collector. No new
accounts, editing UI, global stores, dependencies or speculative abstractions.

## 6. Auth & Access Model

Для серверного банка (§3) используются разные DB credentials: HTTP runtime read-only (включая
checker), операторский CLI/import ограниченная запись без DDL, migrations отдельная роль,
backup/restore с достаточными отдельными правами. Production PostgreSQL не открыт в интернет;
оператор использует принятый защищённый доступ к VPS, не меняя текущий SSH-контракт.

Нет аутентификации на MVP. Публичные страницы и `POST /api/tasks/{id}/check` анонимны; прогресс
урока хранится только в localStorage текущего браузера и не синхронизируется. Ограничение на уровне
инфраструктуры (не auth) — rate limiting чекер-эндпоинта на Nginx (§4, §8) против автоматического
перебора банка ответов.

Поле `access_tier: free | paid` в модели `Topic`/`CourseLesson` — задел под будущую монетизацию
(§8), не enforced ни на backend, ни на frontend на MVP; все `published`-записи считаются `free`.
Аккаунты, роли пользователей и платный доступ — вне MVP (§10).

---

## 7. Infrastructure and Deploy/CI

### 7.1 Application topology

Один application Compose: Nginx → web/API → PostgreSQL. API и Nginx читают task-files
с read-only mounts. Ubuntu, journald, fail2ban, TLS renewal и application backup остаются.
Доступ root/password SSH с pinned host key сохраняет ранее принятое решение архитектора.

### 7.2 Deploy / CI

CI выполняет static/build/security checks, тесты запускаются только локально.
Production использует immutable SHA images. Deploy — явный workflow_dispatch, с health/smoke
и rollback на предыдущий release. Первый переход на 122_01 требует отдельного переноса банка
в новый volume и restore acceptance для выбранного SHA; обычный deploy не импортирует контент.
Старый volume сохраняется. После новых записей нельзя считать его актуальной резервной копией.
Content validation и OpenAPI drift проверяются до merge. Подробности в STACK и runbooks.

### 7.3 Minimal operations

Сохраняются TLS, health, обычные журналы, rate limits и scheduled application backup/restore.
Umami, Beszel, sre-kit integration, publishers и monitoring tunnels удалены из репозитория.
Установленные сервисы VPS этим локальным change не изменяются. Их остановка и отключение старых
таймеров входят в отдельный явно разрешённый release по runbook; volumes автоматически не удаляются.

## 8. Non-Functional Requirements

### 8.1 Data transition and recovery

Before changing persistence, preserve and restore-check the actual local bank/files. Build the
simpler model on a new isolated volume; verify IDs, content, checker, memberships and file
parity. Keep source database/files. Scheduled backup covers database and referenced files;
restore runs into an empty isolated target. Production transfer and retirement of installed
monitoring services require explicit release authorization and Full/Release Gate.

### 8.2 Existing non-functional baseline

| Concern | Requirement |
|---------|-------------|
| Security headers / CORS | Rate limiting чекер-эндпоинта на Nginx: `limit_req_zone` 20 req/min/IP, burst 5, `nodelay` (см. §4) — против автоматизированного перебора банка ответов; конкретную цифру пересмотреть по факту логов после запуска. Основной public root/password SSH использует принятый архитектором минимум 12 символов, pinned host key, UFW и fail2ban; production Environment не имеет required reviewers по решению архитектора от 2026-09-04, `can_admins_bypass` остаётся единственным environment safety property. Повышенный риск перебора и полного захвата VPS при компрометации более короткого пароля осознанно принят, key-only migration не запланирована. |
| Accessibility target | Public pages не имеют serious/critical axe violations; lesson outline сохраняет вложенный semantic list, anchors, keyboard focus, различимый текущий пункт и корректный source order, а сложный визуал имеет видимую полную текстовую альтернативу |
| Performance budget | Текущий release gate ограничивает median LCP значением ≤4.0s на мобильном 4G-профиле; продуктовая цель остаётся LCP ≤2.8s, и порог следует вернуть к ней после подтверждённой оптимизации или на стабильном измерительном runner. CLS < 0.1, INP < 200ms; release evidence измеряет `/`, `/ege`, `/courses`, `/courses/python` и `/ege/16-rekursiya`, отдельно проверяет cold-load font/layout shifts и не подменяет route-level метрики общей оценкой технической страницы |
| Observability | Health, structured server logs and scheduled external availability/TLS probe; no browser telemetry or separate monitoring stack |
| Backup / restore | Application DB, files, roles and protected environment in encrypted Restic; 7 daily + 4 weekly + 3 monthly, monthly isolated restore. Same-host backup loss remains accepted until off-site storage exists |
| SEO | `/`, `/privacy`, published topics, courses и CourseLesson имеют canonical, уникальные metadata, SSR content, общий crawlable social preview и входят в sitemap/prerender; root document публикует browser-only manifest, SVG/PNG/ICO favicon и Apple touch icon из production-знака, а `/` — правдивый `WebSite` JSON-LD без выдуманной Organization; review routes остаются unlisted, `noindex,nofollow` и исключены из public discovery; Lighthouse SEO для публичных маршрутов проходит без ошибок |
| Mobile / no-JS readability | TopicLesson, Course overview и CourseLesson сохраняют текст, программу, подписи, решения и section anchors в SSR HTML; интерактивная проверка и персональный progress остаются progressive enhancement |
| Client resilience / API drift | Route failures восстанавливаемы без белого экрана; loading/empty/error/not-found состояния доступны с клавиатуры и скринридера; OpenAPI schema/types drift ломает gate до merge; runtime HTTP имеет timeout/abort и не делает скрытый retry мутаций |
| Юридическое (152-ФЗ) | `/privacy` публикует фактические цели, состав, сроки и получателей обработки, `avatarsik6699@gmail.com` и Telegram invite как каналы связи, но по явному решению архитектора не публикует ФИО и адрес оператора с принятием сопутствующего риска. Браузерная аналитика и consent UI удалены. Формальная проверка уведомления РКН, локализации и текста юристом остаётся обязательным внешним follow-up, а не заявляется выполненной |
| Юридическое (436-ФЗ) | Возрастная маркировка для обычного сайта не вводится: существующая `12+` удаляется без замены на `18+` |
| Происхождение контента | Существующие уроки сохраняют Content Quality Gate (§2.3). Для нового банка принято импортируемое содержимое с явным provenance (§3); происхождение, атрибуция и допустимость использования проверяются при подготовке импорта, не выводятся автоматически из URL и не заменяются технической валидацией |
| Other (юридический ориентир, не консультация) | Открытые источники используются как инженерный ориентир; формальная юридическая проверка и РКН составляют принятый бессрочно отложенный риск, а не пункт текущего roadmap |

---

## 9. Roadmap

Change 122 archived the minimalist UI, simplified server practice and reduced operations while
preserving source history and data. Change 123 owns Full/Release verification and all resulting
corrective maintenance in one change. Existing history remains in COMPACTED and immutable archives.
Future capabilities need demonstrated use.

## 10. Out of Scope

Production deployment/host mutations in local work; deleting old volumes; accounts/payments;
collaborative editing; editorial audit history; automatic import conflict resolution; background
imports/file garbage collection; analytics/monitoring dashboards; decorative systems and labs.
Single-operator sequential imports and ordinary pagination are intentional first-version limits.
Formal legal review, off-site backup, key-only SSH and new content remain separate decisions.

## 11. Open Questions

None for the approved Change 122 scope. Verify actual source data before migration; never infer
live database contents from archived acceptance counts.
