"""Bounded retention cleanup for invalid account authentication artifacts.

This module is an internal maintenance command, not an HTTP endpoint.  It never
touches active sessions, unexpired mail tokens, or provider challenges that can
still complete a browser flow.
"""

from __future__ import annotations

import asyncio
import json
from dataclasses import asdict, dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import delete, exists, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.elements import ColumnElement

from app.core.config import settings
from app.core.database import database_engine
from app.modules.account.models import (
    AccountIdentity,
    AccountPassword,
    AccountProviderChallenge,
    AccountSession,
    AccountToken,
    AccountUser,
)

# Each invocation does at most one small DELETE per table.  The hourly timer
# eventually drains a backlog without a long transaction or a table-wide lock.
PURGE_BATCH_SIZE = 500
REVOKED_SESSION_RETENTION = timedelta(days=1)
EXPIRED_ARTIFACT_RETENTION = timedelta(hours=1)
UNVERIFIED_EMAIL_ACCOUNT_RETENTION = timedelta(days=30)


@dataclass(frozen=True)
class PurgeResult:
    sessions: int = 0
    tokens: int = 0
    provider_challenges: int = 0
    abandoned_unverified_users: int = 0


def now() -> datetime:
    return datetime.now(UTC)


async def _delete_batch(db: AsyncSession, model: type[Any], predicate: ColumnElement[bool]) -> int:
    identifiers = (
        select(model.id)
        .where(predicate)
        .order_by(model.expires_at, model.id)
        .limit(PURGE_BATCH_SIZE)
    )
    deleted = delete(model).where(model.id.in_(identifiers)).returning(model.id).cte("deleted")
    result = await db.execute(select(func.count()).select_from(deleted))
    return result.scalar_one()


async def _delete_abandoned_unverified_users(db: AsyncSession, timestamp: datetime) -> int:
    """Purge stale email-only registrations while preserving reachable accounts.

    A provider identity is a login method even if the pending email was never
    verified.  The active-token guard is intentionally redundant with the
    30-day age threshold: it makes the account-recovery invariant explicit and
    protects this query if either lifetime changes later.
    """
    active_verification = exists(
        select(AccountToken.id).where(
            AccountToken.user_id == AccountUser.id,
            AccountToken.purpose == "email_verify",
            AccountToken.consumed_at.is_(None),
            AccountToken.expires_at > timestamp,
        )
    )
    provider_linked = exists(
        select(AccountIdentity.id).where(AccountIdentity.user_id == AccountUser.id)
    )
    identifiers = (
        select(AccountUser.id)
        .join(AccountPassword, AccountPassword.user_id == AccountUser.id)
        .where(
            AccountUser.created_at <= timestamp - UNVERIFIED_EMAIL_ACCOUNT_RETENTION,
            AccountPassword.email_verified_at.is_(None),
            ~provider_linked,
            ~active_verification,
        )
        .order_by(AccountUser.created_at, AccountUser.id)
        .limit(PURGE_BATCH_SIZE)
    )
    deleted = (
        delete(AccountUser)
        .where(AccountUser.id.in_(identifiers))
        .returning(AccountUser.id)
        .cte("deleted")
    )
    result = await db.execute(select(func.count()).select_from(deleted))
    return result.scalar_one()


async def purge_expired_artifacts(
    db: AsyncSession, *, timestamp: datetime | None = None
) -> PurgeResult:
    """Remove one bounded batch of records which can no longer authorize anything.

    Mail artifacts are retained for at least an additional hour after expiry.
    That is longer than the rolling one-hour resend window, so cleanup cannot
    weaken the resend cap.  Revoked sessions retain their hash for one day;
    expired sessions are eligible immediately because they cannot authenticate.
    An unverified email-only account is eligible after 30 days only when it has
    neither an active verification link nor a linked identity provider.
    """
    timestamp = timestamp or now()
    sessions = await _delete_batch(
        db,
        AccountSession,
        or_(
            AccountSession.expires_at <= timestamp,
            AccountSession.revoked_at <= timestamp - REVOKED_SESSION_RETENTION,
        ),
    )
    expiry_cutoff = timestamp - EXPIRED_ARTIFACT_RETENTION
    tokens = await _delete_batch(db, AccountToken, AccountToken.expires_at <= expiry_cutoff)
    provider_challenges = await _delete_batch(
        db,
        AccountProviderChallenge,
        AccountProviderChallenge.expires_at <= expiry_cutoff,
    )
    abandoned_unverified_users = await _delete_abandoned_unverified_users(db, timestamp)
    return PurgeResult(
        sessions=sessions,
        tokens=tokens,
        provider_challenges=provider_challenges,
        abandoned_unverified_users=abandoned_unverified_users,
    )


async def run() -> PurgeResult:
    engine = database_engine(settings.account_database_url, role="infraege_app")
    try:
        async with AsyncSession(engine) as db:
            async with db.begin():
                return await purge_expired_artifacts(db)
    finally:
        await engine.dispose()


def main() -> None:
    # The result deliberately contains only aggregate counts: tokens, addresses
    # and account identifiers must not enter systemd/journald output.
    print(json.dumps(asdict(asyncio.run(run())), sort_keys=True))


if __name__ == "__main__":
    main()
