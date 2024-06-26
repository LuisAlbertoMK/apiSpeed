const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')

const vehiculos = require('../vehiculos')
const cotizaciones = require('../cotizaciones')
const recepciones = require('../recepciones')

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
            const clientes = ClientesResponse
            const {total} = totalClientesResponse
            respuesta.success(req, res, {total, clientes}, 200)
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
        const {id_vehiculo} = cotizacion
        const data_vehiculo = await vehiculos.vehiculoUnico(id_vehiculo)
        return {...cotizacion, data_vehiculo}
      }))
      const newRecepciones  = await Promise.all(recepcionesCliente.map(async recepcion => {
        const {id_vehiculo} = recepcion
        const data_vehiculo = await vehiculos.vehiculoUnico(id_vehiculo)
        return {...recepcion, data_vehiculo}
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
        const {semejantes, id_taller, id_sucursal, limite: limiteQ} = req.query
        const limite = limiteQ || 20
        const items =  await controlador.semejantesClientes({semejantes, id_taller,id_sucursal, limite})
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}

module.exports = router