"""Minimal bank on a NEW database; original databases remain archived."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "122_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "task",
        sa.Column("id", sa.String(120), primary_key=True),
        sa.Column("content", postgresql.JSONB(), nullable=False),
        sa.Column("solution_revision", sa.Integer(), nullable=False),
        sa.Column("catalog_visible", sa.Boolean(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        schema="practice",
    )
    op.create_index("ix_task_catalog_visible", "task", ["catalog_visible"], schema="practice")
    op.create_table(
        "task_checker",
        sa.Column("task_id", sa.String(120), sa.ForeignKey("practice.task.id"), primary_key=True),
        sa.Column("checker_type", sa.String(30), nullable=False),
        sa.Column("answer_variants", postgresql.JSONB(), nullable=False),
        sa.Column("numeric_tolerance", sa.Float()),
        schema="practice",
    )
    op.create_table(
        "lesson_task",
        sa.Column("material_id", sa.String(160), primary_key=True),
        sa.Column("task_id", sa.String(120), sa.ForeignKey("practice.task.id"), primary_key=True),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("kind", sa.String(20), nullable=False),
        sa.Column("course_id", sa.String(120)),
        sa.Column("published", sa.Boolean(), nullable=False),
        sa.UniqueConstraint("material_id", "position", deferrable=True, initially="DEFERRED"),
        schema="practice",
    )
    op.create_table(
        "file_object",
        sa.Column("checksum", sa.String(64), primary_key=True),
        sa.Column("storage_key", sa.String(80), nullable=False, unique=True),
        sa.Column("format", sa.String(10), nullable=False),
        sa.Column("mime_type", sa.String(100), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        schema="practice",
    )
    op.execute("GRANT SELECT ON ALL TABLES IN SCHEMA practice TO infraege_runtime, infraege_backup")
    op.execute(
        "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA practice TO infraege_import"
    )


def downgrade() -> None:
    raise RuntimeError("Restore a backup into a separate database; no destructive downgrade")
