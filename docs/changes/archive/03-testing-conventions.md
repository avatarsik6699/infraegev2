# CHANGE 03 — Testing Infrastructure & Coding Conventions

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `03` |
| Slug | `testing-conventions` |
| Title | Testing Infrastructure & Coding Conventions |
| Status | `active` |
| Branch | `feature/03-testing-conventions` |

---

## Goal

Establish binding frontend coding conventions (`docs/FRONTEND_CONVENTIONS.md`, adapted from the
architect's own reference project rather than copied verbatim) and retrofit all existing frontend
code to comply; set up Playwright e2e (Chromium only, Page Object Model) against the locally-served
stack; and make explicit, in `docs/STACK.md`, that unit and e2e tests run **only locally** in the
developer's own environment — never in Docker, never in CI, even once a CI pipeline exists for
other checks. No product/contract change.

---

## Design References

<!-- none provided -->

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Frontend
- [x] `F1` Write `docs/FRONTEND_CONVENTIONS.md`, adapted from
  `/home/niquetamerewsl/projects/patient_tracker/docs/FRONTEND_CONVENTIONS.md` for our actual
  stack: component authoring (one-component-per-file, `React.FC<Props>` arrow functions, `type`
  never `interface`, no prop/hook-return destructuring except `useState` tuples, `useEffect`
  callbacks named with an `Fx` suffix), module structure (our existing FSD layers from change 02 —
  KEEP, do not replace with the reference's routes/-based structure), storage/env (our existing
  `shared/lib/safe-ls`/`safe-json`, `shared/config/env`/`runtime` — already-adopted, just
  documented here as mandatory), routing (TanStack Router's own typed hooks used directly — no
  `useRouter()`/`useTypedSearchParams()` wrapper, with the reasoning from change 02 restated:
  TanStack Router is already fully typed, wrapping it would reduce type safety), testing (see `F4`)
  — _Depends on:_ —
- [x] `F2` ESLint automation for what's mechanically enforceable: add
  `@typescript-eslint/consistent-type-definitions: ["error", "type"]`; add `eslint-plugin-react`
  for its `function-component-definition` rule (`namedComponents: "arrow-function"`) — _Depends
  on:_ `F1`
- [x] `F3` Retrofit all existing components to `F1`'s rules: convert every
  `export function Foo({ x }: Props) {}` to `export const Foo: React.FC<Props> = (props) => {}`
  with `props.x` access (~15 files under `entities/`, `features/`, `widgets/`, `pages/`); convert
  every prop/data `interface` to `type` (~6 files, `routeTree.gen.ts` exempt — generated) — _Depends
  on:_ `F2`
- [x] `F4` Playwright e2e: install `@playwright/test`, fetch current setup docs via Context7 before
  writing config (API has changed across versions); `playwright.config.ts` with a single
  **Chromium-only** project (no Firefox/WebKit); `e2e/pages/*.page.ts` Page Object Model classes;
  one smoke spec exercising the real placeholder-fixture flow (home → topic → submit a practice
  answer → see the checker result) against the locally-served stack (`pnpm dev` + `uv run
  uvicorn`), using `getByRole`/`getByText`, not CSS selectors/`data-testid`; `package.json` scripts
  `test:e2e` / `test:e2e:install` — _Depends on:_ —
- [x] `F5` Fix the Full Gate Chromium smoke failure: after the placeholder answer `4` is submitted,
  the local Vite/Uvicorn journey must receive the checker response and render the accessible
  `status` containing `Верно!`; diagnose the TanStack Start dev-server request failure, preserve
  the Page Object Model and user-visible locators, and verify the test passes without reusing the
  Docker services — _Depends on:_ `F4`

### Infra
- [x] `I1` Fix the Docker Desktop/BuildKit frontend image build: TanStack Start's build-time
  prerender starts a Vite preview server but its self-fetch fails with `ECONNREFUSED
  127.0.0.1:<port>` inside `docker build`; keep prerendering enabled, do not use the known-broken
  `build.network: host` workaround, and verify the Compose stack builds and becomes healthy —
  _Depends on:_ —

### Other
- [x] `T1` `docs/STACK.md`: add an explicit **Testing Policy** statement — unit tests (Vitest,
  pytest) and e2e tests (Playwright) run locally only, in the developer's own environment; never
  containerized, never added to CI even once a CI pipeline exists for other checks (lint/build).
  This is a durable architect decision, not a placeholder — _Depends on:_ —
- [x] `T2` `docs/STACK.md`: fill the Full Gate's e2e rows with real commands (`pnpm --filter web
  test:e2e`, Chromium-only) annotated "local only, never CI'd"; fill the backend `## Testing`
  section (pytest conventions: `TestClient`, function-style fixtures via `make_task()`-style
  helpers, no live network calls, `uv run pytest`); update Required Tooling for e2e-affecting
  changes (Playwright + Page Object Model) — _Depends on:_ `F4`, `T1`

<!-- Test execution is governed by `docs/STACK.md`'s Fast Gate (per task) and Full Gate (per ship).
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
docs/FRONTEND_CONVENTIONS.md            (new)
apps/web/eslint.config.js
apps/web/package.json
apps/web/vite.config.ts
apps/web/playwright.config.ts           (new)
apps/web/e2e/                            (new — pages/*.page.ts, smoke.spec.ts)
apps/web/src/entities/**/ui/*.tsx        (retrofit)
apps/web/src/features/**/ui/*.tsx        (retrofit)
apps/web/src/widgets/**/ui/*.tsx         (retrofit)
apps/web/src/pages/**/ui/*.tsx           (retrofit)
apps/web/src/entities/content/model/types.ts       (interface -> type)
apps/web/src/entities/content/lib/content-link.ts  (interface -> type)
apps/web/src/shared/lib/safe-ls.ts                 (interface -> type)
apps/web/src/features/track-progress/model/progress-store.ts  (interface -> type)
apps/web/src/features/check-answer/api/check-answer.ts        (interface -> type)
docs/STACK.md
docs/KNOWN_GOTCHAS.md
pnpm-lock.yaml
~~~

### Do NOT touch
- `docs/SPEC.md` (no product/contract change)
- Mantine / any UI-kit adoption — that is change 04, not this change
- `apps/api/` code (backend is already conventions-compliant; only its *documented* testing
  conventions in `docs/STACK.md` change, not the code)
- Any CI pipeline config — does not exist and is out of scope; the testing-policy decision recorded
  here applies whenever one is eventually added, but adding one is not this change's job
- `apps/web/src/routes/`, `apps/web/src/router.tsx`, `apps/web/src/routeTree.gen.ts` — framework-
  generated/fixed; route files stay thin per change 02 and are not part of the retrofit (they're
  already minimal; the `React.FC` rule applies to their exported route `component`, reviewed case by
  case, not mechanically converted if TanStack Start's own generated types expect a plain function)

---

## Contracts

See `docs/SPEC.md` and `docs/STACK.md` (Fast/Full Gate, Required Tooling) and the Files list above.
No product/API contract changes — this change is tooling and convention only.

---

## Gate Checks

> Fast Gate runs per task in `/work`; Full Gate and (with `--release`) Release Gate run once in
> `/ship`. Both are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

```bash
# F4 verification requires both dev servers running locally:
#   uv run --project apps/api uvicorn app.main:app --reload &
#   pnpm --filter web dev &
#   pnpm --filter web test:e2e
# Do not run Playwright against a built Docker image or from CI — see T1.
```

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work [XX] review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

<!-- Optional. The agent adds a short bullet here only when something isn't already visible from
     the code or commit history: an intentional deviation from the plan, a residual risk, a
     rejected alternative. Leave empty when nothing needs recording — this is not a mandatory
     per-task log. -->

- This change branches from `feature/02-architecture-refactor` (not `main`), since it retrofits
  code that only exists after change 02 and change 02 hasn't shipped yet (`I8` still open). This is
  a deliberate, documented deviation from `plan.md`'s "branch from main" default — confirmed with
  the architect.
- Mantine UI-kit adoption is deliberately a separate future change (04) — pinned to **Mantine
  v9.5.1 only** per the architect's explicit instruction; not started here.
- The checked-in placeholder topic remains `draft`, so the smoke starts on home and then opens the
  fixture's real topic URL through its Home Page Object instead of exposing draft content in the
  published-topic list. `127.0.0.2` is used for the e2e web servers because this WSL environment
  blackholes unused `127.0.0.1` ports during Playwright's availability probe; both URLs remain
  overrideable.

---

## Commit Message

```
feat(change-03): FRONTEND_CONVENTIONS.md, frontend retrofit, Playwright e2e (Chromium, POM)
```
