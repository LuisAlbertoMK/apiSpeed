const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', servicios)
router.get('/recepcionesTaller', recepcionesTaller)
router.get('/recepcionesTaller2', recepcionesTaller2)
router.get('/aceptados', aceptados)
router.post('/', agregar)
router.get('/vehiculos', RecepcionesVehiculoConsulta)
router.put('/', eliminar)
router.get('/:id_recepcion', uno)


async function servicios(req, res, next) {
    try {
        const items =  await controlador.recepcionesTaller2(req.query)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}

async function todos (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end, gastos} = req.query
        const items =  await controlador.recepcionesTallerSucursal(id_taller, id_sucursal, start, end)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function recepcionesTaller (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end} = req.query
        const items =  await controlador.recepcionesTaller(id_taller, id_sucursal, start, end)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function recepcionesTaller2 (req, res, next){
    try {
        const {id_taller, id_sucursal, start, end, gastos} = req.query
        const items =  await controlador.recepcionesTaller2(id_taller, id_sucursal, start, end, gastos)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function aceptados (req, res, next){
    try {
        const {id_taller, id_sucursal } = req.query
        const items =  await controlador.aceptados(id_taller,id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function uno(req, res, next){
    try {
        const items = await controlador.getRecepcion(req.params.id_recepcion)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function agregar(req, res, next){
    try {
        const ans = await controlador.agregar(req.body)
        const {insertId } = ans
        mensaje  =   (req.body.id_recepcion === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, insertId, 201)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}
async function RecepcionesVehiculoConsulta(req, res, next){
    try {
        const items = await controlador.RecepcionesVehiculoConsulta(req.query.id_vehiculo)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, items, 201)
    } catch (error) { next(error) }
}
async function recepcionesCliente(id_cliente) {
    try {
        const items =  await controlador.recepcionesCliente(id_cliente)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}

module.exports = router