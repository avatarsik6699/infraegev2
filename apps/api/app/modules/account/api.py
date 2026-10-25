"""Cookie-authenticated account HTTP boundary."""

from __future__ import annotations

import asyncio
import base64
import hashlib
from collections.abc import AsyncIterator
from datetime import timedelta
from typing import Annotated, cast
from uuid import UUID
from zoneinfo import ZoneInfo

import structlog
from asyncpg import PostgresError
from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import request_engine
from app.modules.account import service
from app.modules.account.device import Device, device_of, set_device_cookie
from app.modules.account.mail import MailUnavailable, send_account_mail
from app.modules.account.models import (
    AccountIdentity,
    AccountPassword,
    AccountProviderChallenge,
    AccountSession,
    AccountUser,
)
from app.modules.account.providers import (
    ProviderError,
    ProviderName,
    ProviderSettings,
    authenticate_callback,
    authorization_url,
)
from app.modules.account.schemas import (
    AccountView,
    AddEmailMethodRequest,
    DeleteAccountRequest,
    LoginMethod,
    LoginRequest,
    PendingProviderView,
    ProviderRegisteredView,
    ProviderRegisterRequest,
    RecoveryRequest,
    RegisterRequest,
    ResetPasswordRequest,
    SessionView,
    SignedInDevice,
    TokenRequest,
)
from app.modules.account.security import (
    csrf_matches,
    csrf_token,
    new_token,
    safe_return_path,
    token_hash,
    token_matches,
)

router = APIRouter(prefix="/auth", tags=["account"])
logger = structlog.get_logger(__name__)
SESSION_SECONDS = int(service.SESSION_LIFETIME.total_seconds())
MOSCOW = ZoneInfo("Europe/Moscow")
PENDING_REGISTRATION = timedelta(minutes=15)
PROVIDERS: tuple[ProviderName, ...] = ("vk", "yandex")


def cookie_name() -> str:
    return "__Host-kodumka_session" if settings.is_production else "kodumka_session"


def provider_cookie_name() -> str:
    return "__Host-kodumka_oauth" if settings.is_production else "kodumka_oauth"


def set_provider_cookie(response: Response, opaque: str) -> None:
    response.set_cookie(
        provider_cookie_name(),
        opaque,
        max_age=600,
        secure=settings.is_production,
        httponly=True,
        samesite="lax",
        path="/",
    )


def set_session_cookie(response: Response, opaque: str) -> None:
    response.set_cookie(
        cookie_name(),
        opaque,
        max_age=SESSION_SECONDS,
        secure=settings.is_production,
        httponly=True,
        samesite="lax",
        path="/",
    )


def clear_provider_cookie(response: Response) -> None:
    response.delete_cookie(
        provider_cookie_name(),
        path="/",
        secure=settings.is_production,
        httponly=True,
        samesite="lax",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        cookie_name(), path="/", secure=settings.is_production, httponly=True, samesite="lax"
    )


def require_origin(request: Request) -> None:
    origin = request.headers.get("origin")
    if origin != settings.public_origin:
        raise HTTPException(403, "origin not allowed")


async def account_db(request: Request, response: Response) -> AsyncIterator[AsyncSession]:
    response.headers["Cache-Control"] = "no-store"
    try:
        async with (
            asyncio.timeout(8),
            request_engine(request, settings.account_database_url, role="infraege_app") as engine,
            AsyncSession(engine) as db,
        ):
            yield db
    except (OSError, TimeoutError, SQLAlchemyError, PostgresError, ValueError) as exc:
        origin = getattr(exc, "orig", exc)
        logger.error(
            "account.database_unavailable",
            error_type=type(exc).__name__,
            sqlstate=getattr(origin, "sqlstate", None),
        )
        raise HTTPException(503, "account service unavailable") from exc


AccountDb = Annotated[AsyncSession, Depends(account_db)]


def raw_session_token(request: Request) -> str | None:
    return request.cookies.get(cookie_name())


async def active_session(request: Request, db: AsyncSession) -> AccountSession:
    current = await service.current_session(db, raw_session_token(request))
    if current is None:
        raise HTTPException(401, "sign in required")
    return current


def require_csrf(request: Request, submitted: str | None) -> None:
    raw = raw_session_token(request)
    secret = settings.auth_csrf_secret.get_secret_value()
    if not raw or not submitted or not csrf_matches(raw, secret, submitted):
        raise HTTPException(403, "invalid CSRF token")


def provider_settings() -> ProviderSettings:
    return ProviderSettings(
        vk_client_id=settings.vk_client_id,
        vk_client_secret=settings.vk_client_secret.get_secret_value(),
        vk_app_id=settings.vk_app_id,
        yandex_client_id=settings.yandex_client_id,
        yandex_client_secret=settings.yandex_client_secret.get_secret_value(),
    )


def provider_name(value: str) -> ProviderName:
    if value not in PROVIDERS or not getattr(settings, f"{value}_enabled"):
        raise HTTPException(404, "provider unavailable")
    return cast(ProviderName, value)


def enabled_providers() -> list[ProviderName]:
    return [provider for provider in PROVIDERS if getattr(settings, f"{provider}_enabled")]


def callback_url(provider: ProviderName) -> str:
    return f"{settings.public_origin}/api/auth/providers/{provider}/callback"


def code_challenge(verifier: str) -> str:
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")


async def start_provider(
    db: AsyncSession,
    provider: ProviderName,
    flow: str,
    return_to: str,
    user_id: UUID | None = None,
) -> tuple[str, str]:
    state = new_token()
    browser_token = new_token()
    verifier = new_token()
    nonce = new_token()
    try:
        target = authorization_url(
            provider,
            provider_settings(),
            callback_url=callback_url(provider),
            state=state,
            code_challenge=code_challenge(verifier),
            nonce=nonce,
        )
    except ProviderError as exc:
        raise HTTPException(503, "provider unavailable") from exc
    db.add(
        AccountProviderChallenge(
            provider=provider,
            state_hash=token_hash(state),
            browser_hash=token_hash(browser_token),
            code_verifier=verifier,
            nonce=nonce,
            flow=flow,
            user_id=user_id,
            return_path=safe_return_path(return_to),
            expires_at=service.now() + timedelta(minutes=10),
        )
    )
    await db.commit()
    return target, browser_token


@router.get("/providers")
async def provider_availability() -> dict[str, list[ProviderName]]:
    """Expose only release-enabled providers; credentials remain server-only."""
    return {"enabled": enabled_providers()}


@router.get("/providers/{provider}/start")
async def provider_login_start(
    provider: str,
    db: AccountDb,
    return_to: Annotated[str, Query(max_length=2048)] = "/",
) -> RedirectResponse:
    target, browser_token = await start_provider(db, provider_name(provider), "login", return_to)
    response = RedirectResponse(target, status_code=303, headers={"Cache-Control": "no-store"})
    set_provider_cookie(response, browser_token)
    return response


@router.post("/providers/{provider}/link")
async def provider_link_start(
    provider: str,
    request: Request,
    response: Response,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> dict[str, str]:
    selected = provider_name(provider)
    require_origin(request)
    require_csrf(request, x_csrf_token)
    current = await active_session(request, db)
    if current.authenticated_at < service.now() - service.RECENT_AUTH:
        raise HTTPException(403, "recent authentication required")
    target, browser_token = await start_provider(db, selected, "link", "/account", current.user_id)
    set_provider_cookie(response, browser_token)
    return {"url": target}


@router.post("/providers/{provider}/reauth")
async def provider_reauth_start(
    provider: str,
    request: Request,
    response: Response,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> dict[str, str]:
    selected = provider_name(provider)
    require_origin(request)
    require_csrf(request, x_csrf_token)
    current = await active_session(request, db)
    target, browser_token = await start_provider(
        db, selected, "reauth", "/account", current.user_id
    )
    set_provider_cookie(response, browser_token)
    return {"url": target}


@router.get("/providers/{provider}/callback")
async def provider_callback(
    provider: str,
    request: Request,
    db: AccountDb,
    state: Annotated[str, Query(min_length=20, max_length=256)],
    code: Annotated[str, Query(min_length=1, max_length=2048)],
    device_id: Annotated[str, Query(max_length=256)] = "",
) -> RedirectResponse:
    selected = provider_name(provider)
    if not state.isascii():
        raise HTTPException(400, "provider sign-in failed")
    async with db.begin():
        challenge = await db.scalar(
            select(AccountProviderChallenge)
            .where(
                AccountProviderChallenge.provider == selected,
                AccountProviderChallenge.state_hash == token_hash(state),
                AccountProviderChallenge.consumed_at.is_(None),
                AccountProviderChallenge.expires_at > service.now(),
            )
            .with_for_update()
        )
        browser_token = request.cookies.get(provider_cookie_name())
        if (
            challenge is None
            or not browser_token
            or len(browser_token) > 256
            or not token_matches(challenge.browser_hash, browser_token)
        ):
            raise HTTPException(400, "provider sign-in failed")
        challenge.consumed_at = service.now()
        verifier, nonce = challenge.code_verifier, challenge.nonce
        flow, owner, return_path = challenge.flow, challenge.user_id, challenge.return_path
    if flow in {"link", "reauth"}:
        current = await active_session(request, db)
        if current.user_id != owner:
            raise HTTPException(403, "account changed during sign-in")
        await db.commit()
    try:
        identity = await authenticate_callback(
            selected,
            provider_settings(),
            code=code,
            callback_url=callback_url(selected),
            code_verifier=verifier,
            nonce=nonce,
            state=state,
            device_id=device_id,
        )
    except ProviderError as exc:
        raise HTTPException(400, "provider sign-in failed") from exc
    if flow in {"link", "reauth"}:
        current = await active_session(request, db)
        if current.user_id != owner:
            raise HTTPException(403, "account changed during sign-in")
    linked = await db.scalar(
        select(AccountIdentity).where(
            AccountIdentity.provider == identity.provider,
            AccountIdentity.subject == identity.subject,
        )
    )
    if flow == "reauth":
        if linked is None or linked.user_id != owner:
            raise HTTPException(403, "provider belongs to another account")
        account_id = owner
    elif flow == "link":
        if linked is not None and linked.user_id != owner:
            raise HTTPException(409, "provider belongs to another account")
        existing_provider = await db.scalar(
            select(AccountIdentity).where(
                AccountIdentity.user_id == owner,
                AccountIdentity.provider == selected,
            )
        )
        if existing_provider is not None and existing_provider.subject != identity.subject:
            raise HTTPException(409, "provider already linked")
        account_id = owner
        if linked is None:
            db.add(
                AccountIdentity(user_id=owner, provider=identity.provider, subject=identity.subject)
            )
    else:
        if linked is None:
            # Change 198 (SPEC §4): no account before the separate consent step.
            pending = await db.scalar(
                select(AccountProviderChallenge).where(
                    AccountProviderChallenge.state_hash == token_hash(state)
                )
            )
            assert pending is not None
            pending.pending_subject = identity.subject
            pending.expires_at = service.now() + PENDING_REGISTRATION
            await db.commit()
            return RedirectResponse(
                "/register/provider",
                status_code=303,
                headers={"Cache-Control": "no-store", "Referrer-Policy": "no-referrer"},
            )
        account_id = linked.user_id
    if account_id is None:
        raise HTTPException(400, "provider sign-in failed")
    device, fresh_device = device_of(request)
    sign_in = await service.create_session(db, account_id, raw_session_token(request), device)
    try:
        await db.commit()
    except IntegrityError as exc:
        raise HTTPException(409, "provider already linked") from exc
    if sign_in.new_device and flow == "login":
        await notify_new_device(db, account_id, device)
    response = RedirectResponse(
        safe_return_path(return_path),
        status_code=303,
        headers={"Cache-Control": "no-store", "Referrer-Policy": "no-referrer"},
    )
    set_session_cookie(response, sign_in.opaque)
    if fresh_device:
        set_device_cookie(response, fresh_device)
    clear_provider_cookie(response)
    return response


async def pending_challenge(request: Request, db: AsyncSession) -> AccountProviderChallenge:
    browser_token = request.cookies.get(provider_cookie_name())
    if not browser_token or len(browser_token) > 256 or not browser_token.isascii():
        raise HTTPException(404, "no pending sign-in")
    challenge = await db.scalar(
        select(AccountProviderChallenge)
        .where(
            AccountProviderChallenge.browser_hash == token_hash(browser_token),
            AccountProviderChallenge.pending_subject.is_not(None),
            AccountProviderChallenge.expires_at > service.now(),
        )
        .order_by(AccountProviderChallenge.created_at.desc())
        .limit(1)
        .with_for_update()
    )
    if challenge is None or challenge.provider not in enabled_providers():
        raise HTTPException(404, "no pending sign-in")
    return challenge


@router.get("/provider/pending", response_model=PendingProviderView)
async def provider_pending(request: Request, db: AccountDb) -> PendingProviderView:
    """The provider of a verified sign-in that still waits for the consent step."""
    challenge = await pending_challenge(request, db)
    return PendingProviderView(provider=cast(ProviderName, challenge.provider))


@router.post("/provider/register", response_model=ProviderRegisteredView)
async def provider_register(
    request: Request, response: Response, body: ProviderRegisterRequest, db: AccountDb
) -> ProviderRegisteredView:
    """Create the account of a verified provider identity once consent is given."""
    require_origin(request)
    device, fresh_device = device_of(request)
    try:
        async with db.begin():
            challenge = await pending_challenge(request, db)
            subject = challenge.pending_subject
            assert subject is not None
            return_path = challenge.return_path
            linked = await db.scalar(
                select(AccountIdentity).where(
                    AccountIdentity.provider == challenge.provider,
                    AccountIdentity.subject == subject,
                )
            )
            if linked is None:
                user = AccountUser(
                    privacy_consent_version=body.privacy_consent_version,
                    privacy_consented_at=service.now(),
                )
                db.add(user)
                await db.flush()
                db.add(
                    AccountIdentity(user_id=user.id, provider=challenge.provider, subject=subject)
                )
                account_id = user.id
            else:
                account_id = linked.user_id
            await db.delete(challenge)
            sign_in = await service.create_session(
                db, account_id, raw_session_token(request), device
            )
            current = await service.current_session(db, sign_in.opaque)
            assert current is not None
            view = await _view(db, current)
    except IntegrityError as exc:
        raise HTTPException(409, "provider already linked") from exc
    set_session_cookie(response, sign_in.opaque)
    if fresh_device:
        set_device_cookie(response, fresh_device)
    clear_provider_cookie(response)
    return ProviderRegisteredView(
        account=view,
        csrf_token=csrf_token(sign_in.opaque, settings.auth_csrf_secret.get_secret_value()),
        return_to=safe_return_path(return_path),
    )


def moscow_time(moment) -> str:
    return moment.astimezone(MOSCOW).strftime("%d.%m.%Y %H:%M")


async def notify_new_device(db: AsyncSession, user_id: UUID, device: Device) -> None:
    """A service notice to the verified address; nothing is sent without one."""
    credential = await db.get(AccountPassword, user_id)
    if credential is None or credential.email_verified_at is None:
        return
    place = f"{device.city} · " if device.city else ""
    try:
        await send_account_mail(
            credential.email_normalized,
            "Вход в Кодумку с нового устройства",
            f"В ваш аккаунт Кодумки вошли с нового устройства: {place}{device.label}, "
            f"{moscow_time(service.now())} (мск).\n\n"
            "Если это были вы, ничего делать не нужно.\n"
            "Если нет — смените пароль и завершите чужие сеансы в разделе «Где выполнен вход»: "
            f"{settings.public_origin}/account\n",
        )
    except MailUnavailable:
        logger.warning("account.new_device_mail_unavailable")


@router.delete("/providers/{provider}", status_code=status.HTTP_204_NO_CONTENT)
async def unlink_provider(
    provider: str,
    request: Request,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> None:
    require_origin(request)
    require_csrf(request, x_csrf_token)
    current = await active_session(request, db)
    if current.authenticated_at < service.now() - service.RECENT_AUTH:
        raise HTTPException(403, "recent authentication required")
    selected = provider_name(provider)
    identity = await db.scalar(
        select(AccountIdentity).where(
            AccountIdentity.user_id == current.user_id,
            AccountIdentity.provider == selected,
        )
    )
    if identity is None:
        raise HTTPException(404, "login method unavailable")
    _, methods = await service.account_view(db, current.user_id)
    if len(methods) <= 1:
        raise HTTPException(409, "last login method cannot be removed")
    await db.delete(identity)
    await db.commit()


async def _view(db: AsyncSession, session: AccountSession) -> AccountView:
    email, methods = await service.account_view(db, session.user_id)
    return AccountView(
        id=str(session.user_id),
        email=email,
        methods=[LoginMethod(provider=method) for method in methods],
    )


async def deliver_pending_mail(
    db: AsyncSession, email: str, token: str, subject: str, body: str
) -> bool:
    """Send a newly issued link, forgetting it when the SMTP relay rejects delivery."""
    try:
        await send_account_mail(email, subject, body)
    except MailUnavailable:
        async with db.begin():
            await service.retract_token(db, token)
        return False
    return True


@router.get("/session", response_model=SessionView)
async def get_session(request: Request, db: AccountDb) -> SessionView:
    current = await service.current_session(db, raw_session_token(request))
    if current is None:
        return SessionView(account=None)
    raw = raw_session_token(request)
    assert raw is not None
    device, _ = device_of(request)
    await service.touch_session(db, current, device)
    view = await _view(db, current)
    await db.commit()
    return SessionView(
        account=view,
        csrf_token=csrf_token(raw, settings.auth_csrf_secret.get_secret_value()),
    )


@router.get("/sessions", response_model=list[SignedInDevice])
async def list_sessions(request: Request, db: AccountDb) -> list[SignedInDevice]:
    """Where the account is signed in (SPEC §6.2), for its owner only."""
    current = await active_session(request, db)
    return [
        SignedInDevice(
            id=str(item.id),
            label=item.device_label or "Браузер",
            city=item.city,
            last_seen_at=item.last_seen_at or item.authenticated_at,
            current=item.id == current.id,
        )
        for item in await service.active_sessions(db, current.user_id)
    ]


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def end_session(
    session_id: UUID,
    request: Request,
    response: Response,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> None:
    require_origin(request)
    require_csrf(request, x_csrf_token)
    current = await active_session(request, db)
    if not await service.revoke_sessions(db, current.user_id, only=session_id):
        raise HTTPException(404, "session not found")
    await db.commit()
    if session_id == current.id:
        clear_session_cookie(response)


@router.delete("/sessions", status_code=status.HTTP_204_NO_CONTENT)
async def end_other_sessions(
    request: Request,
    db: AccountDb,
    others: Annotated[bool, Query()] = False,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> None:
    require_origin(request)
    require_csrf(request, x_csrf_token)
    if not others:
        raise HTTPException(400, "others=1 required")
    current = await active_session(request, db)
    await service.revoke_sessions(db, current.user_id, keep=current.id)
    await db.commit()


@router.post("/register", status_code=status.HTTP_202_ACCEPTED)
async def register(request: Request, body: RegisterRequest, db: AccountDb) -> dict[str, str]:
    require_origin(request)
    if not settings.smtp_host or not settings.mail_from:
        raise HTTPException(503, "account mail unavailable")
    try:
        async with db.begin():
            pending = await service.register(
                db, str(body.email), body.password, body.privacy_consent_version
            )
    except IntegrityError:
        pending = None
    if pending:
        email, token = pending
        await deliver_pending_mail(
            db,
            email,
            token,
            "Подтвердите адрес для Кодумки",
            f"Подтвердите адрес: {settings.public_origin}/verify-email?token={token}\n"
            "Ссылка действует 30 минут.",
        )
    return {"status": "if eligible, verification mail was sent"}


@router.post("/verification/request", status_code=status.HTTP_202_ACCEPTED)
async def request_verification(
    request: Request, body: RecoveryRequest, db: AccountDb
) -> dict[str, str]:
    require_origin(request)
    if not settings.smtp_host or not settings.mail_from:
        raise HTTPException(503, "account mail unavailable")
    async with db.begin():
        pending = await service.issue_token(db, str(body.email), "email_verify")
    if pending:
        email, token = pending
        await deliver_pending_mail(
            db,
            email,
            token,
            "Подтвердите адрес для Кодумки",
            f"Подтвердите адрес: {settings.public_origin}/verify-email?token={token}\n",
        )
    return {"status": "if eligible, verification mail was sent"}


@router.post("/verify-email", status_code=status.HTTP_204_NO_CONTENT)
async def verify_email(request: Request, body: TokenRequest, db: AccountDb) -> None:
    require_origin(request)
    try:
        async with db.begin():
            await service.verify_email(db, body.token)
    except service.InvalidCredentials as exc:
        raise HTTPException(400, str(exc)) from exc


@router.post("/login", response_model=SessionView)
async def login(
    request: Request, response: Response, body: LoginRequest, db: AccountDb
) -> SessionView:
    require_origin(request)
    device, fresh_device = device_of(request)
    try:
        async with db.begin():
            sign_in = await service.login(
                db, str(body.email), body.password, raw_session_token(request), device
            )
            current = await service.current_session(db, sign_in.opaque)
            assert current is not None
            user_id = current.user_id
            view = await _view(db, current)
    except service.InvalidCredentials as exc:
        raise HTTPException(401, "invalid credentials") from exc
    if sign_in.new_device:
        await notify_new_device(db, user_id, device)
    set_session_cookie(response, sign_in.opaque)
    if fresh_device:
        set_device_cookie(response, fresh_device)
    return SessionView(
        account=view,
        csrf_token=csrf_token(sign_in.opaque, settings.auth_csrf_secret.get_secret_value()),
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: Request,
    response: Response,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> None:
    require_origin(request)
    require_csrf(request, x_csrf_token)
    current = await active_session(request, db)
    await service.revoke_session(db, current)
    await db.commit()
    clear_session_cookie(response)


@router.post("/password-reset/request", status_code=status.HTTP_202_ACCEPTED)
async def request_reset(request: Request, body: RecoveryRequest, db: AccountDb) -> dict[str, str]:
    require_origin(request)
    if not settings.smtp_host or not settings.mail_from:
        raise HTTPException(503, "account mail unavailable")
    async with db.begin():
        pending = await service.issue_token(db, str(body.email), "password_reset")
    if pending:
        email, token = pending
        await deliver_pending_mail(
            db,
            email,
            token,
            "Восстановление доступа к Кодумке",
            f"Сбросьте пароль: {settings.public_origin}/password-reset?token={token}"
            f"{'&returnTo=%2Faccount' if body.return_to == '/account' else ''}\n"
            "Ссылка действует 20 минут.",
        )
    return {"status": "if eligible, recovery mail was sent"}


@router.post("/password-reset/confirm", status_code=status.HTTP_204_NO_CONTENT)
async def confirm_reset(request: Request, body: ResetPasswordRequest, db: AccountDb) -> None:
    require_origin(request)
    try:
        async with db.begin():
            await service.reset_password(db, body.token, body.password)
    except service.InvalidCredentials as exc:
        raise HTTPException(400, str(exc)) from exc


@router.get("/account", response_model=AccountView)
async def get_account(request: Request, db: AccountDb) -> AccountView:
    current = await active_session(request, db)
    return await _view(db, current)


@router.post("/account/email-method", status_code=status.HTTP_202_ACCEPTED)
async def add_email_method(
    request: Request,
    body: AddEmailMethodRequest,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> dict[str, str]:
    require_origin(request)
    require_csrf(request, x_csrf_token)
    current = await active_session(request, db)
    if current.authenticated_at < service.now() - service.RECENT_AUTH:
        raise HTTPException(403, "recent authentication required")
    if not settings.smtp_host or not settings.mail_from:
        raise HTTPException(503, "account mail unavailable")
    try:
        pending = await service.add_email_method(
            db, current.user_id, str(body.email), body.password
        )
        await db.commit()
    except service.EmailMethodConflict:
        await db.rollback()
        return {"status": "if eligible, verification mail was sent"}
    except service.MailRateLimited as exc:
        raise HTTPException(429, "account mail limit reached") from exc
    except service.InvalidCredentials as exc:
        raise HTTPException(401, "sign in required") from exc
    except IntegrityError:
        await db.rollback()
        return {"status": "if eligible, verification mail was sent"}
    email, token = pending
    delivered = await deliver_pending_mail(
        db,
        email,
        token,
        "Подтвердите адрес для Кодумки",
        f"Подтвердите адрес: {settings.public_origin}/verify-email?token={token}\n"
        "Ссылка действует 30 минут.",
    )
    if not delivered:
        raise HTTPException(503, "account mail unavailable")
    return {"status": "if eligible, verification mail was sent"}


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(
    request: Request,
    response: Response,
    body: DeleteAccountRequest,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> None:
    require_origin(request)
    require_csrf(request, x_csrf_token)
    if body.confirmation != "DELETE":
        raise HTTPException(400, "confirmation required")
    current = await active_session(request, db)
    try:
        await service.delete_account(db, current, body.password)
        await db.commit()
    except service.InvalidCredentials as exc:
        raise HTTPException(403, str(exc)) from exc
    clear_session_cookie(response)
