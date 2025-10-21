# 🛠️ Scripts de Administración - UNS-ClaudeJP 4.0

Esta carpeta contiene todos los scripts batch (.bat) para administrar el sistema de forma fácil y automatizada.

---

## 🚀 Scripts Principales

### START.bat
**Iniciar el sistema completo**

```bash
scripts\START.bat
```

**¿Qué hace?**
1. Verifica que exista el archivo `.env` (lo genera automáticamente si no existe)
2. Detecta si tienes Docker Compose v1 o v2
3. Construye las imágenes Docker si es necesario
4. Inicia todos los servicios (PostgreSQL, Backend, Frontend, Adminer)
5. Espera a que la base de datos esté lista
6. Ejecuta las migraciones automáticamente
7. Crea el usuario admin si no existe
8. Importa datos de ejemplo

**Tiempo estimado**: 30-60 segundos (primera vez puede tomar más)

**Servicios iniciados**:
- PostgreSQL (puerto 5432)
- Backend FastAPI (puerto 8000)
- Frontend Next.js (puerto 3000)
- Adminer (puerto 8080)

**URLs disponibles después de iniciar**:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/api/docs
- Adminer: http://localhost:8080

---

### STOP.bat
**Detener todos los servicios**

```bash
scripts\STOP.bat
```

**¿Qué hace?**
- Detiene todos los contenedores Docker
- NO borra datos (la base de datos se mantiene)
- Los volúmenes persisten

**Cuándo usar**:
- Cuando terminas de trabajar
- Antes de reiniciar el sistema
- Para liberar recursos de tu PC

---

### LOGS.bat
**Ver logs de los servicios**

```bash
scripts\LOGS.bat
```

**¿Qué hace?**
1. Muestra un menú para elegir qué servicio monitorear
2. Muestra los logs en tiempo real del servicio seleccionado
3. Útil para debugging y ver qué está pasando

**Servicios disponibles**:
1. Backend (FastAPI)
2. Frontend (Next.js)
3. Database (PostgreSQL)
4. Importer (servicio de importación)
5. Adminer
6. Todos los servicios

**Tip**: Presiona `Ctrl+C` para salir de los logs

---

## 🔧 Scripts de Mantenimiento

### REINSTALAR.bat
**Reinstalación completa del sistema**

```bash
scripts\REINSTALAR.bat
```

⚠️ **ADVERTENCIA**: Este script **BORRA TODOS LOS DATOS**

**¿Qué hace?**
1. Detiene todos los contenedores
2. Elimina todos los contenedores
3. Elimina todos los volúmenes (⚠️ se pierden todos los datos de BD)
4. Elimina todas las imágenes del proyecto
5. Limpia redes de Docker
6. Inicia el sistema desde cero

**Cuándo usar**:
- Cuando tienes problemas graves de base de datos
- Cuando quieres empezar desde cero
- Después de cambios importantes en la estructura

**Tiempo estimado**: 3-5 minutos

---

### CLEAN.bat
**Limpieza profunda del sistema**

```bash
scripts\CLEAN.bat
```

⚠️ **ADVERTENCIA**: Borra todos los datos y cachés

**¿Qué hace?**
- Ejecuta `REINSTALAR.bat`
- Limpia archivos de caché de Python (`__pycache__`, `.pyc`)
- Limpia caché de Next.js (`.next/`)
- Limpia logs temporales
- Ejecuta `docker system prune` para limpiar Docker completamente

**Cuándo usar**:
- Antes de hacer un commit importante
- Cuando tienes problemas de espacio en disco
- Cuando Docker está muy lento
- Limpieza de desarrollo

---

### LIMPIAR_CACHE.bat
**Limpiar caché de Docker (sin borrar datos)**

```bash
scripts\LIMPIAR_CACHE.bat
```

**¿Qué hace?**
- Limpia imágenes Docker no utilizadas
- Limpia contenedores detenidos
- Limpia redes no utilizadas
- Limpia build cache de Docker
- NO elimina volúmenes (tus datos están seguros)

**Cuándo usar**:
- Cuando Docker usa mucho espacio en disco
- Periódicamente para mantener Docker limpio
- Cuando la construcción de imágenes falla

**Tiempo estimado**: 1-2 minutos

---

### DIAGNOSTICO.bat
**Diagnóstico completo del sistema**

```bash
scripts\DIAGNOSTICO.bat
```

**¿Qué hace?**
1. Verifica la versión de Docker
2. Verifica Docker Compose
3. Verifica si los servicios están corriendo
4. Muestra estado de contenedores
5. Muestra estado de volúmenes
6. Muestra logs recientes de cada servicio
7. Verifica conectividad de puertos

**Cuándo usar**:
- Cuando algo no funciona y no sabes por qué
- Antes de pedir ayuda (incluye toda la info relevante)
- Para verificar que todo está bien configurado

**Genera**: Un reporte completo del estado del sistema

---

### INSTALAR.bat
**Instalación inicial del sistema**

```bash
scripts\INSTALAR.bat
```

**¿Qué hace?**
1. Verifica requisitos del sistema
2. Copia `.env.example` a `.env` si no existe
3. Genera `SECRET_KEY` automáticamente
4. Construye todas las imágenes Docker
5. Crea volúmenes necesarios
6. NO inicia los servicios (usa `START.bat` después)

**Cuándo usar**:
- Primera vez que instalas el proyecto
- Después de clonar el repositorio
- Cuando necesitas reconstruir todas las imágenes

---

## 🌐 Scripts de Git

### GIT_SUBIR.bat
**Subir cambios a GitHub**

```bash
scripts\GIT_SUBIR.bat
```

**¿Qué hace?**
1. Muestra el estado actual de Git
2. Pide confirmación de los archivos a subir
3. Permite agregar un mensaje de commit
4. Hace commit de los cambios
5. Hace push al repositorio remoto

**Cuándo usar**:
- Cuando terminas de hacer cambios y quieres guardarlos en GitHub
- Para compartir tu trabajo con el equipo

**Nota**: Asegúrate de haber configurado Git antes de usar este script

---

### GIT_BAJAR.bat
**Descargar cambios desde GitHub**

```bash
scripts\GIT_BAJAR.bat
```

**¿Qué hace?**
1. Verifica tu rama actual
2. Descarga los últimos cambios del repositorio remoto
3. Aplica los cambios a tu código local
4. Muestra un resumen de los cambios descargados

**Cuándo usar**:
- Antes de empezar a trabajar (para tener la última versión)
- Cuando otros miembros del equipo subieron cambios
- Para sincronizar tu código con el repositorio

---

## 📊 Flujo de Trabajo Recomendado

### Primera Instalación
```bash
1. scripts\INSTALAR.bat      # Instalar por primera vez
2. scripts\START.bat          # Iniciar el sistema
3. Ir a http://localhost:3000
```

### Trabajo Diario
```bash
# Al empezar el día
scripts\GIT_BAJAR.bat         # Descargar últimos cambios
scripts\START.bat             # Iniciar sistema

# Durante el desarrollo
scripts\LOGS.bat              # Ver logs cuando sea necesario

# Al terminar
scripts\GIT_SUBIR.bat         # Subir cambios
scripts\STOP.bat              # Detener sistema
```

### Limpieza Semanal
```bash
scripts\LIMPIAR_CACHE.bat     # Limpiar Docker sin perder datos
```

### Solución de Problemas
```bash
1. scripts\DIAGNOSTICO.bat    # Ver qué está fallando
2. scripts\LOGS.bat           # Ver logs detallados
3. Si nada funciona:
   scripts\REINSTALAR.bat     # Reinstalar desde cero
   scripts\START.bat          # Iniciar de nuevo
```

---

## 🔍 Resolución de Problemas

### "El sistema no inicia"
```bash
scripts\DIAGNOSTICO.bat       # Ver qué falla
scripts\LOGS.bat              # Ver logs del servicio problemático
```

### "La base de datos está corrupta"
```bash
scripts\REINSTALAR.bat        # Reinstalar completo
```

### "Docker usa mucho espacio"
```bash
scripts\LIMPIAR_CACHE.bat     # Limpiar caché
```

### "Quiero empezar desde cero"
```bash
scripts\CLEAN.bat             # Limpieza total
scripts\START.bat             # Iniciar de nuevo
```

---

## 💡 Tips y Buenas Prácticas

1. **Antes de pedir ayuda**: Ejecuta `DIAGNOSTICO.bat` y comparte el resultado
2. **Antes de hacer cambios importantes**: Ejecuta `GIT_BAJAR.bat` para tener la última versión
3. **Al terminar tu trabajo**: Ejecuta `GIT_SUBIR.bat` para guardar tus cambios
4. **Si algo no funciona**: Mira los logs con `LOGS.bat`
5. **Limpieza regular**: Ejecuta `LIMPIAR_CACHE.bat` semanalmente
6. **Problemas raros**: `REINSTALAR.bat` suele solucionarlo todo (pero pierdes datos)

---

## 📞 Ayuda Adicional

- Ver documentación completa: [DOCS.md](../DOCS.md)
- Guía de troubleshooting: [docs/guides/TROUBLESHOOTING.md](../docs/guides/TROUBLESHOOTING.md)
- Guía de desarrollo: [CLAUDE.md](../CLAUDE.md)

---

## 🎯 Referencia Rápida

| Script | Uso Principal | Borra Datos | Tiempo |
|--------|---------------|-------------|--------|
| `START.bat` | Iniciar sistema | ❌ No | ~30s |
| `STOP.bat` | Detener sistema | ❌ No | ~5s |
| `LOGS.bat` | Ver logs | ❌ No | - |
| `REINSTALAR.bat` | Reinstalar todo | ✅ Sí | ~3min |
| `CLEAN.bat` | Limpieza total | ✅ Sí | ~4min |
| `LIMPIAR_CACHE.bat` | Limpiar Docker | ❌ No | ~1min |
| `DIAGNOSTICO.bat` | Diagnosticar | ❌ No | ~30s |
| `INSTALAR.bat` | Primera instalación | ❌ No | ~2min |
| `GIT_SUBIR.bat` | Subir a GitHub | ❌ No | ~10s |
| `GIT_BAJAR.bat` | Bajar de GitHub | ❌ No | ~10s |

---

<p align="center">
  <strong>UNS-ClaudeJP 4.0</strong> | Scripts de Administración
</p>
