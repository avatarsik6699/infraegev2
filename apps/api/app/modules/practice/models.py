"""Persistence only. Validation and revision policy live in the task service."""

from datetime import datetime
from typing import Any

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TaskRecord(Base):
    __tablename__ = "task"
    __table_args__ = (
        CheckConstraint("difficulty BETWEEN 1 AND 3", name="difficulty"),
        CheckConstraint("estimated_minutes IS NULL OR estimated_minutes > 0", name="minutes"),
        CheckConstraint("revision > 0 AND solution_revision > 0", name="revisions"),
        CheckConstraint("content_schema_version = 1", name="content_version"),
        CheckConstraint(
            "jsonb_typeof(statement) = 'array' AND jsonb_array_length(statement)>0",
            name="statement",
        ),
        CheckConstraint(
            "jsonb_typeof(hint) = 'array' AND jsonb_typeof(explanation) = 'array'", name="blocks"
        ),
        CheckConstraint("NOT (archived AND catalog_visible)", name="visibility"),
    )
    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    difficulty: Mapped[int] = mapped_column(Integer)
    estimated_minutes: Mapped[int | None] = mapped_column(Integer)
    answer_instruction: Mapped[str] = mapped_column(Text)
    interaction_type: Mapped[str] = mapped_column(String(20))
    statement: Mapped[list[dict[str, Any]]] = mapped_column(JSONB)
    hint: Mapped[list[dict[str, Any]]] = mapped_column(JSONB)
    explanation: Mapped[list[dict[str, Any]]] = mapped_column(JSONB)
    content_schema_version: Mapped[int] = mapped_column(Integer)
    revision: Mapped[int] = mapped_column(Integer)
    solution_revision: Mapped[int] = mapped_column(Integer)
    catalog_visible: Mapped[bool] = mapped_column(Boolean, index=True)
    archived: Mapped[bool] = mapped_column(Boolean)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class TaskChecker(Base):
    __tablename__ = "task_checker"
    __table_args__ = (
        CheckConstraint("checker_type IN ('exact_match','numeric_tolerance')", name="type"),
        CheckConstraint(
            "jsonb_typeof(answer_variants)='array' AND jsonb_array_length(answer_variants)>0",
            name="answers",
        ),
        CheckConstraint("numeric_tolerance IS NULL OR numeric_tolerance >= 0", name="tolerance"),
    )
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    checker_type: Mapped[str] = mapped_column(String(30))
    answer_variants: Mapped[list[str]] = mapped_column(JSONB)
    numeric_tolerance: Mapped[float | None] = mapped_column(Float)


class Material(Base):
    __tablename__ = "material"
    id: Mapped[str] = mapped_column(String(160), primary_key=True)


class MaterialSection(Base):
    __tablename__ = "material_section"
    material_id: Mapped[str] = mapped_column(ForeignKey("practice.material.id"), primary_key=True)
    section: Mapped[str] = mapped_column(String(120), primary_key=True)


class LessonTask(Base):
    __tablename__ = "lesson_task"
    __table_args__ = (
        UniqueConstraint("material_id", "position", deferrable=True, initially="DEFERRED"),
        CheckConstraint("position >= 0", name="position"),
    )
    material_id: Mapped[str] = mapped_column(ForeignKey("practice.material.id"), primary_key=True)
    task_id: Mapped[str] = mapped_column(
        ForeignKey("practice.task.id"), primary_key=True, index=True
    )
    position: Mapped[int] = mapped_column(Integer)


class TheoryReference(Base):
    __tablename__ = "theory_reference"
    __table_args__ = (
        ForeignKeyConstraint(
            ["material_id", "section"],
            ["practice.material_section.material_id", "practice.material_section.section"],
        ),
    )
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    position: Mapped[int] = mapped_column(Integer, primary_key=True)
    material_id: Mapped[str] = mapped_column(ForeignKey("practice.material.id"))
    section: Mapped[str | None] = mapped_column(String(120))
    label: Mapped[str] = mapped_column(Text)


class TaskSkill(Base):
    __tablename__ = "task_skill"
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    skill: Mapped[str] = mapped_column(String(120), primary_key=True, index=True)


class TaskExamNumber(Base):
    __tablename__ = "task_exam_number"
    __table_args__ = (CheckConstraint("number BETWEEN 1 AND 27", name="number"),)
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    number: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)


class Provenance(Base):
    __tablename__ = "provenance"
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    position: Mapped[int] = mapped_column(Integer, primary_key=True)
    kind: Mapped[str] = mapped_column(String(30))
    role: Mapped[str] = mapped_column(String(30))
    primary: Mapped[bool] = mapped_column(Boolean)
    is_public: Mapped[bool] = mapped_column(Boolean, server_default="true")
    title: Mapped[str | None] = mapped_column(Text)
    author: Mapped[str | None] = mapped_column(Text)
    original_id: Mapped[str | None] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(Text)
    year: Mapped[int | None] = mapped_column(Integer)
    adaptation: Mapped[str | None] = mapped_column(Text)


class FileObject(Base):
    __tablename__ = "file_object"
    __table_args__ = (CheckConstraint("size_bytes > 0", name="size"),)
    checksum: Mapped[str] = mapped_column(String(64), primary_key=True)
    storage_key: Mapped[str] = mapped_column(String(80), unique=True)
    format: Mapped[str] = mapped_column(String(10))
    mime_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(BigInteger)


class TaskFileUsage(Base):
    __tablename__ = "task_file_usage"
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    checksum: Mapped[str] = mapped_column(ForeignKey("practice.file_object.checksum"))
    purpose: Mapped[str] = mapped_column(String(20))
    filename: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    attribution: Mapped[str | None] = mapped_column(Text)


class ImportOutcome(Base):
    __tablename__ = "import_outcome"
    package_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    checksum: Mapped[str] = mapped_column(String(64))
    task_count: Mapped[int] = mapped_column(Integer)
    committed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class TaskHistory(Base):
    __tablename__ = "task_history"
    task_id: Mapped[str] = mapped_column(ForeignKey("practice.task.id"), primary_key=True)
    revision: Mapped[int] = mapped_column(Integer, primary_key=True)
    solution_revision: Mapped[int] = mapped_column(Integer)
    package_id: Mapped[str] = mapped_column(ForeignKey("practice.import_outcome.package_id"))
    reason: Mapped[str] = mapped_column(Text)
    mode: Mapped[str] = mapped_column(String(20))
    snapshot: Mapped[dict[str, Any]] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
