

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from ..config import get_settings


def new_token() -> str:
    # Generate a new random token.
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    # Return the SHA-256 hash of a token.
    return hashlib.sha256(token.encode()).hexdigest()


def expiry_time() -> datetime:
    # Compute the expiry timestamp for a new session.
    settings = get_settings()
    return datetime.now(timezone.utc) + timedelta(minutes=settings.session_ttl_min)