# 📚 INSTRUCCIONES - Scripts de Git para GitHub

## 🚀 Archivos Creados

He creado 2 archivos `.bat` para facilitar el uso de Git con GitHub:

1. **GIT_SUBIR.bat** - Sube tu código a GitHub de forma segura
2. **GIT_BAJAR.bat** - Descarga cambios desde GitHub

---

## 📤 1. GIT_SUBIR.bat - Subir a GitHub

### ¿Qué hace?

Este script:
1. ✅ Verifica que `.gitignore` existe (protege tus claves)
2. ⚠️ Te pregunta si revocaste la Gemini API Key
3. ✅ Inicializa Git (si no existe)
4. ✅ Muestra qué archivos se subirán
5. ✅ Crea un commit con tus cambios
6. ✅ Sube todo a GitHub de forma segura

### Cómo usar:

```batch
# Simplemente ejecuta:
GIT_SUBIR.bat
```

### Primera vez - Pasos:

1. **Antes de ejecutar**:
   - ⚠️ **REVOCA** tu Gemini API Key antigua
   - Ve a: https://aistudio.google.com/app/apikey
   - Elimina: `AIzaSyDL32fmwB7SdbL6yEV3GbSP9dYhHdG1JXw`
   - Genera una nueva
   - Actualiza `genkit-service/.env`

2. **Ejecuta el script**:
   ```batch
   GIT_SUBIR.bat
   ```

3. **El script te preguntará**:
   - ¿Revocaste la API key? → Responde `S`
   - ¿Los archivos se ven correctos? → Revisa y responde `S`
   - Mensaje del commit → Escribe algo o presiona Enter
   - URL del repositorio → Pega la URL de GitHub

4. **Crear repositorio en GitHub** (primera vez):
   - El script te ofrecerá abrir https://github.com/new
   - Crea el repositorio con:
     - Nombre: `uns-claudejp-4.0` (o el que prefieras)
     - ⚠️ **Visibilidad: PRIVADO** (muy importante)
     - NO marques "Add README"
     - Copia la URL (ej: `https://github.com/usuario/uns-claudejp-4.0.git`)

5. **Pega la URL** cuando el script la pida

6. **¡Listo!** Tu código está en GitHub

### Usos posteriores:

```batch
# Cada vez que quieras subir cambios:
GIT_SUBIR.bat

# El script:
# - Detectará los cambios
# - Pedirá mensaje de commit
# - Subirá a GitHub automáticamente
```

---

## 📥 2. GIT_BAJAR.bat - Bajar de GitHub

### ¿Qué hace?

Este script:
1. ✅ Verifica que Git está instalado
2. ✅ Comprueba si tienes cambios locales sin guardar
3. ✅ Descarga cambios desde GitHub
4. ✅ Aplica los cambios a tu código local
5. ✅ Te recuerda crear el archivo `.env` (si no existe)
6. ✅ Opcionalmente reinicia Docker con los nuevos cambios

### Cómo usar:

```batch
# Simplemente ejecuta:
GIT_BAJAR.bat
```

### Casos de uso:

#### Caso 1: Clonar proyecto por primera vez

```batch
# 1. Crea una carpeta nueva
mkdir C:\Proyectos\UNS-ClaudeJP
cd C:\Proyectos\UNS-ClaudeJP

# 2. Clona el repositorio
git clone https://github.com/TU-USUARIO/uns-claudejp-4.0.git .

# 3. Crea el archivo .env
copy .env.example .env

# 4. Edita .env con tus claves reales
notepad .env

# 5. Inicia el sistema
START.bat
```

#### Caso 2: Actualizar código existente

```batch
# Si ya tienes el proyecto localmente:
GIT_BAJAR.bat

# El script:
# 1. Detectará cambios locales (si los hay)
# 2. Te preguntará qué hacer con ellos
# 3. Descargará cambios de GitHub
# 4. Aplicará los cambios
```

### Opciones si tienes cambios locales:

El script te dará 4 opciones:

1. **Commitear cambios** (recomendado)
   - Guarda tus cambios locales
   - Luego descarga de GitHub
   - Puede haber conflictos que resolver

2. **Descartar cambios** (⚠️ CUIDADO)
   - BORRA tus cambios locales
   - Deja todo como está en GitHub
   - Usa solo si estás seguro

3. **Hacer stash** (guardar temporalmente)
   - Guarda cambios en una pila temporal
   - Descarga de GitHub
   - Puedes recuperar después con: `git stash pop`

4. **Cancelar**
   - No hace nada
   - Sales del script

---

## 🔄 Flujo de Trabajo Típico

### Trabajando solo:

```batch
# 1. Haces cambios en el código
# (editas archivos, agregas features, etc.)

# 2. Cuando termines, subes a GitHub
GIT_SUBIR.bat

# 3. En otra PC, bajas los cambios
GIT_BAJAR.bat
```

### Trabajando en equipo:

```batch
# 1. Antes de empezar a trabajar:
GIT_BAJAR.bat   # Descarga cambios de tus compañeros

# 2. Haces tus cambios localmente
# (editas código)

# 3. Cuando termines:
GIT_SUBIR.bat   # Sube tus cambios para el equipo
```

---

## ⚠️ IMPORTANTE - Archivo .env

### El archivo `.env` NO se sube a GitHub

Esto es **intencional** para proteger tus claves secretas.

**Consecuencia**: Cada PC necesita su propio `.env`

### Solución:

**En cada PC donde trabajes:**

```batch
# 1. Clona o actualiza el repositorio
git clone URL_DEL_REPO
# o
GIT_BAJAR.bat

# 2. Copia el ejemplo
copy .env.example .env

# 3. Edita con tus claves REALES
notepad .env

# Rellena:
# - POSTGRES_PASSWORD
# - SECRET_KEY
# - GEMINI_API_KEY
# - Otras API keys
```

### Compartir claves con tu equipo:

⚠️ **NUNCA** por Git o email

✅ **SÍ** por:
- Gestor de contraseñas (1Password, LastPass, Bitwarden)
- Servicios seguros (AWS Secrets Manager, Azure Key Vault)
- Chat cifrado (Signal, WhatsApp) - solo si es necesario

---

## 🛠️ Solución de Problemas

### Error: "Git no está instalado"

```batch
# Descarga Git desde:
https://git-scm.com/download/win

# Instala y reinicia el script
```

### Error: "No tienes permisos"

```batch
# Opción 1: Usa GitHub CLI
gh auth login

# Opción 2: Usa token de acceso personal
# 1. Ve a: https://github.com/settings/tokens
# 2. Genera nuevo token (classic)
# 3. Marca: repo (full control)
# 4. Usa el token como contraseña cuando Git lo pida
```

### Error: "Conflictos al hacer pull"

```batch
# 1. Verifica qué archivos tienen conflicto
git status

# 2. Edita cada archivo manualmente
# Busca las líneas con <<<<<<< HEAD

# 3. Decide qué código mantener

# 4. Elimina las marcas de conflicto

# 5. Guarda y commitea
git add .
git commit -m "Resolved conflicts"
```

### Error: ".env no existe después de bajar"

```batch
# Esto es NORMAL
# El .env NUNCA se sube a GitHub

# Solución:
copy .env.example .env
notepad .env
# Rellena con tus claves
```

---

## 📋 Comandos Git Útiles

### Ver estado:
```batch
git status
```

### Ver historial:
```batch
git log --oneline -10
```

### Ver cambios:
```batch
git diff
```

### Deshacer último commit (sin perder cambios):
```batch
git reset --soft HEAD~1
```

### Ver ramas:
```batch
git branch -a
```

### Cambiar de rama:
```batch
git checkout nombre-rama
```

---

## 🎯 Resumen Rápido

| Acción | Comando |
|--------|---------|
| **Subir cambios** | `GIT_SUBIR.bat` |
| **Bajar cambios** | `GIT_BAJAR.bat` |
| **Ver estado** | `git status` |
| **Iniciar sistema** | `START.bat` |
| **Detener sistema** | `STOP.bat` |
| **Ver logs** | `LOGS.bat` |

---

## 🔐 Checklist de Seguridad

Antes de usar GIT_SUBIR.bat por primera vez:

- [ ] ✅ Revocaste la Gemini API Key antigua
- [ ] ✅ Generaste una nueva API Key
- [ ] ✅ Actualizaste `genkit-service/.env` con la nueva
- [ ] ✅ Verificaste que `.gitignore` existe
- [ ] ✅ El repositorio GitHub está marcado como PRIVADO
- [ ] ✅ Entiendes que `.env` NO se sube a GitHub

---

## 📞 Ayuda

Si tienes problemas:

1. Lee `SEGURIDAD_GITHUB.md` para más detalles
2. Lee `TROUBLESHOOTING.md` para problemas comunes
3. Ejecuta `DIAGNOSTICO.bat` para verificar el sistema

---

**Creado**: 2025-10-19
**Versión**: UNS-ClaudeJP 4.0
**Por**: Claude AI Assistant
