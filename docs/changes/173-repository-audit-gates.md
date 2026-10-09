# CHANGE 173 — Repository audit, context compaction and gate efficiency

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `173` |
| Slug | `repository-audit-gates` |
| Title | Repository audit, context compaction and gate efficiency |
| Status | `active` |
| Branch | `feature/173-repository-audit-gates` |

---

## Goal

Resolve confirmed documentation drift after changes 154–172, compact their history and completed
artifacts with exact-byte recovery, move live tooling out of `docs/artifacts`, shrink always-read
documents without losing rules, and make gates cheaper in time and agent context. Architect
decisions (2026-10-09): compact 154–172 plus artifacts; relocate live tooling; add the advisory
`gate.py affected` selector and summarized gate output; full Vitest/`pytest -m pure` in Critical and
Full via the isolated script are excluded.

---

## Backlog

### Other
- [x] `T1` Record verified audit findings with a disposition each in § Audit findings (no separate artifact file). — _Depends on:_ —
- [x] `T2` Fix confirmed drift: published-topic count (README/SPEC → registry pointer), Caveat font, tracker `async`, prerender claim, PR-template sentence, practice page sizes, template `/api/v1`, STACK decorative-artwork and pyright paths, README host tools, plan.md step/`$plan`, CLAUDE Context7 sentence, Codex plugin manifest/README hook, ship wrapper `Edit`, agent-workflow absolute path/role, gotcha `build.py` path. — _Depends on:_ T1
- [x] `T3` Rewrite the completed 122→140 account cutover as one generic schema-transition attestation rule in STACK, ship, production and backup-restore; retire `practice-transition.md` through T8; keep cutover scripts. — _Depends on:_ T1
- [x] `T4` Give each repeated rule one canonical home (gate policy, browser, hygiene, E2E, layers, Codex routing, history tooling → new `docs/runbooks/change-history.md`, Full environment); compress AGENTS, STACK and playbooks; plan reads COMPACTED prose only; ship names the exact release-checkpoint command. — _Depends on:_ T2, T3
- [x] `T5` Compress KNOWN_GOTCHAS by verdict: delete obsolete/covered entries, merge duplicates, split the redesign bundle, restore title/template order. — _Depends on:_ T4
- [x] `T6` Trim SPEC change narratives and duplicates of FRONTEND/DESIGN/runbooks; move host decisions to production runbook and bibliography to lesson-patterns; rewrite §9 as ordered unfinished outcomes. Contract sections unchanged. — _Depends on:_ T2
- [x] `T7` Relocate live tooling: lesson-design → `content/lesson-design`, lesson-media engine → `scripts/lesson_media`, mascot pipeline → `scripts/mascot`, v5 mockups → `docs/artifacts/mockups-v5`, readiness → `docs/artifacts/release-readiness.md`; update consumers; regenerate and prove no drift. — _Depends on:_ T8
- [x] `T8` Compact 154–172 and retired artifacts by exact manifest (incl. six files deleted in `10c759b`, restored first); preserve unresolved items, risks and approvals; verify byte recovery. — _Depends on:_ T1
- [x] `T9` Remove confirmed dead code/files (badge, back-navigation, legacy-progress fixture, aggregate numbers.txt, task-content-assets, VERSION, release-checkpoint shim, stale clean/prettier entries); extend `.gitignore`; `pg_isready -d postgres` in account-cutover. — _Depends on:_ T1
- [x] `T10` Independent review, one affected Critical through `gate.py affected`, cleanup, local ship. — _Depends on:_ all

### Infra
- [x] `I1` One host-Python file list shared by ruff, format, pyright, gate and CI; include lesson tooling and fix findings. — _Depends on:_ T7
- [x] `I2` CI calls `gate.py run` groups; add format; drop duplicate registry check; no cancel on `main`; conditional shellcheck install; rename `web-build-ci`. — _Depends on:_ I1, I4
- [x] `I3` Cheaper hygiene: `make clean` applies and checks with counts; dry-run optional; lint caches survive; docs-only sessions exempt. — _Depends on:_ —
- [x] `I4` Summarized `gate.py run`: per-group log under `.output/gate/`, PASS/FAIL with seconds, failure tail, `--keep-going`; dot Playwright reporter under gate. — _Depends on:_ —
- [x] `I5` Advisory `gate.py affected [--base]` mapping changed paths to groups and reminders; no cache; verification.md describes it. — _Depends on:_ I4
- [x] `I6` Type-check web tests/e2e; shellcheck all tracked `.sh`; `lesson-media` and `infra-config` groups; inventory orphan shell tests; resolve `run-browser-portfolio.sh`. — _Depends on:_ I5
- [x] `I7` Gate evidence block in CHANGE_TEMPLATE; drop stale verification.md sections. — _Depends on:_ I4
- [x] `I8` Root `ruff.toml` extending the API config so every Ruff invocation outside `apps/api` (editor hooks, ad-hoc runs) uses the project line length and never formats Markdown (architect finding 2026-10-09). — _Depends on:_ I1
- [x] `I9` Local environment (no repo change): reinstall the global LSP/MCP tools (`pyright`, `typescript-language-server`, `typescript@5.9.3` with `tsserver`, `@upstash/context7-mcp`, `@treedy/*-mcp`) into the current nvm default Node; record the gotcha (architect finding 2026-10-09). — _Depends on:_ —
- [x] `I10` Review findings: gate groups run `bash -c` (a login shell may reset CI PATH), quote paths; a missing executable is a FAIL (127) not a traceback; `affected` ignores deleted paths; doc-link checker reads NUL-separated paths. — _Depends on:_ I4, I5

---

## Files

### Create / modify
~~~
AGENTS.md CLAUDE.md README.md DESIGN.md .gitignore .prettierignore package.json Makefile
docs/{SPEC,STACK,FRONTEND,KNOWN_GOTCHAS,CHANGE_TEMPLATE}.md docs/playbooks/* docs/runbooks/*
docs/runbooks/change-history.md (create) docs/changes/archive/COMPACTED.md
.claude/skills/ship/SKILL.md plugins/sdd-workflow/** .github/workflows/quality.yml
scripts/gate.py scripts/lib/gate/** scripts/check-shell.sh scripts/clean-local-artifacts.sh
scripts/pyrightconfig.json scripts/tests/** scripts/lesson_design/** apps/web/tsconfig*.json
apps/web/playwright*.config.ts relocated tooling and its consumers; deletions per T8/T9
~~~

### Do NOT touch
- Production, databases, Docker volumes, dependency versions/locks, Git history, push/deploy.
- `infra/practice-import-120.local`, `content/practice-bank`, 122→140 cutover scripts (except T9 readiness flag).
- Binding rules in `lesson-pipeline.md` / `lesson-patterns.md` (paths and moved bibliography only); DESIGN visual system (Caveat reference only).

---

## Contracts

See `docs/SPEC.md` §3–§4 and the Files list above. Public HTTP/schema contracts remain unchanged.

---

## Gate Checks

Affected Critical only, selected with `gate.py affected`; history real-Git tests and byte recovery
for T8; `export_media --check`/lesson tests after T7; gate unit tests; link/path integrity over live
Markdown. No E2E: no UI behavior changed (only unused Badge removed and test fixtures fixed).

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| `10c759b` + worktree | `format`, `python-format`, `tooling-lint`, `web-lint`, `web-typecheck` (incl. tests/e2e), `shell-lint` (all 54 `.sh`), `host-ruff`, `host-python`, `docs-links`, `lesson-media`, `infra-config`, `content-static` | PASS | ≈65 |
| same | Vitest 8 affected files (67 tests); unittest gate/history/release/cutover (40); engine test (24); shell contracts clean, lifecycle, host-web-gate, root-password, production-env, restore-readiness, lighthouse, auxiliary-pages (Docker), account-cutover | PASS | ≈90 |
| same | 169 compacted paths `read --source` byte-identical; lessons 23/25 `export_lesson`, `export_media --check`, `bank.py`, `checks.py`, `verify_code.py`, stand build; 5 still figures rebuilt byte-identical | PASS | — |
| same | LSP diagnostics | PASS after I9 restored `pyright-langserver`/`typescript-language-server` (core.py symbols, test hover); binding `pyright`/`tsc` passed | — |
| same + I8–I10 | Independent code review (no blockers; major `bash -lc` and four minors fixed in I10); `gate_test` (15), `format`, `python-format`, `host-ruff`, `host-python`, `docs-links`, `api-lint` | PASS | ≈25 |

---

## Audit findings

| ID | Evidence / finding | Disposition |
|---|---|---|
| A01 | README/SPEC counted seven published topics; registry has eight (topic 23). | Point to the publication registry instead of a count (T2). |
| A02 | Commit `10c759b` deleted six lesson audit/quality records outside compaction; archive 157 linked to one. | Restored from `a8aaf23` into the 154–172 snapshot manifest, then removed (T8). |
| A03 | 122→140 account cutover (done 2026-09-26) still read as a live release step in STACK, ship, production, backup-restore; `practice-transition.md` described a finished transition. | One generic schema-transition attestation rule; runbook compacted (T3, T8). |
| A04 | SPEC §9 roadmap listed shipped Changes 171–172 only; `/plan` self-scoping had no next outcome. | Ordered unfinished outcomes with an explicit clarification marker (T6). |
| A05 | Codex `plugin.json` advertised review notes, fast gate and Full-on-ship; plugin README called an unloaded hook active; ship wrapper lacked `Edit`; CLAUDE.md claimed Context7 MCP was wired (binary absent here). | Corrected (T2). |
| A06 | Stale facts: Caveat font (unused), tracker `defer` (code `async`), prerender scope, PR-template checklist, practice page size 30/next-task UI, template `/api/v1`, "no decorative artwork", absolute path and missing `test-debugger` role in agent-workflow. | Corrected (T2). |
| A07 | Same rules repeated in 3–10 places (gate cadence, browser, hygiene, E2E, layers, routing, history, Full environment); always-read set ≈2,300 lines. | One canonical home each; AGENTS 229→~150, STACK 637→400, GOTCHAS 775→360, README 294→~75 (T4, T5). |
| A08 | SPEC carried change-numbered narratives, host-retirement decisions, bibliography and a policy section that duplicated STACK/runbooks. | Trimmed 769→668 lines; decisions → production runbook, bibliography → lesson-patterns (T6). |
| A09 | ≈3,000 lines of uncompacted archives 154–172 and ≈9 MB of finished artifacts (Change 155/156 evidence, 164 candidate, mascot demo, mood board, one-off recursion checks). | 169-path snapshot, byte recovery verified (T8). |
| A10 | Live tooling lived among artifacts (`lesson-design`, `lesson-media`, mascot pipeline under `change-170/`), plus a 44 MB ignored `node_modules`. | Relocated; outputs regenerate byte-identically (T7, L1). |
| A11 | Dead code: Badge, back-navigation, legacy-progress fixture (tests tested fixture code), public `numbers.txt`, `task-content-assets` validator, `VERSION`, release-checkpoint shim, stale cleanup/prettier entries. | Removed (T9). |
| A12 | No code chose checks; `gate.py` unused by any change; CI duplicated commands inline; host-Python list copied in five drifting places. | Advisory `gate.py affected`, CI on gate groups, one host-Python list (I1, I2, I5). |
| A13 | Gate output streamed whole logs into context; Playwright `list` reporter. | Summary lines + failure tail, per-group logs, `dot` under gate (I4). |
| A14 | `make clean` deleted ESLint/Ruff/pytest caches before every next gate; hygiene was a three-command ritual even for docs. | Caches kept; `make clean` applies and verifies; docs-only exempt (I3). |
| A15 | Not type-checked: `apps/web/tests`, `e2e`, Playwright configs; ten real errors including `use.reducedMotion` silently ignored by Playwright 1.62. | Included in `tsconfig.json`, errors fixed (I6). |
| A16 | ShellCheck covered 24 of 54 scripts; 17 `! cmd` test assertions never failed under `set -e`. | All tracked `.sh` checked; assertions made real (I6). |
| A17 | `scripts/lesson_design` and lesson stands had no Ruff/Pyright; Ruff 0.16 also rewrites Python inside Markdown. | Added to host groups with `extend-exclude = ["*.md"]`; 14 typing findings fixed (I1). |
| A18 | `quality.yml` cancelled in-progress `main` runs, leaving a pushed SHA without release evidence; duplicate registry check. | No cancel on `main`; duplicate removed (I2). |
| A19 | `/ship` had nothing recorded to compare against; timing request in verification.md never fulfilled. | Gate evidence block in the template (I7). |
| A20 | `account-cutover.sh` readiness probe omitted `-d postgres` (false FATAL log). | Fixed (T9). |
| A21 | Not changed: cutover scripts (production state unverified), `infra/practice-import-120.local` (operator data), legacy `content/tasks` fixtures, Git history size (rewrite not authorized). | Recorded only. |

---

## Implementation Notes

- Snapshot source is `a8aaf23` (last commit before `10c759b`), so the six records deleted outside
  compaction enter verified history without an extra restore commit.
- `pyright` covers `scripts/lesson_design` and `content/lesson-design` only; `scripts/lesson_media`
  and `scripts/mascot` need Pillow outside the API environment and are Ruff-only.
- `tests/`, `e2e/` and Playwright configs joined `apps/web/tsconfig.json` instead of a second
  config: one program for `tsc`, LSP and editors.
- Strengthened shell assertions (`! cmd` → `if cmd; then exit 1; fi`) all still pass.
- Kept: `make clean-check`/`clean-dry-run` targets (optional), cutover scripts, `codex-orchestrator.sh`,
  duplicate Codex wrapper copies (`.agents/skills` and plugin) — low value to churn.

---

## Commit Message

```
chore(change-173): repository audit — compaction, docs, gate selector
```
