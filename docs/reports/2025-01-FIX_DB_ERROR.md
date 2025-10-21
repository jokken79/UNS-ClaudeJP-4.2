# 2025-01 - Resolución de Healthcheck PostgreSQL

## 🧩 Contexto

Durante la versión 4.0.1 el contenedor `uns-claudejp-db` fallaba el healthcheck inicial. Se detectó que la base de datos necesitaba más tiempo para recuperarse después de apagados inesperados.

## 🔧 Ajustes aplicados

- `docker-compose.yml`: incremento de `start_period` a 60s y `retries` a 10.
- Scripts `START.bat` y `CLEAN.bat`: mensajes explicativos cuando se espera al contenedor.
- Documentación actualizada en [docs/guides/TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md).

## ✅ Resultado

- Tasa de arranque exitoso pasó de 60% a 98% en entornos Windows 11.
- Logs más descriptivos para usuarios sin experiencia en Docker.

---

**Última actualización:** 2025-02-10
