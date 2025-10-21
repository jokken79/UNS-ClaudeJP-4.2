# 2025-01 - Instrucciones Visuales para Reiniciar Servicios

Aunque originalmente se planearon capturas, esta guía describe paso a paso el flujo visual para garantizar un arranque correcto.

1. **Abrir Docker Desktop** y verificar que `uns-claudejp-db`, `uns-claudejp-backend` y `uns-claudejp-frontend` están en verde.
2. **Ejecutar `scripts\\START.bat`** y esperar el mensaje `Sistema iniciado correctamente`.
3. **Verificar la API** en http://localhost:8000/api/health.
4. **Ingresar al frontend** en http://localhost:3000 e iniciar sesión.
5. **Confirmar métricas**: revisar que no haya alertas en la consola y que los módulos respondan.

Para Linux/macOS, ejecuta `docker compose up -d` y revisa los estados con `docker compose ps`. Si algún servicio aparece como `unhealthy`, consulta [docs/guides/TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md).

---

**Última actualización:** 2025-02-10
