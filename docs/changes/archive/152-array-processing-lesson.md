# CHANGE 152 — Sorting and selection lesson

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `152` |
| Slug | `array-processing-lesson` |
| Title | Sorting and selection lesson |
| Status | `archived` |
| Branch | `feature/152-array-processing-lesson` |

---

## Goal

Publish a complete local EGE task 26 lesson at `/ege/26-sortirovka-i-otbor` with original Python examples and file-based practice. Teach how ordering changes a selection rule, how to choose the direction of sorting, and how to verify both requested outputs on a small dataset before processing a full file. Follow `docs/SPEC.md` §1.4 and §2.3, `docs/runbooks/lesson-authoring.md`, and the existing frontend and bank contracts. The FIPI task-26 guidance informs scope; source wording and data are not copied.

## Editorial contract

Build a gradual path: list and file input; ascending and descending order; boundary indexing and duplicate values; greedy selection under a capacity; a second pass or replacement step to maximize a requested secondary value; sorting records by a chosen field and preserving ties where relevant; processing ordered event records one by one, accumulating per-key totals and selecting the largest completed groups under a time limit; independent checks on short files. The 2027 FIPI demo uses a server log and a bounded backup buffer, so the lesson must not imply that every task 26 is a simple sorted list. Explain each term in everyday language before code, link to published Python lessons at point of use, and give a complete example, completion exercise, and independent practice for each substantive new idea. State why an apparently natural order can produce the wrong answer with a concrete counterexample. Keep task 26 separate from task 25's number properties and task 27's large-data optimization.

Practice uses original downloadable text files where file processing is the point of the task. Include exact scalar answer format, informative hints and explanations, theory links to the actual sections, and independently checked answers. Keep all local content publication states `published` so the architect sees the production-equivalent page before ship.

---

## Backlog

### Backend
- [x] `B1` Add focused bank/checker tests for task-26 answers, lesson ordering, file metadata, theory anchors and independent answer oracles including ties, limits, selection direction and event order. — _Depends on:_ D1

### Frontend
- [x] `F1` Author the ordered task-26 theory with detailed Russian explanations, runnable Python examples, contextual course links, completion exercises, exam guidance, checkpoint and result. — _Depends on:_ —
- [x] `F2` Publish the lesson through the existing registry and catalog; add focused rendered-content and publication tests without duplicating shared rendering logic. — _Depends on:_ F1
- [x] `F3` Add an original monochrome catalog miniature that explains sorted order and selection, update the frontend inventory, and check its desktop/mobile layout. — _Depends on:_ F2
- [x] `F4` Extend existing topic browser coverage for route, tasks, files, no-JS theory, and layout through fixtures and Page Objects. — _Depends on:_ F2, D1
- [x] `F5` Explain how to order event records when an input file is not already chronological, including equal-time order. — _Depends on:_ F1
- [x] `F6` Explain assignment of a record's fields to multiple variables before using it in event examples; connect that explanation to task 26-05/06 solutions. — _Depends on:_ F1, D1
- [x] `F7` Rename the published task-26 catalog lesson to cover file data beyond arrays; align summary, catalog metadata and focused tests. — _Depends on:_ F2
- [x] `F8` Explain `sum(...)` and buffer before their first use, and add a concise map of other task-26 formulations found in the reviewed collection without implying one sorting rule solves them all. — _Depends on:_ F1
- [x] `F9` Remove the duplicated topic-25/26 SVG assertions in the catalog Page Object while retaining the same browser checks. — _Depends on:_ F4

### Infra
None.

### Data
- [x] `D1` Add original task-26 production exercises and task-owned input files to the canonical bank, including selection, secondary optimization and ordered-event processing, with progressive difficulty, detailed feedback and correct publication metadata; regenerate artifacts. — _Depends on:_ —
- [x] `D2` Import only the new lesson/tasks/files into the local development bank after exporting its current state; prove unrelated operator edits remain intact. — _Depends on:_ D1
- [x] `D3` Replace practice task 26-04's copied teaching dataset with an independent tie case, update its answer, explanation and task-owned file, then refresh the local development bank without changing unrelated rows. — _Depends on:_ D1, D2
- [x] `D4` Make the equal-time ordering rule in task 26-06 observable in its checked answer, and update file, solution, independent oracle and local bank. — _Depends on:_ D1, D2
- [x] `D5` Correct the task 26-06 buffer wording so it describes accumulated request data before backup. — _Depends on:_ D1
- [x] `D6` Give task 26-04 an input count header and require skipping it in the runnable solution and independent oracle. — _Depends on:_ D3
- [x] `D7` Add an original integrated event-file task that independently requires both a per-client total and a time-bounded backup result; extend bank oracles and local import while preserving prior tasks. — _Depends on:_ D1, D2, F1
- [x] `D8` Correct the integrated task's buffer trace after the 09:20 overflow and explain the dictionary methods used in its solution. — _Depends on:_ D7

### Other
- [x] `T1` Record source research, concept-to-task mapping, independently checked example outputs and answers, boundary cases and the SPEC §2.3 quality checklist. — _Depends on:_ F1, D1
- [x] `T2` Review the finished lesson as a learner, verify desktop/mobile/no-JS, run the affected Critical Gate and finish repository hygiene. — _Depends on:_ B1, F2, F3, F4, D2, T1
- [x] `T3` Record the reviewed Sdamgia task-family sample, title decision, coverage boundaries and new checks in the quality record; review the updated lesson and run affected verification. — _Depends on:_ F7, F8, D7
- [x] `T4` Update the SPEC catalog illustration inventory for published topic 26 and verify the final audit findings before ship. — _Depends on:_ F3, F9

---

## Files

### Create / modify

- `apps/web/src/entities/lesson/content/array-processing.lesson.tsx`, existing lesson/publication registries, catalog entry and styles, focused web/E2E tests.
- `apps/web/public/images/topics/array-processing.svg`, `docs/FRONTEND.md` illustration inventory.
- `content/practice-bank/bank.json`, `content/practice-bank/files/` task-owned inputs, generated publication artifacts, focused API tests.
- `docs/artifacts/lessons/26-array-processing.quality.md`, this change.

### Do NOT touch

- Existing authored lessons, account/progress/API contracts, database schema, infrastructure and unrelated user-owned artifacts.

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–2.3, §3–§5, `docs/FRONTEND.md` §5 and §9, and the Files list. Existing typed lesson and canonical-bank interfaces remain the source of truth.

---

## Gate Checks

Use the affected Critical Gate from [`docs/STACK.md`](../../STACK.md): format, web lint/typecheck, focused web/API/content tests, changed-file LSP and repository hygiene. Playwriter checks the locally published page and catalog. No Full Gate or production release is implied.

---

## Implementation Notes

None.

---

## Commit Message

```
feat(change-152): add EGE sorting and selection lesson
```
