"""Public current-state projections; checker is read only for answer submission."""

from collections.abc import Callable, Iterable, Sequence
from typing import Any

from pydantic import Field
from sqlalchemy import exists, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.practice.models import FileObject, LessonTask, TaskChecker, TaskRecord
from app.modules.practice.schemas import (
    Block,
    CheckerPart,
    FileDelivery,
    PublicTask,
    PublicTaskContent,
    StrictModel,
    TheoryLink,
)
from app.modules.practice.service import Conflict
from app.shared.checker import is_correct


class Unavailable(ValueError):
    pass


class TaskVersion(StrictModel):
    id: str
    solution_revision: int
    counts_toward_mastery: bool


class LessonSummary(StrictModel):
    id: str
    tasks: list[TaskVersion]


class TopicSummary(StrictModel):
    topics: list[LessonSummary]


class CourseSummary(StrictModel):
    id: str
    lessons: list[LessonSummary]


class LockedTask(StrictModel):
    """A paid task shown to a reader without access (Change 192): what it is about and
    where it belongs, never its statement, help, files or answers."""

    id: str
    solution_revision: int
    title: str
    difficulty: int
    skills: list[str]
    exam_numbers: list[int]
    theory_links: list[TheoryLink]
    counts_toward_mastery: bool


class LessonPractice(StrictModel):
    id: str
    kind: str
    tasks: list[PublicTask]
    locked: list[LockedTask] = Field(default_factory=list)


class CheckedAnswer(StrictModel):
    correct: bool
    explanation: list[Block]
    solution_revision: int
    parts: dict[str, bool] | None = None


class InvalidAnswer(ValueError):
    """The submitted answer shape does not match the task (single vs multi-part)."""


def availability():
    return TaskRecord.archived.is_(False) & or_(
        TaskRecord.catalog_visible.is_(True),
        exists(
            select(LessonTask.task_id).where(
                LessonTask.task_id == TaskRecord.id, LessonTask.published.is_(True)
            )
        ),
    )


def public_task(row: TaskRecord, files: dict[str, FileObject]) -> PublicTask:
    content = dict(row.content)
    content["sources"] = [
        {k: v for k, v in source.items() if k != "is_public"}
        for source in content["sources"]
        if source.get("is_public", True)
    ]
    deliveries = [
        FileDelivery(
            usage_id=usage["id"],
            url=f"/api/tasks/{row.id}/files/{usage['id']}",
            mime_type=files[usage["checksum"]].mime_type,
            size_bytes=files[usage["checksum"]].size_bytes,
        )
        for usage in content["files"]
    ]
    return PublicTask(
        id=row.id,
        revision=row.solution_revision,
        solution_revision=row.solution_revision,
        content=PublicTaskContent.model_validate(content),
        deliveries=deliveries,
    )


async def project(session: AsyncSession, rows: list[TaskRecord]) -> list[PublicTask]:
    keys = {usage["checksum"] for row in rows for usage in row.content["files"]}
    files = (
        {
            item.checksum: item
            for item in await session.scalars(
                select(FileObject).where(FileObject.checksum.in_(keys))
            )
        }
        if keys
        else {}
    )
    return [public_task(row, files) for row in rows]


async def task(session: AsyncSession, task_id: str) -> PublicTask:
    row = await session.scalar(select(TaskRecord).where(TaskRecord.id == task_id, availability()))
    if row is None:
        raise Unavailable("task unavailable")
    return (await project(session, [row]))[0]


async def file(session: AsyncSession, task_id: str, usage_id: str):
    row = await task(session, task_id)
    usage = next((item for item in row.content.files if item.id == usage_id), None)
    if usage is None:
        raise Unavailable("file unavailable")
    obj = await session.get(FileObject, usage.checksum)
    if obj is None:
        raise Unavailable("file unavailable")
    return usage, obj


async def lesson(
    session: AsyncSession,
    kind: str,
    material_id: str,
    closed: Callable[[dict[str, Any]], bool] | None = None,
) -> LessonPractice:
    """The lesson's tasks in order; `closed` picks the ones shown locked."""
    rows = list(
        await session.scalars(
            select(TaskRecord)
            .join(LessonTask)
            .where(
                LessonTask.material_id == material_id,
                LessonTask.kind == kind,
                LessonTask.published.is_(True),
                TaskRecord.archived.is_(False),
            )
            .order_by(LessonTask.position)
        )
    )
    if not rows:
        raise Unavailable("material unavailable")
    shut = [row for row in rows if closed is not None and closed(row.content)]
    open_rows = [row for row in rows if row not in shut]
    return LessonPractice(
        id=material_id,
        kind=kind,
        tasks=await project(session, open_rows),
        locked=[
            LockedTask(
                id=row.id,
                solution_revision=row.solution_revision,
                title=row.content["title"],
                difficulty=row.content["difficulty"],
                skills=row.content.get("skills", []),
                exam_numbers=row.content.get("exam_numbers", []),
                theory_links=[
                    TheoryLink.model_validate(link)
                    for link in row.content.get("theory_links", [])
                    if link.get("material_id") == material_id
                ],
                counts_toward_mastery=counts_toward_mastery(
                    row.content.get("lessons", []), material_id
                ),
            )
            for row in shut
        ],
    )


def counts_toward_mastery(memberships: list[dict[str, object]], material_id: str) -> bool:
    """The membership flag lives in task content; a missing key means the task is counted."""
    return next(
        (
            item.get("counts_toward_mastery", True) is not False
            for item in memberships
            if item.get("material_id") == material_id
        ),
        True,
    )


def group_versions(rows: Iterable[Sequence[Any]]) -> dict[str, list[TaskVersion]]:
    """Group (material, task id, revision, memberships) rows by material."""
    grouped: dict[str, list[TaskVersion]] = {}
    for material, task_id, revision, memberships in rows:
        grouped.setdefault(material, []).append(
            TaskVersion(
                id=task_id,
                solution_revision=revision,
                counts_toward_mastery=counts_toward_mastery(memberships or [], material),
            )
        )
    return grouped


async def course(session: AsyncSession, course_id: str) -> CourseSummary:
    rows = await session.execute(
        select(
            LessonTask.material_id,
            TaskRecord.id,
            TaskRecord.solution_revision,
            TaskRecord.content["lessons"],
        )
        .join(TaskRecord)
        .where(
            LessonTask.course_id == course_id,
            LessonTask.published.is_(True),
            TaskRecord.archived.is_(False),
        )
        .order_by(LessonTask.material_id, LessonTask.position)
    )
    grouped = group_versions(rows)
    if not grouped:
        raise Unavailable("course unavailable")
    return CourseSummary(
        id=course_id, lessons=[LessonSummary(id=k, tasks=v) for k, v in grouped.items()]
    )


async def topics(session: AsyncSession) -> TopicSummary:
    rows = await session.execute(
        select(
            LessonTask.material_id,
            TaskRecord.id,
            TaskRecord.solution_revision,
            TaskRecord.content["lessons"],
        )
        .join(TaskRecord)
        .where(
            LessonTask.kind == "topic",
            LessonTask.published.is_(True),
            TaskRecord.archived.is_(False),
        )
        .order_by(LessonTask.material_id, LessonTask.position)
    )
    grouped = group_versions(rows)
    return TopicSummary(topics=[LessonSummary(id=k, tasks=v) for k, v in grouped.items()])


async def check(
    session: AsyncSession,
    task_id: str,
    revision: int,
    answer: str | None,
    answers: dict[str, str] | None = None,
) -> CheckedAnswer:
    row = (
        await session.execute(
            select(TaskRecord, TaskChecker)
            .join(TaskChecker)
            .where(TaskRecord.id == task_id, availability())
        )
    ).one_or_none()
    if row is None:
        raise Unavailable("task unavailable")
    if row[0].solution_revision != revision:
        raise Conflict("solution revision changed; refresh the task")
    checker = row[1]
    parts = None
    if checker.parts:
        known = {part["key"]: CheckerPart.model_validate(part) for part in checker.parts}
        if answers is None or answer is not None or not set(answers) <= set(known):
            raise InvalidAnswer("multi-part task requires part answers")
        # Change 191: empty parts stay unchecked; success needs every part correct.
        parts = {
            key: is_correct(known[key], value) for key, value in answers.items() if value.strip()
        }
        correct = len(parts) == len(known) and all(parts.values())
    else:
        if answer is None or answers is not None:
            raise InvalidAnswer("single-answer task requires one answer")
        correct = is_correct(checker, answer)
    return CheckedAnswer(
        correct=correct,
        explanation=row[0].content["explanation"],
        solution_revision=revision,
        parts=parts,
    )
