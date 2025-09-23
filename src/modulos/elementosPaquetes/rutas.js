const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/:id', uno)
router.post('/', agregar)
router.post('/registraElementosVarios', registraElementosVarios)
router.delete('/eliminaelementospaquete', eliminaelementospaquete)
router.put('/', eliminar)
router.patch('/update', updateelemento)
// router.put('/categoria', categoria)


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
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
    } catch (error) {
        next(error)
    }
}
async function registraElementosVarios(req, res, next){
    try {
        const items = await controlador.registraElementosVarios(req.body)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function eliminaelementospaquete(req, res, next){
    try {
        const {id_paquete, ids_to_delete} = req.body
        const items = await controlador.eliminaelementospaquete(id_paquete, ids_to_delete)
        respuesta.success(req, res, 'eliminacion correcta', 201)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) {
        next(error)
    }
}
async function updateelemento(req, res, next){
    try {
        const items = await controlador.patchElementoPaquete(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) {
        next(error)
    }
}

module.exports = router