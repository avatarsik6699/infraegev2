# Stack Guide

> **Source of truth for this project's concrete technologies, tools, commands and gate tables.**
> `docs/playbooks/work.md` reads the [Critical Gate](#critical-gate) and
> [Required Tooling](#required-tooling) tables; `docs/playbooks/ship.md` reads the Critical,
> [Full Gate](#full-gate) and [Release Gate](#release-gate) tables. Gate policy (what to select and
> when) lives in the [verification runbook](runbooks/verification.md). Keep these tables accurate.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TanStack Start (SSR/SSG, file-based routing and automatic route splitting) on Vite **8.2.1 exact** (Rolldown/Oxc); Base UI **1.7.0 exact** with local CSS Modules; Zustand **5.0.12 exact** for the cross-route lesson-progress registry; synchronous Python tokenization through `@speed-highlight/core` **2.0.0 exact**; TanStack Query for future server state; generated `openapi-typescript` contracts with `openapi-fetch` transport |
| Backend | Python/FastAPI (`apps/api`) |
| Database | PostgreSQL 18.6, separate runtime/app/import/migration/backup roles; Alembic `191_01`, additive account/progress schema and generated catalog columns on the isolated bank volume |
| Observability | Health, structured server logs, fail2ban and scheduled external availability/TLS probe |
| Infra | Application Docker Compose on Ubuntu 24.04: Nginx → web/API/PostgreSQL; systemd, journald, fail2ban, Restic |
| Package managers | uv (`apps/api`), pnpm workspace (`apps/web`, root) |
| Formatting | Prettier 3.9.6 exact for supported repository files; Ruff from the API lock for Python; EditorConfig for cross-editor whitespace defaults |
| CI/CD | GitHub Actions on pinned Ubuntu 24.04 runners: static quality through `scripts/gate.py` groups, weekly/manual security and browser audits, GHCR SHA images with SBOM/provenance, and serialized explicit-SHA deploy with rollback. The `production` GitHub Environment has no required reviewers (architect decision, 2026-09-04) — image publish and deploy run unattended once dispatched; `can_admins_bypass` stays the only remaining safety property |

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
shellcheck --version      # shell static checks: >=0.9
```

### Practice persistence

PostgreSQL 18.6, SQLAlchemy 2.0.52, Alembic 1.20.0 and asyncpg 0.31.0 are locked. Schema `191_01`
retains task JSON, private checker, lesson membership and file objects and adds accounts,
identities, credentials, sessions, one-time tokens, provider challenges and per-context solved
results. `infraege_runtime` is SELECT-only on the bank and has no account-table rights;
`infraege_app` has narrow account/progress writes and checker reads. Import/migration/backup use
separate roles. Every datetime is timezone-aware. No revision history, package engine, release
import or automatic data migration exists.

`make dev` owns the dedicated `infraege-dev_postgres122-data` volume; lifecycle commands preserve
it. `make practice-bootstrap` explicitly imports `content/practice-bank` into local dev, including
updates: export operator edits first with `python3 scripts/practice-local.py export
/path/to/new-directory` (it refuses other container identities). Production import requires
protected credentials and the [practice runbook](runbooks/practice.md). Task files are persistent
data (`infra/task-files.local` / `/var/lib/infraege/task-files`), outside cleanup.

Focused persistence acceptance: `cd apps/api && uv run pytest tests/test_minimal_bank.py` creates
and disposes an isolated PG18 instance, runs migrations and validates parity, rollback, HTTP
privacy, checker, filters, paging, files and lesson ordering. Disposable databases run in Docker;
test processes stay on the host. `node scripts/practice-registry.mjs --check` checks authored
publication metadata. Backup: [backup and restore](runbooks/backup-restore.md).

---

## Initial setup

```bash
pnpm install --frozen-lockfile
make dev
```

`make dev` supplies disposable process-scoped local values, starts or resumes the development
overlay, waits for every healthcheck and requires no `.env`. It fingerprints dependency manifests,
lockfiles, Dockerfiles, Vite configuration and other image-owned inputs and rebuilds only when they
change; `make rebuild` forces a rebuild. Web source/public assets and API source use bind mounts;
the API publication registry and migrations are image-owned. `make stop` halts resumably; `make
down` removes the owned containers and network. Both preserve the PostgreSQL volume. Lifecycle
commands for the `infraege-dev` project are serialized: a second concurrent command fails
immediately. Direct `docker compose` commands may create a separate `infra` project; Make owns only
`infraege-dev`. A failed start prints service status and recent nginx/web/api logs.

With `athanor.yaml` in the checkout, `make dev`, `make rebuild` and `make restart` run through the
Athanor CLI and require nonempty `SMTP_USERNAME` and `SMTP_PASSWORD` in its vault (Postbox defaults:
`SMTP_HOST=postbox.cloud.yandex.net`, `SMTP_PORT=587`, `MAIL_FROM=accounts@kodumka.ru`). A missing
CLI, locked vault or incomplete credentials fails before Docker changes anything. Without the
manifest the no-mail development path remains. `athanor.yaml` and `secrets.enc.yaml` are ignored
local files, never release inputs; no plaintext SMTP secret is written to a tracked file.

Lesson practice and the checker read only PostgreSQL through the API; web SSR uses the owning typed
adapter and `API_INTERNAL_URL` (`http://api:8000` in Compose). Topic and Course theory are
content-as-code. Only `/` and `/ege` are prerendered; DB-dependent pages are SSR. Legacy
`content/tasks` JSON is historical test fixtures only, never packaged or read at runtime.
`/practice` and `/practice/$taskId` use request-time API reads; signed-in standalone progress is
account-owned and context-separated from lesson progress; guests are checked without saved
progress. `/sitemap.xml` indexes the release-owned `/sitemap-static.xml` and bounded
`/sitemap-practice/$page` partitions. Practice API reads, SSR learning pages, dynamic sitemaps and
`/_serverFn` share one Nginx per-IP limit (120/minute, burst 110, immediate 429); static assets,
unrelated pages and health do not consume it; the checker keeps its own 20/minute, burst 5 limit.
Public deployments must enter through Nginx. Run `make practice-bootstrap` after the first `make
dev`. Dev PostgreSQL exposes an allocated loopback-only port for host CLI/test access.

Production: [production](runbooks/production.md). Recovery: [backup and restore](runbooks/backup-restore.md).

### pnpm workspace policy

The root `packageManager` and workspace policy pin pnpm 10.33.0, model compatibility against the
Node 22.13 minimum while CI and images use the pinned Node 22 maintenance patch, reject invalid peers
and stale `node_modules` before scripts, and fail on unreviewed dependency build scripts. The only
approved install script is the exact locked `esbuild@0.28.2`; an update must be approved
explicitly. Supply-chain cooldown, provenance downgrade prevention, exotic transitive-source
blocking and frozen-lockfile installs remain in force; pnpm does not repair stale dependencies as a
side effect of `pnpm run`.

Production Dockerfiles and third-party Compose images use a readable tag plus an immutable
multi-platform digest. Dependabot monitors Dockerfiles, Compose, locks, Python dependencies and
SHA-pinned Actions weekly; updates still require gates and review. The image gate uses `--pull`
so a missing or revoked digest fails closed. Never use floating `latest` tags or blanket upgrades.
If the current upstream image still contains a fixed security finding, pin only the affected OS
packages to exact patched versions (existing API/Nginx pattern), rescan, and remove the pin once a
scanned base image supplies the fix.

### Editor

The tracked `.vscode/settings.json` points the TypeScript language service at
`apps/web/node_modules/typescript/lib` (choose **Use Workspace Version**), selects
`apps/api/.venv`, and formats with the repository Prettier/Ruff. The web ESLint config pins
`parserOptions.tsconfigRootDir` to its own directory for every TypeScript file. Markdown stays
outside Prettier and keeps trailing whitespace. `.editorconfig` covers other editors.

`pnpm format:check` / `pnpm format` run Prettier plus Ruff over the API and the host-Python list.
`pnpm lint` runs root tooling (`pnpm lint:tooling`: `scripts/**/*.mjs`, `lighthouserc.cjs`) and the
web workspace, whose lint also runs typed production rules and executable E2E/platform policy
self-tests. `pnpm lint:fix` applies safe fixes to both.

---

## Gate command groups

`scripts/gate.py` is the one command source for local gates and CI (`.github/workflows/quality.yml`):

```bash
python3 scripts/gate.py affected [--base main]   # suggest groups and reminders for changed paths
python3 scripts/gate.py run --group web-lint --group web-typecheck [--keep-going]
python3 scripts/gate.py checks                    # list every group and its command
```

`run` prints one `group PASS/FAIL seconds` line per group and, on failure, the last 40 log lines;
the full output is in `.output/gate/<group>.log` (removed by `make clean`). `affected` is advisory:
it maps changed, staged and untracked paths to groups and prints focused-test/browser reminders
and paths that need an explicit coverage decision. It never caches a result.

Host Python (outside `apps/api`) has one list: `scripts/pyrightconfig.json` `include` for Pyright,
plus Ruff-only Pillow tooling (`scripts/mascot`) declared in
`scripts/lib/gate/core.py`. `python3 scripts/gate.py host-python` prints it for Ruff.

---

## Critical Gate

Run once after the complete target set of a `/work` invocation; local `/ship` reruns only rows whose
inputs changed or whose evidence is missing. Start from `python3 scripts/gate.py affected`, run the
suggested groups once, then the focused rows below. Report every inapplicable row as `SKIPPED` with a
reason. An unknown path requires an explicit coverage decision; it never launches Full. One parent
owns the gate.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Static groups | `python3 scripts/gate.py run --group …` from `affected` | `format`, `python-format`, `*-lint`, `*-typecheck`, `host-*`, `shell-lint`, `docs-links`, `content-static`, `lesson-media`, `paid-leak`, `infra-config`, `api-contract` as suggested; web typecheck covers `src`, `tests`, `e2e` and Playwright configs; `paid-leak` builds the web and fails when paid lesson text appears outside the gated `assets/paid/` chunks (Change 192) |
| Focused tests | `pnpm --filter web exec vitest run <changed-test-files>` · `cd apps/api && uv run pytest <changed-test-files-or-nodeids>` · `bash scripts/tests/<changed-contract>.test.sh` · `python3 -m unittest scripts.tests.<module>` | only tests directly covering changed behavior; documentation-only changes are `SKIPPED`; never expand this row to the full suite |
| LSP diagnostics | available: yes | `python-lsp` (Pyright) and `typescript-lsp` MCP servers are auxiliary changed-file diagnostics; repository compiler/type-check commands are binding |
| Repository hygiene | analyze required reports, then `make clean` | always last for code/test/build sessions; it removes allowlisted outputs and fails if any remain; lint/test caches stay. Docs-only sessions skip it. Never use `git clean -fdX` |

---

## Full Gate

Run only on explicit `/ship --full`. It is expensive and is not part of routine completion, default
local shipping or every release. Environment setup: [verification runbook](runbooks/verification.md#full-gate-environment).

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Static groups | `python3 scripts/gate.py run --keep-going --group format --group python-format --group shell-lint --group tooling-lint --group web-lint --group web-typecheck --group api-lint --group api-typecheck --group host-ruff --group host-python --group docs-links --group content-static --group lesson-media --group api-contract` | the same groups CI runs |
| Infrastructure / bootstrap | `docker compose --project-name infraege-full-gate -f infra/docker-compose.yml -f infra/docker-compose.override.yml up --build -d` | overlay ports `18080/13000/18000/15432` isolate the gate; all four services must become healthy |
| Operations contracts | `bash scripts/tests/backup-restore.test.sh && bash scripts/tests/backup-retention.test.sh && bash scripts/tests/deploy-preflight.test.sh && bash scripts/tests/host-web-gate.test.sh && bash scripts/tests/host-access-policy.test.sh && bash scripts/tests/root-password-access.test.sh && bash scripts/tests/release-retention.test.sh && bash scripts/tests/web-image-build.test.sh && bash scripts/tests/clean-local-artifacts.test.sh` | local/fake transport only; other contracts are affected-area checks listed in the verification runbook |
| Host Python contracts | `python3 -m unittest scripts.tests.application_db_test scripts.tests.deploy_orchestration_test scripts.tests.gate_test scripts.tests.release_checkpoint_test scripts.tests.change_history_test` | local fake transports |
| Migrations | `cd apps/api && uv run alembic upgrade head && uv run alembic current && uv run alembic check` | isolated gate DB and migration-role URL; never CI or production |
| Backend test suite | `cd apps/api && uv run pytest` | local only |
| Frontend build | `scripts/run-host-web-gate.sh pnpm --filter web build && node scripts/check-paid-leak.mjs` | temporarily stops only the gate web service, builds/prerenders on the host, restores it; fails if any crawled page 500s or paid lesson text leaves `assets/paid/` |
| Frontend unit tests | `pnpm --filter web test` | local only |
| E2E (Playwright) | `pnpm --filter web exec playwright test --list && pnpm --filter web test:e2e` | seeded isolated bank; includes `e2e/accessibility.spec.ts` (do not run `audit:a11y` twice) |
| Smoke | `curl -f http://localhost:18000/health/ready` | frontend smoke is the build prerender crawl |
| Content validation | `pnpm validate:content` | Course/module/lesson membership, publication registry and the complete bank through the API CLI; no database or credentials |
| Repository hygiene | analyze all reports, then `make clean` | always last |

Broad security (`pnpm audit:security`) and performance (`scripts/run-host-web-gate.sh pnpm
audit:performance`) are weekly/manual or specifically requested, not Full rows. Lab ceilings are
LCP ≤4.0s, CLS ≤0.1 and TBT ≤200ms; LCP ≤2.8s remains the product target.

---

## Release Gate

Run only by `/ship --release`, after the selected release coverage has passed and the change is
merged locally. Prepublication checks run before push; published-image checks after push and
before deploy. A failed publication check blocks deploy, not a fictitious undo of a push.

| Check | Command | Preconditions / notes |
|-------|---------|-----------------------|
| Unpublished commit secrets | `bash scripts/security-gate.sh pre-push FULL_BASE_SHA FULL_HEAD_SHA` | scan every commit from the verified remote tip to the candidate merge SHA; missing/ambiguous ancestry blocks publication; a tree-only scan is not equivalent |
| Changed dependencies | `bash scripts/security-gate.sh changed-dependencies FULL_BASE_SHA FULL_HEAD_SHA` | audits only changed pnpm/Python ecosystems; head must match and manifests/locks must be clean. A `package.json` outside the root and workspace packages is reported as not a release input; an unreadable workspace fails closed |
| Published image build + scan | `python3 scripts/release_checkpoint.py predeploy --sha FULL_HEAD_SHA` | after push, before deploy: requires successful exact-SHA `quality.yml` and `images.yml`; images scans all three published digests and emits SBOM/provenance. `pnpm audit:images` is an optional local diagnostic |
| Schema transition | owning procedure in [backup and restore](runbooks/backup-restore.md#schema-transition-attestation) | only when the candidate changes the production schema head: rehearse against restored production data and record the root-owned exact-SHA attestation before deploy; missing evidence blocks deploy |
| Production Compose render | `scripts/render-production-config.sh /etc/infraege/production.env >/dev/null` | on the provisioned VPS or against a complete temporary env |
| Health/deploy verification | `scripts/check-release-target.sh`, then after deploy `python3 scripts/release_checkpoint.py postdeploy --sha FULL_HEAD_SHA` | current production health must report a 40-character SHA; the deploy workflow checks public page/readiness and rolls back on failure |
| `gh` repository/environment | `gh auth status && gh repo view avatarsik6699/infraegev2` | verify the documented no-reviewer production policy, `can_admins_bypass`, and required secrets/vars |

---

## Required Tooling

Mandatory tools/skills per domain — `/work` enforces these before checking an item off; a mandated
tool that isn't available must be reported as skipped with a reason, never silently omitted.

| Domain | Required tool/skill | When | Available in this project |
|--------|----------------------|------|-----------------------------|
| Frontend UI change | Playwriter first (screenshot + console check); fallback per the browser connection procedure | after implementing, before checking off | yes |
| E2E test change | Playwright + Page Object Model + E2E policy lint | during implementation and verification; use typed fixtures, `e2e/pages/*.page.ts`, user-visible locators, and run `pnpm --filter web lint` | yes |
| TypeScript / Python change | LSP diagnostics | after implementing, before checking off | yes |
| New/changed API surface | `openapi-typescript` regen + frontend re-typecheck | after backend contract change | yes — `pnpm api:generate` updates tracked artifacts; `pnpm api:check` proves no drift |
| Frontend architecture decision | `frontend-architecture` skill | during planning and architecture review | yes — installed in the local Codex skill catalog |
| Backend architecture decision | `backend-architecture` skill | during planning and architecture review | yes — installed in the local Codex skill catalog |
| Frontend UI/design change | `impeccable` skill (`critique` before; `polish` + `audit` and its detector before check-off; `document` when the visual system changes) against `DESIGN.md`; Playwriter stays the browser check and `dsh-ui-review` the visual/a11y review | during design, implementation and before check-off | yes — user-level skill; `frontend-design` plugin disabled in `.claude/settings.json` |

Mark a row `no` (not available) rather than leaving it blank.

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

## Testing

Unit tests (Vitest and pytest), database acceptance and ordinary Playwright E2E run **only
locally**; never containerized and never in push/PR quality jobs. The narrow exception is
weekly/manual `audit-browser.yml`: a host runner with disposable synthetic data plus a separate
read-only public Lighthouse observation, without production credentials or writes. No test runner
or browser runs inside an application image or Compose service.

### Backend

```bash
cd apps/api && uv run pytest            # markers: -m pure (no Docker), -m db
```

- Use FastAPI `TestClient`; never call a live server or external network from unit tests.
- Prefer function-style tests and fixtures; build content with helpers such as `make_task()`.
- Own `TestClient` through a fixture/context manager and reset dependency overrides in teardown.

### Frontend

```bash
pnpm --filter web test
pnpm --filter web test:e2e:install  # installs Chromium only; first run / browser update
pnpm --filter web test:e2e
scripts/run-host-web-gate.sh pnpm --filter web build && pnpm --filter web test:layout
```

- Vitest unit tests live in `apps/web/tests/`; workspace config owns mock cleanup
  (`clearMocks`, `restoreMocks`, `unstubGlobals`); keep fake-timer/env cleanup beside its test.
- Playwright specs live in `apps/web/e2e/`. Specs import `test` only from `./fixtures` and consume
  domain fixtures; Page Objects (`e2e/pages/*.page.ts`) own actions, user-visible locators and
  assertions; fixtures own construction and teardown. `pnpm --filter web lint` enforces this with
  policy self-tests — extend the fixture or owning POM instead of bypassing it.
- Prefer locator actions and web-first assertions over `waitForTimeout`, selector polling or
  global `networkidle`. When streamed SSR precedes hydration, retry the user action against an
  observable interactive state inside the owning POM.
- `playwright.config.ts` has one Chromium project and always starts fresh frontend/backend
  processes on strict `127.0.0.2:3100` / `127.0.0.2:8100` ports; it never reuses a server.
- The layout suite owns a production server on `127.0.0.2:3200` and checks readability with
  pending/failed fonts and mobile outline geometry; supply `API_INTERNAL_URL` for a seeded API.
- Under `gate.py` (`GATE_SUMMARY=1`) Playwright uses the `dot` reporter.

E2E requires a seeded bank. Prefer `bash scripts/run-isolated-browser-audit.sh` (disposable bank;
`E2E_ARGS="e2e/<spec>.ts"` limits it). For the dev stack run `make practice-bootstrap`, export the
read-only `DATABASE_URL` on the port from `docker port infraege-dev-postgres-1 5432`, and set
`TASK_FILES_DIR` to the local task-files directory. Never point a runner at production or import a
synthetic bank into the development volume.

---

## Project structure

```
.
├── docs/                       # SPEC, STACK, FRONTEND, KNOWN_GOTCHAS, CHANGE_TEMPLATE
│   ├── changes/ (archive/)     # active and completed units of work
│   ├── playbooks/              # plan.md / work.md / ship.md
│   ├── runbooks/               # operations, verification, lesson pipeline/patterns
│   └── artifacts/              # architect sources and references (lessons, mockups, references)
├── content/                    # practice bank, legacy task fixtures, lesson-design stands
├── scripts/                    # gate, history, release, ops tooling; lesson_design, mascot
├── apps/web/, apps/api/, infra/, ops/
├── .claude/skills/, .agents/skills/, plugins/sdd-workflow/   # thin workflow wrappers
└── AGENTS.md / CLAUDE.md       # AI agent rules
```

### Frontend (`apps/web/src/`)

Layers, ownership, platform boundaries and state rules are binding in [FRONTEND](FRONTEND.md) §3.
Tooling facts: `eslint.config.js` enforces the downward import zones and the platform allowlist
(raw `window`, `document`, `navigator`, storage, `fetch`, `process` only in owning adapters,
`shared/config/client-env.ts` and `*.server.ts`). TanStack route modules keep two narrow
unsafe-value exemptions (generated augmentation resolved by `tsc` but not Project Service) plus
the route-only `only-throw-error` exemption for `notFound()`. Server state uses a per-router
TanStack Query client; regenerate `contracts/openapi.json` and `shared/api/schema.ts` with
`pnpm api:generate` and prove no drift with `pnpm api:check`.

### Backend modules (`apps/api/app/`)

```
main.py      create_app() factory.
api/         router.py — aggregates every module's router under `/api` (not `/api/v1`; SPEC §4).
core/        config (Settings), exceptions, logging (structlog), middleware, database engine and
             metadata. Modules may import core/; core/ never imports modules/.
modules/     health/, tasks/, practice/, account/ (authentication, identities, progress) and
             content/ (shared content-block DTOs, no router). Each holds only api.py, service.py,
             schemas.py, exceptions.py as needed.
shared/      cross-module code used by >= 2 modules; empty until that is true.
```

`modules/practice/` owns typed models, content validation, immutable files, one transactional
import/export and a host CLI. Migrations live in `apps/api/migrations/`. Public projections exclude
checker/private provenance; the checker requires the displayed solution revision.

### Host maintenance code

Bash stays an explicit command/lifecycle adapter. Structured backup metadata, checksums and restore
invariants belong to the stdlib-only `scripts/lib/application_db/` package (`scripts/application_db.py`);
gate, history and release-checkpoint tooling follow the same stdlib-only boundary and are tested
with fake commands/transports. Production hosts require Python 3.12+. A shell syntax check is not
evidence that rollback runs: test the installed failure boundary; `EXIT` recovery preserves the
original failure and invokes/health-checks rollback once. Lesson tooling: `scripts/lesson_design`
(binding [pipeline](runbooks/lesson-pipeline.md)) and `scripts/mascot` (illustration pipeline).

```bash
python3 -m unittest discover -s scripts/tests -p '<module>_test.py'
```

The optional snapshot integration test requires an explicitly selected `PRACTICE_BACKUP_CONTAINER`;
never run it in CI. Agent configuration: [agent workflow](runbooks/agent-workflow.md). Change
history and compaction: [change history](runbooks/change-history.md).

## Common operations

```bash
make dev | make rebuild | make stop | make down | make logs | make ps
make clean          # remove regenerable outputs, then verify none remain (keeps deps, envs, data)
make clean-dry-run  # optional preview
# New migration: explicit MIGRATION_DATABASE_URL with the migration role (runbooks/practice.md)
```
