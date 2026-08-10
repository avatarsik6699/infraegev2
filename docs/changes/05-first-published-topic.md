# CHANGE 05 — First Published Topic

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `05` |
| Slug | `first-published-topic` |
| Title | First Published Topic |
| Status | `active` |
| Branch | `feature/05-first-published-topic` |

---

## Goal

Deliver SPEC.md's M1 reference topic for EGE task 1: an original, publication-quality Russian
lesson on matching a graph to its table, with accessible diagrams, 5-10 production-style practice
tasks, meaningful feedback, SEO/SSG discovery, and mastery progress. Replace the M0 placeholder,
but keep the topic in `review` until the architect explicitly approves every human-owned Content
Quality Gate item; the agent must never promote it to `published` on its own.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Backend

- [x] `B1` Replace placeholder-dependent checker API coverage with content-driven tests for every
  new task: each declared `answer_variants` value must be accepted through the real endpoint, a
  known wrong answer must be rejected, and every response must include a substantive explanation.
  Keep production checker contracts unchanged unless a concrete task exposes a spec violation —
  _Depends on:_ `D2`

### Frontend

- [x] `F1` Connect the topic practice journey to `track-progress`: persist distinct correctly
  answered task IDs per topic, derive a 0..1 ratio from the topic's complete task set, render the
  accessible progress bar, and mark the topic mastered only when the ratio reaches
  `mastery_threshold`. Preserve SSR safety, versioned/corruption-tolerant localStorage, idempotency,
  retry behavior, and isolation between topics; add focused unit/component coverage — _Depends on:_
  `D1`, `D2`
- [x] `F2` Replace the placeholder Playwright journey with the published M1 path from the home page.
  Verify the stable route, unique title/description, task-number badge, lesson blocks, accessible SVG
  and semantic table, all practice widgets, threshold progress behavior, substantive feedback,
  sitemap inclusion, no-JS readability, keyboard-visible controls, desktop/narrow layouts, and a
  clean browser console using the required Page Object Model and frontend UI tooling — _Depends on:_
  `B1`, `D3`, `F1`

### Data / Content

- [x] `D1` Replace `placeholder-topic` with the task-1 topic `graphs-and-tables` in `review` status.
  Author original Russian text using a prompt that explicitly includes
  `docs/artifacts/learning-science-principles.md` section 8: use a deliberate
  `worked_example_first` sequence, integrated graph/table explanations, one completion exercise,
  signalling without decorative or redundant elements, an explicit 0.8 mastery threshold, and
  concrete title/summary metadata. Keep prerequisites/related topics empty until real linked
  content exists; do not invent future M2 links — _Depends on:_ —
- [x] `D2` Replace `placeholder-task` with 5-10 original task-1 practice files spanning difficulty
  1-3. Prefer `production` interaction, define every valid normalized answer variant deliberately,
  keep each task linked to `graphs-and-tables`, and provide a full worked-example-style explanation
  including the likely misconception instead of exposing only the answer — _Depends on:_ `D1`
- [x] `D3` Only after the architect explicitly approves `T1`, promote `graphs-and-tables` from
  `review` to `published`. The agent must not self-approve or infer approval from automated green;
  this item remains unchecked while any human-owned quality check is unresolved — _Depends on:_
  `T1`

### Other

- [x] `T1` Create a per-topic quality record beside the content and execute SPEC.md section 2.3 in
  full. The agent checks technical/link/metadata/answer-variant evidence and captures desktop/narrow
  rendered evidence; the architect manually checks mathematical correctness, diagram meaning,
  pedagogical sequence, originality, and the final `review -> published` decision. Leave all
  human-owned boxes unchecked and pause for review rather than claiming PASS — _Depends on:_ `B1`,
  `D1`, `D2`, `F1`
- [x] `T2` After the published-path verification is green, update only stale factual test counts or
  content-authoring/gate notes in `docs/STACK.md` and `docs/KNOWN_GOTCHAS.md`; do not change product
  intent or broaden M1 — _Depends on:_ `F2`
- [x] `T3` Add a root `README.md` with reproducible prerequisites, dependency setup, local
  frontend/backend startup, Docker startup, automated checks, and a manual verification journey for
  the change-05 topic while it remains in `review` — _Depends on:_ `B1`, `D1`, `D2`, `F1`
- [x] `T4` Add a one-command Docker developer workflow that requires no hand-written `.env`, local
  secrets, or separate service startup; provide discoverable lifecycle helpers and update README/
  STACK commands without weakening production secret requirements — _Depends on:_ `T3`
- [x] `T5` Add a discoverable Make command that gracefully stops the complete stack started by
  `make dev`: send normal termination signals, wait a bounded time for application and database
  shutdown, remove stopped containers/network, preserve PostgreSQL data, report completion, and
  document the lifecycle. Adjust application/container shutdown handling only where live evidence
  shows Compose cannot stop a service cleanly — _Depends on:_ `T4`
- [x] `T6` Remove stale README statements that still describe the approved topic as `review` and
  the replaced E2E journey as a pending placeholder; keep the manual verification instructions
  aligned with the now-published route — _Depends on:_ `D3`, `F2`
- [x] `T7` Make bare `$plan` self-scoping: when no brief or file is supplied, derive the next
  smallest coherent change from the first unfinished SPEC roadmap outcome and shipped/active
  change history, without inventing missing product decisions. Ask only when no unique safe scope
  can be selected; keep explicit briefs and mode flags backward-compatible across every thin plan
  wrapper and the canonical playbook — _Depends on:_ `T6`

<!-- Test execution is governed by `docs/STACK.md`'s Fast Gate (per task) and Full Gate (per ship).
     Do not duplicate that list here. -->

---

## Files

### Create / modify

~~~
content/topics/graphs-and-tables.json                    (new; replaces placeholder topic)
content/topics/graphs-and-tables.quality.md              (new; per-topic quality record)
content/tasks/graphs-and-tables-*.json                   (new; 5-10 tasks)
content/topics/placeholder-topic.json                    (delete)
content/tasks/placeholder-task.json                      (delete)
apps/api/tests/test_tasks_api.py
apps/web/src/features/check-answer/practice-task-widget.tsx
apps/web/src/features/check-answer/practice-task-widget.types.ts
apps/web/src/features/track-progress/model/progress-store.ts
apps/web/src/features/track-progress/progress-bar.tsx
apps/web/src/features/track-progress/progress-bar.types.ts
apps/web/src/pages/topic/topic-page.tsx
apps/web/src/pages/topic/topic-page.types.ts
apps/web/tests/progress-store.test.ts
apps/web/tests/**/*.test.tsx                              (focused topic/progress coverage)
apps/web/e2e/pages/home.page.ts
apps/web/e2e/pages/topic.page.ts
apps/web/e2e/smoke.spec.ts
apps/web/Dockerfile
infra/docker-compose.dev.yml
Makefile
README.md
docs/STACK.md                                             (factual counts/notes only)
docs/KNOWN_GOTCHAS.md                                    (only if a recurring trap is found)
docs/playbooks/plan.md
.agents/skills/plan/SKILL.md
.claude/skills/plan/SKILL.md
plugins/sdd-workflow/commands/plan.md
plugins/sdd-workflow/skills/plan/SKILL.md
AGENTS.md
CLAUDE.md
docs/playbooks/README.md
plugins/sdd-workflow/README.md
~~~

### Do NOT touch

- `docs/SPEC.md` — M1, content, SEO, a11y, and mastery contracts are already complete
- `content/courses/` or future M2 topics/links
- Production backend modules, API paths, database schema/migrations, analytics, or deployment infra
- The Mantine theme/design baseline or unrelated shared UI primitives
- `apps/web/src/routeTree.gen.ts`

---

## Contracts

See `docs/SPEC.md` sections 2.3-5 and 8-9 and the Files list above. Do not hand-copy the schema,
endpoint, content-block, or SEO contracts into this file; the codebase and `SPEC.md` remain the
source of truth.

---

## Gate Checks

> Fast Gate runs per task in `/work`; Full Gate and (with `--release`) Release Gate run once in
> `/ship`. Both are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific additions.

Before architect approval, inspect `/theory/zadanie-1-graphs-and-tables` directly while its status
is `review`; capture desktop and narrow screenshots, confirm accessible diagram/table semantics,
exercise every accepted answer variant through the real checker, and report human-owned Content
Quality Gate boxes as unresolved.

After explicit approval and `published`, the standard frontend build must prerender the topic; the
home page and `/sitemap.xml` must discover the canonical route; the full lesson text must remain
readable with JavaScript disabled; and the browser journey must reach mastery only at the configured
threshold with no console errors.

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work [XX] review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

- Live Docker events confirmed that Nginx, web, API, and PostgreSQL all honor their normal stop
  signals and exit within seconds without SIGKILL; no application lifecycle hooks were needed.

---

## Commit Message

```
feat(change-05): publish graph-table topic and mastery flow
```
