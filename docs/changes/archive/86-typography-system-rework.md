# CHANGE 86 — Typography System Rework

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `86` |
| Slug | `typography-system-rework` |
| Title | Typography System Rework |
| Status | `active` |
| Branch | `feature/86-typography-system-rework` |

---

## Goal

Replace the ALCHIMIA display/reading/UI font system: `Alchimia Cormorant SC` (display/headings/
wordmark) is too decorative and thin at small-caps display weight to read outside a pure wordmark
context. Adopt a 3-font role set — `Alegreya` (display/headings/wordmark), `Golos Text` (reading
+ UI controls/labels), `JetBrains Mono` (narrowed strictly to code/data/formulas) — replacing
Cormorant SC, Literata and IBM Plex Mono. Hierarchy inside each role comes from weight/italic,
not family-switching. See `docs/SPEC.md` §5.3 and `docs/FRONTEND.md` §6/§6.1.

---

## Backlog

### Frontend

- [x] `F1` Self-host the Cyrillic + Latin subsets actually used for Alegreya (variable, `wght`
  400–900), Golos Text (variable, `wght` 400–900) and JetBrains Mono (variable, `wght` 100–800)
  under
  `apps/web/public/fonts/{alegreya,golos-text,jetbrains-mono}/`; replace the `@font-face` blocks in
  `apps/web/src/app/styles/fonts.css` for `"Alchimia Cormorant SC"`/`"Cormorant SC Fallback"`,
  `"Alchimia Literata"`/`"Literata Fallback"` and `"Alchimia IBM Plex Mono"`/`"IBM Plex Mono Fallback"`
  with `"Alchimia Alegreya"`, `"Alchimia Golos Text"` and `"Alchimia JetBrains Mono"` plus
  metric-adjusted fallback faces generated the same way the existing fallbacks were built (do not
  guess `size-adjust`/`ascent-override`/`descent-override`). Remove the now-unused old font files
  and the pre-existing orphaned `apps/web/public/fonts/onest/` files — _Depends on:_ —
- [x] `F2` Update `--theme-font-display`, `--theme-font-ui`, `--theme-font-reading`,
  `--theme-font-data` (and the `--theme-font-alchimia-*` lab aliases) in
  `apps/web/src/app/styles/theme.css` to the new family stacks; confirm
  `apps/web/src/app/styles/tokens.css` semantic aliases still forward correctly — _Depends on:_ F1
- [x] `F3` Disable programming ligatures for JetBrains Mono in code/practice-code rendering
  (`font-variant-ligatures: none`) in the `CodeBlock` scroll area
  (`apps/web/src/shared/components/code-block/code-block.module.css`) and the inline `Notation`
  component (`apps/web/src/shared/components/notation/notation.module.css`), the two consumers
  that render `var(--font-data)` content with operators — _Depends on:_ F1
- [x] `F4` Browser-verified via Playwright MCP against `make dev` (localhost:8080): home page
  (wordmark + subtitle, headings, body), `/ege/16-rekursiya` lesson page at 1280px and 390px
  (theory headings, inline `Notation`, `CodeBlock` with Python source), and `/courses/python`
  course-overview page (module headings, numbered lesson-stage landmarks). Zero console
  errors/warnings on every navigation once `__root.tsx`'s preload hrefs were updated (see
  Implementation Notes) — the first load surfaced 8 404s from stale preload paths, fixed and
  re-verified clean. Code block operators (`==`, `*`, `-`, `+`) render unmerged. Did not exercise a
  dialog title in-browser (no reset/confirmation flow triggered this session); dialog CSS uses the
  same `var(--font-display)` token as other headings, already visually confirmed elsewhere — flagging
  as the one unverified surface rather than silently marking it checked — _Depends on:_ F2, F3
- [x] `F5` Architect finding: Alegreya at `600` reads too heavy for headings. Cap every explicit
  `font-weight: 600` paired with `var(--font-display)`/`var(--font-alchimia-display)` at `500`
  instead, across `typography-title.module.css` (the shared `Typography.Title` primitive covering
  every heading level), `confirmation-dialog.module.css` `.title`, `course-overview-page.module.css`
  `.intro h1`, `foundation-page.module.css` `.intro h1` and `.lessonTitle`,
  `lesson-practice.module.css` `.taskHeading`, `public-header.module.css` `.wordmark`,
  `privacy-page.module.css` `.root > h1`, and 4 blocks in `design-system-lab.module.css`. Do not
  touch `600` usages tied to `--font-ui`/`--font-data` (e.g. code-block language label,
  `course-overview-page.module.css` `.courseLink`/`.moduleNumber`) — those are UI/data role, not
  display — _Depends on:_ —

### Other

- [x] `T1` Rewrite `docs/FRONTEND.md` §6 "Typography and interface copy" and §6.1 "ALCHIMIA rollout
  contract" for the new Alegreya/Golos Text/JetBrains Mono roles (weight-discipline wording later
  refined again by T3 once F5 capped display weight at `500`); the "quiet numbered lesson-stage
  landmark" carve-out now reads as a JetBrains Mono/data-role treatment (still correct, since it's
  numeric notation, not UI) — _Depends on:_ F2
- [x] `T2` Update `docs/BRAND_ASSET_REQUIREMENTS.md`'s wordmark font reference from Cormorant SC to
  Alegreya; the `«ЕГЭ информатика»` subtitle already used `var(--font-ui)`
  (`public-header.module.css`), which now resolves to Golos Text with no component change needed
  — _Depends on:_ F2
- [x] `T3` Update `docs/FRONTEND.md`'s `500`/`600` weight-discipline statement (§6) to record the
  F5 cap: display/heading text never exceeds `500`; `--font-ui`/`--font-data` may still use `600`
  — _Depends on:_ F5

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify

~~~
apps/web/src/app/styles/fonts.css
apps/web/src/app/styles/theme.css
apps/web/src/routes/__root.tsx
apps/web/public/fonts/alegreya/**
apps/web/public/fonts/golos-text/**
apps/web/public/fonts/jetbrains-mono/**
docs/FRONTEND.md
docs/BRAND_ASSET_REQUIREMENTS.md
docs/changes/86-typography-system-rework.md
apps/web/src/shared/components/code-block/code-block.module.css
apps/web/src/shared/components/notation/notation.module.css
~~~

### Do NOT touch

- Lesson/course/task content, mastery logic, progress/storage semantics
- Non-typography visual system (color, spacing, icons, layout/geometry rules)
- Font *role* structure itself (display / reading+UI / data) — only which families fill each role
- `apps/web/src/app/styles/tokens.css` semantic alias names (values only, via F2)

---

## Contracts

See `docs/SPEC.md` §5.3 and `docs/FRONTEND.md` §6/§6.1, and the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](./STACK.md) — this section only records
> change-specific overrides.

None beyond the standard frontend Critical Gate — browser evidence for F4 is mandatory per
`docs/FRONTEND.md` Required Tooling.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The display/heading font originally scoped for this change was `Newsreader`. Live verification
  against Google Fonts' API before any implementation showed Newsreader ships no Cyrillic subset at
  all (a WebSearch-based claim that it did was wrong). A community Cyrillic extension exists
  (`burba.pro/newsreader-cyrillic`, SIL OFL, RU-only) but ships only one weight (no bold) with
  self-reported kerning gaps — insufficient for a weight-driven heading hierarchy. After further
  research into fonts with confirmed live Cyrillic + real bold weight, the architect selected
  `Alegreya` instead. All Backlog items below reflect `Alegreya`, not the originally-scoped
  Newsreader.
- F1 initially missed `apps/web/src/routes/__root.tsx`, which hardcodes `<link rel="preload">`
  hrefs for the exact old font filenames outside `fonts.css`. First browser verification (F4)
  caught this via 8 console 404s; fixed by pointing the 6 preload links at the new
  Alegreya/Golos Text/JetBrains Mono files and re-verified clean.
- JetBrains Mono is shipped as a single variable file (`wght` 100–800) per subset, not the
  two-static-weight pattern (400/700) originally scoped in the Backlog text — this lets existing
  component weight declarations (`600` in the code-block language label, `500`/`600` in the header)
  render their exact requested weight instead of relying on browser weight-matching to the nearest
  shipped static instance. `docs/FRONTEND.md`'s `500`/`600` weight-discipline statement is
  therefore left unchanged, not replaced with `400`/`700` as originally planned.
- No italic files were shipped for Alegreya or JetBrains Mono (matches the precedent of the fonts
  they replace, which also shipped no italic instances); the one italic usage in the codebase
  (code-comment `font-style: italic` in `code-block.module.css`) relies on browser font-synthesis,
  unchanged from before this change.

---

## Commit Message

```
feat(change-86): replace ALCHIMIA font system with Alegreya/Golos Text/JetBrains Mono
```
