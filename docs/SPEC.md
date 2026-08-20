# TECHNICAL SPECIFICATION (SPEC.md): `infraege`

> **For AI agent**: Read this file in full before starting any change. Confirm understanding of
> constraints before running `/plan` or `/work`. When this file changes in a way that affects an
> active `docs/changes/*.md`, note it in that change's Implementation Notes rather than
> hand-syncing a separate contract file — there isn't one.

## Metadata

| Field | Value |
|-------|-------|
| Document Version | `v1.8` |
| Date | `2026-08-20` |
| Architect / Owner | `v.godlevskiy` |
| Stack | See [docs/STACK.md](./STACK.md) |
| Domain | Платформа подготовки к ЕГЭ по информатике — теория, визуализация, практика по темам экзамена, привязанные к мини-курсам |

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
2. **Явные связи между темами.** Ученик видит: «это задание опирается на тему X» и «прежде чем
   идти сюда, разберись с тем». Связи — часть модели данных (`prerequisites`, `related_topics`,
   `unlocks_topics`), а не текст в статье.
3. **Инкрементальный запуск.** Нет этапа «сделать весь курс, потом выложить». Единица релиза —
   одна тема или один мини-курс, полностью готовые (теория + визуализация + практика + связи), а
   не общий каркас с пустыми разделами.

### 1.2 Goal and Success Metrics

Цель MVP — подтвердить, что органический поиск приводит трафик на темы, сделанные по этим
принципам, и что ученики реально проходят путь Теория → Практика → Что важно для ЕГЭ → Результат,
а затем продолжают обучение, а не уходят после первого экрана.

- [NEEDS_CLARIFICATION: конкретные числовые целевые показатели (сколько органических визитов /
  за какой срок / какая глубина прохождения темы считается успехом) не зафиксированы архитектором
  — решить после этапа 4, когда домен, сайт и MVP-контент будут готовы и появятся первые пригодные
  данные Umami, а не гадать заранее.]
- Продуктовая аналитика и новые события Umami откладываются до финального этапа после завершения
  доменной логики, основных поверхностей сайта и MVP-контента. До этого frontend отправляет только
  уже существующий базовый pageview Umami и безопасную telemetry клиентских ошибок; новые события,
  сбор данных и собственные operations-поверхности не добавляются.

### 1.3 Project Boundaries

| Included (MVP) | Excluded (сознательно не входит в MVP) |
|-----------------|------------------------------------------|
| 3–5 самых проблемных тем ЕГЭ (по номерам заданий) полностью: теория + визуализация + практика | Аккаунты и синхронизация прогресса между устройствами |
| 1 мини-курс — Python (закрывает больше всего номеров: 6, 8, 11, 14, 15, 16, 17, 18, 20–27) | Полноценный тренажёр-пробник ЕГЭ с таймером на весь вариант |
| Связи «тема ЕГЭ ↔ урок мини-курса» (двусторонние ссылки + признак «требуется перед этим») | Платные функции любого вида |
| Публичные, индексируемые страницы тем и уроков (SSR/SSG) | AI внутри продукта (только как инструмент автора при подготовке контента) |
| Практика по каждой теме: 5–10 заданий с проверкой ответа, без адаптивного подбора сложности | Мини-курс Excel и остальные темы ЕГЭ — вторая волна, по той же структуре |
| Прогресс на уровне браузера (localStorage), без обязательной регистрации | i18n/локализация (аудитория исключительно русскоязычная) |
| | Полноценный поиск по сайту (пока тем < 10, обычная навигация достаточна) |

Первый публичный product release переводит проверенный урок `/ege/16-rekursiya` в `published`,
заменяет техническую заглушку `/` минимальной публичной точкой входа и возвращает обязательные
SEO/legal surfaces. Lab-маршруты остаются unlisted/noindex и не входят в публичную навигацию.

После публикации `/ege/5-preobrazovanie-zapisey-chisel` расширение каталога временно
останавливается на двух полных уроках. До выбора третьей темы ЕГЭ или начала мини-курса Python
продукт оценивается целиком как приложение: вход и навигация, непрерывность обучения между
уроками, обратная связь о прогрессе, доверие/legal surfaces, production readiness и минимальная
петля обратной связи/измерения. Такая оценка выявляет и приоритизирует конкретные пробелы, но сама
по себе не разрешает аккаунты, новый сбор аналитики, каталог/поиск или другие функции за
пределами текущих MVP-границ.

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
   результатом практики, зонами для повторения и следующим связанным материалом.

Роли идут только в этом порядке; опциональные роли можно пропускать, но нельзя переставлять.
Контент включается только когда помогает понять материал, решить задачу или выбрать следующий шаг.

Подсказки и решение доступны сразу. Правильная работа с подсказкой учитывается в прогрессе; при
слабом результате `result` рекомендует конкретный материал для повторения, а не вводит штраф.
Отдельного финального испытания без подсказок, таймеров, задержек, assisted-solution scoring и
оценки уверенности по каждому шагу нет. Их нельзя добавлять без нового решения архитектора.
Глубина разделов зависит от сложности материала, но линейная модель предпочтительнее скрытого
адаптивного ветвления.

Reset удаляет конкретные публикации и UI-решения, но не этот контракт и не предметную область
продукта. Сохраняются нейтральные сущности Topic/CourseLesson/Task, связи и mastery-семантика;
slug, тексты, ассеты, маршруты и композиции удалённой публикации не являются основанием для нового
дизайна.

---

## 2. Domain Context

### 2.1 Roles and Permissions

| Role | Capabilities | Restrictions |
|------|-------------|--------------|
| `Anonymous learner` | Читает теорию, решает практику, прогресс сохраняется в localStorage браузера | Нет аккаунта на MVP — прогресс не синхронизируется между устройствами |
| `Content author` (архитектор + AI как инструмент) | Пишет/генерирует content-as-code файлы (`content/topics/`, `content/courses/`), ревьюит AI-черновики через git diff, переводит `draft → review → published` | Публикация только через прохождение Content Quality Gate (§2.3); AI не публикует напрямую |
| `Architect` | Владеет `docs/SPEC.md`, принимает архитектурные решения, ревьюит контент перед `published` | — |
| `AI_Agent` | Реализует изменения через `/work`, генерирует черновики контента по промптам с чек-листом из [`learning-science-principles.md`](./artifacts/learning-science-principles.md) (§2.3), запускает гейты через `/ship` | Не переводит контент в `published` самостоятельно; нет прямого push в `main` вне `/ship` |

### 2.2 Key Entities

`Topic` (тема ЕГЭ) `→` `LearningSection[]` (смысловые разделы с типизированными блоками)
`Topic` `↔` `CourseLesson` (двусторонние связи `prerequisites` / `unlocks_topics`)
`Course` `→` `CourseLesson[]`
`Topic` / `CourseLesson` `→` `Task[]` (практика, привязанная к теме, может относиться к нескольким темам)

Контент (`Topic`, `Course`, `CourseLesson`, `Task`, `ContentBlock`) — content-as-code, живёт в git
(`content/`), не в БД (раздел 2.2 ниже). Состояние пользователя (прогресс) — на MVP только
localStorage на клиенте; новая серверная аналитика практики не добавляется до финального этапа
`M4` (см. §3).

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
- [ ] `prerequisites`/`related_topics`/`unlocks_topics`/`practice_task_ids`/`topic_ids`
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
  mistake?: <Mistake/>                           // рядом с объясняемой идеей, не в боковой колонке
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

Course (content/courses/{id}.json) — не затронуто этим изменением, вне текущего этапа roadmap

Task (content/tasks/{id}.json, practiceTaskIds ссылается сюда) — без изменений
  id
  topic_ids: [topic_id]                         // может относиться к нескольким темам
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

CI-валидация: `scripts/validate-content-links.mjs` проверяет, что `practiceTaskIds` и
`theory_links.hash` ссылаются на существующие `Task.id`/`ConceptBlock.id` — эта связь соединяет
TSX-модуль урока с JSON-файлами заданий и не может быть проверена одним TypeScript-компилятором;
сборка падает при битых связях (см. §2.3 Content Quality Gate, пункт «Технически»).

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
| Lesson design lab | `/lab/lesson` | Unlisted/noindex эталон четырёхраздельного урока на синтетическом контенте; не публикация и не security boundary |
| Design system stand | `/lab/design-system` | Unlisted/noindex приватный стенд текущей дизайн-системы (шрифты, цвета, типографика) и переиспользуемых lesson-компонентов; не публикация и не security boundary |
| Topic lesson | `/ege/$slug` | Общий SSR consumer типизированного Topic; `review` доступен только по прямому URL с `noindex,nofollow`, `published` может войти в prerender/public discovery |
| Privacy | `/privacy` | Публичное фактическое описание текущей минимальной обработки данных, localStorage, Umami и технических журналов; доступно со всех публичных страниц |
| Robots | `/robots.txt` | Машиночитаемые правила обхода и ссылка на sitemap; не используются как замена page-level `noindex` |
| Sitemap | `/sitemap.xml` | Только canonical URL публичной главной, privacy и `published`-уроков; review/lab/404 не включаются |
| Not found | любой неизвестный маршрут | Общий доступный 404 без предположений о будущем IA |

Первый public release не вводит отдельный каталог: при одном опубликованном уроке `/` выполняет
роль компактного списка материалов. `review`-контент не появляется в навигации или sitemap,
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
навигационными сигналами и не увеличивают учебный прогресс. Публичный content/data consumer
по-прежнему должен быть спроектирован отдельно поверх §1.4.

### 5.3 Design System

Frontend использует локальную доменную UI-систему поверх Base UI и CSS Modules. Первый активный
визуальный профиль **«Инженерная тетрадь»** сочетает нейтральную монохромную поверхность,
читающий serif и компактный sans/mono-интерфейс без фоновой текстуры. Иерархию создают два
нейтральных уровня текста, whitespace, muted surfaces и тонкие borders; цвет зарезервирован для
семантической обратной связи и синтаксиса в code surface, а inline-нотация использует только
нейтральные ink/surface-роли. Статичные поверхности и controls плоские: один блок использует не
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
- **Client state:** отдельный глобальный store (Zustand/MobX и аналоги) не вводится заранее.
  Компонентное состояние остаётся локальным, server state принадлежит Query, URL state — Router,
  persistent product state пока отсутствует. Новый store допустим только при нескольких
  независимых consumers и явно описанном lifecycle/persistence contract.
- **Визуальная системность:** значения активной темы отображаются в semantic CSS tokens, которые
  потребляют локальные компоненты. Base UI не определяет внешний вид и не выходит типами/props за
  их public API. Light-only baseline использует self-hosted кириллические шрифты без runtime-запроса.

---

## 6. Auth & Access Model

Нет аутентификации на MVP. Foundation route и `POST /api/tasks/{id}/check` публичны и анонимны;
frontend-прогресс после reset отсутствует. Ограничение на уровне
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
- **Frontend (TanStack Start/Nitro)** — Node runtime с prerendered foundation route; будущие
  product routes и data-loading boundaries определяются отдельным change.
- **Backend (FastAPI/Uvicorn)** — отдельный контейнер, доступен Nginx по внутренней docker-сети,
  наружу не смотрит напрямую.
- **Postgres** — отдельный контейнер, volume + регулярный `pg_dump`-бэкап (§8).
- **Operations stack** — Umami, Beszel и необходимые gateways физически остаются на application
  VPS, но их установка, конфигурация, backup/restore и release lifecycle принадлежат небольшому
  модулю `ops/` этого репозитория. Целевое состояние — отдельный Compose project с собственными
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
- До отдельного решения архитектора действует временный упрощённый режим администрирования:
  публичный SSH принимает только логин `root` с новым уникальным длинным паролем; public-key и
  keyboard-interactive authentication отключены. Аккаунты `operator`, `deploy` и `ops-reader`
  удаляются после доказанного перехода их runtime-обязанностей на `root`. GitHub Environment
  сохраняет reviewer approval и pinned host key, но временно получает root-пароль для ручного
  `workflow_dispatch` deploy. Это явно принятый beta-риск без календарного дедлайна; возврат к
  отдельным key-only human/deploy/read-only identities оформляется последующим change.
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
- **Umami v3** — отдельная БД/роль в Postgres; DNT, без cookies/fingerprinting/query/hash; текущий
  frontend отправляет только базовые pageviews. Новый event allowlist и развитие сбора данных
  отложены до финального этапа после доменной логики, сайта и MVP-контента.
- **Beszel Hub + Agent** — host/container metrics и история на application VPS.
- **journald + fail2ban** — структурированные application/Nginx/security logs; journald доступен
  через WireGuard-only gateway, fail2ban временно читается sre-kit через root/password SSH.
- **sre-kit core** — наш first-party sibling и владелец adapters, Source configuration,
  normalization, alerts и monitoring UI. Он запускается на workstation или management VPS и
  читает private sources через WireGuard/API/SSH, но не управляет target stack. Его SQLite,
  adapter secrets и runtime data не попадают в этот репозиторий. Локальный режим не обещает
  alerts, пока workstation выключен; круглосуточные alerts требуют always-on core.
- **Внешняя доступность** — временный scheduled GitHub Action проверяет сайт, readiness и TLS.
  Подключение существующего sre-kit Telegram channel к infraege и отдельный внешний management/
  monitoring server отложены; alert engine не дублируется в этом репозитории.

### 7.3 Operations and sre-kit integration contract

```text
infraegev2 ops package ── pinned SSH/Compose/systemd ──> application VPS operations stack
       │
       └─ registration + sanitized Check/Event ──> sre-kit (local or management VPS)

sre-kit adapters ── WireGuard/private API/read-only SSH ──> observability Sources

application VPS
  ├─ infraege Compose: nginx, web, api, application Postgres
  └─ separate infraege-ops Compose project: Umami, Beszel, gateways
```

Обязательные инварианты границы:

- application release не запускает `docker compose up/down` для operations stack и не удаляет его
  containers/volumes через `--remove-orphans`; operations release не меняет application containers;
- target stack имеет фиксированный Compose project, release directory, labels, healthchecks и
  private-only bindings; повторный `docker compose up` обновляет тот же stack, а не создаёт второй;
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
- локальный sre-kit может быть выключен без остановки target tools или ops automation, но
  polling/alerts при
  этом не гарантируются. Полная независимость от падения application VPS достигается только после
  размещения monitoring core на отдельном always-on host.

Operations package намеренно остаётся небольшим. `config` локально проверяет Compose с защищённым
env; `status` читает состояние установленного project через pinned SSH; `install` и `update`
передают один Compose release и запускают `pull` + `up --wait`; `rollback` повторно применяет
предыдущий release. Эти команды не моделируют собственный desired state, effect graph, checkpoint,
revision или outbox: декларативным состоянием сервисов уже владеет Compose.

Release содержит Compose definition и три коротких maintenance-скрипта для backup, restore proof и
retention. Значения передаются отдельным mode-600 environment и хранятся на VPS по release id; они
не входят в archive или git. Operations command никогда не меняет application Compose. Репозиторий
уже подготовлен к переключению, но `install` нельзя запускать параллельно с live legacy
Umami/Beszel из-за занятых ports.

Публичный same-origin Umami collector в подготовленной production definition использует одну
созданную external Docker network `infraege-observability-ingress`. Оба Compose project только
подключаются к ней; Umami получает стабильный alias `umami`, а Nginx остаётся также в application
network для web/api. Создание сети — одна явная lifecycle-операция, а не отдельная модель ресурсов.

Fresh-start cutover остаётся отдельной, ещё не выполненной production-операцией: проверить shared
network, остановить legacy observability services, выпустить подготовленный application release,
запустить чистый `infraege-ops`, активировать его timers, зарегистрировать Sources и проверить
dashboard. Старые volumes сохраняются на короткий rollback-период. Их удаление и перенос старых
данных не входят в cutover и требуют отдельного явно одобренного действия.

`ops/observability/sre-kit-sources.example.json` — secret-free операторская подсказка, а не новый
универсальный deployment contract. Поля сверяются с manifest соответствующего adapter, но реальные
IDs/accounts/secrets вводятся в sre-kit. Недоступность sre-kit не блокирует Compose lifecycle;
после восстановления core Sources снова начинают polling существующих target endpoints.

---

## 8. Non-Functional Requirements

| Concern | Requirement |
|---------|-------------|
| Security headers / CORS | Rate limiting чекер-эндпоинта на Nginx: `limit_req_zone` 20 req/min/IP, burst 5, `nodelay` (см. §4, §11.2 источника) — против автоматизированного перебора банка ответов; конкретную цифру пересмотреть по факту логов после запуска. Временный public root/password SSH защищён только уникальным длинным паролем, pinned host key, UFW, fail2ban и GitHub Environment approval; риск полного захвата VPS при компрометации пароля принят архитектором до отдельного возврата key-only access. |
| Accessibility target | Foundation и lab не имеют serious/critical axe violations; lesson outline сохраняет вложенный semantic list, anchors, keyboard focus, различимый текущий пункт и корректный source order, а сложный визуал имеет видимую полную текстовую альтернативу |
| Performance budget | LCP < 2.5s, CLS < 0.1, INP < 200ms на мобильном 4G-профиле; release evidence измеряет `/` и первый опубликованный `/ege/16-rekursiya`, отдельно проверяет cold-load font/layout shifts и не подменяет route-level метрики общей оценкой технической страницы |
| Observability | Application deploy и operations stack имеют независимые Compose projects, volumes и rollback. infraegev2 владеет небольшим Compose/SSH operations package; sre-kit работает вне monitored VPS и владеет только ingestion, adapters, alerts и UI. Репозиторий подготовлен к fresh-start cutover, его live-выполнение требует отдельного разрешения |
| Backup / restore | Application и operations jobs используют отдельные Restic tags, restore proofs и status markers в общем encrypted repository. Operations timers активируются только после clean install, без импорта старых Umami/Beszel artifacts. Для каждого владельца сохраняются 7 daily + 4 weekly + 3 monthly и общий same-host/off-site risk |
| SEO | `/`, `/privacy` и published topics имеют canonical, уникальные metadata, SSR content и входят в sitemap/prerender; lab и review routes остаются unlisted, `noindex,nofollow` и исключены из public discovery; Lighthouse SEO для публичных маршрутов проходит без ошибок |
| Mobile / no-JS readability | Lab и topic lesson сохраняют текст, последовательные стадии визуала, подписи, решения и section anchors в SSR HTML; интерактивная проверка остаётся progressive enhancement |
| Client resilience / API drift | Route failures восстанавливаемы без белого экрана; loading/empty/error/not-found состояния доступны с клавиатуры и скринридера; OpenAPI schema/types drift ломает gate до merge; runtime HTTP имеет timeout/abort и не делает скрытый retry мутаций |
| Юридическое (152-ФЗ) | Минимизация сбора и российский application VPS сохраняются; `/privacy` перед первым public release правдиво описывает фактическую обработку и доступна со всех публичных страниц. По явному решению архитектора от 2026-08-19 ФИО/наименование, ИНН/ОГРН, адрес, публичный email оператора и уведомление РКН временно не публикуются; архитектор осознанно принимает юридический риск и обязуется заполнить сведения отдельным последующим изменением |
| Юридическое (436-ФЗ) | Возрастная маркировка для обычного сайта не вводится: существующая `12+` удаляется без замены на `18+` |
| Юридическое (оригинальность контента) | Тексты тем и формулировки задач — собственного авторства/переформулированы, не дословные копии ФИПИ/sdamgia/kpolyakov (риск конфликта с площадками, не только вопрос добросовестности); проверяется в Content Quality Gate (§2.3) на каждой теме перед `published` |
| Other (юридический ориентир, не консультация) | Открытые источники используются как инженерный ориентир; формальная юридическая проверка и РКН составляют отдельный принятый долг |

---

## 9. Roadmap

| Milestone | Goal | Key Outputs |
|-----------|------|-------------|
| `M0` — технический фундамент | Сохранить проверенную web/backend/ops инфраструктуру без навязывания продуктовой страницы | Нейтральная root-заглушка, shared primitives, API contract, пустой content skeleton и локальные gates |
| `M1` — новый product/design baseline | Доказать заменяемую визуальную систему без преждевременной публикации | «Инженерная тетрадь», unlisted design-system/lesson labs, единый frontend-контракт и reusable primitives |
| `M2` — инфраструктурная пауза | Подготовить production-платформу до продолжения продуктового контента | `infraege.ru`, VPS/GHCR deploy, security/release gates, backups, repo-native ops automation и внешний first-party sre-kit monitoring core |
| `M3` — учебный flow и публичный запуск | Завершить доменную логику, основные поверхности сайта и проверенный MVP-контент до расширения аналитики | Два опубликованных полных урока образуют текущую точку проверки; до третьей темы или мини-курса Python проводится оценка готовности приложения по целостному learner journey, навигации, непрерывности/прогрессу, trust/legal-пробелам и production feedback. Исходные цели 3–5 тем и Python-курса остаются дальнейшим расширением M3, но не текущим приоритетом |
| `M4` — финальное измерение и эксплуатация | Только после готовности домена, сайта и MVP-контента расширить продуктовые сигналы | Privacy-safe allowlist продуктовых событий Umami и проверка сбора данных; lifecycle остаётся в `opsctl`, monitoring UI — в sre-kit |
| `M5+` (после первых данных, вне MVP) | Расширение охвата и сообщества поверх работающей бесплатной базы | Второй мини-курс (Excel), аккаунты/синхронизация, обсуждения тем с модерацией, затем платные фичи — без runtime AI до этого момента |

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
- Отдельный preview/staging-стенд — тестирование локально повторяет прод (§7.1).
- Онлайн-кассы / 54-ФЗ — возникают только с появлением платежей, не на MVP-этапе.
- CDN, off-site backup и постоянный management VPS для sre-kit — отдельные последующие задачи;
  локальный core режим остаётся поддерживаемым. Telegram уже принадлежит sre-kit и не
  реализуется внутри infraegev2.
- Формальные реквизиты оператора ПДн и уведомление РКН — отдельный принятый юридический долг.
- PWA/service worker, offline mutation queue и optimistic updates — только после отдельного
  пользовательского сценария и стратегии конфликтов/устаревания.
- Глобальный client store и Base UI/community primitives без текущего consumer-а — не часть
  клиентского фундамента; добавляются по доказанной потребности (§5.4).

---

## 11. Open Questions

- [NEEDS_CLARIFICATION: числовые целевые показатели успеха MVP (объём органического трафика,
  срок, глубина прохождения) — решить после `M4`, когда появятся пригодные данные Umami (§1.2).]
- [NEEDS_CLARIFICATION: будущие публичные product routes, content loading и владение mastery state
  определяются после проверки lab; дизайн-система не закрепляет эти решения, но они обязаны
  сохранять поведение §1.4.]
- Точная цифра rate limit чекер-эндпоинта (20 req/min/IP, burst 5) — стартовый ориентир,
  архитектор явно указал пересмотреть по факту логов после запуска, не считать зафиксированной
  раз и навсегда (§8).
