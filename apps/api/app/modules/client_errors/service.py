from __future__ import annotations

import structlog

from app.core.config import settings
from app.modules.client_errors.schemas import ClientErrorReport

logger = structlog.get_logger(__name__)


def record_client_error(report: ClientErrorReport) -> None:
    logger.error(
        "client.error_reported",
        error_source="browser",
        error_kind=report.kind,
        route_id=report.route_id,
        fingerprint=report.fingerprint,
        asset_path=report.asset_path,
        line=report.line,
        column=report.column,
        deploy_sha=settings.deploy_sha,
    )
