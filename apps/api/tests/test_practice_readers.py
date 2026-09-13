"""Public cutover contracts on the imported isolated PostgreSQL corpus."""

import asyncio
import os
from pathlib import Path

import pytest
from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import database_engine
from app.modules.practice import readers
from app.modules.practice.schemas import Registry
from app.modules.practice.service import Conflict


def test_public_reads_and_revision_check():
    url = os.environ.get("PRACTICE_TEST_URL", "")
    if not url:
        pytest.skip("requires isolated imported PostgreSQL corpus")
    if not url.startswith("postgresql://infraege_import:infraege-114-import@127.0.0.1:"):
        pytest.fail("test database identity rejected")
    registry = Registry.model_validate_json(
        (Path(__file__).parents[1] / "practice-registry.json").read_bytes()
    )

    async def verify():
        engine = database_engine(
            url.replace(
                "infraege_import:infraege-114-import", "infraege_runtime:infraege-114-runtime"
            )
        )
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
                lesson = await readers.lesson(session, registry, "topic", "rekursiya")
                assert len(statements) == 1
                assert len([task for task in lesson.tasks if task.id.startswith("rekursiya-")]) == 5
                assert "checker" not in lesson.model_dump_json()
                assert "task_checker" not in statements[0]
                statements.clear()
                course = await readers.course(session, registry, "python")
                assert len(statements) == 1
                assert len(course.lessons) == 28
                assert sum(len(lesson.tasks) for lesson in course.lessons) == 140
                result = await readers.check(
                    session, registry, "rekursiya-call-stack-trace", 1, "16"
                )
                assert result.correct and result.solution_revision == 1
                with pytest.raises(Conflict):
                    await readers.check(session, registry, "rekursiya-call-stack-trace", 2, "16")
                with pytest.raises(readers.Unavailable):
                    await readers.lesson(session, registry, "course", "rekursiya")
                hidden_registry = registry.model_copy(update={"materials": [], "courses": []})
                with pytest.raises(readers.Unavailable):
                    await readers.task(session, hidden_registry, "rekursiya-call-stack-trace")
                attachment = await readers.task(session, registry, "python-files-aggregate")
                assert attachment.deliveries[0].mime_type == "text/plain"
                assert attachment.deliveries[0].size_bytes == 6
                assert (
                    attachment.deliveries[0].url
                    == "/api/tasks/python-files-aggregate/files/statement-1"
                )
        finally:
            await engine.dispose()

    asyncio.run(verify())
