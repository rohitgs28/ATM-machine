# Dependency definitions for FastAPI routes.

from datetime import datetime, timezone
from typing import Generator

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from .config import get_settings
from .db.base import get_db
from .db import models as orm
from .security.tokens import hash_token


def get_session_db() -> Generator[Session, None, None]:
    # Yield a database session for dependency injection.
    yield from get_db()


def require_session(
    request: Request,
    db: Session = Depends(get_session_db),
) -> orm.Session:
    # Ensure the request has a valid session cookie.
    raw_token = request.cookies.get("atm_sess")
    if not raw_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token_hash = hash_token(raw_token)
    session_obj: orm.Session | None = (
        db.query(orm.Session)
        .filter(
            orm.Session.token_hash == token_hash,
            orm.Session.revoked_at.is_(None),
        )
        .first()
    )
    now = datetime.now(timezone.utc)
    if not session_obj or session_obj.expires_at <= now:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
    session_obj.last_activity_at = now
    return session_obj