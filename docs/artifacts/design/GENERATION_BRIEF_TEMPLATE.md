# Figure generation brief — template

## Identity

- Topic:
- Figure ID / target filename:
- Learning goal: one sentence describing what the learner understands after viewing the figure.
- Composition family: one of the six families from `VISUAL_LANGUAGE.md`, plus an optional safe
  combination.

## Exact source of truth

List every object, relation, number and required label. This section is authoritative and must be
checked independently of the generated image.

## Visual hierarchy

- Primary concept/highlight:
- Supporting context:
- Reading direction:
- Required direct labels:
- Elements intentionally omitted:

## Prompt to send to the image model

Create a clean educational technical diagram on a transparent canvas. [Describe the exact
composition and source-of-truth data.] Use the infraege visual grammar: graphite #5B5F63 rounded
outlines, white cards with a short hard gray shadow down and right, a small L-shaped registration
mark in card corners, and one dominant semantic pastel accent. Use blue #A9CCF5 for the active
structure, amber #F2C979 only for attention/transitions, and coral #E88E94 only for an
error/contradiction. Keep generous negative space and attach each short label directly to the
object it describes. The drawing must remain clear at 320 px CSS width. Reproduce all supplied
labels and relations exactly. Do not add any objects or explanatory prose.

Output: [aspect ratio], transparent background, at least [dimensions] px, optimized PNG or WebP,
no crop and no watermark.

## Negative prompt

No invented or omitted objects, edges, numbers or labels; no paraphrased text; no gradients,
gloss, photorealism, 3D lighting, neon, mascots, decorative icons, crowded layout, detached legend,
long paragraphs, illegible microtext, black background, watermark or cropped shadows.

## Accessibility handoff

- Alt text:
- Visible caption, if needed:
- Adjacent HTML passage that remains the source of truth:

## Human review

- [ ] Every object and relation matches the exact source of truth.
- [ ] Every label and number is character-perfect.
- [ ] The highlighted element is the concept discussed by adjacent text.
- [ ] Nothing decorative or redundant was introduced.
- [ ] The asset is original and does not reproduce a reference composition verbatim.
- [ ] It remains legible at desktop and 320 px CSS width.
- [ ] File type, intrinsic dimensions and 500 KiB limit pass validation.
