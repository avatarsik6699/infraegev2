# Figure generation brief — graph/table correspondence

## Identity

- Topic: `graphs-and-tables`
- Figure ID / target filename: `graph-degree-correspondence.png`
- Learning goal: learner sees that the number of edges touching a graph vertex equals the number
  of filled cells in the corresponding table row.
- Composition family: comparison + spatial annotation.

## Exact source of truth

- Left card: undirected graph with exactly four circular nodes labelled `1`, `2`, `3`, `4`.
- Exactly four edges: `1–2`, `1–3`, `2–3`, `2–4`.
- Node `2` is the only degree-3 node and is the primary blue highlight.
- Node `4` is the only degree-1 node and remains supporting context.
- Right card: a simplified row-count comparison, not the full distance table. Four horizontal row
  cards labelled `А`, `Б`, `В`, `Г` with connection counts `2`, `3`, `2`, `1` respectively.
- Row `Б` is the only count-3 row and is the same primary blue highlight as node `2`.
- A solid graphite connector between highlighted node `2` and row `Б`, with the exact compact
  label `3 связи = 3 ячейки`.
- No road lengths appear in this conceptual figure. The exact semantic table remains HTML next to
  it and is the source of distance values.

## Visual hierarchy

- Primary concept/highlight: node `2` corresponds to row `Б` because both have three connections.
- Supporting context: the other graph nodes and row counts, reduced saturation.
- Reading direction: left graph → central equality connector → right row-count cards.
- Required direct labels: `1`, `2`, `3`, `4`, `А`, `Б`, `В`, `Г`, `2`, `3`, `2`, `1`,
  `3 связи = 3 ячейки`.
- Elements intentionally omitted: distances, full matrix grid, decorative roads, buildings,
  people, landscape and prose explanation.

## Prompt to send to the image model

Create a clean educational technical comparison diagram on a transparent 16:9 canvas. On the left,
draw one white technical card containing an undirected graph with exactly four circular nodes
labelled 1, 2, 3, 4 and exactly four edges: 1–2, 1–3, 2–3, 2–4. Highlight node 2 in pastel blue;
it is the only node with three edges. Keep node 4 visibly degree 1. On the right, draw one white
technical card with exactly four compact horizontal row cards labelled А, Б, В, Г and the exact
counts 2, 3, 2, 1. Highlight row Б and count 3 in the same pastel blue. Connect node 2 to row Б
with one solid graphite connector and attach the exact label “3 связи = 3 ячейки”.

Use the infraege visual grammar: graphite #5B5F63 rounded outlines, white cards with a short hard
gray shadow down and right, a small L-shaped registration mark in card corners, and blue #A9CCF5
as the only dominant accent. Desaturate supporting context slightly, keep generous negative space,
and attach every short label directly to its object. The drawing must remain clear at 320 px CSS
width. Reproduce every supplied label and edge exactly. Do not add objects, edges, numbers or
explanatory prose.

Output: 16:9, transparent background, 1600×900 px, optimized PNG or WebP, no crop, no watermark.

## Negative prompt

No missing or extra graph edges; no directed arrows; no road lengths; no full matrix table; no
invented or paraphrased labels; no gradients, gloss, photorealism, 3D lighting, neon, buildings,
cars, mascots, decorative icons, crowded layout, detached legend, long paragraphs, illegible
microtext, black background, watermark or cropped shadows.

## Accessibility handoff

- Alt text: `Вершина 2 имеет три ребра и соответствует строке Б с тремя заполненными ячейками.`
- Visible caption: `Степень вершины равна числу заполненных клеток соответствующей строки.`
- Adjacent HTML source of truth: section `theory` in `graphs-and-tables.json`; the semantic road
  table remains a separate native table.

## Human review

- [x] There are exactly nodes `1–4` and edges `1–2`, `1–3`, `2–3`, `2–4`.
- [x] Row counts are exactly `А=2`, `Б=3`, `В=2`, `Г=1`.
- [x] Only node `2` and row `Б` receive the primary blue signal.
- [x] Every Cyrillic/number label is character-perfect and readable at mobile width.
- [x] No distances or invented decorative objects appear.
- [x] The asset is original rather than a reproduction of one reference composition.
- [x] File type, intrinsic `1600×900` dimensions and 500 KiB limit pass validation.

Architect approval recorded on 2026-08-11; the supplied asset is approved for publication in its
current form. Generation-pipeline refinements are deferred to a separate future change.
