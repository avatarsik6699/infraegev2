# CHANGE 45 — Product Readiness Audit

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `45` |
| Slug | `product-readiness-audit` |
| Title | Product Readiness Audit |
| Status | `active` |
| Branch | `feature/45-product-readiness-audit` |

---

## Goal

Audit the two published lessons as one learner-facing product before any third topic or Python
course work begins. Produce reproducible local and read-only production evidence for discovery,
learning continuity, progress, responsive/no-JavaScript behavior, trust surfaces and operational
feedback, then rank verified gaps and name one smallest end-to-end blocker package for the next
change. This change diagnoses and prioritizes; it does not implement product fixes or expand data
collection.

---

## Backlog

### Backend

- [x] `B1` Exercise the public task-checker boundary used by both lessons through learner-visible
  incorrect, correct and recoverable failure paths; verify accepted-answer persistence never
  exposes checker secrets or silently retries a mutation — _Depends on:_ F1

### Frontend

- [x] `F1` Establish trustworthy audit ownership: prove the local route-level server is from this
  checkout, inventory existing fixture/Page Object coverage and run the current public discovery
  and two-lesson browser journeys before drawing conclusions — _Depends on:_ I1
- [x] `F2` Audit each lesson end to end from home entry through outline/theory, checkpoints,
  practice, result and reload; verify progress is understandable, accepted answers persist and
  reset/recovery behavior does not strand the anonymous learner — _Depends on:_ F1, B1
- [x] `F3` Audit continuity between the two published lessons and the return path to discovery:
  identify whether the learner can understand what was completed and choose a meaningful next
  action without a catalog, account or invented recommendation — _Depends on:_ F2, D1
- [x] `F4` Verify home, privacy and both lessons at desktop, 150% zoom and narrow mobile widths,
  with keyboard and no-JavaScript journeys, screenshots and current console inspection; record
  accessibility, overflow, hierarchy and visual-coherence findings without redesigning surfaces —
  _Depends on:_ F1
- [x] `F5` Audit public trust/discovery surfaces against current truth: shared release identity,
  privacy access/copy, canonical metadata, robots and sitemap. Preserve the explicitly accepted
  deferral of operator requisites, RKN notification and age marking — _Depends on:_ F1, I2

### Infra

- [x] `I1` Establish a read-only production baseline for `/`, `/privacy`, both published lessons,
  readiness and the deployed release identity; inspect current external availability and sre-kit
  status evidence without changing VPS, Compose, credentials or monitoring state — _Depends on:_ —
- [x] `I2` Reconcile remaining current infraegev2 documentation wording with completed sre-kit
  Change 20 evidence while preserving the workstation/offline-alert limitation and repository
  ownership boundary — _Depends on:_ I1

### Data

- [x] `D1` Validate the two published lessons' registry/discovery entries, five-task practice
  projections, theory anchors and cross-topic relationship data; distinguish a missing learner
  transition from intentionally absent future content — _Depends on:_ F1

### Other

- [x] `T1` Create `docs/artifacts/product-readiness-audit-2026-08-20.md` with an evidence matrix and
  severity-ranked findings (`blocker`, `high`, `medium`, `low`), each tied to an observed journey,
  expected contract, reproduction evidence, affected owner and dependency — _Depends on:_ F2, F3,
  F4, F5, I2, D1
- [x] `T2` From the ranked evidence, define exactly one smallest end-to-end blocker package for the
  next change and update SPEC's current sequence/status without implementing that package here —
  _Depends on:_ T1
- [x] `T3` Run documentation consistency/link checks and confirm the audit introduced no lesson,
  application, analytics, infrastructure or credential mutation — _Depends on:_ T2

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
README.md
docs/artifacts/product-readiness-audit-2026-08-20.md
docs/changes/45-product-readiness-audit.md
docs/runbooks/production.md
docs/runbooks/production-onboarding.md
ops/observability/sre-kit-sources.example.json
~~~

### Do NOT touch

- `apps/api/**`, `apps/web/**`, `content/**` or generated API contracts
- Lesson wording, task statements/answers, publication status or new topic/course content
- New Umami events, analytics schemas, accounts, catalog/search or progress synchronization
- Production VPS, Compose/systemd lifecycle, credentials, sre-kit runtime state or monitoring UI
- Operator requisites, RKN notification, age marking or key-only SSH work
- Product fixes found by the audit; append evidence to the audit artifact and defer implementation
  to the next explicitly planned change

---

## Contracts

See `docs/SPEC.md` §1.3–§1.4, §2.3, §5, §7–§10 and the Files list above. The current codebase is
the implementation source of truth; this change records audit evidence rather than duplicating
frontend, API or content schemas.

---

## Gate Checks

In addition to the documentation-only Critical Gate, use the required browser tooling against a
freshly owned local stack: screenshots plus current console checks for home, privacy and both
published lessons; desktop, 150%-zoom, mobile, keyboard and no-JavaScript journeys; checker
incorrect/correct/recovery plus reload persistence; route-level HTTP/SSR checks; content-link
validation; and read-only production availability/release evidence. Existing Playwright specs must
continue to use project fixtures and Page Objects. Automated green does not replace the audit's
evidence-ranked learner-journey judgment.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
docs(change-45): audit two-lesson product readiness
```
