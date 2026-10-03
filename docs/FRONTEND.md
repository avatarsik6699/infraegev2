# Frontend Contract

> Binding rules for `apps/web`. Product intent lives in `docs/SPEC.md`; exact dependencies,
> commands and gates live in `docs/STACK.md`. This file owns frontend architecture, code shape,
> state, accessibility, SSR/no-JS and functional interaction contracts. The visual system
> (palette, typography, spacing, shapes, component appearance, illustration and motion style)
> lives in [`DESIGN.md`](../DESIGN.md) and is maintained through the `impeccable` skill.
> Visual rules recorded here before Change 164 are recoverable with
> `git show 01252a9:docs/FRONTEND.md`.

## 1. Decision sources and interaction contracts

Accessibility and interaction practice is adapted from Kontur Guides rather than used as a runtime
dependency or component library:

- [Accessibility principles](https://guides.kontur.ru/principles/accessibility/accessibility/)
- [Adaptivity](https://guides.kontur.ru/principles/base/adaptivity/)
- [Validation](https://guides.kontur.ru/principles/data/validation/)
- Component guidance for [Input](https://guides.kontur.ru/components/input-fields/input/),
  [Button](https://guides.kontur.ru/components/actions/button/),
  [Link](https://guides.kontur.ru/components/actions/hyperlink/),
  [Tabs](https://guides.kontur.ru/components/navigation/tabs/) and
  [Progress](https://guides.kontur.ru/components/progress-indicators/progress-bar/)

When guidance overlaps, accessibility and the explicit product/architecture decisions in
`docs/SPEC.md` win. New guide extractions land here as project rules with a source link.

Practice catalog controls:

- Topic selection uses the existing Base UI Combobox in multiple mode with grouped options,
  search inside the popup, second-line counts and explicit Apply/Reset. Apply commits, Reset
  clears the draft. Pointer opening does not autofocus the search; keyboard opening does. Popup
  height is bounded by the available viewport.
- Without JavaScript, topic selection is a native multiple select in the GET form. Sort is a Base
  UI Select with a native GET fallback. Catalog filter/limit forms keep the GET fallback and use
  router navigation when hydrated; the current page stays visible during requests.
- SSR renders the final control geometry. Never swap a tall native control for an enhanced one
  after hydration. Native fallbacks live in `noscript`; CSS `scripting: none` hides their scripted
  counterparts. Hidden submission values never duplicate native values.
- Search is one shared Field with inline clear/submit actions; clear appears whenever text is
  entered after enhancement. Field and MultiCombobox share the label component.
- An active filter is removable from its own badge; reset-all is a separate action.
- Pagination keeps neighbouring pages and explicit destinations for skipped ranges, and the
  per-page limit belongs to the same control group.
- Field errors sit directly below the field; success is announced accessibly. Field labels stay
  accessible even when visually hidden; help panels have headings.

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
- Shared controls own accessible semantics; Base UI stays behind their local APIs. Theme values
  feed semantic tokens, and CSS Modules consume only semantic tokens. Do not add a replacement
  component system. Interface icons come from Lucide.
- Browser globals and storage belong to focused `shared/lib` adapters; network access belongs to
  the consuming slice's `api/`; server environment reads belong to `*.server.ts`. Production
  components do not call `window`, `document`, storage, `navigator`, `fetch` or `process` ad hoc.
- Use `shared/lib/safe-json` and `shared/lib/safe-ls` for persisted data. Low-level React external
  store subscription, scoped Zustand Context wiring and persistence hydration belong to small
  `shared/lib` primitives; domain slices declare schemas, migrations and business operations and
  consume those primitives. DTO filenames are reserved for transport boundaries; domain types
  belong to the owning entity.

## 4. Accessibility baseline

- Controls keep at least 40px targets (32px mouse-only rows in dense outlines, 40px on touch);
  keyboard focus is always visible; text and essential UI meet WCAG AA contrast.
- Layout works as a single reading column on mobile and wraps under zoom/enlarged text without
  clipping readable copy.
- Reduced motion disables transforms and transitions; no idle animation.
- Public navigation exposes real routes. Planned content is text, never a fake or disabled link.
- Buttons never wrap or underline their labels; layouts wrap the whole action. Button-looking
  links stay anchors with shared button styles, never Base UI Button rendered as an anchor.
- External new-tab links keep `noopener noreferrer` and an accessible new-tab announcement.
- Loading buttons keep their content footprint and accessible name; disabled and loading states
  never change control geometry.
- Do not introduce page-level overrides of shared link or button styling.

## 5. Learning and state

Preserve authored theory, ordering, task IDs, examples, figures and accessible descriptions.
Course/topic domains stay independent. API owns tasks/checking and authenticated progress;
frontend owns transient input only. Guest progress is not counted or persisted, and old browser
progress keys are ignored without import.

Authored TopicLesson prose may link to a published Python CourseLesson that explains a specific
technique used at that point. Keep these as ordinary contextual links, verify their destinations,
and do not derive prerequisite, recommendation, membership or shared-progress state from them.
Introduce a new concept in plain language before its technical name or code; briefly remind the
reader of existing Python basics at their point of use and link to the full course explanation.

Lesson media:

- `LessonVideo` (SPEC §2.3) has WebM and MP4, a poster, reserved dimensions and one caption. It
  follows the paragraph it illustrates, never a code block or another block. No `autoplay`
  attribute: without scripting only the poster shows. With scripting it starts from the beginning
  when at least half visible (`useInViewport`) and pauses off-screen; a learner's pause is kept.
  Controls are one play/pause button and a native range timeline; clicking the picture toggles,
  scrubbing does not pause, controls are hidden without scripting, and reduced motion shows the
  poster until the button starts it. Video files are served by Nginx (Range/206), never by Node.
- `LessonFigure` is a WebP with reserved size, lazy loading, `alt` and one caption, placed after the
  paragraph it illustrates. About one figure per three sections and at least two blocks between a
  figure and a video; the contract test `lesson-media-placement` enforces order and distance.
  `LearningVisualFrame` remains only for practice task content.
- `CodeBlock` shows line numbers by default (`showLineNumbers={false}` opts out) in a gutter that
  is not selected or copied; long blocks collapse behind a "show all code" button and expand
  again; copy and keyboard focus stay available. Syntax colours keep at least 4.5:1.
- Self-check and practice help use the native `details` fallback so answers stay closed until
  revealed, before enhancement and without JavaScript. General Accordion keeps its explicit
  opt-in fallback contract.

Practice state:

- No persisted answer drafts or custom catalog-row restoration. Catalog task forms preserve
  transient input and help state while collapsed, until the selection/page changes or the page is
  left/reloaded.
- Bulk disclosure belongs to the current result list: expand loads every visible-page statement
  for browser find; collapse keeps mounted forms and drafts. Individual toggles stay independent;
  changing selection/page resets disclosure. Bulk actions are hidden without scripting.
- Hidden forms never steal focus; a stale refresh preserves input and updates the checked
  revision. Return links carry filters and the numbered page.
- Distinguish wrong answers, missing data, stale tasks and service failure; keep entered input on
  service failure. Help disclosure never marks a task solved. Correctness and persistence are
  separate feedback states: a guest can solve but cannot save progress.
- Catalog expanded tasks repeat the topic label with theory beside it. The redundant instruction
  "Запишите целое число в десятичной системе счисления." is suppressed in presentation only.
- Task code-variant blocks show only the authored Python variant as an ordinary CodeBlock, without
  language tabs, including SSR.
- Task detail uses the topic as its sole h1, an icon-only back link with an accessible tooltip, and
  one wrapping metadata row (short ID, difficulty, answer format, known sources, duration,
  theory). Unknown-source filler and duplicate progress/actions are omitted. One context-preserving
  return link; no next-task navigation; progress explanations live in an info popover.

Progress and accounts:

- Personal progress is account-scoped server data, cleared from memory on logout/account switch;
  never store session tokens, answers or progress in browser storage.
- Guest progress shows a `0 из N` starting state derived only from public totals with an
  accessible sign-in invitation; it is never a saved result and cannot drive saved-progress
  filters or continuation. On hover/focus the guest scale reveals a lock with
  "Войти, чтобы сохранять прогресс"; touch shows it continuously and links to sign-in. Do not add a
  second login invitation beside the scale. Loading and failed session/progress states stay
  distinct; unavailable signed-in progress is never shown as zero or as an empty account.
- Do not add account or answer data to browser analytics or client-error telemetry; the cookieless
  public-page tracker remains governed by SPEC.
- Keep the shared modal reset confirmation, keyboard navigation and focus return. Lesson progress
  reset changes only the current lesson context.
- Email registration and recovery have an explicit check-mail state, a bounded resend action and
  routes back from missing/expired links. Verification resend stays inside registration; the
  browser's non-identifying cooldown survives refresh and tabs while the server stays
  authoritative for the 60-second and hourly limits. Successful password reset returns to sign-in.
  Never claim mail definitely went to an ineligible address or reveal whether an address has an
  account. Profile shows a pending email method until verification, offers correction and resend
  guidance, and keeps a failed destructive confirmation open with a recovery action. A
  provider-only member can add email/password after recent reauthentication; matching email never
  implies an account merge.
- Email registration alone has a separate, initially unchecked privacy-consent checkbox linked to
  its versioned document and the policy; the API records the accepted version and server time. Do
  not present it as proof of parental authority, and do not invent an 18+ rule. Provider-created
  accounts need their own consent flow before those providers are enabled.
- Auth and recovery routes reuse the public header and layout with one narrow form column. VK ID,
  Yandex ID and Telegram stay visibly disabled until enabled on the server; SSR and client use its
  public availability contract. Every credential-bearing form renders `method="post"` in SSR, and
  auth submit controls stay disabled until enhancement is ready. Password visibility is a local
  accessible control; the minimum stays 12 characters. No name fields or remember-me option.
- The account route shows an empty state only when the member has no current-revision saved
  results; otherwise up to one continuation each for a mini-course, an EGE topic and standalone
  practice from account-scoped progress and published content. Do not claim recency without a
  timestamp. Logout belongs to profile identity; the safety area contains only account deletion.
  Activity calendars, history, XP and achievements require a later data contract.
- The public header shows signed-in progress and a profile initial, reserves stable geometry
  during session loading, and does not treat a failed session fetch as a guest state.

## 6. Delivery, SSR and verification

- Public theory/content is SSR-readable without JavaScript. Images and media reserve dimensions;
  fonts are self-hosted with metric-matched fallbacks so loading keeps CLS within budget.
- Retained-page navigation shows delayed progress. Loading, error and not-found states use shared
  primitives; static Nginx errors work without app assets.
- Lesson outlines keep nested lists, current-location indication and stable SSR/mobile
  disclosure.
- Responsive lesson outlines keep stable first-paint geometry through hydration: never render an
  expanded mobile outline and collapse it only after JavaScript starts. The complete outline stays
  usable without scripting.
- Use CSS breakpoints, not post-mount viewport detection, for layout. No animated list geometry or
  automatic scrolling when filters change. Reserve image, progress, status and action geometry on
  first paint, including loading, API errors, retry, font failures and delayed hydration.
- Both lesson types expose a return-to-top control after one viewport of scrolling; it is hidden
  while a mobile field or modal is active, focuses the lesson heading without an extra scroll,
  scrolls smoothly (instantly with reduced motion), stays hidden before enhancement/no-JS, and
  reserves geometry independently of hydration. Browser access stays in the owning adapter.
- E2E uses domain fixtures and Page Objects exclusively. UI changes require Playwriter
  screenshots and console inspection on desktop/mobile and affected degraded states; use the
  documented STACK browser fallback only when needed. TypeScript changes require LSP and the
  repository typecheck. Validate real pages, not lab specimens. Use repository format/lint
  commands and finish with allowlisted cleanup. Gate scope comes from STACK.

## 7. Catalog and overview behaviour

- EGE catalog: total/published topic counts and lesson practice progress sit below the page title
  and reflect the full catalog regardless of filtering. Topic status buttons use pressed
  semantics. Published rows expose one navigable link; planned rows have no action. Illustrations
  never change publication status. Full SSR/no-JS catalog access.
- Mini-course catalog: registry order, titles and descriptions are kept. Planned directions have
  aria-disabled state and no links, invented counts, levels or dates; Python has one overview
  link. Header totals and card progress share one revision-aware calculation; until hydration or
  on summary failure show a neutral/unavailable state, never a false zero or partial aggregate.
- Python course overview: full authored titles, order and URLs for all 28 lessons, nine modules and
  the four-lesson project. Module descriptions, per-lesson outcomes and the long outcomes list are
  hidden on the overview only. The first module starts open; disclosures and expand/collapse-all
  are page-local, hydration never changes disclosure, and the Accordion's native `details`
  fallback keeps the same first paint and usable links without JavaScript. Bulk controls are
  hidden before enhancement.
- Course progress uses revision-aware lesson progress and each lesson's mastery threshold
  (default 80%); a zero-task lesson is not mastered; practice counts sum lesson task memberships.
  States are "Не начат", "В процессе", "Освоен" with exact task counts. Actions: no progress →
  "Начать курс"; partial → first unmastered lesson; complete → "Все уроки освоены" and
  "Повторить курс". Before hydration or on unavailable summaries show neutral counters and
  "Открыть первый урок"; on failure "Прогресс временно недоступен". Guests see zero-of-total
  indicators from public memberships, never synthetic mastery or personalized continuation.

## 8. Brand assets

Use the infraege stone logo, the generated favicon/manifest/social assets and consistent titles.
ALCHIMIA may remain only in immutable historical evidence. Brand generation stays deterministic.
