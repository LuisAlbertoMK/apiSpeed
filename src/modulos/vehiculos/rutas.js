const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')

const clientes = require('../clientes')
const cotizaciones = require('../cotizaciones')
const recepciones = require('../recepciones')


const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/verificaPlacas', verificaPlacas)
router.get('/vehiculosTallerSucursal', vehiculosTallerSucursal)
router.get('/vehiculosCliente', vehiculosCliente)
router.get('/vehiculosCiente/:id_cliente', vehiculosCiente)
router.get('/:id_vehiculo', uno)


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
        // console.log({respuestas: respuestas[0]});
        const respuestas = temps[0]
        // const vehiculos =  await controlador.todos()
            const promesas = respuestas.map(async element => {
                let asigna ={ ...element };
                const { id_cliente } = element;
                console.log({id_cliente});
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
            items = { 
                data_cliente, data_vehiculo, 
                cotizaciones: cotizacionesCliente, recepciones: recepcionesCliente 
            }
        }
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
    
}
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
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