# Instalación Rápida - UNS-ClaudeJP 4.0

## Requisitos Previos

- **Windows 10/11**
- **Docker Desktop** instalado y ejecutándose
- **Python 3.8+** instalado (viene con Windows 10/11)
- **Git** (opcional, para clonar el repositorio)

## Instalación en 3 Pasos

### 1. Clonar o Descargar el Proyecto

```bash
git clone <tu-repositorio-url>
cd JPUNS-CLAUDE4.0
```

O descarga el ZIP y descomprímelo.

### 2. Ejecutar REINSTALAR.bat

```bash
REINSTALAR.bat
```

Este script automáticamente:
- ✅ Genera el archivo `.env` con credenciales seguras (si no existe)
- ✅ Construye las imágenes Docker
- ✅ Inicia PostgreSQL
- ✅ Ejecuta migraciones de base de datos
- ✅ Importa datos de prueba
- ✅ Inicia Backend (FastAPI)
- ✅ Inicia Frontend (Next.js)

**Tiempo estimado:** 5-8 minutos

### 3. Acceder al Sistema

Una vez completada la instalación:

- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:8000/api/docs
- **Adminer (BD):** http://localhost:8080

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

## Uso Diario

### Iniciar el Sistema

```bash
START.bat
```

### Detener el Sistema

```bash
STOP.bat
```

### Ver Logs

```bash
LOGS.bat
```

## Solución de Problemas

### Problema: "PostgreSQL is unhealthy"

**Solución:**
1. Espera 60-90 segundos (es normal en el primer arranque)
2. Si persiste, ejecuta:
   ```bash
   STOP.bat
   REINSTALAR.bat
   ```

### Problema: "Error al generar .env"

**Solución:**
1. Verifica que Python esté instalado: `python --version`
2. Crea manualmente el archivo `.env` desde `.env.example`:
   ```bash
   copy .env.example .env
   ```
3. Edita `.env` y cambia:
   - `POSTGRES_PASSWORD` → Una contraseña segura
   - `SECRET_KEY` → Una clave aleatoria de 64 caracteres

### Problema: "Puerto 3000/8000 ya en uso"

**Solución:**
1. Cierra la aplicación que esté usando el puerto
2. O cambia el puerto en `docker-compose.yml`

## Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `START.bat` | Inicia el sistema |
| `STOP.bat` | Detiene el sistema |
| `REINSTALAR.bat` | Reinstala desde cero |
| `LOGS.bat` | Muestra logs en tiempo real |
| `generate_env.py` | Genera `.env` automáticamente |
| `.env` | Configuración (NO commitear a Git) |
| `.env.example` | Plantilla de configuración |

## Notas de Seguridad

⚠️ **IMPORTANTE:** El archivo `.env` contiene credenciales sensibles. NUNCA lo subas a Git.

El archivo `.gitignore` ya está configurado para ignorarlo automáticamente.

## Primer Uso - Cambio de Contraseñas

Después de la instalación inicial:

1. Inicia sesión con `admin` / `admin123`
2. Ve a **Configuración → Usuarios**
3. Cambia la contraseña del administrador
4. (Opcional) Configura Azure OCR en `.env` para mejor precisión en documentos

## Portabilidad

Este sistema está diseñado para funcionar en **cualquier PC Windows** con Docker instalado.

Al clonar el repositorio en otro equipo:

1. Ejecuta `REINSTALAR.bat`
2. El script generará automáticamente un nuevo `.env` con credenciales únicas
3. ¡Listo! El sistema estará operativo en 5-8 minutos

## Soporte

Para reportar problemas o solicitar ayuda:
- Abre un Issue en GitHub
- Revisa los logs con `LOGS.bat`
- Consulta la documentación completa en `CLAUDE.md`

---

**Versión:** 4.0.0  
**Última actualización:** 2025-10-20
