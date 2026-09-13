"""Bounded catalog/discovery projections; never load task bodies or checker rows."""

import base64
import hashlib
import json
from datetime import datetime

from pydantic import AwareDatetime, Field, ValidationError
from sqlalchemy import exists, func, literal, literal_column, select, tuple_
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.practice.models import TaskExamNumber, TaskRecord, TaskSkill
from app.modules.practice.schemas import Identifier, StrictModel

SITEMAP_SIZE = 1000


class InvalidCursor(ValueError):
    pass


class CatalogQuery(StrictModel):
    skill: Identifier | None = None
    exam_number: int | None = Field(default=None, ge=1, le=27)
    difficulty: int | None = Field(default=None, ge=1, le=3)
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
    difficulty: int
    estimated_minutes: int | None
    solution_revision: int
    skills: list[str]
    exam_numbers: list[int]


class CatalogPage(StrictModel):
    tasks: list[CatalogTask]
    next_cursor: str | None


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


def statement(query: CatalogQuery):
    cursor = decode_cursor(query)
    columns = (
        TaskRecord.id,
        TaskRecord.title,
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
    result = select(*columns).where(visible())
    if query.skill is not None:
        result = result.where(
            exists(
                select(TaskSkill.task_id).where(
                    TaskSkill.task_id == TaskRecord.id, TaskSkill.skill == query.skill
                )
            )
        )
    if query.exam_number is not None:
        result = result.where(
            exists(
                select(TaskExamNumber.task_id).where(
                    TaskExamNumber.task_id == TaskRecord.id,
                    TaskExamNumber.number == query.exam_number,
                )
            )
        )
    if query.difficulty is not None:
        result = result.where(TaskRecord.difficulty == query.difficulty)
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
