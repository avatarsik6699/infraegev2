"""Billing invariants and transactions (Change 192). HTTP stays in api.py, provider
calls stay outside database transactions, and every effect is idempotent."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from uuid import UUID
from zoneinfo import ZoneInfo

import structlog
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.modules.account.security import safe_return_path
from app.modules.billing.documents import current_offer
from app.modules.billing.models import AccessGrant, OfferAcceptance, Payment, Refund
from app.modules.billing.plans import PlanId, plans
from app.modules.billing.provider.port import PaymentProvider, Status

logger = structlog.get_logger(__name__)
MOSCOW = ZoneInfo("Europe/Moscow")
DAY = timedelta(days=1)
PAUSE_SHARE = 0.95


class CheckoutRefused(ValueError):
    """Checkout cannot start; `code` tells the site why."""

    def __init__(self, code: str) -> None:
        super().__init__(code)
        self.code = code


def now() -> datetime:
    return datetime.now(UTC)


async def lock_user(db: AsyncSession, user_id: UUID) -> None:
    """Serialize grant changes of one user: two payments never overlap their periods."""
    await db.execute(select(func.pg_advisory_xact_lock(func.hashtextextended(str(user_id), 192))))


async def revenue_kopecks(db: AsyncSession, year: int) -> int:
    """НПД income of a Moscow calendar year: paid amounts less completed refunds."""
    start = datetime(year, 1, 1, tzinfo=MOSCOW)
    end = datetime(year + 1, 1, 1, tzinfo=MOSCOW)
    paid = await db.scalar(
        select(func.coalesce(func.sum(Payment.amount_kopecks), 0)).where(
            Payment.status.in_(("succeeded", "refunded")),
            Payment.paid_at >= start,
            Payment.paid_at < end,
        )
    )
    returned = await db.scalar(
        select(func.coalesce(func.sum(Refund.amount_kopecks), 0)).where(
            Refund.status == "succeeded", Refund.completed_at >= start, Refund.completed_at < end
        )
    )
    return int(paid or 0) - int(returned or 0)


async def checkout_paused(db: AsyncSession) -> bool:
    year = now().astimezone(MOSCOW).year
    return await revenue_kopecks(db, year) >= settings.billing_npd_limit_kopecks * PAUSE_SHARE


async def checkout(
    db: AsyncSession,
    *,
    user_id: UUID,
    email: str,
    plan_id: PlanId,
    offer_version: str,
    idempotency_key: str,
    return_path: str | None,
    provider: str,
) -> Payment:
    """Record the accepted offer and a new payment; a repeated key returns the first one."""
    existing = await db.scalar(select(Payment).where(Payment.idempotency_key == idempotency_key))
    if existing is not None:
        if existing.user_id != user_id:
            raise CheckoutRefused("idempotency_conflict")
        return existing
    offer = current_offer()
    if offer_version != offer.version:
        raise CheckoutRefused("offer_outdated")
    if await checkout_paused(db):
        raise CheckoutRefused("checkout_paused")
    plan = plans()[plan_id]
    acceptance = OfferAcceptance(
        user_id=user_id, version=offer.version, text_sha256=offer.text_sha256
    )
    db.add(acceptance)
    await db.flush()
    payment = Payment(
        user_id=user_id,
        offer_acceptance_id=acceptance.id,
        plan=plan.id,
        amount_kopecks=plan.price_kopecks,
        days=plan.days,
        status="created",
        idempotency_key=idempotency_key,
        provider=provider,
        return_path=safe_return_path(return_path) if return_path else None,
        contact_email=email,
    )
    db.add(payment)
    await db.flush()
    return payment


async def grant_access(db: AsyncSession, payment: Payment) -> AccessGrant | None:
    """The period a succeeded payment buys: from now, or from the end of the access
    the user already has, so a repeat purchase extends it."""
    if payment.user_id is None:
        return None
    existing = await db.scalar(select(AccessGrant).where(AccessGrant.payment_id == payment.id))
    if existing is not None:
        return existing
    await lock_user(db, payment.user_id)
    moment = now()
    latest = await db.scalar(
        select(func.max(AccessGrant.ends_at)).where(
            AccessGrant.user_id == payment.user_id,
            AccessGrant.revoked_at.is_(None),
            AccessGrant.ends_at > moment,
        )
    )
    starts = max(moment, latest) if latest else moment
    grant = AccessGrant(
        payment_id=payment.id,
        user_id=payment.user_id,
        starts_at=starts,
        ends_at=starts + payment.days * DAY,
    )
    db.add(grant)
    await db.flush()
    return grant


@dataclass(frozen=True)
class Settled:
    """Plain values: the payment row expires when its transaction commits."""

    payment_id: UUID
    status: str
    newly_paid: bool


async def apply_status(db: AsyncSession, invoice_no: int, status: Status) -> Settled | None:
    """Move a payment to what the provider reports; replays change nothing."""
    payment = await db.scalar(
        select(Payment).where(Payment.invoice_no == invoice_no).with_for_update()
    )
    if payment is None:
        return None
    newly_paid = False
    if status.state == "succeeded" and payment.status in ("created", "pending", "failed"):
        if status.amount_kopecks is not None and status.amount_kopecks != payment.amount_kopecks:
            # never grant on a different sum; the operator settles it by hand
            logger.error(
                "billing.amount_mismatch",
                payment_id=str(payment.id),
                invoice_no=invoice_no,
                expected=payment.amount_kopecks,
                reported=status.amount_kopecks,
            )
            return Settled(payment.id, payment.status, False)
        payment.status = "succeeded"
        payment.paid_at = now()
        payment.provider_ref = status.provider_ref or payment.provider_ref
        payment.receipt_url = status.receipt_url or payment.receipt_url
        newly_paid = True
        await grant_access(db, payment)
        if payment.user_id is None:
            # the account was deleted while the buyer was paying: return the money
            await request_refund(db, payment, payment.amount_kopecks, "account_deleted")
    elif status.state == "failed" and payment.status in ("created", "pending"):
        payment.status = "failed"
    elif status.state == "pending" and payment.status == "created":
        payment.status = "pending"
    payment.updated_at = now()
    await db.flush()
    if newly_paid:
        logger.info(
            "billing.payment_succeeded",
            payment_id=str(payment.id),
            invoice_no=invoice_no,
            plan=payment.plan,
            amount_kopecks=payment.amount_kopecks,
        )
    return Settled(payment.id, payment.status, newly_paid)


def unused_kopecks(payment: Payment, grant: AccessGrant | None, at: datetime) -> int:
    """The refund for unused days (ЗоЗПП ст. 32): whole days left after today."""
    if grant is None or grant.revoked_at is not None or grant.ends_at <= at:
        return 0
    left = grant.ends_at - max(at, grant.starts_at)
    unused_days = min(payment.days, int(left / DAY))
    return payment.amount_kopecks * unused_days // payment.days


async def request_refund(
    db: AsyncSession, payment: Payment, amount_kopecks: int, reason: str, key: str | None = None
) -> Refund | None:
    """A refund to be executed by the operator CLI; one per key."""
    if amount_kopecks <= 0:
        return None
    idempotency_key = key or f"{reason}:{payment.id}"
    existing = await db.scalar(select(Refund).where(Refund.idempotency_key == idempotency_key))
    if existing is not None:
        return existing
    refund = Refund(
        payment_id=payment.id,
        amount_kopecks=min(amount_kopecks, payment.amount_kopecks),
        reason=reason,
        status="requested",
        idempotency_key=idempotency_key,
    )
    db.add(refund)
    await db.flush()
    logger.info(
        "billing.refund_requested",
        refund_id=str(refund.id),
        payment_id=str(payment.id),
        amount_kopecks=refund.amount_kopecks,
        reason=reason,
    )
    return refund


async def end_access(db: AsyncSession, payment: Payment) -> None:
    """A refund ends the period it paid for."""
    await db.execute(
        update(AccessGrant)
        .where(AccessGrant.payment_id == payment.id, AccessGrant.revoked_at.is_(None))
        .values(revoked_at=now())
    )


async def end_access_with_refund(db: AsyncSession, user_id: UUID, reason: str) -> None:
    """End every running access period and request refunds of its unused days; the
    operator CLI executes them."""
    moment = now()
    rows = await db.execute(
        select(Payment, AccessGrant)
        .join(AccessGrant, AccessGrant.payment_id == Payment.id)
        .where(
            Payment.user_id == user_id,
            AccessGrant.revoked_at.is_(None),
            AccessGrant.ends_at > moment,
        )
    )
    for payment, grant in rows.all():
        await request_refund(db, payment, unused_kopecks(payment, grant, moment), reason)
        grant.revoked_at = moment


async def on_account_deletion(db: AsyncSession, user_id: UUID) -> None:
    """Before the account row goes: end access, request refunds of the unused days and
    forget the contact. Payments stay, pseudonymized by `ON DELETE SET NULL`."""
    await end_access_with_refund(db, user_id, "account_deleted")
    await db.execute(update(Payment).where(Payment.user_id == user_id).values(contact_email=None))
    await db.flush()


@dataclass(frozen=True)
class RefundOutcome:
    id: UUID
    amount_kopecks: int
    status: str


async def execute_refund(
    db: AsyncSession, gateway: PaymentProvider, refund_id: UUID
) -> RefundOutcome:
    """Send a requested refund to the provider and record the outcome. The provider call
    happens between two short transactions; a retry reuses the same refund row."""
    async with db.begin():
        refund = await db.get(Refund, refund_id, with_for_update=True)
        if refund is None:
            raise ValueError("refund not found")
        if refund.status in ("pending", "succeeded"):
            return RefundOutcome(refund.id, refund.amount_kopecks, refund.status)
        payment = await db.get(Payment, refund.payment_id)
        assert payment is not None
        invoice_no, amount, full = (
            payment.invoice_no,
            refund.amount_kopecks,
            refund.amount_kopecks == payment.amount_kopecks,
        )
    result = await gateway.refund(invoice_no, amount, full, "Возврат оплаты Кодумка")
    async with db.begin():
        refund = await db.get(Refund, refund_id, with_for_update=True)
        assert refund is not None
        refund.provider_ref = result.provider_ref or refund.provider_ref
        await finish_refund(db, refund, result.state)
        outcome = RefundOutcome(refund.id, refund.amount_kopecks, refund.status)
    logger.info(
        "billing.refund_executed",
        refund_id=str(refund_id),
        state=result.state,
        message=result.message,
    )
    return outcome


async def finish_refund(db: AsyncSession, refund: Refund, state: str) -> None:
    refund.status = state
    if state != "succeeded":
        return
    refund.completed_at = now()
    payment = await db.get(Payment, refund.payment_id, with_for_update=True)
    assert payment is not None
    await end_access(db, payment)
    if refund.amount_kopecks >= payment.amount_kopecks:
        payment.status = "refunded"
        payment.updated_at = now()
