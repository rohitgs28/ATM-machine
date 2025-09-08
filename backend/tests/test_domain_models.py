

from decimal import Decimal
import pytest
from pydantic import ValidationError
from app.domain.models import PinLoginRequest, MoneyMutationRequest


def test_pin_login_request_requires_card_token_and_valid_pin():
    """
    PinLoginRequest must include a cardToken and a valid PIN.  ensures the PIN
    consists of valid numeric digits.
    """
    import pydantic

     # Missing token still fails
    with pytest.raises(ValidationError):
        PinLoginRequest(pin="1234")

    # Non-numeric PIN fails
    with pytest.raises(ValueError):
        PinLoginRequest(cardToken="tok", pin="abcd")

    # Not exactly 4 digits fails
    with pytest.raises(ValueError):
        PinLoginRequest(cardToken="tok", pin="123")     # 3 digits
    with pytest.raises(ValueError):
        PinLoginRequest(cardToken="tok", pin="12345")   # 5 digits
    with pytest.raises(ValueError):
        PinLoginRequest(cardToken="tok", pin="123456")  # 6 digits

    # Exactly 4 digits succeeds
    ok = PinLoginRequest(cardToken="tok", pin="1234")
    assert ok.pin == "1234"


def test_money_mutation_request_amount_validation():
    """MoneyMutationRequest should enforce positive amounts and quantize to cents."""
    with pytest.raises(ValueError):
        MoneyMutationRequest(amount=Decimal("0"), idempotencyKey="k1")
    with pytest.raises(ValueError):
        MoneyMutationRequest(amount=Decimal("-1"), idempotencyKey="k2")

    # Amount with more than two decimal places should be rounded/truncated to 2 decimal places
    req = MoneyMutationRequest(amount=Decimal("12.345"), idempotencyKey="k3")
    # Pydantic will quantize the amount to two decimals using the validator
    assert req.amount == Decimal("12.35")

    # Valid amount remains unchanged if already two decimals
    req2 = MoneyMutationRequest(amount=Decimal("5.00"), idempotencyKey="k4")
    assert req2.amount == Decimal("5.00")