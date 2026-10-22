"""Explicit PostgreSQL engines; sessions belong to callers, never to global state."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import Request
from sqlalchemy import MetaData
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

SCHEMA_REVISION = "192_01"
SCHEMA_LOCK = 114001


class Base(DeclarativeBase):
    metadata = MetaData(
        schema="practice",
        naming_convention={
            "ix": "ix_%(table_name)s_%(column_0_name)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "pk": "pk_%(table_name)s",
        },
    )


def database_engine(value: str, *, role: str | None = None, pooled: bool = False) -> AsyncEngine:
    """One engine for one operation. ``pooled`` keeps connections open between uses; only
    the running application asks for it (``EnginePool``), operator tools and jobs do not."""
    url = make_url(value)
    if url.drivername not in {"postgresql", "postgresql+asyncpg"}:
        raise ValueError("PostgreSQL is required")
    if url.database != "infraege" or not url.host:
        raise ValueError("explicit application database host required")
    if url.query:
        raise ValueError("connection query overrides are not supported")
    if role and url.username != role:
        raise ValueError("database role does not match the operation")
    pool = (
        # a new connection costs ~20 ms (TCP, SCRAM, codecs) against ~0.3 ms for a query
        {"pool_size": 5, "max_overflow": 5, "pool_pre_ping": True, "pool_recycle": 1800}
        if pooled
        else {"poolclass": NullPool}
    )
    return create_async_engine(
        url.set(drivername="postgresql+asyncpg"),
        **pool,
        hide_parameters=True,
        connect_args={
            "timeout": 2,
            "command_timeout": 30,
            "server_settings": {"statement_timeout": "30000", "lock_timeout": "2000"},
        },
    )


class EnginePool:
    """The application's pooled engines, one per database URL and role, made on first use
    inside the running event loop and closed when the application stops."""

    def __init__(self) -> None:
        self._engines: dict[tuple[str, str], AsyncEngine] = {}

    def get(self, value: str, *, role: str) -> AsyncEngine:
        key = (value, role)
        if key not in self._engines:
            self._engines[key] = database_engine(value, role=role, pooled=True)
        return self._engines[key]

    async def dispose(self) -> None:
        engines, self._engines = list(self._engines.values()), {}
        for engine in engines:
            await engine.dispose()


@asynccontextmanager
async def request_engine(request: Request, value: str, *, role: str) -> AsyncIterator[AsyncEngine]:
    """The pooled engine of the running application, or a one-off engine when the
    application was started without its lifespan."""
    pool: EnginePool | None = getattr(request.app.state, "engines", None)
    if pool is not None:
        yield pool.get(value, role=role)
        return
    engine = database_engine(value, role=role)
    try:
        yield engine
    finally:
        await engine.dispose()
