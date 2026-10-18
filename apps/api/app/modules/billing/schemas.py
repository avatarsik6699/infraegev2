"""Billing requests and projections (Change 192, SPEC §4)."""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import Field

from app.modules.billing.plans import PlanId
from app.modules.practice.schemas import StrictModel


class PlanView(StrictModel):
    id: PlanId
    title: str
    price_kopecks: int
    days: int
    # the same period bought month by month: the honest comparison for the year plan
    monthly_equivalent_kopecks: int
    months_price_kopecks: int


class OfferView(StrictModel):
    billing: bool
    paywall: bool
    offer_version: str
    plans: list[PlanView]


class CheckoutRequest(StrictModel):
    plan: PlanId
    offer_version: str = Field(min_length=10, max_length=20)
    idempotency_key: str = Field(min_length=16, max_length=80, pattern=r"^[A-Za-z0-9_-]+$")
    return_path: str | None = Field(default=None, max_length=300)


class CheckoutView(StrictModel):
    payment_id: UUID
    redirect_url: str


class PaymentView(StrictModel):
    id: UUID
    plan: PlanId
    amount_kopecks: int
    status: Literal["created", "pending", "succeeded", "failed", "refunded"]
    created_at: datetime
    paid_at: datetime | None
    access_from: datetime | None
    access_until: datetime | None
    receipt_url: str | None
    return_path: str | None


class PaymentHistory(StrictModel):
    payments: list[PaymentView]
