"""Devices, operator restrictions and the provider consent step (Change 198, SPEC §3, §6.2).

Additive except for the provider CHECK: Telegram sign-in is removed (149-ФЗ ст. 10 ч. 8).
It was never enabled in production, so no identity can exist; the migration refuses to
narrow the constraint if one does, instead of deleting a login method.
"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "198_01"
down_revision = "192_01"
branch_labels = None
depends_on = None

USER = "practice.account_user.id"


def upgrade() -> None:
    op.execute(
        """
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM practice.account_identity WHERE provider = 'telegram') THEN
            RAISE EXCEPTION 'Telegram identities exist; migrate them before Change 198';
          END IF;
        END $$
        """
    )
    op.execute("DELETE FROM practice.account_provider_challenge WHERE provider = 'telegram'")
    for table in ("account_identity", "account_provider_challenge"):
        op.execute(
            f"ALTER TABLE practice.{table} DROP CONSTRAINT ck_{table}_provider, "
            f"ADD CONSTRAINT ck_{table}_provider CHECK (provider IN ('vk', 'yandex'))"
        )
    op.add_column(
        "account_provider_challenge",
        sa.Column("pending_subject", sa.String(255)),
        schema="practice",
    )
    for name, column in (
        ("device_hash", sa.String(64)),
        ("device_label", sa.String(80)),
        ("ip", sa.String(45)),
        ("city", sa.String(80)),
        ("last_ip", sa.String(45)),
        ("last_seen_at", sa.DateTime(timezone=True)),
    ):
        op.add_column("account_session", sa.Column(name, column), schema="practice")
    op.create_table(
        "account_device",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey(USER, ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("device_hash", sa.String(64), primary_key=True),
        sa.Column("label", sa.String(80), nullable=False),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=False),
        schema="practice",
    )
    op.create_table(
        "account_activity_day",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey(USER, ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("day", sa.Date(), primary_key=True),
        sa.Column("new_devices", sa.Integer(), nullable=False),
        sa.Column("evictions", sa.Integer(), nullable=False),
        sa.Column("paid_chunks", sa.Integer(), nullable=False),
        sa.Column("solutions", sa.Integer(), nullable=False),
        sa.Column("cities", postgresql.ARRAY(sa.String(80)), nullable=False),
        schema="practice",
    )
    op.create_table(
        "account_restriction",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey(USER, ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("kind", sa.String(20), nullable=False),
        sa.Column("reason", sa.String(300), nullable=False),
        sa.Column("note", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ends_at", sa.DateTime(timezone=True)),
        sa.Column("lifted_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint("kind IN ('warning', 'suspension', 'termination')", name="kind"),
        schema="practice",
    )
    op.create_index(
        "ix_account_restriction_user",
        "account_restriction",
        ["user_id", "created_at"],
        schema="practice",
    )
    tables = "practice.account_device, practice.account_activity_day, practice.account_restriction"
    op.execute(f"REVOKE ALL ON {tables} FROM infraege_runtime, infraege_import")
    op.execute(
        "GRANT SELECT, INSERT, UPDATE, DELETE ON practice.account_device, "
        "practice.account_activity_day TO infraege_app"
    )
    # Restrictions are evidence: the application never deletes them (an account deletion
    # removes them by cascade together with the account).
    op.execute("GRANT SELECT, INSERT, UPDATE ON practice.account_restriction TO infraege_app")


def downgrade() -> None:
    raise RuntimeError("Restore a backup into a separate database; no destructive downgrade")
