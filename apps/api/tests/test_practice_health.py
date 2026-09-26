import asyncio

import pytest
from fastapi import HTTPException

from app.core.config import settings
from app.modules.health.api import liveness, require_database

pytestmark = pytest.mark.pure


def test_sql_readiness_missing_database_in_production(monkeypatch):
    monkeypatch.setattr(settings, "database_url", "")
    monkeypatch.setattr(settings, "app_env", "production")
    with pytest.raises(HTTPException) as failure:
        asyncio.run(require_database())
    assert failure.value.status_code == 503
    assert asyncio.run(liveness())["status"] == "ok"
