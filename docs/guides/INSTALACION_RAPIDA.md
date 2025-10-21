# Instalación Rápida - UNS-ClaudeJP 4.2

## Requisitos Previos

### Windows
- **Windows 10/11**
- **Docker Desktop** instalado y ejecutándose
- **Python 3.10+** (incluido en scripts)
- **Git** (opcional, para clonar el repositorio)

### Linux / macOS
- **Docker Engine + Docker Compose v2**
- **Python 3.10+**
- **Git**

## Instalación en 3 Pasos

### 1. Clonar o Descargar el Proyecto

```bash
git clone <tu-repositorio-url>
cd UNS-ClaudeJP-4.2
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
python generate_env.py
```

> 💡 En Windows, los scripts `.bat` ejecutan este paso automáticamente.

### 3. Iniciar servicios

| Plataforma | Comando |
|------------|---------|
| Windows | `scripts\START.bat` |
| Linux/macOS | `docker compose up --build -d` |

**Qué hace el arranque:**
- Construye imágenes Docker
- Ejecuta migraciones Alembic
- Crea el usuario administrador (admin/admin123)
- Importa datos de ejemplo

**Tiempo estimado:** 5-8 minutos en la primera ejecución.

## Uso Diario

| Acción | Windows | Linux/macOS |
|--------|---------|-------------|
| Iniciar | `scripts\START.bat` | `docker compose up -d` |
| Detener | `scripts\STOP.bat` | `docker compose down` |
| Ver logs | `scripts\LOGS.bat` | `docker compose logs -f backend` |
| Reinstalar (⚠️ borra datos) | `scripts\REINSTALAR.bat` | `docker compose down -v && docker compose up --build` |

## Solución de Problemas

### Problema: "PostgreSQL is unhealthy"

1. Espera 60 segundos y reintenta (`scripts\START.bat` o `docker compose restart db`).
2. Si persiste, consulta [docs/guides/TROUBLESHOOTING.md](TROUBLESHOOTING.md) para seguir los pasos por plataforma.

### Problema: `.env` no generado

```bash
python --version
cp .env.example .env
python generate_env.py
```

En Windows también puedes ejecutar `scripts\INSTALAR.bat`.

### Problema: Puerto 3000/8000 ocupado

- Cierra la aplicación que usa el puerto.
- Cambia los puertos en `docker-compose.yml` y reinicia los servicios.

## Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `scripts/START.bat` | Inicia el sistema (Windows) |
| `scripts/STOP.bat` | Detiene el sistema (Windows) |
| `scripts/REINSTALAR.bat` | Reinstala desde cero (Windows) |
| `scripts/LOGS.bat` | Muestra logs en tiempo real (Windows) |
| `.env` | Configuración local (no se versiona) |
| `.env.example` | Plantilla base |
| `generate_env.py` | Genera valores seguros |

## Notas de Seguridad

- ⚠️ **Nunca subas** el archivo `.env` a GitHub.
- Cambia la contraseña del usuario admin después del primer acceso.
- Si habilitas OCR externos, configura las claves en `.env`.

## Primer Uso - Cambio de Contraseñas

1. Inicia sesión con `admin` / `admin123`.
2. Ve a **Configuración → Usuarios**.
3. Cambia la contraseña del administrador.
4. Configura MFA si se despliega en producción.

## Portabilidad

Para mover el proyecto a otra máquina:

1. Clona el repositorio.
2. Copia `.env.example` a `.env` y ejecuta `python generate_env.py`.
3. Inicia los servicios según la plataforma.

## Soporte

- Issues: abre un ticket en GitHub (recomendado privado).
- Documentación extendida: [DOCS.md](../../DOCS.md).
- Problemas frecuentes: [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

---

**Versión:** 4.2.0  
**Última actualización:** 2025-02-10
