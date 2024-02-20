
const TABLA = 'modelos'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_marca){
        return db.query(TABLA, {id_marca})
        return db.uno(TABLA, id)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function modelosMarca(id_marca){
        // return db.query(TABLA, {id_marca})
        return db.consultaModeloMarca(TABLA, id_marca)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        modelosMarca
    }
    
}