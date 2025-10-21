"""FastAPI application entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import init_db
from app.core.logging import app_logger
from app.core.middleware import ExceptionHandlerMiddleware, LoggingMiddleware, SecurityMiddleware

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager - replaces deprecated @app.on_event"""
    # Startup
    app_logger.info("Starting application", version=settings.APP_VERSION, environment=settings.ENVIRONMENT)
    try:
        init_db()
        app_logger.info("Database initialised successfully")
    except Exception as exc:  # pragma: no cover
        app_logger.exception("Database init failed", error=str(exc))
        raise

    yield

    # Shutdown
    app_logger.info("Shutting down application")


app = FastAPI(
    title=f"{settings.APP_NAME} API",
    description="""## UNS-ClaudeJP v4.2 - API de Gestión de Personal Temporal

### Características Principales
- **OCR Híbrido**: Azure + EasyOCR + Gemini + Tesseract con caché inteligente
- **Gestión de Personal**: Candidatos, empleados, fábricas y tarjetas de tiempo
- **Nóminas Automatizadas**: Cálculo según normativa laboral japonesa
- **Notificaciones**: Integración con Email y LINE
- **Monitoreo**: Endpoints de health check y métricas
- **Seguridad**: JWT authentication con rate limiting

### Autenticación
La API utiliza tokens JWT. Incluye el header: `Authorization: Bearer <token>`.

### Formato de Respuesta
Todas las respuestas retornan JSON estructurado con mensajes y códigos claros.
""",
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    contact={
        "name": "UNS-Kikaku Support",
        "email": "support@uns-kikaku.com",
        "url": settings.COMPANY_WEBSITE,
    },
    license_info={"name": "Proprietary"},
    servers=[
        {"url": "http://localhost:8000", "description": "Development"},
        {"url": "https://api.uns-kikaku.com", "description": "Production"},
    ],
    lifespan=lifespan,
)

# Add rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add custom middlewares
app.add_middleware(SecurityMiddleware)
app.add_middleware(ExceptionHandlerMiddleware)
app.add_middleware(LoggingMiddleware)

# CORS configuration - restricted for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Request-ID", "Accept"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Trusted hosts configuration
ALLOWED_HOSTS = (
    ["localhost", "127.0.0.1", "0.0.0.0"]
    if settings.DEBUG
    else ["uns-kikaku.com", "api.uns-kikaku.com", "www.uns-kikaku.com"]
)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)

# Create necessary directories
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True)

# Mount static files
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/")
async def root() -> dict:
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "company": settings.COMPANY_NAME,
        "website": settings.COMPANY_WEBSITE,
        "status": "running",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/api/health")
async def health_check() -> dict:
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": "Not found", "path": str(request.url)})


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: Exception) -> JSONResponse:
    app_logger.exception("Internal server error", path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc) if settings.DEBUG else "An error occurred"},
    )


from app.api import (  # noqa: E402  pylint: disable=wrong-import-position
    auth,
    candidates,
    azure_ocr,
    dashboard,
    database,
    employees,
    factories,
    import_export,
    monitoring,
    notifications,
    reports,
    requests,
    salary,
    timer_cards,
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(candidates.router, prefix="/api/candidates", tags=["Candidates"])
app.include_router(azure_ocr.router, prefix="/api/azure-ocr", tags=["Azure OCR"])
app.include_router(database.router, prefix="/api/database", tags=["Database Management"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(factories.router, prefix="/api/factories", tags=["Factories"])
app.include_router(timer_cards.router, prefix="/api/timer-cards", tags=["Timer Cards"])
app.include_router(salary.router, prefix="/api/salary", tags=["Salary"])
app.include_router(requests.router, prefix="/api/requests", tags=["Requests"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(import_export.router, prefix="/api/import", tags=["Import/Export"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["Monitoring"])


if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
