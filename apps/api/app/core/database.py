"""Explicit PostgreSQL engines; sessions belong to callers, never to global state."""

from sqlalchemy import MetaData
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

SCHEMA_REVISION = "114_01"
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


def database_engine(value: str, *, role: str | None = None) -> AsyncEngine:
    url = make_url(value)
    if url.drivername not in {"postgresql", "postgresql+asyncpg"}:
        raise ValueError("PostgreSQL is required")
    if url.database != "infraege" or not url.host:
        raise ValueError("explicit application database host required")
    if url.query:
        raise ValueError("connection query overrides are not supported")
    if role and url.username != role:
        raise ValueError("database role does not match the operation")
    return create_async_engine(
        url.set(drivername="postgresql+asyncpg"),
        poolclass=NullPool,
        hide_parameters=True,
        connect_args={
            "timeout": 2,
            "command_timeout": 30,
            "server_settings": {"statement_timeout": "30000", "lock_timeout": "2000"},
        },
    )
