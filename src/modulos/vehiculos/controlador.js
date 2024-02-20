
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
    function VehiculosRelacionados(){
        return db.VehiculosRelacionados(TABLA)
    }
    function vehiculosCiente(id_cliente){
        return db.vehiculosCliente(id_cliente)
    }

    return {
        todos,
        VehiculosRelacionados,
        vehiculosCiente,
        uno,
        agregar,
        eliminar,
        placas
    }
    
}