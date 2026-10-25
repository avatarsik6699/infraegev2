# TECHNICAL SPECIFICATION (SPEC.md): `infraege`

> **For AI agents:** read the active change and the SPEC sections it affects; §3–§4 for data/API,
> §2.3 for authoring, §5 plus FRONTEND for web, §7–§8 for operations. Read SPEC in full for initial
> product planning or a product/system pivot. Read STACK gate/tooling rows and relevant GOTCHAS;
> do not load unrelated archive history by default.

## Metadata

| Field | Value |
|-------|-------|
| Document Version | `v2.35` |
| Date | `2026-10-19` |
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

| Included (MVP) | Excluded (сознательно не входит в MVP) |
|-----------------|------------------------------------------|
| Полная публичная карта заданий ЕГЭ и 2 проверенные TopicLesson как содержательный MVP baseline | Полноценный тренажёр-пробник ЕГЭ с таймером на весь вариант |
| 1 мини-курс — Python (закрывает больше всего номеров: 6, 8, 11, 14, 15, 16, 17, 18, 20–27) | Автоматическая персональная рекомендация следующей темы |
| Завершённый самостоятельный мини-курс Python с отдельным Course/CourseLesson flow | Автопродление и сохранённые карты, живые форматы (группы, занятия), кабинет учителя, реклама |
| Платный доступ (Change 192, §6.1): два разовых тарифа, soft paywall, оплата через провайдера с чеками самозанятого; включается флагами вместе с релизом | |
| Публичные, индексируемые страницы тем и уроков (SSR/SSG) | AI внутри продукта (только как инструмент автора при подготовке контента) |
| Практика по каждой опубликованной TopicLesson: 5–10 заданий с проверкой ответа, без адаптивного подбора сложности | Полные TopicLesson для остальных заданий ЕГЭ — вторая волна, по той же структуре |
| Мини-курс Excel (задания 3, 9, 18, 22): стенд по пайплайну — Change 176, перенос на сайт — Change 177 | |
| Необязательный аккаунт и серверный прогресс после Change 140; все текущие учебные действия доступны гостю | i18n/локализация (аудитория исключительно русскоязычная) |
| | Полноценный поиск по сайту (линейная карта из 25 тем остаётся обозримой без отдельного поиска) |

Текущий состав опубликованных материалов задают publication registries
(`apps/web/src/entities/lesson/content/lesson-registry.ts` и Course registry): независимый Python
Course и опубликованные TopicLesson. С Change 175 курс — 30 CourseLesson в 8 модулях (27 основных и
3 дополнительных), собранных по пайплайну на демо-стенде (Change 174); задачи его уроков — server-owned
задачи банка, задачи прежних 28 уроков архивированы. С Change 177 опубликован второй курс — Excel:
15 CourseLesson в 6 модулях (14 основных и 1 дополнительный), собранных на стенде (Change 176);
задачи его уроков — задачи банка, у задач на данных задачника курса — вложение `.xlsx`.
Новые Topic-связи не следуют из публикации курса. Текущий deployed SHA проверяется через
`/health/ready`, а не выводится из local `main`, `origin/main` или старого релиза.

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

С Change 197 (решение архитектора 2026-10-19) модули уроков сайта — единственный источник учебного
текста: правки вносятся прямо в них, экспорт со стенда удалён, а архив демо-стенда
`content/lesson-design/` удалён 2026-10-23 (T259; он в истории git). Схемы и записанные запуски программ пересобирает
`scripts/lesson_design/site_media.py` из вызовов построителей и кода в манифесте урока; код и
вывод программ, ответы банка и доступ проверяют тесты урока и банка, реестр практики и валидатор
содержимого ([порядок](runbooks/lesson-pipeline.md#сайт--источник-уроков-change-197)).

Тема ЕГЭ проектируется по обязательному [пайплайну подготовки темы](runbooks/lesson-pipeline.md)
и [каталогу паттернов](runbooks/lesson-patterns.md); до Change 197 одобренная на демо-стенде тема
переносилась на сайт отдельным change. Мини-курс Python проходит тот же пайплайн (раздел «Мини-курс Python»):
вместо частотного анализа подборок — анализ конструкций, которые используют исходники тем ЕГЭ;
алгоритмические приёмы тем остаются в темах. Практический порядок переноса и подготовки уроков Python — в
[руководстве по подготовке урока](runbooks/lesson-authoring.md); оба документа поясняют этот
checklist, не заменяя его. Схемы демо-стенда — точные SVG-диаграммы, построенные кодом; при переносе
они остаются SVG-диаграммами по правилу ниже. Урок мини-курса перенесён со стенда целиком: блоки
кода с шапкой (условное имя файла, копирование), одно поле «Вывод» строками как в терминале (набранный
ввод — «клавишей» с ↵, ошибка — красным), запускаемый блок кода — пошаговое выполнение, записанное
реальным запуском (`site_media.py`), без исполнения кода в браузере (Change 175), песочница диапазонов и
срезов; сворачивание кода и вывода длиннее 8 строк, кроме режима пошагового запуска. Ссылки
существующих TopicLesson на снятые уроки курса ведут на урок, который теперь объясняет тот же приём;
снятые уроки удаляются без редиректов. Тема ЕГЭ перенесена так же целиком, экспортом: мини-листы
и формулы — блоками курса Excel (`SheetBlock` со стенами и книгой из файла, `FormulaBlock`), термины
Excel — подсказкой со ссылкой на урок курса, запускаемый код — `CodeRunner`, файлы данных и книги
`.xlsx` — воспроизводимые вложения задач банка (Change 184).

Мини-курс Excel (решение архитектора 2026-10-11, Change 176) проходит тот же пайплайн (раздел
«Мини-курс Excel»): исходник — учебник и книга архитектора; вместо частотного анализа —
анализ формул, которые используют темы 3, 9, 18 и 22. В курс идут механизмы электронной таблицы
(ссылки и их копирование, функции, условный подсчёт, поиск по ключу, расчёт по вычисленным
соседям); разборы заданий передаются темам. Формулы показываются в русской локали (`;` между
аргументами), английские имена — в справочнике. Каждая таблица-пример вычисляется при сборке
опорным вычислителем и сверяется независимой библиотекой; на стенде и сайте это живой мини-лист:
строка формул, подсветка ячеек, на которые ссылается формула, правка исходных чисел с пересчётом
в браузере (вычислитель ограничен функциями курса и проходит общий набор эталонных случаев).
Задачник курса (.xlsx) генерируется из тех же данных, что и уроки.

Перенос курса Excel на сайт (Change 177) повторяет перенос курса Python: урок экспортирован со
стенда целиком; с Change 197 он правится только на сайте. Лист стенда становится блоком `SheetBlock`: при SSR и без
JavaScript — статичная таблица значений с адресами и списком формул под ней; с JavaScript — выбор
ячейки, строка формул, цветные рамки ячеек-предшественников и правка исходных чисел с пересчётом.
Пересчёт выполняет TypeScript-вычислитель того же подмножества функций; он проходит общий набор
эталонных случаев, записанный опорным вычислителем `sheet_eval.py`, и расхождение — ошибка проверки.
Песочница копирования формулы — `FillSandbox`; формулы в тексте — блок формулы с подсветкой
функций и ссылок; пошаговые схемы, включая вычисление формулы по шагам, — общий пошаговый блок.
Задачи урока с одним коротким проверяемым ответом (число, слово, адрес) — задачи банка; задачи,
где ответ — формула или рассуждение, — самопроверка урока: равносильные формулы checker строкой не
сравнит. Задачник собирается воспроизводимо (одинаковые данные — одинаковые байты), хранится
в банке как файл по контрольной сумме и прикрепляется к задачам, данные которых лежат в ней.

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
  паттернам П1–П18, проверенный код и ответы, одобренный архитектором результат (до Change 197 —
  демо-стенд, после — урок на локальном сайте).
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

Change 164 replaces the minimal Change 122/156 profile with the "Clean Textbook" visual system
in [DESIGN](../DESIGN.md), approved by the architect from full-page mockups. Keep the infraege
stone identity; the home page is the colourful entry point, every other page is a calm white
reading surface where colour appears only where it carries meaning; light theme only. Fonts are
self-hosted Onest and JetBrains Mono. EGE topic lessons
have a left panel with the topic and its subtopic pages (Change 167: `/ege/{topic}/{subtopic}`,
«Подтема N из M», previous/next, a right “on this page” rail; `/ege/{topic}` redirects to the first
subtopic and old `#section` links resolve to the owning subtopic); course lessons keep in-page
anchors but use the same three-column lesson frame (Change 169: the course and its lessons on the
left, the lesson in the centre, «На этой странице» on the right). Change 170: the left panel of
both is a file tree (EGE: published topics in exam order, each a folder of its subtopics and
«Практика и итог»; course: modules as folders of lessons), the reading column opens with
breadcrumbs, and lesson progress sits under «На этой странице»; course overview, catalogs and profile have
no left panel; the profile has an overview dashboard (Change 168: next step, course/topic/practice tiles, per-topic progress, continuations and a next bank task, all derived from existing summaries and saved progress) and a settings tab. Keep educational
figures and attachments (lesson media stays); hand-drawn monochrome illustrations are supplied by
the architect and use neutral reserved placeholders until then (Change 169: the earlier topic and
course catalog drawings are retired from home, catalogs and the course overview). Every page follows
its approved v5 mockup (`docs/artifacts/mockups-v5/`).
Change 171 adds lesson blocks for the lesson pipeline: a learning table (semantic `table`,
numeric columns aligned, horizontal scroll only inside it), a collapsible proof (native `details`,
closed by default, readable without scripting), an exact SVG diagram (repository-generated file,
alt and one caption), a step-through diagram (manual previous/next and play, no autoplay; without
scripting the final frame and all step captions) and the mask sandbox (enhancement only; without
scripting a static worked alignment). Subtopics carry a level: advanced ones follow the core ones,
are marked «дополнительный уровень» in the tree, the subtopic head and the pager, and may end with
their own self-check. Topic 25 is rebuilt by the lesson pipeline with a new id and route; the old
`integer-processing` lesson, its route and its eight tasks are retired without redirects.
Change 177 adds two course blocks for the Excel course: a live sheet (`SheetBlock`: column letters
and row numbers, a formula bar, coloured frames of the cells a formula reads, editable source cells
recalculated in the browser, sheet tabs; horizontal scroll only inside the grid; SSR and no-JS show
the static values and the formulas) and the copy sandbox (`FillSandbox`, enhancement only; without
scripting the worked example stays).
The `/courses` catalog keeps all four directions in registry order, published-only lesson
counts, an overview CTA and a header summary of catalog totals and revision-aware mastered
lessons. No filters or planned links.
Shared semantic controls, accessible focus/errors/loading, stable fonts and retained-page
navigation stay. FRONTEND is the binding implementation contract; DESIGN is the binding visual
contract.

Practice uses the catalog as its primary solving surface: multiple independently expandable
rows expose statements, checking, help, files, published theory links and public sources.
“Раскрыть все” and “Свернуть все” affect only the current page; bulk expansion loads full
statements into visible document content for browser find. Individual disclosure remains available.
Details load only on first expansion and remain mounted while collapsed. Transient input
and help state survive collapse, but reset on selection/page changes, leaving or reloading.
The detail route remains for direct links and no-JS reading; catalog IDs link there with the
filter/page context. Real task IDs remain canonical; rows show eight-character UUID prefixes with accessible full IDs.
The catalog head is «Практика» with the lead “Решай задачи и закрепляй теорию”, without a
practice explanation popover (Change 170 F31). Search suggests up to six matching tasks with their number, title and marked snippet after
two characters and a short pause; Enter or «Показать все» applies the search to the list and a
suggestion opens its task. Difficulty bars are green, orange and near-red by level. Topic selection uses a grouped searchable multiple combobox,
counts below labels, and Apply/cancel; selected topics appear as removable chips. Default sorting is
stable UUID order; optional difficulty directions and compact numbered pagination retain URL context.
No-JS retains GET controls, native multiple selection and detail reading. Empty topics show ordinary
no-results feedback. Compact rows show difficulty, actual answer format, public sources and a disabled
favorite affordance. Expanded statements precede answer/check/help actions; theory sits beside the topic heading above the statement. Every task — catalog, detail page and
lessons — uses one answer layout (Change 170 F30): field, «Проверить», «Подсказка» and «Решение» in
one row with the help panels below; an accepted answer is the green field with a check and a short
confetti burst. The detail page has the task title as its heading, «← К списку задач» beside the
topic, and the source in the metadata line. Theory links are named after the heading they lead to,
or «Теория». Base UI owns controls,
Lucide owns icons; no shadcn/HeroUI dependencies are added.
Existing filters and numbered pagination remain. Detail pages have one context-preserving return
link and no next-task navigation. Remove persisted answer drafts and special row/scroll restoration;
return links carry filters and page. No telemetry consent or client-error collector. Change 140
adds account screens and the smallest cross-route session/progress owner; no generic global state
layer or speculative profile fields. Guest progress surfaces in topic/course catalogs, course
overview and lesson rail/result show visual `0 из N` values derived from public memberships plus
an explicit sign-in invitation; these zeroes are not results, cannot drive saved-progress filters
or continuation and are not persisted. A locked progress block is a real sign-in link with
hover, keyboard-focus and touch activation: desktop hover/focus blurs the scale and reveals a
24px lock and the label “Войти, чтобы сохранять прогресс”, without tooltip or underline;
the invitation remains visible on touch. Catalog, course overview and lesson scales reuse this
interaction without separate duplicate login actions. Correct-answer feedback
stays visible until the page is left, but a guest success is never represented as saved.
Signed-in loading/errors and logout/account-switch transitions must not show another account's
snapshot. Public lesson theory, navigation and practice remain SSR-readable without a session.

### EGE catalog (Change 126, layout Change 169)

`/ege` retains 25 topics with 19–21 grouped. Topics are listed by first task number, published and
planned mixed (Change 170 F25): published rows show number, illustration, title and one-line
summary, «Теория · N задач · Практика …» on the title line, and a thin progress bar with «Решено X
из Y» aligned with the bottom of the summary, plus the continuation link; planned topics are muted
«Скоро» rows with no links, summaries or invented counts. Search and the status filter share one
row above the list. The page head has no illustration; the source note sits in its meta line. Illustrations alone do not publish a planned topic.
Search matches title, summary and numbers while typing, ignoring case and е/ё. Status filters
are All, In progress (0 < solved < total), and Not started (solved = 0), with the latter two
restricted to published topics with available practice. Completed topics remain in All.
The heading summary counts unique currently solved tasks from published topic lessons only,
independently of filtering; standalone practice and course progress remain separate.

`GET /api/topics/practice-summary` returns `{topics: [{id, tasks: [{id, solution_revision}]}]}`
for published topic memberships and nonarchived tasks, without statements or checker data.
It uses the existing read-only session and no-store/error policy.
The authenticated progress projection compares the summary with revision-aware lesson results.
Missing topic summaries are unavailable, never fabricated zero totals. Old browser progress keys
are ignored, not imported.
The route remains prerendered without database reads; summary loading is client enhancement.
No-JS retains the complete readable catalog and published links. Search/status controls are
hidden via scripting CSS when JavaScript is disabled; hydration never inserts their geometry.
Loading/error/retry and personalized text occupy reserved slots. API failure does not block
reading, navigation or search. No unexpected layout shifts from hydration, data, images or fonts
are accepted; intentional search/filter result changes remain user-controlled.
Search/filter state is page-local. Theory completion, grid view, recommendation ordering,
auto-resume scrolling and production delivery are out of scope.

## 6. Auth & Access Model

С Change 140 ученик может зарегистрироваться по подтверждённому email и паролю либо войти через
VK ID или Яндекс ID (вход через Telegram удалён в Change 198: иностранный сервис, 149-ФЗ ст. 10
ч. 8 и КоАП 13.55 с 07.07.2026). Каждый способ входа привязывается к внутреннему `user_id` по
проверенному идентификатору провайдера (`provider`, `subject`); email провайдера не является
ключом объединения. Социальный аккаунт может не иметь email. Привязка нового способа входа
выполняется только из уже открытого аккаунта после повторного подтверждения, отвязка последнего
способа запрещена. Автоматическое объединение двух аккаунтов, перенос локального прогресса и
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
не попадает в публичные файлы: экспорт стенда выносит каждую платную подтему и платный урок курса
в отдельный TSX-модуль `*.paid.*`, который загружается через `React.lazy`; сборка складывает их
чанки в `/assets/paid/`, и Nginx отдаёт этот путь только после внутренней проверки
`GET /api/access/asset` с cookie сессии (`auth_request`). Основной модуль урока содержит
бесплатные блоки, метаданные и превью всех подтем. SSR узнаёт доступ серверной функцией, которая
передаёт в API только cookie сессии: зрителю с доступом рендерит полный текст (`private, no-store`),
остальным — превью и блок оплаты; публичный HTML гостя не меняется от наличия чужих сессий.
Проверка сборки падает, если контрольная фраза платного модуля найдена в публичных файлах вне
`assets/paid/` или в предрендеренном HTML. Задачи платных подтем закрывает API (§4).

Оплатить доступ может только вошедший владелец аккаунта с подтверждённым email. Оплата —
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

Сохраняются TLS, health, обычные журналы, rate limits и scheduled application backup/restore.
Umami, Beszel, sre-kit integration, publishers и monitoring tunnels остаются удалены из
репозитория как хостящиеся здесь сервисы — ни один из них не возвращается, и в этот Compose
ничего нового не добавляется.

Браузерная аналитика возвращена точечно, без нового сервиса (2026-09-22, архитектор пересмотрел
прежний отказ, см. §1.2/§8.2): публичные страницы подключают cookieless tracking snippet
`<script async src="https://sre.infraege.ru/track.js" data-site="…">` self-hosted сервиса
`smotryashchiy` — отдельный репозиторий, отдельный деплой на отдельном VPS, тот же оператор.
Единственное изменение в этом репозитории — точечная правка Nginx CSP (`infra/nginx/conf.d/
infraege.prod.conf`, §8.2): `script-src`/`connect-src` допускают `https://sre.infraege.ru` для
этого конкретного origin, без `unsafe-eval`, без снятия остальных директив. Никакого reverse-proxy
под первым лицом (first-party proxy) не заводится — расширять эту границу без нового явного
решения архитектора нельзя.

Платный доступ (Change 192) не добавляет сервисов в Compose. Платёжный провайдер — Robokassa
(самозанятый: каждый чек регистрируется в «Мой налог» сервисом «Робочеки СМЗ», при возврате
аннулируется); код работает через порт провайдера с фейковым адаптером для тестов и dev, отключённым
в production. Nginx получает внутренний `auth_request` для `/assets/paid/` и отдельный
`location` уведомлений провайдера со своей зоной лимита и малым размером тела. Браузер уходит на
страницу оплаты обычной навигацией (CSP не расширяется). Хостовый systemd-таймер биллинга (образец —
`infraege-account-purge`) раз в час досверяет зависшие платежи, закрывает неоплаченные заказы,
раз в сутки сверяет платежи и чеки с провайдером, считает выручку календарного года против лимита
НПД (70 % — предупреждение в журнале, 85 % — письмо оператору, 95 % — пауза новых оплат) и
отправляет нейтральное письмо «доступ заканчивается через 3 дня». Секреты провайдера и флаги — в
`/etc/infraege/production.env`.

Установленные сервисы VPS этим локальным change не изменяются, кроме упомянутой правки CSP. Их
остановка и отключение старых таймеров входят в отдельный явно разрешённый release по runbook;
volumes автоматически не удаляются.

Старый стек `infraege-ops` и остатки прежней эксплуатации удалены с хоста по решениям архитектора
2026-09-23 (Changes 136, 138, 139; [production runbook](runbooks/production.md#retired-operations-stack)).
Под защитой остаются только `infraege_postgres122-data` и снапшоты `infraege-application`; на хосте
хранятся три последних релиза плюс цели `current` и `database-current`.

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
| Observability | Health, structured server logs and scheduled external availability/TLS probe, plus a cookieless browser-analytics beacon (`smotryashchiy`, self-hosted at `sre.infraege.ru`, separate repo/deploy, §7.3) allowlisted in CSP; no cookies, no persistent visitor id, no consent UI, no dashboards or monitoring stack hosted in this repo; the beacon never records account/auth paths, also after in-app navigation; a failed external probe notifies the operator in Telegram (Change 194); payment conversion is read server-side from billing rows (`admin funnel`), not from tracker events; an hourly host job writes an aggregate business summary (orders → payments → refunds by day and plan, registrations, active and ending access, НПД limit, stuck orders and refunds, the last provider reconciliation) to `/var/lib/infraege/business/summary.json`, counts and sums only, which the `smotryashchiy` agent ships through its tunnel to the «Продажи» view (Change 195) |
| Backup / restore | Application DB, files, roles and protected environment in encrypted Restic; 7 daily + 4 weekly + 3 monthly, monthly isolated restore; restore checks cover billing tables and grants (Change 192). Every successful backup is also copied with `restic copy` to an off-site Restic repository in Yandex Object Storage (Russia, bucket `kodumka-backup-app`: versioned, 30-day retention of deleted versions, the host key cannot delete versions or change bucket settings); the off-site copy keeps the same retention and recovery-hold, uses the same Restic password (kept off-host by the operator) and a root-only credentials file; a weekly integrity check and the monthly isolated restore read the off-site repository; a failed copy or check fails its systemd unit and records a failed off-site status; an hourly summary (`/var/lib/infraege/ops/backups.json`, schema `smotryashchiy.backup/1`, states, times, counts and sizes only) feeds the monitoring BACKUPS ledger, without notifications. Off-site storage is a prerequisite for enabling paid access, since offer acceptances and payments are evidence (Change 196) |
| SEO | `/`, `/privacy`, published topics, courses и CourseLesson имеют canonical, уникальные metadata, SSR content, общий crawlable social preview и входят в sitemap (prerender только `/` и `/ege`, остальное SSR); root document публикует browser-only manifest, SVG/PNG/ICO favicon и Apple touch icon из production-знака, а `/` — правдивый `WebSite` JSON-LD без выдуманной Organization; черновые маршруты остаются unlisted, `noindex,nofollow` и исключены из public discovery; платные страницы (Change 192) остаются в sitemap, робот получает ровно то, что гость (превью и блок оплаты, без клоакинга), с JSON-LD `isAccessibleForFree: false` и `hasPart` на закрытую часть; `/subscribe` и страница возврата с оплаты — `noindex`; страницы входа, регистрации, восстановления, подтверждения почты и `/account` — `noindex` и закрыты в robots.txt вместе с `/api/` и `/_serverFn/`, robots.txt даёт Яндексу `Clean-param` для служебных параметров (Change 194); задачи практики, включая банк КЕГЭ, индексируются с собственными title и description из условия (решение архитектора 2026-10-19); sitemap содержит только отвечающие 200 адреса, crawl-пути не делят лимит чтения практики; Lighthouse SEO для публичных маршрутов проходит без ошибок |
| Mobile / no-JS readability | TopicLesson, Course overview и CourseLesson сохраняют текст, программу, подписи, решения и section anchors в SSR HTML (платные части — для зрителя с доступом; остальным SSR отдаёт превью и блок оплаты, Change 192); интерактивная проверка и персональный progress остаются progressive enhancement |
| Client resilience / API drift | Route failures восстанавливаемы без белого экрана; loading/empty/error/not-found состояния доступны с клавиатуры и скринридера; OpenAPI schema/types drift ломает gate до merge; runtime HTTP имеет timeout/abort и не делает скрытый retry мутаций |
| Account security | Passwords use a current password-hashing scheme; verification/reset tokens expire and are single-use; sessions are server-revocable, HttpOnly/Secure/SameSite and protected from CSRF. Auth endpoints have targeted abuse limits, generic recovery responses and no sensitive URL/query/access-log leakage. Authentication does not grant editorial, operator or paid access. At most three active devices per account, a new-device email, owner-visible device list and sign-out (§6.2). Paid chunks get their own anti-bot budget of the practice-read size (120/min, burst 110); no limit a reader can feel. |
| Personal-data isolation | Progress and account reads/writes are owner-scoped and no-store; logout and account switching clear in-memory personalized state. Guest checking remains anonymous and read-only. Account/identity/progress data and new role grants are covered by isolated backup/restore checks. |
| Юридическое (152-ФЗ) | `/privacy` публикует фактические цели, состав, сроки и получателей обработки; регистрация по email требует отдельной неотмеченной по умолчанию галочки со ссылкой на версионированное согласие, а API фиксирует версию и время. Контакт — `kodumka@mail.ru`. С Change 198 политика и согласие называют оператора (ФИО, ИНН, email; адрес не публикуется), политика перечисляет правовые основания, права субъекта со сроком ответа, всех получателей и данные устройств; согласие — отдельный документ (156-ФЗ) и отдельная галочка, в том числе при первом входе через провайдера; оплата и защита аккаунта опираются на исполнение договора, поэтому у прежних пользователей согласие повторно не запрашивается. Возраст и полномочия представителя при регистрации не проверяются; с Change 213 согласие (версия `2026-10-25`) содержит заявление пользователя, что ему исполнилось 14 лет, а иначе согласие даёт законный представитель; пункт о покупателях до 18 лет — в оферте; уведомление РКН подано оператором 2026-10-25 (обращение 100472735, дата начала обработки 10.08.2026, Change 214/216), до включения боевой оплаты. Юридическая проверка не проводится по решению архитектора (2026-10-18, подтверждено 2026-10-23); тексты — инженерный ориентир, не заявление о соответствии закону; надпись «18+» для фактически школьной аудитории не используется как фиктивное освобождение от обязанностей. Гости любого возраста могут читать уроки и проверять ответы без регистрации. Браузерная аналитика возвращена (2026-09-22, архитектор пересмотрел прежний отказ, §1.2/§7.3): self-hosted `smotryashchiy`, без cookie и постоянного идентификатора — visitor-хэш `sha256(daily_salt+site+IP+UA)` с посуточной ротацией соли, сырой IP не сохраняется, referrer усекается до hostname. Отсутствие отдельного consent UI для этой аналитики — интерпретация архитектора, не юридическое заключение. Памятка оператора о действиях при утечке (РКН — 24 и 72 часа, ст. 21 ч. 3.1) ручная, без автоматизации; с Change 199 журнал инцидентов с отсчётом сроков ведётся в консоли `sre.infraege.ru`, уведомление по-прежнему подаёт оператор. С Change 199 собственный сервер мониторинга оператора в России (`sre.infraege.ru`) получает email, ID аккаунта, IP и город активных сеансов для защиты аккаунтов и операторских мер (решение архитектора 2026-10-24): выгрузка заменяется при каждом отчёте, результаты команд хранятся 30 дней, журнал действий — 3 года; пароли и платёжные данные production не покидают; политика называет этот сервер новой редакцией. |
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

Ordered unfinished outcomes (each a separate change, smallest coherent slice first):

1. **Перестройка опубликованных тем ЕГЭ по [пайплайну](runbooks/lesson-pipeline.md).** Каждая тема
   проходила демо-стенд (удалён в Change 197, T259) и одобрение архитектора, затем переносилась на сайт
   отдельным change (эталоны — темы 25 и 23, Changes 171–172). Остальные уроки тем на сайте
   признаны устаревшими (решение архитектора 2026-10-11): их не правят до перестройки. Исходники архитектора
   (`docs/artifacts/lessons/`) есть для тем 3, 4, 7–11, 14, 16–21, 24, 26 и 27. Темы 5 (Change 178),
   16, 17, 27 (Change 179), 4, 7, 8, 9 (Change 180) и 10, 11, 14, 18 (Change 181) на стенде; перенос — Change 184. Новые темы идут на
   стенд волнами по 3–4 темы в одном change, параллельно через агентов
   ([оркестрация](runbooks/lesson-wave.md)): волна 2 — 4, 7, 8, 9 (Change 180); волна 3 — 10, 11, 14,
   18 (Change 181); волна 4 — 19–21, 24, 26 (Change 182); тема 3 (только Excel) — Change 183.
   Перенос всех тем стенда на сайт (3, 4, 5, 7–11, 14, 16–21, 24, 26, 27; уроки 5, 16, 17, 24, 26,
   27 заменяются) — Change 184: платформа и пилот (тема 9), затем темы по одной, без параллельных агентов.
   Последние семь тем (1, 2, 6, 12, 13, 15, 22): карты — Change 187, стенд — Change 189, перенос на
   сайт — Change 190; после него все темы 1–27 опубликованы уроками пайплайна, названия тем — короткие,
   по плану варианта ФИПИ 2027. Выполнено: в релиз идут все 25 тем каталога (решение архитектора
   2026-10-17).
2. **Релиз программы редизайна и перестроенных уроков.** Локальный `main` с Changes 164–172 не
   выпущен (Change 170 закрыт без релиза 2026-10-08). Отдельный release change закрывает
   предпосылки §11 и обновляет `docs/artifacts/release-readiness.md`.

3. **Платный доступ — Change 192.** Тарифы, soft paywall, закрытые чанки, оплата и операторские
   возвраты реализуются одним change и попадают в `main` с выключенными флагами; включение — вместе
   с релизом после предпосылок §11 (цель — конец августа 2027, начало сезона 2027/28).

4. **Операторская консоль на `sre.infraege.ru` (решение архитектора 2026-10-24).** Сигналы и
   меры ограничения (§6.2), возвраты, поиск аккаунта, журнал инцидентов с отсчётом 24/72 ч и
   журнал действий — в интерфейсе мониторинга вместо CLI. Канал команд: агент на production сам
   забирает команды из очереди сервера мониторинга и выполняет только разрешённый набор через
   хостовый исполнитель; на мониторинг уходят email, ID, счётчики сигналов, города и IP активных
   сеансов, но не пароли и не платёжные данные. Работа — smotryashchiy Change 30 и Change 199
   здесь (исполнитель `operator-command.sh`, режим `--json` и выгрузка `kodumka.operator/1`).

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

The architect confirmed account deletion and lesson-scoped reset on 2026-09-24. Before production release, register and
verify provider applications/callbacks and mail delivery, review the updated privacy policy and
confirm account-data backup/restore with a fresh production restore proof. These are release
prerequisites, not claims of completion.

Before enabling paid access (Change 192 flags): seller registered as НПД; Robokassa shop connected
with Робочеки СМЗ, verified by a real 1 ₽ payment and refund with receipt and annulment in «Мой
налог»; offer, refund rules and updated privacy policy published in their Change 198 editions (no lawyer
review, architect's decision 2026-10-18); Яндекс ID and VK ID applications registered; RKN notification filed
(payments add processing purposes); off-site backup in place and a restore proof including billing
tables; provenance of tasks in paid subtopics confirmed; date and text of the announcement for topics
that are free on production today chosen by the architect.
