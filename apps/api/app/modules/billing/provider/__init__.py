"""Payment providers behind one port; the service never imports a concrete provider."""

from app.core.config import settings
from app.modules.billing.provider.port import PaymentProvider


def current() -> PaymentProvider:
    if settings.billing_provider == "robokassa":
        from app.modules.billing.provider.robokassa import Robokassa

        return Robokassa()
    from app.modules.billing.provider.fake import FakeProvider

    if settings.is_production:
        raise RuntimeError("the fake payment provider never runs in production")
    return FakeProvider()
