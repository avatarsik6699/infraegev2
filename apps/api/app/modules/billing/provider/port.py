"""What billing needs from a payment provider (Change 192, SPEC §7.3)."""

from dataclasses import dataclass, field
from typing import Literal, Protocol

State = Literal["pending", "succeeded", "failed", "refunded"]


class ProviderError(RuntimeError):
    """The provider did not answer or refused the request; nothing was changed here."""


class InvalidNotification(ValueError):
    """A notification with a wrong signature or shape; never trusted, never stored."""


@dataclass(frozen=True)
class PaymentRequest:
    invoice_no: int
    amount_kopecks: int
    description: str
    email: str | None
    success_url: str
    fail_url: str


@dataclass(frozen=True)
class Notification:
    """A verified notification: what it claims, before the status is re-fetched."""

    event_key: str
    invoice_no: int
    amount_kopecks: int
    # what a correctly signed notification states; a Robokassa ResultURL is sent only
    # for a completed payment, so its valid signature is the provider's word
    state: State
    # stored for the operator: no signatures, emails or card details
    payload: dict[str, object] = field(default_factory=dict)


@dataclass(frozen=True)
class Status:
    state: State
    amount_kopecks: int | None = None
    provider_ref: str | None = None
    receipt_url: str | None = None


@dataclass(frozen=True)
class RefundResult:
    state: Literal["pending", "succeeded", "failed"]
    provider_ref: str | None = None
    message: str | None = None


class PaymentProvider(Protocol):
    name: str

    def payment_url(self, request: PaymentRequest) -> str:
        """Where the buyer pays; the browser goes there by plain navigation."""
        ...

    def parse_notification(self, fields: dict[str, str]) -> Notification:
        """Verify a notification's signature; raises InvalidNotification."""
        ...

    def acknowledge(self, notification: Notification) -> str:
        """The body the provider expects back, so it stops retrying."""
        ...

    async def fetch_status(self, invoice_no: int) -> Status:
        """The provider's own record of the payment; the only status trusted."""
        ...

    async def refund(
        self, invoice_no: int, amount_kopecks: int, full: bool, description: str
    ) -> RefundResult:
        """Return money; the provider annuls or corrects the НПД receipt."""
        ...

    async def refund_state(self, provider_ref: str) -> RefundResult:
        """The state of a refund the provider accepted as pending."""
        ...
