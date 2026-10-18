"""Transactional billing mail (Change 192): neutral service notices, never advertising."""

from datetime import datetime
from zoneinfo import ZoneInfo

from app.core.config import settings
from app.modules.billing.plans import rubles

MOSCOW = ZoneInfo("Europe/Moscow")


def date(value: datetime) -> str:
    return value.astimezone(MOSCOW).strftime("%d.%m.%Y")


def paid(amount_kopecks: int, until: datetime, receipt_url: str | None) -> tuple[str, str]:
    lines = [
        f"Оплата {rubles(amount_kopecks)} ₽ прошла. Доступ к материалам открыт до {date(until)}.",
        f"Ваши оплаты и доступ: {settings.public_origin}/account/access",
    ]
    if receipt_url:
        lines.insert(1, f"Чек: {receipt_url}")
    return "Доступ к infraege открыт", "\n".join(lines) + "\n"


def ending(until: datetime) -> tuple[str, str]:
    return (
        "Доступ к infraege заканчивается",
        f"Доступ к платным материалам действует до {date(until)}. Продлить его можно в профиле: "
        f"{settings.public_origin}/account/access\n",
    )


def refunded(amount_kopecks: int) -> tuple[str, str]:
    return (
        "Возврат оплаты infraege",
        f"Мы вернули {rubles(amount_kopecks)} ₽. Деньги придут на карту в срок, который "
        "устанавливает ваш банк. Доступ к платным материалам по этой оплате закрыт.\n",
    )
