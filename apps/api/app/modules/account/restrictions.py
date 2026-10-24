"""Manual operator measures against shared accounts and bulk downloading (Change 198,
SPEC §6.2): a warning, a suspension of paid access for a term, a termination with a refund
of the unused days. Nothing here runs automatically; the signal report only informs."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta
from uuid import UUID
from zoneinfo import ZoneInfo

from sqlalchemy import func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.modules.account import service
from app.modules.account.models import (
    AccountActivityDay,
    AccountPassword,
    AccountRestriction,
    AccountSession,
)

MOSCOW = ZoneInfo("Europe/Moscow")
WARNING_SHOWN = timedelta(days=14)
# What a shared account looks like; a student studying a lot never reaches these. Change 199:
# paid chunks and solutions raise no signal — an active reader must never look like a thief;
# they stay informational numbers in the report and the account card.
SIGNAL_CITIES = 3
SIGNAL_EVICTIONS = 3
SIGNAL_NEW_DEVICES = 4
CLOSING = ("suspension", "termination")


@dataclass(frozen=True)
class Notice:
    subject: str
    body: str


def current(at: datetime | None = None):
    moment = at or service.now()
    return (
        AccountRestriction.lifted_at.is_(None),
        or_(AccountRestriction.ends_at.is_(None), AccountRestriction.ends_at > moment),
    )


async def active(db: AsyncSession, user_id: UUID) -> AccountRestriction | None:
    """The restriction the viewer sees: a closing one first, else a recent warning."""
    rows = list(
        await db.scalars(
            select(AccountRestriction)
            .where(AccountRestriction.user_id == user_id, *current())
            .order_by(AccountRestriction.created_at.desc())
        )
    )
    return next((row for row in rows if row.kind in CLOSING), rows[0] if rows else None)


async def closes_paid_access(db: AsyncSession, user_id: UUID) -> bool:
    found = await db.scalar(
        select(AccountRestriction.id)
        .where(
            AccountRestriction.user_id == user_id,
            AccountRestriction.kind.in_(CLOSING),
            *current(),
        )
        .limit(1)
    )
    return found is not None


def day(value: datetime) -> str:
    return value.astimezone(MOSCOW).strftime("%d.%m.%Y")


def notice(kind: str, reason: str, ends_at: datetime | None) -> Notice:
    appeal = (
        f"Если вы не согласны, напишите на {settings.contact_email} — "
        "ответим в течение трёх рабочих дней."
    )
    if kind == "warning":
        return Notice(
            "Кодумка: доступ к аккаунту — личный",
            f"Мы завершили все сеансы вашего аккаунта. Причина: {reason}.\n\n"
            "Доступ к материалам личный: если пароль знает кто-то ещё, смените его. "
            "Повторное нарушение может привести к приостановке платного доступа.\n\n"
            f"{appeal}\n",
        )
    if kind == "suspension":
        assert ends_at is not None
        return Notice(
            "Кодумка: платный доступ приостановлен",
            f"Платный доступ приостановлен до {day(ends_at)}. Причина: {reason}.\n"
            "Аккаунт, прогресс и бесплатные материалы сохраняются.\n\n"
            f"{appeal}\n",
        )
    if kind == "termination":
        return Notice(
            "Кодумка: платный доступ прекращён",
            f"Платный доступ прекращён. Причина: {reason}.\n"
            "Стоимость неиспользованных дней вернём на карту в течение 10 дней. "
            "Аккаунт, прогресс и бесплатные материалы сохраняются.\n\n"
            f"{appeal}\n",
        )
    return Notice(
        "Кодумка: ограничение снято",
        "Ограничение аккаунта снято. Если доступ был приостановлен по ошибке, срок доступа "
        "продлён на время приостановки. Спасибо за терпение.\n"
        if reason == "compensated"
        else "Ограничение аккаунта снято. Спасибо за терпение.\n",
    )


async def restrict(
    db: AsyncSession,
    user_id: UUID,
    kind: str,
    reason: str,
    *,
    days: int | None = None,
    note: str | None = None,
) -> AccountRestriction:
    """Record one measure and apply it; the caller commits and mails the notice."""
    moment = service.now()
    ends_at = {
        "warning": moment + WARNING_SHOWN,
        "suspension": moment + timedelta(days=days or 0),
        "termination": None,
    }[kind]
    if kind == "suspension" and not days:
        raise ValueError("a suspension needs a term in days")
    row = AccountRestriction(
        user_id=user_id,
        kind=kind,
        reason=reason,
        note=note,
        created_at=moment,
        ends_at=ends_at,
    )
    db.add(row)
    if kind == "warning":
        await service.revoke_sessions(db, user_id)
    if kind == "termination":
        from app.modules.billing.service import end_access_with_refund

        await end_access_with_refund(db, user_id, "restriction")
    await db.flush()
    return row


async def lift(db: AsyncSession, user_id: UUID, *, compensate: bool = False) -> int:
    """Lift every running measure. With `compensate` (an appeal upheld, offer 6.3) the
    access periods of the account are extended by the time a suspension took away."""
    from app.modules.billing.models import AccessGrant

    moment = service.now()
    rows = list(
        await db.scalars(
            select(AccountRestriction)
            .where(AccountRestriction.user_id == user_id, *current())
            .with_for_update()
        )
    )
    for row in rows:
        row.lifted_at = moment
        if compensate and row.kind == "suspension":
            taken = min(moment, row.ends_at or moment) - row.created_at
            await db.execute(
                update(AccessGrant)
                .where(
                    AccessGrant.user_id == user_id,
                    AccessGrant.revoked_at.is_(None),
                    AccessGrant.ends_at > row.created_at,
                )
                .values(ends_at=AccessGrant.ends_at + taken)
            )
    await db.flush()
    return len(rows)


async def verified_email(db: AsyncSession, user_id: UUID) -> str | None:
    credential = await db.get(AccountPassword, user_id)
    if credential is None or credential.email_verified_at is None:
        return None
    return credential.email_normalized


async def signals(db: AsyncSession, days: int) -> list[dict]:
    """Accounts above a threshold in the last `days` days, with their numbers; the operator
    looks at each before any measure. Ids and counts only, no addresses."""
    since: date = service.today() - timedelta(days=days - 1)
    per_day = func.cardinality(AccountActivityDay.cities)
    rows = await db.execute(
        select(
            AccountActivityDay.user_id,
            func.max(per_day),
            func.sum(AccountActivityDay.evictions),
            func.sum(AccountActivityDay.new_devices),
            func.max(AccountActivityDay.paid_chunks),
            func.max(AccountActivityDay.solutions),
        )
        .where(AccountActivityDay.day >= since)
        .group_by(AccountActivityDay.user_id)
    )
    report = []
    for user_id, cities, evictions, new_devices, chunks, solutions in rows.all():
        reasons = [
            label
            for label, hit in (
                ("cities", (cities or 0) >= SIGNAL_CITIES),
                ("evictions", (evictions or 0) >= SIGNAL_EVICTIONS),
                ("new_devices", (new_devices or 0) >= SIGNAL_NEW_DEVICES),
            )
            if hit
        ]
        if not reasons:
            continue
        sessions = list(
            await db.scalars(
                select(AccountSession.city).where(
                    AccountSession.user_id == user_id,
                    AccountSession.revoked_at.is_(None),
                    AccountSession.expires_at > service.now(),
                )
            )
        )
        report.append(
            {
                "user": str(user_id),
                "signals": reasons,
                "max_cities_per_day": cities or 0,
                "evictions": evictions or 0,
                "new_devices": new_devices or 0,
                "max_paid_chunks_per_day": chunks or 0,
                "max_solutions_per_day": solutions or 0,
                "active_sessions": len(sessions),
                "active_cities": sorted({city for city in sessions if city}),
                "restriction": (row.kind if (row := await active(db, user_id)) else None),
            }
        )
    return report
