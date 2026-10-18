"""Billing records (Change 192, SPEC §3): one-time access passes, no saved cards.

Rows outlive the account: deletion sets `user_id` to NULL and clears the contact,
so payments, offer acceptances and refunds stay as tax and consumer evidence.
"""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Identity,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

USER_FK = "practice.account_user.id"


class OfferAcceptance(Base):
    """Append-only: the offer version a buyer accepted by pressing «Оплатить»."""

    __tablename__ = "billing_offer_acceptance"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey(USER_FK, ondelete="SET NULL")
    )
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    text_sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    accepted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class Payment(Base):
    __tablename__ = "billing_payment"
    __table_args__ = (
        CheckConstraint("plan IN ('month', 'year')", name="plan"),
        CheckConstraint(
            "status IN ('created', 'pending', 'succeeded', 'failed', 'refunded')", name="status"
        ),
        CheckConstraint("amount_kopecks > 0", name="amount"),
        CheckConstraint("days > 0", name="days"),
        Index("ix_billing_payment_user_created", "user_id", "created_at"),
        Index(
            "ix_billing_payment_open",
            "status",
            "created_at",
            postgresql_where="status IN ('created', 'pending')",
        ),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    # the provider's invoice number (Robokassa InvId): a positive integer, unique
    invoice_no: Mapped[int] = mapped_column(
        BigInteger, Identity(start=1000), nullable=False, unique=True
    )
    user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey(USER_FK, ondelete="SET NULL")
    )
    offer_acceptance_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.billing_offer_acceptance.id", ondelete="RESTRICT"),
        nullable=False,
    )
    plan: Mapped[str] = mapped_column(String(10), nullable=False)
    amount_kopecks: Mapped[int] = mapped_column(Integer, nullable=False)
    days: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(12), nullable=False, default="created")
    idempotency_key: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    provider: Mapped[str] = mapped_column(String(20), nullable=False)
    provider_ref: Mapped[str | None] = mapped_column(String(120))
    # where the buyer returns after paying: an internal path, checked on input
    return_path: Mapped[str | None] = mapped_column(String(300))
    # the receipt goes to this address; cleared when the account is deleted
    contact_email: Mapped[str | None] = mapped_column(String(320))
    receipt_url: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AccessGrant(Base):
    """A period of access bought by one payment; a refund shortens or revokes it."""

    __tablename__ = "access_grant"
    __table_args__ = (
        CheckConstraint("ends_at > starts_at", name="period"),
        Index("ix_access_grant_user_ends", "user_id", "ends_at"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    payment_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.billing_payment.id", ondelete="RESTRICT"),
        nullable=False,
        unique=True,
    )
    user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey(USER_FK, ondelete="SET NULL")
    )
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    # the «доступ заканчивается» mail went out for this grant (sent once)
    ending_notice_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Refund(Base):
    __tablename__ = "billing_refund"
    __table_args__ = (
        CheckConstraint("status IN ('requested', 'pending', 'succeeded', 'failed')", name="status"),
        CheckConstraint("amount_kopecks > 0", name="amount"),
    )

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    payment_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("practice.billing_payment.id", ondelete="RESTRICT"),
        nullable=False,
    )
    amount_kopecks: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(12), nullable=False, default="requested")
    idempotency_key: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    provider_ref: Mapped[str | None] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ProviderEvent(Base):
    """Inbox of provider notifications; a replay of the same event is a no-op."""

    __tablename__ = "billing_provider_event"
    __table_args__ = (
        UniqueConstraint("provider", "event_key"),
        CheckConstraint("status IN ('received', 'processed', 'ignored', 'failed')", name="status"),
    )

    id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    provider: Mapped[str] = mapped_column(String(20), nullable=False)
    event_key: Mapped[str] = mapped_column(String(160), nullable=False)
    # the notification without signatures, emails or other personal fields
    payload: Mapped[dict[str, object]] = mapped_column(JSONB, nullable=False)
    status: Mapped[str] = mapped_column(String(12), nullable=False, default="received")
    error: Mapped[str | None] = mapped_column(String(300))
    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
