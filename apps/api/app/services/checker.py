"""Answer-checking and normalization — docs/SPEC.md §11.1.

Normalization is applied to both the submitted answer and every `answer_variants` entry
before comparison: trim/collapse whitespace, case-insensitive, ё/е folding, and numeric
comma/dot equivalence for `numeric_tolerance` tasks.
"""

from __future__ import annotations

import re

from app.schemas.task import Task

_WHITESPACE_RE = re.compile(r"\s+")


def _normalize_text(value: str) -> str:
    value = value.strip().lower()
    value = _WHITESPACE_RE.sub(" ", value)
    return value.replace("ё", "е")


def _parse_numeric(value: str) -> float | None:
    candidate = value.strip().replace(",", ".")
    try:
        return float(candidate)
    except ValueError:
        return None


def is_correct(task: Task, answer: str) -> bool:
    if task.checker_type == "numeric_tolerance":
        submitted = _parse_numeric(answer)
        if submitted is None:
            return False
        tolerance = task.numeric_tolerance or 0.0
        for variant in task.answer_variants:
            target = _parse_numeric(variant)
            if target is not None and abs(submitted - target) <= tolerance:
                return True
        return False

    normalized_answer = _normalize_text(answer)
    return any(
        normalized_answer == _normalize_text(variant)
        for variant in task.answer_variants
    )
