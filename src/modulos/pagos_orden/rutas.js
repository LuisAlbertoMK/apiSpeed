const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/pagosTaller', pagosTaller)
router.get('/recepcion/:id_recepcion', PagosRecepcionUnica)
router.get('/:id_recepcion', uno)
router.post('/', agregar)
// router.put('/', eliminar)
router.delete('/', eliminar)

async function todos (req, res, next){
    try {
        const items =  await controlador.todos(req.query)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function pagosTaller (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end}= req.query
        const items =  await controlador.pagosTaller(id_taller, id_sucursal, start, end)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function PagosRecepcionUnica (req, res, next){
    try {
        const { pagototal }= req.query
        const { id_recepcion} = req.params
        let items =  await controlador.PagosRecepcionUnica(id_recepcion)
        // if(pagototal) items = await controlador.pagoTotal(id_recepcion)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function uno(req, res, next){
    try {
        const items = await controlador.uno(req.params.id_recepcion)
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
async function eliminar(req, res, next){
    try {
        const {id_pagoOrden} = req.query
        const items = await controlador.eliminar(id_pagoOrden)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) {
        next(error)
    }
}
module.exports = router