from fastapi import APIRouter, HTTPException

from app.schemas.task import CheckRequest, CheckResponse
from app.services import checker, content

router = APIRouter(prefix="/api/tasks")


@router.post("/{task_id}/check", response_model=CheckResponse)
async def check_answer(task_id: str, body: CheckRequest) -> CheckResponse:
    try:
        task = content.load_task(task_id)
    except content.TaskNotFoundError:
        raise HTTPException(status_code=404, detail="Task not found") from None

    correct = checker.is_correct(task, body.answer)
    return CheckResponse(correct=correct, explanation=task.explanation)
