# Raster illustration masters — Change 155

Ten user-supplied source PNGs were edited individually using the built-in `image_gen` tool with true transparency. After acceptance, the original PNGs were deleted at the architect's explicit request; the accepted masters in this directory and production WebP derivatives are retained. Each call received its source as the edit target, the generated topic-26 image as the line-style reference, and the approved topic-16 raster as the mathematical-lettering reference. Topic 26 was generated first from its source with topic 16 as the reference.

Approved topics 5 and 16 were rasterized from the existing SVGs at 1440×880 without redesign. Production derivatives are lossless transparent WebP at 576×312, displayed on a 192×104 logical canvas. The ten generated diagrams are fitted within 184×92 logical pixels; topics 5/16 preserve their approved 144×88 logical scale inside the shared canvas. Centering and aspect-ratio preservation keep catalog text independent of the drawing.

## Shared generation prompt

```
Use case: style-transfer. Asset: high-quality raster educational diagram for a white, monochrome Russian exam-topic catalog, rendered at around 192x104 CSS pixels. Image 1 is the exact composition and content to preserve. Image 2 is the approved mathematical style reference. Edit Image 1 only: unify the ink color to near-black #090b0c, match Image 2's restrained mathematical lettering and medium-fine strokes with slightly organic pen quality. Use consistent line weight equivalent to about 1.4 pixels at 192px display width; no bold brush outlines, no faint gray strokes. Preserve EVERY element, count, exact label, number, arrow direction, connection and relative placement in Image 1. Keep the full complex composition; no simplification, omissions or additions. Improve clean anti-aliasing and readable details. Genuine transparent background; no white matte, checkerboard drawn into pixels, frame, shading, texture, gradients, glow, background or watermark. Center the complete drawing with modest margins, keeping its original aspect ratio. Single diagram only, no catalog number/title. Produce a large high-resolution raster master at the highest available quality, ideally at least 1536px wide, landscape approximately 1.85:1. Do not create SVG or a vector file.
```

Additional instruction for calls after topic 26: `Image 3 supplies the fine serif-italic mathematical lettering; preserve that lettering character consistently.`

## Per-image constraints

### 1 — information-models

Keep the diamond graph at left with exactly 4 nodes labelled 1 at top, 2 at left, 3 at right, 4 at bottom; keep its edge connections. Keep the 5x5 adjacency table at right. Header row: blank,1,2,3,4. Rows: 1,0,1,1,0 / 2,1,0,1,1 / 3,1,1,0,1 / 4,0,1,1,0. Preserve this exact arrangement and all table digits.

### 13 — branching-and-enumeration

Keep exactly 3 monitors on the same bus network above, with a node underneath each monitor, and below four IP-address boxes reading exactly 192 . 168 . 1 . 0. Preserve positions, connections and relative proportions. Thin monitor outlines, all digits use consistent mathematical serif lettering.

### 17 — number-sequences

Keep exactly four digits reading '3 8 5 2' left-to-right and a single lower curly brace grouping the middle digits 8 and 5 only. Use the same fine mathematical italic-serif digit style as Image 3, replacing only the uneven thick original lettering. No extra symbols or labels.

### 19_21 — winning-strategy

Keep top pile with exactly 3 oval stones; arrow down-left to pile4 stones labelled '+1', arrow down-right to pile6 stones labelled '×2'. Keep the same triangular composition and exact stone counts. Use fine outlines with restrained diagonal hatching, no heavy fill.

### 22 — parallel-computing

Preserve the exact original Gantt/process dependency composition, all bars, arrows and letters A,B,C and the time-axis t. No added stages, no omitted connectors; copy relative positions faithfully. Make all lines consistent medium-fine and labels legible.

### 23 — graph-analysis

Keep original directed graph with circle nodes 2 at left,3 above middle,5 below middle,10 at right. Preserve EVERY existing arrow, connection and its exact '+1' or '×2' label as seen in the source, with their original directions and relative positions. No invented edges or mathematical labels.

### 24 — string-processing

Keep exactly 'A B C A A B' in that order and four fine corner brackets selecting the first 3 letters ABC only. Mathematical italic-serif letters consistent with Image3, replace thick marker lettering only.

### 25 — integer-processing

Keep mask text exactly '1?2*' at top, four diagonal downward connectors and digits '2 3 4 6' at bottom in original order. Mathematical italic-serif characters consistent with Image3, same fine pen stroke as Image2. No new arrows, no changed digit or star.

### 27 — data-analysis

Keep exactly3 clusters in original triangular arrangement,6 point dots and one cross center in each, with dashed irregular closed outlines. Preserve exact dot counts and positions seen in source; no extra points. Use medium-fine outlines with small restrained dot fills so this feels no darker than Image2.

### 26 — array-processing

Keep five ascending bars, diagonal hatching only in bars 2 and 4, with one checkmark above each of these two bars. Preserve original composition and relative positions.

## Fidelity review

Compare every diagram with its source on a white background before acceptance: digits, labels, graph edges, mask symbols and selection brackets. The source for topics 19–21 depicts three stones in the upper and lower-left piles and six on the right; the generated result retained these source counts despite the prompt's lower-left four-stone request. Source composition takes precedence; this catalog illustration is not a lesson exercise or arithmetic specification.


Topic 27 was compared by point count: its source has seven points in the upper cluster and six in each lower cluster; the generated result preserves these counts despite the prompt's six-point wording.

The first topic-24 result was too bold. A single-change follow-up retained all letters and corners while requesting approximately half-thickness strokes and light Computer Modern mathematical italic lettering. This refined PNG is the accepted master.

### Accepted follow-up prompt — topic 17

```
Use case: precise style-transfer. Edit Image 1 only. It is a transparent raster catalog diagram. SINGLE CHANGE: make the numeral strokes approximately HALF as thick as current, matching the delicate light-weight mathematical italic serif lettering in Image 2 (approved string diagram). Use the same font family/character as Image2. Keep EVERY digit/symbol, exact text, original scale, original positions, curved brace or connecting lines, full composition and alpha background identical. Do not shrink the drawing to lighten it. Preserve original lettering heights. No bold, chunky brush, calligraphy, gray, shadows, white matte or new elements. Near-black ink #090b0c with clean antialias, true transparent background. Highest quality high-resolution PNG raster, landscape around1705x922. Content invariant: Keep exactly four digits reading '3 8 5 2' left-to-right and a single lower curly brace grouping the middle digits 8 and 5 only. Use the same fine mathematical italic-serif digit style as Image 3, replacing only the uneven thick original lettering. No extra symbols or labels.
```

### Accepted follow-up prompt — topic 24

```
Use case: style-transfer. Asset: high-quality raster educational diagram for a white, monochrome Russian exam-topic catalog, rendered at around 192x104 CSS pixels. Image 1 is the exact composition and content to preserve. Image 2 is the approved mathematical style reference. Edit Image 1 only: unify the ink color to near-black #090b0c, match Image 2's restrained mathematical lettering and medium-fine strokes with slightly organic pen quality. Use consistent line weight equivalent to about 1.4 pixels at 192px display width; no bold brush outlines, no faint gray strokes. Preserve EVERY element, count, exact label, number, arrow direction, connection and relative placement in Image 1. Keep the full complex composition; no simplification, omissions or additions. Improve clean anti-aliasing and readable details. Genuine transparent background; no white matte, checkerboard drawn into pixels, frame, shading, texture, gradients, glow, background or watermark. Center the complete drawing with modest margins, keeping its original aspect ratio. Single diagram only, no catalog number/title. Produce a large high-resolution raster master at the highest available quality, ideally at least 1536px wide, landscape approximately 1.85:1. Do not create SVG or a vector file. Image 3 supplies the fine serif-italic mathematical lettering; preserve that lettering character consistently. Keep exactly 'A B C A A B' in that order and four fine corner brackets selecting the first 3 letters ABC only. Mathematical italic-serif letters consistent with Image3, replace thick marker lettering only. CRITICAL SINGLE CHANGE: existing letters in Image 1 are too bold. Make their strokes about HALF as thick, matching light Computer Modern mathematical italic lettering and the delicate reference Image 3. Keep all six letter sizes, positions, proportions and selection corners identical. Hairline/light weight, never bold, no solid chunky calligraphy. The drawing must look as light as the bar outlines in Image 2 at small display size.
```

### Accepted follow-up prompt — topic 25

```
Use case: precise style-transfer. Edit Image 1 only. It is a transparent raster catalog diagram. SINGLE CHANGE: make the numeral strokes approximately HALF as thick as current, matching the delicate light-weight mathematical italic serif lettering in Image 2 (approved string diagram). Use the same font family/character as Image2. Keep EVERY digit/symbol, exact text, original scale, original positions, curved brace or connecting lines, full composition and alpha background identical. Do not shrink the drawing to lighten it. Preserve original lettering heights. No bold, chunky brush, calligraphy, gray, shadows, white matte or new elements. Near-black ink #090b0c with clean antialias, true transparent background. Highest quality high-resolution PNG raster, landscape around1705x922. Content invariant: Keep mask text exactly '1?2*' at top, four diagonal downward connectors and digits '2 3 4 6' at bottom in original order. Mathematical italic-serif characters consistent with Image3, same fine pen stroke as Image2. No new arrows, no changed digit or star.
```

Topics 17 and 25 received the same final light-stroke follow-up, using accepted topic 24 as the lettering-style reference. The digits, mask, brace and connector placement were retained.
