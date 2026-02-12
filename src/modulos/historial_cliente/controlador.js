
const TABLA = 'clientes'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }
    function vehiculosCliente(id){
        return db.vehiculosCliente(id)
    }
    function cotizacionesCliente(id){
        return db.cotizacionesCliente(id)
    }
    function elementos_cotizaciones(id){
        return db.elementos_cotizaciones(id)
    }
    return {
        vehiculosCliente,
        cotizacionesCliente,
        elementos_cotizaciones
    }
    
}