from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_session_db, require_session
from ..db import models as orm
from ..services.account import AccountService

router = APIRouter()

@router.get("/account/balance")
def get_balance(
    current_session: orm.Session = Depends(require_session),
    db: Session = Depends(get_session_db),
):
    """
    Get the authenticated user's account balance.

    Parameters:
        current_session (orm.Session): Authenticated session (injected via require_session).
        db (Session): Database session (injected via get_session_db).

    Returns:
        dict: JSON object with formatted 'balance' (e.g. {"balance": "100.00"}).
    """
    service = AccountService()
    try:
        result = service.get_balance(db, current_session)
    except ValueError as exc:
        raise HTTPException(status_code=404 if "Account" in str(exc) else 401, detail=str(exc))
    return {"balance": f"{result.balance:.2f}"}
