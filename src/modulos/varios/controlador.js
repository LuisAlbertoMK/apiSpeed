
const TABLA = 'anios'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_anio){
        return db.uno2(TABLA, ['id_anio',id_anio])
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }

    const contadorTabla = (data)=> db.contadorTabla(data)
    return {
        todos,
        uno,
        agregar,
        eliminar,
        contadorTabla
    }
    
}