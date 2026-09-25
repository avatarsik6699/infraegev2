"""Authenticated progress API; the anonymous checker remains untouched."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Header, HTTPException, Request, status

from app.modules.account.api import AccountDb, active_session, require_csrf, require_origin
from app.modules.account.progress import (
    CheckAndSaveRequest,
    CheckAndSaveResponse,
    ProgressView,
    check_and_save,
    read_progress,
    reset_lesson,
)
from app.modules.practice.readers import Unavailable
from app.modules.practice.service import Conflict

router = APIRouter(tags=["progress"])


@router.post("/tasks/{task_id}/check-and-save", response_model=CheckAndSaveResponse)
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
    try:
        result = await check_and_save(db, current, task_id, body)
        await db.commit()
        return result
    except Unavailable as exc:
        raise HTTPException(404, "task or context unavailable") from exc
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
