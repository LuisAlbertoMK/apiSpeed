
const TABLA = 'empresas'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function empresasTaller(id_taller){
        return db.empresasTaller(id_taller)
    }
    function uno(id){
        return db.uno(TABLA, id)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function empreasSucursal(id_sucursal){
        return db.sucursalesEmpresas(id_sucursal)
    }
    function existeEmpresa(id_taller, empresa){
        return db.existeEmpresa(id_taller, empresa)
    }
    function contadorEmpresasTaller(id_taller){
        return db.contadorEmpresasTaller(id_taller)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        empresasTaller,
        empreasSucursal,
        existeEmpresa,
        contadorEmpresasTaller
    }
    
}