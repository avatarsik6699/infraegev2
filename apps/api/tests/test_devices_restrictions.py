"""Change 198: three devices per account, paid solutions on request, manual restrictions."""

import argparse
import asyncio
from datetime import timedelta
from uuid import UUID

from fastapi.testclient import TestClient
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.main import create_app
from app.modules.account import purge, restrictions
from app.modules.account import service as account_service
from app.modules.account.device import label_of
from app.modules.account.models import AccountActivityDay, AccountDevice, AccountSession
from app.modules.billing import admin
from app.modules.billing.models import AccessGrant, Refund
from tests.test_billing import (  # noqa: F401
    checkout,
    first_task,
    invoice_of,
    member,
    paid_site,
    pay,
)
from tests.test_minimal_bank import database  # noqa: F401

ORIGIN = {"Origin": "http://testserver"}
PASSWORD = "correct horse battery"
CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36"


def sign_in(client: TestClient, email: str, ip: str) -> dict[str, str]:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": PASSWORD},
        headers={**ORIGIN, "X-Real-IP": ip, "User-Agent": CHROME},
    )
    assert response.status_code == 200, response.text
    return {**ORIGIN, "X-CSRF-Token": response.json()["csrf_token"]}


def run_db(database, scenario):  # noqa: F811
    async def wrapped():
        engine = database_engine(database("app"), role="infraege_app")
        try:
            async with AsyncSession(engine) as db:
                return await scenario(db)
        finally:
            await engine.dispose()

    return asyncio.run(wrapped())


def test_device_labels_are_coarse():
    assert label_of(CHROME) == "Chrome · Windows"
    assert label_of("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Version/17.0 Safari/604.1") == (
        "Safari · iPhone"
    )
    assert label_of("Mozilla/5.0 (Linux; Android 14) Chrome/130.0 YaBrowser/24.1") == (
        "Яндекс Браузер · Android"
    )
    assert label_of(None) == "Браузер"


def test_three_devices_new_device_mail_and_sign_out(paid_site, database):  # noqa: F811
    with TestClient(create_app()) as first:
        member(first, paid_site, "devices@example.com")
        mails = len(paid_site)
        # the same browser signing in again is not a new device
        headers = sign_in(first, "devices@example.com", "203.0.113.1")
        assert len(paid_site) == mails
        clients = [TestClient(create_app()) for _ in range(3)]
        try:
            for number, other in enumerate(clients, start=2):
                sign_in(other, "devices@example.com", f"203.0.113.{number}")
            assert len(paid_site) == mails + 3
            assert "с нового устройства" in paid_site[-1][1]
            # the fourth browser pushed out the one used longest ago
            assert first.get("/api/auth/account").status_code == 401
            listed = clients[-1].get("/api/auth/sessions").json()
            assert len(listed) == 3
            assert [item["current"] for item in listed].count(True) == 1
            assert {item["label"] for item in listed} == {"Chrome · Windows"}
            own = clients[-1].get("/api/auth/session").json()["csrf_token"]
            own_headers = {**ORIGIN, "X-CSRF-Token": own}
            assert clients[-1].delete("/api/auth/sessions", headers=own_headers).status_code == 400
            assert (
                clients[-1].delete("/api/auth/sessions?others=1", headers=own_headers).status_code
                == 204
            )
            assert clients[0].get("/api/auth/account").status_code == 401
            assert len(clients[-1].get("/api/auth/sessions").json()) == 1
        finally:
            for other in clients:
                other.close()
        assert headers

    async def counted(db):
        days = (await db.scalars(select(AccountActivityDay))).all()
        assert sum(day.evictions for day in days) >= 1
        assert sum(day.new_devices for day in days) >= 4
        devices = (await db.scalars(select(AccountDevice))).all()
        assert len(devices) >= 4
        sessions = (await db.scalars(select(AccountSession))).all()
        assert all(row.ip is None or row.ip.startswith("203.0.113.") for row in sessions)
        await db.commit()
        # a browser unseen for 90 days is forgotten, the counters after 30 days
        async with db.begin():
            await db.execute(
                update(AccountDevice).values(
                    last_seen_at=account_service.now() - timedelta(days=91)
                )
            )
            await db.execute(
                update(AccountActivityDay).values(day=account_service.today() - timedelta(days=31))
            )
            result = await purge.purge_expired_artifacts(db)
        assert result.devices >= 4 and result.activity_days >= 1

    run_db(database, counted)


def test_paid_solution_comes_on_request(paid_site, database, monkeypatch):  # noqa: F811
    monkeypatch.setattr(settings, "billing_enabled", True)
    monkeypatch.setattr(settings, "paywall_enabled", True)
    paid, free = first_task("paid"), first_task("free")
    assert paid.task.explanation
    with TestClient(create_app()) as client:
        assert client.get(f"/api/tasks/{paid.task.id}/solution").status_code == 401
        headers = member(client, paid_site, "solutions@example.com")
        assert client.get(f"/api/tasks/{paid.task.id}/solution").status_code == 403
        started = checkout(client, headers)
        pay(client, *invoice_of(started["redirect_url"]))
        shown = client.get(f"/api/tasks/{paid.task.id}").json()
        assert shown["content"]["explanation"] == []
        assert shown["solution_on_request"] is True
        solution = client.get(f"/api/tasks/{paid.task.id}/solution")
        assert solution.status_code == 200
        assert solution.json()["explanation"]

        # Change 199: an active reader is never limited and never flagged for reading
        async def heavy_reader(db):
            async with db.begin():
                await db.execute(
                    update(AccountActivityDay).values(paid_chunks=10_000, solutions=10_000)
                )

        run_db(database, heavy_reader)
        assert client.get(f"/api/tasks/{paid.task.id}/solution").status_code == 200

        reader = client.get("/api/auth/session").json()["account"]["id"]

        async def no_signal(db):
            report = await restrictions.signals(db, 7)
            assert reader not in {row["user"] for row in report}
            assert all(not {"paid_chunks", "solutions"} & set(row["signals"]) for row in report)

        run_db(database, no_signal)
        open_task = client.get(f"/api/tasks/{free.task.id}").json()
        assert open_task["solution_on_request"] is False
        assert len(open_task["content"]["explanation"]) == len(free.task.explanation)


def test_restrictions_are_manual_graded_and_appealable(paid_site, database, monkeypatch):  # noqa: F811
    monkeypatch.setattr(settings, "billing_enabled", True)
    monkeypatch.setattr(settings, "paywall_enabled", True)
    sent: list[tuple[str, str]] = []

    async def operator_mail(recipient: str, subject: str, body: str) -> None:
        sent.append((subject, body))

    monkeypatch.setattr(admin, "send_account_mail", operator_mail)
    monkeypatch.setattr(settings, "account_database_url", database("app"))
    email = "shared@example.com"
    with TestClient(create_app()) as client:
        headers = member(client, paid_site, email)
        started = checkout(client, headers)
        pay(client, *invoice_of(started["redirect_url"]))
        assert client.get("/api/access").json()["granted"] is True
        before = client.get("/api/access").json()["until"]

        def operator(command: str, **values) -> dict:
            namespace = argparse.Namespace(
                command=command,
                command_kind={
                    "warn": "warning",
                    "suspend": "suspension",
                    "terminate": "termination",
                    "lift": None,
                }[command],
                user=None,
                email=email,
                reason=values.get("reason", ""),
                days=values.get("days"),
                note=values.get("note"),
                compensate=values.get("compensate", False),
            )
            outcome = asyncio.run(admin.main_async(namespace))
            assert isinstance(outcome, dict)
            return outcome

        warned = operator("warn", reason="входы из трёх городов одновременно")
        owner = warned["user"]
        assert warned["kind"] == "warning" and warned["mailed"] is True
        # a warning ends every session but keeps access
        assert client.get("/api/auth/account").status_code == 401
        headers = sign_in(client, email, "203.0.113.9")
        access = client.get("/api/access").json()
        assert access["granted"] is True
        assert access["restriction"]["kind"] == "warning"

        suspended = operator("suspend", reason="доступ передан другим людям", days=7)
        assert suspended["kind"] == "suspension"
        access = client.get("/api/access").json()
        assert access["granted"] is False
        assert access["restriction"]["kind"] == "suspension"
        assert access["restriction"]["contact"] == settings.contact_email
        assert client.get("/api/access/asset").status_code == 403
        assert "kodumka@mail.ru" in sent[-1][1] and "приостановлен" in sent[-1][0]

        assert operator("lift", compensate=True)["compensated"] is True
        assert client.get("/api/access").json()["granted"] is True
        # an upheld appeal gives back the suspended time
        assert client.get("/api/access").json()["until"] > before
        assert client.get("/api/access/asset").status_code == 204

        terminated = operator("terminate", reason="повторная передача доступа")
        assert terminated["kind"] == "termination"
        access = client.get("/api/access").json()
        assert access["granted"] is False and access["restriction"]["kind"] == "termination"

    async def evidence(db):
        refunds = (await db.scalars(select(Refund).where(Refund.reason == "restriction"))).all()
        assert len(refunds) == 1 and refunds[0].status == "requested"
        grants = (
            await db.scalars(select(AccessGrant).where(AccessGrant.user_id == UUID(owner)))
        ).all()
        assert grants and all(grant.revoked_at is not None for grant in grants)
        rows = await restrictions.signals(db, 7)
        assert isinstance(rows, list)
        assert headers

    run_db(database, evidence)
