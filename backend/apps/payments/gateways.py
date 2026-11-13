from abc import ABC, abstractmethod
from dataclasses import dataclass
import hashlib
import hmac
import json
import uuid
import requests
from django.conf import settings


@dataclass
class GatewayOrderResult:
    provider: str
    gateway_order_id: str
    amount_paise: int
    currency: str
    client_payload: dict


class BasePaymentGateway(ABC):
    """Payment gateway abstraction allowing Razorpay, Cashfree, or Sandbox swaps via config."""

    provider_name: str = "base"

    @abstractmethod
    def create_order(self, order_reference: str, amount_paise: int, currency: str, customer: dict) -> GatewayOrderResult:
        raise NotImplementedError

    @abstractmethod
    def verify_payment_signature(self, payload: dict) -> bool:
        raise NotImplementedError

    @abstractmethod
    def verify_webhook_signature(self, raw_body: bytes, signature: str | None) -> bool:
        raise NotImplementedError


class SandboxPaymentGateway(BasePaymentGateway):
    """Local/sandbox payment simulator using HMAC-SHA256 verification so checkout flows can be tested end-to-end securely."""

    provider_name = "sandbox"

    def create_order(self, order_reference: str, amount_paise: int, currency: str, customer: dict) -> GatewayOrderResult:
        gateway_order_id = f"sbx_order_{uuid.uuid4().hex[:16]}"
        return GatewayOrderResult(
            provider=self.provider_name,
            gateway_order_id=gateway_order_id,
            amount_paise=amount_paise,
            currency=currency,
            client_payload={
                "mode": "sandbox",
                "gateway_order_id": gateway_order_id,
                "order_reference": order_reference,
                "amount_paise": amount_paise,
                "currency": currency,
            },
        )

    def sign_sandbox_payment(self, gateway_order_id: str, gateway_payment_id: str) -> str:
        secret = settings.SANDBOX_WEBHOOK_SECRET.encode("utf-8")
        msg = f"{gateway_order_id}|{gateway_payment_id}".encode("utf-8")
        return hmac.new(secret, msg, hashlib.sha256).hexdigest()

    def verify_payment_signature(self, payload: dict) -> bool:
        gateway_order_id = payload.get("gateway_order_id", "")
        gateway_payment_id = payload.get("gateway_payment_id", "")
        signature = payload.get("signature", "")
        if not gateway_order_id or not gateway_payment_id or not signature:
            return False
        expected = self.sign_sandbox_payment(gateway_order_id, gateway_payment_id)
        return hmac.compare_digest(expected, signature)

    def verify_webhook_signature(self, raw_body: bytes, signature: str | None) -> bool:
        if not signature:
            return False
        expected = hmac.new(settings.SANDBOX_WEBHOOK_SECRET.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)


class RazorpayPaymentGateway(BasePaymentGateway):
    provider_name = "razorpay"

    def create_order(self, order_reference: str, amount_paise: int, currency: str, customer: dict) -> GatewayOrderResult:
        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            raise ValueError("Razorpay credentials are not configured on the server.")
        resp = requests.post(
            "https://api.razorpay.com/v1/orders",
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
            json={
                "amount": amount_paise,
                "currency": currency,
                "receipt": order_reference,
                "notes": {"customer_email": customer.get("email", "")},
            },
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        return GatewayOrderResult(
            provider=self.provider_name,
            gateway_order_id=data["id"],
            amount_paise=data["amount"],
            currency=data["currency"],
            client_payload={
                "mode": "razorpay",
                "key_id": settings.RAZORPAY_KEY_ID,
                "gateway_order_id": data["id"],
                "amount_paise": data["amount"],
                "currency": data["currency"],
            },
        )

    def verify_payment_signature(self, payload: dict) -> bool:
        order_id = payload.get("gateway_order_id", "")
        payment_id = payload.get("gateway_payment_id", "")
        signature = payload.get("signature", "")
        if not (order_id and payment_id and signature and settings.RAZORPAY_KEY_SECRET):
            return False
        msg = f"{order_id}|{payment_id}".encode("utf-8")
        expected = hmac.new(settings.RAZORPAY_KEY_SECRET.encode("utf-8"), msg, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)

    def verify_webhook_signature(self, raw_body: bytes, signature: str | None) -> bool:
        if not signature or not settings.RAZORPAY_WEBHOOK_SECRET:
            return False
        expected = hmac.new(settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)


class CashfreePaymentGateway(BasePaymentGateway):
    provider_name = "cashfree"

    def _base_url(self) -> str:
        return "https://api.cashfree.com/pg" if settings.CASHFREE_ENV.upper() == "PRODUCTION" else "https://sandbox.cashfree.com/pg"

    def create_order(self, order_reference: str, amount_paise: int, currency: str, customer: dict) -> GatewayOrderResult:
        if not settings.CASHFREE_APP_ID or not settings.CASHFREE_SECRET_KEY:
            raise ValueError("Cashfree credentials are not configured on the server.")
        amount_major = round(amount_paise / 100.0, 2)
        resp = requests.post(
            f"{self._base_url()}/orders",
            headers={
                "x-client-id": settings.CASHFREE_APP_ID,
                "x-client-secret": settings.CASHFREE_SECRET_KEY,
                "x-api-version": "2023-08-01",
                "Content-Type": "application/json",
            },
            json={
                "order_id": order_reference,
                "order_amount": amount_major,
                "order_currency": currency,
                "customer_details": {
                    "customer_id": str(customer.get("id", "guest")),
                    "customer_email": customer.get("email", ""),
                    "customer_phone": customer.get("phone") or "9999999999",
                },
            },
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        return GatewayOrderResult(
            provider=self.provider_name,
            gateway_order_id=data["order_id"],
            amount_paise=amount_paise,
            currency=currency,
            client_payload={
                "mode": "cashfree",
                "payment_session_id": data.get("payment_session_id"),
                "gateway_order_id": data["order_id"],
            },
        )

    def verify_payment_signature(self, payload: dict) -> bool:
        order_id = payload.get("gateway_order_id")
        if not (order_id and settings.CASHFREE_APP_ID and settings.CASHFREE_SECRET_KEY):
            return False
        resp = requests.get(
            f"{self._base_url()}/orders/{order_id}",
            headers={
                "x-client-id": settings.CASHFREE_APP_ID,
                "x-client-secret": settings.CASHFREE_SECRET_KEY,
                "x-api-version": "2023-08-01",
            },
            timeout=15,
        )
        if not resp.ok:
            return False
        return resp.json().get("order_status") == "PAID"

    def verify_webhook_signature(self, raw_body: bytes, signature: str | None) -> bool:
        if not signature or not settings.CASHFREE_WEBHOOK_SECRET:
            return False
        expected = hmac.new(settings.CASHFREE_WEBHOOK_SECRET.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)


def get_payment_gateway(provider: str | None = None) -> BasePaymentGateway:
    selected = (provider or settings.PAYMENT_PROVIDER or "sandbox").lower()
    if selected == "razorpay":
        return RazorpayPaymentGateway()
    if selected == "cashfree":
        return CashfreePaymentGateway()
    return SandboxPaymentGateway()
