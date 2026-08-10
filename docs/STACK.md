# Stack Guide

> **Source of truth for this project's concrete technologies, tools, and conventions.**
>
> The SDD pipeline (`plan` / `work` / `ship`) is specialized for web applications but stack-neutral
> within that: this file is where it learns what to actually run. `docs/playbooks/work.md` reads
> the [Fast Gate](#fast-gate) and [Required Tooling](#required-tooling) tables verbatim;
> `docs/playbooks/ship.md` reads [Full Gate](#full-gate) and [Release Gate](#release-gate) verbatim.
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
| Frontend | React + TanStack Start (SSR/SSG, file-based routing, `createServerFn` for server-only content access) + Mantine Core/Hooks **9.5.1 exact** as the UI primitive layer — no TanStack Query yet, no API surface needs client caching on M0; no `openapi-typescript` yet, no OpenAPI schema exists (see Known Gotchas) |
| Backend | Python/FastAPI (`apps/api`) |
| Database | PostgreSQL (provisioned in `infra/docker-compose.yml`; no schema/migrations yet — content is git-based, docs/SPEC.md §3) |
| Cache | — (not needed on M0) |
| Operations UI | Local-first React/Vite `apps/ops`, Mantine Core/Charts 9.5.1 + Recharts 3.10.1, loopback-only Node BFF |
| Infra | Docker Compose: Nginx → `web`/`api`/Postgres plus pinned Umami/Beszel; Ubuntu 24.04, systemd, journald, fail2ban, WireGuard, Restic |
| Package managers | uv (`apps/api`), pnpm workspace (`apps/web`, `apps/ops`, root) |
| CI/CD | GitHub Actions: static/security/audit checks without tests; GHCR SHA images; environment-approved manual SSH deploy with rollback; scheduled uptime/TLS probe |

---

## Prerequisites

```bash
docker --version          # application: Docker + Compose v2
docker compose version
make --version            # application: GNU Make
node --version            # local tests only: >=22
pnpm --version            # local tests only: >=10
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

---

## Fast Gate

Run by `/work` after each Backlog item or Architect Review Note, scoped to the touched area only —
not the full suite. Fill every row that applies; mark `n/a` for rows that don't (e.g. no frontend
→ frontend rows are `n/a`). Reported as `SKIPPED — n/a in STACK.md` otherwise.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Lint | `pnpm --filter web lint` · `pnpm --filter ops lint` · `cd apps/api && uv run ruff check app tests` | scope to touched workspace |
| Type-check (affected) | `pnpm --filter web typecheck` · `pnpm --filter ops typecheck` · `cd apps/api && pnpm exec pyright app tests` | pyright reads `[tool.pyright]` in `apps/api/pyproject.toml` |
| Targeted / affected unit tests | `pnpm --filter web test` · `pnpm --filter ops test` · `cd apps/api && uv run pytest` | local developer environment only; never Docker/CI |
| LSP diagnostics | available: yes | pyright (backend) confirmed working; frontend TS diagnostics via `tsc`/editor LSP |
| API type regen (`openapi-typescript` or equivalent) | `n/a` | no OpenAPI schema/generated client yet — the frontend calls `/api/tasks/{id}/check` with a hand-written `fetch` + inline response type (`PracticeTaskWidget.tsx`), not a generated client. Revisit once the API surface grows past one endpoint. |

---

## Full Gate

Run once by `/ship`, before merging a change's feature branch into `main`. Do not run this per
task — it's expensive by design; that's why it's separated from the Fast Gate.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Infrastructure / bootstrap | `docker compose -f infra/docker-compose.yml -f infra/docker-compose.override.yml up --build -d` | verified live in change 03 on Docker Desktop/BuildKit: all four services become healthy; frontend and `/health` return 200 through Nginx. Change 02 also verified `POST /api/tasks/{id}/check` and the `/api/tasks/` rate limit (`503` past its burst — Nginx's default `limit_req_status`, not `429`) |
| Migrations | `n/a` | content is git-based, not DB-backed (docs/SPEC.md §3); no schema exists yet to migrate |
| Backend test suite | `cd apps/api && uv run pytest` | local only |
| Frontend build | `cd apps/web && pnpm build` | runs TanStack Start's build-time prerender; fails the build if any crawled page 500s |
| Frontend unit tests | `pnpm --filter web test && pnpm --filter ops test` | local only |
| E2E lint / determinism | `pnpm --filter web exec playwright test --list` | local only, never CI'd; validates Playwright config/spec collection without running the journey |
| E2E (Playwright) | `pnpm --filter web test:e2e` | local only, never CI'd; starts local Vite + Uvicorn through Playwright `webServer` and runs 2 smoke tests in the single Chromium project |
| Ops dashboard | `pnpm --filter ops build` | BFF tests are included in the local-only workspace unit test row |
| Smoke | `curl -f http://localhost:8000/health/ready` (backend) — frontend smoke is the build prerender crawl | |
| SAST / secrets / dependency audit | `pnpm audit:security` | Docker required for pinned Gitleaks 8.30.1 and Trivy 0.73.0; Semgrep 1.172.0 and pip-audit 2.10.1 run through uvx |
| Accessibility audit | `pnpm audit:a11y` | local Playwright/axe; four public routes, serious/critical violations fail |
| Performance budget | `SITE_URL=https://infraege.ru pnpm --filter web build && pnpm audit:performance` | local Chrome; median of 3, LCP ≤2.5s, CLS ≤0.1, TBT ≤200ms as lab proxy for INP |
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
| E2E test change | Playwright + Page Object Model | during implementation and verification; use `e2e/pages/*.page.ts` and user-visible locators | yes |
| TypeScript / Python change | LSP diagnostics | after implementing, before checking off | yes |
| New/changed API surface | `openapi-typescript` (or equivalent) regen + frontend re-typecheck | after backend contract change | n/a — no OpenAPI schema yet, see Fast Gate note |
| Architecture-level decision | architecture skill | during planning | no — not exposed in the current runtime; change 04 used an architect-reviewed plan plus Context7/package-type verification |
| Frontend design decision | `frontend-design` skill | during `/plan` §5.3 and design Backlog items | yes |
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

### Frontend (if applicable)

```bash
pnpm --filter web test
pnpm --filter web test:e2e:install  # installs Chromium only; first run / browser update
pnpm --filter web test:e2e
```

- Vitest unit tests live in `apps/web/tests/`.
- Playwright specs live in `apps/web/e2e/`; browser journeys use Page Object Model classes from
  `e2e/pages/*.page.ts` and user-visible `getByRole`/`getByText` locators.
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
├── plugins/sdd-workflow/       # Codex plugin (skills, commands, MCP, hooks)
├── apps/web/, apps/api/, apps/ops/, infra/, ops/, content/, scripts/
└── AGENTS.md / CLAUDE.md       # AI agent rules
```

### Frontend layers (`apps/web/src/`) — pragmatic FSD-like, established in change 02

```
routes/      TanStack Start file-based routing (framework-fixed location) — thin: a route
             definition + loader + head, rendering a pages/ component with loader data as props.
             `router.tsx`/`routeTree.gen.ts` are the app layer; there is no separate `src/app/`.
pages/       one ecosystem per route; root component at the slice root, private composition under
             components/, and model/hooks only when needed.
widgets/     composite chrome reused across pages (currently: site-footer), with the same
             root/components hierarchy.
features/    a user-facing capability with root UI + logic (check-answer, track-progress).
entities/    domain concepts reused across features/pages (content, content-block).
shared/      domain-agnostic config/lib/styles plus policy components wrapping Mantine where the
             project owns semantics or defaults.
```

Import direction is enforced by `eslint.config.js`'s per-layer `no-restricted-imports` zones: each
layer may import only itself and the layers listed above it in this table (e.g. `entities` must
not import from `features`/`widgets`/`pages`/`routes`). `~/*` still maps to `src/*` (see
`tsconfig.json`) — no separate per-layer alias set. Every slice exposes a strict `index.ts` public
API; cross-slice deep imports are forbidden, while imports within a slice are relative. UI does
not use an extra `ui/` segment: a root component is colocated with its `*.types.ts` and optional
CSS Module, and recursively complex private components live under `components/`. Meaningful
`api/`, `model/`, and `lib/` segments remain.

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

# Add a new migration / schema change
# n/a — no database schema exists yet

# Format / lint
cd apps/web && pnpm lint
cd apps/api && uv run ruff check app tests
```
