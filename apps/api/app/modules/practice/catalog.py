"""Bounded catalog/discovery projections; never load task bodies or checker rows."""

import base64
import hashlib
import json
from datetime import datetime

from pydantic import AwareDatetime, Field, ValidationError
from sqlalchemy import ColumnElement, exists, func, literal, literal_column, select, tuple_
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.practice.models import TaskExamNumber, TaskRecord, TaskSkill
from app.modules.practice.readers import Unavailable
from app.modules.practice.schemas import Identifier, StrictModel

SITEMAP_SIZE = 1000


class InvalidCursor(ValueError):
    pass


class CatalogFilters(StrictModel):
    skill: Identifier | None = None
    exam_number: int | None = Field(default=None, ge=1, le=27)
    difficulty: int | None = Field(default=None, ge=1, le=3)


class CatalogQuery(CatalogFilters):
    limit: int = Field(default=30, ge=1, le=100)
    cursor: str | None = Field(default=None, min_length=1, max_length=1024)


class Cursor(StrictModel):
    version: int = Field(default=1, ge=1, le=1)
    filters: str = Field(pattern=r"^[a-f0-9]{64}$")
    created_at: AwareDatetime
    id: Identifier


class CatalogTask(StrictModel):
    id: str
    title: str
    short_description: str | None
    difficulty: int
    estimated_minutes: int | None
    solution_revision: int
    skills: list[str]
    exam_numbers: list[int]


class CatalogPage(StrictModel):
    tasks: list[CatalogTask]
    next_cursor: str | None
    total: int


class SitemapIndex(StrictModel):
    pages: int


class SitemapEntry(StrictModel):
    id: str
    updated_at: datetime


class SitemapPage(StrictModel):
    tasks: list[SitemapEntry]


def visible():
    return TaskRecord.catalog_visible.is_(True) & TaskRecord.archived.is_(False)


def filter_digest(query: CatalogQuery) -> str:
    encoded = json.dumps(query.model_dump(exclude={"cursor"}), sort_keys=True).encode()
    return hashlib.sha256(encoded).hexdigest()


def decode_cursor(query: CatalogQuery) -> Cursor | None:
    if query.cursor is None:
        return None
    try:
        raw = base64.b64decode(query.cursor, altchars=b"-_", validate=True)
        cursor = Cursor.model_validate_json(raw)
        if cursor.filters != filter_digest(query):
            raise InvalidCursor("cursor belongs to other filters")
        return cursor
    except (ValueError, ValidationError) as exc:
        raise InvalidCursor("invalid catalog cursor") from exc


def filters(query: CatalogFilters):
    result: list[ColumnElement[bool]] = [visible()]
    if query.skill is not None:
        result.append(
            exists(
                select(TaskSkill.task_id).where(
                    TaskSkill.task_id == TaskRecord.id, TaskSkill.skill == query.skill
                )
            )
        )
    if query.exam_number is not None:
        result.append(
            exists(
                select(TaskExamNumber.task_id).where(
                    TaskExamNumber.task_id == TaskRecord.id,
                    TaskExamNumber.number == query.exam_number,
                )
            )
        )
    if query.difficulty is not None:
        result.append(TaskRecord.difficulty == query.difficulty)
    return result


def statement(query: CatalogQuery):
    cursor = decode_cursor(query)
    columns = (
        TaskRecord.id,
        TaskRecord.title,
        TaskRecord.short_description,
        TaskRecord.difficulty,
        TaskRecord.estimated_minutes,
        TaskRecord.solution_revision,
        TaskRecord.created_at,
        literal_column(
            "COALESCE((SELECT jsonb_agg(skill ORDER BY skill) FROM practice.task_skill "
            "WHERE task_id=practice.task.id), '[]'::jsonb)",
            type_=JSONB,
        ).label("skills"),
        literal_column(
            "COALESCE((SELECT jsonb_agg(number ORDER BY number) FROM practice.task_exam_number "
            "WHERE task_id=practice.task.id), '[]'::jsonb)",
            type_=JSONB,
        ).label("exam_numbers"),
    )
    result = select(*columns).where(*filters(query))
    if cursor is not None:
        result = result.where(
            tuple_(TaskRecord.created_at, TaskRecord.id)
            < tuple_(literal(cursor.created_at), literal(cursor.id))
        )
    return result.order_by(TaskRecord.created_at.desc(), TaskRecord.id.desc()).limit(
        query.limit + 1
    )


async def page(session: AsyncSession, query: CatalogQuery) -> CatalogPage:
    rows = (await session.execute(statement(query))).mappings().all()
    total = await session.scalar(
        select(func.count()).select_from(TaskRecord).where(*filters(query))
    )
    selected = rows[: query.limit]
    next_cursor = None
    if len(rows) > query.limit:
        last = selected[-1]
        value = Cursor(filters=filter_digest(query), created_at=last["created_at"], id=last["id"])
        next_cursor = base64.urlsafe_b64encode(value.model_dump_json().encode()).decode()
    return CatalogPage(
        tasks=[
            CatalogTask.model_validate({k: v for k, v in row.items() if k != "created_at"})
            for row in selected
        ],
        next_cursor=next_cursor,
        total=total or 0,
    )


async def sitemap_index(session: AsyncSession) -> SitemapIndex:
    count = await session.scalar(select(func.count()).select_from(TaskRecord).where(visible()))
    pages = ((count or 0) + SITEMAP_SIZE - 1) // SITEMAP_SIZE
    if pages > 49999:
        raise ValueError("sitemap index capacity exceeded")
    return SitemapIndex(pages=pages)


async def sitemap_page(session: AsyncSession, page: int) -> SitemapPage:
    rows = await session.execute(
        select(TaskRecord.id, TaskRecord.updated_at)
        .where(visible())
        .order_by(TaskRecord.id)
        .offset((page - 1) * SITEMAP_SIZE)
        .limit(SITEMAP_SIZE)
    )
    return SitemapPage(tasks=[SitemapEntry(id=row.id, updated_at=row.updated_at) for row in rows])


SKILL_LABELS = {
    "recursion": "Рекуррентные соотношения",
    "mutual-recursion": "Взаимная рекурсия",
    "recursive-procedure": "Рекурсивные процедуры",
    "binary-algorithm": "Двоичная запись числа",
    "digit-algorithm": "Алгоритмы с цифрами",
    "string-algorithm": "Преобразование строк",
    "python": "Алгоритмы на Python",
}


class SkillOption(StrictModel):
    value: str
    label: str


class CatalogFacets(StrictModel):
    total: int
    exam_numbers: list[int]
    difficulties: list[int]
    skills: list[SkillOption]


class NextTask(StrictModel):
    task_id: str | None


async def facets(session: AsyncSession) -> CatalogFacets:
    total = await session.scalar(select(func.count()).select_from(TaskRecord).where(visible()))
    numbers = await session.scalars(
        select(TaskExamNumber.number)
        .join(TaskRecord)
        .where(visible())
        .distinct()
        .order_by(TaskExamNumber.number)
    )
    difficulties = await session.scalars(
        select(TaskRecord.difficulty).where(visible()).distinct().order_by(TaskRecord.difficulty)
    )
    skills = await session.scalars(
        select(TaskSkill.skill)
        .join(TaskRecord)
        .where(visible(), TaskSkill.skill.in_(SKILL_LABELS))
        .distinct()
        .order_by(TaskSkill.skill)
    )
    return CatalogFacets(
        total=total or 0,
        exam_numbers=list(numbers),
        difficulties=list(difficulties),
        skills=[SkillOption(value=skill, label=SKILL_LABELS[skill]) for skill in skills],
    )


async def next_task(session: AsyncSession, task_id: str, query: CatalogFilters) -> NextTask:
    current = (
        await session.execute(
            select(TaskRecord.created_at, TaskRecord.id).where(
                TaskRecord.id == task_id, *filters(query)
            )
        )
    ).one_or_none()
    if current is None:
        raise Unavailable("current task is not in this selection")
    next_id = await session.scalar(
        select(TaskRecord.id)
        .where(
            *filters(query),
            tuple_(TaskRecord.created_at, TaskRecord.id)
            < tuple_(literal(current.created_at), literal(current.id)),
        )
        .order_by(TaskRecord.created_at.desc(), TaskRecord.id.desc())
        .limit(1)
    )
    return NextTask(task_id=next_id)
