"""Request-id context binding + Telegram error alerting.

docs/SPEC.md §7.2 — the "узнать о падении иначе, чем от случайной жалобы" requirement.
"""

from __future__ import annotations

import time
import uuid

import structlog
from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.alerting import send_alert

logger = structlog.get_logger(__name__)

REQUEST_ID_HEADER = "X-Request-ID"


class RequestContextMiddleware(BaseHTTPMiddleware):
    """Binds a request id into structlog's contextvars and logs request completion.

    Deliberately does not log `request.client.host` — nginx's own access log already
    records it under the operator's control; duplicating it into app logs would expand
    the personal-data surface for no operational benefit (docs/SPEC.md §8, 152-ФЗ).
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = request.headers.get(REQUEST_ID_HEADER, str(uuid.uuid4()))
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)

        start = time.monotonic()
        response = await call_next(request)
        duration_ms = round((time.monotonic() - start) * 1000, 2)

        logger.info(
            "request.completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=duration_ms,
        )
        response.headers[REQUEST_ID_HEADER] = request_id
        return response


class ErrorAlertMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        try:
            response = await call_next(request)
        except Exception as exc:  # noqa: BLE001 — must catch everything to alert on it
            logger.exception(
                "Unhandled exception", method=request.method, path=request.url.path
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


def register_middleware(app: FastAPI) -> None:
    # Added in this order so RequestContextMiddleware ends up outermost (Starlette wraps
    # most-recently-added middleware last) — request-id context must be bound before
    # ErrorAlertMiddleware's dispatch runs, so an alert's log line is correlatable.
    app.add_middleware(ErrorAlertMiddleware)
    app.add_middleware(RequestContextMiddleware)
