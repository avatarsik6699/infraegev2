# Known Gotchas

> Project memory file: recurring pitfalls that waste time during coding, testing or deploys.
> Add only issues likely to recur, as symptoms → root cause → shortest reliable fix; remove entries
> that no longer apply. Search headings for the affected tool/module before reading details. The
> filesystem-permission handoff (AGENTS.md) always applies; historical symptoms never supersede
> current STACK or runbooks. Retired-system pitfalls are recoverable through
> [COMPACTED](changes/archive/COMPACTED.md).

## Local development

### Route tree generation fails in the web container with `EXDEV`

After adding or renaming files in `apps/web/src/routes`, regenerate `src/routeTree.gen.ts` on the
host: import `@tanstack/router-generator` from `node_modules/.pnpm/@tanstack+router-generator@*/...`,
call `getConfig({ target: "react", routesDirectory: "./src/routes", generatedRouteTree:
"./src/routeTree.gen.ts" }, root)` and `new Generator({ config, root }).run()`.

### Prettier run from `apps/web` reformats the generated API schema

The root `.prettierignore` excludes `apps/web/src/shared/api/schema.ts`, but a Prettier run with
`apps/web` as working directory does not see it and breaks `pnpm api:check`. Format from the
repository root (`pnpm format`) or only the changed files; revert the schema with `git checkout`.

### Dev account DB can drift from the migration head

- **Symptoms:** registration fails because columns such as `privacy_consent_version` are absent.
- **Fix:** the dev migration job runs `upgrade head` then `alembic check`, and every successful
  `make dev` checks the retained schema. Drift must fail startup and show migration logs; never
  stamp or repair it silently. A revision stamp alone does not prove schema consistency.

### Dev SMTP is real Yandex Postbox

Never register made-up addresses through the UI (the validator also rejects `.invalid`); use a
seeded account in the dev account DB for UI checks.

### Compose lifecycle: cached rebuilds and concurrent commands

- `up --build` recreates containers even when every layer is `CACHED` (BuildKit exports fresh image
  metadata). `make dev` therefore uses plain `up --wait` unless its input fingerprint changed
  (STACK § Initial setup); `make rebuild` forces a build.
- Concurrent `make stop` and `make dev` race: nginx's graceful `SIGQUIT` can be held by open HMR
  WebSockets and the older stop then stops the newly started containers. Use the Make targets
  (serialized); the dev overlay sends nginx `SIGTERM`. Direct `docker compose` creates a separate
  `infra` project that Make does not own.

### Docker: non-root pnpm needs a writable workspace root

`WORKDIR /repo` is created as root, and pnpm writes atomic `/repo/_tmp_*` files. Before `USER node`
run the narrow `chown node:node /repo` (not recursive `chown -R`, which stalls `make dev`) and keep
`COPY --chown` for copied files.

### Docker: `useradd --no-create-home` breaks `uv run`

`uv` creates its cache under `$HOME`; set `ENV UV_CACHE_DIR=/app/.cache/uv` (an app-owned directory)
instead of creating a home directory. See `apps/api/Dockerfile`.

### Vite HMR behind local Nginx needs WebSocket upgrade headers

- **Symptoms:** `WebSocket handshake: Unexpected response code: 200` through port 8080.
- **Fix:** keep `proxy_http_version 1.1`, set upstream `Upgrade` to the literal `websocket`, and map
  `Connection` in `http` scope: only an exact case-insensitive `Upgrade: websocket` becomes
  `upgrade`, everything else `close`. Forwarding `$http_upgrade` directly trips the security gate's
  h2c-smuggling rule; keep its narrow inline suppression. Verify a 101, an h2c non-101 and a clean
  console through `http://localhost:8080`.

### Prerender inside `docker build` hits `ECONNREFUSED`

- **Fix:** `preview.host: "127.0.0.1"` in `apps/web/vite.config.ts` (the preview server otherwise
  binds another loopback family), and keep the `nitro/vite` plugin so the Node image gets
  `.output/server/index.mjs`. Never use `build.network: host`: BuildKit then drops files written in
  that RUN step from the snapshot.

### Nitro dev server bypasses Vite `server.proxy`

Nitro owns the dev request pipeline. Use a development-only Nitro `routeRules` entry for `/api/**`
with a target ending in `/api/**`; production routing stays in Nginx (`apps/web/vite.config.ts`).

### Dev CSS Modules composition can keep stale class names

When a composed class (e.g. ActionLink → Button) still applies old colors after a reload, restart
only the dev web container and reload; verify settled computed styles on port 8080. Do not clear
databases or rebuild the stack for this in-memory Vite issue.

### Docker Compose: never mount production-only Nginx vhosts locally

Mounting all of `infra/nginx/conf.d/` makes `nginx -t` resolve production upstreams and hang until
the healthcheck fails. Base Compose mounts only `infraege.conf`; the production image copies
`infraege.prod.conf` itself.

### Nested read-only Nginx asset mounts need existing mountpoints

Docker cannot create a nested mountpoint inside a read-only parent mount (`Read-only file system`).
Prepare only the mountpoints the current Compose/test definition uses (`fonts/.gitkeep`, the brand
SVG file); never weaken mount permissions.

## Frontend

### `Route.useParams()` is typed `any` for subtopic routes

ESLint rejects unsafe access; annotate it, e.g.
`const params: { slug: string; subtopic: string } = Route.useParams();`.

### StrictMode runs mount effects twice in dev

Module-scope «first load» flags flip on the first run and act on the second; key such logic on the
path instead (see `shared/lib/scroll-to-top/browser-adapter.ts`).

### Inline code styles can hide nested code blocks

A broad `.body code` selector out-specifies CodeBlock's `.code` rule inside a Callout. Scope it to
inline code without CodeBlock's `data-language` marker; check the computed colour of a plain
identifier, not only highlighted tokens.

### Credential forms need SSR `method="post"`

A form without `method` submits GET before hydration or without scripts and puts the password in
the URL. Render `method="post"` for every credential-bearing form (FRONTEND §5) and test a real
no-JavaScript submission.

### Hydration-only control swaps cause catalog layout shifts

Server-render the final geometry: native fallbacks go in `noscript`, scripted controls hide with
CSS `scripting: none`, hydrated GET forms use router navigation, and Base UI triggers are named in
SSR (FRONTEND §1). Validate blocked-script first paint, hydration geometry, no-JS and same-document
updates — settled screenshots alone hide the shift.

### PageContainer overrides must not depend on stylesheet insertion order

A page `.catalogSection { padding-block }` and PageContainer `.root { padding }` have equal
specificity; Vite's client style insertion changes their order (24px jump). Qualify the page
override with the existing `[data-measure]` attribute. An undefined custom property inside
`clamp()` invalidates the whole declaration.

### Third-party scripts: React `<script async>`, not a `head()` script asset

TanStack Router's head `Script` asset is removed after hydration and re-appended on navigation, so
the tracker ran twice and double-counted pageviews. Render `<script async src=… data-site=…>`
directly in `RootDocument`'s `<head>`; React 19 hoists and de-duplicates async `src` scripts.

### `InfoPopover` without JavaScript breaks a `<p>`

The `noscript` fallback `<details>` is block-level, so the parser closes the paragraph. Inside text
use `InfoPopover inline` (native `button popovertarget` + `span popover`).

## Testing and tooling

### Long Playwright crawls exhaust Vite dev hydration

- **Symptoms:** `Failed to fetch dynamically imported module ... client.tsx` or Chromium
  `ERR_INSUFFICIENT_RESOURCES` after many full-page navigations under three workers.
- **Fix:** give each crawled lesson its own test/context; for multi-viewport checks resize one
  hydrated page; use real links for continuous JavaScript journeys and keep first-entry, reload/SSR
  and no-JS checks as document navigations. Prefer `scripts/run-isolated-browser-audit.sh`.

### Playwright `use.reducedMotion` is ignored by the installed version

`@playwright/test` 1.62 has no top-level `use.reducedMotion`; the layout and production configs set
it there and it silently had no effect until tests/e2e joined the type check (Change 173). Use
`use.contextOptions.reducedMotion`.

### LSP adapters report false diagnostics

- The TypeScript MCP host omits `realpath`, so pnpm server exports (`setResponseHeader`, …) look
  missing while `tsc`, typed lint and build pass. Do not change valid imports or add casts.
- E2E files could resolve the wrong Playwright declarations. Since Change 173 `tests/` and `e2e/`
  are in `apps/web/tsconfig.json`; if a diagnostic persists, trust `pnpm --filter web typecheck`
  and report the LSP result as supplementary.

### nvm upgrade hides global LSP and MCP tools

- **Symptoms:** Claude Code reports `context7 (ENOENT)` and the LSP tool fails with
  `pyright-langserver`/`typescript-language-server` not in `$PATH`, although they were installed.
- **Cause:** global npm packages live per Node version; the nvm default `lts/*` moved to a newer
  Node without them. A global `typescript@7` (native) also has no `tsserver`, so the TS language
  server cannot start outside a workspace with its own TypeScript.
- **Fix:** after a Node upgrade reinstall the tools into the active version:
  `npm i -g pyright typescript@5.9.3 typescript-language-server @upstash/context7-mcp` (match the
  workspace TypeScript in `apps/web`), then restart the session.

### Ruff 0.16 formats Python examples inside Markdown

`ruff format <directory>` also rewrites fenced Python in `.md` files, which changes authored lesson
text and generated lessons. The root `ruff.toml` (and the lesson tooling ones) extend the API
config with `extend-exclude = ["*.md"]`, so editor hooks and ad-hoc runs from any directory use
the project's 100-column style and leave Markdown alone; keep this when adding Ruff configs.

### `! cmd` assertions never fail under `set -e`

Bash ignores `errexit` for a pipeline negated with `!`, so `! grep -q x file` in a test passes even
when `x` is present. Write `if grep -q x file; then exit 1; fi` (ShellCheck SC2251, now enforced on
every tracked `.sh`).

### Lighthouse under WSL

- Use Playwright's Linux Chromium (`lighthouserc.cjs` passes `chromium.executablePath()` as
  `collect.chromePath`); Windows Chrome via interop fails with `bind() ... 0x2740`/`ECONNREFUSED`.
- `chrome-launcher` converts its profile path to Windows syntax, so Linux Chromium creates
  `C:\Users\…\lighthouse.*` directories in the repository root. Run Lighthouse only through
  `pnpm audit:performance`, whose wrapper owns an absolute `/tmp/infraege-lighthouse.*` profile;
  `make clean` removes leftovers.
- This devbox's simulated-throttling LCP sits around 4.0–4.4 s independent of code; the enforced
  lab ceiling is 4.0 s and 2.8 s stays the product target (STACK Full Gate notes).

### Windows-hosted browser MCP interprets WSL paths as `C:` paths

Screenshot saving to `/home/...` or `/tmp/...` fails with `Access denied`. After the architect
authorizes the target, request the screenshot without `filePath` (default MCP output) and save the
returned bytes through the local tool. Do not change permissions or the MCP root allowlist; a real
shell `EACCES`/`EPERM` still requires the permission handoff.

### Playwriter extension not connected when only Playwright Chrome runs

Visible Chrome windows may all be Playwright/MCP instances with `--disable-extensions`. Inspect
parent command lines, start ordinary Chrome with `--profile-directory=Default`, retry — see
[STACK's procedure](STACK.md#interactive-browser-connection-wsl). Playwriter `-f` scripts start
without a page: `state.page = state.page ?? await context.newPage()` before `bringToFront()`.

### Headless Chromium dies under `ulimit -v`

`scripts/lesson_design/svg_png.mjs` (PNG figures of bank statements, Change 190) launches the
Playwright Chromium. Under the `ulimit -v 3000000` used for brute-force checks it exits with
`SIGTRAP` («Target page, context or browser has been closed»): Chromium reserves far more virtual
memory than it uses. Run `topic-NN/bank.py` without the limit; its searches are small.

### Cleanup or compaction refuses a symlinked parent directory

A repository-looking path can traverse a symlink into another checkout or external data. Inspect
the named path and use the owning checkout; never bypass the guard or delete external files. Snapshot
inputs cannot contain symlink components.

### Cached pnpm install layer plus fresh web sources fails `verifyDepsBeforeRun`

A fresh `COPY apps/web` makes `package.json` newer than the cached install and pnpm reports the
workspace overrides as outdated. Both development and builder stages re-run
`pnpm install --frozen-lockfile --offline` after copying sources
(guard: `scripts/tests/web-image-build.test.sh`). Keep
`verifyDepsBeforeRun: error`; do not regenerate a current lockfile or bump cache scopes.

### GitHub names an unnamed matrix job with every matrix value

`images.yml` jobs are named `images (web, apps/web/Dockerfile, web-v3)`, not `images (web)`; the
release checkpoint takes the first matrix value. Copy names from a real run
(`gh api repos/…/actions/runs/<id>/jobs`) when matching workflow evidence.

### Historical practice checksums look like four API keys

`.gitleaks.toml` allows exactly four SHA-256 digests of public task files at one historical path
(`content/practice-migration/snapshot.json`); the same digest elsewhere must still be detected. A new
finding needs its own investigation, never a broader regex or disabled rule.

## Backend and data

### asyncpg + SQLAlchemy naive/aware `datetime`

Every `Mapped[datetime]` declares `DateTime(timezone=True)` (and `sa.DateTime(timezone=True)` in the
migration); build "now" with `datetime.now(UTC)`. Otherwise asyncpg binds `TIMESTAMP` and rejects
aware values.

### asyncpg authentication errors escape SQLAlchemy's wrapper

A wrong password raises `asyncpg.InvalidPasswordError` before SQLAlchemy wraps errors. Health and
operator boundaries catch both `asyncpg.PostgresError` and `SQLAlchemyError` and return the
sanitized 503 without connection details.

### `pg_isready` logs `database "restore_admin" does not exist`

`pg_isready -U restore_admin` defaults the database to the user name; the server logs `FATAL` even
when the probe succeeds. Pass `-d postgres` in every restore readiness call (`restore-check.sh`,
`lib/account-cutover.sh`); guard: `scripts/tests/restore-readiness.test.sh`.

### PostgreSQL restore drills must recreate archived owner roles

Logical dumps keep ownership; restore the bundle's allowlisted roles before its dump and keep
fail-on-error ownership checks.

### Root-owned restore files need a matching verifier identity

`practice.verify` raises `PermissionError` on `/task-files/<digest>` for root-run backups (mode 700).
Run the isolated verifier with the directory owner's numeric UID/GID, keeping read-only mounts,
dropped capabilities, no-new-privileges and SELECT-only credentials; never chmod/chown the backup.

## Production and operations

### Account purge timer must use the API image virtual environment

`docker compose exec` with system `python` lacks `/app/.venv` packages (`ModuleNotFoundError:
sqlalchemy`). Invoke `/app/.venv/bin/python -m app.modules.account.purge`; confirm two scheduled
successful runs via aggregate counts and the service journal.

### Restic retention, grouping and recovery holds

- Each backup's unique `work.XXXXXX` path forms its own group: retention must use
  `--tag infraege-application --group-by host,tags`, and a global newest snapshot is
  `restic snapshots --json | max_by(.time)` — `--latest 1` returns one per group.
- Same-day retention can prune an exact pre-migration point. Schema-changing deploys tag their
  backup `infraege-recovery-hold`; routine `forget` uses `--keep-tag`. Record the full ID outside the
  rotating status file; tagging changes the ID ([backup runbook](runbooks/backup-restore.md)).
- Isolated Restic Docker tests must run with the host `--user` and a `RESTIC_CACHE_DIR` inside the
  mount; otherwise cleanup of `/tmp` repositories fails on root-owned files. Repair only the exact
  disposable path.

### Schema transition proof must authorize, not follow, migration

Post-migration restore evidence cannot satisfy the pre-migration gate, and an extracted bundle with
valid checksums proves nothing about its origin. Use the
[schema transition attestation](runbooks/backup-restore.md#schema-transition-attestation): exact full
Restic snapshot ID (never `latest`/prefix), clean checkout at the candidate SHA, matching immutable
API digest, two-stage disposable restore, then the root-owned proof.

### Root-password rotation has two protected authorities

The local mode-600 `root-admin-password` and the GitHub Environment secret
`production/PROD_ROOT_PASSWORD` change together in one transaction, before closing the provider
console; then prove a wrapper connection and a deploy without printing the value. Never reuse a
chat-exposed password.

### SSH stdin can truncate a streamed deployment script

`bash -s` shares stdin with child commands; an interactive Compose call can consume the unread
script. Upload the reviewed script to a SHA-specific protected path, execute it with stdin closed
and verify the public SHA in an independent step.

### Operator-written env values must stay Compose and Bash compatible

An unquoted value with spaces (an SSH key) is fine for Compose but `source` runs its second word
(exit 127). Serialize values as quoted dotenv literals, reject line breaks and validate
sourceability before container changes.

### Certificate preflight must bypass the VPS hostname override

The VPS hostname `infraege` makes the local resolver answer the apex from `/etc/hosts`
(`127.0.1.1`). The preflight queries `1.1.1.1` and `8.8.8.8` explicitly; do not weaken the DNS check.

### Deploy recovery: ERR traps do not cover helper failures

`set -e` does not make `ERR` traps inherit into functions, and a failing `source` inside a function
called from `if`/`||` can be masked. Use the single `EXIT` recovery boundary, preserve the original
code, disable recovery traps before rollback, propagate failures explicitly and test the installed
traps (including rollback failure).

### Removing a host stack from the repository does not stop it on the host

Deploys install what a release contains and never remove services installed elsewhere; timers keep
firing. Retiring a host service is its own authorized step: inventory Compose project, containers,
timers/services, volumes and install directory, disable, bring down, remove what the decision
covers, then check `docker ps -a`, `systemctl list-timers`, `docker volume ls`.

## Lesson pipeline

### «Решу ЕГЭ»: обычная страница подборки не читается целиком

- **Symptoms**: WebFetch на `inf-ege.sdamgia.ru/test?theme=…` возвращает только меню и base64-картинки, а список задач не попадает в обработанный фрагмент.
- **Root cause**: страница подборки встраивает изображения как `data:` URI на сотни килобайт, поэтому текст условий оказывается далеко за пределом одного фрагмента.
- **Fix**: использовать версию для печати `test?theme=ID&print=true` и скрипт `scripts/lesson_design/sdamgia.py`. Он сам вырезает `data:`-картинки и разбирает задачи в JSON. Скачанное хранить только в scratch-папке: это недоверенные данные, условия не копируются в уроки. Категории задания (id подборок) печатает `sdamgia.py catalog`.

### Сборка стенда уроков: `-I` и соседние модули, Markdown внутри HTML

- **Symptoms**: `python -I scripts/lesson_design/build.py` падает с `ModuleNotFoundError: figures`. Или текст внутри `<details>` либо `<figure>` выводится с сырыми `**` и обратными кавычками.
- **Root cause**: флаг `-I` убирает папку скрипта из `sys.path`. Python-Markdown не обрабатывает разметку внутри сырого HTML-блока.
- **Fix**: скрипты `scripts/lesson_design/` сами добавляют свою папку в `sys.path`. Для Markdown внутри блока используется атрибут `markdown="1"` (расширение `md_in_html`, например `<details class="proof" markdown="1">`). В `<figcaption>` код пишется тегом `<code>`, а не обратными кавычками.

### SVG-диаграмма урока в `<img>`: веб-шрифты не загружаются, кадры без рамки ломают ширину

- **Symptoms**: подписи схемы на сайте другого начертания, чем на стенде, или съезжают. На телефоне страница с пошаговой схемой получает горизонтальную прокрутку до загрузки скриптов или без них.
- **Root cause**: SVG, подключённый через `<img>`, изолирован от CSS страницы и её `@font-face`: имена JetBrains Mono и Caveat из построителей стенда не находятся. Кадр схемы держит минимальную ширину 30rem ради читаемых подписей и без прокручиваемой рамки выходит за колонку.
- **Fix**: схемы сайта не подключаются через `<img>`: `scripts/lesson_design/export_media.py` пишет разметку SVG в манифест урока, `InlineSvg` встраивает её в страницу, а `font-family="inherit"` берёт шрифт страницы (Change 171, компактная подача). Любая схема, в том числе итоговый кадр в разметке без JavaScript, стоит внутри своей плашки с `overflow-x: auto` и `tabIndex=0`, как блок кода.

### Content-addressed bank files must bypass Git EOL conversion

With `core.autocrlf=input`, extensionless textual attachments may be normalized from CRLF to LF
when staged, even though the working file still passes its SHA-256 check. Their filename, bank
metadata and stored bytes then disagree after checkout. `.gitattributes` marks
`content/practice-bank/files/**` as `binary` to preserve exact bytes, without changing global Git
settings. After correcting attributes, restage the original files with scoped `git add --renormalize`
and compare indexed blob size/SHA-256 against `bank.json`; verify the destination checkout before
removing the source worktree. Do not regenerate checksums around corrupted normalized bytes.
