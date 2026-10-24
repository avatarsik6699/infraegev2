"""Operator CLI for billing (Change 192): refunds, a user's payments, yearly income.

    python -m app.modules.billing.admin refund --payment ID --amount auto|full|KOPECKS --reason TEXT
    python -m app.modules.billing.admin execute --refund ID      # a requested refund
    python -m app.modules.billing.admin refunds                  # requested and pending
    python -m app.modules.billing.admin show --email ADDRESS
    python -m app.modules.billing.admin revenue [--year YEAR]
    python -m app.modules.billing.admin funnel [--days N]       # orders → payments by day
    python -m app.modules.billing.admin export                  # the monitoring summary (JSON)

Change 198 (SPEC §6.2), manual measures only; look at the numbers before any of them:
    python -m app.modules.billing.admin signals [--days N]      # accounts above a threshold
    python -m app.modules.billing.admin warn --user ID|--email ADDRESS --reason TEXT [--note T]
    python -m app.modules.billing.admin suspend --user ID|--email A --days N --reason TEXT
    python -m app.modules.billing.admin terminate --user ID|--email A --reason TEXT
    python -m app.modules.billing.admin lift --user ID|--email ADDRESS [--compensate]

Change 199, the operator console on sre.infraege.ru (smotryashchiy SPEC §4j) — JSON in, JSON out:
    python -m app.modules.billing.admin operator KIND <args.json   # one allow-listed command
    python -m app.modules.billing.admin export-operator            # kodumka.operator/1 report

Output names payments, amounts and states only; addresses never reach the journal.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Annotated, Any, Self
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, ValidationError, model_validator
from sqlalchemy import distinct, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.modules.account import operator_export, restrictions
from app.modules.account.mail import MailUnavailable, send_account_mail
from app.modules.account.models import AccountIdentity, AccountPassword, AccountUser
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


EXPORT_DAYS = 90
STUCK_ORDER = timedelta(hours=2)


async def export(db: AsyncSession) -> dict:
    """Change 195: the summary the monitoring «Продажи» view shows, refreshed hourly by the
    host job. Counts and sums only: no addresses, ids or names leave the database."""
    moment = service.now()
    today = moment.astimezone(service.MOSCOW).date()
    start = today - timedelta(days=EXPORT_DAYS - 1)
    since = datetime(start.year, start.month, start.day, tzinfo=service.MOSCOW)
    confirmed = or_(
        select(AccountPassword.user_id)
        .where(
            AccountPassword.user_id == AccountUser.id,
            AccountPassword.email_verified_at.is_not(None),
        )
        .exists(),
        select(AccountIdentity.id).where(AccountIdentity.user_id == AccountUser.id).exists(),
    )
    registrations: dict[str, dict[str, int]] = defaultdict(lambda: {"accounts": 0, "confirmed": 0})
    for created_at, is_confirmed in (
        await db.execute(
            select(AccountUser.created_at, confirmed).where(AccountUser.created_at >= since)
        )
    ).all():
        line = registrations[created_at.astimezone(service.MOSCOW).date().isoformat()]
        line["accounts"] += 1
        line["confirmed"] += int(bool(is_confirmed))
    paid = Payment.status.in_(("succeeded", "refunded"))
    live = (
        AccessGrant.starts_at <= moment,
        AccessGrant.ends_at > moment,
        AccessGrant.revoked_at.is_(None),
    )
    year = today.year
    refunds: dict[str, int] = {
        status: count
        for status, count in (
            await db.execute(
                select(Refund.status, func.count())
                .where(Refund.status.in_(("requested", "pending", "failed")))
                .group_by(Refund.status)
            )
        ).tuples()
    }
    return {
        "schema": "kodumka.business/1",
        "generated_at": moment.isoformat(),
        "days": EXPORT_DAYS,
        "billing_enabled": settings.billing_enabled,
        "paywall_enabled": settings.paywall_enabled,
        "funnel": await funnel(db, EXPORT_DAYS),
        "registrations": [{"day": day, **line} for day, line in sorted(registrations.items())],
        "accounts_total": await db.scalar(select(func.count()).select_from(AccountUser)),
        "paying_accounts_total": await db.scalar(
            select(func.count(distinct(Payment.user_id))).where(paid, Payment.user_id.is_not(None))
        ),
        "access": {
            "active": await db.scalar(
                select(func.count(distinct(AccessGrant.user_id))).where(*live)
            ),
            "ending_7d": await db.scalar(
                select(func.count()).where(*live, AccessGrant.ends_at <= moment + timedelta(days=7))
            ),
        },
        "npd": {
            "year": year,
            "income_kopecks": await service.revenue_kopecks(db, year),
            "limit_kopecks": settings.billing_npd_limit_kopecks,
        },
        "problems": {
            "stuck_orders": await db.scalar(
                select(func.count()).where(
                    Payment.status.in_(("created", "pending")),
                    Payment.created_at < moment - STUCK_ORDER,
                )
            ),
            "refunds_requested": refunds.get("requested", 0),
            "refunds_pending": refunds.get("pending", 0),
            "refunds_failed": refunds.get("failed", 0),
        },
    }


async def account_of(db: AsyncSession, args: argparse.Namespace) -> UUID:
    if args.user:
        user_id = UUID(args.user)
    else:
        user_id = await db.scalar(
            select(AccountPassword.user_id).where(
                AccountPassword.email_normalized == args.email.casefold()
            )
        )
    if user_id is None or await db.get(AccountUser, user_id) is None:
        raise SystemExit("account not found")
    return user_id


async def measure(db: AsyncSession, args: argparse.Namespace) -> dict:
    """Apply one manual measure and mail its notice; the mail never decides the outcome."""
    async with db.begin():
        user_id = await account_of(db, args)
        if args.command == "lift":
            if not await restrictions.lift(db, user_id, compensate=args.compensate):
                raise SystemExit("no active restriction")
            text = restrictions.notice("lift", "compensated" if args.compensate else "", None)
            outcome: dict = {"user": str(user_id), "lifted": True, "compensated": args.compensate}
        else:
            row = await restrictions.restrict(
                db, user_id, args.command_kind, args.reason, days=args.days, note=args.note
            )
            text = restrictions.notice(row.kind, row.reason, row.ends_at)
            outcome = {
                "user": str(user_id),
                "restriction": str(row.id),
                "kind": row.kind,
                "until": row.ends_at.isoformat() if row.ends_at else None,
            }
        email = await restrictions.verified_email(db, user_id)
    outcome["mailed"] = False
    if email:
        try:
            await send_account_mail(email, text.subject, text.body)
            outcome["mailed"] = True
        except MailUnavailable:
            pass
    return outcome


# Change 199: the console's commands. The host script checks them first; this is the second
# check, so a console that sends something else gets an error, never a partial action.
Reason = Annotated[str, Field(min_length=1, max_length=300, pattern=r"^[^\x00-\x1f\x7f]+$")]


class ConsoleArgs(BaseModel):
    model_config = ConfigDict(extra="forbid")


class AccountTarget(ConsoleArgs):
    user: UUID | None = None
    email: Annotated[str, Field(max_length=320, pattern=r"^[^@\s]+@[^@\s]+$")] | None = None

    @model_validator(mode="after")
    def one_target(self) -> Self:
        if (self.user is None) == (self.email is None):
            raise ValueError("exactly one of user or email")
        return self


class MeasureArgs(AccountTarget):
    reason: Reason
    note: Annotated[str, Field(max_length=1000)] | None = None


class SuspendArgs(MeasureArgs):
    days: Annotated[int, Field(ge=1, le=30)]


class LiftArgs(AccountTarget):
    compensate: bool = False


class RefundArgs(ConsoleArgs):
    refund: UUID


CONSOLE_KINDS: dict[str, tuple[type[ConsoleArgs], str | None]] = {
    "warn": (MeasureArgs, "warning"),
    "suspend": (SuspendArgs, "suspension"),
    "terminate": (MeasureArgs, "termination"),
    "lift": (LiftArgs, None),
    "refund_execute": (RefundArgs, None),
    "account_show": (AccountTarget, None),
}


async def console(db: AsyncSession, kind: str, args: ConsoleArgs) -> dict[str, Any]:
    """Run one validated console command; the result is one JSON object for the console."""
    measure_kind = CONSOLE_KINDS[kind][1]
    if isinstance(args, RefundArgs):
        done = await service.execute_refund(db, provider.current(), args.refund)
        return {
            "refund": str(done.id),
            "status": done.status,
            "amount_kopecks": done.amount_kopecks,
        }
    assert isinstance(args, AccountTarget)
    target = argparse.Namespace(user=str(args.user) if args.user else None, email=args.email)
    if kind == "account_show":
        async with db.begin():
            user_id = await account_of(db, target)
            return await operator_export.account_card(db, user_id)
    namespace = argparse.Namespace(
        **vars(target),
        command="lift" if kind == "lift" else kind,
        command_kind=measure_kind,
        reason=getattr(args, "reason", ""),
        note=getattr(args, "note", None),
        days=getattr(args, "days", None),
        compensate=getattr(args, "compensate", False),
    )
    return await measure(db, namespace)


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
            if args.command == "export":
                return await export(db)
            if args.command == "signals":
                return await restrictions.signals(db, args.days)
            if args.command == "operator":
                return await console(db, args.kind, args.payload)
            if args.command == "export-operator":
                async with db.begin():
                    return await operator_export.operator_document(db)
            if args.command in ("warn", "suspend", "terminate", "lift"):
                return await measure(db, args)
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
    commands.add_parser("export")
    commands.add_parser("signals").add_argument("--days", type=int, default=7)
    for name, kind in (
        ("warn", "warning"),
        ("suspend", "suspension"),
        ("terminate", "termination"),
        ("lift", None),
    ):
        command = commands.add_parser(name)
        command.set_defaults(command_kind=kind, days=None, reason="", note=None, compensate=False)
        target = command.add_mutually_exclusive_group(required=True)
        target.add_argument("--user")
        target.add_argument("--email")
        if kind is not None:
            command.add_argument("--reason", required=True, help="shown to the student")
            command.add_argument("--note", help="operator evidence, never shown")
        if kind == "suspension":
            command.add_argument("--days", type=int, required=True, choices=range(1, 31))
        if kind is None:
            command.add_argument(
                "--compensate",
                action="store_true",
                help="appeal upheld: extend access by the suspended time (offer 6.3)",
            )
    operator_cmd = commands.add_parser("operator", help="one console command, args JSON on stdin")
    operator_cmd.add_argument("kind", choices=sorted(CONSOLE_KINDS))
    commands.add_parser("export-operator")
    args = parser.parse_args()
    if args.command != "operator":
        print(json.dumps(asyncio.run(main_async(args)), ensure_ascii=False, indent=2))
        return
    # The console reads exactly one JSON object back, also for a refusal. Arguments are checked
    # before the database is touched.
    try:
        args.payload = CONSOLE_KINDS[args.kind][0].model_validate_json(sys.stdin.read() or "{}")
    except ValidationError as exc:
        fields = sorted({".".join(map(str, error["loc"])) or "args" for error in exc.errors()})
        print(json.dumps({"error": "invalid arguments", "fields": fields}))
        raise SystemExit(2) from None
    try:
        result = asyncio.run(main_async(args))
    except (ValueError, LookupError) as exc:  # unknown account or refund
        print(json.dumps({"error": str(exc) or "invalid input"}, ensure_ascii=False))
        raise SystemExit(2) from None
    except SystemExit as exc:
        print(json.dumps({"error": str(exc.code)}, ensure_ascii=False))
        raise SystemExit(2) from None
    except Exception as exc:  # the console shows the class; the traceback stays on the host
        print(json.dumps({"error": f"internal: {type(exc).__name__}"}))
        raise
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
