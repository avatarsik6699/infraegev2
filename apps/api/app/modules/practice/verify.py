"""Read-only restored-bank verification, usable without a test runner."""

import asyncio
import json
import os
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import database_engine
from app.modules.practice.files import checksum, safe_path
from app.modules.practice.models import FileObject, TaskChecker, TaskRecord
from app.modules.practice.readers import project
from app.modules.practice.schemas import Checker
from app.modules.practice.service import require_schema
from app.shared.checker import is_correct


async def main() -> None:
    engine = database_engine(os.environ["DATABASE_URL"], role="infraege_runtime")
    try:
        async with AsyncSession(engine) as session, session.begin():
            await require_schema(session)
            rows = list(await session.scalars(select(TaskRecord)))
            if not rows:
                raise ValueError("bank is empty")
            await project(session, rows)
            for checker in await session.scalars(select(TaskChecker)):
                value = Checker.model_validate(
                    {
                        key: getattr(checker, key)
                        for key in ("checker_type", "answer_variants", "numeric_tolerance")
                    }
                )
                if not all(is_correct(value, answer) for answer in checker.answer_variants):
                    raise ValueError("checker cannot accept its own answer")
            storage = Path(os.environ.get("TASK_FILES_DIR", "/task-files"))
            for file in await session.scalars(select(FileObject)):
                path = safe_path(storage, file.storage_key)
                if checksum(path) != file.checksum or path.stat().st_size != file.size_bytes:
                    raise ValueError("restored file mismatch")
            print(json.dumps({"status": "verified", "tasks": len(rows)}))
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
