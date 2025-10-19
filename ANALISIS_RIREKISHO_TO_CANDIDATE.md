# Análisis: Cambio de "rirekisho" a "candidate"

## 📊 Resumen Ejecutivo

**Objetivo**: Eliminar conflictos y confusión causados por el uso mixto de términos japoneses ("rirekisho") e ingleses ("candidate") en toda la aplicación.

**Alcance**: 24 archivos afectados
- 9 archivos de base de datos (SQL/scripts)
- 8 archivos de backend (Python)
- 3 archivos de frontend (TypeScript/React)
- 4 archivos de documentación

---

## 🔍 Análisis Detallado

### 1. BASE DE DATOS (SQL)

#### Tablas afectadas:

**`candidates` table** (tabla principal):
- ✅ `rirekisho_id` - ID único del candidato (履歴書ID)
  - **MANTENER** - Es el identificador de negocio, no debe cambiarse
  - Usado como FOREIGN KEY en 3 tablas: `employees`, `contract_workers`, `staff`

**Relaciones existentes**:
```sql
-- employees table
rirekisho_id VARCHAR(20) REFERENCES candidates(rirekisho_id)

-- contract_workers table
rirekisho_id VARCHAR(20) REFERENCES candidates(rirekisho_id)

-- staff table
rirekisho_id VARCHAR(20) REFERENCES candidates(rirekisho_id)
```

#### ⚠️ IMPORTANTE:
- `rirekisho_id` es un **ID de negocio** (ej: "250101", "250102")
- NO es la clave primaria técnica (`id` autoincremental)
- Representa el número de履歴書 (hoja de vida) en el sistema japonés
- **DECISIÓN**: MANTENER `rirekisho_id` en la base de datos

---

### 2. BACKEND (Python)

#### A. Modelos (`backend/app/models/models.py`)

**Enum `DocumentType`**:
```python
class DocumentType(str, Enum):
    RIREKISHO = "rirekisho"  # ← MANTENER (es el tipo de documento)
```
- **MANTENER** - Es el tipo literal de documento OCR

**Modelo `Candidate`**:
```python
class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True)
    rirekisho_id = Column(String(20), unique=True, nullable=False)  # ← MANTENER
    # ... 200+ campos
```
- **MANTENER** - Sincronizado con BD

**Modelo `Employee`**:
```python
class Employee(Base):
    rirekisho_id = Column(String(20), ForeignKey("candidates.rirekisho_id"))  # ← MANTENER
```
- **MANTENER** - Foreign key necesaria

**Modelos `ContractWorker` y `Staff`**:
```python
rirekisho_id = Column(String(20), ForeignKey("candidates.rirekisho_id"))  # ← MANTENER
```
- **MANTENER** - Foreign keys necesarias

#### B. Schemas Pydantic (`backend/app/schemas/`)

**`candidate.py`**:
```python
class CandidateBase(BaseModel):
    """Base candidate schema with all rirekisho fields"""  # ← CAMBIAR comentario
    # ...

class CandidateCreate(CandidateBase):
    """Create candidate from rirekisho"""  # ← CAMBIAR comentario

class CandidateResponse(CandidateBase):
    """Candidate response with all rirekisho fields"""  # ← CAMBIAR comentario
    rirekisho_id: str  # ← MANTENER campo
```

**ACCIÓN**: Actualizar solo comentarios, MANTENER campos

**`employee.py`**:
```python
class EmployeeBase(BaseModel):
    rirekisho_id: str  # ← MANTENER

class EmployeeCreate(BaseModel):
    rirekisho_id: Optional[str]  # ← MANTENER
```

**ACCIÓN**: MANTENER

#### C. Servicios OCR (`backend/app/services/`)

**`hybrid_ocr_service.py`**:
```python
def process_rirekisho(image_path: str) -> Dict[str, Any]:  # ← CAMBIAR a process_candidate_document()
    """Process 履歴書 (rirekisho) document"""  # ← CAMBIAR comentario
```

**ACCIÓN**: Renombrar función y actualizar comentarios

**`azure_ocr_service.py`**, **`easyocr_service.py`**:
- Similar al anterior
- **ACCIÓN**: Renombrar funciones específicas de rirekisho

#### D. API Endpoints (`backend/app/api/`)

**`azure_ocr.py`**:
```python
if document_type == "rirekisho":  # ← MANTENER (es el tipo de documento)
    result = process_rirekisho(...)
```

**ACCIÓN**: Actualizar nombres de funciones llamadas

**`candidates.py`**, **`employees.py`**:
- Usan `rirekisho_id` como parámetro
- **ACCIÓN**: MANTENER (sincronizado con BD)

---

### 3. FRONTEND (TypeScript/React)

#### A. Tipos TypeScript

**`frontend-nextjs/app/candidates/page.tsx`**:
```typescript
interface Candidate {
  id: number;
  rirekisho_id?: string;  // ← MANTENER (viene del backend)
  // ...
}
```

**ACCIÓN**: MANTENER (sincronizado con API)

#### B. Componentes

**`frontend-nextjs/components/OCRUploader.tsx`**:
```typescript
const [documentType, setDocumentType] = useState<string>('rirekisho');  // ← MANTENER (tipo de documento)

<option value="rirekisho">履歴書 (Rirekisho)</option>  // ← MANTENER (UI en japonés)
```

**ACCIÓN**: MANTENER (es el nombre del tipo de documento para el usuario)

#### C. Visualización

**`frontend-nextjs/app/candidates/[id]/page.tsx`**:
```typescript
<p>ID: {candidate.rirekisho_id || candidate.id}</p>  // ← MANTENER
```

**ACCIÓN**: Puede mejorarse el label UI, pero mantener el campo

---

## 📋 PLAN DE CAMBIOS

### ✅ QUÉ MANTENER (NO CAMBIAR):

1. **Base de datos**:
   - ✅ Columna `rirekisho_id` en todas las tablas
   - ✅ Foreign keys `rirekisho_id`
   - ✅ Índices relacionados

2. **Backend - Campos de datos**:
   - ✅ `rirekisho_id` en todos los modelos y schemas
   - ✅ Enum `DocumentType.RIREKISHO`
   - ✅ Valor literal `"rirekisho"` en OCR

3. **Frontend - Datos**:
   - ✅ Campo `rirekisho_id` en interfaces TypeScript
   - ✅ Valor `'rirekisho'` para tipo de documento OCR
   - ✅ Display de `rirekisho_id` en UI

### 🔄 QUÉ CAMBIAR:

#### 1. Comentarios y Documentación (24 cambios)

**Backend - Schemas**:
```python
# ANTES:
"""Base candidate schema with all rirekisho fields"""

# DESPUÉS:
"""Base candidate schema with all candidate fields"""
```

```python
# ANTES:
"""Create candidate from rirekisho"""

# DESPUÉS:
"""Create candidate from candidate data"""
```

#### 2. Nombres de Funciones (6 cambios)

**`backend/app/services/hybrid_ocr_service.py`**:
```python
# ANTES:
def process_rirekisho(image_path: str) -> Dict[str, Any]:

# DESPUÉS:
def process_candidate_document(image_path: str) -> Dict[str, Any]:
```

**`backend/app/services/azure_ocr_service.py`**:
```python
# ANTES:
def extract_rirekisho_data(ocr_result: Dict) -> Dict:

# DESPUÉS:
def extract_candidate_data(ocr_result: Dict) -> Dict:
```

**`backend/app/services/easyocr_service.py`**:
```python
# ANTES:
def process_rirekisho_easyocr(image_path: str) -> Dict:

# DESPUÉS:
def process_candidate_document_easyocr(image_path: str) -> Dict:
```

#### 3. Llamadas a Funciones Renombradas

**`backend/app/api/azure_ocr.py`**:
```python
# Actualizar todas las llamadas a las funciones renombradas
```

#### 4. Labels UI (Opcional - Mejora)

**`frontend-nextjs/app/candidates/page.tsx`**:
```typescript
// ANTES:
{candidate.rirekisho_id || `ID-${candidate.id}`}

// DESPUÉS (opcional):
{candidate.rirekisho_id || `CAND-${candidate.id}`}
```

---

## 🎯 RECOMENDACIÓN FINAL

### Enfoque Conservador (RECOMENDADO):

**Solo cambiar comentarios y nombres de funciones internas**

**Ventajas**:
- ✅ Sin cambios en base de datos (0 riesgo de pérdida de datos)
- ✅ Sin cambios en API contracts (compatibilidad total)
- ✅ Código más legible en inglés
- ✅ Mantiene semántica de negocio (`rirekisho_id` sigue siendo el ID de履歴書)

**Desventajas**:
- ⚠️ Mezcla de términos persiste en algunos lugares

### Enfoque Agresivo (NO RECOMENDADO):

**Renombrar `rirekisho_id` a `candidate_id` en TODO el sistema**

**Ventajas**:
- ✅ Consistencia total en inglés

**Desventajas**:
- ❌ Requiere migración de base de datos (ALTER TABLE en 4 tablas)
- ❌ Rompe compatibilidad con datos existentes
- ❌ Requiere actualizar 50+ referencias
- ❌ Alto riesgo de bugs
- ❌ Pierde semántica de negocio (el ID representa un 履歴書 específico)

---

## ✅ DECISIÓN RECOMENDADA

**MANTENER `rirekisho_id` como nombre de campo** por las siguientes razones:

1. **Semántica de negocio**: El ID representa un número de 履歴書 (hoja de vida japonesa), no solo un "candidate ID"
2. **Estabilidad**: Evita migraciones riesgosas de base de datos
3. **Compatibilidad**: No rompe código existente ni datos
4. **Documentación**: Los comentarios pueden aclarar el significado

**CAMBIAR solo**:
- ✅ Comentarios de documentación
- ✅ Nombres de funciones internas de procesamiento OCR
- ✅ Labels UI donde sea confuso para usuarios

---

## 📝 PRÓXIMOS PASOS

¿Deseas que proceda con el **Enfoque Conservador** (solo comentarios y funciones)?

O prefieres discutir otra estrategia?

---

**Documento creado**: 2025-10-19
**Por**: Claude AI Assistant
**Para**: UNS-ClaudeJP 4.0 - Refactorización de Nomenclatura
