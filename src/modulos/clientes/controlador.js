
const TABLA = 'clientes'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function clientesPaginacionTotales(data){
        return db.clientesPaginacionTotales(data)
    }
    function clientesPaginacionClientes(data){
        return db.clientesPaginacionClientes(data)
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
    function clienteUnico(id_cliente){
        return db.clienteUnico(id_cliente)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function semejantesClientes(semejantes){
        return db.semejantesClientes(semejantes)
    }
    function semejantesClientesContador(semejantes){
        return db.semejantesClientesContador(semejantes)
    }
    function historialTallerescliente(id_cliente){
        return db.historialTallerescliente(id_cliente)
    }
    function tallerActualCliente(id_cliente){
        return db.tallerActualCliente(id_cliente)
    }
    function patchDataCliente(id_cliente, body){
        return db.patchDataCliente(id_cliente, body)
    }
  


    return {
        semejantesClientes,
        semejantesClientesContador,
        clientesSucursal,
        agregar,
        eliminar,
        contadorClientesUsuario,
        clientesTallerSucursal,
        clienteUnico,
        patchDataCliente,
        clientesPaginacionTotales,
        clientesPaginacionClientes,
        historialTallerescliente,
        tallerActualCliente
    }
    
}