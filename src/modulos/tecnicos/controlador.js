
const TABLA = 'usuarios'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(id_taller, id_sucursal){
        return db.sp_tecnicosTallerSucursal(id_taller, id_sucursal)
    }
    function uno(id){
        return db.tecnicoUnico(id)
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