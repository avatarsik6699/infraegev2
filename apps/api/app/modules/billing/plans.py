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


def receipt_item(days: int) -> str:
    """The service as the НПД receipt names it (Change 229): the buyer and the ФНС see it."""
    tens, ones = days % 100, days % 10
    word = (
        "день"
        if ones == 1 and tens != 11
        else "дня"
        if 2 <= ones <= 4 and not 12 <= tens <= 14
        else "дней"
    )
    return f"Доступ к учебным материалам Кодумки на {days} {word}"


def rubles(kopecks: int) -> str:
    """An amount as the provider takes it: rubles with two decimals."""
    return f"{kopecks // 100}.{kopecks % 100:02d}"
