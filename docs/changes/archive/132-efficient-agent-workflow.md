# CHANGE 132 — Efficient verification and agent workflow

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `132` |
| Slug | `efficient-agent-workflow` |
| Title | Efficient verification and agent workflow |
| Status | `archived` |
| Branch | `feature/132-efficient-agent-workflow` |

## Goal

Implement the approved release retrospective: deterministic, resumable verification with proportional coverage, fewer duplicate checks, durable release evidence, and Terra for everyday work with Astra for orchestration and difficult diagnosis. Preserve security and explicit production authorization; measure execution rather than promise unmeasured savings. SPEC §7–§8 product and operations guarantees remain unchanged.

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] I1 Implement a supported gate runner with inspectable plans, per-step JSON timing/status, protected durable state, cancellation and conservative input-aware resume; add focused failure/invalidation tests. — _Depends on:_ —
- [x] I2 Select affected checks with an explicit risk map and conservative fallback; deduplicate accessibility within E2E and reuse the same verified frontend build for performance. Keep security fresh at release. — _Depends on:_ I1
- [x] I3 Persist release checkpoints and require fresh exact-SHA CI/image/deploy evidence; use published-digest image scanning as the release authority and avoid duplicate local image builds. Resume must not replay production mutations. — _Depends on:_ I1
- [x] I4 Configure project-scoped Terra defaults and Astra orchestration entry point; document bounded delegation, ownership, escalation and measurement of retries/duration/available usage. — _Depends on:_ —
- [x] I5 Align AGENTS, STACK, workflow playbooks and wrappers with the executable policy; run the affected Critical Gate and cleanup once for this target set. — _Depends on:_ I1, I2, I3, I4

- [x] I6 Fix final-review coverage gaps: public content assets require content validation; API Critical requires contract drift and consumer type-check. Add focused regressions before shipping. — _Depends on:_ I1, I2
- [x] I7 Bind postdeploy observations to the configured endpoints: reject redirects and mismatched health/home origins; test these wrong-target failures. — _Depends on:_ I3

## Files


### Create / modify

```text
scripts/gate.py, scripts/lib/gate/, scripts/tests/gate_test.py
scripts/release-checkpoint.py, scripts/release_checkpoint.py, scripts/tests/release_checkpoint_test.py
.github/workflows/deploy.yml
scripts/pyrightconfig.json, scripts/check-shell.sh, package.json
.codex/config.toml, scripts/codex-orchestrator.sh
AGENTS.md, docs/STACK.md, docs/playbooks/{plan,work,ship}.md
docs/runbooks/verification.md, docs/runbooks/agent-workflow.md
docs/runbooks/production.md
.agents/skills/{work,ship}/SKILL.md, .claude/skills/{work,ship}/SKILL.md
plugins/sdd-workflow/commands/, plugins/sdd-workflow/skills/
docs/CHANGE_TEMPLATE.md
```

### Do NOT touch

- Application behavior, content, production data and immutable archives.
- Global Codex configuration and unrelated repositories.

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above. Explicit Full remains available; unknown inputs fail conservatively. Release coverage may reuse valid evidence, never an unverified assertion or stale security/production status.

## Gate Checks

Use the affected Critical Gate in [STACK](../../STACK.md): repository format, focused runner/checkpoint tests, host Python type-check and LSP, shell contract checks for the launcher. Full application suites are not executed merely to test orchestration: subprocess fakes exercise selection, invalidation, interruption and release evidence failures.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Resume intentionally reuses only exact-input static checks/build artifacts. External-state checks remain fresh; database bootstrap/seed acceptance remains an explicit operator prerequisite. This avoids claiming cross-revision or database-state equivalence from source hashes.

## Commit Message

```text
feat(change-132): streamline verification and agent routing
```
