const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/ObtenerDetallePaqueteModificado', ObtenerDetallePaqueteModificado)
router.get('/ObtenerDetallePaqueteModificadoRecep', ObtenerDetallePaqueteModificadoRecep)
router.post('/recep', agregar2)
router.post('/', agregar)
router.put('/eliminaRelacionados', eliminaRelacionados)
router.put('/', eliminar)
router.get('/:id', uno)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos()
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function ObtenerDetallePaqueteModificado (req, res, next){
    try {
        const {id_cotizacion, id_paquete, id_eleRecepcion} = req.query
        const items =  await controlador.ObtenerDetallePaqueteModificado(id_cotizacion, id_paquete)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function ObtenerDetallePaqueteModificadoRecep (req, res, next){
    try {
        const items =  await controlador.ObtenerDetallePaqueteModificadoRecep(
            req.query.id_recepcion, req.query.id_paquete, req.query.id_eleRecepcion
        )
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function uno(req, res, next){
    try {
        console.log(req.params.id)
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
async function agregar2(req, res, next){
    try {
        const items = await controlador.agregar2(req.body)
        mensaje  =  (items.insertId == 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, items.insertId, 201)
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
async function eliminaRelacionados(req, res, next){
    try {
        const items = await controlador.eliminaRelacionados(req.body.id_eleRecepcion)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) {
        next(error)
    }
}
module.exports = router