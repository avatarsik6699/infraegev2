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

## 4. Minimal visual profile

Change 122 supersedes decorative scenes and lab-first review. Visual reference: production
`a5b0bf5`, with current infraege identity. White canvas, ink, neutral controls, text lists,
restrained separators and readable line lengths. Keep Alegreya display, Golos Text UI/reading,
JetBrains Mono code; font fallbacks and stable loading remain. Orange identifies the stone
brand, keyboard focus and small functional accents. Semantic feedback and syntax remain legible.
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
answer drafts and custom catalog-row restoration. Return links carry filters and numbered page.
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
