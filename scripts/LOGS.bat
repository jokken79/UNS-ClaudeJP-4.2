@echo off
setlocal EnableDelayedExpansion

title UNS-ClaudeJP 4.0 - Ver Logs

echo.
echo ========================================================
echo       UNS-CLAUDEJP 4.0 - VER LOGS
echo ========================================================
echo.

set "DOCKER_COMPOSE_CMD="
docker compose version >nul 2>&1
if %errorlevel% EQU 0 (
    set "DOCKER_COMPOSE_CMD=docker compose"
) else (
    docker-compose version >nul 2>&1
    if %errorlevel% EQU 0 (
        set "DOCKER_COMPOSE_CMD=docker-compose"
    ) else (
        echo ERROR: Docker Compose no encontrado
        pause
        exit /b 1
    )
)

echo Selecciona cual servicio deseas monitorear:
echo.
echo   1 - Database (PostgreSQL)
echo   2 - Backend (FastAPI)
echo   3 - Frontend (Next.js)
echo   4 - Importer
echo   5 - Adminer
echo   6 - Todos los servicios
echo   7 - Salir
echo.

choice /C 1234567 /M "Opcion: "

if errorlevel 7 goto :end
if errorlevel 6 (
    echo.
    echo Mostrando logs de TODOS los servicios...
    echo Presiona Ctrl+C para salir
    echo.
    %DOCKER_COMPOSE_CMD% logs -f
    goto :end
)
if errorlevel 5 (
    echo.
    echo Mostrando logs de Adminer...
    echo Presiona Ctrl+C para salir
    echo.
    docker logs -f uns-claudejp-adminer
    goto :end
)
if errorlevel 4 (
    echo.
    echo Mostrando logs de Importer...
    echo Presiona Ctrl+C para salir
    echo.
    docker logs -f uns-claudejp-importer
    goto :end
)
if errorlevel 3 (
    echo.
    echo Mostrando logs de Frontend (Next.js)...
    echo Presiona Ctrl+C para salir
    echo.
    docker logs -f uns-claudejp-frontend
    goto :end
)
if errorlevel 2 (
    echo.
    echo Mostrando logs de Backend (FastAPI)...
    echo Presiona Ctrl+C para salir
    echo.
    docker logs -f uns-claudejp-backend
    goto :end
)
if errorlevel 1 (
    echo.
    echo Mostrando logs de Database (PostgreSQL)...
    echo Presiona Ctrl+C para salir
    echo.
    docker logs -f uns-claudejp-db
    goto :end
)

:end
echo.
pause
