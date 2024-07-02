
const TABLA = 'sucursales'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function sucursalesTaller(id_taller){
        return db.sucursalesTaller(id_taller)
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

    return {
        todos,
        updateData,
        sucursalesTaller,
        sucursalesTaller2,
        contadorSucursalesTaller,
        sucursalUnica,
        uno,
        agregar,
        eliminar
    }
    
}