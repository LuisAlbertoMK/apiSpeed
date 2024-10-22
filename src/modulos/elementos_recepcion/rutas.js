const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/:id_recepcion', uno)
router.post('/', agregar)
router.delete('/:id_eleRecepcion', eliminar);


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
        const {id_recepcion} = req.params
        const items = await controlador.uno(id_recepcion)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        mensaje  =  (items.insertId === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, items.insertId, 201)
    } catch (error) {
        next(error)
    }
}
async function eliminar(req, res, next){
    try {
        const {id_eleRecepcion} = req.params
        const items = await controlador.eliminar(id_eleRecepcion)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) {
        next(error)
    }
}
module.exports = router