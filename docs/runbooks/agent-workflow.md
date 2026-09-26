# Native Codex agent workflow

The primary agent automatically delegates substantial independent work under AGENTS.md.
Simple sequential tasks stay with the primary. This is native model-directed orchestration,
not a deterministic scheduler or a promise of reduced token cost.

## Launch and roles

Start a new Codex session in this trusted repository, or from any directory run:

```bash
bash /home/niquetamerewsl/projects/infraegev2/scripts/codex-orchestrator.sh
```

Then invoke the existing work skill, for example `$work 146 T5`. The launcher changes to the
repository and forwards normal Codex arguments. It does not change global settings, permissions
or an existing session's model. Explicit client selections override the project default.
Use `/status` and `/agent` to inspect the actual primary and child sessions.

| Role | Model / effort | Deliverable |
|------|----------------|-------------|
| Primary / unclassified fallback | Sol / medium | Scope, decomposition, integration, acceptance |
| `explorer` | Luna / high | A bounded code-path or dependency map with references |
| `worker` | Luna / high | Settled implementation in explicitly owned files |
| `tester` | Luna / high | Isolated reproduction or owned behavioral tests |
| `architect` | Sol / high | Cross-module design, dependencies and acceptance plan |
| `reviewer` | Sol / high | Independent findings on the completed scoped diff |
| `escalation` | Astra / high | Difficult diagnosis or consequential risk decision advice |

The standalone `.codex/agents/*.toml` files supply `name`, `description` and
`developer_instructions`, plus model/effort and sandbox defaults. Codex discovers these files;
no duplicate `[agents.<role>]` registry is needed. `explorer` and `worker` intentionally override
the built-in roles. Unclassified subagents default to Sol; only explicitly bounded roles use Luna.
The concurrency cap is **two children**, excluding the primary.

Custom role model/effort settings take precedence over the initial resolution from explicit
spawn settings, `[agents]` defaults and parent settings. Use a fresh or short context when
delegating. If an older running session cannot see these custom roles, start a new session;
do not claim role activation from the presence of TOML alone. If a model is unavailable, report
the failure and use the capable primary for the task; do not silently change model or retry forever.

Read-only role defaults are defense in depth, not an absolute boundary: Codex reapplies live
parent permission overrides when spawning. All read-only assignments must explicitly prohibit
mutations even when the parent runs with full access. No role increases production authority.

## Automatic execution loop

1. Parent resolves the authorized change/Backlog and dependencies through the existing work
   playbook. Append architect findings before acting. New scope uses the existing plan workflow.
2. Parent splits substantial work into concrete deliverables. Use an explorer only for a real
   unknown, or an architect for unsettled design. Run independent reads alongside useful local work.
3. Delegate settled implementation to workers with disjoint ownership. Normally use one writer
   plus a read-only child; a second writer is allowed only with demonstrably independent files and
   no shared generated outputs, fixtures, browser state or environment mutations. Serialize shared
   dependencies. Do not introduce worktrees/snapshots just to force parallelism.
4. Integrate completed writes before testing their behavior. A tester may write only assigned
   test/support files and run agreed isolated checks. The parent owns shared acceptance commands.
5. Obtain an independent reviewer for substantial implementation after the scoped diff settles.
   Parent resolves findings through a bounded worker follow-up or locally, then checks the affected
   behavior. Stop blind retries after two distinct failed attempts and consult `escalation` with
   reproduction, observations and rejected hypotheses. Ambiguous high-risk work goes there directly.
6. Parent runs one affected Critical for the coherent target set, performs repository hygiene,
   updates Backlog status and reports remaining gaps. Do not repeat worker evidence without changed
   inputs or a concrete concern. Local ship/release remain separately authorized workflows.

Skip any role that has no useful deliverable. Children never spawn children or run a separate
complete `/work` cycle. Only the parent updates the Backlog, changes branches, commits, merges,
pushes, operates Docker, cleans artifacts or releases. A technical `architect` is advisory and
cannot grant the human architect's approval. Permission failures follow AGENTS.md immediately.

Every assignment contains:

- Backlog ID, expected result and acceptance criteria.
- Exact owned files or a read-only boundary; dependencies and forbidden operations.
- Relevant contract paths and concise context; avoid entire conversation dumps.
- Permitted focused checks, and the reminder: you are not alone; preserve others' edits.
- Required return: files changed, concise evidence, commands/results, risks and blockers.

Reuse an existing child for a related correction. Finish or close completed child threads when
the client supports it; avoid holding idle threads against the cap. Parent work must not duplicate
a completed exploration. Deterministic commands belong in existing runners, not extra model turns.

## Verification and handoff

For config changes, parse TOML, use the installed Codex strict-config loader, inspect available
roles/model settings in a fresh session, and run a small read-only delegation smoke. A catalog
entry proves advertised availability; a successful child turn proves that model route responded.
Inspect runtime metadata when asserting the selected model; a model's self-report is not proof.
Do not read secrets or run app gates for agent configuration. For the shell launcher use the
repository `pnpm lint:shell` command and verify argument forwarding. Finish with reviewed
`make clean-dry-run`, `make clean`, `make clean-check`.

Change 146 preparation is T8. Completing it does not complete T5–T7 or the remaining infrastructure
and product acceptance tasks. Resume with `$work 146` (or `$work 146 T5` for a bounded first set)
in the new session, which must reread the current change and preserve the dirty tree.

When a real change feels slow, report the dominant step. Compare subsequent changes opportunistically;
do not create a benchmark platform, force all roles to run, or claim cost savings without usage data.

Configuration reference checked 2026-09-26 with Codex CLI 0.157.1:
[OpenAI subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) and
[configuration precedence](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence).
The user-supplied `docs/artifacts/multiagents.md` is source research, not the binding runtime contract.
