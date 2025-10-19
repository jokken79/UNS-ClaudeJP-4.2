"""
Database configuration for UNS-ClaudeJP 4.0
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL is REQUIRED - no default for security
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable must be set. "
        "Example: postgresql://user:password@host:port/database"
    )

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=20,  # Number of connections to keep open
    max_overflow=10,  # Max connections beyond pool_size
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,  # Recycle connections after 1 hour
    echo=False  # Set to True for SQL debugging
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
