@echo off
setlocal EnableDelayedExpansion

title UNS-ClaudeJP - Reinstalar Sistema

echo.
echo ========================================================
echo       UNS-CLAUDEJP - SISTEMA DE GESTION
echo       REINSTALAR SISTEMA
echo ========================================================
echo.
echo ADVERTENCIA IMPORTANTE
echo.
echo Esta accion eliminara:
echo   - Todos los contenedores
echo   - Todos los volumenes (BASE DE DATOS)
echo   - Todas las imagenes construidas
echo.
echo Se reinstalara todo desde cero con datos de prueba.
echo.
echo ========================================================
echo.

set /p CONFIRMAR="Estas SEGURO que deseas continuar? (S/N): "
if /i NOT "%CONFIRMAR%"=="S" goto :cancelled

:continue

echo.
echo [0/5] Verificando archivo .env...
echo.

REM Cambiar al directorio raiz del proyecto
cd /d "%~dp0\.."

if not exist .env (
    echo      .env no encontrado. Generando automaticamente...
    python generate_env.py
    if errorlevel 1 (
        echo.
        echo PROBLEMA: Error al generar .env
        echo Por favor, crea manualmente el archivo .env desde .env.example
        pause
        exit /b 1
    )
    echo      OK - Archivo .env generado.
) else (
    echo      OK - Archivo .env ya existe.
)

set "DOCKER_COMPOSE_CMD="
docker compose version >nul 2>&1
if %errorlevel% EQU 0 (
    set "DOCKER_COMPOSE_CMD=docker compose"
) else (
    docker-compose version >nul 2>&1
    if %errorlevel% EQU 0 (
        set "DOCKER_COMPOSE_CMD=docker-compose"
    ) else (
        echo PROBLEMA: Docker Compose no esta instalado
        pause
        exit /b 1
    )
)

echo.
echo [1/5] Deteniendo servicios completamente...
echo.
%DOCKER_COMPOSE_CMD% down
echo      OK - Servicios detenidos.
echo.
echo      Esperando 10 segundos para asegurar cierre limpio...
timeout /t 10 /nobreak >nul

echo.
echo [2/5] Eliminando volumenes antiguos...
%DOCKER_COMPOSE_CMD% down -v
echo      OK - Volumenes eliminados.

echo.
echo [3/5] Reconstruyendo imagenes desde cero...
echo      (Esto puede tardar 3-5 minutos)
echo.
%DOCKER_COMPOSE_CMD% build --no-cache

if errorlevel 1 (
    echo.
    echo PROBLEMA: Error al reconstruir las imagenes
    pause
    exit /b 1
)

echo.
echo [4/5] Iniciando servicios nuevos...
echo.

REM Primero iniciar solo la base de datos
echo      [4.1] Iniciando PostgreSQL primero...
%DOCKER_COMPOSE_CMD% up -d db

echo      [4.2] Esperando 30 segundos a que PostgreSQL este saludable...
timeout /t 30 /nobreak >nul

REM Verificar que la DB este healthy antes de continuar
echo      [4.3] Verificando salud de PostgreSQL...
docker inspect --format="{{.State.Health.Status}}" uns-claudejp-db 2>nul | findstr "healthy" >nul
if %errorlevel% NEQ 0 (
    echo      ADVERTENCIA: PostgreSQL aun no esta 'healthy', esperando 30 segundos mas...
    timeout /t 30 /nobreak >nul

    REM Verificar de nuevo
    docker inspect --format="{{.State.Health.Status}}" uns-claudejp-db 2>nul | findstr "healthy" >nul
    if %errorlevel% NEQ 0 (
        echo      ADVERTENCIA: PostgreSQL aun en recovery, esperando 30 segundos adicionales...
        timeout /t 30 /nobreak >nul
    )
)

REM Ahora iniciar el resto de servicios
echo      [4.4] Iniciando el resto de servicios (importer, backend, frontend, adminer)...
%DOCKER_COMPOSE_CMD% up -d

if errorlevel 1 (
    echo.
    echo PROBLEMA: Error al iniciar los servicios
    echo.
    echo Intentando reiniciar todos los servicios...
    timeout /t 10 /nobreak >nul
    %DOCKER_COMPOSE_CMD% up -d

    if errorlevel 1 (
        echo.
        echo ERROR CRITICO: No se pudieron iniciar los servicios
        echo Por favor revisa los logs con: LOGS.bat
        pause
        exit /b 1
    )
)

echo      OK - Servicios iniciados.

echo.
echo [5/5] Esperando a que los servicios esten completamente listos...
echo.
echo      [5.1] Esperando a que el importer complete (30 segundos)...
timeout /t 30 /nobreak >nul

echo      [5.2] Esperando a que Next.js compile (30 segundos)...
timeout /t 30 /nobreak >nul

echo      [5.3] Verificando estado final de contenedores...
echo.
%DOCKER_COMPOSE_CMD% ps
echo.

echo.
echo ========================================================
echo       OK - REINSTALACION COMPLETADA
echo ========================================================
echo.
echo El sistema ha sido reinstalado con exito.
echo.
echo URLs de Acceso:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000
echo.
echo Credenciales:
echo   Usuario:   admin
echo   Password:  admin123
echo.
echo Nota: El frontend puede tardar unos minutos en compilar.
echo.
pause
exit /b 0

:cancelled
echo.
echo Reinstalacion cancelada.
echo.
pause
exit /b 0
