"""Release-aware public projections. Every projection uses one bounded SQL read."""

from sqlalchemy import and_, exists, literal_column, or_, select
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.practice.models import (
    FileObject,
    LessonTask,
    TaskChecker,
    TaskFileUsage,
    TaskRecord,
)
from app.modules.practice.schemas import Block, FileDelivery, PublicTask, Registry, StrictModel
from app.modules.practice.service import PUBLIC_CONTENT, Conflict
from app.shared.checker import is_correct


class Unavailable(ValueError):
    pass


class TaskVersion(StrictModel):
    id: str
    solution_revision: int


class LessonSummary(StrictModel):
    id: str
    tasks: list[TaskVersion]


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


def public_material_ids(registry: Registry) -> list[str]:
    courses = {c.id for c in registry.courses if c.status == "published"}
    return [
        m.id
        for m in registry.materials
        if m.status == "published" and (m.kind == "topic" or m.course_id in courses)
    ]


def availability(registry: Registry):
    return and_(
        TaskRecord.archived.is_(False),
        or_(
            TaskRecord.catalog_visible.is_(True),
            exists(
                select(LessonTask.task_id).where(
                    LessonTask.task_id == TaskRecord.id,
                    LessonTask.material_id.in_(public_material_ids(registry)),
                )
            ),
        ),
    )


def public_task(row) -> PublicTask:
    deliveries = [
        {**item, "url": f"/api/tasks/{row[0]}/files/{item['usage_id']}"} for item in row[4]
    ]
    return PublicTask(
        id=row[0],
        revision=row[1],
        solution_revision=row[2],
        content=row[3],
        deliveries=[FileDelivery.model_validate(item) for item in deliveries],
    )


def task_columns():
    deliveries = literal_column(
        """COALESCE((SELECT jsonb_agg(jsonb_build_object(
      'usage_id', u.id, 'mime_type', f.mime_type, 'size_bytes', f.size_bytes) ORDER BY u.id)
      FROM practice.task_file_usage u JOIN practice.file_object f ON f.checksum=u.checksum
      WHERE u.task_id=practice.task.id), '[]'::jsonb)""",
        type_=JSONB,
    )
    return (
        TaskRecord.id,
        TaskRecord.revision,
        TaskRecord.solution_revision,
        PUBLIC_CONTENT,
        deliveries,
    )


async def file(session: AsyncSession, registry: Registry, task_id: str, usage_id: str):
    row = (
        await session.execute(
            select(TaskFileUsage, FileObject)
            .join(FileObject, FileObject.checksum == TaskFileUsage.checksum)
            .join(TaskRecord, TaskRecord.id == TaskFileUsage.task_id)
            .where(TaskRecord.id == task_id, TaskFileUsage.id == usage_id, availability(registry))
        )
    ).one_or_none()
    if row is None:
        raise Unavailable("file unavailable")
    return row


async def task(session: AsyncSession, registry: Registry, task_id: str) -> PublicTask:
    row = (
        await session.execute(
            select(*task_columns()).where(TaskRecord.id == task_id, availability(registry))
        )
    ).one_or_none()
    if row is None:
        raise Unavailable("task unavailable")
    return public_task(row)


async def lesson(
    session: AsyncSession, registry: Registry, kind: str, material_id: str
) -> LessonPractice:
    if not any(
        m.id == material_id and m.kind == kind for m in registry.materials
    ) or material_id not in public_material_ids(registry):
        raise Unavailable("material unavailable")
    rows = await session.execute(
        select(*task_columns())
        .join(LessonTask, LessonTask.task_id == TaskRecord.id)
        .where(LessonTask.material_id == material_id, TaskRecord.archived.is_(False))
        .order_by(LessonTask.position)
    )
    return LessonPractice(id=material_id, kind=kind, tasks=[public_task(row) for row in rows])


async def course(session: AsyncSession, registry: Registry, course_id: str) -> CourseSummary:
    definition = next(
        (c for c in registry.courses if c.id == course_id and c.status == "published"), None
    )
    if definition is None:
        raise Unavailable("course unavailable")
    available = set(public_material_ids(registry))
    ids = [material for material in definition.lesson_ids if material in available]
    rows = await session.execute(
        select(LessonTask.material_id, TaskRecord.id, TaskRecord.solution_revision)
        .join(TaskRecord, TaskRecord.id == LessonTask.task_id)
        .where(LessonTask.material_id.in_(ids), TaskRecord.archived.is_(False))
        .order_by(LessonTask.material_id, LessonTask.position)
    )
    grouped: dict[str, list[TaskVersion]] = {material: [] for material in ids}
    for material, task_id, revision in rows:
        grouped[material].append(TaskVersion(id=task_id, solution_revision=revision))
    return CourseSummary(
        id=course_id,
        lessons=[LessonSummary(id=material, tasks=grouped[material]) for material in ids],
    )


async def check(
    session: AsyncSession, registry: Registry, task_id: str, revision: int, answer: str
) -> CheckedAnswer:
    row = (
        await session.execute(
            select(TaskRecord.solution_revision, TaskRecord.explanation, TaskChecker)
            .join(TaskChecker, TaskChecker.task_id == TaskRecord.id)
            .where(TaskRecord.id == task_id, availability(registry))
        )
    ).one_or_none()
    if row is None:
        raise Unavailable("task unavailable")
    if revision != row[0]:
        raise Conflict("solution revision changed; refresh the task")
    return CheckedAnswer(
        correct=is_correct(row[2], answer), explanation=row[1], solution_revision=row[0]
    )
