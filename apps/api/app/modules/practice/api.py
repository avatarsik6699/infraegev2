"""Anonymous HTTP boundary for the server-owned lesson practice bank."""

import asyncio
import os
import re
from collections.abc import AsyncIterator
from pathlib import Path
from typing import Annotated
from urllib.parse import quote

from asyncpg import PostgresError
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.modules.practice import catalog, readers
from app.modules.practice.files import MIME, safe_path
from app.modules.practice.schemas import PublicTask
from app.modules.practice.service import Conflict

router = APIRouter()


async def session(response: Response) -> AsyncIterator[AsyncSession]:
    response.headers["Cache-Control"] = "no-store"
    engine = None
    try:
        async with asyncio.timeout(5):
            engine = database_engine(settings.database_url, role="infraege_runtime")
            async with AsyncSession(engine) as connection, connection.begin():
                yield connection
    except readers.Unavailable as exc:
        raise HTTPException(404, "task or material unavailable") from exc
    except Conflict as exc:
        raise HTTPException(409, "refresh the task") from exc
    except (OSError, TimeoutError, SQLAlchemyError, PostgresError, ValueError) as exc:
        raise HTTPException(503, "practice unavailable") from exc
    finally:
        if engine is not None:
            await engine.dispose()


Session = Annotated[AsyncSession, Depends(session)]


@router.get("/tasks", response_model=catalog.CatalogPage)
async def get_catalog(
    query: Annotated[catalog.CatalogQuery, Query()], connection: Session
) -> catalog.CatalogPage:
    return await catalog.page(connection, query)


@router.get("/task-sitemap-index", response_model=catalog.SitemapIndex)
async def get_sitemap_index(connection: Session) -> catalog.SitemapIndex:
    return await catalog.sitemap_index(connection)


@router.get("/task-sitemap", response_model=catalog.SitemapPage)
async def get_sitemap(
    connection: Session, page: Annotated[int, Query(ge=1, le=49999)] = 1
) -> catalog.SitemapPage:
    return await catalog.sitemap_page(connection, page)


@router.get("/tasks/facets", response_model=catalog.CatalogFacets)
async def get_facets(connection: Session) -> catalog.CatalogFacets:
    return await catalog.facets(connection)


@router.get("/tasks/{task_id}/next", response_model=catalog.NextTask)
async def get_next_task(
    task_id: str, query: Annotated[catalog.CatalogFilters, Query()], connection: Session
) -> catalog.NextTask:
    return await catalog.next_task(connection, task_id, query)


@router.get("/tasks/{task_id}", response_model=PublicTask)
async def get_task(task_id: str, connection: Session) -> PublicTask:
    return await readers.task(connection, task_id)


@router.get(
    "/learning-materials/{kind}/{material_id}/practice", response_model=readers.LessonPractice
)
async def get_lesson(kind: str, material_id: str, connection: Session) -> readers.LessonPractice:
    return await readers.lesson(connection, kind, material_id)


@router.get("/courses/{course_id}/practice-summary", response_model=readers.CourseSummary)
async def get_course(course_id: str, connection: Session) -> readers.CourseSummary:
    return await readers.course(connection, course_id)


@router.get("/tasks/{task_id}/files/{usage_id}", response_class=Response)
async def get_file(task_id: str, usage_id: str, connection: Session) -> Response:
    usage, object_file = await readers.file(connection, task_id, usage_id)
    if (
        not re.fullmatch(r"[a-f0-9]{64}", object_file.storage_key)
        or object_file.storage_key != object_file.checksum
    ):
        raise ValueError("file unavailable")
    storage = Path(os.environ.get("TASK_FILES_DIR", "/var/lib/infraege/task-files"))
    path = safe_path(storage, object_file.storage_key)
    if (
        path.stat().st_size != object_file.size_bytes
        or MIME.get(object_file.format) != object_file.mime_type
    ):
        raise ValueError("file unavailable")
    disposition = "inline" if usage.purpose == "image" else "attachment"
    return Response(
        headers={
            "X-Accel-Redirect": f"/_task-files/{object_file.storage_key}",
            "Content-Type": object_file.mime_type,
            "Content-Disposition": (
                f"{disposition}; filename*=UTF-8''{quote(usage.filename, safe='')}"
            ),
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "no-store",
        }
    )
