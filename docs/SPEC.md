# TECHNICAL SPECIFICATION (SPEC.md): `infraege`

> **For AI agents:** read the active change and the SPEC sections it affects; §3–§4 for data/API,
> §2.3 for authoring, §5 plus FRONTEND for web, §7–§8 for operations. Read SPEC in full for initial
> product planning or a product/system pivot. Read STACK gate/tooling rows and relevant GOTCHAS;
> do not load unrelated archive history by default.

## Metadata

| Field | Value |
|-------|-------|
| Document Version | `v2.27` |
| Date | `2026-10-09` |
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
| Завершённый самостоятельный мини-курс Python с отдельным Course/CourseLesson flow | Платные функции любого вида |
| Публичные, индексируемые страницы тем и уроков (SSR/SSG) | AI внутри продукта (только как инструмент автора при подготовке контента) |
| Практика по каждой опубликованной TopicLesson: 5–10 заданий с проверкой ответа, без адаптивного подбора сложности | Мини-курс Excel и полные TopicLesson для остальных заданий ЕГЭ — вторая волна, по той же структуре |
| Необязательный аккаунт и серверный прогресс после Change 140; все текущие учебные действия доступны гостю | i18n/локализация (аудитория исключительно русскоязычная) |
| | Полноценный поиск по сайту (линейная карта из 25 тем остаётся обозримой без отдельного поиска) |

Текущий состав опубликованных материалов задают publication registries
(`apps/web/src/entities/lesson/content/lesson-registry.ts` и Course registry): независимый Python
Course из 28 последовательных CourseLesson и 140 server-owned задач и опубликованные TopicLesson.
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

Тема ЕГЭ (Change 167) делится на авторские подтемы — группы соседних `ConceptBlock` без изменения
их текста и порядка. Каждая подтема — отдельная страница `/ege/{topic}/{subtopic}`; первая
открывается по адресу темы (редирект) и начинается с введения. Под заголовком каждой подтемы стоит
короткий вводный абзац (`lead`, одно–два предложения): заголовок никогда не следует сразу за
заголовком (Change 170 F42). После подтем идёт страница «Практика и итог» с ролями 2–4 в
порядке страницы (Change 170 F43): сначала итоговый текст `result` с иллюстрациями сразу под
заголовком, затем «Что важно для ЕГЭ», затем задачи и в конце самопроверка `checkpoint`;
ссылок на соседние темы на ней нет — к другим темам ведут хлебные крошки и дерево тем. Страница подтемы дополнительно показывает те задачи урока, у которых есть
theory link на её разделы: это представление той же практики урока, а не отдельный набор задач
или прогресс. Отметка пройденной подтемы вычисляется из уже сохранённых решений этих задач;
подтема без задач отметки не имеет. Мини-курсы Python остаются одностраничными уроками.
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
| `Anonymous learner` | Читает теорию, решает практику, получает обратную связь по ответу | Прогресс не сохраняется и не засчитывается после ухода или перезагрузки страницы |
| `Signed-in learner` | Всё доступное гостю; хранит прогресс уроков и самостоятельной практики в аккаунте и управляет способами входа | Факт входа не даёт прав автора, оператора или платного доступа |
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
`Course` `→` `CourseModule[]` `→` `CourseLesson[]` (упорядоченная самостоятельная траектория)
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
подписки, если будут введены, не подменяют факт верного ответа и имеют отдельное владение.
Аккаунт и видимый «Профиль» — разные понятия; отдельная таблица профиля не нужна до появления
собственных редактируемых полей. Старые localStorage-записи не импортируются.

Публичный каталог тем хранит 25 записей, которые покрывают номера ЕГЭ 1–27 ровно по одному разу.
Запись 19–21 — одна тема «Выигрышная стратегия»; другие объединения требуют отдельного
педагогического решения. Каталог использует проект спецификации ФИПИ ЕГЭ 2027 как датированный
редакционный источник, но не делает будущие уроки доступными до статуса `published`.

Публичный каталог мини-курсов хранит отдельный упорядоченный список направлений. Опубликованный
Python подставляет title, summary, route и состав уроков из Course publication registry; Excel,
«Алгоритмы и структуры данных» и «Решение задач повышенной сложности» остаются catalog-only
записями `planned`, не создают фиктивных Course/CourseLesson definitions и не получают URL.

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

Тема ЕГЭ проектируется по обязательному [пайплайну подготовки темы](runbooks/lesson-pipeline.md)
и [каталогу паттернов](runbooks/lesson-patterns.md); одобренная на демо-стенде тема переносится на
сайт отдельным change. Практический порядок переноса и подготовки уроков Python — в
[руководстве по подготовке урока](runbooks/lesson-authoring.md); оба документа поясняют этот
checklist, не заменяя его. Схемы демо-стенда — точные SVG-диаграммы, построенные кодом; при переносе
они остаются SVG-диаграммами по правилу ниже.

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
  паттернам П1–П18, проверенный код и ответы, одобренный архитектором демо-стенд.
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
- [ ] Немой ролик выбирается, когда идею несёт порядок или изменение во времени
  (последовательность вызовов, появление связей); если хватает одного кадра, берётся статичный
  растр. Ролик показывает одну идею, а его постер (итоговый кадр) читается без движения. Длины
  ограничения нет: ролик строится на ясность понимания, а не на укладывание во время. Ролик
  стоит после абзаца, который он иллюстрирует, а не после блока кода, примера, ошибки или другого
  блока: текст объясняет, ролик дополняет. Иллюстрации других авторов не копируются; допустимо
  лишь совпадение манеры рисования.
- [ ] Под роликом одна подпись: краткая суть идеи (она же текстовый эквивалент), без служебного
  заголовка вроде «Текстовое описание» и с минимальным отступом от видео. Блоки кода
  схлопываются: код и его вывод, код и дерево вызовов идут одним блоком; два блока подряд без
  текста между ними не допускаются.
- [ ] Статичная рисованная иллюстрация (растр WebP из скрипта репозитория) выбирается там, где
  структуру, связи или динамику трудно увидеть из текста и кода: стек вызовов, дерево до и после
  кеша, разбор числа по цифрам, направление зависимости, сокращение, карта выбора способа. Она
  не дублирует ролик и не украшает: без неё ученик понимает хуже. Правила размещения и подписи
  те же, что у ролика: после абзаца, который она иллюстрирует, а не после блока кода или примера;
  одна подпись с сутью и числами рисунка, без служебных заголовков; числа на рисунке считает код;
  надписи читаются на телефоне. Баланс: рисунков в уроке немного (порядка одного на три раздела),
  а между рисунком и роликом не меньше двух блоков: они не идут друг за другом.
- [ ] Точная учебная SVG-диаграмма (решение архитектора 2026-10-08) выбирается, когда схема
  показывает точные числа, структуру или шаги алгоритма (пары делителей, разложение, разбор числа
  по маске, сетка делителей). Она строится кодом из репозитория (`scripts/lesson_design/figures.py`):
  каждое число и подпись считает тот же код, что и рисунок, вручную SVG не рисуется. Правила
  размещения и подписи те же, что у рисунка: после абзаца, одна подпись с сутью и числами, alt,
  читаемость на телефоне, цвета только из DESIGN. Процесс показывается пошаговой схемой с ручным
  переключением и без автозапуска; без JavaScript виден итоговый кадр и текст всех шагов. Рисованный
  растр остаётся для образных иллюстраций, ролик — для движения, которое не сводится к шагам.
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
- [ ] Ролик хранится в репозитории в двух форматах (WebM VP9 и MP4 H.264) с постером и явными
  размерами, без звука, с `muted loop playsinline`, но без атрибута `autoplay`. Без JS виден
  постер (итоговый кадр) без движения. С JS ролик запускается с начала, когда виден хотя бы
  наполовину, и встаёт на паузу, когда уходит с экрана; явная пауза ученика уважается. При
  `prefers-reduced-motion: reduce` автозапуска нет, виден постер. Управление минималистичное и
  видимое: кнопка пуск/пауза и полоса времени с перемоткой (мышью, касанием и с клавиатуры);
  без JS элементов управления нет. Ключевые кадры раз в 5 секунд и ширина до 1200 px, чтобы перемотка не
  запаздывала. Ролик отдаёт Nginx с Range (206). Ориентир веса — до 300 КБ на формат, мягкий:
  важнее понятность. Кадры генерируются воспроизводимым скриптом из репозитория, а не рисуются
  вручную.
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

## 5. Frontend / Client Contract

Public learning routes: `/`, `/ege`, `/courses`, course overview, published topic and course
lessons, `/practice`, task detail and `/privacy`. Planned entries remain non-links; there are no
internal lab or specimen routes.

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
practice explanation popover (Change 170 F31). Search applies explicitly. Topic selection uses a grouped searchable multiple combobox,
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
VK ID, Яндекс ID или Telegram. Каждый способ входа привязывается к внутреннему `user_id` по
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
VK ID, Яндекс ID и Telegram по умолчанию выключены отдельными release-флагами. Пока флаг
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

`access_tier: free | paid` в Topic/CourseLesson пока лишь metadata: все опубликованные материалы
остаются бесплатными. Будущие entitlement и оплата отделены от идентичности; скрытие ссылки в UI
не может служить защитой платного контента, особенно для TSX-уроков в web bundle.

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
| Performance budget | Lighthouse-аудит раз в неделю или по запросу сохраняет median LCP ≤4.0s на мобильном 4G-профиле; продуктовая цель остаётся LCP ≤2.8s. CLS < 0.1, INP < 200ms. Измеряются `/`, `/ege`, `/courses`, `/courses/python` и `/ege/16-rekursiya`; cold-load font/layout shifts проверяются отдельно. Lighthouse не является обязательным шагом каждого релиза или изменения CSS; подозрение на регрессию требует целевого измерения, а не автоматического Full Gate. Порог не ослабляется ради ускорения |
| Observability | Health, structured server logs and scheduled external availability/TLS probe, plus a cookieless browser-analytics beacon (`smotryashchiy`, self-hosted at `sre.infraege.ru`, separate repo/deploy, §7.3) allowlisted in CSP; no cookies, no persistent visitor id, no consent UI, no dashboards or monitoring stack hosted in this repo |
| Backup / restore | Application DB, files, roles and protected environment in encrypted Restic; 7 daily + 4 weekly + 3 monthly, monthly isolated restore. Same-host backup loss remains accepted until off-site storage exists |
| SEO | `/`, `/privacy`, published topics, courses и CourseLesson имеют canonical, уникальные metadata, SSR content, общий crawlable social preview и входят в sitemap (prerender только `/` и `/ege`, остальное SSR); root document публикует browser-only manifest, SVG/PNG/ICO favicon и Apple touch icon из production-знака, а `/` — правдивый `WebSite` JSON-LD без выдуманной Organization; черновые маршруты остаются unlisted, `noindex,nofollow` и исключены из public discovery; Lighthouse SEO для публичных маршрутов проходит без ошибок |
| Mobile / no-JS readability | TopicLesson, Course overview и CourseLesson сохраняют текст, программу, подписи, решения и section anchors в SSR HTML; интерактивная проверка и персональный progress остаются progressive enhancement |
| Client resilience / API drift | Route failures восстанавливаемы без белого экрана; loading/empty/error/not-found состояния доступны с клавиатуры и скринридера; OpenAPI schema/types drift ломает gate до merge; runtime HTTP имеет timeout/abort и не делает скрытый retry мутаций |
| Account security | Passwords use a current password-hashing scheme; verification/reset tokens expire and are single-use; sessions are server-revocable, HttpOnly/Secure/SameSite and protected from CSRF. Auth endpoints have targeted abuse limits, generic recovery responses and no sensitive URL/query/access-log leakage. Authentication does not grant editorial, operator or paid access. |
| Personal-data isolation | Progress and account reads/writes are owner-scoped and no-store; logout and account switching clear in-memory personalized state. Guest checking remains anonymous and read-only. Account/identity/progress data and new role grants are covered by isolated backup/restore checks. |
| Юридическое (152-ФЗ) | `/privacy` публикует фактические цели, состав, сроки и получателей обработки; регистрация по email требует отдельной неотмеченной по умолчанию галочки со ссылкой на версионированное согласие, а API фиксирует версию и время. Контакт — `avatarsik6699@gmail.com`. По явному решению архитектора ФИО и адрес оператора не публикуются, возраст и полномочия представителя при регистрации не проверяются, уведомление РКН переносится на отдельный пункт после релиза. Эти решения оставляют существенный юридический риск и не являются заявлением о соответствии закону; надпись «18+» для фактически школьной аудитории не используется как фиктивное освобождение от обязанностей. Гости любого возраста могут читать уроки и проверять ответы без регистрации. Браузерная аналитика возвращена (2026-09-22, архитектор пересмотрел прежний отказ, §1.2/§7.3): self-hosted `smotryashchiy`, без cookie и постоянного идентификатора — visitor-хэш `sha256(daily_salt+site+IP+UA)` с посуточной ротацией соли, сырой IP не сохраняется, referrer усекается до hostname. Отсутствие отдельного consent UI для этой аналитики — интерпретация архитектора, не юридическое заключение. Формальная проверка уведомления РКН, локализации, текста политики, детей и этой трактовки юристом остаётся внешним follow-up. |
| Юридическое (436-ФЗ) | Возрастная маркировка для обычного сайта не вводится: существующая `12+` удаляется без замены на `18+` |
| Происхождение контента | Существующие уроки сохраняют Content Quality Gate (§2.3). Для нового банка принято импортируемое содержимое с явным provenance (§3); происхождение, атрибуция и допустимость использования проверяются при подготовке импорта, не выводятся автоматически из URL и не заменяются технической валидацией |
| Other (юридический ориентир, не консультация) | Открытые источники используются как инженерный ориентир; формальная юридическая проверка, данные оператора, оформление доступа детей и уведомление РКН не закрыты. Архитектор принял риск выпуска без них и планирует РКН отдельным пунктом после релиза; это не меняет установленного законом срока подачи уведомления до обработки, если исключение неприменимо. |

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
   проходит демо-стенд `content/lesson-design/` и одобрение архитектора, затем переносится на сайт
   отдельным change (эталоны — темы 25 и 23, Changes 171–172). Исходники архитектора есть для тем
   16, 17 и 27 (`docs/artifacts/lessons/`); для 5, 24 и 26 их нужно получить. Порядок задаёт
   архитектор. [NEEDS_CLARIFICATION: какие темы обязательны до релиза]
2. **Релиз программы редизайна и перестроенных уроков.** Локальный `main` с Changes 164–172 не
   выпущен (Change 170 закрыт без релиза 2026-10-08). Отдельный release change закрывает
   предпосылки §11 и обновляет `docs/artifacts/release-readiness.md`.

Later product decisions may add manual completion, richer statistics and premium entitlements;
payment processing and paywall enforcement require separate design.

## 10. Out of Scope

Production deployment/host mutations in local work; deleting old volumes; payments;
collaborative editing; editorial audit history; automatic import conflict resolution; background
imports/file garbage collection; hosting analytics dashboards or a monitoring stack in this repo
(dashboards remain in the separate `smotryashchiy` deploy — this repo only allowlists its origin
in CSP, §7.3); labs and internal design specimens. Automatic account merging, guest-progress import,
saved answer text, standalone profile table, manual completion, advanced statistics and premium
entitlements are out of scope. Single-operator sequential imports and ordinary pagination
are intentional first-version limits. Formal legal review, off-site backup, key-only SSH and new
content remain separate decisions.

## 11. Open Questions

The architect confirmed account deletion and lesson-scoped reset on 2026-09-24. Before production release, register and
verify provider applications/callbacks and mail delivery, review the updated privacy policy and
confirm account-data backup/restore with a fresh production restore proof. These are release
prerequisites, not claims of completion.
