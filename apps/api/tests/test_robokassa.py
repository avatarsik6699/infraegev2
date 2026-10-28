"""Change 192: the Robokassa adapter against the documented protocol (no network).

Responses are synthetic fixtures in the documented shapes; replace them with recorded test-mode
answers when the shop is connected (docs/runbooks/billing.md, Launch checklist).
"""

import asyncio
import hashlib
import json
from collections.abc import Callable
from urllib.parse import parse_qs, quote, unquote, urlsplit

import httpx
import jwt
import pytest
from pydantic import SecretStr

from app.core.config import settings
from app.modules.billing.plans import receipt_item
from app.modules.billing.provider import robokassa
from app.modules.billing.provider.port import (
    InvalidNotification,
    PaymentRequest,
    ProviderError,
)

pytestmark = pytest.mark.pure

STATE_XML = """<?xml version="1.0" encoding="utf-8"?>
<OperationStateResponse xmlns="http://auth.robokassa.ru/Merchant/WebService/">
  <Result><Code>0</Code></Result>
  <State><Code>{code}</Code><RequestDate>2027-09-01T10:00:00</RequestDate></State>
  <Info><IncCurrLabel>BankCardPSR</IncCurrLabel><IncSum>490.00</IncSum>
    <OutSum>490.00</OutSum><OpKey>op-key-1</OpKey></Info>
</OperationStateResponse>"""


@pytest.fixture(autouse=True)
def shop(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "robokassa_merchant_login", "infraege")
    monkeypatch.setattr(settings, "robokassa_password1", SecretStr("one"))
    monkeypatch.setattr(settings, "robokassa_password2", SecretStr("two"))
    monkeypatch.setattr(settings, "robokassa_password3", SecretStr("three"))
    monkeypatch.setattr(settings, "robokassa_hash", "sha256")
    monkeypatch.setattr(settings, "robokassa_test", True)


REAL_CLIENT = httpx.AsyncClient


def transport(
    monkeypatch: pytest.MonkeyPatch, handler: Callable[[httpx.Request], httpx.Response]
) -> None:
    def client(**_: object) -> httpx.AsyncClient:
        return REAL_CLIENT(transport=httpx.MockTransport(handler))

    monkeypatch.setattr(robokassa.httpx, "AsyncClient", client)


def sha(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()


ITEM = "Доступ к учебным материалам Кодумки на 30 дней"


def test_receipt_item_names_the_days():
    assert receipt_item(30) == ITEM
    assert receipt_item(365).endswith("на 365 дней")
    assert receipt_item(31).endswith("на 31 день") and receipt_item(11).endswith("на 11 дней")
    assert receipt_item(2).endswith("на 2 дня") and receipt_item(14).endswith("на 14 дней")


def test_payment_link_is_signed_with_password_one():
    url = robokassa.Robokassa().payment_url(
        PaymentRequest(
            invoice_no=1001,
            amount_kopecks=49_000,
            description="Доступ на месяц — Кодумка",
            item_name=ITEM,
            email="buyer@example.com",
            success_url="https://kodumka.ru/subscribe/return",
            fail_url="https://kodumka.ru/subscribe/return",
        )
    )
    parts = urlsplit(url)
    query = {key: value[0] for key, value in parse_qs(parts.query).items()}
    assert f"{parts.scheme}://{parts.netloc}{parts.path}" == robokassa.PAY_URL
    assert query["OutSum"] == "490.00" and query["InvId"] == "1001"
    # Change 229: the link carries the URL-encoded receipt (so the query encodes it twice) and
    # the signature takes it in that once-encoded form
    nomenclature = query["Receipt"]
    assert json.loads(unquote(nomenclature)) == {
        "items": [
            {
                "name": ITEM,
                "quantity": 1,
                "sum": 490.0,
                "payment_method": "full_payment",
                "payment_object": "service",
                "tax": "none",
            }
        ]
    }
    assert nomenclature == quote(unquote(nomenclature), safe="")
    assert "%257B" in parts.query
    assert query["SignatureValue"] == sha(f"infraege:490.00:1001:{nomenclature}:one")
    assert query["IsTest"] == "1" and query["Email"] == "buyer@example.com"


def test_result_url_needs_password_two_and_answers_ok():
    gateway = robokassa.Robokassa()
    fields = {"OutSum": "490.000000", "InvId": "1001", "SignatureValue": sha("490.000000:1001:two")}
    note = gateway.parse_notification({**fields, "EMail": "buyer@example.com"})
    assert (note.invoice_no, note.amount_kopecks, note.state) == (1001, 49_000, "succeeded")
    assert "EMail" not in note.payload and "SignatureValue" not in note.payload
    # Change 228: the receipt address the buyer typed at Robokassa, kept apart from the payload
    assert note.payer_email == "buyer@example.com"
    assert gateway.parse_notification({**fields, "EMail": "not an address"}).payer_email is None
    assert gateway.parse_notification(fields).payer_email is None
    assert gateway.acknowledge(note) == "OK1001"
    with pytest.raises(InvalidNotification):
        gateway.parse_notification({**fields, "SignatureValue": sha("490.000000:1001:one")})
    with pytest.raises(InvalidNotification):
        gateway.parse_notification({**fields, "OutSum": "490.001"})


@pytest.mark.parametrize(
    ("code", "state"), [(5, "pending"), (10, "failed"), (50, "pending"), (100, "succeeded")]
)
def test_operation_state_is_read_from_op_state_ext(monkeypatch, code, state):
    seen: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, text=STATE_XML.format(code=code))

    transport(monkeypatch, handler)
    status = asyncio.run(robokassa.Robokassa().fetch_status(1001))
    assert status.state == state and status.provider_ref == "op-key-1"
    assert status.amount_kopecks == 49_000
    params = dict(seen[0].url.params)
    assert params["Signature"] == sha("infraege:1001:two")


def test_unknown_invoice_is_pending_and_errors_raise(monkeypatch):
    unknown = "<OperationStateResponse><Result><Code>3</Code></Result></OperationStateResponse>"
    transport(monkeypatch, lambda request: httpx.Response(200, text=unknown))
    assert asyncio.run(robokassa.Robokassa().fetch_status(7)).state == "pending"
    transport(monkeypatch, lambda request: httpx.Response(502))
    with pytest.raises(ProviderError):
        asyncio.run(robokassa.Robokassa().fetch_status(7))


def test_refund_is_a_jwt_signed_with_password_three(monkeypatch):
    bodies: list[bytes] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path.endswith("OpStateExt"):
            return httpx.Response(200, text=STATE_XML.format(code=100))
        bodies.append(request.content)
        return httpx.Response(200, json={"success": True, "message": None, "requestId": "r-1"})

    transport(monkeypatch, handler)
    partial = asyncio.run(robokassa.Robokassa().refund(1001, 16_333, False, ITEM))
    assert partial.state == "pending" and partial.provider_ref == "r-1"

    def item(cost: float) -> dict:
        return {
            "Name": ITEM,
            "Quantity": 1,
            "Cost": cost,
            "Tax": "none",
            "PaymentMethod": "full_payment",
            "PaymentObject": "service",
        }

    # Change 229: the receipt positions go with every refund, or the receipt stays as it was
    claims = jwt.decode(bodies[-1], "three", algorithms=["HS256"])
    assert claims == {"OpKey": "op-key-1", "RefundSum": 163.33, "InvoiceItems": [item(163.33)]}
    full = asyncio.run(robokassa.Robokassa().refund(1001, 49_000, True, ITEM))
    assert full.state == "pending"
    claims = jwt.decode(bodies[-1], "three", algorithms=["HS256"])
    assert claims == {"OpKey": "op-key-1", "InvoiceItems": [item(490.0)]}


def test_refund_state_maps_labels(monkeypatch):
    transport(
        monkeypatch,
        lambda request: httpx.Response(200, json={"requestId": "r-1", "label": "finished"}),
    )
    assert asyncio.run(robokassa.Robokassa().refund_state("r-1")).state == "succeeded"
    transport(
        monkeypatch,
        lambda request: httpx.Response(200, json={"requestId": "r-1", "label": "canceled"}),
    )
    assert asyncio.run(robokassa.Robokassa().refund_state("r-1")).state == "failed"
