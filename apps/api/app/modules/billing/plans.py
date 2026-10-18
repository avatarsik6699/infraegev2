"""The two one-time passes (SPEC §2.2); prices and periods come from settings."""

from dataclasses import dataclass
from typing import Literal

from app.core.config import settings

PlanId = Literal["month", "year"]


@dataclass(frozen=True)
class Plan:
    id: PlanId
    title: str
    price_kopecks: int
    days: int


def plans() -> dict[PlanId, Plan]:
    return {
        "month": Plan(
            "month",
            "Доступ на месяц",
            settings.billing_month_price_kopecks,
            settings.billing_month_days,
        ),
        "year": Plan(
            "year", "Доступ на год", settings.billing_year_price_kopecks, settings.billing_year_days
        ),
    }


def rubles(kopecks: int) -> str:
    """An amount as the provider takes it: rubles with two decimals."""
    return f"{kopecks // 100}.{kopecks % 100:02d}"
