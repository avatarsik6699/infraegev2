# Content Quality Gate — graphs-and-tables

Status: `APPROVED`

This record applies to `graphs-and-tables.json` and its five `graphs-and-tables-*.json` tasks.
Agent-owned checks may be checked from reproducible evidence. Human-owned checks stay open until
the architect reviews the rendered lesson and explicitly approves publication.

## Authoring prompt requirements

The authoring instruction explicitly required every item from
`docs/artifacts/learning-science-principles.md` §8: choose worked example vs. productive failure
from learner prerequisites; keep labels contiguous with the visual; avoid redundant and decorative
content; signal the discussed element; prefer production answers; use an explicit mastery threshold;
plan interleaving for the future multi-topic state; and give a substantive worked-example-style
error explanation. For this first, prerequisite-free topic the selected sequence is
`worked_example_first`; interleaving eligibility is recorded on every task but mixed practice is
deferred until more than one real topic exists.

## Pedagogy

- [x] **HUMAN — pedagogical sequence:** confirm that the content-block order is an effective
  worked-example-first progression and that the completion exercise appears at the right point.
- [x] **HUMAN — diagram meaning:** confirm that every graph/table element directly supports the
  adjacent explanation, that highlighting signals the intended comparison, and that nothing is
  decorative or redundantly restates the prose.
- [x] **AGENT — production practice:** all 5 tasks declare `interaction_type: production`.
- [x] **AGENT — deliberate mastery:** the topic and lesson prose explicitly set `0.8`, requiring
  4 distinct correct task IDs out of 5; retries of the same task are idempotent.
- [x] **AGENT — substantive explanations:** every task response contains a multi-step worked
  example and an explicit `Типичная ошибка` explanation.

## Factual correctness

- [x] **HUMAN — mathematics and logic:** manually verify the worked example, completion exercise,
  all graph/table correspondences, distances, and the five task answers.
- [x] **AGENT — checker variants:** every declared `answer_variants` value was accepted through
  `POST /api/tasks/{id}/check`; a known wrong answer was rejected for every task; every response
  included the substantive explanation. Evidence: `cd apps/api && uv run pytest` — 11 passed.
- [x] **HUMAN — rendered diagram data:** inspect both rendered viewports and confirm that the graph,
  highlighted edge/nodes, table values, and highlighted cells express the intended network.

## Technical

- [x] **AGENT — content links:** `node scripts/validate-content-links.mjs` passed for 1 topic,
  5 tasks, and 0 courses.
- [x] **AGENT — metadata:** title and summary are concrete and unique; the direct review route
  rendered the same title in the document head.
- [x] **AGENT — accessibility primitives:** the graph SVG exposes its Russian `ariaLabel` through
  `role=img` and `<title>`; the distance grid renders as a semantic table with a caption.
- [x] **AGENT — content/schema load:** all five tasks passed backend Pydantic validation; frontend
  lint, typecheck, and 19 Vitest tests passed.

## Rendered evidence

- [x] **AGENT — desktop:** direct review route
  `/theory/zadanie-1-graphs-and-tables` rendered at 1440×1000; screenshot captured locally as
  `/tmp/infraege-change05-f1-desktop.png`; all four distinct answers reached exactly 80%; browser
  console warnings/errors: 0.
- [x] **AGENT — narrow:** direct review route rendered at 390×844; screenshot captured locally as
  `/tmp/infraege-change05-t1-narrow.png`; document width stayed 390 px with no horizontal overflow;
  1 named graph, 1 semantic table, 5 inputs, and 5 buttons were present; browser console
  warnings/errors: 0.

## Legal and publication approval

- [x] **HUMAN — originality:** confirm that lesson text and task wording are original and not a
  close retelling of FIPI, sdamgia, kpolyakov, or another source.
- [x] **HUMAN — final decision:** approve `review -> published`. Until this exact approval is
  recorded, `D3` remains unchecked and the topic must stay `review`.

Overall gate: **PASS — architect completed T1 review and approved publication on 2026-08-10.**
