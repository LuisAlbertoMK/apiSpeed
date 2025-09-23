
const TABLA = 'elementospaquetes'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_categoria){
        return db.query(TABLA, {id_categoria})
        return db.uno(TABLA, id)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function registraElementosVarios(data){
        return db.registraElementosPaquetes(data)
    }
    function patchElementoPaquete(elementos){
        return db.patchElementoPaquete(elementos)
    }
    function eliminaelementospaquete(id_paquete, elementos){
        return db.eliminaelementospaquete(id_paquete, elementos)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        registraElementosVarios,
        patchElementoPaquete,
        eliminaelementospaquete
    }
    
}