# UNS-ClaudeJP 4.0 - Guía de Desarrollo para IA

## ⚠️ REGLAS CRÍTICAS - NUNCA VIOLAR

1. **NUNCA BORRAR CÓDIGO FUNCIONAL**: Si algo funciona, NO SE TOCA. Solo se agrega o mejora.
2. **NUNCA BORRAR ARCHIVOS**: Especialmente batch files (.bat), scripts de Python, configuraciones Docker, o archivos en `/subagentes/`
3. **NUNCA MODIFICAR SIN CONFIRMAR**: Siempre preguntar antes de cambiar código existente
4. **COMPATIBILIDAD WINDOWS**: Todo debe funcionar en cualquier PC Windows con Docker Desktop
5. **BACKUP PRIMERO**: Antes de cambios grandes, sugerir backup o crear rama Git
6. **RESPETAR CONVENCIONES**: Mantener el estilo y estructura actual del proyecto

## Arquitectura del Sistema

Este es un **sistema de gestión de RRHH para agencias de personal japonesas** con **arquitectura multi-servicio Docker Compose**:
- **Backend**: FastAPI 0.115+ con SQLAlchemy 2.0 ORM + PostgreSQL 15
- **Frontend**: Next.js 15.5 con App Router, TypeScript 5.6, Tailwind CSS
- **Servicios OCR**: Azure + EasyOCR + Tesseract híbrido para procesamiento de documentos japoneses

Entidades de negocio principales: `candidates` (履歴書/rirekisho), `employees` (派遣社員), `factories` (派遣先), `timer_cards` (タイムカード), `salary` (給与), `requests` (申請).

## Flujos de Trabajo Esenciales

### Comandos de Inicio Rápido
```bash
# Iniciar todos los servicios (incluye generación automática de .env)
START.bat

# Acceder a contenedores para desarrollo
docker exec -it uns-claudejp-backend bash
docker exec -it uns-claudejp-frontend bash

# Operaciones de base de datos
docker exec -it uns-claudejp-db psql -U uns_admin -d uns_claudejp
```

**Crítico**: Credenciales por defecto son `admin`/`admin123`. Servicios en puertos 3000 (frontend), 8000 (backend), 5432 (postgres), 8080 (adminer).

### Patrón de Migraciones de Base de Datos
- Usar Alembic en contenedor backend: `alembic revision --autogenerate -m "descripción"`
- Aplicar migraciones: `alembic upgrade head`
- Configuración inicial incluye `/docker-entrypoint-initdb.d/01_init_database.sql`
- Revisar historial en `backend/alembic/versions/`

### Arquitectura Frontend (Next.js 15)
- **Estructura de Rutas**: App Router con grupo de rutas `(dashboard)` para páginas autenticadas
- **Gestión de Estado**: Stores Zustand en `/stores/` + React Query para estado del servidor
- **Integración API**: Instancia Axios en `/lib/api.ts` con interceptores JWT
- **Temas**: Sistema de temas personalizado con mapeo de migración para nombres legacy
- **Componentes UI**: Radix UI + Tailwind, patrones shadcn/ui en `/components/ui/`

## Patrones Específicos del Proyecto

### Convenciones de API Backend
```python
# Estructura de archivos: backend/app/api/{modulo}.py
# Modelos: backend/app/models/models.py (patrón de archivo único)
# Enums: UserRole, CandidateStatus, RequestType, ShiftType
```

### Flujo de Procesamiento OCR
El procesamiento de documentos japoneses usa **cascada OCR híbrida**:
1. Azure Cognitive Services (primario)
2. EasyOCR (respaldo)
3. Tesseract (respaldo final)
Resultados en caché en `/uploads/azure_ocr_temp/`

### Patrón de Importación/Exportación de Datos
- Plantillas Excel en `/config/employee_master.xlsm`
- Scripts de importación en `/backend/scripts/`
- Configuraciones de fábricas en `/config/factories/`

### Autenticación y Seguridad
- Tokens JWT con expiración de 8 horas (480 minutos)
- Acceso basado en roles: `SUPER_ADMIN`, `ADMIN`, `COORDINATOR`, `KANRININSHA`, `EMPLOYEE`, `CONTRACT_WORKER`
- Estado de auth frontend en Zustand + persistencia localStorage
- Auto-redirección en respuestas 401

## Puntos de Integración Críticos

### Dependencias de Servicios Docker
```yaml
# El orden de inicio importa:
db -> importer -> backend -> frontend
# Backend espera health check de DB (período de inicio 60s)
```

### Comunicación Entre Servicios
- Frontend ↔ Backend: Axios con autenticación Bearer token
- Backend ↔ Base de Datos: Sesiones async de SQLAlchemy
- Carga de archivos: Volumen compartido `/uploads/` entre servicios

### Desarrollo vs Producción
- Detección de entorno vía variable `ENVIRONMENT`
- Modo debug controlado por variable `DEBUG`
- URL del frontend configurable vía `FRONTEND_URL`

## Errores Comunes a Evitar

1. **Conexiones de Base de Datos**: Siempre usar el hostname `db` en la red Docker, nunca `localhost`
2. **Rutas de Archivos**: Usar rutas absolutas en volúmenes Docker, verificar permisos de `/uploads/`
3. **Expiración de Token**: Errores 401 antes del login son normales - el interceptor maneja auto-redirección
4. **Timeouts OCR**: Azure OCR tiene límites de tasa, implementar lógica de reintentos apropiada
5. **Conflictos de Migración**: Siempre hacer pull de últimas migraciones antes de crear nuevas
6. **Persistencia de Temas**: Verificar mapeo de migración de temas al actualizar nombres

## ⚠️ Archivos y Directorios PROTEGIDOS - NO MODIFICAR/BORRAR

### Scripts Batch Críticos (Sistema Funciona con Estos)
- `START.bat` - Inicio de todos los servicios
- `STOP.bat` - Detener servicios
- `CLEAN.bat` - Limpieza de datos
- `REINSTALAR.bat` - Reinstalación completa
- `LOGS.bat` - Ver logs del sistema
- `GIT_SUBIR.bat` / `GIT_BAJAR.bat` - Git workflows
- `DIAGNOSTICO.bat` - Diagnóstico del sistema
- `INSTALAR.bat` - Instalación inicial

### Directorios Críticos (NO TOCAR)
- `/subagentes/` - Sistema de orquestación de agentes (next.js, rrhh.js, sql.js)
- `/backend/app/models/models.py` - Modelo de datos completo (703 líneas)
- `/backend/alembic/versions/` - Historial de migraciones
- `/config/` - Configuraciones y plantillas Excel
- `/docker/` - Dockerfiles y configuraciones
- `/base-datos/` - Scripts SQL de inicialización

### Archivos de Configuración Críticos
- `docker-compose.yml` - Orquestación de servicios
- `.env` - Variables de entorno (auto-generado por generate_env.py)
- `orquestador.js` - Router principal de agentes
- `package.json` - Dependencias Node.js
- `requirements.txt` - Dependencias Python

## Compatibilidad Windows

Este sistema está diseñado para funcionar en **cualquier PC Windows** con:
- Docker Desktop instalado y corriendo
- PowerShell disponible
- Python 3.11+ (para generate_env.py)

**Todo se ejecuta mediante archivos .bat** - no requiere configuración manual compleja.

## Archivos Clave para Contexto
- `docker-compose.yml`: Orquestación de servicios y configuración de entorno
- `backend/app/models/models.py`: Modelo de datos completo (703 líneas)
- `frontend-nextjs/lib/api.ts`: Cliente API con manejo de autenticación
- `frontend-nextjs/components/providers.tsx`: Configuración de React Query + temas
- `START.bat`: Inicio en producción con verificaciones de dependencias
- `CLAUDE.md`: Referencia detallada de desarrollo (496 líneas)