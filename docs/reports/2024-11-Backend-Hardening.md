# 2024-11 Backend Hardening Report

## 🎯 Objetivo

Documentar las medidas aplicadas para asegurar la API de UNS-ClaudeJP 4.2 en entornos de desarrollo y staging. Este informe complementa los ajustes introducidos en `docker-compose.yml` y en la configuración de FastAPI.

## 🔐 Cambios Clave

1. **Variables de seguridad unificadas**
   - `SECRET_KEY` y `ALGORITHM` obligatorios en `.env`.
   - Valores por defecto robustos generados por `generate_env.py`.

2. **Cabeceras CORS estrictas**
   - `FRONTEND_URL` debe declararse en `.env` para habilitar únicamente dominios permitidos.
   - Documentado en `config/settings.py` (backend) y referenciado en `README.md`.

3. **Tiempo de expiración de tokens**
   - `ACCESS_TOKEN_EXPIRE_MINUTES` ajustable por entorno.
   - Valores recomendados: `60` para demos públicas, `480` para intranet.

4. **Logging estructurado**
   - Variable `LOG_LEVEL` configurable (`INFO` por defecto).
   - Archivo `logs/uns-claudejp.log` montado como volumen para auditoría.

5. **Limitación de subida de archivos**
   - `MAX_UPLOAD_SIZE` configurable para evitar abusos.
   - Directorio `uploads/` montado como volumen dedicado.

## ✅ Checklist de endurecimiento

| Elemento | Acción | Estado |
|----------|--------|--------|
| HTTPS | Configurar proxy inverso (nginx/traefik) con TLS válido | 🔄 Pendiente producción |
| Secrets | Usar gestores (AWS Secrets Manager, GCP Secret Manager) | 🔄 Pendiente producción |
| Rate limiting | Revisar `backend/app/middlewares/rate_limit.py` y calibrar por entorno | ✅ Documentado |
| Auditoría | Activar logs estructurados y rotación semanal | ✅ Configurable vía `.env` |
| Alertas | Integrar con LINE Notify o SMTP configurables | ✅ Variables en `docker-compose.yml` |

## 🔎 Pasos de verificación

```bash
# 1. Revisar variables críticas
rg "SECRET_KEY" -n backend/app/config

# 2. Simular petición sin token (debe devolver 401)
curl -i http://localhost:8000/api/employees

# 3. Validar token vigente
http POST http://localhost:8000/api/auth/login username==admin password==admin123
```

Si los endpoints sensibles devuelven 401 sin token y 200 con token válido, la configuración está alineada con este informe.

---

**Última actualización:** 2025-02-10
