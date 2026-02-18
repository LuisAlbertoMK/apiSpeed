// Fix: Add sequences to PK columns that are missing auto-increment
// Supabase REST API doesn't support DDL, so we use the supabase-js rpc or
// fall back to a workaround: use the agregar function with explicit max+1 IDs

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Tables that need auto-increment PKs and their current max values
const TABLES_TO_FIX = [
    { table: 'clientes', pk: 'id_cliente' },
    { table: 'vehiculos', pk: 'id_vehiculo' },
    { table: 'recepciones', pk: 'id_recepcion' },
    { table: 'cotizaciones', pk: 'id_cotizacion' },
    { table: 'usuarios', pk: 'id_usuario' },
    { table: 'sucursales', pk: 'id_sucursal' },
    { table: 'morefacciones', pk: 'id_morefaccion' },
    { table: 'paquetes', pk: 'id_paquete' },
    { table: 'elementosrecepcion', pk: 'id_elerecepcion' },
    { table: 'elementoscotizacion', pk: 'id_elecotizacion' },
    { table: 'elementosmodpaquetes', pk: 'id_modificacion' },
    { table: 'elementosmodpaquetesrecep', pk: 'id_modificacion' },
    { table: 'gastosorden', pk: 'id_gastoorden' },
    { table: 'pagosorden', pk: 'id_pagoorden' },
    { table: 'empresas', pk: 'id_empresa' },
    { table: 'marcas', pk: 'id_marca' },
    { table: 'modelos', pk: 'id_modelo' },
    { table: 'roles', pk: 'id_rol' },
    { table: 'servicios', pk: 'id_servicio' },
    { table: 'formapago', pk: 'id_formapago' },
    { table: 'gastosoperacion', pk: 'id_gastooperacion' },
    { table: 'cliente_taller_sucursal', pk: 'id_cliente_taller_sucursal' },
];

(async () => {
    // Generate SQL statements to run in Supabase SQL Editor
    console.log('-- Run these SQL statements in the Supabase SQL Editor:');
    console.log('-- (Dashboard > SQL Editor > New Query)\n');

    for (const { table, pk } of TABLES_TO_FIX) {
        const { data } = await supabase
            .from(table)
            .select(pk)
            .order(pk, { ascending: false })
            .limit(1);

        const maxId = data && data[0] ? data[0][pk] : 0;
        const seqStart = maxId + 1;
        const seqName = `${table}_${pk}_seq`;

        console.log(`-- ${table} (max ${pk}: ${maxId})`);
        console.log(`CREATE SEQUENCE IF NOT EXISTS ${seqName} START WITH ${seqStart};`);
        console.log(`ALTER TABLE ${table} ALTER COLUMN ${pk} SET DEFAULT nextval('${seqName}');`);
        console.log(`ALTER SEQUENCE ${seqName} OWNED BY ${table}.${pk};`);
        console.log('');
    }

    console.log('-- Done! After running this SQL, new inserts will auto-generate PKs.');
})();
