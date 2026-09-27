# CHANGE 153 — Data analysis and clustering lesson

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `153` |
| Slug | `data-clustering-lesson` |
| Title | Data analysis and clustering lesson |
| Status | `archived` |
| Branch | `feature/153-data-clustering-lesson` |

---

## Goal

Publish a complete local EGE task 27 lesson at `/ege/27-analiz-dannyh-i-klasterizatsiya` with original Python explanations, worked examples and file-based practice. Teach the cluster-analysis path supported by the 2025–2026 FIPI materials and the provisional 2027 demo: derive a grouping value, check a whole-cluster limit, select a centre from actual records, compute a separate spatial result and verify the final numbers. Follow `docs/SPEC.md` §1.4 and §2.3, `docs/runbooks/lesson-authoring.md`, and current frontend/bank contracts.

## Editorial contract

The 2027 FIPI materials are still a project as of 2026-09-27. Explain the current direction without promising the final exam will use this exact condition. Begin with a tiny visual grouping and direct checking; introduce each new term only after a plain-language example. Connect file input, sorting, lists and dictionaries to the published Python lessons at their actual point of use. Distinguish the quantity that defines clusters from the coordinates used for another answer. Prove why comparing adjacent sorted values alone can violate a whole-cluster range limit. Explain the centre as one of the records, why a middle value minimizes total absolute deviation in one dimension, and how unique-centre guarantees affect ties. Show the actual cost of pairwise spatial comparisons, filter before comparing, and compare squared distances before taking one square root. Check boundary equality, decimal input, answer scaling and both outputs independently on short data.

Use original examples, datasets, tasks and illustration; external conditions guide coverage but are not copied. Include an honest note that the other supplied collection contains historical pair/remainder algorithms and that spatial clusters can use different centre definitions. The authored material does not claim one recipe solves all task-27 variants. All locally prepared content is `published` for production-equivalent manual review before `/ship`.

---

## Backlog

### Backend
- [x] `B1` Add focused canonical-bank/checker tests with independent oracles for every task-27 answer, source file, lesson/theory link and boundary case, including grouping width, centres, type filter and two-output format. — _Depends on:_ D1
- [x] `B2` Make the integrated task-27 oracle truly independent by fixing the expected small clusters and deriving centres through direct sums of absolute differences. — _Depends on:_ B1

### Frontend
- [x] `F1` Author a detailed ordered lesson with runnable Python examples, worked/completion/independent steps, precise course links, exam focus, checkpoint and result; explain all new concepts before code. — _Depends on:_ —
- [x] `F2` Publish topic 27 through the existing lesson registry and catalog, and add rendered-content/publication tests including code output and whitespace around inline elements. — _Depends on:_ F1
- [x] `F3` Add an original monochrome 144×88 catalog miniature that shows grouping by one value and a selected centre; update frontend and SPEC illustration inventories. — _Depends on:_ F2
- [x] `F4` Extend existing browser fixtures/Page Object for topic-27 route, theory, tasks, attachments, no-JS and desktop/mobile layout without copying a full topic-26 assertion method. — _Depends on:_ F2, D1
- [x] `F5` Make the greedy cluster-building rule explicit where it is used and explain dictionary grouping before its practice solution uses it. — _Depends on:_ F1, D1
- [x] `F6` Keep the long topic-27 breadcrumb readable within a narrow mobile viewport. — _Depends on:_ F2
- [x] `F7` Replace the unintroduced list comprehension in the early energy example with already-taught loop operations. — _Depends on:_ F1
- [x] `F8` Name and explain Euclidean distance at the point where its formula first appears, before tasks use the term. — _Depends on:_ F1
- [x] `F9` Add the small spatial grouping diagram promised by the lesson text and give it an accessible description. — _Depends on:_ F1
- [x] `F10` Update the topic-catalog filter assertion for the newly published lesson after the focused browser test reports one additional not-started row. — _Depends on:_ F4
- [x] `F11` Clarify that an odd cluster has a unique particle-centre only when the middle energy is not shared by another particle; correct the full example and the tie discussion. — _Depends on:_ F1
- [x] `F12` Explain Python `max(...)` before the complete lesson program and in task 27-03's solution, where it first appears in practice. — _Depends on:_ F1, D1

### Infra
None.

### Data
- [x] `D1` Add a progressive original task-27 practice set and task-owned files to the canonical bank; include spatial and energy-based clustering, independent two-result reasoning, substantive hints and theory links, then regenerate publication artifacts. — _Depends on:_ F1
- [x] `D2` Export the current local development bank, import only the new lesson/tasks/files and prove pre-existing operator rows and file metadata remain unchanged. — _Depends on:_ D1
- [x] `D3` Align task 27-01 with taught spatial grouping, make task 27-03 partition rule unambiguous, and replace unexplained Python shortcuts in task solutions with taught operations. — _Depends on:_ D1, F1
- [x] `D4` Remove the unexplained `max(..., key=len)` shortcut from task 27-06 and clarify the integer coordinate answer format. — _Depends on:_ D3
- [x] `D5` Keep canonical publication metadata in registry order so content validation and local import accept the new material. — _Depends on:_ D1
- [x] `D6` Specify the deterministic greedy partition directly in tasks 27-06 and 27-07; a width limit alone allows several valid partitions and ambiguous answers. — _Depends on:_ D1
- [x] `D7` Correct task 27-02's hand-calculated distance sums for Q and R and verify those sums independently in its test. — _Depends on:_ D1, B1
- [x] `D8` Correct the first within-cluster type-II distance in task 27-07's explanation and assert all four file-derived distances. — _Depends on:_ D1, B1
- [x] `D9` Align task-27 skill metadata with the operations each task actually practices and assert the mapping in the bank test. — _Depends on:_ D1, B1
- [x] `D10` Make task 27-06 sort records by the taught energy key explicitly, avoiding an unexplained tuple-order shortcut. — _Depends on:_ D1, F1
- [x] `D11` State why task 27-05 prints an integer distance on its authored data, without implying that arbitrary Euclidean distances can be truncated. — _Depends on:_ D1
- [x] `D12` Qualify task 27-04's hint about a unique centre: its odd-sized example has distinct coordinates, while repeated middle values can tie. — _Depends on:_ D1, F11

### Other
- [x] `T1` Record official and supplied-source research, provisional-status caveat, concept-to-task map, independent numerical checks, typical errors and explicit coverage boundaries in a lesson-quality note. — _Depends on:_ F1, D1
- [x] `T2` Review the rendered lesson as a learner with Playwriter at desktop/mobile and no-JS, run the affected Critical Gate, inspect reports and finish repository hygiene. — _Depends on:_ B1, F2, F3, F4, D2, T1
- [x] `T3` Record the repeated-median counterexample in the lesson-quality note so later lessons do not infer centre uniqueness from odd size alone. — _Depends on:_ F11, T1

---

## Files

### Create / modify

- `apps/web/src/entities/lesson/content/data-analysis.lesson.tsx`, existing publication/lesson/catalog registries, focused web/E2E tests and catalog illustration/style.
- `content/practice-bank/bank.json`, task-owned files in `content/practice-bank/files/`, generated `apps/api/practice-registry.json` and `apps/api/practice-catalog-topics.json`, focused API bank tests.
- `docs/artifacts/lessons/27-data-analysis.quality.md`, `docs/FRONTEND.md`, the factual illustration inventory in `docs/SPEC.md`, and this change.

### Do NOT touch

- Existing authored lessons, account/progress/API contracts, database schema, infrastructure or unrelated user-owned artifacts.

---

## Contracts

See `docs/SPEC.md` §1.4 and §2.3–§5, `docs/FRONTEND.md` §5 and §9, `docs/runbooks/lesson-authoring.md`, and the Files list. Existing typed lesson and canonical-bank interfaces remain the source of truth.

---

## Gate Checks

Use the affected Critical Gate from [`docs/STACK.md`](../../STACK.md): format, web/API lint and typecheck, focused web/API/content tests, changed-file LSP and repository hygiene. Playwriter checks the locally published page and catalog. No Full Gate or production release is implied.

---

## Implementation Notes

None.

---

## Commit Message

```
feat(change-153): add EGE data clustering lesson
```
