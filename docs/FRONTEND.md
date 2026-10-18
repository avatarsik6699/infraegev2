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
  entered after enhancement. Field and MultiCombobox share the label component. With
  `suggestions` (enhanced only) the Field becomes a Base UI Autocomplete combobox: the list never
  changes the typed text, Enter without a highlighted item submits the form, an item navigates,
  and a late response never replaces a newer query.
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

- Lesson figures are code-built SVG from the lesson manifest (`LessonDiagram`, `LessonStepper`),
  placed after the paragraph or list they illustrate (contract test `lesson-media-placement`). The
  raster `LessonVideo`/`LessonFigure`, their Pillow engine and the Nginx `/lesson-media` route were
  removed with the old recursion lesson (Change 184).
  `LearningVisualFrame` remains only for practice task content.
- `CodeBlock` shows line numbers by default (`showLineNumbers={false}` opts out) in a gutter that
  is not selected or copied; long blocks collapse behind a "show all code" button and expand
  again; copy and keyboard focus stay available. Syntax colours keep at least 4.5:1.
- Course code blocks (Change 175) follow the stand: a file-like name in the head (`fileName`), no
  line numbers outside a runnable block, and one output field in lines (`outputLayout="lines"`):
  «Вывод:» on its own row, the printed lines under it (labels under the code — «Вывод:»,
  «Строка N:», «Переменные:» — are `CodeBlockLabel`: one quiet caption with its own small mark); typed input is a key-like `kbd` with ↵
  (`⟪…⟫` in the data), the stopping error is the last line in `--color-learning-danger`; output
  longer than eight lines folds like long code. Topics keep the one-row output.
- A course lesson opens with a lead (`ConceptBlock.lead`): no heading of its own and no entry in
  «На этой странице». «Тонкости: …» of a step is `ProofDisclosure kind="nuance"` (a small mark, the
  label and its topic, the arrow on the right); a proof keeps the plain fold.
- Generated figures name the stand's fonts; `lesson-media.module.css` maps them to the site faces,
  and monospace labels keep the 0.6 em pitch (`textLength`) the builders place boxes by.
- `CodeRunner` is a runnable code block: steps recorded at export by `tracer.py` (media kind
  `run`), never code executed in the browser. «Запуск» (a quiet pill) after the copy button; back / count / forward / close
  and ←/→/Esc while running; the executed line is highlighted; variables sit beside the code when
  the widest line leaves room, under it otherwise (values in small boxes; call frames nested, the
  active one and a changed value outlined in `--color-current-location`; lists/dicts/sets as
  objects with arrows); every step is laid out in one grid cell so the block keeps its tallest step's height.
  Without scripting and on SSR it is the ordinary code block with output.
- `RangeSandbox` redraws `range(start, stop, step)` or `s[start:stop:step]` as the learner types,
  with Python's rules (`range-values.ts`); without scripting it draws the default example.
- `SheetBlock` (Change 177) is the Excel course's live sheet, the stand's mini-sheet: column
  letters and row numbers, a formula bar with references coloured as their frames, frames of the
  cells the selected formula reads drawn on the grid lines (a 2px band over the line plus 1px
  right/below, so neighbouring frames share one band; the selection sits on the same lines; the
  tint is the cell's own background), sheet tabs that mark a sheet the formula reads, editable
  source cells (Enter/Tab/F2/Esc, typing replaces the value, «Вернуть исходные»), `aria-live`
  for the shown value and the number of recalculated formulas. The data comes from the media
  manifest (kind `sheet`); values are computed by `shared/lib/sheet-eval`, a port of the stand's
  evaluator that must match `tests/fixtures/sheet-cases.json` cell by cell. Frame colours are the
  `--color-sheet-ref-1…5` tokens. SSR and no-JS show the values, every sheet with its name and
  the formula list; the grid scrolls inside the block on a narrow screen. Walls of a field
  (topic 18, Change 184; `walls` of a sheet part, sides `trbl` per cell) are inset shadows in
  `--color-text`, so they never shift the grid or meet the frames.
- `PythonTerm` in topic lessons explains a Python or an Excel basic (`course` of the generated
  `python-terms.tsx` entry, Change 184): «Курс Python: …» / «Курс Excel: …» and a link to that
  course's lesson.
- `FillSandbox` copies a formula from its cell to the one the learner names with the shift rule of
  `sheet-eval` (`shiftFormula`), marks the moved parts of every address and says when an address
  leaves the sheet (`#ССЫЛКА!`); without scripting it shows the lesson's worked example.
- `KeyCombo` (shared) draws a keyboard shortcut in lesson text as keycaps joined by «+» that never
  break across lines; lessons mark it `[[Ctrl+C]]` (export → `<KeyCombo keys={…} />`).
- `FormulaBlock` is a formula of the Excel course (F9), drawn as the live sheet's formula bar and
  not as a code block: an optional cell address (lesson `B2: =…`), a muted italic «fx», the
  formula in the data face with function names in medium weight and template slots (lower-case
  words, «…») in italics; hairline frame on white, one quiet copy button that copies the formulas
  without addresses. Without scripting the copy button is absent.
- Self-check uses the native `details` fallback so answers stay closed until revealed, before
  enhancement and without JavaScript. General Accordion keeps its explicit opt-in fallback
  contract.
- Every practice task uses one layout (catalog, task page, lessons; Change 170 F30): the answer
  field, «Проверить» and available «Подсказка» / «Решение» actions in one row, the help panels below
  it. Each help action and panel exists only when its authored blocks are nonempty. Without
  scripting the toggles are hidden and available panels are shown. An accepted answer is shown by the
  field itself (success border and fill, a check without a circle) and a short confetti burst,
  off under reduced motion; the result is announced to assistive technology, not printed.
- A task theory link is named after the heading it leads to, or «Теория» when the task names no
  section (F54).

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
- Task detail uses the task title as its sole h1, with a text link «← К списку задач» on one line
  with the topic above it, and one wrapping metadata row (short ID, difficulty, answer format,
  duration, known sources, theory). Unknown-source filler and duplicate progress/actions are
  omitted. One context-preserving return link; no next-task navigation and no practice
  explanation popover (F31, F32, F47).

Progress and accounts:

- One counting rule (Change 185): the main number of lessons or tasks is the one mastery counts
  (core lessons, tasks outside advanced subtopics), on every page and in the profile; where there
  is room the rest follow as «+ N дополнительных». Progress denominators use the same main number.
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
  practice from account-scoped progress and published content; the first becomes the single
  «Следующий шаг» plate (Change 168). Course, topic and practice tiles and per-topic rows render
  only when their own summary and progress are loaded, so one failing source never hides the
  others or shows invented zeros. Do not claim recency without a timestamp: «Попробуйте задачу»
  is the bank task after the highest-id saved one in the default order. Logout belongs to profile identity; the safety area contains only account deletion.
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
- EGE topics are subtopic pages (Change 167): `/ege/{topic}` redirects to the first subtopic,
  `/ege/{topic}/{subtopic}` and `/ege/{topic}/praktika` are real links (never fragment-only), and an
  old `#section` resolves to the page that owns it. Subtopic grouping lives in the lesson
  definition and is validated by `subtopicErrors`. Task theory links point at the owning subtopic
  URL. After client navigation between topic pages focus moves to the new page heading; the
  first load keeps browser focus.
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

### Paid access (Change 192)

- **Access:** `entities/access` asks `GET /api/access` on the server with only the session
  cookie (`getAccessState`). Every topic and course lesson route loads it, so the trees lock paid
  files alike. `accessState.opens` decides whether paid modules load; `accessState.locks` decides
  locks and the paywall; an unknown state shows neither and never paid text. A page rendered for
  a session is `private, no-store`.
- **Prices:** `entities/billing` (`getOffer`, cached a minute per process) is loaded only where the
  visitor sees prices: the paywall, `/pricing`, `/subscribe`. The root loader reads only
  `billing` for the footer through `shared/lib/site-flags`. Browser calls (`billingApi`) carry the
  CSRF token; leaving for the provider goes through `shared/lib/payment-navigation`.
- **Paywall:** `features/paywall` takes the page's own path (`from`) as a prop, never from router
  state, so pages render it in isolation. Counts come from the content: subtopics with `paid`,
  their `selfCheck` numbers and the API's `locked` task list. The JSON-LD of a paid page points
  `cssSelector` at the global `.paywall` class. The checkout return trusts only
  `GET /api/billing/payments/{id}`, never its query string.
- **Legal texts:** `/oferta` and `/vozvrat` render `content/legal` through `import.meta.glob`;
  the web image copies that directory and dev mounts it, because the API hashes the same files
  for the acceptance journal.

## 7. Catalog and overview behaviour

- EGE catalog: total/published topic counts and lesson practice progress sit below the page title
  and reflect the full catalog regardless of filtering. «Все темы» lists topics by first task
  number, published and planned mixed, planned rows muted (F25). Topic status buttons use pressed
  semantics. Published rows expose one navigable link; planned rows have no action. Illustrations
  never change publication status. Full SSR/no-JS catalog access.
- Mini-course catalog: registry order, titles and descriptions are kept. Planned directions have
  aria-disabled state, no links and no invented counts or dates: they show their registry level,
  «— уроков» placeholders, an empty bar and a quiet «Скоро» label, no link or button (F34, Change
  185); a published card is one overview link as a whole. Header totals and card progress share one revision-aware calculation; until hydration or
  on summary failure show a neutral/unavailable state, never a false zero or partial aggregate.
- Python course overview: full authored titles, order and URLs for all 28 lessons, nine modules and
  the four-lesson project. Module descriptions, per-lesson outcomes and the long outcomes list are
  hidden on the overview only. The first module starts open; disclosures are page-local (no
  expand/collapse-all, F35), hydration never changes disclosure, and the Accordion's native
  `details` fallback keeps the same first paint and usable links without JavaScript.
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
