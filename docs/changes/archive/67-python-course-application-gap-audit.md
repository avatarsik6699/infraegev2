# CHANGE 67 — Python Course Application-Gap Audit

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `67` |
| Slug | `python-course-application-gap-audit` |
| Title | Python Course Application-Gap Audit |
| Status | `archived` |
| Branch | `feature/67-python-course-application-gap-audit` |

---

## Goal

Audit the complete learner-facing and operational application of the standalone Python course
after its first two published CourseLessons. Record only reproducible gaps, rank them by learner
impact and select exactly one smallest next change before any third-lesson authoring; this change
is diagnostic and does not fix product, content, analytics or infrastructure behavior.

---

## Backlog

### Backend

- [x] `B1` Exercise both published Python CourseLesson checker families through incorrect,
  correct, normalized and recoverable failure paths; verify that public task projections expose
  no accepted answers and mutations do not silently retry — _Depends on:_ F1

### Frontend

- [x] `F1` Establish a trustworthy current-checkout local baseline, inventory existing automated
  coverage and run the focused published-Python-course journey before drawing conclusions —
  _Depends on:_ I1
- [x] `F2` Audit the complete learner path through home, overview, both lessons, result and return
  to overview, including course progress from zero to one to two mastered lessons, partial 4/5
  mastery versus 5/5 completion, reload, one-lesson reset isolation, explicit failure/retry and
  continuation — _Depends on:_ F1, B1, D1
- [x] `F3` Audit early-access truthfulness, the 19-item plan hierarchy and cognitive load,
  published/planned distinction, result next action, desktop, 150% zoom, 390px mobile, keyboard,
  focus, no-JS, console and overflow behavior; capture evidence without redesigning the UI —
  _Depends on:_ F1
- [x] `F4` Audit the consented analytics emitter, store and Source contracts plus available
  read-only aggregates; verify `course_opened` coverage and whether allowlisted course events have
  real emitters, without adding events or changing configuration — _Depends on:_ F1, I2

### Infra

- [x] `I1` Establish a read-only production baseline for home, Python course, both lessons,
  privacy, robots, sitemap, health and deployed SHA, and confirm current `main` equals
  `origin/main`; do not mutate production — _Depends on:_ —
- [x] `I2` Inspect the current sre-kit and Umami Source status and existing aggregates read-only
  after infrastructure Changes 65–66; do not reconcile Sources, rotate credentials or change
  runtime configuration — _Depends on:_ I1

### Data

- [x] `D1` Validate the course registry, nine modules, 19 plan rows, two published lessons, ten
  tasks, task ownership, theory anchors and public projections, including the absence of Topic
  relationships — _Depends on:_ F1

### Other

- [x] `T1` Create `docs/artifacts/python-course-application-gap-audit-2026-08-29.md` with an
  evidence matrix and severity-ranked findings that name the affected journey, contract,
  reproduction evidence, owner and dependencies — _Depends on:_ F2, F3, F4, I2, D1
- [x] `T2` Select exactly one smallest next package using learner correctness/recovery before
  continuity/UX before measurement drift; if no material gap remains, select review of
  «Ошибки: читаем сообщение и находим причину» as the next content step, and synchronize only the
  current SPEC execution sequence — _Depends on:_ T1
- [x] `T3` Run the documentation/content consistency checks and confirm that the audit changed no
  application, lesson content, analytics configuration, infrastructure or runtime contract —
  _Depends on:_ T2

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/artifacts/python-course-application-gap-audit-2026-08-29.md
docs/changes/67-python-course-application-gap-audit.md
~~~

### Do NOT touch

- `apps/api/**`, `apps/web/**`, `content/**`, `ops/**`, `infra/**` or generated API contracts
- Production runtime, credentials, sre-kit Source configuration or analytics data
- Published lesson wording, status, tasks or Topic/CourseLesson relationships
- A third CourseLesson or fixes for findings discovered by this audit

---

## Contracts

See `docs/SPEC.md` §1.3–§1.4, §2–§5 and §8–§10 and the Files list above. The codebase and
`SPEC.md` remain the source of truth; this change records evidence and chooses the next scope.

---

## Gate Checks

In addition to the documentation Critical Gate, the audit evidence must include the focused
published-Python-course Playwright journey, both checker test families, content validation,
browser screenshots/console at desktop, 150% zoom and mobile, no-JS/keyboard evidence, and the
read-only production and observability baselines. These are audit inputs, not a Full Gate.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

None

---

## Commit Message

```
docs(change-67): audit Python course application gaps
```
