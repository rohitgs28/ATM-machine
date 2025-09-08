from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from sqlalchemy.orm import Session
from ..deps import get_session_db, require_session
from ..db import models as orm
from ..domain.models import PinLoginRequest, PinLoginResponse
from ..services.auth import AuthService


router = APIRouter(prefix="/auth", tags=["auth"])

# Auth endpoints: PIN login and logout.

@router.post("/pin", response_model=PinLoginResponse)
def login_pin(
    payload: PinLoginRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_session_db),
) -> PinLoginResponse:
    """
    Authenticate using a PIN and set an httponly session cookie.

    Parameters:
        payload (PinLoginRequest): Payload containing cardToken and pin.
        response (Response): FastAPI response object used to set the session cookie.
        request (Request): Incoming request.
        db (Session): Database session dependency.

    Returns:
        PinLoginResponse: Response model with customerName and cardNetwork.

    Raises:
        HTTPException: 401 Unauthorized when authentication fails.
    """
    service = AuthService()
    try:
        result, raw_token, session_obj = service.login_pin(db, payload, request.client.host if request.client else None)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))
    now = datetime.now(timezone.utc)
    response.set_cookie(
        key="atm_sess",
        value=raw_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=int((session_obj.expires_at - now).total_seconds()),
        path="/",
    )
    return result


@router.post("/logout")
def logout(
    response: Response,
    sess: orm.Session = Depends(require_session),
    db: Session = Depends(get_session_db),
) -> dict[str, bool]:
    """
    Revoke the current session and remove the session cookie.

    Parameters:
        response (Response): FastAPI response object used to delete the session cookie.
        sess (orm.Session): Authenticated session injected via require_session.
        db (Session): Database session dependency.

    Returns:
        dict[str, bool]: Simple status object.
    """
    service = AuthService()
    service.logout(db, sess)
    response.delete_cookie(key="atm_sess", path="/")
    return {"ok": True}
