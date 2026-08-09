"""Loads Task content files (docs/SPEC.md §3) — content is git-based, not in a database."""

from __future__ import annotations

import json
from functools import cache

from app.core.config import settings
from app.modules.content.exceptions import TaskNotFound
from app.modules.content.schemas import Task


@cache
def _load_task_uncached(task_id: str) -> Task:
    path = settings.tasks_dir / f"{task_id}.json"
    if not path.exists():
        raise TaskNotFound()
    return Task.model_validate(json.loads(path.read_text(encoding="utf-8")))


def load_task(task_id: str) -> Task:
    return _load_task_uncached(task_id)


def clear_cache() -> None:
    """Test-only: content files are static in prod, but tests write fixtures per-case."""
    _load_task_uncached.cache_clear()
