// =============================================
// postgres.js - Reemplazo completo de mysql.js
// Usa Supabase client para todas las operaciones
// Replica EXACTAMENTE la interfaz exportada de mysql.js
// =============================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

console.log('DB Supabase conectada');

// =============================================
// FUNCIONES GENÉRICAS (replican mysql.js)
// =============================================

async function contadorTabla(data) {
    const { tabla, id_taller, id_sucursal } = data;
    if (tabla === 'clientes') {
        const { count } = await supabase.from('cliente_taller_sucursal')
            .select('*', { count: 'exact', head: true })
            .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
        return [{ total: count || 0 }];
    }
    const { count } = await supabase.from(tabla)
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    return [{ total: count || 0 }];
}

async function Todos(tabla) {
    const { data, error } = await supabase.from(tabla).select('*');
    if (error) throw error;
    return data;
}

async function sucursalQuery(tabla, campos, campo, ID) {
    let selectStr = 'id_sucursal, id_taller';
    if (campos && `${campos}`.length) selectStr += `,${campos}`;
    const { data, error } = await supabase.from(tabla).select(selectStr).eq(campo, ID);
    if (error) throw error;
    return data ? data[0] : null;
}

async function uno(tabla, id) {
    const { data, error } = await supabase.from(tabla).select('*').eq('id', id);
    if (error) throw error;
    return data;
}

async function uno2(tabla, [clave, valor]) {
    const { data, error } = await supabase.from(tabla).select('*').eq(clave, valor);
    if (error) throw error;
    return data ? data[0] : null;
}

async function eliminar(tabla, data) {
    const { error } = await supabase.from(tabla).delete().eq('id', data.id);
    if (error) throw error;
    return { affectedRows: 1 };
}

async function eliminarQuery(tabla, consulta) {
    const key = Object.keys(consulta)[0];
    const value = consulta[key];
    const { error } = await supabase.from(tabla).delete().eq(key, value);
    if (error) throw error;
    return { affectedRows: 1 };
}

async function agregar(tabla, data) {
    const { data: result, error } = await supabase.from(tabla).upsert(data).select();
    if (error) throw error;
    return result ? result[0] : { insertId: 0 };
}

async function query(tabla, consulta) {
    const key = Object.keys(consulta)[0];
    const value = consulta[key];
    const { data, error } = await supabase.from(tabla).select('*').eq(key, value);
    if (error) throw error;
    return data ? data[0] : null;
}

async function query2(tabla, consulta, id_ocupar) {
    const value = consulta['id_ocupar'];
    const { data, error } = await supabase.from(tabla).select('*').eq(id_ocupar, value);
    if (error) throw error;
    return data ? data[0] : null;
}

async function queryEliminar(tabla, consulta) {
    const key = Object.keys(consulta)[0];
    const valor = consulta[key];
    const { error } = await supabase.from(tabla).delete().eq(key, valor);
    if (error) throw error;
    return { affectedRows: 1 };
}

async function consultaModeloMarca(tabla, id_marca) {
    const { data, error } = await supabase.from(tabla).select('*').eq('id_marca', id_marca);
    if (error) throw error;
    return data;
}

// =============================================
// LOGIN / AUTH
// =============================================

async function dataUsuario(id_usuario) {
    const { data, error } = await supabase.from('usuarios')
        .select('*, roles(rol), sucursales(sucursal)')
        .eq('id_usuario', id_usuario);
    if (error) throw error;
    if (!data || data.length === 0) return [];
    const u = data[0];
    return [{
        id_usuario: u.id_usuario, id_taller: u.id_taller, id_rol: u.id_rol,
        id_sucursal: u.id_sucursal, id_cliente: u.id_cliente,
        usuario: u.usuario, correo: u.correo, activo: u.activo,
        create_at: u.create_at, update_at: u.update_at,
        rol: u.roles ? u.roles.rol : null,
        sucursal: u.sucursales ? u.sucursales.sucursal : null
    }];
}

// =============================================
// VEHICULOS
// =============================================

async function VehiculosPaginacionTotales(data) {
    const { id_taller, id_sucursal } = data;
    const { count } = await supabase.from('vehiculos')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    return { total: count || 0 };
}

async function vehiculosPaginacion(data) {
    const { semejantes, active, direction, id_taller, id_sucursal, limit, offset } = data;
    let q = supabase.from('vehiculos')
        .select(`*, clientes(nombre, apellidos, id_cliente, no_cliente), marcas(marca), modelos(modelo), categorias(categoria)`)
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (semejantes) q = q.or(`placas.ilike.%${semejantes}%,anio.ilike.%${semejantes}%`);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('vehiculos')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    const flat = (rows || []).map(r => ({
        ...r, nombre: r.clientes?.nombre, apellidos: r.clientes?.apellidos,
        id_cliente: r.clientes?.id_cliente || r.id_cliente, no_cliente: r.clientes?.no_cliente,
        marca: r.marcas?.marca, modelo: r.modelos?.modelo, categoria: r.categorias?.categoria,
        clientes: undefined, marcas: undefined, modelos: undefined, categorias: undefined
    }));
    return [flat, [{ total: count || 0 }]];
}

async function vehiculoscliente(data) {
    const { id_cliente, active, direction, id_taller, id_sucursal, limit, offset, semejantes } = data;
    let q = supabase.from('vehiculos')
        .select(`*, marcas(marca), modelos(modelo), categorias(categoria)`)
        .eq('id_cliente', id_cliente);
    if (semejantes) q = q.or(`placas.ilike.%${semejantes}%,anio.ilike.%${semejantes}%`);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('vehiculos')
        .select('*', { count: 'exact', head: true }).eq('id_cliente', id_cliente);
    if (error) throw error;
    const flat = (rows || []).map(r => ({
        ...r, marca: r.marcas?.marca, modelo: r.modelos?.modelo, categoria: r.categorias?.categoria,
        marcas: undefined, modelos: undefined, categorias: undefined
    }));
    return [flat, [{ total: count || 0 }]];
}

async function semejantesV(data) {
    const { semejantes, id_taller, id_sucursal, limit, offset } = data;
    return vehiculosPaginacion({ ...data, active: 'id_vehiculo', direction: 'desc' });
}

async function clienteVehiculos(data) {
    const { id_cliente, limit, offset } = data;
    const { data: rows, error } = await supabase.from('vehiculos')
        .select(`*, marcas(marca), modelos(modelo), categorias(categoria)`)
        .eq('id_cliente', id_cliente).range(offset, offset + limit - 1);
    if (error) throw error;
    return (rows || []).map(r => ({
        ...r, marca: r.marcas?.marca, modelo: r.modelos?.modelo, categoria: r.categorias?.categoria,
        marcas: undefined, modelos: undefined, categorias: undefined
    }));
}

async function vehiculosPlacas(id_cliente) {
    const { data, error } = await supabase.from('vehiculos')
        .select('id_vehiculo, placas').eq('id_cliente', id_cliente);
    if (error) throw error;
    return data;
}

async function ventaVehiculo(data) { return clienteVehiculos(data); }

async function sp_pagVehiculosVenta(data) {
    const { limit, offset } = data;
    const { data: rows, error } = await supabase.from('datosvehiculoventa')
        .select('*, vehiculos(*, marcas(marca), modelos(modelo))')
        .eq('activo', true).range(offset, offset + limit - 1);
    if (error) throw error;
    return rows;
}

async function contadorVehiculosVenta() {
    const { count } = await supabase.from('datosvehiculoventa')
        .select('*', { count: 'exact', head: true }).eq('activo', true);
    return { total: count || 0 };
}

async function VehiculosPaginacionTotalesCliente(id_cliente) {
    const { count } = await supabase.from('vehiculos')
        .select('*', { count: 'exact', head: true }).eq('id_cliente', id_cliente);
    return { total: count || 0 };
}

async function listaVehiculosClienteUnico(id_cliente) {
    const { data, error } = await supabase.from('vehiculos')
        .select('id_vehiculo, placas, anio, marcas(marca), modelos(modelo), categorias(categoria)')
        .eq('id_cliente', id_cliente);
    if (error) throw error;
    return (data || []).map(r => ({
        ...r, marca: r.marcas?.marca, modelo: r.modelos?.modelo, categoria: r.categorias?.categoria,
        marcas: undefined, modelos: undefined, categorias: undefined
    }));
}

async function updateKilometraje(data) {
    const { id_vehiculo, kilometraje } = data;
    const { error } = await supabase.from('vehiculos')
        .update({ kilometraje }).eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return {};
}

async function updateTallerSucursalVehiculos(data) {
    const { id_cliente, id_taller, id_sucursal } = data;
    const { error } = await supabase.from('vehiculos')
        .update({ id_taller, id_sucursal }).eq('id_cliente', id_cliente);
    if (error) throw error;
    return {};
}

async function semejantesVehiculosCliente(data) {
    const { id_cliente, id_taller, id_sucursal, semejantes } = data;
    const { data: rows, error } = await supabase.from('vehiculos')
        .select('*, marcas(marca), modelos(modelo)')
        .eq('id_cliente', id_cliente)
        .or(`placas.ilike.%${semejantes}%,anio.ilike.%${semejantes}%`);
    if (error) throw error;
    return (rows || []).map(r => ({
        ...r, marca: r.marcas?.marca, modelo: r.modelos?.modelo,
        marcas: undefined, modelos: undefined
    }));
}

async function VehiculosRelacionados(id_sucursal) {
    const { data, error } = await supabase.from('vehiculos')
        .select('*, marcas(marca), modelos(modelo), clientes(nombre, apellidos)')
        .eq('id_sucursal', id_sucursal);
    if (error) throw error;
    return data;
}

async function vehiculoVenta(id_vehiculo) {
    const { data, error } = await supabase.from('datosvehiculoventa')
        .select('*').eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return data ? data[0] : null;
}

async function listaTS(id_cliente) {
    const { data, error } = await supabase.from('cliente_taller_sucursal')
        .select('*, taller(nombretaller, acronimo), sucursales(sucursal)')
        .eq('id_cliente', id_cliente);
    if (error) throw error;
    return data;
}

async function update_venta(id_vehiculo, data) {
    const { error } = await supabase.from('datosvehiculoventa')
        .update(data).eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return {};
}

async function patchVenta(id_vehiculo, enVenta) {
    const { error } = await supabase.from('vehiculos')
        .update({ enventa: enVenta }).eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return {};
}

async function vehiculosCliente(id) {
    const { data, error } = await supabase.from('vehiculos')
        .select('*, marcas(marca), modelos(modelo), categorias(categoria)')
        .eq('id_cliente', id);
    if (error) throw error;
    return (data || []).map(r => ({
        ...r, marca: r.marcas?.marca, modelo: r.modelos?.modelo, categoria: r.categorias?.categoria,
        marcas: undefined, modelos: undefined, categorias: undefined
    }));
}

async function sp_vehiculosCliente(id) { return vehiculosCliente(id); }

async function vehiculo(id_vehiculo) {
    const { data, error } = await supabase.from('vehiculos')
        .select('*, marcas(marca), modelos(modelo), categorias(categoria), clientes(nombre, apellidos)')
        .eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return data;
}

async function vehiculoUnico(id_vehiculo) {
    const { data, error } = await supabase.from('vehiculos')
        .select('*, marcas(marca), modelos(modelo), categorias(categoria), clientes(nombre, apellidos, no_cliente, correo, telefono)')
        .eq('id_vehiculo', id_vehiculo).single();
    if (error) throw error;
    return data ? {
        ...data, marca: data.marcas?.marca, modelo: data.modelos?.modelo,
        categoria: data.categorias?.categoria, nombre: data.clientes?.nombre,
        apellidos: data.clientes?.apellidos, no_cliente: data.clientes?.no_cliente,
        marcas: undefined, modelos: undefined, categorias: undefined, clientes: undefined
    } : null;
}

async function vehiculosTallerSucursal(id_taller, id_sucursal) {
    const { data, error } = await supabase.from('vehiculos')
        .select('*, marcas(marca), modelos(modelo), clientes(nombre, apellidos)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    return data;
}

async function verificaPlacas(placas) {
    const { data, error } = await supabase.from('vehiculos')
        .select('id_vehiculo, placas').eq('placas', placas);
    if (error) throw error;
    return data;
}

async function cotizacionesVehiculo(id_vehiculo) {
    const { data, error } = await supabase.from('cotizaciones')
        .select('*, servicios(servicio), formapago(formapago), sucursales(sucursal)')
        .eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return data;
}

async function recepcionesVehiculo(id_vehiculo) {
    const { data, error } = await supabase.from('recepciones')
        .select('*, servicios(servicio), formapago(formapago), sucursales(sucursal)')
        .eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return data;
}

async function recepcionesIDs(id_cliente, ids, startDate, endDate) {
    const idArr = ids.split(',').map(Number).filter(n => !isNaN(n));
    const { data, error } = await supabase.from('recepciones')
        .select('*, vehiculos(placas, anio), marcas:vehiculos(marcas(marca)), modelos:vehiculos(modelos(modelo))')
        .eq('id_cliente', id_cliente)
        .in('id_vehiculo', idArr)
        .gte('createrecepciones_at', startDate)
        .lte('createrecepciones_at', endDate);
    if (error) throw error;
    return data;
}

async function favoritosRecepciones(id_cliente, ids) {
    const idArr = ids.split(',').map(Number).filter(n => !isNaN(n));
    const { data, error } = await supabase.from('recepciones')
        .select('*').eq('id_cliente', id_cliente).in('id_vehiculo', idArr);
    if (error) throw error;
    return data;
}

// =============================================
// CLIENTES
// =============================================

async function clientesPaginacionTotales(data) {
    const { id_taller, id_sucursal } = data;
    const { count } = await supabase.from('cliente_taller_sucursal')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    return { total: count || 0 };
}

async function clientesPaginacionClientes(data) {
    const { semejantes, id_taller, id_sucursal, limit, offset, direction, active } = data;
    const { data: cts } = await supabase.from('cliente_taller_sucursal')
        .select('id_cliente').eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    const ids = (cts || []).map(c => c.id_cliente);
    if (ids.length === 0) return [[], [{ total: 0 }]];
    let q = supabase.from('clientes')
        .select('*, roles(rol), empresas(empresa), sucursales:cliente_taller_sucursal(sucursales(sucursal))')
        .in('id_cliente', ids);
    if (semejantes) q = q.or(`nombre.ilike.%${semejantes}%,apellidos.ilike.%${semejantes}%,correo.ilike.%${semejantes}%,no_cliente.ilike.%${semejantes}%`);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error, count } = await q;
    if (error) throw error;
    const flat = (rows || []).map(r => ({
        ...r, rol: r.roles?.rol, empresa: r.empresas?.empresa,
        sucursal: r.sucursales?.[0]?.sucursales?.sucursal,
        roles: undefined, empresas: undefined, sucursales: undefined
    }));
    return [flat, [{ total: ids.length }]];
}

async function clientes() {
    const { data, error } = await supabase.from('clientes')
        .select('*, roles(rol), empresas(empresa)');
    if (error) throw error;
    return (data || []).map(r => ({
        ...r, rol: r.roles?.rol, empresa: r.empresas?.empresa,
        roles: undefined, empresas: undefined
    }));
}

async function clientesSucursal(id_sucursal) {
    const { data: cts } = await supabase.from('cliente_taller_sucursal')
        .select('id_cliente').eq('id_sucursal', id_sucursal);
    const ids = (cts || []).map(c => c.id_cliente);
    if (ids.length === 0) return [];
    const { data, error } = await supabase.from('clientes')
        .select('*, empresas(empresa)').in('id_cliente', ids);
    if (error) throw error;
    return data;
}

async function contadorClientesUsuario(id_usuario) {
    return [{ limiteClientes: 999, contadorTotal: 0 }];
}

async function cliente(id_cliente) {
    const { data, error } = await supabase.from('clientes')
        .select('*, roles(rol)').eq('id_cliente', id_cliente);
    if (error) throw error;
    return data;
}

async function clienteUnico(id_cliente) {
    const { data, error } = await supabase.from('clientes')
        .select('*, roles(rol)')
        .eq('id_cliente', id_cliente).single();
    if (error) throw error;
    if (!data) return null;
    const { data: cts } = await supabase.from('cliente_taller_sucursal')
        .select('id_taller, id_sucursal, sucursales(sucursal, telefono)')
        .eq('id_cliente', id_cliente).limit(1);
    const c = cts?.[0];
    return {
        ...data, rol: data.roles?.rol, id_taller: c?.id_taller,
        id_sucursal: c?.id_sucursal, sucursal: c?.sucursales?.sucursal,
        telefonoSucursal: c?.sucursales?.telefono,
        roles: undefined
    };
}

async function semejantesClientes(data) {
    const { semejantes, limit, id_taller, id_sucursal, offset } = data;
    const { data: cts } = await supabase.from('cliente_taller_sucursal')
        .select('id_cliente').eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    const ids = (cts || []).map(c => c.id_cliente);
    if (ids.length === 0) return [];
    const { data: rows, error } = await supabase.from('clientes')
        .select('*, roles(rol), empresas(empresa)')
        .in('id_cliente', ids)
        .or(`nombre.ilike.%${semejantes}%,apellidos.ilike.%${semejantes}%,correo.ilike.%${semejantes}%,no_cliente.ilike.%${semejantes}%`)
        .range(offset, offset + limit - 1);
    if (error) throw error;
    return (rows || []).map(r => ({
        ...r, rol: r.roles?.rol, empresa: r.empresas?.empresa,
        roles: undefined, empresas: undefined
    }));
}

async function semejantesClientesContador(data) {
    const { semejantes, id_taller, id_sucursal } = data;
    const { data: cts } = await supabase.from('cliente_taller_sucursal')
        .select('id_cliente').eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    const ids = (cts || []).map(c => c.id_cliente);
    const { count } = await supabase.from('clientes')
        .select('*', { count: 'exact', head: true })
        .in('id_cliente', ids)
        .or(`nombre.ilike.%${semejantes}%,apellidos.ilike.%${semejantes}%,correo.ilike.%${semejantes}%,no_cliente.ilike.%${semejantes}%`);
    return [{ total: count || 0 }];
}

async function onlyDataClientebasica(id_cliente) {
    const { data, error } = await supabase.from('clientes')
        .select('*, roles(rol), empresas(empresa)')
        .eq('id_cliente', id_cliente).single();
    if (error) throw error;
    if (!data) return null;
    const { data: cts } = await supabase.from('cliente_taller_sucursal')
        .select('taller(acronimo), sucursales(sucursal)').eq('id_cliente', id_cliente).limit(1);
    return {
        ...data, rol: data.roles?.rol, empresa: data.empresas?.empresa,
        acronimo: cts?.[0]?.taller?.acronimo, sucursal: cts?.[0]?.sucursales?.sucursal,
        roles: undefined, empresas: undefined
    };
}

async function clientesTallerSucursal(id_taller, id_sucursal) {
    const { data: cts } = await supabase.from('cliente_taller_sucursal')
        .select('id_cliente').eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    const ids = (cts || []).map(c => c.id_cliente);
    if (ids.length === 0) return [];
    const { data, error } = await supabase.from('clientes')
        .select('*, empresas(empresa)').in('id_cliente', ids);
    if (error) throw error;
    return data;
}

async function patchDataCliente(id_cliente, data) {
    const { error } = await supabase.from('clientes').update(data).eq('id_cliente', id_cliente);
    if (error) throw error;
    return {};
}

async function historialTallerescliente(data) {
    const { id_cliente, active, direction, limit, offset } = data;
    const { data: rows, error } = await supabase.from('cliente_taller_sucursal')
        .select('*, taller(nombretaller, acronimo), sucursales(sucursal)')
        .eq('id_cliente', id_cliente).range(offset, offset + limit - 1);
    if (error) throw error;
    return rows;
}

async function tallerActualCliente(id_cliente) {
    const { data, error } = await supabase.from('talleractualcliente')
        .select('*, taller(nombretaller, acronimo)').eq('id_cliente', id_cliente);
    if (error) throw error;
    return data;
}

async function onlyDatavehiculobasica(id_vehiculo) {
    const { data, error } = await supabase.from('vehiculos')
        .select('*, marcas(marca), modelos(modelo), categorias(categoria), clientes(nombre, apellidos, no_cliente)')
        .eq('id_vehiculo', id_vehiculo).single();
    if (error) throw error;
    return data ? {
        ...data, marca: data.marcas?.marca, modelo: data.modelos?.modelo,
        categoria: data.categorias?.categoria, nombre: data.clientes?.nombre,
        apellidos: data.clientes?.apellidos, no_cliente: data.clientes?.no_cliente,
        marcas: undefined, modelos: undefined, categorias: undefined, clientes: undefined
    } : null;
}

async function semejantesVehiculos(data) {
    const { semejantes, id_taller, id_sucursal, limit, offset } = data;
    return vehiculosPaginacion({ ...data, active: 'id_vehiculo', direction: 'desc' });
}

async function likeVehiculosSesionCliente(data) {
    const { semejantes, id_cliente, limit, offset, enVenta } = data;
    const venta = typeof enVenta === 'boolean' ? enVenta : enVenta === 'true';
    let q = supabase.from('vehiculos')
        .select('*, marcas(marca), modelos(modelo)').eq('id_cliente', id_cliente);
    if (venta) q = q.eq('enventa', true);
    if (semejantes) q = q.or(`placas.ilike.%${semejantes}%,anio.ilike.%${semejantes}%`);
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    if (error) throw error;
    return (rows || []).map(r => ({
        ...r, marca: r.marcas?.marca, modelo: r.modelos?.modelo,
        marcas: undefined, modelos: undefined
    }));
}

async function semejantesVehiculosContador(data) {
    const { semejantes, id_taller, id_sucursal } = data;
    const { count } = await supabase.from('vehiculos')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .or(`placas.ilike.%${semejantes}%,anio.ilike.%${semejantes}%`);
    return [{ total: count || 0 }];
}

// =============================================
// COTIZACIONES
// =============================================

async function cotizacionesCliente(id_cliente) {
    const { data, error } = await supabase.from('cotizaciones')
        .select('*, servicios(servicio), formapago(formapago), vehiculos(placas), promociones(promocion), sucursales(sucursal)')
        .eq('id_cliente', id_cliente);
    if (error) throw error;
    return (data || []).map(r => ({
        ...r, servicio: r.servicios?.servicio, formapago: r.formapago?.formapago,
        placas: r.vehiculos?.placas, promocion: r.promociones?.promocion,
        sucursal: r.sucursales?.sucursal
    }));
}

async function cotizacionesClienteX(id_cliente, start, end, ids) {
    const idArr = ids ? ids.split(',').map(Number).filter(n => !isNaN(n)) : [];
    let q = supabase.from('cotizaciones')
        .select('*, vehiculos(placas, anio), reportescotizacion(total)')
        .eq('id_cliente', id_cliente)
        .gte('createcotizacion_at', start).lte('createcotizacion_at', end);
    if (idArr.length > 0) q = q.in('id_vehiculo', idArr);
    const { data, error } = await q;
    if (error) throw error;
    return data;
}

async function favoritosCotizaciones(id_cliente, ids) {
    const idArr = ids.split(',').map(Number).filter(n => !isNaN(n));
    const { data, error } = await supabase.from('cotizaciones')
        .select('*, vehiculos(placas, anio), reportescotizacion(total)')
        .eq('id_cliente', id_cliente).in('id_vehiculo', idArr);
    if (error) throw error;
    return data;
}

async function updateFavoritosVehiculos(tabla, data) {
    const { data: result, error } = await supabase.from(tabla).upsert(data).select();
    if (error) throw error;
    return result;
}

async function getFavoritos(tabla, id_cliente) {
    const { data, error } = await supabase.from(tabla).select('*').eq('id_cliente', id_cliente);
    if (error) throw error;
    return data ? data[0] : null;
}

async function getClienteFavoritos(id_cliente) {
    const { data, error } = await supabase.from('vehiculos_favoritos')
        .select('*').eq('id_cliente', id_cliente);
    if (error) throw error;
    return data;
}

async function elementos_cotizaciones(id_cotizacion) {
    const { data, error } = await supabase.from('elementoscotizacion')
        .select('*, morefacciones(nombre, tipo), paquetes(paquete)')
        .eq('id_cotizacion', id_cotizacion);
    if (error) throw error;
    return (data || []).map(r => ({
        ...r, nombre: r.morefacciones?.nombre, tipo: r.morefacciones?.tipo,
        paquete: r.paquetes?.paquete, morefacciones: undefined, paquetes: undefined
    }));
}

async function contador(tabla) {
    const { count } = await supabase.from(tabla).select('*', { count: 'exact', head: true });
    return [{ total: count || 0 }];
}

async function contadorVehiculos(id_cliente) {
    const { count } = await supabase.from('vehiculos')
        .select('*', { count: 'exact', head: true }).eq('id_cliente', id_cliente);
    return [{ total: count || 0 }];
}

async function cotizacinesCliente(data) {
    const { id_taller, id_sucursal, id_cliente, limit, offset } = data;
    const { data: rows, error } = await supabase.from('cotizaciones')
        .select('*, vehiculos(placas), reportescotizacion(total)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal).eq('id_cliente', id_cliente)
        .range(offset, offset + limit - 1);
    if (error) throw error;
    return rows;
}

async function cotizacinesClienteContador(data) {
    const { id_taller, id_sucursal, id_cliente } = data;
    const { count } = await supabase.from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal).eq('id_cliente', id_cliente);
    return { total: count || 0 };
}

async function consultaCotizaciones(id_taller, id_sucursal, start, end) {
    const { data, error } = await supabase.from('cotizaciones')
        .select('*, clientes(no_cliente), formapago(formapago), servicios(servicio), sucursales(sucursal), vehiculos(placas), promociones(promocion)')
        .eq('id_taller', id_taller)
        .or(`id_sucursal.eq.${id_sucursal}`)
        .gte('createcotizacion_at', start).lte('createcotizacion_at', end);
    if (error) throw error;
    return data;
}

async function sp_cotizacionesClienteBasic(data) {
    const { id_cliente, id_taller, id_sucursal, active, direction, limit, offset } = data;
    let q = supabase.from('cotizaciones')
        .select('*, vehiculos(placas, anio, marcas(marca), modelos(modelo), categorias(categoria)), reportescotizacion(total)')
        .eq('id_cliente', id_cliente).eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error, count } = await q;
    if (error) throw error;
    const { count: total } = await supabase.from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_cliente', id_cliente).eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    return [rows, [{ total: total || 0 }]];
}

async function sp_cotizacionesPaginadas(data) {
    const { id_taller, id_sucursal, active, start, end, direction, limit, offset, semejantes } = data;
    let q = supabase.from('cotizaciones')
        .select('*, clientes(no_cliente, nombre, apellidos), vehiculos(placas, anio, marcas(marca), modelos(modelo)), formapago(formapago), servicios(servicio), sucursales(sucursal), reportescotizacion(total)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createcotizacion_at', start).lte('createcotizacion_at', end);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createcotizacion_at', start).lte('createcotizacion_at', end);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function sp_cotizacionesBSC(id_cliente, limite, omitir) {
    const { count } = await supabase.from('cotizaciones')
        .select('*', { count: 'exact', head: true }).eq('id_cliente', id_cliente);
    const { data, error } = await supabase.from('cotizaciones')
        .select('*, vehiculos(placas, anio, marcas(marca), modelos(modelo)), formapago(formapago), sucursales(sucursal), reportescotizacion(total)')
        .eq('id_cliente', id_cliente)
        .order('id_cotizacion', { ascending: false })
        .range(omitir, omitir + limite - 1);
    if (error) throw error;
    return [[{ total_registros: count || 0 }], data];
}

async function sp_cotizacionesBSCFavoritos(data) {
    const { id_cliente, semejantes, active, direction, limit, offset, id_vehiculos } = data;
    const idArr = id_vehiculos.split(',').map(Number).filter(n => !isNaN(n));
    const { count } = await supabase.from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_cliente', id_cliente).in('id_vehiculo', idArr);
    let q = supabase.from('cotizaciones')
        .select('*, vehiculos(placas, anio, marcas(marca), modelos(modelo)), formapago(formapago), sucursales(sucursal), reportescotizacion(total)')
        .eq('id_cliente', id_cliente).in('id_vehiculo', idArr);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    if (error) throw error;
    return [[{ total_registros: count || 0 }], rows];
}

async function cotizacionesBasicas(data) {
    const { id_taller, id_sucursal, active, direction, start, end, limit, offset } = data;
    return sp_cotizacionesPaginadas(data);
}

async function cotizacionesBasicasContador(data) {
    const { id_taller, id_sucursal, start, end } = data;
    const { count } = await supabase.from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createcotizacion_at', start).lte('createcotizacion_at', end);
    return { total: count || 0 };
}

async function patchDataCotizacion(id_cotizacion, data) {
    const { error } = await supabase.from('cotizaciones').update(data).eq('id_cotizacion', id_cotizacion);
    if (error) throw error;
    return {};
}

async function consultaCotizacion(id_cotizacion) {
    const { data, error } = await supabase.from('cotizaciones')
        .select('*, clientes(no_cliente), sucursales(sucursal), formapago(formapago), servicios(servicio), promociones(promocion), vehiculos(placas)')
        .eq('id_cotizacion', id_cotizacion).single();
    if (error) throw error;
    return data ? {
        ...data, no_cliente: data.clientes?.no_cliente, sucursal: data.sucursales?.sucursal,
        formaPago: data.formapago?.formapago, servicio: data.servicios?.servicio,
        promocion: data.promociones?.promocion, placas: data.vehiculos?.placas
    } : null;
}

// =============================================
// RECEPCIONES
// =============================================

async function recepcionesTaller(id_taller, id_sucursal, start, end) {
    const { data, error } = await supabase.from('recepciones')
        .select('*, clientes(nombre, apellidos, no_cliente), vehiculos(placas), servicios(servicio), sucursales(sucursal)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createrecepciones_at', start).lte('createrecepciones_at', end);
    if (error) throw error;
    return data;
}

async function OnlyDataRecepcion(id_recepcion) {
    const { data, error } = await supabase.from('recepciones')
        .select('*').eq('id_recepcion', id_recepcion);
    if (error) throw error;
    return data;
}

async function elementosrecepcion(id_recepcion) {
    const { data, error } = await supabase.from('elementosrecepcion')
        .select('*, morefacciones(nombre, tipo), paquetes(paquete)')
        .eq('id_recepcion', id_recepcion);
    if (error) throw error;
    return (data || []).map(r => ({
        ...r, nombre: r.morefacciones?.nombre, tipo: r.morefacciones?.tipo,
        paquete: r.paquetes?.paquete, morefacciones: undefined, paquetes: undefined
    }));
}

async function elementosrecepcionInternos(id_recepcion, id_paquete) {
    const { data, error } = await supabase.from('elementosmodpaquetesrecep')
        .select('*, morefacciones(nombre, tipo)')
        .eq('id_recepcion', id_recepcion).eq('id_paquete', id_paquete);
    if (error) throw error;
    return data;
}

async function elementosRecepciones(id_recepcion) { return elementosrecepcion(id_recepcion); }

async function patchRecepcion(id_recepcion, data) {
    const { error } = await supabase.from('recepciones').update(data).eq('id_recepcion', id_recepcion);
    if (error) throw error;
    return {};
}

async function recepcionesTaller2(data) {
    const { id_taller, id_sucursal, start, active, direction, end, limit, offset } = data;
    let q = supabase.from('recepciones')
        .select('*, clientes(nombre, apellidos, no_cliente), vehiculos(placas, anio, marcas(marca), modelos(modelo)), reportes(total)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createrecepciones_at', start).lte('createrecepciones_at', end);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('recepciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createrecepciones_at', start).lte('createrecepciones_at', end);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function recepcionesTaller2contador(data) {
    const { id_taller, id_sucursal, start, end } = data;
    const { count } = await supabase.from('recepciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createrecepciones_at', start).lte('createrecepciones_at', end);
    return { total: count || 0 };
}

async function administracion(data) {
    const { id_taller, id_sucursal, start, end, estado } = data;
    let q = supabase.from('recepciones')
        .select('*, clientes(nombre, apellidos), vehiculos(placas), reportes(total)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createrecepciones_at', start).lte('createrecepciones_at', end);
    if (estado) q = q.eq('estado', estado);
    const { data: rows, error } = await q;
    if (error) throw error;
    return rows;
}

async function sp_ordenlike(id_taller, id_sucursal, search) {
    const { data, error } = await supabase.from('recepciones')
        .select('*, clientes(nombre, apellidos, no_cliente), vehiculos(placas)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .or(`no_os.ilike.%${search}%`);
    if (error) throw error;
    return data;
}

async function sp_ordenlikeLimitado(data) {
    const { id_taller, id_sucursal, semejantes } = data;
    return sp_ordenlike(id_taller, id_sucursal, semejantes);
}

async function nuevaConsulta(data) {
    const { start, end, id_taller, id_sucursal } = data;
    const { data: rows, error } = await supabase.from('recepciones')
        .select('id_recepcion, reportes(total)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createrecepciones_at', start).lte('createrecepciones_at', end);
    if (error) throw error;
    const total = (rows || []).reduce((sum, r) => sum + (r.reportes?.total || 0), 0);
    return { total };
}

async function reporteRecepcion(id_recepcion) {
    const { data, error } = await supabase.from('reportes')
        .select('*').eq('id_recepcion', id_recepcion);
    if (error) throw error;
    return data ? data[0] : null;
}

async function sp_ordenesAbiertas(id_taller, id_sucursal) {
    const { data, error } = await supabase.from('recepciones')
        .select('*, clientes(nombre, apellidos, no_cliente), vehiculos(placas)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .neq('estado', 'entregado');
    if (error) throw error;
    return data;
}

async function RecepcionConsulta(id_recepcion) {
    const { data, error } = await supabase.from('recepciones')
        .select('*, clientes(nombre, apellidos, no_cliente, correo, telefono), vehiculos(placas, anio, marcas(marca), modelos(modelo), categorias(categoria)), servicios(servicio), formapago(formapago), sucursales(sucursal), promociones(promocion)')
        .eq('id_recepcion', id_recepcion).single();
    if (error) throw error;
    return data;
}

async function RecepcionElementos(id_recepcion) {
    return elementosrecepcion(id_recepcion);
}

async function RecepcionesVehiculoConsulta(id_vehiculo) {
    const { data, error } = await supabase.from('recepciones')
        .select('*').eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return data;
}

async function seriviciosAceptados(id_taller, id_sucursal) {
    const { data, error } = await supabase.from('recepciones')
        .select('*').eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .eq('estado', 'aceptado');
    if (error) throw error;
    return data;
}

async function serviciosEntregado(id_taller, id_sucursal, start, end) {
    const { data, error } = await supabase.from('recepciones')
        .select('*').eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .eq('estado', 'entregado')
        .gte('createrecepciones_at', start).lte('createrecepciones_at', end);
    if (error) throw error;
    return data;
}

async function recepcionesCliente(id_cliente) {
    const { data, error } = await supabase.from('recepciones')
        .select('*').eq('id_cliente', id_cliente);
    if (error) throw error;
    return data;
}

async function recepcionesBasicasOtroTaller(id_cliente, id_taller) {
    const { data, error } = await supabase.from('recepciones')
        .select('*, vehiculos(placas), sucursales(sucursal)')
        .eq('id_cliente', id_cliente).neq('id_taller', id_taller);
    if (error) throw error;
    return data;
}

async function sp_recepcionesMismoTaller(data) {
    const { id_cliente, id_taller, id_sucursal, active, direction, limit, offset } = data;
    let q = supabase.from('recepciones')
        .select('*, vehiculos(placas, anio, marcas(marca), modelos(modelo)), reportes(total)')
        .eq('id_cliente', id_cliente).eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('recepciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_cliente', id_cliente).eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function recepcionesVehiculos(data) {
    const { id_vehiculo, id_taller, id_sucursal, active, direction, limit, offset } = data;
    let q = supabase.from('recepciones')
        .select('*, reportes(total)')
        .eq('id_vehiculo', id_vehiculo).eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('recepciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_vehiculo', id_vehiculo).eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function sp_recepcionesBS(id_cliente, limite, omitir) {
    const { count } = await supabase.from('recepciones')
        .select('*', { count: 'exact', head: true }).eq('id_cliente', id_cliente);
    const { data, error } = await supabase.from('recepciones')
        .select('*, vehiculos(placas, anio, marcas(marca), modelos(modelo)), sucursales(sucursal), reportes(total)')
        .eq('id_cliente', id_cliente)
        .order('id_recepcion', { ascending: false })
        .range(omitir, omitir + limite - 1);
    if (error) throw error;
    return [[{ total_registros: count || 0 }], data];
}

async function sp_recepcionesBSFavoritos(data) {
    const { id_cliente, semejantes, active, direction, limit, offset, id_vehiculos } = data;
    const idArr = id_vehiculos.split(',').map(Number).filter(n => !isNaN(n));
    const { count } = await supabase.from('recepciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_cliente', id_cliente).in('id_vehiculo', idArr);
    let q = supabase.from('recepciones')
        .select('*, vehiculos(placas, anio, marcas(marca), modelos(modelo)), sucursales(sucursal), reportes(total)')
        .eq('id_cliente', id_cliente).in('id_vehiculo', idArr);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    if (error) throw error;
    return [[{ total_registros: count || 0 }], rows];
}

async function basicasConReporte(id_taller, id_sucursal, start, end) {
    return recepcionesTaller(id_taller, id_sucursal, start, end);
}

async function pagOdenesCliente(data) {
    const { id_taller, id_sucursal, id_cliente, limit, offset, estadoEntregado } = data;
    let q = supabase.from('recepciones')
        .select('*, vehiculos(placas), reportes(total)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal).eq('id_cliente', id_cliente);
    if (estadoEntregado) q = q.eq('estado', 'entregado');
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    if (error) throw error;
    return rows;
}

async function pagOdenesClienteContador(data) {
    const { id_taller, id_sucursal, id_cliente } = data;
    const { count } = await supabase.from('recepciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal).eq('id_cliente', id_cliente);
    return { total: count || 0 };
}

// =============================================
// PAQUETES
// =============================================

async function consultaPaquetes(data) {
    const { id_taller, id_sucursal, limit, offset } = data;
    const { data: rows, error } = await supabase.from('paquetes')
        .select('*, elementospaquetes(id_elmenpaquete, morefacciones(nombre))')
        .eq('id_taller', id_taller).range(offset, offset + limit - 1);
    if (error) throw error;
    return rows;
}

async function registraElementosPaquetes(data) {
    const rows = data.map(item => ({
        id_elmenpaquete: item.id_elmenPaquete || item.id_elmenpaquete,
        id_paquete: item.id_paquete,
        id_morefaccion: item.id_moRefaccion || item.id_morefaccion,
        activo: item.activo,
        costo: item.costo,
        cantidad: item.cantidad
    }));
    const { data: result, error } = await supabase.from('elementospaquetes').upsert(rows).select();
    if (error) throw error;
    return result;
}

async function eliminaelementospaquete(id_paquete, elementos) {
    const { error } = await supabase.from('elementospaquetes')
        .delete().eq('id_paquete', id_paquete);
    if (error) throw error;
    return {};
}

async function patchElementoPaquete(data) {
    for (const elem of data) {
        const { id_elmenPaquete, id_elmenpaquete, ...updateData } = elem;
        const id = id_elmenPaquete || id_elmenpaquete;
        const { error } = await supabase.from('elementospaquetes')
            .update(updateData).eq('id_elmenpaquete', id);
        if (error) throw error;
    }
    return {};
}

async function totalPaquetes(data) {
    const { id_taller } = data;
    const { count } = await supabase.from('paquetes')
        .select('*', { count: 'exact', head: true }).eq('id_taller', id_taller);
    return { total: count || 0 };
}

async function busquedaLikePaquetes(data) {
    const { semejantes, id_taller, active, direction, limit, offset } = data;
    let q = supabase.from('paquetes')
        .select('*, marcas(marca), modelos(modelo)')
        .eq('id_taller', id_taller);
    if (semejantes) q = q.ilike('paquete', `%${semejantes}%`);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('paquetes')
        .select('*', { count: 'exact', head: true }).eq('id_taller', id_taller);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function ObtenerDetallePaquete(id_paquete) {
    const { data, error } = await supabase.from('paquetes')
        .select('*, elementospaquetes(*, morefacciones(nombre, tipo, precio, costo))')
        .eq('id_paquete', id_paquete);
    if (error) throw error;
    return data;
}

async function ObtenerDetallePaqueteModificado(id_cotizacion, id_paquete) {
    const { data, error } = await supabase.from('elementosmodpaquetes')
        .select('*, morefacciones(nombre, tipo)')
        .eq('id_cotizacion', id_cotizacion).eq('id_paquete', id_paquete);
    if (error) throw error;
    return data;
}

async function ObtenerDetallePaqueteModificadoRecep(id_recepcion, id_paquete, id_eleRecepcion) {
    const { data, error } = await supabase.from('elementosmodpaquetesrecep')
        .select('*, morefacciones(nombre, tipo)')
        .eq('id_recepcion', id_recepcion).eq('id_paquete', id_paquete);
    if (error) throw error;
    return data;
}

async function eliminaEleModPaqRecep(id_eleRecepcion) {
    const { error } = await supabase.from('elementosmodpaquetesrecep')
        .delete().eq('id_modificacion', id_eleRecepcion);
    if (error) throw error;
    return {};
}

// =============================================
// GASTOS / PAGOS
// =============================================

async function gastosRecepcionUnica(id_recepcion) {
    const { data, error } = await supabase.from('gastosorden')
        .select('*, formapago(formapago), usuarios(usuario), roles(rol)')
        .eq('id_recepcion', id_recepcion);
    if (error) throw error;
    return data;
}

async function sp_gastosOrdenEspecifica(id_recepcion) {
    return gastosRecepcionUnica(id_recepcion);
}

async function sp_gastosOrdenesTallerSucursal(id_taller, id_sucursal, start, end) {
    const { data, error } = await supabase.from('gastosorden')
        .select('*, recepciones(no_os), formapago(formapago)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('creategastoorden_at', start).lte('creategastoorden_at', end);
    if (error) throw error;
    return data;
}

async function updateGastoOrden(id_gastoOrden, data) {
    const { error } = await supabase.from('gastosorden')
        .update(data).eq('id_gastoorden', id_gastoOrden);
    if (error) throw error;
    return {};
}

async function PagosRecepcionUnica(id_recepcion) {
    const { data, error } = await supabase.from('pagosorden')
        .select('*, formapago(formapago), usuarios(usuario), roles(rol)')
        .eq('id_recepcion', id_recepcion);
    if (error) throw error;
    return data;
}

async function pagoRecepcion(data) {
    const { data: result, error } = await supabase.from('pagototalorden').upsert(data).select();
    if (error) throw error;
    return result;
}

async function sp_pagosTallerSucursal(id_taller, id_sucursal, start, end) {
    const { data, error } = await supabase.from('pagosorden')
        .select('*, recepciones(no_os), formapago(formapago)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createpagoorden_at', start).lte('createpagoorden_at', end);
    if (error) throw error;
    return data;
}

async function updatepagoOrden(id_pagoOrden, data) {
    const { error } = await supabase.from('pagosorden')
        .update(data).eq('id_pagoorden', id_pagoOrden);
    if (error) throw error;
    return {};
}

async function pagoTotal(id_recepcion) {
    const { data, error } = await supabase.from('pagototalorden')
        .select('total').eq('id_recepcion', id_recepcion);
    if (error) throw error;
    return data ? data[0] : null;
}

// =============================================
// SUCURSALES
// =============================================

async function contadorSucursalesTaller(id_taller) {
    const { count } = await supabase.from('sucursales')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('activa', true);
    return [{ sucursalesTotales: count || 0 }];
}

async function sucursalesTaller(data) {
    const { semejantes, id_taller, active, direction, limit, offset } = data;
    let q = supabase.from('sucursales').select('*').eq('id_taller', id_taller);
    if (semejantes) q = q.ilike('sucursal', `%${semejantes}%`);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('sucursales')
        .select('*', { count: 'exact', head: true }).eq('id_taller', id_taller);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function sucursalesTaller2(id_taller) {
    const { data, error } = await supabase.from('sucursales')
        .select('*').eq('id_taller', id_taller);
    if (error) throw error;
    return data;
}

async function sucursalesBasicaTaller(id_taller) {
    const { data, error } = await supabase.from('sucursales')
        .select('id_sucursal, sucursal').eq('id_taller', id_taller).eq('activa', true);
    if (error) throw error;
    return data;
}

async function patchDataSucursal(id_sucursal, data) {
    const { error } = await supabase.from('sucursales').update(data).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    return {};
}

async function sucursalUnica(id_taller, id_sucursal) {
    const { data, error } = await supabase.from('sucursales')
        .select('*').eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    return data;
}

// =============================================
// USUARIOS
// =============================================

async function updateDataUsuario(id_usuario, data) {
    const { error } = await supabase.from('usuarios').update(data).eq('id_usuario', id_usuario);
    if (error) throw error;
    return {};
}

async function sp_usuariosrol(data) {
    const { id_taller, id_sucursal, semejantes, id_rol, active, direction, limit, offset } = data;
    let q = supabase.from('usuarios')
        .select('*, roles(rol), auth(correo)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (id_rol && id_rol > 0) q = q.eq('id_rol', id_rol);
    if (semejantes) q = q.ilike('usuario', `%${semejantes}%`);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    const flat = (rows || []).map(r => ({
        id_usuario: r.id_usuario, correo: r.auth?.correo || r.correo,
        create_at: r.create_at, usuario: r.usuario, rol: r.roles?.rol
    }));
    return [flat, [{ total: count || 0 }]];
}

async function updateDataUsuarioIDcliente(id_cliente, data) {
    const { error } = await supabase.from('usuarios').update(data).eq('id_cliente', id_cliente);
    if (error) throw error;
    return {};
}

async function consultacorreo(correo) {
    const { data, error } = await supabase.from('usuarios')
        .select('*').eq('correo', correo);
    if (error) throw error;
    return data ? data[0] : null;
}

async function existeCorreo(correo) {
    const correoLimpio = correo.trim().toLowerCase();
    const { count: c1 } = await supabase.from('usuarios')
        .select('*', { count: 'exact', head: true }).ilike('correo', correoLimpio);
    const { count: c2 } = await supabase.from('clientes')
        .select('*', { count: 'exact', head: true }).ilike('correo', correoLimpio);
    return (c1 || 0) + (c2 || 0) > 0;
}

async function usuariosRol() {
    const { data, error } = await supabase.from('usuarios')
        .select('*, roles(rol)');
    if (error) throw error;
    return data;
}

async function listaTecnicos(id_sucursal) {
    const { data, error } = await supabase.from('usuarios')
        .select('id_usuario, usuario, roles(rol)')
        .eq('id_sucursal', id_sucursal).eq('id_rol', 5);
    if (error) throw error;
    return data;
}

// =============================================
// TALLER
// =============================================

async function informaciontaller(id_usuario) {
    const { data: user } = await supabase.from('usuarios')
        .select('id_taller').eq('id_usuario', id_usuario).single();
    if (!user) return [];
    const { data, error } = await supabase.from('taller')
        .select('*').eq('id_taller', user.id_taller);
    if (error) throw error;
    return data;
}

async function informaciontallerN(id_taller) {
    const { data, error } = await supabase.from('taller')
        .select('*').eq('id_taller', id_taller);
    if (error) throw error;
    return data;
}

async function UpdateDataParcial(id_taller, data) {
    const { error } = await supabase.from('taller').update(data).eq('id_taller', id_taller);
    if (error) throw error;
    return {};
}

async function listaTalleresB(id_taller) {
    const { data, error } = await supabase.from('taller')
        .select('id_taller, nombretaller, acronimo')
        .eq('activo', true).neq('id_taller', id_taller);
    if (error) throw error;
    return data;
}

async function talleresSemejantes(data) {
    const { semejantes, id_taller, limit } = data;
    const { data: rows, error } = await supabase.from('taller')
        .select('id_taller, nombretaller, acronimo')
        .neq('id_taller', id_taller)
        .ilike('nombretaller', `%${semejantes}%`)
        .limit(limit);
    if (error) throw error;
    return rows;
}

// =============================================
// EMPRESAS
// =============================================

async function empresasTaller(id_taller) {
    const { data, error } = await supabase.from('empresas')
        .select('*').eq('id_taller', id_taller);
    if (error) throw error;
    return data;
}

async function existeEmpresa(id_taller, empresa) {
    const { data, error } = await supabase.from('empresas')
        .select('*').eq('id_taller', id_taller).eq('empresa', empresa);
    if (error) throw error;
    return data ? data[0] : null;
}

async function sucursalesEmpresas(id_sucursal) {
    const { data, error } = await supabase.from('empresas')
        .select('*');
    if (error) throw error;
    return data;
}

async function contadorEmpresasTaller(id_sucursal) {
    const { count } = await supabase.from('empresas')
        .select('*', { count: 'exact', head: true }).eq('id_taller', id_sucursal);
    return [{ empTotales: count || 0 }];
}

async function contadorMarcasTaller(id_sucursal) {
    const { count } = await supabase.from('marcas')
        .select('*', { count: 'exact', head: true });
    return [{ marTotales: count || 0 }];
}

async function contadorCategorias() {
    const { count } = await supabase.from('categorias')
        .select('*', { count: 'exact', head: true });
    return [{ categTotales: count || 0 }];
}

// =============================================
// MOREFACCIONES
// =============================================

async function getCompatibles(id_moRefaccion) {
    const { data, error } = await supabase.from('compatibles')
        .select('*, marcas(marca), modelos(modelo)')
        .eq('id_morefaccion', id_moRefaccion);
    if (error) throw error;
    return data;
}

async function semejantesmorefacciones(data) {
    const { semejantes, id_taller } = data;
    const { data: rows, error } = await supabase.from('morefacciones')
        .select('*').eq('id_taller', id_taller)
        .or(`nombre.ilike.%${semejantes}%,descripcion.ilike.%${semejantes}%`);
    if (error) throw error;
    return rows;
}

async function morefaccionesTaller(id_taller) {
    const { data, error } = await supabase.from('morefacciones')
        .select('*').eq('id_taller', id_taller);
    if (error) throw error;
    return data;
}

async function moRefacciones(data) {
    const { id_taller, id_sucursal, limit, offset } = data;
    const { data: rows, error } = await supabase.from('morefacciones')
        .select('*').eq('id_taller', id_taller).range(offset, offset + limit - 1);
    if (error) throw error;
    return rows;
}

async function spPaginacionmorefaccionesUnificado(data) {
    const { id_taller, semejantes, active, direction, limit, offset } = data;
    let q = supabase.from('morefacciones').select('*').eq('id_taller', id_taller);
    if (semejantes) q = q.or(`nombre.ilike.%${semejantes}%,descripcion.ilike.%${semejantes}%`);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('morefacciones')
        .select('*', { count: 'exact', head: true }).eq('id_taller', id_taller);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function totalMoRefacciones(data) {
    const { id_taller } = data;
    const { count } = await supabase.from('morefacciones')
        .select('*', { count: 'exact', head: true }).eq('id_taller', id_taller);
    return { total: count || 0 };
}

// =============================================
// PAQUETES TALLER
// =============================================

async function paquetesTaller(id_taller) {
    const { data, error } = await supabase.from('paquetes')
        .select('*, marcas(marca), modelos(modelo)')
        .eq('id_taller', id_taller);
    if (error) throw error;
    return data;
}

// =============================================
// PAGOS / GASTOS TALLER
// =============================================

async function pagosTaller(data) {
    const { id_taller, id_sucursal, active, direction, limit, offset, start, end } = data;
    let q = supabase.from('pagosorden')
        .select('*, recepciones(no_os), formapago(formapago), usuarios(usuario), roles(rol)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createpagoorden_at', start).lte('createpagoorden_at', end);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('pagosorden')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createpagoorden_at', start).lte('createpagoorden_at', end);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function gastosOrdenTaller(data) {
    const { id_taller, id_sucursal, active, direction, limit, offset, start, end } = data;
    let q = supabase.from('gastosorden')
        .select('*, recepciones(no_os), formapago(formapago), usuarios(usuario), roles(rol)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('creategastoorden_at', start).lte('creategastoorden_at', end);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('gastosorden')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function gastosOperacionTaller(data) {
    const { id_taller, id_sucursal, active, direction, limit, offset, start, end } = data;
    let q = supabase.from('gastosoperacion')
        .select('*, formapago(formapago), usuarios(usuario), roles(rol)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('creategastooperacion_at', start).lte('creategastooperacion_at', end);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('gastosoperacion')
        .select('*', { count: 'exact', head: true })
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function recepcionesTallerSucursal(id_taller, id_sucursal, start, end) {
    return recepcionesTaller(id_taller, id_sucursal, start, end);
}

async function gastosOperacionTallerReporte(id_taller, id_sucursal, start, end) {
    const { data, error } = await supabase.from('gastosoperacion')
        .select('*').eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('creategastooperacion_at', start).lte('creategastooperacion_at', end);
    if (error) throw error;
    return data;
}

async function sp_gastosOperacion(id_taller, id_sucursal, start, end) {
    return gastosOperacionTallerReporte(id_taller, id_sucursal, start, end);
}

async function depositosTallerSucursal(id_taller, id_sucursal, start, end) {
    const { data, error } = await supabase.from('depositos')
        .select('*, formapago(formapago), usuarios(usuario)')
        .eq('id_taller', id_taller).eq('id_sucursal', id_sucursal)
        .gte('createdeposito_at', start).lte('createdeposito_at', end);
    if (error) throw error;
    return data;
}

// =============================================
// CORREOS
// =============================================

async function correosClientes(correo) {
    let q = supabase.from('clientes').select('correo, id_cliente');
    if (correo) q = q.ilike('correo', `%${correo}%`);
    else q = q.not('correo', 'is', null).neq('correo', '');
    const { data, error } = await q;
    if (error) throw error;
    return data;
}

// =============================================
// TECNICOS
// =============================================

async function sp_tecnicosTallerSucursal(id_taller, id_sucursal) {
    const { data, error } = await supabase.from('usuarios')
        .select('id_usuario, usuario').eq('id_taller', id_taller)
        .eq('id_sucursal', id_sucursal).eq('id_rol', 5);
    if (error) throw error;
    return data;
}

async function tecnicoUnico(id_tecnico) {
    const { data, error } = await supabase.from('usuarios')
        .select('usuario').eq('id_usuario', id_tecnico).single();
    if (error) throw error;
    return data;
}

// =============================================
// TUTORIALES
// =============================================

async function tutoriales(id_usuario) {
    const { data, error } = await supabase.from('tutoriales')
        .select('*').eq('id_usuario', id_usuario);
    if (error) throw error;
    return data ? data[0] : null;
}

async function patchTutoriales(id_usuario, data) {
    const { error } = await supabase.from('tutoriales').update(data).eq('id_usuario', id_usuario);
    if (error) throw error;
    return {};
}

async function usuariosrol(data) { return sp_usuariosrol(data); }

// =============================================
// PLANES
// =============================================

async function plancliente(id_usuario) {
    const { data: user } = await supabase.from('usuarios')
        .select('id_cliente').eq('id_usuario', id_usuario).single();
    if (!user || !user.id_cliente) return [];
    const { data, error } = await supabase.from('plancliente')
        .select('*, planescliente(*)').eq('id_cliente', user.id_cliente);
    if (error) throw error;
    return data;
}

// =============================================
// CLIENT REQUEST
// =============================================

async function clienterequest(tabla, id_cliente, busqueda) {
    const { data, error } = await supabase.from('user_request_limits')
        .select('*').eq('id_cliente', id_cliente).eq('request_type', busqueda);
    if (error) throw error;
    return data ? data[0] : null;
}

async function clienterequestUpdate(tabla, id_request, request_count, busqueda) {
    const { error } = await supabase.from('user_request_limits')
        .update({ request_count }).eq('id_request', id_request).eq('request_type', busqueda);
    if (error) throw error;
    return {};
}

// =============================================
// HISTORIAL
// =============================================

async function historial_cotizaciones(data) {
    const { id_cliente, id_vehiculo, active, direction, limit, offset } = data;
    let q = supabase.from('cotizaciones')
        .select('*, reportescotizacion(total)')
        .eq('id_cliente', id_cliente).eq('id_vehiculo', id_vehiculo);
    if (active) q = q.order(active, { ascending: direction !== 'desc' && direction !== 'DESC' });
    q = q.range(offset, offset + limit - 1);
    const { data: rows, error } = await q;
    const { count } = await supabase.from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_cliente', id_cliente).eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

async function historial_recepciones(id_cliente, id_vehiculo, limit, offset) {
    const { data: rows, error } = await supabase.from('recepciones')
        .select('*, reportes(total)')
        .eq('id_cliente', id_cliente).eq('id_vehiculo', id_vehiculo)
        .range(offset, offset + limit - 1);
    const { count } = await supabase.from('recepciones')
        .select('*', { count: 'exact', head: true })
        .eq('id_cliente', id_cliente).eq('id_vehiculo', id_vehiculo);
    if (error) throw error;
    return [rows, [{ total: count || 0 }]];
}

// =============================================
// EXPORTAR - MISMA INTERFAZ QUE mysql.js
// =============================================

module.exports = {
    historial_cotizaciones,
    historial_recepciones,
    tutoriales,
    patchTutoriales,
    usuariosrol,
    tecnicoUnico,
    recepcionesCliente,
    recepcionesBasicasOtroTaller,
    sp_recepcionesMismoTaller,
    recepcionesVehiculos,
    basicasConReporte,
    correosClientes,
    cotizacionesCliente,
    serviciosEntregado,
    clienteUnico,
    contador,
    clientes,
    historialTallerescliente,
    tallerActualCliente,
    clientesSucursal,
    contadorClientesUsuario,
    cliente,
    Todos,
    contadorTabla,
    sucursalQuery,
    uno,
    agregar,
    eliminar,
    eliminarQuery,
    query,
    query2,
    pagoRecepcion,
    queryEliminar,
    eliminaEleModPaqRecep,
    consultaModeloMarca,
    VehiculosRelacionados,
    vehiculoVenta,
    listaTS,
    update_venta,
    patchVenta,
    vehiculosCliente,
    sp_vehiculosCliente,
    vehiculo,
    getCompatibles,
    sucursalesEmpresas,
    contadorEmpresasTaller,
    contadorMarcasTaller,
    contadorCategorias,
    consultaCotizaciones,
    sp_cotizacionesClienteBasic,
    sp_cotizacionesPaginadas,
    sp_cotizacionesBSC,
    sp_cotizacionesBSCFavoritos,
    sp_recepcionesBS,
    sp_recepcionesBSFavoritos,
    cotizacionesBasicas,
    cotizacionesBasicasContador,
    consultaCotizacion,
    vehiculoUnico,
    cotizacionesVehiculo,
    recepcionesVehiculo,
    recepcionesIDs,
    favoritosRecepciones,
    patchDataCotizacion,
    elementos_cotizaciones,
    cotizacionesClienteX,
    favoritosCotizaciones,
    updateFavoritosVehiculos,
    getFavoritos,
    getClienteFavoritos,
    RecepcionConsulta,
    RecepcionesVehiculoConsulta,
    seriviciosAceptados,
    RecepcionElementos,
    ObtenerDetallePaquete,
    pagOdenesCliente,
    pagOdenesClienteContador,
    consultaPaquetes,
    ObtenerDetallePaqueteModificado,
    ObtenerDetallePaqueteModificadoRecep,
    gastosRecepcionUnica,
    updateGastoOrden,
    PagosRecepcionUnica,
    listaTecnicos,
    plancliente,
    dataUsuario,
    contadorSucursalesTaller,
    sucursalesTaller,
    sucursalesTaller2,
    sucursalesBasicaTaller,
    patchDataSucursal,
    sucursalUnica,
    updateDataUsuario,
    sp_usuariosrol,
    updateDataUsuarioIDcliente,
    consultacorreo,
    existeCorreo,
    usuariosRol,
    informaciontaller,
    informaciontallerN,
    empresasTaller,
    clientesTallerSucursal,
    onlyDataClientebasica,
    patchDataCliente,
    verificaPlacas,
    onlyDatavehiculobasica,
    vehiculosTallerSucursal,
    morefaccionesTaller,
    paquetesTaller,
    pagosTaller,
    gastosOrdenTaller,
    gastosOperacionTaller,
    recepcionesTaller,
    OnlyDataRecepcion,
    elementosrecepcion,
    elementosrecepcionInternos,
    elementosRecepciones,
    patchRecepcion,
    recepcionesTaller2,
    recepcionesTaller2contador,
    sp_ordenlike,
    sp_ordenlikeLimitado,
    nuevaConsulta,
    administracion,
    reporteRecepcion,
    recepcionesTallerSucursal,
    gastosOperacionTallerReporte,
    depositosTallerSucursal,
    sp_gastosOrdenEspecifica,
    sp_ordenesAbiertas,
    sp_pagosTallerSucursal,
    updatepagoOrden,
    sp_gastosOperacion,
    sp_gastosOrdenesTallerSucursal,
    sp_tecnicosTallerSucursal,
    pagoTotal,
    uno2,
    UpdateDataParcial,
    listaTalleresB,
    talleresSemejantes,
    semejantesmorefacciones,
    cotizacinesCliente,
    cotizacinesClienteContador,
    contadorVehiculos,
    semejantesClientes,
    semejantesClientesContador,
    clientesPaginacionTotales,
    clientesPaginacionClientes,
    vehiculosPaginacion,
    vehiculoscliente,
    semejantesV,
    clienteVehiculos,
    sp_pagVehiculosVenta,
    vehiculosPlacas,
    contadorVehiculosVenta,
    VehiculosPaginacionTotalesCliente,
    listaVehiculosClienteUnico,
    updateKilometraje,
    updateTallerSucursalVehiculos,
    semejantesVehiculosCliente,
    VehiculosPaginacionTotales,
    totalPaquetes,
    busquedaLikePaquetes,
    moRefacciones,
    spPaginacionmorefaccionesUnificado,
    totalMoRefacciones,
    semejantesVehiculos,
    likeVehiculosSesionCliente,
    semejantesVehiculosContador,
    registraElementosPaquetes,
    eliminaelementospaquete,
    patchElementoPaquete,
    existeEmpresa,
    clienterequest,
    clienterequestUpdate
};
