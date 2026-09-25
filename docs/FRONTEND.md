# Frontend Contract

> Binding rules for `apps/web`. Product intent lives in `docs/SPEC.md`; exact dependencies,
> commands and gates live in `docs/STACK.md`. This file is the single source of truth for frontend
> architecture, code shape, interaction and visual-system rules.

## 1. Decision sources

The contract adapts useful guidance from Kontur Guides instead of treating that site as a runtime
dependency or copying its component library. The first adopted set is:

- [Accessibility principles](https://guides.kontur.ru/principles/accessibility/accessibility/)
- [Adaptivity](https://guides.kontur.ru/principles/base/adaptivity/)
- [Screen typography](https://guides.kontur.ru/principles/text/typography/)
- [Validation](https://guides.kontur.ru/principles/data/validation/)
- Component guidance for [Input](https://guides.kontur.ru/components/input-fields/input/),
  [Button](https://guides.kontur.ru/components/actions/button/),
  [Link](https://guides.kontur.ru/components/actions/hyperlink/),
  [Tabs](https://guides.kontur.ru/components/navigation/tabs/) and
  [Progress](https://guides.kontur.ru/components/progress-indicators/progress-bar/)

When guidance overlaps, accessibility and the explicit product/architecture decisions in
`docs/SPEC.md` win. Kontur guidance supplies interaction and content practice; project conventions
supply code shape, ownership and boundaries where the guides are silent. New guide extractions
must land here as project rules with a source link, not as a second competing contract.

Practice also adapts the hierarchy of HeroUI's [Accordion](https://heroui.com/en/docs/react/components/accordion),
[Button](https://heroui.com/en/docs/react/components/button), [Chip](https://heroui.com/en/docs/react/components/chip)
and [TextField](https://heroui.com/en/docs/react/components/text-field): aligned disclosure indicators,
clear primary/secondary actions, restrained neutral metadata and labelled fields with local feedback.
These are composition guidelines for existing Base UI wrappers and CSS Modules, not dependencies.
Practice topic selection uses the existing Base UI Combobox in multiple mode, with grouped options,
search inside the popup, second-line counts and explicit Apply/cancel. No-JS uses a native multiple
select in the GET form. Catalog and detail share a compact layout, without changing lesson presentation:
statement above compact answer/help actions, theory beside the topic heading above the statement, stacked actions on mobile.
Adapt [shadcn Combobox](https://ui.shadcn.com/docs/components/base/combobox) and
[Pagination](https://ui.shadcn.com/docs/components/base/pagination) visually through local CSS Modules;
no shadcn dependency. Use Lucide interface icons. Quiet small pagination still has 40px targets.
Search uses a shared Field with inline clear/submit actions; clear is visible whenever text is
entered after enhancement. Field, SelectField and MultiCombobox reuse the same label style.
Topic popup height is bounded by available viewport space; pointer opening does not autofocus
its search, keyboard opening does. Apply commits and Reset clears the draft. Active filter text
is a quiet badge, its cross removes it, and reset-all stays a separate unadorned action.
Sort uses a compact borderless Base UI Select with native GET fallback.
SSR must render the styled control geometry immediately. Do not swap a tall native control for
an enhanced control after hydration. Native fallbacks live in `noscript`; CSS `scripting: none`
hides their scripted counterparts. Hidden submission values must not duplicate native values.
Catalog filter/limit forms retain GET fallback and use router navigation when hydrated; keep the
current page visible during requests. Verify first paint before/after delayed hydration and failed
scripts on a fresh production build. Title links and disclosure buttons share row geometry.
Composite search owns one surface, including autofill; inline icons have no separate hover backing
and keyboard indicators stay inside the control.
Catalog pagination keeps neighbouring pages and explicit destinations for skipped ranges; navigation
controls have no text underlines. Limit belongs to the same group. In catalog and detail task forms, answer/check/retry and help share a toolbar on wide screens.
Errors belong directly below the field; success uses a green field border/check and an accessible
announcement. Keep field labels accessible but visually hidden; help panels have headings.

## 2. Files, components and value access

- Use kebab-case for source files and directories and PascalCase for component exports.
- Keep one React component per file. Move a second component to its own file rather than declaring
  nested components or assigning JSX to constants.
- Define authored components as arrow functions typed with `React.FC<Props>`. Framework-owned route
  callbacks may retain the function shape required by TanStack Router.
- Use `type`, never `interface`. Root props live in a root-qualified namespace in
  `root-component.types.ts`; private child props need a namespace only when non-trivial or shared.
- Access props as `props.name`. Access object-valued hook results through one named variable. A
  `useState` tuple is the only hook-return destructuring exception.
- A prop with a default may be destructured in the parameter list; a thin forwarding wrapper may
  destructure handled keys and collect a purpose-named remainder such as `buttonProps`.
- Every `useEffect` callback is a named function ending in `Fx`.
- Group pure helpers/constants in root-prefixed objects. A `shared/lib` utility exports one
  namespace-style object (`safeJson.parse`, `cssUtils.cx`) rather than unrelated named functions.

## 3. Layers, ownership and platform boundaries

Keep the pragmatic FSD-like dependency direction:

```text
app → routes → pages → widgets → features → entities → shared
```

- Imports point downward. `entities`, `features`, `widgets` and `pages` never import another slice
  from their own layer, through either an alias or a relative path; compose peer capabilities one
  layer above. Imports within one slice stay local, and downward cross-slice imports use the root
  `index.ts`; deep imports are private. `shared` remains the domain-agnostic foundation and may
  compose its own public primitives. Do not add a generic `ui/` segment.
- Keep route definitions thin. Use TanStack Router typed APIs directly rather than wrapping them in
  generic router hooks.
- Keep transient state in its owning component or slice-local model hook. Use an injected domain
  store only when state must persist or outlive one component. Do not add a global store without a
  demonstrated cross-route owner.
- Before adding a visual component, icon, card or layout pattern, inspect the existing shared
  primitives and the closest real consumer. Reuse them when semantics and data contracts match;
  extract a lower-layer primitive when multiple consumers genuinely share it. Never import a
  page-private component into another page or duplicate its markup/styles merely for visual
  similarity. Record any intentional divergence in the active change.
- Browser globals and storage belong to focused `shared/lib` adapters; network access belongs to
  the consuming slice's `api/`; server environment reads belong to `*.server.ts`. Production
  components do not call `window`, `document`, storage, `navigator`, `fetch` or `process` ad hoc.
- Use `shared/lib/safe-json` and `shared/lib/safe-ls` for persisted data. Low-level React external
  store subscription, scoped Zustand Context wiring and persistence hydration belong to small
  `shared/lib` primitives; domain slices declare schemas, migrations and business operations and
  consume those primitives. DTO filenames are reserved for transport boundaries; domain types
  belong to the owning entity.

## 4. Minimal visual profile

Change 122 supersedes decorative scenes and lab-first review. Visual reference: production
`a5b0bf5`, with current infraege identity. White canvas, ink, neutral controls, text lists,
restrained separators and readable line lengths. Keep Alegreya display, Golos Text UI/reading,
JetBrains Mono code; font fallbacks and stable loading remain. Orange identifies the stone
brand; controls, navigation and link affordances are monochrome. Focus, text selection and input carets are monochrome. Semantic feedback and syntax remain legible.
No decorative raster scenes, background patterns, light effects, drawn links or idle animation.
Educational illustrations/content blocks remain. Remove labs rather than preserving demo APIs.

Shared controls own accessible semantics; Base UI remains behind their existing local APIs.
Theme values feed semantic tokens and CSS Modules. Do not add a replacement component system.
Prefer whitespace and alignment to nested panels. Retain 40px control targets, responsive single
column reading on mobile and visible keyboard focus. Public navigation exposes real routes.
Planned content is text, never a fake/disabled link. Maintain two ordinary text contrast levels.

## 5. Learning and state

Preserve authored theory, ordering, task IDs, examples, figures and accessible descriptions.
Course/topic domains stay independent. API owns tasks/checking and authenticated progress;
frontend owns transient input only. Guest progress is not counted or persisted, and old browser
progress keys are ignored without import. Remove persisted
answer drafts and custom catalog-row restoration. Catalog task forms preserve transient input
and help state while collapsed, until the selection/page changes or the page is left/reloaded.
Bulk disclosure belongs to the current result list: expand loads every visible-page statement into
the document for browser find; collapse retains mounted forms and drafts. Individual toggles remain
independent, and changing the selection/page resets disclosure. Hide bulk actions without scripting.
Hidden forms never steal focus; stale refresh preserves input and updates the checked revision. Return links carry filters and numbered page.
Distinguish wrong answers, missing data, stale tasks and service failure; retain entered input
on service failure. Help disclosure never marks a task solved. Correctness and persistence are
separate feedback states: a guest can solve, but cannot save progress. Personal progress is
account-scoped server data, cleared from memory on logout/account switch; do not store session
tokens, answers or progress in browser storage. Guest progress uses a visual `0 из N` starting
state derived only from public totals, with an accessible sign-in invitation; it is never a saved
result and cannot drive saved-progress filters or continuation.
Guest progress scales share a stationary hover/focus wrapper: blur the zero progress content,
then overlay a 24px lock and “Войти, чтобы сохранять прогресс”, with no underline or tooltip.
Touch shows the invitation continuously; reduced motion disables transitions. Do not add a second
login invitation beside the scale. Loading and failed session/progress states remain distinct.
Do not add account or answer data to browser analytics or client-error telemetry; the existing cookieless public-page tracker remains governed by SPEC.
Keep shared modal reset confirmation, keyboard navigation and focus return.
Email registration and recovery have an explicit check-mail state, a bounded resend action and
routes back from missing/expired links. Verification resend stays inside registration rather
than on a separate public form; the browser's non-identifying cooldown survives refresh and
tabs, while the server remains authoritative for the 60-second and hourly limits. Successful
password reset returns directly to sign-in. Never claim that mail definitely went to an ineligible
address or reveal whether an address has an account. Profile shows a pending email method until
verification, offers correction and resend guidance, and keeps failed destructive confirmation
open with a recovery action. A provider-only member can add email/password to the same account
after recent reauthentication; matching email never implies an account merge.
Email registration alone has a separate, initially unchecked privacy-consent checkbox linked to
its own versioned document and the policy; the API records the accepted version and server time.
Do not present the checkbox as proof of parental authority. Age and guardian authority are not
checked in this release by the architect's acknowledged risk decision; do not invent an 18+ rule
for this school-oriented product. Provider-created accounts need their own consent flow before
those providers are enabled later.
Change 140 account surfaces reuse the public site header and layout on every auth/recovery route,
without a separate auth header or return-to-learning link. They keep one narrow form column,
explicit check-mail and reset outcomes, and compact VK ID,
Yandex ID and Telegram alternatives. Providers are visibly disabled until explicitly enabled
for release on the server. SSR and client views use its public availability contract. Auth
fields use helpful placeholders, shared help popovers beside labels and an icon-only password
visibility control with no hover underlay; no-JavaScript hints use CSS scripting media without hydration
shifts. Every credential-bearing form renders `method="post"` in SSR so an unenhanced submit never
places a password in the URL; auth submit controls stay disabled until enhancement is ready.
Password visibility is an accessible local control;
the password minimum stays 12 characters. Do not add name fields or a remember-me option.
The account route is one page, not tabbed: an empty state appears only when the member has no
current-revision saved results. Account continuation and empty-state cards use neutral surfaces and
text, without decorative illustrations or separate image backings. Otherwise, up to one compact
continuation each for a mini-course, an EGE topic and standalone practice uses existing
account-scoped progress and published content;
do not claim recency without a timestamp. Login methods share one compact visual vocabulary,
with reauthentication guidance beside the heading and a contextual recovery action only when
needed. Logout belongs to profile identity; the safety section contains only account deletion.
Unavailable signed-in progress is never shown as zero or as an empty account. Activity calendars, history, XP and
achievements require a later data contract. The public header shows signed-in progress and a
profile initial, reserves stable geometry during session loading, and does not treat a failed
session fetch as a guest sign-in state.

## 6. Delivery and verification

Retain SSR-readable theory/content, stable image dimensions, self-hosted font fallbacks and
retained-page navigation with delayed progress. No decorative motion observers. Loading, error
and not-found states use quiet shared primitives; static Nginx errors work without app assets.
Responsive lesson outlines must have stable first-paint geometry through hydration; do not
render an expanded mobile outline and collapse it only after JavaScript starts. Preserve the
complete usable outline when scripting is disabled.

E2E uses domain fixtures and Page Objects exclusively. UI changes require MCP screenshots and
console inspection, desktop/mobile and affected degraded states. TypeScript changes require
LSP and repository typecheck. Validate real pages, not internal lab specimens. Use repository
format/lint commands and finish with allowlisted cleanup. Gate scope comes from STACK.

## 7. Brand delivery

Use infraege stone logo, current generated favicon/manifest/social assets and consistent titles.
ALCHIMIA may remain only in immutable historical evidence. Keep brand generation deterministic;
no new typography or image-generation dependency is required for this simplification.

## 8. Action and link hierarchy

Base UI Button owns actions: primary (ink), secondary (outline), soft (neutral fill), quiet
(transparent) and destructive (danger, only entry to and confirmation of destructive actions).
Buttons never underline or wrap their labels; layouts wrap the whole action instead.
Primary actions share a constant ink background and transform-only hover/focus scale of 1.02,
with a .98 press scale. Disabled/loading states do not scale; reduced motion disables transforms.
Field adornment icons share a 20px size and do not shrink. Practice controls align independently
of their descriptions/errors; messages remain in normal flow below the field.
Practice uses primary checking, secondary retry, soft hint and soft solution. Expanded help
has a neutral selected surface; labels reserve enough width to avoid moving neighbours.
Button press scales to .98 over 140ms without layout changes; reduced motion disables scaling.
Inline search icons retain their single composite surface; disclosure rows do not scale.

Shared link CSS owns neutral text underlines and hover/active/focus. Text links use Lucide
ArrowRight internally and ArrowUpRight externally or for new tabs; back, download and mail
use their semantic icons. Only link text is underlined. Navigation surfaces (menu, cards,
outline, pagination and task IDs) opt out of text-link arrows/underlines. Button-looking links
remain anchors with shared button styles, never Base UI Button rendered as an anchor.
External new tabs retain noopener/noreferrer and an accessible new-tab announcement.
Do not introduce page-level link/button color or decoration overrides.

Catalog expanded tasks repeat the topic label in a compact heading, with theory alongside it.
Suppress the redundant standalone answer instruction “Запишите целое число в десятичной системе счисления.”
in presentation only; preserve authored statements and other answer-format instructions.
Loading buttons retain their content footprint and accessible name while a centered overlay spinner
replaces the visible content. Disabled and loading states never change control geometry.

Task code-variant blocks display only the authored Python variant as an ordinary CodeBlock,
without language tabs, including SSR. Other standalone code blocks retain their content.

Task detail uses the topic as its sole h1, with an icon-only back link on the left and an accessible hover/focus tooltip.
Task title is subordinate text; short ID, shared difficulty scale, answer format, known sources,
available duration and theory form a wrapping metadata row within this header.
The info icon sits immediately to the right of the main topic heading.
Separate topic/metadata from the task group with space-4. The subordinate task title belongs
to that task group, immediately above its statement with a space-1 interval.
Known public sources stay in metadata; unknown-source filler and duplicate progress/actions are omitted.
Keep one context-preserving return link; no next-task navigation. Progress explanations live in an info popover.


## 9. EGE catalog

Use the existing SearchField, Button, Progress, ActionLink, Typography and PageContainer.
SearchField supports optional controlled value/onValueChange without changing existing practice
submission semantics. Topic status buttons use pressed semantics; targets remain at least 40px.
Topic progress scopes `--progress-height: 8px` locally, preserving the original shared light track and semantic states. Hover/focus uses a slightly darker neutral row surface so the track remains distinct.
All interface icons are Lucide. Only topic 5 and 16 have authored mathematical SVG miniatures,
faithful to the supplied reference; other topics share a neutral BookOpen placeholder.
Published rows expose one navigable link and hover/focus surface; planned rows have no action.
Place total/published topic counts and lesson practice progress below the page title, without a generic subtitle. Counts reflect the full catalog, independently of filtering.
Reserve image, progress, status, header-summary and action geometry on first paint, including
loading, API errors, retry, font failures and delayed hydration. Never clip readable topic copy
for fixed row heights. Use CSS breakpoints, not post-mount viewport detection. No animations of
list geometry or automatic scrolling when filters change. Keep full SSR/no-JS catalog access.

Planned topic titles and exam numbers use the existing muted text token; do not fade whole rows
or compromise text contrast. Published theory/task metadata aligns with the title, while practice
status/count and the progress track align at the bottom of the text area. The row arrow translates
4px on hover/focus using transform only; reduced motion disables this translation and transition.

## 10. Mini-course catalog

The approved `/courses` reference permits four subject-specific hand-drawn raster illustrations
as a local exception to §4. Preserve transparent PNG masters and serve optimized WebP with
explicit dimensions, empty alt and reserved geometry. No SVG substitutes or background scenes.
Use existing Typography, PageContainer, ActionLink and Progress; two columns become one on mobile.
Retain registry order, titles and descriptions. Planned directions have a shared corner “Скоро” badge and aria-disabled state, no links,
disabled controls, invented counts, levels or dates. Python has one “Открыть курс” overview link.
Header totals and card progress share one revision-aware course-progress calculation. Until
hydration or on summary failure, show a neutral/loading or unavailable state, never a false zero
or a partial aggregate. Preserve geometry through hydration, image/font failure and no-JS.
Planned cards retain the white surface and shared shadow; only titles and decorative illustrations are slightly muted. They have no hover motion.
All four cards share equal responsive dimensions with a soft static shadow and a very low-contrast border. Metadata follows the description directly;
published courses may expose grounded level/outcome copy from the catalog definitions.
Published-card hover/focus translates the card 2px upward. The primary overview ActionLink uses
the shared opt-in scale effect (1.02, no button translation) and a 4px arrow translation. Background,
foreground and shadow remain unchanged. Reduced motion disables all transforms/transitions.
Do not change shared control colors per page. The shared light progress track remains visible
against the constant white surface. Illustrations reserve a 13rem square (bounded on mobile).


## 11. Course overview

`/courses/python` follows `docs/artifacts/references/20_30_50.png` with actual published curriculum:
28 lessons, nine modules and the four-lesson task-manager project. Preserve full authored titles,
order, URLs, and content. Hide module descriptions, per-lesson outcomes and the long outcomes list
on this compact overview only. Reading tracking is excluded; header/footer and lesson UI stay shared.

Desktop uses approximately 34/66 summary/program columns with a thin divider; below 60rem stack
summary, action, practice progress and curriculum. Use existing fonts, neutral tokens and Lucide.
The summary contains level, lesson count, grounded requirements, primary lesson link and task progress.
The overview intro is text-only, without a decorative illustration.
Rows contain module.lesson numbering, complete title, mastery icon, solved/total tasks and an arrow;
on narrow screens counts move under titles. Keep 40px targets and full text wrapping.

First module starts open. Independent disclosures and expand/collapse-all are page-local; progress
hydration never automatically changes disclosure. Shared Accordion's opt-in native details fallback
preserves the same first-paint layout and usable lesson links without or with failed JavaScript.
Bulk controls remain hidden before enhancement. No animated program height or automatic scrolling.

Existing revision-aware lesson progress drives counts, module states and first-unmastered continuation
using each lesson's mastery threshold (default 80%). A zero-task lesson is not mastered. Course
practice counts sum lesson task memberships, consistently with per-lesson progress. No reading
state or browser persistence. The catalog keeps its existing mastered-lesson semantics. Guest visitors see
the same zero-of-total indicators from public memberships, but no synthetic mastery, saved counts or personalized continuation.
Use “Не начат”, “В процессе”, “Освоен”; exact task counts remain visible even at mastery.
No progress gives “Начать курс”; partial progress selects the first unmastered lesson; complete mastery
gives “Все уроки освоены” and “Повторить курс”. Before hydration or on unavailable/incomplete summaries,
show neutral counters and “Открыть первый урок”, never fabricated zeros or partial aggregates.
Reserve action/count/status geometry across hydration and show “Прогресс временно недоступен” on failure.

## 13. Lesson readability and return navigation (Change 129)

Lesson outline rows have no extra group gaps, with 32px minimum mouse targets and 40px touch
targets. Preserve nested lists, current-location indication and stable SSR/mobile disclosure.
Lesson progress reset is a compact, content-width, bare action with secondary text and normal
weight; the destructive confirmation remains in the shared dialog.
For guests the lesson-rail progress block renders `0 из N`; on hover or keyboard focus its content
blurs and a lock with a sign-in tooltip appears. On touch the lock layer remains visible and links
to sign-in. Signed-in reset changes only the current lesson context.

Inline Notation uses its data font without a background or padding by default, across lessons,
catalog and task detail. Only explicit `emphasis="highlight"` opts into a backing; semantic
containers can supply that backing's color but cannot automatically highlight all notation.
Preserve authored emphasis and block-code/educational surfaces. Code disclosure buttons remain
transparent even when expanded, hovered or pressed; expanded help keeps its selected surface.

Lesson practice uses the catalog difficulty glyph with the task's actual numeric level. Task
headings use 18px/600 UI type; theory links form a vertical list to the right with a 24px
column gap, wrapping below with an 8px gap at widths up to 40rem. Place Lucide Link before fragment
links, preserving 16px before the statement. Previous/next lesson links use 14px UI text and 40px targets.

Both lesson types expose a shared return-to-top control after one viewport of scrolling. It
sits outside the reading column above 72rem; narrower layouts use a borderless 40px bottom strip plus safe
area, with bottom scroll reserve and scroll padding for focused controls. Hide it while a mobile
field or modal is active. Focus the lesson heading without an extra scroll and scroll to page
start smoothly, or instantly for reduced motion. Keep it hidden before enhancement/no-JS and
reserve geometry independently of hydration. Browser access stays in the owning shared adapter.
