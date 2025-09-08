from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db.base import engine
from . import models as orm
from ..security.hashing import hash_pin

def get_or_create_customer(db: Session, full_name: str) -> orm.Customer:
    obj = db.execute(select(orm.Customer).where(orm.Customer.full_name == full_name)).scalar_one_or_none()
    if obj:
        return obj
    obj = orm.Customer(full_name=full_name)
    db.add(obj)
    db.flush() 
    return obj

def ensure_account(db: Session, customer_id: int, currency: str, balance: Decimal) -> orm.Account:
    obj = db.execute(
        select(orm.Account).where(orm.Account.customer_id == customer_id)
    ).scalar_one_or_none()
    if obj:
        return obj
    obj = orm.Account(customer_id=customer_id, currency=currency, balance=balance)
    db.add(obj)
    db.flush()
    return obj

def ensure_card(
    db: Session, *, customer_id: int, token: str, bin: str, last4: str, network: str, pin_plain: str
) -> orm.Card:
    obj = db.execute(select(orm.Card).where(orm.Card.token == token)).scalar_one_or_none()
    if obj:
        return obj
    obj = orm.Card(
        customer_id=customer_id,
        token=token,
        bin=bin,
        last4=last4,
        network=network,
        pin_hash=hash_pin(pin_plain),
    )
    db.add(obj)
    db.flush()
    return obj

def seed() -> None:
    # Make sure tables exist (or rely on Alembic)
    orm.Base.metadata.create_all(bind=engine)

    with Session(bind=engine) as db:
        # Customers
        alex  = get_or_create_customer(db, "Alex Rivera")
        sam   = get_or_create_customer(db, "Sam Lee")
        tony  = get_or_create_customer(db, "Tony Stark")
        bruce = get_or_create_customer(db, "Bruce Wayne")
        clark = get_or_create_customer(db, "Clark Kent")
        diana = get_or_create_customer(db, "Diana Prince")

        # Accounts
        ensure_account(db, alex.id,  "USD", Decimal("1250.00"))
        ensure_account(db, sam.id,   "USD", Decimal("890.00"))
        ensure_account(db, tony.id,  "USD", Decimal("2000.00"))
        ensure_account(db, bruce.id, "USD", Decimal("1500.00"))
        ensure_account(db, clark.id, "USD", Decimal("950.00"))
        ensure_account(db, diana.id, "USD", Decimal("1800.00"))

        # Cards (token is UNIQUE)
        ensure_card(db, customer_id=alex.id,  token="TOK_VISA_1111",   bin="411111", last4="1111", network="visa",       pin_plain="1234")
        ensure_card(db, customer_id=sam.id,   token="TOK_MC_2222",     bin="555555", last4="2222", network="mastercard", pin_plain="4321")
        ensure_card(db, customer_id=tony.id,  token="TOK_MAESTRO_3333",bin="353535", last4="3333", network="maestro",    pin_plain="3333")
        ensure_card(db, customer_id=bruce.id, token="TOK_STAR_4444",   bin="444444", last4="4444", network="star",       pin_plain="4444")
        ensure_card(db, customer_id=clark.id, token="TOK_PULSE_5555",  bin="555556", last4="5555", network="pulse",      pin_plain="5555")
        ensure_card(db, customer_id=diana.id, token="TOK_PLUS_6666",   bin="666666", last4="6666", network="plus",       pin_plain="6666")

        db.commit()
        print("Seed complete")

if __name__ == "__main__":
    seed()
