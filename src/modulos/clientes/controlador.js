
const TABLA = 'clientes'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function clientes(){
        return db.clientes()
    }
    function clientesTallerSucursal(id_taller, id_sucursal){
        return db.clientesTallerSucursal(id_taller, id_sucursal)
    }
    function clientesSucursal(id_sucursal){
        return db.clientesSucursal(id_sucursal)
    }
    function contadorClientesUsuario(id_sucursal){
        return db.contadorClientesUsuario(id_sucursal)
    }
    function cliente(id_cliente){
        return db.cliente(id_cliente)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    
    function clienteUnico(id_cliente){
        return db.clienteUnico( id_cliente)
    }


    return {
        clientes,
        clientesSucursal,
        cliente,
        agregar,
        eliminar,
        contadorClientesUsuario,
        clientesTallerSucursal,
        clienteUnico
    }
    
}