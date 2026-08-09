"""Structured logging — console renderer in dev, JSON in prod, level from `settings.log_level`.

Deliberately does not scrub password/token fields (the reference convention this was ported
from is for a project with auth; this product has no secrets flowing through request logs).
"""

from __future__ import annotations

import logging
import sys

import structlog

from app.core.config import settings


def configure_logging() -> None:
    renderer = (
        structlog.processors.JSONRenderer()
        if settings.is_production
        else structlog.dev.ConsoleRenderer()
    )

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            renderer,
        ],
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )

    logging.basicConfig(stream=sys.stdout, level=settings.log_level)
