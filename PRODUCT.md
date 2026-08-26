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
- The Python course launches incrementally as honest early access. Progress describes only
  currently available lessons and never implies that the developing course is complete.
- Accounts, synchronized progress, hard lesson locks, payments and in-product AI are out of scope.

## Brand Commitments

The product name is `infraege`. Public copy is concise, factual and calm. Existing neutral light
visual language and the binding rules in `docs/FRONTEND.md` remain the design authority.

## Evidence on Hand

Two published Topic lessons, the shared lesson/practice/checker/progress path and the product
readiness audit provide the current implementation evidence. No testimonials, learner outcomes or
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
