# Estado Actual del Proyecto — Análisis Fase 1

> Generado durante FASE 1 — Análisis Pre-migración  
> Fecha: 2026-02-23  
> Rama: `migration/mariadb-to-supabase-completa`

---

## Backend (`apiSpeed`)

### Punto de entrada
- `src/index.js` → arranca `src/app.js` → `app.listen()`

### Librería de DB
- **`@supabase/supabase-js` v2.95.3** — ✅ YA MIGRADO. No hay ninguna dependencia de `mysql`, `mysql2`, `mariadb`, `sequelize` ni `knex`.

### Archivo de conexión a DB
- `src/DB/postgres.js` — cliente Supabase singleton con ~110 funciones que cubren todas las operaciones del sistema (CRUD, paginación, búsquedas, reportes, etc.)

### Archivos con queries / conexión DB
- `src/DB/postgres.js` — único archivo de acceso a datos (patrón repository)
- Todos los módulos en `src/modulos/*/controlador.js` consumen `postgres.js`

### Archivos con WebSockets
- **Ninguno.** No existe código de `socket.io`, `ws` ni `WebSocket` en el backend.

### Variables de entorno utilizadas
- `SUPABASE_URL` — URL del proyecto Supabase
- `SUPABASE_SERVICE_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_KEY` — clave de servicio (acepta cualquiera de los tres nombres)
- `JWT_SECRET` — clave para firma de tokens
- `PORT` — puerto del servidor (default: 3000)
- `DATABASE_URL` — string de conexión directa (referenciado en `src/config.js`, no se usa activamente)

### Dependencias actuales (producción)
```
@supabase/supabase-js  ^2.95.3
bcryptjs               ^3.0.2
cors                   ^2.8.5
dotenv                 ^16.3.1
express                ^4.18.2
jsonwebtoken           ^9.0.2
morgan                 ^1.10.0
```

### Dependencias de desarrollo
```
nodemon  ^3.0.2
```

### Módulos del sistema (src/modulos/)
actualizacion, anios, auth, categorias, clienterequest, clientes, contador, correos, cotizaciones, depositos, elementos_cotizacion, elementos_recepcion, elementosPaquetes, empresas, formaPago, gastos_operacion, gastos_orden, gastosDiarios, historial_cliente, imagenes_recepciones, marcas, mod_paquetes, modelos, moRefacciones, obtenerToken, pagos, pagos_orden, paquetes, planCliente, planes, promociones, recepciones, reportecotizacion, reportes, roles, servicios, sucursales, taller, tecnicos, tutoriales, usuarios, varios, vehiculos

---

## Base de Datos (`completa.sql`)

### Estadísticas
- **Número de tablas:** 48
- **Tamaño aproximado del archivo:** ~4.8 MB

### Lista de tablas
actualizacion_actual, actualizacion_historial, anios, auth, categorias, cliente_taller_sucursal, clientes, compatibles, contactocliente, cotizaciones, datosvehiculoventa, depositos, elementoscotizacion, elementosmodpaquetes, elementosmodpaquetesrecep, elementospaquetes, elementosrecepcion, empresas, formapago, gastosdiarios, gastosoperacion, gastosorden, historialclientetaller, imagenesrecepciones, marcas, modelos, morefacciones, pagos_mensuales, pagosorden, pagototalorden, paquetes, plancliente, planescliente, promociones, recepciones, reportes, reportescotizacion, roles, servicios, settingclientes, sucursales, taller, talleractualcliente, tutoriales, user_request_limits, usuarios, vehiculos, vehiculos_favoritos

### Problemas detectados en el SQL

| Error | Descripción | Estado |
|-------|-------------|--------|
| E-001 | `UNSIGNED INT`, `TINYINT(1)`, mezclados por tabla | Aplica |
| E-002 | `AUTO_INCREMENT` presente en todas las tablas con PK | Aplica |
| E-007 | Encoding mixto: algunas tablas en `latin1`, otras en `utf8mb4` | Aplica |
| E-011 | 1 ENUM detectado en `user_request_limits.request_type` | Aplica |

### Tablas con ENUM
- `user_request_limits`: campo `request_type ENUM('estadisticas','cotizaciones','servicios','vehiculos','venta_vehiculos')`

### Charsets detectados
- `latin1 / latin1_swedish_ci` — tablas: actualizacion_actual, actualizacion_historial, clientes, etc.
- `utf8mb4 / utf8mb4_general_ci` — tablas: anios, categorias, etc.
- **Acción requerida:** Convertir a UTF-8 uniforme antes de importar (ver E-007)

---

## Frontend (`SpeedPro`)

### Framework
- Angular 13 (TypeScript)

### Archivos con WebSockets
- **Ninguno.** No existe código de `socket.io` ni `new WebSocket` en el frontend.

### URL del backend
- **Desarrollo:** `http://localhost:3000` → `environment.ts` → campo `API_URI`
- **Producción:** `https://apispeed-i7gp.onrender.com` → `environment.prod.ts` → campo `API_URI`

### Integración con Supabase en el frontend
- Ya tiene `@supabase/supabase-js ^2.95.3` en dependencias
- Proyecto Supabase configurado: `https://gxhoguzokmhckdxkewiq.supabase.co`
- clave anon en `environment.ts` y `environment.prod.ts`

### Firebase (paralelo a Supabase)
- El frontend usa Firebase Authentication + Realtime DB
- Proyecto Firebase: `speed-pro-desarrollo`
- Dominio producción: `apputos.app`

### Archivos con referencias a MariaDB (legacy — eliminar)
- `src/app/services/direct-mariadb.service.ts` — servicio huérfano que apunta a `localhost:3000/api/mariadb`. **No es importado en ningún otro archivo.** Candidato a eliminación en Fase 3.

### Archivos con URL hardcoded (a revisar)
- `environment.ts`: `localhost:3000`, `localhost:3500`, `127.0.0.1:5001`
- `environment.prod.ts`: `apispeed-i7gp.onrender.com`, `apiemail-7rrm.onrender.com`, `serverstripe.onrender.com`
- `vehiculos.service.ts`, `update-aviable.service.ts`, `stripe.service.ts`, `servicios-publicos.service.ts`, `loginv1.component.ts`, `servicios-confirmar.component.ts`, `editar-os.component.ts`, `cotizacion-new.component.ts` — contienen referencias a localhost/render

---

## Resumen de Estado de Migración

| Área | Estado |
|------|--------|
| Backend — librería DB | ✅ Migrado a Supabase |
| Backend — WebSockets | ✅ Eliminados |
| Backend — queries SQL raw | ✅ Reemplazadas por Supabase client |
| Base de datos — importación SQL | ⚠️ Pendiente verificar (supabase_raw.sql existe) |
| Frontend — WebSockets | ✅ No existen |
| Frontend — legacy MariaDB service | ⚠️ Archivo huérfano, eliminar en Fase 3 |
| Frontend — URL de backend prod | ✅ Apunta a Render (onrender.com) |

---

## Dependencias a eliminar (Fase 3 — Limpieza)

### Backend
- Ninguna dependencia de MariaDB que eliminar (ya fueron removidas)
- Archivos temporales en raíz: `_fix_sequences.js`, `_patch_agregar.js`

### Frontend
- `src/app/services/direct-mariadb.service.ts` — servicio legacy sin uso

---

## Dependencias ya añadidas

### Backend
- `@supabase/supabase-js ^2.95.3` ✅

### Frontend
- `@supabase/supabase-js ^2.95.3` ✅
