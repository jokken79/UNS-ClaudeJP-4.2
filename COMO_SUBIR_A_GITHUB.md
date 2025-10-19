# 🚀 CÓMO SUBIR A GITHUB - Guía Rápida

## ✅ Estado Actual

Tu código YA ESTÁ LISTO para subir a GitHub:
- ✅ Git inicializado
- ✅ Todos los archivos commiteados
- ✅ .gitignore protege archivos sensibles (.env)

## 📋 Pasos Rápidos (3 minutos)

### Opción 1: Usar el script automático (RECOMENDADO)

```batch
# Simplemente ejecuta:
GIT_SUBIR.bat
```

El script te guiará paso a paso. Solo necesitarás:
1. Confirmar que revocaste la Gemini API Key
2. Crear el repositorio en GitHub (el script te ayuda)
3. Pegar la URL del repositorio

### Opción 2: Comandos manuales

#### Paso 1: Crear repositorio en GitHub

1. Ve a: https://github.com/new
2. Configuración:
   - **Nombre**: `uns-claudejp-4.0` (o el que prefieras)
   - **Visibilidad**: ⚠️ **PRIVADO** (muy importante)
   - **NO marques**: "Add README", "Add .gitignore", "Choose a license"
3. Click "Create repository"
4. Copia la URL que aparece (ej: `https://github.com/TU-USUARIO/uns-claudejp-4.0.git`)

#### Paso 2: Conectar y subir

```batch
# Abre CMD en esta carpeta (D:\JPUNS-CLAUDE4.0)

# 1. Agregar el remote
git remote add origin https://github.com/TU-USUARIO/uns-claudejp-4.0.git

# 2. Renombrar rama a main (si es necesario)
git branch -M main

# 3. Subir todo
git push -u origin main
```

#### Paso 3: Verificar

1. Abre tu repositorio en GitHub
2. Verifica que:
   - ✅ El repositorio está marcado como **Private**
   - ✅ El archivo `.env` NO aparece (protegido por .gitignore)
   - ✅ Puedes ver todos tus archivos de código

## ⚠️ IMPORTANTE - Antes de Subir

### 1. Revocar Gemini API Key

**¿Por qué?** Hay una clave de Gemini expuesta en los archivos que puede estar visible en el historial de Git.

**Pasos**:
1. Ve a: https://aistudio.google.com/app/apikey
2. Busca la clave: `AIzaSyDL32fmwB7SdbL6yEV3GbSP9dYhHdG1JXw`
3. Click en "Delete" o "Revoke"
4. Genera una nueva clave
5. Actualiza `genkit-service/.env` con la nueva clave

### 2. Verificar .gitignore

El archivo `.gitignore` ya está configurado para proteger:
- ✅ `.env` (claves secretas)
- ✅ `.env.local` (configuración local)
- ✅ `genkit-service/.env` (Gemini API Key)
- ✅ `node_modules/` (dependencias)
- ✅ `postgres_data/` (datos de BD)
- ✅ Archivos temporales y logs

## 📁 ¿Qué se subirá?

### ✅ SÍ se sube:
- Código fuente (backend, frontend)
- Configuraciones de Docker
- Scripts .bat
- Documentación (.md)
- Archivos de ejemplo (`.env.example`)

### ❌ NO se sube:
- Archivos `.env` (protegidos)
- `node_modules/` (dependencias)
- `postgres_data/` (base de datos)
- Logs y archivos temporales
- Carpeta `LIXO/` (archivos obsoletos)

## 🔄 Próximos Pasos (después de subir)

### En esta PC:
```batch
# Cada vez que hagas cambios:
GIT_SUBIR.bat
```

### En otra PC:
```batch
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/uns-claudejp-4.0.git
cd uns-claudejp-4.0

# 2. Crear archivo .env (IMPORTANTE)
copy .env.example .env
notepad .env
# → Rellena con tus claves reales

# 3. Iniciar el sistema
START.bat
```

## 🛠️ Comandos Útiles Después de Subir

### Ver estado:
```batch
git status
```

### Ver historial:
```batch
git log --oneline -10
```

### Actualizar desde GitHub (en otra PC):
```batch
GIT_BAJAR.bat
```

### Subir cambios nuevos:
```batch
GIT_SUBIR.bat
```

## ❓ Preguntas Frecuentes

### ¿El archivo .env se sube?
**NO**. Está protegido por `.gitignore` intencionalmente para proteger tus claves secretas.

### ¿Qué hago si cambio de PC?
1. Clona el repositorio
2. Crea el `.env` desde `.env.example`
3. Rellena con tus claves

### ¿Puedo compartir el repositorio?
Solo si es **PRIVADO**. Nunca hagas el repositorio público porque contiene:
- Lógica de negocio propietaria
- Configuraciones de producción
- Historial que podría contener secretos

### ¿Qué pasa con las migraciones de base de datos?
Se suben junto con el código. Cuando clones en otra PC, ejecuta:
```batch
docker exec -it uns-claudejp-backend alembic upgrade head
```

### ¿Y la base de datos con los datos?
Los DATOS no se suben (solo el esquema/migraciones).
Para transferir datos entre PCs, usa:
```batch
# En PC origen:
docker exec -it uns-claudejp-db pg_dump -U uns_admin uns_claudejp > backup.sql

# En PC destino:
docker exec -i uns-claudejp-db psql -U uns_admin uns_claudejp < backup.sql
```

## 🔐 Checklist de Seguridad

Antes de hacer `git push`:

- [ ] ✅ Revoqué la Gemini API Key antigua
- [ ] ✅ Generé una nueva API Key
- [ ] ✅ Actualicé `genkit-service/.env` con la nueva
- [ ] ✅ Verifico que `.gitignore` existe
- [ ] ✅ El repositorio GitHub está marcado como PRIVADO
- [ ] ✅ Entiendo que `.env` NO se sube (es intencional)
- [ ] ✅ Tengo un backup local del archivo `.env` en lugar seguro

## 📞 Ayuda Adicional

- **Guía completa de Git**: `INSTRUCCIONES_GIT.md`
- **Seguridad**: `SEGURIDAD_GITHUB.md`
- **Problemas**: `TROUBLESHOOTING.md`

---

**TIP**: Si nunca usaste Git/GitHub, usa `GIT_SUBIR.bat` - te guiará paso a paso con confirmaciones de seguridad.

---

**Creado**: 2025-10-19
**Versión**: UNS-ClaudeJP 4.0
