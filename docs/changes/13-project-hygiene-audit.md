# CHANGE 13 — Project Hygiene Audit

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `13` |
| Slug | `project-hygiene-audit` |
| Title | Project Hygiene Audit |
| Status | `active` |
| Branch | `feature/13-project-hygiene-audit` |

---

## Goal

Audit the accumulated repository state for stale artifacts, dependency or lockfile drift,
TypeScript/JavaScript structural issues, failing project checks, and documentation that no longer
matches the implementation. Add repository-local VS Code settings so editor TypeScript language
services use the project's installed SDK instead of VS Code's bundled compiler. Confirmed findings
must be added to this Backlog before they are remediated.

---

## Backlog

### Infra

- [x] `I1` Add repository-local VS Code settings that select the installed workspace TypeScript SDK and prompt contributors to use it — _Depends on:_ T1
- [x] `I2` Add and run a narrowly scoped `make clean` lifecycle command for regenerable local reports, build outputs, and Python caches without touching dependencies, environments, secrets, or database data — _Depends on:_ T1
- [x] `I3` Expand the tracked VS Code workspace configuration with current evidence-backed settings and extension recommendations for this pnpm/TypeScript/Python repository, excluding personal UI preferences and uninstalled formatter assumptions — _Depends on:_ I1
- [x] `I4` Standardize repository-wide editor, formatting, lint, and pnpm workflows with the smallest evidence-backed production-ready configuration, including discoverable check/fix commands and VS Code alignment — _Depends on:_ T6
- [x] `I5` Audit the client production build, application Dockerfiles, Compose topology, image build path, and delivery configuration against current official Vite, Docker, and Compose guidance; record confirmed defects, accepted risks, and rejected optimizations before remediation — _Depends on:_ T1
- [x] `I6` Implement the smallest evidence-backed production-readiness improvements from I5 without changing product behavior, production credentials, host state, or the local-only testing policy; verify clean frontend and container build paths plus rendered development and production Compose configurations — _Depends on:_ I5
- [x] `I7` Migrate both frontend workspaces from Vite 7 to the current supported Vite 8 line, including compatible React/Vitest/path-resolution tooling; preserve TanStack Start/Nitro SSR, prerender, local proxy, ops BFF output, and browser behavior; verify clean local, E2E, Docker, and Compose build paths — _Depends on:_ I6
- [x] `I8` Eliminate intermittent VS Code typescript-eslint parser failures in the multi-root JavaScript workspace by making each flat config's TSConfig root explicit; reproduce the shared-process failure and verify editor-equivalent plus repository lint paths — _Depends on:_ I4
- [x] `I9` Reproduce the remaining VS Code-only `tsconfigRootDir` parser failure reported after I8, audit the effective flat config for ops source and config files plus extension working-directory behavior, and make the editor path deterministic without weakening repository linting — _Depends on:_ I8
- [ ] `I10` Reconcile the local-merge `/ship` workflow with GitHub enforcement and, after architect approval, protect `main` with required static-quality/security/dependency checks so the E2E policy lint cannot be bypassed by merge or direct push; preserve the local-only test-execution contract — _Depends on:_ T10

### Other

- [x] `T1` Audit repository artifacts, dependency/lockfile consistency, TypeScript/JavaScript structure, project checks, and documentation-to-code alignment; append each actionable finding before fixing it — _Depends on:_ —
- [x] `T2` Document the discoverable editor setup and any durable repository hygiene convention confirmed by the audit — _Depends on:_ I1
- [x] `T3` Remediate the HIGH `tmp@<0.2.7` transitive dependency findings with the narrowest compatible pnpm override and verify the frozen lockfile plus JavaScript dependency audit — _Depends on:_ T1
- [x] `T4` Repair the confirmed local Markdown links and archived-change lifecycle metadata, and make `/ship` persist `Status: archived` before moving a completed change — _Depends on:_ T1
- [x] `T5` Remove the tracked, unreferenced Change 01 `SPEC_DRAFT.md` artifact after the canonical `docs/SPEC.md` links are repaired — _Depends on:_ T4
- [x] `T6` Audit ESLint, Prettier, pnpm, EditorConfig, and adjacent repository hygiene conventions against current official guidance; measure migration impact and document accepted or rejected choices before implementation — _Depends on:_ T1
- [x] `T7` Audit Playwright, Vitest, and pytest suites for execution cost, duplicated setup/assertions, resource ownership and cleanup, isolation, flaky waits, and abstraction-boundary violations; baseline collection and runtime, then record confirmed findings and rejected abstractions before remediation — _Depends on:_ T1
- [x] `T8` Refactor confirmed Playwright findings into cohesive Page Object Model and fixture abstractions with declarative user journeys, deterministic resource cleanup, user-visible locators, and no product-behavior change; retain direct Playwright APIs only inside the owning abstraction or where they are the assertion under test — _Depends on:_ T7
- [x] `T9` Refactor confirmed unit-test findings across web, ops, and API suites using the smallest shared helpers or lifecycle hooks that remove real duplication/leak risk without hiding test intent; preserve isolation and observable-behavior coverage — _Depends on:_ T7
- [x] `T10` Enforce the agreed E2E architecture contract mechanically and for repository agents: add Playwright-aware linting, spec-layer import/API boundaries, executable positive/negative policy checks in the existing static-quality path, and concise durable agent guidance; evaluate a dedicated skill or subagent without duplicating the source of truth or causing tests to run in CI — _Depends on:_ T8, T9
- [x] `T11` Audit and refactor production code in `apps/web` for current React/TanStack Start/Vite practices, explicit browser/server boundaries, direct global and external-API access, duplicated or overly coupled logic, resource lifecycle, and enforceable architecture rules; add the smallest evidence-backed lint, agent, documentation, and test safeguards without changing product behavior or visual design — _Depends on:_ T6, I7, T10

<!-- Test execution is governed by `docs/STACK.md`'s Fast Gate (per task) and Full Gate (per ship).
     Do not duplicate that list here. -->

---

## Files

### Create / modify

~~~
.vscode/settings.json
.vscode/extensions.json
AGENTS.md
.editorconfig
.prettierignore
prettier.config.mjs
.npmrc (only if the audit supports repository-scoped pnpm settings not available in pnpm-workspace.yaml)
Makefile
README.md
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
SPEC_DRAFT.md (delete after reference verification)
docs/SPEC.md (local-link repair only)
docs/STACK.md
docs/KNOWN_GOTCHAS.md (only if the audit reveals a recurring pitfall)
docs/playbooks/ship.md
docs/changes/archive/*.md (local-link and lifecycle metadata repair only)
docs/changes/13-project-hygiene-audit.md
apps/web/vite.config.ts
apps/web/eslint.config.js
apps/web/package.json
apps/web/e2e/**/*.ts
apps/web/scripts/verify-test-architecture.mjs
apps/web/src/**/*.{ts,tsx}
apps/*/Dockerfile
infra/Dockerfile*
infra/*.yml
infra/*.conf
.dockerignore
.github/dependabot.yml
.github/workflows/*.yml
scripts/*.sh
confirmed small-scope remediation files appended to the Backlog before editing
~~~

### Do NOT touch

- Product behavior, content, and visual design
- Production hosts, services, credentials, or protected environment files

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Fast Gate runs per task in `/work`; Full Gate and (with `--release`) Release Gate run once in
> `/ship`. Both are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

No change-specific override. The audit may run read-only checks beyond the Fast Gate, but it must
not be presented as `/ship` Full Gate evidence.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The security override targets `tmp@<0.2.7`, not only `<0.2.6`: a second HIGH advisory affects
  `0.2.6` itself. It deduplicates both legacy LHCI dependency paths on `0.2.7`; a one-time lockfile
  refresh bypassed age evaluation only because the pre-existing lock already contained a package
  younger than the repository policy, while the committed `minimumReleaseAge` remains unchanged.
- The HIGH audit passes. A MODERATE `uuid<11.1.1` advisory remains through `@lhci/cli@0.15.1`;
  forcing a cross-major transitive override was rejected without upstream compatibility evidence.
- Fallow reported 24 dead-code signals, four clone groups (2.02% duplicated lines), and four
  functions above complexity thresholds. Its ops `main.ts`/integration unused-file chain is a
  false positive against the compiled `dist/server/main.js` entrypoint; no auto-fix was applied.
- The complete Fast Gate passes, with one upstream transition warning: current FastAPI tests still
  use the documented `TestClient`, while installed Starlette warns that its `httpx` backend is
  deprecated in favor of `httpx2`. Do not guess a migration until upstream FastAPI guidance and
  compatible package constraints converge.
- The pre-existing local branch `feature/13-reference-led-application-redesign` points at `main`
  and has no change file. It was left intact because branch deletion requires explicit approval.
- The shared VS Code profile deliberately omits personal UI/autosave choices, experimental
  settings, and format-on-save. JavaScript has no installed formatter, and `ruff format --check`
  found two pre-existing Python files that would be changed even though formatting is not a gate;
  enabling it here would create unrelated editor-only diffs.
- The tooling follow-up keeps ESLint and Prettier as separate quality/formatting passes, pins the
  local formatter exactly, and excludes Markdown plus the pnpm-owned lockfile from the initial
  formatting boundary. `eslint-plugin-prettier`, git hooks, exact-save, and time-based resolution
  were rejected as unnecessary indirection or policy changes; strict pnpm checks are adopted only
  where a clean frozen install proves compatibility.
- Strict install proof established Node 22.13.0 as the lowest compatible baseline and identified
  `esbuild@0.28.2` as the sole required dependency build script, so its approval is version-bound.
  Project `tsc`/Pyright gates pass; the mandatory MCP LSP pass was also run, but its bulk TypeScript
  diagnostics diverge from `tsc` on framework augmentations and test-package exports, while
  file-scoped Python diagnostics pass after project-root discovery.
- After explicit architect approval, both frontend workspaces moved directly to Vite 8.2.1 with
  its Rolldown/Oxc pipeline, `@vitejs/plugin-react` 6.0.5, and Vitest 4.1.10. The repository had no
  Rollup- or esbuild-specific Vite options requiring compatibility shims; Vite's built-in
  `resolve.tsconfigPaths` replaces `vite-tsconfig-paths`. Local SSR/prerender and ops builds, six
  Chromium E2E journeys, a clean Docker build, and an isolated four-service Compose smoke all pass.
- The container audit replaced legacy Nginx 1.27 and build-time `apk upgrade` with current stable
  Nginx, pinned every owned base and external Compose image by tag plus multi-platform digest,
  upgraded the socket proxy and uv tooling, and added Compose-aware Dependabot coverage. Current
  major GitHub Actions are SHA-pinned, jobs use explicit Ubuntu 24.04 timeouts, and production deploys
  are serialized; production application images remain selected by the requested source SHA.
- Test audit baseline was 22 web unit tests in 3.17 s, 55 ops unit tests in 3.64 s, 12 API tests
  in 0.36 s, and six Chromium journeys in 12.6 s (runner-reported durations). Playwright specs
  mixed POM calls with raw viewport, screenshot, request, accessibility, console, and browser-
  context lifecycle code; typed fixtures and focused POMs now own those concerns, including
  guaranteed no-JS context teardown. Removing global `networkidle` reduced the verified E2E run
  to 9.8 s while preserving all six journeys; warm sequential reruns reduced web unit time to
  1.69 s, ops unit time to 2.02 s, and API time to 0.25 s. A three-repeat stress run passed all
  18 browser executions under three workers, covering concurrent fixture teardown.
- Unit-test cleanup remains deliberately local where ownership differs: cross-workspace Mantine
  render helpers and a generic base page were rejected as coupling without a shared package or
  behavior. An attempted removal proved ops DOM cleanup is required because that Vitest workspace
  has no global hooks; only mock restoration/global unstubbing moved to config. Ops HTTP servers
  use per-test teardown, and FastAPI clients use a context-managed fixture that always clears
  dependency overrides. Fallow's test-only clone signals were limited to the rejected render/base-
  page candidates and did not justify further abstraction.
- E2E architecture is enforced in the existing web lint/CI path with Playwright-aware rules,
  spec-only import/API boundaries, and executable positive/negative policy cases; CI still does
  not collect or execute tests. A dedicated skill was rejected because this invariant is
  repository-specific and deterministic enforcement is stronger than implicit skill activation.
  A permanent test subagent was also rejected: it adds cost and coordination but cannot enforce a
  code boundary; use bounded review/test subagents only when future work divides into independent
  read-heavy streams.
- The exact `eslint-plugin-playwright@2.11.0` pin predates the seven-day dependency cooldown. Its
  lockfile update still required a process-scoped age override only because the already selected
  Vite binding was six days old; the unchanged repository policy and a normal frozen install both
  pass afterward.
- GitHub reports no repository rulesets and `main` is unprotected. Making the lint check truly
  merge-blocking is not a repository-file-only change: the current `/ship` flow creates and pushes
  a local merge commit that has not run on GitHub, so required checks and release mechanics must be
  designed together before mutating repository settings.
- The `apps/web` production audit found no circular dependencies, unused production files or
  dependency findings and no Fallow security candidates; maintainability averaged 93.9 with one
  high complexity function. Confirmed risks were ad-hoc platform boundaries, mixed client/server
  env ownership, content ids reaching filesystem paths without runtime validation, blanket 404
  conversion, unchecked HTTP responses/storage failures, and a non-discriminated content-block
  model. These are now bounded by adapters, server-only imports, validated slugs, precise error
  semantics, typed linting and executable policy cases. Legal-page clone signals, public-barrel
  type exports, a generic HTTP client/state manager, and a new web-specific skill or permanent
  subagent were rejected as low-signal abstraction or duplication of `frontend-architecture`;
  deterministic repository rules remain the enforcement source of truth.

---

## Commit Message

```text
feat(change-13): audit repository hygiene and align editor tooling
```
