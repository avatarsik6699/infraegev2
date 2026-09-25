"""Explicit migration credentials, one transaction and a bounded exclusive schema lock."""

import asyncio
import os

from alembic import context
from sqlalchemy import Connection, text

from app.core.database import SCHEMA_LOCK, Base, database_engine
from app.modules.account import models as account_models  # noqa: F401
from app.modules.practice import models  # noqa: F401


def migrate(connection: Connection) -> None:
    with connection.begin():
        if not 180000 <= int(connection.scalar(text("SHOW server_version_num"))) < 190000:
            raise RuntimeError("application PostgreSQL 18 required")
        if connection.scalar(text("SELECT current_user")) != "infraege_migration":
            raise RuntimeError("migration role required")
        if not connection.scalar(
            text("SELECT pg_try_advisory_xact_lock(:key)"), {"key": SCHEMA_LOCK}
        ):
            raise RuntimeError("schema is busy")
        context.configure(
            connection=connection,
            target_metadata=Base.metadata,
            version_table_schema="practice",
            include_schemas=True,
            include_name=lambda name, kind, parents: (
                name == "practice" if kind == "schema" else True
            ),
        )
        with context.begin_transaction():
            context.run_migrations()


async def run() -> None:
    engine = database_engine(os.environ["MIGRATION_DATABASE_URL"], role="infraege_migration")
    try:
        async with engine.connect() as connection:
            await connection.run_sync(migrate)
    finally:
        await engine.dispose()


if context.is_offline_mode():
    raise RuntimeError("migrations require an explicitly selected PostgreSQL instance")
asyncio.run(run())
