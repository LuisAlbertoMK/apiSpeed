const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()


router.get('/:tabla', contador)
async function contador(req, res, next){
    try {
        const items = await controlador.contador(req.params.tabla)
        respuesta.success(req, res, items[0].total, 200)
    } catch (error) {
        next(error)
    }
}
module.exports = router