
const TABLA = 'vehiculos'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_vehiculo){
        return db.query(TABLA, {id_vehiculo})
    }
    function vehiculoUnico(id_vehiculo){
        return db.vehiculoUnico(id_vehiculo)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function vehiculosCliente(id_cliente){
        return db.sp_vehiculosCliente(id_cliente)
    }
    function placas(){
        return db.placas(TABLA)
    }
    function vehiculosCliente(id_sucursal){
        return db.vehiculosCliente(id_sucursal)
    }
    function vehiculosCiente(id_cliente){
        return db.vehiculosCliente(id_cliente)
    }
    function verificaPlacas(placas){
        return db.verificaPlacas(placas)
    }
    function vehiculosTallerSucursal(id_taller, id_sucursal){
        return db.vehiculosTallerSucursal(id_taller, id_sucursal)
    }

    return {
        todos,
        vehiculosCliente,
        vehiculosCiente,
        vehiculoUnico,
        uno,
        agregar,
        eliminar,
        placas,
        verificaPlacas,
        vehiculosTallerSucursal
    }
    
}