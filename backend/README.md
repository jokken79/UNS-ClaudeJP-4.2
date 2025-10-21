# Backend FastAPI - UNS-ClaudeJP 4.2

## 🚀 Requisitos
- Python 3.11+
- pip / uv
- PostgreSQL 15 (cuando se ejecuta fuera de Docker)

## ▶️ Ejecución local (sin Docker)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://USER:PASS@localhost:5432/uns_claudejp
uvicorn app.main:app --reload
```

## ▶️ Ejecución en Docker

Los servicios se levantan automáticamente con `docker compose up -d`. Para acceder al contenedor:

```bash
docker exec -it uns-claudejp-backend bash
```

## 🧪 Pruebas

```bash
pytest backend/tests
```

El test `test_health.py` verifica el endpoint `/api/health`. Añade pruebas adicionales en `backend/tests/`.

## 🗃️ Migraciones

```bash
docker exec -it uns-claudejp-backend alembic upgrade head
docker exec -it uns-claudejp-backend alembic revision --autogenerate -m "describe change"
```

Consulta [base-datos/README_MIGRACION.md](../base-datos/README_MIGRACION.md) para instrucciones detalladas.

## 🔐 Variables importantes (`.env`)
- `DATABASE_URL`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `FRONTEND_URL`
- `MAX_UPLOAD_SIZE`

Revisa [docs/reports/2024-11-Backend-Hardening.md](../docs/reports/2024-11-Backend-Hardening.md) para mejores prácticas de seguridad.

---

**Última actualización:** 2025-02-10
