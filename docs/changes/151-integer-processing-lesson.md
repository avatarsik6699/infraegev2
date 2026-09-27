# CHANGE 151 — Integer processing lesson

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `151` |
| Slug | `integer-processing-lesson` |
| Title | Integer processing lesson |
| Status | `active` |
| Branch | `feature/151-integer-processing-lesson` |

---

## Goal

Publish the complete local EGE task 25 lesson at `/ege/25-obrabotka-celyh-chisel`. Teach an approachable progression from inclusive integer ranges and decimal digits to divisors, primes, paired divisors and a bounded search over a large range. Use original practice with detailed, natural Russian explanations, introduce every term before using it, and link to published Python lessons only where they explain a technique. Follow `docs/SPEC.md` §1.4 and §2.3 and the existing frontend and bank contracts. FIPI's published task-25 category informs the scope, not the wording or data of the exercises.

## Editorial contract

Ordered theory: inclusive integer range; divisibility and remainder; decimal digits; natural and proper divisors; primes and exact divisor counts; paired divisors and the square boundary; a decimal mask with one digit per question mark; combined bounded search and independent checking. For each new idea, explain the everyday meaning, show a complete worked example, provide a completion problem and then an independent practice task. State exclusions and strict comparisons explicitly. Explain that 1 is not prime, that a square's middle divisor is counted once, and that both members of a divisor pair must be tested against an extra condition. Show a runnable Python example for each substantive algorithm, with the claimed output. Keep task 25 distinct from task 26's sorting and task 27's large data analysis.

Eight original, lesson-only production tasks: range and remainder; decimal digit sum; proper divisors; primes; exactly three divisors; qualifying divisor selection; a precise two-wildcard decimal mask; and a larger bounded first-five search with a scalar answer derived from the selected rows. Provide hints, worked solutions, independent answer checks, boundary cases and a quality record. No attached file is required for this number-search topic.

---

## Backlog

### Backend
- [x] `B1` Add focused canonical-bank/checker tests for eight answers, ordered lesson ownership, theory anchors, private checker projection and independent divisor/range oracles including 1, primes, squares and both divisor-pair members. — _Depends on:_ D1

### Frontend
- [x] `F1` Author the eight ordered theory sections, exam guidance, result and checkpoint, with complete and partial Python examples, explicit boundaries and contextual links to published Python lessons. — _Depends on:_ —
- [x] `F2` Publish the topic through the existing registry, route, catalog and sitemap, and add focused rendered-content, publication and code-execution tests. — _Depends on:_ F1
- [x] `F3` Add an original monochrome 144×88 divisor-pair miniature in the existing catalog style, update the SPEC catalog description and verify stable desktop/mobile/no-JS layout. — _Depends on:_ F2
- [x] `F4` Align the topic-25 browser assertion with the authored no-attachment bank: expect zero download links while retaining the eight practice forms/tabs. — _Depends on:_ F2, D1
- [x] `F5` Increase the catalog miniature's legibility at mobile size by showing a few larger, semantically exact divisor pairs instead of five tiny lines of text. — _Depends on:_ F3
- [x] `F6` Add the published Python arithmetic lesson link at the point where remainder and integer division are introduced, matching the topic-25 E2E theory-link contract. — _Depends on:_ F1
- [x] `F7` Update the EGE catalog miniature inventory in `docs/FRONTEND.md` so the frontend contract reflects the published topic-24 and topic-25 illustrations. — _Depends on:_ F3
- [x] `F8` Link the published Python digits lesson at the decimal-digit algorithm and assert its destination in rendered and browser tests. — _Depends on:_ F1
- [x] `F9` Complete the worked mask example by stating the full `4??` range before selecting numbers divisible by 25. — _Depends on:_ F1
- [x] `F10` Explain the square-root cutoff from first principles and quantify why scanning a large number's divisors or many numbers exhaustively is costly; retain exact integer arithmetic and a completion check. — _Depends on:_ F1
- [x] `F11` Replace topic-25 miniature with a faithful, legible row-and-arcs adaptation of the architect's supplied prime/composite reference, while correctly treating 1 as neither prime nor composite. — _Depends on:_ F3
- [x] `F12` Correct the worked example's reversed divisibility wording and the proper-divisor checkpoint for n=1. — _Depends on:_ F1
- [x] `F13` Explain the even-last-digit rule before task 07, correct the square-root learning outcome for non-squares, and demonstrate at least one independent manual divisor recount after promising it. — _Depends on:_ F1
- [x] `F14` Clarify the optional `*` mask symbol mentioned by the reviewed task-25 article, contrasting it with one-digit `?` while keeping this lesson's practice on its explicit two-question-mark mask. — _Depends on:_ F1
- [x] `F15` Execute the authored pair-search example on representative boundary numbers and compare its actual divisor set with a simple independent enumeration. — _Depends on:_ F10
- [x] `F16` Remove introduced copy-paste in topic-lesson E2E page object by sharing the published-document and eight-task assertions across topics 17, 24 and 25 without changing their topic-specific checks. — _Depends on:_ F2
- [x] `F17` Deepen the decimal-mask progression using the supplied Yandex Education article: explain fixed digits, each `?`, optional `*`, leading zeros, bounds and efficient generation with independently checked worked examples, without introducing unexplained Python syntax. — _Depends on:_ F1, F14
- [x] `F18` Recheck and improve the divisor-search progression against the supplied Yandex Education article, especially paired divisors, sqrt cutoff, counting/selecting under extra conditions and computational limits. — _Depends on:_ F10
- [x] `F19` Correct the four-question-mark variant count so it explicitly accounts for a leading wildcard versus a fixed nonzero leading digit. — _Depends on:_ F17
- [x] `F20` Clarify that the introductory prime-counting code excludes 1 by its two-divisor test, while a later optimized check can reject numbers below 2 before searching. — _Depends on:_ F1
- [x] `F21` Simplify the mask-section transition to the practice task so it reads naturally and distinguishes the two-question-mark exercise from the starred example. — _Depends on:_ F17

### Infra
None.

### Data
- [x] `D1` Add eight original lesson-only published tasks to the canonical bank, with increasing difficulty, meaningful hints and solutions, exact answers and ordered theory links; regenerate publication artifacts. — _Depends on:_ —
- [x] `D2` Correct task-25-05 hint so the count of divisors is completed before comparing it with three; stopping as soon as three are seen would accept 40 incorrectly. — _Depends on:_ D1
- [x] `D3` Align tasks 05 and 08 explanations with their actual search termination: preserve the first result without implying an early stop in 05, and really stop after five results in 08. — _Depends on:_ D1
- [x] `D4` Keep task 07 inside taught concepts: check divisibility by 9 directly with the remainder of the number, replacing the unexplained digit-sum divisibility rule in the statement, hint, solution and code. — _Depends on:_ D1
- [x] `D5` Remove unexplained `None`/`is None` from task 02 and 05 solutions without changing answers or the search order. — _Depends on:_ D1
- [x] `D6` Make task 05's theory-link label match the actual prime-number explanation. — _Depends on:_ D1
- [x] `D7` Expand `range(10)` to the previously introduced two-bound form in task 07's solution. — _Depends on:_ D1
- [x] `D8` Correct task 25-01 theory links so divisibility and the last-digit technique each point to the section that actually teaches them; update focused link expectations and the local imported row without overwriting unrelated edits. — _Depends on:_ D1
- [x] `D9` Replace the unexplained chained comparisons in task 25-08's published Python solution with the already taught `and` form, preserve the answer and reimport only that task into the local bank. — _Depends on:_ D1

### Other
- [x] `T1` Record concept-to-task mapping, original sources, independent answers, executed examples and the SPEC §2.3 editorial checklist in a lesson quality record. — _Depends on:_ F1, D1
- [x] `T2` Integrate the locally published lesson and imported tasks; verify API delivery, browser desktop/mobile/no-JS, keyboard and unavailable-practice states, then run one affected Critical Gate and repository hygiene. — _Depends on:_ B1, F2, F3, T1
- [x] `T3` Preserve divergent task-24 edits in the existing local development bank during topic-25 integration: export before import, add only the eight new tasks and material to that snapshot, and verify the pre-existing revisions and extra file remain. — _Depends on:_ D1
- [x] `T4` Complete a detailed code/content review against the current contracts and the architect's reference article, correct any material findings, update the quality record, rerun affected checks and preserve local-bank edits during reimport. — _Depends on:_ F10–F15, D5–D7, T5
- [x] `T5` Make the quality record's boundary-test and checker claims precise; verify authored pair-search boundary behavior or narrow the claim. — _Depends on:_ B1
- [x] `T6` Record source-specific observations, original derivations and independent answer checks for the updated mask/divisor examples; run affected content, code and browser verification before closing the two lesson improvements. — _Depends on:_ F17, F18
- [x] `T7` Capture reusable authoring lessons from the task-25 iterations in a short practical guide for future Python/EGE lessons, link it from the Content Quality Gate, and keep the task-25 quality record as topic-specific evidence. — _Depends on:_ T1, T4, T6
- [x] `T8` Make preliminary research of open educational sources an explicit step before designing future lessons; record how to extract, verify and adapt useful ideas without copying source material. — _Depends on:_ T7

---

## Files

### Create / modify

- `apps/web/src/entities/lesson/content/`, the publication registry, topic catalog and its page styles; `apps/web/public/images/topics/` and focused web/E2E tests.
- `content/practice-bank/bank.json`, generated `apps/api/practice-registry.json` and `apps/api/practice-catalog-topics.json`, and focused `apps/api/tests/` coverage.
- `docs/SPEC.md`, `docs/FRONTEND.md`, `docs/artifacts/lessons/25-integer-processing.quality.md` and this change.
- `docs/runbooks/lesson-authoring.md` for reusable authoring checks distilled from completed lessons.

### Do NOT touch

- Existing authored lessons, account/progress/API contracts, database schema, infrastructure and unrelated user-owned artifacts.

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–2.3, §3–§5, `docs/FRONTEND.md` §5 and §9, and the Files list. Existing typed lesson and canonical-bank interfaces remain the source of truth.

---

## Gate Checks

Use the affected Critical Gate from [`docs/STACK.md`](../STACK.md): format, web lint/typecheck, focused web/API/content tests, changed-file LSP and repository hygiene. Playwriter checks the locally published page and catalog. No Full Gate or production release is implied.

---

## Implementation Notes

None.

---

## Commit Message

```
feat(change-151): add EGE integer processing lesson
```
