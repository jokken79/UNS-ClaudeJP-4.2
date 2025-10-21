# 📚 Índice Maestro de Documentación - UNS-ClaudeJP 4.2

> Guía completa para encontrar toda la documentación del proyecto organizada por categorías.

---

## 🚀 Inicio Rápido

| Documento | Descripción |
|-----------|-------------|
| [README.md](README.md) | Inicio rápido del sistema y guía multiplataforma |
| [docs/guides/INSTALACION_RAPIDA.md](docs/guides/INSTALACION_RAPIDA.md) | Guía paso a paso de instalación en Windows, Linux y macOS |
| [scripts/README.md](scripts/README.md) | Descripción de scripts y comandos equivalentes |

---

## 👨‍💻 Para Desarrolladores

| Documento | Descripción |
|-----------|-------------|
| [CLAUDE.md](CLAUDE.md) | **Guía principal** - Arquitectura, comandos, workflows |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios y versiones |
| [.claude/CLAUDE.md](.claude/CLAUDE.md) | Flujo histórico de orquestación (ver nota de vigencia) |
| [docs/releases/4.2.0.md](docs/releases/4.2.0.md) | Notas de lanzamiento detalladas de la versión 4.2 |

---

## 🗄️ Base de Datos

📁 **Ubicación**: `docs/database/`

| Documento | Descripción |
|-----------|-------------|
| [BD_PROPUESTA_1_MINIMALISTA.md](docs/database/BD_PROPUESTA_1_MINIMALISTA.md) | Propuesta minimalista de esquema de BD |
| [BD_PROPUESTA_2_COMPLETA.md](docs/database/BD_PROPUESTA_2_COMPLETA.md) | Propuesta completa de esquema de BD |
| [BD_PROPUESTA_3_HIBRIDA.md](docs/database/BD_PROPUESTA_3_HIBRIDA.md) | ✅ Propuesta híbrida (implementada) |
| [ANALISIS_EXCEL_VS_BD.md](docs/database/ANALISIS_EXCEL_VS_BD.md) | Análisis comparativo Excel vs Base de Datos |
| [RESUMEN_ANALISIS_EXCEL_COMPLETO.md](docs/database/RESUMEN_ANALISIS_EXCEL_COMPLETO.md) | Resumen completo del análisis de Excel |
| [base-datos/README_MIGRACION.md](base-datos/README_MIGRACION.md) | Guía de migraciones con Alembic (multiplataforma) |

---

## 📖 Guías y Tutoriales

📁 **Ubicación**: `docs/guides/`

### Instalación y Configuración

| Documento | Descripción |
|-----------|-------------|
| [INSTALACION_RAPIDA.md](docs/guides/INSTALACION_RAPIDA.md) | Guía rápida de instalación (Windows/Linux/macOS) |
| [TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) | Solución de problemas comunes por plataforma |

### Git y GitHub

| Documento | Descripción |
|-----------|-------------|
| [INSTRUCCIONES_GIT.md](docs/guides/INSTRUCCIONES_GIT.md) | Comandos Git básicos y workflow |
| [COMO_SUBIR_A_GITHUB.md](docs/guides/COMO_SUBIR_A_GITHUB.md) | Cómo subir cambios a GitHub de forma segura |
| [SEGURIDAD_GITHUB.md](docs/guides/SEGURIDAD_GITHUB.md) | Buenas prácticas de seguridad en GitHub |

---

## ⚠️ Incidentes y Reportes

📁 **Ubicación**: `docs/issues/` y `docs/reports/`

| Documento | Descripción |
|-----------|-------------|
| [issues/AUTH_ERROR_401.md](docs/issues/AUTH_ERROR_401.md) | Explicación del error 401 antes del login |
| [reports/2024-11-Backend-Hardening.md](docs/reports/2024-11-Backend-Hardening.md) | Checklist de endurecimiento del backend |
| [reports/2025-01-FIX_DB_ERROR.md](docs/reports/2025-01-FIX_DB_ERROR.md) | Detalles técnicos del fix al healthcheck de PostgreSQL |
| [reports/2025-01-RESUMEN_SOLUCION.md](docs/reports/2025-01-RESUMEN_SOLUCION.md) | Resumen ejecutivo de la solución |
| [reports/2025-01-CAMBIOS_CODIGO.md](docs/reports/2025-01-CAMBIOS_CODIGO.md) | Cambios de código involucrados |
| [reports/2025-01-INSTRUCCIONES_VISUAL.md](docs/reports/2025-01-INSTRUCCIONES_VISUAL.md) | Pasos visuales de verificación |

---

## 📊 Resúmenes de Sesiones

📁 **Ubicación**: `docs/sessions/`

| Documento | Descripción | Fecha |
|-----------|-------------|-------|
| [RESUMEN_FINAL_SESION.md](docs/sessions/RESUMEN_FINAL_SESION.md) | Resumen final de sesión de desarrollo | - |
| [RESUMEN_PARA_MANANA.md](docs/sessions/RESUMEN_PARA_MANANA.md) | Tareas pendientes para próxima sesión | - |
| [RESUMEN_SESION_COMPLETO.md](docs/sessions/RESUMEN_SESION_COMPLETO.md) | Resumen completo de sesión | - |

---

## 🗂️ Archivo Histórico

📁 **Ubicación**: `docs/archive/`

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [ANALISIS_RIREKISHO_TO_CANDIDATE.md](docs/archive/ANALISIS_RIREKISHO_TO_CANDIDATE.md) | Análisis de migración Rirekisho → Candidate | ✅ Completado |
| [CAMBIOS_RIREKISHO_COMPLETADOS.md](docs/archive/CAMBIOS_RIREKISHO_COMPLETADOS.md) | Cambios realizados en módulo Rirekisho | ✅ Completado |
| [DASHBOARD_MODERNO_IMPLEMENTACION.md](docs/archive/DASHBOARD_MODERNO_IMPLEMENTACION.md) | Implementación del dashboard moderno | ✅ Completado |
| [PROBLEMA_SIDEBAR_PENDIENTE.md](docs/archive/PROBLEMA_SIDEBAR_PENDIENTE.md) | Problema histórico del sidebar | 📋 Documentado |

---

## 🛠️ Scripts de Administración

📁 **Ubicación**: `scripts/`

| Script | Descripción |
|--------|-------------|
| [START.bat](scripts/START.bat) | Iniciar todos los servicios Docker (Windows) |
| [STOP.bat](scripts/STOP.bat) | Detener todos los servicios (Windows) |
| [LOGS.bat](scripts/LOGS.bat) | Ver logs de servicios (Windows) |
| [REINSTALAR.bat](scripts/REINSTALAR.bat) | Reinstalación completa (⚠️ borra datos) |
| [CLEAN.bat](scripts/CLEAN.bat) | Limpieza completa del sistema |
| [INSTALAR.bat](scripts/INSTALAR.bat) | Instalación inicial |
| [DIAGNOSTICO.bat](scripts/DIAGNOSTICO.bat) | Diagnóstico del sistema |
| [LIMPIAR_CACHE.bat](scripts/LIMPIAR_CACHE.bat) | Limpiar caché de Docker |
| Equivalentes Linux/macOS | Ver secciones dedicadas en cada guía |

---

## 🧪 Pruebas Automatizadas

📁 **Ubicación**: `backend/tests/`

| Archivo | Descripción |
|---------|-------------|
| [test_health.py](backend/tests/test_health.py) | Verifica que el endpoint `/api/health` responda correctamente |

Workflow asociado: `.github/workflows/backend-tests.yml`.

---

## 📁 Estructura del Proyecto

```
UNS-ClaudeJP-4.2/
├── README.md                     # Inicio rápido
├── DOCS.md                       # Este archivo (índice maestro)
├── CLAUDE.md                     # Guía principal para desarrolladores
├── CHANGELOG.md                  # Historial de cambios
│
├── scripts/                      # 🛠️ Scripts de administración (Windows)
│   ├── README.md                 # Descripción de scripts
│   └── *.bat                     # Scripts automatizados
│
├── docs/                         # 📚 Documentación organizada
│   ├── database/                 # Base de datos
│   ├── guides/                   # Guías y tutoriales
│   ├── issues/                   # Incidentes y errores conocidos
│   ├── reports/                  # Reportes técnicos y resúmenes
│   ├── releases/                 # Notas por versión
│   ├── sessions/                 # Resúmenes de sesiones
│   └── archive/                  # Documentos históricos
│
├── backend/                      # Backend FastAPI
│   ├── app/
│   ├── alembic/
│   ├── scripts/
│   └── tests/
│
├── frontend-nextjs/              # Frontend Next.js 15
│   ├── app/
│   ├── components/
│   └── README.md
│
└── base-datos/                   # Migraciones manuales y guías
    └── README_MIGRACION.md
```

---

## 🔍 Búsqueda Rápida

### ¿Cómo instalar el sistema?
→ [docs/guides/INSTALACION_RAPIDA.md](docs/guides/INSTALACION_RAPIDA.md)

### ¿Cómo ejecutar el sistema?
→ [README.md](README.md) o `docker compose up -d`

### ¿Problemas al iniciar?
→ [docs/guides/TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md)

### ¿Cómo funciona la arquitectura?
→ [CLAUDE.md](CLAUDE.md) sección "System Architecture"

### ¿Qué scripts puedo usar?
→ [scripts/README.md](scripts/README.md)

### ¿Cómo usar Git?
→ [docs/guides/INSTRUCCIONES_GIT.md](docs/guides/INSTRUCCIONES_GIT.md)

### ¿Cómo está estructurada la base de datos?
→ [docs/database/BD_PROPUESTA_3_HIBRIDA.md](docs/database/BD_PROPUESTA_3_HIBRIDA.md)

### ¿Cómo hacer migraciones de BD?
→ [base-datos/README_MIGRACION.md](base-datos/README_MIGRACION.md)

---

## 🎯 Casos de Uso

### Soy nuevo en el proyecto
1. Lee [README.md](README.md) para inicio rápido
2. Instala con [docs/guides/INSTALACION_RAPIDA.md](docs/guides/INSTALACION_RAPIDA.md)
3. Explora [CLAUDE.md](CLAUDE.md) para entender la arquitectura

### Soy desarrollador
1. Lee [CLAUDE.md](CLAUDE.md) completamente
2. Revisa [docs/database/](docs/database/) para entender el esquema
3. Consulta [backend/README.md](backend/README.md) y [frontend-nextjs/README.md](frontend-nextjs/README.md) para comandos específicos

### Tengo un problema
1. Consulta [docs/guides/TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md)
2. Ejecuta `scripts\DIAGNOSTICO.bat` o `docker compose ps`
3. Revisa logs con `scripts\LOGS.bat` o `docker compose logs -f backend`

### Quiero subir cambios a GitHub
1. Lee [docs/guides/INSTRUCCIONES_GIT.md](docs/guides/INSTRUCCIONES_GIT.md)
2. Usa `scripts\GIT_SUBIR.bat` o los comandos manuales documentados

---

**Última actualización:** 2025-02-10
