@echo off
setlocal EnableDelayedExpansion

title UNS-ClaudeJP 4.0 - Iniciar Sistema

echo.
echo ========================================================
echo       UNS-CLAUDEJP 4.0 - INICIAR SISTEMA
echo ========================================================
echo.

echo [1/5] Verificando Docker Compose...
set "DOCKER_COMPOSE_CMD="
docker compose version >nul 2>&1
if %errorlevel% EQU 0 (
    set "DOCKER_COMPOSE_CMD=docker compose"
    echo      OK - Docker Compose V2 detectado.
) else (
    docker-compose version >nul 2>&1
    if %errorlevel% EQU 0 (
        set "DOCKER_COMPOSE_CMD=docker-compose"
        echo      OK - Docker Compose V1 detectado.
    ) else (
        echo ERROR: No se encontro Docker Compose.
        echo Asegurate de que Docker Desktop este instalado y corriendo.
        pause
        exit /b 1
    )
)
echo.

echo [2/5] Verificando que Docker Desktop este activo...
docker ps >nul 2>&1
if %errorlevel% NEQ 0 (
    echo ERROR: Docker Desktop no esta corriendo.
    echo Por favor, inicia Docker Desktop y vuelve a ejecutar este script.
    pause
    exit /b 1
)
echo      OK - Docker Desktop esta activo.
echo.

echo [3/5] Deteniendo contenedores anteriores (si existen)...
%DOCKER_COMPOSE_CMD% down >nul 2>&1
echo      OK - Limpieza completada.
echo.

echo [4/5] Iniciando servicios...
echo.
echo      IMPORTANTE: La base de datos puede tardar 60-90 segundos.
echo      Esto es NORMAL, especialmente si el sistema se cerro incorrectamente.
echo      PostgreSQL necesita tiempo para recuperar y verificar datos.
echo.
echo      Espera pacientemente...
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
)

REM Ahora iniciar el resto de servicios
echo      [4.4] Iniciando el resto de servicios...
%DOCKER_COMPOSE_CMD% up -d

if %errorlevel% NEQ 0 (
    echo.
    echo ERROR al iniciar los servicios.
    echo.
    echo POSIBLES SOLUCIONES:
    echo    1. Espera 30 segundos y ejecuta START.bat de nuevo
    echo    2. Ejecuta STOP.bat, espera 10 segundos, luego START.bat
    echo    3. Ejecuta LOGS.bat para ver los detalles
    echo    4. Si falla repetidamente, ejecuta REINSTALAR.bat
    echo.
    pause
    exit /b 1
)
echo      OK - Todos los servicios iniciados.
echo.

echo [5/5] Esperando a que los servicios esten completamente listos...
echo.
echo      Esperando 20 segundos adicionales para compilacion de Next.js...
timeout /t 20 /nobreak >nul

echo      Verificando estado de contenedores...
echo.
%DOCKER_COMPOSE_CMD% ps
echo.

echo ========================================================
echo       SISTEMA INICIADO
echo ========================================================
echo.
echo URLs de Acceso:
echo    Frontend:         http://localhost:3000
echo    API Docs:         http://localhost:8000/api/docs
echo    Base de Datos:    http://localhost:8080 (Adminer)
echo    Health Check:     http://localhost:8000/api/health
echo.
echo Credenciales de Login:
echo    Usuario:   admin
echo    Password:  admin123
echo.
echo NOTAS IMPORTANTES:
echo  * El frontend puede tardar 1-2 minutos en compilar (Next.js)
echo  * Si ves "Loading..." en el navegador, espera y recarga
echo  * Si la BD esta "unhealthy", espera 30-60 segundos mas
echo.
echo Para ver logs en tiempo real: LOGS.bat
echo.

set /p ABRIR="Abrir el frontend en el navegador? (S/N): "
if /i "%ABRIR%"=="S" (
    echo.
    echo Abriendo http://localhost:3000 en tu navegador...
    start http://localhost:3000
)

echo.
echo Disfruta de UNS-ClaudeJP!
echo.
pause
