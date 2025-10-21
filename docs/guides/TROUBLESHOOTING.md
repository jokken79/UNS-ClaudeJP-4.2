# 🔧 Solución de Problemas - UNS-ClaudeJP 4.2

## ❌ Error: "dependency failed to start: container uns-claudejp-db is unhealthy"

### 📋 Descripción del Problema

El contenedor PostgreSQL necesita más tiempo para completar verificaciones de salud. Ocurre cuando:
- La base de datos se cerró de forma abrupta.
- Docker tiene recursos limitados.
- Otro proceso usa el puerto 5432.

### ✅ Solución Rápida

| Plataforma | Comando |
|------------|---------|
| Windows | `scripts\START.bat` (espera 60s y reintenta) |
| Linux/macOS | `docker compose restart db` |

### Pasos detallados

1. Espera 60 segundos tras el error inicial.
2. Reinicia solo la base de datos (`scripts\START.bat` reintenta automáticamente o usa `docker compose restart db`).
3. Si persiste:
   - Windows: `scripts\STOP.bat` → esperar 10s → `scripts\START.bat`.
   - Linux/macOS: `docker compose down` → `docker compose up -d`.

### Limpieza completa (⚠️ borra datos)

| Plataforma | Comando |
|------------|---------|
| Windows | `scripts\CLEAN.bat` |
| Linux/macOS | `docker compose down -v && docker compose up --build` |

## 🔍 Diagnóstico Manual

```bash
# Estado de contenedores
docker compose ps

# Logs específicos
docker compose logs db --tail 100

# Puerto 5432 en uso
netstat -ano | findstr :5432   # Windows
lsof -i :5432                  # Linux/macOS
```

## 🛠️ Scripts y equivalentes

| Script Windows | Equivalente Linux/macOS |
|----------------|-------------------------|
| `scripts\LOGS.bat` | `docker compose logs -f <servicio>` |
| `scripts\DIAGNOSTICO.bat` | `docker compose ps && docker compose logs --tail 50` |
| `scripts\REINSTALAR.bat` | `docker compose down -v && docker compose up --build` |

## 📝 Mejoras aplicadas en 4.2

- Healthcheck ampliado (`timeout=10s`, `retries=10`, `start_period=60s`).
- Documentación multiplataforma actualizada.
- Reportes detallados en [docs/reports/](../reports/).

## 🎯 Prevención

1. Usa `scripts\STOP.bat` o `docker compose down` antes de apagar el equipo.
2. Asigna al menos **2 CPU y 4 GB RAM** a Docker.
3. Mantén `.env` actualizado y evita exponer credenciales.
4. Ejecuta `pytest backend/tests` después de cambios en el backend.

## 📎 Referencias

- [README.md](../../README.md)
- [docs/issues/AUTH_ERROR_401.md](../issues/AUTH_ERROR_401.md)
- [docs/reports/2025-01-FIX_DB_ERROR.md](../reports/2025-01-FIX_DB_ERROR.md)

---

**Última actualización:** 2025-02-10
