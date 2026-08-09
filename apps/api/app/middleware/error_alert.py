"""Middleware that sends a Telegram alert on unhandled exceptions or 5xx responses.

docs/SPEC.md §7.2 — the "узнать о падении иначе, чем от случайной жалобы" requirement.
"""

from __future__ import annotations

import logging

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.services.telegram import send_alert

logger = logging.getLogger(__name__)


class ErrorAlertMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        try:
            response = await call_next(request)
        except Exception as exc:  # noqa: BLE001 — must catch everything to alert on it
            logger.exception(
                "Unhandled exception on %s %s", request.method, request.url.path
            )
            await send_alert(
                f"🔥 Unhandled exception\n{request.method} {request.url.path}\n{exc!r}"
            )
            raise

        if response.status_code >= 500:
            await send_alert(
                f"⚠️ {response.status_code} on {request.method} {request.url.path}"
            )

        return response
