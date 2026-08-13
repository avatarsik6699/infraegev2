# TECHNICAL SPECIFICATION (SPEC.md): `infraege`

> **For AI agent**: Read this file in full before starting any change. Confirm understanding of
> constraints before running `/plan` or `/work`. When this file changes in a way that affects an
> active `docs/changes/*.md`, note it in that change's Implementation Notes rather than
> hand-syncing a separate contract file — there isn't one.

## Metadata

| Field | Value |
|-------|-------|
| Document Version | `v1.3` |
| Date | `2026-08-13` |
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
  — решить после этапа 3 (публичный запуск), когда появятся первые данные Umami, а не гадать
  заранее.]
- Продуктовые события будут определены вместе с реализацией закреплённого в §1.4 учебного flow.
  Текущий нейтральный frontend не имитирует вовлечённость и отправляет только базовый pageview
  Umami и безопасную telemetry клиентских ошибок.

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

Таблица описывает целевой продукт, а не текущий набор web-маршрутов. В `apps/web` нет
опубликованной темы, главной или legal UI: дизайн-система проверяется на unlisted/noindex lab, а
публично доступный корень остаётся нейтральной технической заглушкой.

### 1.4 Durable Learning Flow

Учебная траектория является продуктовым контрактом и не зависит от будущих URL, page composition
или визуальной системы. Тема и урок используют четыре канонических learner-facing раздела:

1. **Теория** (`theory`) объединяет идею, содержательное объяснение, полезные приёмы, схемы и
   учебные визуалы. Она объясняет, что происходит и почему это работает, без искусственного
   переключателя «кратко/подробно».
2. **Практика** (`practice`) объединяет алгоритм, разобранный пример, частичные упражнения и
   постепенно усложняющиеся самостоятельные задачи с приоритетом свободного ввода. Визуалы могут
   быть непосредственно связаны с примером или задачей.
3. **Что важно для ЕГЭ** (`exam_focus`) объединяет типичные ошибки, требования экзаменационного
   формата, лайфхаки, общие подсказки и при необходимости отдельные визуалы. Помощь к конкретному
   заданию остаётся доступна внутри практики и не откладывается до третьего раздела.
4. **Результат** (`result`) завершает материал вариативным набором релевантных блоков: краткие
   итоги, освоенные умения, результат практики, зоны для повторения, похожие задачи и следующий
   связанный материал.

Четыре роли задают стабильную навигацию и порядок, но не требуют заполнять каждый внутренний тип
блока. Контент включается только когда помогает понять материал, решить задачу или выбрать
следующий шаг.

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
localStorage на клиенте; БД используется по минимуму для необязательной анонимной аналитики
практики (см. §3).

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
- [ ] Материал реализует четыре раздела §1.4: Теория → Практика → Что важно для ЕГЭ → Результат;
  внутренние блоки соответствуют назначению раздела, а глубина — сложности темы, не искусственному
  лимиту длины.
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

Контент — **не** реляционные таблицы; это типизированные файлы content-as-code
(`*.mdx`/`*.json` во frontend-репозитории, папка `content/`), версионируемые через git и
проверяемые CI-скриптом валидации связей (см. §7.2). Схема ниже описывает форму этих файлов, не
таблицы БД.

```text
Topic (content/topics/{id}.{mdx|json})
  id: slug
  task_numbers: [int]                         // может закрывать несколько номеров ЕГЭ
  title
  summary                                     // 1-2 предложения, для превью и meta description
  sections: [LearningSection]
  quick_reference_blocks: [ContentBlock]       // краткая памятка/алгоритм в боковом rail
  learning_outcomes: [string]                  // что ученик умеет после прохождения
  prerequisites: [topic_id | course_lesson_id]  // ссылка на mastery-статус, не булев чек-лист "открыл страницу"
  mastery_threshold: float (default 0.8)       // порог доли верных ответов для статуса "усвоено"
  related_topics: [topic_id]                   // необязательные, но полезные связи
  practice_task_ids: [task_id]
  status: draft | review | published
  access_tier: free | paid                     // задел под монетизацию — не enforced на MVP, все published = free

Course (content/courses/{id}.json)
  id: slug
  title
  lessons: [CourseLesson]

CourseLesson
  id: slug
  course_id
  title
  sections: [LearningSection]
  quick_reference_blocks: [ContentBlock]
  learning_outcomes: [string]
  unlocks_topics: [topic_id]                    // обратная связь: после этого урока — какие темы ЕГЭ разблокируются
  practice_task_ids: [task_id]
  status: draft | review | published

LearningSection
  id: slug
  role: theory | practice | exam_focus | result
  title
  nav_label: string | null
  blocks: [ContentBlock]

ContentBlock
  type: text | learning_visual | code_example | worked_example | completion_exercise
        | productive_failure_prompt | callout | video_embed
  data: <зависит от типа>
  // learning_visual.data — discriminated representation: raster | structured | hybrid;
  // общие поля: purpose, accessible_description, caption. Raster хранит src/width/height;
  // structured хранит минимальные типизированные факты конкретного учебного визуала;
  // hybrid соединяет основной raster-материал с доступным структурированным представлением.
  // Raster, SVG/HTML и hybrid равноправны; medium выбирается по тому, что лучше объясняет идею.

Task (practice_task_ids ссылается сюда)
  id
  topic_ids: [topic_id]                         // может относиться к нескольким темам
  statement
  checker_type: exact_match | numeric_tolerance
  answer_variants: [string]                     // все допустимые написания верного ответа (см. §11.1 нормализация)
  numeric_tolerance: float                       // только для checker_type: numeric_tolerance
  interaction_type: production | recognition     // приоритет — production
  explanation                                    // полноценный worked-example-разбор, не строка "правильный ответ: X"
  difficulty: 1-3
  is_interleaving_eligible: bool (default true при published)

LearningFlowPolicy (продуктовый контракт, не отдельный runtime-объект)
  section_order: theory -> practice -> exam_focus -> result
  theory_blocks: idea | explanation | lifehack | learning_visual
  practice_blocks: algorithm | worked_example | completion_exercise | task | learning_visual
  exam_focus_blocks: pitfall | exam_requirement | lifehack | hint | learning_visual
  result_blocks: summary | learning_outcome | practice_result | review_target | similar_task | next
  task_order: nondecreasing difficulty внутри первого прохождения материала
  task_hints: immediately available inside practice
  assisted_correct_attempts: count toward progress
  weak_outcome: result recommends targeted review
  forbidden_without_new_decision: timers | delayed hints | final no-hint exam | assistance penalty

-- БД (Postgres), опционально, только агрегированная аналитика практики --
task_attempt_stats(task_id, attempts_count, wrong_count, last_aggregated_at)
  // минимум на MVP; решить точную форму при реализации (может быть заменено чисто событиями Umami —
  // раздел 12 — вместо отдельной таблицы, если этого достаточно для приоритизации тем)
```

CI-валидация: скрипт проверяет, что все `prerequisites`, `related_topics`, `unlocks_topics`,
`practice_task_ids`, `topic_ids` ссылаются на существующие id — сборка падает при битых связях
(см. §2.3 Content Quality Gate, пункт «Технически»).

---

## 4. API / Backend Contract

Backend сохраняет content/task schemas и проверку ответа как независимый будущий контур. Реальных
task-файлов и frontend-consumer после reset нет; endpoint неизвестного task id отвечает `404`.

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
| UI foundation | `/` | Нейтральная SSR-заглушка на базовых токенах новой системы; без product claims и ссылки на lab |
| Lesson design lab | `/lab/lesson` | Unlisted/noindex эталон четырёхраздельного урока на синтетическом контенте; не публикация и не security boundary |
| Not found | любой неизвестный маршрут | Общий доступный 404 без предположений о будущем IA |

Home/topic/lesson/legal/sitemap routes удалены. Их будущие URL, loader contracts, SEO и composition
не фиксируются до отдельного планирования нового продукта. Будущая композиция обязана реализовать
§1.4, но сам учебный flow не предопределяет маршрутную структуру. `/lab/lesson` отсутствует в
навигации и sitemap, отдаёт `robots: noindex,nofollow` и явно исключается из prerender discovery.

### 5.2 Components / Stores

| Component / Store | Purpose | Notes |
|--------------------|---------|-------|
| Learning visual frame | Общая семантическая рамка сложного учебного визуала | Видимые caption/purpose, доступное описание и полная текстовая альтернатива; presentation boundary не разбирает свободный JSON API |
| Lesson outline | Иерархическая навигация по уроку | Четыре стабильных верхних раздела и переменные content-derived подпункты; SSR-якоря, доступный текущий пункт и responsive in-flow adaptation; новая ломаная path-грамматика без наследования прежнего ToC-кода |
| Practice tabs | Локальная навигация по постепенно усложняющимся задачам внутри `practice` | Пять компактных доступных вкладок показывают рост сложности цветом, индикатором уровня и текстом; одна активная задача после hydration, свободный ручной переход без блокировок и автопродвижения, одна или несколько task-specific ссылок на фрагменты теории рядом с заголовком; все формы остаются в SSR/no-JS HTML и не становятся пунктами lesson outline |
| Page state primitives | Единые loading/skeleton, empty, not-found и recoverable error состояния | Семантический статус и понятное действие важнее декоративной анимации; skeleton повторяет геометрию страницы и не озвучивается скринридером как контент |
| Route resilience shell | Route-level pending/error/not-found UI, retry/reset и верхний navigation progress | Ошибка одной навигации не ломает document shell; предыдущий полезный экран не заменяется мгновенным мигающим fallback |
| Typed API client | Единственная граница runtime HTTP для `apps/web`, сгенерированная из FastAPI OpenAPI | Feature `api/` вызывает типизированный shared client; transport/HTTP/contract errors различимы, abort/timeout и безопасные сообщения обязательны |
| Query client | Будущая граница runtime server-state, mutation lifecycle, cache/retry/cancellation | Не дублирует local UI или URL state; сейчас product queries отсутствуют |

Lab использует локальное демонстрационное состояние hint/incorrect/correct и пять синтетических
задач, чтобы проверить полный progress/mastery contract до появления публичного consumer. Верные
задачи сохраняются через версионированный SSR-safe localStorage, четыре из пяти означают освоение;
API и аккаунт не используются. Интерактивные вкладки при каждом входе начинают с первой задачи,
не сохраняет активную позицию или черновики, оставляет все шаги доступными и переходит дальше
только по явному действию ученика. Каждая задача получает одну или несколько ссылок к связанным
фрагментам теории прямо рядом с заголовком, без отдельной плашки, а no-JS показывает все задачи
последовательно. Позиция чтения, текущий раздел и выбранная задача остаются отдельными
навигационными сигналами и не увеличивают учебный прогресс. Публичный content/data consumer
по-прежнему должен быть спроектирован отдельно поверх §1.4.

### 5.3 Design System

Baseline **«Разобранный алгоритм»** показывает целое, причинные части и их самостоятельную сборку.
Утверждённый Editorial Rail использует тёплую редакционную поверхность, serif-голос учебного
текста, sans/mono-интерфейс, тонкие разделительные линии и один выжженно-оранжевый цвет причинного
доказательства. Схемы встроены в чтение и связаны с пояснениями на полях; система отказывается от
card-dashboard edtech, glassmorphism и декоративной геймификации. Первый lab работает в режиме
Impeccable `Read` и comp-led. `DESIGN.md` документирует только принятую реализацию после detector и
независимого finish review, не предварительное намерение.

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
- **UI extensions:** Mantine Core/Hooks/NProgress 9.5.1 составляют текущую основу. Form,
  code-highlight и любые новые extensions добавляются только вместе с реальным consumer и
  отдельной maintenance/a11y/supply-chain проверкой.
- **Client state:** отдельный глобальный store (Zustand/MobX и аналоги) не вводится заранее.
  Компонентное состояние остаётся локальным, server state принадлежит Query, URL state — Router,
  persistent product state пока отсутствует. Новый store допустим только при нескольких
  независимых consumers и явно описанном lifecycle/persistence contract.
- **Визуальная системность:** Mantine 9.5.1 остаётся доступным поведением и theme foundation, а
  semantic CSS tokens, типографика, focus, линии, motion и компонентные extensions принадлежат
  `apps/web`. Light-only baseline использует self-hosted кириллический шрифт без runtime-запроса.

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

Топология (Docker Compose, всё на одном сервере — осознанно, «ничего лишнего»):
- **Nginx** — единственная точка входа (80/443), reverse-proxy для web/API и статики.
- **Frontend (TanStack Start/Nitro)** — Node runtime с prerendered foundation route; будущие
  product routes и data-loading boundaries определяются отдельным change.
- **Backend (FastAPI/Uvicorn)** — отдельный контейнер, доступен Nginx по внутренней docker-сети,
  наружу не смотрит напрямую.
- **Postgres** — отдельный контейнер, volume + регулярный `pg_dump`-бэкап (§8).
- **Observability-источники** — Umami, Beszel и журналы остаются на application VPS; `apps/ops`
  сначала запускается локально и подключается к ним через WireGuard. В будущем тот же dashboard
  переносится на отдельный monitoring VPS и агрегирует несколько проектов.

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
- Интерактивное администрирование выполняется отдельным `operator`: только key-based SSH и
  password-protected `sudo`. Автоматический `deploy` не входит в `sudo`; прямой root SSH, SSH
  password authentication и keyboard-interactive authentication остаются отключены.
- CI-валидация связей контента: скрипт проверяет, что `prerequisites`/`related_topics`/
  `unlocks_topics`/`practice_task_ids`/`topic_ids` ссылаются на существующие id — сборка падает при
  битых связях, до того как они попадут в прод (см. §3, §2.3).
- Резервное копирование: ежедневный `pg_dump -Fc`, Beszel state и production-конфигурация в
  локальный restic на том же VPS; 7 daily, 4 weekly, 3 monthly; freshness marker и ежемесячный
  restore drill. Потеря всего VPS уничтожит и локальные бэкапы — принятый риск до отдельной задачи
  с российским S3-compatible storage.

**Наблюдаемость** (self-hosted, тот же VPS на старте, минимальный расход ресурсов):
- **Umami v3** — отдельная БД/роль в Postgres; DNT, без cookies/fingerprinting/query/hash; текущий
  frontend отправляет только базовые pageviews, а новый event allowlist появится с product flow.
- **Beszel Hub + Agent** — host/container metrics и история на application VPS.
- **journald + fail2ban** — структурированные application/Nginx/security logs; read-only доступ
  dashboard через WireGuard и ограниченный SSH wrapper.
- **`apps/ops`** — локальный Node BFF + React/Mantine dashboard с `@mantine/charts` 9.5.1 и
  обязательным Recharts 3.10.1. Конфигурация источников поддерживает несколько проектов; секреты
  не попадают в браузер. Позже приложение переносится на отдельный monitoring VPS.
- **Внешняя доступность** — временный scheduled GitHub Action проверяет сайт, readiness и TLS.
  Telegram-алерты и отдельный внешний monitoring server отложены.

---

## 8. Non-Functional Requirements

| Concern | Requirement |
|---------|-------------|
| Security headers / CORS | Rate limiting чекер-эндпоинта на Nginx: `limit_req_zone` 20 req/min/IP, burst 5, `nodelay` (см. §4, §11.2 источника) — против автоматизированного перебора банка ответов; конкретную цифру пересмотреть по факту логов после запуска |
| Accessibility target | Foundation и lab не имеют serious/critical axe violations; lesson outline сохраняет вложенный semantic list, anchors, keyboard focus, различимый текущий пункт и корректный source order, а сложный визуал имеет видимую полную текстовую альтернативу |
| Performance budget | LCP < 2.5s, CLS < 0.1, INP < 200ms на мобильном 4G-профиле; текущий Lighthouse gate измеряет только `/` до появления новых public routes |
| Observability | Umami + Beszel + journald/fail2ban на application VPS; унифицированный `apps/ops` через WireGuard; scheduled GitHub probe для внешней доступности; без Telegram на этом этапе |
| Backup / restore | Локальный restic на VPS: daily `pg_dump -Fc`, Beszel/config snapshots, 7 daily + 4 weekly + 3 monthly, freshness marker и ежемесячный restore drill; off-site storage отложен с явно принятым риском |
| SEO | Product URL taxonomy, metadata and sitemap intentionally deferred; `/` имеет нейтральный technical title, а `/lab/lesson` unlisted, `noindex,nofollow` и исключён из prerender discovery |
| Mobile / no-JS readability | Lab-текст, последовательные стадии визуала, подписи, `<details>`-подсказка и section anchors доступны в SSR HTML; интерактивность остаётся progressive enhancement |
| Client resilience / API drift | Route failures восстанавливаемы без белого экрана; loading/empty/error/not-found состояния доступны с клавиатуры и скринридера; OpenAPI schema/types drift ломает gate до merge; runtime HTTP имеет timeout/abort и не делает скрытый retry мутаций |
| Юридическое (152-ФЗ) | Минимизация сбора и российский application VPS сохраняются; web `/privacy` удалён вместе с product UI и должен быть спроектирован заново до следующей публичной product release. Реквизиты оператора и уведомление РКН остаются отдельным принятым долгом |
| Юридическое (436-ФЗ) | Возрастная маркировка для обычного сайта не вводится: существующая `12+` удаляется без замены на `18+` |
| Юридическое (оригинальность контента) | Тексты тем и формулировки задач — собственного авторства/переформулированы, не дословные копии ФИПИ/sdamgia/kpolyakov (риск конфликта с площадками, не только вопрос добросовестности); проверяется в Content Quality Gate (§2.3) на каждой теме перед `published` |
| Other (юридический ориентир, не консультация) | Открытые источники используются как инженерный ориентир; формальная юридическая проверка и РКН составляют отдельный принятый долг |

---

## 9. Roadmap

| Milestone | Goal | Key Outputs |
|-----------|------|-------------|
| `M0` — технический фундамент | Сохранить проверенную web/backend/ops инфраструктуру без навязывания продуктовой страницы | Нейтральная root-заглушка, shared primitives, API contract, пустой content skeleton и локальные gates |
| `M1` — новый product/design baseline | Доказать визуальную систему без наследования удалённых страниц и без преждевременной публикации | «Разобранный алгоритм», unlisted lesson lab, принятый DESIGN.md и reusable visual/reading primitives |
| `M2` — инфраструктурная пауза | Подготовить production-платформу до продолжения продуктового контента | `infraege.ru`, VPS/GHCR deploy, security/release gates, backups и локальный ops-dashboard |
| `M3` — учебный flow и публичный запуск | Реализовать утверждённые поверхности и только затем добавить проверенный контент | Доступный SSR/no-JS flow, практика, прогресс, SEO/legal surfaces и Umami-события по новому контракту |
| `M4+` (после трафика, вне MVP) | Расширение охвата и сообщества поверх работающей бесплатной базы | Второй мини-курс (Excel), аккаунты/синхронизация, обсуждения тем с модерацией, затем платные фичи — без runtime AI до этого момента |

---

## 10. Out of Scope

- Аккаунты и синхронизация прогресса между устройствами (до `M4+`).
- Обсуждения тем, комментарии, ответы и модерация (до аккаунтов и отдельного `M4+` change).
- Полноценный тренажёр-пробник ЕГЭ с таймером на весь вариант.
- Платные функции любого вида (до `M4+`, и только поверх уже работающей бесплатной базы).
- AI внутри продукта как пользовательская фича (только как инструмент автора при подготовке
  контента, offline).
- Мини-курс Excel и остальные темы ЕГЭ — вторая волна, по той же структуре, что первая.
- i18n/локализация — продукт полностью на русском, аудитория исключительно русскоязычная.
- Полноценный поиск по сайту — пока тем меньше десятка, обычная навигация достаточна.
- Отдельный preview/staging-стенд — тестирование локально повторяет прод (§7.1).
- Онлайн-кассы / 54-ФЗ — возникают только с появлением платежей, не на MVP-этапе.
- CDN, Telegram-алерты, off-site backup и второй monitoring VPS — отдельные последующие задачи.
- Формальные реквизиты оператора ПДн и уведомление РКН — отдельный принятый юридический долг.
- PWA/service worker, offline mutation queue и optimistic updates — только после отдельного
  пользовательского сценария и стратегии конфликтов/устаревания.
- Глобальный client store и Mantine/community extensions без текущего consumer-а — не часть
  клиентского фундамента; добавляются по доказанной потребности (§5.4).

---

## 11. Open Questions

- [NEEDS_CLARIFICATION: числовые целевые показатели успеха MVP (объём органического трафика,
  срок, глубина прохождения) — решить после `M3`, когда появятся данные Umami (§1.2).]
- [NEEDS_CLARIFICATION: будущие публичные product routes, content loading и владение mastery state
  определяются после проверки lab; дизайн-система не закрепляет эти решения, но они обязаны
  сохранять поведение §1.4.]
- Точная цифра rate limit чекер-эндпоинта (20 req/min/IP, burst 5) — стартовый ориентир,
  архитектор явно указал пересмотреть по факту логов после запуска, не считать зафиксированной
  раз и навсегда (§8).
