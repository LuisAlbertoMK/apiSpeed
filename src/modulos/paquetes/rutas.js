const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/ObtenerDetallePaquete', ObtenerDetallePaquete)
router.get('/paquetesTaller', paquetesTaller)
router.get('/semejantes', semejantes)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/:id', uno)
// router.put('/categoria', categoria)


async function todos (req, res, next){
    try {
        const {id_taller, id_sucursal, limit, offset} = req.query
        const items =  await controlador.todos({id_taller, id_sucursal, limit, offset})
        const totalPaquetesResponse = await controlador.TotalPaquetes({id_taller, id_sucursal})
        const {total} = totalPaquetesResponse
        const newPaquetes = await Promise.all(items.map(async e => {
            const {id_paquete} = e 
            const elementosPaquete = await controlador.ObtenerDetallePaquete(id_paquete)
            e['elementos'] = elementosPaquete[0]
            return e
        }))
        respuesta.success(req, res, {total, paquetes: newPaquetes}, 200)
    } catch (error) {
        next(error)
    }
}
async function semejantes (req, res, next){
    try {
        const {semejantes, id_taller, id_sucursal, limit} = req.query
        
        const items =  await controlador.paquetesSemejantes({semejantes, id_taller,id_sucursal, limit})

        const newPaquetes = await Promise.all(items.map(async e => {
            const {id_paquete} = e 
            const elementosPaquete = await controlador.ObtenerDetallePaquete(id_paquete)
            e['elementos'] = elementosPaquete[0]
            return e
        }));
        respuesta.success(req, res, newPaquetes, 200)
    } catch (error) { next(error) }
}
async function paquetesTaller (req, res, next){
    try {
        const {id_taller} = req.query
        const items =  await controlador.paquetesTaller(id_taller)

        const newPaquetes = await Promise.all(items[0].map(async e => {
                const {id_paquete} = e 
                const elementosPaquete = await controlador.ObtenerDetallePaquete(id_paquete)
                e['elementos'] = elementosPaquete[0]
                return e
        }))
        const filtro = newPaquetes.filter(e=>e.elementos)
        respuesta.success(req, res, filtro, 200)
    } catch (error) { next(error) }
}
async function ObtenerDetallePaquete (req, res, next){
    try {
        const {id_paquete} = req.query
        const items =  await controlador.ObtenerDetallePaquete(id_paquete)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function uno(req, res, next){
    try {
        const id_paquete = req.params.id
        const items = await controlador.uno(id_paquete)
        const elementosResponse =  await controlador.ObtenerDetallePaquete(id_paquete)
        const dataPaquete = {
            ...items,
            elementos: elementosResponse[0]
        }
        
        respuesta.success(req, res, dataPaquete, 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        const {insertId} = items
        respuesta.success(req, res, insertId , 201)
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