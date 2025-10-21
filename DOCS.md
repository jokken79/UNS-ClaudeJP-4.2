# 📚 Índice Maestro de Documentación - UNS-ClaudeJP 4.0

> Guía completa para encontrar toda la documentación del proyecto organizada por categorías

---

## 🚀 Inicio Rápido

| Documento | Descripción |
|-----------|-------------|
| [README.md](README.md) | Inicio rápido del sistema y guía básica |
| [docs/guides/INSTALACION_RAPIDA.md](docs/guides/INSTALACION_RAPIDA.md) | Guía paso a paso de instalación |
| [scripts/README.md](scripts/README.md) | Descripción de todos los scripts disponibles |

---

## 👨‍💻 Para Desarrolladores

| Documento | Descripción |
|-----------|-------------|
| [CLAUDE.md](CLAUDE.md) | **Guía principal** - Arquitectura, comandos, desarrollo, workflows |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios y versiones |
| [.claude/CLAUDE.md](.claude/CLAUDE.md) | Instrucciones específicas para Claude Code AI |

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
| [base-datos/README_MIGRACION.md](base-datos/README_MIGRACION.md) | Guía de migraciones con Alembic |

---

## 📖 Guías y Tutoriales

📁 **Ubicación**: `docs/guides/`

### Instalación y Configuración

| Documento | Descripción |
|-----------|-------------|
| [INSTALACION_RAPIDA.md](docs/guides/INSTALACION_RAPIDA.md) | Guía rápida de instalación |
| [TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) | Solución de problemas comunes |

### Git y GitHub

| Documento | Descripción |
|-----------|-------------|
| [INSTRUCCIONES_GIT.md](docs/guides/INSTRUCCIONES_GIT.md) | Comandos Git básicos y workflow |
| [COMO_SUBIR_A_GITHUB.md](docs/guides/COMO_SUBIR_A_GITHUB.md) | Cómo subir cambios a GitHub |
| [SEGURIDAD_GITHUB.md](docs/guides/SEGURIDAD_GITHUB.md) | Buenas prácticas de seguridad en GitHub |

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
| [START.bat](scripts/START.bat) | Iniciar todos los servicios Docker |
| [STOP.bat](scripts/STOP.bat) | Detener todos los servicios |
| [LOGS.bat](scripts/LOGS.bat) | Ver logs de servicios |
| [REINSTALAR.bat](scripts/REINSTALAR.bat) | Reinstalación completa (⚠️ borra datos) |
| [CLEAN.bat](scripts/CLEAN.bat) | Limpieza completa del sistema |
| [INSTALAR.bat](scripts/INSTALAR.bat) | Instalación inicial |
| [DIAGNOSTICO.bat](scripts/DIAGNOSTICO.bat) | Diagnóstico del sistema |
| [LIMPIAR_CACHE.bat](scripts/LIMPIAR_CACHE.bat) | Limpiar caché de Docker |
| [GIT_SUBIR.bat](scripts/GIT_SUBIR.bat) | Subir cambios a GitHub |
| [GIT_BAJAR.bat](scripts/GIT_BAJAR.bat) | Bajar cambios desde GitHub |

Ver [scripts/README.md](scripts/README.md) para detalles completos.

---

## 📁 Estructura del Proyecto

```
UNS-ClaudeJP-4.2/
├── README.md                     # Inicio rápido
├── DOCS.md                       # Este archivo (índice maestro)
├── CLAUDE.md                     # Guía principal para desarrolladores
├── CHANGELOG.md                  # Historial de cambios
│
├── scripts/                      # 🛠️ Scripts de administración
│   ├── README.md                 # Descripción de scripts
│   ├── START.bat                 # Iniciar sistema
│   ├── STOP.bat                  # Detener sistema
│   └── ...                       # Otros scripts
│
├── docs/                         # 📚 Documentación organizada
│   ├── database/                 # Base de datos
│   │   ├── BD_PROPUESTA_*.md
│   │   └── ANALISIS_*.md
│   ├── guides/                   # Guías y tutoriales
│   │   ├── INSTALACION_RAPIDA.md
│   │   ├── TROUBLESHOOTING.md
│   │   └── *_GIT.md
│   ├── sessions/                 # Resúmenes de sesiones
│   │   └── RESUMEN_*.md
│   └── archive/                  # Documentos históricos
│       └── *_COMPLETADOS.md
│
├── backend/                      # Backend FastAPI
│   ├── app/
│   ├── alembic/
│   └── scripts/
│
├── frontend-nextjs/              # Frontend Next.js 15
│   ├── app/
│   ├── components/
│   └── lib/
│
└── base-datos/                   # Archivos de base de datos
    └── README_MIGRACION.md
```

---

## 🔍 Búsqueda Rápida

### ¿Cómo instalar el sistema?
→ [docs/guides/INSTALACION_RAPIDA.md](docs/guides/INSTALACION_RAPIDA.md)

### ¿Cómo ejecutar el sistema?
→ [README.md](README.md) o `scripts\START.bat`

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
3. Consulta [scripts/README.md](scripts/README.md) para comandos de desarrollo

### Tengo un problema
1. Consulta [docs/guides/TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md)
2. Ejecuta `scripts\DIAGNOSTICO.bat`
3. Revisa logs con `scripts\LOGS.bat`

### Quiero subir cambios a GitHub
1. Lee [docs/guides/INSTRUCCIONES_GIT.md](docs/guides/INSTRUCCIONES_GIT.md)
2. Usa `scripts\GIT_SUBIR.bat`
3. Consulta [docs/guides/SEGURIDAD_GITHUB.md](docs/guides/SEGURIDAD_GITHUB.md)

---

## 📞 Soporte

- 📧 Email: support@uns-kikaku.com
- 🐛 Issues: [GitHub Issues](https://github.com/jokken79/UNS-ClaudeJP-4.2/issues)

---

<p align="center">
  <strong>UNS-ClaudeJP 4.0</strong> | Made with ❤️ by UNS-Kikaku | Powered by Claude AI
</p>
