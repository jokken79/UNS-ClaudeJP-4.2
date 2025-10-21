# Análisis: Excel vs Base de Datos - employee_master.xlsm

**Fecha**: 2025-10-19
**Archivo Excel**: `frontend-nextjs/app/factories/employee_master.xlsm`
**Hoja Principal**: 派遣社員 (Empleados Dispatch)

---

## 📊 Resumen del Excel

### Hoja: 派遣社員
- **Total de filas**: 1,044 (incluye encabezado)
- **Total de empleados**: ~1,043
- **Total de columnas**: 42

---

## 🔍 Mapeo: Excel → Base de Datos

| # | Excel Column (日本語) | Excel Column (Romanji) | BD Column Actual | Tipo BD | ¿Existe? | Notas |
|---|----------------------|----------------------|------------------|---------|----------|-------|
| 1 | 現在 | Genzai | **FALTANTE** | String | ❌ | Status actual (退社/現在) - Mapear a `is_active` |
| 2 | 社員№ | Shain No | `hakenmoto_id` | Integer | ✅ | ID único del empleado |
| 3 | 派遣先ID | Hakensaki ID | `hakensaki_shain_id` | String(50) | ✅ | **IMPORTANTE**: ID que la fábrica asigna al empleado |
| 4 | 派遣先 | Hakensaki | `factory_id` + lookup | String | ✅ | Nombre de la fábrica (requiere lookup) |
| 5 | 配属先 | Haizoku-saki | `assignment_location` | String(200) | ✅ | Ubicación de asignación |
| 6 | 配属ライン | Haizoku Line | `assignment_line` | String(200) | ✅ | Línea de asignación |
| 7 | 仕事内容 | Shigoto Naiyo | `job_description` | Text | ✅ | Descripción del trabajo |
| 8 | 氏名 | Shimei | `full_name_kanji` | String(100) | ✅ | Nombre completo en kanji |
| 9 | カナ | Kana | `full_name_kana` | String(100) | ✅ | Nombre en katakana |
| 10 | 性別 | Seibetsu | `gender` | String(10) | ✅ | Género (男/女) |
| 11 | 国籍 | Kokuseki | `nationality` | String(50) | ✅ | Nacionalidad |
| 12 | 生年月日 | Seinengappi | `date_of_birth` | Date | ✅ | Fecha de nacimiento |
| 13 | 年齢 | Nenrei | **FALTANTE** | Integer | ❌ | Edad (calculada, no almacenar) |
| 14 | 時給 | Jikyu | `jikyu` | Integer | ✅ | Salario por hora |
| 15 | 時給改定 | Jikyu Kaitei | `jikyu_revision_date` | Date | ✅ | Fecha de revisión de salario |
| 16 | 請求単価 | Seikyu Tanka | `hourly_rate_charged` | Integer | ✅ | Tarifa facturada |
| 17 | 請求改定 | Seikyu Kaitei | `billing_revision_date` | Date | ✅ | Fecha de revisión de facturación |
| 18 | 差額利益 | Sagaku Rieki | `profit_difference` | Integer | ✅ | Diferencia de ganancia |
| 19 | 標準報酬 | Hyojun Hoshu | `standard_compensation` | Integer | ✅ | Compensación estándar |
| 20 | 健康保険 | Kenko Hoken | `health_insurance` | Integer | ✅ | Seguro de salud |
| 21 | 介護保険 | Kaigo Hoken | `nursing_insurance` | Integer | ✅ | Seguro de cuidado |
| 22 | 厚生年金 | Kosei Nenkin | `pension_insurance` | Integer | ✅ | Seguro de pensión |
| 23 | ビザ期限 | Biza Kigen | `zairyu_expire_date` | Date | ✅ | Fecha de expiración de visa |
| 24 | ｱﾗｰﾄ(ﾋﾞｻﾞ更新) | Alert (Visa Renewal) | **FALTANTE** | Boolean | ❌ | Alerta de renovación de visa |
| 25 | ビザ種類 | Biza Shurui | `visa_type` | String(50) | ✅ | Tipo de visa |
| 26 | 〒 | Yubin Bango | `postal_code` | String(10) | ✅ | Código postal |
| 27 | 住所 | Jusho | `address` | Text | ✅ | Dirección |
| 28 | ｱﾊﾟｰﾄ | Apartment | `apartment_id` | Integer FK | ✅ | ID del apartamento (FK) |
| 29 | 入居 | Nyukyo | `apartment_start_date` | Date | ✅ | Fecha de entrada al apartamento |
| 30 | 入社日 | Nyusha-bi | `hire_date` | Date | ✅ | Fecha de contratación |
| 31 | 退社日 | Taisha-bi | `termination_date` | Date | ✅ | Fecha de terminación |
| 32 | 退去 | Taikyo | `apartment_move_out_date` | Date | ✅ | Fecha de salida del apartamento |
| 33 | 社保加入 | Shaho Kanyu | `social_insurance_date` | Date | ✅ | Fecha de inscripción en seguro social |
| 34 | 入社依頼 | Nyusha Irai | `entry_request_date` | Date | ✅ | Fecha de solicitud de ingreso |
| 35 | 備考 | Biko | `notes` | Text | ✅ | Notas/comentarios |
| 36 | 現入社 | Gen Nyusha | `current_hire_date` | Date | ✅ | Fecha de entrada a fábrica actual |
| 37 | 免許種類 | Menkyo Shurui | `license_type` | String(100) | ✅ | Tipo de licencia |
| 38 | 免許期限 | Menkyo Kigen | `license_expire_date` | Date | ✅ | Fecha de expiración de licencia |
| 39 | 通勤方法 | Tsukin Hoho | `commute_method` | String(50) | ✅ | Método de transporte |
| 40 | 任意保険期限 | Nini Hoken Kigen | `optional_insurance_expire` | Date | ✅ | Fecha expiración seguro opcional |
| 41 | 日本語検定 | Nihongo Kentei | `japanese_level` | String(50) | ✅ | Nivel de japonés (JLPT) |
| 42 | キャリアアップ5年目 | Career Up 5 years | `career_up_5years` | Boolean | ✅ | Marca de 5 años de carrera |

---

## ❌ Columnas FALTANTES en la Base de Datos

### 1. **`現在` (Genzai) - Status Actual**
- **Tipo sugerido**: `VARCHAR(20)` o usar `is_active` boolean
- **Valores en Excel**: "退社" (renunció), "現在" (activo), vacío
- **Implementación**:
  - Opción A: Mapear a `is_active` boolean (退社=false, 現在/vacío=true)
  - Opción B: Nueva columna `current_status` VARCHAR(20)

### 2. **`年齢` (Nenrei) - Edad**
- **NO almacenar** - Calcular dinámicamente desde `date_of_birth`
- **Razón**: Dato derivado que cambia automáticamente

### 3. **`ｱﾗｰﾄ(ﾋﾞｻﾞ更新)` (Alert Visa Renewal)**
- **Tipo sugerido**: `BOOLEAN` o `VARCHAR(50)`
- **Propósito**: Alerta cuando la visa está próxima a vencer
- **Valores posibles**: Boolean o texto descriptivo
- **Implementación**: Nueva columna `visa_renewal_alert`

---

## ✅ Columnas EXISTENTES que están bien mapeadas

Total: **39 de 42** columnas del Excel tienen correspondencia en la BD

Las siguientes columnas están correctamente implementadas:
- Información personal (nombre, género, nacionalidad, fecha de nacimiento)
- Información de empleo (fecha de contratación, salario, asignación)
- Información financiera (facturación, seguros, pensión)
- Información de visa y documentos
- Información de apartamento
- Notas y fechas importantes

---

## 🔧 Columnas de BD NO presentes en Excel

Estas columnas existen en la BD pero NO en el Excel:

| BD Column | Tipo | Propósito |
|-----------|------|-----------|
| `id` | Integer PK | ID técnico autogenerado |
| `rirekisho_id` | String FK | Referencia al candidato original |
| `phone` | String | Teléfono (可能性: en otra hoja o no usado) |
| `email` | String | Email (可能性: en otra hoja o no usado) |
| `emergency_contact_name` | String | Contacto de emergencia |
| `emergency_contact_phone` | String | Teléfono de emergencia |
| `emergency_contact_relationship` | String | Relación con contacto |
| `zairyu_card_number` | String | Número de tarjeta de residencia |
| `position` | String | Posición/cargo |
| `contract_type` | String | Tipo de contrato |
| `photo_url` | String | URL de la foto |
| `apartment_rent` | Integer | Renta del apartamento |
| `yukyu_total` | Integer | Total de días de vacaciones |
| `yukyu_used` | Integer | Días de vacaciones usados |
| `yukyu_remaining` | Integer | Días de vacaciones restantes |
| `termination_reason` | Text | Razón de terminación |
| `created_at` | DateTime | Timestamp de creación |
| `updated_at` | DateTime | Timestamp de actualización |

**Conclusión**: Estas columnas son campos adicionales del sistema que NO vienen del Excel.

---

## 📝 ACLARACIÓN IMPORTANTE: 派遣先ID

### ⚠️ Confusión en Nomenclatura

**En el Excel, columna 3: `派遣先ID`**
- **NO es** el ID de la fábrica (factory_id)
- **SÍ es** el ID que **la fábrica asigna al empleado**
- **Mapeo correcto**: `hakensaki_shain_id` (ID del empleado en la fábrica cliente)

**Ejemplo**:
```
Empleado: 山田太郎 (Yamada Taro)
hakenmoto_id: 250101 (ID en UNS - Universal)
factory_id: "F001" (ID de la fábrica Toyota)
hakensaki_shain_id: "T-12345" (ID que Toyota asignó a Yamada)
```

### Regla de Importación

```python
# Si 派遣先ID está vacío en Excel:
if excel_row['派遣先ID'] is None or excel_row['派遣先ID'].strip() == '':
    hakensaki_shain_id = None  # Dejar NULL, se llenará manualmente
else:
    hakensaki_shain_id = excel_row['派遣先ID']
```

---

## 🎯 RECOMENDACIONES

### 1. Agregar Columnas Faltantes

**Opción A - Usar campos existentes** (RECOMENDADO):
```sql
-- Mapear 現在 a is_active
UPDATE employees SET is_active = false WHERE <condición de 退社>;
```

**Opción B - Agregar nuevas columnas**:
```sql
ALTER TABLE employees ADD COLUMN current_status VARCHAR(20);
ALTER TABLE employees ADD COLUMN visa_renewal_alert BOOLEAN DEFAULT false;
```

### 2. Validar Datos al Importar

- Validar que `hakenmoto_id` sea único
- Permitir `hakensaki_shain_id` NULL
- Validar fechas (hire_date < termination_date)
- Calcular `is_active` basado en `termination_date`

### 3. Lookup de Fábricas

La columna Excel #4 `派遣先` contiene el **nombre** de la fábrica.
Necesitamos hacer lookup a la tabla `factories` para obtener `factory_id`.

```python
factory_name = excel_row['派遣先']
factory = session.query(Factory).filter_by(name=factory_name).first()
if factory:
    factory_id = factory.factory_id
else:
    # Crear factory si no existe o marcar error
    factory_id = None
```

---

## 📋 Próximos Pasos

1. ✅ Análisis completado
2. ⏳ Generar 3 estructuras de BD propuestas
3. ⏳ Crear migración Alembic
4. ⏳ Generar script de importación
5. ⏳ Verificar compatibilidad con endpoints

---

**Documento creado**: 2025-10-19
**Por**: Claude AI Assistant
**Para**: UNS-ClaudeJP 4.0 - Análisis de Importación de Excel
