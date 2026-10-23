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

Learners read and check answers on desktop or mobile without an account. Optional accounts save
successful results on the server; guests do not accumulate saved progress. Lesson/course/standalone
contexts remain separate, and old browser progress is not imported.
Python practice combines on-site prediction and short-answer checks with programs run in a local
Python 3 environment; a named online editor may be offered only as an explicit third-party
fallback.

## Capabilities and Constraints

- Public learning content is SSR/no-JavaScript readable and Russian-only.
- Checker answers stay on the server; the browser never executes untrusted Python code.
- The Python course has 30 lessons in eight modules (Change 175): 27 core lessons from the first
  program to a finished file-analysis program, then three additional lessons (classes, language
  mechanisms, tests) that stay outside course mastery. Since Change 197 the site lesson modules
  are their only source (the lesson-design stand was removed in Change 197); runnable examples replay steps
  recorded by `site_media.py`, never code executed in the browser. Progress is derived from the
  published lessons and current answer revisions and is saved only for signed-in learners.
- The Excel course has 15 lessons in six modules (Change 177): 14 core lessons on the spreadsheet
  mechanisms of tasks 3, 9, 18 and 22, then one additional lesson (tables, conditional formatting,
  pivots, charts) outside course mastery. Its live sheets recalculate edited source cells in the
  browser with an evaluator limited to the course's functions; tasks on the practice workbook
  carry it as an `.xlsx` attachment.
- EGE topic lessons cover every task 1–27 (Changes 184 and 190; 19–21 are one lesson), under the
  short names of the FIPI 2027 variant plan. Each was exported whole from its approved
  lesson-design stand and is edited on the site since Change 197: core subtopics, then advanced
  ones outside mastery where the topic has them, then «Практика и итог» in the course-summary
  form with the topic's mixed bank tasks (Change 197), their data files and the schemes of their
  statements.
- Optional accounts and synchronized progress are implemented. Hard lesson locks, payments and
  in-product AI remain out of scope; enabled sign-in methods depend on deployment configuration.

## Brand Commitments

The public identity is `infraege`: three organic stones, orange at the top and ink below,
with an accessible lowercase wordmark. The presentation is a calm, light "clean textbook":
white reading surfaces, a more colourful home page that invites learners in, and colour elsewhere
only where it carries meaning. Hand-drawn monochrome line illustrations and rare characters
support the material; educational figures remain part of lessons. Light theme only.
Homepage gives direct access to published topics, the Python course and practice; navigation
includes Practice. The visual system lives in [DESIGN](DESIGN.md); implementation contracts live
in [FRONTEND](docs/FRONTEND.md).

## Current scope

All public learning routes, the complete server-owned bank, filters, answer checking, help,
attachments and account-owned server progress remain. Catalog pages offer 10/30/50/100 tasks, default 30, with
inline solving, topic selection and sorting. Detail has one context-preserving return link;
next-task navigation is absent. Unsubmitted drafts survive row collapse but reset on selection,
page changes, leaving or reloading. Labs are removed. Public pages retain an external cookieless
tracker without account/answer data; the analytics stack is outside this application repository.
The publication registry is the current lesson inventory; source-tree publication does not prove
production deployment. Historical decisions and original evidence are recoverable through
[COMPACTED](docs/changes/archive/COMPACTED.md).
