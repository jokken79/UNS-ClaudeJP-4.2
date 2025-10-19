#!/usr/bin/env python3
"""
Script Simple de Migración
Aplica la migración 07 automáticamente
"""

import os
import subprocess
import sys

def main():
    print("\n" + "="*60)
    print("  APLICANDO MIGRACIÓN DE BASE DE DATOS")
    print("="*60 + "\n")
    
    # Verificar que existe el archivo SQL
    sql_file = "07_add_complete_rirekisho_fields.sql"
    if not os.path.exists(sql_file):
        print(f"❌ ERROR: No se encuentra {sql_file}")
        print("   Ejecuta este script desde D:\\JPUNS-CLAUDE4.0\\base-datos")
        sys.exit(1)
    
    print(f"✓ Archivo encontrado: {sql_file}")
    
    # Ejecutar migración con Docker
    print("\n🔄 Aplicando migración...\n")
    
    cmd = [
        "docker", "exec", "-i", "uns-claudejp-db",
        "psql", "-U", "postgres", "-d", "uns_claude_jp"
    ]
    
    try:
        with open(sql_file, 'r', encoding='utf-8') as f:
            result = subprocess.run(
                cmd,
                stdin=f,
                capture_output=True,
                text=True
            )
        
        if result.returncode == 0:
            print("✅ MIGRACIÓN APLICADA EXITOSAMENTE\n")
            print(result.stdout)
            
            # Verificar
            print("\n🔍 Verificando tablas...\n")
            verify_cmd = [
                "docker", "exec", "-it", "uns-claudejp-db",
                "psql", "-U", "postgres", "-d", "uns_claude_jp",
                "-c", "\\dt"
            ]
            subprocess.run(verify_cmd)
            
            print("\n" + "="*60)
            print("  ✅ COMPLETADO")
            print("="*60)
            print("\nSiguientes pasos:")
            print("1. Actualizar modelos Python (ver README_MIGRACION.md)")
            print("2. Reiniciar backend: docker-compose restart backend")
            print("3. Verificar: http://localhost:8000/docs\n")
            
        else:
            print("❌ ERROR al aplicar migración:")
            print(result.stderr)
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
