
const TABLA = 'user_request_limits'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_anio){
        return db.uno2(TABLA, ['id_anio',id_anio])
    }
    function clienter(id_cliente, busqueda){
        return db.clienterequest(TABLA, id_cliente, busqueda)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function clienterequestUpdate(id_request, request_count, busqueda){
        return db.clienterequestUpdate(TABLA, id_request, request_count, busqueda)
    }

    return {
        todos,
        clienter,
        clienterequestUpdate,
        uno,
        agregar,
        eliminar
    }
    
}