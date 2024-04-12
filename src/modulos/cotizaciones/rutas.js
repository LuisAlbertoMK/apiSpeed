const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')
const clientes = require('../clientes')
const vehiculos = require('../vehiculos')
const elementos_cotizacion = require('../elementos_cotizacion')
const mod_paquetes = require('../mod_paquetes')
const sucursales = require('../sucursales')


const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/no_cotizacion/:no_cotizacion', no_cotizacion)
router.get('/:id_cotizacion', uno)


async function todos (req, res, next){
    try {
        const {start, end} = req.query
        const items =  await controlador.todos(start, end)
        respuesta.success(req, res, items, 200)
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
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, items, 201)
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