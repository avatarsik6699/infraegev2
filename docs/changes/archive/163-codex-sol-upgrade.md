# CHANGE 163 — Codex models and local environment

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `163` |
| Slug | `codex-sol-upgrade` |
| Title | Upgrade Codex models and align the local development environment |
| Status | `archived` |
| Branch | `feature/163-codex-sol-upgrade` |

## Goal

Replace GPT-6 Sol with GPT-6.1 Sol in active project and user Codex configuration,
as requested in chat. Preserve role boundaries, reasoning effort and concurrency.
Resolve the subsequent environment audit findings in the same change: skills, user defaults,
role selection, MCP launchers, plugin registrations, shell setup and stale guidance.
Inspect history discrepancies without discarding retained conversations.

## Backlog

### Other

- [x] `T1` Upgrade project primary/fallback and architect/reviewer model settings; align active instructions and runbook — _Depends on:_ —
- [x] `T2` Inspect user settings and replace remaining GPT-6 Sol references; verify TOML, strict loading and a fresh read-only delegation smoke — _Depends on:_ T1
- [x] `T3` Align UI review, web verification and documentation lookup skills with Playwriter, proportional project gates and MCP-first lookup — _Depends on:_ —
- [x] `T4` Set WSL and Windows user model defaults to GPT-6.1 Sol; clarify global/project reviewer and test-role selection — _Depends on:_ T1
- [x] `T5` Decouple MCP launch commands from removable NVM version directories; retain tested package versions and verify startup — _Depends on:_ —
- [x] `T6` Reconcile old local plugin registrations against the effective installed catalog; preserve working integrations — _Depends on:_ —
- [x] `T7` Make user PATH setup idempotent; reconcile Playwriter documentation and remove obsolete Change 146 instructions — _Depends on:_ —
- [x] `T8` Add the requested memory correction through an append-only update note — _Depends on:_ T4
- ~~`T9`~~ (removed by architect 2026-10-01: supported native history recovery is unavailable; investigation, preserved evidence and the remaining limit are recorded in Implementation Notes, no repair is pending in this change) — _Depends on:_ —
- [x] `T10` Independently review the complete changes, run affected configuration/tool smoke checks and hygiene, and record remaining limits — _Depends on:_ T3, T4, T5, T6, T7, T8, T9

## Files

### Create / modify

~~~
.codex/config.toml
.codex/agents/architect.toml
.codex/agents/reviewer.toml
AGENTS.md
docs/STACK.md
docs/runbooks/agent-workflow.md
docs/changes/163-codex-sol-upgrade.md
External user configuration: ~/.codex/config.toml
External: Windows user .codex/config.toml, ~/.codex/agents/*.toml
External: ~/.agents/skills/{dsh-ui-review,dsh-web-verify,find-docs}/SKILL.md
External: ~/.local/bin MCP launchers and their private runtime
External: ~/.bashrc, ~/.profile, ~/.config/shell/path.sh
External: ~/.local/share/playwriter-runtime/README.md
External: ~/.local/share/codex-mcp-runtime/{package.json,package-lock.json,README.md}
External: ~/.codex/memories/extensions/ad_hoc/notes/ (new correction note only)
External: metadata-only history audit/recovery evidence under ~/.local/share/
~~~

### Do NOT touch

- Archived changes, existing memory files, conversation contents, model catalogs and application code.
- No deletion or rewrite of live history databases or rollout lineage without an exact reviewed recovery plan.
- Pre-existing untracked `.impeccable/` artifacts.

## Contracts

See [STACK](../../STACK.md) native Codex acceptance and
[agent workflow](../../runbooks/agent-workflow.md). SPEC product/runtime contracts are unchanged.

## Gate Checks

Use the affected Critical Gate from [STACK](../../STACK.md): TOML parsing, strict Codex
configuration loading, fresh session/delegation runtime evidence and repository hygiene.
Application lint, types, LSP, API regeneration and browser checks are inapplicable to TOML/docs.
For external shell launchers, run Bash/POSIX syntax and behavior checks. Validate modified skills;
verify MCP handshakes and read-only tool calls with NVM absent from PATH, user defaults through
a fresh strict Codex session, plugin inventory equality and repeated shell startup.
Obtain an independent review of external settings as well as the repository diff.

Acceptance (2026-10-01): skill-creator validation passed for all three skills; TOML parsing,
`bash -n`, PATH edge cases and repeated login/interactive startup passed. Fresh user-level
`codex exec --strict-config --ephemeral --sandbox read-only` selected GPT-6.1 Sol/medium.
Context7 lookup, Python diagnostics/hover, TypeScript diagnostics/hover and Fallow project_info
responded using the private runtime without NVM. Plugin inventory/enabled states were preserved.
TypeScript MCP reports two existing TS7006 diagnostics on router.tsx on both old and new
launchers; the binding `pnpm --filter web typecheck` passed, so these are auxiliary-LSP divergence,
not a regression introduced here. Independent review has no remaining findings for T3–T8.
Windows defaults were TOML-validated; native Windows inference and a full browser journey were
not run because no browser behavior or Windows launcher changed. Doctor passes other checks
but retains the T9 history warning. SQLite recovery copies pass integrity and foreign-key checks.

## Implementation Notes

- The initial model replacement preserved Astra/Windows defaults; the follow-up audit scope now
  explicitly includes unifying user defaults. External user settings are not part of Git delivery.
- Acceptance: TOML assertions and `git diff --check` passed; Codex 0.159.3
  `exec --strict-config --ephemeral --sandbox read-only` loaded GPT-6.1 Sol/medium
  and completed the reviewer delegation smoke (`SOL61_PRIMARY_OK`, `SOL61_CHILD_OK`).
  Application gates are inapplicable; TOML/Markdown are outside repository formatters.

- Independent review found a missing lazy Pyright dependency in the private MCP runtime.
  Pinned `pyright@1.1.411` was added; diagnostics and hover now execute without NVM.
- T9 investigation and preservation are complete, but recovery is not: all 94 missing-rollout
  rows retain 34,368 native items. Verified SQLite backups, corrected lineage counts and a
  local support packet are under `~/.local/share/codex-maintenance/change-163/history/`.
  No supported repair or intact original was found; no live history was rewritten/deleted.
  Doctor's history warning remains. T9 was removed from this change by the architect on
  2026-10-01 so that it can ship; the history warning is an accepted, documented residual limit,
  recoverable only through a future supported upstream repair or an explicit destructive decision.

## Commit Message

```text
chore(change-163): align Codex models and local tooling
```
