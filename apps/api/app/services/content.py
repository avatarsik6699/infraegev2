"""Loads Task content files (docs/SPEC.md §3) — content is git-based, not in a database."""

from __future__ import annotations

import json
from functools import lru_cache

from app.config import TASKS_DIR
from app.schemas.task import Task


class TaskNotFoundError(Exception):
    pass


@lru_cache(maxsize=None)
def _load_task_uncached(task_id: str) -> Task:
    path = TASKS_DIR / f"{task_id}.json"
    if not path.exists():
        raise TaskNotFoundError(task_id)
    return Task.model_validate(json.loads(path.read_text(encoding="utf-8")))


def load_task(task_id: str) -> Task:
    return _load_task_uncached(task_id)


def clear_cache() -> None:
    """Test-only: content files are static in prod, but tests write fixtures per-case."""
    _load_task_uncached.cache_clear()
