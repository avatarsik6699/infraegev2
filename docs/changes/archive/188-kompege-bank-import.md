# CHANGE 188 — New KЕГЭ tasks in standalone practice

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `188` |
| Slug | `kompege-bank-import` |
| Title | New KЕГЭ tasks in standalone practice |
| Status | `archived` |
| Branch | `feature/188-kompege-bank-import` |

## Goal

Perform one local import of new nonarchived kompege.ru tasks compatible with the dated FIPI
2027 project and cross-checked against Sdamgia. Preserve every pre-existing task, checker,
revision, membership and account result. Include statements, assets and private answers;
exclude solutions/video, sections 110/112, hidden entries and outdated task formats.

## Backlog

### Backend
- [x] B1 Allow tasks without explanations, GIF task images and original `.xls` attachments; preserve strict public/private contracts and cover import/detail/check/file behavior — _Depends on:_ —

### Frontend
- [x] F1 Hide absent hint/solution actions and panels in SSR, hydrated and no-script states; support `.xls` downloads without conversion — _Depends on:_ B1
- [x] F2 Share canonical exam topic metadata and expose all numbers 1–27 in practice filters independently of published lessons; preserve lesson identities/publication — _Depends on:_ —

- [x] F3 Preserve explicit source line breaks when rendering native rich text: browser review of source 31521 exposed its three sample input rows collapsing into a single paragraph; keep ordinary authored text wrapping unchanged — _Depends on:_ D2

### Data
- [x] D1 Implement a bounded one-time converter with explicit 2027 section mapping, source identity deduplication, self-contained 19/20/21 tasks, safe native blocks/assets and private exact answers; test significant conversion/failure cases — _Depends on:_ B1
- [x] D2 Collect the allowed source sections, reconcile every record, repair preparation errors (including independently reconstructed answer 120 for source 31372), retain only compatible new tasks, add the validated delta to the canonical bank without modifying existing entries — _Depends on:_ D1, F2
- [x] D3 Rehearse import and replay in disposable PostgreSQL, verify all new public projections/checker answers/files, and import only the new delta into an explicitly selected local database after export; prove retained bank/progress unchanged — _Depends on:_ D2, B1, F1
- [x] D4 Exclude legacy word/card/dice game families from all three parts, as confirmed by the architect during collection; preserve eligible numeric game variants and their part-specific initial positions, and convert source TeX operators/formulas to readable native notation — _Depends on:_ D1

- [x] D5 Raise the bounded source/download attachment size allowance from 20 to 64 MiB for the large source #17 datasets (9993/9969, 31,944,094 bytes each) and #24 dataset (587, 50,084,031 bytes); retain oversized rejection and verify the web parser accepts their actual size — _Depends on:_ D1, B1

- [x] D6 Omit only structurally empty editor image placeholders (`<img />`) observed in source 10704 while retaining its complete truth tables and text; do not ignore images with missing/invalid declared resources — _Depends on:_ D1

- [x] D7 Preserve immutable bank asset bytes through Git staging and checkout: disable text/EOL filters for content-addressed files, restage exact originals and verify every indexed attachment SHA-256 before shipping — _Depends on:_ D2

### Other
- [x] T1 Update SPEC/FRONTEND/practice operator documentation and generated API contracts for the approved compatibility changes — _Depends on:_ B1, F1, F2
- [x] T2 Obtain independent review, run one affected Critical Gate plus focused tests/LSP and Playwriter desktop/mobile practice verification, analyze evidence and clean owned artifacts — _Depends on:_ D3, T1

- [x] T3 Repair the observed cached development image startup failure (`ERR_PNPM_VERIFY_DEPS_BEFORE_RUN`): replay the frozen offline install after copying web sources, as already done in the production builder; keep dependency versions and strict verification unchanged — _Depends on:_ —

## Files

### Create / modify
Backend: `apps/api/app/modules/practice/{schemas,files,kompege}.py`, optional
`apps/api/app/modules/practice/kompege_*.py`, shared attachment types,
`apps/api/tests/test_minimal_bank.py`, `apps/api/tests/test_kompege*.py`.

Frontend: practice help component, practice task attachment types/adapter, shared exam metadata,
topic catalog and its generator/output, native rich-text renderer/stylesheet, focused practice/catalog tests.

Data/docs: `content/practice-bank/bank.json`, new `content/practice-bank/files/*`,
`docs/SPEC.md`, `docs/FRONTEND.md`, `docs/runbooks/practice.md`, this change,
`contracts/openapi.json`, generated web schema.
Observed environment repair: `apps/web/Dockerfile`, `docs/KNOWN_GOTCHAS.md`; immutable Git storage: `.gitattributes`.

### Do NOT touch
- Active change 187 and its dirty checkout, lesson sources, stands, authored lesson content.
- Existing bank task entries, checkers, solution revisions, memberships and existing file bytes.
- Production, archive history, Git publication/release and dependency versions.

## Contracts

See `docs/SPEC.md` §2.2–§4, `docs/FRONTEND.md`, `docs/runbooks/practice.md` and the Files list above.

## Gate Checks

Commands: [STACK](../../STACK.md); select with `python3 scripts/gate.py affected`.
The Dockerfile follow-up is covered explicitly by the web image contract and successful real rebuild/startup; no schema or dependency versions changed.
Auxiliary TS LSP reported isolated Vitest callback inference warnings; the binding project compiler passes for both source and tests.
Use disposable databases for acceptance. Local target import is single-operator and additive.
Local ship was explicitly authorized on 2026-10-16 after Change 187 reached main. No Full Gate, push or deploy. Raw source downloads and private DB exports stay outside Git/public assets.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| `11762ee` + working tree | affected Critical: format, python-format, tooling-lint, web-lint, web-typecheck, api-lint, api-typecheck, docs-links, content-static, api-contract | PASS | 94.7 |
| same | invalidated frontend checks after F3: web-lint, web-typecheck, docs-links; scoped renderer/CSS Prettier | PASS | 32.3 |
| same | converter tests (84); scoped Ruff and Python LSP | PASS | — |
| same | 5 focused PostgreSQL acceptance tests in `test_minimal_bank.py` | PASS | 468.18 |
| same | focused Vitest: help/taxonomy/parser/catalog, detail/public-release; final parser (22) and renderer (8) checks | PASS | — |
| same | prepared delta and canonical bank validation; disposable import + replay; local delta import and retained-row fingerprints | PASS | — |
| same | Playwriter desktop/mobile, guest check, no-JS SSR DOM, Turing/truth tables, formula/sample rows, numeric game, code, GIF/XLS; Nginx file MIME/size/SHA checks | PASS | — |
| same | independent converter/final-data review and renderer/Docker follow-up; web image contract + real development startup | PASS | — |
| same | analyzed reports, removed owned scratch/rehearsal artifacts; `make clean` | PASS | — |

| `e7066ac` + 188 working tree | local-ship combined-tree `content-static`, `docs-links`; history inspect | PASS | 2.5 |

| `e7066ac` + 188 working tree | D7: Git attributes unset text/diff/merge; all 1,909 indexed attachment sizes and SHA-256 match the canonical bank; `docs-links` | PASS | 0.1 + blob checks |

### Local ship coverage

The branch was fast-forwarded to main `e7066ac` before committing 188. The 187/188 path sets are
disjoint. Existing 188 API/web/converter tests, type checks, contract, browser and data-preservation
proof are accepted unchanged. Inherited host Python, lesson-media and source PDF/DOCX/XLSX coverage
is accepted from archived Change 187: those files match main byte-for-byte and 188 does not alter
them. Recheck `content-static`, `docs-links` and history for the combined tree. Full and Release
rows are skipped because this is an explicitly local ship, without schema/dependency changes.

## Implementation Notes

- The architect explicitly requested a separate parallel change/worktree while 187 remains active;
  188 is reserved from the original checkout's verified history inspection. The ordinary `next`
  guard rejects the active 187; its branch and work remain untouched.

- Sources were collected on 2026-10-16 from the 25 explicitly mapped current API groups.
  The [FIPI 2027 project](https://fipi.ru/ege/demoversii-specifikacii-kodifikatory) governs numbering;
  [Sdamgia's catalog](https://inf-ege.sdamgia.ru/prob-catalog) was the cross-check. Archive groups,
  110/112 and hidden entries were not imported.
- All 6,337 source parts reconcile: 5,648 new, 547 already present, 142 deliberately excluded,
  zero errors. Exclusions comprise 118 obsolete #27 entries, 18 parts of the six confirmed old
  word/card/dice families, and six nonnumeric legacy game parts. #27 retains source 31521 only.
- The delta contains 1,802 unique immutable files (1,225,482,141 bytes). The canonical bank now has
  7,475 tasks; standalone practice exposes 6,195. Original 1,827 entries and 107 canonical files
  were compared unchanged; the local target's separate 112 editorial differences also survive.
- Disposable import/replay and the local import checked all 5,648 public projections and correct/
  incorrect checker submissions, all file hashes, and retained task/checker/revision/membership/
  account/progress rows. Retained-row fingerprints still match after app startup and the browser
  guest check. Source answer keys were transferred faithfully, not independently solved en masse;
  the absent key for 31372 was reconstructed separately and stays private.
- Canonical `bank.json` SHA-256 after formatting:
  `246c5751af7276bba0d6d38b154a6521e1275b3e3172339d51cf910a089415b3`.
- Local review uses this isolated worktree through `make dev` at `http://localhost:8080/practice`.
  The protected pre-import export and new-only prepared directory remain at
  `/tmp/infraegev2-kompege188/{before,final}` until local review is accepted. Raw download caches,
  disposable rehearsal resources and analyzed verification artifacts are removed.

- After accepting the local result, the architect authorized consolidating 188 into the primary
  `/home/niquetamerewsl/projects/infraegev2` checkout and removing the parallel worktree. The
  pre-import export stays protected; the redundant prepared delta can be released after all
  canonical files are verified in main. The live local database and original task-file storage
  are retained, and development bind mounts must use the primary checkout before removal.

- Git staging exposed CRLF normalization of opaque text attachments under `core.autocrlf=input`.
  `.gitattributes` preserves those paths as binary; all 1,909 indexed blobs were checked against
  their content-addressed names and bank sizes before the implementation commit. Data keys and
  source bytes were not rewritten to accommodate normalization.

## Commit Message

```text
feat(change-188): import new KEGE tasks for EGE 2027 practice
```
