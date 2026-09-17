"""Catalog acceptance on a disposable 10,000-task PostgreSQL bank."""

import asyncio
import os
from datetime import UTC, datetime
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import event, insert, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.main import app
from app.modules.practice import catalog, readers
from app.modules.practice.models import (
    LessonTask,
    Provenance,
    TaskChecker,
    TaskExamNumber,
    TaskRecord,
    TaskSkill,
)
from app.modules.practice.schemas import Registry
from app.modules.practice.service import register_materials

REGISTRY = Registry.model_validate_json(
    (Path(__file__).parents[1] / "practice-registry.json").read_bytes()
)


@pytest.fixture(scope="module")
def bank():
    url = os.environ.get("PRACTICE_CATALOG_TEST_URL", "")
    if not url:
        pytest.skip("use scripts/tests/practice-catalog.test.sh")
    assert url.startswith("postgresql://infraege_import:infraege-116-import@127.0.0.1:")

    async def seed():
        engine = database_engine(url, role="infraege_import")
        migration = database_engine(
            url.replace(
                "infraege_import:infraege-116-import", "infraege_migration:infraege-116-migration"
            ),
            role="infraege_migration",
        )
        async with AsyncSession(migration) as registration, registration.begin():
            await register_materials(registration, REGISTRY)
        await migration.dispose()
        try:
            async with AsyncSession(engine) as session, session.begin():
                for start in range(0, 10002, 500):
                    rows = []
                    checkers = []
                    sources = []
                    skills = []
                    numbers = []
                    for i in range(start, min(start + 500, 10002)):
                        id = f"catalog-{i:05}"
                        rows.append(
                            dict(
                                id=id,
                                title=f"Учебная задача {i:05}",
                                difficulty=i % 3 + 1,
                                estimated_minutes=5,
                                answer_instruction="Введите число.",
                                interaction_type="production",
                                statement=[
                                    {"type": "text", "data": {"markdown": "Вычислите 40 + 2."}}
                                ],
                                hint=[{"type": "text", "data": {"markdown": "Сложите числа."}}],
                                explanation=[
                                    {"type": "text", "data": {"markdown": "Сумма равна 42."}}
                                ],
                                content_schema_version=1,
                                revision=1,
                                solution_revision=1,
                                catalog_visible=i < 10000,
                                archived=i == 10001,
                                created_at=datetime(2026, 1, 1, tzinfo=UTC),
                                updated_at=datetime(2026, 1, 1, tzinfo=UTC),
                            )
                        )
                        checkers.append(
                            dict(
                                task_id=id,
                                checker_type="exact_match",
                                answer_variants=["42"],
                                numeric_tolerance=None,
                            )
                        )
                        sources.append(
                            dict(
                                task_id=id,
                                position=0,
                                kind="unknown",
                                role="original",
                                primary=True,
                            )
                        )
                        skills.append(
                            dict(task_id=id, skill="python" if i % 2 == 0 else "recursion")
                        )
                        numbers.append(dict(task_id=id, number=17 if i % 2 == 0 else 16))
                    for model, values in [
                        (TaskRecord, rows),
                        (TaskChecker, checkers),
                        (Provenance, sources),
                        (TaskSkill, skills),
                        (TaskExamNumber, numbers),
                    ]:
                        await session.execute(insert(model), values)
                await session.execute(
                    insert(LessonTask),
                    [dict(material_id="rekursiya", task_id="catalog-10000", position=0)],
                )
        finally:
            await engine.dispose()

    asyncio.run(seed())
    return url.replace(
        "infraege_import:infraege-116-import", "infraege_runtime:infraege-116-runtime"
    )


def test_bounded_pagination_filtering_and_plans(bank):
    async def verify():
        engine = database_engine(bank)
        statements = []
        event.listen(
            engine.sync_engine,
            "before_cursor_execute",
            lambda conn, cursor, statement, parameters, context, executemany: statements.append(
                statement
            ),
        )
        try:
            async with AsyncSession(engine) as session:
                first = await catalog.page(session, catalog.CatalogQuery())
                assert len(statements) == 2
                assert first.total == 10000
                assert len(first.tasks) == 30 and first.tasks[0].id == "catalog-09999"
                assert all(
                    word not in first.model_dump_json()
                    for word in ("checker", "statement", "explanation", "answer_variants")
                )
                assert len(first.model_dump_json()) < 15000
                second = await catalog.page(session, catalog.CatalogQuery(cursor=first.next_cursor))
                assert len(second.tasks) == 30
                assert second.total == 10000
                assert not {t.id for t in first.tasks} & {t.id for t in second.tasks}
                with pytest.raises(catalog.InvalidCursor):
                    await catalog.page(
                        session, catalog.CatalogQuery(cursor=first.next_cursor, skill="python")
                    )
                with pytest.raises(catalog.InvalidCursor):
                    await catalog.page(
                        session, catalog.CatalogQuery(cursor=first.next_cursor, limit=100)
                    )
                filtered_query = catalog.CatalogQuery(
                    skill="python", exam_number=17, difficulty=1, limit=100
                )
                filtered = await catalog.page(session, filtered_query)
                assert len(filtered.tasks) == 100
                assert all(
                    t.skills == ["python"] and t.exam_numbers == [17] and t.difficulty == 1
                    for t in filtered.tasks
                )
                empty = await catalog.page(session, catalog.CatalogQuery(skill="absent"))
                assert empty.tasks == [] and empty.next_cursor is None
                assert empty.total == 0
                facets = await catalog.facets(session)
                assert facets.total == 10000
                assert facets.exam_numbers == [16, 17]
                assert {skill.value for skill in facets.skills} == {"python", "recursion"}
                assert all(skill.value != skill.label for skill in facets.skills)
                neighbor = await catalog.next_task(
                    session, first.tasks[-1].id, catalog.CatalogFilters()
                )
                assert neighbor.task_id == second.tasks[0].id
                assert (
                    await catalog.next_task(session, "catalog-00000", catalog.CatalogFilters())
                ).task_id is None
                assert (
                    await catalog.next_task(
                        session, "catalog-09998", catalog.CatalogFilters(skill="python")
                    )
                ).task_id == "catalog-09996"
                for invalid_id in ["catalog-10000", "catalog-10001", "missing", "catalog-09999"]:
                    with pytest.raises(readers.Unavailable):
                        await catalog.next_task(
                            session, invalid_id, catalog.CatalogFilters(skill="python")
                        )
                # The private bank never crosses the wire, even for sparse filters or final pages.
                for query in [
                    catalog.CatalogQuery(),
                    filtered_query,
                    catalog.CatalogQuery(skill="absent"),
                ]:
                    sql = str(
                        catalog.statement(query).compile(
                            engine.sync_engine, compile_kwargs={"literal_binds": True}
                        )
                    )
                    plan = (
                        await session.execute(
                            text("EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) " + sql)
                        )
                    ).scalar_one()[0]
                    assert plan["Execution Time"] < 2000
                    assert plan["Plan"]["Actual Rows"] <= query.limit + 1
                    print(
                        "CATALOG_PLAN",
                        query.model_dump(),
                        plan["Execution Time"],
                        "ms",
                        plan["Plan"]["Actual Rows"],
                        "rows",
                    )
                index = await catalog.sitemap_index(session)
                assert index.pages == 10
                sitemap = await catalog.sitemap_page(session, 10)
                assert len(sitemap.tasks) == 1000 and sitemap.tasks[-1].id == "catalog-09999"
                assert (await catalog.sitemap_page(session, 11)).tasks == []
                assert (
                    await readers.task(session, REGISTRY, "catalog-10000")
                ).content.catalog_visible is False
                with pytest.raises(readers.Unavailable):
                    await readers.task(session, REGISTRY, "catalog-10001")
                assert (await readers.check(session, REGISTRY, "catalog-09999", 1, "42")).correct
        finally:
            await engine.dispose()

    asyncio.run(verify())


def test_http_contract_and_failures(bank, monkeypatch):
    monkeypatch.setattr(settings, "database_url", bank)
    with TestClient(app) as client:
        result = client.get("/api/tasks")
        assert result.status_code == 200
        assert result.headers["cache-control"] == "no-store"
        assert len(result.json()["tasks"]) == 30
        for query in [
            "limit=101",
            "limit=0",
            "difficulty=4",
            "exam_number=28",
            "skill=../",
            "cursor=broken",
            "extra=true",
        ]:
            assert client.get("/api/tasks?" + query).status_code == 422
        assert client.get("/api/task-sitemap-index").json() == {"pages": 10}
        assert client.get("/api/task-sitemap?page=0").status_code == 422
        assert client.get("/api/tasks/catalog-10001").status_code == 404
        assert (
            client.post(
                "/api/tasks/catalog-09999/check", json={"answer": "42", "solution_revision": 2}
            ).status_code
            == 409
        )
        assert (
            client.post("/api/tasks/catalog-09999/check", json={"answer": "42"}).status_code == 422
        )
        assert client.get("/api/tasks/sitemap").status_code == 404
    monkeypatch.setattr(
        settings, "database_url", "postgresql://infraege_runtime:fixture@127.0.0.1:1/infraege"
    )
    with TestClient(app) as client:
        assert client.get("/api/tasks").status_code == 503
