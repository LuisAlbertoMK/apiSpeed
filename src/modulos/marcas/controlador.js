
const TABLA = 'marcas'


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
    function contadorMarcasTaller(id_taller){
        return db.contadorMarcasTaller(id_taller)
    }
    async function agregar(body){
        const respuesta = await db.agregar(TABLA, body)
        const insertId = (body.id_ === 0) ? respuesta.insertId : body.id
        return insertId
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        contadorMarcasTaller
    }
    
}