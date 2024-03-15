const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/verificaPlacas', verificaPlacas)
router.get('/vehiculosTallerSucursal', vehiculosTallerSucursal)
router.get('/vehiculosCliente', vehiculosCliente)
router.get('/vehiculosCiente/:id_cliente', vehiculosCiente)
// router.get('/:id', uno)


async function todos (req, res, next){
    try {
        const {consulta, id_vehiculo} = req.query
        let items
        if (consulta === 'uno') {
            items = await controlador.vehiculoUnico(id_vehiculo)
        }else if(consulta === 'todos'){
            items =  await controlador.todos()
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
        const items =  await controlador.vehiculosTallerSucursal(id_taller, id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error)}
}
async function vehiculosCliente (req, res, next){
    try {
        const items =  await controlador.vehiculosCliente(req.query.id_cliente)
        respuesta.success(req, res, items[0], 200)
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
        const items = await controlador.uno(req.params.id)
        respuesta.success(req, res, items[0], 200)
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