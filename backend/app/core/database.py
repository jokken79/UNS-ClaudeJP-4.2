"""Database configuration for UNS-ClaudeJP 4.0."""

import logging
import os
from typing import Any, Dict

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.engine.url import make_url
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

logger = logging.getLogger(__name__)

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.warning("DATABASE_URL is not set. Falling back to an in-memory SQLite database.")
    DATABASE_URL = "sqlite:///:memory:"


def _build_engine_kwargs(database_url: str) -> Dict[str, Any]:
    """Build engine configuration depending on the target backend."""

    try:
        url: URL = make_url(database_url)
    except Exception as exc:  # pragma: no cover - invalid configuration
        raise ValueError(f"Invalid DATABASE_URL '{database_url}': {exc}") from exc
    kwargs: Dict[str, Any] = {"echo": False}

    if url.get_backend_name() == "sqlite":
        kwargs["connect_args"] = {"check_same_thread": False}
        if not url.database or url.database == ":memory:":
            kwargs["poolclass"] = StaticPool
    else:
        kwargs.update(
            pool_size=20,
            max_overflow=10,
            pool_pre_ping=True,
            pool_recycle=3600,
        )

    return kwargs


engine = create_engine(
    DATABASE_URL,
    **_build_engine_kwargs(DATABASE_URL),
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database tables
    """
    import app.models.models  # noqa
    Base.metadata.create_all(bind=engine)
