
const TABLA = 'recepciones'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.todos(TABLA)
    }
    function recepcionesTaller(id_taller, id_sucursal, start, end){
        return db.recepcionesTaller(id_taller, id_sucursal, start, end)
    }
    function aceptados(id_taller, id_sucursal){
        return db.seriviciosAceptados(id_taller, id_sucursal)
    }
    function uno(id_recepcion){
        return db.uno(TABLA, id_recepcion)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function RecepcionesVehiculoConsulta(id_vehiculo){
        return db.RecepcionesVehiculoConsulta(id_vehiculo)
    }
    function getRecepcion(id_recepcion){
        return db.RecepcionConsulta(id_recepcion)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        RecepcionesVehiculoConsulta,
        getRecepcion,
        aceptados,
        recepcionesTaller
    }
    
}