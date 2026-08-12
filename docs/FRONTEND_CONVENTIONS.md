# Frontend Conventions

> Binding rules for `apps/web`. Keep this file aligned with the automated checks in
> `apps/web/eslint.config.js` and the stack contract in `docs/STACK.md`.

## 1. Files and components

- Use kebab-case for source file and directory names. Component exports use PascalCase.
- Keep one React component per file. Extract a second component into its own file instead of
  assigning JSX or declaring a nested component in the first component's module.
- Define components as arrow functions typed with `React.FC<Props>`.
- Use `type`, never `interface`. Every slice root keeps props in `root-component.types.ts` under a
  root-qualified namespace; nested components do so only for non-trivial or cross-file types.

```tsx
export namespace ExamplePageTypes {
  export type Props = { title: string };
}

export const ExamplePage: React.FC<ExamplePageTypes.Props> = (props) => {
  return <h1>{props.title}</h1>;
};
```

## 2. Access values without destructuring

- Access component props as `props.name`; do not destructure them in the parameter list or body.
- Access object-valued hook results through one named variable. Do not destructure hook results.
- A `useState` tuple is the sole hook-return destructuring exception.

```tsx
const routeData = Route.useLoaderData();
const [value, setValue] = useState("");
```

These rules keep call sites searchable and make the owner of each value visible. They apply to
components and custom hooks; ordinary business-logic objects may still be destructured when that
improves clarity.

## 3. Effects

Every `useEffect` callback is a named function whose name ends in `Fx`:

```tsx
useEffect(function persistStateFx() {
  stateStore.save();
}, [stateStore]);
```

## 4. Module structure and public APIs

Keep the FSD-like layers established for this project; do not replace them with a route-local
folder convention:

```text
routes/    framework-owned route definitions, loaders and metadata
pages/     route-level composition
widgets/   reusable composite page chrome
features/  user-facing capabilities
entities/  reusable domain concepts
shared/    domain-agnostic config, helpers and styles
```

Imports may only point within the same layer or downward in this list. ESLint enforces the exact
boundaries declared in `docs/STACK.md`.

```text
slice/
├── index.ts                       # the only cross-slice public API
├── root-component.tsx
├── root-component.types.ts       # RootComponentTypes namespace
├── root-component.module.css      # only when local styles exist
├── api/ | model/ | lib/           # retain only meaningful segments
└── components/                    # private composition
```

- Do not create an extra `ui/` segment. Existing `api/`, `model/`, and `lib/` segments remain
  valid and should not be flattened merely for symmetry.
- Cross-slice imports target the slice directory and resolve through `index.ts`; deep imports are
  forbidden by ESLint. Use relative imports inside a slice.
- A private child stays a single file under `components/` while simple. Give it its own recursive
  directory only when it owns types, styles, utilities, or child components.
- Promote a component to a lower reusable slice only after real cross-slice reuse appears. Do not
  create shared abstractions from hypothetical future reuse.
- Capability meaning is more important than matching the directory name to its root component.

## 5. Routing

Use TanStack Router's typed route APIs directly (`Route.useLoaderData`, `Route.useParams`,
`Route.useSearch`, `useNavigate`, and `Link`). Do not introduce `useRouter` or
`useTypedSearchParams` wrappers.

TanStack Router already derives precise types from the route tree. A generic wrapper would hide
route-specific types and reduce, rather than improve, type safety. Route files remain thin and in
the framework-fixed `src/routes/` location. Route component callbacks may retain the plain function
shape expected by TanStack Router and are exempt from the `React.FC` ESLint rule; page components
rendered by those callbacks are not exempt.

## 6. Storage, JSON and environment

- Never access `window.localStorage` directly outside `shared/lib/safe-ls`; use the versioned,
  SSR-safe `safeLs` API.
- Use `shared/lib/safe-json` for persisted JSON. `JSON.stringify` is allowed for an HTTP request
  body because that is transport serialization, not storage.
- Only `shared/config/client-env.ts` and explicitly named `*.server.ts` modules may read
  environment values. Consumers use their typed exports.

## 7. Types

- Use `type` for object shapes, unions and aliases; do not use `interface`.
- Literal namespaces are allowed only in `*.types.ts` and qualify ownership, for example
  `ExamplePageTypes.Props`. ESLint continues to reject namespaces everywhere else.
- Group module helpers and constants in root-prefixed objects such as `examplePageUtils` and
  `examplePageConstants`; keep helpers pure and do not create empty placeholder files.
- Use `*.dto.ts` only for transport/API boundary shapes, never as a synonym for component props.
- Export only types consumed outside their module.
- Future domain types belong to their owning entity. Do not duplicate an API response shape in
  several consumers.
- `src/routeTree.gen.ts` is generated and exempt from authoring conventions.

## 8. Styling and Mantine

- Every adopted `@mantine/*` package is pinned to exact version `9.5.1`; version ranges and mixed
  Mantine versions are forbidden.
- `shared/config/mantine-theme.ts` owns global Mantine theme values and component defaults.
  Project CSS variables alias those theme values where native semantic renderers need them.
- Use CSS Modules for local static styles. Do not create `*.styles.ts` objects for static CSS;
  use Mantine style props only for genuinely dynamic values.
- Shared policy components are mandatory for `ExternalLink`, `Image`, `Typography`, and
  `PageContainer`. ESLint forbids raw `<a>`/`<img>` and direct Mantine
  `Anchor/Image/Text/Title/Container` outside shared. TanStack Router `Link` remains the internal
  navigation primitive.
- Other Mantine components may be used directly. Do not wrap a component solely to rename it.
- Keep specialized semantic markup native when it carries meaning Mantine must not obscure:
  diagrams, tables, figures, code/pre, details, and lists.

## 9. Testing

- New or changed pure logic, storage behavior and API-client behavior receives a focused Vitest
  test under `apps/web/tests/` using `*.test.ts` or `*.test.tsx`.
- New or changed browser journeys receive a Playwright spec under `apps/web/e2e/`.
- E2E specs use Page Object Model classes from `apps/web/e2e/pages/*.page.ts`.
- Prefer user-visible locators such as `getByRole` and `getByText`; do not add CSS selectors or
  `data-testid` solely for tests.
- Playwright runs the single Chromium project against the locally served frontend and backend.
- Unit and e2e tests run only in the developer's local environment: never in Docker and never in
  CI. The durable policy and gate commands live in `docs/STACK.md`.
- Test observable behavior rather than implementation details. Stub network/global boundaries and
  restore them after each unit test; do not make live network calls from unit tests.
- Render Mantine-based units through `tests/render.tsx` so they receive the production theme and
  the test-safe provider environment.
