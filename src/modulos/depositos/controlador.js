
const TABLA = 'depositos'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function depositosTallerSucursal(id_taller, id_sucursal, start, end){
        return db.depositosTallerSucursal(id_taller, id_sucursal, start, end)
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

    return {
        todos,
        uno,
        agregar,
        eliminar,
        depositosTallerSucursal
    }
    
}