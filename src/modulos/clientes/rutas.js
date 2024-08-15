const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')

const vehiculos = require('../vehiculos')
const cotizaciones = require('../cotizaciones')
const recepciones = require('../recepciones')
const reportes = require('../reportes')
const reportecotizacion = require('../reportecotizacion')
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
      const { historial, id_taller } = req.query;
      const { id_cliente } = req.params;
      const shouldIncludeHistory = historial === 'true';
      const data_cliente = await controlador.clienteUnico(id_cliente)
      const mismoTaller = parseInt(id_taller) !== parseInt(data_cliente.id_taller)
      const vehiculosCliente = await vehiculos.vehiculosCiente(id_cliente)
      let cotizacionesCliente=[], recepcionesCliente=[], newCotizaciones=[]
    
      if(shouldIncludeHistory && mismoTaller){
        cotizacionesCliente = await cotizaciones.cotizacionesCliente(id_cliente)
      }
      const recepcionesAns = await recepciones.recepcionesCliente(id_cliente)
      recepcionesCliente = recepcionesAns
      newCotizaciones = cotizacionesCliente
      if(mismoTaller){
        recepcionesCliente  = await Promise.all(recepcionesAns.map(async recepcion => {
            const {id_recepcion} = recepcion
            const reporte = await reportes.uno(id_recepcion);
            return {...recepcion, reporte, data_cliente}
        }))
        newCotizaciones  = await Promise.all(cotizacionesCliente.map(async cotizacion => {
            const { id_cotizacion} = cotizacion
            const reporte = await reportecotizacion.uno(id_cotizacion);
            return {...cotizacion,reporte, data_cliente}
          }))
      }
     
      respuesta.success(req, res, 
        {data_cliente, vehiculos: vehiculosCliente, 
            recepciones: recepcionesCliente, cotizaciones: newCotizaciones,mismoTaller },
        200);
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