
const TABLA = 'vehiculos'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id){
        return db.uno(TABLA, id)
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

    return {
        todos,
        VehiculosRelacionados,
        uno,
        agregar,
        eliminar,
        placas
    }
    
}