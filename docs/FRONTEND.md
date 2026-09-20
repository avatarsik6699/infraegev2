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
Course/topic domains stay independent. API owns tasks/checking; frontend owns transient input
and browser learning progress. Keep known progress keys/counters compatible. Remove persisted
answer drafts and custom catalog-row restoration. Catalog task forms preserve transient input
and help state while collapsed, until the selection/page changes or the page is left/reloaded.
Bulk disclosure belongs to the current result list: expand loads every visible-page statement into
the document for browser find; collapse retains mounted forms and drafts. Individual toggles remain
independent, and changing the selection/page resets disclosure. Hide bulk actions without scripting.
Hidden forms never steal focus; stale refresh preserves input and updates the checked revision. Return links carry filters and numbered page.
Distinguish wrong answers, missing data, stale tasks and service failure; retain entered input
on service failure. Help disclosure never marks a task solved. No analytics/client telemetry.
Keep shared modal reset confirmation, keyboard navigation and focus return.

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
(transparent) and destructive (danger, only destructive confirmations). Buttons never underline.
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
