#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar automáticamente el archivo .env si no existe
Util para configuracion inicial en nuevas instalaciones
"""

import os
import sys
import secrets
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def generate_env_file():
    """Genera el archivo .env con credenciales seguras si no existe"""
    
    env_file = Path('.env')
    env_example = Path('.env.example')
    
    # Si ya existe .env, no hacer nada
    if env_file.exists():
        print("[OK] El archivo .env ya existe. No se realizaron cambios.")
        return
    
    print("[INFO] Generando archivo .env con credenciales seguras...")
    
    # Generar credenciales seguras
    postgres_password = secrets.token_urlsafe(32)
    secret_key = secrets.token_urlsafe(64)
    
    # Contenido del .env
    env_content = f"""# ===========================================
# UNS-ClaudeJP 4.2 - Environment Variables
# ===========================================
# IMPORTANTE: Este archivo contiene credenciales sensibles
# NUNCA commitees este archivo al repositorio
# Generado automaticamente por generate_env.py

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
POSTGRES_DB=uns_claudejp
POSTGRES_USER=uns_admin
POSTGRES_PASSWORD={postgres_password}
DATABASE_URL=postgresql://uns_admin:{postgres_password}@db:5432/uns_claudejp

# ===========================================
# SECURITY
# ===========================================
SECRET_KEY={secret_key}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# ===========================================
# APPLICATION
# ===========================================
APP_NAME=UNS-ClaudeJP 4.2
APP_VERSION=4.2.0
ENVIRONMENT=development
DEBUG=true
FRONTEND_URL=http://localhost:3000

# ===========================================
# FILE UPLOAD
# ===========================================
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE=10485760

# ===========================================
# OCR SERVICES
# ===========================================
OCR_ENABLED=true
TESSERACT_LANG=jpn+eng

# Azure Computer Vision API (OPCIONAL - dejar vacio si no tienes cuenta)
AZURE_COMPUTER_VISION_ENDPOINT=
AZURE_COMPUTER_VISION_KEY=
AZURE_COMPUTER_VISION_API_VERSION=2023-02-01-preview

# Gemini API (OPCIONAL - dejar vacio si no tienes cuenta)
GEMINI_API_KEY=

# Google Cloud Vision API (OPCIONAL - dejar vacio si no tienes cuenta)
GOOGLE_CLOUD_VISION_ENABLED=false
GOOGLE_CLOUD_VISION_API_KEY=

# ===========================================
# NOTIFICATIONS (OPCIONAL)
# ===========================================
LINE_NOTIFY_TOKEN=
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@uns-kikaku.com

# ===========================================
# LOGGING
# ===========================================
LOG_LEVEL=INFO
LOG_FILE=/app/logs/uns-claudejp.log

# ===========================================
# COMPANY INFO
# ===========================================
COMPANY_NAME=UNS-Kikaku
COMPANY_WEBSITE=https://www.uns-kikaku.com
"""
    
    # Escribir el archivo
    env_file.write_text(env_content, encoding='utf-8')
    
    print("[OK] Archivo .env generado exitosamente!")
    print(f"   - POSTGRES_PASSWORD: {postgres_password[:10]}...")
    print(f"   - SECRET_KEY: {secret_key[:10]}...")
    print("\n[IMPORTANTE] Guarda estas credenciales en un lugar seguro")
    print("   El usuario por defecto es: admin / admin123")

if __name__ == "__main__":
    try:
        generate_env_file()
    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)
