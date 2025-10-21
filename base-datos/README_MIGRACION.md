# 🔄 Actualización de Base de Datos - Campos Completo de Rirekisho

## Opciones de Ejecución

### 1. Script automatizado (Windows)

```batch
cd base-datos
APLICAR_MIGRACION.bat
```

### 2. Script Python (multiplataforma)

```bash
cd base-datos
python apply_migration.py
```

### 3. Docker manual (Linux/macOS/Windows)

```bash
cd base-datos
docker exec -i uns-claudejp-db psql -U ${POSTGRES_USER:-uns_admin} -d ${POSTGRES_DB:-uns_claudejp} < 07_add_complete_rirekisho_fields.sql
```

## Cambios aplicados

### Campos nuevos en `candidates`
- `applicant_id`
- `glasses`
- `lunch_preference`
- `ocr_notes`
- `major`
- `commute_time_oneway`

### Tablas relacionales nuevas
1. `family_members`
2. `work_experiences`
3. `scanned_documents`

### Vista
- `candidates_summary`

## Actualización de modelos Python (backend/app/models/models.py)

1. Añade los ENUMs `ScanDocumentType` y `OCRStatus`.
2. Extiende el modelo `Candidate` con los campos adicionales.
3. Define las relaciones `family_members`, `work_experiences`, `scanned_documents`.
4. Crea las clases `FamilyMember`, `WorkExperience`, `ScannedDocument`.

> Consulta `docs/reports/2025-01-CAMBIOS_CODIGO.md` para fragmentos de código listos para copiar.

## Reinicio del backend

```bash
# Desde la raíz del proyecto
docker compose restart backend
# Verificar logs
docker compose logs -f backend
```

## Verificación manual

```bash
docker exec -it uns-claudejp-db psql -U ${POSTGRES_USER:-uns_admin} -d ${POSTGRES_DB:-uns_claudejp}
```

Dentro de psql:

```sql
\dt
\d candidates
SELECT COUNT(*) FROM candidates;
SELECT COUNT(*) FROM family_members;
SELECT COUNT(*) FROM work_experiences;
SELECT COUNT(*) FROM scanned_documents;
SELECT * FROM candidates_summary LIMIT 3;
```

## Buenas prácticas

- Realiza un `pg_dump` antes de aplicar cambios en producción.
- Ejecuta `pytest backend/tests` para validar la API después de migrar.
- Documenta cualquier ajuste adicional en `docs/database/`.

---

**Última actualización:** 2025-02-10
