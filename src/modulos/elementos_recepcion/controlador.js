
const TABLA = 'elementosrecepcion'

module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
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

    return {
        todos,
        uno,
        agregar,
        eliminar
    }
    
}