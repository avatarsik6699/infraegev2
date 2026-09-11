# infraege UI migration — Change 101

> Historical snapshot of Changes 101–105, retained on 2026-09-11. This inventory is not the
> current visual contract. Later changes, including 106 navigation progress, supersede its
> pending/skeleton scenes. Current rules live in FRONTEND.md and executable lab specimens.

Implementation inventory for the single production theme. Automated evidence is recorded in Change 101; the architect authorized local closure after audit on 2026-09-08. The named catalog is checked against all public UI exports by the web architecture gate.

| Public UI contract | Real consumer / composition | Lab example and states | Migration |
|---|---|---|---|
| `Typography` | `widgets/lesson-outline/lesson-outline.tsx`; `features/analytics/analytics-consent-notice.tsx`; `features/analytics/analytics-consent-control.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `PageContainer` | `pages/course-overview/course-overview-page.tsx`; `pages/topic-catalog/topic-catalog-page.tsx`; `pages/privacy/privacy-page.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Notation` | `features/lesson-practice/components/practice-inline-text.tsx`; `entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx`; `entities/lesson/content/rekursiya.lesson.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Button` | `features/analytics/analytics-consent-notice.tsx`; `features/analytics/analytics-consent-control.tsx`; `features/lesson-practice/components/practice-task-answer.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `ActionLink` | `widgets/public-header/public-header.tsx`; `widgets/public-footer/public-footer.tsx`; `pages/foundation/foundation-page.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `BackLink` | `pages/topic-lesson/components/topic-lesson-header.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `ExternalLink` | `widgets/public-footer/public-footer.tsx`; `pages/topic-catalog/topic-catalog-page.tsx`; `pages/privacy/privacy-page.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `FragmentLink` | `widgets/lesson-outline/lesson-outline.tsx`; `features/lesson-practice/components/practice-task-heading.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `ConfirmationDialog` | `pages/course-lesson/components/course-lesson-progress.tsx`; `pages/topic-lesson/components/topic-lesson-progress.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `DownloadLink` | `features/lesson-practice/components/practice-task-content.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Input` | `shared/components/field/field.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Field` | `features/lesson-practice/components/practice-task-answer.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Accordion` | `features/lesson-practice/components/practice-task-help.tsx`; `shared/components/learning-content/checkpoint/checkpoint.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `TabsRoot` | `features/lesson-practice/lesson-practice.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `TabsList` | `features/lesson-practice/components/practice-task-tabs.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `TabsTab` | `features/lesson-practice/components/practice-task-tab.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `TabsPanel` | `features/lesson-practice/components/practice-task-panel.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Badge` | `pages/course-catalog/components/course-catalog-card.tsx`; `pages/lesson-design-lab/components/lesson-intro.tsx`; `pages/topic-catalog/components/topic-catalog-card.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Progress` | `features/lesson-progress/lesson-progress.tsx`; `pages/course-overview/components/course-overview-progress.tsx` | Components / Widgets catalog: real import; empty, partial, complete and reset | Shared infraege defaults |
| `Callout` | `features/lesson-practice/components/practice-task-content.tsx`; `app/route-state/route-state.tsx`; `entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `EmptyState` | `features/lesson-practice/lesson-practice.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `CodeBlock` | `features/lesson-practice/components/practice-task-content.tsx`; `pages/lesson-design-lab/components/lesson-theory.tsx`; `entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Image` | `features/lesson-practice/components/practice-task-content.tsx`; `pages/course-catalog/components/course-catalog-study.tsx`; `pages/course-catalog/components/course-catalog-staircase.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `CustomIcon` | `pages/foundation/home-learning-map-stages.tsx` | DecorativePrimitives: actual SVG composition, static and narrow | Shared infraege defaults |
| `DrawnLinkUnderline` | `shared/components/external-link/external-link.tsx`; `shared/components/action-link/action-link.tsx` | ActionLink / ExternalLink: drawn navigation, focus and hover | Shared infraege defaults |
| `SvgDrawing` | `pages/foundation/home-learning-map-connections.tsx`; `pages/foundation/home-learning-map-peripheral-connections.tsx`; `pages/course-catalog/components/course-catalog-trail.tsx` | DecorativePrimitives: actual SVG composition, static and narrow | Shared infraege defaults |
| `SvgPattern` | `pages/foundation/home-learning-map-background.tsx`; `pages/foundation/home-ambient-field.tsx` | DecorativePrimitives: actual SVG composition, static and narrow | Shared infraege defaults |
| `Checkpoint` | `pages/course-lesson/components/course-lesson-result.tsx`; `pages/topic-lesson/components/topic-lesson-result.tsx`; `shared/components/learning-content/lesson-theory/lesson-theory-concept.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Diagram` | Contextual provider or primitive composed by its public owner | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `LearningVisualFrame` | `pages/lesson-design-lab/components/binary-search-proof.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `LessonIntro` | `pages/topic-lesson/topic-lesson-page.tsx`; `pages/lesson-design-lab/lesson-design-lab.tsx`; `pages/course-lesson/course-lesson-page.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `LessonSectionHeading` | `pages/topic-lesson/topic-lesson-page.tsx`; `pages/course-lesson/course-lesson-page.tsx`; `pages/lesson-design-lab/components/lesson-theory.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `LessonTheory` | `pages/topic-lesson/topic-lesson-page.tsx`; `pages/lesson-design-lab/lesson-design-lab.tsx`; `pages/course-lesson/course-lesson-page.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Mistake` | `entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx`; `entities/lesson/content/rekursiya.lesson.tsx`; `entities/course/content/python-comprehensions.lesson.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `Procedure` | `entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx`; `entities/lesson/content/rekursiya.lesson.tsx`; `entities/course/content/python-comprehensions.lesson.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `WorkedExample` | `entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx`; `entities/lesson/content/rekursiya.lesson.tsx`; `entities/course/content/python-comprehensions.lesson.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `AnalyticsConsentNotice` | `features/analytics/analytics-consent-prompt.tsx` | ConsentSpecimen: real notice, local grant/deny callbacks, no persistence | Shared infraege defaults |
| `AnalyticsConsentPrompt` | `routes/__root.tsx` | Global first-visit notice / `/privacy`; consent lifecycle tested outside specimen | Shared infraege defaults |
| `AnalyticsConsentControl` | `pages/privacy/privacy-page.tsx` | Global first-visit notice / `/privacy`; consent lifecycle tested outside specimen | Shared infraege defaults |
| `LessonProgressProvider` | `app/providers/app-providers.tsx` | App provider + WidgetPracticeFlowSpecimen with isolated lesson id | Shared infraege defaults |
| `LessonPractice` | `widgets/lesson-practice-flow/lesson-practice-flow.tsx` | Components / Widgets catalog: real import; empty, partial, complete and reset | Shared infraege defaults |
| `LessonProgress` | `pages/lesson-design-lab/lesson-design-lab.tsx`; `pages/course-lesson/components/course-lesson-progress.tsx`; `pages/topic-lesson/components/topic-lesson-progress.tsx` | Components / Widgets catalog: real import; empty, partial, complete and reset | Shared infraege defaults |
| `ReadingPositionIndicator` | `pages/topic-lesson/topic-lesson-page.tsx`; `pages/lesson-design-lab/lesson-design-lab.tsx`; `pages/course-lesson/course-lesson-page.tsx` | Actual Topic/Course reading target; page-context browser checks | Shared infraege defaults |
| `PublicHeader` | `pages/course-overview/course-overview-page.tsx`; `pages/topic-catalog/topic-catalog-page.tsx`; `pages/foundation/foundation-page.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `PublicFooter` | `pages/course-overview/course-overview-page.tsx`; `pages/topic-catalog/topic-catalog-page.tsx`; `pages/topic-lesson/topic-lesson-page.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `LessonOutline` | `pages/topic-lesson/topic-lesson-page.tsx`; `pages/lesson-design-lab/lesson-design-lab.tsx`; `pages/course-lesson/course-lesson-page.tsx` | Components / Widgets catalog: real import; default, narrow and keyboard states where interactive | Shared infraege defaults |
| `LessonPracticeFlow` | `pages/topic-lesson/topic-lesson-page.tsx`; `pages/course-lesson/course-lesson-page.tsx`; `pages/lesson-design-lab/components/lesson-practice-section.tsx` | Components / Widgets catalog: real import; empty, partial, complete and reset | Shared infraege defaults |

## Subsequent component adoption

The table above records Change 101. Later additions retain their own activation boundaries:

| Public UI contract | Real consumer / composition | Lab example and states | Migration |
|---|---|---|---|
| `SurfaceMaterial` | Catalog cards and overview material | System → Visual language: available/planned card and form material | Shared mechanics introduced in Change 103 |
| `SurfaceGlint` | Catalog and overview motion | System → Visual language: frame/sweep/soft, activity and reduced motion | Shared mechanics introduced in Change 103; Change 105 reading example deliberately static |
| `ResponsiveDisclosure` | `widgets/lesson-outline` study presentation | `/lab/lesson`: mobile closed/open, desktop open, keyboard target focus and SSR full list | Change 105 F23: lab and all TopicLesson/CourseLesson pages |

| `StatusScene` | App route states and autonomous server compositions | System → Auxiliary states: 404, error, pending, 502/503/504; responsive and reduced motion | Change 105: shared code/error/loading presentation and quiet recovery controls |

## Route coverage

| Surface | Migration mechanism | Acceptance |
|---|---|---|
| `/`, `/ege`, `/courses` | Reference compositions retained; brand palette aliases resolve to common canvas/text; catalog material token extracted | Responsive, motion, no-JS, publication/progress regression |
| `/courses/python` | Page frame, typography, controls, paper and progress inherit common defaults | Complete curriculum, narrow layout, progress |
| `/ege/16-rekursiya`, `/ege/5-preobrazovanie-zapisey-chisel` | Quiet lesson canvas, open rail, shared learning and practice components | Reading order, outline, checking, hints, solution, progress/reset |
| `/courses/python/pervaya-programma` and all CourseLesson routes | Page-owned composition with shared study frame/palette, title-first disclosure and full progress | All 28 route coverage; first lesson/reset, rich content, mobile disclosure and SSR |
| `/privacy` | Shared page frame, typography and consent controls | Settings and readable narrow content |
| `/removed-route`, pending and error states | StatusScene, Button, drawn ActionLink, expanded PublicHeader/PublicFooter | Illustrated matte composition; real retry and restored metadata; mobile/no-JS recovery |
| `/lab/design-system` | No private theme; live named catalog and isolated specimens | All panels, named contracts, focus, portal theme, no-JS |
| Lesson-design-lab embedded compositions | Shared semantic tokens and learning components; no new public route | Existing synthetic teaching and practice behavior |

## Preserved boundaries

No lesson text, publication registry, tasks, answers, storage schema, API or route was changed.
No parallel component version or theme toggle exists. Historical design artifacts are not runtime dependencies.

### Auxiliary-state adoption (Change 105)

StatusScene is demonstrated in the visual-language lab with 404, error and pending specimens.
Local EmptyState is unframed; practice service errors and informative/decorative image fallbacks
have separate semantics. Privacy shares expanded public chrome without consent/copy changes.
Autonomous Nginx 502/503/504 pages reproduce the public palette, fonts, navigation and footer using
packaged local assets; their document-only contract is verified independently of the web process.

### Change 105 auxiliary composition revision

StatusScene now explicitly selects code/error/pending compositions, using SVG geometry and
HTML/CSS skeletons without raster delivery. PageBackground owns the single page grid; privacy
uses drawn external links and quiet consent controls; lesson navigation gains a wider gutter
and container-responsive stacking. Autonomous 502/503/504 mirror the SVG identity with local
assets and quiet no-JS document refresh. The auxiliary-state lab remains the preview entrypoint.

The F30–F31 revision follows `references/new_pages`: outlined background numerals and
code scenes use only numerals and faint peripheral patterns; icon cards remain in error/loading states. All six states are
selectable in the auxiliary lab. Pending owns a dense grid and activity-aware shimmer/dots;
reduced motion and no-JS remain static. Autonomous Nginx code scenes use the same quiet numeral and background-pattern composition.
