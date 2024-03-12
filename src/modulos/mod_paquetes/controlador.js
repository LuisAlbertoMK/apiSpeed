
const TABLA = 'elementosmodpaquetes'

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
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function agregar2(body){
        return db.agregar('elementos_mod_paquetes_recep', body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function eliminaRelacionados(id_eleRecepcion){
        return db.eliminaEleModPaqRecep(id_eleRecepcion)
    }
    function ObtenerDetallePaqueteModificado(id_cotizacion, id_paquete ) {
        return db.ObtenerDetallePaqueteModificado(id_cotizacion, id_paquete)
    }
    function ObtenerDetallePaqueteModificadoRecep(id_recepcion, id_paquete,id_eleRecepcion) {
        return db.ObtenerDetallePaqueteModificadoRecep(id_recepcion, id_paquete,id_eleRecepcion)
    }
    return {
        todos,
        uno,
        agregar,
        agregar2,
        eliminar,
        ObtenerDetallePaqueteModificado,
        ObtenerDetallePaqueteModificadoRecep,
        eliminaRelacionados
    }
    
}