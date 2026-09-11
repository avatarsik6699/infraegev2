# CHANGE 107 — Frontend design-system consolidation

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `107` |
| Slug | `frontend-design-system-consolidation` |
| Title | Frontend design-system consolidation |
| Status | `archived` |
| Branch | `feature/107-frontend-design-system-consolidation` |

Ветка создана через `/work` по разрешению на реализацию. Пользовательские staged assets
сохранены и не входят в этот change.

## Goal

Свести существующий frontend к общим владельцам tokens, визуальных ролей и компонентов,
чтобы `/lab/design-system` показывала те же поддерживаемые варианты, что и продукт.
Закрыть подтверждённые no-JS, focus и modal-layer ошибки, завершить миграции consumers
и заменить номинальные проверки наличия exports доказательствами поведения.
Основание: [аудит §9–10](../../artifacts/repository-hygiene-audit.md#10-сплошной-аудит-публичного-ui-и-план-консолидации),
находки DS01–DS21 и минимальная сверка D01–D03/D07. Стратегическое намерение SPEC не меняется;
T5 исправляет его устаревшие описания по уже принятому поведению.

Общая очередь всех исследований и единственные владельцы находок —
[аудит §11](../../artifacts/repository-hygiene-audit.md#11-единая-приоритизация-всех-исследований).
В этом change сначала T5 → T1 → F1 → F2 → F3, затем
T2 → F4 → F5 → F6 → F7 → F8 → F9 → F10 → F11 → F12 → F13 → F14 → T3 → T4.
Указанные ниже зависимости задают технический минимум; выполнять эту согласованную очередь
последовательно из-за пересечения consumers, patterns и tokens.
Общая очистка CSS, сжатие документов и archive squash следуют отдельными changes после 107.

## Design References

Текущий бренд infraege, действующий [FRONTEND](../../FRONTEND.md), принятые study решения
[Change 105](105-lesson-reading-experience.md) и navigation progress
[Change 106](106-navigation-progress.md). Lab — исполняемое представление контракта;
её несогласованные defaults выявлены аудитом и не считаются безусловным эталоном.
Новые визуальная концепция, шрифты и artwork в scope не входят.

## Backlog

Реализация выполнена через `/work 107`. Задачи отмечаются по реализации и проверкам,
а не только на основании исследования. Каждый перенос включает shared owner, lab specimen,
всех затронутых consumers и удаление прежнего пути после последнего использования.

### Frontend

- [x] `F1` **Безопасное поведение practice до enhancement (DS14).** Сохранить формы,
  тексты задач, подсказки и решения в SSR HTML согласно SPEC. До готовности JS отключить
  интерактивную проверку и объяснить её доступность; исключить GET submit с answer в URL.
  Проверить реальный CourseLesson и TopicLesson с отключённым JS и до hydration.
  После enhancement проверка и сохранение прогресса работают прежним образом.
  — _Depends on:_ T1
- [x] `F2` **Фокус после невалидного submit (DS15).** Дать Input/Field узкий контракт
  программного фокуса и применить его в LessonPractice. Невалидный ответ сохраняется,
  input получает фокус и связанное сообщение; транспортная ошибка не выдаётся за ошибку
  ответа, редактирование не перехватывает фокус. Проверить keyboard и solved/read-only.
  — _Depends on:_ T1
- [x] `F3` **Согласованные слои интерфейса (DS16).** Назначить семантические роли слоёв
  для consent, reading/navigation indicators, backdrop и dialog в общем владельце.
  На 390×600 и 390×844 с pending consent диалог и все его действия доступны;
  проверить scroll, focus trap, cancel/confirm и возврат фокуса. Сохранить согласие
  как независимую feature, а orchestration — у соответствующей composition/app.
  — _Depends on:_ T1
- [x] `F4` **Общие роли ссылок и navigation actions (DS01, DS06, DS21).**
  Реализовать согласованные inline/action presentations, размеры и состояния в текущих
  ActionLink/ExternalLink/FragmentLink/DownloadLink/BackLink. Мигрировать все callers
  по актуальному графу, включая first-program, privacy, footer, consent, catalogs
  и lesson navigation. Сохранить external rel/target, download и history/fallback semantics.
  Inline текст переносится естественно; отдельные controls соблюдают геометрию FRONTEND.
  Удалить дублирующие consumer styles после миграции.
  — _Depends on:_ T2
- [x] `F5` **Повторяющиеся типографические и Badge роли (DS02, DS04).**
  Отделить heading semantics от presentation, а Badge tone — от роли metadata-over-image.
  Извлечь подтверждённые общие роли из обоих каталогов и lesson metadata; перенести
  primitive internals из descendant selectors в shared owner. Страницам оставить
  размещение и уникальную композицию. Lab демонстрирует обычный status и catalog metadata.
  — _Depends on:_ T2
- [x] `F6` **Единый learning recipe и явные defaults (DS08, DS09).**
  Согласовать область применения study palette и варианты LessonIntro, SectionHeading,
  learning blocks, LessonPractice и LessonOutline. Одинаковая роль имеет одинаковые
  computed styles в lab System/Components/Widgets и реальных уроках.
  Исторический default либо получает отдельное назначение и specimen, либо удаляется
  вместе с callers; случайное наследование page CSS не определяет его внешний вид.
  — _Depends on:_ T2
- [x] `F7` **Убрать concept checkpoint API (DS10).** Проверить всех consumers LessonTheory,
  удалить obsolete Concept.checkpoint и ветку его рендера. Сохранить lesson-level
  Checkpoint после result в CourseLesson и TopicLesson; не менять formative/mastery semantics.
  — _Depends on:_ F6
- [x] `F8` **Общее представление lesson shell (DS05).** Устранить побайтовую копию
  course/topic lesson CSS и подтверждённые повторения header/result presentation через
  общие classes или нейтральную slot composition. Domain types, загрузка, маршруты,
  публикация и storage keys остаются в своих владельцах. Сверить колонки, footer,
  anchors и ритм на обоих lesson types, desktop/mobile/no-JS.
  — _Depends on:_ F4, F5, F6
- [x] `F9` **Image geometry как публичный контракт (DS12).** Выразить естественные размеры
  и заполнение заданного media box у Image/общей media composition. Перенести course/topic
  catalogs, course overview и lab; удалить внешнее управление внутренним img.
  Сохранить alt/decorative, intrinsic dimensions, cached success/error, fallback и no-JS.
  Декоративные placement/filter/mask могут оставаться у consumer.
  — _Depends on:_ T2
- [x] `F10` **Завершить media composition (DS11).** На базе F9 согласовать общий
  presentation-контракт figure, caption, purpose и accessible description для Diagram,
  LearningVisualFrame и PracticeTaskContent. Различающиеся task DTO адаптировать в feature.
  Поддерживаемые annotated/float варианты проверить в узком контейнере; неиспользуемые
  возможности сократить только после подтверждения отсутствия принятого сценария.
  У каждого оставшегося lab-only API есть конкретное назначение, без фиктивного production usage.
  — _Depends on:_ F9
- [x] `F11` **Notation в учебных labs (DS13).** Перенести учебные code/var и prompt
  на общий Notation; удалить отдельную inlineCode/article-var типографику.
  Сохранить raw code у CodeBlock и осмысленные технические API labels.
  Проверить wrapping формул, inline-кода и обычной русской прозы без изменения содержания уроков.
  — _Depends on:_ F5, F6
- [x] `F12` **Контролы на code surface (DS07).** Перенести повторяемую presentation
  copy/expand Button из CodeBlock overrides в узкий поддерживаемый shared вариант.
  Убрать неработающий `--button-height-compact`; проверить контраст, focus, disabled,
  длинные подписи, copy feedback и compact height по действующему FRONTEND.
  — _Depends on:_ T2
- [x] `F13` **Остатки theme/CSS (DS18, DS19).** Привязать CustomIcon paper/accent defaults
  к semantic tokens. Проверить замысел и исправить/удалить недостижимый StatusScene selector.
  Удалить подтверждённую неиспользуемую `.learning` из §3 аудита.
  Не удалять CSS composes, официальные brand colors или SVG mask values по эвристике.
  — _Depends on:_ F6
- [x] `F14` **Полнота живого каталога (DS20).** Дополнить существенные публичные состояния:
  disabled controls, learning study/default согласно F6, solved/read-only practice,
  namespace members и app-owned navigation/loading composition. Сохранить полезные
  существующие specimens; компоненты app слоя не переносить в shared ради карточки.
  State examples должны реально переходить между состояниями, а не только иметь подпись.
  — _Depends on:_ F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13

### Other

- [x] `T1` **Восстановить достоверный baseline (DS17).** Сверить три красных ожидания:
  PublicHeader expanded default, общий фон lab, study footer inset. Исправить проверки
  на уровне актуального владельца/контракта, не ослабляя поведенческие assertions.
  Повторить упавшие сценарии до конца; новые подтверждённые проблемы добавить в Backlog
  отдельными ID. Исходные результаты: unit 82/83, E2E 8/10; это не green baseline.
  — _Depends on:_ T5
- [x] `T2` **Уточнить контракт ролей и завершения миграций (DS01–DS04, DS08–DS09, DS20–DS21).**
  В FRONTEND кратко определить token → role → primitive → composition ownership,
  допустимые consumer placement overrides и судьбу legacy variants.
  Использовать текущую архитектуру и API, не добавлять отдельный UI framework/package.
  Во время реализации вести только в этом активном change компактную таблицу
  family → consumers → old/new role → remaining usage → verification; затем свернуть её
  до отклонений, которые не видны из diff. Постоянный Markdown mirror не создавать.
  — _Depends on:_ T5, F1, F2, F3
- [x] `T3` **Закрепить проверку использования (DS03, DS08, DS20).** Расширить существующие
  design-system policy/tests проверками известных незаконных primitive overrides,
  удалённых API и существенных state specimens с узкими обоснованными исключениями.
  Заменить зависимость tests/design-system-lab.test.ts от migration Markdown на
  runtime/source evidence. Не считать совпадение имён exports доказательством миграции.
  — _Depends on:_ F14
- [x] `T4` **Приёмка всех семейств и завершение переноса (DS01–DS21).** Обновить граф
  consumers и убедиться, что старые пути и временные aliases не остались.
  Сравнить одинаковые роли lab/production, прямой вход и client navigation, desktop,
  narrow/short viewport, no-JS, keyboard, reduced motion и существенные error/disabled states.
  Проверить отсутствие потери контента и прогресса обоих независимых lesson domains.
  Выполнить один affected-area Critical Gate для полного набора задач согласно STACK,
  записать только результаты и остаточные риски. Визуальное принятие остаётся за архитектором.
  — _Depends on:_ T3
- [x] `T5` **Сверить действующие документы до изменения UI (D01–D03, D07; первая часть D06).**
  По Change 106 и текущему коду исправить pending/skeleton contract, homepage CTA,
  shared learning ownership, ссылки на отсутствующий §11.1 и формулировку JS workspaces.
  Отметить infraege-ui-migration как датированный historical snapshot, сохранив файл
  и читаемые тестом сведения до T3. В API допустима только коррекция ссылки в комментарии
  tasks/service.py. Не сжимать весь SPEC/FRONTEND, не менять стратегическое намерение,
  SDD workflow или runtime. Проверить ссылки, plain paths и отсутствие конкурирующих правил.
  — _Depends on:_ —

## Files

### Create / modify

Изменения внутри перечисленных frontend directories ограничены компонентами/стилями,
типами presentation и tests, названными Backlog; это не разрешение переписывать весь каталог.

```text
docs/FRONTEND.md
docs/SPEC.md
docs/STACK.md
PRODUCT.md
docs/artifacts/infraege-ui-migration.md
docs/artifacts/repository-hygiene-audit.md
docs/changes/107-frontend-design-system-consolidation.md
apps/api/app/modules/tasks/service.py
apps/web/src/app/styles/theme.css
apps/web/src/app/styles/tokens.css
apps/web/src/app/providers/components/navigation-progress.module.css
apps/web/src/shared/styles/patterns.module.css
apps/web/src/shared/styles/lesson-layout.module.css
apps/web/src/shared/components/typography/
apps/web/src/shared/components/notation/
apps/web/src/shared/components/badge/
apps/web/src/shared/components/button/
apps/web/src/shared/components/action-link/
apps/web/src/shared/components/external-link/
apps/web/src/shared/components/fragment-link/
apps/web/src/shared/components/back-link/
apps/web/src/shared/components/download-link/
apps/web/src/shared/components/link-decoration/
apps/web/src/shared/components/input/
apps/web/src/shared/components/field/
apps/web/src/shared/components/confirmation-dialog/
apps/web/src/shared/components/image/
apps/web/src/shared/components/learning-content/
apps/web/src/shared/components/code-block/
apps/web/src/shared/components/custom-icon/
apps/web/src/shared/components/status-scene/
apps/web/src/entities/learning-visual/
apps/web/src/entities/course/content/python-first-program.lesson.tsx
apps/web/src/features/analytics/
apps/web/src/features/lesson-practice/
apps/web/src/features/reading-position/
apps/web/src/widgets/lesson-outline/
apps/web/src/widgets/lesson-practice-flow/
apps/web/src/widgets/public-footer/
apps/web/src/pages/course-catalog/
apps/web/src/pages/topic-catalog/
apps/web/src/pages/course-overview/
apps/web/src/pages/course-lesson/
apps/web/src/pages/topic-lesson/
apps/web/src/pages/privacy/
apps/web/src/pages/design-system-lab/
apps/web/src/pages/lesson-design-lab/
apps/web/scripts/verify-design-system.mjs
apps/web/tests/design-system-lab.test.ts
apps/web/tests/lesson-design-system.test.tsx
apps/web/tests/shared-components.test.tsx
apps/web/tests/practice-content-renderer.test.tsx
apps/web/tests/public-header.test.tsx
apps/web/tests/custom-icon.test.tsx
apps/web/tests/brand-control-colors.test.ts
apps/web/e2e/pages/
apps/web/e2e/fixtures.ts
apps/web/e2e/smoke.spec.ts
apps/web/e2e/auxiliary-pages.spec.ts
```

Новые public modules допустимы только внутри перечисленных владельцев для прямо названной
общей presentation/composition; остальные consumers добавлять в Files по подтверждённому графу
перед переносом. Новый пункт scope — по Open Backlog, без off-list исправлений.

### Do NOT touch

- Backend/API, база, endpoints, task payloads, content/tasks и checker business logic;
  исключение T5 — только ссылка на SPEC в комментарии tasks/service.py.
- Доменные модели Course/Topic, правила публикации, authored copy, маршруты и storage keys.
  First-program меняется только как consumer link presentation.
- Файлы референсов/логотипов, staged пользовательские добавления, архив changes, Git history.
- Новые зависимости, замена UI framework, шрифтов, бренда, SVG artwork.
- Production infrastructure, sre-kit, push/deploy.
- Массовая консолидация документации и удаление artifacts: это отдельный план §8 аудита.

## Contracts

См. [SPEC](../../SPEC.md) §3–§7, [FRONTEND](../../FRONTEND.md) и Files выше.
Контракты API/schema/env здесь не дублируются.

## Gate Checks

Critical/Full/Release Gates определены только в [STACK](../../STACK.md).
Full Gate не назначается автоматически этим планом.

Специфическая приёмка — T1 и T4; specs используют существующие domain fixtures и Page Objects.
No-JS submit, invalid focus и consent/dialog short viewport требуют поведенческих regression
проверок. Простое удаление мёртвого selector/token не требует теста, зеркалящего реализацию.
Не закрывать задачи при красном baseline или только по статическому PASS.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Неиспользуемые Diagram annotated/float/pointers/footnotes удалены после проверки всех
  consumers: существовал только обычный figure в lab, принятого сценария этих API не найдено.
  Practice DTO pointers остаются в feature. LearningVisualFrame перенесён из entities в shared;
  caption-before сохранён явно для двух существующих lab compositions, остальные captions — after.
- В учебных компонентах оставлен единственный study default; удалены presentation API,
  неиспользуемая technology metadata и concept checkpoint. Доменные registries, authored lesson
  copy, routes, checker и persistence не менялись. Legacy shell CSS объединён в shared styles.
- Учёт миграций завершён: по обновлённому графу нет старого entity import, study palette class,
  presentation prop, Diagram geometry, concept checkpoint и consumer img/Badge overrides.
  Внутренний `data-presentation="study"` обозначает текущий recipe, это не публичный variant.
  51 public UI contracts сверены policy; существенные состояния защищены браузерным поведением.
- Critical Gate: format, web lint/typecheck и policy self-tests — PASS; backend Ruff/Pyright — PASS
  (backend change только в docstring). Focused Vitest: **67/67**, 7 файлов. Chromium: **7/7** —
  lab desktop/zoom/narrow/reduced-motion/no-JS, Python progress/reset, recursion progress/reading
  и runtimes, file attachment, delayed navigation, consent/modal на 390×600 и 390×844.
- LSP: 76 изменённых production/type/unit файлов без diagnostics; Python file — clean.
  Запрос по всему src превысил 300s, затем каждый изменённый TS/JS файл проверен отдельно.
  У 5 E2E файлов воспроизведён известный adapter misresolution из KNOWN_GOTCHAS (Playwright
  exports и каскад any); CLI typecheck/lint и реальные journeys зелёные. MJS policy вне TS
  project недоступен LSP; проверен lint и непосредственным исполнением через web lint.
- Browser MCP: screenshots/console просмотрены для lab/modal, урока и каталога; console clean.
  На 390×844 оба lesson domains и оба каталога с JS/без JS — без overflow; media заполняет
  контейнеры; SSR формы обоих уроков не включают answer в FormData. Computed learning recipe
  lab/production совпадает: transparent, padding 0, reading measure 640px.
- API regen, backend behavior tests, shell gate — SKIPPED: соответствующие контракты не менялись.
  Full/Release Gate не запускались. Визуальное принятие остаётся за архитектором.
- После анализа evidence: `make clean-dry-run`, `make clean`, `make clean-check` — PASS.
  Dev stack возвращён в исходное остановленное состояние; данные сохранены.
- Пользовательские 14 staged additions сохранены без изменения. Общая очистка artifacts,
  сжатие документов и archive squash остаются следующими пакетами §11 аудита.


## Commit Message

```
refactor(change-107): consolidate frontend design-system contracts
```
