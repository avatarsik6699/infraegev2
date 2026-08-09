"""Task content schema — mirrors docs/SPEC.md §3.

The backend only needs the subset of the content-as-code schema required to check an
answer (SPEC.md §4/§11.1). Everything else (Topic/Course/CourseLesson) is frontend-only.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

CheckerType = Literal["exact_match", "numeric_tolerance"]
InteractionType = Literal["production", "recognition"]


class ContentBlock(BaseModel):
    type: str
    data: dict


class Task(BaseModel):
    id: str
    topic_ids: list[str] = Field(default_factory=list)
    statement: str
    checker_type: CheckerType
    answer_variants: list[str]
    numeric_tolerance: float | None = None
    interaction_type: InteractionType
    explanation: list[ContentBlock] = Field(default_factory=list)
    difficulty: Literal[1, 2, 3]
    is_interleaving_eligible: bool = True
