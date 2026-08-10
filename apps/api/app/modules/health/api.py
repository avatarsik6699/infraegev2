from __future__ import annotations

import asyncio
from typing import Annotated
from urllib.parse import urlsplit

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import settings

router = APIRouter()


def _health_payload() -> dict[str, str]:
    return {"status": "ok", "version": settings.deploy_sha}


async def check_database() -> None:
    """Verify that PostgreSQL accepts a TCP connection without exposing its URL."""
    if not settings.database_url:
        return

    parsed = urlsplit(settings.database_url)
    if not parsed.hostname:
        raise RuntimeError("DATABASE_URL does not contain a host")

    _reader, writer = await asyncio.wait_for(
        asyncio.open_connection(parsed.hostname, parsed.port or 5432), timeout=2
    )
    writer.close()
    await writer.wait_closed()


async def require_database() -> None:
    try:
        await check_database()
    except (OSError, RuntimeError, TimeoutError) as exc:
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
