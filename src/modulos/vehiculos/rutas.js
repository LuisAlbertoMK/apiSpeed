const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')

const clientes = require('../clientes')
const cotizaciones = require('../cotizaciones')
const recepciones = require('../recepciones')
const elementos_recepcion = require('../elementos_recepcion')
const mod_paquetes = require('../mod_paquetes')
const reportes = require('../reportes')

const router = express.Router()

router.get('/', vehiculos)
router.post('/', agregar)
router.post('/ventaVehiculo', ventaVehiculo)
router.patch('/', updateKilometraje)
router.patch('/updateTallerSucursalVehiculos/:id_cliente', updateTallerSucursalVehiculos)
router.put('/', eliminar)
router.get('/semejantes', semejantes)
router.get('/ventaVehiculoUnico/:id_vehiculo', ventaVehiculoUnico)
router.get('/listaVehiculosClienteUnico/:id_cliente', listaVehiculosClienteUnico)
router.get('/verificaPlacas', verificaPlacas)
router.get('/vehiculosTallerSucursal', vehiculosTallerSucursal)
router.get('/vehiculosCliente', vehiculosCliente)
router.get('/clienteVehiculos', clienteVehiculos)
router.get('/vehiculosenventa', vehiculosenventa)
router.get('/vehiculosCiente/:id_cliente', vehiculosCiente)
router.get('/historialVehiculo/:id_vehiculo', historialVehiculo)
router.get('/fulldata/:id_vehiculo', vehiculo)
router.get('/:id_vehiculo', uno)

async function semejantes (req, res, next){
    try {
        const datos =  await controlador.semejantesVehiculos(req.query)
        const response =  await controlador.semejantesVehiculosContador(req.query)
        const {total} = response[0]
        respuesta.success(req, res, {datos, total}, 200)
    } catch (error) { next(error) }
}
async function vehiculo (req, res, next){
    try {
        const {id_vehiculo} = req.params
        const items =  await controlador.vehiculo(id_vehiculo)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function ventaVehiculoUnico (req, res, next){
    try {
        const {id_vehiculo} = req.params
        const items =  await controlador.ventaVehiculoUnico(id_vehiculo)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function listaVehiculosClienteUnico (req, res, next){
    try {
        const {id_cliente} = req.params

        const items =  await controlador.listaVehiculosClienteUnico(id_cliente)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function clienteVehiculos (req, res, next){
    try {
        const {id_cliente, limit, offset} = req.query
        const datos = await controlador.clienteVehiculos({id_cliente, limit, offset})
        const totalVehiculosResponse = await controlador.VehiculosPaginacionTotalesCliente(id_cliente)
        const {total} = totalVehiculosResponse
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}
async function vehiculosenventa (req, res, next){
    try {
        const {limit, offset} = req.query
        const datos = await controlador.sp_pagVehiculosVenta({limit, offset})
        const totalVehiculosResponse = await controlador.contadorVehiculosVenta()
        const {total} = totalVehiculosResponse
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}
async function updateKilometraje(data) {
    const {id_vehiculo, kilometraje} = data
    try {
        const response = await controlador.updateKilometraje({id_vehiculo, kilometraje})
        respuesta.success(req, res, response, 200)
    } catch (error) {
        
    }
}
async function updateTallerSucursalVehiculos(req, res, next) {
    const {id_cliente} = req.params
    const {id_taller, id_sucursal} = req.query
    try {
        const response = await controlador.updateTallerSucursalVehiculos({id_cliente, id_taller, id_sucursal})
        respuesta.success(req, res, response, 200)
    } catch (error) {  next(error) }
}

async function vehiculos(req, res, next){
    try {
        const  {total} = await controlador.VehiculosPaginacionTotales(req.query)
        const vehiculos = await controlador.vehiculosPaginacion(req.query)
        
        const datos = await Promise.all(vehiculos.map(async vehiculo => {
            const {id_cliente} = vehiculo
            const data_cliente = await clientes.clienteUnico(id_cliente)
            return {...vehiculo, data_cliente}
        }))
        
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}

async function todos (req, res, next){
    try {
        const {consulta, id_vehiculo} = req.query
        let items
        if (consulta === 'uno') {
            items = await controlador.vehiculoUnico(id_vehiculo)
        }else if(consulta === 'todos'){
            const vehiculos =  await controlador.todos()
            const promesas = vehiculos.map(async element => {
                let asigna ={ ...element };
                const { id_cliente } = element;
                asigna['data_cliente'] = await  clientes.clienteUnico(id_cliente)
                return asigna
            })
            const resultados = await Promise.all(promesas);
            // return resultados
            items = resultados
        }
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error)}
}
async function verificaPlacas (req, res, next){
    try {
        const {placas}= req.query
        const items =  await controlador.verificaPlacas(placas)
        
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error)}
}
async function vehiculosTallerSucursal (req, res, next){
    try {
        const {id_taller, id_sucursal}= req.query
        
        let  temps =  await controlador.vehiculosTallerSucursal(id_taller, id_sucursal)
        
        const respuestas = temps[0]
        // const vehiculos =  await controlador.todos()
            const promesas = respuestas.map(async element => {
                let asigna ={ ...element };
                const { id_cliente } = element;
                asigna['data_cliente'] = await  clientes.clienteUnico(id_cliente)
                return asigna
            })
            const resultados = await Promise.all(promesas);
            // return resultados
        const items = resultados
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error)}
}
async function vehiculosCliente (req, res, next){
    try {
        const items =  await controlador.vehiculosCliente(req.query.id_cliente)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error)}
}
async function vehiculosCiente (req, res, next){
    try {
        const items =  await controlador.vehiculosCiente(req.params.id_cliente)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error)}
}
async function historialVehiculo (req, res, next){
    try {
        const {id_vehiculo} = req.params
        const data_vehiculo =  await controlador.vehiculoUnico(id_vehiculo)
        const id_cliente = data_vehiculo.id_cliente;
        const data_cliente =  await clientes.clienteUnico(id_cliente)
        const ansCotizaciones = await cotizaciones.cotizacionesVehiculo(id_vehiculo)
        const asnRecepciones = await recepciones.recepcionesVehiculo(id_vehiculo)
        const conReportes = await Promise.all(ansCotizaciones.map(async e => {
            const {id_cotizacion} = e
            const reporte = await reportes.uno(id_cotizacion);
            return {...e, reporte}
        }))
        const conReportesRecepciones = await Promise.all(asnRecepciones.map(async e => {
            const {id_recepcion} = e
            const reporteResponse = await recepciones.reporteRecepcion(id_recepcion)
            const reporte = reporteResponse
            return {...e, reporte}
        }))
        respuesta.success(req, res, 
            {data_vehiculo, data_cliente, cotizaciones: conReportes, recepciones: conReportesRecepciones},
            200)
    } catch (error) { next(error)}
}
async function uno(req, res, next){
    try {
        const {historial} = req.query
        const historialBoolean = (historial === 'true')
        const { id_vehiculo} = req.params
        let data_vehiculo = await controlador.vehiculoUnico(id_vehiculo)
        items = data_vehiculo
        if (historialBoolean) {
            const id_cliente = data_vehiculo.id_cliente;
            const [data_cliente, cotizacionesCliente, recepcionesCliente] = await Promise.all([
            clientes.clienteUnico(id_cliente),
            cotizaciones.cotizacionesCliente(id_cliente),
            recepciones.recepcionesCliente(id_cliente)
            ]);

            const newRecepciones = await Promise.all(recepcionesCliente.map(async recepcion => {
                const {id_recepcion} = recepcion
                const elementos = await elementos_recepcion.uno(id_recepcion)
                const newElementos = await Promise.all(elementos.map(async e => {
                    if (e.id_paquete) {
                        const detallePaqueteResp = await mod_paquetes.ObtenerDetallePaqueteModificadoRecep(id_recepcion, e['id_paquete'],e['id_eleRecepcion'] )
                        e['elementos'] = [...detallePaqueteResp];
                        e.nombre = detallePaqueteResp[0].paquete
                        e['tipo'] = 'paquete'
                    }
                    return e
                }))
                recepcion['elementos'] = newElementos
                return recepcion
            }))

            items = { 
                data_cliente, data_vehiculo, 
                cotizaciones: cotizacionesCliente, recepciones: newRecepciones 
            }
        }
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
    
}
async function agregar(req, res, next){
    try {
        const {id_vehiculo} = req.body
        const items = await controlador.agregar(req.body)
        mensaje  =  (items.insertId) ? items.insertId : id_vehiculo
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function ventaVehiculo(req, res, next){
    try {
        const {id_vehiculo} = req.body
        const items = await controlador.ventaVehiculo(req.body)
        mensaje  =  (items.insertId) ? items.insertId : id_vehiculo
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}
module.exports = router