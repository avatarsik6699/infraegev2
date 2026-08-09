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

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TanStack Start (SSR/SSG, file-based routing, `createServerFn` for server-only content access) — no TanStack Query yet, no API surface needs client caching on M0; no `openapi-typescript` yet, no OpenAPI schema exists (see Known Gotchas) |
| Backend | Python/FastAPI (`apps/api`) |
| Database | PostgreSQL (provisioned in `infra/docker-compose.yml`; no schema/migrations yet — content is git-based, docs/SPEC.md §3) |
| Cache | — (not needed on M0) |
| Infra | Docker Compose: Nginx (front door + rate limiting) → `web` (Node/Nitro) and `api` (Uvicorn); Postgres |
| Package managers | uv (`apps/api`), pnpm workspace (`apps/web`, root `package.json`) |
| CI | — (not wired yet; `pnpm --filter web build/test/typecheck/lint`, `uv run pytest`, `node scripts/validate-content-links.mjs` are the commands a CI config would call) |

---

## Prerequisites

```bash
docker --version   # Compose v2
node --version      # >=22
pnpm --version       # >=10
python3 --version    # >=3.12
uv --version
```

---

## Initial setup

```bash
pnpm install
cd apps/api && uv sync && cd ../..
docker compose -f infra/docker-compose.yml -f infra/docker-compose.override.yml up --build
```

---

## Fast Gate

Run by `/work` after each Backlog item or Architect Review Note, scoped to the touched area only —
not the full suite. Fill every row that applies; mark `n/a` for rows that don't (e.g. no frontend
→ frontend rows are `n/a`). Reported as `SKIPPED — n/a in STACK.md` otherwise.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Lint | `cd apps/web && pnpm lint` (frontend) · `n/a` (backend — no linter configured yet) | run from repo root or `apps/web` |
| Type-check (affected) | `cd apps/web && pnpm typecheck` (frontend) · `cd apps/api && npx pyright app tests` (backend) | pyright reads `[tool.pyright]` in `apps/api/pyproject.toml` |
| Targeted / affected unit tests | `cd apps/web && pnpm test` (frontend, vitest) · `cd apps/api && uv run pytest` (backend) | |
| LSP diagnostics | available: yes | pyright (backend) confirmed working; frontend TS diagnostics via `tsc`/editor LSP |
| API type regen (`openapi-typescript` or equivalent) | `n/a` | no OpenAPI schema/generated client yet — the frontend calls `/api/tasks/{id}/check` with a hand-written `fetch` + inline response type (`PracticeTaskWidget.tsx`), not a generated client. Revisit once the API surface grows past one endpoint. |

---

## Full Gate

Run once by `/ship`, before merging a change's feature branch into `main`. Do not run this per
task — it's expensive by design; that's why it's separated from the Fast Gate.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Infrastructure / bootstrap | `docker compose -f infra/docker-compose.yml -f infra/docker-compose.override.yml up --build -d` | not yet run end-to-end in CI — no Docker daemon was available in the environment change 01 was built in; the compose file and Dockerfiles are written but unverified as a running stack |
| Migrations | `n/a` | content is git-based, not DB-backed (docs/SPEC.md §3); no schema exists yet to migrate |
| Backend test suite | `cd apps/api && uv run pytest` | 11 tests as of change 01 |
| Frontend build | `cd apps/web && pnpm build` | runs TanStack Start's build-time prerender; fails the build if any crawled page 500s |
| Frontend unit tests | `cd apps/web && pnpm test` | 8 tests as of change 01 |
| E2E lint / determinism | `n/a` | no e2e suite yet |
| E2E (Playwright) | `n/a` | no e2e suite yet — revisit once there's more than one real published topic to click through |
| Smoke | `curl -f http://localhost:8000/health` (backend) — frontend smoke is the build's own prerender crawl | |
| SAST (e.g. Semgrep) | `n/a` | not set up in change 01 |
| Secrets scan (e.g. Gitleaks) | `n/a` | not set up in change 01 |
| Dependency audit (e.g. Trivy / `npm audit` / `pip-audit`) | `n/a` | not set up in change 01 |
| Accessibility audit (e.g. axe / Lighthouse CI) | `n/a` | not set up in change 01 — §8 a11y requirements (diagram `aria-label`, semantic tables) are implemented and manually verified in the rendered HTML, but not yet gated by an automated audit |
| Performance budget (e.g. Lighthouse CI, Core Web Vitals) | `n/a` | not set up in change 01; thresholds are LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 per docs/SPEC.md §8 once it is |
| Content link validation | `node scripts/validate-content-links.mjs` | docs/SPEC.md §2.2/§3/§7.2 — fails if any `prerequisites`/`related_topics`/`unlocks_topics`/`practice_task_ids`/`topic_ids` reference a nonexistent id |

No helper script yet — the commands above are run individually.

---

## Release Gate

Run only by `/ship --release`, after the Full Gate has passed and the change is merged locally —
before pushing to `origin/main`.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Container image scan (e.g. Trivy) | `n/a` | not set up in change 01 |
| Health-check / zero-downtime deploy verification | `curl -f https://<domain>/health` (via Nginx → api) once deployed | `<domain>` and deploy pipeline don't exist yet — no VPS deploy in change 01 |
| `gh` authenticated for this repo | no | not checked in this environment |

---

## Required Tooling

Mandatory tools/skills per domain — `/work` enforces these before checking an item off; a mandated
tool that isn't available must be reported as skipped with a reason, never silently omitted.

| Domain | Required tool/skill | When | Available in this project |
|--------|----------------------|------|-----------------------------|
| Frontend UI change | Playwright MCP / chrome-devtools MCP (screenshot + console check) | after implementing, before checking off | yes |
| TypeScript / Python change | LSP diagnostics | after implementing, before checking off | yes |
| New/changed API surface | `openapi-typescript` (or equivalent) regen + frontend re-typecheck | after backend contract change | n/a — no OpenAPI schema yet, see Fast Gate note |
| Architecture-level decision | architecture skill | during planning | yes |
| Frontend design decision | `frontend-design` skill | during `/plan` §5.3 and design Backlog items | yes |
| Backend/API design decision | `backend-design` skill | during `/plan` §4 and backend-architecture Backlog items | yes |

Mark a row `no` (not available) rather than leaving it blank — an unmarked row is otherwise
ambiguous between "not asked" and "not needed."

---

## Testing

### Backend

```bash
# [test command + notes]
```

### Frontend (if applicable)

```bash
# [unit / typecheck / e2e commands]
```

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
├── [your source dirs]
└── AGENTS.md / CLAUDE.md       # AI agent rules
```

---

## Common operations

```bash
# Start the stack
# [command]

# Stop everything
# [command]

# Add a new migration / schema change
# [command]

# Format / lint
# [command]
```
