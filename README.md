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
scripts\START.bat
```

El sistema iniciará automáticamente. Espera 20-30 segundos.

> 💡 **Todos los scripts .bat están ahora en la carpeta `scripts/`** - Ver [scripts/README.md](scripts/README.md) para más información.

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

- **[DOCS.md](DOCS.md)** - Índice maestro de toda la documentación
- **[CLAUDE.md](CLAUDE.md)** - Guía para desarrolladores (arquitectura, comandos, workflow)
- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios y versiones
- **[docs/guides/](docs/guides/)** - Guías de instalación, Git, seguridad y troubleshooting
- **[docs/database/](docs/database/)** - Propuestas de BD y análisis de datos
- **[scripts/](scripts/)** - Scripts de administración del sistema

---

## 🛠️ Comandos Útiles

```bash
# Iniciar sistema
scripts\START.bat

# Detener sistema
scripts\STOP.bat

# Ver logs
scripts\LOGS.bat

# Limpieza completa (⚠️ Borra TODOS los datos)
scripts\CLEAN.bat

# Reinstalar (⚠️ Borra datos)
scripts\REINSTALAR.bat

# Ver todos los scripts disponibles
scripts\README.md
```

Ver [scripts/README.md](scripts/README.md) para descripción completa de cada comando.

---

## 🔧 Solución de Problemas

### Error: "container uns-claudejp-db is unhealthy"

**Solución Rápida**:
1. Espera 30 segundos
2. Ejecuta `scripts\START.bat` de nuevo

**Si persiste**:
- Lee [docs/guides/TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) para soluciones detalladas
- Ejecuta `scripts\LOGS.bat` para ver detalles del error
- En último caso: `scripts\CLEAN.bat` + `scripts\START.bat`

### Otros Problemas

Consulta la documentación completa en:
- [docs/guides/TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md) - Guía completa de solución de problemas
- [DOCS.md](DOCS.md) - Índice maestro de toda la documentación

---

## 📞 Soporte

- 📧 Email: support@uns-kikaku.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/uns-claudejp-4.0/issues)

---

<p align="center">
  Made with ❤️ by UNS-Kikaku | Powered by Claude AI
</p>
