"""Current tasks only; private checker data is never part of a public projection."""

from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TaskRecord(Base):
    __tablename__ = "task"
    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    content: Mapped[dict[str, Any]] = mapped_column(JSONB)
    solution_revision: Mapped[int] = mapped_column(Integer)
    catalog_visible: Mapped[bool] = mapped_column(Boolean, index=True)
    archived: Mapped[bool] = mapped_column(Boolean)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class TaskChecker(Base):
    __tablename__ = "task_checker"
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    checker_type: Mapped[str] = mapped_column(String(30))
    answer_variants: Mapped[list[str]] = mapped_column(JSONB)
    numeric_tolerance: Mapped[float | None]


class LessonTask(Base):
    __tablename__ = "lesson_task"
    __table_args__ = (
        UniqueConstraint("material_id", "position", deferrable=True, initially="DEFERRED"),
    )
    material_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    position: Mapped[int] = mapped_column(Integer)
    kind: Mapped[str] = mapped_column(String(20))
    course_id: Mapped[str | None] = mapped_column(String(120))
    published: Mapped[bool] = mapped_column(Boolean)


class FileObject(Base):
    __tablename__ = "file_object"
    checksum: Mapped[str] = mapped_column(String(64), primary_key=True)
    storage_key: Mapped[str] = mapped_column(String(80), unique=True)
    format: Mapped[str] = mapped_column(String(10))
    mime_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(Integer)
