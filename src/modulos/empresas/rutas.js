const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.get('/empresasTaller', empresasTaller)
router.get('/existeEmpresa', existeEmpresa)
router.get('/contadorEmpresasTaller', contadorEmpresasTaller)
router.get('/:id', uno)
router.post('/', agregar)
router.put('/', eliminar)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos()
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error)    }
}
async function contadorEmpresasTaller (req, res, next){
    try {
        const {id_taller} = req.query
        const items =  await controlador.contadorEmpresasTaller(id_taller)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error)    }
}
async function existeEmpresa (req, res, next){
    try {
        const {id_taller, empresa} = req.query
        const items =  await controlador.existeEmpresa(id_taller, empresa)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error)    }
}
async function empresasTaller (req, res, next){
    try {
        const items =  await controlador.empresasTaller(req.query.id_taller)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error)    }
}
async function uno(req, res, next){
    try {
        const items = await controlador.empreasSucursal(req.params.id)
        respuesta.success(req, res, items, 200)
    } catch (error) { next(error)    }
}
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        // mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        const insertId  = items['insertId'] ? items['insertId'] : req.body.id_empresa
        respuesta.success(req, res, insertId, 201)
    } catch (error) { next(error)    }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error)    }
}
module.exports = router