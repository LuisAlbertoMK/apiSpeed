const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')

const vehiculos = require('../vehiculos')
const cotizaciones = require('../cotizaciones')
const recepciones = require('../recepciones')
const reportes = require('../reportes')

const router = express.Router()

router.get('/', clientes)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/clientesTallerSucursal', clientesTallerSucursal)
router.get('/contadorClientesUsuario', contadorClientesUsuario)
router.get('/semejantes', semejantes)
router.get('/clientesSucursal/:id_sucursal', clientesSucursal)
router.get('/:id_cliente', uno)

    async function clientes(req, res, next){
        try {
            const {id_taller, id_sucursal, limit, offset} = req.query
            const totalClientesResponse = await controlador.clientesPaginacionTotales({id_taller, id_sucursal})
            const ClientesResponse = await controlador.clientesPaginacionClientes({id_taller, id_sucursal, limit, offset})
            const datos = ClientesResponse
            const {total} = totalClientesResponse
            respuesta.success(req, res, {total, datos}, 200)
        } catch (error) { next(error) }
    }

async function todos (req, res, next){
    try {
        const {consulta, id_cliente, historial, } = req.query
        let items 
        if (consulta === 'uno') {
            items =  await controlador.clienteUnico(id_cliente)
        }else if(consulta === 'todos'){
            items =  await controlador.clientes()
        }
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function clientesSucursal (req, res, next){
    try {
        const items =  await controlador.clientesSucursal(req.params.id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function clientesTallerSucursal (req, res, next){
    try {
        const {id_taller, id_sucursal} = req.query
        const items =  await controlador.clientesTallerSucursal(id_taller, id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function contadorClientesUsuario (req, res, next){
    try {
        const items =  await controlador.contadorClientesUsuario(req.query.id_usuario)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function uno(req, res, next) {
    try {
      const { historial } = req.query;
      const { id_cliente } = req.params;
      const shouldIncludeHistory = historial === 'true';
      const [
        data_cliente,
        vehiculosCliente,
        cotizacionesCliente,
        recepcionesCliente,
      ] = await Promise.all([
        controlador.clienteUnico(id_cliente),
        shouldIncludeHistory ? vehiculos.vehiculosCiente(id_cliente) : [],
        shouldIncludeHistory ? cotizaciones.cotizacionesCliente(id_cliente) : [],
        shouldIncludeHistory ? recepciones.recepcionesCliente(id_cliente) : [],
      ]);
  

      const newCotizaciones  = await Promise.all(cotizacionesCliente.map(async cotizacion => {
        const {id_vehiculo, id_cotizacion} = cotizacion
        const data_vehiculo = await vehiculos.vehiculoUnico(id_vehiculo)
        const reporte = await reportes.uno(id_cotizacion);
        return {...cotizacion, data_vehiculo,reporte, data_cliente}
      }))
      const newRecepciones  = await Promise.all(recepcionesCliente.map(async recepcion => {
        const {id_vehiculo, id_recepcion} = recepcion
        const data_vehiculo = await vehiculos.vehiculoUnico(id_vehiculo)
        const reporte = await reportes.uno(id_recepcion);
        return {...recepcion, data_vehiculo,reporte, data_cliente}
      }))
      const items = shouldIncludeHistory
        ? {
            data_cliente,
            vehiculos: vehiculosCliente,
            cotizaciones:newCotizaciones,
            recepciones: newRecepciones,
          }
        : data_cliente;
  
      respuesta.success(req, res, items, 200);
    } catch (error) { next(error); }
  }
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        mensaje  =  (items.insertId) ? items.insertId : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}
async function semejantes (req, res, next){
    try {
        const items =  await controlador.semejantesClientes(req.query)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}

module.exports = router