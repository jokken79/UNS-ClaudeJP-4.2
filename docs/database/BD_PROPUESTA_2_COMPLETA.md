# Propuesta BD #2: Enfoque Completo

**Estrategia**: Agregar TODAS las columnas faltantes para preservar información original del Excel

---

## Cambios Propuestos

### Tabla: `employees`

**Nuevas columnas**:
```sql
ALTER TABLE employees
ADD COLUMN current_status VARCHAR(20),           -- 現在 (退社/現在/etc.)
ADD COLUMN calculated_age INTEGER,               -- 年齢 (opcional, puede ser columna calculada)
ADD COLUMN visa_renewal_alert BOOLEAN DEFAULT FALSE,  -- ｱﾗｰﾄ(ﾋﾞｻﾞ更新)
ADD COLUMN excel_import_date TIMESTAMP,          -- Fecha de importación
ADD COLUMN excel_row_number INTEGER;             -- Número de fila original del Excel
```

**Índices sugeridos**:
```sql
CREATE INDEX idx_employees_current_status ON employees(current_status);
CREATE INDEX idx_employees_visa_alert ON employees(visa_renewal_alert) WHERE visa_renewal_alert = TRUE;
```

---

## Mapeo Completo Excel → BD

| Excel | BD Column | Tipo | Notas |
|-------|-----------|------|-------|
| 現在 | `current_status` | VARCHAR(20) | "退社", "現在", etc. |
| 年齢 | `calculated_age` | INTEGER | Opcional, mejor calcular |
| ｱﾗｰﾄ | `visa_renewal_alert` | BOOLEAN | Alerta de renovación |

---

## Ventajas
✅ Preserva TODA la información del Excel
✅ Permite auditoría completa
✅ Rastreo de cambios

## Desventajas
⚠️ Más columnas = más complejidad
⚠️ Redundancia (edad calculada vs almacenada)
