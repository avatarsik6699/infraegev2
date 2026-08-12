from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.modules.content.schemas import ContentBlock


class CheckRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    answer: str = Field(min_length=1, max_length=500)


class CheckResponse(BaseModel):
    correct: bool
    explanation: list[ContentBlock]
