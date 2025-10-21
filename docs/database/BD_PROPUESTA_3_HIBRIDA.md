# Propuesta BD #3: Enfoque Híbrido (RECOMENDADO)

**Estrategia**: Balance entre minimalismo y completitud - Agregar solo campos útiles

---

## Cambios Propuestos

### Tabla: `employees`

**Nuevas columnas**:
```sql
ALTER TABLE employees
ADD COLUMN current_status VARCHAR(20) DEFAULT 'active',  -- 現在: "active", "terminated", "suspended"
ADD COLUMN visa_renewal_alert BOOLEAN DEFAULT FALSE,      -- ｱﾗｰﾄ(ﾋﾞｻﾞ更新)
ADD COLUMN visa_alert_days INTEGER DEFAULT 30;            -- Días antes de alerta
```

**Trigger para sincronizar `current_status` con `is_active`**:
```sql
CREATE OR REPLACE FUNCTION sync_employee_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se marca como terminated, actualizar is_active
    IF NEW.current_status = 'terminated' AND NEW.termination_date IS NOT NULL THEN
        NEW.is_active = FALSE;
    END IF;

    -- Si se marca como active, asegurar que is_active sea TRUE
    IF NEW.current_status = 'active' THEN
        NEW.is_active = TRUE;
        NEW.termination_date = NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employee_status_sync
    BEFORE INSERT OR UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION sync_employee_status();
```

**Trigger para alerta de visa**:
```sql
CREATE OR REPLACE FUNCTION check_visa_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar alerta si la visa expira en los próximos N días
    IF NEW.zairyu_expire_date IS NOT NULL THEN
        IF NEW.zairyu_expire_date - CURRENT_DATE <= NEW.visa_alert_days THEN
            NEW.visa_renewal_alert = TRUE;
        ELSE
            NEW.visa_renewal_alert = FALSE;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER visa_expiration_check
    BEFORE INSERT OR UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION check_visa_expiration();
```

---

## Mapeo Excel → BD

| Excel Column | BD Column | Lógica |
|--------------|-----------|--------|
| 現在 (Genzai) | `current_status` + `is_active` | "退社" → "terminated" + FALSE<br>"現在" → "active" + TRUE |
| 年齢 (Nenrei) | *Calculado* | `EXTRACT(YEAR FROM AGE(date_of_birth))` |
| ｱﾗｰﾄ(ﾋﾞｻﾞ更新) | `visa_renewal_alert` | Auto-calculado por trigger |

---

## Vista SQL Útil

```sql
CREATE VIEW vw_employees_with_age AS
SELECT
    e.*,
    EXTRACT(YEAR FROM AGE(e.date_of_birth)) AS calculated_age,
    CASE
        WHEN e.zairyu_expire_date - CURRENT_DATE <= e.visa_alert_days THEN TRUE
        ELSE FALSE
    END AS visa_expiring_soon,
    e.zairyu_expire_date - CURRENT_DATE AS days_until_visa_expiration,
    f.name AS factory_name
FROM employees e
LEFT JOIN factories f ON e.factory_id = f.factory_id;
```

---

## Ventajas
✅ Balance entre simplicidad y funcionalidad
✅ Triggers automatizan lógica de negocio
✅ Mantiene integridad de datos
✅ Permite búsquedas por status
✅ Alerta de visa automática

## Desventajas
⚠️ Requiere triggers (más complejidad en BD)
⚠️ Necesita testing de triggers

---

## Migración de Datos Excel

```python
def map_excel_status(excel_value):
    """Mapear valor de Excel a BD"""
    status_mapping = {
        '退社': 'terminated',
        '現在': 'active',
        '': 'active',
        None: 'active'
    }
    return status_mapping.get(excel_value, 'active')

# Durante importación:
employee.current_status = map_excel_status(excel_row['現在'])
employee.is_active = (employee.current_status == 'active')
if employee.current_status == 'terminated' and excel_row['退社日']:
    employee.termination_date = excel_row['退社日']
```

---

## Recomendación Final

**✅ USAR PROPUESTA #3 - HÍBRIDA** porque:

1. Mantiene semántica de negocio (status explícito)
2. Automatiza cálculos (edad, alerta de visa)
3. No duplica datos innecesariamente
4. Permite auditoría y filtrado por status
5. Compatible con sistema existente

