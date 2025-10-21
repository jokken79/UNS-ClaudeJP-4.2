@echo off
setlocal EnableDelayedExpansion

title UNS-ClaudeJP 4.0 - Detener Sistema

echo.
echo ========================================================
echo       UNS-CLAUDEJP 4.0 - DETENER SISTEMA
echo ========================================================
echo.

echo Verificando Docker Compose...
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

echo Deteniendo todos los servicios...
echo.
%DOCKER_COMPOSE_CMD% down

if %errorlevel% EQU 0 (
    echo.
    echo OK - Todos los servicios detenidos correctamente.
    echo.
) else (
    echo.
    echo ERROR al detener los servicios.
    echo.
)

echo Estado actual:
%DOCKER_COMPOSE_CMD% ps

echo.
pause
