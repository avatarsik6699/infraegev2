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
tapered, fading linework. The current learning-map iteration deliberately leaves its cards, numbered
stages and background notation unconnected until a semantic trajectory is separately authored.
Reusable domain-agnostic SVG primitives own gradient resources and line/arrow rendering, while a
small SVG pattern preset composes deterministic strokes, labels and nodes inside directional fade
fields. Pattern subject matter, coordinates and responsive placement stay with the consuming page.
The homepage is the first and only migrated consumer in this change. The rejected raster dry-ink
experiment is not part of the product. One complete learning-map SVG preserves its cards, stages
and notation across desktop and mobile. Its wider asymmetric desktop constellation spreads enlarged
cards and notation toward the scene edges without adding connectors; decorative filter overflow is
contained by the home visual boundary and never enlarges the document canvas. The scene fits both
its parent column and available viewport height, switches to width-led fitting when the page stacks,
then scales as one bounded scene on narrow screens without horizontal page overflow.
Unavailable navigation is visually secondary and noninteractive without
status labels; account placeholders and synthetic social proof are absent. The literal «72% курса»
belongs only to the reference illustration and is not learner state. Internal learning layouts keep
their existing structure until separately scoped.
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
