# SpeedPro Supabase Go-Live / Cutover Checklist

## 1) Pre-Cutover (T-24h to T-1h)
- [ ] Render service `apiSpeed` configurado con:
  - [ ] Root Directory: `apiSpeed`
  - [ ] Build Command: `pnpm install --frozen-lockfile`
  - [ ] Start Command: `node src/index.js`
- [ ] Variables en Render cargadas y validadas:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_KEY` (o `SUPABASE_SERVICE_ROLE_KEY`)
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
- [ ] Frontend productivo apuntando a backend productivo.
- [ ] Backup reciente disponible (MariaDB y/o export lógico Supabase).
- [ ] Equipo informado de ventana de corte y plan de rollback.

## 2) Data Integrity Gate
- [ ] Conteos críticos alineados (origen/destino):
  - [ ] `clientes`
  - [ ] `vehiculos`
  - [ ] `cotizaciones`
  - [ ] `recepciones`
- [ ] Validación sin huérfanos críticos de FK.
- [ ] Muestreo funcional de registros históricos (consulta puntual por id).

## 3) Security Gate (Supabase)
- [ ] RLS activo en tablas sensibles:
  - [ ] `clientes`
  - [ ] `vehiculos`
  - [ ] `cotizaciones`
  - [ ] `recepciones`
  - [ ] `usuarios`
- [ ] Policies por rol verificadas (`admin`, `gerente`, `tecnico`).
- [ ] Pruebas de acceso cruzado (rol con permiso / rol sin permiso).

## 4) Auth Gate (Dual Mode)
- [ ] Login JWT backend responde `200`.
- [ ] `usuarios.supabase_id` enlazado en usuarios migrados.
- [ ] Operación estable sin romper sesiones existentes.

## 5) API & Frontend Smoke Gate
- [ ] Backend público OK:
  - [ ] `GET /api/roles`
  - [ ] `GET /api/taller`
  - [ ] `GET /api/sucursales`
  - [ ] `GET /api/servicios`
  - [ ] `GET /api/marcas`
  - [ ] `GET /api/modelos`
  - [ ] `GET /api/auth/login?...`
- [ ] Frontend carga y navega en `https://speed-pro.vercel.app/inicio`.
- [ ] Flujo mínimo de usuario validado (login + consulta principal).

## 6) Cutover Execution (T0)
- [ ] Deploy final backend en Render (manual o auto según política).
- [ ] Verificación inmediata de health funcional (smoke endpoints).
- [ ] Confirmación con negocio/operación de funcionamiento básico.

## 7) Post-Cutover Monitoring (T+0 a T+24h)
- [ ] Monitorear tasa de 5xx en backend.
- [ ] Monitorear latencia endpoints críticos.
- [ ] Monitorear errores de auth/login.
- [ ] Monitorear errores de CORS en frontend.
- [ ] Revisar 3 flujos reales de usuarios en producción.

## 8) Rollback Criteria (si aplica)
Ejecutar rollback si ocurre cualquiera:
- [ ] Login caído > 10 minutos.
- [ ] Error 5xx sostenido > 5% en endpoints críticos.
- [ ] Inconsistencia de datos crítica no mitigable rápidamente.

## 9) Sign-Off
- [ ] Backend Lead
- [ ] Frontend Lead
- [ ] QA
- [ ] Operación/Soporte
- [ ] Negocio

---

## Estado actual recomendado
- Backend Render en línea.
- Supabase conectado.
- Continuar con este checklist como documento de aceptación final del corte.
