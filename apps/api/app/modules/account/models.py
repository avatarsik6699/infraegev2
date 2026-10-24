"""Account and server-owned progress records; credentials never store submitted answers."""

from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AccountUser(Base):
    __tablename__ = "account_user"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    privacy_consent_version: Mapped[str | None] = mapped_column(String(20))
    privacy_consented_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class AccountIdentity(Base):
    __tablename__ = "account_identity"
    __table_args__ = (
        UniqueConstraint("provider", "subject"),
        UniqueConstraint("user_id", "provider"),
        CheckConstraint("provider IN ('vk', 'yandex')", name="provider"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    provider: Mapped[str] = mapped_column(String(20), nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AccountPassword(Base):
    __tablename__ = "account_password"

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    email_normalized: Mapped[str] = mapped_column(String(320), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class AccountSession(Base):
    __tablename__ = "account_session"
    __table_args__ = (
        Index("ix_account_session_expires_at", "expires_at"),
        Index("ix_account_session_user_id", "user_id"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    token_hash: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    authenticated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    # Change 198 (SPEC §3, §6.2): the browser behind the session, for the device
    # limit and «Где выполнен вход». IP and city live only as long as the session.
    device_hash: Mapped[str | None] = mapped_column(String(64))
    device_label: Mapped[str | None] = mapped_column(String(80))
    ip: Mapped[str | None] = mapped_column(String(45))
    city: Mapped[str | None] = mapped_column(String(80))
    last_ip: Mapped[str | None] = mapped_column(String(45))
    last_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class AccountDevice(Base):
    """A browser that has signed in to the account; it makes «вход с нового
    устройства» mean a really new one. Forgotten 90 days after its last visit."""

    __tablename__ = "account_device"

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    device_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    label: Mapped[str] = mapped_column(String(80), nullable=False)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class AccountActivityDay(Base):
    """Per-account daily counters behind the operator signal report; 30 days kept."""

    __tablename__ = "account_activity_day"

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    day: Mapped[date] = mapped_column(Date, primary_key=True)
    new_devices: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    evictions: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    paid_chunks: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    solutions: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cities: Mapped[list[str]] = mapped_column(ARRAY(String(80)), nullable=False, default=list)


class AccountRestriction(Base):
    """A manual measure of the operator (SPEC §6.2), kept as evidence for an appeal."""

    __tablename__ = "account_restriction"
    __table_args__ = (
        CheckConstraint("kind IN ('warning', 'suspension', 'termination')", name="kind"),
        Index("ix_account_restriction_user", "user_id", "created_at"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    kind: Mapped[str] = mapped_column(String(20), nullable=False)
    reason: Mapped[str] = mapped_column(String(300), nullable=False)
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    lifted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class AccountToken(Base):
    __tablename__ = "account_token"
    __table_args__ = (
        CheckConstraint("purpose IN ('email_verify', 'password_reset')", name="purpose"),
        Index("ix_account_token_expires_at", "expires_at"),
        Index("ix_account_token_user_purpose", "user_id", "purpose"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    purpose: Mapped[str] = mapped_column(String(30), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    consumed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AccountProviderChallenge(Base):
    __tablename__ = "account_provider_challenge"
    __table_args__ = (
        CheckConstraint("flow IN ('login', 'link', 'reauth')", name="flow"),
        CheckConstraint("provider IN ('vk', 'yandex')", name="provider"),
        Index("ix_account_provider_challenge_expires_at", "expires_at"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    state_hash: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    browser_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    provider: Mapped[str] = mapped_column(String(20), nullable=False)
    code_verifier: Mapped[str] = mapped_column(String(255), nullable=False)
    nonce: Mapped[str] = mapped_column(String(255), nullable=False)
    flow: Mapped[str] = mapped_column(String(20), nullable=False)
    user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("practice.account_user.id", ondelete="CASCADE")
    )
    return_path: Mapped[str] = mapped_column(String(2048), nullable=False)
    # Change 198: a verified identity without an account waits here for the consent step.
    pending_subject: Mapped[str | None] = mapped_column(String(255))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    consumed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class ProgressResult(Base):
    __tablename__ = "progress_result"
    __table_args__ = (
        CheckConstraint(
            "context_kind IN ('topic_lesson', 'course_lesson', 'standalone')", name="context_kind"
        ),
        Index("ix_progress_result_user_context", "user_id", "context_kind", "context_id"),
    )

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.account_user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    context_kind: Mapped[str] = mapped_column(String(20), primary_key=True)
    context_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    task_id: Mapped[str] = mapped_column(
        String(120), ForeignKey("practice.task.id", ondelete="RESTRICT"), primary_key=True
    )
    solution_revision: Mapped[int] = mapped_column(Integer, primary_key=True)
    solved_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
