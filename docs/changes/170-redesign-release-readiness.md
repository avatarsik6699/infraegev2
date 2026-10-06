# CHANGE 170 — Redesign release readiness

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `170` |
| Slug | `redesign-release-readiness` |
| Title | Redesign release readiness |
| Status | `active` |
| Branch | `feature/170-redesign-release-readiness` |

---

## Goal

Finish the client redesign programme (Changes 164, 167, 168, 169) and release it. Those changes
are merged into local `main` only: nothing has been pushed or deployed. The architect's rule
(2026-10-03): no push and no release until the whole redesign is complete and every known problem
is fixed. Performance, metrics and e2e were deliberately deferred to this change. Contract:
[SPEC](../SPEC.md) §5, §8, §9 and §11.

---

## Handoff — state on 2026-10-03

- **Git.** Local `main` is 12 commits ahead of `origin/main` (Changes 164, 167, 168, 169 and their
  archives, from `01252a9` to `228780c`). Changes 165 and 166 are already on `origin`. Never push
  outside `/ship 170 --release`; production deploy has no approval gate, so verify the SHA.
- **Done (archived, read for detail):** [164](archive/164-client-redesign.md) design system,
  `DESIGN.md`, restyle; [167](archive/167-subtopic-pages.md) EGE subtopic pages
  `/ege/{topic}/{subtopic}` and `/ege/{topic}/praktika`, `/ege/{topic}` 301-redirects to the first
  subtopic; [168](archive/168-profile-progress-dashboard.md) profile dashboard;
  [169](archive/169-screens-to-mockups.md) every page brought to the v5 mockups, old catalog
  drawings replaced by `IllustrationPlaceholder`, course lessons on the shared lesson frame,
  practice task `detail` layout.
- **Design source of truth:** [v5 mockups](../artifacts/change-164/mockups/README.md) and
  [DESIGN](../../DESIGN.md). Illustration prompts: [prompts](../artifacts/change-164/illustrations/prompts.md).
- **Last green Critical Gate (Change 169):** format, `pnpm --filter web lint` (with architecture,
  layer and design-system verifiers), typecheck, 332 unit tests, `lint:tooling`,
  `validate:content`, hygiene; axe clean on 14 routes at 1440 and 390 px.
- **Known open problems:** see Backlog. Dev environment pitfalls found in this programme are in
  [KNOWN_GOTCHAS](../KNOWN_GOTCHAS.md) under «Redesign programme (Changes 164–169)».

Architect taste rules that bind all remaining work: light theme only; no orange-filled buttons;
orange only for «you are here»; no AI-template badges or decorative chips; one pastel plate per
page outside home; avoid duplicated progress indicators; verify UI with Playwriter (real Chrome,
`Default` profile) at desktop and mobile; never delete `.impeccable/` (its `critique/` folder is
the architect's untracked work).

---

## Backlog

### Frontend
- [x] `F1` Migrate e2e to the new URLs and screens: topic lessons now live at `/ege/{topic}/{subtopic}` and `/ege/{topic}/praktika` (specs `topic-*-lesson`, `topic-reading`, `shared-reading`, `accessibility`, `smoke`, `practice-cutover`, `account-integration`, page objects `topic-lesson.page.ts`, `minimal-application.page.ts` incl. `expectStableLessonOutline`, `public-discovery.page.ts`, `fixtures.ts`); add one `@no-js` subtopic check and one redirect check for `/ege/{topic}` and legacy `#section` links. About 30 tests failed on old URLs after Change 167 — _Depends on:_ —
- [x] `F2` Migrate e2e for the reworked screens: course lesson frame (left course navigation, right «На этой странице», pager; old «В этом уроке» outline and «§ N ·» eyebrows are gone), practice task detail (h1 = task title, «ЕГЭ N · Тема» eyebrow, «Ваш ответ», hint/solution disclosures, source card), `/ege` order (published first, then «Скоро»), `/courses` cards, `/courses/python` stats and module cards, 404/error cards, auth card layout, profile dashboard (Change 168: next step, tiles, topic rows, «Попробуйте задачу») — _Depends on:_ —
- [x] `F3` Run the full frontend e2e, `test:layout`, `@no-js` and axe specs once; fix real regressions in code, adjust only contract-obsolete expectations — _Depends on:_ F1, F2, D1
- [x] `F4` Lesson LCP: `/ege/{topic}/{subtopic}` measured 5.22 s on the old single-page lesson (budget 4.0 s; render delay on a long SSR body paragraph, pre-existing since `01252a9`). Re-measure on the subtopic pages (shorter, likely better) and on `/ege` (was 4.02 s); apply low-risk improvements where useful; record residual deviations without chasing the 4.0 s target — _Depends on:_ —
- [x] `F5` Lighthouse CI on `/`, `/ege`, `/courses`, `/courses/python`, one EGE subtopic page and one course lesson (update `lighthouserc.cjs` URLs: `/ege/16-rekursiya` now redirects); reference budgets a11y = 1, SEO = 1, LCP ≤ 4 s, CLS ≤ 0.1, TBT ≤ 200 ms; per architect clarification, modest performance deviations are acceptable with recorded measurements — _Depends on:_ F4
- [x] `F6` Mascot scenes: replace the mascot slots with scenes built in code from the approved poses ([references/mascot](../artifacts/references/mascot/README.md), approved 2026-10-04; pipeline and demo: [change-170/mascot](../artifacts/change-170/mascot/README.md)). Order: home hero first (lotus layer plus learning objects, CSS float, off under `prefers-reduced-motion`; replaces the plate with code notes; it is the LCP candidate, so re-measure), then sign-in/registration (two columns: form left, scene right; white page, no card around the form), 404, error, empty search and the `/ege`, `/courses`, `/practice` heads, one at a time. Code-built scenes after the hero were rejected (2026-10-04): each remaining scene is generated by the architect from [prompts](../artifacts/change-164/illustrations/prompts.md) with the character sheet as reference, traced by the pipeline, approved on the demo page before it ships. Done 2026-10-05: home hero; sign-in (door and key) and registration (clipboard) approved 2026-10-04, scenes 29rem wide and at most 25rem high, a `--space-5` gap from the form, small abstract marks only. 404, error and empty search built from the architect's PNGs and recomposed as open blocks without a card, approved 2026-10-05. Catalog head scenes (`/ege`, `/courses`, `/practice`) were tried and removed by the architect (2026-10-04): the heads have no illustration. Keep CLS ≤ 0.1, explicit sizes, decorative `alt=""`/`aria-hidden`; record the mascot in `DESIGN.md`. Planned («Скоро») topic rows and course cards keep `IllustrationPlaceholder` — _Depends on:_ —
- [x] `F8` Object illustrations: topic plates and rows, `/courses/python` plate and card from [prompts](../artifacts/change-164/illustrations/prompts.md) (slot map checked 2026-10-04). 2026-10-05: all 25 topics drawn in code with the shared pen (`pipeline/topics.mjs`) and approved on the demo; the Python course pictures are the architect's PNGs traced by `trace.mjs` with small marks. Wired through `ObjectIllustration` without plates (home topic cards lost their pastel tops); `/courses/python` head picture 24rem (about a third of the head). Planned courses keep the placeholder. — _Depends on:_ —
- [x] `F7` Fix the Lighthouse-discovered contrast regression in planned `/ege` rows (opacity reduces number contrast to 3.37:1); preserve the muted planned state with semantic colours and confirm accessibility = 1 — _Depends on:_ —
- [x] `F9` Home hero title: replace the straight orange underline under «почему это работает» with a hand-inked underline (uneven, brush-like), from [fixes after redesign](../artifacts/references/for_new_design/fixes_after_redisign.md) §1 (architect review 2026-10-05) — _Depends on:_ —
- [x] `F10` Home `facts` («7 тем ЕГЭ», «28 уроков Python»): plain secondary text instead of badges, never drawing the eye (§2) — _Depends on:_ —
- [x] `F11` Home `paths` cards: icon to the right of the title, per the reference `photo_2026-10-05_12-53-59.jpg` (§3) — _Depends on:_ —
- [x] `F12` Home `topics`: an asymmetric grid instead of four squeezed cards in a row; remove the «Все темы» link under the section (§4) — _Depends on:_ F15
- [x] `F13` Home «Попробуйте прямо сейчас»: a simpler task; the task as a card without the quiet plate and without hint/solution buttons; consider an animated walkthrough (cursor to the field, the answer typed, «Проверить» clicked, accepted, confetti, green field with a check), off under `prefers-reduced-motion` (§5) — _Depends on:_ F15
- [x] `F14` Home Python course card: replace the pastel colour; reconsider whether a coloured card fits at all (§6) — _Depends on:_ F15
- [x] `F15` All home cards: stronger design — soft gradient colour, volume and depth, possibly a sheen; the architect overrides DESIGN.md's flat-surface rule for the home page, record the exception there (§7) — _Depends on:_ —
- [x] `F16` Home Python course card (architect review 2026-10-05): smaller, without the excess empty space; placed right under the topics cards (similar style, related content). An own apricot colour was tried and rejected by the architect; the card stays neutral (F14) — _Depends on:_ F14
- [x] `F17` Home try card: the confetti must not be clipped by the card; it flies out past the card edges — _Depends on:_ F13
- [x] `F18` Home hero underline (architect review 2026-10-05): the F9 stroke still reads as a clean vector line; it must look inked — ragged edges, dry-brush gaps, a pressed start and a thinning tail — _Depends on:_ F9

#### Round 2 (architect review 2026-10-06, [fixes round 2](../artifacts/references/for_new_design/fixes_after_redisign.md); decisions: subtopic leads, progress under the right rail, catalog-style answer controls everywhere, tree of published topics only)
- [x] `F19` One progress bar everywhere: mockup look (6px, visible track, ink fill, text above and below), track token distinct from hover fills; drop local overrides (§2, §6) — _Depends on:_ —
- [x] `F20` Shared confetti burst and field success state (green border and fill, check without circle), extracted from the home demo (§3) — _Depends on:_ —
- [x] `F21` Confirmation dialogs close on overlay click and Escape (Base UI `AlertDialog` forbids pointer dismissal) (§7) — _Depends on:_ —
- [x] `F22` Filled danger button for the lesson progress reset dialog; account actions keep the outlined style (§7) — _Depends on:_ —
- [x] `F23` Selected items never reflow: no weight change on current rail/outline items, reserved space for checks in «Тема» and selects (§3, §7) — _Depends on:_ —
- [x] `F24` One page head for `/ege`, `/courses`, `/courses/python`, `/practice`: same title, lead, meta sizes and gaps (§1) — _Depends on:_ —
- [x] `F25` `/ege`: no column headings; compact rows; «Все темы» in task order 1–27; the ФИПИ source note moves into the head meta (§2) — _Depends on:_ F19, F24
- [x] `F26` `/practice` toolbar: «Сложность» left of «Сортировка», no overlap with «Тема» (§3) — _Depends on:_ —
- [x] `F27` «Тема» filter audit: whole search row focuses, focus does not stick, no shift on check, one font size (§3) — _Depends on:_ F23
- [x] `F28` Filter chips at the mockup size; «Сбросить всё» matches them (§3) — _Depends on:_ —
- [x] `F29` Practice rows: more padding and column gap; green solved check (§3) — _Depends on:_ —
- [x] `F30` One answer-controls layout (catalog style) in catalog, task page and lessons; success field instead of «Верно.»; confetti on a correct answer (§3, §4, §7) — _Depends on:_ F20
- [x] `F31` «Как работает практика»: verify and shorten or remove on `/practice`; remove on the task page (§3, §4) — _Depends on:_ —
- [x] `F32` Task page: minimal «К списку задач» left of the topic label; centred topic dot; tighter statement text (§4) — _Depends on:_ F30
- [ ] `F33` `/courses`: asymmetric grid, Python card largest with an animated gradient border (off under reduced motion) (§5) — _Depends on:_ —
- [ ] `F34` `/courses` planned cards: description, «— уроков · level», «Освоено 0 из — уроков», disabled «Скоро»; no outcome block anywhere (§5) — _Depends on:_ F19
- [ ] `F35` `/courses/python`: blue «К программе курса ↓», icons on «Что понадобится»/«Как идёт курс», no «Развернуть всё», unified module progress (§6) — _Depends on:_ F19
- [ ] `F36` Breadcrumbs: Темы ЕГЭ › Задание N. Тема › current subtopic (and Мини-курсы › Курс › урок); last segment is not a link (§7) — _Depends on:_ —
- [ ] `F37` Lesson rail as a minimal file tree (published topics by task number, course modules), no «Все темы ЕГЭ»/«К программе курса» link; «На этой странице» in the same style (§7) — _Depends on:_ F23
- [ ] `F38` Lesson progress under «На этой странице» (in the mobile disclosure below 72rem); smaller reset button; one shared progress component (§7) — _Depends on:_ F21, F22, F37
- [ ] `F39` Lesson practice: «Задача N» tabs never truncate, check to the right; theory links one line with ellipsis (also catalog and practice page) (§7) — _Depends on:_ F30
- [ ] `F40` Remove next/previous topic links from the practice and summary page (§7) — _Depends on:_ —
- [ ] `F41` Neighbour page links: one line with ellipsis, hover and focus feedback (§7) — _Depends on:_ —
- [ ] `F42` A short lead under every EGE subtopic title (25 subtopics), so a heading is never followed by a heading; architect reviews the text (§7) — _Depends on:_ —
- [ ] `F43` `/ege/{topic}/praktika` order: summary text and figures, tasks, then «Проверьте себя»; update SPEC §1.4 (§7) — _Depends on:_ F40
- [ ] `F44` DESIGN.md and SPEC record the round-2 exceptions and new patterns — _Depends on:_ F19–F43
- [ ] `F45` Migrate unit and e2e expectations to the round-2 contract; delete dead page-object methods; run affected e2e once — _Depends on:_ F19–F44
- [x] `F46` Accepted answer field (architect review 2026-10-06): the green fill is two-tone — the disabled input keeps its own background inside the green group — _Depends on:_ F30
- [x] `F47` Task page: the source («Демоверсия 2023 · 2023») moves from the card under the task into the metadata line with difficulty and format — _Depends on:_ F32
- [x] `F48` Tasks hidden from the catalog (lesson-only, e.g. `rekursiya-base-sequence`) fail the answer check on `/practice/{id}` with «Задача больше недоступна»; find the cause and fix or record it (architect delegated the decision, 2026-10-06) — _Depends on:_ —

### Data
- [x] `D1` Restore the seeded dev practice bank with `make practice-bootstrap` (the local dev bank has 5 recursion tasks instead of 14, which fails four lesson/practice e2e tests and leaves some subtopics without practice); confirm the four data-bound e2e failures disappear — _Depends on:_ —
- [x] `D2` Find why `make dev` did not apply account migration `140_01` to the dev account database (columns `privacy_consent_version`, `privacy_consented_at` were missing and were added by hand on 2026-10-03); fix the dev bootstrap so a fresh `make dev` is consistent. **Closed 2026-10-04 by architect decision:** the schema safeguard is done and verified; the historical root cause is unprovable without the pre-repair state and is accepted as such — _Depends on:_ —

### Other
- [ ] `T1` Release prerequisites from SPEC §11 checked with the architect: provider applications and callbacks (VK ID, Яндекс ID, Telegram), mail delivery, privacy policy review, account-data backup/restore — _Depends on:_ —
- [ ] `T2` `/ship 170 --release`: affected coverage and Release Gate per STACK, push `main`, deploy the exact SHA, verify public readiness — only after F1–F8, D1–D2, T1 and explicit architect authorisation — _Depends on:_ F3, F5, F6, F8, D1, D2, T1
- [x] `T3` Architect clarification (2026-10-03): mail delivery is implemented; VK ID, Яндекс ID and Telegram remain deferred. Verify disabled-provider behaviour and examine repository privacy and account backup/restore evidence for T1; distinguish technical acceptance from external legal review and fresh production restore proof — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/web/e2e/** (specs and page objects)
apps/web/src/** (only regressions found by F3/F4, and F6/F8 illustration slots)
apps/web/public/images/** (F6/F8 assets)
docs/artifacts/references/mascot/** (approved poses; rebuild only through the pipeline)
docs/artifacts/change-170/mascot/** (pipeline and demo)
lighthouserc.cjs
Makefile / infra dev bootstrap (D2)
docs/SPEC.md, docs/KNOWN_GOTCHAS.md (if findings require)
~~~

### Do NOT touch
- `apps/web/src/entities/*/content/*.lesson.tsx` wording and order (round 2 only adds subtopic leads, F42)
- `apps/web/src/shared/api/schema.ts` by hand or by a broad Prettier run (regenerate with `pnpm api:generate`)
- `.impeccable/` (architect's untracked `critique/` folder)
- Production hosts outside `/ship 170 --release`

---

## Contracts

See `docs/SPEC.md` §5, §8, §11 and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with explicit `--full`; release selects affected checks and Release Gate. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

This change carries the deferred programme checks: full frontend e2e (F3) and Lighthouse (F5)
must be evaluated before `--release`; functional and accessibility regressions must pass, while modest performance deviations may remain under the architect clarification below. Host e2e needs `ACCOUNT_DATABASE_URL` and `AUTH_CSRF_SECRET` from
the dev API besides `DATABASE_URL`.

---

## Implementation Notes

- Technical account/privacy/recovery findings are recorded in [readiness evidence](../artifacts/change-170/readiness.md). Formal privacy acceptance and fresh production account restore proof remain unconfirmed; T1 stays open. The historical D2 pre-repair state is unavailable, so its cause remains unproven; the architect accepted the verified schema guard as closing D2 (2026-10-04).
- Architect clarification (2026-10-03): aim for good overall performance rather than ideal numbers; a modest LCP deviation does not require further optimization. Keep the original CI reference budgets and report their assertion failures honestly. Rejected speculative chunking and route-loading experiments; retained native video lazy loading, verified in the browser and focused tests.

---

## Commit Message

```
chore(change-170): redesign release readiness — e2e, LCP, illustrations
```
