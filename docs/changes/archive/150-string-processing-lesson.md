# CHANGE 150 — String processing lesson

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `150` |
| Slug | `string-processing-lesson` |
| Title | String processing lesson |
| Status | `archived` |
| Branch | `feature/150-string-processing-lesson` |

---

## Goal

Publish a complete local EGE task 24 lesson at `/ege/24-obrabotka-simvolnyh-strok`, with eight original file-based Python exercises. Teach the path from reading a string and finding continuous fragments to a linear search for the longest valid arithmetic expression. Use detailed, natural Russian explanations, introduce every new term before notation or code, and link only to relevant published Python lessons. The 2027 FIPI draft demo supplies the exam-shape reference, not copied text or data. See `docs/SPEC.md` §1.4, §2.2–2.3, §3–§5 and `docs/FRONTEND.md` §5, §9.

---

## Editorial contract

Ordered theory: file and string; positions and continuous fragments; adjacent symbols and overlapping occurrences; longest run with a local restriction; longest window with an occurrence limit; expression grammar; linear expression scan; independent verification. New ideas follow plain-language meaning, precise condition, worked example, completion problem and independent task. Explain substring boundaries, final run, overlapping patterns, leading zeros, binary minus and complete-expression endpoints. Course links to strings, files, loops and result selection are contextual reminders, not prerequisites or shared progress.

Eight lesson-only tasks progress through: overlapping occurrences; longest run of allowed symbols; a forbidden adjacent pair; at most K pattern occurrences; expressions without zero; standalone zero and leading-zero rejection; subtraction and boundary cases; and a large original full-expression case. For the authored expression tasks, a number is `0` or a digit `6`–`9` followed by digits `0` or `6`–`9`; expressions alternate numbers and binary `-`/`*`. Thus `7-0` is valid, while `-0`, `07`, adjacent operators and trailing operators are not. The final task uses the demo alphabet but original data. All complete code examples must execute and match the stated output; the last tasks must require programming beyond manual enumeration.

---

## Backlog

### Backend
- [x] `B1` Add focused canonical-bank/checker tests for all eight task answers, wrong-answer controls, file bytes, ordered lesson ownership, theory anchors and secret-free public projection, including an independent short-string oracle for the expression rules. — _Depends on:_ D1
- [x] `B2` Make the independent task-24-05 expression oracle reject zero in every position, and add a short regression case. — _Depends on:_ B1

### Frontend
- [x] `F1` Author the eight ordered theory sections, exam guidance, result and one comprehensive checkpoint with complete and partial Python examples, contextual published-course links and explicit boundary explanations. — _Depends on:_ —
- [x] `F2` Register topic 24 as locally `published`, correct its catalog summary, expose the lesson through the existing route, catalog and sitemap, and add focused rendered-content, link, code-execution and discovery tests. — _Depends on:_ F1
- [x] `F3` Add an original monochrome 144×88 string-fragment miniature in the established topic-catalog style, with meaningful accessible description where needed and stable desktop/mobile/no-JS geometry. — _Depends on:_ F2
- [x] `F4` Make horizontally scrollable code keyboard-accessible; the topic-24 full-expression example exposed an axe scrollable-region violation at enlarged text. — _Depends on:_ F1
- [x] `F5` Introduce `enumerate` before its first use in the linear-scan code example. — _Depends on:_ F1
- [x] `F6` Update the EGE catalog description in SPEC to include topic 24's original educational miniature. — _Depends on:_ F3
- [x] `F7` Explain the `def`/`return` helper before the independent expression-checking example and link the published Python functions lesson. — _Depends on:_ F1
- [x] `F8` Give the newly focusable shared code scroll area a visible keyboard focus indicator and verify it in the focused browser/component checks. — _Depends on:_ F4
- [x] `F9` Remove the duplicate Python course-link component from topic 17 and 24 by extracting one lesson-owned helper. — _Depends on:_ F1
- [x] `F10` Correct the independent-checking worked example so its prompt asks for the longest candidate rather than an incomplete list of all valid expressions. — _Depends on:_ F1
- [x] `F11` Clarify that `7-` is unfinished rather than a completed expression of length zero, and describe `strip()` as removing edge whitespace characters. — _Depends on:_ F1
- [x] `F12` Use Russian comments in the authored linear-scan Python example. — _Depends on:_ F1

### Infra
None.

### Data
- [x] `D1` Add eight original lesson-only published tasks and content-addressed text files to the canonical bank with increasing difficulty, consistent hints/solutions, accurate answers and ordered theory links. — _Depends on:_ —
- [x] `D2` Correct the task-24-01 overlap wording: occurrences of `ABA` in `ABABA` start two positions apart, so the prompt must not describe adjacent start positions. — _Depends on:_ D1
- [x] `D3` Keep task solutions inside taught Python concepts by replacing unexplained `set` and `startswith` usage with string membership and slices. — _Depends on:_ D1
- [x] `D4` Expand task-24-07 beyond a manually enumerable small file, retain varied original boundary cases and verified answer, and correct its attachment description. — _Depends on:_ D1
- [x] `D5` Explain multiline reading and the expression parser in tasks 05–06 before the solution code; use an explicit taught counting loop instead of an unexplained generator expression. — _Depends on:_ D1
- [x] `D6` Correct task-24-07 attachment and quality-record counts to 1,025 unique fragments, matching the file and test. — _Depends on:_ D4
- [x] `D7` Clarify task-24-07 solution: `08*9` is invalid as a whole but `8*9` is a valid substring beginning after the leading zero. — _Depends on:_ D1

### Other
- [x] `T1` Record the concept-to-task map, originality, independent answers, example execution and editorial checklist in an adjacent lesson quality record. — _Depends on:_ F1, D1
- [x] `T2` Integrate the local published page and imported tasks; verify API delivery, browser desktop/mobile/no-JS, keyboard/file journeys, code contrast, console and unavailable-practice state, then run one affected Critical Gate and repository hygiene. — _Depends on:_ B1, F2, F3, T1

---

## Files

### Create / modify

- `apps/web/src/entities/lesson/content/`, existing publication registry and topic catalog; `apps/web/public/images/topics/`, the shared code block's keyboard access and focused web/E2E tests.
- `content/practice-bank/bank.json`, new `content/practice-bank/files/` assets and focused `apps/api/tests/` coverage.
- Generated `apps/api/practice-registry.json` and `apps/api/practice-catalog-topics.json`.
- `docs/SPEC.md`, `docs/artifacts/lessons/24-string-processing.quality.md` and this change.

### Do NOT touch

- Existing authored lesson theory, course publication order, account/progress/API contracts, database schema, infrastructure and unrelated user-owned artifacts.

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–2.3, §3–§5, `docs/FRONTEND.md` §5 and §9, and the Files list. Existing typed lesson and canonical-bank interfaces remain the source of truth.

---

## Gate Checks

Use the affected Critical Gate from [`docs/STACK.md`](../../STACK.md): format, web lint/typecheck, focused web/API/content tests, changed-file LSP and repository hygiene. Playwriter checks the complete locally published page; repository E2E retains its Page Object/fixture policy. Manual content review precedes a separate `/ship`. No Full Gate or production release is implied.

---

## Implementation Notes

- The auxiliary TypeScript LSP reports missing `@playwright/test` exports in existing and new E2E Page Objects. The repository TypeScript typecheck, E2E lint and Chromium runs pass; the same LSP diagnostics occur on an unchanged Page Object.

---

## Commit Message

```
feat(change-150): add EGE string processing lesson
```
