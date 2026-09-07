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
The hero extends that vocabulary into one low-contrast page-local ambient SVG field behind its
statement and map without entering the header or footer. A fading orthogonal engineering grid spans
the full main-page canvas and recedes progressively toward both chrome edges; its grid, calibration
marks and notation remain neutral and static, with local soft relief beneath the map's authored
patterns to prevent both structures accumulating contrast. After hydration,
decorative overlay strokes carry two restrained moving impulses through existing connections;
longer, clearly visible surface-border gradients use each surface's own neutral or active accent
border color and appear in deterministic offset cycles so the scene feels irregular without
causing SSR drift. The static composition remains complete, while reduced motion, an offscreen hero
or a hidden document keeps the overlays stopped. The homepage remains the visual source and
`/ege` is the second migrated consumer: it carries the same expanded identity on one uninterrupted
warm engineering canvas. Its full-page grid, restrained orange route impulses and substantial
paper topic surfaces begin with the compact catalog title and one separated metadata line for the
topic count and FIPI source, leaving the heading's right side available for future real controls.
The two published topics use their supplied transparent conceptual illustrations aligned to an
upper media section with exam-number context and topic copy. Only the artwork may cross the
card's top/right edge, and then by a restrained few pixels without covering adjacent content; the
single clipped surface keeps matching corner radii, a separate action footer and the same contained
lower-right decorative number used by the complete map. Planned cards remain opaque, while their
neutral frame, quieter type, reduced depth, absent action and shared «Скоро» badge communicate that
they are not yet available.
The complete exam map stays linear instead of reusing the homepage illustration. The rejected raster dry-ink
experiment is not part of the product. One complete learning-map SVG preserves its cards, stages
and notation across desktop and mobile. Its wider asymmetric desktop constellation spreads enlarged
cards and notation toward the scene edges; decorative filter overflow is
contained by the home visual boundary and never enlarges the document canvas. The scene fits both
its parent column and available viewport height, switches to width-led fitting when the page stacks,
then scales as one bounded scene on narrow screens without horizontal page overflow.
Unavailable navigation is visually secondary and noninteractive without
status labels; account placeholders and synthetic social proof are absent. The literal «72% курса»
belongs only to the reference illustration and is not learner state. Internal lesson and course
layouts keep their existing structure until separately scoped.
The former ALCHIMIA lab is historical design evidence, not the active public brand. Binding rules
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
