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
router.get('/recepcionesFechas', recepcionesFechas)
router.get('/administracion', administracion)
router.get('/pagRecepClientes', pagRecepClientes)
router.get('/recepcionesTaller', recepcionesTaller)
router.get('/recepcionesTaller2', recepcionesTaller2)
router.get('/coincidencias', coincidencias)
router.get('/aceptados', aceptados)
router.post('/', agregar)
router.patch('/update/:id_recepcion',updateRecepcion)
router.get('/vehiculos', RecepcionesVehiculoConsulta)
router.get('/recepcionesVehiculo/:id_vehiculo', recepcionesVehiculo)
router.get('/recepcionesClienteB/:id_cliente', recepcionesClienteB)
router.put('/', eliminar)
router.get('/:id_recepcion', uno)

async function recepcionesFechas(req, res, next){
    try {
        const items =  await controlador.recepcionesFechas(req.query)
        const {total} = await controlador.recepcionesFechasContador(req.query)
        respuesta.success(req, res, {total,  datos:items}, 200)
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


async function todos (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end, gastos} = req.query
        const items =  await controlador.recepcionesTallerSucursal(id_taller, id_sucursal, start, end)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function recepcionesClienteB (req, res, next){
    try {
        const {id_cliente} = req.params
        const {id_taller, mismo} = req.query
        let items = []
        if(mismo){
            items =  await controlador.sp_recepcionesMismoTaller(id_cliente, id_taller)
        }else{
            items =  await controlador.recepcionesBasicasOtroTaller(id_cliente, id_taller)
        }
        respuesta.success(req, res, items, 200)
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
async function uno(req, res, next){
    try {
        const {id_recepcion} = req.params        
        const recepcion = await controlador.getRecepcion(id_recepcion)
        const {id_tecnico} = recepcion
        if(id_tecnico){
            const {usuario} = await tecnicos.uno(id_tecnico)
            recepcion.tecnico = usuario
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