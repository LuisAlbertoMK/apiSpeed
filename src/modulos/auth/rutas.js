const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')
const router = express.Router()


router.get('/login', login)

async function login(req, res, next){
    try {
        const token = await controlador.login(req.query.correo, req.query.password)
        respuesta.success(req, res, token, 200)
    } catch (error) {
        next(error)
    }
}

module.exports = router