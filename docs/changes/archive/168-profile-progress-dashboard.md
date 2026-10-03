# CHANGE 168 — Profile progress dashboard

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `168` |
| Slug | `profile-progress-dashboard` |
| Title | Profile progress dashboard |
| Status | `archived` |
| Branch | `feature/168-profile-progress-dashboard` |

---

## Goal

Build the profile «Обзор» dashboard from the approved v5 mockup, deferred by Change 164: one next
step plate, three progress tiles (Python course, EGE topics, practice), per-topic progress, the
continuation list and a «Попробуйте задачу» card. Everything is derived from existing read
endpoints and saved progress; no API or schema change. Contract: [SPEC](../../SPEC.md) §4–§5.

---

## Design References

- Profile — [mockups/account.html](../../artifacts/change-164/mockups/account.html): sky next-step plate
  with «Продолжить», three white tiles with a big number, caption and bar, «Прогресс по темам
  ЕГЭ» rows (title, «Задание N», bar, «X из Y»), «Продолжить» cards and «Попробуйте задачу».
  Visual system: [DESIGN](../../../DESIGN.md).

Defaults (Claude, 2026-10-03; within the approved mockup):
- Data: course summary (existing loader), topic summary `/api/topics/practice-summary` loaded by the
  account route, lesson progress and standalone practice history.
- Next step priority: started course → its next unmastered lesson; else the first started topic;
  else standalone practice; with nothing saved the plate invites to choose a topic (`/ege`).
- Tiles: course «N из M уроков освоено» with a bar; topics «N задач решено в K темах» with a bar
  against all published topic tasks; practice «N заданий сохранено» without a bar (no meaningful
  total).
- Topic rows: every published topic in catalog order; topic continuations link to the topic.
  The mockup's «Подтема 2: …» line is omitted: summaries carry no theory links.
- «Попробуйте задачу»: the task after the highest-id saved standalone task in the default bank
  order (`/api/tasks/{id}/next`); without saved tasks, or when it fails, a plain link to the bank.
- Loading and error states keep the current honest statuses; nothing claims progress that is not
  loaded.

---

## Backlog

### Frontend
- [x] `F1` Server loader for the topic practice summary and account route data (course + topics) — _Depends on:_ —
- [x] `F2` Dashboard model: next step, tile values, per-topic rows and continuations from summaries and progress; unit tests — _Depends on:_ F1
- [x] `F3` Dashboard UI in `pages/account/components/account-overview*`: plate, tiles, topic rows, continuations, try-task card, loading/error/empty states, mobile layout — _Depends on:_ F2
- [x] `F4` «Попробуйте задачу» next-task lookup with fallback — _Depends on:_ F3
- [x] `F5` impeccable detector, Playwriter desktop+mobile check with a signed-in dev account, axe, one fix round — _Depends on:_ F4

---

## Files

### Create / modify
~~~
apps/web/src/entities/practice-task/api/** (topic summary server loader)
apps/web/src/features/account/** (account route data loader)
apps/web/src/routes/account.tsx
apps/web/src/pages/account/** (overview dashboard, model, styles)
apps/web/tests/** (dashboard model tests)
~~~

### Do NOT touch
- `apps/api/**`, progress tables and endpoints
- Settings tab behaviour
- `.impeccable/critique/`

---

## Contracts

See `docs/SPEC.md` §4–§5 and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with explicit `--full`; release selects affected checks and Release Gate. All gates are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

Per the architect (2026-10-03), e2e (including account specs), Lighthouse and dev-bank data
failures are deferred to the end-of-programme stabilisation change.

---

## Implementation Notes

- Sources degrade independently (restoring the earlier overview contract): the course, topic and
  practice tiles and topic rows render only when their own summary and progress are loaded; with a
  missing course summary a saved course still yields «Открыть курс». With everything loaded and
  nothing saved the plate reads «Пока нет сохранённых результатов» and links to `/ege`.
- The course next-step title is the lesson title; the course name moves to the description line.
- F5: detector clean; axe (WCAG 2.1 AA + best practice) clean at 1440 and 390 px; no horizontal
  overflow; dashboard matches the mockup with a seeded dev account
  (`dashboard-dev@example.com`, local dev DB only).
- The local dev account DB lagged migration `140_01` (missing nullable
  `account_user.privacy_consent_*` columns, so dev registration failed); both columns were added to
  the disposable dev DB as the migration declares them. Production is unaffected.

---

## Commit Message

```
feat(change-168): profile progress dashboard — next step, tiles, topics
```
