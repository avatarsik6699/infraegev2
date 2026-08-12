"""Aggregates every module's router — prefix stays `/api`, NOT `/api/v1`.

Versioning the prefix would silently break the nginx `location /api/tasks/` rate-limit
match (docs/SPEC.md §8's anti-scraping protection) and contradict the published contract
in docs/SPEC.md §4.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.modules.client_errors.api import router as client_errors_router
from app.modules.tasks.api import router as tasks_router

api_router = APIRouter(prefix="/api")
api_router.include_router(tasks_router)
api_router.include_router(client_errors_router)
