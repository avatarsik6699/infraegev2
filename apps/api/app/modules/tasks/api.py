from __future__ import annotations

from fastapi import APIRouter

from app.modules.practice.api import Session
from app.modules.practice.readers import check
from app.modules.tasks.schemas import CheckRequest, CheckResponse

router = APIRouter(prefix="/tasks")


# Change 191: single-answer responses keep their shape; `parts` appears only for multi-part tasks.
@router.post("/{task_id}/check", response_model=CheckResponse, response_model_exclude_none=True)
async def check_answer(task_id: str, body: CheckRequest, connection: Session) -> CheckResponse:
    result = await check(connection, task_id, body.solution_revision, body.answer, body.answers)
    return CheckResponse(**result.model_dump())
