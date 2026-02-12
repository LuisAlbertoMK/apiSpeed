
const TABLA = 'pagosorden'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(dataPagos){
        const {id_taller, id_sucursal, start, end} = dataPagos
        return db.sp_pagosTallerSucursal(id_taller, id_sucursal, start, end)
        // return db.Todos(TABLA)
    }
    const pagosTaller = (data) => db.pagosTaller(data) 
    function uno(id){
        return db.uno(TABLA, id)
    }
    function PagosRecepcionUnica(id_recepcion){
        return db.PagosRecepcionUnica( id_recepcion)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function updatepagoOrden(id_pagoOrden, data){
        return db.updatepagoOrden( id_pagoOrden, data)
    }
    function eliminar(id_pagoOrden){
        return db.eliminarQuery(TABLA, {id_pagoOrden})
    }
    function pagoTotal(id_recepcion){
        return db.pagoTotal(id_recepcion)
    }
    function pagoRecepcion(datos){
        return db.pagoRecepcion(datos)
    }

    return {
        todos,
        pagoRecepcion,
        uno,
        PagosRecepcionUnica,
        agregar,
        eliminar,
        updatepagoOrden,
        pagosTaller,
        pagoTotal
    }
    
}