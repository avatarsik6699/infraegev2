# CHANGE 62 — Project Contract Audit

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `62` |
| Slug | `project-contract-audit` |
| Title | Project Contract Audit |
| Status | `archived` |
| Branch | `feature/62-project-contract-audit` |

---

## Goal

Reconcile current product documentation with the already-published Python course and remove the
highest-confidence maintainability risk found by the current code audit. Preserve every public
content, API, checker, progress, analytics, brand and infrastructure contract while adding direct
coverage for the server-side practice-task projection parser.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Decompose the complex server-side practice-task projection parser into focused typed
  validation helpers and add direct positive/negative tests for every supported solution block,
  malformed task projection and unsupported block while preserving its public output and error
  boundary — _Depends on:_ —
- [x] `F2` Restore the documented typed API failure taxonomy in the answer-checking boundary,
  cover transport, timeout/abort, HTTP and malformed-protocol failures directly, and remove only
  the confirmed unnecessary export from the local practice helper — _Depends on:_ F1

### Infra

None

### Data

None

### Other

- [x] `T1` Synchronize README, SPEC metadata/current-state/roadmap wording and PRODUCT evidence
  with the published early-access Python course and first CourseLesson from Changes 56–57,
  without changing future priorities or product behavior — _Depends on:_ —
- [x] `T2` Record the audit evidence: verify local documentation links, manifests versus declared
  exact stack versions, API/content drift, architecture boundaries, dependency graph, tests and
  the affected Critical Gate; classify static-analysis false positives rather than deleting
  runtime/config or generated public surfaces — _Depends on:_ F1, T1

---

## Files

### Create / modify

~~~
README.md
PRODUCT.md
docs/SPEC.md
docs/changes/62-project-contract-audit.md
apps/web/src/entities/practice-task/api/**
apps/web/src/features/lesson-practice/api/check-practice-answer.ts
apps/web/src/features/lesson-practice/model/practice-answer.ts
apps/web/tests/practice-*.test.ts
~~~

### Do NOT touch

- Topic/Course/CourseLesson teaching content, publication status, task wording or checker answers
- Public API, task JSON schema, progress, analytics consent or SEO/brand behavior
- Dependencies, generated OpenAPI schema, infrastructure, secrets or production state
- Archived change files

---

## Contracts

See `docs/SPEC.md` §2–§5 and §9 and the Files list above. Do not hand-copy schema, endpoint or
publication details into this file; current code and `SPEC.md` remain the sources of truth.

---

## Gate Checks

In addition to the affected frontend Critical Gate, run `pnpm api:check`,
`pnpm validate:content`, the local Markdown-link audit and a focused Fallow re-scan of the changed
parser. No browser evidence is required because this change does not alter rendered UI.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Fallow's project-wide `lighthouserc.cjs` unused-file signal is a static false positive because
  LHCI discovers that root configuration at runtime. Generated OpenAPI types and intentionally
  exported local component types remain contract surfaces; neither group was deleted as dead code.

---

## Commit Message

```text
refactor(change-62): reconcile project contracts and parser coverage
```
