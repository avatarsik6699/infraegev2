"""Operator CLI for billing (Change 192): refunds, a user's payments, yearly income.

    python -m app.modules.billing.admin refund --payment ID --amount auto|full|KOPECKS --reason TEXT
    python -m app.modules.billing.admin execute --refund ID      # a requested refund
    python -m app.modules.billing.admin refunds                  # requested and pending
    python -m app.modules.billing.admin show --email ADDRESS
    python -m app.modules.billing.admin revenue [--year YEAR]
    python -m app.modules.billing.admin funnel [--days N]       # orders → payments by day

Output names payments, amounts and states only; addresses never reach the journal.
"""

from __future__ import annotations

import argparse
import asyncio
import json
from collections import defaultdict
from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.modules.account.models import AccountPassword
from app.modules.billing import provider, service
from app.modules.billing.models import AccessGrant, Payment, Refund


def amount_of(spec: str, payment: Payment, grant: AccessGrant | None) -> int:
    if spec == "full":
        return payment.amount_kopecks
    if spec == "auto":
        return service.unused_kopecks(payment, grant, service.now())
    return min(int(spec), payment.amount_kopecks)


async def refund(db: AsyncSession, payment_id: UUID, spec: str, reason: str) -> dict:
    async with db.begin():
        payment = await db.get(Payment, payment_id)
        if payment is None or payment.status != "succeeded":
            raise SystemExit("payment not found or not succeeded")
        grant = await db.scalar(select(AccessGrant).where(AccessGrant.payment_id == payment.id))
        amount = amount_of(spec, payment, grant)
        row = await service.request_refund(
            db, payment, amount, reason, key=f"operator:{payment.id}:{reason}:{amount}"
        )
        if row is None:
            raise SystemExit("nothing to refund: no unused days")
        refund_id = row.id
    done = await service.execute_refund(db, provider.current(), refund_id)
    return {"refund": str(done.id), "amount_kopecks": done.amount_kopecks, "status": done.status}


async def show(db: AsyncSession, email: str) -> list[dict]:
    user_id = await db.scalar(
        select(AccountPassword.user_id).where(AccountPassword.email_normalized == email.casefold())
    )
    if user_id is None:
        return []
    rows = await db.execute(
        select(Payment, AccessGrant)
        .outerjoin(AccessGrant, AccessGrant.payment_id == Payment.id)
        .where(Payment.user_id == user_id)
        .order_by(Payment.created_at)
    )
    return [
        {
            "payment": str(p.id),
            "invoice": p.invoice_no,
            "plan": p.plan,
            "amount_kopecks": p.amount_kopecks,
            "status": p.status,
            "paid_at": p.paid_at.isoformat() if p.paid_at else None,
            "access": [g.starts_at.isoformat(), (g.revoked_at or g.ends_at).isoformat()]
            if g
            else None,
        }
        for p, g in rows.all()
    ]


async def funnel(db: AsyncSession, days: int) -> list[dict]:
    """Change 194: orders of the last `days` Moscow days by day and plan — how many were
    paid, failed or are still open, how many were refunded, and the money that stayed.
    Counts and sums only; the tracker never sees payments."""
    today = service.now().astimezone(service.MOSCOW).date()
    start = today - timedelta(days=days - 1)
    returned = (
        select(Refund.payment_id, func.sum(Refund.amount_kopecks).label("kopecks"))
        .where(Refund.status == "succeeded")
        .group_by(Refund.payment_id)
        .subquery()
    )
    rows = await db.execute(
        select(
            Payment.created_at,
            Payment.plan,
            Payment.status,
            Payment.amount_kopecks,
            returned.c.kopecks,
        )
        .outerjoin(returned, returned.c.payment_id == Payment.id)
        .where(
            Payment.created_at
            >= datetime(start.year, start.month, start.day, tzinfo=service.MOSCOW)
        )
    )
    report: dict[tuple[str, str], dict] = defaultdict(
        lambda: {"orders": 0, "paid": 0, "failed": 0, "open": 0, "refunded": 0, "kopecks": 0}
    )
    for created_at, plan, status, amount, refunded in rows.all():
        day = created_at.astimezone(service.MOSCOW).date().isoformat()
        line = report[(day, plan)]
        line["orders"] += 1
        if status in ("succeeded", "refunded"):
            line["paid"] += 1
            line["kopecks"] += amount - (refunded or 0)
        elif status == "failed":
            line["failed"] += 1
        else:
            line["open"] += 1
        if refunded:
            line["refunded"] += 1
    return [{"day": day, "plan": plan, **line} for (day, plan), line in sorted(report.items())]


async def main_async(args: argparse.Namespace) -> object:
    engine = database_engine(settings.account_database_url, role="infraege_app")
    try:
        async with AsyncSession(engine) as db:
            if args.command == "refund":
                return await refund(db, UUID(args.payment), args.amount, args.reason)
            if args.command == "execute":
                done = await service.execute_refund(db, provider.current(), UUID(args.refund))
                return {"refund": str(done.id), "status": done.status}
            if args.command == "refunds":
                rows = await db.scalars(
                    select(Refund).where(Refund.status.in_(("requested", "pending", "failed")))
                )
                return [
                    {
                        "refund": str(r.id),
                        "payment": str(r.payment_id),
                        "amount_kopecks": r.amount_kopecks,
                        "reason": r.reason,
                        "status": r.status,
                    }
                    for r in rows
                ]
            if args.command == "show":
                return await show(db, args.email)
            if args.command == "funnel":
                return await funnel(db, args.days)
            year = args.year or service.now().astimezone(service.MOSCOW).year
            income = await service.revenue_kopecks(db, year)
            return {
                "year": year,
                "income_kopecks": income,
                "limit_share": round(income / settings.billing_npd_limit_kopecks, 4),
            }
    finally:
        await engine.dispose()


def main() -> None:
    parser = argparse.ArgumentParser(description="Billing operator CLI (Change 192)")
    commands = parser.add_subparsers(dest="command", required=True)
    refund_cmd = commands.add_parser("refund")
    refund_cmd.add_argument("--payment", required=True)
    refund_cmd.add_argument("--amount", required=True, help="auto, full or kopecks")
    refund_cmd.add_argument("--reason", required=True, choices=("buyer", "guardian", "operator"))
    commands.add_parser("execute").add_argument("--refund", required=True)
    commands.add_parser("refunds")
    commands.add_parser("show").add_argument("--email", required=True)
    commands.add_parser("revenue").add_argument("--year", type=int)
    commands.add_parser("funnel").add_argument("--days", type=int, default=30)
    print(json.dumps(asyncio.run(main_async(parser.parse_args())), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
