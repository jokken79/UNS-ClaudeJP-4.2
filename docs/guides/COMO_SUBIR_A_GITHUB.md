# 🚀 Cómo Subir a GitHub - Guía Rápida 4.2

## ✅ Estado Actual

Tu código está listo para versionarse de forma segura:
- ✅ Git inicializado
- ✅ `.gitignore` protege `.env`, datos y dependencias
- ✅ Scripts auxiliares para automatizar tareas

## 📋 Pasos Rápidos (3 minutos)

### Opción 1: Script automático (Windows)

```batch
GIT_SUBIR.bat
```

El script solicita:
1. Confirmación de que revocaste claves sensibles antiguas.
2. URL del repositorio remoto.
3. Mensaje de commit.

### Opción 2: Comandos manuales multiplataforma

1. Crea el repositorio en GitHub (`https://github.com/new`).
2. Configura como **privado** y sin archivos adicionales.
3. Conecta y sube:

```bash
git remote add origin https://github.com/TU-USUARIO/uns-claudejp-4.2.git
git branch -M main
git push -u origin main
```

## ⚠️ Antes de subir

1. **Revoca claves expuestas** (ej. Gemini API). Genera nuevas y actualiza `.env` locales.
2. **Verifica `.gitignore`** para asegurarte de que `.env`, `uploads/`, `logs/` y `postgres_data/` estén excluidos.
3. **Confirma privacidad**: mantén el repositorio como privado si contiene datos reales.

## 📁 ¿Qué se sube?

| Sí | No |
|----|----|
| Código fuente (backend/frontend) | `.env` |
| Configuración Docker y scripts | `node_modules/`, `postgres_data/` |
| Documentación | Logs temporales |

## 🔄 Trabajo diario

| Acción | Comando |
|--------|---------|
| Ver estado | `git status` |
| Añadir cambios | `git add .` |
| Commit | `git commit -m "feat: descripción"` |
| Subir | `git push` |
| Actualizar local | `git pull` |

En Windows puedes usar `GIT_SUBIR.bat` y `GIT_BAJAR.bat`; en Linux/macOS ejecuta los comandos anteriores.

## 🔐 Checklist de seguridad

- [ ] Revocaste claves antiguas (Gemini, Azure, etc.).
- [ ] `.env` contiene nuevas credenciales y no se versiona.
- [ ] El repositorio remoto es privado.
- [ ] No compartiste capturas con datos sensibles.

## 📦 Clonado en otra máquina

```bash
git clone https://github.com/TU-USUARIO/uns-claudejp-4.2.git
cd UNS-ClaudeJP-4.2
cp .env.example .env
python generate_env.py
docker compose up -d
```

## 📞 Ayuda

- [docs/guides/INSTRUCCIONES_GIT.md](INSTRUCCIONES_GIT.md)
- [docs/guides/SEGURIDAD_GITHUB.md](SEGURIDAD_GITHUB.md)
- Issues privados en GitHub o correo `support@uns-kikaku.com`

---

**Última actualización:** 2025-02-10
