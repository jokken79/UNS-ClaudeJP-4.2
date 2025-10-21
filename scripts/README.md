# 🛠️ Scripts de Administración - UNS-ClaudeJP 4.2

Esta carpeta contiene scripts batch para Windows. Cada sección incluye comandos equivalentes para Linux/macOS.

---

## 🚀 Scripts Principales

### START.bat
**Iniciar el sistema completo (Windows)**

```batch
scripts\START.bat
```

**Equivalente Linux/macOS**

```bash
python generate_env.py
docker compose up -d
```

### STOP.bat
**Detener todos los servicios**

```batch
scripts\STOP.bat
```

**Equivalente Linux/macOS**

```bash
docker compose down
```

### LOGS.bat
**Ver logs de los servicios**

```batch
scripts\LOGS.bat
```

**Equivalente Linux/macOS**

```bash
docker compose logs -f <servicio>
```

---

## 🔧 Scripts de Mantenimiento

### REINSTALAR.bat
**Reinstalación completa del sistema (⚠️ borra datos)**

```batch
scripts\REINSTALAR.bat
```

**Equivalente Linux/macOS**

```bash
docker compose down -v
docker compose up --build -d
```

### CLEAN.bat
**Limpieza profunda del sistema (⚠️ borra datos y cachés)**

```batch
scripts\CLEAN.bat
```

**Equivalente Linux/macOS**

```bash
docker compose down -v
docker system prune -f
rm -rf backend/__pycache__ frontend-nextjs/.next logs/*
docker compose up --build -d
```

### LIMPIAR_CACHE.bat
**Limpiar caché de Docker (sin borrar volúmenes)**

```batch
scripts\LIMPIAR_CACHE.bat
```

**Equivalente Linux/macOS**

```bash
docker system prune -f
docker builder prune -f
```

### DIAGNOSTICO.bat
**Diagnóstico completo del sistema**

```batch
scripts\DIAGNOSTICO.bat
```

**Equivalente Linux/macOS**

```bash
docker compose ps
docker compose logs --tail 50
```

### INSTALAR.bat
**Instalación inicial del sistema**

```batch
scripts\INSTALAR.bat
```

**Equivalente Linux/macOS**

```bash
cp .env.example .env
python generate_env.py
docker compose build
```

---

## 🧪 Scripts relacionados con QA

| Acción | Windows | Linux/macOS |
|--------|---------|-------------|
| Ejecutar pruebas backend | `pytest backend\tests` | `pytest backend/tests` |
| Revisar healthcheck | `curl http://localhost:8000/api/health` | igual |

---

## 📚 Recursos adicionales

- [README.md](../README.md) para flujo completo
- [DOCS.md](../DOCS.md) índice general
- [docs/issues/AUTH_ERROR_401.md](../docs/issues/AUTH_ERROR_401.md) para entender errores 401

---

**Última actualización:** 2025-02-10
