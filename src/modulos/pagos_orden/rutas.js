const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/pagosTaller', pagosTaller)
router.get('/recepcion/:id_recepcion', PagosRecepcionUnica)
router.get('/:id_recepcion', uno)
router.post('/pagoRecepcion', pagoRecepcion)
router.post('/', agregar)
router.patch('/:id_pagoOrden', updatepagoOrden)
router.delete('/', eliminar)

async function todos (req, res, next){
    try {
        const {id_taller, id_sucursal, active, direction, limit, offset, start,end }= req.query
        const answer =  await controlador.pagosTaller({id_taller, id_sucursal, active, direction, limit, offset, start, end })
        const total = answer[1][0]?.total || 0; // Primer result set
        const datos = answer[0] || []; // Segundo result set
        const suma_montos = answer[1][0]?.suma_montos || 0;
        respuesta.success(req, res, {total, datos, suma_montos}, 200)
    } catch (error) { next(error) }
}
async function pagoRecepcion (req, res, next){
    try {
        const items =  await controlador.pagoRecepcion(req.body)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}

async function updatepagoOrden(req, res, next){
    try {
        const {id_pagoOrden} = req.params
        const body = req.body
        const items = await controlador.updatepagoOrden(id_pagoOrden, body)
        respuesta.success(req, res, 'item actualizado', 200)
    } catch (error) { next(error) }
}
async function pagosTaller (req, res, next){
    try {
        const {id_taller, id_sucursal, active, direction, limit, offset, start,end }= req.query
        const answer =  await controlador.pagosTaller({id_taller, id_sucursal, active, direction, limit, offset, start, end })
        const total = answer[1][0]?.total || 0; // Primer result set
        const datos = answer[0] || []; // Segundo result set
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) { next(error) }
}
async function PagosRecepcionUnica (req, res, next){
    try {
        const { id_recepcion} = req.params
        let items =  await controlador.PagosRecepcionUnica(id_recepcion)
        respuesta.success(req, res, items, 200)
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
        const {insertId} = items
        const {id_gastoOrden} = req.body
        mensaje  =  insertId ? insertId : id_gastoOrden
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const {id_pagoOrden} = req.query
        const items = await controlador.eliminar(id_pagoOrden)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}
module.exports = router