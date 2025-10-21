# AUTH_ERROR_401 - Comportamiento Esperado Antes del Login

## 📌 Resumen

Los errores HTTP 401 (Unauthorized) que aparecen en la consola o en la pestaña "Network" del navegador **antes** de iniciar sesión son esperados. Ocurren cuando el frontend solicita datos protegidos y el backend responde indicando que no hay un token válido. El sistema inmediatamente redirige al formulario de autenticación.

## 🔍 ¿Cuándo ocurre?

- Al abrir `http://localhost:3000` sin haber iniciado sesión.
- Al refrescar el dashboard o páginas internas sin token vigente.
- Cuando la sesión expira y el frontend detecta que debe volver a loguearse.

## ✅ Cómo verificar que todo está bien

1. **Revisa la redirección:** después del 401 el navegador debe mostrar `/login`.
2. **Ingresa tus credenciales:** usa `admin / admin123` o un usuario válido.
3. **Comprueba el dashboard:** si ves el panel y los datos cargan, la autenticación funciona.
4. **API de salud:** ejecuta `curl http://localhost:8000/api/health` para confirmar que la API responde `{"status":"healthy"}`.

## 🧪 Pruebas automatizadas relacionadas

El archivo `backend/tests/test_health.py` valida el endpoint `/api/health` para garantizar que el backend esté disponible. Ejecuta:

```bash
pytest backend/tests/test_health.py
```

Si la prueba pasa, el backend está levantado correctamente; los 401 se deben solo a la falta de token.

## 🚫 Cuándo investigar más a fondo

Abre un issue si:

- Los 401 aparecen **después** de iniciar sesión correctamente.
- El frontend no redirige al login y queda en blanco.
- El endpoint `/api/health` devuelve un estado diferente a `healthy`.
- Los logs del backend (`docker compose logs backend`) muestran errores 500 o fallos de base de datos.

## 📝 Recomendaciones

- Mantén el token actualizado: la aplicación renueva automáticamente el token al navegar.
- Configura correctamente la variable `FRONTEND_URL` en `.env` si usas dominios personalizados.
- Para entornos productivos, activa HTTPS y verifica cabeceras CORS según [docs/reports/2024-11-Backend-Hardening.md](../reports/2024-11-Backend-Hardening.md).

---

**Última actualización:** 2025-02-10
