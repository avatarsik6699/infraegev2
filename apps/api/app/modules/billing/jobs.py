"""Billing upkeep run by the host systemd timer (Change 192, SPEC §7.3).

    python -m app.modules.billing.jobs hourly   # settle open payments, refunds, notices
    python -m app.modules.billing.jobs daily    # reconcile with the provider, НПД limit

A session advisory lock keeps two runs from overlapping; every step is idempotent.
"""

from __future__ import annotations

import argparse
import asyncio
from datetime import timedelta

import structlog
from sqlalchemy import exists, select, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.core.config import settings
from app.core.database import database_engine
from app.core.logging import configure_logging
from app.modules.account.mail import MailUnavailable, send_account_mail
from app.modules.account.models import AccountPassword
from app.modules.billing import notices, provider, service
from app.modules.billing.models import AccessGrant, Payment, Refund
from app.modules.billing.provider.port import PaymentProvider, ProviderError, Status

logger = structlog.get_logger(__name__)
JOB_LOCK = 192_002
SETTLE_AFTER = timedelta(minutes=2)
EXPIRE_AFTER = timedelta(hours=1)
STUCK_AFTER = timedelta(hours=2)
ENDING_NOTICE = timedelta(days=3)
RECONCILE_WINDOW = timedelta(days=3)


async def settle_open(db: AsyncSession, gateway: PaymentProvider) -> None:
    """Payments whose notification never came: ask the provider; expire abandoned ones."""
    moment = service.now()
    async with db.begin():
        rows = (
            await db.execute(
                select(Payment.invoice_no, Payment.created_at, Payment.status).where(
                    Payment.status.in_(("created", "pending")),
                    Payment.created_at < moment - SETTLE_AFTER,
                )
            )
        ).all()
    for invoice_no, created_at, status in rows:
        try:
            reported = await gateway.fetch_status(invoice_no)
        except ProviderError:
            logger.warning("billing.settle_unavailable", invoice_no=invoice_no)
            continue
        if reported.state == "pending":
            if status == "created" and created_at < moment - EXPIRE_AFTER:
                reported = Status("failed")  # the buyer never paid: the order expires
            elif created_at < moment - STUCK_AFTER:
                logger.error("billing.payment_stuck", invoice_no=invoice_no)
                continue
            else:
                continue
        async with db.begin():
            settled = await service.apply_status(db, invoice_no, reported)
        if settled and settled.newly_paid:
            from app.modules.billing.api import mail_paid

            await mail_paid(db, settled.payment_id)


async def refund_states(db: AsyncSession, gateway: PaymentProvider) -> None:
    async with db.begin():
        pending = list(await db.scalars(select(Refund).where(Refund.status == "pending")))
    for refund in pending:
        if not refund.provider_ref:
            continue
        try:
            result = await gateway.refund_state(refund.provider_ref)
        except ProviderError:
            continue
        if result.state == "pending":
            continue
        async with db.begin():
            row = await db.get(Refund, refund.id, with_for_update=True)
            assert row is not None
            await service.finish_refund(db, row, result.state)
            payment = await db.get(Payment, row.payment_id)
        if result.state == "succeeded" and payment and payment.contact_email:
            subject, body = notices.refunded(row.amount_kopecks)
            try:
                await send_account_mail(payment.contact_email, subject, body)
            except MailUnavailable:
                logger.warning("billing.mail_unavailable", notice="refunded")


async def ending_notices(db: AsyncSession) -> None:
    """One neutral notice three days before access ends, unless a later grant follows."""
    moment = service.now()
    later = aliased(AccessGrant)
    async with db.begin():
        rows = (
            await db.execute(
                select(AccessGrant.id, AccessGrant.ends_at, AccountPassword.email_normalized)
                .join(AccountPassword, AccountPassword.user_id == AccessGrant.user_id)
                .where(
                    AccessGrant.revoked_at.is_(None),
                    AccessGrant.ending_notice_at.is_(None),
                    AccessGrant.ends_at > moment,
                    AccessGrant.ends_at <= moment + ENDING_NOTICE,
                    AccountPassword.email_verified_at.is_not(None),
                    ~exists().where(
                        later.user_id == AccessGrant.user_id,
                        later.revoked_at.is_(None),
                        later.ends_at > AccessGrant.ends_at,
                    ),
                )
            )
        ).all()
    for grant_id, ends_at, email in rows:
        subject, body = notices.ending(ends_at)
        try:
            await send_account_mail(email, subject, body)
        except MailUnavailable:
            logger.warning("billing.mail_unavailable", notice="ending")
            continue
        async with db.begin():
            grant = await db.get(AccessGrant, grant_id)
            if grant is not None:
                grant.ending_notice_at = service.now()


async def alert_operator(subject: str, body: str) -> None:
    if not settings.billing_operator_email:
        return
    try:
        await send_account_mail(
            settings.billing_operator_email, f"[infraege billing] {subject}", body
        )
    except MailUnavailable:
        logger.error("billing.operator_mail_unavailable", subject=subject)


async def reconcile(db: AsyncSession, gateway: PaymentProvider) -> None:
    """Recent payments must match the provider's record; mismatches go to the operator."""
    moment = service.now()
    async with db.begin():
        rows = (
            await db.execute(
                select(Payment.invoice_no, Payment.status).where(
                    Payment.status.in_(("succeeded", "refunded")),
                    Payment.paid_at > moment - RECONCILE_WINDOW,
                )
            )
        ).all()
    mismatches = []
    for invoice_no, status in rows:
        try:
            reported = await gateway.fetch_status(invoice_no)
        except ProviderError:
            mismatches.append(f"{invoice_no}: provider unavailable")
            continue
        if reported.state != status:
            mismatches.append(f"{invoice_no}: here {status}, provider {reported.state}")
        elif reported.provider_ref:
            async with db.begin():
                payment = await db.scalar(select(Payment).where(Payment.invoice_no == invoice_no))
                if payment is not None and not payment.provider_ref:
                    payment.provider_ref = reported.provider_ref
    if mismatches:
        logger.error("billing.reconcile_mismatch", count=len(mismatches))
        await alert_operator("сверка с провайдером", "\n".join(mismatches) + "\n")


async def npd_guard(db: AsyncSession) -> None:
    """Thresholds of the НПД yearly limit: 70 % log, 85 % mail, 95 % checkout pauses."""
    year = service.now().astimezone(service.MOSCOW).year
    async with db.begin():
        income = await service.revenue_kopecks(db, year)
    share = income / settings.billing_npd_limit_kopecks
    if share >= service.PAUSE_SHARE:
        logger.error("billing.npd_limit_pause", share=round(share, 3))
    elif share >= 0.85:
        await alert_operator(
            "лимит НПД",
            f"Выручка {year} года — {share:.0%} лимита НПД. При 95 % новые оплаты остановятся.\n",
        )
    elif share >= 0.7:
        logger.warning("billing.npd_limit_near", share=round(share, 3))


async def run(kind: str) -> int:
    configure_logging()
    if not settings.billing_enabled:
        return 0
    engine = database_engine(settings.account_database_url, role="infraege_app")
    try:
        async with engine.connect() as lock:
            if not await lock.scalar(text("SELECT pg_try_advisory_lock(:key)"), {"key": JOB_LOCK}):
                logger.info("billing.jobs_busy")
                return 0
            gateway = provider.current()
            async with AsyncSession(engine) as db:
                if kind == "hourly":
                    await settle_open(db, gateway)
                    await refund_states(db, gateway)
                    await ending_notices(db)
                else:
                    await reconcile(db, gateway)
                    await npd_guard(db)
            await lock.execute(text("SELECT pg_advisory_unlock(:key)"), {"key": JOB_LOCK})
    finally:
        await engine.dispose()
    logger.info("billing.jobs_done", kind=kind)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Billing upkeep (Change 192)")
    parser.add_argument("kind", choices=("hourly", "daily"))
    return asyncio.run(run(parser.parse_args().kind))


if __name__ == "__main__":
    raise SystemExit(main())
