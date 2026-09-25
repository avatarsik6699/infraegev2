"""Transactional account mail through a configured TLS SMTP relay."""

from __future__ import annotations

import asyncio
import smtplib
import ssl
from email.message import EmailMessage

from app.core.config import settings


class MailUnavailable(RuntimeError):
    pass


def _deliver(recipient: str, subject: str, body: str) -> None:
    if not settings.smtp_host or not settings.mail_from:
        raise MailUnavailable("account mail is not configured")
    message = EmailMessage()
    message["From"] = settings.mail_from
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=5) as client:
            client.starttls(context=ssl.create_default_context())
            if settings.smtp_username:
                client.login(settings.smtp_username, settings.smtp_password.get_secret_value())
            client.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        raise MailUnavailable("account mail is unavailable") from exc


async def send_account_mail(recipient: str, subject: str, body: str) -> None:
    await asyncio.to_thread(_deliver, recipient, subject, body)
