const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/gastosOperacionTaller', gastosOperacionTaller)
router.get('/:id', uno)
router.post('/', agregar)
// router.put('/', eliminar)
router.delete('/', eliminar)

async function todos (req, res, next){
    try {
        const items =  await controlador.todos(req.query)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function gastosOperacionTaller (req, res, next){
    try {
        const {id_taller, id_sucursal, active, direction, limit, offset, start,end }= req.query
        const answer =  await controlador.gastosOperacionTaller({id_taller, id_sucursal, active, direction, limit, offset, start, end })
        const total = answer[1][0]?.total || 0; // Primer result set
        const suma_montos = answer[1]?.[0]?.suma_montos || 0;
        const datos = answer[0] || []; // Segundo result set
        //  const total = answer[1]?.[0]?.total || 0;
        respuesta.success(req, res, {total, datos, suma_montos}, 200)
    } catch (error) { next(error) }
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
        const {insertId} = items
        const {id_gastoOperacion} = req.body
        mensaje  =  insertId ? insertId : id_gastoOperacion
        respuesta.success(req, res, mensaje , 201)
    } catch (error) {
        next(error)
    }
}
async function eliminar(req, res, next){
    try {
        const {id_gastoOperacion} = req.query
        const items = await controlador.eliminar(id_gastoOperacion)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) {
        next(error)
    }
}
module.exports = router