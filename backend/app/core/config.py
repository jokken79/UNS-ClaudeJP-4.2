"""
Configuration settings for UNS-ClaudeJP 4.0
"""
from pydantic import field_validator, validator
from pydantic_settings import BaseSettings
from typing import Optional
import os
import secrets


class Settings(BaseSettings):
    # App Info
    APP_NAME: str = "UNS-ClaudeJP"
    APP_VERSION: str = "4.2.0"
    COMPANY_NAME: str = "UNS-Kikaku"
    COMPANY_WEBSITE: str = "https://uns-kikaku.com"
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Database - REQUIRED, no defaults
    DATABASE_URL: str

    # Security - REQUIRED, no defaults
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 horas

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v):
        if not v or v in ["your-secret-key-change-in-production", "CHANGE_THIS"]:
            raise ValueError(
                "SECRET_KEY must be set to a secure random value. "
                "Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(64))'"
            )
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v):
        if not v or "CHANGE_THIS" in v:
            raise ValueError("DATABASE_URL must be properly configured")
        return v

    # File Upload
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: list[str] = ["pdf", "jpg", "jpeg", "png", "xlsx", "xls"]
    UPLOAD_DIR: str = "/app/uploads"

    @field_validator("ALLOWED_EXTENSIONS", mode="before")
    @classmethod
    def _parse_allowed_extensions(cls, v):
        if isinstance(v, str):
            return [item.strip() for item in v.split(",")]
        return v
    
    # OCR Settings
    OCR_ENABLED: bool = True
    TESSERACT_LANG: str = "jpn+eng"
    
    # Gemini API (Primary OCR method)
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    
    # Google Cloud Vision API (Backup OCR method)
    GOOGLE_CLOUD_VISION_ENABLED: bool = os.getenv("GOOGLE_CLOUD_VISION_ENABLED", "false").lower() == "true"
    GOOGLE_CLOUD_VISION_API_KEY: Optional[str] = os.getenv("GOOGLE_CLOUD_VISION_API_KEY")
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None

    # Azure Computer Vision API
    AZURE_COMPUTER_VISION_ENDPOINT: Optional[str] = os.getenv("AZURE_COMPUTER_VISION_ENDPOINT")
    AZURE_COMPUTER_VISION_KEY: Optional[str] = os.getenv("AZURE_COMPUTER_VISION_KEY")
    AZURE_COMPUTER_VISION_API_VERSION: str = os.getenv("AZURE_COMPUTER_VISION_API_VERSION", "2023-02-01-preview")

    # Email/SMTP Settings (for notifications)
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    SMTP_FROM: str = os.getenv("SMTP_FROM", "noreply@uns-kikaku.com")
    
    # LINE Notification (Optional)
    LINE_CHANNEL_ACCESS_TOKEN: Optional[str] = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")
    
    # WhatsApp (Optional)
    WHATSAPP_ENABLED: bool = False
    WHATSAPP_TOKEN: Optional[str] = os.getenv("WHATSAPP_TOKEN")
    WHATSAPP_PHONE_ID: Optional[str] = os.getenv("WHATSAPP_PHONE_ID")
    
    # ID Configuration
    RIREKISHO_ID_PREFIX: str = "UNS-"
    RIREKISHO_ID_START: int = 1000
    FACTORY_ID_PREFIX: str = "Factory-"
    FACTORY_ID_START: int = 1
    
    # Salary Calculation
    OVERTIME_RATE_25: float = 0.25
    OVERTIME_RATE_35: float = 0.35
    NIGHT_SHIFT_PREMIUM: float = 0.25
    HOLIDAY_WORK_PREMIUM: float = 0.35
    
    # Yukyu Settings
    YUKYU_INITIAL_DAYS: int = 10
    YUKYU_AFTER_MONTHS: int = 6
    YUKYU_MAX_DAYS: int = 20
    HANKYU_ENABLED: bool = True
    
    # Apartment Management
    APARTMENT_CALC_ENABLED: bool = True
    APARTMENT_PRORATE_BY_DAY: bool = True
    
    # Reports Settings
    REPORTS_DIR: str = "/app/reports"
    REPORTS_LOGO_PATH: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "/app/logs/uns-claudejp.log"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:3001",  # Next.js frontend
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",  # Next.js frontend
        "http://127.0.0.1:8000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignorar variables de entorno adicionales


settings = Settings()
