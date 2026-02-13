# CI/CD Checklist - Migración SpeedPro Supabase

## Pipeline recomendado

### Stage 1 - Lint/Build
- Backend lint + smoke boot
- Frontend build Angular production

### Stage 2 - DB Validation (pre-deploy)
- Ejecutar `node validate_phase_c_counts.js`
- Validar diffs = 0 para tablas críticas

### Stage 3 - Security Validation
- Ejecutar `node validate_phase_d_security.js`
- Confirmar RLS habilitado + policies existentes

### Stage 4 - Auth Validation
- Ejecutar `node validate_phase_e_auth.js`
- Confirmar enlaces `usuarios.supabase_id`

### Stage 5 - API Smoke
- Probar endpoints críticos:
  - /api/roles
  - /api/taller
  - /api/sucursales
  - /api/clientes
  - /api/vehiculos
  - /api/cotizaciones
  - /api/recepciones

## Gate de aprobación
Deploy solo si:
- Conteos críticos alineados
- RLS activo en tablas sensibles
- Sin errores 5xx en smoke tests
- Login funcional

## Artefactos
- Reporte de conteos
- Reporte de seguridad RLS
- Reporte de auth link
- Logs de smoke tests
