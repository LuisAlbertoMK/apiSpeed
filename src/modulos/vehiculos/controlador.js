
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
        return db.vehiculo(id_vehiculo)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
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
        uno,
        agregar,
        eliminar,
        placas,
        verificaPlacas,
        vehiculosTallerSucursal
    }
    
}