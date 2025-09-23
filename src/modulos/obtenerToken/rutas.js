const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')
const router = express.Router()


router.get('/', obtenerToken)
router.get('/verificarToken', verificarToken)

async function obtenerToken(req, res, next){
    try {
        const token = await controlador.obtenerToken(req.query.correo, req.query.password)
        respuesta.success(req, res, token, 200)
    } catch (error) { next(error) }
}
async function verificarToken(req, res, next) { 
    try {
        const {token} = req.query
        const verificado = await controlador.verificarTok(token)
        const valido = verificado === 'invalid token' ? false : true
        respuesta.success(req, res, valido,  200)
    } catch (error) { 
        error.message = 'invalid token'
        next(error.message) 
    }
}

module.exports = router