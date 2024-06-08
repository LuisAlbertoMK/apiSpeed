
const TABLA = 'taller'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id){
        return db.informaciontaller(id)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function UpdateDataParcial(id_taller, data){
        return db.UpdateDataParcial(id_taller, data)
    }

    return {
        todos,
        uno,
        UpdateDataParcial,
        agregar,
        eliminar
    }
    
}