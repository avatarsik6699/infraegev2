"""Public current-state projections; checker is read only for answer submission."""

from sqlalchemy import exists, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.practice.models import FileObject, LessonTask, TaskChecker, TaskRecord
from app.modules.practice.schemas import (
    Block,
    FileDelivery,
    PublicTask,
    PublicTaskContent,
    StrictModel,
)
from app.modules.practice.service import Conflict
from app.shared.checker import is_correct


class Unavailable(ValueError):
    pass


class TaskVersion(StrictModel):
    id: str
    solution_revision: int


class LessonSummary(StrictModel):
    id: str
    tasks: list[TaskVersion]


class TopicSummary(StrictModel):
    topics: list[LessonSummary]


class CourseSummary(StrictModel):
    id: str
    lessons: list[LessonSummary]


class LessonPractice(StrictModel):
    id: str
    kind: str
    tasks: list[PublicTask]


class CheckedAnswer(StrictModel):
    correct: bool
    explanation: list[Block]
    solution_revision: int


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


async def lesson(session: AsyncSession, kind: str, material_id: str) -> LessonPractice:
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
    return LessonPractice(id=material_id, kind=kind, tasks=await project(session, rows))


async def course(session: AsyncSession, course_id: str) -> CourseSummary:
    rows = await session.execute(
        select(LessonTask.material_id, TaskRecord.id, TaskRecord.solution_revision)
        .join(TaskRecord)
        .where(
            LessonTask.course_id == course_id,
            LessonTask.published.is_(True),
            TaskRecord.archived.is_(False),
        )
        .order_by(LessonTask.material_id, LessonTask.position)
    )
    grouped: dict[str, list[TaskVersion]] = {}
    for material, task_id, revision in rows:
        grouped.setdefault(material, []).append(TaskVersion(id=task_id, solution_revision=revision))
    if not grouped:
        raise Unavailable("course unavailable")
    return CourseSummary(
        id=course_id, lessons=[LessonSummary(id=k, tasks=v) for k, v in grouped.items()]
    )


async def topics(session: AsyncSession) -> TopicSummary:
    rows = await session.execute(
        select(LessonTask.material_id, TaskRecord.id, TaskRecord.solution_revision)
        .join(TaskRecord)
        .where(
            LessonTask.kind == "topic",
            LessonTask.published.is_(True),
            TaskRecord.archived.is_(False),
        )
        .order_by(LessonTask.material_id, LessonTask.position)
    )
    grouped: dict[str, list[TaskVersion]] = {}
    for material, task_id, revision in rows:
        grouped.setdefault(material, []).append(TaskVersion(id=task_id, solution_revision=revision))
    return TopicSummary(topics=[LessonSummary(id=k, tasks=v) for k, v in grouped.items()])


async def check(session: AsyncSession, task_id: str, revision: int, answer: str) -> CheckedAnswer:
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
    return CheckedAnswer(
        correct=is_correct(row[1], answer),
        explanation=row[0].content["explanation"],
        solution_revision=revision,
    )
