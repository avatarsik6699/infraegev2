# CHANGE 55 — Observability Contract Reconciliation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `55` |
| Slug | `observability-contract-reconciliation` |
| Title | Observability Contract Reconciliation |
| Status | `archived` |
| Branch | `feature/55-observability-contract-reconciliation` |

---

## Goal

Remove confirmed drift between the accepted always-on management deployment, infraegev2's current
operator/learning documentation and the Source registration contract. Preserve the local
`sre-kit-local` path strictly as a disabled fallback and make the operator template use the same
adapter identifier vocabulary as the live sre-kit API and reconciliation code.

---

## Backlog

### Backend

None.

### Frontend

None.

### Infra

- [x] `I1` Reconcile the secret-free Source template with the live seven-Source management
  configuration and canonical `adapter_id` API vocabulary; update the focused contract assertion
  so future drift fails locally — _Depends on:_ —
- [x] `I2` Replace workstation-primary guidance across the analytics, incident-response and staged
  observability documents with the accepted always-on management topology while preserving
  `sre-kit-local` as a manual fallback and target/core lifecycle independence — _Depends on:_ I1
- [x] `I3` Isolate the Full Gate Compose project and host-port namespace from unrelated
  repositories with an explicit `infraege-full-gate` identity, align the host web lifecycle
  wrapper and add regression coverage after the release gate exposed a live `infra` collision — _Depends on:_ I2

### Data

None.

### Other

- [x] `T1` Reconcile SPEC metadata/current-state wording and cross-repository links with linked
  sre-kit Change 30 without turning historical evidence into a live guarantee — _Depends on:_ I2
- [x] `T2` Run repository formatting, documentation-link/source-template integrity checks and a
  fallow changed-file audit; record any new confirmed discrepancy before fixing it — _Depends on:_ T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/guides/observability/{README.md,01-infraegev2-as-a-system.md,06-placement-and-lifecycle.md,07-end-to-end-scenarios.md,08-overlap-and-redundancy.md,09-failure-matrix.md}
docs/runbooks/{analytics.md,incident-response.md}
docs/{STACK.md,KNOWN_GOTCHAS.md}
infra/docker-compose.override.yml
ops/observability/sre-kit-sources.example.json
scripts/{run-host-web-gate.sh,tests/ops-stack-definition.test.sh,tests/host-web-gate.test.sh}
docs/changes/55-observability-contract-reconciliation.md
~~~

### Do NOT touch

- Product frontend/backend/content or generated API contracts
- Production credentials, Source identities, telemetry, deployment state or protected files
- Application/operations/management desired state and lifecycle scripts
- Archived change history except this change's own archival during `/ship`

---

## Contracts

See `docs/SPEC.md` §7–§9 and the Files list above. The deployed code, live secret-free evidence and
sre-kit HTTP contract are current-state sources of truth; archived changes remain historical.

---

## Gate Checks

In addition to the documentation-only Critical Gate, run
`bash scripts/tests/ops-stack-definition.test.sh`, validate all relative links in the changed
Markdown files, and use `fallow audit --base main` for the changed TS/JS surface (if any).

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The first Full Gate found that Compose's directory-derived `infra` project name was already
  owned by `/home/niquetamerewsl/job/backend/infra`; it created this repository's stopped
  containers and replaced that project's `Nginx` container before the PostgreSQL port conflict
  stopped bootstrap. Restoring the unrelated project requires separate user authorization.

---

## Commit Message

```
docs(change-55): reconcile observability contracts
```
