"""Change 227: the whole account lifecycle through the local stand-in for VK ID and Яндекс ID.

Every scenario goes through the real start → provider → callback path; only the provider page is
the fake one. Time moves with `account_service.now`, so the ten-minute window is exercised exactly.
"""

import asyncio
from datetime import UTC, datetime, timedelta
from urllib.parse import parse_qs, urlsplit
from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, settings
from app.core.database import database_engine
from app.main import create_app
from app.modules.account import service as account_service
from app.modules.billing import admin
from app.modules.billing.models import AccessGrant, Payment, Refund
from tests.test_billing import ORIGIN, checkout, invoice_of, member, paid_site, pay  # noqa: F401
from tests.test_minimal_bank import consent_step, database  # noqa: F401

PASSWORD = "correct horse battery"


@pytest.fixture
def site(paid_site, monkeypatch):  # noqa: F811
    monkeypatch.setattr(settings, "auth_fake_providers", True)
    monkeypatch.setattr(settings, "vk_enabled", True)
    monkeypatch.setattr(settings, "yandex_enabled", True)
    clock = {"now": datetime.now(UTC), "mails": paid_site}
    monkeypatch.setattr(account_service, "now", lambda: clock["now"])
    return clock


def state_of(url: str) -> str:
    return parse_qs(urlsplit(url).query)["state"][0]


def callback(client: TestClient, provider: str, state: str, subject: str | None) -> str:
    params = {"state": state, **({"code": subject} if subject else {"error": "access_denied"})}
    response = client.get(
        f"/api/auth/providers/{provider}/callback", params=params, follow_redirects=False
    )
    assert response.status_code == 303, response.text
    return response.headers["location"]


def headers_of(client: TestClient) -> dict[str, str]:
    return {**ORIGIN, "X-CSRF-Token": client.get("/api/auth/session").json()["csrf_token"]}


def account(client: TestClient) -> dict:
    return client.get("/api/auth/session").json()["account"]


def methods(client: TestClient) -> set[str]:
    return {method["provider"] for method in account(client)["methods"]}


def sign_in(client: TestClient, provider: str, subject: str, return_to: str = "/") -> str:
    """Signs in through the stand-in provider; returns where the browser lands."""
    started = client.get(
        f"/api/auth/providers/{provider}/start",
        params={"return_to": return_to},
        follow_redirects=False,
    )
    assert started.headers["location"].startswith(f"/api/auth/fake-provider/{provider}?")
    landed = callback(client, provider, state_of(started.headers["location"]), subject)
    if landed == "/register/provider":
        return consent_step(client, ORIGIN)["return_to"]
    return landed


def link(client: TestClient, provider: str, subject: str) -> str:
    started = client.post(f"/api/auth/providers/{provider}/link", headers=headers_of(client))
    assert started.status_code == 200, started.text
    return callback(client, provider, state_of(started.json()["url"]), subject)


def reconfirm(client: TestClient, provider: str, subject: str, resume: str | None = None) -> str:
    started = client.post(
        f"/api/auth/providers/{provider}/reauth",
        json={"resume": resume} if resume else None,
        headers=headers_of(client),
    )
    assert started.status_code == 200, started.text
    return callback(client, provider, state_of(started.json()["url"]), subject)


def unlink(client: TestClient, provider: str) -> int:
    return client.delete(f"/api/auth/providers/{provider}", headers=headers_of(client)).status_code


def test_stand_in_provider_is_local_only(site):
    with TestClient(create_app()) as client:
        page = client.get("/api/auth/fake-provider/vk", params={"state": "s" * 43})
        assert page.status_code == 200
        assert 'action="/api/auth/providers/vk/callback"' in page.text
        settings.auth_fake_providers = False
        assert client.get("/api/auth/fake-provider/vk", params={"state": "s" * 43}).status_code == (
            404
        )
    with pytest.raises(ValidationError, match="never run in production"):
        Settings(app_env="production", auth_fake_providers=True)


def test_vk_first_account_links_unlinks_and_reconfirms(site):
    with TestClient(create_app()) as client:
        assert sign_in(client, "vk", "life-vk-1") == "/"
        owner = account(client)["id"]
        until = datetime.fromisoformat(account(client)["recent_auth_until"])
        assert until == site["now"] + account_service.RECENT_AUTH
        assert link(client, "yandex", "life-ya-1") == "/account?tab=settings"
        assert methods(client) == {"vk", "yandex"}

        # after ten minutes every login-method change asks for a new confirmation
        site["now"] += timedelta(minutes=11)
        assert unlink(client, "vk") == 403
        assert (
            client.post("/api/auth/providers/vk/link", headers=headers_of(client)).status_code
            == 403
        )
        # confirming through the other linked provider returns to the interrupted action
        landed = reconfirm(client, "yandex", "life-ya-1", resume="unlink:vk")
        assert landed == "/account?tab=settings&resume=unlink%3Avk"
        assert account(client)["id"] == owner
        assert unlink(client, "vk") == 204
        assert methods(client) == {"yandex"}
        assert unlink(client, "yandex") == 409

        # the unlinked VK ID no longer opens this account: it starts a new one, never a merge
        with TestClient(create_app()) as other:
            sign_in(other, "vk", "life-vk-1")
            assert account(other)["id"] != owner
        assert account(client)["id"] == owner


def test_yandex_first_account_adds_password_and_deletes(site):
    with TestClient(create_app()) as client:
        sign_in(client, "yandex", "life-ya-2")
        site["now"] += timedelta(minutes=11)
        delete = {"confirmation": "DELETE"}
        assert (
            client.request(
                "DELETE", "/api/auth/account", json=delete, headers=headers_of(client)
            ).status_code
            == 403
        )
        assert (
            reconfirm(client, "yandex", "life-ya-2", resume="delete")
            == "/account?tab=settings&resume=delete"
        )
        assert (
            client.request(
                "DELETE", "/api/auth/account", json=delete, headers=headers_of(client)
            ).status_code
            == 204
        )
        assert client.get("/api/auth/session").json()["account"] is None


def test_password_confirms_without_signing_out(site):
    with TestClient(create_app()) as client:
        member(client, site["mails"], "life-email@example.com")
        site["now"] += timedelta(minutes=11)
        assert (
            client.post("/api/auth/providers/vk/link", headers=headers_of(client)).status_code
            == 403
        )
        reauth = "/api/auth/reauth"
        wrong = client.post(reauth, json={"password": "not it"}, headers=headers_of(client))
        assert wrong.status_code == 403
        right = client.post(reauth, json={"password": PASSWORD}, headers=headers_of(client))
        assert right.status_code == 204
        assert datetime.fromisoformat(account(client)["recent_auth_until"]) == (
            site["now"] + account_service.RECENT_AUTH
        )
        assert link(client, "vk", "life-vk-3") == "/account?tab=settings"
        assert methods(client) == {"email", "vk"}
        assert unlink(client, "vk") == 204
        assert client.post(reauth, json={"password": PASSWORD}).status_code == 403  # no CSRF


def test_callback_failures_explain_instead_of_json(site):
    with TestClient(create_app()) as first, TestClient(create_app()) as second:
        sign_in(first, "vk", "life-vk-4")
        sign_in(second, "vk", "life-vk-5")
        # a VK ID of another account is not taken over
        assert link(first, "yandex", "life-ya-4") == "/account?tab=settings"
        assert link(second, "yandex", "life-ya-4") == (
            "/account?tab=settings&auth_error=other_account"
        )
        # one account holds one VK ID
        assert link(first, "vk", "life-vk-6") == "/account?tab=settings&auth_error=already_linked"
        # re-confirmation with someone else's identity does not count
        assert reconfirm(first, "vk", "life-vk-5") == (
            "/account?tab=settings&auth_error=other_account"
        )
        # declining at the provider keeps the way back to the page it started from
        started = first.post("/api/auth/providers/yandex/reauth", headers=headers_of(first))
        assert callback(first, "yandex", state_of(started.json()["url"]), None) == (
            "/account?tab=settings&auth_error=cancelled"
        )
    with TestClient(create_app()) as guest:
        started = guest.get(
            "/api/auth/providers/vk/start",
            params={"return_to": "/subscribe?plan=month"},
            follow_redirects=False,
        )
        assert callback(guest, "vk", state_of(started.headers["location"]), None) == (
            "/sign-in?returnTo=%2Fsubscribe%3Fplan%3Dmonth&auth_error=cancelled"
        )
        assert callback(guest, "vk", "s" * 43, "life-vk-4") == "/sign-in?auth_error=expired"


def test_paid_access_survives_methods_and_ends_with_a_refund(site, database, monkeypatch):  # noqa: F811
    monkeypatch.setattr(settings, "billing_enabled", True)
    monkeypatch.setattr(settings, "paywall_enabled", True)
    with TestClient(create_app()) as client:
        headers = member(client, site["mails"], "life-buyer@example.com")
        owner = account(client)["id"]
        started = checkout(client, headers)
        pay(client, *invoice_of(started["redirect_url"]))
        granted = client.get("/api/access").json()
        assert granted["granted"] is True

        assert link(client, "vk", "life-vk-7") == "/account?tab=settings"
        assert link(client, "yandex", "life-ya-7") == "/account?tab=settings"
        assert unlink(client, "yandex") == 204
        assert client.get("/api/access").json() == granted

        # any linked method opens the same account and the same access
        client.post("/api/auth/logout", headers=headers_of(client))
        assert client.get("/api/access").json()["granted"] is False
        sign_in(client, "vk", "life-vk-7")
        assert account(client)["id"] == owner
        assert client.get("/api/access").json() == granted

        deleted = client.request(
            "DELETE",
            "/api/auth/account",
            json={"confirmation": "DELETE", "password": PASSWORD},
            headers=headers_of(client),
        )
        assert deleted.status_code == 204

    async def after_deletion():
        engine = database_engine(database("app"), role="infraege_app")
        try:
            async with AsyncSession(engine) as db:
                payment = await db.get(Payment, UUID(started["payment_id"]))
                assert payment is not None
                assert payment.user_id is None and payment.contact_email is None
                grants = (
                    await db.scalars(
                        select(AccessGrant).where(AccessGrant.payment_id == payment.id)
                    )
                ).all()
                assert grants and all(grant.revoked_at is not None for grant in grants)
                refunds = (
                    await db.scalars(select(Refund).where(Refund.payment_id == payment.id))
                ).all()
                assert [refund.reason for refund in refunds] == ["account_deleted"]
        finally:
            await engine.dispose()

    asyncio.run(after_deletion())


def test_provider_only_account_pays_with_the_address_typed_at_the_provider(
    site,
    database,  # noqa: F811
    monkeypatch,
):
    """Change 228: no account email, so the pay page asks for one; it gets the paid notice and
    is forgotten with the account."""
    monkeypatch.setattr(settings, "billing_enabled", True)
    monkeypatch.setattr(settings, "paywall_enabled", True)
    with TestClient(create_app()) as client:
        sign_in(client, "vk", "life-vk-payer")
        assert account(client)["email"] is None
        started = checkout(client, headers_of(client))
        invoice, amount = invoice_of(started["redirect_url"])
        assert "email=" not in started["redirect_url"]
        page = client.get(started["redirect_url"].replace("http://testserver", ""))
        assert "name=email required" in page.text
        query = f"amount={amount}&success=http://testserver/ok&fail=http://testserver/no"
        paid = client.post(
            f"/api/billing/fake/pay/{invoice}?{query}",
            content="email=payer%40example.com&state=succeeded",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            follow_redirects=False,
        )
        assert paid.status_code == 303
        assert client.get("/api/access").json()["granted"] is True
        assert any(recipient == "payer@example.com" for recipient, _ in site["mails"])

        async def contact():
            engine = database_engine(database("app"), role="infraege_app")
            try:
                async with AsyncSession(engine) as db:
                    payment = await db.get(Payment, UUID(started["payment_id"]))
                    assert payment is not None
                    return payment.contact_email
            finally:
                await engine.dispose()

        assert asyncio.run(contact()) == "payer@example.com"

        async def operator_view():
            engine = database_engine(database("app"), role="infraege_app")
            try:
                async with AsyncSession(engine) as db:
                    return await admin.show(db, "Payer@Example.com")
            finally:
                await engine.dispose()

        # the operator finds a VK-only buyer by the address the refund request comes from
        assert [row["invoice"] for row in asyncio.run(operator_view())] == [invoice]
        deleted = client.request(
            "DELETE",
            "/api/auth/account",
            json={"confirmation": "DELETE"},
            headers=headers_of(client),
        )
        assert deleted.status_code == 204
        assert asyncio.run(contact()) is None


def test_a_confirmed_account_address_still_goes_to_the_provider(site, monkeypatch):
    monkeypatch.setattr(settings, "billing_enabled", True)
    with TestClient(create_app()) as client:
        headers = member(client, site["mails"], "life-receipt@example.com")
        started = checkout(client, headers)
        assert "email=life-receipt%40example.com" in started["redirect_url"]
        page = client.get(started["redirect_url"].replace("http://testserver", ""))
        assert 'type=hidden name=email value="life-receipt@example.com"' in page.text
