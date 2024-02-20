
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
    async function agregar(body){
        const respuesta = await db.agregar(TABLA, body)
        console.log(respuesta);
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
        eliminar
    }
    
}