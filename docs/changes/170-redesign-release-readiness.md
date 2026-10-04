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
- [ ] `F6` Illustrations: when the architect supplies images generated from the prompts, replace `IllustrationPlaceholder` slots (home hero and plates, `/ege` head and rows, `/courses` head and cards, `/courses/python` plate, practice head, auth band, status/empty cards) with the assets; keep CLS ≤ 0.1, add width/height, WebP, decorative `alt=""`. Slot map and prompts: [prompts](../artifacts/change-164/illustrations/prompts.md) (checked 2026-10-04). Architect decisions: the home hero plate with code notes is replaced by `ill-hero`; planned («Скоро») topic rows and course cards keep `IllustrationPlaceholder`. **Blocked until images arrive; ask the architect before starting.** — _Depends on:_ —
- [x] `F7` Fix the Lighthouse-discovered contrast regression in planned `/ege` rows (opacity reduces number contrast to 3.37:1); preserve the muted planned state with semantic colours and confirm accessibility = 1 — _Depends on:_ —

### Data
- [x] `D1` Restore the seeded dev practice bank with `make practice-bootstrap` (the local dev bank has 5 recursion tasks instead of 14, which fails four lesson/practice e2e tests and leaves some subtopics without practice); confirm the four data-bound e2e failures disappear — _Depends on:_ —
- [x] `D2` Find why `make dev` did not apply account migration `140_01` to the dev account database (columns `privacy_consent_version`, `privacy_consented_at` were missing and were added by hand on 2026-10-03); fix the dev bootstrap so a fresh `make dev` is consistent. **Closed 2026-10-04 by architect decision:** the schema safeguard is done and verified; the historical root cause is unprovable without the pre-repair state and is accepted as such — _Depends on:_ —

### Other
- [ ] `T1` Release prerequisites from SPEC §11 checked with the architect: provider applications and callbacks (VK ID, Яндекс ID, Telegram), mail delivery, privacy policy review, account-data backup/restore — _Depends on:_ —
- [ ] `T2` `/ship 170 --release`: affected coverage and Release Gate per STACK, push `main`, deploy the exact SHA, verify public readiness — only after F1–F6, D1–D2, T1 and explicit architect authorisation — _Depends on:_ F3, F5, F6, D1, D2, T1
- [x] `T3` Architect clarification (2026-10-03): mail delivery is implemented; VK ID, Яндекс ID and Telegram remain deferred. Verify disabled-provider behaviour and examine repository privacy and account backup/restore evidence for T1; distinguish technical acceptance from external legal review and fresh production restore proof — _Depends on:_ —

---

## Files

### Create / modify
~~~
apps/web/e2e/** (specs and page objects)
apps/web/src/** (only regressions found by F3/F4, and F6 illustration slots)
apps/web/public/images/** (F6 assets)
lighthouserc.cjs
Makefile / infra dev bootstrap (D2)
docs/SPEC.md, docs/KNOWN_GOTCHAS.md (if findings require)
~~~

### Do NOT touch
- `apps/web/src/entities/*/content/*.lesson.tsx` wording and order
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
