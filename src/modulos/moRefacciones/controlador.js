
const TABLA = 'morefacciones'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function morefaccionesTaller(id_taller){
        return db.morefaccionesTaller(id_taller)
    }
    function uno(id){
        return db.uno(TABLA, id)
    }
    async function agregar(body){
        const respuesta = await db.agregar(TABLA, body)
        const insertId = (body.id_moRefaccion === 0) ? respuesta.insertId : body.id_moRefaccion
        return respuesta
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function registraCompatible(body){
        return db.agregar('compatibles', body)
    }
    function getCompatibles(body){
        return db.getCompatibles(body)
    }

    return {
        todos,
        morefaccionesTaller,
        uno,
        agregar,
        eliminar,
        registraCompatible,
        getCompatibles
    }
    
}