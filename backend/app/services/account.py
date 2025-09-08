from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy.orm import Session

from ..db import models as orm
from sqlalchemy import select
from ..domain.models import BalanceResponse, MoneyMutationRequest, MoneyMutationResponse


class AccountService:
    """Handle balance retrieval and money mutations."""

    def _get_account(self, db: Session, session_obj: orm.Session) -> orm.Account:
        """
        Retrieve the Account for the given session.

        Args:
            db (Session): SQLAlchemy session for DB operations.
            session_obj (orm.Session): Authenticated session ORM object.

        Returns:
            orm.Account: The associated account.
        """
        card = db.query(orm.Card).filter(orm.Card.id == session_obj.card_id).first()
        if not card:
            raise ValueError("Invalid session")
        account = (
            db.query(orm.Account)
            .filter(orm.Account.customer_id == card.customer_id)
            .first()
        )
        if not account:
            raise ValueError("Account not found")
        return account

    def get_balance(self, db: Session, session_obj: orm.Session) -> BalanceResponse:
        """
        Return the current account balance for the session's card.

        Args:
            db (Session): SQLAlchemy session for DB operations.
            session_obj (orm.Session): Authenticated session ORM object.

        Returns:
            BalanceResponse: DTO containing the account balance.
        """
        account = self._get_account(db, session_obj)
        return BalanceResponse(balance=Decimal(account.balance))

    def deposit(self, db: Session, session_obj: orm.Session, payload: MoneyMutationRequest) -> MoneyMutationResponse:
        """
        Deposit an amount into the account, honoring idempotency.

        Args:
            db (Session): SQLAlchemy session for DB operations.
            session_obj (orm.Session): Authenticated session ORM object.
            payload (MoneyMutationRequest): Amount and idempotency key.

        Returns:
            MoneyMutationResponse: DTO with the updated balance.
        """
        account = self._get_account(db, session_obj)
        # check if a transaction with the same idempotency key exists for this account
        existing_tx = db.execute(
            select(orm.Transaction).where(
                orm.Transaction.account_id == account.id,
                orm.Transaction.idempotency_key == payload.idempotencyKey,
            )
        ).scalar_one_or_none()
        if existing_tx:
            acc = db.execute(
                select(orm.Account).where(orm.Account.id == existing_tx.account_id)
            ).scalar_one()
            return MoneyMutationResponse(balance=Decimal(acc.balance))
        acc = db.execute(
            select(orm.Account).where(orm.Account.id == account.id).with_for_update()
        ).scalar_one()
        acc.balance = (Decimal(acc.balance) + payload.amount).quantize(Decimal("0.01"))
        tx = orm.Transaction(
            account_id=account.id,
            type="deposit",
            amount=payload.amount,
            idempotency_key=payload.idempotencyKey,
            created_at=datetime.now(timezone.utc),
        )
        db.add(tx)
        db.flush()
        return MoneyMutationResponse(balance=Decimal(acc.balance))

    def withdraw(self, db: Session, session_obj: orm.Session, payload: MoneyMutationRequest) -> MoneyMutationResponse:
        """
        Withdraw an amount from the account, honoring idempotency and preventing overdraft.

        Args:
            db (Session): SQLAlchemy session for DB operations.
            session_obj (orm.Session): Authenticated session ORM object.
            payload (MoneyMutationRequest): Amount and idempotency key.

        Returns:
            MoneyMutationResponse: DTO with the updated balance.

        """
        account = self._get_account(db, session_obj)
        # check if a transaction with the same idempotency key exists for this account
        existing_tx = db.execute(
            select(orm.Transaction).where(
                orm.Transaction.account_id == account.id,
                orm.Transaction.idempotency_key == payload.idempotencyKey,
            )
        ).scalar_one_or_none()
        if existing_tx:
            acc = db.execute(
                select(orm.Account).where(orm.Account.id == existing_tx.account_id)
            ).scalar_one()
            return MoneyMutationResponse(balance=Decimal(acc.balance))
        acc = db.execute(
            select(orm.Account).where(orm.Account.id == account.id).with_for_update()
        ).scalar_one()
        new_balance = (Decimal(acc.balance) - payload.amount).quantize(Decimal("0.01"))
        if new_balance < Decimal("0.00"):
            raise ValueError("Insufficient funds")
        acc.balance = new_balance
        tx = orm.Transaction(
            account_id=account.id,
            type="withdrawal",
            amount=payload.amount,
            idempotency_key=payload.idempotencyKey,
            created_at=datetime.now(timezone.utc),
        )
        db.add(tx)
        db.flush()
        return MoneyMutationResponse(balance=Decimal(acc.balance))
