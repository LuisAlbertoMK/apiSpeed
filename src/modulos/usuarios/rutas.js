const express = require('express')
const seguridad = require('./seguridad')
const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/listaTecnicos/:id_sucursal', listaTecnicos)
router.get('/:id', uno)
// router.post('/', seguridad(), agregar)
router.post('/', agregar)
// router.put('/', seguridad(), eliminar)
router.put('/', eliminar)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos()
        respuesta.success(req, res, items[0], 200)
    } catch (error) {          
        next(error)
    }
}
async function listaTecnicos (req, res, next){
    try {
        const items =  await controlador.listaTecnicos(req.params.id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {          
        next(error)
    }
}
async function uno(req, res, next){
    try {
        const items = await controlador.uno(req.params.id_usuario)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {
        const {id_usuario} = req.body
        const items = await controlador.agregar(req.body)
        const regresaID = items || id_usuario
        respuesta.success(req, res, regresaID, 201)
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