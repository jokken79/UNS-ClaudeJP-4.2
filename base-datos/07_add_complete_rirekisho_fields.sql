-- ============================================
-- MIGRACIÓN: Agregar campos completos del Rirekisho HTML
-- Archivo: 07_add_complete_rirekisho_fields.sql
-- Fecha: 2024-10-19
-- Descripción: Agrega TODOS los campos del formulario HTML de rirekisho
--              sin conflictos con campos existentes
-- ============================================

-- Logging
DO $$ 
BEGIN 
    RAISE NOTICE '========================================';
    RAISE NOTICE 'INICIANDO MIGRACIÓN 07: Campos Completos Rirekisho';
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- AGREGAR CAMPOS FALTANTES A CANDIDATES
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE 'Agregando campos de información adicional...';

    -- Campos de salud y preferencias (del HTML)
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS glasses VARCHAR(100);  -- 眼（メガネ、コンタクト使用）
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS lunch_preference VARCHAR(50);  -- お弁当（社内食堂）
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS commute_time_oneway INTEGER;  -- 通勤片道時間 (minutos)
    
    -- Campo de especialidad/carrera
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS major VARCHAR(200);  -- 専攻/専門
    
    -- Notas de OCR
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS ocr_notes TEXT;  -- Notas del procesamiento OCR
    
    -- Agregar campo applicant_id si no existe (equivalente a rirekisho_id)
    ALTER TABLE candidates ADD COLUMN IF NOT EXISTS applicant_id VARCHAR(50);
    
    RAISE NOTICE '✓ Campos adicionales agregados';
    
EXCEPTION WHEN duplicate_column THEN
    RAISE NOTICE '  (Algunos campos ya existían, continuando...)';
END $$;

-- ============================================
-- CREAR TABLA DE MIEMBROS DE FAMILIA (si no existe)
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE 'Creando tabla family_members...';
END $$;

CREATE TABLE IF NOT EXISTS family_members (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL,
    member_name VARCHAR(100),  -- 氏名
    relationship VARCHAR(50),  -- 続柄 (relación: padre, madre, hijo, etc.)
    age INTEGER,  -- 年齢
    is_spouse BOOLEAN DEFAULT FALSE,  -- 配偶者
    residence_type VARCHAR(50),  -- 居住/別居 (vive junto o separado)
    separate_address TEXT,  -- 別居住所 (dirección si vive separado)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_candidate_family 
        FOREIGN KEY (candidate_id) 
        REFERENCES candidates(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT chk_age CHECK (age >= 0 AND age <= 150)
);

CREATE INDEX IF NOT EXISTS idx_family_candidate_id ON family_members(candidate_id);

DO $$ 
BEGIN 
    RAISE NOTICE '✓ Tabla family_members verificada/creada';
END $$;

-- ============================================
-- CREAR TABLA DE EXPERIENCIAS LABORALES (si no existe)
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE 'Creando tabla work_experiences...';
END $$;

CREATE TABLE IF NOT EXISTS work_experiences (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL,
    experience_description TEXT,  -- 経験作業内容 (descripción del trabajo)
    company_name VARCHAR(200),
    position VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    skills TEXT,  -- Habilidades específicas
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_candidate_experience 
        FOREIGN KEY (candidate_id) 
        REFERENCES candidates(id) 
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_experiences_candidate_id ON work_experiences(candidate_id);

DO $$ 
BEGIN 
    RAISE NOTICE '✓ Tabla work_experiences verificada/creada';
END $$;

-- ============================================
-- CREAR TABLA DE DOCUMENTOS ESCANEADOS (si no existe)
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE 'Creando tabla scanned_documents...';
END $$;

-- Crear tipo ENUM para scanned_documents si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scan_document_type') THEN
        CREATE TYPE scan_document_type AS ENUM (
            'residence_card', 
            'license', 
            'passport', 
            'photo', 
            'rirekisho',
            'other'
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ocr_status_type') THEN
        CREATE TYPE ocr_status_type AS ENUM (
            'pending', 
            'processing', 
            'completed', 
            'failed'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS scanned_documents (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL,
    document_type scan_document_type NOT NULL,
    document_url TEXT,
    file_name VARCHAR(255),
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ocr_status ocr_status_type DEFAULT 'pending',
    ocr_data JSONB,  -- Datos extraídos del OCR
    confidence_score NUMERIC(5, 2),  -- Score de confianza del OCR (0-100)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_candidate_documents 
        FOREIGN KEY (candidate_id) 
        REFERENCES candidates(id) 
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_documents_candidate_id ON scanned_documents(candidate_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON scanned_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_ocr_status ON scanned_documents(ocr_status);

DO $$ 
BEGIN 
    RAISE NOTICE '✓ Tabla scanned_documents verificada/creada';
END $$;

-- ============================================
-- CREAR/ACTUALIZAR ÍNDICES
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE 'Creando índices adicionales...';
END $$;

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_candidates_applicant_id ON candidates(applicant_id);
CREATE INDEX IF NOT EXISTS idx_candidates_nationality ON candidates(nationality);
CREATE INDEX IF NOT EXISTS idx_candidates_residence_status ON candidates(residence_status);
CREATE INDEX IF NOT EXISTS idx_candidates_hire_date ON candidates(hire_date);
CREATE INDEX IF NOT EXISTS idx_candidates_reception_date ON candidates(reception_date);

DO $$ 
BEGIN 
    RAISE NOTICE '✓ Índices creados';
END $$;

-- ============================================
-- FUNCIÓN PARA MIGRAR DATOS DE FAMILIA EXISTENTES
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE 'Creando función de migración de familia...';
END $$;

CREATE OR REPLACE FUNCTION migrate_family_data()
RETURNS void AS $BODY$
DECLARE
    candidate_record RECORD;
BEGIN
    -- Migrar miembros de familia desde campos individuales a tabla relacional
    FOR candidate_record IN 
        SELECT id, 
               family_name_1, family_relation_1, family_age_1, family_residence_1,
               family_name_2, family_relation_2, family_age_2, family_residence_2
        FROM candidates
        WHERE family_name_1 IS NOT NULL OR family_name_2 IS NOT NULL
    LOOP
        -- Insertar familia miembro 1
        IF candidate_record.family_name_1 IS NOT NULL THEN
            INSERT INTO family_members (
                candidate_id, member_name, relationship, age, residence_type
            )
            VALUES (
                candidate_record.id,
                candidate_record.family_name_1,
                candidate_record.family_relation_1,
                candidate_record.family_age_1,
                candidate_record.family_residence_1
            )
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Insertar familia miembro 2
        IF candidate_record.family_name_2 IS NOT NULL THEN
            INSERT INTO family_members (
                candidate_id, member_name, relationship, age, residence_type
            )
            VALUES (
                candidate_record.id,
                candidate_record.family_name_2,
                candidate_record.family_relation_2,
                candidate_record.family_age_2,
                candidate_record.family_residence_2
            )
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
    
    RAISE NOTICE '✓ Datos de familia migrados';
END;
$BODY$ LANGUAGE plpgsql;

-- Ejecutar la migración
SELECT migrate_family_data();

DO $$ 
BEGIN 
    RAISE NOTICE '✓ Función de migración creada y ejecutada';
END $$;

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR APPLICANT_ID
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE 'Creando función para actualizar applicant_id...';
END $$;

CREATE OR REPLACE FUNCTION sync_applicant_id()
RETURNS void AS $BODY$
BEGIN
    -- Sincronizar applicant_id con rirekisho_id si está vacío
    UPDATE candidates 
    SET applicant_id = rirekisho_id 
    WHERE applicant_id IS NULL AND rirekisho_id IS NOT NULL;
    
    RAISE NOTICE '✓ applicant_id sincronizado con rirekisho_id';
END;
$BODY$ LANGUAGE plpgsql;

-- Ejecutar sincronización
SELECT sync_applicant_id();

-- ============================================
-- TRIGGER PARA ACTUALIZAR updated_at en scanned_documents
-- ============================================

CREATE OR REPLACE FUNCTION update_scanned_documents_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_scanned_documents_timestamp ON scanned_documents;

CREATE TRIGGER trigger_update_scanned_documents_timestamp
BEFORE UPDATE ON scanned_documents
FOR EACH ROW
EXECUTE FUNCTION update_scanned_documents_timestamp();

DO $$ 
BEGIN 
    RAISE NOTICE '✓ Trigger de actualización creado';
END $$;

-- ============================================
-- VISTA RESUMEN DE CANDIDATOS
-- ============================================

DO $$ 
BEGIN 
    RAISE NOTICE 'Creando vista candidates_summary...';
END $$;

CREATE OR REPLACE VIEW candidates_summary AS
SELECT 
    c.id,
    c.rirekisho_id,
    c.applicant_id,
    c.full_name_kanji,
    c.full_name_kana,
    c.date_of_birth,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.date_of_birth))::INTEGER as age,
    c.gender,
    c.nationality,
    c.mobile,
    c.current_address,
    c.residence_status,
    c.residence_expiry,
    c.hire_date,
    c.reception_date,
    COUNT(DISTINCT fm.id) as family_members_count,
    COUNT(DISTINCT we.id) as work_experiences_count,
    COUNT(DISTINCT sd.id) as scanned_documents_count,
    c.created_at,
    c.updated_at
FROM candidates c
LEFT JOIN family_members fm ON c.id = fm.candidate_id
LEFT JOIN work_experiences we ON c.id = we.candidate_id
LEFT JOIN scanned_documents sd ON c.id = sd.candidate_id
GROUP BY c.id;

DO $$ 
BEGIN 
    RAISE NOTICE '✓ Vista candidates_summary creada';
END $$;

-- ============================================
-- COMENTARIOS EN NUEVAS COLUMNAS
-- ============================================

COMMENT ON COLUMN candidates.glasses IS '眼（メガネ、コンタクト使用）- Uso de lentes o contactos';
COMMENT ON COLUMN candidates.lunch_preference IS 'お弁当（社内食堂）- Preferencia de almuerzo';
COMMENT ON COLUMN candidates.commute_time_oneway IS '通勤片道時間 - Tiempo de viaje al trabajo en minutos (solo ida)';
COMMENT ON COLUMN candidates.major IS '専攻/専門 - Especialidad o carrera';
COMMENT ON COLUMN candidates.ocr_notes IS 'Notas del procesamiento OCR de documentos';
COMMENT ON COLUMN candidates.applicant_id IS 'ID del solicitante (sincronizado con rirekisho_id)';

COMMENT ON TABLE family_members IS '家族構成 - Miembros de familia de cada candidato';
COMMENT ON TABLE work_experiences IS '経験作業内容 - Experiencias laborales de los candidatos';
COMMENT ON TABLE scanned_documents IS 'Documentos escaneados y procesados con OCR';

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

DO $$ 
DECLARE
    table_count INTEGER;
    column_count INTEGER;
BEGIN 
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICACIÓN FINAL';
    RAISE NOTICE '========================================';
    
    -- Contar tablas
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('candidates', 'family_members', 'work_experiences', 'scanned_documents');
    
    RAISE NOTICE 'Tablas verificadas: %', table_count;
    
    -- Contar columnas en candidates
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns 
    WHERE table_name = 'candidates';
    
    RAISE NOTICE 'Columnas en candidates: %', column_count;
    
    RAISE NOTICE '';
    RAISE NOTICE '✓ MIGRACIÓN COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '========================================';
END $$;
