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

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TanStack Start (SSR/SSG, file-based routing and automatic route splitting) on Vite **8.2.1 exact** (Rolldown/Oxc); Base UI **1.7.0 exact** with local CSS Modules; Zustand **5.0.12 exact** for the cross-route lesson-progress registry; synchronous Python tokenization through `@speed-highlight/core` **2.0.0 exact**; TanStack Query for future server state; generated `openapi-typescript` contracts with `openapi-fetch` transport |
| Backend | Python/FastAPI (`apps/api`) |
| Database | Application PostgreSQL 18.6, pinned multi-platform image; separate runtime/import/migration/backup roles, Alembic revision `114_01` and server-owned practice model/tooling. Existing lesson consumers remain git-based until cutover (SPEC §3). Live production remains PG16 until explicit release transfer |
| Cache | — (not needed on M0) |
| Observability | `infraegev2/ops` owns the target lifecycle, explicit browser consent, allowlisted product events and coarse traffic aggregates. First-party sibling [sre-kit](https://github.com/avatarsik6699/sre-kit) Change 22 owns Projects, pull/push ingestion, retention, alerts and every monitoring/analytics dashboard. Host metrics and fail2ban use the accepted root/password SSH contract; journal logs, Beszel and Umami use WireGuard; push uses a Source token kept outside git |
| Infra | Two Docker Compose projects on one VPS: application Nginx → `web`/`api`/Postgres, plus independently pinned Umami/Beszel operations services; Ubuntu 24.04, systemd, journald, fail2ban, WireGuard, Restic |
| Package managers | uv (`apps/api`), pnpm workspace (`apps/web`, root) |
| Formatting | Prettier 3.9.6 exact for supported repository files; Ruff from the API lock for Python; EditorConfig for cross-editor whitespace defaults |
| CI/CD | GitHub Actions on pinned Ubuntu 24.04 runners: static/security/audit checks without tests; GHCR SHA images with SBOM/provenance; serialized SSH deploy with rollback triggered by `workflow_dispatch` with an explicit SHA; scheduled uptime/TLS probe. The `production` GitHub Environment has no required reviewers (architect decision, 2026-09-04) — image publish and deploy run unattended once dispatched; `can_admins_bypass` stays the only remaining safety property |

---

## Prerequisites

### Practice foundation and approved persistence stack

Architect-approved 2026-09-12; SPEC §3.2/§8.1/§9.2. The Stack table above describes the running
file-based lesson-task baseline. Change 113 implements the PostgreSQL foundation locally;
Change 114 adds the Python persistence layer and operator tooling. Subsequent changes switch task
consumers. The exact Python package versions below are installed and locked. Production transfer
is a separate explicit release operation.

| Component | Approved target | Delivery |
|-----------|-----------------|----------|
| Application PostgreSQL | 18.6 | implemented `18.6-alpine3.24@sha256:d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2`; same version for dev/test/restore; independent of operations PostgreSQL |
| SQLAlchemy | 2.0.52 with `asyncio` extra | exact direct dependency and frozen uv lock; typed 2.x mappings, request/operation-local sessions |
| Alembic | 1.20.0 | exact dependency; migration files in Git; separately invoked release step, never process-start autogeneration |
| asyncpg | 0.31.0 | exact dependency; explicit PostgreSQL async driver |
| Pillow | 12.3.0 | exact dependency for bounded full image decoding during import; bytes are preserved |
| Python | existing 3.12 runtime | these package requirements are compatible; no Python major/minor upgrade follows from this change |

Research sources (checked 2026-09-12): [PostgreSQL releases](https://www.postgresql.org/support/versioning/),
[official image layout](https://raw.githubusercontent.com/docker-library/docs/master/postgres/README.md),
[SQLAlchemy releases](https://www.sqlalchemy.org/download.html),
[Alembic changes](https://alembic.sqlalchemy.org/en/latest/changelog.html),
[asyncpg 0.31 support](https://raw.githubusercontent.com/MagicStack/asyncpg/v0.31.0/README.rst),
[Pillow 12.3.0](https://pypi.org/project/pillow/12.3.0/).
SQLAlchemy 2.1.0rc2 and PostgreSQL 19 Beta 3 are not the production target.

The PG18 mount is `/var/lib/postgresql`, with `PGDATA=/var/lib/postgresql/18/docker`.
Use a new volume and rehearsed logical dump/restore for the 16 → 18 transition; do not repoint
the new binary at the old PG16 data directory. Verify ownership/roles and real data before cutover.
Keep the old volume until separately authorized cleanup; it ceases to be current after PG18 writes.

Operational interfaces (full options and release limits in the backup/production runbooks):

- Foundation: `make db-inventory`, `make db-backup`, `make db-restore-check`, `make db-export`;
  implemented; every target selects explicit environment/project/credentials and prints sanitized identity.
  Inventory is read-only, restore-check targets a disposable instance, export creates a portable
  bundle for manual download. The production switch remains an explicit release operation.
- Schema phase: `cd apps/api && uv run alembic upgrade head`, `uv run alembic current`,
  `uv run alembic check`; use the selected environment and separate migration credentials.
  Implemented in Change 114; require explicit `MIGRATION_DATABASE_URL` with the migration role.
  Default developer configuration does not select production. Review generated migrations, maintain one head and name constraints.
- Task tooling: `uv run python -m app.modules.practice.cli` supports export/validate/diff/apply/import,
  outcome, register, preflight and smoke. Explicit environment/project/role inputs are required;
  see [practice operator guide](runbooks/practice.md) for package preparation and backup sequencing.

Practice model acceptance: host-run tests against isolated PostgreSQL (never SQLite substitution for DB
contracts); fresh and populated migration paths, concurrency/rollback, constraints, JSONB and
timezone-aware datetimes; backup/restore including roles, task files and the shipped checker.
Apply the KNOWN_GOTCHAS timezone-aware SQLAlchemy column convention. Gates include schema drift
checks on the isolated instance; CI remains test-free and never contacts production DB.
Runtime readiness now authenticates and verifies SQL/schema compatibility under a shared lock;
liveness stays independent. The separate `db-migrate` Compose job gates API startup. All tests, dumps and reports obey the existing hygiene/permission contract.

Foundation acceptance: `bash scripts/tests/practice-db-foundation.test.sh` requires host `restic`,
Docker, jq and PostgreSQL images. It uses isolated nonempty PG16/PG18 fixtures, actual SQL role/data
assertions, encrypted backup/export and the same transfer code as release. No test runner runs in
Docker or CI. Additional focused contracts: `bash scripts/tests/backup-restore.test.sh`,
`bash scripts/tests/deploy-preflight.test.sh`, `bash scripts/tests/docker-dev-lifecycle.test.sh`,
`bash scripts/tests/production-ops-topology.test.sh`. These are Change 113 acceptance additions to
the affected-area Critical Gate, not an instruction to run the Full Gate.

`infra/.env.example` declares bootstrap and four distinct role passwords. Generate production
role passwords independently with `openssl rand -hex 24`; runtime passwords must be URL-safe.
`make dev` injects separate disposable local values. Full Gate/test callers must supply their own
`DB_RUNTIME_PASSWORD`, `DB_IMPORT_PASSWORD`, `DB_MIGRATION_PASSWORD`, `DB_BACKUP_PASSWORD`, plus
the existing bootstrap credentials. `make config` remains secret-free. `DATABASE_URL` exposes only
the read-only runtime identity to API; bootstrap/import/migration/backup credentials remain in the
database/maintenance boundary. Alembic/schema readiness and task/file/checker restore verification are implemented locally.
Production installation remains an explicit release operation; existing lesson cutover is pending.


Practice model acceptance: `bash scripts/tests/practice-model-tooling.test.sh` uses host
uv/pytest/Restic and disposable PostgreSQL/application containers. It proves the separate
migration job and HTTP health, fresh/populated migrations and drift detection, concurrency,
interrupted imports, roles, CLI export/edit/apply and nonempty restore with the shipped checker.
Tests never run in containers. `node scripts/practice-registry.mjs --check` detects release-registry
drift locally and in static CI; it never contacts a DB. Formatting/lint/type-check include migrations.
Task files use `infra/task-files.local` in dev and `/var/lib/infraege/task-files` in production;
these are persistent data, outside the repository cleanup allowlist.

### Current prerequisites

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

The web and API lesson loaders read only git-owned practice tasks through `CONTENT_DIR`. Compose mounts
`content/tasks/` read-only at `/content/tasks`; web development and production images contain the
same task subtree at that path. Host commands fall back to the workspace `content/` path. Lesson
theory is compiled from `apps/web/src/entities/lesson/content/*.lesson.tsx` and is never mounted as
runtime content. Course and Topic theory/registries remain frontend content-as-code; the API image
and development bind mount carry only `content/tasks/`.

Production commands and credential onboarding live in [production](runbooks/production.md).
Target/management/workstation ownership, Source reconciliation and publisher lifecycle live in
[analytics](runbooks/analytics.md); recovery lives in [backup and restore](runbooks/backup-restore.md).
Use `make tunnel-{up,down,status}`, `make ops-{config,status,install,update,rollback}` and
`make sre-management ACTION=…` only with the inputs and scope defined by those runbooks.

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
the TypeScript language service at `apps/web/node_modules/typescript/lib`; the web workspace
resolves that SDK from the frozen pnpm lockfile. Accept VS Code's workspace-TypeScript
prompt (or run **TypeScript: Select TypeScript Version** and choose **Use Workspace Version**) so
the status bar no longer reports VS Code's bundled TypeScript version.

The workspace also recommends the ESLint, Prettier, Python, Ruff, and Playwright extensions used by the
repository. Its shared settings select `apps/api/.venv`, expose the API pytest suite in Test
Explorer, give the web workspace the correct ESLint working directory, update imports on
file moves, formats supported source/config files with the repository-local Prettier or Ruff on
save, and applies repository-backed lint fixes on explicit save. The web flat ESLint config
also pins `parserOptions.tsconfigRootDir` to its own directory for every TypeScript extension,
including contracts, tests, and root-level configs; this is required because the long-lived
extension process can otherwise infer a different config root. Markdown remains
outside the Prettier boundary and is exempt from trailing-whitespace removal because authored
wrapping and two spaces can be meaningful. Personal UI, theme, font, autosave, and experimental
settings remain user-level choices.

Repository-wide commands are `pnpm format:check` for the non-mutating gate and `pnpm format` to
apply Prettier plus Ruff. ESLint stays a separate quality pass: `pnpm lint` checks root tooling and the web workspace with content-based caches, while `pnpm lint:fix` applies its safe fixes. Web lint also
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
| Lint | `pnpm --filter web lint` · `cd apps/api && uv run ruff check app tests migrations` · `pnpm lint:shell` · `bash -n <other-changed-shell-files>` | scope to touched workspace or scripts |
| Type-check (affected) | `pnpm --filter web typecheck` · `cd apps/api && pnpm exec pyright app tests migrations` | app pyright reads `[tool.pyright]` in `apps/api/pyproject.toml`; shell changes have no type-check row |
| Focused tests | `pnpm --filter web exec vitest run <changed-test-files>` · `cd apps/api && uv run pytest <changed-test-files-or-nodeids>` · `bash scripts/tests/<changed-contract>.test.sh` · `pnpm test:content-assets` | run only tests directly covering changed behavior; `test:content-assets` owns the isolated task-asset validator contract while `validate:content` checks the real content tree; documentation-only changes are `SKIPPED`; never expand this row to the full suite |
| LSP diagnostics | available: yes | `python-lsp` (Pyright) and `typescript-lsp` MCP servers; repository type-check commands remain complementary gate evidence |
| API type regen (`openapi-typescript` or equivalent) | `pnpm api:check` | only when the public API surface or its generated consumer changed; fails on tracked drift |
| Repository hygiene | analyze required reports, then `make clean-dry-run && make clean && make clean-check` | always run last; the allowlist preserves dependencies, environments, secrets, authored evidence and data; never use `git clean -fdX` as a replacement |

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
| Migrations | `cd apps/api && uv run alembic upgrade head && uv run alembic current && uv run alembic check` | explicit isolated gate DB and migration-role URL; Compose runs its own separate migration job before API startup; never CI or production |
| Backend test suite | `cd apps/api && uv run pytest` | local only |
| API contract drift | `pnpm api:check` | requires the frozen API and pnpm environments; tracked schema and generated TypeScript must match |
| Frontend build | `scripts/run-host-web-gate.sh pnpm --filter web build` | temporarily stops only the running Full Gate `infra` Compose web service that owns host port 3000, restores it on success/failure, then runs TanStack Start's build-time prerender; fails if any crawled page 500s |
| Frontend unit tests | `pnpm --filter web test` | local only |
| E2E lint / determinism | `pnpm --filter web exec playwright test --list` | local only, never CI'd; validates Playwright config/spec collection without running the journey |
| E2E (Playwright) | `pnpm --filter web test:e2e` | local only, never CI'd; starts local Vite + Uvicorn through Playwright `webServer` and verifies the foundation/404 journeys in the single Chromium project |
| Smoke | `curl -f http://localhost:18000/health/ready` (backend) — frontend smoke is the build prerender crawl | Full Gate API port from `docker-compose.override.yml` |
| SAST / secrets / dependency audit | `pnpm audit:security` | Docker required for pinned Gitleaks 8.30.1 and Trivy 0.73.0; Semgrep 1.172.0 and pip-audit 2.10.1 run through uvx |
| Accessibility audit | `pnpm audit:a11y` | local Playwright/axe; foundation and not-found routes, serious/critical violations fail |
| Performance budget | `scripts/run-host-web-gate.sh bash -c 'pnpm --filter web build && pnpm audit:performance'` | restores the repository-owned `infraege-full-gate` web service on success/failure; local Chrome against `/`, `/ege`, `/courses`, `/courses/python` and `/ege/16-rekursiya`; median of 3, enforced LCP ceiling ≤4.0s, CLS ≤0.1, TBT ≤200ms as lab proxy for INP. LCP ≤2.8s remains the product target to restore when stable measurement and optimization evidence support tightening the gate |
| Content validation | `pnpm test:content-assets && pnpm validate:content` | the isolated validator tests reject unsafe paths and invalid asset metadata before the real-tree pass; docs/SPEC.md §2.2/§3/§7.2 validation also checks Course/module/lesson membership and titles, `practiceTaskIds`, `topic_ids`, `course_lesson_ids`, `theory_links.hash`, task asset metadata and exclusive task ownership |
| Repository hygiene | analyze all gate reports, then `make clean-dry-run && make clean && make clean-check` | always run last; Lighthouse removes its external Chrome profile on every exit, while this terminal step removes retained reports, builds and caches from the repository |

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
| `gh` repository/environment | `gh auth status && gh repo view avatarsik6699/infraegev2` | verify the documented no-reviewer production policy, `can_admins_bypass`, and required secrets/vars |

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

### Layout stability (focused production browser suite)

```bash
scripts/run-host-web-gate.sh pnpm --filter web build
pnpm --filter web test:layout
```

This local-only suite owns a production Node server at `127.0.0.2:3200` and tests the four
public discovery/overview routes with held fonts, images and JavaScript, stored progress,
plus no-JS, whole-document network/CPU throttling and pixel comparisons of pending/failed
artwork. Its domain Page Object owns geometry/CLS and paint instrumentation; normal dev E2E
excludes this spec. Apply the affected-case review matrix in [FRONTEND §4.2](FRONTEND.md#42-loading-visual-stability)
when changing delivery, hydration, page geometry or filter/effect behavior. Run against a fresh
production build: dev HMR or a settled screenshot alone cannot verify these loading contracts.
It does not run a full performance gate or change the CLS/LCP thresholds.

`pnpm images:generate` regenerates only `public/{images/course-catalog,images/course-overview,topics}/responsive`
WebP derivatives from the original checked-in artwork. It uses host FFmpeg/libwebp (the same
host conversion capability as `brand:generate`), Lanczos resizing, quality 85, compression level 6;
no original/reference is overwritten. There is no new runtime dependency. Regeneration requires
FFmpeg; normal application build/deploy copies the checked-in derivatives.

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
│   └── playbooks/            # plan.md / work.md / ship.md
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

Route error/not-found UI and delayed navigation progress are application-level defaults.
Client transitions keep the current page until the next route is ready; the progress bar appears
after 150 ms, without a global pending screen, skeleton or minimum display delay. Browser render/route/chunk/global failures pass through `shared/lib/client-errors`, which
discards messages, page URLs, full stacks, and user data before posting a bounded fingerprint
event. Nginx applies a dedicated body/rate limit, FastAPI writes a structured journald event, and
sre-kit's `journal-http` adapter (with `parse_json_message` enabled) surfaces it as a labeled
event. Expected product errors remain local to their owner. Additional Base UI primitives or
component libraries are adopted only with a real consumer and a local semantic boundary.

### Backend modules (`apps/api/app/`) — DDD-like, established in change 02

```
main.py      create_app() factory.
api/         router.py — aggregates every module's router under one prefix (`/api`, not `/api/v1`
             — see SPEC §4 for the current API contract).
core/        cross-cutting infra with no HTTP surface of its own: config (Settings), exceptions
             (AppException base), logging (structlog), middleware (request-id + error alerting),
             structured logging). Modules may import from core/; core/ must not import modules/.
modules/     one package per bounded context — health/, content/, tasks/. Each holds only the
             files it needs: api.py (routes), service.py (logic), schemas.py (Pydantic DTOs),
             exceptions.py (module-specific AppException subclasses).
shared/      cross-module code used by >= 2 modules — stays an empty placeholder until that's
             actually true; do not pre-populate it.
```

`core/database.py` owns engine construction and shared metadata. `modules/practice/` owns typed
models, package/content validation, immutable files, transaction service and host CLI; migrations
live in `apps/api/migrations/`. The existing file-based HTTP checker remains until consumer
cutover; both consume the pure comparator in `app/shared/checker.py`. Current normalized rows own
reads; history is audit-only. Public content and edit plans have explicit types. Every mapped datetime uses
`DateTime(timezone=True)` (KNOWN_GOTCHAS); no hidden commits or shared AsyncSessions.

### Application maintenance code

Keep Bash as explicit command/lifecycle adapters. Structured backup metadata, checksums,
references, exported-snapshot consistency and restore invariants belong to the stdlib-only
`scripts/lib/application_db/` package, invoked by `scripts/application_db.py`. Keep the existing
Make interface and bundle compatibility; do not introduce an SDK/service/framework for host tools.
Production hosts require Python 3.12+ (Ubuntu 24.04 supplies it). Shell static checks require
ShellCheck >=0.9; `pnpm lint:shell` checks the declared maintenance allowlist and runs in static CI.
A shell syntax check is not evidence that rollback runs: test the installed failure boundary.
`EXIT` recovery preserves the original failure and invokes/health-checks rollback once.

Maintenance checks (host-only, from repository root):

```bash
pnpm lint:shell
pnpm exec pyright --project scripts/pyrightconfig.json
python3 -m unittest discover -s scripts/tests -p application_db_test.py
python3 -m unittest discover -s scripts/tests -p deploy_orchestration_test.py
```

The snapshot test requires `PRACTICE_BACKUP_CONTAINER` and is run by the isolated
`practice-model-tooling.test.sh` fixture, never by CI. `pnpm format:check` includes maintenance Python. Lint from `apps/api` with
`uv run ruff check ../../scripts/application_db.py ../../scripts/lib/application_db
../../scripts/tests/application_db_test.py ../../scripts/tests/deploy_orchestration_test.py`.


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
make clean-dry-run
make clean
make clean-check

# Add a new migration / schema change
# Use explicit MIGRATION_DATABASE_URL with the migration role; see runbooks/practice.md

# Format / lint
cd apps/web && pnpm lint
cd apps/api && uv run ruff check app tests
```

## Change history

`python3 scripts/change_history.py inspect` validates ordinary/compacted history and reports the
active file, covered range and next number. `python3 scripts/change_history.py next` refuses
planning until the active change is shipped. COMPACTED.md is not an active change. Numbering uses
`max(covered_through, active numbers, remaining archived numbers) + 1` (at least two digits).

For approved initial compaction, list exact repository-relative files in a temporary sorted path
file, then run `python3 scripts/change_history.py snapshot <full-source-sha> <covered-through>
<paths-file>`. The source must contain every represented original; output is JSON metadata for one
`<!-- compacted-metadata -->` fenced `json` block in `docs/changes/archive/COMPACTED.md`. The command
compares every local file byte-for-byte with its Git blob, rejects symlinks/unsafe paths and checks
complete archive coverage, including explicitly missing numbers. It does not remove any file.
The digest binds ordered paths and their SHA-256 blob hashes. Add compact human-readable decisions,
risks and approvals beside the metadata before deleting only verified originals. A later compaction
must preserve prior source snapshots; this initial format deliberately rejects incomplete coverage.

Read original content without overwriting the checkout:

```bash
python3 scripts/change_history.py read docs/changes/archive/01-project-foundation.md
# Or inspect another exact source_paths entry from COMPACTED.md.
```

Binary reads write exact bytes to stdout; redirect to a new temporary path when needed. The recorded
full source SHA is immutable, independent of branch/tag movement. This is local Git preservation,
not an off-site backup. Missing source objects (including shallow clones) stop the tool: fetch the
recorded commit/full history from a trusted copy and rerun; never substitute HEAD or reset numbering.
After normal ship, rerun `inspect` to verify ordinary archive + compacted coverage still agree.

Tooling gate: `python3 -m unittest discover -s scripts/tests -p change_history_test.py`;
`cd apps/api && uv run ruff check ../../scripts/change_history.py ../../scripts/tests/change_history_test.py`;
`cd apps/api && uv run ruff format --check ../../scripts/change_history.py ../../scripts/tests/change_history_test.py`;
`pnpm exec pyright scripts/change_history.py scripts/tests/change_history_test.py`; Python LSP.
These are stdlib-only tooling checks; no app runtime, browser, API or deployment is involved.
