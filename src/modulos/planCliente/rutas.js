const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/planCliente', plancliente)
router.get('/:id', uno)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos()
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function uno(req, res, next){
    try {
        const items = await controlador.uno(req.params.id)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function plancliente(req, res, next){
    try {
        const items = await controlador.plancliente(req.query.id_usuario)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
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
module.exports = router