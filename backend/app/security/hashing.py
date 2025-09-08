# PIN hashing utilities.

from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_pin(pin: str) -> str:
    # Hash a numeric PIN using bcrypt.
    return pwd_context.hash(pin)


def verify_pin(pin: str, hashed: str) -> bool:
    # Verify a numeric PIN against its hashed representation.
    return pwd_context.verify(pin, hashed)