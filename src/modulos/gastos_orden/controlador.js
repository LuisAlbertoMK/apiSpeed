
const TABLA = 'gastosorden'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) db = require('../../DB/mysql') 

    function todos(){
        return db.Todos(TABLA)
    }
    function sp_gastosOrdenEspecifica(id_recepcion){
        return db.sp_gastosOrdenEspecifica(id_recepcion)
    }
    function todosOrden(id_recepcion){
        return db.sp_gastosOrdenEspecifica(id_recepcion)
    }
    function gastosRecepcion(id_recepcion){
        return db.gastosRecepcionUnica(id_recepcion)
    }
    function uno(id_recepcion){
        return db.query(TABLA, id_recepcion)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function updateGastoOrden(id_gastoOrden,body){
        return db.updateGastoOrden(id_gastoOrden, body)
    }
    function eliminar(id_gastoOrden){
        return db.eliminarQuery(TABLA, {id_gastoOrden})
    }
    function gastosOrdenTaller(id_taller, id_sucursal, start, end){
        return db.gastosOrdenTaller(id_taller, id_sucursal, start, end)
    }
    
    function todosFechas(dataGastos){
        const {id_taller, id_sucursal, start, end} = dataGastos
        return db.sp_gastosOrdenesTallerSucursal(id_taller, id_sucursal, start, end)
    }


    return {
        todos,
        todosFechas,
        uno,
        updateGastoOrden,
        gastosRecepcion,
        agregar,
        eliminar,
        gastosOrdenTaller,
        sp_gastosOrdenEspecifica,
        todosOrden
    }
    
}