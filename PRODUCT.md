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
  manager. All lessons have passed publication approval; current deployment is verified separately. Progress is derived from the
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

Typography, page recipes, component roles and asset delivery are defined only in
[FRONTEND](docs/FRONTEND.md). The public homepage statement is «Информатика - это система»
and «Начать готовиться» leads to `/ege`. Planned content/navigation remains noninteractive;
no synthetic social proof or account controls are introduced. The illustration's «72%» is
not learner progress. The lab demonstrates the same supported primitives and study defaults
as production. Historical ALCHIMIA and raster experiments are not alternate active profiles.

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
