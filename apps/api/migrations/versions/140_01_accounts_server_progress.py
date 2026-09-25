"""Add account-owned credentials and context-scoped solved results."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "140_01"
down_revision = "122_01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "account_user",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column("deleted_at", sa.DateTime(timezone=True)),
        sa.Column("privacy_consent_version", sa.String(20)),
        sa.Column("privacy_consented_at", sa.DateTime(timezone=True)),
        schema="practice",
    )
    op.create_table(
        "account_identity",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.account_user.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("provider", sa.String(20), nullable=False),
        sa.Column("subject", sa.String(255), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.UniqueConstraint("provider", "subject"),
        sa.UniqueConstraint("user_id", "provider"),
        sa.CheckConstraint("provider IN ('vk', 'yandex', 'telegram')", name="provider"),
        schema="practice",
    )
    op.create_table(
        "account_password",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.account_user.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("email_normalized", sa.String(320), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("email_verified_at", sa.DateTime(timezone=True)),
        schema="practice",
    )
    op.create_table(
        "account_session",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.account_user.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("token_hash", sa.String(128), nullable=False, unique=True),
        sa.Column("authenticated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True)),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        schema="practice",
    )
    op.create_index(
        "ix_account_session_expires_at", "account_session", ["expires_at"], schema="practice"
    )
    op.create_index("ix_account_session_user_id", "account_session", ["user_id"], schema="practice")
    op.create_table(
        "account_token",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.account_user.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("purpose", sa.String(30), nullable=False),
        sa.Column("token_hash", sa.String(128), nullable=False, unique=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True)),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.CheckConstraint("purpose IN ('email_verify', 'password_reset')", name="purpose"),
        schema="practice",
    )
    op.create_index(
        "ix_account_token_expires_at", "account_token", ["expires_at"], schema="practice"
    )
    op.create_index(
        "ix_account_token_user_purpose",
        "account_token",
        ["user_id", "purpose"],
        schema="practice",
    )
    op.create_table(
        "account_provider_challenge",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("state_hash", sa.String(128), nullable=False, unique=True),
        sa.Column("browser_hash", sa.String(128), nullable=False),
        sa.Column("provider", sa.String(20), nullable=False),
        sa.Column("code_verifier", sa.String(255), nullable=False),
        sa.Column("nonce", sa.String(255), nullable=False),
        sa.Column("flow", sa.String(20), nullable=False),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        ),
        sa.Column("return_path", sa.String(2048), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True)),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.CheckConstraint("flow IN ('login', 'link', 'reauth')", name="flow"),
        sa.CheckConstraint("provider IN ('vk', 'yandex', 'telegram')", name="provider"),
        schema="practice",
    )
    op.create_index(
        "ix_account_provider_challenge_expires_at",
        "account_provider_challenge",
        ["expires_at"],
        schema="practice",
    )
    op.create_table(
        "progress_result",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("practice.account_user.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("context_kind", sa.String(20), primary_key=True),
        sa.Column("context_id", sa.String(160), primary_key=True),
        sa.Column(
            "task_id",
            sa.String(120),
            sa.ForeignKey("practice.task.id", ondelete="RESTRICT"),
            primary_key=True,
        ),
        sa.Column("solution_revision", sa.Integer(), primary_key=True),
        sa.Column(
            "solved_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.CheckConstraint(
            "context_kind IN ('topic_lesson', 'course_lesson', 'standalone')", name="context_kind"
        ),
        schema="practice",
    )
    op.create_index(
        "ix_progress_result_user_context",
        "progress_result",
        ["user_id", "context_kind", "context_id"],
        schema="practice",
    )
    op.execute(
        "REVOKE ALL ON practice.account_user, practice.account_identity, "
        "practice.account_password, "
        "practice.account_session, practice.account_token, practice.account_provider_challenge, "
        "practice.progress_result FROM infraege_runtime, infraege_import"
    )
    op.execute("GRANT USAGE ON SCHEMA practice TO infraege_app")
    op.execute(
        "GRANT SELECT ON practice.task, practice.task_checker, practice.lesson_task, "
        "practice.file_object TO infraege_app"
    )
    op.execute(
        "GRANT SELECT, INSERT, UPDATE, DELETE ON practice.account_user, practice.account_identity, "
        "practice.account_password, practice.account_session, practice.account_token, "
        "practice.account_provider_challenge, practice.progress_result TO infraege_app"
    )


def downgrade() -> None:
    raise RuntimeError("Restore a backup into a separate database; no destructive downgrade")
