import asyncio
import os

import pytest
from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import SCHEMA_LOCK, database_engine
from app.modules.health.api import liveness, require_database


def test_sql_readiness_missing_database_in_production(monkeypatch):
    monkeypatch.setattr(settings, "database_url", "")
    monkeypatch.setattr(settings, "app_env", "production")
    with pytest.raises(HTTPException) as failure:
        asyncio.run(require_database())
    assert failure.value.status_code == 503
    assert asyncio.run(liveness())["status"] == "ok"


def test_sql_readiness_role_failure_and_schema_lock(monkeypatch):
    value = os.environ.get("PRACTICE_TEST_URL")
    if not value:
        pytest.skip("requires isolated PostgreSQL runner")
    if not value.startswith("postgresql://infraege_import:infraege-114-import@127.0.0.1:"):
        pytest.fail("isolated identity required")
    reader = value.replace(
        "infraege_import:infraege-114-import", "infraege_runtime:infraege-114-runtime"
    )
    migration = database_engine(
        value.replace(
            "infraege_import:infraege-114-import", "infraege_migration:infraege-114-migration"
        )
    )
    monkeypatch.setattr(settings, "database_url", reader)

    async def scenario():
        await require_database()
        async with AsyncSession(migration) as session, session.begin():
            await session.execute(text("SELECT pg_advisory_xact_lock(:key)"), {"key": SCHEMA_LOCK})
            with pytest.raises(HTTPException) as failure:
                await require_database()
            assert failure.value.status_code == 503
            assert (await liveness())["status"] == "ok"
        monkeypatch.setattr(
            settings, "database_url", reader.replace("infraege-114-runtime", "incorrect-password")
        )
        with pytest.raises(HTTPException) as failure:
            await require_database()
        assert failure.value.detail == "database unavailable"

    asyncio.run(scenario())
