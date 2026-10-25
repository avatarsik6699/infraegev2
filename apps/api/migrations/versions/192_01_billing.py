"""Billing records for one-time access passes (Change 192, SPEC §3).

Additive: older releases ignore the new tables. The account write role may insert and
update billing rows but never delete them; offer acceptances are insert-only evidence.
Deleting an account sets their user link to NULL (`ON DELETE SET NULL`).
"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "192_01"
down_revision = "191_01"
branch_labels = None
depends_on = None

USER = "practice.account_user.id"


def upgrade() -> None:
    op.create_table(
        "billing_offer_acceptance",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey(USER, ondelete="SET NULL")
        ),
        sa.Column("version", sa.String(20), nullable=False),
        sa.Column("text_sha256", sa.String(64), nullable=False),
        sa.Column(
            "accepted_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        schema="practice",
    )
    op.create_table(
        "billing_payment",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "invoice_no",
            sa.BigInteger(),
            sa.Identity(start=1000),
            nullable=False,
            unique=True,
        ),
        sa.Column(
            "user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey(USER, ondelete="SET NULL")
        ),
        sa.Column(
            "offer_acceptance_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.billing_offer_acceptance.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("plan", sa.String(10), nullable=False),
        sa.Column("amount_kopecks", sa.Integer(), nullable=False),
        sa.Column("days", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(12), nullable=False),
        sa.Column("idempotency_key", sa.String(80), nullable=False, unique=True),
        sa.Column("provider", sa.String(20), nullable=False),
        sa.Column("provider_ref", sa.String(120)),
        sa.Column("return_path", sa.String(300)),
        sa.Column("contact_email", sa.String(320)),
        sa.Column("receipt_url", sa.Text()),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column("paid_at", sa.DateTime(timezone=True)),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.CheckConstraint("plan IN ('month', 'year')", name="plan"),
        sa.CheckConstraint(
            "status IN ('created', 'pending', 'succeeded', 'failed', 'refunded')", name="status"
        ),
        sa.CheckConstraint("amount_kopecks > 0", name="amount"),
        sa.CheckConstraint("days > 0", name="days"),
        schema="practice",
    )
    op.create_index(
        "ix_billing_payment_user_created",
        "billing_payment",
        ["user_id", "created_at"],
        schema="practice",
    )
    op.create_index(
        "ix_billing_payment_open",
        "billing_payment",
        ["status", "created_at"],
        schema="practice",
        postgresql_where=sa.text("status IN ('created', 'pending')"),
    )
    op.create_table(
        "access_grant",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "payment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.billing_payment.id", ondelete="RESTRICT"),
            nullable=False,
            unique=True,
        ),
        sa.Column(
            "user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey(USER, ondelete="SET NULL")
        ),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True)),
        # the «доступ заканчивается» mail went out for this grant (sent once)
        sa.Column("ending_notice_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint("ends_at > starts_at", name="period"),
        schema="practice",
    )
    op.create_index(
        "ix_access_grant_user_ends", "access_grant", ["user_id", "ends_at"], schema="practice"
    )
    op.create_table(
        "billing_refund",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "payment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.billing_payment.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("amount_kopecks", sa.Integer(), nullable=False),
        sa.Column("reason", sa.String(40), nullable=False),
        sa.Column("status", sa.String(12), nullable=False),
        sa.Column("idempotency_key", sa.String(80), nullable=False, unique=True),
        sa.Column("provider_ref", sa.String(120)),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint(
            "status IN ('requested', 'pending', 'succeeded', 'failed')", name="status"
        ),
        sa.CheckConstraint("amount_kopecks > 0", name="amount"),
        schema="practice",
    )
    op.create_table(
        "billing_provider_event",
        sa.Column("id", sa.BigInteger(), sa.Identity(), primary_key=True),
        sa.Column("provider", sa.String(20), nullable=False),
        sa.Column("event_key", sa.String(160), nullable=False),
        sa.Column("payload", postgresql.JSONB(), nullable=False),
        sa.Column("status", sa.String(12), nullable=False),
        sa.Column("error", sa.String(300)),
        sa.Column(
            "received_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.UniqueConstraint("provider", "event_key"),
        sa.CheckConstraint(
            "status IN ('received', 'processed', 'ignored', 'failed')", name="status"
        ),
        schema="practice",
    )
    tables = (
        "practice.billing_offer_acceptance, practice.billing_payment, practice.access_grant, "
        "practice.billing_refund, practice.billing_provider_event"
    )
    # nosemgrep: python.lang.security.audit.formatted-sql-query.formatted-sql-query, python.sqlalchemy.security.sqlalchemy-execute-raw-query.sqlalchemy-execute-raw-query  # noqa: E501
    op.execute(f"REVOKE ALL ON {tables} FROM infraege_runtime, infraege_import")
    op.execute("GRANT SELECT, INSERT ON practice.billing_offer_acceptance TO infraege_app")
    op.execute(
        "GRANT SELECT, INSERT, UPDATE ON practice.billing_payment, practice.access_grant, "
        "practice.billing_refund, practice.billing_provider_event TO infraege_app"
    )
    op.execute(
        "GRANT USAGE ON SEQUENCE practice.billing_payment_invoice_no_seq, "
        "practice.billing_provider_event_id_seq TO infraege_app"
    )


def downgrade() -> None:
    raise RuntimeError("Restore a backup into a separate database; no destructive downgrade")
