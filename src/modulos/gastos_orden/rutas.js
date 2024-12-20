const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todosOrden)
router.get('/todosFechas', todosFechas)
router.get('/gastosOrdenTaller', gastosOrdenTaller)
router.get('/recepcion/:id_recepcion', gastosRecepcion)
router.post('/', agregar)
// router.put('/', eliminar)
router.patch('/:id_gastoOrden', updategastoOrden)
router.get('/:id_recepcion', uno)
router.delete('/', eliminar)



async function todosFechas (req, res, next){
    try {
        const items =  await controlador.todosFechas(req.query)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}


async function todosOrden (req, res, next){
    try {
        const items =  await controlador.sp_gastosOrdenEspecifica(1)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function gastosOrdenTaller (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end}= req.query
        const items =  await controlador.gastosOrdenTaller(id_taller, id_sucursal, start, end)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}

async function gastosRecepcion (req, res, next){
    try {
        const items =  await controlador.gastosRecepcion(req.params.id_recepcion)
        
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function uno(req, res, next){
    try {
        const items = await controlador.uno(req.params.id_recepcion)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        // mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        const {insertId} = items
        const {id_pagoOrden} = req.body
        mensaje  =  insertId ? insertId : id_pagoOrden
        respuesta.success(req, res, items.insertId, 201)
    } catch (error) { next(error) }
}
async function updategastoOrden(req, res, next){
    try {
        const {id_gastoOrden} = req.params
        const body = req.body
        const items = await controlador.updateGastoOrden(id_gastoOrden, body)
        respuesta.success(req, res, 'item actualizado', 200)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const {id_gastoOrden} = req.query
        const items = await controlador.eliminar(id_gastoOrden)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}
module.exports = router