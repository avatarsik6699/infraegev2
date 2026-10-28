"""Robokassa for a самозанятый seller (Change 192, SPEC §7.3).

Payments: the Merchant/Index.aspx page, signed with Password #1; the ResultURL
notification is signed with Password #2 and answered `OK{InvId}`; OpStateExt (Password #2)
is the status of record; refunds go through the Refund API, a JWT signed with Password #3.
Receipts are registered in «Мой налог» by Робочеки СМЗ from the nomenclature the shop sends
(Change 229): `Receipt` with the payment, `InvoiceItems` with a refund.

Verify against the shop in test mode before launch (docs/runbooks/billing.md, Launch checklist):
the OpStateExt signature and state codes.
"""

import hashlib
import hmac
import json
from decimal import Decimal, InvalidOperation
from urllib.parse import quote, urlencode
from xml.etree import ElementTree

import httpx
import jwt

from app.core.config import settings
from app.modules.billing.plans import rubles
from app.modules.billing.provider.port import (
    InvalidNotification,
    Notification,
    PaymentRequest,
    ProviderError,
    RefundResult,
    State,
    Status,
    payer_email,
)

PAY_URL = "https://auth.robokassa.ru/Merchant/Index.aspx"
STATE_URL = "https://auth.robokassa.ru/Merchant/WebService/Service.asmx/OpStateExt"
REFUND_URL = "https://services.robokassa.ru/RefundService/Refund/Create"
REFUND_STATE_URL = "https://services.robokassa.ru/RefundService/Refund/GetState"
TIMEOUT = httpx.Timeout(10)
# OpStateExt State/Code: 5 created, 10 cancelled, 20 on hold, 50 received and being
# credited, 60 returned to the buyer, 80 suspended, 100 completed.
STATES: dict[int, State] = {
    5: "pending",
    10: "failed",
    20: "pending",
    50: "pending",
    60: "refunded",
    80: "pending",
    100: "succeeded",
}


def kopecks(value: str) -> int:
    try:
        amount = Decimal(value) * 100
    except InvalidOperation as exc:
        raise InvalidNotification("malformed amount") from exc
    if amount != amount.to_integral_value() or amount <= 0:
        raise InvalidNotification("malformed amount")
    return int(amount)


def receipt(item_name: str, amount_kopecks: int) -> str:
    """The `Receipt` of one service position, URL-encoded once: the signature takes it in this
    form, and the link encodes it again, as Robokassa's own GET examples do. No `sno`: НПД is
    not one of its values, Робочеки take the shop's."""
    item = {
        "name": item_name[:128],
        "quantity": 1,
        "sum": float(Decimal(amount_kopecks) / 100),
        "payment_method": "full_payment",
        "payment_object": "service",
        "tax": "none",
    }
    text = json.dumps({"items": [item]}, ensure_ascii=False, separators=(",", ":"))
    return quote(text, safe="")


def digest(text: str) -> str:
    return hashlib.new(settings.robokassa_hash, text.encode()).hexdigest()


def local(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def find(root: ElementTree.Element, *path: str) -> str | None:
    node: ElementTree.Element | None = root
    for name in path:
        # `is not None`: an element's truth value means "has children" and is deprecated.
        node = (
            next((child for child in node if local(child.tag) == name), None)
            if node is not None
            else None
        )
    return node.text if node is not None else None


class Robokassa:
    name = "robokassa"

    @property
    def login(self) -> str:
        return settings.robokassa_merchant_login

    def secret(self, number: int) -> str:
        value = {
            1: settings.robokassa_password1,
            2: settings.robokassa_password2,
            3: settings.robokassa_password3,
        }[number].get_secret_value()
        if not value:
            raise ProviderError(f"Robokassa password #{number} is not configured")
        return value

    def accepts_email(self, email: str) -> bool:
        # Change 230: Robokassa refuses an address with «+» («Некорректный E-mail»)
        return "+" not in email

    def payment_url(self, request: PaymentRequest) -> str:
        out_sum = rubles(request.amount_kopecks)
        nomenclature = receipt(request.item_name, request.amount_kopecks)
        # Change 230: the shop's SuccessURL carries only OutSum and InvId, so the buyer comes back
        # to this payment's own page. Change 231: the signature takes the addresses as they are;
        # the URL-encoded form of Robokassa's own example is refused with error 29
        back = f"{request.success_url}:GET:{request.fail_url}:GET"
        params = {
            "MerchantLogin": self.login,
            "OutSum": out_sum,
            "InvId": str(request.invoice_no),
            "Description": request.description[:100],
            "Receipt": nomenclature,
            "SuccessUrl2": request.success_url,
            "SuccessUrl2Method": "GET",
            "FailUrl2": request.fail_url,
            "FailUrl2Method": "GET",
            "SignatureValue": digest(
                f"{self.login}:{out_sum}:{request.invoice_no}:{nomenclature}:{back}:{self.secret(1)}"
            ),
            "Culture": "ru",
            # without one Robokassa asks the buyer for the receipt address on its page
            **({"Email": request.email} if request.email else {}),
            **({"IsTest": "1"} if settings.robokassa_test else {}),
        }
        return f"{PAY_URL}?{urlencode(params)}"

    def parse_notification(self, fields: dict[str, str]) -> Notification:
        out_sum, invoice, signature = (
            fields.get("OutSum", ""),
            fields.get("InvId", ""),
            fields.get("SignatureValue", ""),
        )
        if not out_sum or not invoice.isdigit() or not signature:
            raise InvalidNotification("malformed notification")
        expected = digest(f"{out_sum}:{invoice}:{self.secret(2)}")
        if not hmac.compare_digest(expected.lower(), signature.lower()):
            raise InvalidNotification("bad signature")
        return Notification(
            event_key=f"result:{invoice}",
            invoice_no=int(invoice),
            amount_kopecks=kopecks(out_sum),
            state="succeeded",
            payload={
                "OutSum": out_sum,
                "InvId": invoice,
                "PaymentMethod": fields.get("PaymentMethod"),
                "IncCurrLabel": fields.get("IncCurrLabel"),
            },
            # «Email, указанный покупателем при оплате»; the signature does not cover it, so
            # it is taken only from a notification whose signature passed
            payer_email=payer_email(fields.get("EMail")),
        )

    def acknowledge(self, notification: Notification) -> str:
        return f"OK{notification.invoice_no}"

    async def fetch_status(self, invoice_no: int) -> Status:
        params = {
            "MerchantLogin": self.login,
            "InvoiceID": str(invoice_no),
            "Signature": digest(f"{self.login}:{invoice_no}:{self.secret(2)}"),
        }
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT, follow_redirects=False) as client:
                response = await client.get(STATE_URL, params=params)
                response.raise_for_status()
            root = ElementTree.fromstring(response.content[:65536])
        except (httpx.HTTPError, ElementTree.ParseError) as exc:
            raise ProviderError("Robokassa status unavailable") from exc
        result = find(root, "Result", "Code")
        if result == "3":  # the invoice is unknown: the buyer never reached the pay page
            return Status("pending")
        if result != "0":
            raise ProviderError(f"Robokassa status error {result}")
        code = find(root, "State", "Code")
        amount = find(root, "Info", "OutSum")
        return Status(
            state=STATES.get(int(code or 0), "pending"),
            amount_kopecks=kopecks(amount) if amount else None,
            provider_ref=find(root, "Info", "OpKey"),
        )

    async def refund(
        self, invoice_no: int, amount_kopecks: int, full: bool, item_name: str
    ) -> RefundResult:
        status = await self.fetch_status(invoice_no)
        if status.state != "succeeded" or not status.provider_ref:
            return RefundResult("failed", message="payment is not completed")
        refund_sum = float(Decimal(amount_kopecks) / 100)
        payload: dict[str, object] = {
            "OpKey": status.provider_ref,
            # without the receipt positions Robokassa returns the money but leaves the receipt
            "InvoiceItems": [
                {
                    "Name": item_name[:128],
                    "Quantity": 1,
                    "Cost": refund_sum,
                    "Tax": "none",
                    "PaymentMethod": "full_payment",
                    "PaymentObject": "service",
                }
            ],
        }
        if not full:
            payload["RefundSum"] = refund_sum
        token = jwt.encode(payload, self.secret(3), algorithm="HS256")
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT, follow_redirects=False) as client:
                response = await client.post(
                    # Change 233: the JWT goes as a JSON string; a bare token is a 400 BadRequest
                    REFUND_URL,
                    content=json.dumps(token),
                    headers={"Content-Type": "application/json"},
                )
                # Change 233: a refusal (401 for a key or access) still answers JSON with its reason
                body = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            raise ProviderError("Robokassa refund unavailable") from exc
        if not body.get("success"):
            return RefundResult("failed", message=str(body.get("message"))[:200])
        return RefundResult("pending", provider_ref=body.get("requestId"))

    async def refund_state(self, provider_ref: str) -> RefundResult:
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT, follow_redirects=False) as client:
                response = await client.get(REFUND_STATE_URL, params={"id": provider_ref})
                response.raise_for_status()
                body = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            raise ProviderError("Robokassa refund state unavailable") from exc
        label = body.get("label")
        state = {"finished": "succeeded", "canceled": "failed"}.get(label, "pending")
        return RefundResult(state, provider_ref=provider_ref, message=label)  # type: ignore[arg-type]
