from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict

#Pydantic schemas and validators for PIN login, balances, transactions, and money mutation requests/responses.

class PinLoginRequest(BaseModel):

    model_config = ConfigDict(extra='forbid')

    cardToken: str = Field(..., alias="cardToken")
    pin: str

    @field_validator("pin")
    @classmethod
    def _pin_is_numeric_and_len(cls, v: str) -> str:
        if not v or not v.isdigit():
            raise ValueError("PIN must be numeric")
        if len(v) != 4:
            raise ValueError("PIN must be exactly 4 digits")
        return v


class PinLoginResponse(BaseModel):
    customerName: str
    cardNetwork: str


class BalanceResponse(BaseModel):
    balance: Decimal


class TransactionItem(BaseModel):
    id: int
    type: str
    amount: Decimal
    createdAt: datetime


class TransactionsResponse(BaseModel):
    items: List[TransactionItem]


class MoneyMutationRequest(BaseModel):
    amount: Decimal
    idempotencyKey: str

    @field_validator("amount")
    @classmethod
    def _amount_positive_and_quantized(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Amount must be greater than zero")
        return v.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class MoneyMutationResponse(BaseModel):
    balance: Decimal
