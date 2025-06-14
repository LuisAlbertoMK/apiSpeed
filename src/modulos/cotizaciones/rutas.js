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

router.get('/', todos)
router.get('/basicas', basicas)
router.get('/favoritos/:id_cliente', favoritos)
router.get('/cliente/:id_cliente', cotizacionesCliente)
router.get('/pagCotCliente', pagCotCliente)
router.post('/', agregar)
router.patch('/update/:id_cotizacion', actualizaData )
router.put('/', eliminar)
router.get('/no_cotizacion/:no_cotizacion', no_cotizacion)
router.get('/cotizacionesVehiculo/:id_vehiculo', cotizacionesVehiculo )
router.get('/cotizacionesClienteBasic', cotizacionesClienteBasic )
router.get('/:id_cotizacion', uno)


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
        const datos = await controlador.cotizacionesBasicas(req.query)
        const {total} = await controlador.cotizacionesBasicasContador(req.query)
        respuesta.success(req, res, {total, datos: datos}, 200)
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
        const {id_cliente, id_taller} = req.query
        const items = await controlador.cotizacionesClienteBasic(id_cliente, id_taller)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
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
module.exports = router