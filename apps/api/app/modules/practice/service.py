"""One write boundary for imports and edits; no hidden commit or shared session."""

from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Literal

from sqlalchemy import delete, literal_column, select, text
from sqlalchemy.dialects.postgresql import JSONB, insert
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app.core.database import SCHEMA_LOCK, SCHEMA_REVISION
from app.modules.practice.files import MIME, Package, checksum
from app.modules.practice.models import (
    FileObject,
    ImportOutcome,
    LessonTask,
    Material,
    MaterialSection,
    Provenance,
    TaskChecker,
    TaskExamNumber,
    TaskFileUsage,
    TaskHistory,
    TaskRecord,
    TaskSkill,
    TheoryReference,
)
from app.modules.practice.schemas import PublicTask, Registry, TaskData, TaskEdit
from app.shared.checker import is_correct

WRITE_LOCK = 114002


class Conflict(ValueError):
    """The operator must re-export/review; never retry writes implicitly."""


async def require_schema(session: AsyncSession) -> None:
    if not await session.scalar(
        text("SELECT pg_try_advisory_xact_lock_shared(:key)"), {"key": SCHEMA_LOCK}
    ):
        raise Conflict("schema is busy")
    revision = (
        (await session.execute(text("SELECT version_num FROM practice.alembic_version")))
        .scalars()
        .all()
    )
    if list(revision) != [SCHEMA_REVISION]:
        raise Conflict("incompatible database schema")
    await session.execute(select(TaskRecord).limit(0))
    await session.execute(select(TaskChecker).limit(0))


async def register_materials(session: AsyncSession, registry: Registry) -> None:
    for material in registry.materials:
        await session.execute(insert(Material).values(id=material.id).on_conflict_do_nothing())
        for section in material.sections:
            await session.execute(
                insert(MaterialSection)
                .values(material_id=material.id, section=section)
                .on_conflict_do_nothing()
            )


async def verify_registry(session: AsyncSession, registry: Registry) -> None:
    materials = {m.id: set(m.sections) for m in registry.materials}
    for material_id in await session.scalars(select(LessonTask.material_id).distinct()):
        if material_id not in materials:
            raise Conflict("application registry would hide a linked material")
    for material_id, section in await session.execute(
        select(TheoryReference.material_id, TheoryReference.section).distinct()
    ):
        if section not in materials.get(material_id, set()):
            raise Conflict("application registry would break a theory reference")


# Current normalized rows own runtime state. History is append-only audit evidence.
# Correlated aggregates keep one coherent SQL statement and never join private checker data
# into the public projection. This per-task reader is not the future catalog/batch endpoint.
PUBLIC_CONTENT = literal_column(
    """(to_jsonb(task) - ARRAY['revision','solution_revision','created_at','updated_at'])
    || jsonb_build_object(
      'skills', COALESCE((SELECT jsonb_agg(skill ORDER BY skill) FROM practice.task_skill
                WHERE task_id=practice.task.id), '[]'::jsonb),
      'exam_numbers', COALESCE((SELECT jsonb_agg(number ORDER BY number)
                FROM practice.task_exam_number WHERE task_id=practice.task.id), '[]'::jsonb),
      'sources', COALESCE((SELECT jsonb_agg(
                to_jsonb(s)-ARRAY['task_id','position'] ORDER BY position)
                FROM practice.provenance s WHERE task_id=practice.task.id), '[]'::jsonb),
      'files', COALESCE((SELECT jsonb_agg(to_jsonb(f)-'task_id' ORDER BY id)
                FROM practice.task_file_usage f WHERE task_id=practice.task.id), '[]'::jsonb),
      'lessons', COALESCE((SELECT jsonb_agg(to_jsonb(l)-'task_id' ORDER BY material_id)
                FROM practice.lesson_task l WHERE task_id=practice.task.id), '[]'::jsonb),
      'theory_links', COALESCE((SELECT jsonb_agg(
                to_jsonb(r)-ARRAY['task_id','position'] ORDER BY position)
                FROM practice.theory_reference r WHERE task_id=practice.task.id), '[]'::jsonb)
    )""",
    type_=JSONB,
)
PRIVATE_CONTENT = PUBLIC_CONTENT.op("||")(
    literal_column("jsonb_build_object('checker', to_jsonb(task_checker)-'task_id')", type_=JSONB)
)


async def current_snapshot(
    session: AsyncSession, task_id: str
) -> tuple[TaskRecord, TaskData] | None:
    result = (
        await session.execute(
            select(TaskRecord, PRIVATE_CONTENT)
            .join(TaskChecker, TaskChecker.task_id == TaskRecord.id)
            .where(TaskRecord.id == task_id)
        )
    ).one_or_none()
    return None if result is None else (result[0], TaskData.model_validate(result[1]))


@dataclass(frozen=True)
class EditPlan:
    id: str
    action: Literal["create", "update"]
    revision: int
    solution_revision: int
    changed_fields: tuple[str, ...] = ()


def solution_files(task: TaskData) -> set[tuple[str, str]]:
    usages = {getattr(block.data, "usage_id", None) for block in task.statement}
    return {(f.id, f.checksum) for f in task.files if f.id in usages}


def solution_changed(old: TaskData, new: TaskData, mode: str) -> bool:
    if mode == "editorial" and old.checker != new.checker:
        raise ValueError("editorial mode cannot change the checker")
    old_files = solution_files(old)
    new_files = solution_files(new)
    if mode == "editorial" and old_files != new_files:
        raise ValueError("editorial mode cannot replace source files")
    return (
        old.checker != new.checker
        or old_files != new_files
        or old.interaction_type != new.interaction_type
        or (
            mode != "editorial"
            and (old.statement != new.statement or old.answer_instruction != new.answer_instruction)
        )
    )


async def inspect_edit(session: AsyncSession, edit: TaskEdit, *, update: bool) -> EditPlan:
    current = await current_snapshot(session, edit.task.id)
    if current is None:
        if edit.expected_revision != 0:
            raise Conflict(f"{edit.task.id}: expected existing task")
        return EditPlan(edit.task.id, "create", 1, 1)
    record, old = current
    if not update or edit.expected_revision != record.revision:
        raise Conflict(f"{edit.task.id}: explicit update with current revision required")
    changed = solution_changed(old, edit.task, edit.mode)
    old_values = old.model_dump()
    return EditPlan(
        id=edit.task.id,
        action="update",
        revision=record.revision + 1,
        solution_revision=record.solution_revision + int(changed),
        changed_fields=tuple(
            key for key, value in edit.task.model_dump().items() if value != old_values[key]
        ),
    )


async def write_edit(
    session: AsyncSession, edit: TaskEdit, plan: EditPlan, package_id: str
) -> None:
    task = edit.task
    record = await session.get(TaskRecord, task.id)
    values = task.model_dump(
        mode="json",
        exclude={
            "checker",
            "skills",
            "exam_numbers",
            "sources",
            "files",
            "lessons",
            "theory_links",
        },
    )
    if record is None:
        record = TaskRecord(
            **values, revision=plan.revision, solution_revision=plan.solution_revision
        )
        session.add(record)
    else:
        for key, value in values.items():
            setattr(record, key, value)
        record.revision = plan.revision
        record.solution_revision = plan.solution_revision
        record.updated_at = datetime.now(UTC)
    await session.flush()
    # Only relations of this explicitly revision-checked task are replaced.
    for model in (
        TaskChecker,
        TaskSkill,
        TaskExamNumber,
        Provenance,
        TaskFileUsage,
        LessonTask,
        TheoryReference,
    ):
        await session.execute(delete(model).where(model.task_id == task.id))
    session.add(TaskChecker(task_id=task.id, **task.checker.model_dump()))
    session.add_all(TaskSkill(task_id=task.id, skill=skill) for skill in task.skills)
    session.add_all(TaskExamNumber(task_id=task.id, number=n) for n in task.exam_numbers)
    session.add_all(
        Provenance(task_id=task.id, position=i, **source.model_dump())
        for i, source in enumerate(task.sources)
    )
    session.add_all(TaskFileUsage(task_id=task.id, **usage.model_dump()) for usage in task.files)
    session.add_all(LessonTask(task_id=task.id, **link.model_dump()) for link in task.lessons)
    session.add_all(
        TheoryReference(task_id=task.id, position=i, **link.model_dump())
        for i, link in enumerate(task.theory_links)
    )
    session.add(
        TaskHistory(
            task_id=task.id,
            revision=record.revision,
            solution_revision=record.solution_revision,
            package_id=package_id,
            reason=edit.reason,
            mode=edit.mode,
            snapshot=task.model_dump(mode="json"),
        )
    )
    await session.flush()


async def process_package(
    engine: AsyncEngine,
    package: Package,
    registry: Registry,
    storage: Path,
    *,
    update: bool = False,
    apply: bool = False,
) -> dict[str, Any]:
    package.validate(registry)
    if apply:
        package.stage(storage)
    async with AsyncSession(engine, expire_on_commit=False) as session, session.begin():
        await require_schema(session)
        if apply:
            if await session.scalar(text("SELECT current_user")) != "infraege_import":
                raise ValueError("import role required")
            # Serializes bounded writer packages including absent IDs; expected revisions still
            # reject stale edits. Timeout rejects contention rather than silently retrying.
            await session.execute(text("SELECT pg_advisory_xact_lock(:key)"), {"key": WRITE_LOCK})
        existing = await session.get(ImportOutcome, package.manifest.package_id)
        if existing:
            if existing.checksum != package.checksum:
                raise Conflict("package ID already committed with another checksum")
            return {"status": "already_committed", "package_id": existing.package_id}
        if apply:
            await verify_registry(session, registry)
            # Registration belongs to release preflight, not to an import's authority.
            for material in registry.materials:
                if await session.get(Material, material.id) is None:
                    raise Conflict("application material registry has not been registered")
            session.add(
                ImportOutcome(
                    package_id=package.manifest.package_id,
                    checksum=package.checksum,
                    task_count=len(package.manifest.tasks),
                )
            )
            await session.flush()
            for entry in package.manifest.files:
                if checksum(storage / entry.checksum) != entry.checksum:
                    raise ValueError("staged file changed")
                values = dict(
                    checksum=entry.checksum,
                    storage_key=entry.checksum,
                    format=entry.format,
                    mime_type=MIME[entry.format],
                    size_bytes=entry.size_bytes,
                )
                existing_file = await session.get(FileObject, entry.checksum)
                if existing_file:
                    if any(getattr(existing_file, key) != value for key, value in values.items()):
                        raise Conflict("existing file metadata mismatch")
                else:
                    session.add(FileObject(**values))
            await session.flush()
        changes = []
        for edit in package.edits():
            plan = await inspect_edit(session, edit, update=update)
            changes.append(asdict(plan))
            if apply:
                await write_edit(session, edit, plan, package.manifest.package_id)
        if apply:
            await session.execute(text("SET CONSTRAINTS ALL IMMEDIATE"))
        return {
            "status": "committed" if apply else "validated",
            "package_id": package.manifest.package_id,
            "checksum": package.checksum,
            "changes": changes,
        }


async def read_task(session: AsyncSession, task_id: str) -> PublicTask | None:
    # The public query never selects checker or audit snapshots.
    row = (
        await session.execute(
            select(
                TaskRecord.id,
                TaskRecord.revision,
                TaskRecord.solution_revision,
                PUBLIC_CONTENT,
            ).where(TaskRecord.id == task_id, TaskRecord.archived.is_(False))
        )
    ).one_or_none()
    if row is None:
        return None
    return PublicTask(id=row[0], revision=row[1], solution_revision=row[2], content=row[3])


async def check_answer(
    session: AsyncSession, task_id: str, solution_revision: int, answer: str
) -> bool:
    row = (
        await session.execute(
            select(TaskRecord.solution_revision, TaskChecker)
            .join(TaskChecker, TaskChecker.task_id == TaskRecord.id)
            .where(TaskRecord.id == task_id, TaskRecord.archived.is_(False))
        )
    ).one_or_none()
    if row is None:
        raise ValueError("task unavailable")
    if row[0] != solution_revision:
        raise Conflict("solution revision changed; refresh the task")
    return is_correct(row[1], answer)
