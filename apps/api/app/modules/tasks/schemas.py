from __future__ import annotations

from pydantic import BaseModel

from app.modules.content.schemas import ContentBlock


class CheckRequest(BaseModel):
    answer: str


class CheckResponse(BaseModel):
    correct: bool
    explanation: list[ContentBlock]
