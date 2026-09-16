"""Private acquisition provenance and whole-lesson theory references."""

import sqlalchemy as sa
from alembic import op

revision = "120_01"
down_revision = "114_01"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "provenance",
        sa.Column("is_public", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        schema="practice",
    )
    op.alter_column("theory_reference", "section", nullable=True, schema="practice")
    # A NULL section bypasses the composite FK, so the material needs its own FK.
    op.create_foreign_key(
        "fk_theory_reference_material_id_material",
        "theory_reference",
        "material",
        ["material_id"],
        ["id"],
        source_schema="practice",
        referent_schema="practice",
    )


def downgrade():
    raise RuntimeError("downgrade requires a separately reviewed recovery procedure")
