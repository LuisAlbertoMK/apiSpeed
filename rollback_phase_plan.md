# Rollback Plan - SpeedPro Supabase Migration

## Objetivo
Permitir reversión controlada en caso de falla funcional posterior a migración.

## Alcance
- Fase C (datos negocio): clientes, vehiculos, cotizaciones, recepciones
- Fase D (seguridad): RLS/policies
- Fase E (auth dual): auth.users + usuarios.supabase_id

## Precondiciones
1. Mantener MariaDB operativa en modo solo lectura de emergencia.
2. Tener respaldo lógico de Supabase previo a cambios:
   - `pg_dump --schema=public --data-only ...`
3. Respaldo de backend y frontend previo al deploy.

## Rollback Fase D (RLS)
Ejecutar SQL para deshabilitar políticas restrictivas temporalmente:

```sql
begin;

alter table public.clientes disable row level security;
alter table public.vehiculos disable row level security;
alter table public.cotizaciones disable row level security;
alter table public.recepciones disable row level security;
alter table public.usuarios disable row level security;

drop policy if exists clientes_read_admin_gerente on public.clientes;
drop policy if exists clientes_write_admin on public.clientes;
drop policy if exists vehiculos_read_admin_gerente on public.vehiculos;
drop policy if exists vehiculos_read_tecnico on public.vehiculos;
drop policy if exists vehiculos_write_admin_gerente on public.vehiculos;
drop policy if exists cotizaciones_read_admin_gerente on public.cotizaciones;
drop policy if exists cotizaciones_write_admin_gerente on public.cotizaciones;
drop policy if exists recepciones_read_admin_gerente on public.recepciones;
drop policy if exists recepciones_read_tecnico on public.recepciones;
drop policy if exists recepciones_write_admin_gerente_tecnico on public.recepciones;
drop policy if exists usuarios_admin_only on public.usuarios;

commit;
```

## Rollback Fase E (auth dual)
1. Mantener login JWT backend activo (sin dependencia de Supabase Auth).
2. Revertir enlace `supabase_id` solo si es necesario:

```sql
update public.usuarios
set supabase_id = null
where supabase_id is not null;
```

3. (Opcional) eliminar usuarios migrados en `auth.users` con script admin por lote.

## Rollback Fase C (datos)
1. Si hay inconsistencia crítica, restaurar backup lógico de tablas:
   - clientes
   - vehiculos
   - cotizaciones
   - recepciones
2. Si no hay backup: ejecutar migración nuevamente desde MariaDB con script idempotente.

## Validaciones post-rollback
- Endpoints clave backend responden 200
- Conteos consistentes en tablas críticas
- Login operativo
- Frontend flujo básico operativo
