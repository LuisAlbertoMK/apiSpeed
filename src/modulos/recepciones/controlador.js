
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
    function sp_ordenlike(id_taller, id_sucursal, search){
        return db.sp_ordenlike(id_taller, id_sucursal, search)
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
    function recepcionesIDs(id_cliente, ids, startDate, endDate){
        return db.recepcionesIDs(id_cliente, ids, startDate, endDate)
    }
    function recepcionesBasicasOtroTaller(id_cliente, id_taller){
        return db.recepcionesBasicasOtroTaller(id_cliente, id_taller)
    }
    function sp_recepcionesMismoTaller(data){
        return db.sp_recepcionesMismoTaller(data)
    }
    function OnlyData(id_recepcion){
        return db.OnlyDataRecepcion(id_recepcion)
    }
    function elementos(id_recepcion){
        return db.elementosRecepciones(id_recepcion)
    }

    const  favoritosRecepciones = (id_cliente, idsVehiculos) =>{
        return db.favoritosRecepciones(id_cliente, idsVehiculos)
    }
    const  sp_recepcionesBS = (id_cliente, limit,offset) => db.sp_recepcionesBS(id_cliente, limit,offset)

    const  sp_recepcionesBSFavoritos = (data) => db.sp_recepcionesBSFavoritos(data)
    
     const historial_recepciones = (id_cliente, id_vehiculo, limit, offset) => {
        return db.historial_recepciones(id_cliente, id_vehiculo, limit, offset)
    }

    const recepcionesVehiculos = (data) => db.recepcionesVehiculos(data)
    const sp_ordenlikeLimitado = (data) => db.sp_ordenlikeLimitado(data)
   
    return {
        sp_ordenlikeLimitado,
        recepcionesVehiculos,
        sp_recepcionesBS,
        sp_recepcionesBSFavoritos,
        historial_recepciones,
        OnlyData,
        elementos,
        recepcionesCliente,
        todos,
        uno,
        agregar,
        eliminar,
        recepcionesIDs,
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
        sp_recepcionesMismoTaller,
        favoritosRecepciones
    }
    
}