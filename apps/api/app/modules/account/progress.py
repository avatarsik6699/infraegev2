"""Revision-aware, owner-scoped progress writes and projections."""

from __future__ import annotations

from typing import Literal

from pydantic import Field
from sqlalchemy import and_, delete, exists, or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.account.models import AccountSession, ProgressResult
from app.modules.account.schemas import StrictModel
from app.modules.practice import readers
from app.modules.practice.models import LessonTask, TaskRecord
from app.modules.practice.schemas import Block

ContextKind = Literal["topic_lesson", "course_lesson", "standalone"]
STANDALONE_CONTEXT = "standalone"


class CheckAndSaveRequest(StrictModel):
    answer: str = Field(min_length=1, max_length=500)
    solution_revision: int = Field(ge=1)
    context_kind: ContextKind
    context_id: str = Field(min_length=1, max_length=160)


class CheckAndSaveResponse(StrictModel):
    correct: bool
    saved: bool
    explanation: list[Block]
    solution_revision: int


class ResultView(StrictModel):
    context_kind: ContextKind
    context_id: str
    task_id: str
    solution_revision: int


class ProgressView(StrictModel):
    results: list[ResultView]


async def valid_context(
    db: AsyncSession, task_id: str, context_kind: ContextKind, context_id: str
) -> bool:
    if context_kind == "standalone":
        if context_id != STANDALONE_CONTEXT:
            return False
        row = await db.scalar(
            select(TaskRecord.id).where(
                TaskRecord.id == task_id,
                TaskRecord.catalog_visible.is_(True),
                TaskRecord.archived.is_(False),
            )
        )
        return row is not None
    kind = "topic" if context_kind == "topic_lesson" else "course"
    row = await db.scalar(
        select(LessonTask.task_id)
        .join(TaskRecord, TaskRecord.id == LessonTask.task_id)
        .where(
            LessonTask.task_id == task_id,
            LessonTask.material_id == context_id,
            LessonTask.kind == kind,
            LessonTask.published.is_(True),
            TaskRecord.archived.is_(False),
        )
    )
    return row is not None


async def check_and_save(
    db: AsyncSession, session: AccountSession, task_id: str, body: CheckAndSaveRequest
) -> CheckAndSaveResponse:
    if not await valid_context(db, task_id, body.context_kind, body.context_id):
        raise readers.Unavailable("task is not in this published context")
    checked = await readers.check(db, task_id, body.solution_revision, body.answer)
    if checked.correct:
        statement = (
            insert(ProgressResult)
            .values(
                user_id=session.user_id,
                context_kind=body.context_kind,
                context_id=body.context_id,
                task_id=task_id,
                solution_revision=body.solution_revision,
            )
            .on_conflict_do_nothing()
        )
        await db.execute(statement)
    return CheckAndSaveResponse(
        correct=checked.correct,
        saved=checked.correct,
        explanation=checked.explanation,
        solution_revision=checked.solution_revision,
    )


async def read_progress(db: AsyncSession, session: AccountSession) -> ProgressView:
    membership = exists(
        select(LessonTask.task_id).where(
            LessonTask.task_id == ProgressResult.task_id,
            LessonTask.material_id == ProgressResult.context_id,
            LessonTask.published.is_(True),
            or_(
                and_(ProgressResult.context_kind == "topic_lesson", LessonTask.kind == "topic"),
                and_(ProgressResult.context_kind == "course_lesson", LessonTask.kind == "course"),
            ),
        )
    )
    rows = await db.execute(
        select(
            ProgressResult.context_kind,
            ProgressResult.context_id,
            ProgressResult.task_id,
            ProgressResult.solution_revision,
        )
        .join(TaskRecord, TaskRecord.id == ProgressResult.task_id)
        .where(
            ProgressResult.user_id == session.user_id,
            ProgressResult.solution_revision == TaskRecord.solution_revision,
            TaskRecord.archived.is_(False),
            or_(
                and_(
                    ProgressResult.context_kind == "standalone",
                    ProgressResult.context_id == STANDALONE_CONTEXT,
                    TaskRecord.catalog_visible.is_(True),
                ),
                membership,
            ),
        )
    )
    return ProgressView(
        results=[
            ResultView(
                context_kind=kind,
                context_id=context_id,
                task_id=task_id,
                solution_revision=revision,
            )
            for kind, context_id, task_id, revision in rows
        ]
    )


async def reset_lesson(
    db: AsyncSession, session: AccountSession, context_kind: str, context_id: str
) -> None:
    if (
        context_kind not in {"topic_lesson", "course_lesson"}
        or not context_id
        or len(context_id) > 160
    ):
        raise ValueError("lesson context required")
    await db.execute(
        delete(ProgressResult).where(
            ProgressResult.user_id == session.user_id,
            ProgressResult.context_kind == context_kind,
            ProgressResult.context_id == context_id,
        )
    )
