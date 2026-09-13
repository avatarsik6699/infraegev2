from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.modules.practice.schemas import Block


class CheckRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    answer: str = Field(min_length=1, max_length=500)
    solution_revision: int = Field(ge=1)


class CheckResponse(BaseModel):
    correct: bool
    explanation: list[Block]
    solution_revision: int
