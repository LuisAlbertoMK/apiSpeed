const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.post('/registraCompatible', registraCompatible)
router.get('/morefaccionesTaller', morefaccionesTaller)
router.get('/semejantes', semejantes)
router.get('/getCompatibles/:id_moRefaccion', getCompatibles)
router.get('/:id', uno)

async function todos (req, res, next){
    try {
        // const {id_taller, id_sucursal, limit, offset } = req.query
        // const totalMoRefacciones = await controlador.totalMoRefacciones({id_taller, id_sucursal})
        // const {total} = totalMoRefacciones
        // const items =  await controlador.todos({id_taller, id_sucursal, limit, offset })
        const {id_taller,semejantes, active, direction, limit, offset } = req.query
        const answer =  await controlador.spPaginacionmorefaccionesUnificado({id_taller,semejantes, active, direction, limit, offset })
        
        const total = answer[1][0]?.total || 0; // Primer result set
        const datos = answer[0] || []; // Segundo result set
        respuesta.success(req, res, {total, datos},200)
    } catch (error) { next(error) }
}
async function semejantes (req, res, next){
    try {
        const {semejantes, id_taller} = req.query
        const items =  await controlador.semejantesmorefacciones({semejantes, id_taller})
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function morefaccionesTaller (req, res, next){
    try {
        let resultados = []
        const { id_taller} = req.query
        const items =  await controlador.morefaccionesTaller(id_taller)
        
        const promesas = items.map(async element => {
            const {id_moRefaccion} = element
            const asigna ={ ...element };
            const compatibles = await controlador.getCompatibles(id_moRefaccion)
            asigna['compatibles'] = compatibles[0]
            return asigna
        })
        resultados = await Promise.all(promesas);
        respuesta.success(req, res, resultados, 200)
    } catch (error) { next(error) }
}
async function uno(req, res, next){
    try {
        const items = await controlador.uno(req.params.id)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function agregar(req, res, next){
    try {
        const resp = await controlador.agregar(req.body)
        mensaje  =  (req.body.id_moRefaccion === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, resp.insertId, 201)
    } catch (error) { next(error) }
}
function registraCompatible(req, res, next){
    try {
        const resp = controlador.registraCompatible(req.body)
        mensaje  =  (req.body.id_moRefaccion === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function getCompatibles(req, res, next){
    try {
        const items = await controlador.getCompatibles(req.params.id_moRefaccion)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}
module.exports = router