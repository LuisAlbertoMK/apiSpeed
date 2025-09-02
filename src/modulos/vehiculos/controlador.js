
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
    const sp_vehiculosCliente = (id_cliente) => db.sp_vehiculosCliente(id_cliente)
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
    function updateTallerSucursalVehiculos(data){
        return db.updateTallerSucursalVehiculos(data)
    }
    function semejantesVehiculosCliente(data){
        return db.semejantesVehiculosCliente(data)
    }
    function semejantesVehiculos(semejantes){
        return db.semejantesV(semejantes)
    }
    function semejantesVehiculosContador(semejantes){
        return db.semejantesVehiculosContador(semejantes)
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
    function vehiculosPlacas(id_cliente){
        return db.vehiculosPlacas(id_cliente)
    }
    function onlyDatavehiculobasica(id_vehiculo){
        return db.onlyDatavehiculobasica(id_vehiculo)
    }
    function contadorVehiculos(id_vehiculo) {
        return db.contadorVehiculos(id_vehiculo)
    }
    function updateFavoritosVehiculos( id_cliente,ids) {
        return db.updateFavoritosVehiculos('vehiculos_favoritos', {id_cliente,favoritos: ids})
    }
    const likeVehiculosSesionCliente = (params) => db.likeVehiculosSesionCliente(params)
    
    const patchVenta = (id_vehiculo, enVenta) => db.patchVenta(id_vehiculo, enVenta)
    const vehiculoVenta = (id_vehiculo) => db.vehiculoVenta(id_vehiculo)
    const update_venta = (id_vehiculo, data) => db.update_venta(id_vehiculo, data)
    const getFavoritos = (id_cliente) => db.getFavoritos('vehiculos_favoritos', id_cliente)
    const getClienteFavoritos = (id_cliente) => db.getClienteFavoritos(id_cliente)
    const vehiculoscliente = (data) => db.vehiculoscliente(data)
    return {
        todos,
        vehiculoscliente,
        patchVenta,
        vehiculosPlacas,
        vehiculosCliente,
        vehiculosCiente,
        vehiculoUnico,
        uno,
        updateFavoritosVehiculos,
        getFavoritos,
        getClienteFavoritos,
        onlyDatavehiculobasica,
        vehiculo,
        contadorVehiculos,
        agregar,
        updateTallerSucursalVehiculos,
        semejantesVehiculosCliente,
        likeVehiculosSesionCliente,
        eliminar,
        placas,
        vehiculoVenta,
        update_venta,
        verificaPlacas,
        vehiculosTallerSucursal,
        vehiculosPaginacion,
        VehiculosPaginacionTotales,
        updateKilometraje,
        semejantesVehiculos,
        semejantesVehiculosContador,
        clienteVehiculos,
        VehiculosPaginacionTotalesCliente,
        listaVehiculosClienteUnico,
        ventaVehiculo,
        ventaVehiculoUnico,
        sp_pagVehiculosVenta,
        contadorVehiculosVenta,
        sp_vehiculosCliente
    }
    
}