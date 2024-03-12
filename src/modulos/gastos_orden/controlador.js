
const TABLA = 'gastosorden'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function gastosRecepcion(id_recepcion){
        return db.gastosRecepcionUnica(id_recepcion)
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
    function gastosOrdenTaller(id_taller, id_sucursal, start, end){
        return db.gastosOrdenTaller(id_taller, id_sucursal, start, end)
    }

    return {
        todos,
        uno,
        gastosRecepcion,
        agregar,
        eliminar,
        gastosOrdenTaller
    }
    
}