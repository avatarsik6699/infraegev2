"""Change 192: paid access and one-time payments against real PostgreSQL roles."""

import asyncio
import json
import re
from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr
from sqlalchemy import select, text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.main import create_app
from app.modules.account import api as account_api
from app.modules.billing import api as billing_api
from app.modules.billing import service
from app.modules.billing.documents import current_offer
from app.modules.billing.models import AccessGrant, Payment, Refund
from app.modules.billing.provider.fake import LEDGER, FakeProvider
from app.modules.entitlement.registry import task_access
from app.modules.practice.schemas import Bank
from tests.test_minimal_bank import BANK, database  # noqa: F401

ORIGIN = {"Origin": "http://testserver"}
SOURCE = Bank.model_validate_json((BANK / "bank.json").read_bytes())


def first_task(access: str, material_kind: str = "topic"):
    materials = {item.id: item for item in SOURCE.materials}
    for entry in SOURCE.tasks:
        task = entry.task
        if task.archived or not task.lessons:
            continue
        kinds = {materials[link.material_id].kind for link in task.lessons}
        if kinds == {material_kind} and task_access(task.model_dump()) == access:
            return entry
    raise AssertionError(f"no {access} {material_kind} task in the bank")


def test_task_access_follows_the_matrix():
    paid = first_task("paid")
    free = first_task("free")
    assert paid.task.catalog_visible is False
    assert task_access({**paid.task.model_dump(), "catalog_visible": True}) == "free"
    assert task_access(free.task.model_dump()) == "free"
    # a task of the free Python course is free; of a paid Excel lesson it is paid
    assert task_access(first_task("free", "course").task.model_dump()) == "free"
    assert task_access(first_task("paid", "course").task.model_dump()) == "paid"


def test_unused_days_are_refunded_in_whole_days():
    payment = Payment(amount_kopecks=49_000, days=30)
    start = datetime(2027, 9, 1, tzinfo=UTC)
    grant = AccessGrant(starts_at=start, ends_at=start + timedelta(days=30))
    assert service.unused_kopecks(payment, grant, start) == 49_000
    assert service.unused_kopecks(payment, grant, start + timedelta(hours=1)) == 47_366
    assert service.unused_kopecks(payment, grant, start + timedelta(days=29, hours=1)) == 0
    assert service.unused_kopecks(payment, grant, start + timedelta(days=31)) == 0
    grant.revoked_at = start
    assert service.unused_kopecks(payment, grant, start) == 0


@pytest.fixture
def paid_site(database, monkeypatch):  # noqa: F811
    sent: list[tuple[str, str]] = []

    async def fake_mail(recipient: str, subject: str, body: str) -> None:
        sent.append((recipient, body))

    monkeypatch.setattr(account_api, "send_account_mail", fake_mail)
    monkeypatch.setattr(billing_api, "send_account_mail", fake_mail)
    monkeypatch.setattr(settings, "database_url", database("runtime"))
    monkeypatch.setattr(settings, "account_database_url", database("app"))
    monkeypatch.setattr(settings, "public_origin", "http://testserver")
    monkeypatch.setattr(settings, "auth_csrf_secret", SecretStr("b" * 48))
    monkeypatch.setattr(settings, "smtp_host", "fake-relay")
    monkeypatch.setattr(settings, "mail_from", "no-reply@example.com")
    monkeypatch.setattr(settings, "billing_provider", "fake")
    LEDGER.clear()
    return sent


def member(client: TestClient, sent: list[tuple[str, str]], email: str) -> dict[str, str]:
    assert (
        client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "correct horse battery",
                "privacy_consent": True,
                "privacy_consent_version": "2026-09-25",
            },
            headers=ORIGIN,
        ).status_code
        == 202
    )
    token = re.search(r"token=([A-Za-z0-9_-]+)", sent[-1][1])
    assert token is not None
    client.post("/api/auth/verify-email", json={"token": token.group(1)}, headers=ORIGIN)
    login = client.post(
        "/api/auth/login",
        json={"email": email, "password": "correct horse battery"},
        headers=ORIGIN,
    )
    return {**ORIGIN, "X-CSRF-Token": login.json()["csrf_token"]}


def checkout(client: TestClient, headers: dict[str, str], plan: str = "month") -> dict:
    response = client.post(
        "/api/billing/checkout",
        json={
            "plan": plan,
            "offer_version": current_offer().version,
            "idempotency_key": uuid4().hex,
            "return_path": "/ege/25-deliteli-i-maski/maski",
        },
        headers=headers,
    )
    assert response.status_code == 200, response.text
    return response.json()


def pay(client: TestClient, invoice_no: int, amount: int, state: str = "succeeded") -> None:
    query = f"amount={amount}&success=http://testserver/ok&fail=http://testserver/no"
    response = client.post(
        f"/api/billing/fake/pay/{invoice_no}?{query}",
        content=f"state={state}",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        follow_redirects=False,
    )
    assert response.status_code == 303


def invoice_of(redirect_url: str) -> tuple[int, int]:
    match = re.search(r"/fake/pay/(\d+)\?amount=(\d+)", redirect_url)
    assert match is not None
    return int(match.group(1)), int(match.group(2))


def test_flags_off_keep_everything_free(paid_site):
    paid = first_task("paid")
    with TestClient(create_app()) as client:
        assert client.get(f"/api/tasks/{paid.task.id}").status_code == 200
        assert client.get("/api/access/asset").status_code == 204
        access = client.get("/api/access").json()
        assert access == {"paywall": False, "signed_in": False, "granted": True, "until": None}
        assert client.post("/api/billing/checkout", json={}, headers=ORIGIN).status_code in (
            404,
            422,
        )
        assert client.get("/api/billing/offer").json()["billing"] is False


def test_offer_year_compares_twelve_month_prices():
    """The crossed-out year sum is twelve real month prices; the per-month
    figure divides the year price by those twelve (38-ФЗ ст. 5)."""
    with TestClient(create_app()) as client:
        plans = {plan["id"]: plan for plan in client.get("/api/billing/offer").json()["plans"]}
    month, year = plans["month"], plans["year"]
    assert year["months_price_kopecks"] == 12 * month["price_kopecks"]
    assert year["monthly_equivalent_kopecks"] == round(year["price_kopecks"] / 12)
    assert month["months_price_kopecks"] == month["price_kopecks"]


def test_paywall_purchase_extension_refund_and_deletion(paid_site, database, monkeypatch):  # noqa: F811
    monkeypatch.setattr(settings, "billing_enabled", True)
    monkeypatch.setattr(settings, "paywall_enabled", True)
    paid, free = first_task("paid"), first_task("free")
    material = next(link.material_id for link in paid.task.lessons)
    with TestClient(create_app()) as client:
        # a guest sees the paid task only as a locked stub
        assert client.get(f"/api/tasks/{paid.task.id}").status_code == 403
        assert client.get(f"/api/tasks/{free.task.id}").status_code == 200
        lesson = client.get(f"/api/learning-materials/topic/{material}/practice").json()
        assert paid.task.id in {item["id"] for item in lesson["locked"]}
        assert paid.task.id not in {item["id"] for item in lesson["tasks"]}
        locked = next(item for item in lesson["locked"] if item["id"] == paid.task.id)
        assert set(locked) == {
            "id",
            "solution_revision",
            "title",
            "difficulty",
            "skills",
            "exam_numbers",
            "theory_links",
            "counts_toward_mastery",
        }
        check = {"answer": "1", "solution_revision": paid.solution_revision}
        assert client.post(f"/api/tasks/{paid.task.id}/check", json=check).status_code == 403
        assert client.get("/api/access/asset").status_code == 403

        headers = member(client, paid_site, "buyer@example.com")
        assert client.get("/api/access").json()["granted"] is False

        started = checkout(client, headers)
        invoice_no, amount = invoice_of(started["redirect_url"])
        assert amount == settings.billing_month_price_kopecks
        # the same key returns the same payment
        again = client.post(
            "/api/billing/checkout",
            json={
                "plan": "month",
                "offer_version": current_offer().version,
                "idempotency_key": "x" * 16,
            },
            headers=headers,
        )
        assert again.status_code == 200
        repeat = client.post(
            "/api/billing/checkout",
            json={
                "plan": "month",
                "offer_version": current_offer().version,
                "idempotency_key": "x" * 16,
            },
            headers=headers,
        )
        assert repeat.json()["payment_id"] == again.json()["payment_id"]
        outdated = client.post(
            "/api/billing/checkout",
            json={"plan": "month", "offer_version": "2000-01-01", "idempotency_key": "y" * 16},
            headers=headers,
        )
        assert outdated.status_code == 409 and outdated.json()["detail"] == "offer_outdated"

        pay(client, invoice_no, amount)
        status = client.get(f"/api/billing/payments/{started['payment_id']}").json()
        assert status["status"] == "succeeded"
        assert status["return_path"] == "/ege/25-deliteli-i-maski/maski"
        assert any("Доступ к материалам открыт до" in body for _, body in paid_site)
        access = client.get("/api/access").json()
        assert access["granted"] is True
        assert client.get("/api/access/asset").status_code == 204
        assert client.get(f"/api/tasks/{paid.task.id}").status_code == 200
        lesson = client.get(f"/api/learning-materials/topic/{material}/practice").json()
        assert lesson["locked"] == []

        # a replayed or forged notification changes nothing
        gateway = FakeProvider()
        fields = gateway.settle(invoice_no, amount, "succeeded")
        assert (
            client.post(
                "/api/billing/webhooks/fake",
                content="&".join(f"{k}={v}" for k, v in fields.items()),
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            ).text
            == f"OK{invoice_no}"
        )
        forged = {**fields, "signature": "0" * 64}
        assert (
            client.post(
                "/api/billing/webhooks/fake",
                content="&".join(f"{k}={v}" for k, v in forged.items()),
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            ).status_code
            == 400
        )

        # a repeat purchase extends from the end of the current access
        second = checkout(client, headers, "year")
        pay(client, *invoice_of(second["redirect_url"]))
        history = client.get("/api/billing/payments").json()["payments"]
        periods = sorted(
            (p["access_from"], p["access_until"]) for p in history if p["status"] == "succeeded"
        )
        assert len(periods) == 2
        assert periods[1][0] == periods[0][1]
        assert client.get("/api/access").json()["until"] == periods[1][1]

        async def ledger():
            engine = database_engine(database("app"), role="infraege_app")
            try:
                async with AsyncSession(engine) as db:
                    async with db.begin():
                        grants = (await db.scalars(select(AccessGrant))).all()
                        assert len({g.payment_id for g in grants}) == len(grants)
                        first = await db.scalar(
                            select(Payment).where(Payment.invoice_no == invoice_no)
                        )
                        assert first is not None
                        first_id = first.id
                        # the operator refunds the first payment in full
                        refund = await service.request_refund(
                            db, first, first.amount_kopecks, "operator"
                        )
                        assert refund is not None
                        refund_id = refund.id
                    done = await service.execute_refund(db, FakeProvider(), refund_id)
                    assert done.status == "succeeded"
                    async with db.begin():
                        first = await db.get(Payment, first_id, populate_existing=True)
                        assert first is not None and first.status == "refunded"
                        revoked = await db.scalar(
                            select(AccessGrant.revoked_at).where(AccessGrant.payment_id == first_id)
                        )
                        assert revoked is not None
                    # evidence stays append-only for the application role
                    for statement in (
                        "UPDATE practice.billing_offer_acceptance SET version = 'x'",
                        "DELETE FROM practice.billing_payment",
                        "DELETE FROM practice.access_grant",
                    ):
                        with pytest.raises(DBAPIError, match="permission denied"):
                            async with db.begin():
                                await db.execute(text(statement))
            finally:
                await engine.dispose()

        asyncio.run(ledger())

        # deleting the account ends access, requests a refund and pseudonymizes
        deleted = client.request(
            "DELETE",
            "/api/auth/account",
            json={"confirmation": "DELETE", "password": "correct horse battery"},
            headers=headers,
        )
        assert deleted.status_code == 204

        async def after_deletion():
            engine = database_engine(database("app"), role="infraege_app")
            try:
                async with AsyncSession(engine) as db:
                    payments = (await db.scalars(select(Payment))).all()
                    assert payments and all(p.user_id is None for p in payments)
                    assert all(p.contact_email is None for p in payments)
                    reasons = {r.reason for r in (await db.scalars(select(Refund))).all()}
                    assert "account_deleted" in reasons
            finally:
                await engine.dispose()

        asyncio.run(after_deletion())


def test_checkout_needs_a_confirmed_email_and_billing(paid_site, monkeypatch):
    monkeypatch.setattr(settings, "billing_enabled", True)
    with TestClient(create_app()) as client:
        assert (
            client.post(
                "/api/billing/checkout",
                json={
                    "plan": "month",
                    "offer_version": current_offer().version,
                    "idempotency_key": uuid4().hex,
                },
                headers=ORIGIN,
            ).status_code
            == 403
        )


def test_jobs_settle_missed_notifications_expire_orders_and_notify(
    paid_site,
    database,  # noqa: F811
    monkeypatch,
):
    from app.modules.billing import jobs

    monkeypatch.setattr(settings, "billing_enabled", True)
    monkeypatch.setattr(jobs, "send_account_mail", billing_api.send_account_mail)
    with TestClient(create_app()) as client:
        headers = member(client, paid_site, "late@example.com")
        paid_order = checkout(client, headers)
        abandoned = checkout(client, headers)
    paid_no, amount = invoice_of(paid_order["redirect_url"])
    abandoned_no, _ = invoice_of(abandoned["redirect_url"])
    # the provider took the money but its notification never arrived
    LEDGER[paid_no] = ("succeeded", amount)

    async def scenario():
        engine = database_engine(database("app"), role="infraege_app")
        try:
            async with AsyncSession(engine) as db:
                async with db.begin():
                    await db.execute(
                        text(
                            "UPDATE practice.billing_payment SET created_at = now() - "
                            "interval '2 hours' WHERE invoice_no IN (:a, :b)"
                        ),
                        {"a": paid_no, "b": abandoned_no},
                    )
                await jobs.settle_open(db, FakeProvider())
                async with db.begin():
                    rows = await db.execute(
                        select(Payment.invoice_no, Payment.status).where(
                            Payment.invoice_no.in_((paid_no, abandoned_no))
                        )
                    )
                    states = {invoice_no: status for invoice_no, status in rows}
                    assert states == {paid_no: "succeeded", abandoned_no: "failed"}
                    # the access ends in two days: one notice, never two
                    await db.execute(
                        text(
                            "UPDATE practice.access_grant SET ends_at = now() + interval '2 days' "
                            "WHERE payment_id = (SELECT id FROM practice.billing_payment "
                            "WHERE invoice_no = :a)"
                        ),
                        {"a": paid_no},
                    )
                before = len(paid_site)
                await jobs.ending_notices(db)
                await jobs.ending_notices(db)
                assert len(paid_site) == before + 1
                assert "Доступ к платным материалам действует до" in paid_site[-1][1]
                # Change 194: the operator funnel counts both orders by their own outcome
                from app.modules.billing import admin

                lines = [line for line in await admin.funnel(db, 2) if line["plan"] == "month"]
                assert sum(line["orders"] for line in lines) >= 2
                # Change 195: the monitoring summary carries counts and sums, never people
                summary = await admin.export(db)
                assert summary["schema"] == "kodumka.business/1"
                assert {
                    "funnel",
                    "registrations",
                    "accounts_total",
                    "paying_accounts_total",
                    "access",
                    "npd",
                    "problems",
                } <= set(summary)
                assert summary["paying_accounts_total"] >= 1
                assert summary["access"]["active"] >= 1
                assert summary["access"]["ending_7d"] >= 1
                assert sum(day["accounts"] for day in summary["registrations"]) >= 1
                dumped = json.dumps(summary, default=str)
                assert "@" not in dumped
                assert not re.search(r"[0-9a-f]{8}-[0-9a-f]{4}-", dumped)
                assert sum(line["paid"] for line in lines) >= 1
                assert sum(line["failed"] for line in lines) >= 1
                assert all(
                    set(line)
                    == {"day", "plan", "orders", "paid", "failed", "open", "refunded", "kopecks"}
                    for line in lines
                )
        finally:
            await engine.dispose()

    asyncio.run(scenario())
