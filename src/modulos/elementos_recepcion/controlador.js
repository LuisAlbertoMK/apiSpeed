
const TABLA = 'elementosrecepcion'

module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_recepcion){
        return db.RecepcionElementos( id_recepcion)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(id_eleRecepcion){
        return db.queryEliminar(TABLA, {id_eleRecepcion})
    }
    function elementosrecepcion(id_recepcion){
        return db.elementosrecepcion(id_recepcion)
    }
    function elementosrecepcionInternos(id_recepcion, id_paquete){
        return db.elementosrecepcionInternos(id_recepcion, id_paquete)
    }

    return {
        todos,
        elementosrecepcion,
        elementosrecepcionInternos,
        uno,
        agregar,
        eliminar
    }
    
}