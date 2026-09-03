# ALCHIMIA: матрица публичной миграции

Итоговая карта после реализации Change 79. `/lab/design-system` остаётся исполняемым каталогом,
но не шаблоном публичной страницы. Статусы означают:

- `active` — контракт уже имеет реального public-потребителя;
- `candidate` — принятый контракт ещё не дошёл до canonical public boundary;
- `context` — компонент существует в приложении, однако требует реального browser/runtime-контекста;
- `obsolete` — старое presentation-исключение, которое можно удалить после миграции.

## Компоненты

| Контракт | Публичный потребитель | Статус до Change 79 | Владелец вида / действие |
|---|---|---:|---|
| `Typography` | все public route families, lessons, route states | active | `shared/components/typography` + глобальные type tokens |
| `PageContainer` | pending/error/not-found states | active | `shared/components/page-container`; использовать для стандартных public measures |
| `Notation` | TopicLesson и CourseLesson content/practice | active | `shared/components/notation` |
| `Button` | практика, progress reset, consent, route error | active | `shared/components/button` |
| `ActionLink` | Lesson navigation и route states | active | `shared/components/action-link` |
| `BackLink` | TopicLesson context bar | active | `shared/components/back-link` |
| `ExternalLink` | lessons, privacy, footer | active | `shared/components/external-link` |
| `FragmentLink` | LessonOutline и practice theory links | active | `shared/components/fragment-link` |
| `ConfirmationDialog` | сброс прогресса TopicLesson и CourseLesson | active | `shared/components/confirmation-dialog`; Base UI AlertDialog сохраняет modal/focus contract |
| `DownloadLink` | authored-вложения в LessonPractice | active | Change 80: `shared/components/download-link`; native download остаётся доступным в SSR/no-JavaScript |
| `Input` | `Field` внутри LessonPractice | active | defaults перенесены в `tokens.css` и `shared/components/input` |
| `Field` | LessonPractice answer form | active | `shared/components/field`; получает migrated Input без API-изменения |
| `Accordion` | Checkpoint, practice hint/solution | active | underline/motion/divider defaults перенесены в `tokens.css` и shared CSS |
| `TabsRoot` | LessonPractice | active | `shared/components/tabs` |
| `TabsList` | LessonPractice | active | `shared/components/tabs` |
| `TabsTab` | LessonPractice task navigation | active | `shared/components/tabs` |
| `TabsPanel` | LessonPractice task content | active | `shared/components/tabs` |
| `Badge` | CourseOverview и LessonIntro | active | геометрия перенесена в semantic tokens, weight закреплён в shared CSS |
| `Progress` | CourseOverview и LessonProgress | active | track/indicator defaults перенесены; локальные высоты удалены |
| `Callout` | authored lessons, practice solution, route error | active | `shared/components/callout`; функциональные warning-цвета сохранить |
| `EmptyState` | not-found и image fallback | active | `shared/components/empty-state` |
| `CodeBlock` | TopicLesson, CourseLesson, practice solution | active | `shared/components/code-block`; global long-code disclosure уже live |
| `Image` | Diagram и image fallback | active | `shared/components/image` |
| `Checkpoint` | обе lesson compositions | active | `shared/components/learning-content/checkpoint` |
| `Diagram` | authored TopicLesson/CourseLesson theory | active | `shared/components/learning-content/diagram` |
| `LearningVisualFrame` | lesson visuals | active | `entities/learning-visual` |
| `LessonIntro` | обе lesson compositions | active | `shared/components/learning-content/lesson-intro` |
| `LessonSectionHeading` | обе lesson compositions | active | `shared/components/learning-content/lesson-section-heading` |
| `LessonTheory` | обе lesson compositions | active | `shared/components/learning-content/lesson-theory` |
| `Mistake` | authored TopicLesson/CourseLesson theory | active | `shared/components/learning-content/mistake`; vertical comparison with semantic left rule |
| `Procedure` | authored TopicLesson/CourseLesson theory | active | `shared/components/learning-content/procedure` |
| `WorkedExample` | authored TopicLesson/CourseLesson theory | active | `shared/components/learning-content/worked-example` |
| `AnalyticsConsentControl` | privacy | context | `features/analytics`; реальное consent-state, не статический lab specimen |
| `AnalyticsConsentPrompt` | root application shell | context | `features/analytics`; реальное browser consent-state |
| `LessonPractice` | обе lesson compositions через widget | active | `features/lesson-practice` |
| `LessonProgress` | course overview и lesson result | active | `features/lesson-progress` |
| `ReadingPositionIndicator` | обе lesson compositions | context | `features/reading-position`; требует реального scroll-target |

## Виджеты и композиции

| Контракт | Публичный потребитель | Статус до Change 79 | Владелец вида / действие |
|---|---|---:|---|
| `PublicHeader` | home, course overview, обе lessons, privacy | active | `widgets/public-header`; quiet identity без release/version chrome |
| `PublicFooter` | home, course overview, обе lessons, privacy | active | `widgets/public-footer`; общий viewport gutter с header |
| `LessonOutline` | TopicLesson и CourseLesson | active | `widgets/lesson-outline`; одна вертикальная колонка на всех ширинах |
| `LessonPracticeFlow` | TopicLesson и CourseLesson | active | `widgets/lesson-practice-flow`; связывает practice с progress registry |
| `Public page` assembly | home, course overview, privacy | active | это lab-only диаграмма существующей сборки, не production-компонент |
| `Lesson page` assembly | TopicLesson и CourseLesson | active | это lab-only диаграмма существующей сборки, не layout API |

## Семейства маршрутов и доказательство

| Семейство | Представитель | Проверяемые live-контракты |
|---|---|---|
| Home | `/` | PublicHeader/Footer, Typography, public wide composition |
| Course overview | `/courses/python` | Badge, Progress, PublicHeader/Footer, responsive curriculum |
| CourseLesson | `/courses/python/pervaya-programma` | весь learning-content flow, Input/Field, Accordion, tabs, Progress, widgets |
| TopicLesson | `/ege/16-rekursiya` | весь learning-content flow, callouts/visuals, widgets |
| Privacy | `/privacy` | reading measure, consent context, PublicHeader/Footer |
| Application states | `/removed-route` + pending/error tests | PageContainer, EmptyState/Callout, shared public chrome |
| Design-system regression | `/lab/design-system` | тот же shared result без component-only lab aliases |
| Lesson-lab regression | `/lab/lesson` | существующая authored composition без непреднамеренного изменения |

## Разрешённое удаление после миграции

| Presentation-исключение | Статус | Основание |
|---|---:|---|
| component aliases `--input-*`, `--accordion-*`, `--badge-*`, `--progress-*` внутри lab `.page` | obsolete (removed) | значения принадлежат global semantic component tokens |
| lab descendant rules для Input/Badge typography | obsolete (removed) | typography стала default соответствующего shared-компонента |
| `--progress-height: 0.22rem` в CourseOverview/LessonProgress | obsolete (removed) | исключение скрывало утверждённый общий Progress contract |
| lab surface/rhythm/catalog tokens | active | документируют сам каталог и не являются public component fallback |
| lesson page-specific rails, context bars и result layouts | active | это intentional route composition, не дубликаты shared-компонентов |
