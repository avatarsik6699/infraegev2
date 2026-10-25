"""Account invariants and transactions. HTTP concerns remain in api.py."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from uuid import UUID

from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.account.device import Device
from app.modules.account.models import (
    AccountActivityDay,
    AccountDevice,
    AccountIdentity,
    AccountPassword,
    AccountSession,
    AccountToken,
    AccountUser,
)
from app.modules.account.security import hash_password, new_token, token_hash, verify_password

SESSION_LIFETIME = timedelta(days=30)
TOKEN_LIFETIME = timedelta(minutes=30)
RESET_LIFETIME = timedelta(minutes=20)
RECENT_AUTH = timedelta(minutes=10)
RESEND_COOLDOWN = timedelta(minutes=1)
RESEND_WINDOW = timedelta(hours=1)
MAX_RESENDS_PER_WINDOW = 5
# Change 198 (SPEC §6.2): personal access, at most three browsers at once.
MAX_ACTIVE_DEVICES = 3
TOUCH_INTERVAL = timedelta(minutes=10)
MAX_CITIES_PER_DAY = 20


class InvalidCredentials(ValueError):
    pass


class EmailMethodConflict(ValueError):
    pass


class MailRateLimited(ValueError):
    pass


def now() -> datetime:
    return datetime.now(UTC)


async def current_session(db: AsyncSession, opaque: str | None) -> AccountSession | None:
    if not opaque or len(opaque) > 256:
        return None
    try:
        digest = token_hash(opaque)
    except UnicodeEncodeError:
        return None
    return await db.scalar(
        select(AccountSession)
        .join(AccountUser, AccountUser.id == AccountSession.user_id)
        .where(
            AccountSession.token_hash == digest,
            AccountSession.revoked_at.is_(None),
            AccountSession.expires_at > now(),
            AccountUser.deleted_at.is_(None),
        )
    )


@dataclass(frozen=True)
class SignIn:
    opaque: str
    new_device: bool


def last_used():
    return func.coalesce(AccountSession.last_seen_at, AccountSession.authenticated_at)


async def ensure_day(db: AsyncSession, user_id: UUID) -> None:
    await db.execute(
        insert(AccountActivityDay)
        .values(
            user_id=user_id,
            day=today(),
            new_devices=0,
            evictions=0,
            paid_chunks=0,
            solutions=0,
            cities=[],
        )
        .on_conflict_do_nothing()
    )


async def count_today(db: AsyncSession, user_id: UUID, field: str, by: int = 1) -> int:
    """Add to one daily counter of the signal report and return its new value."""
    await ensure_day(db, user_id)
    column = getattr(AccountActivityDay, field)
    return (
        await db.execute(
            update(AccountActivityDay)
            .where(AccountActivityDay.user_id == user_id, AccountActivityDay.day == today())
            .values({field: column + by})
            .returning(column)
        )
    ).scalar_one()


async def note_city(db: AsyncSession, user_id: UUID, city: str | None) -> None:
    if not city:
        return
    await ensure_day(db, user_id)
    await db.execute(
        update(AccountActivityDay)
        .where(
            AccountActivityDay.user_id == user_id,
            AccountActivityDay.day == today(),
            ~AccountActivityDay.cities.contains([city]),
            func.cardinality(AccountActivityDay.cities) < MAX_CITIES_PER_DAY,
        )
        .values(cities=func.array_append(AccountActivityDay.cities, city))
    )


def today() -> date:
    return now().date()


async def create_session(
    db: AsyncSession, user_id: UUID, old_token: str | None = None, device: Device | None = None
) -> SignIn:
    """A new session of this browser. Earlier sessions of the same browser end; beyond
    three browsers the one used longest ago ends (SPEC §6.2)."""
    if old_token:
        try:
            await db.execute(
                update(AccountSession)
                .where(AccountSession.token_hash == token_hash(old_token))
                .values(revoked_at=now())
            )
        except UnicodeEncodeError:
            pass
    timestamp = now()
    new_device = False
    if device is not None:
        await db.execute(
            update(AccountSession)
            .where(
                AccountSession.user_id == user_id,
                AccountSession.device_hash == device.hash,
                AccountSession.revoked_at.is_(None),
            )
            .values(revoked_at=timestamp)
        )
        known = await db.scalar(
            select(AccountDevice)
            .where(AccountDevice.user_id == user_id, AccountDevice.device_hash == device.hash)
            .with_for_update()
        )
        if known is None:
            new_device = True
            db.add(
                AccountDevice(
                    user_id=user_id,
                    device_hash=device.hash,
                    label=device.label,
                    first_seen_at=timestamp,
                    last_seen_at=timestamp,
                )
            )
            await count_today(db, user_id, "new_devices")
        else:
            known.label = device.label
            known.last_seen_at = timestamp
        await note_city(db, user_id, device.city)
    active = list(
        await db.scalars(
            select(AccountSession.id)
            .where(
                AccountSession.user_id == user_id,
                AccountSession.revoked_at.is_(None),
                AccountSession.expires_at > timestamp,
            )
            .order_by(last_used().desc(), AccountSession.id)
        )
    )
    evicted = active[MAX_ACTIVE_DEVICES - 1 :]
    if evicted:
        await db.execute(
            update(AccountSession)
            .where(AccountSession.id.in_(evicted))
            .values(revoked_at=timestamp)
        )
        await count_today(db, user_id, "evictions", len(evicted))
    opaque = new_token()
    db.add(
        AccountSession(
            user_id=user_id,
            token_hash=token_hash(opaque),
            authenticated_at=timestamp,
            expires_at=timestamp + SESSION_LIFETIME,
            device_hash=device.hash if device else None,
            device_label=device.label if device else None,
            ip=device.ip if device else None,
            city=device.city if device else None,
            last_ip=device.ip if device else None,
            last_seen_at=timestamp,
        )
    )
    await db.flush()
    return SignIn(opaque, new_device)


async def touch_session(db: AsyncSession, session: AccountSession, device: Device) -> None:
    """Remember the last activity of a session, at most once per TOUCH_INTERVAL."""
    timestamp = now()
    if session.last_seen_at is not None and session.last_seen_at > timestamp - TOUCH_INTERVAL:
        return
    session.last_seen_at = timestamp
    if device.ip:
        session.last_ip = device.ip
        if device.city:
            session.city = device.city
    if session.device_hash:
        await db.execute(
            update(AccountDevice)
            .where(
                AccountDevice.user_id == session.user_id,
                AccountDevice.device_hash == session.device_hash,
            )
            .values(last_seen_at=timestamp)
        )
    await note_city(db, session.user_id, device.city)
    await db.flush()


async def active_sessions(db: AsyncSession, user_id: UUID) -> list[AccountSession]:
    return list(
        await db.scalars(
            select(AccountSession)
            .where(
                AccountSession.user_id == user_id,
                AccountSession.revoked_at.is_(None),
                AccountSession.expires_at > now(),
            )
            .order_by(last_used().desc(), AccountSession.id)
        )
    )


async def revoke_sessions(
    db: AsyncSession, user_id: UUID, *, only: UUID | None = None, keep: UUID | None = None
) -> int:
    """End one session of the owner, or all of them except `keep`."""
    conditions = [AccountSession.user_id == user_id, AccountSession.revoked_at.is_(None)]
    if only is not None:
        conditions.append(AccountSession.id == only)
    if keep is not None:
        conditions.append(AccountSession.id != keep)
    result = await db.execute(
        update(AccountSession)
        .where(*conditions)
        .values(revoked_at=now())
        .returning(AccountSession.id)
    )
    # Counts the rows an UPDATE … RETURNING revoked; a SELECT count() cannot see them.
    # nosemgrep: python.sqlalchemy.performance.performance-improvements.len-all-count
    return len(result.all())


async def register(
    db: AsyncSession, email: str, password: str, privacy_consent_version: str
) -> tuple[str, str] | None:
    normalized = email.casefold()
    existing = await db.scalar(
        select(AccountPassword)
        .where(AccountPassword.email_normalized == normalized)
        .with_for_update()
    )
    if existing:
        if existing.email_verified_at is not None:
            return None
        user = await db.scalar(
            select(AccountUser).where(AccountUser.id == existing.user_id).with_for_update()
        )
        if user is not None:
            user.privacy_consent_version = privacy_consent_version
            user.privacy_consented_at = now()
        return await issue_token_for_credential(db, existing, "email_verify")
    user = AccountUser(
        privacy_consent_version=privacy_consent_version,
        privacy_consented_at=now(),
    )
    db.add(user)
    await db.flush()
    encoded = await asyncio.to_thread(hash_password, password)
    credential = AccountPassword(
        user_id=user.id, email_normalized=normalized, password_hash=encoded
    )
    db.add(credential)
    return await issue_token_for_credential(db, credential, "email_verify")


async def issue_token(db: AsyncSession, email: str, purpose: str) -> tuple[str, str] | None:
    credential = await db.scalar(
        select(AccountPassword)
        .where(AccountPassword.email_normalized == email.casefold())
        .with_for_update()
    )
    if credential is None or (
        credential.email_verified_at is not None and purpose == "email_verify"
    ):
        return None
    if purpose == "password_reset" and credential.email_verified_at is None:
        return None
    return await issue_token_for_credential(db, credential, purpose)


async def issue_token_for_credential(
    db: AsyncSession, credential: AccountPassword, purpose: str
) -> tuple[str, str] | None:
    timestamp = now()
    recent = await db.scalar(
        select(AccountToken.created_at)
        .where(
            AccountToken.user_id == credential.user_id,
            AccountToken.purpose == purpose,
            AccountToken.created_at > timestamp - RESEND_COOLDOWN,
        )
        .order_by(AccountToken.created_at.desc())
        .limit(1)
    )
    sent_in_window = await db.scalar(
        select(func.count(AccountToken.id)).where(
            AccountToken.user_id == credential.user_id,
            AccountToken.purpose == purpose,
            AccountToken.created_at > timestamp - RESEND_WINDOW,
        )
    )
    if recent is not None or (sent_in_window or 0) >= MAX_RESENDS_PER_WINDOW:
        return None
    token = new_token()
    db.add(
        AccountToken(
            user_id=credential.user_id,
            purpose=purpose,
            token_hash=token_hash(token),
            expires_at=timestamp
            + (RESET_LIFETIME if purpose == "password_reset" else TOKEN_LIFETIME),
            created_at=timestamp,
        )
    )
    await db.flush()
    return credential.email_normalized, token


async def retract_token(db: AsyncSession, opaque: str) -> None:
    """Do not charge an address for a message the SMTP relay rejected."""
    try:
        digest = token_hash(opaque)
    except UnicodeEncodeError:
        return
    await db.execute(delete(AccountToken).where(AccountToken.token_hash == digest))


async def add_email_method(
    db: AsyncSession, user_id: UUID, email: str, password: str
) -> tuple[str, str]:
    """Stage a password method on the current account, never merging by email."""
    user = await db.scalar(select(AccountUser).where(AccountUser.id == user_id).with_for_update())
    if user is None or user.deleted_at is not None:
        raise InvalidCredentials("account unavailable")
    identity = await db.scalar(
        select(AccountIdentity.id).where(AccountIdentity.user_id == user_id).limit(1)
    )
    if identity is None:
        raise EmailMethodConflict("provider method required")
    credential = await db.scalar(
        select(AccountPassword).where(AccountPassword.user_id == user_id).with_for_update()
    )
    if credential is not None and credential.email_verified_at is not None:
        raise EmailMethodConflict("email method already enabled")
    normalized = email.casefold()
    owner = await db.scalar(
        select(AccountPassword.user_id).where(AccountPassword.email_normalized == normalized)
    )
    if owner is not None and owner != user_id:
        raise EmailMethodConflict("email unavailable")
    encoded = await asyncio.to_thread(hash_password, password)
    if credential is None:
        credential = AccountPassword(
            user_id=user_id, email_normalized=normalized, password_hash=encoded
        )
        db.add(credential)
    else:
        if credential.email_normalized != normalized:
            await db.execute(
                update(AccountToken)
                .where(
                    AccountToken.user_id == user_id,
                    AccountToken.purpose == "email_verify",
                    AccountToken.consumed_at.is_(None),
                )
                .values(consumed_at=now())
            )
            credential.email_normalized = normalized
        credential.password_hash = encoded
    pending = await issue_token_for_credential(db, credential, "email_verify")
    if pending is None:
        raise MailRateLimited("email request limit reached")
    return pending


async def consume_token(db: AsyncSession, opaque: str, purpose: str) -> AccountToken:
    try:
        digest = token_hash(opaque)
    except UnicodeEncodeError as exc:
        raise InvalidCredentials("invalid or expired token") from exc
    token = await db.scalar(
        select(AccountToken)
        .where(
            AccountToken.token_hash == digest,
            AccountToken.purpose == purpose,
            AccountToken.consumed_at.is_(None),
            AccountToken.expires_at > now(),
        )
        .with_for_update()
    )
    if token is None:
        raise InvalidCredentials("invalid or expired token")
    token.consumed_at = now()
    return token


async def verify_email(db: AsyncSession, opaque: str) -> None:
    try:
        digest = token_hash(opaque)
    except UnicodeEncodeError as exc:
        raise InvalidCredentials("invalid or expired token") from exc
    owner = await db.scalar(
        select(AccountToken.user_id).where(
            AccountToken.token_hash == digest,
            AccountToken.purpose == "email_verify",
            AccountToken.consumed_at.is_(None),
            AccountToken.expires_at > now(),
        )
    )
    if owner is None:
        raise InvalidCredentials("invalid or expired token")
    # All credential mutations lock the credential before touching its tokens.
    # A link for a replaced pending email therefore cannot verify the new address.
    credential = await db.scalar(
        select(AccountPassword).where(AccountPassword.user_id == owner).with_for_update()
    )
    if credential is None:
        raise InvalidCredentials("invalid or expired token")
    token = await consume_token(db, opaque, "email_verify")
    if token.user_id != credential.user_id:
        raise InvalidCredentials("invalid or expired token")
    credential.email_verified_at = now()
    await db.flush()


async def login(
    db: AsyncSession, email: str, password: str, old_token: str | None, device: Device | None
) -> SignIn:
    credential = await db.scalar(
        select(AccountPassword).where(AccountPassword.email_normalized == email.casefold())
    )
    valid = await asyncio.to_thread(
        verify_password, credential.password_hash if credential else None, password
    )
    if credential is None or not valid or credential.email_verified_at is None:
        raise InvalidCredentials("invalid credentials")
    return await create_session(db, credential.user_id, old_token, device)


async def reset_password(db: AsyncSession, opaque: str, password: str) -> None:
    token = await consume_token(db, opaque, "password_reset")
    credential = await db.get(AccountPassword, token.user_id)
    if credential is None:
        raise InvalidCredentials("invalid or expired token")
    credential.password_hash = await asyncio.to_thread(hash_password, password)
    await db.execute(
        update(AccountSession)
        .where(AccountSession.user_id == token.user_id, AccountSession.revoked_at.is_(None))
        .values(revoked_at=now())
    )
    await db.flush()


async def account_view(db: AsyncSession, user_id: UUID) -> tuple[str | None, list[str]]:
    credential = await db.get(AccountPassword, user_id)
    methods = list(
        await db.scalars(select(AccountIdentity.provider).where(AccountIdentity.user_id == user_id))
    )
    if credential and credential.email_verified_at is not None:
        methods.insert(0, "email")
    return credential.email_normalized if credential else None, methods


async def revoke_session(db: AsyncSession, session: AccountSession) -> None:
    session.revoked_at = now()
    await db.flush()


async def delete_account(db: AsyncSession, session: AccountSession, password: str | None) -> None:
    user = await db.get(AccountUser, session.user_id)
    if user is None:
        raise InvalidCredentials("account unavailable")
    credential = await db.get(AccountPassword, session.user_id)
    if credential is not None and credential.email_verified_at is not None:
        if not password or not await asyncio.to_thread(
            verify_password, credential.password_hash, password
        ):
            raise InvalidCredentials("invalid password")
    elif session.authenticated_at < now() - RECENT_AUTH:
        raise InvalidCredentials("recent authentication required")
    # Change 192: billing rows stay as evidence; access ends and unused days are refunded.
    from app.modules.billing.service import on_account_deletion

    await on_account_deletion(db, user.id)
    await db.delete(user)
    await db.flush()
