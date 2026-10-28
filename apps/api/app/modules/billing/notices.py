"""Transactional billing mail (Change 192): neutral service notices, never advertising."""

from datetime import datetime
from zoneinfo import ZoneInfo

import structlog

from app.core.config import settings
from app.modules.account.mail import MailUnavailable, send_account_mail
from app.modules.billing.plans import rubles

logger = structlog.get_logger(__name__)

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
    return "Доступ к Кодумке открыт", "\n".join(lines) + "\n"


def ending(until: datetime) -> tuple[str, str]:
    return (
        "Доступ к Кодумке заканчивается",
        f"Доступ к платным материалам действует до {date(until)}. Продлить его можно в профиле: "
        f"{settings.public_origin}/account/access\n",
    )


def refunded(amount_kopecks: int) -> tuple[str, str]:
    return (
        "Возврат оплаты Кодумки",
        f"Мы вернули {rubles(amount_kopecks)} ₽. Деньги придут на карту в срок, который "
        "устанавливает ваш банк. Доступ к платным материалам по этой оплате закрыт.\n",
    )


# Change 232: what the operator must do after a refund ends; read by the operator, not the buyer


async def to_operator(subject: str, body: str) -> None:
    if not settings.billing_operator_email:
        return
    try:
        await send_account_mail(
            settings.billing_operator_email, f"[kodumka billing] {subject}", body
        )
    except MailUnavailable:
        logger.error("billing.operator_mail_unavailable", subject=subject)


def refund_failed(
    refund_id: str, invoice_no: int, amount_kopecks: int, reason: str | None
) -> tuple[str, str]:
    lines = [
        f"Возврат {refund_id} по счёту {invoice_no} на {rubles(amount_kopecks)} ₽ не прошёл.",
        f"Ответ Robokassa: {reason or 'нет ответа'}.",
    ]
    if reason and "8401" in reason:
        lines.append(
            "8401: на балансе магазина меньше суммы возврата с комиссией. Пополните баланс или "
            "дождитесь оплат и повторите возврат."
        )
    lines += [
        f"Повтор: admin execute --refund {refund_id} или «Выполнить» в консоли.",
        "Срок возврата по требованию покупателя — 10 дней (ст. 31 Закона о защите прав "
        "потребителей).",
    ]
    return "Возврат не прошёл", "\n".join(lines) + "\n"


def remainder_receipt(
    item: str,
    remainder_kopecks: int,
    paid_at: datetime | None,
    invoice_no: int,
    receipt_email: str | None,
) -> tuple[str, str]:
    lines = [
        f"Частичный возврат по счёту {invoice_no} прошёл. Робочеки аннулировали чек этой оплаты "
        "целиком, а чек на оставшийся доход нужно выдать самому в «Мой налог».",
        f"Наименование: {item}",
        f"Сумма: {rubles(remainder_kopecks)} ₽",
        f"Дата оплаты: {date(paid_at) if paid_at else 'нет'}",
        f"Покупатель — физическое лицо, чек отправить на: {receipt_email or 'адрес не сохранён'}",
    ]
    return "Выдайте чек на остаток в «Мой налог»", "\n".join(lines) + "\n"
