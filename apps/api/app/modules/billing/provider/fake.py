"""A provider for tests and local runs: its pay page is served by this API.

Never used in production (`provider.current()` refuses it). Notifications carry an HMAC
of the auth secret, so the webhook path is exercised the same way as for a real provider.
"""

import hashlib
import hmac
from urllib.parse import urlencode

from app.core.config import settings
from app.modules.billing.provider.port import (
    InvalidNotification,
    Notification,
    PaymentRequest,
    RefundResult,
    State,
    Status,
)

# The fake provider's own ledger: invoice → (state, amount); per process, like a sandbox.
LEDGER: dict[int, tuple[State, int]] = {}


def signature(invoice_no: int, amount_kopecks: int) -> str:
    key = (settings.auth_csrf_secret.get_secret_value() or "fake-provider").encode()
    message = f"fake:{invoice_no}:{amount_kopecks}".encode()
    return hmac.new(key, message, hashlib.sha256).hexdigest()


class FakeProvider:
    name = "fake"

    def payment_url(self, request: PaymentRequest) -> str:
        LEDGER.setdefault(request.invoice_no, ("pending", request.amount_kopecks))
        query = urlencode(
            {
                "amount": request.amount_kopecks,
                "success": request.success_url,
                "fail": request.fail_url,
            }
        )
        return f"{settings.public_origin}/api/billing/fake/pay/{request.invoice_no}?{query}"

    def settle(self, invoice_no: int, amount_kopecks: int, state: State) -> dict[str, str]:
        """The pay page's outcome, as the notification fields the webhook receives."""
        LEDGER[invoice_no] = (state, amount_kopecks)
        return {
            "invoice": str(invoice_no),
            "amount": str(amount_kopecks),
            "state": state,
            "signature": signature(invoice_no, amount_kopecks),
        }

    def parse_notification(self, fields: dict[str, str]) -> Notification:
        try:
            invoice_no, amount = int(fields["invoice"]), int(fields["amount"])
        except (KeyError, ValueError) as exc:
            raise InvalidNotification("malformed notification") from exc
        if not hmac.compare_digest(fields.get("signature", ""), signature(invoice_no, amount)):
            raise InvalidNotification("bad signature")
        state = fields.get("state")
        if state not in ("succeeded", "failed"):
            raise InvalidNotification("unknown state")
        return Notification(
            event_key=f"{invoice_no}:{fields.get('state', '')}",
            invoice_no=invoice_no,
            amount_kopecks=amount,
            state=state,
            payload={"invoice": invoice_no, "amount": amount, "state": fields.get("state")},
        )

    def acknowledge(self, notification: Notification) -> str:
        return f"OK{notification.invoice_no}"

    async def fetch_status(self, invoice_no: int) -> Status:
        state, amount = LEDGER.get(invoice_no, ("pending", 0))
        return Status(
            state=state,
            amount_kopecks=amount or None,
            provider_ref=f"fake-op-{invoice_no}",
            receipt_url=f"{settings.public_origin}/fake-receipt/{invoice_no}"
            if state == "succeeded"
            else None,
        )

    async def refund(
        self, invoice_no: int, amount_kopecks: int, full: bool, description: str
    ) -> RefundResult:
        state, amount = LEDGER.get(invoice_no, ("pending", 0))
        if state != "succeeded" or amount_kopecks > amount:
            return RefundResult("failed", message="nothing to refund")
        if full:
            LEDGER[invoice_no] = ("refunded", amount)
        return RefundResult("succeeded", provider_ref=f"fake-refund-{invoice_no}")

    async def refund_state(self, provider_ref: str) -> RefundResult:
        return RefundResult("succeeded", provider_ref=provider_ref)
