const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')

const vehiculos = require('../vehiculos')
const cotizaciones = require('../cotizaciones')
const recepciones = require('../recepciones')

const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/clientesTallerSucursal', clientesTallerSucursal)
router.get('/contadorClientesUsuario', contadorClientesUsuario)
router.get('/clientesSucursal/:id_sucursal', clientesSucursal)
router.get('/:id_cliente', uno)

async function todos (req, res, next){
    try {
        const {consulta, id_cliente, historial} = req.query
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
  
      const items = shouldIncludeHistory
        ? {
            data_cliente,
            vehiculos: vehiculosCliente,
            cotizaciones:cotizacionesCliente,
            recepciones: recepcionesCliente,
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

module.exports = router