"""Small numbered catalog; predicates and next-task order are shared."""

from datetime import datetime
from pathlib import Path
from typing import Literal

from pydantic import Field, TypeAdapter, field_validator, model_validator
from sqlalchemy import ColumnElement, and_, exists, func, or_, select, tuple_
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.practice.models import LessonTask, TaskRecord
from app.modules.practice.readers import Unavailable
from app.modules.practice.schemas import Source, StrictModel, TheoryLink

SITEMAP_SIZE = 1000


class TopicDefinition(StrictModel):
    id: str
    label: str
    group: str
    exam_number: int | None
    exam_numbers: list[int] = Field(default_factory=list)
    material_ids: list[str]


TOPICS = TypeAdapter(list[TopicDefinition]).validate_json(
    (Path(__file__).resolve().parents[3] / "practice-catalog-topics.json").read_bytes()
)


TOPIC_ALIASES = {
    f"ege-{number}": topic.id
    for topic in TOPICS
    if len(topic.exam_numbers) > 1
    for number in topic.exam_numbers
}


class CatalogFilters(StrictModel):
    q: str | None = Field(default=None, max_length=200)
    topics: list[str] = Field(default_factory=list, max_length=100)
    sort: Literal["default", "difficulty_asc", "difficulty_desc"] = "default"

    @model_validator(mode="after")
    def normalize(self):
        self.q = self.q.strip() or None if self.q else None
        # Change 191 (F6): legacy single-number links of a merged topic (ege-20) keep working.
        self.topics = sorted({TOPIC_ALIASES.get(topic, topic) for topic in self.topics})
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
    if topic.exam_numbers:
        return TaskRecord.exam_numbers.overlap(topic.exam_numbers)
    return exists(
        select(LessonTask.task_id).where(
            LessonTask.task_id == TaskRecord.id,
            LessonTask.material_id.in_(topic.material_ids),
            LessonTask.published.is_(True),
        )
    )


def ordering(query: CatalogFilters):
    if query.sort == "difficulty_asc":
        return (TaskRecord.difficulty.asc(), TaskRecord.id.asc())
    if query.sort == "difficulty_desc":
        return (TaskRecord.difficulty.desc(), TaskRecord.id.asc())
    # Change 185 (F46): by exam number, then from easy to hard.
    return (TaskRecord.exam_order.asc(), TaskRecord.difficulty.asc(), TaskRecord.id.asc())


def search_term(value: str) -> str:
    """The normalization of the generated `search_text` column (migration 191_01)."""
    return value.lower().replace("ё", "е")


def filters(query: CatalogFilters):
    result: list[ColumnElement[bool]] = [visible()]
    if query.skill is not None:
        result.append(TaskRecord.skills.contains([query.skill]))
    if query.exam_number is not None:
        result.append(TaskRecord.exam_numbers.contains([query.exam_number]))
    if query.difficulty is not None:
        result.append(TaskRecord.difficulty == query.difficulty)
    if query.topics:
        result.append(or_(*(topic_predicate(t) for t in TOPICS if t.id in query.topics)))
    if query.q:
        matches = [TaskRecord.search_text.contains(search_term(query.q), autoescape=True)]
        if query.q.isdecimal() and 1 <= int(query.q) <= 27:
            matches.append(TaskRecord.exam_numbers.contains([int(query.q)]))
        result.append(or_(*matches))
    return result


async def memberships(session: AsyncSession, ids: list[str] | None = None) -> dict[str, set[str]]:
    """Published lesson materials per task, for lesson-defined catalog topics."""
    materials = {m for topic in TOPICS if topic.exam_number is None for m in topic.material_ids}
    statement = select(LessonTask.task_id, LessonTask.material_id).where(
        LessonTask.published.is_(True), LessonTask.material_id.in_(materials)
    )
    if ids is not None:
        statement = statement.where(LessonTask.task_id.in_(ids))
    result: dict[str, set[str]] = {}
    for task_id, material_id in await session.execute(statement):
        result.setdefault(task_id, set()).add(material_id)
    return result


def task_topics(exam_numbers: list[int], materials: set[str]) -> list[str]:
    return [
        topic.id
        for topic in TOPICS
        if (
            not set(topic.exam_numbers).isdisjoint(exam_numbers)
            if topic.exam_numbers
            else not materials.isdisjoint(topic.material_ids)
        )
    ]


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
    # Order and cut on small generated columns first; read `content` only for the page itself.
    ids = list(
        await session.scalars(
            select(TaskRecord.id)
            .where(*filters(query))
            .order_by(*ordering(query))
            .offset((query.page - 1) * query.limit)
            .limit(query.limit)
        )
    )
    rows = {
        row["id"]: row
        for row in (
            await session.execute(
                select(
                    TaskRecord.id,
                    TaskRecord.solution_revision,
                    TaskRecord.exam_numbers.label("exam_number_list"),
                    *(TaskRecord.content[name].label(name) for name in names),
                ).where(TaskRecord.id.in_(ids))
            )
        )
        .mappings()
        .all()
    }
    total = (
        await session.scalar(select(func.count()).select_from(TaskRecord).where(*filters(query)))
        or 0
    )
    materials = await memberships(session, ids)
    tasks = []
    for task_id in ids:
        item = dict(rows[task_id])
        item["sources"] = [
            {k: v for k, v in source.items() if k != "is_public"}
            for source in item.get("sources") or []
            if source.get("is_public", True)
        ]
        item["theory_links"] = item.get("theory_links") or []
        item["topics"] = task_topics(item.pop("exam_number_list"), materials.get(task_id, set()))
        tasks.append(CatalogTask.model_validate(item))
    return CatalogPage(
        tasks=tasks,
        page=query.page,
        next_page=query.page + 1 if query.page * query.limit < total else None,
        limit=query.limit,
        total=total,
    )


SUGGEST_LIMIT = 6
STATEMENT_KEYS = (
    "markdown",
    "spans",
    "text",
    "code",
    "caption",
    "alt",
    "accessible_description",
    "items",
    "headers",
    "rows",
    "prompt",
    "steps",
    "purpose",
    "pointers",
    "label",
    "description",
)


class SuggestQuery(CatalogFilters):
    @model_validator(mode="after")
    def searchable(self):
        if self.q is None or len(self.q) < 2:
            raise ValueError("suggestions need at least two characters")
        return self


class Suggestion(StrictModel):
    id: str
    title: str
    exam_numbers: list[int]
    difficulty: int
    title_highlights: list[tuple[int, int]]
    snippet: str | None
    snippet_highlights: list[tuple[int, int]]


class SuggestPage(StrictModel):
    tasks: list[Suggestion]
    total: int


def _strings(value) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [text for item in value for text in _strings(item)]
    if isinstance(value, dict):
        return [text for key in STATEMENT_KEYS if key in value for text in _strings(value[key])]
    return []


def statement_plain(statement: list[dict]) -> str:
    """Readable statement text in the same field scope as the generated `search_text`."""
    parts: list[str] = []
    for block in statement or []:
        data = block.get("data") or {}
        if block.get("type") == "code_variants":
            parts += [v["code"] for v in data.get("variants", []) if v.get("language") == "python"]
        else:
            parts += _strings(data)
    return " ".join(" ".join(part.split()) for part in parts if part.strip())


def highlights(text: str, term: str, limit: int = 3) -> list[tuple[int, int]]:
    folded = search_term(text)
    if len(folded) != len(text):
        return []
    found, start = [], folded.find(term)
    while start >= 0 and len(found) < limit:
        found.append((start, start + len(term)))
        start = folded.find(term, start + len(term))
    return found


def excerpt(text: str, term: str, before: int = 50, after: int = 110):
    marks = highlights(text, term)
    if not marks:
        short = text[: before + after]
        return (short + "…" if len(text) > len(short) else short), []
    start = max(0, marks[0][0] - before)
    if start:
        space = text.find(" ", start)
        start = space + 1 if 0 <= space < marks[0][0] else start
    end = min(len(text), marks[0][1] + after)
    prefix, suffix = ("…" if start else ""), ("…" if end < len(text) else "")
    shift = len(prefix) - start
    window = [(a + shift, b + shift) for a, b in marks if b <= end]
    return prefix + text[start:end] + suffix, window


async def suggest(session: AsyncSession, query: SuggestQuery) -> SuggestPage:
    ids = list(
        await session.scalars(
            select(TaskRecord.id)
            .where(*filters(query))
            .order_by(*ordering(query))
            .limit(SUGGEST_LIMIT)
        )
    )
    total = (
        await session.scalar(select(func.count()).select_from(TaskRecord).where(*filters(query)))
        or 0
    )
    rows = {
        row.id: row
        for row in await session.execute(
            select(
                TaskRecord.id,
                TaskRecord.exam_numbers,
                TaskRecord.difficulty,
                TaskRecord.content["title"].as_string().label("title"),
                TaskRecord.content["short_description"].as_string().label("summary"),
                TaskRecord.content["statement"].label("statement"),
            ).where(TaskRecord.id.in_(ids))
        )
    }
    term = search_term(query.q or "")
    tasks = []
    for task_id in ids:
        row = rows[task_id]
        text = row.summary or ""
        if not highlights(text, term):
            plain = statement_plain(row.statement)
            if highlights(plain, term) or not text:
                text = plain
        snippet, marks = excerpt(text, term) if text else (None, [])
        tasks.append(
            Suggestion(
                id=row.id,
                title=row.title,
                exam_numbers=row.exam_numbers,
                difficulty=row.difficulty,
                title_highlights=highlights(row.title, term),
                snippet=snippet,
                snippet_highlights=marks,
            )
        )
    return SuggestPage(tasks=tasks, total=total)


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
    numbers = {
        int(number): count
        for number, count in await session.execute(
            select(func.unnest(TaskRecord.exam_numbers).label("number"), func.count())
            .where(visible())
            .group_by("number")
        )
    }
    total, difficulties = (
        await session.execute(
            select(func.count(), func.array_agg(TaskRecord.difficulty.distinct())).where(visible())
        )
    ).one()
    skills = await session.scalars(
        select(func.unnest(TaskRecord.skills)).where(visible()).distinct()
    )
    visible_ids = set(await session.scalars(select(TaskRecord.id).where(visible())))
    materials = {
        task_id: found
        for task_id, found in (await memberships(session)).items()
        if task_id in visible_ids
    }
    exam_topics = [topic for topic in TOPICS if topic.exam_numbers]
    exam_counts = (
        await session.execute(
            select(
                *(
                    func.count().filter(topic_predicate(topic)).label(topic.id)
                    for topic in exam_topics
                )
            ).where(visible())
        )
    ).one()
    counts = {topic.id: count for topic, count in zip(exam_topics, exam_counts, strict=True)}
    for topic in TOPICS:
        if not topic.exam_numbers:
            counts[topic.id] = sum(
                not found.isdisjoint(topic.material_ids) for found in materials.values()
            )
    return CatalogFacets(
        topics=[TopicOption(**topic.model_dump(), count=counts[topic.id]) for topic in TOPICS],
        total=total or 0,
        exam_numbers=sorted(numbers),
        difficulties=sorted(d for d in difficulties or [] if d is not None),
        skills=[
            SkillOption(value=s, label=SKILL_LABELS.get(s, s)) for s in sorted(map(str, skills))
        ],
    )


async def next_task(session: AsyncSession, task_id: str, query: CatalogFilters) -> NextTask:
    if (
        await session.scalar(select(TaskRecord.id).where(TaskRecord.id == task_id, *filters(query)))
        is None
    ):
        raise Unavailable("current task is not in this selection")
    current_exam, current_difficulty = (
        await session.execute(
            select(TaskRecord.exam_order, TaskRecord.difficulty).where(TaskRecord.id == task_id)
        )
    ).one()
    difficulty = TaskRecord.difficulty
    after = tuple_(TaskRecord.exam_order, difficulty, TaskRecord.id) > (
        current_exam,
        current_difficulty,
        task_id,
    )
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
