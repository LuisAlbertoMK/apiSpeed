const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')
const clientes = require('../clientes')
const vehiculos = require('../vehiculos')
const reportes = require('../reportes')
const elementos_recepcion = require('../elementos_recepcion')
const mod_paquetes = require('../mod_paquetes')
const gastos_orden = require('../gastos_orden')
const pagos_orden = require('../pagos_orden')
const tecnicos = require('../tecnicos')
const sucursales = require('../sucursales')


const router = express.Router()

router.get('/', servicios)
router.get('/historialVehiculo', historialVehiculo)
router.get('/recepcionesFechas', recepcionesFechas)
router.get('/administracion', administracion)
router.get('/favoritos/:id_cliente', favoritos)
router.get('/pagRecepClientes', pagRecepClientes)
router.get('/nuevaConsulta', nuevaConsulta)
router.get('/recepcionesVehiculos', recepcionesVehiculos)
router.get('/recepcionesTaller', recepcionesTaller)
router.get('/recepcionesTaller2', recepcionesTaller2)
router.get('/coincidencias', coincidencias)
router.get('/sp_ordenlikeLimitado', sp_ordenlikeLimitado)
router.get('/aceptados', aceptados)
router.get('/recepcionesIDs', recepcionesIDs)
router.get('/sp_recepcionesBS', sp_recepcionesBS)
router.get('/sp_recepcionesBSFavoritos', sp_recepcionesBSFavoritos)
router.post('/', agregar)
router.patch('/update/:id_recepcion',updateRecepcion)
router.get('/vehiculos', RecepcionesVehiculoConsulta)
router.get('/recepcionesVehiculo/:id_vehiculo', recepcionesVehiculo)
router.get('/recepcionesClienteB', recepcionesClienteB)
router.get('/consultaRecepcionUicaHistorial/:id_recepcion', consultaRecepcionUicaHistorial)
router.put('/', eliminar)
router.get('/onlyData/:id_recepcion', OnlyData)
router.get('/elementosRecepciones/:id_recepcion', elementos)
router.get('/:id_recepcion', uno)



async function historialVehiculo(req, res, next){
    try {
        const {id_cliente, id_vehiculo, limit, offset} = req.query
        const response = await controlador.historial_recepciones(id_cliente, id_vehiculo, limit, offset)
        const total = response[0]
        const {total_registros} = total[0]
        respuesta.success(req, res, 
            { total: total_registros, datos: response[1] }, 
            200)
    } catch (error) { next(error) }
}
async function OnlyData(req, res, next){
    try {
        const {id_recepcion} = req.params        
        const recepcion = await controlador.OnlyData(id_recepcion)
        const  {id_cliente, id_vehiculo } = recepcion[0]
        const data_cliente = await clientes.onlyDataClientebasica(id_cliente)
        const data_vehiculo = await vehiculos.onlyDatavehiculobasica(id_vehiculo)

        const elementos1 = await elementos_recepcion.elementosrecepcion(id_recepcion)

        const elementos = await Promise.all(elementos1.map(async e => {
            const  {tipo, id_paquete,nombrePaquete,tipoPaquete } = e
            if(tipoPaquete && tipoPaquete === 'paquete'){
                const elementosInternos= await elementos_recepcion.elementosrecepcionInternos(id_recepcion, id_paquete)
                e['elementos'] = [...elementosInternos]
                e['tipo'] = 'paquete'
                e['nombre'] = nombrePaquete
            }
            return e
        }))

        const data = {...recepcion[0], data_cliente, data_vehiculo, elementos}
        respuesta.success(req, res, data , 200)
    } catch (error) { next(error) }
}
async function elementos(req, res, next){
    try {
        const {id_recepcion} = req.params        
        const recepcion = await controlador.elementos(id_recepcion)
        respuesta.success(req, res, recepcion , 200)
    } catch (error) { next(error) }
}
async function recepcionesFechas(req, res, next){
    try {
        const answer =  await controlador.recepcionesFechas(req.query)
        const datos = answer[0] || [];
        const total = answer[1][0]?.total || 0;
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}
async function recepcionesIDs(req, res, next){
    try {
        const  {id_cliente,idsStrings, startDate, endDate} = req.query
        const items =  await controlador.recepcionesIDs(id_cliente,idsStrings,startDate, endDate)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function sp_recepcionesBS(req, res, next){
    try {
           const {id_cliente, limit, offset} = req.query
           const response = await controlador.sp_recepcionesBS(id_cliente, limit, offset)
           const total = response[0]
           const {total_registros} = total[0]
           respuesta.success(req, res, { total: total_registros, datos: response[1] }, 200)
       } catch (error) { next(error) }
}
async function sp_recepcionesBSFavoritos(req, res, next){
    try {
            const {id_cliente,semejantes ,active ,direction ,limit ,offset,id_vehiculos} = req.query
            const answer = await controlador.sp_recepcionesBSFavoritos({id_cliente,semejantes ,active ,direction ,limit ,offset,id_vehiculos})
            const datos = answer[0] || []; // Primer result set
            const total = answer[1][0]?.total || 0 ; // Segundo result set
            respuesta.success(req, res, { total, datos }, 200)
       } catch (error) { next(error) }
}
async function servicios(req, res, next) {
    try {
        const items =  await controlador.recepcionesTaller2(req.query)
        const conReportes = await Promise.all(items.map(async e => {
            const {id_recepcion} = e
            const reporteResponse = await controlador.reporteRecepcion(id_recepcion)
            const reporte = reporteResponse
            return {...e, reporte}
        }))
        const totalResponse = await controlador.recepcionesTaller2contador(req.query)
        const {total} = totalResponse
        respuesta.success(req, res, {total,  datos:conReportes}, 200)
    } catch (error) { next(error) }
}
async function administracion(req, res, next) {
    try {
        const items =  await controlador.administracion(req.query)
        const conReportes = await Promise.all(items.map(async e => {
            const {id_recepcion} = e
            const reporteResponse = await controlador.reporteRecepcion(id_recepcion)
            const reporte = reporteResponse
            return {...e, reporte}
        }))
        respuesta.success(req, res, conReportes, 200)
    } catch (error) { next(error) }
}
async function pagRecepClientes(req, res, next) {
    try {
        const datos = await controlador.pagOdenesCliente(req.query)
        const totalResponse = await controlador.pagOdenesClienteContador(req.query)
        const {total} = totalResponse
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}
async function nuevaConsulta(req, res, next) {
    try {
        const {start, end, id_taller, id_sucursal} = req.query
        const totalReportes = await controlador.nuevaConsulta({start,end,id_taller, id_sucursal})
        const {total} = totalReportes;
        respuesta.success(req, res, {total}, 200)
    } catch (error) { next(error) }
}
async function recepcionesVehiculos(req, res, next) {
    try {
        const {id_vehiculo, id_sucursal, id_taller, active, direction, limit, offset} = req.query
        const answer = await controlador.recepcionesVehiculos({id_vehiculo, id_sucursal, id_taller, active, direction, limit, offset})

        const datos = answer[0] || []; // Primer result set
        const total = answer[1][0]?.total || 0 ; // Segundo result set
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}
async function favoritos(req, res, next){
    try {
        const {id_cliente} = req.params
        const {vehiculos} = req.query

        const items = await controlador.favoritosRecepciones(id_cliente, vehiculos)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}

async function todos (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end, gastos} = req.query
        const items =  await controlador.recepcionesTallerSucursal(id_taller, id_sucursal, start, end)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function recepcionesClienteB (req, res, next){
    try {
        const {id_cliente, id_taller, id_sucursal, active, direction, limit, offset} = req.query
        const answer = await controlador.sp_recepcionesMismoTaller({id_cliente, id_taller, id_sucursal, active, direction, limit, offset})
        const datos = answer[0] || []; // Primer result set
        const total = answer[1][0]?.total || 0 ; // Segundo result set
        respuesta.success(req, res, { total, datos }, 200);
    } catch (error) { next(error) }
}
async function recepcionesTaller (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end} = req.query
        const items =  await controlador.recepcionesTaller(id_taller, id_sucursal, start, end)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function recepcionesTaller2 (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end, gastos} = req.query
        const items =  await controlador.recepcionesTaller2(id_taller, id_sucursal, start, end, gastos)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function aceptados (req, res, next){
    try {
        const {id_taller, id_sucursal } = req.query
        const items =  await controlador.aceptados(id_taller,id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function coincidencias (req, res, next){
    try {
        const {id_taller, semejantes,id_sucursal } = req.query
        const items =  await controlador.sp_ordenlike(id_taller,id_sucursal,semejantes)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function sp_ordenlikeLimitado (req, res, next){
    try {
        const {id_taller, semejantes,id_sucursal } = req.query
        const items =  await controlador.sp_ordenlikeLimitado({id_taller,id_sucursal,semejantes})
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function uno(req, res, next){
    try {
        const {id_recepcion} = req.params        
        const recepcion = await controlador.getRecepcion(id_recepcion)
        const {id_tecnico} = recepcion
        if(id_tecnico){
            // const {usuario} = await tecnicos.uno(id_tecnico)
            const miUsuario = await tecnicos.uno(id_tecnico)
            if(miUsuario){
                recepcion.tecnico = miUsuario?.usuario
            }
        }
        const {id_cliente, id_sucursal, id_vehiculo,id_taller} = recepcion
        const data_cliente = await clientes.clienteUnico(id_cliente)
        const data_vehiculo = await vehiculos.vehiculoUnico(id_vehiculo)
        const reporte = await reportes.uno(id_recepcion)
        const elementos = await elementos_recepcion.uno(id_recepcion)
        const gastosOrden = await gastos_orden.todosOrden(id_recepcion)
        const pagosOrden = await pagos_orden.PagosRecepcionUnica(id_recepcion)
        const sucursal = await sucursales.sucursalUnica(id_taller, id_sucursal)
        
        const newElementos = await Promise.all(elementos.map(async e => {
            if (e.id_paquete > 0) {
                const detallePaqueteResp = 
                await mod_paquetes.ObtenerDetallePaqueteModificadoRecep(id_recepcion, e['id_paquete'],e['id_eleRecepcion'] )
                e['elementos'] = [...detallePaqueteResp];
                e.nombre = detallePaqueteResp[0]?.paquete
                e['tipo'] = 'paquete'
            }
            return e
        }))
        const dataRecepcion = 
        {
            ...recepcion, data_cliente, data_vehiculo:{}, reporte, 
            elementos: newElementos, gastosOrden, pagosOrden,
            data_sucursal: sucursal[0]
        }
        const {id_cliente: idVOb} = data_vehiculo
        if(idVOb === id_cliente){
            dataRecepcion.data_vehiculo = data_vehiculo
        }
        respuesta.success(req, res, dataRecepcion, 200)
    } catch (error) { next(error) }
}

async function consultaRecepcionUicaHistorial(req, res, next){
    try {
        const {id_recepcion} = req.params
        const elementos = await elementos_recepcion.uno(id_recepcion)
        
        const newElementos = await Promise.all(elementos.map(async e => {
            if (e.id_paquete > 0) {
                const detallePaqueteResp = 
                await mod_paquetes.ObtenerDetallePaqueteModificadoRecep(id_recepcion, e['id_paquete'],e['id_eleRecepcion'] )
                e['elementos'] = [...detallePaqueteResp];
                e.nombre = detallePaqueteResp[0]?.paquete
                e['tipo'] = 'paquete'
            }
            return e
        }))
        
        respuesta.success(req, res, newElementos, 200)
    } catch (error) { next(error) }
}
async function agregar(req, res, next){
    try {
        const ans = await controlador.agregar(req.body)
        const {insertId } = ans
        mensaje  =   (req.body.id_recepcion === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, insertId, 201)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}
async function RecepcionesVehiculoConsulta(req, res, next){
    try {
        const items = await controlador.RecepcionesVehiculoConsulta(req.query.id_vehiculo)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, items, 201)
    } catch (error) { next(error) }
}
async function recepcionesVehiculo(req, res, next){
    try {
        const {id_vehiculo} = req.params
        const items = await controlador.recepcionesVehiculo(id_vehiculo)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function recepcionesCliente(id_cliente) {
    try {
        const items =  await controlador.recepcionesCliente(id_cliente)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}

async function updateRecepcion(req, res, next){
    try {
        const {id_recepcion} = req.params
        const data = req.body    
        const items = await controlador.patchRecepcion(id_recepcion, data)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}

module.exports = router