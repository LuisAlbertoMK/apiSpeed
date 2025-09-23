const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()


router.get('/vehiculos/:id', vehiculosCliente)
router.get('/cotizacionesCliente/:id', cotizacionesCliente)
router.get('/elementos_cotizaciones/:id', elementos_cotizaciones)

async function vehiculosCliente(req, res, next){
    try {
        const items = await controlador.vehiculosCliente(req.params.id)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function cotizacionesCliente(req, res, next){
    try {
        const items = await controlador.cotizacionesCliente(req.params.id)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function elementos_cotizaciones(req, res, next){
    try {
        const items = await controlador.elementos_cotizaciones(req.params.id)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}

module.exports = router