from __future__ import annotations

from fastapi import APIRouter

from app.modules.content.service import load_task
from app.modules.tasks.schemas import CheckRequest, CheckResponse
from app.modules.tasks.service import is_correct

router = APIRouter(prefix="/tasks")


@router.post("/{task_id}/check", response_model=CheckResponse)
async def check_answer(task_id: str, body: CheckRequest) -> CheckResponse:
    task = load_task(task_id)
    correct = is_correct(task, body.answer)
    return CheckResponse(correct=correct, explanation=task.explanation)
