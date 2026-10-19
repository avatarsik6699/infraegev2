# Lesson-design stand — archive

Read-only since Change 197 (architect decision 2026-10-19). The site lesson modules in
`apps/web/src/entities/{lesson,course}/content/` are the only source of the lessons; this folder
keeps the sources the lessons were first written and exported from. Do not edit it and do not
re-export from it. The procedure for lesson changes is
[docs/runbooks/lesson-pipeline.md](../../docs/runbooks/lesson-pipeline.md#сайт--источник-уроков-change-197).

Still read, never written: the bank tests of topics 1, 3 and 18 and the figure builders of
topics 3, 18 and 22 (`topic-{1,3,18,22}`, the book generators `datasets.py`). The lesson data
files moved to `content/lesson-files/`.
