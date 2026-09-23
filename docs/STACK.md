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
| Database | PostgreSQL 18.6, separate runtime/import/migration/backup roles; Alembic `122_01`, new isolated volume and current bank |
| Cache | — (not needed on M0) |
| Observability | Health, structured server logs, fail2ban and scheduled external availability/TLS probe |
| Infra | Application Docker Compose on Ubuntu 24.04: Nginx → web/API/PostgreSQL; systemd, journald, fail2ban, Restic |
| Package managers | uv (`apps/api`), pnpm workspace (`apps/web`, root) |
| Formatting | Prettier 3.9.6 exact for supported repository files; Ruff from the API lock for Python; EditorConfig for cross-editor whitespace defaults |
| CI/CD | GitHub Actions on pinned Ubuntu 24.04 runners: static/security/audit checks without tests; GHCR SHA images with SBOM/provenance; serialized SSH deploy with rollback triggered by `workflow_dispatch` with an explicit SHA; scheduled uptime/TLS probe. The `production` GitHub Environment has no required reviewers (architect decision, 2026-09-04) — image publish and deploy run unattended once dispatched; `can_admins_bypass` stays the only remaining safety property |

---

## Prerequisites

### Practice persistence

PostgreSQL 18.6, SQLAlchemy 2.0.52, Alembic 1.20.0 and asyncpg 0.31.0 are locked.
Schema `122_01` has current task JSON, separate private checker, lesson membership and file objects.
Runtime is SELECT-only; import/migration/backup use separate roles. Every datetime is timezone-aware.
No revision history, package engine, release import or automatic data migration remains.

`make dev` owns a NEW `infraege-dev_postgres122-data` volume; older volumes are retained.
`make practice-bootstrap` explicitly imports `content/practice-bank` into local dev, including
updates: export/backup operator edits before reimporting. `python3 scripts/practice-local.py export
/path/to/new-directory` exports the actual local bank and referenced files. This helper refuses
other container identities. Production import requires explicit protected credentials and the
[practice runbook](runbooks/practice.md); production transfer is not part of local `/work`.

Focused persistence acceptance: `cd apps/api && uv run pytest tests/test_minimal_bank.py`.
It creates/disposes an isolated PG18 instance, runs migrations and validates nonempty parity,
transaction rollback, HTTP privacy, checker, filters, paging, files and published lesson ordering.
No tests run in Docker or CI; Docker contains only PostgreSQL. Backup verification additionally
uses the shipped read-only `app.modules.practice.verify` and isolated restore machinery.
`node scripts/practice-registry.mjs --check` checks authored publication metadata.
Task files are persistent data (`infra/task-files.local` / `/var/lib/infraege/task-files`), outside cleanup.
See [backup](runbooks/backup-restore.md) and [transition](runbooks/practice-transition.md).

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
`make rebuild` remains the explicit force-rebuild command. Web source/public assets and API source use
development bind mounts; the API publication registry and migrations are image-owned. Use `make stop` for a fast resumable halt; use `make down` only when the
owned containers and network must be recreated. Both paths preserve the named PostgreSQL volume.

Lifecycle mutations are serialized for the `infraege-dev` Compose project: if a previous
`make dev`, `make rebuild`, `make stop`, `make down` or `make restart` is still running, a second
command fails immediately instead of racing the first one. Docker Desktop may also show a separate
`infra` project created by direct `docker compose` commands; the Make targets intentionally own
only `infraege-dev`. A failed start prints service status and recent nginx/web/api logs.

Lesson practice and the checker read only PostgreSQL through the API; web SSR uses the owning
typed adapter and `API_INTERNAL_URL` (`http://api:8000` in Compose). Topic and Course theory remain
content-as-code. Only `/` and `/ege` are prerendered; DB-dependent lesson/course pages are SSR.
Legacy `content/tasks` JSON remains only as historical test fixtures; it is neither packaged
into application images nor mounted/read at runtime.
`/practice` and `/practice/$taskId` use request-time API reads; standalone task progress uses its
own browser key and does not change lesson progress. `/sitemap.xml` is a runtime index with the
release-owned `/sitemap-static.xml` and bounded `/sitemap-practice/$page` partitions. Neither page
builds nor static publication metadata read the database. Practice API reads, SSR learning pages,
dynamic sitemaps and `/_serverFn` requests share one Nginx per-IP limit: 120/minute, burst 110,
immediate 429 on excess. The burst permits catalog navigation plus 100 inline task loads. Static
assets, unrelated pages and health do not consume it; checker retains its separate 20/minute,
burst 5 limit. Host-only servers bypass Nginx; public deployments must enter through Nginx.
Use explicit `make practice-bootstrap` after `make dev` for first local import;
[practice](runbooks/practice.md) documents backup setup. Dev PostgreSQL exposes an allocated
loopback-only port for host CLI/test access. Bootstrap applies the supplied bank; export operator edits before reimporting.

Production credentials and deployment: [production](runbooks/production.md).
Recovery: [backup and restore](runbooks/backup-restore.md).

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
blanket package-manager upgrades. If the current upstream image still contains a fixed security
finding, pin only the affected OS packages to exact patched versions in the Dockerfile, following
the existing API/Nginx pattern, and rerun image scanning. Remove such patches once a scanned base
image supplies the fix itself.

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
apply Prettier plus Ruff. ESLint stays a separate quality pass: `pnpm lint` checks root tooling
(`pnpm lint:tooling`: `scripts/**/*.mjs` and `lighthouserc.cjs`) and the web workspace. Web lint uses
a content-based cache; root tooling uses the locked web ESLint with a separate flat configuration
from repository root. `pnpm lint:fix` applies safe fixes to both. CI invokes the same `pnpm lint`. Web lint also
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

Use the supported gate runner and [verification runbook](runbooks/verification.md) to print
the plan and retain timing/status outside the worktree. A Critical plan that cannot map a
changed path requires an explicit affected-check decision; it never launches Full implicitly.
One parent owns the gate. Do not repeat it independently in every worker.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Format | `pnpm format:check` | run once for the target set; scope is repository-wide because formatting configuration is shared |
| Lint | `pnpm --filter web lint` · `pnpm lint:tooling` · `cd apps/api && uv run ruff check app tests migrations` · `pnpm lint:shell` · `bash -n <other-changed-shell-files>` | scope to touched workspace or scripts; `pnpm lint` combines root tooling and web |
| Type-check (affected) | `pnpm --filter web typecheck` · `cd apps/api && pnpm exec pyright app tests migrations` | app pyright reads `[tool.pyright]` in `apps/api/pyproject.toml`; shell changes have no type-check row |
| Focused tests | `pnpm --filter web exec vitest run <changed-test-files>` · `cd apps/api && uv run pytest <changed-test-files-or-nodeids>` · `bash scripts/tests/<changed-contract>.test.sh` · `pnpm test:content-assets` | run only tests directly covering changed behavior; `test:content-assets` owns the isolated task-asset validator contract while `validate:content` checks the real content tree; documentation-only changes are `SKIPPED`; never expand this row to the full suite |
| LSP diagnostics | available: yes | `python-lsp` (Pyright) and `typescript-lsp` MCP servers; repository type-check commands remain complementary gate evidence |
| API type regen (`openapi-typescript` or equivalent) | `pnpm api:check` | only when the public API surface or its generated consumer changed; fails on tracked drift |
| Repository hygiene | analyze required reports, then `make clean-dry-run && make clean && make clean-check` | always run last; the allowlist preserves dependencies, environments, secrets, authored evidence and data; never use `git clean -fdX` as a replacement |

---

## Full Gate

Run when explicitly requested through `/ship --full`, or when release risk selection falls
back to Full. It is intentionally expensive and is not part of routine task completion or
default local shipping. `/ship --release` selects affected coverage against the last verified
production SHA; an unknown baseline, shared dependencies, infrastructure or unmapped changes
require Full. Fresh security and Release Gate remain mandatory for every release.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Formatting | `pnpm format:check` | Prettier and Ruff; Markdown and generated/dependency-owned files are explicitly ignored |
| Infrastructure / bootstrap | `docker compose --project-name infraege-full-gate -f infra/docker-compose.yml -f infra/docker-compose.override.yml up --build -d` | The explicit project name and overlay ports `18080/13000/18000/15432` isolate the gate from unrelated Compose directories and common development ports. Verified live in change 03 on Docker Desktop/BuildKit: all four services become healthy; frontend and `/health` return 200 through Nginx. Change 02 also verified `POST /api/tasks/{id}/check` and the `/api/tasks/` rate limit (`503` past its burst — Nginx's default `limit_req_status`, not `429`) |
| Operations contracts | `bash scripts/tests/backup-restore.test.sh && bash scripts/tests/deploy-preflight.test.sh && bash scripts/tests/host-web-gate.test.sh && bash scripts/tests/host-access-policy.test.sh && bash scripts/tests/root-password-access.test.sh && bash scripts/tests/release-retention.test.sh && bash scripts/tests/web-image-build.test.sh` | local/fake transport only |
| Host Python contracts | `python3 -m unittest scripts.tests.application_db_test scripts.tests.deploy_orchestration_test scripts.tests.gate_test scripts.tests.release_checkpoint_test` | includes restore/deploy boundaries and verification orchestration; local fake transports |
| Migrations | `cd apps/api && uv run alembic upgrade head && uv run alembic current && uv run alembic check` | explicit isolated gate DB and migration-role URL; Compose runs its own separate migration job before API startup; never CI or production |
| Backend test suite | `cd apps/api && uv run pytest` | local only |
| API contract drift | `pnpm api:check` | requires the frozen API and pnpm environments; tracked schema and generated TypeScript must match |
| Frontend build | `scripts/run-host-web-gate.sh pnpm --filter web build` | temporarily stops only the `infraege-full-gate` Compose web service (host port 13000), runs the host build/prerender, then restores that service on success/failure; fails if any crawled page 500s |
| Frontend unit tests | `pnpm --filter web test` | local only |
| E2E lint / determinism | `pnpm --filter web exec playwright test --list` | local only, never CI'd; validates Playwright config/spec collection without running the journey |
| E2E (Playwright) | `pnpm --filter web test:e2e` | local only, never CI'd; starts local Vite + Uvicorn through Playwright `webServer` and verifies public routes, all published course lessons without JS, practice, degraded states, reading layout and accessibility in Chromium; requires the seeded isolated bank described below |
| Smoke | `curl -f http://localhost:18000/health/ready` (backend) — frontend smoke is the build prerender crawl | Full Gate API port from `docker-compose.override.yml` |
| Accessibility audit | covered by `pnpm --filter web test:e2e` above | complete E2E includes `e2e/accessibility.spec.ts`; do not run it twice. `pnpm audit:a11y` remains the focused command when E2E was not selected |
| Performance budget | `scripts/run-host-web-gate.sh pnpm audit:performance` | consumes the successful build above in the same verified run; rebuild if inputs or output changed. Restores the repository-owned `infraege-full-gate` web service on success/failure; local Chrome against `/`, `/ege`, `/courses`, `/courses/python` and `/ege/16-rekursiya`; median of 3, enforced LCP ceiling ≤4.0s, CLS ≤0.1, TBT ≤200ms as lab proxy for INP. LCP ≤2.8s remains the product target to restore when stable measurement and optimization evidence support tightening the gate |
| Content validation | `pnpm test:content-assets && pnpm validate:content` | the isolated validator tests reject unsafe paths and invalid asset metadata before the real-tree pass; `validate:content` checks Course/module/lesson membership and titles, generated publication registry, and the complete canonical bank through the API CLI (schema, lesson positions, theory material/section references and file bytes). Requires uv and the frozen API environment; no database or credentials. The legacy asset tests retain historical fixture coverage |
| SAST / secrets / dependency audit | `pnpm audit:security` | Docker required for pinned Gitleaks 8.30.1 and Trivy 0.73.0; Semgrep 1.172.0 and pip-audit 2.10.1 run through uvx |
| Repository hygiene | analyze all gate reports, then `make clean-dry-run && make clean && make clean-check` | always run last; Lighthouse removes its external Chrome profile on every exit, while this terminal step removes retained reports, builds and caches from the repository |

Tests remain local-only; the security command is also mirrored in GitHub Actions without invoking
pytest, Vitest or Playwright.

### Full Gate environment

Run in one host shell with the frozen pnpm/API environments installed. Use a fresh isolated
`infraege-full-gate` database; never supply production credentials or reuse development storage.
Before bootstrap, export `POSTGRES_USER=infraege`, `POSTGRES_DB=infraege` and distinct random
URL-safe values of at least 16 characters for `POSTGRES_PASSWORD`, `DB_RUNTIME_PASSWORD`,
`DB_IMPORT_PASSWORD`, `DB_MIGRATION_PASSWORD`, `DB_BACKUP_PASSWORD`. `openssl rand -hex 24`
generates a suitable value. Keep these process-scoped or in a mode-600 file outside Git; do not
print the environment or rendered Compose secrets. Set `TASK_FILES_DIR` to a dedicated absolute
temporary directory, `APP_ENV=development` and `DEPLOY_SHA=development`.

After bootstrap, wait for PostgreSQL/API/web/Nginx health and the successful migration job. From
`apps/api`, supply `MIGRATION_DATABASE_URL` using `infraege_migration` and host port 15432 for
the migration row. Import `../../content/practice-bank` through the host CLI with
`IMPORT_DATABASE_URL` for `infraege_import` on that same isolated database. The URL shape is
`postgresql://ROLE:PASSWORD@127.0.0.1:15432/infraege`; passwords come from the protected environment.
The migration job alone creates an empty schema and is not a seeded-bank acceptance.

For Playwright/axe, export the read-only `DATABASE_URL` for `infraege_runtime` on port 15432 and
retain `TASK_FILES_DIR`. For Lighthouse and host SSR, set
`API_INTERNAL_URL=http://127.0.0.1:18000`. Run security scans after browser/build/performance jobs
finish: generated trace/report files change during those jobs and can invalidate filesystem scans.
Keep the same environment for `run-host-web-gate.sh` so Compose interpolation succeeds. Finish
by stopping/removing only the owned gate containers/network, retaining data volumes, then perform
repository hygiene after reports have been analyzed. No test runner executes inside a container.

---

## Release Gate

Run only by `/ship --release`, after the selected release coverage has passed and the change is
merged locally. Prepublication checks run before push; published-image checks necessarily run
after push and before deploy. A failed publication check blocks deploy, not a fictitious undo
of an already completed push. See the [verification runbook](runbooks/verification.md).

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Published image build + scan | successful exact-SHA `images.yml` run, verified by release checkpoint tool | after push, before deploy: the workflow scans all three published digests for fixed HIGH/CRITICAL findings and emits SBOM/provenance. `pnpm audit:images` remains an optional local diagnostic, not a second mandatory build/scan |
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

## Interactive browser connection (WSL)

Playwriter CLI `~/.local/bin/playwriter` connects through the extension in ordinary
Windows Chrome, via the WSL relay on `localhost:19988`. Read the Playwriter skill
before running browser commands. The verified extension profile is `Default`;
this is local environment configuration, not a requirement for other machines.

On `extension_not_connected`, inspect Chrome processes first. Temporary
`playwright_chromiumdev_profile-*` profiles with `--disable-extensions` belong to
Playwright/MCP and cannot host this extension connection. Start the ordinary
profile if absent, then retry before choosing a fallback driver.

```bash
# Inspect browser parent processes and their profile/extension flags.
powershell.exe -NoProfile -Command 'Get-CimInstance Win32_Process | Where-Object Name -eq "chrome.exe" | Where-Object { $_.CommandLine -notmatch "--type=" } | Select-Object ProcessId,ExecutablePath,CommandLine | ConvertTo-Json -Depth 2'

# Start the normal profile if absent; do not close any existing browsers.
powershell.exe -NoProfile -Command 'Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--profile-directory=Default", "http://localhost:8080/practice"'

~/.local/bin/playwriter session new --tab-group test
# Use the returned ID, not a remembered session number.
~/.local/bin/playwriter -s ID -e 'await page.goto("http://localhost:8080/practice"); console.log(await page.title())'

# If still disconnected, check the WSL listener and Windows-to-WSL connectivity.
ss -ltnp 'sport = :19988'
powershell.exe -NoProfile -Command '(Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 http://127.0.0.1:19988).StatusCode'
~/.local/bin/playwriter logfile
```

If the relay is reachable but the extension remains disconnected, ask the user
to enable/click Playwriter on the target tab in that profile. Do not start a second
relay on Windows, reinstall tools, clear profiles, or terminate the user's Chrome.
A successful session plus a page-title/snapshot read proves the full connection;
a listening port alone does not. Explain any remaining failure before falling back.
The runtime guide is `~/.local/share/playwriter-runtime/README.md`.
Repository-prescribed automated Playwright tests keep their existing runner.

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

This local-only suite owns a production Node server at `127.0.0.2:3200` and checks desktop/mobile
readability with pending and failed fonts, plus mobile lesson-outline geometry while scripts are
held and then released. Supply `API_INTERNAL_URL` for the seeded local API. Normal E2E separately checks public routes and every
published Python lesson without JavaScript. Use a fresh production build for delivery evidence.
No decorative artwork or pixel-comparison infrastructure remains.

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

E2E requires a seeded bank. Prefer the isolated Full Gate database described above for release
verification. For ordinary development run `make dev` and explicit `make practice-bootstrap` first,
then provide the read-only runtime `DATABASE_URL` to the host runner, using the allocated
loopback port from `docker port infraege-dev-postgres-1 5432`. Set `TASK_FILES_DIR` to the absolute
local task-files directory for file delivery. Never point a test runner at production. No test
imports a synthetic bank into the persistent development volume.

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
after 150 ms, without a global pending screen, skeleton or minimum display delay. Expected product errors remain local to their owner. Additional Base UI primitives or
component libraries are adopted only with a real consumer and a local semantic boundary.

### Backend modules (`apps/api/app/`) — DDD-like, established in change 02

```
main.py      create_app() factory.
api/         router.py — aggregates every module's router under one prefix (`/api`, not `/api/v1`
             — see SPEC §4 for the current API contract).
core/        cross-cutting infra with no HTTP surface of its own: config (Settings), exceptions
             (AppException base), logging (structlog), middleware (request IDs and request logging). Modules may import from core/; core/ must not import modules/.
modules/     one package per bounded context — health/, content/, tasks/, practice/. Each holds only the
             files it needs: api.py (routes), service.py (logic), schemas.py (Pydantic DTOs),
             exceptions.py (module-specific AppException subclasses).
shared/      cross-module code used by >= 2 modules — stays an empty placeholder until that's
             actually true; do not pre-populate it.
```

`core/database.py` owns engine construction and shared metadata. `modules/practice/` owns typed
models, content validation, immutable files, one transactional import/export and a host CLI.
Migrations live in `apps/api/migrations/`. Public projections exclude checker/private provenance.
The checker requires the displayed solution revision; the counter advances on solution-affecting
edits. There is no audit history or concurrent editorial workflow.

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
python3 -m unittest discover -s scripts/tests -p gate_test.py
python3 -m unittest discover -s scripts/tests -p release_checkpoint_test.py
```

The optional snapshot integration test requires an explicitly selected `PRACTICE_BACKUP_CONTAINER`; never run it in CI. `pnpm format:check` includes maintenance Python. Lint from `apps/api` with
`uv run ruff check ../../scripts/application_db.py ../../scripts/lib/application_db
../../scripts/tests/application_db_test.py ../../scripts/tests/deploy_orchestration_test.py`.

Gate/checkpoint tooling follows the same stdlib-only boundary. Its focused lint command is
`cd apps/api && uv run ruff check ../../scripts/gate.py ../../scripts/lib/gate
../../scripts/tests/gate_test.py ../../scripts/release-checkpoint.py ../../scripts/release_checkpoint.py
../../scripts/tests/release_checkpoint_test.py`. These checks exercise fake commands/transports;
testing orchestration does not require running application Full Gate or contacting production.
See [verification](runbooks/verification.md) and [agent workflow](runbooks/agent-workflow.md).


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
