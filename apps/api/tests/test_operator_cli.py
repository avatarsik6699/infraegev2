"""Change 199: the operator console's JSON commands and the kodumka.operator/1 report."""

import asyncio
import io
import json
import sys
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.main import create_app
from app.modules.account.models import AccountActivityDay
from app.modules.billing import admin
from tests.test_billing import checkout, invoice_of, member, paid_site, pay  # noqa: F401
from tests.test_minimal_bank import database  # noqa: F401

ORIGIN = {"Origin": "http://testserver"}


def console(monkeypatch, capsys, argv: list[str], payload: object | None = None):
    """Run the CLI like operator-command.sh does; returns (exit code, the one JSON object)."""
    monkeypatch.setattr(sys, "argv", ["admin", *argv])
    monkeypatch.setattr(sys, "stdin", io.StringIO(json.dumps(payload) if payload else ""))
    capsys.readouterr()  # request logs of the test client, not the CLI's answer
    code = 0
    try:
        admin.main()
    except SystemExit as exc:
        code = int(exc.code or 0)
    out = capsys.readouterr().out.strip()
    # `operator` answers one line; other commands print indented JSON
    return code, json.loads(out if out.startswith("{") else out.splitlines()[-1])


def test_console_commands_cards_and_report(paid_site, database, monkeypatch, capsys):  # noqa: F811
    monkeypatch.setattr(settings, "billing_enabled", True)
    monkeypatch.setattr(settings, "paywall_enabled", True)
    monkeypatch.setattr(settings, "account_database_url", database("app"))
    sent: list[str] = []

    async def operator_mail(recipient: str, subject: str, body: str) -> None:
        sent.append(subject)

    monkeypatch.setattr(admin, "send_account_mail", operator_mail)
    email = "console@example.com"
    with TestClient(create_app()) as client:
        member(client, paid_site, email)
        login = client.post(
            "/api/auth/login",
            json={"email": email, "password": "correct horse battery"},
            headers={**ORIGIN, "X-Real-IP": "198.51.100.7"},
        )
        headers = {**ORIGIN, "X-CSRF-Token": login.json()["csrf_token"]}
        pay(client, *invoice_of(checkout(client, headers)["redirect_url"]))
        user_id = client.get("/api/auth/session").json()["account"]["id"]

    # refusals: unknown kind never parses, bad args name their fields, nothing is applied
    code, out = console(monkeypatch, capsys, ["operator", "warn"], {"email": email, "reason": ""})
    assert code == 2 and out["error"] == "invalid arguments" and "reason" in out["fields"]
    code, out = console(
        monkeypatch, capsys, ["operator", "suspend"], {"email": email, "reason": "x", "days": 31}
    )
    assert code == 2 and "days" in out["fields"]
    code, out = console(
        monkeypatch, capsys, ["operator", "warn"], {"email": email, "reason": "x", "shell": "rm"}
    )
    assert code == 2 and "shell" in out["fields"]
    code, out = console(
        monkeypatch, capsys, ["operator", "warn"], {"user": user_id, "email": email, "reason": "x"}
    )
    assert code == 2
    code, out = console(
        monkeypatch, capsys, ["operator", "refund_execute"], {"refund": str(uuid4())}
    )
    assert code == 2 and out["error"] == "refund not found"
    code, out = console(
        monkeypatch, capsys, ["operator", "account_show"], {"email": "nobody@example.com"}
    )
    assert code == 2 and out["error"] == "account not found"
    monkeypatch.setattr(sys, "argv", ["admin", "operator", "drop_tables"])
    with pytest.raises(SystemExit) as refused:
        admin.main()
    assert refused.value.code == 2
    capsys.readouterr()

    # the card names the account, its payment and the address it signed in from
    code, card = console(monkeypatch, capsys, ["operator", "account_show"], {"email": email})
    assert code == 0 and card["schema"] == "kodumka.account/1"
    assert card["account"]["id"] == user_id and card["account"]["email"] == email
    assert card["access"]["until"] and len(card["payments"]) == 1
    assert "198.51.100.7" in {session["ip"] for session in card["sessions"]}
    assert "password" not in json.dumps(card)

    # a measure through the console mails the student and shows in the report
    code, out = console(
        monkeypatch,
        capsys,
        ["operator", "suspend"],
        {"user": user_id, "reason": "доступ передан другим людям", "days": 3},
    )
    assert code == 0 and out["kind"] == "suspension" and out["mailed"] is True
    assert sent and "приостановлен" in sent[-1]

    async def shared(db_url: str) -> None:
        engine = database_engine(db_url, role="infraege_app")
        try:
            async with AsyncSession(engine) as db, db.begin():
                await db.execute(update(AccountActivityDay).values(new_devices=5))
        finally:
            await engine.dispose()

    asyncio.run(shared(database("app")))
    code, report = console(monkeypatch, capsys, ["export-operator"])
    assert code == 0 and report["schema"] == "kodumka.operator/1"
    signal = next(row for row in report["signals"] if row["user_id"] == user_id)
    assert signal["email"] == email and "new_devices" in signal["flags"]
    assert signal["restriction"] == "suspension"
    assert "198.51.100.7" in {session["ip"] for session in signal["sessions"]}
    assert any(row["user_id"] == user_id for row in report["restrictions"])

    code, out = console(monkeypatch, capsys, ["operator", "lift"], {"user": user_id})
    assert code == 0 and out["lifted"] is True
