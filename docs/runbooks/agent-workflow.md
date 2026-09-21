# Agent execution and cost

The project default is **GPT-5.6 Terra, medium effort**, including spawned agents.
Use `codex` from this trusted repository for everyday implementation, exploration,
focused tests and routine review. For planning across domains, ambiguous production
failures, security decisions or difficult diagnosis, run:

```bash
bash scripts/codex-orchestrator.sh
```

This explicitly selects **GPT-6 Astra** while keeping Terra as the subagent default.
The launcher forwards normal Codex arguments. It does not change permissions,
global configuration, already-running conversations or another client's selected model.
An explicit model selected in the client takes precedence over repository defaults.
Inspect the client's actual selected model before attributing costs to this policy.

Project config is loaded only for trusted repositories. Current Codex profiles live
in user-level files and have lower precedence than project config; the launcher uses
an explicit model flag so the project Terra default cannot mask the Astra selection.
See [configuration precedence](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence)
and [subagent configuration](https://learn.chatgpt.com/docs/subagents).

## Delegation contract

Delegate to Terra when a concrete independent task can proceed alongside useful work
by the parent: map an unfamiliar module, implement a bounded file set, investigate a
specific failure, or review a consequential change. Do small linear edits directly.
Do not spawn an agent simply to run a known command or poll a long-running process.
Scripts execute deterministic checks; models interpret failures and make decisions.

The parent owns scope, the active change, integration, gate selection and the final
report. At most two child agents work concurrently; use one initially unless there
are two independent deliverables. Only the parent runs shared gates, Docker lifecycle,
cleanup, Git merge/push and release operations. Workers may run isolated focused tests.
No nested delegation by default. Subagents never expand production authorization.

Every assignment contains:

- The backlog ID, expected result and acceptance criteria.
- Owned files or a read-only boundary; dependencies and forbidden operations.
- Relevant paths and a concise context summary; use a fresh context when possible.
- Checks permitted and results to return: files changed, evidence, risks and blockers.
- The reminder that others share the workspace: preserve their edits.

Prefer disjoint writes. Do not assign two workers the same files or reproduce a completed
explorer investigation in the parent. The parent reviews the diff and supporting
evidence; it reruns a check only after relevant changes, incomplete evidence or a
concrete concern. Review is not a second implementation pass.

Use Terra medium first. Escalate to Astra when the task needs a cross-domain decision,
has unclear safety implications, or two materially different focused attempts have
not resolved a failure. Stop blind retries; send Astra the minimal reproduction,
observations and rejected hypotheses. A difficult task can start on Astra immediately.
Do not switch to Luna or silently increase reasoning effort to its maximum.

## Measurement pilot

For the next five changes, retain the gate JSON outside the repository and record
wall time, check executions/reuse, failed attempts, agent count and actual selected
models in the completion report. Compare similar changes, separating coding time,
gate time, environment recovery and waiting for user/external services.

Report token usage or money only when the client supplies usage and the applicable
billing basis. Otherwise write `unavailable`; elapsed time is not token usage and API
list prices do not establish the cost of a subscription session. Assess cost per
successfully completed change, including rework, rather than per model call.
After five changes, retain delegation patterns that reduced end-to-end work without
increasing regressions. No automatic model promotion or paid background benchmark.
