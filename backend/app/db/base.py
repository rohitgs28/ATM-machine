
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from ..config import get_settings

settings = get_settings()
engine = create_engine(settings.database_url, future=True, pool_pre_ping=True)
SessionLocal = scoped_session(sessionmaker(bind=engine, autoflush=False, autocommit=False))

#  Yields a DB session for FastAPI dependency, commits on success, rolls back on error, and always closes.
def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()