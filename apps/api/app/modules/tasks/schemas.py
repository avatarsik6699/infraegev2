from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.modules.practice.schemas import AnswerInput, Block


class CheckRequest(AnswerInput):
    model_config = ConfigDict(extra="forbid")

    solution_revision: int = Field(ge=1)


class CheckResponse(BaseModel):
    correct: bool
    explanation: list[Block]
    solution_revision: int
    parts: dict[str, bool] | None = None
