# 🔄 ACTUALIZACIÓN DE BASE DE DATOS - Campos Completos de Rirekisho

## 🚀 INSTALACIÓN RÁPIDA (3 OPCIONES)

### ⚡ Opción 1: Script BAT (Windows - MÁS FÁCIL)

1. Abrir carpeta: `D:\JPUNS-CLAUDE4.0\base-datos`
2. **Doble click** en: `APLICAR_MIGRACION.bat`
3. ¡Listo!

### 🐍 Opción 2: Script Python

```bash
cd D:\JPUNS-CLAUDE4.0\base-datos
python apply_migration.py
```

### 🐳 Opción 3: Docker Manual

```bash
cd D:\JPUNS-CLAUDE4.0\base-datos
docker exec -i uns-claudejp-db psql -U postgres -d uns_claude_jp < 07_add_complete_rirekisho_fields.sql
```

---

## ✅ QUÉ SE AGREGA A TU BASE DE DATOS

### 📝 6 Campos Nuevos en `candidates`:
- `applicant_id` - ID del solicitante
- `glasses` - Uso de lentes (眼)
- `lunch_preference` - Preferencia de almuerzo (お弁当)
- `major` - Especialidad/Carrera (専攻)
- `ocr_notes` - Notas de OCR
- `commute_time_oneway` - Tiempo de viaje

### 🆕 3 Tablas Relacionales Nuevas:
1. **`family_members`** - Miembros de familia (ilimitados)
2. **`work_experiences`** - Experiencias laborales (ilimitadas)
3. **`scanned_documents`** - Documentos escaneados con tracking OCR

### 📊 1 Vista Nueva:
- **`candidates_summary`** - Vista resumen con conteos

---

## 📝 PASO 2: ACTUALIZAR MODELOS PYTHON

Después de aplicar la migración SQL, debes actualizar los modelos Python.

### Abrir archivo:
```
D:\JPUNS-CLAUDE4.0\backend\app\models\models.py
```

### 1️⃣ Agregar ENUMs (línea ~70, con los demás ENUMs):

```python
class ScanDocumentType(str, enum.Enum):
    RESIDENCE_CARD = "residence_card"
    LICENSE = "license"
    PASSPORT = "passport"
    PHOTO = "photo"
    RIREKISHO = "rirekisho"
    OTHER = "other"

class OCRStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
```

### 2️⃣ Agregar campos en modelo Candidate (antes de `status`):

```python
    # Campos adicionales del HTML de rirekisho
    applicant_id = Column(String(50), index=True)
    glasses = Column(String(100))
    lunch_preference = Column(String(50))
    ocr_notes = Column(Text)
```

### 3️⃣ Agregar relationships en modelo Candidate (al final de la clase):

```python
    # Relationships adicionales
    family_members = relationship("FamilyMember", back_populates="candidate", cascade="all, delete-orphan")
    work_experiences = relationship("WorkExperience", back_populates="candidate", cascade="all, delete-orphan")
    scanned_documents = relationship("ScannedDocument", back_populates="candidate", cascade="all, delete-orphan")
```

### 4️⃣ Agregar 3 nuevos modelos (al final del archivo):

```python
class FamilyMember(Base):
    """家族構成 - Miembros de familia del candidato"""
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    
    member_name = Column(String(100))
    relationship = Column(String(50))
    age = Column(Integer)
    is_spouse = Column(Boolean, default=False)
    residence_type = Column(String(50))
    separate_address = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    candidate = relationship("Candidate", back_populates="family_members")


class WorkExperience(Base):
    """経験作業内容 - Experiencias laborales del candidato"""
    __tablename__ = "work_experiences"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    
    experience_description = Column(Text)
    company_name = Column(String(200))
    position = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)
    skills = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    candidate = relationship("Candidate", back_populates="work_experiences")


class ScannedDocument(Base):
    """Documentos escaneados con OCR"""
    __tablename__ = "scanned_documents"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    
    document_type = Column(SQLEnum(ScanDocumentType, name='scan_document_type'), nullable=False)
    document_url = Column(Text)
    file_name = Column(String(255))
    
    scan_date = Column(DateTime(timezone=True), server_default=func.now())
    ocr_status = Column(SQLEnum(OCRStatus, name='ocr_status_type'), default=OCRStatus.PENDING)
    ocr_data = Column(JSON)
    confidence_score = Column(Numeric(5, 2))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    candidate = relationship("Candidate", back_populates="scanned_documents")
```

---

## 🔄 PASO 3: REINICIAR BACKEND

```bash
cd D:\JPUNS-CLAUDE4.0
docker-compose restart backend

# Ver logs para verificar
docker-compose logs -f backend
```

---

## ✅ PASO 4: VERIFICAR

### Verificar API:
Abrir en navegador: **http://localhost:8000/docs**

### Verificar Base de Datos:

```bash
docker exec -it uns-claudejp-db psql -U postgres -d uns_claude_jp
```

Dentro de PostgreSQL:
```sql
-- Ver tablas
\dt

-- Ver estructura de candidates
\d candidates

-- Contar registros
SELECT COUNT(*) FROM candidates;
SELECT COUNT(*) FROM family_members;
SELECT COUNT(*) FROM work_experiences;
SELECT COUNT(*) FROM scanned_documents;

-- Ver vista resumen
SELECT * FROM candidates_summary LIMIT 3;

-- Salir
\q
```

---

## 📊 MAPEO COMPLETO: HTML → BASE DE DATOS

| Campo HTML | Campo BD | Tabla |
|------------|----------|-------|
| name_kanji | full_name_kanji | candidates |
| name_furigana | full_name_kana | candidates |
| birthday | date_of_birth | candidates |
| gender | gender | candidates |
| nationality | nationality | candidates |
| postal_code | postal_code | candidates |
| address | current_address | candidates |
| mobile | mobile | candidates |
| phone | phone | candidates |
| visa_type | residence_status | candidates |
| visa_expiry | residence_expiry | candidates |
| residence_card_no | residence_card_number | candidates |
| passport_no | passport_number | candidates |
| passport_expiry | passport_expiry | candidates |
| license_no | license_number | candidates |
| license_expiry | license_expiry | candidates |
| car_owner | car_ownership | candidates |
| insurance | voluntary_insurance | candidates |
| **major** | **major** | **candidates** ✨ |
| **glasses** | **glasses** | **candidates** ✨ |
| **lunch_pref** | **lunch_preference** | **candidates** ✨ |
| **commute_time** | **commute_time_oneway** | **candidates** ✨ |
| **ocr_note** | **ocr_notes** | **candidates** ✨ |
| **familia[]** | → | **family_members** ✨ |
| **experiencias[]** | → | **work_experiences** ✨ |
| **documentos[]** | → | **scanned_documents** ✨ |

✨ = **NUEVO** en esta migración

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "relation already exists"
✅ **Solución:** La migración ya fue aplicada. No hay problema, puedes continuar.

### ❌ Error: "Docker not running"
```bash
# 1. Iniciar Docker Desktop
# 2. Luego ejecutar:
cd D:\JPUNS-CLAUDE4.0
docker-compose up -d
```

### ❌ Error: "Container not found"
```bash
cd D:\JPUNS-CLAUDE4.0
docker-compose up -d
```

### ❌ Error en modelos Python
```bash
# Ver logs del backend
docker-compose logs backend

# Verificar sintaxis
python -m py_compile backend/app/models/models.py
```

---

## 🎯 VENTAJAS DE ESTA ACTUALIZACIÓN

### ✅ Sin Conflictos
- No sobrescribe datos existentes
- No modifica estructura actual
- Solo agrega campos y tablas nuevas

### ✅ Mejor Diseño
- Familia en tabla relacional (ilimitados miembros)
- Experiencias en tabla relacional (ilimitadas)
- Soporta múltiples documentos por candidato

### ✅ Funcionalidad OCR
- Tracking de estado de procesamiento
- Almacenamiento de datos extraídos
- Score de confianza

### ✅ Migración Automática
- Datos de familia existentes se copian automáticamente
- applicant_id se sincroniza con rirekisho_id
- Sin pérdida de información

---

## 📞 ARCHIVOS CREADOS

En `D:\JPUNS-CLAUDE4.0\base-datos\`:
- ✅ `07_add_complete_rirekisho_fields.sql` - Migración SQL
- ✅ `APLICAR_MIGRACION.bat` - Script Windows
- ✅ `apply_migration.py` - Script Python
- ✅ `README_MIGRACION.md` - Este archivo

---

## 🎉 RESULTADO FINAL

Después de completar todos los pasos, tu sistema tendrá:

✅ **Todos los campos** del formulario HTML de rirekisho
✅ **Tablas relacionales** para familia y experiencias
✅ **Sistema de documentos** con tracking OCR
✅ **Vista resumen** para reportes
✅ **Sin pérdida** de información existente
✅ **Sin conflictos** con código actual

**¡Tu aplicación está lista para procesar rirekishos completos! 🚀**

---

**Versión:** 1.0.0  
**Fecha:** 2024-10-19  
**Proyecto:** JPUNS-CLAUDE 4.0
