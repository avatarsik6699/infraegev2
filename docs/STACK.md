# Stack Guide

> **Source of truth for this project's concrete technologies, tools, and conventions.**
>
> The SDD pipeline (`plan` / `work` / `ship`) is specialized for web applications but stack-neutral
> within that: this file is where it learns what to actually run. `docs/playbooks/work.md` reads
> the [Critical Gate](#critical-gate) and [Required Tooling](#required-tooling) tables verbatim;
> `docs/playbooks/ship.md` reads the Critical, [Full Gate](#full-gate), and
> [Release Gate](#release-gate) tables verbatim.
> Keep these tables accurate.
>
> **Stack status:** CONFIGURED (change 01 — project-foundation)

For a portable starting point for another project on a similar single-VPS stack, use the
[`Infrastructure blueprint`](INFRASTRUCTURE_BLUEPRINT.md). It separates reusable invariants from
infraege-specific values and includes the new-project inputs, acceptance evidence, and production
pitfalls that must be reconsidered rather than copied.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TanStack Start (SSR/SSG, file-based routing and automatic route splitting) on Vite **8.2.1 exact** (Rolldown/Oxc); Mantine Core/Hooks/NProgress **9.5.1 exact**; TanStack Query for future server state; generated `openapi-typescript` contracts with `openapi-fetch` transport |
| Backend | Python/FastAPI (`apps/api`) |
| Database | PostgreSQL (provisioned in `infra/docker-compose.yml`; no schema/migrations yet — content is git-based, docs/SPEC.md §3) |
| Cache | — (not needed on M0) |
| Operations UI | Local-first React/Vite **8.2.1 exact** `apps/ops`, Mantine Core/Charts 9.5.1 + Recharts 3.10.1, loopback-only Node BFF |
| Infra | Docker Compose: Nginx → `web`/`api`/Postgres plus pinned Umami/Beszel; Ubuntu 24.04, systemd, journald, fail2ban, WireGuard, Restic |
| Package managers | uv (`apps/api`), pnpm workspace (`apps/web`, `apps/ops`, root) |
| Formatting | Prettier 3.9.6 exact for supported repository files; Ruff from the API lock for Python; EditorConfig for cross-editor whitespace defaults |
| CI/CD | GitHub Actions on pinned Ubuntu 24.04 runners: static/security/audit checks without tests; GHCR SHA images with SBOM/provenance; environment-approved serialized SSH deploy with rollback; scheduled uptime/TLS probe |

---

## Prerequisites

```bash
docker --version          # application: Docker + Compose v2
docker compose version
make --version            # application: GNU Make
node --version            # local tests only: >=22.13
pnpm --version            # local tests only: exactly 10.33.0 (packageManager)
python3 --version         # local tests only: >=3.12
uv --version              # local tests only
```

---

## Initial setup

```bash
make dev
```

`make dev` supplies disposable process-scoped local values, builds dependencies inside Docker,
starts the dedicated development overlay, waits for every healthcheck, and requires no `.env`.

### pnpm workspace policy

The root `packageManager` and workspace policy pin pnpm 10.33.0, model dependency compatibility
against the Node 22.13 minimum while CI and production images use the current pinned Node 22
maintenance patch, reject invalid peers and stale `node_modules` before
scripts, and fail on unreviewed dependency build scripts. The only approved install script is the
exact currently locked `esbuild@0.28.2`; an esbuild update must therefore be reviewed and approved
explicitly instead of inheriting permission by package name. Supply-chain cooldown, provenance
downgrade prevention, exotic transitive-source blocking, and frozen-lockfile installs remain in
force. Run `pnpm install --frozen-lockfile` explicitly after checkout; pnpm will not repair stale
dependencies as a side effect of `pnpm run`.

Production Dockerfiles and third-party Compose images use a readable release tag plus an immutable
multi-platform digest. Dependabot monitors Dockerfiles, Compose, package locks, Python dependencies,
and SHA-pinned GitHub Actions weekly; image updates still require the repository gates and review.
The image gate uses `--pull` so a missing or revoked digest fails closed, while the digest keeps a
successful rebuild reproducible. Do not replace these references with floating `latest` tags or run
package-manager upgrades inside a pinned runtime image.

### VS Code workspace

Run `pnpm install --frozen-lockfile` before opening the repository when local editor/test tooling
has not been installed yet. The tracked [`.vscode/settings.json`](../.vscode/settings.json) points
the TypeScript language service at `apps/web/node_modules/typescript/lib`; both JavaScript
workspaces resolve that SDK from the frozen pnpm lockfile. Accept VS Code's workspace-TypeScript
prompt (or run **TypeScript: Select TypeScript Version** and choose **Use Workspace Version**) so
the status bar no longer reports VS Code's bundled TypeScript version.

The workspace also recommends the ESLint, Prettier, Python, Ruff, and Playwright extensions used by the
repository. Its shared settings select `apps/api/.venv`, expose the API pytest suite in Test
Explorer, give each JavaScript workspace the correct ESLint working directory, update imports on
file moves, formats supported source/config files with the repository-local Prettier or Ruff on
save, and applies repository-backed lint fixes on explicit save. Each app's flat ESLint config
also pins `parserOptions.tsconfigRootDir` to its own directory for every TypeScript extension,
including contracts, tests, and root-level configs; this is required because the long-lived
extension process loads both sibling typescript-eslint configs. Markdown remains
outside the Prettier boundary and is exempt from trailing-whitespace removal because authored
wrapping and two spaces can be meaningful. Personal UI, theme, font, autosave, and experimental
settings remain user-level choices.

Repository-wide commands are `pnpm format:check` for the non-mutating gate and `pnpm format` to
apply Prettier plus Ruff. ESLint stays a separate quality pass: `pnpm lint` checks both JavaScript
workspaces with content-based caches, while `pnpm lint:fix` applies its safe fixes. Web lint also
runs typed production-code rules plus executable positive/negative checks for the E2E and web
platform architecture policies; these static checks run in CI without collecting or executing
tests. `.editorconfig` provides UTF-8, LF, final-newline, indentation, and whitespace defaults to
editors beyond VS Code.

---

## Critical Gate

Run once after the complete target set of a `/work` invocation and by default local `/ship`, scoped
to the touched area only. It proves that changed code is internally consistent without replaying
the full regression, browser, infrastructure, security, accessibility, or performance suites.
Fill every applicable row and report the rest as `SKIPPED` with a reason.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Format | `pnpm format:check` | run once for the target set; scope is repository-wide because formatting configuration is shared |
| Lint | `pnpm --filter web lint` · `pnpm --filter ops lint` · `cd apps/api && uv run ruff check app tests` | scope to touched workspace |
| Type-check (affected) | `pnpm --filter web typecheck` · `pnpm --filter ops typecheck` · `cd apps/api && pnpm exec pyright app tests` | pyright reads `[tool.pyright]` in `apps/api/pyproject.toml` |
| Focused tests | `pnpm --filter web exec vitest run <changed-test-files>` · `pnpm --filter ops exec vitest run <changed-test-files>` · `cd apps/api && uv run pytest <changed-test-files-or-nodeids>` | run only tests directly covering changed behavior; documentation-only changes are `SKIPPED`; never expand this row to the full suite |
| LSP diagnostics | available: yes | `python-lsp` (Pyright) and `typescript-lsp` MCP servers; repository type-check commands remain complementary gate evidence |
| API type regen (`openapi-typescript` or equivalent) | `pnpm api:check` | only when the public API surface or its generated consumer changed; fails on tracked drift |

---

## Full Gate

Run only when explicitly requested through `/ship --full`, or as a mandatory prerequisite of
`/ship --release`. It is intentionally expensive and is not part of routine task completion or
default local shipping.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Formatting | `pnpm format:check` | Prettier and Ruff; Markdown and generated/dependency-owned files are explicitly ignored |
| Infrastructure / bootstrap | `docker compose -f infra/docker-compose.yml -f infra/docker-compose.override.yml up --build -d` | verified live in change 03 on Docker Desktop/BuildKit: all four services become healthy; frontend and `/health` return 200 through Nginx. Change 02 also verified `POST /api/tasks/{id}/check` and the `/api/tasks/` rate limit (`503` past its burst — Nginx's default `limit_req_status`, not `429`) |
| Migrations | `n/a` | content is git-based, not DB-backed (docs/SPEC.md §3); no schema exists yet to migrate |
| Backend test suite | `cd apps/api && uv run pytest` | local only |
| API contract drift | `pnpm api:check` | requires the frozen API and pnpm environments; tracked schema and generated TypeScript must match |
| Frontend build | `cd apps/web && pnpm build` | runs TanStack Start's build-time prerender; fails the build if any crawled page 500s |
| Frontend unit tests | `pnpm --filter web test && pnpm --filter ops test` | local only |
| E2E lint / determinism | `pnpm --filter web exec playwright test --list` | local only, never CI'd; validates Playwright config/spec collection without running the journey |
| E2E (Playwright) | `pnpm --filter web test:e2e` | local only, never CI'd; starts local Vite + Uvicorn through Playwright `webServer` and verifies the foundation/404 journeys in the single Chromium project |
| Ops dashboard | `pnpm --filter ops build` | BFF tests are included in the local-only workspace unit test row |
| Smoke | `curl -f http://localhost:8000/health/ready` (backend) — frontend smoke is the build prerender crawl | |
| SAST / secrets / dependency audit | `pnpm audit:security` | Docker required for pinned Gitleaks 8.30.1 and Trivy 0.73.0; Semgrep 1.172.0 and pip-audit 2.10.1 run through uvx |
| Accessibility audit | `pnpm audit:a11y` | local Playwright/axe; foundation and not-found routes, serious/critical violations fail |
| Performance budget | `pnpm --filter web build && pnpm audit:performance` | local Chrome against `/`; median of 3, LCP ≤2.5s, CLS ≤0.1, TBT ≤200ms as lab proxy for INP |
| Content link validation | `node scripts/validate-content-links.mjs` | docs/SPEC.md §2.2/§3/§7.2 — fails if any `prerequisites`/`related_topics`/`unlocks_topics`/`practice_task_ids`/`topic_ids` reference a nonexistent id |

Tests remain local-only; the security command is also mirrored in GitHub Actions without invoking
pytest, Vitest or Playwright.

---

## Release Gate

Run only by `/ship --release`, after the Full Gate has passed and the change is merged locally —
before pushing to `origin/main`.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Container image build + scan | `pnpm audit:images` | builds the three production images and fails on fixed HIGH/CRITICAL findings |
| Production Compose render | `scripts/render-production-config.sh /etc/infraege/production.env >/dev/null` | run on the provisioned VPS or against a complete temporary env |
| Health/deploy verification | `scripts/check-release-target.sh` | Before the first successful deploy, permits an unavailable site only when the deploy workflow has no successful run and both public A records match the VPS. Later releases fail closed unless current production health reports a 40-character SHA. After push, the deploy workflow checks the public page/readiness and rolls back on failure. |
| `gh` repository/environment | `gh auth status && gh repo view avatarsik6699/infraegev2` | production approval and required secrets/vars must be configured |

---

## Required Tooling

Mandatory tools/skills per domain — `/work` enforces these before checking an item off; a mandated
tool that isn't available must be reported as skipped with a reason, never silently omitted.

| Domain | Required tool/skill | When | Available in this project |
|--------|----------------------|------|-----------------------------|
| Frontend UI change | Playwright MCP / chrome-devtools MCP (screenshot + console check) | after implementing, before checking off | yes |
| E2E test change | Playwright + Page Object Model + E2E policy lint | during implementation and verification; use typed fixtures, `e2e/pages/*.page.ts`, user-visible locators, and run `pnpm --filter web lint` | yes |
| TypeScript / Python change | LSP diagnostics | after implementing, before checking off | yes |
| New/changed API surface | `openapi-typescript` regen + frontend re-typecheck | after backend contract change | yes — `pnpm api:generate` updates tracked artifacts; `pnpm api:check` proves no drift |
| Frontend architecture decision | `frontend-architecture` skill | during planning and architecture review | yes — installed in the local Codex skill catalog |
| Backend architecture decision | `backend-architecture` skill | during planning and architecture review | yes — installed in the local Codex skill catalog |
| Frontend design decision | `impeccable` skill | during `/plan` §5.3 and design Backlog items; replacement worlds require its product, direction, finish-review and documentation flow | yes — 4.0.4 installed |
| Backend/API design decision | `backend-design` skill | during `/plan` §4 and backend-architecture Backlog items | yes |

Mark a row `no` (not available) rather than leaving it blank — an unmarked row is otherwise
ambiguous between "not asked" and "not needed."

---

## Testing Policy

Unit tests (Vitest and pytest) and browser e2e tests (Playwright) run **only locally in the
developer's own environment**. They must never be containerized and must never be added to CI,
including after a CI pipeline exists for non-test checks such as lint or build. This is a durable
architect decision, not a temporary gap in the current CI setup.

Docker may serve the application for unrelated infrastructure verification, but no test runner or
browser is installed or executed inside an application image or Compose service. The Playwright
gate uses its locally installed Chromium and locally starts Vite and Uvicorn.

## Testing

### Backend

```bash
cd apps/api && uv run pytest
```

- Use FastAPI `TestClient`; do not call a live server or external network from unit tests.
- Prefer function-style pytest tests and fixtures. Build content fixtures with small helpers such
  as the existing `make_task()` pattern rather than shared mutable objects or class setup.
- Keep each test focused on observable service or HTTP behavior.
- Own `TestClient` through a pytest fixture/context manager and reset FastAPI dependency overrides
  in fixture teardown so failures cannot leak global application state into later tests.

### Frontend (if applicable)

```bash
pnpm --filter web test
pnpm --filter web test:e2e:install  # installs Chromium only; first run / browser update
pnpm --filter web test:e2e
```

- Vitest unit tests live in `apps/web/tests/`.
- Playwright specs live in `apps/web/e2e/`; browser journeys use Page Object Model classes from
  `e2e/pages/*.page.ts`, typed application fixtures from `e2e/fixtures.ts`, and user-visible
  `getByRole`/`getByText` locators. Specs describe journeys; POMs own page actions/assertions, and
  fixtures own object construction plus resource teardown. Specs import `test` only from
  `./fixtures`, consume application fixtures only, and neither instantiate POMs nor use Playwright
  locators, assertions, runner plumbing, or context/page APIs directly. `pnpm --filter web lint`
  enforces this boundary and runs policy self-tests; extend the fixture or owning POM instead of
  bypassing the rule.
- Prefer locator actions and web-first assertions over `waitForTimeout`, selector polling, or
  global `networkidle`. When streamed SSR markup precedes hydration, retry the user action against
  an observable interactive state inside the owning POM.
- Vitest owns mock cleanup through workspace config (`clearMocks`, `restoreMocks`, and
  `unstubGlobals`). Keep DOM cleanup explicit in ops jsdom files because that workspace does not
  expose global hooks; keep fake-timer and environment-variable cleanup beside the tests that own
  those resources.
- `playwright.config.ts` contains one project only: Chromium. It always starts fresh local frontend
  and backend processes on dedicated `127.0.0.2:3100` / `127.0.0.2:8100` ports with strict port
  binding; it never reuses an arbitrary process that may serve a stale checkout.

---

## Project structure

```
.
├── docs/
│   ├── SPEC.md              # vision/contract anchor
│   ├── STACK.md              # this file
│   ├── KNOWN_GOTCHAS.md      # recurring pitfalls
│   ├── CHANGE_TEMPLATE.md    # template for new changes
│   ├── changes/              # active units of work
│   │   └── archive/          # completed units of work
│   └── playbooks/            # plan.md / work.md / ship.md / workflow-init.md
├── .claude/skills/            # Claude Code skill wrappers (plan, work, ship)
├── .agents/skills/             # generic-agent skill wrappers (plan, work, ship)
├── .vscode/                    # shared workspace editor settings (repository TypeScript SDK)
├── .editorconfig               # editor-independent whitespace and indentation defaults
├── prettier.config.mjs         # repository-local Prettier opt-in/config anchor
├── plugins/sdd-workflow/       # Codex plugin (skills, commands, MCP, hooks)
├── apps/web/, apps/api/, apps/ops/, infra/, ops/, content/, scripts/
└── AGENTS.md / CLAUDE.md       # AI agent rules
```

### Frontend layers (`apps/web/src/`) — pragmatic FSD-like, established in change 02

```
app/         application providers, project-wide configuration, route states and global styles.
routes/      TanStack Start file-based routing (framework-fixed location). During the foundation
             reset it owns only thin route definitions and the generated route tree.
pages/       route-level composition and content that belongs to one page.
widgets/     reusable composite page chrome, including lesson navigation.
features/    reusable user-facing capabilities, including lesson practice and progress.
entities/    reusable domain concepts, including lesson semantics and learning visuals.
shared/      domain-agnostic config/lib plus policy components wrapping Mantine where the project
             owns semantics or defaults.
```

Import direction is enforced by `eslint.config.js`'s per-layer `no-restricted-imports` zones: each
layer may import only itself and the lower layers listed below it in this table (e.g. `entities` must
not import from `features`/`widgets`/`pages`/`routes`). `~/*` still maps to `src/*` (see
`tsconfig.json`) — no separate per-layer alias set. Every slice exposes a strict `index.ts` public
API; cross-slice deep imports are forbidden, while imports within a slice are relative. UI does
not use an extra `ui/` segment: a root component is colocated with its `*.types.ts` and optional
CSS Module, and recursively complex private components live under `components/`. Meaningful
`api/`, `model/`, and `lib/` segments remain.

Production modules use explicit execution and integration boundaries. Public Vite values live in
`shared/config/client-env.ts`; server environment reads live in marker-protected `*.server.ts`
modules and happen inside the request handler. Browser globals and storage are owned by focused
`shared/lib` adapters, while HTTP calls are owned by the consuming slice's `api/`. Components,
stores, pages, and routes call those semantic APIs rather than raw `window`, `document`,
`navigator`, storage, `fetch`, or `process`. `pnpm --filter web lint` enforces this allowlist,
type-checks production lint rules through typescript-eslint Project Service, and runs executable
policy cases. TanStack route modules retain two narrow unsafe-value lint exemptions because its
generated augmentation is resolved by the project `tsc` gate but not fully by Project Service;
the documented `notFound()` sentinel also requires the route-only `only-throw-error` exemption.

Server state belongs to a per-router TanStack Query client, which is integrated with SSR and is
never reused between requests. No product query currently consumes it. Future domain operations
use the single generated `shared/api` transport. Regenerate `contracts/openapi.json` and
`shared/api/schema.ts` with `pnpm api:generate`; prove no drift with `pnpm api:check`. No global
client-state store is installed until a real cross-route owner exists. Transient feature state
lives in the owning component or a slice-local model hook; longer-lived domain state uses an
injected store such as lesson progress so persistence and rendering remain separate without a
global service locator.

Route pending/error/not-found UI, delayed skeletons, and navigation progress are application-level
defaults. Browser render/route/chunk/global failures pass through `shared/lib/client-errors`, which
discards messages, page URLs, full stacks, and user data before posting a bounded fingerprint
event. Nginx applies a dedicated body/rate limit, FastAPI writes a structured journald event, and
the existing ops journal adapter projects it into the dashboard incident table. Expected product
errors will remain local to their owner. Mantine extensions stay deferred until a real flow
consumes them.

### Backend modules (`apps/api/app/`) — DDD-like, established in change 02

```
main.py      create_app() factory.
api/         router.py — aggregates every module's router under one prefix (`/api`, not `/api/v1`
             — see docs/changes/02-architecture-refactor.md's Contracts section for why).
core/        cross-cutting infra with no HTTP surface of its own: config (Settings), exceptions
             (AppException base), logging (structlog), middleware (request-id + error alerting),
             structured logging). Modules may import from core/; core/ must not import modules/.
modules/     one package per bounded context — health/, content/, tasks/. Each holds only the
             files it needs: api.py (routes), service.py (logic), schemas.py (Pydantic DTOs),
             exceptions.py (module-specific AppException subclasses).
shared/      cross-module code used by >= 2 modules — stays an empty placeholder until that's
             actually true; do not pre-populate it.
```

No repository/ORM layer exists yet — content is git-based (SPEC.md §3), not DB-backed. When a
first SQLAlchemy model is added, see the pre-emptive asyncpg datetime rule in
`docs/KNOWN_GOTCHAS.md` before writing it.

### Operations application (`apps/ops/`) — local-first FSD/DDD-like boundary

```
contracts/    BFF-to-browser DTOs and the finite dashboard range contract; package-local and
              compiled with the server so the two TypeScript consumers cannot drift.
src/          React client: app.tsx is composition-only; pages/dashboard owns its API client,
              polling model and private components; shared contains only reusable config/styles.
server/main.ts
              production bootstrap and listen only.
server/app.ts request-listener factory; composes the API router and static client delivery.
server/core/  cross-cutting config, HTTP response and static-file infrastructure.
server/api/   aggregates module HTTP handlers; contains no source-specific logic.
server/modules/
              projects and dashboard bounded contexts, each with its API/service/schema needs.
server/integrations/
              isolated Availability/Beszel/Umami/journald/fail2ban adapters implementing the
              dashboard reader port; credentials are resolved only inside the BFF.
```

The React client follows the same pragmatic rule as `apps/web`: a one-page component used only by
that page remains private under `pages/dashboard/components/`; do not create ceremonial widgets,
features or shared helpers until a second consumer exists. The ops ESLint config enforces
`app -> pages -> shared` and public `index.ts` imports. On the server, dependencies point inward:
modules define the reader port, integrations implement it, and `main.ts` injects the live adapters.
The BFF stays on Node's built-in `http`/`fetch`; do not add a web framework or global singleton
cache for the current two-route surface.

---

## Common operations

```bash
# Start the stack
make dev

# Gracefully stop everything and preserve PostgreSQL data
make stop

# Follow service logs
make logs

# Show health/status
make ps

# Remove regenerable local reports, build outputs, and caches
# Preserves node_modules, apps/api/.venv, env files, and PostgreSQL/Docker data
make clean

# Add a new migration / schema change
# n/a — no database schema exists yet

# Format / lint
cd apps/web && pnpm lint
cd apps/api && uv run ruff check app tests
```
