# CHANGE 51 — Current Contract Reconciliation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `51` |
| Slug | `current-contract-reconciliation` |
| Title | Current Contract Reconciliation |
| Status | `active` |
| Branch | `feature/51-current-contract-reconciliation` |

---

## Goal

Make infraegev2's durable documentation describe the already-shipped legal, analytics,
observability and production state without presenting historical release evidence as current
runtime state. Preserve the established repository boundary with sibling sre-kit and keep
historical change records unchanged.

---

## Backlog

### Backend
None

### Frontend
None

### Infra
None

### Data
None

### Other
- [x] `T1` Reconcile README, SPEC and KNOWN_GOTCHAS with the published operator identity and contacts while keeping only formal legal review and Roskomnadzor notification as deferred risk — _Depends on:_ —
- [x] `T2` Refresh README and SPEC roadmap/current-sequence wording for completed documentation stabilization and continuous aggregate delivery, leaving the third-topic/Python choice as the honest next product decision — _Depends on:_ T1
- [x] `T3` Recast the split-stack SHA as historical cutover evidence, distinguish the seven production sre-kit manifests from the test stub and expose the analytics runbook from README — _Depends on:_ —
- [x] `T4` Validate Markdown links, content/API drift, operations topology and the linked sre-kit contracts after both repositories are aligned — _Depends on:_ T1, T2, T3
- [x] `T5` Align the binding frontend legal-copy rule with the architect-supplied operator details while retaining the ban on invented or silently replaced requisites — _Depends on:_ T1

---

## Files

### Create / modify
~~~
README.md
docs/SPEC.md
docs/STACK.md
docs/FRONTEND.md
docs/KNOWN_GOTCHAS.md
docs/changes/51-current-contract-reconciliation.md
~~~

### Do NOT touch
- Application/frontend/backend behavior, lesson content or production runtime
- Production credentials, source tokens, Compose/systemd state or sibling sre-kit files
- Historical files under `docs/changes/archive/`

---

## Contracts

See `docs/SPEC.md` §1 and §7–§10 and the Files list above. The current implementation and public
privacy surface are the source of truth for this reconciliation.

---

## Gate Checks

In addition to the documentation-only Critical Gate, validate Markdown links, content/API drift,
operations topology and the sibling sre-kit manifest/template boundary.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
docs(change-51): reconcile current project contracts
```
