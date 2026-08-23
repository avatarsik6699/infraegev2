# CHANGE 52 — Observability Learning Guide

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `52` |
| Slug | `observability-learning-guide` |
| Title | Observability Learning Guide |
| Status | `archived` |
| Branch | `feature/52-observability-learning-guide` |

---

## Goal

Preserve the staged explanation of the `infraegev2` and `sre-kit` observability architecture as a
self-contained Markdown learning path. The guide must begin with independently understandable
parts, progressively assemble their interactions, distinguish durable contracts from current
runtime state, and point readers to the existing operational sources of truth instead of replacing
them.

---

## Backlog

### Other

- [x] `T1` Add a navigable Markdown learning path covering the product boundary, signal types, Sources and adapters, core processing, dashboards and alerts, physical placement and lifecycle, end-to-end flows, intentional overlap, and failure diagnosis — _Depends on:_ —
- [x] `T2` Cross-check the guide against current `infraegev2` and sibling `sre-kit` contracts, mark runtime facts as snapshots, and add links to canonical runbooks/configuration — _Depends on:_ T1

---

## Files

### Create / modify

~~~
docs/guides/observability/README.md
docs/guides/observability/01-infraegev2-as-a-system.md
docs/guides/observability/02-signals.md
docs/guides/observability/03-sources-and-adapters.md
docs/guides/observability/04-sre-kit-core.md
docs/guides/observability/05-dashboard-and-alerts.md
docs/guides/observability/06-placement-and-lifecycle.md
docs/guides/observability/07-end-to-end-scenarios.md
docs/guides/observability/08-overlap-and-redundancy.md
docs/guides/observability/09-failure-matrix.md
docs/changes/52-observability-learning-guide.md
~~~

### Do NOT touch

- Application, operations, deployment, and observability runtime code
- Sibling `sre-kit` repository
- Existing production and onboarding runbooks
- `docs/SPEC.md` and `docs/STACK.md` contracts

---

## Contracts

See `docs/SPEC.md` §7–§10, `docs/STACK.md` Observability and Initial setup sections, and the Files
list above. The codebase and those documents remain the source of truth; this change adds an
educational reading path only.

---

## Gate Checks

Documentation-only change: formatting, lint, type-check, tests, LSP, and API regeneration are
`SKIPPED` as not applicable. Verify relative Markdown links and terminology with repository
searches.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```text
docs(change-52): add staged observability architecture guide
```
