# Domain-specific exceptions.


class InsufficientFundsError(Exception):
    # Raised when a withdrawal would overdraw an account.
    pass


class IdempotencyConflictError(Exception):
    # Raised when a conflicting idempotency key is detected.
    pass