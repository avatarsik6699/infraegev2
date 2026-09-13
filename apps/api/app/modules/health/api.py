from __future__ import annotations

import asyncio
from typing import Annotated

from asyncpg import PostgresError
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.modules.practice.service import require_schema

router = APIRouter()


def _health_payload() -> dict[str, str]:
    return {"status": "ok", "version": settings.deploy_sha}


async def check_database() -> None:
    """Authenticate, execute SQL and verify the exact supported schema under a shared lock."""
    if not settings.database_url:
        if settings.is_production:
            raise RuntimeError("production requires DATABASE_URL")
        return
    async with asyncio.timeout(2):
        engine = database_engine(settings.database_url, role="infraege_runtime")
        try:
            async with AsyncSession(engine) as session, session.begin():
                await require_schema(session)
        finally:
            await engine.dispose()


async def require_database() -> None:
    try:
        await check_database()
    except (OSError, RuntimeError, TimeoutError, ValueError, SQLAlchemyError, PostgresError) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database unavailable",
        ) from exc


@router.get("/health/live")
async def liveness() -> dict[str, str]:
    return _health_payload()


@router.get("/health/ready")
async def readiness(_database: Annotated[None, Depends(require_database)]) -> dict[str, str]:
    return _health_payload()


@router.get("/health")
async def health_alias(
    _database: Annotated[None, Depends(require_database)],
) -> dict[str, str]:
    return _health_payload()
