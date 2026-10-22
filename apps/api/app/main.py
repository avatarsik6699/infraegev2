from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.router import api_router
from app.core.database import EnginePool
from app.core.logging import configure_logging
from app.core.middleware import register_middleware
from app.modules.health.api import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.engines = EnginePool()
    try:
        yield
    finally:
        await app.state.engines.dispose()


def create_app() -> FastAPI:
    configure_logging()

    app = FastAPI(title="infraege API", lifespan=lifespan)
    register_middleware(app)
    # /health lives outside /api/ deliberately — infra/nginx/nginx.conf routes it separately
    # so monitoring doesn't share the checker endpoint's rate limit.
    app.include_router(health_router)
    app.include_router(api_router)
    return app


app = create_app()
