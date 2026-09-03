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

ALCHIMIA turns difficult informatics material into complete learning paths: an explanation of why
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

The public identity is `ALCHIMIA`. Archived Change 75 established it on `/lab/design-system`, and
Change 76 activated its system values in public chrome and delivery metadata. Change 79 owns the
remaining public component/widget rollout and evidence-led removal of superseded presentation. The
architect-supplied
`docs/artifacts/references/logo_with_transperant_bg.svg` is its sole artistic authority and must
retain its visible geometry. The approved lab profile stays on white and uses only achromatic text
and structural roles. Any broader palette, including paper or copper accents, remains a later
architect-approved decision. Visual character comes from typography and composition, not atlas
decoration, ornamental frames, extra prose colors, arbitrary type sizes or widespread bold text.
`ALCHIMIA` remains live accessible text beside the mark in a compact reusable header. Public
activation does not copy the lab dashboard composition or change domain behavior; authored lesson
language changes only in separate architect-approved units. Binding rules live in
`docs/FRONTEND.md`.

## Evidence on Hand

Two published Topic lessons, 28 production-published Python CourseLessons, the shared
lesson/practice/checker/progress path and the completed application-gap audit provide the current
implementation evidence. Existing consented
visits/pageviews and path aggregates are sufficient for the current analytics need; event-level
refinement does not block the next planned curriculum step. No testimonials, learner outcomes or
completion benchmarks exist and none may be fabricated.

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
