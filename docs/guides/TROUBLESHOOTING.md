# 🔧 Solución de Problemas - UNS-ClaudeJP 4.0

## ❌ Error: "dependency failed to start: container uns-claudejp-db is unhealthy"

### 📋 Descripción del Problema

Este error ocurre cuando el contenedor de la base de datos PostgreSQL no pasa su verificación de salud (healthcheck) a tiempo. Las causas más comunes son:

1. **Apagado incorrecto anterior**: La base de datos no se detuvo correctamente la última vez
2. **Recuperación automática en progreso**: PostgreSQL está recuperando datos de un cierre inesperado
3. **Recursos insuficientes**: Docker no tiene suficiente RAM o CPU asignada
4. **Puerto en uso**: El puerto 5432 está siendo usado por otro proceso

---

## ✅ Soluciones

### Solución 1: Esperar y Reintentar (RECOMENDADA)

La base de datos puede necesitar hasta 60 segundos para realizar la recuperación automática.

**Pasos:**
1. Espera 30-60 segundos después del error
2. Ejecuta `scripts\START.bat` nuevamente
3. El sistema debería iniciar correctamente

```batch
# Simplemente ejecuta:
scripts\START.bat
```

### Solución 2: Detener y Reiniciar Correctamente

Si la Solución 1 no funciona:

**Pasos:**
1. Ejecuta `scripts\STOP.bat` para detener todo correctamente
2. Espera 10 segundos
3. Ejecuta `scripts\START.bat` para iniciar de nuevo

```batch
scripts\STOP.bat
# Espera 10 segundos
scripts\START.bat
```

### Solución 3: Limpieza Completa (PRECAUCIÓN)

⚠️ **ADVERTENCIA**: Esto borrará TODA la base de datos y datos.

Si las soluciones anteriores no funcionan:

**Pasos:**
1. Ejecuta `scripts\CLEAN.bat`
2. Confirma con "SI" (en mayúsculas)
3. Espera a que termine la limpieza
4. Ejecuta `scripts\START.bat` para iniciar desde cero

```batch
scripts\CLEAN.bat
# Confirma con: SI
# Luego ejecuta:
scripts\START.bat
```

### Solución 4: Verificar Logs

Para ver los detalles exactos del error:

**Pasos:**
1. Ejecuta `scripts\LOGS.bat`
2. Selecciona "2" (Logs de Database)
3. Lee los mensajes de error
4. Busca líneas que contengan "ERROR" o "FATAL"

```batch
scripts\LOGS.bat
# Selecciona opción: 2
```

### Solución 5: Verificar Docker Desktop

Asegúrate de que Docker Desktop tenga suficientes recursos:

**Pasos:**
1. Abre Docker Desktop
2. Ve a Settings → Resources
3. Configura al menos:
   - **CPU**: 2 cores
   - **Memory**: 4 GB
   - **Disk**: 20 GB
4. Aplica los cambios y reinicia Docker Desktop
5. Ejecuta `scripts\START.bat`

---

## 🔍 Diagnóstico Manual

Si necesitas diagnosticar el problema manualmente:

### Ver estado de contenedores:
```powershell
docker ps -a --filter "name=uns-claudejp"
```

### Ver logs de la base de datos:
```powershell
docker logs uns-claudejp-db --tail 100
```

### Verificar que el puerto 5432 esté libre:
```powershell
netstat -ano | findstr :5432
```

### Forzar recreación de contenedores:
```powershell
docker compose down
docker compose up -d --force-recreate
```

---

## 📝 Mejoras Aplicadas

### Cambios en `docker-compose.yml`:

Se aumentaron los parámetros del healthcheck de la base de datos:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
  interval: 10s
  timeout: 10s          # Aumentado de 5s → 10s
  retries: 10           # Aumentado de 5 → 10
  start_period: 60s     # Aumentado de 30s → 60s
```

**Beneficios:**
- ✅ Más tiempo para la recuperación automática de la base de datos
- ✅ Mayor tolerancia a apagados incorrectos
- ✅ Menos fallos falsos durante el inicio

### Nuevos Scripts:

1. **scripts/CLEAN.bat**: Script de limpieza completa
2. **docs/guides/TROUBLESHOOTING.md**: Esta documentación
3. **scripts/README.md**: Descripción de todos los scripts disponibles

---

## 🎯 Prevención de Problemas Futuros

### Buenas Prácticas:

1. **Siempre usa scripts\STOP.bat** para detener el sistema
   - ❌ NO cierres Docker Desktop directamente
   - ❌ NO apagues Windows sin detener los contenedores
   - ✅ SÍ ejecuta `scripts\STOP.bat` antes de apagar

2. **Espera a que los servicios inicien completamente**
   - La primera vez puede tardar 2-3 minutos
   - No interrumpas el proceso de inicio

3. **Verifica los recursos de Docker Desktop**
   - Mantén al menos 4 GB de RAM asignados
   - Asegúrate de tener espacio en disco suficiente

4. **Mantén Docker Desktop actualizado**
   - Usa la versión más reciente de Docker Desktop
   - Actualiza regularmente

---

## 📞 Soporte Adicional

Si ninguna de estas soluciones funciona:

1. Ejecuta `scripts\LOGS.bat` y copia los logs de todos los servicios
2. Toma una captura de pantalla del error
3. Revisa el archivo `logs/uns-claudejp.log` si existe
4. Contacta con el equipo de soporte con esta información

---

## 📚 Referencias

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Documentation](https://hub.docker.com/_/postgres)
- [Docker Desktop Troubleshooting](https://docs.docker.com/desktop/troubleshoot/overview/)

---

**Última actualización**: 17 de Octubre 2025  
**Versión**: 4.0.0
