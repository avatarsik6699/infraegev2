---
name: infraege Editorial Rail
description: Warm editorial learning surfaces where diagrams and prose form one argument.
colors:
  accent: "#bd4326"
  accent-deep: "#98371f"
  accent-soft: "#f8e4d8"
  paper: "#f8f6f1"
  surface: "#fbfaf7"
  surface-quiet: "#f1eee7"
  ink: "#211f1c"
  ink-soft: "#3f3a34"
  muted-ink: "#716b63"
  rule: "#dcd6cc"
  rule-strong: "#c8c0b4"
  success: "#496f43"
  code: "#24211d"
  code-text: "#eee8df"
typography:
  display:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "clamp(2.6rem, 3vw, 3.25rem)"
    fontWeight: 620
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  display-mobile:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "clamp(2.05rem, 9.2vw, 2.55rem)"
    fontWeight: 620
    lineHeight: 1.04
  section:
    fontFamily: "SFMono-Regular, Consolas, monospace"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.4
  subsection:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "clamp(1.2rem, 1.45vw, 1.45rem)"
    fontWeight: 600
    lineHeight: 1.24
  body:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.62
  summary:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.62
  brand:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "1.58rem"
    fontWeight: 680
    lineHeight: 1
  proof-index:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 400
    lineHeight: 1
  interface:
    fontFamily: "Onest Variable, Onest Fallback, Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  outline-heading:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.35
  outline-parent:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "0.96rem"
    fontWeight: 650
    lineHeight: 1.35
  outline-child:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "SFMono-Regular, Consolas, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.5
  notation:
    fontFamily: "SFMono-Regular, Consolas, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.5
  compact:
    fontFamily: "SFMono-Regular, Consolas, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.5
  visual-alternative:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: 1.6
  array-mobile:
    fontFamily: "Literata Variable, Literata Fallback, Georgia, serif"
    fontSize: "0.65rem"
    fontWeight: 400
    lineHeight: 1
rounded:
  focus: "0.15rem"
  xs: "0.2rem"
  sm: "0.35rem"
  md: "0.45rem"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.875rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "3rem"
  section-break: "clamp(2.25rem, 3vw, 3rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0.72rem 1.25rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.72rem 0.85rem"
---

# Design System: infraege Editorial Rail

## Overview

**Creative North Star: "Разобранный алгоритм"**

The interface behaves like a carefully annotated lesson sheet: warm paper, ruled structure, strong reading typography, and compact technical notation. Diagrams are not decorative illustrations; they sit beside causal prose and carry equal explanatory weight.

The system is calm but not bland. Burnt orange marks evidence, active location, and primary action; most of the page remains ink, paper, and rules. Card-dashboard composition is the confirmed anti-reference.

**Key Characteristics:**

- A bounded outline, expanding central proof, and content-sized marginalia sharing one editorial field.
- Literata for the lesson voice; Onest and mono labels for interface and data.
- A hierarchical lesson rail and diagram-to-marginalia leaders as signature patterns.
- Full reading order and visible text alternatives survive without JavaScript.

## Colors

The palette is warm paper and dark ink with one restrained burnt-orange voice.

### Primary

- **Evidence Orange:** marks the active rail node, proof leaders, selected cells, and primary actions.
- **Deep Evidence:** provides accessible small text, hover, and feedback emphasis.
- **Washed Evidence:** supports selected cells and metadata without competing with prose.

### Neutral

- **Lesson Paper:** the uninterrupted reading field.
- **Quiet Paper:** active navigation rows, inline code, and subtle separation.
- **Editorial Ink:** all primary reading text and headings.
- **Muted Ink:** metadata and secondary explanation that must remain readable.
- **Hairline / Structural Rule:** separate regions and encode hierarchy; never imitate a card border.

**The One Voice Rule.** Orange is evidence and action, not general decoration.

## Typography

**Display Font:** Literata Variable (metric-adjusted serif fallback)  
**Body Font:** Literata Variable (metric-adjusted serif fallback)  
**Interface Font:** Onest Variable (metric-adjusted sans fallback)  
**Label/Mono Font:** SFMono-Regular (Consolas fallback)

**Character:** The serif voice makes explanations feel authored and durable; sans and mono text keep navigation, metadata, and code exact.

### Hierarchy

- **Display:** compact two-line lesson thesis on desktop; balanced wrapping, tight leading.
- **Section heading:** a compact orange mono `§ 1 · ТЕОРИЯ` label representing one of the four stable learning stages; content-derived topics step down to smaller muted serif `h3` claims.
- **Body:** readable measure of 62–68 characters and compact-comfortable 1.62 leading.
- **Label:** compact mono metadata and diagram notation; uppercase only for genuinely structural labels.

**The Structural Heading Rule.** A major section opens with one compact semantic `h2`, combining its numbered learning-stage marker and label rather than stacking a decorative eyebrow over a duplicate title. The marker stays silent to assistive technology; the visible section label remains its accessible name.

### Loading

- Preload only the Cyrillic and Latin normal Literata subsets used by the initial lesson thesis.
- Keep Literata on `swap` with a metric-adjusted serif fallback; load Onest as `optional` with a metric-adjusted sans fallback.
- Do not request an italic face for mathematical variables: use upright semantic `var` notation.
- The initial lesson route loads at most four font resources and must keep font-induced CLS at or below 0.1 on the verified slow-network profile.

## Layout

Desktop lesson surfaces use two full-width ruled headers followed by three coordinated roles: a capped hierarchical outline with topic progress beneath it, a central argument capped at 68rem, and content-sized marginalia capped at 16rem. The center absorbs available wide-screen space up to that readable/diagram limit; side regions never consume leftover width. No vertical rule separates the proof from its notes: short leaders, a local figure purpose and quiet-paper underlays provide grouping only where the causal notes appear. The left rail spans the complete article while its navigation/progress stack remains sticky. Navigation follows the current visible section or subtopic and labels the current major section as `N / 4`; the separate topic progress counts only correctly solved tasks. A 2px viewport-edge reading-position line may show continuous article travel but is decorative and never implies completion. The desktop file tree uses measured SVG connectors behind semantic HTML links; when the rail moves above the article at 72rem and below, the same source-order links become a plain always-visible list without tree geometry while progress remains visible in flow. Every child link names and targets a visible `h3`; invisible placeholder anchors are not navigation. Practice spans the center only: one active task carries compact contextual links to its relevant theory fragments rather than creating a second marginal card, fifth lesson section or outline scale. Use a three-level proximity rhythm: related content stays within 0.5–1.25rem, theory subtopics separate by about 2rem, and each new major learning section is distinguished by 2.25–3rem of whitespace before it and 1.25rem after it. Do not add rules between the intro, visual, subtopics, visual steps, practice prompt, or major sections; semantic headings and proximity carry this hierarchy. Rules remain only where they describe application structure or data geometry, such as the viewport-spanning shell, outline rail, array cells, form controls, the practice tabs and the compact topic-progress track.

## Elevation & Depth

The system is flat by default. Hierarchy comes from type, ruled boundaries, tonal paper shifts, and connector geometry; shadows are not part of the surface vocabulary.

**The Ruled-Paper Rule.** Use a hairline or tonal shift before introducing a raised container.

## Shapes

Reading and diagram geometry stays square or gently rounded. Small radii belong to inputs, code, and active rows; pill geometry is reserved for compact metadata and actions. Circular nodes communicate position in a path and must retain clear gaps around connector lines.

## Components

### Buttons

- **Primary:** burnt-orange pill with high-contrast text; one dominant action per local header or form.
- **Secondary:** transparent outlined pill using dark ink.
- **Focus:** visible orange outline plus a soft focus ring; never rely on color alone.

### Chips

- Compact mono labels with a hairline border; only difficulty uses washed evidence fill.

### Inputs / Fields

- Flat light surface, structural border, small radius, and the shared visible focus treatment.

### Navigation

- The ruled site header contains only the `infraege` home link. Its wordmark keeps `infra` in the editorial serif and sets `EGE` as compact orange UI lettering with one evidence line; do not add placeholder navigation or account chrome before those product routes exist.
- The lesson outline is a semantic nested list whose labels stay inside the same links as their nodes. Desktop renders solid unoutlined SVG nodes and one measured connector layer in a file-tree hierarchy; every path stops with visible clearance before a node and never crosses one.
- The current child, its parent and their connecting path use evidence orange with a weight change, never a row underlay. Only the exact current link receives `aria-current`; the highlighted ancestry communicates location rather than completion.
- When the outline leaves its desktop rail, hide the SVG geometry and keep an always-visible compact nested list: two columns on intermediate widths and one column below 52rem. No-JS preserves the complete list even when decorative connectors are unavailable.
- The ruled subheader contains one explicit `Назад к темам` link and quiet lesson context; it never mixes a back link with pseudo-breadcrumb text or unrelated lesson actions.

### Progress

- Keep location and learning evidence separate. The outline branch, `N / 4` counter and top reading-position line answer “where am I?”; they never mark content complete.
- Topic progress answers “what have I solved?” with a native semantic progress element, `N / 5` copy and mastery status. Correct assisted answers count, incorrect attempts do not subtract, and 4/5 is mastered.
- Topic progress shares the sticky left rail with the outline on desktop and remains visible in normal flow on intermediate/mobile layouts. Do not duplicate it in marginalia or under the outline with a second navigation scale.

### Practice Tabs

- Keep the four lesson sections linear. Practice uses one compact horizontal five-tab strip inside its section and never extends Lesson Outline.
- Show one active task after hydration while keeping every form mounted so drafts, feedback and native disclosure state survive manual task switches. Every new page load starts at task one; completion never locks navigation or advances automatically.
- Communicate rising complexity redundantly but quietly: the shallow tab surfaces intensify from one to five, a small five-bar glyph fills progressively, and every tab names its level. Active and solved states remain legible through semantics and copy without relying on color.
- Use the WAI-ARIA tablist/tab/tabpanel relationship with automatic activation because every panel is already mounted. Arrow keys wrap across adjacent tabs; Home and End move to the first and last task.
- After a correct answer, keep the explanation visible and offer an explicit next-task action; the last task links to Result. Beside every task heading, show a compact `К теории` navigation containing one or more direct fragment links; do not add a separate support card or disclosure.
- SSR/no-JS hides the inert tablist and exposes all tasks, hints and theory links in sequence. The persisted topic progress still stores solved task IDs only; active task and draft answers are session-local.

### Learning Visual Frame

- A semantic figure pairs a purpose-bearing caption, authored proof geometry, and a visible text alternative. Desktop leaders attach each proof state to a nearby quiet-paper note capped at 16rem; mobile places the same note immediately below its state.

## Do's and Don'ts

### Do:

- **Do** make the diagram and prose one continuous argument.
- **Do** preserve nested rail semantics and source order at every breakpoint.
- **Do** use self-hosted Cyrillic fonts and retain no-JS reading.
- **Do** keep dividers and connector paths optically quiet and spatially precise.
- **Do** let the explanatory center absorb wide-screen growth while marginal notes stay compact.

### Don't:

- **Don't** turn lessons into dashboards of rounded cards.
- **Don't** use decorative kickers, gradients, or shadow stacks to manufacture hierarchy.
- **Don't** separate a proof from its explanation with long or overlapping leaders.
- **Don't** use a vertical divider to manufacture a separate marginalia column.
- **Don't** use the accent as a general-purpose text color.
