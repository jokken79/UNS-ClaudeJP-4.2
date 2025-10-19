# UNS-ClaudeJP 4.0

> Sistema Integral de Gestión de Recursos Humanos para Agencias de Personal Temporal Japonesas
> Powered by **Next.js 15**, **FastAPI**, and **PostgreSQL**

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)

---

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Ejecutar el script de inicio
START.bat
```

El sistema iniciará automáticamente. Espera 20-30 segundos.

### 2. Primer Acceso

1. **Abre tu navegador** y ve a:
   ```
   http://localhost:3000
   ```

2. **Serás redirigido automáticamente** a la página de login

3. **Ingresa las credenciales**:
   ```
   Usuario:   admin
   Contraseña: admin123
   ```

4. **¡Listo!** Serás redirigido al Dashboard

### 3. URLs Disponibles

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/docs
- **Database Admin**: http://localhost:8080

### ⚠️ Nota Importante

Si ves errores **401 (Unauthorized)** en la consola antes de hacer login, **es normal**. El sistema está funcionando correctamente y te redirigirá automáticamente al login. Ver `AUTH_ERROR_401.md` para más detalles.

---

## ✨ ¿Qué hay de nuevo en 4.0?

### 🎉 Migración Completa a Next.js 15

- ✅ **8 módulos principales** migrados
- ✅ **15 páginas funcionales** con App Router
- ✅ **Performance mejorado** con React Query
- ✅ **UI moderna** con Tailwind CSS
- ✅ **OCR integration** completamente funcional

### 📦 Módulos Implementados

1. **Login** - Autenticación JWT
2. **Dashboard** - Panel principal con estadísticas
3. **Employees** (派遣社員) - Gestión de empleados
4. **Candidates** (履歴書) - Gestión de candidatos con OCR
5. **Factories** (派遣先) - Gestión de empresas cliente
6. **TimerCards** (タイムカード) - Control de asistencia
7. **Salary** (給与) - Cálculo de nómina
8. **Requests** (申請) - Sistema de solicitudes

---

## 📚 Documentación Completa

Para información detallada, consulta:

- **ARCHITECTURE.md** - Arquitectura y stack tecnológico
- **MODULES.md** - Descripción de cada módulo
- **DEVELOPMENT.md** - Guía para desarrolladores
- **DEPLOYMENT.md** - Guía de despliegue

---

## 🛠️ Comandos Útiles

```bash
# Iniciar sistema
START.bat

# Detener sistema
STOP.bat

# Ver logs
LOGS.bat

# Limpieza completa (⚠️ Borra TODOS los datos)
CLEAN.bat

# Reinstalar (⚠️ Borra datos)
REINSTALAR.bat
```

---

## 🔧 Solución de Problemas

### Error: "container uns-claudejp-db is unhealthy"

**Solución Rápida**:
1. Espera 30 segundos
2. Ejecuta `START.bat` de nuevo

**Si persiste**:
- Lee `TROUBLESHOOTING.md` para soluciones detalladas
- Ejecuta `LOGS.bat` para ver detalles del error
- En último caso: `CLEAN.bat` + `START.bat`

### Otros Problemas

Consulta la documentación completa en:
- `TROUBLESHOOTING.md` - Guía completa de solución de problemas
- `FIX_DB_ERROR.md` - Fix del error de base de datos

---

## 📞 Soporte

- 📧 Email: support@uns-kikaku.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/uns-claudejp-4.0/issues)

---

<p align="center">
  Made with ❤️ by UNS-Kikaku | Powered by Claude AI
</p>
