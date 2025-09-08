from app.security.tokens import new_token, hash_token, expiry_time
from app.security.hashing import hash_pin, verify_pin


def test_new_token_unique_and_hash():
    t1 = new_token()
    t2 = new_token()
    assert t1 != t2
    assert isinstance(t1, str) and isinstance(t2, str)
    h1 = hash_token(t1)
    assert h1 != t1
    assert len(h1) == 64
    assert hash_token(t1) == h1


def test_hash_and_verify_pin():
    pin = "1234"
    hashed = hash_pin(pin)
    assert hashed != pin
    assert verify_pin(pin, hashed) is True
    assert verify_pin("0000", hashed) is False