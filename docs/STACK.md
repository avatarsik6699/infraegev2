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
| Frontend | React + TanStack Start (SSR/SSG, file-based routing and automatic route splitting) on Vite **8.2.1 exact** (Rolldown/Oxc); Base UI **1.7.0 exact** with local CSS Modules; Zustand **5.0.12 exact** for the cross-route lesson-progress registry; synchronous Python tokenization through `@speed-highlight/core` **2.0.0 exact**; TanStack Query for future server state; generated `openapi-typescript` contracts with `openapi-fetch` transport |
| Backend | Python/FastAPI (`apps/api`) |
| Database | PostgreSQL (provisioned in `infra/docker-compose.yml`; no schema/migrations yet — content is git-based, docs/SPEC.md §3) |
| Cache | — (not needed on M0) |
| Observability | `infraegev2/ops` owns the target lifecycle, explicit browser consent, allowlisted product events and coarse traffic aggregates. First-party sibling [sre-kit](https://github.com/avatarsik6699/sre-kit) Change 22 owns Projects, pull/push ingestion, retention, alerts and every monitoring/analytics dashboard. Host metrics and fail2ban use the accepted root/password SSH contract; journal logs, Beszel and Umami use WireGuard; push uses a Source token kept outside git |
| Infra | Two Docker Compose projects on one VPS: application Nginx → `web`/`api`/Postgres, plus independently pinned Umami/Beszel operations services; Ubuntu 24.04, systemd, journald, fail2ban, WireGuard, Restic |
| Package managers | uv (`apps/api`), pnpm workspace (`apps/web`, root) |
| Formatting | Prettier 3.9.6 exact for supported repository files; Ruff from the API lock for Python; EditorConfig for cross-editor whitespace defaults |
| CI/CD | GitHub Actions on pinned Ubuntu 24.04 runners: static/security/audit checks without tests; GHCR SHA images with SBOM/provenance; environment-approved serialized SSH deploy with rollback; scheduled uptime/TLS probe |

---

## Prerequisites

```bash
docker --version          # application: Docker + Compose v2
docker compose version
make --version            # application: GNU Make
flock --version           # serializes local Docker lifecycle mutations (util-linux)
node --version            # local tests only: >=22.13
pnpm --version            # local tests only: exactly 10.33.0 (packageManager)
python3 --version         # local tests only: >=3.12
uv --version              # local tests only
curl --version            # health and smoke checks
jq --version              # JSON tests and operational status files
sha256sum --version       # Docker development input fingerprinting
```

---

## Initial setup

```bash
make dev
```

`make dev` supplies disposable process-scoped local values, starts or resumes the dedicated
development overlay, waits for every healthcheck, and requires no `.env`. It fingerprints
dependency manifests, lockfiles, Dockerfiles, Vite configuration and other image-owned inputs:
when they change, `make dev` rebuilds before starting; otherwise it keeps the fast resumable path.
`make rebuild` remains the explicit force-rebuild command. Web source, API source and content use
development bind mounts. Use `make stop` for a fast resumable halt; use `make down` only when the
owned containers and network must be recreated. Both paths preserve the named PostgreSQL volume.

Lifecycle mutations are serialized for the `infraege-dev` Compose project: if a previous
`make dev`, `make rebuild`, `make stop`, `make down` or `make restart` is still running, a second
command fails immediately instead of racing the first one. Docker Desktop may also show a separate
`infra` project created by direct `docker compose` commands; the Make targets intentionally own
only `infraege-dev`. A failed start prints service status and recent nginx/web/api logs.

The web lesson loader reads only git-owned practice tasks through `CONTENT_DIR`. Compose mounts
`content/tasks/` read-only at `/content/tasks`; web development and production images contain the
same task subtree at that path. Host commands fall back to the workspace `content/` path. Lesson
theory is compiled from `apps/web/src/entities/lesson/content/*.lesson.tsx` and is never mounted as
runtime content. The API retains its separate full `content/` tree because courses, topics and task
validation remain backend-owned contracts.

**Production access:** the primary administration contract is public `root@2.26.8.245` with the
protected `root-admin-password`, pinned `known_hosts` and `scripts/production-root-ssh.sh`.
Public-key login and alternate SSH users are not active, and no key-only migration is scheduled.
The adapter accepts the architect-approved 12-character minimum. Longer generated passwords remain
recommended; the architect accepts the increased brute-force and host-compromise risk for the
current operating horizon.
Reaching the VPS's private `10.77.0.0/24` network
(Beszel, Umami and journald gatewayd) still needs the WireGuard tunnel: `make tunnel-up` starts and
verifies it, `make tunnel-down`
stops a tunnel this Makefile started, `make tunnel-status` reports interface/route/handshake state.
Wraps `scripts/wireguard-tunnel.sh`; requires the protected config at
`~/.config/infraege/production/infraege-wsl.conf` (or `$INFRAEGE_WG_CONFIG`) to already exist.

The independent definition is `ops/observability/compose.yml`, always rendered and applied with
project name `infraege-ops`. Callers provide the names listed in
`ops/observability/env.contract` through a protected mode-600 file and pass a full Git SHA as the
release id. `make ops-config ENV_FILE=… RELEASE=…` is local and non-mutating.

`make ops-status` reads only the installed project's Compose status through the pinned production
SSH wrapper. `make ops-install ENV_FILE=… RELEASE=…` uploads the Compose definition, its maintenance
scripts and protected environment, creates the one external ingress network if absent, then runs
`pull` and `up --wait`.
`ops-update` applies another release through the same path; `ops-rollback` reapplies the previous
release. Releases live under `/opt/infraege-ops`, their mode-600 environments under
`/etc/infraege/ops`, and none of these commands reference the application Compose project.

The always-on sre-kit control plane is a third, independent Compose project on the dedicated
management VPS. `make sre-management ACTION=<action> RELEASE=<sre-kit-main-sha>` wraps the pinned
root/password connection from `~/.config/sre-kit/dedicated-vps/connection.env`; supported actions
are `bootstrap`, `wireguard`, `install`, `update`, `rollback`, `sources`, `status`, `backup`,
`restore-proof` and `all`. The wrapper verifies the independently confirmed management host
fingerprint before every connection. Bootstrap opens only the configured SSH port and 80/443 in
UFW, and fails if the pre/post Firecrawl/SearXNG container inventory changes. It never addresses
the application or `infraege-ops` Compose projects.

The management peer owns `10.77.0.3/32`, pins MTU 1280 for the cross-provider path and routes only
`10.77.0.1/32`; workstation peer
`10.77.0.2/32` remains unchanged. DNS `sre.infraege.ru -> 2.27.208.4` must exist before first
exact-SHA deploy so Caddy can obtain TLS and public readiness can pass.

The repository's application production definition now owns only Nginx, web, API and its Postgres;
Nginx attaches to `infraege-observability-ingress`. The accepted split-stack cutover baseline was
exact SHA `ad6df05fa7d44e7a4f9434c196091ed4890e2f49`: five operations containers, private
Beszel/Umami access, Agent registration, tagged backup/restore and three timers passed final
acceptance. The current deployed application SHA must always be read from `/health/ready` and
release evidence rather than this historical baseline. Legacy volumes remain rollback-only. This
repository deliberately has no desired-state JSON,
generic plan/apply engine, migration rehearsal, snapshot selector or deployment UI. Compose is the
service desired state; the runbook is the cross-project transition contract.

`ops/observability/sre-kit-sources.example.json` documents one Project and seven human-readable
Sources: `Public availability`, `Host resources`, `Security bans`, `Application journal`,
`Container telemetry`, `Product analytics` and `Nginx traffic`. Credentials are transient
mode-600 reconciliation input, become encrypted sre-kit secret refs, and are then removed from the
management host. Admin reconciliation uses the verified `https://sre.infraege.ru` origin so the
production `Secure` session cookie is never weakened; token-based publisher ingestion remains on
core loopback. Every explicit reconciliation refreshes secret-bearing Source configs from current
protected operator inputs because an opaque API ref cannot prove credential equality; sre-kit
replaces the encrypted ref and deletes the superseded value. The generated push token stays in a
protected management-only file. The separate
`stub` manifest is test-only. Linked sre-kit Change 20
historically reconciled the six pull Sources and proved fresh polling, quiet success, reversible
failure/recovery and authenticated Dashboard/Sources/detail rendering without target-side
mutations. A local core still provides no polling or alerts while its workstation is off, and
monitoring availability never gates target lifecycle.

Beszel Agent intentionally retains host networking for host network counters. Its Docker API is a
read-only socket proxy bound only to `127.0.0.1:2375` and attached to the dedicated non-internal
`docker-api` bridge; `POST=0` remains mandatory. Source reconciliation authenticates with the
existing protected Beszel user, resolves exactly one system named `infraege.ru`, and sets
`require_container_stats=true`; copied PocketBase record ids are not configuration inputs.

`ops/observability/install-sre-kit-local.sh` installs the repository-owned manual CLI plus a
disabled user timer for privacy-safe Nginx aggregate delivery. It accepts the current push Source
UUID and a mode-600 token file, writes only protected local configuration/state, and never enables
autostart. The rendered unit pins the same discovered Python ≥3.12 interpreter validated by the
installer instead of relying on an older `/usr/bin/python3`. `sre-kit-local start` starts tunnel →
core → one immediate publisher run → timer → web;
`stop` stops the publisher before core/tunnel. The timer reads at most 500 journal entries per
minute through the existing loopback gateway forward and persists only its opaque cursor.

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
| Lint | `pnpm --filter web lint` · `cd apps/api && uv run ruff check app tests` · `bash -n <changed-shell-files>` | scope to touched workspace or scripts |
| Type-check (affected) | `pnpm --filter web typecheck` · `cd apps/api && pnpm exec pyright app tests` | app pyright reads `[tool.pyright]` in `apps/api/pyproject.toml`; shell changes have no type-check row |
| Focused tests | `pnpm --filter web exec vitest run <changed-test-files>` · `cd apps/api && uv run pytest <changed-test-files-or-nodeids>` · `bash scripts/tests/<changed-contract>.test.sh` | run only tests directly covering changed behavior; documentation-only changes are `SKIPPED`; never expand this row to the full suite |
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
| Infrastructure / bootstrap | `docker compose --project-name infraege-full-gate -f infra/docker-compose.yml -f infra/docker-compose.override.yml up --build -d` | The explicit project name and overlay ports `18080/13000/18000/15432` isolate the gate from unrelated Compose directories and common development ports. Verified live in change 03 on Docker Desktop/BuildKit: all four services become healthy; frontend and `/health` return 200 through Nginx. Change 02 also verified `POST /api/tasks/{id}/check` and the `/api/tasks/` rate limit (`503` past its burst — Nginx's default `limit_req_status`, not `429`) |
| Operations contracts | `bash scripts/tests/ops-stack-definition.test.sh && bash scripts/tests/ops-lifecycle.test.sh && bash scripts/tests/production-ops-topology.test.sh && bash scripts/tests/backup-restore.test.sh && bash scripts/tests/ops-backup-restore.test.sh && bash scripts/tests/sre-kit-management-contract.test.sh && bash scripts/tests/host-web-gate.test.sh` | local/fake transport only; never connects to production or starts the operations projects |
| Migrations | `n/a` | content is git-based, not DB-backed (docs/SPEC.md §3); no schema exists yet to migrate |
| Backend test suite | `cd apps/api && uv run pytest` | local only |
| API contract drift | `pnpm api:check` | requires the frozen API and pnpm environments; tracked schema and generated TypeScript must match |
| Frontend build | `scripts/run-host-web-gate.sh pnpm --filter web build` | temporarily stops only the running Full Gate `infra` Compose web service that owns host port 3000, restores it on success/failure, then runs TanStack Start's build-time prerender; fails if any crawled page 500s |
| Frontend unit tests | `pnpm --filter web test` | local only |
| E2E lint / determinism | `pnpm --filter web exec playwright test --list` | local only, never CI'd; validates Playwright config/spec collection without running the journey |
| E2E (Playwright) | `pnpm --filter web test:e2e` | local only, never CI'd; starts local Vite + Uvicorn through Playwright `webServer` and verifies the foundation/404 journeys in the single Chromium project |
| Smoke | `curl -f http://localhost:18000/health/ready` (backend) — frontend smoke is the build prerender crawl | Full Gate API port from `docker-compose.override.yml` |
| SAST / secrets / dependency audit | `pnpm audit:security` | Docker required for pinned Gitleaks 8.30.1 and Trivy 0.73.0; Semgrep 1.172.0 and pip-audit 2.10.1 run through uvx |
| Accessibility audit | `pnpm audit:a11y` | local Playwright/axe; foundation and not-found routes, serious/critical violations fail |
| Performance budget | `scripts/run-host-web-gate.sh bash -c 'pnpm --filter web build && pnpm audit:performance'` | restores the repository-owned `infraege-full-gate` web service on success/failure; local Chrome against `/` and `/ege/16-rekursiya`; median of 3, LCP ≤2.8s, CLS ≤0.1, TBT ≤200ms as lab proxy for INP |
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
  `unstubGlobals`); keep fake-timer and environment-variable cleanup beside the tests that own
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
├── apps/web/, apps/api/, infra/, ops/, content/, scripts/
└── AGENTS.md / CLAUDE.md       # AI agent rules
```

### Frontend layers (`apps/web/src/`) — pragmatic FSD-like, established in change 02

Architecture, code-shape, interaction and visual-system rules for this tree live in
[`docs/FRONTEND.md`](FRONTEND.md) — see `AGENTS.md` Core Rule 10.

```
app/         application providers, project-wide configuration, route states and global styles.
routes/      TanStack Start file-based routing (framework-fixed location). During the foundation
             reset it owns only thin route definitions and the generated route tree.
pages/       route-level composition and content that belongs to one page.
widgets/     reusable composite page chrome, including lesson navigation.
features/    reusable user-facing capabilities, including lesson practice and progress.
entities/    reusable domain concepts, including lesson semantics and learning visuals.
shared/      domain-agnostic config/lib plus local policy components owning semantic APIs and CSS;
             Base UI behavior stays an internal detail of those components.
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
`shared/api/schema.ts` with `pnpm api:generate`; prove no drift with `pnpm api:check`.

The lesson-progress feature is the one proven cross-route client-state owner: an app/provider-scoped
Zustand vanilla registry holds all lesson snapshots, persists them through the shared versioned
storage adapter and exposes semantic feature hooks. Course progress remains a pure derived selector
over that registry and is not persisted separately. Transient feature state stays in the owning
component or a slice-local model hook; no global service locator is used.

Route pending/error/not-found UI, delayed skeletons, and navigation progress are application-level
defaults. Browser render/route/chunk/global failures pass through `shared/lib/client-errors`, which
discards messages, page URLs, full stacks, and user data before posting a bounded fingerprint
event. Nginx applies a dedicated body/rate limit, FastAPI writes a structured journald event, and
sre-kit's `journal-http` adapter (with `parse_json_message` enabled) surfaces it as a labeled
event. Expected product errors remain local to their owner. Additional Base UI primitives or
component libraries are adopted only with a real consumer and a local semantic boundary.

### Backend modules (`apps/api/app/`) — DDD-like, established in change 02

```
main.py      create_app() factory.
api/         router.py — aggregates every module's router under one prefix (`/api`, not `/api/v1`
             — see docs/changes/archive/02-architecture-refactor.md's Contracts section for why).
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

## Common operations

```bash
# Start the stack
make dev

# Rebuild after changing image-owned configuration or dependencies
make rebuild

# Gracefully stop everything, preserving containers and PostgreSQL data for fast resume
make stop

# Explicitly remove the development containers and network; PostgreSQL data remains
make down

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
