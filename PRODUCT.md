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

The public identity is `infraege`: three organic stones, orange at the top and ink below,
with an accessible lowercase wordmark. Retain Alegreya, Golos Text and JetBrains Mono.
The approved presentation is white, monochrome, text-led and minimal, following remote main
`a5b0bf5`; orange is a small functional accent. No background patterns, decorative illustrations,
glints, drawn underlines or idle animation. Educational figures remain part of lessons.
Homepage gives direct access to published topics and the Python course; navigation includes Practice.
See [FRONTEND](docs/FRONTEND.md) for implementation contracts.

## Current scope

All public learning routes, the complete server-owned bank, filters, answer checking, help,
attachments, next task and local progress remain. Catalog pages contain 30 tasks. Unsubmitted
answer drafts are transient. Labs and browser analytics are removed. One Change 122 owns this
pivot; original work is recoverable from `snapshot/pre-minimalism-2026-09-17`.
