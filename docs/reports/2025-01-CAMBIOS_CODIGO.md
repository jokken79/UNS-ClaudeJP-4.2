# 2025-01 - Cambios de Código para Estabilizar PostgreSQL

## Archivos modificados

| Archivo | Descripción |
|---------|-------------|
| `docker-compose.yml` | Ajustes de healthcheck y variables de aplicación | 
| `scripts/START.bat` | Mensajes de espera y reintentos documentados |
| `scripts/CLEAN.bat` | Limpieza extendida y confirmaciones de seguridad |
| `docs/guides/TROUBLESHOOTING.md` | Nuevas soluciones paso a paso |

## Fragmentos destacados

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
  interval: 10s
  timeout: 10s
  retries: 10
  start_period: 60s
```

```batch
call :log "Esperando a que la base de datos esté saludable..."
call :wait_for_health "uns-claudejp-db" 60
```

Estos cambios garantizan tiempo suficiente para la recuperación automática y hacen visibles los pasos que ejecutan los scripts.

---

**Última actualización:** 2025-02-10
