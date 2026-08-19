# CHANGE 27 — Number-record Transformation Lesson

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `27` |
| Slug | `number-record-transformation-lesson` |
| Title | Number-record Transformation Lesson |
| Status | `active` |
| Branch | `feature/27-number-record-transformation-lesson` |

---

## Goal

Turn the architect's preliminary theory for the number-record transformation subtype of EGE task
5 into a complete review-only lesson at `/ege/5-preobrazovanie-zapisey-chisel`. Preserve the
source's explanatory sequence while correcting its scope, notation and editorial defects, then add
five original production tasks so the result satisfies
`docs/SPEC.md` §1.3, §1.4 and §2.3 without claiming to cover every official task-5 executor form or
publishing before architect approval.

---

## Backlog

### Backend

- [x] `B1` Extend focused content-task coverage to the five task-5 JSON files: validate each strict `Task`, every declared accepted answer, one known wrong answer, topic ownership and non-empty theory links/solutions without changing the checker or HTTP/OpenAPI contract — _Depends on:_ D2

### Frontend

- [x] `F1` Turn the source's four-stage `N → запись в системе b → изменённая запись → R` model into one purposeful optimized lesson diagram using the existing `Diagram` contract; keep labels legible on mobile and provide accurate `alt`, caption, purpose and adjacent explanation without duplicating the same information — _Depends on:_ D1
- [x] `F2` Author `preobrazovanie-zapisey-chisel.lesson.tsx` through the existing `defineLesson` contract: preserve the revised source's teaching sequence with the minimum necessary grouping into `ConceptBlock`s, place worked examples and mistakes next to their concepts, add short checkpoints after coherent theory groups, use shared typography/notation/code components, and keep the final synthesis and exam algorithm intact — _Depends on:_ D1, F1
- [x] `F3` Register the task-5 lesson and its five server-loaded public task projections under `/ege/5-preobrazovanie-zapisey-chisel` with `status: review`, `accessTier: free`, an explicit mastery threshold and unique metadata; retain `noindex,nofollow` and exclusion from the public home, sitemap and prerender discovery — _Depends on:_ D2, F2
- [x] `F4` Extend focused content, route-data and public-release unit coverage for the second lesson, including authored order, metadata, five secret-free task projections, valid theory anchors and proof that the review lesson is absent from every public discovery surface — _Depends on:_ F3
- [x] `F5` Generalize the existing topic-lesson Page Object only as far as needed to exercise both lessons, then add a fixture-owned review-route journey covering desktop, mobile, 150% zoom, keyboard help disclosures, no-JS sequential reading, diagram accessibility, horizontal overflow, clean console and retained recursion behavior — _Depends on:_ F3, F4
- [x] `F6` Remove the generated raster diagram, its `Diagram` usage and diagram-specific browser assertions; retain the four-stage model as ordinary adjacent lesson text without replacing source Mermaid or similar diagram markup with another generated asset — _Depends on:_ D4

### Infra

None.

### Data

- [x] `D1` Editorially revise the supplied artifact as the canonical source: narrow the opening claim to the number-record transformation subtype of official task 5, remove conversational residue, normalize heading/math/code notation, verify every conversion/result and executable Python fragment, and preserve all useful distinctions, intermediate calculations, examples, common errors and the final synthesis — _Depends on:_ —
- [x] `D2` Author five original `production` tasks in deliberate nondecreasing difficulty covering the lesson's core transfer points: representation/appending, repeated parity updates, branched base-3 transformation, simultaneous digit replacement and safe maximum search for a non-monotonic result; give each a useful hint, valid theory anchor, server-owned accepted answers and a structured worked solution — _Depends on:_ D1
- [x] `D3` Add an adjacent quality record for the lesson and all five tasks, documenting official-scope alignment, pedagogical role and ordering, originality, calculation/code verification, visual purpose, answer normalization and publication checks; mark agent-verifiable evidence complete but leave architect factual/visual approval and `published` status explicitly open — _Depends on:_ D1, D2, F1, F2
- [x] `D4` Audit the complete supplied theory against the rendered TSX lesson section by section and restore every useful omitted distinction, intermediate calculation, example, code explanation, phrase-to-Python mapping and final synthesis with minimal deviation; do not shorten the source merely to fit the current lesson grouping — _Depends on:_ D1

### Other

- [x] `T1` Run content-link validation, required TypeScript/Python LSP diagnostics, browser screenshots and console inspection, and the affected Critical Gate; prove the direct review URL returns the lesson across desktop/mobile/no-JS while remaining absent from public discovery, and do not publish it — _Depends on:_ B1, D3, F4, F5
- [x] `T2` Record the architect's authoring rule that Mermaid and similar supplied diagram markup is skipped as a visual artifact and does not trigger raster processing/generation, then rerun the affected content/frontend checks — _Depends on:_ F6

---

## Files

### Create / modify

~~~
docs/artifacts/lessons/5-build-and-analyze-algos-for-executors.md
docs/artifacts/lessons/5-build-and-analyze-algos-for-executors.quality.md
apps/web/src/entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx
apps/web/src/entities/lesson/content/lesson-publication.mjs
apps/web/src/entities/lesson/content/lesson-publication.d.mts
apps/web/src/entities/lesson/content/lesson-registry.ts
apps/web/src/entities/lesson/index.ts
content/tasks/preobrazovanie-zapisey-appending.json
content/tasks/preobrazovanie-zapisey-parity.json
content/tasks/preobrazovanie-zapisey-base-three.json
content/tasks/preobrazovanie-zapisey-digit-replacement.json
content/tasks/preobrazovanie-zapisey-non-monotonic-maximum.json
apps/api/tests/test_tasks_api.py
apps/web/tests/lesson-content-contract.test.ts
apps/web/tests/lesson-route-data.test.ts
apps/web/tests/public-release.test.ts
apps/web/e2e/pages/topic-lesson.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- `apps/web/src/pages/topic-lesson/**` except for a verified generic-consumer defect that is first appended to this Backlog
- `apps/web/src/routes/**`
- `apps/web/src/shared/**`
- `apps/web/src/entities/lesson/components/**`
- `apps/web/src/entities/lesson/content/rekursiya.lesson.tsx`
- Existing recursion task JSON and quality/source artifacts
- Checker schemas, endpoint contracts and generated API types
- Public home/privacy copy, analytics, infrastructure and deployment configuration
- Publication status of the new lesson

---

## Contracts

See `docs/SPEC.md` §3–§5 and the Files list above. Do not hand-copy the schema, endpoints, types,
or env vars into this file — the codebase and `SPEC.md` are the source of truth; this file only
tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

The browser evidence must include the direct review route and a negative public-discovery check:

```bash
curl -fsS -o /dev/null http://localhost:8080/ege/5-preobrazovanie-zapisey-chisel
# expected: success only when the project-owned local stack is already running; the route remains noindex and absent from sitemap/home
```

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work 27 review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

- Per architect review, Mermaid and similar diagram markup supplied with lesson theory is skipped as
  a visual artifact and does not trigger raster processing or generation; its surrounding theory remains
  in the ordinary textual lesson sequence.

---

## Commit Message

```
feat(change-27): add review lesson for task 5 transformations
```
