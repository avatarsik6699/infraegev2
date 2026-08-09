# Frontend Conventions

> Binding rules for `apps/web`. Keep this file aligned with the automated checks in
> `apps/web/eslint.config.js` and the stack contract in `docs/STACK.md`.

## 1. Files and components

- Use kebab-case for source file and directory names. Component exports use PascalCase.
- Keep one React component per file. Extract a second component into its own file instead of
  assigning JSX or declaring a nested component in the first component's module.
- Define components as arrow functions typed with `React.FC<Props>`.
- Use `type`, never `interface`. Name file-local component props `Props`; export a more descriptive
  props type only when another file consumes it.

```tsx
type Props = { title: string };

export const TopicHeading: React.FC<Props> = (props) => {
  return <h1>{props.title}</h1>;
};
```

## 2. Access values without destructuring

- Access component props as `props.name`; do not destructure them in the parameter list or body.
- Access object-valued hook results through one named variable. Do not destructure hook results.
- A `useState` tuple is the sole hook-return destructuring exception.

```tsx
const topicRoute = Route.useLoaderData();
const [answer, setAnswer] = useState("");
```

These rules keep call sites searchable and make the owner of each value visible. They apply to
components and custom hooks; ordinary business-logic objects may still be destructured when that
improves clarity.

## 3. Effects

Every `useEffect` callback is a named function whose name ends in `Fx`:

```tsx
useEffect(function persistProgressFx() {
  progressStore.save();
}, [progressStore]);
```

## 4. Module structure

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
boundaries declared in `docs/STACK.md`. Create only the `ui/`, `model/`, `api/`, `lib/`, `hooks/`
or other subdirectories a module actually needs.

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
- Only `shared/config/env.ts` and `shared/config/runtime.ts` may read `import.meta.env`. Consumers
  use their typed exports.
- Keep `__CONTENT_ROOT__` as the build-time Vite constant documented in
  `docs/KNOWN_GOTCHAS.md`; it is intentionally not a runtime env value.

## 7. Types

- Use `type` for object shapes, unions and aliases; do not use `interface`.
- Export only types consumed outside their module.
- Keep content-domain types in `entities/content/model/types.ts`. Do not duplicate an API response
  shape in several consumers.
- `src/routeTree.gen.ts` is generated and exempt from authoring conventions.

## 8. Testing

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
