from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ClientErrorReport(BaseModel):
    """Bounded diagnostic fields only; free-form exception data is deliberately forbidden."""

    model_config = ConfigDict(extra="forbid")

    kind: Literal[
        "render",
        "route_load",
        "chunk_load",
        "unhandled_error",
        "unhandled_rejection",
    ]
    route_id: str = Field(
        min_length=1,
        max_length=100,
        pattern=r"^/[A-Za-z0-9_.$/\-]+$",
    )
    fingerprint: str = Field(pattern=r"^[a-f0-9]{64}$")
    asset_path: str | None = Field(
        default=None,
        max_length=200,
        pattern=r"^/(?:_build|assets)/[A-Za-z0-9._/\-]+$",
    )
    line: int | None = Field(default=None, ge=1, le=10_000_000)
    column: int | None = Field(default=None, ge=1, le=100_000)
