
const TABLA = 'paquetes'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(data){
        return db.consultaPaquetes(data)
    }
    function paquetesTaller(id_taller){
        return db.paquetesTaller(id_taller)
    }
    function uno(id_paquete){
        return db.query(TABLA, {id_paquete})
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function ObtenerDetallePaquete(id_paquete){
        return db.ObtenerDetallePaquete(id_paquete)
    }
    function TotalPaquetes(data){
        return db.totalPaquetes(data)
    }
    function paquetesSemejantes(data){
        return db.busquedaLikePaquetes(data)
    }

    return {
        todos,
        paquetesTaller,
        uno,
        agregar,
        eliminar,
        ObtenerDetallePaquete,
        TotalPaquetes,
        paquetesSemejantes
    }
    
}