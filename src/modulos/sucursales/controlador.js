
const TABLA = 'sucursales'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function  sucursalQuery(tabla, campos, condicion, ID){
        return db.sucursalQuery(tabla,campos,  condicion, ID)
    }
    function sucursalesTaller(data){
        return db.sucursalesTaller(data)
    }
    function sucursalesTaller2(id_taller){
        return db.sucursalesTaller2(id_taller)
    }
    function sucursalUnica(id_taller, id_sucursal){
        return db.sucursalUnica(id_taller, id_sucursal)
    }
    function uno(id_sucursal){
        return db.query(TABLA, {id_sucursal})
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function updateData(id_sucursal, data){
        return db.patchDataSucursal(id_sucursal, data)
    }
    function contadorSucursalesTaller(id_taller){
        return db.contadorSucursalesTaller(id_taller)
    }
    function sucursalesBasicaTaller(id_taller){
        return db.sucursalesBasicaTaller(id_taller)
    }

    return {
        todos,
        updateData,
        sucursalesTaller,
        sucursalesTaller2,
        contadorSucursalesTaller,
        sucursalesBasicaTaller,
        sucursalUnica,
        uno,
        agregar,
        eliminar,
        sucursalQuery
    }
    
}