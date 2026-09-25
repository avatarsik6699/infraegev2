"""Account invariants and transactions. HTTP concerns remain in api.py."""

from __future__ import annotations

import asyncio
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.account.models import (
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


class InvalidCredentials(ValueError):
    pass


class LastLoginMethod(ValueError):
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


async def create_session(db: AsyncSession, user_id: UUID, old_token: str | None = None) -> str:
    if old_token:
        try:
            await db.execute(
                update(AccountSession)
                .where(AccountSession.token_hash == token_hash(old_token))
                .values(revoked_at=now())
            )
        except UnicodeEncodeError:
            pass
    opaque = new_token()
    timestamp = now()
    db.add(
        AccountSession(
            user_id=user_id,
            token_hash=token_hash(opaque),
            authenticated_at=timestamp,
            expires_at=timestamp + SESSION_LIFETIME,
        )
    )
    await db.flush()
    return opaque


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


async def login(db: AsyncSession, email: str, password: str, old_token: str | None) -> str:
    credential = await db.scalar(
        select(AccountPassword).where(AccountPassword.email_normalized == email.casefold())
    )
    valid = await asyncio.to_thread(
        verify_password, credential.password_hash if credential else None, password
    )
    if credential is None or not valid or credential.email_verified_at is None:
        raise InvalidCredentials("invalid credentials")
    return await create_session(db, credential.user_id, old_token)


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
    await db.delete(user)
    await db.flush()
