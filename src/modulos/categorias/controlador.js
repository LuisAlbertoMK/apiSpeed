
const TABLA = 'categorias'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_categoria){
        return db.query(TABLA, {id_categoria})
    }
    function query(id_categoria, id_ocupado){
        return db.query2(TABLA, {id_categoria}, id_ocupado)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function contadorCategorias(){
        return db.contadorCategorias()
    }

    return {
        todos,
        uno,
        query,
        agregar,
        eliminar,
        contadorCategorias
    }
    
}