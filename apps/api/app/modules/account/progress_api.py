"""Authenticated progress API; the anonymous checker remains untouched."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Header, HTTPException, Request, status
from sqlalchemy import select

from app.modules.account import service
from app.modules.account.api import AccountDb, active_session, require_csrf, require_origin
from app.modules.account.progress import (
    CheckAndSaveRequest,
    CheckAndSaveResponse,
    ProgressView,
    check_and_save,
    read_progress,
    reset_lesson,
)
from app.modules.entitlement.service import SUBSCRIPTION_REQUIRED, access_until, task_is_paid
from app.modules.practice.models import TaskRecord
from app.modules.practice.readers import InvalidAnswer, Unavailable, availability
from app.modules.practice.schemas import Block, StrictModel
from app.modules.practice.service import Conflict

router = APIRouter(tags=["progress"])
# Change 198: far above what a student opens in a day, far below a whole paid bank.
SOLUTIONS_PER_DAY = 300


class SolutionView(StrictModel):
    explanation: list[Block]


@router.get("/tasks/{task_id}/solution", response_model=SolutionView)
async def get_solution(task_id: str, request: Request, db: AccountDb) -> SolutionView:
    """The solution of a paid task, sent only when asked for (SPEC §4)."""
    current = await active_session(request, db)
    if await task_is_paid(db, task_id) and await access_until(db, current.user_id) is None:
        raise HTTPException(403, SUBSCRIPTION_REQUIRED)
    content = await db.scalar(
        select(TaskRecord.content).where(TaskRecord.id == task_id, availability())
    )
    if content is None:
        raise HTTPException(404, "task unavailable")
    if await service.count_today(db, current.user_id, "solutions") > SOLUTIONS_PER_DAY:
        await db.commit()
        raise HTTPException(429, "solution limit reached")
    await db.commit()
    return SolutionView(explanation=content["explanation"])


@router.post(
    "/tasks/{task_id}/check-and-save",
    response_model=CheckAndSaveResponse,
    response_model_exclude_none=True,
)
async def submit_answer(
    task_id: str,
    request: Request,
    body: CheckAndSaveRequest,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> CheckAndSaveResponse:
    require_origin(request)
    require_csrf(request, x_csrf_token)
    current = await active_session(request, db)
    # Change 192: a paid task needs an active grant of this very account.
    if await task_is_paid(db, task_id) and await access_until(db, current.user_id) is None:
        raise HTTPException(403, SUBSCRIPTION_REQUIRED)
    try:
        result = await check_and_save(db, current, task_id, body)
        await db.commit()
        return result
    except Unavailable as exc:
        raise HTTPException(404, "task or context unavailable") from exc
    except InvalidAnswer as exc:
        raise HTTPException(422, "answer shape does not match the task") from exc
    except Conflict as exc:
        raise HTTPException(409, "refresh the task") from exc


@router.get("/progress", response_model=ProgressView)
async def get_progress(request: Request, db: AccountDb) -> ProgressView:
    current = await active_session(request, db)
    return await read_progress(db, current)


@router.delete("/progress/{context_kind}/{context_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson_progress(
    context_kind: str,
    context_id: str,
    request: Request,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> None:
    require_origin(request)
    require_csrf(request, x_csrf_token)
    current = await active_session(request, db)
    try:
        await reset_lesson(db, current, context_kind, context_id)
        await db.commit()
    except ValueError as exc:
        raise HTTPException(400, "lesson context required") from exc
