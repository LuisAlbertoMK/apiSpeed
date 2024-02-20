const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')

const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/clientesSucursal/:id_sucursal', clientesSucursal)
router.get('/:id_cliente', uno)

async function todos (req, res, next){
    try {
        const items =  await controlador.clientes()
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function clientesSucursal (req, res, next){
    try {
        const items =  await controlador.clientesSucursal(req.params.id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function uno(req, res, next){
    try {
        const items = await controlador.cliente(req.params.id_cliente)
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