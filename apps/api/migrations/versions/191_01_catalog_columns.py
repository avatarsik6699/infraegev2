"""Generated catalog columns and multi-part checkers (Change 191).

Catalog reads used to extract every field from the compressed JSONB `content` per row, many times
per row and for the whole visible bank. Stored generated columns keep one source of truth while
sorting, filtering, facets and search read small plain columns. Additive: older releases ignore
the new columns, and imports keep writing only `content`.
"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "191_01"
down_revision = "140_01"
branch_labels = None
depends_on = None

VISIBLE = "catalog_visible IS TRUE AND archived IS FALSE"

# Mirrors the rendered statement fields: no hidden variants or structural metadata, ordinary
# standalone code blocks regardless of language, Python code of variant blocks.
STATEMENT_FIELDS = (
    "markdown",
    "spans[*].text",
    "code",
    "caption",
    "alt",
    "accessible_description",
    "items[*]",
    "headers[*]",
    "rows[*][*]",
    "prompt",
    "steps[*]",
    "purpose",
    "pointers[*].label",
    "pointers[*].description",
)
STATEMENT_PATHS = [
    f'$[*] ? (@.type != "code_variants").data.{field}' for field in STATEMENT_FIELDS
] + ['$[*] ? (@.type == "code_variants").data.variants[*] ? (@.language == "python").code']
STATEMENT_ARRAY = "\n    || ".join(
    f"jsonb_path_query_array(content->'statement', '{path}')" for path in STATEMENT_PATHS
)


def upgrade() -> None:
    op.execute(
        """
CREATE FUNCTION practice.task_int_array(value jsonb) RETURNS integer[]
LANGUAGE sql IMMUTABLE PARALLEL SAFE
RETURN ARRAY(SELECT jsonb_array_elements_text(value)::integer)
"""
    )
    op.execute(
        """
CREATE FUNCTION practice.task_text_array(value jsonb) RETURNS text[]
LANGUAGE sql IMMUTABLE PARALLEL SAFE
RETURN ARRAY(SELECT jsonb_array_elements_text(value))
"""
    )
    # Interpolates module constants only, never input.
    # nosemgrep: python.lang.security.audit.formatted-sql-query.formatted-sql-query, python.sqlalchemy.security.sqlalchemy-execute-raw-query.sqlalchemy-execute-raw-query  # noqa: E501
    op.execute(
        f"""
CREATE FUNCTION practice.task_search_text(task_id text, content jsonb) RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE
RETURN translate(lower(concat_ws(' ',
  task_id,
  content->>'title',
  content->>'short_description',
  (SELECT string_agg(value, ' ') FROM jsonb_array_elements_text(
    {STATEMENT_ARRAY})),
  (SELECT string_agg(source->>'original_id', ' ')
     FROM jsonb_array_elements(content->'sources') source
    WHERE coalesce((source->>'is_public')::boolean, true))
)), 'ё', 'е')
"""
    )
    # Hardened provisioning revokes default EXECUTE; generated values are computed by the writer.
    op.execute(
        "GRANT EXECUTE ON FUNCTION practice.task_int_array(jsonb), practice.task_text_array(jsonb),"
        " practice.task_search_text(text, jsonb) TO infraege_import"
    )
    columns = {
        "exam_numbers": (
            postgresql.ARRAY(sa.Integer()),
            "practice.task_int_array(content->'exam_numbers')",
        ),
        "exam_order": (sa.Integer(), "coalesce((content#>>'{exam_numbers,0}')::integer, 1000)"),
        "difficulty": (sa.Integer(), "(content->>'difficulty')::integer"),
        "skills": (postgresql.ARRAY(sa.Text()), "practice.task_text_array(content->'skills')"),
        "search_text": (sa.Text(), "practice.task_search_text(id, content)"),
    }
    for name, (type_, expression) in columns.items():
        op.add_column(
            "task",
            sa.Column(name, type_, sa.Computed(expression, persisted=True)),
            schema="practice",
        )
    op.create_index(
        "ix_task_catalog_order",
        "task",
        ["exam_order", "difficulty", "id"],
        schema="practice",
        postgresql_where=sa.text(VISIBLE),
    )
    op.create_index(
        "ix_task_catalog_difficulty",
        "task",
        ["difficulty", "id"],
        schema="practice",
        postgresql_where=sa.text(VISIBLE),
    )
    op.create_index(
        "ix_task_exam_numbers",
        "task",
        ["exam_numbers"],
        schema="practice",
        postgresql_using="gin",
    )
    op.create_index("ix_lesson_task_task_id", "lesson_task", ["task_id"], schema="practice")
    op.add_column(
        "task_checker", sa.Column("parts", postgresql.JSONB(), nullable=True), schema="practice"
    )
    op.execute("ANALYZE practice.task")


def downgrade() -> None:
    raise RuntimeError("Restore a backup into a separate database; no destructive downgrade")
