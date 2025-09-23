const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/:id_usuario', tutoriales)
router.post('/', agregar)
router.patch('/patchTutoriales/:id_usuario', patchTutoriales)

async function tutoriales(req, res, next){
    try {
        const {id_usuario} = req.params
        const tutoriales = await controlador.tutoriales(id_usuario)
        respuesta.success(req, res, tutoriales, 200)
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
async function patchTutoriales(req, res, next){
        try {
            const { id_usuario } = req.params;
            const data_cliente = await controlador.patchTutoriales(id_usuario, req.body)
            respuesta.success(req, res, data_cliente, 200)
        } catch (error) { next(error) }
    }
module.exports = router