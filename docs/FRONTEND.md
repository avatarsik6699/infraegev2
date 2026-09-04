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
- Browser globals and storage belong to focused `shared/lib` adapters; network access belongs to
  the consuming slice's `api/`; server environment reads belong to `*.server.ts`. Production
  components do not call `window`, `document`, storage, `navigator`, `fetch` or `process` ad hoc.
- Use `shared/lib/safe-json` and `shared/lib/safe-ls` for persisted data. Low-level React external
  store subscription, scoped Zustand Context wiring and persistence hydration belong to small
  `shared/lib` primitives; domain slices declare schemas, migrations and business operations and
  consume those primitives. DTO filenames are reserved for transport boundaries; domain types
  belong to the owning entity.

## 4. UI foundation and replaceable theme

- The local component layer owns semantics and styles. Base UI provides accessible behavior when a
  matching primitive exists; import it through exact subpaths such as `@base-ui/react/button`.
- The initial neutral visual grammar adapts shadcn/ui's current
  [neutral theme](https://ui.shadcn.com/docs/theming) and
  [Button](https://ui.shadcn.com/docs/components/button) hierarchy without adding shadcn, Tailwind
  or their public variant names as dependencies.
- Vendor props, state names and types never cross a local public API. Consumers import the local
  slice, not Base UI. A native implementation is preferred only when no library primitive is
  needed or Base UI has no equivalent.
- Use CSS Modules for local static styles. Use `cssUtils.cx(...)` for class composition and
  `data-*` attributes for prop/state variants. Do not create static `*.styles.ts` objects.
- Repeated presentation-only declaration sets live in `shared/styles/patterns.module.css` and are
  consumed through CSS Modules `composes`; they must not carry domain meaning or replace component
  ownership. TopicLesson and CourseLesson may share neutral `LessonIntro`/`LessonTheory`
  presentation while retaining independent domain models, publication registries and routes.
- The visual dependency direction is `theme values → semantic tokens → component CSS`. Theme files
  may contain literal palette/font/geometry values; components consume only semantic tokens.
- Public names describe purpose (`primary`, `reading`, `warning`), never the current palette,
  material or “Engineering notebook” profile. Changing the active profile must not require domain,
  API, content or state changes.
- Keep one active light theme in this change. Runtime theme switching and dark mode are out of
  scope. The ALCHIMIA baseline remains monochrome: ink, muted surfaces and borders establish
  hierarchy, while semantic feedback colors retain only their functional meaning.
  Public header/footer rules, persistent link underlines, inline `Notation`, the code-header
  separator, buttons, badges, ordinary surfaces, control states and semantic feedback remain
  neutral or keep their independent semantic roles. Syntax tokens inside the dedicated dark code
  surface remain independent.
- A verified third-party brand mark may retain its official color only when it identifies the
  destination of a real external link. Keep it small, pair it with a text label and do not reuse
  the brand color for surrounding controls or decoration.
- The active profile has two neutral text levels only: primary and secondary. Semantic
  success/information/warning/error remain separate, while `soft`/`muted`/`faint` aliases must not
  create additional visible gray steps. Syntax colors remain the exception above. Informational
  blue is reserved for formative `Checkpoint` markers, not ordinary prose or decorative surfaces.
- Static surfaces and controls stay flat. Use spacing, one quiet fill or one border to establish a
  boundary; do not stack fill + border + shadow or nest card-like surfaces. Add an elevation token
  only together with a real transient-overlay consumer, never as a reserved decorative scale.
- Dense is the system default, not a one-off component variant: ordinary interactive controls use
  a shared `40px` height, related buttons and fields align, and compactness comes from internal
  spacing and composition rather than smaller hit targets or miniature text. Larger controls need
  a primary page-level role, following the adopted Kontur Input/Button size guidance.
- Separators are a last grouping signal. Prefer whitespace, alignment and a single ambient fill;
  keep a line only when removing it would make distinct interactive regions, data cells or focus
  boundaries ambiguous.
- Page texture is absent from the minimal baseline. A future profile may add it only in the theme
  layer and only when it improves orientation without reducing text contrast or adding local
  component backgrounds.
- Shared policy components are mandatory for links, images, typography, page containers, buttons,
  badges and other adopted primitives. Authored inline code and formulas use `Notation`
  (`code`/`formula`) so semantics and the neutral recognition treatment stay consistent.
  Specialized markup remains native for figures, diagrams, tables and lists.
- `CodeBlock` renders Python tokens synchronously as escaped React text nodes through the exact
  `@speed-highlight/core` grammar. Do not replace this boundary with runtime HTML injection or a
  client-only highlighting pass: readable SSR and no-JavaScript output are part of its contract.
  Its visible header names only the language; copy remains a quiet action without a contrasting
  hover surface.
- Topic lessons use a three-column desktop shell: outline, central reading stream and a reserved
  right rail. The right rail may be empty, but central lesson blocks do not move into it merely to
  fill space. Compact per-lesson progress sits below the table of contents and anchors the bottom
  of the desktop left rail; on narrow layouts it returns to normal flow immediately after the
  outline. Its label is a quiet UI caption rather than a content heading. The outline, central
  article and their context labels share one compact responsive column gutter so their content
  edges remain aligned through desktop, intermediate and mobile layouts. Outline groups and their
  children always remain one vertical column; the outline reserves its scrollbar gutter, keeps
  link weight stable between states and truncates overlong labels after two lines instead of
  reflowing them when the active item or internal overflow changes. Reset remains a quiet
  secondary action and uses the shared Base UI alert-dialog boundary so confirmation is modal,
  keyboard contained and returns focus to its trigger without shifting the rail.
- Course pages extend the incumbent neutral reading world without reusing Topic semantics. A
  course overview presents audience, outcome, the current course stage and one ordered public plan of
  lesson titles plus observable outcomes without a separate evolving-program disclaimer or date
  promise. Only published CourseLesson rows are links; their numeric order stays outside the link
  and the link emphasizes the title over its outcome without a redundant availability label.
  Review/draft or not-yet-authored entries remain visually secondary ordinary text marked «В
  плане», never disabled controls. Module numbering describes the broad sequence, while lesson-plan
  order describes the current authoring direction.
- A CourseLesson keeps course context and its local section outline together in one navigation
  rail, with the article as the dominant reading stream. On narrow screens the title and outcome
  precede the ordinary in-flow «Содержание урока» list so a long outline cannot displace the
  lesson identity from the first viewport. Both lesson families end with only the available
  previous and next lesson links in a compact wrapping row; these are underlined directional links,
  not button-like actions, a collection-index link or a separately titled materials panel. Course
  navigation resumes at the result rather than competing with local reading navigation throughout
  the article. Do not repeat a separate «Теперь вы умеете» outcome list in the result.
- Numbered lesson-stage headings are quiet navigation landmarks: the section index and uppercase
  name share one compact, low-contrast UI role. The authored subsection heading below is the stronger
  reading landmark, but stays within the shared type scale rather than becoming display text.
- Course progress is a hydration-only enhancement derived from published CourseLesson entries in
  the app-scoped lesson-progress registry; it has no separate store or persistence lifecycle.
  Copy says «освоено N из M доступных уроков» and keeps that state separate from the course stage.
  On the overview it stays a compact row with a thin progress bar directly
  above the curriculum, not a standalone titled section in the course introduction. It is
  informational only: the published lesson row remains the course entry point, so progress does
  not contain a competing action. Never render a total-course percentage, hard lesson locks or
  course-wide reset while the program is still developing.
- A `Checkpoint` may appear immediately after a `ConceptBlock` that closes a coherent theory
  group. Keep these checks short, sequential in SSR/no-JS, and visually contained; distinguish the
  group with one question icon, a matching informational heading label and one compact neutral
  left rule, without adding a card surface or coloring the question text.
  A group may contain several independent disclosure questions when the theory cluster warrants
  them. Do not defer all retrieval practice to one block directly before the practice section. Two
  directly adjacent lesson steps must not each render their own single-item `Checkpoint`; merge
  such a pair into one step's multi-item `checkpoint` array instead.
- `Mistake` presents its authored claim and explanation as one vertical «Неверно» / «Как правильно»
  comparison at every viewport width. A compact neutral rule identifies the block; error and success
  colors remain reserved for its icons and text labels, while authored body copy stays neutral and
  the two readings use a standard neutral divider. Color is always duplicated by the distinct icons and labels; because
  this is static instructional content rather than a runtime event, it remains an `aside` instead
  of an alert. `Checkpoint` and `Mistake` share the same compact outer padding, left-rule weight,
  service-label type, icon size and text-column inset so their semantics differ without competing
  in the reading flow. `WorkedExample` treats «Разберём на примере» as restrained reading context, not a
  data-style eyebrow competing with the example title. Lesson layouts own external vertical
  rhythm: continued prose uses the 12px content-flow role, a stage landmark sits 16px from its
  first related content, a related standalone learning block uses 24px, separate concepts use 48px
  on desktop and 32px on narrow screens, and major lesson sections use 64px on desktop and 48px on narrow screens. Learning components own only their
  internal geometry and do not introduce outer margins. `Procedure` exposes its specific authored
  title directly and does not prepend a generic «Как действовать» label.
- Every practice task renders its statement, separate «Подсказка» and «Решение» disclosures through
  one exhaustive structured-content boundary. It supports safe inline notation in text, semantic
  ordered/unordered lists, Python/text code, native tables, local task-owned images, annotated
  diagrams with a visible text alternative, authored downloads, callouts and the three established
  step-based learning roles. Images use the shared policy component and intrinsic dimensions;
  tables and code scroll within their own bounded region on narrow screens; downloads remain real
  links in SSR/no-JavaScript. The server-loaded public projection never includes checker answers or
  tolerances. Arbitrary HTML/MDX, SVG attachments, video/iframe, external embeds and user uploads
  are rejected at the content boundary rather than sanitized in the renderer.
  Before enhancement both help sections remain ordinary linear SSR/no-JS content; after hydration
  they collapse independently and retain native keyboard/focus semantics through the shared
  `Accordion` wrapper. A solved task uses the success check in its tab and a trailing success check
  inside its flat, readable disabled answer field; keep the «Проверить» control visible but disabled
  so the form geometry and action context remain stable. Do not repeat solved state with a badge or
  navigation actions to the next task/result because the tabs and page outline already provide
  those paths. Persist only the learner's accepted submitted value alongside the solved task id,
  restore it after reload and keep the useful correctness explanation immediately after submission;
  checker answers and tolerances remain server-owned.
- Public discovery is registry-driven. A TopicLesson, Course or CourseLesson enters the home/course
  lists, prerender crawl and sitemap only through `published`; review and lab routes stay unlisted
  and `noindex,nofollow`.
  Every indexable HTML route exposes an absolute `https://infraege.ru` canonical plus unique title,
  description and shared 1200×630 social metadata. The root owns a browser-only manifest plus the
  normalized production SVG/PNG/ICO favicon and Apple touch icon set; the large mark preserves the
  approved ALCHIMIA source geometry while the square favicon viewport adds only delivery whitespace
  and never redraws the mark. The monochrome SVG/favicon may switch to white only under an explicit
  dark context or dark browser color scheme. `/` alone owns the truthful `WebSite` JSON-LD site-name declaration.
  Generated favicon/touch/manifest assets satisfy
  `docs/BRAND_ASSET_REQUIREMENTS.md`. Do not add Organization/Person structured data without a
  separately confirmed real-world identity. `/robots.txt` and `/sitemap.xml` are server routes,
  not copied static lists that can drift from publication state.
- Public pages remain complete in SSR/no-JavaScript output and link to the current data-processing
  disclosure. Legal copy describes only behavior present in code/configuration, publishes the
  architect-approved email and Telegram invitation without exposing other personal requisites, and
  keeps the accepted legal-review risk explicit in the system contract.
- The public home uses a responsive editorial split: the primary product statement leads on the
  left and registry-derived materials sit on the right, grouped as «Мини-курсы» and «Темы ЕГЭ»
  without flattening their semantics. It collapses to one linear column on narrow screens. Group
  through spacing and quiet rows rather than decorative separators; public copy stays concise and
  states the current free theory-and-practice offer.
- A shared back-navigation link always renders a real fallback `href` for SSR/no-JavaScript and
  modified-click behavior. After hydration it follows TanStack Router history only when the
  router-owned history index says an in-app entry exists; direct entry, document reload and
  external-origin arrival use the explicit fallback route instead of leaving the application.
- Public headers share one quiet identity: the approved ALCHIMIA mark, Alegreya wordmark and
  Golos Text subtitle stay grouped at the left without release/version badges. The mark is
  decorative beside the accessible live site name rather than its replacement. Header and footer
  contents follow one viewport-relative gutter instead of contracting inside a centered max-width shell.
  Outside the home page the wordmark is the route back home. Material discovery belongs to the
  registry-derived home sections rather than duplicate collection links in global chrome.
  Optional analytics first appears only after hydration as a fixed full-width bottom prompt that
  overlays rather than shifts content; after a choice, its only persistent control lives in the
  «Ваш выбор» section on `/privacy`, not in the header. Public footers expose the privacy route and
  the shared Telegram invitation with a text label and the official brand mark. Published pages do
  not duplicate this chrome with page-private header markup. The shared public header has no
  bottom rule; spacing separates it from ordinary page content, while a lesson context bar keeps
  one bottom rule for the complete two-level lesson header. The footer keeps its top rule, and
  structural rail separators remain where they distinguish navigation from reading. Frozen lab
  headers keep their explicitly isolated review contract.

## 5. Responsive and accessible behavior

- Design and verify every changed surface at a narrow mobile width, around its structural
  breakpoint and on wide desktop. Preserve information hierarchy and the primary task rather than
  merely shrinking the desktop composition.
- Content may reflow from rows/columns into a linear order. Do not hide required lesson content on
  small screens. Nothing may overflow the viewport except an explicitly scrollable data/code
  region.
- Page and nested scroll regions use the same system-wide thin neutral, square-ended scrollbar.
  A sticky navigation rail stays in normal flow at responsive breakpoints and scrolls internally
  only when its content cannot fit in the viewport.
- Interactive targets are at least `40 × 40px`; compact visuals may use a larger invisible hit
  area. Dense styling never overrides this floor. Essential actions and information cannot depend
  on hover.
- Browser zoom through 150% must preserve access to all content. Prefer fluid measures and type
  tokens; responsive type changes keep heading hierarchy intact.
- Start from semantic HTML. Every interactive element is keyboard reachable, has a visible
  `:focus-visible` state and exposes its name/state without relying on color alone. Respect
  `prefers-reduced-motion` and `prefers-contrast`.
- SSR/no-JS output contains all required reading content. Enhancements may collapse or switch
  views only after mount under the shared `data-enhanced` state; do not duplicate content in
  `<noscript>`.

## 6. Typography and interface copy

- Reading prose uses the reading family; controls and labels use the UI family; code and numeric
  evidence use the data family. The reading and UI roles currently resolve to the same font
  (Golos Text) — display and data remain distinct families — but consumers still address the
  semantic role token, never the literal family name, so the roles can diverge again without a
  component rewrite. Component APIs use semantic text roles rather than raw size names.
- Public surfaces preload the small active self-hosted ALCHIMIA set and use `font-display: swap` so
  the real display, reading and service faces replace their fallback instead of leaving a first
  visit on heavier system typography. Display, reading and service fallbacks are metric-adjusted,
  while every active font subset is explicitly preloaded. Structural lesson columns use the stable
  `--measure-lesson` rem cap, not a font-relative `ch` width that changes while the reading face
  becomes available. `/fonts/`
  receives a bounded reusable production cache policy rather than immutable caching while some
  filenames remain unversioned. Do not reintroduce network webfonts or alter loading behavior
  without before/after cold-cache evidence that preserves stable text geometry and the
  public-route LCP budget.
- The active typography baseline uses only `500` and `600` in component CSS and the shared
  `--text-*` scale, with one role-specific cap: display/heading text (`var(--font-display)`/
  `var(--font-alchimia-display)`, Alegreya) never exceeds `500` — `600` at display weight reads too
  heavy — while `--font-ui`/`--font-data` (Golos Text/JetBrains Mono) may still use `600`. Consumers
  do not introduce literal sizes or intermediate variable-font weights.
  Semantic heading levels may share an effective size when hierarchy already comes from spacing
  and document structure. Keep readable line measures and enable lining tabular numerals for
  product-wide numeric data. `/lab/lesson` follows the same token and weight contract; page-private
  visual experiments may add semantic `--text-*` tokens but not literal component sizes or
  intermediate variable-font weights.
- Avoid decorative uppercase, tracked rubrics and miniature labels. Keep classification text in
  sentence case; uppercase is reserved for compact code/data notation and the deliberately quiet
  numbered lesson-stage landmarks where it materially improves scanning.
- Russian interface text uses real Unicode signs, «ёлочки», a true minus sign in arithmetic and
  non-breaking spaces where a value/unit or short semantic group must not split.
- Name fields with a concise noun describing the requested value. Avoid filler such as «ваш» or
  «введите» in labels; put a genuinely useful format constraint in the description instead.
- A tightly scoped answer field may visually hide its still-accessible label when the surrounding
  task already names the value. Its placeholder may carry one short input constraint such as
  «Без единиц измерения», but must not be the field's only accessible name.
- Avoid all-caps running labels. A compact, tracked uppercase rubric is allowed only when it acts
  as quiet navigation or classification rather than body text.
- Learning copy addresses the learner with polite «вы» and uses plain, calm Russian: short
  sentences, one main thought at a time, and concrete actions or results instead of bureaucratic,
  promotional or robotic phrasing. Introduce an unfamiliar technical term where it first matters,
  but preserve exact names of code, commands, values and errors.
- Humanizing a lesson is an editorial rewrite, not compression. Preserve the authored teaching
  sequence, intermediate reasoning, examples, retrieval checks, distinctions and factual
  precision. Remove repeated headings or helper text only when the adjacent interface already
  communicates the same meaning.
- Outcomes describe what the learner can now do. Instructions, hints and feedback say what to do
  next; mistakes are explained without blame, vague encouragement or hidden scoring.

### 6.1 ALCHIMIA rollout contract

- ALCHIMIA copy follows one explicit learning bridge: begin from a familiar situation, name and
  explain the new term where it first matters, demonstrate it concretely, generalize only after
  the example, retrieve the idea briefly, then practise and close with an observable result. A
  term may instead point back to a previous lesson only when that dependency is already true in
  the authored curriculum. Humanization never removes intermediate reasoning, examples,
  distinctions or the final synthesis.
- Archived Change 75 established the approved target profile on `/lab/design-system` and proved
  its reusable header, theme/token boundary and catalog contracts. Change 76 activated only those
  accepted system-level values and reusable boundaries on public routes without copying the
  dashboard composition into production. Archived Change 79 completed the remaining public
  rollout: it mapped accepted Components/Widgets contracts to their real consumers, promoted
  approved defaults through the existing visual dependency direction, reconciled public page and
  lesson compositions, and removed only legacy fallbacks proven unused by browser evidence. The
  resulting production routes do not copy catalog chrome or maintain a parallel component family.
- The supplied `docs/artifacts/references/logo.svg` is the sole artistic authority. The superseded
  `logo_with_transperant_bg.svg` is not a fallback. A derivative may repair delivery sizing/viewBox
  behavior and invert the monochrome mark to white for an explicit dark context, but may not redraw,
  smooth or reinterpret visible geometry. The rejected hero-scale F1 composition is superseded by
  F11's compact reusable header.
- Change 86 replaced the original Athanor typography roles: self-hosted Cormorant SC 600, while
  visually approved for the wordmark, proved too decorative and thin at small-caps display weight
  to read outside a pure wordmark context once carrying every heading level app-wide. The current
  roles are self-hosted Alegreya for the live wordmark and every standard heading level, including
  compact course, practice, prose and dialog headings; Golos Text for continuous reading and for
  controls/labels; JetBrains Mono (ligatures disabled in rendered code) narrowed strictly to code,
  data and formula notation — it no longer covers general "compact service UI", which now uses
  Golos Text like the rest of the interface. Quiet
  numbered lesson-stage landmarks remain a JetBrains Mono/data-role treatment, consistent with
  numeric notation, rather than an ordinary content heading. The profile exposes one achromatic
  primary and one achromatic secondary prose level over the original white background; status
  colors remain semantic rather than decorative.
- Keep the approved white background and monochrome presentation during public activation. Copper
  activation and broader color work require a later explicit checkpoint. The
  architecture-led lab dashboard groups contracts into System, Components and Widgets tabs:
  System owns app-wide identity, typography, palette, layout constraints, accessibility/browser
  behavior, curated semantic tokens, the active icon inventory and content-language rules;
  Components groups public `shared`/`entities`/`features` UI contracts by meaning; Widgets owns
  composed page regions. The System token map demonstrates the supported
  `theme → semantic → component` direction and every role it lists, but deliberately excludes
  internal theme values, syntax-only roles, component aliases and lab-only experimental sizes.
  Its content-language examples document the approved learning-copy bridge without becoming a
  representative lesson or changing authored content. Each panel has a sticky local table of
  contents. Controlled tabs must progressively enhance into one active panel while
  SSR/no-JavaScript renders every panel as an ordinary linear block.
- Running text has one primary and one secondary neutral level. Copper-orange remains inactive;
  any later activation requires an explicit checkpoint and still may not color ordinary
  paragraphs. Semantic feedback remains independent and never becomes decorative palette.
- The active lab does not render the `patterns_lines.png` atlas. Headers, catalog navigation,
  section separators, frames, diagram internals, swatches and interactive controls use standard
  neutral borders; the primary tablist uses only its ordinary active indicator. The atlas remains
  a documentation reference rather than a runtime UI asset.
- Vertical rhythm has five semantic roles: content flow (12px), stage entry (16px), a related
  standalone learning block (24px), concept separation (48px desktop / 32px narrow) and
  major-section separation (64px desktop / 48px narrow). The parent lesson layout owns these external relationships;
  components own only internal geometry. Responsive rules preserve the hierarchy instead of
  reducing every role to one mobile gap.
- Lesson composition, responsive outline behavior and authored lesson copy remained outside
  Changes 75–76. Change 79 completed visual composition and responsive public-consumer migration
  without editing authored copy. Change 80 owns the unified rich-practice content contract;
  Changes 77–78 and 81–84 own the separately approved editorial rollout.

## 7. Fields and validation

- Prevent impossible input where the constraint is obvious, but never show errors on a pristine
  empty form.
- Validate on blur by default; validate on submit when the rule depends on completeness or other
  fields. After submit, focus the first invalid field and keep its message programmatically tied to
  the control.
- Error messages are concrete and remain visible while useful. On narrow screens render them below
  the field; do not use a tooltip that can cover input or instructions.
- Error, disabled, loading and success states remain understandable without color. Preserve the
  user's value after an unsuccessful submission.
- Tabs group peer views within one local task. Do not use them for unrelated primary navigation or
  to hide sequential reading content; before JavaScript enhancement every required panel renders
  as an ordinary linear semantic block.

## 8. Testing and executable policy

- Add focused Vitest coverage for changed pure logic, adapters and component behavior. Browser
  journeys use the project Playwright fixtures and Page Objects and assert user-visible behavior.
- Verify keyboard, focus, disabled/loading/error, narrow-screen, SSR and no-JS states in proportion
  to the changed component family.
- Architecture and lint checks enforce rules that are mechanically decidable: layer direction,
  strict same-layer slice isolation for aliased and relative imports, public APIs, platform
  boundaries, forbidden vendor imports and theme-token isolation.
- Automated green does not approve visual quality or publication. The active change's explicit
  architect checkpoints remain human-owned.

## 9. Migration record

| Former convention | Verdict | Result |
|---|---|---|
| kebab-case, one component per file, `React.FC`, `type`, namespaced props | keep | Sections 2–3 |
| props/hook access, named `*Fx` effects, namespace-style utilities | keep | Section 2 |
| FSD layers, root public APIs, local state and platform/network boundaries | keep | Section 3 |
| CSS Modules, `cssUtils.cx`, `data-*` variants, same-file composition | keep | Section 4 |
| Mantine pin, provider/theme, direct Mantine use and Mantine test wrapper | drop | Replaced by local Base UI/native policy |
| Mantine forwarding exceptions and component-specific style variables | adapt | Generic local-wrapper forwarding and semantic state attributes |
| numeric typography props and appearance-led variants | adapt | Semantic typography/component roles |
| component/unit/E2E testing rules | keep | Section 8 |
| Editorial Rail appearance rules from `DESIGN.md` | drop | Replaced by the theme-isolation contract and active profile |
| Kontur accessibility, adaptivity, typography and validation guidance | adapt | Sections 5–7, narrowed to this product |
