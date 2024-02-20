const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.get('/vehiculos', RecepcionesVehiculoConsulta)
router.put('/', eliminar)
router.get('/:id_recepcion', uno)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos(req.query.start, req.query.end)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function uno(req, res, next){
    try {
        const items = await controlador.getRecepcion(req.params.id_recepcion)
        console.log(items[0]);
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {
        const ans = await controlador.agregar(req.body)
        const {insertId } = ans
        mensaje  =   (req.body.id_recepcion === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, insertId, 201)
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
async function RecepcionesVehiculoConsulta(req, res, next){
    try {
        const items = await controlador.RecepcionesVehiculoConsulta(req.query.id_vehiculo)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, items, 201)
    } catch (error) {
        next(error)
    }
}
module.exports = router