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
const sucursales = require('../sucursales')


const router = express.Router()

router.get('/', servicios)
router.get('/recepcionesTaller', recepcionesTaller)
router.get('/recepcionesTaller2', recepcionesTaller2)
router.get('/aceptados', aceptados)
router.post('/', agregar)
router.get('/vehiculos', RecepcionesVehiculoConsulta)
router.put('/', eliminar)
router.get('/:id_recepcion', uno)


async function servicios(req, res, next) {
    try {
        const items =  await controlador.recepcionesTaller2(req.query)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}

async function todos (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end, gastos} = req.query
        const items =  await controlador.recepcionesTallerSucursal(id_taller, id_sucursal, start, end)
        respuesta.success(req, res, items[0], 200)
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
async function uno(req, res, next){
    try {
        const {id_recepcion} = req.params        
        const recepcion = await controlador.getRecepcion(id_recepcion)
        const {id_cliente, id_sucursal, id_vehiculo,id_taller} = recepcion
        const data_cliente = await clientes.clienteUnico(id_cliente)
        const data_vehiculo = await vehiculos.vehiculoUnico(id_vehiculo)
        const reporte = await reportes.uno(id_recepcion)
        const elementos = await elementos_recepcion.uno(id_recepcion)
        const gastosOrden = await gastos_orden.todosOrden(id_recepcion)
        const pagosOrden = await pagos_orden.PagosRecepcionUnica(id_recepcion)
        const sucursal = await sucursales.sucursalUnica(id_taller, id_sucursal)
        const newElementos = await Promise.all(elementos.map(async e => {
            if (e.id_paquete) {
                const detallePaqueteResp = await mod_paquetes.ObtenerDetallePaqueteModificadoRecep(id_recepcion, e['id_paquete'],e['id_eleRecepcion'] )
                e['elementos'] = [...detallePaqueteResp];
                e.nombre = detallePaqueteResp[0].paquete
                e['tipo'] = 'paquete'
            }
            return e
        }))

        const dataRecepcion = 
        {
            ...recepcion, data_cliente, data_vehiculo, reporte, 
            elementos: newElementos, gastosOrden, pagosOrden,
            data_sucursal: sucursal[0]
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
async function recepcionesCliente(id_cliente) {
    try {
        const items =  await controlador.recepcionesCliente(id_cliente)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}

module.exports = router