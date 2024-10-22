const express = require('express')
const seguridad = require('./seguridad')
const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/rol', usuariosrol)
router.get('/listaTecnicos/:id_sucursal', listaTecnicos)
router.get('/consultacorreo', consultacorreo )
router.get('/:id', uno)
// router.post('/', seguridad(), agregar)
router.post('/', agregar)
// router.put('/', seguridad(), eliminar)
router.put('/', eliminar)
router.patch('/updateDataUsuarioIDcliente/:id_usuario', updateDataUsuarioIDcliente)
router.patch('/:id_usuario', updateData)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos()
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function usuariosrol (req, res, next){
    try {
        const items =  await controlador.usuariosrol(req.query)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function listaTecnicos (req, res, next){
    try {
        const items =  await controlador.listaTecnicos(req.params.id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function updateData(req, res, next) {
    try {
        const {id_usuario} = req.params
        const  data = req.body
        await controlador.updateData(id_usuario, data)
        respuesta.success(req, res, 'actualización', 200)
    } catch (error) { next(error) }
}
async function uno(req, res, next){
    try {
        const items = await controlador.uno(req.params.id_usuario)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function agregar(req, res, next){
    try {
        const {id_usuario, correo, password} = req.body
        const {passwordUpdate} = req.query
        const items = await controlador.agregar(req.body, passwordUpdate)
        const regresaID = items || id_usuario
        respuesta.success(req, res, regresaID, 201)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}

async function consultacorreo(req, res, next){
    try {
        const {correo} = req.query
        const items = await controlador.consultacorreo(correo)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function updateDataUsuarioIDcliente(req, res, next){
    try {
        const {id_usuario} = req.params
        const items = await controlador.updateDataUsuarioIDcliente(id_usuario, req.body)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
module.exports = router
