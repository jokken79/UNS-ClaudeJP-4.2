@echo off
setlocal EnableDelayedExpansion

title UNS-ClaudeJP 4.0 - Limpiar Cache

echo.
echo ========================================================
echo       UNS-CLAUDEJP 4.0 - LIMPIAR CACHE
echo ========================================================
echo.
echo Este script limpia el cache de Next.js y reinicia el frontend.
echo Util cuando ves errores antiguos que ya fueron corregidos.
echo.

set /p CONFIRMAR="Continuar? (S/N): "
if /i NOT "%CONFIRMAR%"=="S" (
    echo Operacion cancelada
    pause
    exit /b 0
)

echo.
echo [1/3] Deteniendo frontend...
docker stop uns-claudejp-frontend >nul 2>&1
echo OK
echo.

echo [2/3] Limpiando cache de Next.js...
docker exec uns-claudejp-frontend rm -rf .next/cache 2>nul
echo OK
echo.

echo [3/3] Reiniciando frontend...
docker start uns-claudejp-frontend
echo OK
echo.

echo ========================================================
echo       CACHE LIMPIADO
echo ========================================================
echo.
echo Ahora:
echo   1. Espera 30 segundos a que Next.js compile
echo   2. Ve a tu navegador
echo   3. Presiona Ctrl + Shift + R (recarga forzada)
echo   4. Si aun ves errores viejos:
echo      - Abre DevTools (F12)
echo      - Pestaña Application
echo      - Clear Storage
echo      - Click "Clear site data"
echo.

set /p ABRIR="Abrir navegador en http://localhost:3000? (S/N): "
if /i "%ABRIR%"=="S" (
    timeout /t 30 /nobreak >nul
    start http://localhost:3000
)

echo.
pause
