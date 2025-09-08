from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple

from sqlalchemy.orm import Session

from ..domain.models import PinLoginRequest, PinLoginResponse
from ..db import models as orm
from ..security.hashing import verify_pin
from ..security.tokens import new_token, hash_token, expiry_time

# Authentication business operations.
class AuthService:
    """Authentication business operations: handle PIN login and logout."""

    def login_pin(
        self,
        db: Session,
        payload: PinLoginRequest,
        client_ip: Optional[str] = None,
    ) -> Tuple[PinLoginResponse, str, orm.Session]:
        """
        Authenticate a card using a PIN and create a new session.

        Args:
            db (Session): SQLAlchemy session used for DB operations.
            payload: Payload containing cardToken and pin.
            client_ip: Optional client IP for audit logging.

        Returns:
          A tuple of the response DTO, the raw session token, and the created session ORM object.
        """
        now = datetime.now(timezone.utc)
        card_query = db.query(orm.Card)
        card: orm.Card | None
        card = card_query.filter(orm.Card.token == payload.cardToken).first()
        if not card or card.is_blocked:
            raise ValueError("Invalid PIN or card")
        if card.locked_until and card.locked_until > now:
            raise ValueError("Invalid PIN or card")
        if not verify_pin(payload.pin, card.pin_hash):
            card.try_count += 1
            if card.try_count >= 5:
                card.locked_until = now + timedelta(minutes=15)
                card.try_count = 0
            db.flush()
            db.add(
                orm.AuditLog(
                    card_id=card.id,
                    action="pin_fail",
                    result="deny",
                    ip=client_ip,
                )
            )
            raise ValueError("Invalid PIN or card")
        card.try_count = 0
        card.locked_until = None
        raw_token = new_token()
        token_hash = hash_token(raw_token)
        session_obj = orm.Session(
            card_id=card.id,
            token_hash=token_hash,
            created_at=now,
            last_activity_at=now,
            expires_at=expiry_time(),
        )
        db.add(session_obj)
        db.add(
            orm.AuditLog(
                card_id=card.id,
                action="pin_ok",
                result="ok",
                ip=client_ip,
            )
        )
        db.flush()
        resp = PinLoginResponse(customerName=card.customer.full_name, cardNetwork=card.network)
        return resp, raw_token, session_obj

    def logout(
        self,
        db: Session,
        session_obj: orm.Session,
        client_ip: Optional[str] = None,
    ) -> None:
        """
        Revoke a session and record an audit log entry.

        Args:
            db (Session): SQLAlchemy session used for DB operations.
            session_obj (orm.Session): The session ORM object to revoke.
            client_ip (Optional[str]): Optional client IP for audit logging.
        """
        session_obj.revoked_at = datetime.now(timezone.utc)
        db.flush()
        db.add(
            orm.AuditLog(
                card_id=session_obj.card_id,
                action="logout",
                result="ok",
                ip=client_ip,
            )
        )
