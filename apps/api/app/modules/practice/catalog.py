"""Small numbered catalog; predicates and next-task order are shared."""

from datetime import datetime

from pydantic import Field
from sqlalchemy import ColumnElement, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.practice.models import TaskRecord
from app.modules.practice.readers import Unavailable
from app.modules.practice.schemas import StrictModel

SITEMAP_SIZE = 1000
PAGE_SIZE = 30


class CatalogFilters(StrictModel):
    skill: str | None = Field(default=None, max_length=120)
    exam_number: int | None = Field(default=None, ge=1, le=27)
    difficulty: int | None = Field(default=None, ge=1, le=3)


class CatalogQuery(CatalogFilters):
    page: int = Field(default=1, ge=1, le=100000)


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
    page: int
    next_page: int | None
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


def filters(query: CatalogFilters):
    result: list[ColumnElement[bool]] = [visible()]
    if query.skill is not None:
        result.append(TaskRecord.content["skills"].contains([query.skill]))
    if query.exam_number is not None:
        result.append(TaskRecord.content["exam_numbers"].contains([query.exam_number]))
    if query.difficulty is not None:
        result.append(TaskRecord.content["difficulty"].as_integer() == query.difficulty)
    return result


async def page(session: AsyncSession, query: CatalogQuery) -> CatalogPage:
    names = (
        "title",
        "short_description",
        "difficulty",
        "estimated_minutes",
        "skills",
        "exam_numbers",
    )
    rows = (
        (
            await session.execute(
                select(
                    TaskRecord.id,
                    TaskRecord.solution_revision,
                    *(TaskRecord.content[name].label(name) for name in names),
                )
                .where(*filters(query))
                .order_by(TaskRecord.id)
                .offset((query.page - 1) * PAGE_SIZE)
                .limit(PAGE_SIZE)
            )
        )
        .mappings()
        .all()
    )
    total = (
        await session.scalar(select(func.count()).select_from(TaskRecord).where(*filters(query)))
        or 0
    )
    return CatalogPage(
        tasks=[CatalogTask.model_validate(row) for row in rows],
        page=query.page,
        next_page=query.page + 1 if query.page * PAGE_SIZE < total else None,
        total=total,
    )


async def sitemap_index(session: AsyncSession) -> SitemapIndex:
    count = await session.scalar(select(func.count()).select_from(TaskRecord).where(visible())) or 0
    return SitemapIndex(pages=(count + SITEMAP_SIZE - 1) // SITEMAP_SIZE)


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
    total = await session.scalar(select(func.count()).select_from(TaskRecord).where(visible())) or 0
    numbers = await session.scalars(
        select(func.jsonb_array_elements_text(TaskRecord.content["exam_numbers"]))
        .where(visible())
        .distinct()
    )
    skills = await session.scalars(
        select(func.jsonb_array_elements_text(TaskRecord.content["skills"]))
        .where(visible())
        .distinct()
    )
    difficulties = await session.scalars(
        select(TaskRecord.content["difficulty"].as_integer()).where(visible()).distinct()
    )
    return CatalogFacets(
        total=total,
        exam_numbers=sorted(int(n) for n in numbers),
        difficulties=sorted(difficulties),
        skills=[
            SkillOption(value=s, label=SKILL_LABELS.get(s, s))
            for s in sorted(str(value) for value in skills)
        ],
    )


async def next_task(session: AsyncSession, task_id: str, query: CatalogFilters) -> NextTask:
    if (
        await session.scalar(select(TaskRecord.id).where(TaskRecord.id == task_id, *filters(query)))
        is None
    ):
        raise Unavailable("current task is not in this selection")
    next_id = await session.scalar(
        select(TaskRecord.id)
        .where(TaskRecord.id > task_id, *filters(query))
        .order_by(TaskRecord.id)
        .limit(1)
    )
    return NextTask(task_id=next_id)
