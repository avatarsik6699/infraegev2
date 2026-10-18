"""Access state for the site and the internal check behind the paid-chunk gate."""

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response

from app.core.config import settings
from app.modules.entitlement.service import AccessUnavailable, Viewer
from app.modules.practice.schemas import StrictModel

router = APIRouter(prefix="/access", tags=["access"])


def viewer(request: Request) -> Viewer:
    return Viewer(request)


ViewerDep = Annotated[Viewer, Depends(viewer)]


class AccessView(StrictModel):
    paywall: bool
    signed_in: bool
    granted: bool
    until: datetime | None


@router.get("", response_model=AccessView)
async def get_access(current: ViewerDep, response: Response) -> AccessView:
    response.headers["Cache-Control"] = "private, no-store"
    try:
        state = await current.state()
    except AccessUnavailable as exc:
        raise HTTPException(503, "access unavailable") from exc
    return AccessView(
        paywall=settings.paywall_enabled,
        signed_in=state.user_id is not None,
        granted=state.granted or not settings.paywall_enabled,
        until=state.until,
    )


@router.get("/asset", status_code=204, include_in_schema=False)
async def check_asset(current: ViewerDep) -> Response:
    """Nginx `auth_request` for /assets/paid/: 204 serves the chunk, 403 refuses it."""
    if await current.may_read_paid():
        return Response(status_code=204, headers={"Cache-Control": "no-store"})
    return Response(status_code=403, headers={"Cache-Control": "no-store"})
