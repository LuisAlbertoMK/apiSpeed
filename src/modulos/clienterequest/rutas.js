const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/:id_cliente', uno)
router.post('/clienterequestAdd', agregar)
router.put('/', eliminar)
router.patch('/clienterequestUpdate/:id_request', clienterequestUpdate)


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
        const {id_cliente} = req.params
        const {busqueda} = req.query
        const items = await controlador.clienter(id_cliente, busqueda)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {
        const {request_count, busqueda, id_cliente,request_limit} = req.body
        const dataRowRequest = {
            request_count, 
            id_cliente,
            request_type: busqueda,
            request_limit,
            request_date: new Date()
        }
        const items = await controlador.agregar(dataRowRequest)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
    } catch (error) {
        next(error)
    }
}
async function clienterequestUpdate(req, res, next){
    try {
        const {id_request} = req.params
        const {request_count, busqueda} = req.body
        const items = await controlador.clienterequestUpdate(id_request, request_count, busqueda)
        
        respuesta.success(req, res, items, 201)
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