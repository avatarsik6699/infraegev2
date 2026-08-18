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

- Imports stay inside a layer or point downward. Cross-slice imports use the root `index.ts`; deep
  imports are private. Do not add a generic `ui/` segment.
- Keep route definitions thin. Use TanStack Router typed APIs directly rather than wrapping them in
  generic router hooks.
- Keep transient state in its owning component or slice-local model hook. Use an injected domain
  store only when state must persist or outlive one component. Do not add a global store without a
  demonstrated cross-route owner.
- Browser globals and storage belong to focused `shared/lib` adapters; network access belongs to
  the consuming slice's `api/`; server environment reads belong to `*.server.ts`. Production
  components do not call `window`, `document`, storage, `navigator`, `fetch` or `process` ad hoc.
- Use `shared/lib/safe-json` and `shared/lib/safe-ls` for persisted data. DTO filenames are reserved
  for transport boundaries; domain types belong to the owning entity.

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
- The visual dependency direction is `theme values → semantic tokens → component CSS`. Theme files
  may contain literal palette/font/geometry values; components consume only semantic tokens.
- Public names describe purpose (`primary`, `reading`, `warning`), never the current palette,
  material or “Engineering notebook” profile. Changing the active profile must not require domain,
  API, content or state changes.
- Keep one active light theme in this change. Runtime theme switching and dark mode are out of
  scope. The baseline is neutral monochrome: ink, muted surfaces and borders establish hierarchy;
  chromatic values are reserved for semantic success, warning and error feedback. Syntax tokens
  inside the dedicated dark code surface are the sole presentational exception: their hues aid
  token recognition and must not leak into product hierarchy, controls or public variant names.
- The active profile has two neutral text levels only: primary and secondary. Semantic
  success/warning/error remain separate, while `soft`/`muted`/`faint` aliases must not create
  additional visible gray steps. Syntax colors remain the exception above.
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
  badges and other adopted primitives. Specialized semantic markup remains native for figures,
  diagrams, tables, lists, code and variables.
- `CodeBlock` renders Python tokens synchronously as escaped React text nodes through the exact
  `@speed-highlight/core` grammar. Do not replace this boundary with runtime HTML injection or a
  client-only highlighting pass: readable SSR and no-JavaScript output are part of its contract.

## 5. Responsive and accessible behavior

- Design and verify every changed surface at a narrow mobile width, around its structural
  breakpoint and on wide desktop. Preserve information hierarchy and the primary task rather than
  merely shrinking the desktop composition.
- Content may reflow from rows/columns into a linear order. Do not hide required lesson content on
  small screens. Nothing may overflow the viewport except an explicitly scrollable data/code
  region.
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
  evidence use the data family. Component APIs use semantic text roles rather than raw size names.
- The active typography baseline uses only `500` and `600` in component CSS and the shared
  `--text-*` scale; consumers do not introduce literal sizes or intermediate variable-font weights.
  Semantic heading levels may share an effective size when hierarchy already comes from spacing
  and document structure. Keep readable line measures and enable lining tabular numerals for
  product-wide numeric data. The frozen `/lab/lesson` page-private stylesheet remains a temporary
  migration exception under Change 22's explicit do-not-touch boundary; shared components rendered
  inside it still follow this baseline.
- Avoid decorative uppercase, tracked rubrics and miniature labels. Keep classification text in
  sentence case; uppercase is reserved for compact code/data notation where it materially improves
  scanning.
- Russian interface text uses real Unicode signs, «ёлочки», a true minus sign in arithmetic and
  non-breaking spaces where a value/unit or short semantic group must not split.
- Name fields with a concise noun describing the requested value. Avoid filler such as «ваш» or
  «введите» in labels; put a genuinely useful format constraint in the description instead.
- Avoid all-caps running labels. A compact, tracked uppercase rubric is allowed only when it acts
  as quiet navigation or classification rather than body text.

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
  public APIs, platform boundaries, forbidden vendor imports and theme-token isolation.
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
