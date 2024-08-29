
const TABLA = 'vehiculos'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function VehiculosPaginacionTotales(data){
        return db.VehiculosPaginacionTotales(data)
    }
    function vehiculosPaginacion(data){
        return db.vehiculosPaginacion(data)
    }
    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id_vehiculo){
        return db.query(TABLA, {id_vehiculo})
    }
    function vehiculoUnico(id_vehiculo){
        return db.vehiculoUnico(id_vehiculo)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function vehiculosCliente(id_cliente){
        return db.sp_vehiculosCliente(id_cliente)
    }
    function placas(){
        return db.placas(TABLA)
    }
    function vehiculosCliente(id_sucursal){
        return db.vehiculosCliente(id_sucursal)
    }
    function vehiculosCiente(id_cliente){
        return db.vehiculosCliente(id_cliente)
    }
    function verificaPlacas(placas){
        return db.verificaPlacas(placas)
    }
    function vehiculosTallerSucursal(id_taller, id_sucursal){
        return db.vehiculosTallerSucursal(id_taller, id_sucursal)
    }
    function updateKilometraje(data){
        return db.updateKilometraje(data)
    }
    function semejantesVehiculos(semejantes){
        return db.semejantesVehiculos(semejantes)
    }
    function clienteVehiculos(data){
        return db.clienteVehiculos(data)
    }
    function VehiculosPaginacionTotalesCliente(id_cliente){
        return db.VehiculosPaginacionTotalesCliente(id_cliente)
    }
    function listaVehiculosClienteUnico(id_cliente){
        return db.listaVehiculosClienteUnico(id_cliente)
    }
    function ventaVehiculo(body){
        return db.agregar('datosvehiculoventa', body)
    }
    function ventaVehiculoUnico(id_vehiculo){
        return db.query('datosvehiculoventa', id_vehiculo)
    }
    function sp_pagVehiculosVenta(data){
        return db.sp_pagVehiculosVenta(data)
    }
    function contadorVehiculosVenta(){
        return db.contadorVehiculosVenta()
    }
    function vehiculo(id_vehiculo){
        return db.vehiculo(id_vehiculo)
    }

    return {
        todos,
        vehiculosCliente,
        vehiculosCiente,
        vehiculoUnico,
        uno,
        vehiculo,
        agregar,
        eliminar,
        placas,
        verificaPlacas,
        vehiculosTallerSucursal,
        vehiculosPaginacion,
        VehiculosPaginacionTotales,
        updateKilometraje,
        semejantesVehiculos,
        clienteVehiculos,
        VehiculosPaginacionTotalesCliente,
        listaVehiculosClienteUnico,
        ventaVehiculo,
        ventaVehiculoUnico,
        sp_pagVehiculosVenta,
        contadorVehiculosVenta
    }
    
}