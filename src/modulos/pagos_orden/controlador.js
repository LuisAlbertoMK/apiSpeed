
const TABLA = 'pagosorden'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function pagosTaller(id_taller, id_sucursal, start, end){
        return db.pagosTaller(id_taller, id_sucursal, start, end)
    }
    function uno(id){
        return db.uno(TABLA, id)
    }
    function PagosRecepcionUnica(id_recepcion){
        return db.PagosRecepcionUnica( id_recepcion)
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
        PagosRecepcionUnica,
        agregar,
        eliminar,
        pagosTaller
    }
    
}