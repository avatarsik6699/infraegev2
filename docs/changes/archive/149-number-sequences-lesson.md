# CHANGE 149 — Number sequences lesson

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `149` |
| Slug | `number-sequences-lesson` |
| Title | Number sequences lesson |
| Status | `archived` |
| Branch | `feature/149-number-sequences-lesson` |

---

## Goal

Deliver a production-ready local EGE task 17 lesson at `/ege/17-chislovye-posledovatelnosti` with eight original file-based exercises. Teach single values, adjacent pairs, adjacent triples and conditions needing a prior pass through the data, with detailed, natural Russian explanations and purposeful links to already published Python course lessons. Render the complete published experience in the feature branch; the architect checks it locally and reports any changes before `/ship`. See `docs/SPEC.md` §1.4, §2.2–2.3, §3–§5 and `docs/FRONTEND.md` §5.

---

## Editorial scope

The ordered theory anchors are `sequence-from-file`, `single-values`, `neighbor-pairs`, `neighbor-triples`, `two-passes`, and `verify-boundaries`. Each new idea moves from plain-language meaning to a complete worked example, a partially completed example and independent practice. Explain first use of terms such as sequence, index, adjacent, selection condition and second pass. Briefly remind the reader of existing Python syntax and link contextually to the published lessons on loop state, lists, files and result selection; do not introduce a Topic–CourseLesson data relationship or shared progress.

Eight tasks, in nondecreasing difficulty, cover: single-value count; qualifying single-value extremum; adjacent-pair count; adjacent-pair extremum; adjacent-triple count; adjacent-triple extremum; pair selection using a whole-file reference value; and an integrated triple/whole-file reference case. Each has original integer-per-line data, an independently verified answer, a useful hint and a worked explanation. Lesson task rows remain outside standalone `/practice` discovery.

---

## Backlog

### Backend
- [x] `B1` Add focused bank/checker coverage for all eight task answers, known wrong answers, file bytes, lesson ownership and secret-free public projections without changing the HTTP contract. — _Depends on:_ D1
- [x] `B2` Remove `review` from active practice-material status validation while retaining `draft`/`published` and verify that the canonical bank rejects a review stage. — _Depends on:_ T4

### Frontend
- [x] `F1` Author the detailed six-block TopicLesson theory and local exam/result/checkpoint copy, with worked and partially completed examples, adjacent mistakes, contextual course links and plain-language first use of every new term. — _Depends on:_ T1
- [x] `F2` Register the new lesson as `published` in the feature branch and add focused content/route/public-discovery/link tests. Its catalog entry, sitemap, canonical metadata and eight tasks must match the eventual public experience with and without JavaScript. — _Depends on:_ F1, D1
- [x] `F3` Verify the locally published lesson, catalog discovery, sitemap, task data and metadata before the architect’s manual review and `/ship`. — _Depends on:_ F2, B1, T2
- [x] `F4` Teach middle-of-triple comparisons with explicit left/middle/right indexes and strictness before task 17-05; add worked and partial examples, and make a two-pass example exercise both accepted and rejected/equal pairs. — _Depends on:_ F1
- [x] `F5` Align the introductory runnable file name with the downloadable task files, or explicitly explain the substitution. — _Depends on:_ F1
- [x] `F6` Avoid displaying “0 задач” and “Все задания решены” when practice is unavailable; keep the existing unavailable message and restore normal counts when the tasks load. — _Depends on:_ F2
- [x] `F7` Fix low-contrast code fragments in the shared CodeBlock, including unclassified text and tokens, and verify the task 17 example on desktop/mobile without changing the established code palette. — _Depends on:_ F1
- [x] `F8` Fix the missing space before the numeric result in the same two-pass callout; check the rendered Russian sentence. — _Depends on:_ F1
- [x] `F9` Add an original compact monochrome illustration for topic 17 in the `/ege` catalog, matching the existing mathematical miniatures in subject, scale and reserved geometry; verify desktop/mobile/no-JS and image loading. — _Depends on:_ F2
- [x] `F10` Audit rendered lesson-17 prose for words joined across JSX component boundaries, fix the affected copy including the result section, and add a focused regression check for the rendered text. — _Depends on:_ F1
- [x] `F11` Replace the topic 17 catalog miniature with the architect's supplied sequence illustration from `docs/artifacts/references/21_46_28.png`, remove its white background while preserving the exact handwritten numbers, outline, brace and indexes, and verify the transparent asset on desktop/mobile and without JavaScript. — _Depends on:_ F9
- [x] `F12` Enlarge the topic 17 miniature within its existing catalog geometry, adapting the supplied sequence drawing if needed while keeping the highlighted adjacent triple and index-label composition clear on desktop and mobile. — _Depends on:_ F11
- [x] `F13` Make the neighboring-triple worked and partial Python examples runnable with their stated data and output, and add focused execution coverage so copied complete examples match their explanations. — _Depends on:_ F1
- [x] `F14` Restore spaces at lesson-17 JSX inline-component boundaries missed by F10 and cover both sides against rendered text, preserving intentional mathematical notation. — _Depends on:_ F10
- [x] `F15` Consolidate the repeated no-JavaScript TopicLessonPage fixture setup for topics 5, 16 and 17 without changing fixture ownership or E2E behavior. — _Depends on:_ F2

### Infra
None.

### Data
- [x] `D1` Add eight original lesson-only tasks and content-addressed text files to the canonical practice bank, with ordered membership, accurate answer variants, useful hints, substantive solutions and theory links to the agreed six anchors. — _Depends on:_ T1
- [x] `D2` Record independent answer/code/file checks, originality, task progression and the open human content-quality decision in an adjacent lesson quality record. — _Depends on:_ D1, F1
- [x] `D3` Correct the task-17-04 worked explanation so its listed pair sums and maximum agree with the attached file, checker and tested code; strengthen the focused test against stale explanatory answers. — _Depends on:_ D1
- [x] `D4` Disambiguate the position in a triple from an arithmetic mean in task-17-06 and task-17-08 wording. — _Depends on:_ D1
- [x] `D5` Include equality boundary cases in task-17-05 and task-17-07 files so replacing strict comparisons with inclusive ones changes the answer; recheck data, checker and explanations. — _Depends on:_ D1
- [x] `D6` Expand the final two task files beyond hand-enumerable examples to exercise a Python file-processing workflow, retaining short examples in theory. — _Depends on:_ D1
- [x] `D7` Mark task 17 material published in the canonical bank and verify ordinary local bootstrap makes all eight tasks and files available without database toggles. — _Depends on:_ T4

### Other
- [x] `T1` Update SPEC/FRONTEND to permit contextual authored links to published Python lessons while preserving topic/course independence, and record the editorial and verification contract here. — _Depends on:_ —
- [x] `T2` Integrate and review the ready page; run affected validation and Critical Gate once, inspect Playwriter desktop/mobile screenshots and console, no-JS reading, keyboard/file journeys and degraded states. Report the locally published review URL without shipping. — _Depends on:_ F2, B1, D2, T3
- [x] `T3` Exercise all eight tasks through the ordinary local import and loopback-only public paths, with no direct database visibility switch or separate preview behavior. — _Depends on:_ F2, D1
- [x] `T4` Remove the separate content review publication stage and post-implementation `/work review` stage from current SPEC, SDD playbooks/template and project instructions. Keep manual pre-ship review and route all findings through the active Backlog. — _Depends on:_ —
- [x] `T5` Recheck local production-equivalent lesson/catalog/sitemap, browser code contrast and repository gates after the workflow change; preserve the user’s reviewable local environment without shipping. — _Depends on:_ B2, D7, F3, F7, T4
- [x] `T6` Run the final independent code, architecture, duplication, content and browser audit for Change 149; append and fix actionable findings, then complete the affected Critical Gate before local `/ship`. — _Depends on:_ T5, F12, D7
- [x] `T7` Update SPEC §5 catalog illustration wording to match the published topic 17 miniature and the current FRONTEND contract. — _Depends on:_ F12

---

## Files

### Create / modify

- `docs/SPEC.md`, `docs/FRONTEND.md`, this change and the lesson quality record; `AGENTS.md`, `CLAUDE.md`, current SDD playbooks/template and thin work wrappers for the unified Backlog flow.
- `apps/web/src/entities/lesson/content/` theory, publication metadata, status types, shared CodeBlock/Callout styling and registry; `apps/web/public/images/topics/` miniature, catalog definition, focused web tests and owned E2E Page Object/fixture/spec changes.
- `content/practice-bank/bank.json`, new `content/practice-bank/files/` assets, the practice material status schema and focused API bank tests.
- Generated publication registry only through its repository command when required by validation.

### Do NOT touch

- Existing authored lesson theory, course publication order, account/progress/API contracts, database schema, infrastructure and unrelated user-owned artifacts.

---

## Contracts

See `docs/SPEC.md` §1.4, §2.2–2.3, §3–§5, `docs/FRONTEND.md` §5 and the Files list above. The code and canonical bank own their existing schema and interfaces.

---

## Gate Checks

Use the affected Critical Gate from `../../STACK.md`: format, web lint/typecheck, focused content and bank tests, content validation, changed-file LSP and repository hygiene. Playwriter inspects the complete locally published page; repository Playwright keeps its Page Object/fixture policy. Manual content review precedes `/ship` and findings return to this Backlog. No Full Gate or release is implied.

---

## Implementation Notes

- The lesson and canonical bank are `published` in the feature branch; production remains unchanged until release. Local checking uses ordinary `make practice-bootstrap` and the public route at `http://127.0.0.1:8080/ege/17-chislovye-posledovatelnosti`. The local Nginx override at `/tmp/infraegev2-change149-loopback.yml` keeps port 8080 bound to `127.0.0.1` when restarting the preview.
- Topic 17 uses the architect's supplied sequence drawing with its pale paper background converted to transparency and empty margins cropped for the reserved 144×88 catalog geometry. An image-generation background-extraction attempt redrew the handwriting, so the final asset retains the source pixels; the existing topic 5 and 16 miniatures remain SVG.
- The enlarged variant keeps `1, 4, 6, 9, 3`, the selected triple, brace and index label from the reference; it omits only the trailing `2, …` context and scales the image slightly within the existing catalog row.
- The final focused lesson E2E ran against a fresh unseeded database and could not observe the eight practice tasks. Earlier ordinary local bootstrap verified their public delivery under `T3`; the final isolated bank/API checks passed, and all 13 catalog browser scenarios passed. A fresh end-to-end task run requires the isolated seeded database described in `docs/STACK.md`.

---

## Commit Message

```text
feat(change-149): add EGE number sequences lesson
```
