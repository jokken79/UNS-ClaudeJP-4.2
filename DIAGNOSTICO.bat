@echo off
setlocal EnableDelayedExpansion

title UNS-ClaudeJP 4.0 - Diagnostico

echo.
echo ========================================================
echo       UNS-CLAUDEJP 4.0 - DIAGNOSTICO DEL SISTEMA
echo ========================================================
echo.

echo [PASO 1/5] Verificando Docker...
echo --------------------------------------------------------
docker --version
if %errorlevel% NEQ 0 (
    echo PROBLEMA: Docker no esta instalado
    echo SOLUCION: Descarga Docker Desktop desde:
    echo   https://www.docker.com/products/docker-desktop
    goto :error
) else (
    echo OK - Docker detectado
)
echo.

docker compose version >nul 2>&1
if %errorlevel% EQU 0 (
    echo OK - Docker Compose V2 disponible
    set "DC=docker compose"
) else (
    docker-compose version >nul 2>&1
    if %errorlevel% EQU 0 (
        echo OK - Docker Compose V1 disponible
        set "DC=docker-compose"
    ) else (
        echo PROBLEMA: Docker Compose no esta disponible
        goto :error
    )
)
echo.

echo [PASO 2/5] Verificando que Docker Desktop este activo...
echo --------------------------------------------------------
docker ps >nul 2>&1
if %errorlevel% NEQ 0 (
    echo PROBLEMA: Docker Desktop no esta corriendo
    echo SOLUCION: Abre Docker Desktop desde el menu Inicio
    goto :error
) else (
    echo OK - Docker Desktop esta activo
)
echo.

echo [PASO 3/5] Verificando puertos disponibles...
echo --------------------------------------------------------
netstat -ano | findstr "LISTENING" | findstr ":3000 " >nul 2>&1
if %errorlevel% EQU 0 (
    echo ADVERTENCIA: Puerto 3000 puede estar en uso
) else (
    echo OK - Puerto 3000 disponible
)

netstat -ano | findstr "LISTENING" | findstr ":8000 " >nul 2>&1
if %errorlevel% EQU 0 (
    echo ADVERTENCIA: Puerto 8000 puede estar en uso
) else (
    echo OK - Puerto 8000 disponible
)

netstat -ano | findstr "LISTENING" | findstr ":5432 " >nul 2>&1
if %errorlevel% EQU 0 (
    echo ADVERTENCIA: Puerto 5432 puede estar en uso
) else (
    echo OK - Puerto 5432 disponible
)

netstat -ano | findstr "LISTENING" | findstr ":8080 " >nul 2>&1
if %errorlevel% EQU 0 (
    echo ADVERTENCIA: Puerto 8080 puede estar en uso
) else (
    echo OK - Puerto 8080 disponible
)
echo.

echo [PASO 4/5] Verificando archivo .env...
echo --------------------------------------------------------
if not exist ".env" (
    echo PROBLEMA: Archivo .env NO EXISTE
    echo.
    echo SOLUCION:
    echo   1. Si existe .env.example, copia y renombra a .env
    echo   2. Si no existe, se creara uno basico
    echo.
    echo Creando .env basico...
    (
        echo POSTGRES_DB=uns_claudejp
        echo POSTGRES_USER=uns_admin
        echo POSTGRES_PASSWORD=MySecurePassword123
        echo DATABASE_URL=postgresql://uns_admin:MySecurePassword123@db:5432/uns_claudejp
        echo SECRET_KEY=abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ01
        echo APP_NAME=UNS-ClaudeJP 4.0
        echo APP_VERSION=4.0.0
        echo DEBUG=true
        echo ENVIRONMENT=development
        echo FRONTEND_URL=http://localhost:3000
    ) > .env
    echo OK - Archivo .env creado
) else (
    echo OK - Archivo .env existe
)
echo.

echo [PASO 5/5] Verificando carpetas necesarias...
echo --------------------------------------------------------
if not exist "backend" (
    echo PROBLEMA: Carpeta 'backend' no existe
    goto :error
) else (
    echo OK - Carpeta backend encontrada
)

if not exist "frontend-nextjs" (
    echo PROBLEMA: Carpeta 'frontend-nextjs' no existe
    goto :error
) else (
    echo OK - Carpeta frontend-nextjs encontrada
)

if not exist "docker" (
    echo ADVERTENCIA: Carpeta 'docker' no existe
) else (
    echo OK - Carpeta docker encontrada
)

if not exist "docker-compose.yml" (
    echo PROBLEMA: Archivo 'docker-compose.yml' no existe
    goto :error
) else (
    echo OK - Archivo docker-compose.yml encontrado
)
echo.

echo.
echo ========================================================
echo            DIAGNOSTICO COMPLETADO
echo ========================================================
echo.
echo ESTADO: TODO OK! Puedes proceder.
echo.
echo PROXIMOS PASOS:
echo   1. Ejecuta: START.bat
echo   2. Espera a que todos los servicios esten "Up"
echo   3. Abre navegador: http://localhost:3000
echo   4. Login: admin / admin123
echo.
echo Si tienes problemas, ejecuta: LOGS.bat
echo.
pause
goto :end

:error
echo.
echo ========================================================
echo            PROBLEMAS ENCONTRADOS
echo ========================================================
echo.
echo Lee TROUBLESHOOTING.md para mas informacion
echo.
pause
exit /b 1

:end
