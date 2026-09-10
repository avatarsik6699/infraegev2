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
- The active visual authority is the accepted infraege homepage and public catalogs. Shared
  components carry that identity by default; local page CSS composes them without private themes.
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
- Keep one active light theme. Runtime theme switching and a dark page theme are out of scope.
  The infraege baseline uses warm paper, ink, one WCAG-safe muted text level and a restrained orange
  accent. Reference orange belongs to the three-stone mark and selected illustration details; an
  accessible darker orange semantic token owns small accent text, focus rings and functional underlines. Orange
  does not recolor ordinary prose, internal lesson controls, semantic feedback or syntax roles.
  All internal pages and the lab use the same warm-paper theme. Learning and working surfaces may
  use illustrated fields, depth, gradients and internal light effects under §4.1.
- A verified third-party brand mark may retain its official color only when it identifies the
  destination of a real external link. Keep it small, pair it with a text label and do not reuse
  the brand color for surrounding controls or decoration.
- The active profile has two neutral text levels only: primary and secondary. Semantic
  success/information/warning/error remain separate, while `soft`/`muted`/`faint` aliases must not
  create additional visible gray steps. Syntax colors remain the exception above. Informational
  blue is reserved for the single formative `Checkpoint` block, not ordinary prose or decorative
  surfaces.
- Surface depth follows the shared recipes in §4.1, including learning blocks. Preserve clear
  grouping and avoid nesting decorative cards. Functional controls retain their established
  geometry, contrast and state cues; surrounding decoration never becomes feedback.
- Dense is the system default, not a one-off component variant: ordinary interactive controls use
  a shared `40px` height, related buttons and fields align, and compactness comes from internal
  spacing and composition rather than smaller hit targets or miniature text. Larger controls need
  a primary page-level role, following the adopted Kontur Input/Button size guidance.
- Separators are a last grouping signal. Prefer whitespace, alignment and a single ambient fill;
  keep a line only when removing it would make distinct interactive regions, data cells or focus
  boundaries ambiguous.
- Engineering grids, quiet pattern fields and paper material are part of the active visual
  language. Use the shared mechanisms and semantic tokens in §4.1; pages own placement and fades.
- Typography defaults use zero-specificity `:where(...)` selectors so an owning component
  can set a semantic role without depending on route stylesheet insertion order. Do not restore
  high-specificity defaults or solve that cascade with lab-only descendant overrides.
- Shared policy components are mandatory for links, images, typography, page containers, buttons,
  badges and other adopted primitives. Authored inline code and formulas use `Notation`
  (`code`/`formula`) so semantics and the neutral recognition treatment stay consistent.
  Specialized markup remains native for figures, diagrams, tables and lists.
- `ActionLink` owns internal navigational-action states. Its `drawn` hierarchy composes the shared
  SVG primitives into one bright-orange tapered underline and an optional close-set authored arrow in either direction;
  consumers own only route data, copy, scale and placement. `ExternalLink` remains a separate
  semantic boundary for external and new-tab behavior rather than being collapsed into an unsafe
  polymorphic link. Its optional `drawn` hierarchy reuses the same shared underline while keeping
  the library-provided up-right icon and external semantics; visually adjacent instances therefore
  share the accent and transition rhythm without duplicating SVG geometry.
- `CodeBlock` renders Python tokens synchronously as escaped React text nodes through the exact
  `@speed-highlight/core` grammar. Do not replace this boundary with runtime HTML injection or a
  client-only highlighting pass: readable SSR and no-JavaScript output are part of its contract.
  Its visible header names only the language; copy remains a quiet action without a contrasting
  hover surface.
- Topic and Course lessons use a three-column desktop shell: outline, central reading stream and a reserved
  right rail. The right rail may be empty, but central lesson blocks do not move into it merely to
  fill space. Full per-lesson progress with its numeric count, bar and confirmed reset sits below the table of contents; on narrow layouts it returns to normal flow immediately after the outline. The zero-solved status sentence is hidden on all lesson pages; other mastery statuses remain. Its label is a quiet UI caption rather than a content heading. The outline, central
  article and their context labels share one compact responsive column gutter so their content
  edges remain aligned through desktop, intermediate and mobile layouts. Outline groups and their
  children always remain one vertical column; the outline reserves its scrollbar gutter, keeps
  link weight stable between states and truncates overlong labels after two lines instead of
  reflowing them when the active item or internal overflow changes. Reset remains a quiet
  secondary action and uses the shared Base UI alert-dialog boundary so confirmation is modal,
  keyboard contained and returns focus to its trigger.
- Course overviews use the expanded public header with the course section active; no duplicate
  catalog backlink is shown. Desktop uses a wider asymmetric composition with a stronger illustrated course summary and outcomes on
  the left, a generous gutter and an open sequential program on the right; the module spine stays
  attached to that right column. They share the same canvas without a backing
  panel, frame or shadow. Published lesson titles use the shared drawn ActionLink with its owned
  decoration, focus and hover states; each outcome is ordinary secondary text beneath its title.
  Numbered modules form a sequential spine rather than independent cards or collapsed panels.
  A page-owned engineering field, sparse code notation and orange route are anchored to the artwork
  at every breakpoint, away from prose. A faint contact shadow and slow four-pixel artwork drift
  establish illustration depth; a route impulse and soft glint recur with long quiet intervals.
  The whole overview extends the engineering grid into the outer margins and central gutter.
  Below the desktop summary, three low-contrast architectural raster illustrations with transparent
  backgrounds occupy the otherwise empty left field. Their reduced opacity and saturation keep them
  subordinate to the program text; their slow drift and soft sheen add decorative depth
  without new learning content or program backing. Visible module spines receive a faint, narrow
  orange light pass and number rims retain a soft glint, without implying completion or active status.
  Tablet and mobile hide these large illustrations and confine the page grid to outer margins; mobile also
  hides the module spine while retaining number glints. Decorative animations pause offscreen or
  while the document is hidden and stop under reduced motion. SSR/no-JS retains the complete static
  composition without decorative animation.
  Tablet and mobile retain the complete course summary then program; mobile puts course identity
  before the illustration. Artwork stays proportionally bounded before hydration and without JS.
  Course type, stage and published lesson count form one quiet metadata line. CourseLesson pages
  retain independent course context and navigation within the shared lesson reading layout.
- Course pages use the quiet infraege reading world without reusing Topic semantics. A
  course overview presents audience, outcome, the current course stage and one ordered public plan of
  lesson titles plus observable outcomes without a separate evolving-program disclaimer or date
  promise. Only published CourseLesson rows are links; their numeric order stays outside the link
  and the link emphasizes the title over its outcome without a redundant availability label.
  Review/draft or not-yet-authored entries remain visually secondary ordinary text marked «В
  плане», never disabled controls. Module numbering describes the broad sequence, while lesson-plan
  order describes the current authoring direction.
- The `/ege` topic catalog uses the public infraege paper, engineering field and light language.
  A compact title and the topic-count/FIPI metadata line lead directly into the ordered 25-topic
  map covering tasks 1–27 exactly once (19–21 remain one topic). Three/two/one-column layouts
  preserve DOM and focus order. All cards use one media/content/bottom-row template and equal
  grid-row heights with a 23rem minimum and 58:42 media/content tracks. Cards remain
  ordinary single grid cells without row/column spans. Planned cards retain opaque quiet material and a «Скоро» badge,
  without links, hover lift or glints. Every card has very faint fine-grain texture plus alternating
  arc/dot/diagonal engraving inside its clipped SurfaceMaterial.
  Every card reserves its upper 58% for artwork. Topics with an illustration display it;
  the other 23 use the same neutral CustomIcon.Book placeholder. Full source descriptions render as up to two compact lines with an ellipsis; slightly larger headings
  retain a two-line slot. Eight-pixel content gaps keep the lower region readable. Number and planned-status badges overlay the artwork. Titles occupy
  a separate shared two-line slot, aligned at the bottom, and descriptions start at the same level.
  Artwork uses a narrow 8px edge alpha fade, preserving its interior contrast. Published art
  extends at most 12px above and 8px to the sides/bottom of its media track, without moving
  the shared image/title/summary layout or covering text;
  visually truncated descriptions occupy a separate lower region; the aligned bottom row contains
  the published action; planned «Скоро» badges sit beside the task number over the artwork. Artwork has bounded overflow, descriptions use a two-line clamp, and all dimensions work before hydration/no-JS.
  The decorative index remains inside the card. SurfaceGlint(frame) plays once within five seconds
  of first visibility, pauses offscreen/hidden and never restarts after completion. Distributed
  very faint binary bytes, AND gates, graphs, search code, truth tables, recursion trees, powers
  and BFS queues extend the stable background grid as eight distinct compositions. There
  are no vertical orange routes under the cards; broad field illumination varies softly over
  24 seconds, pauses offscreen/hidden and is absent with reduced motion/no-JS.
  The heading's remaining space carries no placeholder controls. No filters, progress, new
  learner state or authored lesson imports are added to this metadata-only catalog.
- The `/courses` catalog extends the public infraege world with a page-specific illustrated
  grid. Its heading groups «Мини-курсы», a short lead and «1 курс доступен · 3 в плане» on
  the left; the supplied perspective staircase and a separate orange SvgDrawing route occupy the
  right with reduced opacity and a downward fade; orange routes remain only below the cards,
  with no central connector or right-side flourish. A visible
  perspective grid and sparse code fragments belong to the page. Supplied WebP illustrations
  render through shared Image with reserved dimensions; a page-owned SVG color-to-alpha filter
  removes their pale paper while preserving colored ink, and composites against SourceGraphic
  to avoid opaque filter bounds. The original reference assets stay unchanged. Excel and algorithms use architect-supplied
  transparent derivatives; their native alpha bypasses the paper-removal filter. Artwork is a
  separate unclipped layer above contour-aligned, clipped card material, with a bounded top/right overflow;
  it never covers course copy or adjacent actions. All four courses receive substantial media
  regions separate from text. Desktop restores the original asymmetric 7/5-column mosaic: Python
  spans two 19rem rows, Advanced problems and algorithms stack to its right, and Excel spans the
  full width with copy left and 55% artwork right in a 24rem-minimum frame. Its status and
  text align to the left inset, text starts 64px below the top, and engraving/dots concentrate left. Medium widths use full-width Python, a planned
  pair and the wide closing card; narrow widths use single-column 26rem-minimum cards in DOM order.
  Artwork fills its region with cover cropping, an 8px edge fade and bounded 8px top/side
  overflow. Metadata and hydrated progress use quiet labels over the artwork; the wide Excel status sits above the left copy. 32px titles and full
  two-line summaries remain separately readable with 8px gaps. Fine grain at 7% opacity, varied patterns at 6.5%, and the original lower-corner arc engravings
  span the clipped material. A subtle silver-neutral gradient and a soft four-second once-only
  activity-aware glint add restrained material sheen, including on planned cards. Python retains its slightly stronger
  frame, interactive lift and one edge glint; planned artwork uses quieter saturation
  and no frame glint. Larger, softer upper stairs and a partial lower-left continuation share one
  diagonal; faint left-side engravings balance the artwork without filling the reading space.
  Image edges fade over a narrow 8px perimeter; Excel uses top-aligned cover sizing in its wide
  region with only minor peripheral cropping. The ordinary drawn action has no backing; progress belongs to the artwork metadata.
  Frame glints and route markers play once within five seconds, pausing offscreen
  or while the document is hidden; there is no animation toggle. Planned cards retain no
  hover lift, pointer affordance or focus stop. Reduced motion renders the completed static
  composition. Published title, summary, route, lesson count and progress inputs derive from
  lightweight Course metadata; planned entries are catalog-only records marked «Скоро» with
  no links, dates, durations, difficulty or lesson counts. Python has one «Открыть курс» link and
  hydration-only «Освоено N из 28 уроков» in its artwork metadata; SSR/no-JS omits only that personal count.
  Search, filters, sorting, recommendations and Topic relationships remain absent.
- A CourseLesson keeps course context and its local section outline together in one navigation
  rail, with the article as the dominant reading stream. On narrow screens the title and outcome
  precede the collapsible «Содержание урока» list (expanded without JavaScript) so a long outline cannot displace the
  lesson identity from the first viewport. Both lesson families end with only the available
  previous and next lesson links aligned left and right in a shared two-column container; these are underlined directional links,
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
  course-wide reset while the program is still developing. The aria-hidden «72%» artwork on
  `/` is a reference illustration rather than a course-progress consumer and does not relax this
  product-state rule.
- A lesson has at most one `Checkpoint`: authored once at `Definition.checkpoint`, gathering every
  formative disclosure question for the whole lesson, and rendered inside the «Итоги» (`result`)
  section, after the result copy — never per `ConceptBlock` and never as its own step before
  practice. Keep each question short, sequential in SSR/no-JS, and visually contained; distinguish
  the block with one question icon and a matching informational heading label. There is exactly one
  `Checkpoint` block per lesson by construction, so the "merge adjacent blocks" concern this rule
  used to guard against no longer applies — there is nothing left to merge.
- `Mistake`, `Checkpoint` and `WorkedExample` share one visual contract: a single quiet
  semantic-tinted fill (no border, no divider line) with `--radius-surface` rounding, service-label
  type, icon size and text-column inset. This is the currently installed lesson baseline; expressive
  variants may be adopted through §4.1. `Mistake` and `WorkedExample` share one compact outer padding value
  (routed through the same `--learning-panel-padding`-style override token); `Checkpoint`
  intentionally uses more vertical padding (Change 88 F12 architect finding) because its content
  otherwise presses against its tinted background's top/bottom edge. `Mistake` presents its authored
  claim and explanation as one vertical «Неверно» / «Как правильно» comparison at every viewport
  width; each reading gets its own tinted background (danger for «Неверно», success for «Как
  правильно») instead of a rule between them — color is always duplicated by the distinct icons and
  labels. Because this is static instructional content rather than a runtime event, `Mistake`
  remains an `aside` instead of an alert. `Checkpoint` uses the informational tint;
  `WorkedExample` uses the neutral accent-tonal fill, since it is not a semantic alert.
  `WorkedExample` treats «Разберём на примере» as restrained reading context, not a
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
  approved three-path infraege source geometry while the square favicon viewport adds only delivery
  whitespace and never redraws the mark. In dark browser chrome only the two ink stones may switch
  to white; the orange stone remains orange. `/` alone owns the truthful `WebSite` JSON-LD site-name declaration.
  Generated favicon/touch/manifest assets satisfy
  `docs/BRAND_ASSET_REQUIREMENTS.md`. Do not add Organization/Person structured data without a
  separately confirmed real-world identity. `/robots.txt` and `/sitemap.xml` are server routes,
  not copied static lists that can drift from publication state.
- Public pages remain complete in SSR/no-JavaScript output and link to the current data-processing
  disclosure. Legal copy describes only behavior present in code/configuration, publishes the
  architect-approved email and Telegram invitation without exposing other personal requisites, and
  keeps the accepted legal-review risk explicit in the system contract.
- The public home uses an editorial split with a strong product statement and the real Python
  mini-course CTA on the left, and the non-interactive learning map on the right. The two columns
  never overlap; desktop bounds the scene by the available viewport height after public chrome,
  with compact typography on short screens. Below 60rem the statement precedes a width-led scene. Below 44rem one SVG canvas recomposes
  its existing cards and stages into a taller alternating route with enlarged content, rather
  than shrinking the desktop constellation. CSS selects supplemental compact connector geometry
  and relocates the same card/stage nodes before hydration; there is only one accessible summary.
  The authored wide and compact paths do not cross. Both preserve the theory/practice/tasks/
  future-statistics meaning, the four satellite cards and the practice-to-theory return loop.
  Background notation stays subordinate and outside prose; patterns move to available gaps on
  compact layouts. A full-page perspective grid fades toward the header/footer and behind prose;
  code, binary cells and graph notation occupy outer fields on both sides. Two edge-owned orange
  light paths traverse the page on a quiet 22-second cycle.
  A single 12-second choreography begins after hydration: main-path impulses travel in order
  during seconds 0–4, branches and contour light answer during seconds 4–7, then rest until the
  next cycle. Static orange curves remain complete throughout. There is no counterflow on the
  main path and no moving pattern branches. Card and completed-stage contour light stays neutral;
  active-stage/progress borders retain orange. Enlarged satellite cards use distinct 5–15 SVG-unit drifts and phase offsets
  to distinguish depth while their attached shafts deform and arrowheads follow in the same phase. CSS path
  interpolation support gates both drift halves; unsupported engines retain static geometry.
  Cards retain modest differences in their authored dimensions and original in-plane rotations,
  without perspective deformation, distance scaling or blur. Satellite cards use a quiet flat canvas fill and thin neutral outline, without
  drop shadows, thickness or static edge highlights. Compact 282–290 by 108–116-unit surfaces
  contain vertically centered 88-unit icons at x=12 and text at x=112. The 12-unit icon/text gap
  preserves readable copy while reducing padding. Compact layouts keep satellite
  offsets static. Main-route stages, their text and the progress disc remain stationary throughout
  the animation cycle; no shared foreground transform moves them. Only satellite cards drift, with
  coordinated branch attachment motion. The distant pattern plane retains its bounded 18-second drift. Material patterns vary by subject: theory uses concentric arcs, practice dots, tasks a small woven-loop motif and statistics quiet curved contours. Numbered stages reuse their subject
  motif with lower contrast. Their large data-role numbers and display titles retain independent
  number/title/check spacing. Very faint deterministic paper fibers cover cards and stages. The progress disc has no
  decorative texture or engraving. The 40-unit stage numerals and 24-unit titles remain inside the rounded
  contour; completed stages use vertically centered 24-unit checks.
  The illustrative progress uses one paper disc with its neutral track and orange arc on the outer
  perimeter and one centered 40-unit orange «72%» value without a caption; no backing disc protrudes beyond the arc. All animation definitions stay mounted and change
  play state for offscreen/hidden pause and resume, without restarting the choreography.
  Reduced motion and SSR/no-JS retain the complete static map. Decorations carry no state; literal
  «72%» remains inside the aria-hidden illustration and never becomes learner progress.
  The statement «Информатика - это система» leads into a concrete preparation explanation and
  one standard drawn-arrow «Начать готовиться» link to `/ege`; there is no extra slogan. The ambient
  field begins/ends at the chrome-owned region and fades to zero at both boundaries.
  Paper gradients, contact shadows and edge light extend the courses' material language. The SVG
  scene alone may use the established thin contour plus paper shadow. Map geometry and resource
  composition stay page-owned; SvgDrawing owns strokes/fades/arrows, SvgPattern owns deterministic
  masked presets and grid mechanics, and CustomIcon preserves the approved glyph geometry.
  Decorative overflow is contained by the map boundary and never enlarges the document canvas.
  No synthetic social proof, duplicate catalogs or raster replacement of the SVG map is introduced.
- A shared back-navigation link always renders a real fallback `href` for SSR/no-JavaScript and
  modified-click behavior. After hydration it follows TanStack Router history only when the
  router-owned history index says an in-app entry exists; direct entry, document reload and
  external-origin arrival use the explicit fallback route instead of leaving the application.
- Public headers share one quiet identity: the approved three-stone infraege mark and lowercase
  Alegreya wordmark stay grouped at the left without release/version badges. The expanded `/`
  lockup uses Golos Text for its subtitle and «просто • понятно • бесплатно» benefit line, separated
  from navigation by an intentionally faint rule; compact internal headers retain the same ordinary
  Golos Text subtitle without the benefit line. The mark is decorative beside the accessible live
  site name rather than its replacement. Header and footer
  contents follow one viewport-relative gutter instead of contracting inside a centered max-width shell.
  Outside the home page the wordmark is the route back home. On `/`, the expanded reference-led
  navigation exposes only real destinations as links; unavailable sections are secondary,
  non-interactive text without status labels, and account placeholders are absent. Narrow viewports
  use a native disclosure menu.
  Optional analytics first appears only after hydration as a fixed full-width bottom prompt that
  overlays rather than shifts content; after a choice, its only persistent control lives in the
  «Ваш выбор» section on `/privacy`, not in the header. Public footers expose the privacy route and
  the shared Telegram invitation with a text label and the official brand mark. Published pages do
  not duplicate this chrome with page-private header markup. The shared public header has no
  bottom rule; spacing separates it from page content and the quiet lesson context bar.
  Topic and Course lesson navigation and reading restore structural rules as specified in Change 105 below.
  The public footer uses whitespace rather than a top rule and contains only useful navigation,
  without repeating the infraege name. The live lab uses the same public chrome.

## 4.1 Reusable infraege visual language

**Default for new work:** start from `/courses` and `/courses/python` and the live
`/lab/design-system` → Система → Визуальный язык specimens. Apply their expressive language to
catalogs, overviews, learning blocks and working screens without asking the architect to restate
it. Existing published lessons keep their installed composition until their own scoped adoption.
The lab's learning/form compositions are adoption examples, not a claim that lessons were migrated.

### Composition recipes

| Role | Default composition | Shared owners |
|---|---|---|
| Catalog | Substantial media separate from copy/action; neutral paper, thin gradient edge, contact depth; one stronger available item | `SurfaceMaterial`, `paperSurface`, `SurfaceGlint(frame/sweep)`, `Image`, `ActionLink` |
| Overview | Open asymmetric summary/program, field in margins and gutter, restrained illustration depth and recurring light | `SvgPattern.Grid/Preset`, `SvgDrawing`, `artworkDrift`, `SurfaceGlint(soft)` |
| Learning block | Unframed study examples and practice with restrained matte semantic fills; no paper gradient, shadow or glint | Existing learning components and scoped study palette |
| Working form | Same material language around usable controls; visible labels, focus and feedback; hide internal glint while input has focus | `Field`, `Button`, shared material/light layers |

- Keep the current fonts and two neutral text levels. Establish hierarchy through media/copy
  separation, alignment, whitespace and scale before adding decoration. Orange remains an
  illustration/navigation accent, never an invented answer, progress or availability state.
- Compose layers explicitly: ambient field → clipped paper material/pattern → artwork → content
  and actions. Only the artwork may cross the top/right boundary by a few pixels. Clip material
  and light to the surface contour; preserve the focus ring and the independent action area.
- Use `--surface-paper-*` for the mini-course material, `--surface-quiet-*` for subordinate
  surfaces, and `--surface-accent-*` for an emphasized available destination. `paperSurface` is a
  CSS Modules `composes` recipe for an owning semantic element; `SurfaceMaterial` supplies its
  absolute, aria-hidden layer when artwork needs separate clipping. Its parent owns relative
  positioning, isolation, radius and layout. Neither API knows courses or publication state.
- Planned entries stay opaque and noninteractive, with the existing «Скоро» badge, quieter
  artwork/material and no hover lift, frame glint, link or focus stop. A public entry uses an
  ordinary typed `ActionLink`, never a click handler on the whole decorative surface.
- `SvgPattern.Grid` owns unique SSR-stable pattern IDs, cell dimensions, transform, bounds,
  optional node and directional fade. Bounds accept numeric dimensions or SVG percentages.
  `Preset` owns authored strokes/labels/nodes; `SvgDrawing` owns route strokes and gradients.
  Subject matter, path data, viewBox, raster assets, responsive positioning and masks remain local.
  The homepage map stays an authored SVG scene; it is not replaced by a generic page/card engine.
- No effect carries information. Decorative wrappers use `aria-hidden` and `pointer-events: none`;
  SVG canvases are nonfocusable. Image dimensions reserve geometry in SSR, with readable content
  and usable navigation even if an image fails.

### Motion and reading

- Call `useElementActivity(ref)` on a stable mounted element. It starts false during SSR and first
  hydration, observes visibility through the platform adapter and unsubscribes on unmount. Observe
  individual cards/illustrations when they can leave the viewport independently.
- `SurfaceGlint` takes `kind="frame" | "sweep" | "soft"`, `active` and
  `playback="once" | "loop"` (default `once`). Frame defaults to the catalog's 3.2-second pass;
  sweep to the topic card's 9-second cycle; soft to the overview's 14-second cycle. Override only
  rhythm/placement via documented `--glint-duration`, `--glint-delay`, `--glint-easing` and
  `--glint-light` variables. Study light/drift uses `--surface-study-duration` (18 seconds).
- Keep animation definitions mounted and change play state to pause/resume; do not re-key elements
  or restart completed once-only effects on scrolling. `artworkDrift` is the shared bounded
  four-pixel drift recipe; its parent supplies `data-motion-active` and optional `--drift-duration`.
- Shared effects animate only under `prefers-reduced-motion: no-preference`. Static materials,
  artwork and complete route strokes remain without JS/reduced motion. Preserve the storefronts'
  accepted cadences: catalog effects finish within five seconds; overview light has long quiet
  intervals; the homepage's coordinated routes retain their own choreography.
- Expressive learning surfaces may have internal gradient, depth and glints. Keep glints below
  content, preserve text contrast (4.5:1 body, 3:1 large), readable syntax and text selection, and
  hide internal form light on `:focus-within`. Error/success labels and icons remain independent
  of material; decoration neither intercepts input nor implies mastery. Do not automatically wrap
  every paragraph in a separate surface.
- At narrow widths, preserve semantic DOM order and bounded images. Simplify large peripheral
  illustrations and confine fields to available space; never hide learning content. Verify mobile,
  the structural breakpoint, desktop and 200% zoom for each new composition.

### Adoption and evidence

Before implementation, record the specimen, primitives, local composition and intentional
exceptions in the active change's task plan. Build from existing examples instead of copying their
private CSS into a new page. Add genuinely reusable new behavior to the owning primitive and lab
in that same change. Compare the result to the chosen specimen in the browser, including keyboard,
input/error states, image failure, no-JS, reduced motion and offscreen activity where applicable.
Document reference coordinates are examples, not mandatory identical layouts. Automated checks
prove mechanics; the architect owns visual approval. Do not create a competing DESIGN.md contract.

### Change 105: lesson reading presentation

The approved target restores functional `1px --color-rule` separators under lesson context and
between the desktop outline and article, continuing through the footer row to the page bottom; narrow navigation uses a bottom rule. All lessons and the lesson lab use the expanded shared public header with the corresponding topics or courses section active and the same PublicFooter as the catalog. The outer shared page frame sizes header, context, content and footer naturally, without a hardcoded header-height subtraction. Shared header section links wrap within their available width when text is enlarged. This lesson-specific composition preserves the shared public header/footer.
Title and summary precede mobile contents on all lesson pages and in the lab. Enhanced mobile contents
collapse under «Содержание урока»; selecting an ordinary anchor closes the list and focuses its
target after layout settles. SSR/no-JS retains the complete list. Desktop contents remain open.
Study outline rows use real, non-overlapping 32px minimum targets for mouse and 40px whenever `(any-pointer: coarse)` matches, including hybrid devices. Groups use 4px gaps, children zero gaps and 12px indentation; weights are 500/400 at existing 14/13px sizes.

Study introductions use the existing larger heading role and one quiet metadata line. Study examples and procedures have no panel fill or outer padding; authored steps and the existing related-block rhythm provide grouping. Examples, procedures, mistake comparisons, checkpoints and code share the 40rem reading measure; practice has no outer material, shadow or extra padding. Code retains its functional dark surface. Procedures, semantic mistake comparisons and the single result
checkpoint preserve their existing semantics. The full progress bar accompanies navigation;
reading progress never means mastery. Practice exposes the active task position after hydration.

All TopicLesson and CourseLesson pages and the lab select `presentation="study"`. Their shared study palette supplies consistent learning colors; authored nodes remain unchanged.
`/lab/lesson` demonstrates the complete journey, and `/lab/design-system` uses the same shared
worked example. The architect approved all-lesson adoption in Change 105 F23, extending the initial F5 Topic rollout. Lesson navigation contains the full progress and confirmed reset; there is no duplicate progress in the result section. The
accepted typography, publication registries, authored content and persistence are unchanged.

The scoped study palette uses secondary ink #605e59 for readable captions on stronger fills, danger #99453f, success #48634b and info #3e5e76;
semantic fills mix 14% of the corresponding standard status color into 86% page background in sRGB, retaining the darker muted learning inks for labels. Examples and procedures remain transparent. Notation uses
6% primary ink into the page, 0.2em horizontal padding and 2px corners; nested notation
in Mistake/Checkpoint mixes 8% matching learning ink into the block background. Neutral study callouts mix 5% primary ink into their quiet surface. Formula/code text stays primary ink, with no additional border or shadow. Non-study consumers retain existing defaults.
Practice theory links use the shared FragmentLink drawn variant: decorative underline and orange link icon, preserving native fragment navigation. Previous/next navigation in Topic and Course lessons uses ActionLink drawn with the corresponding shared back/forward arrow. Their shared two-column navigation places previous on the left and next on the right, including when only one link exists; long titles wrap within their column. Outline links retain their plain variant.
`LessonProgress.hideEmptyStatus` is opt-in and hides only the zero-solved sentence.

## 5. Responsive and accessible behavior

- Design and verify every changed surface at a narrow mobile width, around its structural
  breakpoint and on wide desktop. Preserve information hierarchy and the primary task rather than
  merely shrinking the desktop composition.
- Content may reflow from rows/columns into a linear order. Do not hide required lesson content on
  small screens. Nothing may overflow the viewport except an explicitly scrollable data/code
  region.
- Page and nested scroll regions use a system-wide 6px neutral, square-ended scrollbar where WebKit pseudos are supported, with no arrow buttons and a transparent track. Standard scrollbar properties must be auto in that branch; Firefox uses the standard thin/color fallback with native geometry. Resting scrollbars are deliberately quiet: light thumb/hover colors are #e4e1dc/#d2cec7, dark-code colors #2d2d2d/#414141. They are persistent but visually subordinate; hover strengthens visibility. Forced-colors restores system widths and colors.
  A sticky navigation rail stays in normal flow at responsive breakpoints and scrolls internally
  only when its content cannot fit in the viewport.
- Interactive targets are at least `40 × 40px`; compact visuals may use a larger invisible hit
  area. Dense styling never overrides this floor except the explicitly approved study outline: 32px real mouse targets, 40px on any touch-capable device, without overlapping pseudo targets. Essential actions and information cannot depend
  on hover. `LessonOutline`'s group/child links are the one architect-approved exception (Change
  91): the visible row is `--space-4` (32px) for a denser reading TOC, while an absolutely
  positioned `::after` pseudo-element extends the actual clickable/accessible hit area back to the
  `40px` floor. Legacy non-study specimens retain that exception; all lesson pages use the separate study 32/40px contract above. Every other control keeps the ordinary visible `40×40px` floor unchanged.
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
- Public surfaces preload the small active self-hosted font set and use `font-display: swap` so
  the real display, reading and service faces replace their fallback instead of leaving a first
  visit on heavier system typography. Display, reading and service fallbacks are metric-adjusted,
  while every active font subset is explicitly preloaded. Structural lesson columns use the stable
  `--measure-lesson` rem cap, not a font-relative `ch` width that changes while the reading face
  becomes available. `/fonts/`
  receives a bounded reusable production cache policy rather than immutable caching while some
  filenames remain unversioned. Do not reintroduce network webfonts or alter loading behavior
  without before/after cold-cache evidence that preserves stable text geometry and the
  public-route LCP budget.
- The active typography baseline uses only `400`, `500` and `600` in component CSS and the shared
  `--text-*` scale. Regular `400` is reserved for quiet Golos Text leads, navigation and links where
  `500` competes with the surrounding hierarchy. One role-specific cap remains: display/heading text (`var(--font-display)`, Alegreya) never exceeds `500` — `600` at display weight reads too
  heavy — while `--font-ui`/`--font-data` (Golos Text/JetBrains Mono) may still use `600`. Consumers
  do not introduce literal sizes or intermediate variable-font weights.
  Semantic heading levels may share an effective size when hierarchy already comes from spacing
  and document structure. Keep readable line measures and enable lining tabular numerals for
  product-wide numeric data. Page-private visual experiments may add semantic `--text-*` tokens
  but not literal component sizes or intermediate variable-font weights.
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

### 6.1 infraege identity and live design-system lab

- Learning copy follows one explicit bridge: begin from a familiar situation, name and
  explain the new term where it first matters, demonstrate it concretely, generalize only after
  the example, retrieve the idea briefly, then practise and close with an observable result. A
  term may instead point back to a previous lesson only when that dependency is already true in
  the authored curriculum. Humanization never removes intermediate reasoning, examples,
  distinctions or the final synthesis.
- Archived Change 75 established the historical ALCHIMIA profile on `/lab/design-system` and proved
  its reusable header, theme/token boundary and catalog contracts. Change 76 activated only those
  accepted system-level values and reusable boundaries on public routes without copying the
  dashboard composition into production. Archived Change 79 completed the remaining public
  rollout: it mapped accepted Components/Widgets contracts to their real consumers, promoted
  approved defaults through the existing visual dependency direction, reconciled public page and
  lesson compositions, and removed only legacy fallbacks proven unused by browser evidence. The
  resulting production routes do not copy catalog chrome or maintain a parallel component family.
- `docs/artifacts/references/infraege-mark.svg` is the active artistic authority for the public mark;
  `base.jpg` and `main-page.png` define its current application direction. The mark has exactly three
  paths, no text or baseline, and uses orange only for the top stone. Derivatives may add delivery
  whitespace and, for dark browser chrome, invert only ink stones. The former ALCHIMIA source remains
  archived design evidence and is not a runtime fallback.
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
  primary and one secondary prose level; status colors remain semantic rather than decorative.
- Change 101 retires the private lab theme and activates the same infraege foundation on every
  interface. Historical design evidence stays in archived changes and artifacts, never in runtime
  token aliases or a second importable component family. The
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
- Running text has one primary and one secondary neutral level. Orange remains a sparse identity and
  illustration signal and may not color ordinary paragraphs. Semantic feedback remains independent
  and never becomes decorative palette.
- The lab's `catalog-contracts.ts` names each public UI contract, its live or contextual example
  and its purpose. Public UI barrels use explicit named re-exports (including aliases); wildcard, namespace and inline runtime exports are rejected to keep coverage enumerable. Architecture checks parse these exports with TypeScript, ignoring comments and type-only declarations; browser tests verify named
  contracts and real states, not a fixed catalog count. New public UI exports require an entry and
  an actual example or an explicit context pointer. Private children remain inside parent examples.
  Consent examples use the real presentational notice with local callbacks, never the global consent
  actions. Lab progress uses its own lesson ids. Component CSS cannot consume `--theme-*` or
  redeclare global color/font/control/input tokens; the architecture gate rejects both directions.
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

### Auxiliary document states

- PublicHeader defaults to expanded chrome, including privacy and application fallback pages.
  RouteStateFrame composes that header, the shared main measure and PublicFooter. StatusScene
  owns only the reusable illustration/text/action arrangement; it does not own navigation or retry.
- Auxiliary compositions follow the six `new_pages` references. Huge outlined Alegreya numerals
  occupy the background (404/502 center-right, 503/504 left), while filled headings and actions
  have their own readable area. Code scenes contain no cards or foreground figures.
  Low-contrast peripheral SVG arcs, ticks and dots supplement the shared grid across all states.
  A narrow masked glint follows numeral outlines without filling them. App decoration moves
  slowly only while visible; reduced-motion and forced-colors disable decorative animation.
  Autonomous server documents keep their decoration static.
- Private status cards reuse CustomIcon Book/Checklist/Braces/BarChart, matching the homepage.
  Loader errors group four cards around a short interrupted route; pending retains its two cards.
- Pending uses a dense shared grid for outline, article, status/subtitle/dots, formula, table and
  code. Outline groups stay compact and top-aligned, with fixed gaps independent of scene height.
  Status is a real grid row, never an absolute overlay. Mobile retains status, article and
  code. Neutral skeleton shimmer has a two-second cycle, dots a soft sequential pulse; the
  element-activity boundary pauses both offscreen/hidden. Reduced motion and SSR/no-JS are static.
  Decorative content stays aria-hidden, with no fake percentage or interactive skeleton controls.
- Recovery actions use quiet buttons with a refresh icon; navigation retains drawn links.
  404 has only one scene action, home. Autonomous document reload is a native current-document link
  styled as the same quiet refresh control, preserving no-JavaScript operation.
- App-owned PageBackground supplies one quiet SVG grid with shared color and fade, behind every
  route. Local page grids are removed; illustration-local grids and subject notation remain.
  The background fades behind reading and chrome and disappears in forced-colors. Static server
  pages use the equivalent local SVG geometry without an application dependency.
- Lesson navigation has a 32–64px column gutter and stacks below a 36rem container width, keeping
  previous left and next right. Privacy uses quiet consent controls and drawn external links.
- Pending retains router delays (250ms display, 300ms minimum) and the 150ms navigation-progress
  threshold. One live status announces loading; skeletons and images stay outside the accessible tree.
- AppDocumentHead is the single owner of title/robots overrides for missing and failed route matches;
  recovery restores normal route metadata. Render-only boundaries retain the route's identity.
  Loader retries invalidate the router; render retries reset the boundary; missing module retries
  explicitly reload through the shared document-recovery adapter. A component stack alone does
  not distinguish loader failure from render failure. Generic fetch failures are not chunk failures.
- EmptyState uses spacing, without an enclosing card. Empty lesson practice is explicit; technical
  check failures preserve the answer and announce a local alert without marking the answer invalid.
  Decorative image failures remain silent; informative images preserve their textual alternative.
- Nginx 502/503/504 documents are the deliberate autonomous HTML/CSS exception: no app runtime,
  external assets or JavaScript. The Nginx image contains local fonts, brand mark and local SVG background patterns.
  Document GET/HEAD failures retain their status, no-store/noindex and security headers. API, health,
  server functions, resources, other methods and application 404/500 responses are not replaced.
  `scripts/tests/auxiliary-pages.test.sh` verifies failure isolation; `--preview` keeps only its own
  isolated test server alive for visual review and cleans it on Enter/exit.
