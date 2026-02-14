# Post-Cutover Runbook (T+24h)

## Objetivo
Monitorear estabilidad después del corte a Supabase y detectar regresiones tempranas.

## Script de monitoreo
- Archivo: `post_cutover_monitor.js`
- Ejecución:

```bash
node post_cutover_monitor.js
```

## Frecuencia recomendada
- T+0 a T+2h: cada 15 minutos.
- T+2h a T+8h: cada 30 minutos.
- T+8h a T+24h: cada 60 minutos.

## Criterio PASS
- Todos los checks con status esperado (`200`).
- Latencia estable (sin degradación significativa sostenida).

## Criterio FAIL / Alerta
- 1 o más checks en error o status no esperado.
- Fallo de `auth_login`.
- Errores 5xx sostenidos en endpoints críticos.

## Acción inmediata ante FAIL
1. Reintentar el monitor en 3-5 minutos.
2. Revisar Render logs del servicio backend.
3. Revisar estado de Supabase (conectividad y políticas).
4. Si persiste >10 min en login o endpoints críticos, activar rollback criteria en `GO_LIVE_CUTOVER_CHECKLIST.md`.

## Evidencia operativa
Guardar por corrida:
- Timestamp
- Salida del monitor
- Incidentes detectados
- Acción tomada
