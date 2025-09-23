const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/tabla-query', sucursalQuery)
router.get('/sucursalesBasicaTaller', sucursalesBasicaTaller)
router.get('/contadorSucursalesTaller', contadorSucursalesTaller)
router.get('/sucursalesTaller/:id_taller', sucursalesTaller)
router.get('/:id_sucursal', sucursalUnica)
router.patch('/:id_sucursal', updateData)
router.post('/', agregar)
router.put('/', eliminar)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos()
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function sucursalQuery (req, res, next){
    try {
        const {tabla,campos, campo, ID} = req.query
        const item = await controlador.sucursalQuery(tabla,campos || '', campo, ID)
        respuesta.success(req, res, item, 200)
    } catch (error) {
        next(error)
    }
}
async function contadorSucursalesTaller (req, res, next){
    try {
        const {id_taller} = req.query
        const items =  await controlador.contadorSucursalesTaller(id_taller)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function sucursalesBasicaTaller (req, res, next){
    try {
        const {id_taller} = req.query
        const items =  await controlador.sucursalesBasicaTaller(id_taller)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function updateData(req, res, next) {
    try {
        const {id_sucursal} = req.params
        const  data = req.body
        const items =  await controlador.updateData(id_sucursal, data)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function sucursalesTaller (req, res, next){
    try {
        const {id_taller}= req.params
        const { semejantes ,id_sucursal ,active ,direction ,limit ,offset} = req.query
        const answer= await controlador.sucursalesTaller({ semejantes ,id_taller ,id_sucursal ,active ,direction ,limit ,offset})
        const datos = answer[0] || [];
        const total = answer[1][0]?.total || 0;
        respuesta.success(req, res, {total, datos}, 200)
    } catch (error) {
        next(error)
    }
}
async function sucursalUnica (req, res, next){
    try {
        const {id_taller} = req.query
        const { id_sucursal} = req.params
        const items =  await controlador.sucursalUnica(id_taller, id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function uno(req, res, next){
    try {
        const items = await controlador.uno(req.params.id_sucursal)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        const id_sucursal  =  (items.insertId) ? items.insertId : req.body.id
        respuesta.success(req, res, id_sucursal, 201)
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