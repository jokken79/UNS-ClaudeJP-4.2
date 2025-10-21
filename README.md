# UNS-ClaudeJP 4.2

> Sistema Integral de Gestión de Recursos Humanos para Agencias de Personal Temporal Japonesas
> Powered by **Next.js 15**, **FastAPI**, and **PostgreSQL**

![Version](https://img.shields.io/badge/version-4.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)

---

## 🚀 Inicio Rápido

### 1. Instalación

#### Windows (scripts automatizados)

```bash
# Ejecutar el script de inicio
double-click scripts\\START.bat
```

#### Linux/macOS (comandos manuales)

```bash
cp .env.example .env  # configurar variables si es necesario
python generate_env.py

# Construir e iniciar servicios
docker compose up --build -d
```

El sistema estará listo cuando todos los contenedores aparezcan como `healthy`.

> 💡 **Todos los scripts .bat están en la carpeta `scripts/`**. Se incluyen equivalencias manuales para Linux/macOS en esta guía y en [scripts/README.md](scripts/README.md).

### 2. Primer Acceso

1. **Abre tu navegador** y ve a:
   ```
   http://localhost:3000
   ```

2. **Serás redirigido automáticamente** a la página de login

3. **Ingresa las credenciales por defecto**:
   ```
   Usuario:   admin
   Contraseña: admin123
   ```

4. **¡Listo!** Serás redirigido al Dashboard

### 3. URLs Disponibles

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/docs
- **Database Admin**: http://localhost:8080

### ⚠️ Nota Importante

Si ves errores **401 (Unauthorized)** en la consola antes de hacer login, **es normal**. El sistema está funcionando correctamente y te redirigirá automáticamente al login. Ver [docs/issues/AUTH_ERROR_401.md](docs/issues/AUTH_ERROR_401.md) para más detalles y pasos de verificación.

---

## ✨ ¿Qué hay de nuevo en 4.2?

### 🎨 Experiencia de Usuario

- ✅ **Login Enterprise** con diseño premium, micro-interacciones y parallax documentadas en [LOGIN_PAGE_UPGRADE.md](LOGIN_PAGE_UPGRADE.md)
- ✅ **Indicadores de confianza** y credenciales de demostración mejoradas directamente en la UI

### 🧠 Plataforma

- ✅ **Generación de `.env` endurecida** con el script `generate_env.py` para instalaciones automáticas
- ✅ **Chequeos de salud expandidos** para asegurar disponibilidad de API y base de datos
- ✅ **Estructura de documentación reorganizada** con guías multiplataforma

### 📦 Nuevas Utilidades

- ✅ **Guías Linux/macOS** para instalación, troubleshooting y Git
- ✅ **Suite inicial de pruebas** (`backend/tests/test_health.py`) para validar el endpoint de salud de la API
- ✅ **Workflow de CI** para ejecutar pruebas en cada push

---

## 📚 Documentación Completa

Para información detallada, consulta:

- **[DOCS.md](DOCS.md)** - Índice maestro de toda la documentación actualizada a 4.2
- **[CLAUDE.md](CLAUDE.md)** - Guía para desarrolladores (arquitectura, comandos, workflow)
- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios y versiones
- **[docs/guides/](docs/guides/)** - Guías de instalación, Git, seguridad y troubleshooting
- **[docs/issues/](docs/issues/)** - Registro de incidentes y errores conocidos (incluye 401)
- **[docs/reports/](docs/reports/)** - Reportes técnicos detallados de correcciones críticas
- **[scripts/](scripts/)** - Scripts de administración del sistema y equivalentes manuales

---

## 🛠️ Operación Diaria

```bash
# Windows
scripts\START.bat     # Iniciar sistema
double-click scripts\STOP.bat   # Detener sistema
scripts\LOGS.bat      # Ver logs interactivos

# Linux/macOS
python generate_env.py       # Genera .env si no existe
docker compose up -d                  # Iniciar
docker compose logs -f backend        # Ver logs backend
docker compose down                   # Detener servicios
```

Para tareas avanzadas (migraciones, importación de datos, limpieza) revisa [scripts/README.md](scripts/README.md) y [base-datos/README_MIGRACION.md](base-datos/README_MIGRACION.md).

---

## 🔧 Solución de Problemas

### Error: "container uns-claudejp-db is unhealthy"

**Solución Rápida**:
1. Espera 30-60 segundos
2. Ejecuta `scripts\START.bat` nuevamente **o** `docker compose restart db`

**Si persiste**:
- Lee [docs/guides/TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) para soluciones detalladas en Windows/Linux/macOS
- Ejecuta `scripts\LOGS.bat` o `docker compose logs db` para ver detalles del error
- En último caso: `scripts\CLEAN.bat` + `scripts\START.bat` (Windows) o `docker compose down -v && docker compose up --build` (Linux/macOS)

### Otros Problemas

Consulta la documentación completa en:
- [docs/guides/TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) - Guía completa de solución de problemas
- [DOCS.md](DOCS.md) - Índice maestro de toda la documentación

---

## ✅ Pruebas y Calidad

- Ejecuta `pytest backend/tests` para validar la API (Windows/Linux/macOS)
- Consulta el workflow `.github/workflows/backend-tests.yml` para ver cómo se automatizan las pruebas
- Agrega nuevos tests en `backend/tests/` siguiendo los ejemplos existentes

---

## 📞 Soporte

- 📧 Email: support@uns-kikaku.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/uns-claudejp-4.2/issues)

---

<p align="center">
  Made with ❤️ by UNS-Kikaku | Powered by Claude AI
</p>
