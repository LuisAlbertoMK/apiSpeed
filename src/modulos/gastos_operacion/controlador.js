
const TABLA = 'gastosoperacion'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(dataOperacion){
        const {id_taller, id_sucursal, start, end} = dataOperacion
        return db.sp_gastosOperacion(id_taller, id_sucursal, start, end)
    }
    function gastosOperacionTaller(data){
        return db.gastosOperacionTaller(data)
    }

    function uno(id){
        return db.uno(TABLA, id)
    }
    function gastosOperacionTallerReporte(id_taller, id_sucursal, start, end){
        return db.gastosOperacionTallerReporte(id_taller, id_sucursal, start, end)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(id_gastoOperacion){
        return db.eliminarQuery(TABLA, {id_gastoOperacion})
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        gastosOperacionTaller,
        gastosOperacionTallerReporte
    }
    
}