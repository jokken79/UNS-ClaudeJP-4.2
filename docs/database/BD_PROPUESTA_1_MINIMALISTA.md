# Propuesta BD #1: Enfoque Minimalista

**Estrategia**: Agregar SOLO 1 columna nueva, mapear el resto a campos existentes

---

## Cambios Propuestos

### Tabla: `employees`

**Nueva columna**:
```sql
ALTER TABLE employees
ADD COLUMN visa_renewal_alert BOOLEAN DEFAULT FALSE;
```

**Mapeo de datos Excel**:
- `現在` (Status) → Mapear a `is_active` durante importación
- `年齢` (Edad) → No almacenar, calcular con función
- `派遣先ID` → Ya existe como `hakensaki_shain_id`
- `派遣先` → Lookup a `factories.name` → `factory_id`
- `ｱﾗｰﾄ(ﾋﾞｻﾞ更新)` → **NUEVA**: `visa_renewal_alert`

---

## Ventajas
✅ Mínimo cambio en BD
✅ Usa campos existentes
✅ Sin migración compleja

## Desventajas
⚠️ Pierde información de status original del Excel ("退社"/"現在")
⚠️ No almacena edad (debe calcularse)
