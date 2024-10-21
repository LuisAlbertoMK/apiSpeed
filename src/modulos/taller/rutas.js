const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/talleresSemejantes', talleresSemejantes)
router.get('/listaTalleresB', listaTalleresB)
router.get('/:id_usuario', uno)
router.post('/tallerActual', agregaTallerActual)
router.post('/historialclientetaller', historialclientetaller)
router.post('/', agregar)
router.put('/', eliminar)
router.patch('/:id_taller', UpdateDataParcial)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos()
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function listaTalleresB (req, res, next){
    try {
        // console.log(req.query)
        const {id_taller} = req.query
        const items =  await controlador.listaTalleresB(id_taller)
        
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function talleresSemejantes (req, res, next){
    try {
        const items =  await controlador.talleresSemejantes(req.query)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function uno(req, res, next){
    try {
        const items = await controlador.uno(req.params.id_usuario)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {
        const {id_taller} = req.body
        const items = await controlador.agregar(req.body)
        const insertId = !id_taller ? items.insertId : id_taller
        respuesta.success(req, res, insertId, 201)
    } catch (error) { next(error) }
}
async function agregaTallerActual(req, res, next){
    try {
        const items = await controlador.agregaTallerActual(req.body)
        console.log({body: req.body, items})
        const mensaje  =  (req.body.id_cliente === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function historialclientetaller(req, res, next){
    try {
        const items = await controlador.historialclientetaller(req.body)
        const mensaje  =  (req.body.id_hist_cli_taller === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function UpdateDataParcial(req, res, next){
    try{
        const {id_taller} = req.params
        const data = req.body
        const items = await controlador.UpdateDataParcial(id_taller, data)
        respuesta.success(req, res, items, 201)
    }catch(error){ next(error) }
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