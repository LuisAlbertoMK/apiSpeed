
const TABLA = 'recepciones'

const reportes = require('../reportes')
const gastos_orden = require('../gastos_orden')
const pagos_orden = require('../pagos_orden')
const clientes = require('../clientes')
const vehiculos = require('../vehiculos')
const elementos_recepcion = require('../elementos_recepcion')
const mod_paquetes = require('../mod_paquetes')
module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.todos(TABLA)
    }
    function recepcionesTallerSucursal(id_taller, id_sucursal, start, end) {
        return db.recepcionesTallerSucursal(id_taller, id_sucursal, start, end)
    }
    async function recepcionesTaller(id_taller, id_sucursal, start, end){
         return db.recepcionesTaller(id_taller, id_sucursal, start, end)
    }
    async function recepcionesTaller2(dataPeticion){
        return db.recepcionesTaller2(dataPeticion) 
    }
    async function recepcionesTaller2contador(dataPeticion){
        return db.recepcionesTaller2contador(dataPeticion) 
    }
    function aceptados(id_taller, id_sucursal){
        return db.seriviciosAceptados(id_taller, id_sucursal)
    }
    function uno(id_recepcion){
        return db.uno(TABLA, id_recepcion)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function RecepcionesVehiculoConsulta(id_vehiculo){
        return db.RecepcionesVehiculoConsulta(id_vehiculo)
    }
    function getRecepcion(id_recepcion){
        return db.RecepcionConsulta(id_recepcion)
    }
    function recepcionesCliente(id_cliente){
        return db.recepcionesCliente(id_cliente)
    }
    function patchRecepcion(id_recepcion, data){
        return db.patchRecepcion(id_recepcion, data)
    }
    function sp_ordenlike(id_recepcion, search){
        return db.sp_ordenlike(id_recepcion, search)
    }
    function reporteRecepcion(id_recepcion) {
        return db.reporteRecepcion(id_recepcion)
    }
    function pagOdenesCliente(data) {
        return db.pagOdenesCliente(data)
    }
    function pagOdenesClienteContador(data) {
        return db.pagOdenesClienteContador(data)
    }
    function administracion(data) {
        return db.administracion(data)
    }
    function recepcionesFechas(data){
        return db.recepcionesTaller2(data)
    }
    function recepcionesFechasContador(data){
        return db.recepcionesTaller2contador(data)
    }
    function recepcionesVehiculo(data){
        return db.recepcionesVehiculo(data)
    }
    function recepcionesBasicasOtroTaller(id_cliente, id_taller){
        return db.recepcionesBasicasOtroTaller(id_cliente, id_taller)
    }
    function sp_recepcionesMismoTaller(id_cliente, id_taller){
        return db.sp_recepcionesMismoTaller(id_cliente, id_taller)
    }
   

    return {
        recepcionesCliente,
        todos,
        uno,
        agregar,
        eliminar,
        RecepcionesVehiculoConsulta,
        getRecepcion,
        aceptados,
        recepcionesTaller,
        recepcionesTaller2,
        recepcionesTaller2contador,
        recepcionesTallerSucursal,
        patchRecepcion,
        sp_ordenlike,
        reporteRecepcion,
        pagOdenesCliente,
        pagOdenesClienteContador,
        administracion,
        recepcionesFechas,
        recepcionesFechasContador,
        recepcionesVehiculo,
        recepcionesBasicasOtroTaller,
        sp_recepcionesMismoTaller
    }
    
}