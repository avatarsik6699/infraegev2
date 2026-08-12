from __future__ import annotations

from fastapi import APIRouter, Response, status

from app.modules.client_errors.schemas import ClientErrorReport
from app.modules.client_errors.service import record_client_error

router = APIRouter(prefix="/client-errors", tags=["client-errors"])


@router.post(
    "",
    operation_id="reportClientError",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def report_client_error(body: ClientErrorReport) -> Response:
    record_client_error(body)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
