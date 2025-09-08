from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional, Any

from sqlalchemy import (
    BigInteger,
    String,
    DateTime,
    Boolean,
    Integer,
    ForeignKey,
    CheckConstraint,
    Index,
    func,
)

try:
   
    from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship 
    _USING_SQLA2: bool = True
except Exception:
    _USING_SQLA2 = False
    try:
        from sqlalchemy.ext.declarative import declarative_base 
    except Exception:
        from sqlalchemy.orm import declarative_base  

   
    from sqlalchemy import Column 
    from sqlalchemy.orm import relationship  

    Mapped = Any  

    def mapped_column(*args, **kwargs):
        # Simple wrapper so code using mapped_column(...) runs on SQLAlchemy 1.4.
        return Column(*args, **kwargs)

# Provide a consistent Base name regardless of SQLAlchemy version
if _USING_SQLA2:
    class Base(DeclarativeBase):  
        # SQLAlchemy 2.0 Declarative base.
        pass
else:
    Base = declarative_base()

from sqlalchemy.dialects.postgresql import JSONB, INET
from sqlalchemy import Numeric


class Customer(Base):
    __tablename__ = "tbl_customers"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    cards: Mapped[list["Card"]] = relationship(
        "Card", back_populates="customer", cascade="all, delete-orphan"
    )
    accounts: Mapped[list["Account"]] = relationship(
        "Account", back_populates="customer", cascade="all, delete-orphan"
    )


class Card(Base):
    __tablename__ = "tbl_cards"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("tbl_customers.id", ondelete="CASCADE"), index=True
    )
    token: Mapped[Optional[str]] = mapped_column(String, unique=True)
    bin: Mapped[str] = mapped_column(String(12), nullable=False)
    last4: Mapped[str] = mapped_column(String(4), nullable=False)
    network: Mapped[str] = mapped_column(String(20), nullable=False)
    pin_hash: Mapped[str] = mapped_column(String, nullable=False)
    try_count: Mapped[int] = mapped_column(
        Integer, server_default="0", nullable=False
    )
    locked_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    is_blocked: Mapped[bool] = mapped_column(
        Boolean, server_default="false", nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
        onupdate=func.now(), nullable=False
    )

    customer: Mapped["Customer"] = relationship("Customer", back_populates="cards")

    __table_args__ = (
        Index("ix_tbl_cards_bin_last4", "bin", "last4"),
    )


class Account(Base):
    __tablename__ = "tbl_accounts"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("tbl_customers.id", ondelete="CASCADE"), index=True
    )
    currency: Mapped[str] = mapped_column(
        String(3), server_default="USD", nullable=False
    )
    balance: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), server_default="0.00", nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
        onupdate=func.now(), nullable=False
    )

    customer: Mapped["Customer"] = relationship("Customer", back_populates="accounts")
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="account", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint("balance >= 0.00", name="balance_nonneg"),
    )


class Transaction(Base):
    __tablename__ = "tbl_transactions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    account_id: Mapped[int] = mapped_column(
        ForeignKey("tbl_accounts.id", ondelete="CASCADE"), index=True
    )
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    idempotency_key: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    meta: Mapped[Optional[dict]] = mapped_column(JSONB)

    account: Mapped["Account"] = relationship("Account", back_populates="transactions")

    __table_args__ = (
        CheckConstraint("amount > 0.00", name="amount_pos"),
        Index("ix_tbl_txn_account_created", "account_id", "created_at"),
    )


class Session(Base):
    __tablename__ = "tbl_sessions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    card_id: Mapped[int] = mapped_column(
        ForeignKey("tbl_cards.id", ondelete="CASCADE"), index=True
    )
    token_hash: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    last_activity_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    ip: Mapped[Optional[str]] = mapped_column(INET)
    user_agent_hash: Mapped[Optional[str]] = mapped_column(String)

    __table_args__ = (
        Index("ix_tbl_sessions_expires_at", "expires_at"),
    )


class AuditLog(Base):
    __tablename__ = "tbl_audit_log"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    card_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("tbl_cards.id", ondelete="SET NULL")
    )
    action: Mapped[str] = mapped_column(String(32), nullable=False)   
    result: Mapped[str] = mapped_column(String(8), nullable=False)
    ip: Mapped[Optional[str]] = mapped_column(INET)
    ts: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    meta: Mapped[Optional[dict]] = mapped_column(JSONB)
