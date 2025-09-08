
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..deps import get_session_db, require_session
from ..db import models as orm
from ..domain.models import (
    TransactionsResponse,
    TransactionItem,
    MoneyMutationRequest,
    MoneyMutationResponse,
)
from ..services.account import AccountService


router = APIRouter(prefix="", tags=["transactions"])


def _get_account_for_session(db: Session, sess: orm.Session) -> orm.Account:
    """
    Resolve the logged-in session to the user's Account.

    Parameters:
        db (Session): Database session dependency.
        sess (orm.Session): Authenticated session object.

    Returns:
        orm.Account: The account associated with the session's card.
    """
    # Resolve the logged-in session to the user's Account.
    card = db.get(orm.Card, sess.card_id)
    if not card:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session"
        )

    account = (
        db.query(orm.Account)
        .filter(orm.Account.customer_id == card.customer_id)
        .first()
    )
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Account not found"
        )
    return account


@router.get("/transactions", response_model=TransactionsResponse)
def list_transactions(
    limit: int = 10,
    sess: orm.Session = Depends(require_session),
    db: Session = Depends(get_session_db),
) -> TransactionsResponse:
    """
    Return a limited list of recent transactions for the current user.

    Parameters:
        limit (int): Maximum number of transactions to return (default 10).
        sess (orm.Session): Authenticated session injected via require_session.
        db (Session): Database session injected via get_session_db.

    Returns:
        TransactionsResponse: DTO containing a list of TransactionItem objects.
    """
    account = _get_account_for_session(db, sess)

    transactions = (
        db.query(orm.Transaction)
        .filter(orm.Transaction.account_id == account.id)
        .order_by(orm.Transaction.created_at.desc())
        .limit(limit)
        .all()
    )
    items = [
        TransactionItem(
            id=tx.id,
            type=tx.type,
            amount=Decimal(tx.amount),
            createdAt=tx.created_at,
        )
        for tx in transactions
    ]
    return TransactionsResponse(items=items)


@router.post("/account/deposit", response_model=MoneyMutationResponse)
def deposit_route(
    payload: MoneyMutationRequest,
    sess: orm.Session = Depends(require_session),
    db: Session = Depends(get_session_db),
) -> MoneyMutationResponse:
    """
    Deposit an amount into the authenticated user's account.

    Parameters:
        payload (MoneyMutationRequest): Amount and idempotency key for the deposit.
        sess (orm.Session): Authenticated session injected via require_session.
        db (Session): Database session injected via get_session_db.

    Returns:
        MoneyMutationResponse: DTO with the updated balance.

    """
    service = AccountService()
    try:
        result = service.deposit(db, sess, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return result


@router.post("/account/withdraw", response_model=MoneyMutationResponse)
def withdraw_route(
    payload: MoneyMutationRequest,
    sess: orm.Session = Depends(require_session),
    db: Session = Depends(get_session_db),
) -> MoneyMutationResponse:
    """
    Withdraw an amount from the authenticated user's account.

    Parameters:
        payload (MoneyMutationRequest): Amount and idempotency key for the withdrawal.
        sess (orm.Session): Authenticated session injected via require_session.
        db (Session): Database session injected via get_session_db.

    Returns:
        MoneyMutationResponse: DTO with the updated balance.
    """
    service = AccountService()
    try:
        result = service.withdraw(db, sess, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return result
