# Visual language — «Экзаменационный атлас»

This is the authoring contract for explanatory figures in infraege. The downloaded images under
`docs/artifacts/design/schemas/` are analysis references, not product assets. New figures must use
the generalized grammar below instead of copying any one reference.

## Purpose

A figure explains one idea that prose alone makes hard to hold in working memory. It is a compact
technical drawing, not decoration and not a replacement for the exact text, table, code or task
statement next to it.

## Invariants

- Transparent canvas; fallback background is paper `#FAF8F3`.
- Main contour: graphite `#5B5F63`, even rounded stroke, visually equivalent to 4–6 px at a
  1200 px-wide export.
- Cards: white or very pale gray, small corner radius, one short offset gray shadow down/right.
- Semantic accents: blue `#A9CCF5` for the active structure, amber `#F2C979` for attention or a
  transition, coral `#E88E94` for an error/contradiction. Use one dominant accent per figure.
- Labels: short uppercase or compact data labels in a condensed monospace style; explanatory
  sentences remain HTML outside the image.
- Registration mark: a small L-shaped graphite line may appear in the top-left of a card. Use it
  consistently and never as random decoration on free-floating text.
- Connectors: graphite straight or gentle curved lines with rounded caps. A dotted colored path
  means an inferred/relative relation; a solid arrow means an explicit flow.
- Context that is not currently discussed is desaturated or reduced in opacity. Highlighting must
  identify exactly one concept or comparison at a time.
- Generous negative space; elements must not touch the export edge or compete with the page text.

## Composition families

1. **Nested layers** — one concept contained by another: box model, memory layers, protocol
   wrapping. Center the smallest unit and use progressively quieter outer layers.
2. **Linear process** — source → transformation → result. Keep one reading direction and put
   labels on nodes, not in a detached legend.
3. **Branching** — one rule produces several outcomes. Use one hub, distinct connector anchors and
   equal visual weight for sibling branches unless one is the current focus.
4. **Comparison** — two or three parallel states with the same internal frame. Differences are
   encoded by accent and structure, not by unrelated illustrations.
5. **Hierarchy** — tree, directory or prerequisite graph. Maintain clear parent/child alignment;
   use a dotted accent only for the path being explained.
6. **Spatial annotation** — a central object with measurements, overlays or labels attached to the
   exact region they describe. Avoid a separate legend when a direct label fits.

Combinations are allowed only when the reading order remains obvious. Common safe combinations are
`nested layers + spatial annotation`, `linear process + branching`, and `comparison + hierarchy`.

## Typography and embedded text

- Prefer numbers, symbols and labels of one to four words.
- Supply every required label verbatim in the generation brief.
- Never ask the image model to typeset paragraphs, code listings or a data table.
- If a generated label differs by one character, reject the asset; do not compensate in alt text.

## Product boundary

- AI-assisted figures: conceptual explanations and static, human-verified graphs.
- Native HTML: exact tables, code, lists and any content whose semantics a browser can expose.
- Code renderer: dynamic or interactive data and legacy content only.
- The adjacent HTML explanation is the source of truth. A learner must not need pixels alone to
  recover the task's facts.

## Asset requirements

- Final format: optimized PNG or WebP.
- Maximum file size: 500 KiB per figure.
- Export at least 1200 px on the longest side; preserve a readable mobile rendition at 320 px CSS
  width.
- Store under `/content/topics/{topic-id}/{descriptive-slug}.{png|webp}` in the web public assets.
- Record intrinsic `width` and `height` in content data to prevent layout shift.
- Every figure has concise alt text and an optional visible caption. Complex facts belong in the
  adjacent prose, not an oversized alt attribute.

## Rejection checklist

Reject a result with any invented/missing node, edge, number or label; ambiguous arrow direction;
cropped shadow; opaque black background; gradient/gloss/3D lighting; photorealistic objects;
decorative mascots; excessive rounded blobs; illegible microtext; multiple competing accents;
watermark; or visual similarity that reads as a copy of a single reference rather than this shared
grammar.
