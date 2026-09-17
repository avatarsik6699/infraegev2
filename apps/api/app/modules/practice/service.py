"""A single-operator transactional import. The caller owns commit/rollback."""

from datetime import UTC, datetime
from pathlib import Path

from sqlalchemy import delete, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import SCHEMA_REVISION
from app.modules.practice.files import MIME, checksum, safe_path
from app.modules.practice.models import FileObject, LessonTask, TaskChecker, TaskRecord
from app.modules.practice.schemas import Bank, BankFile, BankTask, TaskData


class Conflict(ValueError):
    pass


async def require_schema(session: AsyncSession) -> None:
    revision = await session.scalar(text("SELECT version_num FROM practice.alembic_version"))
    if revision != SCHEMA_REVISION:
        raise Conflict("incompatible database schema")
    await session.execute(select(TaskRecord.id).limit(0))


async def import_bank(session: AsyncSession, bank: Bank, storage: Path) -> int:
    bank.validate_references()
    materials = {item.id: item for item in bank.materials}
    courses = {item.id: item for item in bank.courses}
    for item in bank.files:
        if MIME.get(item.format) != item.mime_type:
            raise ValueError("unsupported file type")
        path = safe_path(storage, item.storage_key)
        if (
            item.storage_key != item.checksum
            or path.stat().st_size != item.size_bytes
            or checksum(path) != item.checksum
        ):
            raise ValueError("missing or corrupt file")
        await session.merge(FileObject(**item.model_dump()))
    await session.flush()
    for entry in bank.tasks:
        task = entry.task
        for usage in task.files:
            if await session.get(FileObject, usage.checksum) is None:
                raise ValueError("unknown task file")
        old = await session.get(TaskRecord, task.id)
        old_checker = await session.get(TaskChecker, task.id)
        content = task.model_dump(mode="json", exclude={"checker"})
        revision = entry.solution_revision
        if old is not None:
            changed = (
                any(
                    old.content.get(key) != content.get(key)
                    for key in ("statement", "answer_instruction", "files")
                )
                or old_checker is None
                or any(
                    getattr(old_checker, key) != value
                    for key, value in task.checker.model_dump().items()
                )
            )
            revision = max(revision, old.solution_revision + int(changed))
        await session.merge(
            TaskRecord(
                id=task.id,
                content=content,
                solution_revision=revision,
                catalog_visible=task.catalog_visible,
                archived=task.archived,
                updated_at=datetime.now(UTC),
            )
        )
        await session.flush()
        await session.merge(TaskChecker(task_id=task.id, **task.checker.model_dump()))
        await session.execute(delete(LessonTask).where(LessonTask.task_id == task.id))
        for link in task.lessons:
            material = materials.get(link.material_id)
            if material is None:
                raise ValueError("unknown lesson")
            course = courses.get(material.course_id or "")
            published = material.status == "published" and (
                material.kind == "topic" or (course is not None and course.status == "published")
            )
            session.add(
                LessonTask(
                    task_id=task.id,
                    material_id=link.material_id,
                    position=link.position,
                    kind=material.kind,
                    course_id=material.course_id,
                    published=published,
                )
            )
    await session.flush()
    return len(bank.tasks)


async def export_bank(session: AsyncSession) -> Bank:
    tasks = []
    for task, checker in await session.execute(select(TaskRecord, TaskChecker).join(TaskChecker)):
        value = dict(
            task.content,
            checker={
                key: getattr(checker, key)
                for key in ("checker_type", "answer_variants", "numeric_tolerance")
            },
        )
        tasks.append(
            BankTask(task=TaskData.model_validate(value), solution_revision=task.solution_revision)
        )
    files = [
        BankFile.model_validate(
            {
                key: getattr(item, key)
                for key in ("checksum", "storage_key", "format", "mime_type", "size_bytes")
            }
        )
        for item in await session.scalars(select(FileObject))
    ]
    # Publication metadata is supplied by the source bank during export by the CLI.
    return Bank(tasks=sorted(tasks, key=lambda item: item.task.id), files=files)
