# Product

<!-- impeccable:product-schema 1 -->

`docs/SPEC.md` remains the canonical product and system contract. This file records the durable
product truths needed by frontend design work without replacing that specification.

## Platform

web

## Users

Russian-speaking secondary-school learners preparing for the informatics EGE. The first Python
course is designed for a learner who knows school mathematics but has never programmed before.

## Product Purpose

infraege turns difficult informatics material into complete learning paths: an explanation of why
an idea works, guided examples, immediate practice, useful feedback and a truthful next step.
Success means a learner can apply the idea independently rather than memorize a task template.

## Positioning

Exam topics and mini-courses are independent, self-contained learning products. A mini-course may
prepare broadly useful skills without duplicating or depending on an EGE topic; semantic links are
introduced only when the authored material proves that relationship.

## Operating Context

Learners read on desktop or mobile without an account. Progress is optional browser-local state.
Python practice combines on-site prediction and short-answer checks with programs run in a local
Python 3 environment; a named online editor may be offered only as an explicit third-party
fallback.

## Capabilities and Constraints

- Public learning content is SSR/no-JavaScript readable and Russian-only.
- Checker answers stay on the server; the browser never executes untrusted Python code.
- The Python course has a complete 28-step path from the first program to one terminal task
  manager. All lessons are published in production. Progress is derived from the
  published lessons and remains optional browser-local state.
- Every public curriculum row names a concrete learning outcome and links to its published lesson;
  future curriculum expansion must not appear as available before its own approval.
- Accounts, synchronized progress, hard lesson locks, payments and in-product AI are out of scope.

## Brand Commitments

The public identity is `infraege`: three organic stones, with the small upper stone in orange and
the two lower stones in ink, paired with a live accessible lowercase wordmark. The architect-approved
artistic authority is `docs/artifacts/references/infraege-mark.svg`; the visual direction comes from
`docs/artifacts/references/base.jpg` and `docs/artifacts/references/main-page.png`. The active palette
is warm paper, ink, one muted text level and a restrained orange accent. Orange identifies the mark,
primary routes and selected illustration details; it does not recolor ordinary prose or semantic
feedback.

The selected typography remains unchanged: Alegreya for display and wordmark, Golos Text for
reading and interface text, and JetBrains Mono for code, data and formula notation. The homepage is
the first reference-led composition: a direct product statement and real mini-course CTA on the
left, plus a non-interactive learning map on the right. Alegreya is reserved there for the live
wordmark and product statement; the expanded subtitle, benefit line and statement lead use Golos
Text. The lockup/navigation separator is intentionally faint. Authored SVG geometry gives the CTA
tapered, fading linework. The learning map connects its cards, numbered stages and background
notation through a selective, non-crossing semantic trajectory: solid stage curves, dashed card
arrows, quiet theory-to-pattern routes and one practice-to-theory return loop. Reusable
domain-agnostic SVG primitives own multitone gradient resources and line/arrow rendering, while a
small SVG pattern preset composes deterministic strokes, labels and nodes inside directional fade
fields. Pattern subject matter, coordinates and responsive placement stay with the consuming page.
The hero extends that vocabulary into a full-page perspective grid with distributed code/graph
notation and quiet traveling light fading toward the public chrome,
with a clean reading area and bounded paper depth. Text and map occupy independent desktop columns;
desktop scales the scene to the viewport height while narrow/reflow screens scroll naturally. One SVG canvas retains its card/stage content and recomposes it
into a taller, enlarged alternating route on mobile, with CSS-selected connector geometry before
hydration. The 12-second choreography leads through the main path during seconds 0–4, answers with
branches and contour light during seconds 4–7, then rests. Enlarged engraved cards have distinct depth offsets while attached route
deformation stays coordinated. Main-route stages, text and progress remain stationary; only satellite cards drift, while the
background retains its quiet independent motion;
cards retain similar but varied dimensions, clear surfaces and original planar rotations.
Compact satellite cards contain 88-unit icons and reduced padding. Their flat surfaces have no shadow or thickness and share very faint paper texture with distinct arc, dot, woven-loop and contour
patterns. Compact stage numerals, titles and vertically centered checks retain clear spacing. A single paper progress disc
has a clean interior without decorative texture/patterns and a thin track and arc on the perimeter, with a
large centered orange «72%» and no caption. The original
statement «Информатика - это система» leads into one standard arrow link «Начать готовиться» to `/ege`. Ambient
layers fade completely at chrome boundaries. Reduced motion, no-JS, offscreen and hidden-document states preserve
the complete static composition or pause the mounted effects without restarting them.
The `/ege` catalog uses equal-height single-cell cards with one shared 58:42 media/content
layout, faint grain and varied engraving. Missing illustrations use a neutral book placeholder.
Number labels sit over the artwork; two-line titles and full source descriptions displayed as up to two compact lines with an ellipsis align
across cards. Published artwork has slight bounded overflow; only an 8px edge band fades into paper. The bottom row holds
the published action; planned status sits beside the number over the artwork. The field uses distributed quiet motifs and soft 24-second
illumination instead of vertical orange routes; published cards retain a single frame glint.
Its 25 topics retain exam order in three/two/one columns.
The `/courses` cards use the same image-first composition: an asymmetric desktop mosaic with advanced problems above algorithms on the right,
Excel in the wide closing card, and a single column on mobile,
region-filling artwork with slight overflow, quiet metadata labels above, separated title/summary/action below, faint
grain, varied patterns and original corner arcs, with restrained silver-neutral gradients and
once-only soft material glints. Only Python has a link and hydrated personal progress.
Static image bounds hold before hydration and without JS; decorations never overlap descriptions
or links.
The complete exam map stays linear instead of reusing the homepage illustration. The rejected
raster dry-ink experiment is not part of the product.
Unavailable navigation is visually secondary and noninteractive without
status labels; account placeholders and synthetic social proof are absent. The illustrative circular «72%» dial
belongs only to the reference illustration and is not learner state. Internal lesson and course
layouts preserve their learning structure. `/courses` and `/courses/python` are the reusable
visual references for future modules: engineering fields, paper depth, gradients, artwork and
light also belong inside learning and working surfaces when readability and input remain clear.
Change 103 demonstrates learning/form compositions in the lab; existing lessons adopt them only
through later scoped work. Shared primitives supply mechanics while each page owns composition.
The design-system lab demonstrates the active production components without its own theme.
ALCHIMIA remains archived design evidence. Binding rules
live in `docs/FRONTEND.md`.

## Evidence on Hand

Two published Topic lessons, 28 production-published Python CourseLessons, the shared
lesson/practice/checker/progress path and the completed application-gap audit provide the current
implementation evidence. Existing consented
visits/pageviews and path aggregates are sufficient for the current analytics need; event-level
refinement does not block the next planned curriculum step. No testimonials, learner outcomes or
completion benchmarks exist and none may be fabricated.

Product capability and brand statements describe the current source tree, not an inferred deploy.
Local `main`, `origin/main` and production may legitimately differ between releases; the deployed
SHA is authoritative only when read from `/health/ready` and the matching release evidence.

## Product Principles

- Understanding before memorized patterns.
- One complete learner outcome per incremental release.
- Independent courses and exam topics; relationships require real pedagogical evidence.
- Progressive enhancement with truthful SSR and local-only learner state.
- Human content and visual approval before publication.

## Accessibility & Inclusion

Public learning paths remain keyboard-operable, readable through 150% browser zoom and narrow
mobile layouts, and complete without JavaScript. Required information never depends on color,
hover or animation alone.
