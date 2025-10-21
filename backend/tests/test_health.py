import importlib
import sys
import os
from typing import Any

from fastapi.testclient import TestClient


def get_app(monkeypatch: Any):
    """Import the FastAPI app after seeding required environment variables."""
    monkeypatch.setenv("APP_NAME", os.getenv("APP_NAME", "UNS-ClaudeJP 4.2"))
    monkeypatch.setenv("APP_VERSION", os.getenv("APP_VERSION", "4.2.0"))
    monkeypatch.setenv(
        "DATABASE_URL",
        os.getenv("DATABASE_URL", "sqlite:///./test.db"),
    )
    monkeypatch.setenv("SECRET_KEY", os.getenv("SECRET_KEY", "test-secret-key-32-characters-long!!"))

    sys.modules.pop('app.core.config', None)
    sys.modules.pop('app.main', None)
    module = importlib.import_module('app.main')
    return module.app


def test_health_endpoint_returns_ok(monkeypatch):
    app = get_app(monkeypatch)
    client = TestClient(app)

    response = client.get("/api/health", headers={"host": "localhost"})

    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "healthy"
    assert "timestamp" in data
