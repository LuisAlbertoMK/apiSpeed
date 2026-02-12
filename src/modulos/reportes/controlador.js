
const TABLA = 'reportes'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_recepcion){
        return db.query(TABLA, {id_recepcion})
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar
    }
    
}