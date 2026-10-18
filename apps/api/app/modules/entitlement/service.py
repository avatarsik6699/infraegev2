"""Who may read paid material: an active access grant, never the sign-in alone."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import UTC, datetime
from uuid import UUID

import structlog
from asyncpg import PostgresError
from fastapi import Request
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.modules.account import service as account_service
from app.modules.account.api import raw_session_token
from app.modules.billing.models import AccessGrant

logger = structlog.get_logger(__name__)


class AccessUnavailable(RuntimeError):
    """The account database did not answer; access is unknown, not denied."""


@dataclass(frozen=True)
class AccessState:
    user_id: UUID | None
    until: datetime | None

    @property
    def granted(self) -> bool:
        return self.until is not None


def now() -> datetime:
    return datetime.now(UTC)


async def access_until(db: AsyncSession, user_id: UUID) -> datetime | None:
    """The end of the viewer's access, when a grant covers the current moment.
    Grants of repeat purchases follow each other, so the latest end is the end."""
    moment = now()
    covered = await db.scalar(
        select(AccessGrant.id)
        .where(
            AccessGrant.user_id == user_id,
            AccessGrant.revoked_at.is_(None),
            AccessGrant.starts_at <= moment,
            AccessGrant.ends_at > moment,
        )
        .limit(1)
    )
    if covered is None:
        return None
    return await db.scalar(
        select(func.max(AccessGrant.ends_at)).where(
            AccessGrant.user_id == user_id,
            AccessGrant.revoked_at.is_(None),
            AccessGrant.ends_at > moment,
        )
    )


async def resolve(request: Request) -> AccessState:
    """The viewer's account and access, read with the account role."""
    token = raw_session_token(request)
    if not token:
        return AccessState(None, None)
    engine = None
    try:
        async with asyncio.timeout(5):
            engine = database_engine(settings.account_database_url, role="infraege_app")
            async with AsyncSession(engine) as db:
                current = await account_service.current_session(db, token)
                if current is None:
                    return AccessState(None, None)
                return AccessState(current.user_id, await access_until(db, current.user_id))
    except (OSError, TimeoutError, SQLAlchemyError, PostgresError, ValueError) as exc:
        logger.error("entitlement.database_unavailable", error_type=type(exc).__name__)
        raise AccessUnavailable("access unavailable") from exc
    finally:
        if engine is not None:
            await engine.dispose()


class Viewer:
    """The reader of one request. Its access is read only when a paid item is
    asked for, so free pages never touch the account database."""

    def __init__(self, request: Request) -> None:
        self.request = request
        self._state: AccessState | None = None

    async def state(self) -> AccessState:
        if self._state is None:
            self._state = await resolve(self.request)
        return self._state

    async def may_read_paid(self) -> bool:
        if not settings.paywall_enabled:
            return True
        try:
            return (await self.state()).granted
        except AccessUnavailable:
            # Fail closed: an outage shows the paywall, never the paid text.
            return False


SUBSCRIPTION_REQUIRED = "subscription_required"


async def task_is_paid(session: AsyncSession, task_id: str) -> bool:
    """Whether the paywall closes this task; unknown tasks are left to the reader."""
    if not settings.paywall_enabled:
        return False
    from app.modules.entitlement.registry import task_access
    from app.modules.practice.models import TaskRecord

    content = await session.scalar(select(TaskRecord.content).where(TaskRecord.id == task_id))
    return content is not None and task_access(content) == "paid"
