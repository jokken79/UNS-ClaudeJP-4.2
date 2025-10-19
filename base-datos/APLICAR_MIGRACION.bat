@echo off
REM ============================================
REM Script de Migración Automática - Windows
REM Aplica la migración de campos completos de rirekisho
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ============================================
echo MIGRACION AUTOMATICA - Campos Rirekisho
echo ============================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "07_add_complete_rirekisho_fields.sql" (
    echo ERROR: No se encuentra el archivo de migracion.
    echo Por favor ejecuta este script desde D:\JPUNS-CLAUDE4.0\base-datos
    pause
    exit /b 1
)

echo [1/4] Verificando Docker...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta corriendo.
    echo Por favor inicia Docker Desktop primero.
    pause
    exit /b 1
)
echo OK - Docker esta corriendo

echo.
echo [2/4] Verificando contenedor de base de datos...
docker ps | findstr "uns-claudejp-db" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: El contenedor de base de datos no esta corriendo.
    echo Ejecuta: docker-compose up -d
    pause
    exit /b 1
)
echo OK - Base de datos esta corriendo

echo.
echo [3/4] Aplicando migracion...
echo.
docker exec -i uns-claudejp-db psql -U postgres -d uns_claude_jp < 07_add_complete_rirekisho_fields.sql

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Hubo un problema al aplicar la migracion.
    echo Revisa los errores anteriores.
    pause
    exit /b 1
)

echo.
echo [4/4] Verificando resultados...
echo.

REM Verificar tablas
docker exec -it uns-claudejp-db psql -U postgres -d uns_claude_jp -c "\dt" | findstr "family_members"
if %errorlevel% equ 0 (
    echo OK - Tabla family_members creada
) else (
    echo ADVERTENCIA - Tabla family_members no encontrada
)

docker exec -it uns-claudejp-db psql -U postgres -d uns_claude_jp -c "\dt" | findstr "work_experiences"
if %errorlevel% equ 0 (
    echo OK - Tabla work_experiences creada
) else (
    echo ADVERTENCIA - Tabla work_experiences no encontrada
)

docker exec -it uns-claudejp-db psql -U postgres -d uns_claude_jp -c "\dt" | findstr "scanned_documents"
if %errorlevel% equ 0 (
    echo OK - Tabla scanned_documents creada
) else (
    echo ADVERTENCIA - Tabla scanned_documents no encontrada
)

echo.
echo ============================================
echo MIGRACION COMPLETADA
echo ============================================
echo.
echo Siguientes pasos:
echo 1. Actualiza los modelos Python (ver README_MIGRACION.md)
echo 2. Reinicia el backend: docker-compose restart backend
echo 3. Verifica en http://localhost:8000/docs
echo.
echo Para mas detalles, consulta: README_MIGRACION.md
echo.

pause
