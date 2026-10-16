# CHANGE 191 — Fast practice, search suggestions and KEGE bank cleanup

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `191` |
| Slug | `practice-speed-bank-cleanup` |
| Title | Fast practice, search suggestions and KEGE bank cleanup |
| Status | `active` |
| Branch | `feature/191-practice-speed-bank-cleanup` |

---

## Goal

Collect the architect's manual review of all EGE topics in one change. First findings: `/practice`
answers in 4.3–5 s because every catalog/facet query decompresses the whole JSONB `content` ~40
times per row for all 6,195 visible tasks (target: TTFB ≤300 ms on the full bank); search needs
suggestions while typing; Change 188 imports carry polluted titles, no summaries/theory links and
split 19/20/21 parts; sources need links without «(копия)»; difficulty bars get level colours.
Production is at Change 166, so no user progress exists for the 188 tasks there.

---

## Backlog

### Backend
- [x] B1 Denormalized `practice.task` columns `exam_numbers int[]`, `exam_order`, `difficulty`, `search_text` (migration `191_01` with backfill, maintained by `import_bank`); indexes for default/difficulty sorts and GIN on exam numbers — _Depends on:_ —
- [x] B2 Two-phase `catalog.page`: ordered ids with LIMIT/OFFSET first, then project only the page; row topics from exam numbers in Python plus one `lesson_task` query; ≤100 ms incl. page 50 — _Depends on:_ B1
- [x] B3 Single-pass `catalog.facets` over the columns; topic counts by exam-number grouping plus one membership query; ≤50 ms — _Depends on:_ B1
- [x] B4 Search over normalized `search_text` (title, summary, visible statement per `statement_text()` rules, id, source `original_id`; lowercase, ё→е); trigram index when the migration role may create `pg_trgm`, otherwise a measured scan in budget; `q` page+count ≤150 ms — _Depends on:_ B1
- [x] B5 `GET /api/tasks/suggest` with catalog filters: up to 6 `{id, exam_numbers, title, snippet, highlights}` plus `total`, min 2 chars, ≤100 ms; regenerate OpenAPI/client — _Depends on:_ B4
- [x] B6 Multi-part checker (`task_checker.parts`, public `answer_parts`); check and check-and-save accept per-part answers, return per-part results and save success only when all parts are correct; single-answer tasks unchanged — _Depends on:_ —

### Frontend
- [x] F1 Catalog loader requests tasks and facets in parallel; filter/page navigation shows a pending status while the current list stays — _Depends on:_ —
- [x] F2 Search suggestions: shared input-anchored combobox variant of SearchField (Base UI), debounced aborting requests, snippet highlights, «Показать все N задач»/Enter applies `q`, a suggestion opens the task with catalog context; no-JS GET form unchanged; expanded rows survive until search is applied — _Depends on:_ B5
- [x] F3 Shared practice sources in `entities/practice-task`: no «(копия)», source text links to its `url` on the task page and in catalog rows — _Depends on:_ —
- [x] F4 Difficulty bar colours (easy green, medium orange, hard brick) via dedicated tokens in catalog, task page and lesson practice; record the DESIGN exception — _Depends on:_ —
- [x] F5 Multi-part answer form: labelled «Задание 19/20/21» fields with one «Проверить», per-part results, accepted state when all are correct — _Depends on:_ B6
- [x] F6 One catalog topic «19–21» instead of `ege-19/20/21`; legacy `topics=ege-19|20|21` and `exam_number` links keep working — _Depends on:_ D4
- [x] F7 Catalog source links are not clickable in list rows (architect review); make them reachable by pointer and keyboard without breaking row disclosure — _Depends on:_ F3
- [x] F8 Remove the status circle column from catalog rows: title and summary move left; a solved task shows a plain green check right of its title (members only), with reserved space so the title never shifts — _Depends on:_ —
- [x] F9 Align row cell values on shared lines: title, topic number, difficulty and source start on one baseline row, their second lines on another — _Depends on:_ F8

### Infra
- [x] I1 Release tooling accepts additive schema `191_01`: `infra/database-schema`, preflight/backup mode (140_01→191_01 needs the exact-SHA isolated restore proof, 191_01→191_01 is ordinary), restore rehearsal parameterized by the declared schema, dev lifecycle inputs, tests — _Depends on:_ B1

### Data
- [x] D1 Imported titles become the current FIPI topic name without «— КЕГЭ N, задание N» (revision unchanged) — _Depends on:_ —
- [x] D2 Deterministic `short_description` from the statement question (restored `preview()` of Change 121) for tasks without one; sampled review per number — _Depends on:_ —
- [x] D3 Topic-level `theory_links` (`section: null`, «Теория») for catalog tasks without any, by exam number — _Depends on:_ —
- [x] D4 Merge 19/20/21 by kompege root id into one multi-part task (shared setup, three questions, `[19,20,21]`, new uuid5); split parts stay archived; partial groups merge available parts; tested — _Depends on:_ B6, D1, D2, D3
- [x] D5 Export, validate, rehearse in disposable PostgreSQL and import the repaired bank; prove only merged tasks are new and progress is intact — _Depends on:_ B1, D4

### Other
- [x] T1 SPEC §4/§5/§8 (suggestions, multi-part answers, server latency budget), DESIGN, FRONTEND and practice runbook — _Depends on:_ B5, B6, F2, F4, D4
- [x] T3 Derive the expected topic-summary set in `test_topic_summary_matches_published_lessons_and_excludes_hidden_tasks` from the registry and bank: it still listed the pre-Change 190 topics and failed independently of this change — _Depends on:_ —
- [x] T2 Before/after latency evidence, affected Critical Gate, LSP, Playwriter desktop/mobile review, `make clean` — _Depends on:_ T1

---

## Files

### Create / modify
~~~
apps/api/app/modules/practice/{catalog,api,schemas,service,readers,models,kompege}.py
apps/api/app/modules/tasks/{api,schemas}.py, apps/api/app/modules/account/progress.py
apps/api/app/shared/checker.py, apps/api/migrations/versions/191_01_*.py, apps/api/tests/*
apps/api/practice-catalog-topics.json, scripts/practice-catalog-topics.mjs
apps/web/src/entities/practice-task/**, apps/web/src/pages/practice-catalog/**
apps/web/src/pages/practice-task/**, apps/web/src/widgets/practice-task/**
apps/web/src/shared/components/search-field/**, apps/web/src/shared/lib/*, apps/web/src/shared/api/schema.ts
apps/web/src/app/styles/{tokens,theme}.css, apps/web/src/features/lesson-practice/**
content/practice-bank/bank.json, docs/SPEC.md, DESIGN.md, docs/FRONTEND.md, docs/runbooks/practice.md
~~~

### Do NOT touch
- Lesson stands and exported topic lessons; API connection pooling in `app/core/database.py`
  (deferred, needs separate architect approval).

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§8 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set; default `/ship` reruns only invalidated checks;
Full Gate only with explicit `--full`. Commands: [docs/STACK.md](../STACK.md); selection:
`python3 scripts/gate.py affected`. Record change-specific overrides here, or `None`.

None

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 5720a47+stage 1 | format, python-format, web-lint, web-typecheck, shell-lint, api-lint, api-typecheck, docs-links, infra-config, api-contract; pytest test_minimal_bank -k catalog/pagination/roundtrip/topic_summary/imported/roles (7 pass, 1 pre-existing fail) | PASS | ~600 |
| 5720a47+full set | format, python-format, tooling-lint, web-lint, web-typecheck, shell-lint, api-lint, api-typecheck, docs-links, content-static, infra-config, api-contract; pytest test_minimal_bank (catalog, suggestions, roundtrip, pagination, topic summary, imported, roles, account) + test_bank_repair/kompege/checker (105 pass after fixes); vitest exam-topics, search-field, practice-*, change-191 helpers; deploy-preflight and account-cutover shell contracts; Playwriter desktop/mobile | PASS | ~1500 |

---

## Implementation Notes

- B1 uses PostgreSQL stored generated columns over `content` (immutable SQL functions, EXECUTE granted to `infraege_import`), so imports stay unchanged. `pg_trgm` is not used: the migration role cannot create extensions, and a plain scan of `search_text` measured 25–33 ms on the full bank.
- Stage 1 evidence (dev, full bank): `/api/tasks` 2.0 s → 0.065 s, facets 2.3 s → 0.075 s, `q` 2.7 s → 0.10 s; `/practice` TTFB 4.4 s → 0.14–0.19 s; 5 parallel `/practice` 5.1–5.4 s → 0.41–0.59 s. F1 keeps the existing global navigation progress as the pending status.
- `test_topic_summary_matches_published_lessons_and_excludes_hidden_tasks` failed independently of this change (pre-Change 190 topic list); fixed as T3 by deriving the set from registry + bank.
- Final evidence (dev, full bank, best of 3): `/practice` TTFB 0.16 s, `?q=12` 0.15 s; `/api/tasks` 0.06 s, facets 0.08 s, `q` 0.10 s, suggest 0.085 s; 5 parallel `/practice` 0.39–0.56 s. About 50 ms of each API call is the per-request PostgreSQL connection (NullPool), deferred.
- D4: the kompege raw cache is gone, so games are merged from `bank.json`: shared setup = common leading blocks of 20/21 (or the root prefix), part questions follow «Задание N» text blocks that the web renders as part headings. 232 games (229 triples, 3 pairs) merged, 693 parts archived; no existing `solution_revision` changed. Merged tasks show the 19 question as their summary.
- D2 summaries are heuristic (question sentence of the last asking paragraph); spot checks are readable, a few keep an author prefix or `^{}` notation.
- I1 generalizes the existing cutover rehearsal and preflight to an ordered schema list (`122_01 → 140_01 → 191_01`); the production `140_01 → 191_01` rehearsal itself runs at release on the host. Proof file name stays `/etc/infraege/accounts-schema-ready`.
- F4 breaks the One Meaning Rule on the architect's explicit request; recorded as a DESIGN exception, medium orange darkened to 3.25:1 for non-text contrast. `impeccable` detector: 0 findings on changed UI files.
- F7: the title's row-wide `::before` target covered the source link; the link is now positioned above it (`z-index: 1`) and opens kompege in a new tab. F8/F9: rows share `--row-line` (1.375rem) for every cell, so first and second lines align; the solved check sits in an always-reserved 1.25rem slot after the title (guests get the empty slot too).
- Check responses keep their single-answer shape (`response_model_exclude_none`); `parts` appears only for multi-part tasks.

---

## Commit Message

```
feat(change-191): fast practice — search hints, 19–21 tasks, bank fixes
```
