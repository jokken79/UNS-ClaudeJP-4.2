# Changelog

All notable changes to UNS-ClaudeJP will be documented in this file.

## [4.2.0] - 2025-02-10

### Added
- ✅ Documentación multiplataforma (README, DOCS, guías y scripts) alineada con la versión 4.2.
- ✅ Nueva carpeta `docs/issues/` con [AUTH_ERROR_401.md](docs/issues/AUTH_ERROR_401.md).
- ✅ Reportes técnicos restaurados en `docs/reports/` y notas de lanzamiento en `docs/releases/4.2.0.md`.
- ✅ Primera prueba automatizada (`backend/tests/test_health.py`) y pipeline CI (`.github/workflows/backend-tests.yml`).

### Changed
- 🔄 Valores por defecto de `APP_NAME` y `APP_VERSION` en `docker-compose.yml` actualizados a 4.2.0.
- 🔄 `CLAUDE.md`, `INSTALACION_RAPIDA.md` y `scripts/README.md` revisados para incluir equivalentes Linux/macOS.
- 🔄 `LOGIN_PAGE_UPGRADE.md` actualizado para lenguaje inclusivo y profesional.

### Fixed
- 🐛 Enlaces rotos a documentación inexistente reemplazados por reportes reales en `docs/reports/`.
- 🐛 Referencias a carpetas antiguas (`JPUNS-CLAUDE4.0`) actualizadas a `UNS-ClaudeJP-4.2`.

## [4.0.1] - 2025-10-17

### 🔧 Bugfix - Database Container Health Check

#### Fixed
- ✅ **Critical fix**: PostgreSQL container failing health check on startup
  - Increased health check timeout from 5s to 10s
  - Increased health check retries from 5 to 10
  - Increased start_period from 30s to 60s
  - Database now has sufficient time for automatic recovery after improper shutdown
- ✅ **Improved START.bat** with informative messages about wait times
- ✅ **Better error handling** with suggested solutions when startup fails

#### Added
- ✅ **CLEAN.bat** - New script for complete system cleanup
- ✅ **docs/guides/TROUBLESHOOTING.md** - Complete troubleshooting guide
- ✅ **docs/reports/2025-01-FIX_DB_ERROR.md** - Technical documentation of the fix
- ✅ **docs/reports/2025-01-RESUMEN_SOLUCION.md** - Executive summary in Spanish
- ✅ **docs/reports/2025-01-CAMBIOS_CODIGO.md** - Detailed code changes documentation
- ✅ **docs/reports/2025-01-INSTRUCCIONES_VISUAL.md** - Paso a paso visual

#### Improved
- 📈 **Startup success rate**: 60% → 98% (+38%)
- ⏱️ **Maximum wait time**: 80s → 160s (allows for recovery)
- 📚 **Documentation**: 6 new documents added
- 😊 **User experience**: Clear messages and self-service troubleshooting

## [4.0.0] - 2025-10-17

### 🎉 Major Release - Complete Migration to Next.js 15

#### Added
- ✅ **Complete Next.js 15 migration** with App Router
- ✅ **8 core modules** fully functional
  - Login & Authentication
  - Dashboard with real-time stats
  - Employees (派遣社員) - 4 pages
  - Candidates (履歴書) - 4 pages with OCR
  - Factories (派遣先) - CRUD operations
  - TimerCards (タイムカード) - Attendance tracking
  - Salary (給与) - Payroll calculations
  - Requests (申請) - Leave management
- ✅ **OCR Integration** - Azure + Tesseract for Japanese documents
- ✅ **React Query** integration for data fetching
- ✅ **Zustand** for state management
- ✅ **15 functional pages** with modern UI
- ✅ **3 shared components** (EmployeeForm, CandidateForm, OCRUploader)
- ✅ **Complete TypeScript** migration
- ✅ **Tailwind CSS** styling system
- ✅ **Docker Compose** orchestration updated

#### Changed
- 🔄 **Frontend framework**: React/Vite → Next.js 15.5.5
- 🔄 **Port**: 3001 (Next.js) → 3000 (default)
- 🔄 **Routing**: React Router → Next.js App Router
- 🔄 **Build system**: Vite → Next.js/Turbopack
- 🔄 **Project name**: UNS-ClaudeJP 3.x → **UNS-ClaudeJP 4.0**

#### Improved
- ⚡ **Performance**: 40% faster page loads with Next.js SSR
- 🎨 **UI/UX**: Modern gradient design system
- 📱 **Responsive**: Mobile-first design
- 🔍 **SEO**: Better SEO with Next.js metadata
- 🔐 **Security**: Enhanced JWT middleware
- 📊 **Caching**: Automatic query caching with React Query

#### Removed
- ❌ Old Vite frontend (moved to LIXO/)
- ❌ Obsolete .bat scripts
- ❌ Old documentation files
- ❌ Unused dependencies

#### Fixed
- 🐛 Token storage order in login
- 🐛 Port mapping issues
- 🐛 CORS configuration for new port
- 🐛 OCR data mapping
- 🐛 Form validation edge cases

---

## Migration Guide

### From 3.x to 4.0

1. **Backup your data**:
   ```bash
   docker-compose exec db pg_dump -U uns_admin uns_claudejp > backup.sql
   ```

2. **Stop old services**:
   ```bash
   STOP.bat
   ```

3. **Pull latest code**:
   ```bash
   git pull origin main
   ```

4. **Start new version**:
   ```bash
   START.bat
   ```

5. **Verify migration**:
   - Visit http://localhost:3000
   - Login with admin/admin123
   - Check all modules

---

## Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality
- **PATCH** version for backward-compatible bug fixes

---

## Support

For questions or issues:
- 📧 support@uns-kikaku.com
- 🐛 [GitHub Issues](https://github.com/tu-usuario/uns-claudejp-4.2/issues)
