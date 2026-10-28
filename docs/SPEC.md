# TECHNICAL SPECIFICATION (SPEC.md): Кодумка (`kodumka.ru`)

> **For AI agents:** read the active change and the SPEC sections it affects; §3–§4 for data/API,
> §2.3 for authoring, §5 plus FRONTEND for web, §7–§8 for operations. Read SPEC in full for initial
> product planning or a product/system pivot. Read STACK gate/tooling rows and relevant GOTCHAS;
> do not load unrelated archive history by default.

## Metadata

| Field | Value |
|-------|-------|
| Document Version | `v2.36` |
| Date | `2026-10-25` |
| Architect / Owner | `v.godlevskiy` |
| Stack | See [docs/STACK.md](./STACK.md) |
| Brand / public origin | «Кодумка», `https://kodumka.ru` (с Change 193; `infraege` — внутреннее кодовое имя) |
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
   flow архитектор может объединить завершение связной программы в один change. Каждый входящий
   урок доводится в feature-ветке до вида опубликованного: архитектор проверяет содержание и
   визуальный результат локально до `/ship`, а найденные проблемы исправляются в том же change.
   Production получает новые уроки только через выпуск; действующий публичный курс показывает
   только действительно доступные уроки.

### 1.2 Goal and Success Metrics

Цель MVP — подтвердить, что органический поиск приводит трафик на темы, сделанные по этим
принципам, и что ученики реально проходят путь Теория → Практика → Что важно для ЕГЭ → Результат,
а затем продолжают обучение, а не уходят после первого экрана.

Числовые цели не зафиксированы. Сейчас проверяем полезность уроков и практики непосредственным
использованием и обратной связью. Cookieless-аналитика посещений (self-hosted сервис
`smotryashchiy`, без cookie и persistent visitor id, §7.3/§8.2) даёт агрегированную картину
трафика и переходов; она не заменяет прямую обратную связь и не используется для оценки учебного
прогресса конкретного ученика.

### 1.3 Project Boundaries

| Included | Excluded (сознательно не входит) |
|-----------------|------------------------------------------|
| Все 25 тем ЕГЭ (задания 1–27; 19–21 одной темой) по плану варианта ФИПИ 2027 | Полноценный тренажёр-пробник ЕГЭ с таймером на весь вариант |
| Мини-курсы Python (30 уроков в 8 модулях) и Excel (задания 3, 9, 18, 22) | Автоматическая персональная рекомендация следующей темы |
| Банк задач с проверкой ответа на сервере и практика в каждой теме, без адаптивного подбора | Автопродление и сохранённые карты, живые форматы (группы, занятия), кабинет учителя, реклама |
| Платный доступ (§6.1): два разовых тарифа, soft paywall, Robokassa с чеками самозанятого | AI внутри продукта (только как инструмент автора при подготовке контента) |
| Публичные индексируемые страницы тем и уроков (SSR/SSG) | i18n/локализация (аудитория исключительно русскоязычная) |
| Необязательный аккаунт и серверный прогресс; все учебные действия доступны гостю | Полноценный поиск по сайту |

Состав опубликованного задают publication registries
(`apps/web/src/entities/lesson/content/lesson-registry.ts` и Course registry). Задачи уроков курсов —
server-owned задачи банка; у задач на данных задачника Excel — вложение `.xlsx`. Новые Topic-связи
не следуют из публикации курса. Текущий deployed SHA проверяется через `/health/ready`, а не
выводится из local `main`, `origin/main` или старого релиза.

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
   на уровне урока, собирает вопросы по всем теоретическим идеям и рендерится внутри этой секции,
   после итогового текста; не учитывается как выполненная практика. В теме ЕГЭ каждая подтема
   дополнительно может завершаться своей самопроверкой того же вида (Change 171): вопросы «объясни,
   почему» к идеям этой подтемы, после её задач; она тоже не учитывается как практика.

Роли идут только в этом порядке; опциональные роли можно пропускать, но нельзя переставлять.
Урок мини-курса (решение архитектора 2026-10-20, Change 197) ставит итог перед практикой:
Теория → Итог → Проверьте себя → Практика. Итог и самопроверка — отдельные разделы страницы, как на
странице «Практика и итог» темы ЕГЭ; ученик сначала видит обзор урока, затем проверяет понимание и
только потом решает задачи.

Тема ЕГЭ (Change 167) делится на авторские подтемы — группы соседних `ConceptBlock` без изменения
их текста и порядка. Каждая подтема — отдельная страница `/ege/{topic}/{subtopic}`; первая
открывается по адресу темы (редирект) и начинается с введения. Под заголовком каждой подтемы стоит
короткий вводный абзац (`lead`, одно–два предложения): заголовок никогда не следует сразу за
заголовком (Change 170 F42). После подтем идёт страница «Практика и итог» (T254, Change 197) в виде итога мини-курса: строка
под заголовком, затем «Одна задача — вся тема» (задача темы по подтемам), «Карта темы», «Как
решать» (порядок решения с номерами подтем), «Частые ошибки», «Итог» короткими выводами,
самопроверка `checkpoint` и практика — только смешанные задачи темы без привязки к подтеме;
ссылок на соседние темы на ней нет — к другим темам ведут хлебные крошки и дерево тем. Страница подтемы дополнительно показывает те задачи урока, у которых есть
theory link на её разделы: это представление той же практики урока, а не отдельный набор задач
или прогресс. Отметка пройденной подтемы вычисляется из уже сохранённых решений этих задач;
подтема без задач отметки не имеет. Мини-курсы (Python, Excel) остаются одностраничными уроками. Уроки
мини-курса бывают основного и дополнительного уровня по тому же правилу: основные дают всё, что
используют темы ЕГЭ; дополнительные (то, что экзамену не нужно) идут в конце курса, явно помечены
и не входят в mastery курса (решение архитектора 2026-10-10, Change 174).
Состав и подача темы ЕГЭ определяются обязательным
[пайплайном подготовки темы](runbooks/lesson-pipeline.md) (с 2026-10-08). Подтемы бывают двух
уровней. **Основные** вместе решают не меньше ~80 % задач открытых подборок и все типы задач реальных
экзаменов последних двух лет. **Дополнительного уровня** — редкие случаи; они идут после основных,
перед «Практикой и итогом», явно помечены и проходятся тем же линейным порядком, без ветвления.
«Освоено» (`masteryThreshold`) в теме ЕГЭ считается по задачам основных подтем и страницы «Практика
и итог»: задачи подтем дополнительного уровня решаются и сохраняются, но не входят ни в число решённых,
ни в общее число задач для mastery (решение архитектора 2026-10-08, Change 171).
Формальное доказательство, идея которого уже показана в тексте примером и схемой, может быть свёрнуто
в раскрывающийся блок. Это не переключатель «кратко/подробно»: объяснение «почему работает» всегда
остаётся в основном тексте.
Контент включается только когда помогает понять материал, решить задачу или выбрать следующий шаг.

Подсказки и решение доступны сразу и не меняют прогресс. Для вошедшего ученика прогресс хранит
факты верного решения текущей версии задачи в контексте урока без текста ответа;
solved/mastery вычисляются из этих фактов и текущего состава урока. `result` показывает итог и
registry-derived список доступных опубликованных материалов, не выдавая его за персональную
рекомендацию. Отдельного финального испытания без подсказок, таймеров, задержек,
assisted-solution scoring, оценки уверенности или персонализированного повторения нет. Их нельзя
добавлять без нового решения архитектора. Глубина разделов зависит от сложности материала, но
линейная модель предпочтительнее скрытого адаптивного ветвления.

---

## 2. Domain Context

### 2.1 Roles and Permissions

| Role | Capabilities | Restrictions |
|------|-------------|--------------|
| `Anonymous learner` | Читает бесплатную теорию, решает её практику, получает обратную связь по ответу; у платных частей видит превью и блок оплаты (§6.1) | Прогресс не сохраняется и не засчитывается после ухода или перезагрузки страницы; купить доступ без входа нельзя |
| `Signed-in learner` | Всё доступное гостю; хранит прогресс уроков и самостоятельной практики в аккаунте и управляет способами входа; покупает доступ для своего аккаунта | Факт входа не даёт прав автора, оператора или платного доступа |
| `Subscriber` | Signed-in learner с действующим доступом (`access_grant`, §3): читает и решает платные подтемы, уроки и их задачи | Доступ принадлежит одному аккаунту и не передаётся; права не меняют учебный прогресс |
| `Billing operator` (архитектор) | Через операторскую CLI на хосте оформляет возвраты, смотрит платежи пользователя и годовую выручку | Публичного admin API нет; действия идемпотентны и журналируются |
| `Content author` (архитектор + AI как инструмент) | Пишет типизированную теорию в `apps/web/src/entities/lesson/content/*.lesson.tsx` и практику в `content/practice-bank/bank.json`; в feature-ветке помечает готовый к локальной проверке урок `published` и импортирует задачи обычным операторским путём | Content Quality Gate (§2.3) применяется до `/ship`; импорт задач — по §3 и runbook practice; локальный статус не выпускает материал в production |
| `Architect` | Владеет `docs/SPEC.md`, принимает архитектурные решения, вручную проверяет готовый локальный урок и сообщает замечания в активный Backlog до `/ship` | — |
| `AI_Agent` | Реализует изменения через `/work`, готовит и исправляет контент по [Content Quality Gate](#23-content-quality-gate-definition-of-done) (§2.3), запускает предусмотренные проверки | Не делает `/ship` или push в `main` без соответствующей команды; локальный `published` не означает production-выпуск |

### 2.2 Key Entities

Теория и публикация уроков остаются content-as-code; действующий банк задач хранится в
PostgreSQL (§3). Задача самостоятельна и может иметь упорядоченные связи с уроками.

`TopicCatalogEntry` (учебная тема) `→` непустой упорядоченный `taskNumbers[]` (один или несколько
номеров ЕГЭ) `→` опциональный опубликованный `TopicLesson`
`TopicLesson` `→` `ConceptBlock[]` (смысловые разделы типизированной TSX-теории)
`TopicLesson` `→` `Subtopic[]` (авторская группировка соседних `ConceptBlock` со своим slug, Change 167;
уровень `core | advanced` и необязательная самопроверка подтемы, Change 171)
`Course` `→` `CourseModule[]` `→` `CourseLesson[]` (упорядоченная самостоятельная траектория;
уровень урока `core | advanced`, дополнительные уроки и их задачи не входят в mastery курса, Change 175)
`TopicLesson` / `CourseLesson` `→` `Task[]` через `lessons[{material_id, position}]`

Связи `Topic ↔ CourseLesson` отсутствуют в текущей модели намеренно. Их нельзя имитировать через
совместное владение Task, prerequisites, unlocks или навигационные рекомендации.
Уместная ссылка в авторском тексте TopicLesson на уже опубликованный урок Python допускается как
пояснение используемого приёма. Такая ссылка не создаёт отношение между сущностями, обязательный
предшествующий урок или общий учебный прогресс; она должна вести к действительно объясняющему
материалу и проверяться при публикации.

Теория и publication metadata живут в типизированном TSX/модулях `apps/web`; практика и checker
читаются из PostgreSQL. `content/practice-bank` — проверяемый исходный банк для явного импорта,
а `content/tasks` — исторические тестовые fixtures без runtime-потребителей. Course metadata и CourseLesson theory имеют
единственного frontend-consumer и поэтому остаются типизированным content-as-code, а не получают
параллельную JSON-модель. После Change 140 постоянное состояние ученика принадлежит серверу:
аккаунт с устойчивым ID, отдельные способы входа и отзывные сеансы, а также факты верного
решения. Каждый факт имеет контекст `topic_lesson`, `course_lesson` или `standalone`, ID контекста,
ID задачи, `solution_revision` на момент проверки и время. Для `standalone` используется
фиксированный ID контекста, без nullable-части уникального ключа. Повторная успешная отправка
для одной пары ученик/контекст/задача/версия идемпотентна; новая версия требует нового решения.
Одна задача считается решённой отдельно в каждом уроке; самостоятельная практика тоже отдельна.
Текст ответа, ошибочные попытки, черновики и готовые mastery-счётчики не сохраняются. Прогресс
курса вычисляется из результатов опубликованных уроков; будущая статистика уникальных задач
считает distinct task ID независимо от числа контекстов. Ручная отметка «пройдено» и права
доступа не подменяют факт верного ответа и имеют отдельное владение.

Платный доступ (Change 192). Каждая подтема темы ЕГЭ, страница «Практика и итог» и урок курса
имеют уровень доступа `access: free | paid`, заданный в модуле урока на сайте (`access` подтемы,
`paidPractice`, `accessTier` урока курса; Change 197) и выводимый в practice registry. Матрица деления
(решение архитектора 2026-10-16): курс Python бесплатен целиком; в курсе Excel бесплатны уроки 1–6
(модули «Лист» и «Формулы»); темы заданий 1–11, 14 и 16 бесплатны целиком; в остальных темах
бесплатна первая треть подтем (2–3), остальные подтемы и «Практика и итог» — платные. Внутри
бесплатной подтемы ничего не закрыто. Задача платная, если все её опубликованные членства в уроках
ведут в платные подтемы, платную «Практику и итог» или платные уроки; задача самостоятельного банка
(`catalog_visible`) остаётся бесплатной. `AccessPlan` — тариф из настроек (`month`: 490 ₽ на 30 дней,
`year`: 2 990 ₽ на 365 дней; цены и сроки задаются конфигурацией). `Payment` — разовая оплата
тарифа владельцем аккаунта; `AccessGrant` — период доступа, созданный успешной оплатой: начало —
позднейшее из «сейчас» и конца предыдущего гранта, возврат укорачивает или отзывает грант. Доступ
вычисляется из грантов, а не хранится флагом. `OfferAcceptance` — неизменяемая запись принятия
версии оферты при оплате; `Refund` — возврат по платежу; `ProviderEvent` — входящее уведомление
провайдера с дедупликацией. Автопродления, сохранённых карт и подписочной машины состояний нет.
Аккаунт и видимый «Профиль» — разные понятия; отдельная таблица профиля не нужна до появления
собственных редактируемых полей. Старые localStorage-записи не импортируются.

Публичный каталог тем хранит 25 записей, которые покрывают номера ЕГЭ 1–27 ровно по одному разу.
Запись 19–21 — одна тема «Выигрышная стратегия»; другие объединения требуют отдельного
педагогического решения. Каталог использует проект спецификации ФИПИ ЕГЭ 2027 как датированный
редакционный источник, но не делает будущие уроки доступными до статуса `published`.
Из обобщённого плана того же проекта каталог берёт уровень (базовый, повышенный, высокий), примерное
время и максимальный балл каждого задания (`examPlan` в `entities/topic-catalog`, Change 185). Цели
на `/ege` — База 40+, Стандарт 60+, Хард 80+ — накопительные по уровню; выбор хранится только на
устройстве (localStorage) и лишь приглушает темы вне цели, не скрывая их.

Публичный каталог мини-курсов хранит отдельный упорядоченный список направлений. Опубликованные
Python и Excel (Change 177) подставляют title, summary, route и состав уроков из Course publication
registry; «Алгоритмы и структуры данных» и «Решение задач повышенной сложности» остаются catalog-only
записями `planned`, не создают фиктивных Course/CourseLesson definitions и не получают URL. Каждый
опубликованный курс задан своими модулями на сайте (Change 197); publication registry перечисляет
курсы списком, а не одним зашитым курсом.

### 2.3 Content Quality Gate (Definition of Done)

Теория и практика готовятся вместе в feature-ветке. Когда урок готов к ручной проверке, его
локальная публикационная метка — `published`, а обычный импорт банка делает задачи доступными
без временного переключения БД. Архитектор проверяет факты, педагогику и визуальный результат
в таком же пользовательском состоянии, какое будет после выпуска, и сообщает замечания в Backlog
до `/ship`. Отдельной стадии `review` в данных и маршрутах нет. Production меняется только при
выпуске и предусмотренном операторском импорте.

Для банка задач сохраняется путь (§3): подготовка → проверка `validate` без записи → импорт →
немедленная доступность. Автоматическая валидация не доказывает корректность решения:
содержательная проверка и происхождение — ответственность подготовки пакета. Переезд старого
упражнения в БД сам по себе не включает его в общий каталог. Этот checklist обязателен при
подготовке и локальной проверке каждого урока; формальная автоматизация не заменяет проверку
архитектора до `/ship`.

Модули уроков сайта — единственный источник учебного текста (Change 197): правки вносятся прямо в
них. Схемы и записанные запуски программ пересобирает `scripts/lesson_design/site_media.py` из
вызовов построителей и кода в манифесте урока; код и вывод программ, ответы банка и доступ проверяют
тесты урока и банка, реестр практики и валидатор содержимого
([порядок](runbooks/lesson-pipeline.md#сайт--источник-уроков-change-197)).

Тема ЕГЭ проектируется по обязательному [пайплайну подготовки темы](runbooks/lesson-pipeline.md) и
[каталогу паттернов](runbooks/lesson-patterns.md); мини-курсы проходят тот же пайплайн (вместо
частотного анализа подборок — анализ конструкций и формул, которые используют темы ЕГЭ), разборы
заданий остаются в темах. Руководство [по подготовке урока](runbooks/lesson-authoring.md) поясняет
этот checklist, не заменяя его.

Представление, общее для тем и курсов:
- схемы — точные SVG, построенные кодом;
- блоки кода с шапкой (условное имя файла, копирование) и одно поле «Вывод» строками как в
  терминале; запускаемый код — пошаговое выполнение, записанное реальным запуском, без исполнения
  кода в браузере;
- код и вывод длиннее 8 строк сворачиваются, ключевые программы — нет;
- Excel: живой мини-лист `SheetBlock`. Без JavaScript — таблица значений со списком формул, с
  JavaScript — строка формул, рамки ячеек-предшественников и пересчёт правки. Его TypeScript-
  вычислитель проходит общий набор эталонных случаев опорного `sheet_eval.py`. Ещё есть песочница
  `FillSandbox` и блок формулы. Формулы — в русской локали (`;`), английские имена — в справочнике;
- задачи с одним коротким проверяемым ответом — задачи банка; ответ-формула или рассуждение —
  самопроверка урока;
- файлы данных и книги `.xlsx` — воспроизводимые вложения задач банка по контрольной сумме.

**Педагогика:**
- [ ] Новое понятие сначала вводится через понятную ситуацию и объяснение своими словами;
  специальный термин, обозначение и код появляются после смысловой подводки. Уже подробно
  объяснённые основы Python кратко напоминаются по месту и сопровождаются точной ссылкой на
  опубликованный урок мини-курса без повторного преподавания всего раздела.
- [ ] Для нового понятия: полный worked example → completion problem → самостоятельная задача;
  помощь сокращается с опытом (expertise reversal). Productive failure допустим только при
  настоящих смежных знаниях, с последующим разбором ошибочного подхода, не для нового синтаксиса.
  В темах ЕГЭ попытка до объяснения и задача экзамена в начале подтемы не используются
  (решение архитектора 2026-10-07, [каталог паттернов](runbooks/lesson-patterns.md)).
- [ ] Тема ЕГЭ прошла [пайплайн подготовки](runbooks/lesson-pipeline.md) и его чек-лист:
  исходник архитектора, частотный анализ подборок, основные и дополнительные подтемы, текст по
  паттернам П1–П18, проверенный код и ответы, одобренный архитектором урок на локальном сайте.
- [ ] Каждое место, где правильность приёма держится на доказательстве, сначала показано примером
  и схемой (при процессе — пошаговой анимацией), а строгое доказательство сохранено (П18).
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
- [ ] Блоки кода схлопываются: код и его вывод, код и дерево вызовов идут одним блоком; два блока
  подряд без текста между ними не допускаются.
- [ ] Точная учебная SVG-диаграмма (решение архитектора 2026-10-08) выбирается, когда схема
  показывает точные числа, структуру или шаги алгоритма (пары делителей, разложение, разбор числа
  по маске, сетка делителей). Она строится кодом из репозитория (`scripts/lesson_design/figures.py`):
  каждое число и подпись считает тот же код, что и рисунок, вручную SVG не рисуется. Правила
  размещения и подписи: после абзаца, одна подпись с сутью и числами, alt,
  читаемость на телефоне, цвета только из DESIGN. Процесс показывается пошаговой схемой с ручным
  переключением и без автозапуска; без JavaScript виден итоговый кадр и текст всех шагов. Схема
  стоит после абзаца или списка, который она иллюстрирует. Растровые рисунки и немые ролики (Changes
  158–159) удалены вместе со старым уроком рекурсии и их движком (решение архитектора 2026-10-13,
  Change 184): схемы уроков — только код-SVG. Исключение (решение архитектора 2026-10-20, Change 197):
  скриншоты окон программ в уроках курсов — `LessonImage`, WebP с собственным размером и подписью,
  источник каждого кадра записан в `docs/artifacts/lesson-images.md`.
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


---

## 3. Data Model

Theory remains authored content; PostgreSQL 18 owns the task bank. Stable task IDs, exact checker
answers, content blocks, private provenance, attachments and ordered lesson memberships are
preserved across schema changes.

The current-state model has task, private checker, lesson membership and file records. Small
metadata collections (skills, exam numbers, sources, theory links) use JSONB. There is one
solution counter for stale submissions and progress, without historical task snapshots.
One trusted operator imports/exports JSON using host tooling. Import updates selected IDs
transactionally, never deletes omitted tasks, and does not duplicate replayed data. Basic
structure, database integrity, bounded input and safe file paths remain mandatory. Concurrent
editing, package ledgers, revision history, background jobs and garbage collection are deferred.
Migrations are additive; no destructive in-place migration.

Server-owned account, verified identity, revocable session and progress records
(schema `140_01`). A result is keyed by user, task, solution revision and
learning context (topic lesson, course lesson or standalone practice); the same task in two
lessons has two independent results. A later answer revision invalidates the previous result
for current-progress projections without erasing its historical fact. No submitted answer text,
draft, incorrect attempt or guest result is stored. Lesson/course totals are derived from
published memberships and current revisions, not separately synchronized counters. For a topic
lesson the mastery total excludes tasks whose lesson membership is marked as outside mastery — the
tasks of advanced-level subtopics (Change 171); those tasks keep ordinary results, and the API and
the frontend apply the same membership flag.

Billing records (Change 192, schema `192_01`, schema `practice`): offer acceptance (append-only:
offer version, text hash, time), payment (provider invoice number, plan, amount in integer kopecks,
status `created | pending | succeeded | failed | refunded`, unique idempotency key, provider
reference, receipt status/link, paid time), access grant (payment, user, start, end), refund
(payment, amount, reason, status, idempotency key) and provider event inbox (unique per provider
event). The account write role gets narrow grants: no DELETE on billing tables, INSERT/SELECT only on
append-only ones. Account deletion ends access, files a refund request for the unused part and
pseudonymizes billing rows (user link and contact removed); billing rows are retained 5 years for tax
and consumer disputes. The free/paid level of materials is content metadata (§2.2), carried to the
API by the generated practice registry, not a database column.

Devices and restrictions (Change 198). A session additionally records a random device id from a
separate long-lived host-only cookie, a coarse device label (browser · OS from User-Agent), the IP
address and a city resolved from a local offline database at sign-in and last activity (updated at
most every 10 minutes), and the last-seen time; IP and city live only as long as the session row (at
most 30 days, a day after sign-out), known browsers without IP for 90 days. An append-only
account restriction record (kind `warning | suspension | termination`, reason, operator note,
created/ends/lifted time) is the evidence of every manual measure. Daily per-account counters (new
devices, evictions, cities, paid chunks served, solutions opened; 30 days) feed the operator signal
report; since Change 199 only devices, evictions and cities raise a signal, chunks and solutions are
informational numbers in the account card and never limit a reader (architect decision 2026-10-24). Accounts created through a
login provider record the same consent version and time as email registration.

## 4. API / Backend Contract

Existing `/api/tasks` detail/check/file and lesson-practice/course-summary capabilities remain.
Catalog supports server search in title, summary, visible statement, ID and public source number
(case-insensitive, е/ё folded; numeric queries also match exam numbers), grouped multi-topic OR selection, default stable ID order or difficulty
ascending/descending with ID tie-break, and numbered pages of 10/30/50/100 (default 30).
Topic counts include only catalog-visible nonarchived tasks, independent of search; zero topics
remain selectable. Course sections derive from publication metadata without publishing lesson-only
tasks. EGE practice filters cover every number 1–27 independently of lesson publication; their
canonical exam titles come from the shared dated 2027 exam-topic metadata. Lesson titles and
publication remain separate. Legacy exam/skill/difficulty links remain supported. Next task uses the same selection/order.
Change 191: catalog sorting, filters, facets and search read stored generated columns of the task
(`191_01`), never the compressed task JSON per row. `GET /api/tasks/suggest` returns at most six
matches of the current filters with title/snippet match ranges and the total. EGE 19–21 is one
catalog topic (`ege-19-21`; legacy `ege-19|20|21` links resolve to it) and one multi-part task per
game: public `answer_parts` (key, label, instruction) and a private per-part checker; check and
check-and-save accept either one `answer` or per-part `answers`, report per-part results, and
record success only when every part is correct.
Public projections exclude
checker answers and private sources. Wrong answers, missing tasks, stale solution counters and
unavailable services remain distinct. Regenerate OpenAPI/client types with implementation.
Runtime reads PostgreSQL, never silently falls back to historical JSON. API owns comparison and
normalization. Anonymous `POST /api/tasks/{id}/check` remains read-only. A separate authenticated
check-and-save command requires an active session and a valid published lesson membership or
standalone task; it checks the answer and revision, then records success in one database
transaction. An expired session returns 401, never silently downgrades to an unsaved guest attempt;
stale revisions retain 409. Repeating a successful request returns the already saved result.
Personal read endpoints derive progress from current task revisions and published memberships;
they return no-store data only to the owning account. The checker response distinguishes correct
from saved; a write failure never claims that progress was saved. Public catalog/lesson reads and
checker answers remain available without registration. Regenerate OpenAPI clients with the API.
No public task-bank write/admin API.

Change 198. A paid task's public projection carries an empty explanation; its solution is
returned by check/check-and-save or by `GET /api/tasks/{id}/solution` (active access, no-store;
no per-account limit since Change 199); free tasks are unchanged. `GET /api/auth/sessions` lists the owner's active devices
(label, city, last activity, current); `DELETE /api/auth/sessions/{id}` and
`DELETE /api/auth/sessions?others=1` sign devices out. A first login through a provider without a
linked account creates no account until `POST /api/auth/provider/register` receives the current
consent version. Account restrictions are an operator CLI (`signals`, `warn`, `suspend`,
`terminate`, `lift`), not an API; `GET /api/access` reports an active suspension (until, reason,
appeal contact).

Paid access (Change 192). Practice reads apply the access level (§2.2): for a viewer without access
lesson practice returns paid tasks as locked stubs (ID, position, revision, title, skills; no
statement, hints or files) and task detail, check, check-and-save and files of a paid task answer
403 `subscription_required`. `GET /api/access` returns the viewer's access state (until, plan) and
`GET /api/access/asset` is the internal yes/no check behind the paid-chunk gate (§7). Billing:
`GET /api/billing/offer` (flags, plans with prices and the reference monthly sum, current offer
version); `POST /api/billing/checkout` (session, CSRF, origin, verified email, plan, offer version,
client idempotency key; returns the provider redirect URL); `POST /api/billing/webhooks/{provider}`
(no session/CSRF; provider signature, event dedup, status re-fetched from the provider, idempotent
transition under a row lock, provider acknowledgement); `GET /api/billing/payments/{id}` (owner-only,
no-store; bounded status re-fetch while pending); `GET /api/billing/payments` (owner history with
receipt links). Refunds, payment lookup and yearly revenue are an operator CLI, not an API. While
`PAYWALL_ENABLED` is off every read is free; while `BILLING_ENABLED` is off checkout is unavailable.

An imported standalone task may have no authored hint or explanation; those lists are empty and
their help actions/panels are absent. Checker answers remain private and are not substituted for
an explanation. Attachments are bounded at 64 MiB. Original `.xls` attachments and GIF task images use the same content-addressed,
validated file delivery as the other bank formats. A one-time KEGE import (Change 188) adds only
new tasks compatible with the FIPI 2027 project; archived sections, 110/112, hidden records and
outdated formats are excluded. Existing task content, checkers and revisions are preserved.

## 5. Frontend / Client Contract

Public learning routes: `/`, `/ege`, `/courses`, course overview, published topic and course
lessons, `/practice`, task detail and `/privacy`. Planned entries remain non-links; there are no
internal lab or specimen routes. Change 192 adds `/pricing`, `/subscribe` (checkout), the payment
return page, `/oferta` (current offer with dated archive) and `/vozvrat`, plus an «Доступ» section
in the account.

### Paid access UI (Change 192)

Soft paywall, one visual pattern everywhere paid content appears, shown only while
`PAYWALL_ENABLED` is on and only to viewers without access: a lock icon after paid subtopics, «Практика
и итог» and paid course lessons in the left tree; a paid page keeps its breadcrumbs, title, `lead` and
the opening of its first section, which fades into the page background, followed by a paywall card
(why the rest is closed, what is inside — remaining subtopics and task counts from metadata, the
lowest monthly-equivalent price, «Открыть доступ»; for guests also «Войти»). Locked practice tasks
show title and skills with the same card pattern, never a statement. Topic and course cards may carry
a quiet free-part note («3 из 8 подтем бесплатно»). After payment the learner returns to the page
they came from. The light «Clean Textbook» system of DESIGN applies (no dark paywall, no loud badges);
the pattern is approved from a mockup before code.

`/pricing` shows Free («Ваш план» by default), Месяц and Год. The year plan shows the honest
comparison with paying monthly: the struck-through 12 × monthly sum, the percentage saved and the
per-month and per-day equivalents; the year column is emphasized quietly. No fictitious base prices,
fake countdowns or scarcity claims (§8.2). Checkout shows the chosen plan, «Оплатить» and one small
line «Нажимая «Оплатить», вы принимаете условия оферты» with a link; no checkboxes. The return page
polls the payment status and never trusts query parameters. The account «Доступ» section shows access
end date, payment history with receipt links and «Продлить». Footer links: «Тарифы», «Оферта»,
«Возврат» and one small line «Самозанятый ФИО, ИНН · email», which Robokassa requires in the footer
(Change 200, architect 2026-10-24; no city, no phone). All of them appear only while selling is on.

### Visual system, lessons and catalogs

DESIGN is the binding visual contract («Clean Textbook», light only, Кодумка stone identity,
self-hosted Onest and JetBrains Mono, approved v5 mockups in `docs/artifacts/mockups-v5/`), and
FRONTEND is the binding implementation contract (§1 interaction contracts, §5 learning and state,
§7 catalogs). Product rules they implement:
- the home page is the colourful entry, every other page a calm white reading surface;
- lessons use one three-column frame: a file tree on the left, the lesson with breadcrumbs, «На этой
  странице» with progress on the right. EGE topics are split into subtopic pages
  `/ege/{topic}/{subtopic}`, with advanced subtopics after the core ones; course lessons keep in-page
  anchors;
- lesson blocks (learning table, collapsible proof, exact SVG, step-through diagram, sandboxes,
  `SheetBlock`, `FillSandbox`) stay readable without JavaScript;
- the practice catalog is the primary solving surface: expandable rows, search, topic/difficulty
  filters, numbered pagination; GET fallbacks without JavaScript; one answer layout for catalog,
  detail page and lessons;
- guest progress shows `0 из N` from public totals plus a sign-in invitation. It is never saved,
  never drives filters or continuation, and loading or account switches never show another account's
  snapshot;
- `GET /api/topics/practice-summary` returns `{topics: [{id, tasks: [{id, solution_revision}]}]}`
  for published memberships without statements or checker data. Missing summaries are unavailable,
  never zero; the catalogs stay prerendered without database reads and load summaries as an
  enhancement.

Base UI owns controls, Lucide owns icons. There is no telemetry consent UI or client-error
collector, and no generic global state layer.

## 6. Auth & Access Model

С Change 140 ученик может зарегистрироваться по подтверждённому email и паролю либо войти через
VK ID или Яндекс ID (вход через Telegram удалён в Change 198: иностранный сервис, 149-ФЗ ст. 10
ч. 8 и КоАП 13.55 с 07.07.2026). Каждый способ входа привязывается к внутреннему `user_id` по
проверенному идентификатору провайдера (`provider`, `subject`); email провайдера не является
ключом объединения. Социальный аккаунт может не иметь email. Привязка нового способа входа
выполняется только из уже открытого аккаунта после повторного подтверждения, отвязка последнего
способа запрещена. Повторное подтверждение (Change 227) — вход не старше 10 минут. Если окно
истекло, профиль сам просит войти ещё раз паролем или подключённым провайдером и затем
продолжает начатое действие. Ошибки возврата от провайдера показываются на странице, а не JSON-ом.
В dev и тестах провайдеров заменяет локальный подставной (`AUTH_FAKE_PROVIDERS`), в production он
запрещён. Автоматическое объединение двух аккаунтов, перенос локального прогресса и
учебного прогресса между аккаунтами отсутствуют. У страницы «Профиль» пока нет отдельной таблицы.

Аккаунт, созданный через провайдера, может после недавнего повторного подтверждения входа
добавить почту и пароль как запасной способ входа. До подтверждения адреса одноразовой ссылкой
этот способ не работает; исправление ожидающего подтверждения адреса отзывает прежние ссылки.
Адрес, уже занятый другим аккаунтом, привязать нельзя: совпадение email не объединяет аккаунты.

Вход через провайдера использует серверный authorization-code redirect/callback с одноразовыми
state/PKCE и проверкой issuer/подписи/получателя, где они применимы. Возврат разрешён только на
внутренний проверенный путь. Токены провайдеров не хранятся в браузере и после получения своего
сеанса не удерживаются без нужды. Email/пароль требуют подтверждения адреса, стойкого хеша
пароля и восстановления доступа через ограниченный по времени одноразовый токен. Запрос
восстановления не раскрывает наличие аккаунта. Потеря провайдера лечится другим привязанным
способом входа; доступ к чужому аккаунту по совпавшему адресу почты не выдаётся.
VK ID и Яндекс ID по умолчанию выключены отдельными release-флагами. Пока флаг
выключен, вход, привязка, повторное подтверждение и callback не доступны; интерфейс явно
показывает способ как недоступный. Включение каждого флага требует проверенных учётных данных,
callback и сценария входа, а также проверки, что существующие пользователи не теряют единственный
способ входа при последующем выключении.
Повторное письмо подтверждения или восстановления фактически отправляется не чаще одного раза
в 60 секунд и не более пяти раз за скользящий час для адреса и назначения письма. Публичный
ответ остаётся одинаковым для подходящего и неподходящего адреса, а интерфейс предлагает
проверить «Спам», повторить запрос после ожидания или исправить введённый адрес.

Сайт выдаёт собственную отзывную серверную сессию в host-only `Secure`, `HttpOnly`, `SameSite`
cookie. Идентификатор сессии хранится на сервере только в виде проверяемого хеша; вход и
чувствительные изменения обновляют/отзывают сессии. Для мутаций действуют CSRF-защита, проверка
владельца, отдельные лимиты входа/регистрации/писем и защита от перебора. Персональные ответы
имеют `Cache-Control: no-store`; SSR не подмешивает данные другого аккаунта в публичный HTML.
Сеанс не превращает технические роли автора/оператора/БД в пользовательские права.

Отдельная ограниченная роль приложения читает нужные записи checker и записывает только таблицы
аккаунтов, сессий и прогресса; `infraege_runtime` остаётся read-only для публичных reads, а
`infraege_import` не используется для ученических записей. Production PostgreSQL не открыт в
интернет; операторский SSH-контракт не меняется. Публичные страницы и анонимный checker работают
без сессии. Настройки входа, подтверждения и удаления аккаунта принадлежат пользователю; удаление
отзывает сеансы и удаляет его учебные результаты. Сброс прогресса урока затрагивает только этот
контекст и требует подтверждения.

### 6.1 Платный доступ (Change 192)

Право доступа отделено от идентичности: вход его не даёт, доступ даёт только действующий
`AccessGrant` (§2.2). Скрытие ссылки или текста в интерфейсе защитой не считается. Платная теория
не попадает в публичные файлы: каждая платная подтема и платный урок курса — отдельный TSX-модуль
`*.paid.*`, который загружается через `React.lazy`; сборка складывает их
чанки в `/assets/paid/`, и Nginx отдаёт этот путь только после внутренней проверки
`GET /api/access/asset` с cookie сессии (`auth_request`). Основной модуль урока содержит
бесплатные блоки, метаданные и превью всех подтем. SSR узнаёт доступ серверной функцией, которая
передаёт в API только cookie сессии: зрителю с доступом рендерит полный текст (`private, no-store`),
остальным — превью и блок оплаты; публичный HTML гостя не меняется от наличия чужих сессий.
Проверка сборки падает, если контрольная фраза платного модуля найдена в публичных файлах вне
`assets/paid/` или в предрендеренном HTML. Задачи платных подтем закрывает API (§4).

Оплатить доступ может только вошедший владелец аккаунта. Чек приходит на подтверждённый адрес аккаунта, а если его нет (вход через VK ID или Яндекс ID), — на адрес, который покупатель вводит на странице Robokassa. Этот адрес хранится вместе с оплатой и обезличивается при удалении аккаунта (Change 228). Оплата —
принятие оферты (ГК ст. 438); сервер записывает показанную версию оферты. Тарифы разовые, без
автопродления и сохранения карт; повторная покупка продлевает доступ от даты окончания.
Флаги `PAYWALL_ENABLED` и `BILLING_ENABLED` выключены по умолчанию: пока они выключены, все
материалы бесплатны, а оплата недоступна; включение — правка окружения и перезапуск, без нового
кода.

### 6.2 Устройства и ограничения (Change 198)

Доступ личный. У аккаунта не больше трёх активных устройств: устройство — браузер со своей
cookie-идентификатором устройства; повторный вход с того же браузера не создаёт нового
устройства. Вход с четвёртого устройства отзывает сессию, которая дольше всех не использовалась,
а вход с нового устройства отправляет владельцу служебное письмо (город, браузер, время,
совет сменить пароль). Владелец видит список «Где выполнен вход» и может завершить любой сеанс
или все, кроме текущего. Отпечаток браузера не используется.

Ограничения применяет только оператор вручную, после просмотра сигналов (одновременная
активность из разных городов, частое вытеснение устройств, частые новые устройства; объём
платных скачиваний и решений — только справочные числа, лимитов на чтение нет); автоматической
блокировки нет. С Change 199 сигналы, меры, возвраты, поиск аккаунта и журнал инцидентов доступны
в операторской консоли `sre.infraege.ru` (smotryashchiy §4j): агент на production забирает
разрешённые команды и выполняет их хостовым исполнителем; CLI остаётся запасным путём. Ступени: предупреждение (сеансы завершаются, письмо,
уведомление в аккаунте) → приостановка платного доступа на срок (аккаунт, прогресс и бесплатные
материалы сохраняются; платные страницы показывают дату, причину и контакт для обжалования)
→ прекращение доступа с возвратом за неиспользованные дни. Снятие ограничения уведомляет
пользователя. Порядок закреплён в оферте; обжалование — письмом на контакт, указанный на плашке.

---

## 7. Infrastructure and Deploy/CI

### 7.1 Application topology

Один application Compose: Nginx → web/API → PostgreSQL. API и Nginx читают task-files
с read-only mounts. Ubuntu, journald, fail2ban, TLS renewal и application backup остаются.
Доступ root/password SSH с pinned host key сохраняет ранее принятое решение архитектора
(подтверждено повторно 2026-09-23: пароли остаются ради удобства ручного и агентского входа,
риск перебора ограничивается fail2ban с растущим баном повторных нарушителей и `MaxAuthTries 3`).
Вне Compose на хосте работает агент `smotryashchiy` (systemd `smotryashchiy-agent`, отдельный
продукт и репозиторий): он только читает метрики, журналы, Docker и fail2ban и отправляет их
на `sre.infraege.ru`; установка и обновление описаны в production runbook.

Публичное имя и origin (Change 193, решение архитектора 2026-10-18): бренд «Кодумка», сайт
`https://kodumka.ru`; `www.kodumka.ru`, `infraege.ru` и `www.infraege.ru` отвечают 301 на
`https://kodumka.ru` с сохранением пути и query. Сертификаты выпускаются и продлеваются для обоих
доменов; старый домен остаётся зарегистрированным ради переадресации. Письма уходят с
`accounts@kodumka.ru` (Postbox, DKIM CNAME в зоне reg.ru), контакт для обращений —
`kodumka@mail.ru`. `infraege` остаётся внутренним кодовым именем: репозиторий, Compose-проект,
тома и роли БД, `/etc/infraege`, имена cookie и ключи `localStorage` не переименовываются.
Аналитика `smotryashchiy` остаётся на `sre.infraege.ru`.

### 7.2 Deploy / CI

CI (`quality.yml`) выполняет static/build/security checks через группы `scripts/gate.py`; обычные
pytest/Vitest/unit/DB suites остаются локальными. Узкое исключение (решение архитектора
2026-09-26): еженедельные и ручные browser/no-JS/accessibility/layout и Lighthouse-аудиты в GitHub
Actions на host runner с синтетическими данными, не внутри application image и не на каждом
PR/push; публичный production-аудит только читает. Результаты остаются в GitHub Actions.
Отсутствующий или неуспешный запуск не является PASS, но не запускает Full и не блокирует
несвязанное изменение; известная критическая проблема аккаунтов, данных или выпускаемого
артефакта устраняется до затронутого релиза.

Production использует immutable SHA images. Deploy — явный workflow_dispatch с health/smoke и
rollback на предыдущий release; rollback на любой хранимый релиз использует тот же
`infraege_postgres122-data`. Обычный deploy не импортирует контент. Изменение schema head требует
exact-SHA restore-приёмки (STACK Release Gate, runbook backup/restore); новые grants роли записи
уже, чем у импортёра. Provider credentials, callback origins и доставка почты проверяются в
окружении до релиза. Content validation и OpenAPI drift проверяются до merge.

### 7.3 Minimal operations

Здесь только TLS, health, журналы, rate limits и scheduled application backup/restore. Сервисы
мониторинга и аналитики в этот Compose не возвращаются.

Наблюдаемость и операторская консоль — отдельный self-hosted сервис `smotryashchiy`
(`sre.infraege.ru`, свой репозиторий и VPS, тот же оператор). Публичные страницы подключают его
cookieless snippet; CSP допускает `https://sre.infraege.ru` только в `script-src`/`connect-src`, без
`unsafe-eval` и без first-party proxy. Расширять эту границу можно только новым решением архитектора.

Платный доступ (§6.1) сервисов не добавляет. Провайдер — Robokassa: самозанятый, каждый чек
регистрируют «Робочеки СМЗ» в «Мой налог», при возврате чек аннулируется. Код работает через порт
провайдера, фейковый адаптер в production отключён.

Nginx:
- внутренний `auth_request` для `/assets/paid/`;
- отдельный `location` уведомлений провайдера со своей зоной лимита и малым телом;
- оплата — обычная навигация на страницу провайдера.

Хостовый таймер биллинга ([billing runbook](runbooks/billing.md)):
- досверяет зависшие платежи и закрывает неоплаченные заказы;
- раз в сутки сверяет платежи и чеки с провайдером;
- считает выручку года против лимита НПД: 70 % — журнал, 85 % — письмо, 95 % — пауза оплат;
- пишет «доступ заканчивается через 3 дня».

Секреты и флаги — в `/etc/infraege/production.env`. На хосте хранятся три последних релиза и цели
`current` / `database-current`. Под защитой — том `infraege_postgres122-data` и снапшоты
`infraege-application`.

## 8. Non-Functional Requirements

### 8.1 Data changes and recovery

Before changing persistence, preserve and restore-check the actual bank/files; verify IDs, content,
checker, memberships and file parity on an isolated target. Scheduled backup covers database and
referenced files; restore runs into an empty isolated target. Production transfer and host service
retirement require explicit release authorization and the affected migration/restore checks, not
an automatic Full Gate. Account data changes restore-check identities, session revocation and
per-context progress on an isolated target. Guest browser progress is never migrated.

### 8.2 Existing non-functional baseline

| Concern | Requirement |
|---------|-------------|
| Security headers / CORS | Rate limiting чекер-эндпоинта на Nginx: `limit_req_zone` 20 req/min/IP, burst 5, `nodelay` (см. §4) — против автоматизированного перебора банка ответов; конкретную цифру пересмотреть по факту логов после запуска. Основной public root/password SSH использует принятый архитектором минимум 12 символов, pinned host key, UFW и fail2ban; production Environment не имеет required reviewers по решению архитектора от 2026-09-04, `can_admins_bypass` остаётся единственным environment safety property. Повышенный риск перебора и полного захвата VPS при компрометации более короткого пароля осознанно принят, key-only migration не запланирована. |
| Accessibility target | Public pages не имеют serious/critical axe violations; lesson outline сохраняет вложенный semantic list, anchors, keyboard focus, различимый текущий пункт и корректный source order, а сложный визуал имеет видимую полную текстовую альтернативу |
| Performance budget | Lighthouse-аудит раз в неделю или по запросу сохраняет median LCP ≤4.0s на мобильном 4G-профиле; продуктовая цель остаётся LCP ≤2.8s. CLS < 0.1, INP < 200ms. Server response (Change 191): on the full local bank `/practice` TTFB ≤300 ms, catalog/facet API ≤100 ms, search and suggestions ≤150 ms. Измеряются `/`, `/ege`, `/courses`, `/courses/python` и `/ege/16-rekursiya`; cold-load font/layout shifts проверяются отдельно. Lighthouse не является обязательным шагом каждого релиза или изменения CSS; подозрение на регрессию требует целевого измерения, а не автоматического Full Gate. Порог не ослабляется ради ускорения |
| Observability | Health, structured server logs, an external availability/TLS probe (failure → Telegram to the operator, Change 194) and the cookieless `smotryashchiy` beacon allowlisted in CSP (§7.3): no cookies, no persistent visitor id, no consent UI, never account/auth paths. No dashboards or monitoring stack in this repo. Payment conversion is read from billing rows (`admin funnel`), not tracker events. Host jobs write aggregate documents for the monitoring agent: business summary (counts and sums only, Change 195), backups (Change 196), operator export (Change 199) — [production runbook](runbooks/production.md) |
| Backup / restore | Application DB, files, roles and protected environment in encrypted Restic: 7 daily + 4 weekly + 3 monthly, monthly isolated restore that covers billing, device and restriction tables and grants. Every backup is copied off-site to versioned Yandex Object Storage in Russia; the host key cannot delete versions. A failed copy or check fails its unit; an hourly summary feeds the monitoring BACKUPS ledger. Off-site storage is a prerequisite for paid access (Change 196) — [backup runbook](runbooks/backup-restore.md) |
| SEO | `/`, `/privacy`, published topics, courses и CourseLesson имеют canonical, уникальные metadata, SSR content, общий crawlable social preview и входят в sitemap (prerender только `/` и `/ege`, остальное SSR); root document публикует browser-only manifest, SVG/PNG/ICO favicon и Apple touch icon из production-знака, а `/` — правдивый `WebSite` JSON-LD без выдуманной Organization; черновые маршруты остаются unlisted, `noindex,nofollow` и исключены из public discovery; платные страницы (Change 192) остаются в sitemap, робот получает ровно то, что гость (превью и блок оплаты, без клоакинга), с JSON-LD `isAccessibleForFree: false` и `hasPart` на закрытую часть; `/subscribe` и страница возврата с оплаты — `noindex`; страницы входа, регистрации, восстановления, подтверждения почты и `/account` — `noindex` и закрыты в robots.txt вместе с `/api/` и `/_serverFn/`, robots.txt даёт Яндексу `Clean-param` для служебных параметров (Change 194); задачи практики, включая банк КЕГЭ, индексируются с собственными title и description из условия (решение архитектора 2026-10-19); sitemap содержит только отвечающие 200 адреса, crawl-пути не делят лимит чтения практики; Lighthouse SEO для публичных маршрутов проходит без ошибок |
| Mobile / no-JS readability | TopicLesson, Course overview и CourseLesson сохраняют текст, программу, подписи, решения и section anchors в SSR HTML (платные части — для зрителя с доступом; остальным SSR отдаёт превью и блок оплаты, Change 192); интерактивная проверка и персональный progress остаются progressive enhancement |
| Client resilience / API drift | Route failures восстанавливаемы без белого экрана; loading/empty/error/not-found состояния доступны с клавиатуры и скринридера; OpenAPI schema/types drift ломает gate до merge; runtime HTTP имеет timeout/abort и не делает скрытый retry мутаций |
| Account security | Passwords use a current password-hashing scheme; verification/reset tokens expire and are single-use; sessions are server-revocable, HttpOnly/Secure/SameSite and protected from CSRF. Auth endpoints have targeted abuse limits, generic recovery responses and no sensitive URL/query/access-log leakage. Authentication does not grant editorial, operator or paid access. At most three active devices per account, a new-device email, owner-visible device list and sign-out (§6.2). Paid chunks get their own anti-bot budget of the practice-read size (120/min, burst 110); no limit a reader can feel. |
| Personal-data isolation | Progress and account reads/writes are owner-scoped and no-store; logout and account switching clear in-memory personalized state. Guest checking remains anonymous and read-only. Account/identity/progress data and new role grants are covered by isolated backup/restore checks. |
| Юридическое (152-ФЗ) | `/privacy` публикует цели, состав, сроки, получателей и права субъекта; оператор назван (ФИО, ИНН, email, без адреса). Согласие — отдельный версионированный документ (`/consent`) и отдельная неотмеченная галочка при регистрации, в том числе после первого входа через провайдера; API фиксирует версию и время; с версии `2026-10-25` согласие содержит заявление о 14+ или согласии законного представителя, возраст не проверяется. Оплата и защита аккаунта опираются на исполнение договора. Уведомление РКН подано 2026-10-25 (дата начала обработки 10.08.2026), акт оценки вреда — степень высокая. Сервер мониторинга оператора в России получает email, ID, IP и город активных сеансов для защиты аккаунтов (Change 199). Трансграничной передачи и зарубежных ресурсов на страницах нет. Тексты — инженерный ориентир без юриста (решение архитектора); подробности, журнал обращений и памятка утечек — [docs/legal](legal/README.md) |
| Публичные профили (будущее) | Публикация любых данных пользователя (псевдоним, аватар, результаты, место в рейтинге) требует отдельного согласия на распространение (ст. 10.1): выключено по умолчанию, отдельное действие со ссылкой на документ, выбор полей, версия и время в БД, отзыв сразу скрывает публикацию; email и настоящее имя не публикуются, по умолчанию — псевдоним. Текст документа готовится в Change 198, интерфейс — вместе с профилями |
| Юридическое (436-ФЗ) | Возрастная маркировка для обычного сайта не вводится: существующая `12+` удаляется без замены на `18+` |
| Происхождение контента | Существующие уроки сохраняют Content Quality Gate (§2.3). Для нового банка принято импортируемое содержимое с явным provenance (§3); происхождение, атрибуция и допустимость использования проверяются при подготовке импорта, не выводятся автоматически из URL и не заменяются технической валидацией |
| Платежи (Change 192) | Номер карты и платёжные данные не проходят через сайт; уведомления провайдера принимаются только с верной подписью, статус перезапрашивается у провайдера, обработка идемпотентна; двойное нажатие оплаты не создаёт двух платежей; суммы — целые копейки; логи биллинга без email, токенов и сырых уведомлений; возвраты — только операторская CLI. Пока флаги выключены, production бесплатен |
| Юридическое (оплата) | Продавец — самозанятый (НПД, лимит 2,4 млн ₽ в год, чек на каждую оплату и аннулирование при возврате через провайдера). Принцип архитектора (2026-10-17): юридические требования выполняются в наименее заметной законной форме, но не ниже законного минимума. Оферта и правила возврата — версионированные страницы; ФИО и ИНН продавца — только в блоке «Реквизиты исполнителя» в конце оферты (паспорт и адрес не публикуются), в подвале — ссылки без имени. Галочек нет: строка под «Оплатить» о принятии оферты; пункт о покупке несовершеннолетним (ГК ст. 26) и полном возврате по обращению родителя — в оферте; там же (Change 198) личный характер доступа, лимит устройств, запрет копирования и автоматического скачивания, ступени ограничения и обжалование — без отдельной страницы правил и новых строк в формах. Возврат — пропорционально неиспользованным дням (ЗоЗПП ст. 32). Цены и скидки правдивы (38-ФЗ ст. 5): зачёркнутая сумма — только реальное сравнение (12 × месячный тариф), без фиктивных базовых цен, ложных таймеров и дефицита. Юридическая проверка не проводится (решение архитектора 2026-10-18) |
| Other (юридический ориентир, не консультация) | Открытые источники используются как инженерный ориентир (сводка — [privacy-legal-checklist](legal/privacy-legal-checklist.md)); юриста нет по решению архитектора. Уведомление РКН подано 2026-10-25 с фактической датой начала обработки 10.08.2026 (Change 216); при изменениях сведений — до 15-го числа следующего месяца. |

---

### 8.3 Proportional verification

Решение архитектора 2026-09-26: приоритет — скорость разработки и доставки при достаточной защите
учебных сценариев, аккаунтов и данных. Собственная CI/CD-платформа, scheduler, snapshot runtime,
artifact cache и ledger доказательств не вводятся. Один affected-area Critical завершает связный
набор работ; `/ship` проверяет только изменившееся; Full — только явный запрос. Секреты публикуемых
коммитов проверяются до push, изменённые зависимости — аудитом, auth/доступ/прогресс — своими
функциональными и security-boundary проверками, schema/data — миграционной и restore-приёмкой;
каждый release image сканируется по digest до deploy, production health проверяется заново.
Разрешение локального ship не означает разрешение push/deploy. Команды — STACK, политика выбора —
[verification runbook](runbooks/verification.md).

## 9. Roadmap

Ordered unfinished outcomes (each a separate change, smallest coherent slice first). Done since the
last roadmap: all 25 EGE topics on the lesson pipeline (Changes 171–190), the release of the redesign
and rebuilt lessons on kodumka.ru (2026-10-24), paid access in test mode (Change 192), the operator
console (Change 199), one chunk per topic and course lesson (Change 222). Robokassa activated the
shop on 2026-10-28; Робочеки СМЗ are active. Changes 227–229 were released together on 2026-10-28:
- sign-in methods with re-confirmation;
- payment without an account email, the plan cards;
- the offer, refund and privacy editions of 2026-10-28;
- the receipt nomenclature for Робочеки;
- postgres kept across releases, the `body-parser` fix.

Both recovery holds were released on 2026-10-26. Changes 230 and 231 followed the same day: the
return to the payment page, the receipt address with «+», the return-address signature. Steps 2–4
below are the checklist of Change 232.

1. Done: the release of Changes 227–229 (`/ship 229 --release`).
2. **Production checks after the deploy:**
   - `/health/ready` on the new SHA;
   - postgres was recreated once by this deploy (its configuration changed). The next deploy must
     keep its `StartedAt`;
   - the nightly backup records the right release;
   - the new offer edition on `/oferta`;
   - sign-in scenarios with the architect's test VK ID and Яндекс ID in Playwriter: test Кодумка
     accounts are created and deleted, the main accounts stay untouched.
3. **Robokassa test mode on production:**
   - a month purchase by an account with an email and by a VK-only account — Robokassa must ask for
     the receipt address;
   - `/subscribe/return` opens access, no `billing.notification_rejected`;
   - the OpStateExt answer kept as a fixture in `test_robokassa.py`;
   - a full test refund.
4. **Live payments:**
   - live passwords #1 and #2, `ROBOKASSA_TEST=false`;
   - a real 1 ₽ purchase: the receipt in «Мой налог» and in the buyer's mail;
   - its full refund annuls the receipt;
   - real prices restored;
   - the announcement for topics that are free today, then `PAYWALL_ENABLED=true` by the
     architect's decision.
5. **Registry.** Record the RKN registry number when it appears: notice `100472735` was filed
   2026-10-25, registration takes 1–30 days.
6. **Hints and solutions for the 5,187 imported KEGE tasks in `/practice`**, in several iterations.
   The architect deferred it on 2026-10-25.

Later product decisions may add manual completion, richer statistics, auto-renewal, live formats
and parent reports; each needs its own decision.

## 10. Out of Scope

Production deployment/host mutations in local work; deleting old volumes; auto-renewal, saved cards
and price changes for existing buyers; public billing/admin API;
collaborative editing; editorial audit history; automatic import conflict resolution; background
imports/file garbage collection; hosting analytics dashboards or a monitoring stack in this repo
(dashboards remain in the separate `smotryashchiy` deploy — this repo only allowlists its origin
in CSP, §7.3); labs and internal design specimens. Automatic account merging, guest-progress import,
saved answer text, standalone profile table, manual completion and advanced statistics are out of
scope. Single-operator sequential imports and ordinary pagination
are intentional first-version limits. Formal legal review, key-only SSH and new content remain separate
decisions.

## 11. Open Questions

Before enabling paid access (Change 192 flags), still open: Robokassa shop activation (waits for the
payout account check) and the 1 ₽ payment/refund proof; the date and text of the announcement for
topics that are free on production today. Done: НПД, Робочеки, offer and refund editions, Яндекс ID
and VK ID, RKN notification (2026-10-25), off-site backups with a restore proof, provenance of tasks
in paid subtopics.
