"""Base exception hierarchy — module exceptions subclass `AppException` and get a correct
JSON error response for free, since FastAPI already knows how to render `HTTPException`.
"""

from __future__ import annotations

from fastapi import HTTPException


class AppException(HTTPException):
    status_code: int = 500
    detail: str = "Internal server error"

    def __init__(self, detail: str | None = None) -> None:
        super().__init__(status_code=self.status_code, detail=detail or self.detail)
