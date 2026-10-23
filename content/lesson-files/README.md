# Lesson data files

Files the lesson programs read and the topic bank tasks attach (Change 197), by unit:
`topic-NN/`, `course-python/`. An attached file must be byte for byte the one here
(`apps/api/tests/test_topic_bank_files.py`); a generated `.xlsx` book exists only in the bank.

`topic-3/datasets.py` and `topic-18/datasets.py` generate the books of topics 3 and 18 (moved
here from the removed lesson-design stand, Change 197 T259); the bank tests of those topics and
the figure builders import them, and `--write` puts the `.xlsx` next to them (ignored by git).
