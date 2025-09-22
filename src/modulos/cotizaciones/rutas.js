const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')
const clientes = require('../clientes')
const vehiculos = require('../vehiculos')
const elementos_cotizacion = require('../elementos_cotizacion')
const mod_paquetes = require('../mod_paquetes')
const sucursales = require('../sucursales')
const reportes = require('../reportecotizacion')


const router = express.Router()

// Rutas específicas primero
router.get('/basicas', basicas);
router.get('/historial', historial);
router.get('/detalles/:id_cotizacion', detalles);
router.get('/favoritos/:id_cliente', favoritos);
router.get('/getconsultaCotizacionUicaHistorial/:id_cotizacion', getconsultaCotizacionUicaHistorial);
router.get('/cliente/:id_cliente', cotizacionesCliente);
router.get('/pagCotCliente', pagCotCliente);
router.get('/no_cotizacion/:no_cotizacion', no_cotizacion);
router.get('/cotizacionesVehiculo/:id_vehiculo', cotizacionesVehiculo);
router.get('/cotizacionesClienteBasic', cotizacionesClienteBasic);
router.get('/sp_cotizacionesBSC', sp_cotizacionesBSC);
router.get('/sp_cotizacionesBSCFavoritos', sp_cotizacionesBSCFavoritos);
router.get('/sp_pagCotizacionesBSC', sp_pagCotizacionesBSC);

// Rutas con acciones de escritura
router.post('/', agregar);
router.patch('/update/:id_cotizacion', actualizaData);
router.put('/', eliminar);

// Ruta genérica al final
router.get('/', todos);
router.get('/:id_cotizacion', uno);


async function actualizaData(req, res, next){
    try {
        const {id_cotizacion} = req.params
        const data = req.body    
        const items = await controlador.patchDataCotizacion(id_cotizacion, data)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function basicas(req, res, next){
    try {
        const {id_taller, id_sucursal, active, direction, limit, offset,start, end, semejantes} = req.query
        const answer = await controlador.sp_cotizacionesPaginadas({id_taller, id_sucursal,semejantes,start,end, active, direction, limit, offset})
        const datos = answer[1] || [];
        const total = answer[0][0]?.total || 0;
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}
async function cotizacionesCliente(req, res, next){
    try {
        const {id_cliente} = req.params
        const {start, end, ids} = req.query
        const items = await controlador.cotizacionesCliente(id_cliente, start, end, ids)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function pagCotCliente(req, res, next){
    try {
        const datos = await controlador.pagCotCliente(req.query)
        const totalResponse = await controlador.pagCotClienteContador(req.query)
        const {total} = totalResponse
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}

async function todos (req, res, next){
    try {
        const items =  await controlador.todos(req.query)

        const nuevasCotizaciones = await Promise.all(items.map(async e => {
            const {id_cotizacion} = e
            const elementos = await elementos_cotizacion.uno(id_cotizacion)
            const newElementos = await Promise.all(elementos.map(async e => {
                if (e.id_paquete) {
                    const detallePaqueteResp = await mod_paquetes.ObtenerDetallePaqueteModificado(id_cotizacion, e['id_paquete'],e['id_eleCotizacion'] )
                    e['elementos'] = [...detallePaqueteResp];
                    e.nombre = detallePaqueteResp[0].paquete
                    e['tipo'] = 'paquete'
                }
                return e
            }))
            e['elementos'] = newElementos
            return e
        }))
        respuesta.success(req, res, nuevasCotizaciones, 200)
    } catch (error) {
        next(error)
    }
}

async function detalles (req, res, next){
    try {
        const {id_cotizacion} = req.params
        // const elementos = await elementos_cotizacion.uno(id_cotizacion)
        const elementos = await elementos_cotizacion.uno(id_cotizacion)
        const newElementos = await Promise.all(elementos.map(async e => {
                if (e.id_paquete) {
                    const detallePaqueteResp = await mod_paquetes.ObtenerDetallePaqueteModificado(id_cotizacion, e['id_paquete'],e['id_eleCotizacion'] )
                    e['elementos'] = [...detallePaqueteResp];
                    e.nombre = detallePaqueteResp[0].paquete
                    e['tipo'] = 'paquete'
                }
                return e
        }))
        respuesta.success(req, res, newElementos, 200)
    } catch (error) {
        next(error)
    }
}

async function historial(req, res, next){
    try {
        const {id_cliente, id_vehiculo, active, direction, limit, offset} = req.query
        const answer = await controlador.historial_cotizaciones({id_cliente, id_vehiculo, active, direction, limit, offset})
        const total = answer[1][0]?.total || 0; 
        const datos = answer[0] || [];
        respuesta.success(req, res,  { total, datos },  200)
    } catch (error) { next(error) }
}
async function no_cotizacion(req, res, next){
    try {
        const items = await controlador.no_cotizacion(req.params.no_cotizacion)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function cotizacionesVehiculo(req, res, next){
    try {
        const {id_vehiculo} = req.params
        const items = await controlador.cotizacionesVehiculo(id_vehiculo)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function cotizacionesClienteBasic(req, res, next){
    try {
        const {id_cliente, id_taller, id_sucursal, active, direction, limit, offset} = req.query
        const answer = await controlador.cotizacionesClienteBasic({id_cliente, id_taller, id_sucursal, active, direction, limit, offset})
        
        const datos = answer[0] || []; // Primer result set
        const total = answer[1][0]?.total || 0 ; // Segundo result set

        respuesta.success(req, res, { total, datos }, 200);
    } catch (error) {
        next(error)
    }
}
async function sp_cotizacionesBSC(req, res, next){
    try {
        // const {id_cliente, limit, offset} = req.query
        // const response = await controlador.sp_cotizacionesBSC(id_cliente, limit, offset)
        // const total = response[0]
        // const {total_registros} = total[0]
        respuesta.success(req, res, { total: 0, datos:[] }, 200)
    } catch (error) { next(error) }
}
async function sp_cotizacionesBSCFavoritos(req, res, next){
    try {
        const {id_cliente,semejantes ,active ,direction ,limit ,offset,id_vehiculos} = req.query
        const answer = await controlador.sp_cotizacionesBSCFavoritos( {id_cliente,semejantes ,active ,direction ,limit ,offset,id_vehiculos})
        const datos = answer[0] || []; // Primer result set
        const total = answer[1][0]?.total || 0 ; // Segundo result set

        respuesta.success(req, res, { total, datos }, 200)
    } catch (error) { next(error) }
}
async function sp_pagCotizacionesBSC(req, res, next){
    try {
        // const {id_cliente, limit, offset} = req.query
        // const response = await controlador.sp_pagCotizacionesBSC(id_cliente, limit, offset)
        // const total = response[0]
        // const {total_registros} = total[0]
        respuesta.success(req, res, { total: 0, datos: [] }, 200)
    } catch (error) { next(error) }
}

async function consultaCotizacion(req, res, next){
    try {
        const {id_cotizacion} = req.params
        const items = await controlador.consultaCotizacion(id_cotizacion)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {

        const items = await controlador.agregar(req.body)
        const {insertId} = items
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, insertId, 201)
    } catch (error) {
        next(error)
    }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) {
        next(error)
    }
}
async function favoritos(req, res, next){
    try {
        const {id_cliente} = req.params
        const {vehiculos} = req.query

        const items = await controlador.favoritosCotizaciones(id_cliente, vehiculos)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function uno(req, res, next){
    try {
        const {id_cotizacion} = req.params        
        const cotizacion = await controlador.consultaCotizacion(id_cotizacion)
        const {id_cliente, id_sucursal, id_vehiculo, id_taller} = cotizacion
        const data_cliente = await clientes.clienteUnico(id_cliente)
        const sucursal = await sucursales.sucursalUnica(id_taller, id_sucursal)
        const data_vehiculo = await vehiculos.vehiculoUnico(id_vehiculo)
        const elementos = await elementos_cotizacion.uno(id_cotizacion)
        const newElementos = await Promise.all(elementos.map(async e => {
            if (e.id_paquete) {
                const detallePaqueteResp = await mod_paquetes.ObtenerDetallePaqueteModificado(id_cotizacion, e['id_paquete'],e['id_eleCotizacion'] )
                e['elementos'] = [...detallePaqueteResp];
                e.nombre = detallePaqueteResp[0].paquete
                e['tipo'] = 'paquete'
            }
            return e
        }))

        const dataRecepcion = {...cotizacion, data_cliente, data_vehiculo, elementos: newElementos, 
            data_sucursal: sucursal[0]}

        respuesta.success(req, res, dataRecepcion, 200)
    } catch (error) { next(error) }
}
async function getconsultaCotizacionUicaHistorial(req, res, next){
    try {
        const {id_cotizacion} = req.params 
        const elementos = await elementos_cotizacion.uno(id_cotizacion)
        const newElementos = await Promise.all(
            elementos.map(async (e) => {
                if (e.id_paquete) {
                const detallePaqueteResp = await mod_paquetes.ObtenerDetallePaqueteModificado(
                    id_cotizacion,
                    e['id_paquete'],
                    e['id_eleCotizacion']
                );
                if (detallePaqueteResp && detallePaqueteResp.length > 0) {
                    e['elementos'] = [...detallePaqueteResp];
                    e.nombre = detallePaqueteResp[0].paquete || 'Paquete sin nombre';
                    e['tipo'] = 'paquete';
                }
                }
                return e;
            })
            );
        respuesta.success(req, res, newElementos, 200)
    } catch (error) { next(error) }
}
// cotizaciones.controller.js
// const getconsultaCotizacionUicaHistorial = async (req, res, next) => {
//   try {
//     const { id_cotizacion } = req.params;

//     // Validar id_cotizacion
//     if (!id_cotizacion || isNaN(parseInt(id_cotizacion))) {
//       return res.status(400).json({ error: 'ID de cotización inválido' });
//     }

//     const elementos = await elementos_cotizacion.uno(id_cotizacion);
//     if (!elementos || elementos.length === 0) {
//       return res.status(404).json({ error: 'Cotización no encontrada', total: 0, datos: [] });
//     }

//     const newElementos = await Promise.all(
//       elementos.map(async (e) => {
//         if (e.id_paquete) {
//           const detallePaqueteResp = await mod_paquetes.ObtenerDetallePaqueteModificado(
//             id_cotizacion,
//             e['id_paquete'],
//             e['id_eleCotizacion']
//           );
//           if (detallePaqueteResp && detallePaqueteResp.length > 0) {
//             e['elementos'] = [...detallePaqueteResp];
//             e.nombre = detallePaqueteResp[0].paquete || 'Paquete sin nombre';
//             e['tipo'] = 'paquete';
//           }
//         }
//         return e;
//       })
//     );

//     // Formato de respuesta compatible con el frontend
//     respuesta.success(req, res, { total: newElementos.length, datos: newElementos }, 200);
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = router