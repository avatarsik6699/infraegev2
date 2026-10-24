"""Access state for the site and the internal check behind the paid-chunk gate."""

from datetime import datetime
from typing import Annotated, Any, Literal, cast

from fastapi import APIRouter, Depends, HTTPException, Request, Response

from app.core.config import settings
from app.modules.entitlement.service import AccessUnavailable, Viewer, record_paid_chunk
from app.modules.practice.schemas import StrictModel

router = APIRouter(prefix="/access", tags=["access"])


def viewer(request: Request) -> Viewer:
    return Viewer(request)


ViewerDep = Annotated[Viewer, Depends(viewer)]


class RestrictionView(StrictModel):
    """Change 198 (SPEC §6.2): a manual measure, with the address to appeal it."""

    kind: Literal["warning", "suspension", "termination"]
    reason: str
    until: datetime | None
    contact: str


class AccessView(StrictModel):
    paywall: bool
    signed_in: bool
    granted: bool
    until: datetime | None
    restriction: RestrictionView | None = None


@router.get("", response_model=AccessView)
async def get_access(current: ViewerDep, response: Response) -> AccessView:
    response.headers["Cache-Control"] = "private, no-store"
    try:
        state = await current.state()
    except AccessUnavailable as exc:
        raise HTTPException(503, "access unavailable") from exc
    restriction = state.restriction
    return AccessView(
        paywall=settings.paywall_enabled,
        signed_in=state.user_id is not None,
        granted=state.granted or not settings.paywall_enabled,
        until=state.until,
        restriction=RestrictionView(
            kind=cast(Any, restriction.kind),
            reason=restriction.reason,
            until=restriction.until,
            contact=settings.contact_email,
        )
        if restriction
        else None,
    )


@router.get("/asset", status_code=204, include_in_schema=False)
async def check_asset(current: ViewerDep) -> Response:
    """Nginx `auth_request` for /assets/paid/: 204 serves the chunk, 403 refuses it."""
    if await current.may_read_paid():
        state = current.cached()
        if settings.paywall_enabled and state is not None and state.user_id is not None:
            await record_paid_chunk(current.request, state.user_id)
        return Response(status_code=204, headers={"Cache-Control": "no-store"})
    return Response(status_code=403, headers={"Cache-Control": "no-store"})
