
const TABLA = 'clientes'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function clientes(){
        return db.clientes()
    }
    function clientesSucursal(id_sucursal){
        return db.clientesSucursal(id_sucursal)
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

    return {
        clientes,
        clientesSucursal,
        cliente,
        agregar,
        eliminar
    }
    
}