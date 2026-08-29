# TECHNICAL SPECIFICATION (SPEC.md): `infraege`

> **For AI agent**: Read this file in full before starting any change. Confirm understanding of
> constraints before running `/plan` or `/work`. When this file changes in a way that affects an
> active `docs/changes/*.md`, note it in that change's Implementation Notes rather than
> hand-syncing a separate contract file — there isn't one.

## Metadata

| Field | Value |
|-------|-------|
| Document Version | `v2.8` |
| Date | `2026-08-29` |
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
   *делай так*. Практика привязана к теории, а не существует отдельным банком.
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

- [NEEDS_CLARIFICATION: конкретные числовые целевые показатели (сколько органических визитов /
  за какой срок / какая глубина прохождения темы считается успехом) не зафиксированы архитектором
  — решить после накопления пригодных M4-данных Umami, а не гадать заранее.]
- Change 48 вводит прозрачную аналитическую петлю: optional browser analytics и узкий allowlist
  продуктовых событий включаются только после явного opt-in, а необходимые security/reliability
  logs и обезличенные server-side aggregates раскрываются отдельно. Fingerprinting, ответы,
  свободный текст и скрытые постоянные идентификаторы не собираются.
- Текущей продуктовой потребности достаточно уже работающих consented Umami pageviews/sessions с
  разрезом по публичным путям и privacy-safe Nginx aggregates. Дальнейшая детализация продуктовых
  событий, funnel-семантики и Source allowlist не входит в текущий roadmap: существующий event
  слой остаётся best-effort telemetry и не блокирует авторинг уроков. Новые события или
  идентификаторы не добавляются без отдельной доказанной потребности.

### 1.3 Project Boundaries

| Included (MVP) | Excluded (сознательно не входит в MVP) |
|-----------------|------------------------------------------|
| 3–5 самых проблемных тем ЕГЭ (по номерам заданий) полностью: теория + визуализация + практика | Аккаунты и синхронизация прогресса между устройствами |
| 1 мини-курс — Python (закрывает больше всего номеров: 6, 8, 11, 14, 15, 16, 17, 18, 20–27) | Полноценный тренажёр-пробник ЕГЭ с таймером на весь вариант |
| Самостоятельный early-access мини-курс Python с отдельным Course/CourseLesson flow | Платные функции любого вида |
| Публичные, индексируемые страницы тем и уроков (SSR/SSG) | AI внутри продукта (только как инструмент автора при подготовке контента) |
| Практика по каждой теме: 5–10 заданий с проверкой ответа, без адаптивного подбора сложности | Мини-курс Excel и остальные темы ЕГЭ — вторая волна, по той же структуре |
| Прогресс на уровне браузера (localStorage), без обязательной регистрации | i18n/локализация (аудитория исключительно русскоязычная) |
| | Полноценный поиск по сайту (пока тем < 10, обычная навигация достаточна) |

Первый публичный product release переводит проверенный урок `/ege/16-rekursiya` в `published`,
заменяет техническую заглушку `/` минимальной публичной точкой входа и возвращает обязательные
SEO/legal surfaces. Lab-маршруты остаются unlisted/noindex и не входят в публичную навигацию.

После публикации `/ege/5-preobrazovanie-zapisey-chisel` расширение каталога было остановлено на
двух полных TopicLesson для product-readiness аудита. Changes 45–46 закрыли выявленные пробелы
learner journey, а Changes 56–57 затем опубликовали самостоятельный early-access мини-курс Python
и его первый CourseLesson. Второй CourseLesson «Условия: сравнения и выбор из двух вариантов»
опубликован после повторного Content Quality Gate. Evidence-first аудит course flow и исправление
неправдивого продолжения завершены; live-проверка подтвердила, что существующих pageviews/sessions
и разреза по путям достаточно для текущей аналитической потребности. Самостоятельный CourseLesson
«Ошибки: читаем сообщение и находим причину» опубликован после ручной содержательной и визуальной
проверки и вошёл в course discovery/progress с пятью server-owned задачами. В Change 71 первоначальная
19-шаговая программа прошла первый цикл авторинга, но до ship архитектор отозвал финальное одобрение:
одинаковая глубина уроков и короткая итоговая программа не подтверждали заявленный результат.
Текущая редакция содержит 28 последовательных шагов, закрывает числа, цифры, сортировку,
включения, итераторы/генераторы и исключения и заканчивается четырьмя уроками одного менеджера
задач. Все 28 уроков прошли финальную содержательную и визуальную оценку, зафиксированы в
Change 71 и слиты в локальный `main`; курс имеет stage `complete`. Внешняя публикация остаётся
отдельным release-шагом и не расширяет учебный или аналитический scope.
Аккаунты, новый сбор аналитики, Topic-связи, каталог/поиск и другие функции за пределами текущих
MVP-границ из этого решения не следуют.

### 1.4 Durable Learning Flow

Учебная траектория является продуктовым контрактом и не зависит от URL, page composition или
визуальной системы. Тема и урок собираются из упорядоченных learner-facing ролей:

1. **Теория** (`theory`, обязательна, может состоять из нескольких последовательных крупных
   групп) вводит идею и объясняет, что происходит и почему это работает, без искусственного
   переключателя «кратко/подробно». Примеры, промежуточные вычисления, способы решения и
   разобранные ошибки располагаются непосредственно рядом с теорией, которую они поясняют, а не
   образуют отдельный этап. Короткая формативная самопроверка может завершать смысловую группу
   теории непосредственно в её `ConceptBlock`, чтобы ученик проверял модель до перехода к
   следующей идее.
2. **Что важно для ЕГЭ** (`exam_focus`, опциональна) объединяет требования формата, универсальный
   алгоритм, типичные ловушки, лайфхаки и общие подсказки.
3. **Промежуточный итог** (`checkpoint`, опциональна) компактно собирает опорную модель перед
   самостоятельным применением и не учитывается как выполненная практика.
4. **Практика** (`practice`, обязательна) содержит постепенно усложняющиеся самостоятельные
   задачи с приоритетом свободного ввода, доступными подсказками и решениями.
5. **Результат** (`result`, обязательна) завершает материал итогами, освоенными умениями,
   результатом практики, текущим mastery-состоянием и registry-derived списком доступных
   опубликованных материалов.

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
| `Content author` (архитектор + AI как инструмент) | Пишет типизированную теорию в `apps/web/src/entities/lesson/content/*.lesson.tsx` и server-owned практику в `content/tasks/*.json`, ревьюит AI-черновики через git diff, переводит `draft → review → published` | Публикация только через прохождение Content Quality Gate (§2.3); AI не публикует напрямую |
| `Architect` | Владеет `docs/SPEC.md`, принимает архитектурные решения, ревьюит контент перед `published` | — |
| `AI_Agent` | Реализует изменения через `/work`, генерирует черновики контента по промптам с чек-листом из [`learning-science-principles.md`](./artifacts/learning-science-principles.md) (§2.3), запускает гейты через `/ship` | Не переводит контент в `published` самостоятельно; нет прямого push в `main` вне `/ship` |

### 2.2 Key Entities

`Topic` (тема ЕГЭ) `→` `ConceptBlock[]` (смысловые разделы типизированной TSX-теории)
`Course` `→` `CourseModule[]` `→` `CourseLesson[]` (упорядоченная самостоятельная траектория)
`Topic` `→` `Task[]` через `topic_ids`
`CourseLesson` `→` `Task[]` через `course_lesson_ids`

Связи `Topic ↔ CourseLesson` отсутствуют в текущей модели намеренно. Их нельзя имитировать через
совместное владение Task, prerequisites, unlocks или навигационные рекомендации.

Контент живёт в git, не в БД: lesson theory и publication metadata — в типизированном TSX/модулях
`apps/web`, practice/checker data — в `content/tasks/`. Course metadata и CourseLesson theory имеют
единственного frontend-consumer и поэтому остаются типизированным content-as-code, а не получают
параллельную JSON-модель. Состояние пользователя (прогресс) — на MVP только localStorage на
клиенте в едином app-scoped lesson-progress registry; course progress вычисляется из записей
опубликованных уроков в этом реестре и отдельно не сохраняется.

### 2.3 Content Quality Gate (Definition of Done)

Педагогические принципы, обязательные при любой генерации Topic/CourseLesson/Task через AI —
полное обоснование с источниками в
[`docs/artifacts/learning-science-principles.md`](./artifacts/learning-science-principles.md).
Черновик обязан быть проверен по чек-листу из раздела 8 того документа до перевода в статус
`review`; сам промпт, используемый для AI-генерации, обязан включать этот чек-лист как явное
требование, а не полагаться на то, что модель воспроизведёт эти принципы по умолчанию.

Ниже — полный набор проверок перед переводом `draft`/`review` → `published` (покрывает то, что
чек-лист learning-science-principles.md не покрывает: фактическую корректность и юридическую
чистоту):

**Педагогика** (см. `learning-science-principles.md` §8 для полного чек-листа):
- [ ] Материал реализует обязательные роли §1.4 — Теория → Практика → Результат — и только
  полезные для темы опциональные роли в каноническом порядке; внутренние блоки соответствуют
  назначению роли, а глубина — сложности темы, не искусственному лимиту длины.
- [ ] Каждый `learning_visual` объясняет конкретную закономерность, сравнение, процесс, ошибку или
  этап алгоритма; его ключевые элементы имеют прямую смысловую связь с соседним текстом.
- [ ] Задачи используют `interaction_type: production`, кроме случаев, где сам формат ЕГЭ требует
  выбора варианта.
- [ ] `mastery_threshold` осознанно выставлен, не оставлен дефолтом бездумно.
- [ ] `explanation` каждой задачи — содержательный разбор с объяснением типичной ошибки, а не
  строка «правильный ответ: X».
- [ ] Помощь доступна без искусственной задержки; правильное решение с подсказкой учитывается в
  прогрессе, а слабый результат вызывает рекомендацию повторения, не штраф или скрытый scoring.
- [ ] Medium (`raster`, `structured` или `hybrid`) выбран по учебной эффективности, а не удобству
  реализации; визуал имеет самостоятельный вес в объяснении и не используется как декорация.

**Фактическая корректность:**
- [ ] Математика/логика в `worked_example`/`completion_exercise` проверена человеком вручную, не
  принята на веру из AI-черновика.
- [ ] Все `answer_variants` каждой задачи реально протестированы через checker локально, включая
  нормализацию (§4: ё/е, запятая/точка, обрезка пробелов) — не только «выглядит правильным».
- [ ] Точные данные `learning_visual` и итоговое представление проверены человеком в браузере на
  лишние/пропущенные связи, подписи, числа и смысловые искажения.

**Технически:**
- [ ] `practiceTaskIds`/`topic_ids`/`course_lesson_ids`
  ссылаются на существующие id — проходит CI-валидацию связей (§3, §7.2).
- [ ] Заполнены `title`/`summary` для корректных meta-тегов (§8) — не заглушки вида «TODO».
- [ ] `learning_visual` имеет доступное описание и caption; raster также имеет явные intrinsic
  dimensions и существующий оптимизированный ассет, а сложные точные данные доступны семантически.

**Юридически:**
- [ ] Текст темы и формулировки задач не являются близким пересказом источника — переформулированы
  самостоятельно (§8, «Юридическое (оригинальность контента)»).

Чек-лист хранится рядом с контентом (например, как шаблон PR при добавлении новой темы), а не
только в этом документе.

---

## 3. Data Model

Контент делится на две независимые границы по тому, кто его должен читать:

- **Теория урока — content-as-code в TSX**, не данные. Автор пишет типизированные React-компоненты
  напрямую (`apps/web/src/entities/lesson/content/{slug}.lesson.tsx`, один файл на урок; переиспользуемые
  content-компоненты — `entities/lesson/components/*` для lesson-domain частей типа `WorkedExample`/
  `Diagram`/`Checkpoint`, `shared/components/*` для domain-agnostic частей типа `Callout`, следуя
  существующим слоям FSD-like архитектуры, §"Frontend layers" в `docs/STACK.md`), версионируется
  через git как обычный исходник. Компилятор TypeScript проверяет обязательную форму урока —
  runtime-парсинг Markdown/JSON и ручная валидация роли/порядка секций для теории больше не нужны.
- **Задания — типизированные JSON-файлы** (`content/tasks/{id}.json`), потому что их читают два
  рантайма (frontend для публичной проекции, backend для server-owned проверки ответа) и решение не
  должно попасть в клиентский бандл. Это единственная часть контента, где JSON остаётся обязательной
  границей, а не выбором.

Схема ниже описывает форму TSX-конструктора и JSON-файлов, не таблицы БД.

```text
defineLesson(...) — типизированный конструктор, один вызов на файл урока
  id: slug
  routeSlug: slug                              // публичный путь /ege/{routeSlug}
  taskNumber: int
  title
  summary
  masteryThreshold: float (default 0.8)        // порог доли верных ответов Task, для статуса "усвоено"
  learningOutcomes: [string]
  practiceTaskIds: [task_id]                   // ссылается в content/tasks/**, см. Task ниже
  theory: ConceptBlock[]                       // порядок = порядок массива, без runtime role-инварианта
  examFocus: ReactNode
  checkpoint: CheckpointItem[]                 // формативная самопроверка, не входит в masteryThreshold
  result: ReactNode
  status: draft | review | published
  accessTier: free | paid                      // задел под монетизацию — не enforced на MVP

ConceptBlock — единица нарезки теории по одной идее, не по произвольной длине файла
  id: slug                                     // якорь в outline и точка для будущего interleaving
  navLabel: string
  explanation: ReactNode                        // проза; не дублирует то, что уже показывает diagram
                                                 // (redundancy principle)
  diagram?: <Diagram/>                          // только когда объяснение требует одновременно держать
                                                 // в голове ≥3 взаимосвязанных величин (split-attention)
  workedExample?: <WorkedExample/>               // предшествует любой самостоятельной попытке
                                                 // (worked-example effect, см. docs/artifacts/learning-science-principles.md §1.1)
  checkpoint?: CheckpointItem[]                  // локальная самопроверка сразу после смысловой группы
  mistake?: <Mistake/>                           // рядом со своим концептом, не в общем списке в конце
                                                 // (signalling principle)

Diagram — готовый asset-образ, не runtime-данные
  src: string                                   // единственный asset; Light-only baseline (§5.3) — без dark-варианта
  alt: string                                    // обязателен независимо от того, что изображение статично
  caption: string
  purpose: string

CheckpointItem — формативная (не суммативная) самопроверка внутри урока
  id: slug
  prompt: ReactNode
  reveal: ReactNode                              // think-then-reveal: без валидации ответа, без обращения
                                                 // к backend, не учитывается в masteryThreshold — эффект
                                                 // тестирования (testing effect) даёт сама попытка вспомнить,
                                                 // а не факт автоматической проверки

CourseDefinition — типизированный frontend registry record
  id: slug
  routeSlug: slug                              // публичный путь /courses/{routeSlug}
  title
  summary
  audience: string
  learningOutcomes: [string]
  status: draft | review | published
  stage: early_access | complete
  modules: CourseModule[]

CourseModule
  id: slug
  title
  summary
  lessonPlan: [LessonPlanItem]                 // единый публичный порядок, включая будущие шаги

LessonPlanItem
  id: course_lesson_id                         // совпадает с CourseLesson.id после авторинга
  title
  outcome                                      // один наблюдаемый результат, не перечень синтаксиса

Плановый `id` может ещё не иметь CourseLesson definition. Если definition существует, он обязан
принадлежать ровно одному CourseModule и иметь совпадающий title. Только `published` definition
становится ссылкой, попадает в discovery и учитывается в course progress.

defineCourseLesson(...) — типизированный конструктор, один вызов на файл CourseLesson
  id: slug
  routeSlug: slug                              // /courses/{courseSlug}/{routeSlug}
  title
  summary
  masteryThreshold: float (default 0.8)
  learningOutcomes: [string]
  practiceTaskIds: [task_id]
  theory: ConceptBlock[]
  checkpoint: CheckpointItem[]
  result: ReactNode
  status: draft | review | published
  accessTier: free | paid

Topic и CourseLesson используют только доказанно общие content/practice/progress primitives.
Registries, route data и page composition остаются раздельными; generic lesson engine не вводится.

Task (content/tasks/{id}.json, practiceTaskIds ссылается сюда)
  id
  topic_ids: [topic_id]                         // владение Topic; пусто для CourseLesson task
  course_lesson_ids: [course_lesson_id]         // владение CourseLesson; пусто для Topic task
  title
  statement
  hint
  theory_links: [{ hash, label }]                // hash указывает на ConceptBlock.id
  checker_type: exact_match | numeric_tolerance
  answer_variants: [string]                     // все допустимые написания верного ответа (см. §11.1 нормализация)
  numeric_tolerance: float                       // только для checker_type: numeric_tolerance
  interaction_type: production | recognition     // приоритет — production
  explanation                                    // ContentBlock[], полноценный worked-example-разбор
  difficulty: 1-3
  is_interleaving_eligible: bool (default true при published)

Публичная server-loaded проекция Task включает условие, подсказку, ссылки на теорию и
`explanation` как отдельное развёрнутое «Решение» со структурированными шагами/кодом. Она никогда
не включает `answer_variants`, `numeric_tolerance` или иные checker-секреты. До hydration
подсказка и решение остаются линейно читаемыми; после enhancement раскрываются независимо друг от
друга по явному действию ученика.

ContentBlock — контракт ответа `POST /api/tasks/{id}/check` (§4), без изменений
  type: text | learning_visual | code_example | worked_example | completion_exercise
        | productive_failure_prompt | callout | video_embed
  data: <зависит от типа>
  // learning_visual.data — discriminated representation: raster | structured | hybrid;
  // общие поля: purpose, accessible_description, caption.

LearningFlowPolicy (продуктовый контракт, не отдельный runtime-объект)
  section_order: theory (ConceptBlock+) -> exam_focus? -> checkpoint? -> practice -> result
  task_order: nondecreasing difficulty внутри первого прохождения материала
  task_hints: immediately available inside practice
  assisted_correct_attempts: count toward progress
  weak_outcome: result recommends targeted review
  forbidden_without_new_decision: timers | delayed hints | final no-hint exam | assistance penalty

-- БД (Postgres), отложено до финального M4, только агрегированная аналитика практики --
task_attempt_stats(task_id, attempts_count, wrong_count, last_aggregated_at)
  // не часть M3; точную форму решить только на M4 (может быть заменено событиями Umami,
  // если этого достаточно для приоритизации тем)
```

CI-валидация: `scripts/validate-content-links.mjs` проверяет Course/module/lesson membership,
`practiceTaskIds`, `topic_ids`, `course_lesson_ids` и `theory_links.hash`. Каждый Task принадлежит
хотя бы одному Topic или CourseLesson, а смешанное владение не используется как скрытая связь
между доменами. Эти связи пересекают TSX и JSON и не могут быть проверены одним TypeScript-
компилятором; сборка падает при битых ссылках.

---

## 4. API / Backend Contract

Backend сохраняет content/task schemas и проверку ответа как независимый контур. Реальные
task-файлы первой review-only темы читаются frontend-consumer без checker-секретов; endpoint
неизвестного task id отвечает `404`.

| Verb / Method | Path | Auth | Response / Payload |
|---------------|------|------|---------------------|
| `POST` | `/api/tasks/{id}/check` | Нет (публичный, анонимный) | Запрос: `{ answer: string }`. Ответ: `{ correct: bool, explanation: ContentBlock[] }`. Ограничен на уровне Nginx (§7.2, §8): `limit_req` 20 req/min/IP, burst 5 |
| `GET` | `/health/live` | Нет | `{ status: "ok", version: string }`; проверяет только доступность процесса |
| `GET` | `/health/ready` | Нет | `{ status: "ok", version: string }` при доступной БД, `503` при неготовности зависимости |
| `GET` | `/health` | Нет | Совместимый alias для `/health/ready` |

Проверка ответа применяет нормализацию к введённому ответу и к каждому `answer_variants` перед
сравнением (§11.1): обрезка пробелов, схлопывание внутренних пробелов, регистронезависимость,
нормализация «ё»/«е», числовая эквивалентность форматов (запятая/точка), допуск
`numeric_tolerance` для `checker_type: numeric_tolerance`, явная фиксация значимости порядка для
ответов-списков (per-task, не угадывается на проверке).

---

## 5. Frontend / Client Contract

### 5.1 Pages

| Page | Route | Purpose |
|------|-------|---------|
| Public home | `/` | Минимальная SSR/no-JS точка входа в опубликованные материалы: честное описание продукта и ссылки только на реально опубликованные уроки |
| Course overview | `/courses/$courseSlug` | SSR/no-JS обзор самостоятельного мини-курса: аудитория, результат, stage и полная карта из 28 уроков; только опубликованные CourseLesson становятся ссылками и единицами прогресса |
| Course lesson | `/courses/$courseSlug/$lessonSlug` | Общий SSR consumer типизированного CourseLesson; `review` доступен по прямому URL с `noindex,nofollow`, `published` входит в course discovery |
| Lesson design lab | `/lab/lesson` | Unlisted/noindex эталон четырёхраздельного урока на синтетическом контенте; не публикация и не security boundary |
| Design system stand | `/lab/design-system` | Unlisted/noindex приватный стенд текущей дизайн-системы (шрифты, цвета, типографика) и переиспользуемых lesson-компонентов; не публикация и не security boundary |
| Topic lesson | `/ege/$slug` | Общий SSR consumer типизированного Topic; `review` доступен только по прямому URL с `noindex,nofollow`, `published` может войти в prerender/public discovery |
| Privacy | `/privacy` | Публичное описание целей, состава, сроков и получателей обработки, контакта для обращений и способа изменить optional analytics consent |
| Robots | `/robots.txt` | Машиночитаемые правила обхода и ссылка на sitemap; не используются как замена page-level `noindex` |
| Sitemap | `/sitemap.xml` | Только canonical URL публичной главной, privacy и `published`-уроков; review/lab/404 не включаются |
| Not found | любой неизвестный маршрут | Общий доступный 404 без предположений о будущем IA |

Текущий public release не вводит отдельный каталог: `/` группирует registry-derived мини-курсы и
темы ЕГЭ как два разных вида материала. `review`-контент не появляется в навигации или sitemap,
отдаёт `robots: noindex,nofollow` и исключается из prerender discovery. `/lab/lesson` и
`/lab/design-system` сохраняют тот же unlisted/noindex режим независимо от product content.
Каждая индексируемая HTML-страница имеет абсолютный canonical на `https://infraege.ru`, уникальные
title/description и достаточные social metadata; sitemap и prerender строятся из того же
publication registry, чтобы статусы не расходились между рантаймами.

### 5.2 Components / Stores

| Component / Store | Purpose | Notes |
|--------------------|---------|-------|
| Lesson content components | Переиспользуемая библиотека дизайн-системы урока: `Notation`, `Callout`, `WorkedExample`, `Procedure`, `Mistake`, `Diagram`, `Checkpoint` | Типизированные React-компоненты, не markdown-директивы; `Notation` различает inline-код и формулу без appearance-led API; `Diagram` используется только когда изображение действительно помогает и требует `alt`/`caption`/`purpose`; `Checkpoint` рендерит `CheckpointItem[]` вертикальным списком (не табами — таб-навигация позволяет незаметно пропустить пункт retrieval-практики) и может завершать конкретный `ConceptBlock` вместо единственного блока перед практикой |
| Lesson outline | Иерархическая навигация по уроку | Строится напрямую из `ConceptBlock[].id`/`navLabel`, без regex-извлечения заголовков из текста и измеряемых SVG-связей; desktop shell сохраняет три колонки — sticky outline, центральный reading stream и зарезервированную правую колонку; progress в rail/header отсутствует, а правый rail может оставаться пустым до появления полезного контента; overflow rail включается только при необходимости, на узких экранах навигация возвращается в normal flow; lab сохраняет свой четырёхраздельный synthetic contract |
| Course overview | Самостоятельная карта курса | Показывает аудиторию, learner outcome, stage `complete` и упорядоченную программу из 28 опубликованных уроков; каждая строка является обычной индексируемой ссылкой без дат, locks и disabled controls |
| Course progress | Производный progress только по доступным CourseLesson | Не имеет отдельного store или storage key: после hydration читает записи всех 28 опубликованных уроков из единого lesson-progress registry. Формулировка «освоено N из M доступных» описывает фактический набор, а course-wide reset отсутствует |
| Practice tabs | Локальная навигация по постепенно усложняющимся задачам внутри `practice` | Компактные доступные вкладки показывают рост сложности нейтральным индикатором уровня и текстом; одна активная задача после hydration, свободный ручной переход без блокировок и автопродвижения, одна или несколько task-specific ссылок на фрагменты теории рядом с заголовком; независимые «Подсказка» и развёрнутое «Решение» доступны сразу и остаются линейным содержимым в SSR/no-JS; все формы остаются в SSR/no-JS HTML и не становятся пунктами lesson outline |
| Page state primitives | Единые loading/skeleton, empty, not-found и recoverable error состояния | Семантический статус и понятное действие важнее декоративной анимации; skeleton повторяет геометрию страницы и не озвучивается скринридером как контент |
| Route resilience shell | Route-level pending/error/not-found UI, retry/reset и верхний navigation progress | Ошибка одной навигации не ломает document shell; предыдущий полезный экран не заменяется мгновенным мигающим fallback |
| Typed API client | Единственная граница runtime HTTP для `apps/web`, сгенерированная из FastAPI OpenAPI | Feature `api/` вызывает типизированный shared client; transport/HTTP/contract errors различимы, abort/timeout и безопасные сообщения обязательны |
| Query client | Будущая граница runtime server-state, mutation lifecycle, cache/retry/cancellation | Не дублирует local UI или URL state; сейчас product queries отсутствуют |

Lab использует локальное демонстрационное состояние hint/incorrect/correct и пять синтетических
задач, чтобы проверить полный progress/mastery contract до появления публичного consumer. Верные
задачи и фактически принятые введённые значения сохраняются через версионированный SSR-safe
localStorage, четыре из пяти означают освоение; checker-ответы в это хранилище не попадают;
API и аккаунт не используются. Интерактивные вкладки при каждом входе начинают с первой задачи,
не сохраняет активную позицию или черновики, оставляет все шаги доступными и переходит дальше
только по явному действию ученика. Каждая задача получает одну или несколько ссылок к связанным
фрагментам теории прямо рядом с заголовком, без отдельной плашки, а no-JS показывает все задачи
последовательно. Позиция чтения, текущий раздел и выбранная задача остаются отдельными
навигационными сигналами и не увеличивают учебный прогресс. Публичные lesson routes используют тот
же durable flow, но получают реальную TSX-теорию и server-loaded Task-проекции.

### 5.3 Design System

Frontend использует локальную доменную UI-систему поверх Base UI и CSS Modules. Первый активный
визуальный профиль **«Инженерная тетрадь»** сочетает нейтральную светлую поверхность,
читающий serif и компактный sans/mono-интерфейс без фоновой текстуры. Поставленный архитектором
`docs/artifacts/final_logo.svg` является единственным master-файлом identity layer: крупные
применения сохраняют его трёхкаменную геометрию и исходные `#FF6B00` / `#393939`, а favicon
16/32 px использует оптически упрощённую трёхэллипсную производную. Финальный вертикальный знак
стоит рядом с живым Literata-wordmark, где `ege` использует контрастный производный `#F56300`
(3.15:1 на белом). Структурные линии public chrome,
подчёркивания ссылок, recognition-поверхности notation/code, кнопки, badges, обычные reading
surfaces и их состояния остаются нейтральными; status-цвета и syntax-роли независимы от бренда.
Иерархию по-прежнему создают два нейтральных уровня текста,
whitespace, muted surfaces и тонкие borders. Статичные поверхности и controls плоские: один блок использует не
более одного поверхностного сигнала (fill, border или будущая обоснованная overlay-тень), без
вложенных карточек и декоративного elevation. Система по умолчанию dense: связанные controls
согласованы по высоте `40px`, но зоны взаимодействия не уменьшаются; группы строятся прежде всего
на расстоянии и выравнивании, а разделительная линия остаётся только там, где несёт структурный
смысл.
Профиль намеренно заменяем: палитра, шрифты, геометрия и motion меняются в theme layer; устройство
контрола — внутри локального компонента; композиция страницы — без переписывания domain/API/content
state. Публичные component API описывают назначение, а не текущий внешний вид. Обязательный
frontend-контракт и происхождение адаптированных практик зафиксированы в `docs/FRONTEND.md`.

### 5.4 Client Application Infrastructure

- **Контракты API:** FastAPI OpenAPI экспортируется детерминированно и является источником
  генерируемых `openapi-typescript` типов. `openapi-fetch` — единственный shared transport;
  feature-срезы не вызывают нативный `fetch` и не описывают response types вручную. Generated-файл
  не редактируется, а schema drift проверяется отдельной gate-командой.
- **Server state:** TanStack Query владеет только runtime запросами/мутациями. Query client
  создаётся SSR-safe, не разделяется между server requests и не пересоздаётся при Suspense на
  клиенте. Для мутаций автоматический retry по умолчанию запрещён; повтор выполняется явно
  пользователем, чтобы проверка ответа не отправлялась незаметно дважды.
- **Ошибки и восстановление:** transport, timeout/abort, HTTP и malformed-contract failures имеют
  различимые технические категории, но безопасный русский user-facing текст. Route error boundary
  даёт повторить загрузку или вернуться к рабочему маршруту; ожидаемые form/API ошибки остаются
  inline и не превращаются в глобальные toast. Тела ответов, введённые ответы и URL query/hash не
  попадают в telemetry.
- **Loading / empty / not-found:** быстрые переходы не мигают skeleton; медленные используют
  геометрически стабильный skeleton и верхний progress. Empty state объясняет причину и предлагает
  следующее доступное действие. Not-found отделён от инфраструктурной ошибки.
- **Suspense и lazy:** route splitting остаётся инфраструктурной возможностью; lazy применяется
  только вместе с измеримым выигрышем и полноценным SSR/no-JS fallback.
- **UI foundation:** Base UI 1.7.0 предоставляет доступное поведение там, где существует подходящий
  primitive. Локальные компоненты владеют публичным API и CSS; новые primitives и составные
  библиотеки добавляются только с реальным consumer и maintenance/a11y/supply-chain проверкой.
- **Client state:** глобальный store не вводится заранее. Компонентное состояние остаётся локальным,
  server state принадлежит Query, URL state — Router. Доказанное исключение — app-scoped Zustand
  registry для lesson progress: несколько независимых Topic/Course/lab consumers читают его через
  семантические hooks, а versioned localStorage adapter владеет persistence и миграцией старых
  lesson-specific ключей. Course progress остаётся производным selector и отдельно не хранится.
- **Визуальная системность:** значения активной темы отображаются в semantic CSS tokens, которые
  потребляют локальные компоненты. Base UI не определяет внешний вид и не выходит типами/props за
  их public API. Light-only baseline использует self-hosted кириллические шрифты без runtime-запроса.

---

## 6. Auth & Access Model

Нет аутентификации на MVP. Публичные страницы и `POST /api/tasks/{id}/check` анонимны; прогресс
урока хранится только в localStorage текущего браузера и не синхронизируется. Ограничение на уровне
инфраструктуры (не auth) — rate limiting чекер-эндпоинта на Nginx (§4, §8) против автоматического
перебора банка ответов.

Поле `access_tier: free | paid` в модели `Topic`/`CourseLesson` — задел под будущую монетизацию
(§8), не enforced ни на backend, ни на frontend на MVP; все `published`-записи считаются `free`.
Аккаунты, роли пользователей и платный доступ — вне MVP (§10).

---

## 7. Infrastructure and Deploy/CI

### 7.1 Infrastructure

Один VPS в московском дата-центре на старте, без отдельного preview/staging-стенда: Ubuntu 24.04
LTS, AMD EPYC 7502, 2 vCPU, 4 ГБ RAM, 40 ГБ disk. Следующая ступень — 4 vCPU, 8 ГБ RAM,
80 ГБ disk — применяется, если 24-часовой production soak показывает меньше 25% свободной RAM,
swap thrashing или устойчивую загрузку CPU выше 70%. Тестирование локально максимально повторяет
production через общий Compose и development overlay.

Application и observability используют один VPS на текущем beta-этапе, но принадлежат разным
lifecycle-контуром:
- **Nginx** — единственная точка входа (80/443), reverse-proxy для web/API и статики.
- **Frontend (TanStack Start/Nitro)** — Node runtime с prerendered публичным входом, legal
  surface, двумя опубликованными TopicLesson и 28 опубликованными CourseLesson routes; review/lab
  routes остаются noindex.
- **Backend (FastAPI/Uvicorn)** — отдельный контейнер, доступен Nginx по внутренней docker-сети,
  наружу не смотрит напрямую.
- **Postgres** — отдельный контейнер, volume + регулярный `pg_dump`-бэкап (§8).
- **Operations stack** — Umami, Beszel и необходимые gateways физически остаются на application
  VPS, но их установка, конфигурация, backup/restore и release lifecycle принадлежат небольшому
  модулю `ops/` этого репозитория. Активное состояние — отдельный Compose project с собственными
  volumes без переноса этой логики в [sre-kit](https://github.com/avatarsik6699/sre-kit).
- **Граница infraegev2** — репозиторий владеет application telemetry и всей автоматизацией,
  зависящей от его VPS, routing, Compose и data layout. sre-kit получает только versioned Source
  registration и Metric/Check/Event, не хранит deployment SSH credentials и не запускает target
  mutations.

Термин `apps/ops` далее означает логический operations-контур, а не возвращение удалённого Node
BFF/React dashboard и не новый pnpm workspace. Канонический пакет живёт под `ops/`: Compose,
защищённый environment, короткие lifecycle-скрипты и Source template. UI мониторинга остаётся в
sre-kit без Apply/Rollback действий. Универсальный desired-state/reconcile engine для одного VPS
не является частью архитектуры; изменения общего интеграционного контракта получают связанные
active Backlog items в обоих репозиториях.

**Публичный edge:** `infraege.ru` зарегистрирован и использует DNS reg.ru. На первом релизе трафик
идёт напрямую `infraege.ru → Nginx`, без CDN; `www.infraege.ru` перенаправляется на canonical apex.
Nginx выставляет `Cache-Control`/`ETag` для хэшированной статики, не кэширует API и проксирует
публичный tracker Umami same-origin. TLS — Let's Encrypt с автоматическим renewal; HSTS включается
только после успешного renewal drill. CDN пересматривается по фактической географии и нагрузке.

### 7.2 Deploy / CI

- Development Compose собирает исходники локально; production overlay использует immutable
  GHCR-образы `web`, `api`, `nginx`, помеченные полным commit SHA, без bind mounts исходников.
- Публичный GitHub-репозиторий — `avatarsik6699/infraegev2`. CI запускает только статические,
  build и security проверки; Vitest, pytest и Playwright остаются строго локальными.
- Production deploy запускается вручную через `workflow_dispatch`: SSH host-key verification,
  pull выбранного SHA, Compose replace, smoke/health и автоматический rollback на предыдущий SHA.
  Branch protection для `main` пока не включается, поскольку над проектом работает один человек.
- Основной контракт администрирования VPS — публичный SSH только для `root` с уникальным длинным
  паролем; public-key и keyboard-interactive authentication отключены, отдельные `operator`,
  `deploy` и `ops-reader` не активны. GitHub Environment сохраняет reviewer approval и pinned host
  key и получает root-пароль только как protected secret для ручного `workflow_dispatch` deploy.
  Архитектор осознанно принимает риск полного захвата VPS при компрометации пароля. Переход на
  key-only identities не входит в текущий или планируемый roadmap и возвращается в scope только по
  новому явному решению архитектора.
- CI-валидация связей контента: скрипт проверяет, что `prerequisites`/`related_topics`/
  `unlocks_topics`/`practice_task_ids`/`topic_ids` ссылаются на существующие id — сборка падает при
  битых связях, до того как они попадут в прод (см. §3, §2.3).
- Резервное копирование: application и operations независимо создают tagged snapshots в общем
  локальном Restic repository. Application сохраняет свой `pg_dump -Fc` и environment;
  operations — Umami dump, Beszel state и свой environment. Для каждого тега действуют 7 daily,
  4 weekly, 3 monthly, отдельный freshness marker и ежемесячный restore drill. Потеря всего VPS
  уничтожит и локальные бэкапы — принятый риск до отдельной задачи с российским S3-compatible
  storage.

**Наблюдаемость** (источники на application VPS, внешний monitoring core):
- **Umami v3** — отдельная БД/роль в Postgres; без fingerprinting/query/hash. Browser script,
  pageviews и allowlisted learning-flow events загружаются только после явного opt-in и перестают
  отправляться после отзыва. Necessary server/security logs и coarse aggregates имеют отдельную
  цель и disclosure и не называются согласованной browser analytics.
- **Beszel Hub + Agent** — host/container metrics и история на application VPS.
- **journald + fail2ban** — структурированные application/Nginx/security logs; journald доступен
  через WireGuard-only gateway, fail2ban читается sre-kit через основной root/password SSH
  контракт.
- **sre-kit core** — наш first-party sibling и владелец adapters, Source configuration,
  normalization, alerts и monitoring UI. Change 26 поставляет generic release bundle, а этот
  репозиторий владеет конкретной установкой на management VPS `sre.infraege.ru`, отдельным
  WireGuard peer `10.77.0.3/32`, infraegev2 Source bootstrap и publisher lifecycle. Core читает
  private sources через WireGuard/API/SSH, но не управляет target stack. Его SQLite, encrypted
  adapter secrets и runtime data не попадают в git или application VPS.
- **Внешняя доступность** — временный scheduled GitHub Action проверяет сайт, readiness и TLS.
  Подключение существующего sre-kit Telegram channel к infraege и отдельный внешний management/
  monitoring server отложены; alert engine не дублируется в этом репозитории.

### 7.3 Operations and sre-kit integration contract

```text
infraegev2 ops package ── pinned SSH/Compose/systemd ──> application VPS operations stack

sre-kit operator ── registers Source config in sre-kit ──> adapter engine
sre-kit adapters ── WireGuard/private API/read-only SSH ──> infraegev2 observability targets
                <── normalized Metric/Check/Event results ──┘

application VPS
  ├─ infraege Compose: nginx, web, api, application Postgres
  └─ separate infraege-ops Compose project: Umami, Beszel, gateways
```

Обязательные инварианты границы:

- application release не запускает `docker compose up/down` для operations stack и не удаляет его
  containers/volumes через `--remove-orphans`; operations release не меняет application containers;
- target stack имеет фиксированный Compose project, release directory, labels, healthchecks и
  private-only bindings; повторный `docker compose up` обновляет тот же stack, а не создаёт второй;
- Beszel Agent остаётся в host-network mode, а read-only Docker socket proxy публикуется только на
  `127.0.0.1:2375` через отдельную non-internal bridge network; proxy разрешает только необходимые
  read endpoints и запрещает POST;
- публичный Umami collector остаётся узким same-origin маршрутом Nginx к private target endpoint;
  UI/admin ports не публикуются в Интернет;
- приложение публикует только стабильные сигналы: health/version endpoints, structured journald
  labels и privacy-safe Umami collector. Ops lifecycle и application deploy не зависят от доступности
  sre-kit;
- deployment secrets принадлежат защищённому infraegev2 ops environment; adapter secrets
  передаются в sre-kit только через его versioned registration API и никогда не попадают в git;
- по решению архитектора beta-данные существующих Umami/Beszel не переносятся: новый operations
  stack стартует с пустыми volumes и новым набором Sources. Старые containers/volumes сохраняются
  только на ограниченный rollback-период и удаляются позднее отдельным явно destructive шагом;
- недоступность sre-kit не останавливает target tools или ops automation; management VPS даёт
  круглосуточный polling независимо от workstation, но потеря application VPS по-прежнему
  одновременно делает его private Sources недоступными;
- management VPS использует собственный WireGuard key и `10.77.0.3/32`; workstation peer
  `10.77.0.2/32` сохраняется и никогда не копируется на сервер.

Operations package намеренно остаётся небольшим. `config` локально проверяет Compose с защищённым
env; `status` читает состояние установленного project через pinned SSH; `install` и `update`
передают один Compose release и запускают `pull` + `up --wait`; `rollback` повторно применяет
предыдущий release. Эти команды не моделируют собственный desired state, effect graph, checkpoint,
revision или outbox: декларативным состоянием сервисов уже владеет Compose.

Release содержит Compose definition и три коротких maintenance-скрипта для backup, restore proof и
retention. Значения передаются отдельным mode-600 environment и хранятся на VPS по release id; они
не входят в archive или git. Operations command никогда не меняет application Compose. Split-stack
cutover завершён; обычные последующие operations releases используют `update`, а `install`
остаётся только для действительно нового target без `/opt/infraege-ops/current`.

Публичный same-origin Umami collector в активной production definition использует одну
созданную external Docker network `infraege-observability-ingress`. Оба Compose project только
подключаются к ней; Umami получает стабильный alias `umami`, а Nginx остаётся также в application
network для web/api. Создание сети — одна явная lifecycle-операция, а не отдельная модель ресурсов.

Первый авторизованный fresh-start cutover был безопасно откачен из-за недоступного WireGuard port
Beszel Hub. Второй доказал исправленную dual-network связность и зарегистрировал Agent, но также
был откачен: operations backup ошибочно исполнял Compose env как shell, а Beszel public key содержит
пробел. Maintenance-скрипт больше не source-ит env и получает его только через Compose
`--env-file`. Финальный retry на `ad6df05fa7d44e7a4f9434c196091ed4890e2f49` прошёл: application
и operations используют независимые Compose projects, Umami/Beszel доступны только через
предусмотренные public/private маршруты, Agent имеет статус `up`, backup/restore proof успешны и
три operations timers активны. Legacy volumes сохранены как rollback-only; их удаление или перенос
данных требуют отдельного явно одобренного действия.

`ops/observability/sre-kit-sources.example.json` — secret-free операторская подсказка, а не новый
универсальный deployment contract. Текущий шаблон содержит Project, шесть pull Sources и один
push Source и согласован с manifests/ingress sre-kit Change 22; реальные accounts/secrets вводятся
только в sre-kit. Beszel Source reconciliation получает system id по единственному system record с
настроенным именем и требует свежие container statistics; ноль или несколько совпадений блокируют
reconciliation. Ранее Change 20 примирил stale pre-cutover состояние с шестью уникальными enabled
pull Sources и доказал повторный свежий polling,
quiet success, обратимый failure/recovery и authenticated Dashboard/Sources/detail rendering без
target-side mutations. Это завершает integration proof, но не обещает круглосуточные alerts при
выключенном локальном core и не меняет независимый Compose lifecycle.

Traffic publisher принадлежит infraegev2 в обоих режимах. Локальный `sre-kit-local` остаётся
ручным fallback; management-host system timer использует отдельный WireGuard peer, читает Nginx
journal entries и отправляет batch только в loopback ingress core. Оба режима немедленно сворачивают
combined-log записи до path/status-family/coarse traffic class. Raw IP, request id, referrer и
полный user agent не записываются в state или batch. State содержит только opaque journal cursor;
он продвигается после успешного ingestion, а повтор диапазона использует стабильный
`Idempotency-Key`. Локальный и management cursors независимы и не копируются друг в друга.

---

## 8. Non-Functional Requirements

| Concern | Requirement |
|---------|-------------|
| Security headers / CORS | Rate limiting чекер-эндпоинта на Nginx: `limit_req_zone` 20 req/min/IP, burst 5, `nodelay` (см. §4, §11.2 источника) — против автоматизированного перебора банка ответов; конкретную цифру пересмотреть по факту логов после запуска. Основной public root/password SSH использует принятый архитектором минимум 12 символов, pinned host key, UFW, fail2ban и GitHub Environment approval; повышенный риск перебора и полного захвата VPS при компрометации более короткого пароля осознанно принят, key-only migration не запланирована. |
| Accessibility target | Foundation и lab не имеют serious/critical axe violations; lesson outline сохраняет вложенный semantic list, anchors, keyboard focus, различимый текущий пункт и корректный source order, а сложный визуал имеет видимую полную текстовую альтернативу |
| Performance budget | LCP ≤ 2.8s, CLS < 0.1, INP < 200ms на мобильном 4G-профиле; release evidence измеряет `/` и первый опубликованный `/ege/16-rekursiya`, отдельно проверяет cold-load font/layout shifts и не подменяет route-level метрики общей оценкой технической страницы |
| Observability | Application, operations и management-host sre-kit имеют независимые lifecycle/volumes/rollback. infraegev2 владеет target operations, WireGuard peer, Source bootstrap и privacy-safe publisher; sre-kit владеет generic core/adapters/UI distribution. Семь clean-start Sources непрерывно poll/push на management VPS без target-side mutation; локальный `sre-kit-local` остаётся выключенным fallback |
| Backup / restore | Application и operations jobs используют отдельные Restic tags, restore proofs и status markers в общем encrypted repository. Operations timers активируются только после clean install, без импорта старых Umami/Beszel artifacts. Для каждого владельца сохраняются 7 daily + 4 weekly + 3 monthly и общий same-host/off-site risk |
| SEO | `/`, `/privacy`, published topics, courses и CourseLesson имеют canonical, уникальные metadata, SSR content, общий crawlable social preview и входят в sitemap/prerender; root document публикует browser-only manifest, SVG/PNG/ICO favicon и Apple touch icon из production-знака, а `/` — правдивый `WebSite` JSON-LD без выдуманной Organization; lab и review routes остаются unlisted, `noindex,nofollow` и исключены из public discovery; Lighthouse SEO для публичных маршрутов проходит без ошибок |
| Mobile / no-JS readability | Lab, TopicLesson, Course overview и CourseLesson сохраняют текст, программу, подписи, решения и section anchors в SSR HTML; интерактивная проверка и персональный progress остаются progressive enhancement |
| Client resilience / API drift | Route failures восстанавливаемы без белого экрана; loading/empty/error/not-found состояния доступны с клавиатуры и скринридера; OpenAPI schema/types drift ломает gate до merge; runtime HTTP имеет timeout/abort и не делает скрытый retry мутаций |
| Юридическое (152-ФЗ) | `/privacy` публикует фактические цели, состав, сроки и получателей обработки, `avatarsik6699@gmail.com` и Telegram invite как каналы связи, но по явному решению архитектора не публикует ФИО и адрес оператора с принятием сопутствующего риска. Optional browser analytics требует отдельного явного согласия и допускает отзыв на `/privacy`; продолжение использования сайта согласием не считается. Формальная проверка уведомления РКН, локализации и текста юристом остаётся обязательным внешним follow-up, а не заявляется выполненной |
| Юридическое (436-ФЗ) | Возрастная маркировка для обычного сайта не вводится: существующая `12+` удаляется без замены на `18+` |
| Юридическое (оригинальность контента) | Тексты тем и формулировки задач — собственного авторства/переформулированы, не дословные копии ФИПИ/sdamgia/kpolyakov (риск конфликта с площадками, не только вопрос добросовестности); проверяется в Content Quality Gate (§2.3) на каждой теме перед `published` |
| Other (юридический ориентир, не консультация) | Открытые источники используются как инженерный ориентир; формальная юридическая проверка и РКН составляют принятый бессрочно отложенный риск, а не пункт текущего roadmap |

---

## 9. Roadmap

| Milestone | Status | Goal | Key Outputs |
|-----------|--------|------|-------------|
| `M0` — технический фундамент | complete | Сохранить проверенную web/backend/ops инфраструктуру без навязывания продуктовой страницы | Исторический neutral baseline, shared primitives, API contract, content skeleton и локальные gates |
| `M1` — новый product/design baseline | complete | Доказать заменяемую визуальную систему без преждевременной публикации | «Инженерная тетрадь», unlisted design-system/lesson labs, единый frontend-контракт и reusable primitives |
| `M2` — инфраструктурная пауза | complete | Подготовить production-платформу до продолжения продуктового контента | `infraege.ru`, VPS/GHCR deploy, security/release gates, backups и независимый operations stack активны; linked sre-kit Change 20 доказал все шесть Sources end to end |
| `M3` — учебный flow и публичный запуск | in progress | Завершить доменную логику, основные поверхности сайта и проверенный MVP-контент до расширения каталога | Два TopicLesson и все 28 одобренных Python CourseLesson локально опубликованы и слиты в `main` без Topic-связей; внешний release остаётся отдельным шагом |
| `M4` — финальное измерение и эксплуатация | in progress | Измерять посещаемость прозрачно и обезличенно без опережающей детализации | Consented Umami pageviews/sessions и разрез по путям плюс privacy-safe Nginx aggregates уже закрывают текущую потребность; дальнейшая event-level аналитика отложена, все dashboard surfaces остаются в sre-kit |
| `M5+` (после первых данных, вне MVP) | deferred | Расширение охвата и сообщества поверх работающей бесплатной базы | Второй мини-курс (Excel), аккаунты/синхронизация, обсуждения тем с модерацией, затем платные фичи — без runtime AI до этого момента |

### 9.1 Current execution sequence

| Order | Scope | Exit evidence |
|-------|-------|---------------|
| `0` | Завершить документационные infraegev2 Change 44 и sre-kit Change 19 | Complete: документы обоих репозиториев согласованы, stale local Source state зафиксирован без секретов, runtime не мутировался |
| `1` | В sre-kit Change 20 сверить и доказать шесть infraegev2 Sources | Complete: stale записи безопасно инвентаризированы; все шесть текущих конфигураций зарегистрированы; доказаны свежие polling/status/dashboard и failure/recovery evidence |
| `2` | Провести product-readiness audit двух опубликованных уроков | Complete: вход, оба урока, checker/persistence/recovery, mobile/no-JS, trust, crawl и production/monitoring evidence проверены; находки `PR-01`–`PR-07` ранжированы в `docs/artifacts/product-readiness-audit-2026-08-20.md` |
| `3` | Закрыть Change 46 — анонимный progress/result/continuation loop | Complete: browser journey показывает solved/mastery result, сбрасывает только текущий урок и переводит к другой опубликованной теме или ко всем темам; incorrect/failure/retry/reload/reset/continuation защищены Page Object coverage без аккаунта, новых событий или выдуманных связей |
| `4` | Реализовать и опубликовать первый самостоятельный срез мини-курса Python | Complete: Course/CourseLesson flow, обзор развивающейся программы и урок «Первая программа: ввод, вычисление и вывод» опубликованы без Topic-связей и встроенного code runner |
| `5` | Активировать M4 analytics baseline | Complete: explicit consent и privacy-safe event allowlist работают; семь Sources зарегистрированы, Umami pull и синтетический push batch отображаются без ответов, свободного текста и лишних идентификаторов |
| `6` | Автоматизировать доставку Nginx aggregates в локальной sre-kit-сессии | Complete: cursor и idempotency переживают retry/restart; raw access records не пишутся на диск; publisher стартует и останавливается только через `sre-kit-local`; два реальных цикла доказаны в Dashboard/Source detail |
| `7` | Подключить отдельный always-on sre-kit management VPS | Complete: linked sre-kit Change 26 поставляет exact-SHA distribution; Change 53 создал отдельный WireGuard peer, clean-start Project/семь Sources и system publisher; после пользовательской проверки подтверждены TLS, polling, push, backup/restore и отсутствие влияния на application/Firecrawl lifecycles |
| `8` | Опубликовать второй самостоятельный CourseLesson Python | Complete: урок «Условия: сравнения и выбор из двух вариантов» повторно прошёл Content Quality Gate, стал индексируемым и вошёл в course discovery/progress без Topic-связей и изменения учебного контента |
| `9` | Провести application-gap audit course flow до третьего CourseLesson | Complete: checker, aggregate progress, reset isolation, responsive/no-JS, production и analytics contracts проверены; findings `PC-01`–`PC-04` ранжированы в `docs/artifacts/python-course-application-gap-audit-2026-08-29.md` |
| `10` | Восстановить правдивость продолжения опубликованного Python course flow | Complete: итог первого урока теперь называет условия доступным следующим шагом, а focused browser coverage исключает возврат устаревшего утверждения о подготовке уже опубликованного урока |
| `11` | Зафиксировать достаточность базовой аналитики и продолжить Python course content | Complete: event-level аналитику не расширяли; самостоятельный урок «Ошибки: читаем сообщение и находим причину» подготовлен в `review` с пятью server-owned задачами, упрощённым итогом и inline-подсветкой кода в практике |
| `12` | Опубликовать третий самостоятельный CourseLesson Python | Complete: урок «Ошибки: читаем сообщение и находим причину» повторно прошёл Content Quality Gate, стал индексируемым и вошёл в discovery/progress, sitemap и prerender без изменения учебного контента |
| `13` | Пересмотреть, углубить и опубликовать программу мини-курса Python одним change | Complete: все 28 уроков и 140 server-owned задач прошли содержательную и визуальную оценку, опубликованы локально, зафиксированы и слиты в `main`, включая четыре последовательных стадии менеджера задач; внешний release выполняется отдельно |

Off-site backup остаётся trigger-based улучшением: первый management-host релиз использует
local-only Restic с явно принятым риском потери вместе с VPS. Key-only SSH, Telegram alerts,
формальная юридическая проверка и уведомление РКН намеренно исключены из этой последовательности.
На `/privacy` опубликованы только принятые архитектором контактные каналы; риск отсутствия ФИО и
адреса оператора принят явно.

---

## 10. Out of Scope

- Аккаунты и синхронизация прогресса между устройствами (до `M5+`).
- Обсуждения тем, комментарии, ответы и модерация (до аккаунтов и отдельного `M5+` change).
- Полноценный тренажёр-пробник ЕГЭ с таймером на весь вариант.
- Платные функции любого вида (до `M5+`, и только поверх уже работающей бесплатной базы).
- AI внутри продукта как пользовательская фича (только как инструмент автора при подготовке
  контента, offline).
- Мини-курс Excel и остальные темы ЕГЭ — вторая волна, по той же структуре, что первая.
- i18n/локализация — продукт полностью на русском, аудитория исключительно русскоязычная.
- Полноценный поиск по сайту — пока тем меньше десятка, обычная навигация достаточна.
- Автоматические `Topic ↔ CourseLesson` prerequisites, unlocks, рекомендации и совместное владение
  Task — только после отдельного решения, основанного на реальном пересечении материалов.
- Встроенное выполнение произвольного Python-кода, sandbox и code-submission checker — отдельный
  будущий security/product scope; первый курс использует локальный Python и проверяет наблюдаемые
  короткие ответы.
- Отдельный preview/staging-стенд — тестирование локально повторяет прод (§7.1).
- Онлайн-кассы / 54-ФЗ — возникают только с появлением платежей, не на MVP-этапе.
- CDN и off-site backup — отдельные последующие задачи; локальный core режим остаётся
  поддерживаемым fallback. Telegram уже принадлежит sre-kit, отключён для первого management-host
  запуска и не реализуется внутри infraegev2.
- Формальная юридическая проверка обработки ПДн и вопрос уведомления РКН — бессрочно отложенный
  принятый риск; опубликованные реквизиты оператора не считать доказательством завершённой
  правовой проверки и не планировать дальнейший legal change без нового явного решения архитектора.
- Переход с основного root/password SSH на key-only identities — не планировать без нового явного
  решения архитектора.
- PWA/service worker, offline mutation queue и optimistic updates — только после отдельного
  пользовательского сценария и стратегии конфликтов/устаревания.
- Глобальный client store и Base UI/community primitives без текущего consumer-а — не часть
  клиентского фундамента; добавляются по доказанной потребности (§5.4).
- Дальнейшая детализация product events, funnel-семантики и Product analytics Source — вне
  текущего roadmap, пока consented visits/pageviews и privacy-safe path aggregates отвечают на
  фактические продуктовые вопросы.

---

## 11. Open Questions

- [NEEDS_CLARIFICATION: числовые целевые показатели успеха MVP (объём органического трафика,
  срок, глубина прохождения) — решить после накопления пригодных M4-данных Umami (§1.2).]
- Точная цифра rate limit чекер-эндпоинта (20 req/min/IP, burst 5) — стартовый ориентир,
  архитектор явно указал пересмотреть по факту логов после запуска, не считать зафиксированной
  раз и навсегда (§8).
