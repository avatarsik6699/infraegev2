from __future__ import annotations

from app.core.exceptions import AppException


class TaskNotFound(AppException):
    status_code = 404
    detail = "Task not found"
