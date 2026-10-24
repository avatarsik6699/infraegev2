"""What the operator console on sre.infraege.ru sees (Change 199, SPEC §6.2): the
`kodumka.operator/1` report the agent ships every ten minutes and the `kodumka.account/1`
card of one account. Both name a person (email, IP, city) by the architect's decision of
2026-10-24 and travel only to the operator's own monitoring server; passwords, password
hashes and payment card data are never part of them."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.account import restrictions, service
from app.modules.account.models import (
    AccountActivityDay,
    AccountDevice,
    AccountIdentity,
    AccountPassword,
    AccountRestriction,
    AccountUser,
)
from app.modules.billing.models import AccessGrant, Payment, Refund
from app.modules.entitlement.service import access_until

SIGNAL_DAYS = 7
CARD_DAYS = 30


def iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


async def email_of(db: AsyncSession, user_id: UUID) -> str | None:
    credential = await db.get(AccountPassword, user_id)
    return credential.email_normalized if credential else None


async def active_sessions(db: AsyncSession, user_id: UUID) -> list[dict[str, Any]]:
    return [
        {
            "id": str(row.id),
            "label": row.device_label or "Браузер",
            "city": row.city,
            "ip": row.last_ip or row.ip,
            "first_ip": row.ip,
            "signed_in_at": iso(row.authenticated_at),
            "last_seen_at": iso(row.last_seen_at or row.authenticated_at),
        }
        for row in await service.active_sessions(db, user_id)
    ]


def restriction_view(row: AccountRestriction) -> dict[str, Any]:
    return {
        "id": str(row.id),
        "kind": row.kind,
        "reason": row.reason,
        "created_at": iso(row.created_at),
        "ends_at": iso(row.ends_at),
        "lifted_at": iso(row.lifted_at),
    }


async def operator_document(db: AsyncSession) -> dict[str, Any]:
    """`kodumka.operator/1`: accounts above a sharing threshold, running measures and refunds
    that still need the operator."""
    signals = []
    for row in await restrictions.signals(db, SIGNAL_DAYS):
        user_id = UUID(row["user"])
        signals.append(
            {
                "user_id": row["user"],
                "email": await email_of(db, user_id),
                "flags": row["signals"],
                "counters": {
                    "max_cities_per_day": row["max_cities_per_day"],
                    "evictions": row["evictions"],
                    "new_devices": row["new_devices"],
                    "max_paid_chunks_per_day": row["max_paid_chunks_per_day"],
                    "max_solutions_per_day": row["max_solutions_per_day"],
                },
                "sessions": await active_sessions(db, user_id),
                "restriction": row["restriction"],
            }
        )
    running = []
    for row in await db.scalars(
        select(AccountRestriction)
        .where(*restrictions.current())
        .order_by(AccountRestriction.created_at.desc())
    ):
        running.append(
            {
                **restriction_view(row),
                "user_id": str(row.user_id),
                "email": await email_of(db, row.user_id),
            }
        )
    refunds = []
    rows = await db.execute(
        select(Refund, Payment)
        .join(Payment, Payment.id == Refund.payment_id)
        .where(Refund.status.in_(("requested", "pending", "failed")))
        .order_by(Refund.created_at)
    )
    for refund, payment in rows.all():
        refunds.append(
            {
                "id": str(refund.id),
                "invoice": payment.invoice_no,
                "user_id": str(payment.user_id) if payment.user_id else None,
                "email": await email_of(db, payment.user_id) if payment.user_id else None,
                "amount_kopecks": refund.amount_kopecks,
                "reason": refund.reason,
                "status": refund.status,
                "created_at": iso(refund.created_at),
            }
        )
    return {
        "schema": "kodumka.operator/1",
        "generated_at": iso(service.now()),
        "signal_days": SIGNAL_DAYS,
        "signals": signals,
        "restrictions": running,
        "refunds": refunds,
    }


async def account_card(db: AsyncSession, user_id: UUID) -> dict[str, Any]:
    """`kodumka.account/1`: everything the operator needs to judge one account."""
    user = await db.get(AccountUser, user_id)
    if user is None:
        raise LookupError("account not found")
    credential = await db.get(AccountPassword, user_id)
    methods = list(
        await db.scalars(select(AccountIdentity.provider).where(AccountIdentity.user_id == user_id))
    )
    if credential and credential.email_verified_at:
        methods.insert(0, "email")
    payments = []
    rows = await db.execute(
        select(Payment, AccessGrant)
        .outerjoin(AccessGrant, AccessGrant.payment_id == Payment.id)
        .where(Payment.user_id == user_id)
        .order_by(Payment.created_at)
    )
    for payment, grant in rows.all():
        payments.append(
            {
                "id": str(payment.id),
                "invoice": payment.invoice_no,
                "plan": payment.plan,
                "amount_kopecks": payment.amount_kopecks,
                "status": payment.status,
                "paid_at": iso(payment.paid_at),
                "access_from": iso(grant.starts_at) if grant else None,
                "access_until": iso(grant.revoked_at or grant.ends_at) if grant else None,
            }
        )
    refunds = [
        {
            "id": str(refund.id),
            "invoice": invoice,
            "amount_kopecks": refund.amount_kopecks,
            "reason": refund.reason,
            "status": refund.status,
            "created_at": iso(refund.created_at),
        }
        for refund, invoice in (
            await db.execute(
                select(Refund, Payment.invoice_no)
                .join(Payment, Payment.id == Refund.payment_id)
                .where(Payment.user_id == user_id)
                .order_by(Refund.created_at)
            )
        ).all()
    ]
    devices = [
        {
            "label": device.label,
            "first_seen_at": iso(device.first_seen_at),
            "last_seen_at": iso(device.last_seen_at),
        }
        for device in await db.scalars(
            select(AccountDevice)
            .where(AccountDevice.user_id == user_id)
            .order_by(AccountDevice.last_seen_at.desc())
        )
    ]
    measures = [
        restriction_view(row)
        for row in await db.scalars(
            select(AccountRestriction)
            .where(AccountRestriction.user_id == user_id)
            .order_by(AccountRestriction.created_at.desc())
        )
    ]
    since = service.today() - timedelta(days=CARD_DAYS - 1)
    activity = [
        {
            "day": day.day.isoformat(),
            "new_devices": day.new_devices,
            "evictions": day.evictions,
            "cities": list(day.cities),
            "paid_chunks": day.paid_chunks,
            "solutions": day.solutions,
        }
        for day in await db.scalars(
            select(AccountActivityDay)
            .where(AccountActivityDay.user_id == user_id, AccountActivityDay.day >= since)
            .order_by(AccountActivityDay.day.desc())
        )
    ]
    until = await access_until(db, user_id)
    return {
        "schema": "kodumka.account/1",
        "generated_at": iso(service.now()),
        "account": {
            "id": str(user_id),
            "email": credential.email_normalized if credential else None,
            "email_verified": bool(credential and credential.email_verified_at),
            "created_at": iso(user.created_at),
            "methods": methods,
            "consent_version": user.privacy_consent_version,
        },
        "access": {"until": iso(until)},
        "payments": payments,
        "refunds": refunds,
        "sessions": await active_sessions(db, user_id),
        "devices": devices,
        "restrictions": measures,
        "activity": activity,
    }
