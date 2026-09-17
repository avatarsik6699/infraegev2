"""Practice previews and explicit explanation/presentation semantics."""

import sqlalchemy as sa
from alembic import op

revision = "121_01"
down_revision = "120_01"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "task", sa.Column("short_description", sa.Text(), nullable=True), schema="practice"
    )
    op.add_column(
        "task",
        sa.Column("explanation_kind", sa.String(30), nullable=False, server_default="unclassified"),
        schema="practice",
    )
    op.create_check_constraint(
        "explanation_kind",
        "task",
        "explanation_kind IN ('unclassified','method','worked_solution')",
        schema="practice",
    )
    op.create_check_constraint(
        "short_description",
        "task",
        "short_description IS NULL OR length(short_description) BETWEEN 1 AND 300",
        schema="practice",
    )
    op.drop_constraint(op.f("ck_task_content_version"), "task", schema="practice", type_="check")
    op.create_check_constraint(
        "content_version", "task", "content_schema_version IN (1, 2)", schema="practice"
    )


def downgrade():
    raise RuntimeError("downgrade requires a separately reviewed recovery procedure")
