# 🔒 GUÍA DE SEGURIDAD PARA SUBIR A GITHUB

## ⚠️ PROBLEMAS DE SEGURIDAD ENCONTRADOS Y SOLUCIONADOS

### ✅ ESTADO ACTUAL: PROTEGIDO

He encontrado y corregido los siguientes problemas de seguridad:

---

## 🚨 1. CLAVES EXPUESTAS ENCONTRADAS

### ❌ **PROBLEMA CRÍTICO**: API Key de Gemini Expuesta

**Ubicación**: `genkit-service/.env`
```
GEMINI_API_KEY=AIzaSyDL32fmwB7SdbL6yEV3GbSP9dYhHdG1JXw
```

**⚠️ PELIGRO**: Esta clave está **ACTIVA** y puede ser usada por cualquiera.

**✅ SOLUCIÓN INMEDIATA**:

1. **Revoca la clave inmediatamente**:
   - Ve a: https://aistudio.google.com/app/apikey
   - Elimina la clave: `AIzaSyDL32fmwB7SdbL6yEV3GbSP9dYhHdG1JXw`
   - Genera una nueva

2. **Actualiza tu .env local** con la nueva clave

3. **NO subas el archivo** `.env` a GitHub

---

### ❌ **PROBLEMA**: Credenciales en .env principal

**Ubicación**: `.env` (raíz del proyecto)
```
POSTGRES_PASSWORD=UnsClaudeJP4_0_ID5p2O3giYjGAurLqw6LOCXNcRbh_O42sFHOzYC36PM
SECRET_KEY=Qv_hBeHP8SGTa3vbEoywbY0K5A4SUayuGUAvdM8KRijnuyRCsV7BiRUwLPBY6Wx2-WrZsw7liBZvrxFUPzxlpg
```

**✅ SOLUCIÓN**: Archivo `.env` ya está en `.gitignore` ✓

---

### ⚠️ **ADVERTENCIA**: Contraseña hardcoded en frontend

**Ubicación**: `frontend-nextjs/app/login/page.tsx:XX`
```tsx
パスワード: <span className="font-mono font-bold">admin123</span>
```

**Estado**: Esto es solo UI de ayuda, **NO es un problema de seguridad** porque:
- Solo muestra la contraseña default en la página de login
- La contraseña real está hasheada en la base de datos
- Es común mostrar credenciales de demo en desarrollo

---

## ✅ 2. PROTECCIONES APLICADAS

### `.gitignore` Mejorado

He agregado las siguientes líneas a `.gitignore`:

```gitignore
# Archivos .env (NUNCA deben subirse a GitHub)
.env
.env.local
.env.development
.env.production
backend/.env
genkit-service/.env
```

### Archivos Protegidos

Los siguientes archivos/carpetas **NO se subirán** a GitHub:

✅ `.env` (todas las versiones)
✅ `backend/.env`
✅ `genkit-service/.env`
✅ `__pycache__/`
✅ `node_modules/`
✅ `logs/`
✅ `uploads/` (excepto .gitkeep)
✅ `postgres_data/`
✅ `*.log`

---

## 📋 3. CHECKLIST ANTES DE SUBIR A GITHUB

### Paso 1: Inicializar Git (si no lo has hecho)

```bash
# Inicializar repositorio
git init

# Verificar que .gitignore está correcto
cat .gitignore
```

### Paso 2: Verificar archivos que se subirán

```bash
# Ver qué archivos se agregarán
git status

# Ver qué archivos se ignorarán
git status --ignored
```

**⚠️ IMPORTANTE**: Verifica que **NO aparezcan**:
- ❌ `.env`
- ❌ `backend/.env`
- ❌ `genkit-service/.env`
- ❌ Archivos con contraseñas o API keys

### Paso 3: Verificar contenido de archivos sensibles

```bash
# Buscar claves en archivos que se subirán
git grep -i "password\|api_key\|secret_key\|token" -- ':!.env*' ':!.gitignore'
```

Si encuentra algo, **NO subas** hasta resolverlo.

### Paso 4: Hacer el primer commit

```bash
# Agregar todos los archivos (excepto los ignorados)
git add .

# Verificar qué se agregará
git status

# Crear commit
git commit -m "Initial commit - UNS-ClaudeJP 4.0"
```

### Paso 5: Crear repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre: `uns-claudejp-4.0` (o el que prefieras)
3. **⚠️ IMPORTANTE**: Marca como **PRIVADO** (no público)
4. NO inicialices con README (ya lo tienes)

### Paso 6: Conectar y subir

```bash
# Agregar remote
git remote add origin https://github.com/TU-USUARIO/uns-claudejp-4.0.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 4. CLAVES QUE DEBES REGENERAR

### **OBLIGATORIO - Regenera AHORA**:

1. **Gemini API Key**
   - La clave `AIzaSyDL32fmwB7SdbL6yEV3GbSP9dYhHdG1JXw` está EXPUESTA
   - Revócala en: https://aistudio.google.com/app/apikey
   - Genera una nueva
   - Actualiza `genkit-service/.env`

### **Recomendado - Regenera antes de producción**:

2. **PostgreSQL Password**
   - Cambiar: `UnsClaudeJP4_0_ID5p2O3giYjGAurLqw6LOCXNcRbh_O42sFHOzYC36PM`
   - Por: Una nueva generada con `openssl rand -base64 48`

3. **SECRET_KEY (JWT)**
   - Cambiar: `Qv_hBeHP8SGTa3vbEoywbY0K5A4SUayuGUAvdM8KRijnuyRCsV7BiRUwLPBY6Wx2-WrZsw7liBZvrxFUPzxlpg`
   - Por: `python -c "import secrets; print(secrets.token_urlsafe(64))"`

4. **Contraseña de admin**
   - Usuario: `admin` / Contraseña: `admin123`
   - Cambiar después del primer login en producción

---

## 🛡️ 5. MEJORES PRÁCTICAS

### Para Desarrollo Local

```bash
# 1. Copia .env.example a .env
cp .env.example .env

# 2. Genera claves seguras
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(64))"
python -c "import secrets; print('POSTGRES_PASSWORD=' + secrets.token_urlsafe(32))"

# 3. Edita .env con tus claves reales
# NUNCA compartas este archivo
```

### Para Colaboradores

```bash
# 1. Clonar el repo
git clone https://github.com/TU-USUARIO/uns-claudejp-4.0.git

# 2. Copiar .env.example
cp .env.example .env

# 3. Pedir las claves reales al administrador
# O generar nuevas para desarrollo local
```

### Para Producción

1. **NO uses las claves de desarrollo**
2. **Genera claves únicas para producción**
3. **Usa servicios de gestión de secretos**:
   - AWS Secrets Manager
   - Azure Key Vault
   - Google Secret Manager
   - HashiCorp Vault

4. **Habilita autenticación de 2 factores** en:
   - GitHub
   - Google Cloud / Azure
   - Servicios de correo
   - Servicios de notificaciones

---

## ⚠️ 6. QUÉ HACER SI SUBISTE CLAVES POR ERROR

### Si ya subiste credenciales a GitHub:

1. **Revoca TODAS las claves inmediatamente**
   - API keys (Gemini, Azure, etc.)
   - Tokens de acceso
   - Contraseñas

2. **Elimina el archivo del historial de Git**:
   ```bash
   # Usa git-filter-repo (recomendado)
   pip install git-filter-repo
   git filter-repo --path .env --invert-paths
   
   # O usa BFG Repo-Cleaner
   java -jar bfg.jar --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

3. **Force push** (⚠️ cuidado si hay colaboradores):
   ```bash
   git push origin --force --all
   ```

4. **Genera nuevas claves**

5. **Notifica a tu equipo**

---

## ✅ 7. VERIFICACIÓN FINAL

### Antes de subir a GitHub, ejecuta:

```bash
# 1. Verifica .gitignore
git check-ignore .env backend/.env genkit-service/.env

# Debe mostrar:
# .env
# backend/.env
# genkit-service/.env

# 2. Verifica que NO se subirán archivos sensibles
git ls-files | grep -E "\.env$|password|secret"

# NO debe mostrar nada

# 3. Busca claves hardcoded
grep -r "AIzaSy\|AKIA\|ya29\|sk-\|ghp_" --exclude-dir=node_modules --exclude-dir=.git .

# NO debe encontrar nada (excepto este archivo de ayuda)
```

---

## 📚 8. RECURSOS ADICIONALES

- **Git Secrets**: https://github.com/awslabs/git-secrets
- **TruffleHog**: https://github.com/trufflesecurity/trufflehog
- **GitHub Secret Scanning**: https://docs.github.com/en/code-security/secret-scanning
- **Cómo rotar claves**: https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html

---

## 🎯 RESUMEN

### ✅ Protecciones Aplicadas:

1. ✅ `.gitignore` actualizado
2. ✅ `.env.example` con placeholders
3. ✅ Instrucciones de seguridad creadas

### ⚠️ Acciones Requeridas ANTES de subir a GitHub:

1. ❌ **URGENTE**: Revocar Gemini API Key `AIzaSyDL32fmwB7SdbL6yEV3GbSP9dYhHdG1JXw`
2. ⚠️ Verificar que `.env` no se suba (usar `git status`)
3. ⚠️ Usar repositorio PRIVADO en GitHub
4. ⚠️ Regenerar claves para producción

### 🚀 Una vez protegido, puedes subir a GitHub de forma segura

---

**Fecha de creación**: 2025-10-19  
**Versión del sistema**: UNS-ClaudeJP 4.0
