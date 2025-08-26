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
router.get('/histoTalleres', histoTalleres)
router.get('/tallerActualCliente/:id_cliente', tallerActualCliente)
router.get('/unicamentevehiculos/:id_cliente', unicamentevehiculos)
router.get('/onlyDataCliente/:id_cliente', onlyDataCliente)
router.get('/onlyDataClientebasica/:id_cliente', onlyDataClientebasica)
router.patch('/patchDataCliente/:id_cliente', patchDataCliente)
router.get('/:id_cliente', uno)

    async function histoTalleres (req, res, next){
        try {
            const {id_cliente, active, direction,limit, offset} = req.query
            const answer = await controlador.historialTallerescliente({id_cliente, active, direction,limit, offset})
            const datos = answer[0] || []; // Primer result set
            const total = answer[1][0]?.total || 0; // Segundo result set
            respuesta.success(req, res, { total, datos }, 200);
        } catch (error) { next(error) }
    }
    async function tallerActualCliente (req, res, next){
        try {
            const {id_cliente} = req.params
            const items = await controlador.tallerActualCliente(id_cliente)
            respuesta.success(req, res, items[0], 200)
        } catch (error) { next(error) }
    }

    async function clientes(req, res, next){
        try {
            const {semejantes,id_taller, id_sucursal, limit, offset, direction, active} = req.query
            const answer = await controlador.clientesPaginacionClientes({semejantes,id_taller, id_sucursal, limit, offset, direction, active})
            const datos = answer[0];
            const total = answer[1][0]?.total || [];
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
      const mismoTaller = parseInt(id_taller) === parseInt(data_cliente.id_taller)
      
      let cotizacionesCliente=[], recepcionesCliente=[], newCotizaciones=[]
    
      if(shouldIncludeHistory){

        if(mismoTaller){
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
      }
     
      respuesta.success(req, res, 
        {data_cliente, recepciones: recepcionesCliente, cotizaciones: newCotizaciones,mismoTaller },
        200);
    } catch (error) { next(error); }
  }

    
    async function unicamentevehiculos(req, res, next){
        try {
            const { id_cliente } = req.params;
            const vehiculosCliente = await vehiculos.vehiculosCiente(id_cliente)
            respuesta.success(req, res, vehiculosCliente, 200)
        } catch (error) { next(error) }
    }
    async function onlyDataCliente(req, res, next){
        try {
            const { id_cliente } = req.params;
            const data_cliente = await controlador.clienteUnico(id_cliente)
            respuesta.success(req, res, data_cliente, 200)
        } catch (error) { next(error) }
    }
    async function onlyDataClientebasica(req, res, next){
        try {
            const { id_cliente } = req.params;
            const data_cliente = await controlador.onlyDataClientebasica(id_cliente)
            respuesta.success(req, res, data_cliente, 200)
        } catch (error) { next(error) }
    }
    async function patchDataCliente(req, res, next){
        try {
            const { id_cliente } = req.params;
            const data_cliente = await controlador.patchDataCliente(id_cliente, req.body)
            respuesta.success(req, res, data_cliente, 200)
        } catch (error) { next(error) }
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
        const datos =  await controlador.semejantesClientes(req.query)
        const response =  await controlador.semejantesClientesContador(req.query)
        const {total} = response[0]
        
        respuesta.success(req, res, {datos, total}, 200)
    } catch (error) { next(error) }
}

module.exports = router