"""Small numbered catalog; predicates and next-task order are shared."""

from datetime import datetime
from pathlib import Path
from typing import Literal

from pydantic import Field, TypeAdapter, field_validator, model_validator
from sqlalchemy import ColumnElement, and_, cast, exists, func, or_, select
from sqlalchemy.dialects.postgresql import JSONPATH
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.practice.models import LessonTask, TaskRecord
from app.modules.practice.readers import Unavailable
from app.modules.practice.schemas import Source, StrictModel, TheoryLink

SITEMAP_SIZE = 1000
PAGE_SIZE = 30


class TopicDefinition(StrictModel):
    id: str
    label: str
    group: str
    exam_number: int | None
    material_ids: list[str]


TOPICS = TypeAdapter(list[TopicDefinition]).validate_json(
    (Path(__file__).resolve().parents[3] / "practice-catalog-topics.json").read_bytes()
)


class CatalogFilters(StrictModel):
    q: str | None = Field(default=None, max_length=200)
    topics: list[str] = Field(default_factory=list, max_length=100)
    sort: Literal["default", "difficulty_asc", "difficulty_desc"] = "default"

    @model_validator(mode="after")
    def normalize(self):
        self.q = self.q.strip() or None if self.q else None
        self.topics = sorted(set(self.topics))
        if not set(self.topics) <= {topic.id for topic in TOPICS}:
            raise ValueError("unknown topic")
        return self

    skill: str | None = Field(default=None, max_length=120)
    exam_number: int | None = Field(default=None, ge=1, le=27)
    difficulty: int | None = Field(default=None, ge=1, le=3)


class CatalogQuery(CatalogFilters):
    limit: Literal[10, 30, 50, 100] = 30

    @field_validator("limit", mode="before")
    @classmethod
    def parse_limit(cls, value):
        if isinstance(value, str) and value.isdecimal():
            return int(value)
        return value

    page: int = Field(default=1, ge=1, le=100000)


class CatalogTask(StrictModel):
    id: str
    title: str
    answer_instruction: str
    short_description: str | None
    difficulty: int
    estimated_minutes: int | None
    solution_revision: int
    skills: list[str]
    exam_numbers: list[int]
    sources: list[Source] = Field(default_factory=list)
    theory_links: list[TheoryLink] = Field(default_factory=list)
    topics: list[str] = Field(default_factory=list)


class CatalogPage(StrictModel):
    tasks: list[CatalogTask]
    page: int
    next_page: int | None
    limit: int = 30
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


def topic_predicate(topic: TopicDefinition):
    if topic.exam_number is not None:
        return TaskRecord.content["exam_numbers"].contains([topic.exam_number])
    return exists(
        select(LessonTask.task_id).where(
            LessonTask.task_id == TaskRecord.id,
            LessonTask.material_id.in_(topic.material_ids),
            LessonTask.published.is_(True),
        )
    )


def ordering(query: CatalogFilters):
    difficulty = TaskRecord.content["difficulty"].as_integer()
    if query.sort == "difficulty_asc":
        return (difficulty.asc(), TaskRecord.id.asc())
    if query.sort == "difficulty_desc":
        return (difficulty.desc(), TaskRecord.id.asc())
    return (TaskRecord.id.asc(),)


def filters(query: CatalogFilters):
    result: list[ColumnElement[bool]] = [visible()]
    if query.skill is not None:
        result.append(TaskRecord.content["skills"].contains([query.skill]))
    if query.exam_number is not None:
        result.append(TaskRecord.content["exam_numbers"].contains([query.exam_number]))
    if query.difficulty is not None:
        result.append(TaskRecord.content["difficulty"].as_integer() == query.difficulty)
    if query.topics:
        result.append(or_(*(topic_predicate(t) for t in TOPICS if t.id in query.topics)))
    if query.q:
        searchable = [
            TaskRecord.id,
            TaskRecord.content["title"].as_string(),
            TaskRecord.content["short_description"].as_string(),
        ]
        searchable.append(statement_text())
        matches = [value.icontains(query.q, autoescape=True) for value in searchable]
        if query.q.isdecimal() and 1 <= int(query.q) <= 27:
            matches.append(TaskRecord.content["exam_numbers"].contains([int(query.q)]))
        result.append(or_(*matches))
    return result


def statement_text():
    # Mirror rendered block fields, without hidden variants or structural metadata.
    # Preserve ordinary standalone code blocks, regardless of their language.
    paths = [
        f'$[*] ? (@.type != "code_variants").data.{field}'
        for field in (
            "markdown",
            "spans[*].text",
            "code",
            "caption",
            "alt",
            "accessible_description",
            "items[*]",
            "headers[*]",
            "rows[*][*]",
            "prompt",
            "steps[*]",
            "purpose",
            "pointers[*].label",
            "pointers[*].description",
        )
    ]
    paths.append(
        '$[*] ? (@.type == "code_variants").data.variants[*] ? (@.language == "python").code'
    )
    fragments = func.jsonb_path_query_array(
        TaskRecord.content["statement"], cast(paths[0], JSONPATH)
    )
    for path in paths[1:]:
        fragments = fragments.op("||")(
            func.jsonb_path_query_array(TaskRecord.content["statement"], cast(path, JSONPATH))
        )
    values = func.jsonb_array_elements_text(fragments).table_valued("value")
    return (
        select(func.string_agg(values.c.value, " "))
        .select_from(values)
        .correlate(TaskRecord)
        .scalar_subquery()
    )


async def page(session: AsyncSession, query: CatalogQuery) -> CatalogPage:
    names = (
        "title",
        "answer_instruction",
        "short_description",
        "difficulty",
        "estimated_minutes",
        "skills",
        "exam_numbers",
        "sources",
        "theory_links",
    )
    rows = (
        (
            await session.execute(
                select(
                    TaskRecord.id,
                    TaskRecord.solution_revision,
                    *(TaskRecord.content[name].label(name) for name in names),
                    *(topic_predicate(topic).label(f"topic_{i}") for i, topic in enumerate(TOPICS)),
                )
                .where(*filters(query))
                .order_by(*ordering(query))
                .offset((query.page - 1) * query.limit)
                .limit(query.limit)
            )
        )
        .mappings()
        .all()
    )
    total = (
        await session.scalar(select(func.count()).select_from(TaskRecord).where(*filters(query)))
        or 0
    )
    tasks = []
    for row in rows:
        item = dict(row)
        item["sources"] = [
            {k: v for k, v in source.items() if k != "is_public"}
            for source in item.get("sources") or []
            if source.get("is_public", True)
        ]
        item["theory_links"] = item.get("theory_links") or []
        item["topics"] = [topic.id for i, topic in enumerate(TOPICS) if item.pop(f"topic_{i}")]
        tasks.append(CatalogTask.model_validate(item))
    return CatalogPage(
        tasks=tasks,
        page=query.page,
        next_page=query.page + 1 if query.page * query.limit < total else None,
        limit=query.limit,
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


class TopicOption(TopicDefinition):
    count: int


class CatalogFacets(StrictModel):
    topics: list[TopicOption] = Field(default_factory=list)
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
    topic_counts = (
        await session.execute(
            select(
                *(func.count().filter(topic_predicate(topic)).label(topic.id) for topic in TOPICS)
            )
            .select_from(TaskRecord)
            .where(visible())
        )
    ).one()
    return CatalogFacets(
        topics=[
            TopicOption(**topic.model_dump(), count=count)
            for topic, count in zip(TOPICS, topic_counts, strict=True)
        ],
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
    current_difficulty = await session.scalar(
        select(TaskRecord.content["difficulty"].as_integer()).where(TaskRecord.id == task_id)
    )
    difficulty = TaskRecord.content["difficulty"].as_integer()
    after = TaskRecord.id > task_id
    if query.sort != "default":
        comparison = (
            difficulty > current_difficulty
            if query.sort == "difficulty_asc"
            else difficulty < current_difficulty
        )
        after = or_(comparison, and_(difficulty == current_difficulty, TaskRecord.id > task_id))
    next_id = await session.scalar(
        select(TaskRecord.id).where(after, *filters(query)).order_by(*ordering(query)).limit(1)
    )
    return NextTask(task_id=next_id)
