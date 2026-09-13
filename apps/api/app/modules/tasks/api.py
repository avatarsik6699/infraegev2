from __future__ import annotations

from fastapi import APIRouter

from app.modules.practice.api import ReleaseRegistry, Session
from app.modules.practice.readers import check
from app.modules.tasks.schemas import CheckRequest, CheckResponse

router = APIRouter(prefix="/tasks")


@router.post("/{task_id}/check", response_model=CheckResponse)
async def check_answer(
    task_id: str, body: CheckRequest, connection: Session, release: ReleaseRegistry
) -> CheckResponse:
    result = await check(connection, release, task_id, body.solution_revision, body.answer)
    return CheckResponse(**result.model_dump())
