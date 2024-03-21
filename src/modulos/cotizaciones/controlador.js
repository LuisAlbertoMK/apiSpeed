
const TABLA = 'cotizaciones'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(start, end){
        return db.consultaCotizaciones(start, end)
    }
    function consultaCotizacion(id){
        return db.consultaCotizacion(id)
    }
    async function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function no_cotizacion(body){
        return db.no_cotizacion(body)
    }
    function cotizacionesCliente(id_cliente){
        return db.cotizacionesCliente(id_cliente)
    }


    return {
        todos,
        agregar,
        eliminar,
        no_cotizacion,
        consultaCotizacion,
        cotizacionesCliente
    }
    
}