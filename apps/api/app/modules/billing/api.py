"""Billing HTTP boundary (Change 192, SPEC §4): plans, checkout, provider notifications
and the owner's payments. Provider calls happen outside database transactions."""

from __future__ import annotations

import asyncio
import html
from typing import Annotated
from urllib.parse import parse_qsl, urlencode
from uuid import UUID

import structlog
from fastapi import APIRouter, Header, HTTPException, Request, Response
from fastapi.responses import HTMLResponse, PlainTextResponse, RedirectResponse
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.modules.account import restrictions
from app.modules.account.api import AccountDb, active_session, require_csrf, require_origin
from app.modules.account.mail import MailUnavailable, send_account_mail
from app.modules.billing import notices, provider, service
from app.modules.billing.documents import current_offer
from app.modules.billing.models import AccessGrant, Payment, ProviderEvent
from app.modules.billing.plans import plans
from app.modules.billing.provider.port import (
    InvalidNotification,
    Notification,
    PaymentRequest,
    ProviderError,
    Status,
)
from app.modules.billing.schemas import (
    CheckoutRequest,
    CheckoutView,
    OfferView,
    PaymentHistory,
    PaymentView,
    PlanView,
)

router = APIRouter(prefix="/billing", tags=["billing"])
logger = structlog.get_logger(__name__)
MAX_NOTIFICATION_BYTES = 16_384


def require_billing() -> None:
    if not settings.billing_enabled:
        raise HTTPException(404, "billing unavailable")


@router.get("/offer", response_model=OfferView)
async def get_offer(response: Response) -> OfferView:
    response.headers["Cache-Control"] = "no-store"
    month = plans()["month"]
    return OfferView(
        billing=settings.billing_enabled,
        paywall=settings.paywall_enabled,
        offer_version=current_offer().version,
        plans=[
            PlanView(
                id=plan.id,
                title=plan.title,
                price_kopecks=plan.price_kopecks,
                days=plan.days,
                monthly_equivalent_kopecks=round(plan.price_kopecks / months),
                months_price_kopecks=month.price_kopecks * months,
            )
            for plan in plans().values()
            # whole month passes the plan covers: twelve for the year (38-ФЗ ст. 5 —
            # the crossed-out sum is twelve real month prices, never a made-up one)
            for months in (max(1, round(plan.days / month.days)),)
        ],
    )


@router.post("/checkout", response_model=CheckoutView)
async def post_checkout(
    request: Request,
    body: CheckoutRequest,
    db: AccountDb,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> CheckoutView:
    require_billing()
    require_origin(request)
    require_csrf(request, x_csrf_token)
    user_id = (await active_session(request, db)).user_id
    # Change 228: a confirmed account address goes to the provider for the receipt; without
    # one Robokassa asks the buyer on its page and reports the address in its notification
    email = await restrictions.verified_email(db, user_id)
    gateway = provider.current()
    await db.commit()  # end the read transaction; the checkout is its own
    try:
        async with db.begin():
            payment = await service.checkout(
                db,
                user_id=user_id,
                email=email,
                plan_id=body.plan,
                offer_version=body.offer_version,
                idempotency_key=body.idempotency_key,
                return_path=body.return_path,
                provider=gateway.name,
            )
            payment_id, invoice_no, amount = payment.id, payment.invoice_no, payment.amount_kopecks
            title = plans()[body.plan].title
    except service.CheckoutRefused as exc:
        raise HTTPException(409, exc.code) from exc
    back = f"{settings.public_origin}/subscribe/return?payment={payment_id}"
    return CheckoutView(
        payment_id=payment_id,
        redirect_url=gateway.payment_url(
            PaymentRequest(
                invoice_no=invoice_no,
                amount_kopecks=amount,
                description=f"{title} — Кодумка",
                email=email,
                success_url=back,
                fail_url=back,
            )
        ),
    )


# Notices sent after a request has answered; kept here so the loop does not drop them.
_mail_tasks: set[asyncio.Task[None]] = set()


async def _deliver_paid(payment_id: UUID, recipient: str, subject: str, text: str) -> None:
    try:
        await send_account_mail(recipient, subject, text)
    except MailUnavailable:
        logger.warning("billing.mail_unavailable", payment_id=str(payment_id), notice="paid")


async def mail_paid(db: AsyncSession, payment_id: UUID, *, detach: bool = False) -> None:
    """Best effort: the purchase stands even if the relay is down. In a request the SMTP
    exchange runs detached (`detach`), outside the request's database time limit, so a slow
    relay never turns a recorded payment into an error for the provider or the buyer."""
    async with db.begin():
        payment = await db.get(Payment, payment_id)
        grant = await db.scalar(select(AccessGrant).where(AccessGrant.payment_id == payment_id))
        if payment is None or grant is None or not payment.contact_email:
            return
        recipient = payment.contact_email
        subject, text = notices.paid(payment.amount_kopecks, grant.ends_at, payment.receipt_url)
    if not detach:
        await _deliver_paid(payment_id, recipient, subject, text)
        return
    task = asyncio.create_task(_deliver_paid(payment_id, recipient, subject, text))
    _mail_tasks.add(task)
    task.add_done_callback(_mail_tasks.discard)


async def settle(db: AsyncSession, invoice_no: int, status: Status) -> None:
    """Apply a provider status inside a request; the paid notice goes out detached."""
    async with db.begin():
        settled = await service.apply_status(db, invoice_no, status)
    if settled is not None and settled.newly_paid:
        await mail_paid(db, settled.payment_id, detach=True)


async def process(db: AsyncSession, gateway: provider.PaymentProvider, note: Notification) -> None:
    """Record the event once, apply what the signed notification states, then ask the
    provider for its own record to keep the operation key for refunds."""
    async with db.begin():
        await db.execute(
            insert(ProviderEvent)
            .values(
                provider=gateway.name,
                event_key=note.event_key,
                payload=note.payload,
                status="received",
            )
            .on_conflict_do_nothing(index_elements=["provider", "event_key"])
        )
        if note.payer_email:
            # Change 228: the buyer's receipt address becomes the payment's contact, unless the
            # account's own confirmed address is already there; an account deleted meanwhile
            # (user_id NULL) is not given one back
            await db.execute(
                update(Payment)
                .where(
                    Payment.invoice_no == note.invoice_no,
                    Payment.contact_email.is_(None),
                    Payment.user_id.is_not(None),
                )
                .values(contact_email=note.payer_email)
            )
    await settle(db, note.invoice_no, Status(note.state, amount_kopecks=note.amount_kopecks))
    try:
        reported = await gateway.fetch_status(note.invoice_no)
    except ProviderError:
        reported = None  # the hourly settle job fills the operation key later
    if reported is not None and reported.state == note.state:
        await settle(db, note.invoice_no, reported)
    async with db.begin():
        event = await db.scalar(
            select(ProviderEvent).where(
                ProviderEvent.provider == gateway.name, ProviderEvent.event_key == note.event_key
            )
        )
        if event is not None:
            event.status = "processed"


@router.api_route(
    "/webhooks/{provider_name}",
    methods=["GET", "POST"],
    response_class=PlainTextResponse,
    include_in_schema=False,
)
async def webhook(provider_name: str, request: Request, db: AccountDb) -> PlainTextResponse:
    """Provider notifications: no session or CSRF; the signature is the authentication."""
    require_billing()
    gateway = provider.current()
    if provider_name != gateway.name:
        raise HTTPException(404, "unknown provider")
    raw = await request.body()
    if len(raw) > MAX_NOTIFICATION_BYTES:
        raise HTTPException(413, "notification too large")
    fields = dict(request.query_params) | dict(parse_qsl(raw.decode("utf-8", "replace")))
    try:
        note = gateway.parse_notification(fields)
    except InvalidNotification as exc:
        logger.warning("billing.notification_rejected", provider=gateway.name, reason=str(exc))
        raise HTTPException(400, "invalid notification") from exc
    await process(db, gateway, note)
    return PlainTextResponse(gateway.acknowledge(note))


def payment_view(payment: Payment, grant: AccessGrant | None) -> PaymentView:
    return PaymentView(
        id=payment.id,
        plan=payment.plan,  # type: ignore[arg-type]
        amount_kopecks=payment.amount_kopecks,
        status=payment.status,  # type: ignore[arg-type]
        created_at=payment.created_at,
        paid_at=payment.paid_at,
        access_from=grant.starts_at if grant else None,
        access_until=(grant.revoked_at or grant.ends_at) if grant else None,
        receipt_url=payment.receipt_url,
        return_path=payment.return_path,
    )


@router.get("/payments/{payment_id}", response_model=PaymentView)
async def get_payment(payment_id: UUID, request: Request, db: AccountDb) -> PaymentView:
    """The return page polls this; a pending payment is asked of the provider again."""
    current = await active_session(request, db)
    payment = await db.get(Payment, payment_id)
    if payment is None or payment.user_id != current.user_id:
        raise HTTPException(404, "payment unavailable")
    if payment.status in ("created", "pending") and settings.billing_enabled:
        invoice_no = payment.invoice_no
        await db.rollback()
        try:
            reported = await provider.current().fetch_status(invoice_no)
        except ProviderError:
            reported = None
        if reported is not None and reported.state in ("succeeded", "failed"):
            await settle(db, invoice_no, reported)
        payment = await db.get(Payment, payment_id, populate_existing=True)
        assert payment is not None
    grant = await db.scalar(select(AccessGrant).where(AccessGrant.payment_id == payment.id))
    return payment_view(payment, grant)


@router.get("/payments", response_model=PaymentHistory)
async def get_payments(request: Request, db: AccountDb) -> PaymentHistory:
    current = await active_session(request, db)
    rows = await db.execute(
        select(Payment, AccessGrant)
        .outerjoin(AccessGrant, AccessGrant.payment_id == Payment.id)
        .where(
            Payment.user_id == current.user_id,
            Payment.status.in_(("succeeded", "refunded", "pending")),
        )
        .order_by(Payment.created_at.desc())
        .limit(100)
    )
    return PaymentHistory(payments=[payment_view(p, g) for p, g in rows.all()])


# The fake provider's pay page: local runs and tests only, never production.
@router.get("/fake/pay/{invoice_no}", response_class=HTMLResponse, include_in_schema=False)
async def fake_pay_page(
    invoice_no: int, amount: int, success: str, fail: str, email: str = ""
) -> HTMLResponse:
    if settings.billing_provider != "fake" or settings.is_production:
        raise HTTPException(404, "not found")
    query = html.escape(urlencode({"amount": amount, "success": success, "fail": fail}))
    # Change 228: without the shop's address the buyer types one for the receipt, as at Robokassa
    address = (
        f'<input type=hidden name=email value="{html.escape(email, quote=True)}">'
        if email
        else "<label>Почта для чека <input type=email name=email required></label> "
    )
    return HTMLResponse(
        "<!doctype html><meta charset=utf-8><title>Тестовая оплата</title>"
        f"<h1>Тестовая оплата: {amount // 100} ₽</h1>"
        f'<form method=post action="/api/billing/fake/pay/{invoice_no}?{query}">'
        f"{address}"
        "<button name=state value=succeeded>Оплатить</button> "
        "<button name=state value=failed formnovalidate>Отказаться</button></form>"
    )


@router.post("/fake/pay/{invoice_no}", include_in_schema=False)
async def fake_pay(
    invoice_no: int, amount: int, success: str, fail: str, request: Request, db: AccountDb
) -> RedirectResponse:
    if settings.billing_provider != "fake" or settings.is_production:
        raise HTTPException(404, "not found")
    from app.modules.billing.provider.fake import FakeProvider

    form = dict(parse_qsl((await request.body()).decode()))
    state = form.get("state")
    if state not in ("succeeded", "failed"):
        raise HTTPException(422, "unknown outcome")
    gateway = FakeProvider()
    note = gateway.parse_notification(
        gateway.settle(invoice_no, amount, state, form.get("email", ""))
    )
    await process(db, gateway, note)
    target = success if state == "succeeded" else fail
    if not target.startswith(settings.public_origin + "/"):
        target = settings.public_origin + "/"
    return RedirectResponse(target, status_code=303)
