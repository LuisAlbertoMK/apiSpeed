const fs = require('fs');
const file = 'src/DB/postgres.js';
let c = fs.readFileSync(file, 'utf8');

const oldAgregar = `async function agregar(tabla, data) {
    const { data: result, error } = await supabase.from(tabla).upsert(data).select();
    if (error) throw error;
    return result ? result[0] : { insertId: 0 };
}`;

const newAgregar = `const TABLE_COLUMNS = {
    clientes: ['id_cliente','id_rol','id_empresa','activo','apellidos','correo','generico','no_cliente','nombre','telefono','tipo','registroauth','updatecliente_at','createcliente_at','showhistorial'],
    vehiculos: ['id_vehiculo','id_cliente','id_marca','id_categoria','id_modelo','cilindros','color','engomado','marcamotor','no_motor','placas','transmision','vinchasis','enventa','createvehiculo_at','updatevehiculo_at','kilometraje','anio','user_id'],
    recepciones: ['id_recepcion','id_taller','id_cliente','id_vehiculo','id_sucursal','id_servicio','id_formapago','id_usuario','estado','createrecepciones_at','updaterecepciones_at','diagnostico','kilometraje','observaciones','promesa','no_orden','id_tecnico','activo'],
    cotizaciones: ['id_cotizacion','id_taller','id_cliente','id_vehiculo','id_sucursal','id_servicio','id_formapago','id_usuario','estado','createcotizaciones_at','updatecotizaciones_at','diagnostico','kilometraje','observaciones','no_cotizacion','activo'],
    cliente_taller_sucursal: ['id_cliente_taller_sucursal','id_cliente','id_taller','id_sucursal'],
};

function stripData(tabla, data) {
    const cols = TABLE_COLUMNS[tabla];
    if (!cols) return data;
    const pk = PK_MAP[tabla] || 'id';
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
        if (!cols.includes(key)) continue;
        if (key === pk && (value === 0 || value === '0')) continue;
        if (key.startsWith('id_') && (value === 0 || value === '0') && key !== pk) continue;
        cleaned[key] = value;
    }
    return cleaned;
}

async function agregar(tabla, data) {
    const cleanData = stripData(tabla, data);

    // For clientes: extract taller/sucursal info, insert client, then link
    if (tabla === 'clientes') {
        const id_taller = data.id_taller;
        const id_sucursal = data.id_sucursal;

        const { data: result, error } = await supabase.from(tabla).upsert(cleanData).select();
        if (error) throw error;
        const row = result ? result[0] : { insertId: 0 };

        // Link client to taller/sucursal if provided
        if (id_taller && id_sucursal && row.id_cliente) {
            await supabase.from('cliente_taller_sucursal').upsert({
                id_cliente: row.id_cliente,
                id_taller: parseInt(id_taller, 10),
                id_sucursal: parseInt(id_sucursal, 10),
            }, { onConflict: 'id_cliente,id_taller,id_sucursal' }).select();
        }
        return row;
    }

    const { data: result, error } = await supabase.from(tabla).upsert(cleanData).select();
    if (error) throw error;
    return result ? result[0] : { insertId: 0 };
}`;

console.log('FOUND OLD:', c.includes(oldAgregar));

if (c.includes(oldAgregar)) {
    c = c.replace(oldAgregar, newAgregar);
    fs.writeFileSync(file, c);
    console.log('PATCHED OK');
} else {
    // Try with different line endings
    const oldLF = oldAgregar.replace(/\n/g, '\r\n');
    if (c.includes(oldLF)) {
        const newCRLF = newAgregar.replace(/\n/g, '\r\n');
        c = c.replace(oldLF, newCRLF);
        fs.writeFileSync(file, c);
        console.log('PATCHED OK (CRLF)');
    } else {
        console.log('NOT FOUND');
        const idx = c.indexOf('async function agregar(tabla, data)');
        console.log('IDX:', idx);
        if (idx >= 0) console.log('SNIPPET:', JSON.stringify(c.substring(idx, idx + 200)));
    }
}
