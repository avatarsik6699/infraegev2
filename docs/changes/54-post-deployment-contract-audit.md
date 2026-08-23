# CHANGE 54 — post-deployment contract audit

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `54` |
| Slug | `post-deployment-contract-audit` |
| Title | post-deployment contract audit |
| Status | `active` |
| Branch | `feature/54-post-deployment-contract-audit` |

---

## Goal

Audit the published Change 53 implementation, both repositories' durable contracts and the live
application/management topology after architect acceptance. Reconcile only evidence-backed drift,
preserve the infraegev2/sre-kit ownership boundary and leave credentials, telemetry and unrelated
services untouched.

---

## Backlog

### Backend
None.

### Frontend
None.

### Infra
- [x] `I1` Compare the repository-owned management SSH, WireGuard, exact-SHA deploy, Source reconciliation, publisher and backup/restore contracts with secret-free live evidence; append every confirmed implementation finding before changing it — _Depends on:_ T1
- [x] `I2` Reconcile confirmed infraegev2-owned implementation/test drift found by I1 and add the smallest focused regression coverage; record a no-change result when the live and repository contracts already agree — _Depends on:_ I1
- [x] `I3` Require the management connection env to be a current-user-owned mode-600 regular file, matching the production SSH trust boundary, and cover rejection of foreign ownership without exposing credentials — _Depends on:_ I1
- [x] `I4` Validate every transient Source input as one non-empty line and guarantee uploaded plaintext staging files are removed when remote installation fails; cover both failure paths with fake transports — _Depends on:_ I1
- [x] `I5` Remove the Full Gate's self-conflict where its Compose bootstrap occupies TanStack prerender port 3000 before the host build/performance rows, while restoring the repository-owned local service after either success or failure — _Depends on:_ I1
- [x] `I6` Fix the Full Gate web lifecycle wrapper to discover the running Compose service through the same `infra/.env` interpolation contract as bootstrap, and make the fake transport reject any regression to an empty env override — _Depends on:_ I5

### Data
- [x] `D1` Re-prove without mutation that the application and sre-kit run their published exact SHAs, all seven intended Sources are enabled/fresh/healthy, and application, operations and unrelated management services retain independent ownership — _Depends on:_ I1

### Other
- [x] `T1` Review the complete Change 53 diff with fallow's graph-grounded walkthrough plus manual trust-boundary, failure-mode and documentation review; classify findings by repository owner and severity — _Depends on:_ —
- [x] `T2` Reconcile infraegev2 SPEC, STACK, KNOWN_GOTCHAS and operator runbooks with confirmed implementation/live truth; if sibling sre-kit drift is confirmed, create a linked sre-kit change before modifying that repository — _Depends on:_ T1, I2, D1
- [x] `T3` Replace stale local-only observability guidance in the root README/runbook, document post-deploy UI verification and record that a root-password rotation must update the protected GitHub `PROD_ROOT_PASSWORD` secret before deploy — _Depends on:_ T1, D1
- [x] `T4` Create and complete a linked sre-kit change that marks the accepted M11 deployment proof complete and reconciles its README, SPEC, STACK and cross-repository gotcha from six-session-only wording to the seven-Source always-on topology — _Depends on:_ T1, D1

---

## Files

### Create / modify
~~~
docs/changes/54-post-deployment-contract-audit.md
README.md
docs/{SPEC.md,STACK.md,KNOWN_GOTCHAS.md,runbooks/**}
ops/management/**
ops/observability/{push-nginx-traffic.py,sre-kit-sources.example.json}
scripts/{management-sre-kit.sh,run-host-web-gate.sh,lib/**,tests/**}
~~~

### Read-only cross-repository audit
- `/home/niquetamerewsl/projects/sre-kit/docs/**`
- `/home/niquetamerewsl/projects/sre-kit/scripts/**`

### Do NOT touch
- Credentials, encrypted Source secrets, telemetry rows, Source identities or local fallback data
- Application/operations desired state, release directories, volumes or backup repositories
- Firecrawl/SearXNG containers, networks, services or data on the management VPS
- Product frontend/backend/content, Telegram configuration or the accepted root/password policy
- Sibling sre-kit files until a linked active change records the confirmed drift

---

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above. The codebase and live secret-free evidence are
the current-state sources of truth; archived Change 53 records intent and acceptance history.

---

## Gate Checks

In addition to the affected-area Critical Gate, capture secret-free exact-SHA, seven-Source,
WireGuard route, backup/restore status and unrelated-service ownership evidence. Any sibling
change uses its own repository gate and lifecycle.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Fallow's deterministic changed-file audit passed with no graph findings; type-aware analysis was
  unavailable because the reviewed Change 53 surface was shell/infra/docs, so the manual review
  covered transport trust, failure cleanup, lifecycle ownership and documentation drift.
- Read-only final evidence: application `3bf9771640d765835aa2e3f90d705449c074aabf`, sre-kit
  `f4c8bd6d68ad7c9fa936fcdc98cb91cf04ca56c2`, seven enabled/fresh `ok` Sources, active publisher/
  backup/restore timers, management route `10.77.0.1 dev wg0`, four application and five operations
  containers, and six unrelated Firecrawl/SearXNG containers.
- The first explicit Full Gate exposed that the lifecycle wrapper's empty env override prevented
  Compose service discovery. I6 aligns discovery with bootstrap's `infra/.env` interpolation and
  makes the fake transport reject that regression before the repeated release gate.

---

## Commit Message

```
chore(change-54): reconcile deployed observability contracts
```
