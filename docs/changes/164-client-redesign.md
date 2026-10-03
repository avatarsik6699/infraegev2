# CHANGE 164 — Client redesign

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `164` |
| Slug | `client-redesign` |
| Title | Client redesign: new design system and new UX of key pages |
| Status | `active` |
| Branch | `feature/164-client-redesign` |

---

## Goal

Replace the Change 122/156 minimal visual profile with a stronger design system and new UX of the
key pages, so infraege is the most effective place to study informatics, solve tasks and prepare
for the EGE. Fonts, palette and brand are open for review. Remove process conflicts that degrade
design quality: the competing `frontend-design` plugin, the patchwork visual rules in
`docs/FRONTEND.md`, and the missing `DESIGN.md`. SSR/no-JS, accessibility, layer rules and
authored lesson content stay.

---

## Design References

Direction is chosen visually before app code: F1 builds throwaway static HTML comps per
pilot surface (outside `apps/web`), captured with Playwriter and published as a private Artifact.

Approved full page mockups (v5 "notebook", 2026-10-03; colourful home, calm white pages,
barely visible engineering grid in page heads): [mockups](../artifacts/change-164/mockups/README.md).
Earlier variants v1–v4 were removed. Illustration prompts: [prompts](../artifacts/change-164/illustrations/prompts.md).
Architect taste brief: [references/for_new_design/readme.md](../artifacts/references/for_new_design/readme.md).
Approved direction (2026-10-02): candidate Ж, [zh-docs-textbook](../artifacts/change-164/candidates/zh-docs-textbook/README.md). Variants Ж2–Ж4 were rejected.
Decisions after rounds 1–2 and the brief (2026-10-02):
- Light theme only in the first version; dark and terminal-style looks are anti-references.
- Documentation-style lesson layout is kept: global/topic navigation on the left, content in the
  centre, "on this page" on the right. Small corner radius, quiet separators, large readable
  blocks, clear emphasis hierarchy (italic/underline/weight for terms, links, code); no tiny icons
  inside large blocks.
- The left panel shows the topic and its subtopics for quick movement without returning to the
  topic list. This presumes EGE topics are decomposed into subtopics (see T6).
- Illustrations: hand-drawn monochrome line style for diagrams and schemes, plus rare characters
  (Eduix is the reference; IdeaVault-style colourful cartoons are not).

Decisions on the approved v5 mockups (2026-10-03):
- Fonts follow the mockups: Onest (UI and text), JetBrains Mono (code); Alegreya/Golos are dropped.
  Caveat is limited to hand-written labels inside lesson diagrams.
- Subtopics: in-page anchors (`navLabel`) in this change; real subtopic pages are a separate change (T6).
- Illustrations: neutral placeholders until the architect delivers images generated from
  `illustrations/prompts.md`; integration happens in a follow-up step when they arrive.

---

## Backlog

### Other

- [ ] `T1` Disable plugin `frontend-design` for this project (project `.claude/settings.json` `enabledPlugins`); verify with `/plugin` — _Depends on:_ —
- [ ] `T2` Rewrite `docs/FRONTEND.md` to architecture, a11y, SSR/no-JS, state and functional contracts; drop visual-profile rules (§4, §7, visual parts of §1, §8–§13); point to `DESIGN.md`; move displaced history to the archive — _Depends on:_ F2
- [ ] `T3` Update `PRODUCT.md` Brand Commitments, `docs/SPEC.md` §5 (361–381), line 397 and §10 line 680, and `docs/playbooks/plan.md` (80, 107–121) so they no longer pin the Change 122 minimal profile — _Depends on:_ F1
- [ ] `T4` Make impeccable the single design authority: `docs/playbooks/work.md:162` requires `critique` before and `polish`/`audit` before ship for UI changes; add the Required Tooling row to `docs/STACK.md` — _Depends on:_ T1
- [ ] `T5` Replace `apps/web/tests/brand-control-colors.test.ts` with a token-contract test; relax `apps/web/scripts/verify-design-system.mjs` to theme→token layering — _Depends on:_ F3
- [x] `T6` Architect decision before F7 (2026-10-03: default accepted, anchors now, subtopic pages in a separate change): scope of EGE topic decomposition into subtopics (routes, publication registry, progress, SPEC). Default: this change designs a two-level left panel whose subtopics are the existing lesson sections (`navLabel`) as in-page anchors; real subtopic pages are a separate change — _Depends on:_ F1

### Frontend

- [x] `F1` Direction: impeccable `init`/`shape`/new-work for home, EGE lesson and practice task; three static HTML comps per surface with Playwriter desktop+mobile screenshots and a private Artifact; decide fonts, palette, logo and illustration policy. **Stop for architect approval** — _Depends on:_ T1
- [x] `F2` Generate `DESIGN.md` (`impeccable document`) from the approved direction and `extract` the tokens — _Depends on:_ F1
- [ ] `F3` Rewrite `apps/web/src/app/styles/{theme,tokens,globals,fonts}.css`; if fonts change, redo fallback metrics, preloads, `public/fonts` and the nginx `/fonts/` cache rule; keep CLS ≤ 0.1 — _Depends on:_ F2
- [ ] `F4` Restyle the 45 `shared/components/*` CSS modules and `shared/styles/*`, keeping props and `data-*` hooks — _Depends on:_ F3
- [ ] `F5` Restyle widgets: public-header, public-footer, lesson-outline, lesson-practice-flow, practice-task — _Depends on:_ F4
- [ ] `F6` Home page as a learning entry point — _Depends on:_ F5
- [ ] `F7` Lesson pages (topic-lesson, course-lesson, `lesson-layout.module.css`): reading, outline rail, practice flow, progress. **Architect approval of pilot screenshots** — _Depends on:_ F5
- [ ] `F8` Practice catalog and task solving — _Depends on:_ F5
- [ ] `F9` Courses catalog, Python course overview, topic catalog, account, privacy — _Depends on:_ F7
- [ ] `F10` Update visual-coupled e2e page objects (`course-catalog.page.ts`, `lesson-page.assertions.ts`, `public-header.assertions.ts`, `minimal-application.page.ts`, `account.page.ts`) and layout specs; keep behavior, `@no-js` and axe specs — _Depends on:_ F9
- [ ] `F11` impeccable `critique` + `audit` on pilots and page families, one batched fix round, `polish`; Playwriter desktop+mobile screenshots; axe; Lighthouse on the five audited URLs — _Depends on:_ F10

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
.claude/settings.json
DESIGN.md
PRODUCT.md
docs/FRONTEND.md
docs/SPEC.md
docs/STACK.md
docs/playbooks/plan.md
docs/playbooks/work.md
apps/web/src/app/styles/*
apps/web/src/shared/components/**/*.module.css
apps/web/src/shared/styles/*
apps/web/src/widgets/**
apps/web/src/pages/**
apps/web/tests/brand-control-colors.test.ts
apps/web/scripts/verify-design-system.mjs
apps/web/e2e/pages/*
apps/web/playwright.layout.config.ts
infra/nginx/conf.d/infraege.prod.conf  (only if fonts change)
~~~

### Do NOT touch
- `apps/web/src/entities/*/content/*.lesson.tsx` authored wording and order, unless a
  learning-content API change is explicitly approved with tests.
- Props of `shared/components/learning-content/*` and `Notation`, and `data-*` hooks, unless a task
  migrates them together with their tests.
- `apps/api`, `contracts/`, `content/` and archived changes; `.impeccable/` artifacts.

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with explicit `--full`; release selects affected checks and Release Gate. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

Before ship, run the affected frontend e2e, `test:layout`, `@no-js` and axe specs once, plus
Lighthouse on `/`, `/ege`, `/courses`, `/courses/python` and `/ege/16-rekursiya`.

---

## Implementation Notes

- Branched from clean `main` after Change 163 was shipped and archived (T9 removed by the architect).
- No image generation is available to impeccable here (no native tool, no `OPENAI_API_KEY`); visual
  references come from static HTML comps.

---

## Commit Message

```
feat(change-164): redesign client design system and key pages
```
