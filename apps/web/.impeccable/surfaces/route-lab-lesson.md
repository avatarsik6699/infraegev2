---
version: 1
slug: "route-lab-lesson"
primary_target: "route:/lab/lesson"
related_targets: []
---

# Lesson design lab

- Scope: `/lab/lesson`; unlisted/noindex production-grade design lab, not published content.
- Mode: Read. A Russian-speaking learner must understand why binary search safely removes half
  the candidates and then apply the idea without losing the reading path.
- Direction: Editorial Rail / «Разобранный алгоритм», approved comp
  `../../.impeccable/mocks/lesson-editorial-rail-approved-candidate.png`.
- Memorable moment: three exact array states connect to causal explanations in the adjacent
  margin; the diagram and prose form one argument.
- Grammar: brand-only ruled header, contextual subheader, warm three-column editorial grid, serif
  reading voice, sans/mono interface labels, burnt-orange evidence, minimal container chrome.
- Wide layout: the central argument absorbs available width; outline and marginalia stay capped by
  their content. Proof notes use quiet-paper underlays and short leaders without a vertical divider.
- Density: moderately compact; related content stays tightly grouped while the four major learning
  sections retain stronger separation. Structural rules end only at viewport edges or another rule.
- Outline: four stable groups with lesson-specific child anchors; it is location/hierarchy, not
  completion scoring. Desktop uses a measured semantic HTML/SVG file tree with solid nodes,
  collision-free gapped connectors and an orange current branch without a row underlay. Once the
  rail moves above the article, the same anchors become a plain always-visible nested list without
  SVG geometry.
- Progress: current outline branch, `N / 4` and the thin viewport-edge line communicate reading
  position only. A separate semantic `N / 5` topic-progress block below the outline counts unique
  correct tasks, persists locally and declares mastery at 4/5; hints carry no penalty.
- Subheader: one SSR-safe `Назад к темам` link to `/` plus quiet `№12 · Алгоритмы поиска` context;
  no pseudo-breadcrumb, favourite action or practice shortcut.
- Inventory: shell/header/outline/content/marginalia are semantic HTML/CSS; array states and
  leaders are authored SVG/HTML geometry; code stays semantic text; no runtime raster assets.
- Constraints: full SSR/no-JS reading, visible text alternative, keyboard/focus/reduced-motion,
  local practice state with versioned best-effort local progress, no API/account; critical Literata
  normal subsets preload with metric-adjusted fallbacks and the initial route does not request an
  italic face.
