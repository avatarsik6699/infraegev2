"""Historical content/tasks schema retained only for legacy checker/API fixtures."""

from __future__ import annotations

from typing import Literal, Self

from pydantic import Field, model_validator

from app.modules.content.schemas import ContentBlock, StrictContentModel

CheckerType = Literal["exact_match", "numeric_tolerance"]
InteractionType = Literal["production", "recognition"]


class TheoryLink(StrictContentModel):
    hash: str = Field(min_length=1, pattern=r"^[a-z][a-z0-9-]*$")
    label: str = Field(min_length=1)


class Task(StrictContentModel):
    id: str
    topic_ids: list[str] = Field(default_factory=list)
    course_lesson_ids: list[str] = Field(default_factory=list)
    title: str
    statement: list[ContentBlock] = Field(min_length=1)
    hint: list[ContentBlock] = Field(min_length=1)
    theory_links: list[TheoryLink] = Field(default_factory=list)
    checker_type: CheckerType
    answer_variants: list[str]
    numeric_tolerance: float | None = None
    interaction_type: InteractionType
    explanation: list[ContentBlock] = Field(min_length=1)
    difficulty: Literal[1, 2, 3]
    is_interleaving_eligible: bool = True

    @model_validator(mode="after")
    def validate_content_owner(self) -> Self:
        if not self.topic_ids and not self.course_lesson_ids:
            raise ValueError("task must belong to a topic or course lesson")
        if self.topic_ids and self.course_lesson_ids:
            raise ValueError("task cannot bridge topic and course lesson ownership")
        return self
