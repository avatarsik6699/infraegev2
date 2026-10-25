# Rules of operation of the AI agent during infraege development

This workflow is specialized for **web applications** (frontend + backend + database). These rules
are the contract any AI agent (Claude Code, Codex, others) must follow in this project.
Stack-specific commands, file layout and tooling live in [`docs/STACK.md`](docs/STACK.md).

## Core Rules

1. **Backlog Lock**: Do only what is specified in the active `docs/changes/*.md`'s Backlog, plus
   whatever the architect reports mid-session (see Rule 6). Do not assume future changes.
2. **Agent-Only Implementation**: Code changes happen through `/work` Backlog tasks. Humans define
   intent, scope and findings from local manual review; agents append those findings to the same
   change's Backlog and implement them before `/ship`.
3. **No Guessing**: If a requirement is genuinely ambiguous and risky, ask a concise question
   instead of inventing behavior.
4. **Proportional Gates**: `/work` runs one affected-area Critical Gate for its complete target
   set (`python3 scripts/gate.py affected` suggests the groups); default `/ship` runs only checks
   invalidated since that result. Full Gate runs only on explicit `/ship --full`. Release requires
   affected coverage, unpublished-commit secrets, relevant dependency checks, exact-SHA image scan
   and Release Gate. Broad security, browser and Lighthouse audits are weekly/manual; auth, schema,
   dependency and release-image checks stay mandatory when their own boundary changes. Unchecked
   Backlog blocks shipping. Policy: [verification runbook](docs/runbooks/verification.md).
5. **Security**: No hardcoded secrets. Use `.env`, environment variables, and typed settings
   appropriate to the stack.
6. **Open Backlog**: When the architect reports a finding, bug, or follow-up in chat mid-session,
   append it to the active change's Backlog with a new ID before acting on it — never fix it
   off-list. See `docs/playbooks/work.md` § Backlog append.
7. **Required Tooling**: Domain-mandated tools (Playwriter first for interactive frontend UI and
   LSP for TypeScript/Python) are not optional judgment calls — see `docs/STACK.md` § Required
   Tooling and use them before checking an item off.
8. **E2E Architecture**: Playwright specs import `test` only from `apps/web/e2e/fixtures.ts` and
   consume domain fixtures only; Page Objects own actions/assertions, fixtures own construction
   and cleanup. Extend those abstractions instead of weakening the policy enforced by
   `pnpm --filter web lint` (details: STACK § Testing).
9. **Web Platform Boundaries**: Production `apps/web` code does not call `window`, `document`,
   storage, `navigator`, `fetch`, or `process` ad hoc. Put browser/platform access in the owning
   `shared/lib` adapter, network access in the owning slice's `api/`, and server environment access
   in `*.server.ts`. Extend the boundary and its lint self-test instead of adding an inline bypass.
10. **Frontend Contract**: Before writing or reviewing any `apps/web/src` code, read
    [`docs/FRONTEND.md`](docs/FRONTEND.md) — the binding architecture, code-shape, state,
    accessibility, SSR and interaction contract — and, for any visual work,
    [`DESIGN.md`](DESIGN.md), the visual system maintained through the `impeccable` skill. Where
    they and this file overlap on a frontend specific, they govern.
11. **Repository Hygiene**: Reports, build outputs and caches may remain only until their evidence
    has been analyzed. Finish code/test/build sessions with `make clean` (removes the allowlist,
    then fails if anything remains; lint/test caches are kept). Docs-only sessions skip it. Never
    substitute `git clean -fdX`: ignored dependencies, environments, secrets and data are
    protected. Temporary tools such as Lighthouse must clean their own external workspaces on exit.

Do not build local evidence caches, schedulers, snapshots or audit import services to implement
these rules.

## Interactive browser connection

Use Playwriter first for interactive browser work; read its skill before use. In this WSL
environment it needs ordinary Windows Chrome with the extension in profile `Default`; check the
profile, start Chrome if absent and retry before treating `extension_not_connected` as
unavailability. Follow [STACK's procedure](docs/STACK.md#interactive-browser-connection-wsl) and
explain any fallback. Automated repository test runners stay unchanged.

## Reading scope

Read the active change, STACK gate/tooling rows and the SPEC sections affected by the task.
Use SPEC §2.3 for content, §3–§4 for data/API, §5 plus FRONTEND and DESIGN for web, §7–§8 plus the owning
runbook for operations. Any work on EGE topic content (designing, writing, reviewing or transferring a
topic) first reads [`docs/runbooks/lesson-pipeline.md`](docs/runbooks/lesson-pipeline.md) and
[`docs/runbooks/lesson-patterns.md`](docs/runbooks/lesson-patterns.md); both are binding and their
structure, levels, patterns and checks may not be skipped or reinterpreted. Read SPEC fully for initial planning or a product/system pivot.
Search KNOWN_GOTCHAS by the affected area; the filesystem permission handoff always applies.
Archive/history is on-demand evidence, not mandatory context for every task.

## Stack Conventions

Before writing code, running commands, or reasoning about project layout, read
[`docs/STACK.md`](docs/STACK.md). If a stack convention is missing from it, do not invent it: ask
the user, then update `STACK.md` so the answer is durable.

## Library Documentation Lookup

Before writing or reviewing code that uses an external library, framework, SDK, CLI tool or cloud
service, consult current documentation: Context7 MCP when exposed; the official OpenAI docs MCP for
OpenAI products; otherwise `npx ctx7@latest library "<name>"` then
`npx ctx7@latest docs /org/project "<question>"` (official name and punctuation, at most 3 calls
per question); otherwise primary-source docs. Do not rely on training data alone. Skip only for
pure refactoring, business-logic debugging, code review of existing code or general concepts.
Never include secrets in queries; if unclear, ask rather than guess.

## Repo Memory Files

- `docs/SPEC.md`'s git history is the record of spec-level decisions (no separate decision log).
- `docs/changes/*.md` (and `docs/changes/archive/*.md`) § Implementation Notes — non-obvious
  deviations for that unit of work.
- `docs/changes/archive/COMPACTED.md` summarizes verified immutable source snapshots;
  `python3 scripts/change_history.py inspect` validates coverage and numbering, and missing/corrupt
  metadata or unavailable source history fails closed. Ordinary archives stay immutable; only an
  explicitly approved compaction change may replace them with a verified checkpoint that preserves
  unresolved items, accepted risks and human approvals ([procedure](docs/runbooks/change-history.md)).
- `docs/KNOWN_GOTCHAS.md` — recurring pitfalls, symptoms, and fixes.

The codebase is the source of truth for what currently exists; the archive is the source of truth
for what has shipped.

## Filesystem Permission Failures

On `EACCES`, `EPERM`, "Permission denied", or "Read-only file system" errors: stop immediately.
Do not `sudo`, `chmod -R 777`, delete-and-recreate elsewhere, or silently skip the step.

Post the relevant handoff message from `docs/KNOWN_GOTCHAS.md` if one exists, then wait. On the
keyword `continue`, retry once. If the same error repeats, stop and ask the user to confirm the
fix. If no gotcha entry exists, ask how to proceed and add the resolution to `KNOWN_GOTCHAS.md`.

## Git Workflow

1. `/plan` creates and switches to `feature/NN-slug` for the change it scaffolds. `/work` checks
   the current branch first and switches (creating if needed) before doing anything else.
2. Never use destructive git commands or force-push without explicit instruction.
3. Use conventional commits: `feat|fix|chore|docs|test|refactor(scope): description`.
4. `/ship` (Critical) or `/ship --full` (manual Full Gate) on PASS commits outstanding work, merges
   `feature/NN-slug` into local `main`, and archives the change file. Do not merge or push outside
   of `/ship`.
5. `/ship --release` additionally pushes `main`, verifies exact-SHA CI/published images and the
   resulting deploy via `gh` and public health. Do not push to `origin/main` any other way without
   explicit instruction.

## Workflow Playbooks

The SDD workflows are defined in `docs/playbooks/`; runtime wrappers (`.claude/skills/`,
`.agents/skills/`, `plugins/sdd-workflow/`) are thin stubs and all workflow logic lives in the
playbooks:

- [`plan`](docs/playbooks/plan.md) — select the next scope from project docs or an explicit brief,
  refresh `docs/SPEC.md` when needed, scaffold a change and its feature branch
- [`work`](docs/playbooks/work.md) — implement Backlog tasks, absorb findings from local manual
  review, run one affected-area Critical Gate
- [`ship`](docs/playbooks/ship.md) — run missing/invalidated Critical checks (or Full with
  `--full`), merge to `main`, archive, and with `--release` push and verify the deploy

### Model routing and delegation (Codex)

The project `.codex/config.toml` selects GPT-6.1 Sol (medium); `.codex/agents/` defines Luna (high)
`explorer`, `worker`, `tester`, GPT-6.1 Sol (high) `architect`, `reviewer` and Astra (high)
`escalation`. Do simple sequential tasks directly; delegate substantial independent work with at
most two concurrent children, disjoint file ownership and concise context. Children never delegate.
One parent owns Backlog updates, integration, shared gates, Docker lifecycle, cleanup, Git and
release. After two distinct failed focused attempts, or immediately for ambiguous high-risk work,
consult `escalation`; the technical `architect` cannot grant human approval. Full policy:
[agent workflow](docs/runbooks/agent-workflow.md).

## Change Lifecycle

```text
1. /plan ["brief" | path/to/draft.md]  -> auto-select scope when omitted, refresh SPEC if needed,
                                          scaffold change, create feature/NN-slug
2. Architect approves docs/SPEC.md (first time / on pivots only)
3. /work NN                            -> implement Backlog, absorb mid-session findings
4. Architect verifies the production-equivalent local result and reports findings;
   agent appends them to the Backlog and /work NN fixes them; repeat until clean
5. /ship NN | /ship NN --full          -> gate; on PASS merge to main and archive
6. /ship NN --release                  -> affected checks + Release Gate; push and verify deploy
```

`§ Implementation Notes` is a short, optional list — only what git and the diff cannot tell
(intentional deviation, residual risk, rejected alternative); never an execution log.

## Document Roles

| File | Role | Change cadence |
|------|------|----------------|
| `docs/SPEC.md` | Strategic product and system intent | Rarely; architect-approved |
| `docs/changes/NN-slug.md` | Active unit of work: Backlog, files, gate evidence, implementation notes | Continuously while active |
| `docs/changes/archive/NN-slug.md` | Completed unit of work, kept as history | Written once, by `/ship` |
| `docs/changes/archive/COMPACTED.md` | Verified historical checkpoint and immutable source index | Only an approved compaction change |
| `docs/STACK.md` | Stack, commands, gate tables, required tooling | When tooling changes |
| `docs/runbooks/verification.md` | Gate selection policy, Full environment, CI/audits, release evidence | When gate policy changes |
| `docs/FRONTEND.md` | Binding architecture, code, state, accessibility, SSR and interaction contract for `apps/web` | When frontend rules change |
| `DESIGN.md` | Visual system for `apps/web`: tokens, typography, layout, components, do's and don'ts | Through `impeccable document` when the visual system changes |
| `docs/KNOWN_GOTCHAS.md` | Recurring pitfall log | When new traps are discovered |
| `docs/runbooks/lesson-pipeline.md` | Binding pipeline for EGE topic content: source, frequency levels, subtopics, visuals, checks, architect review; the site is the lesson source (Change 197) | When the architect changes the pipeline |
| `docs/runbooks/lesson-patterns.md` | Binding catalogue of lesson skeleton and teaching patterns П1–П18 | When an architect review adds or changes a pattern |
