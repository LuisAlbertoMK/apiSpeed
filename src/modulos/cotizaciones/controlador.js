
const TABLA = 'cotizaciones'

const clientes = require('../clientes')
const vehiculos = require('../vehiculos')
const reportes = require('../reportecotizacion')

module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    async function todos(query){
        const {id_taller,id_sucursal, start, end} = query
         let resultados = []
        const respuestas = await db.consultaCotizaciones(id_taller, id_sucursal, start, end)
        const promesas = respuestas.map(async element => {
            const {id_cotizacion, id_cliente, id_vehiculo } = element;
            const reporte = await reportes.uno(id_cotizacion);
            let asigna ={ ...element, reporte };
            asigna['data_cliente'] = await  clientes.clienteUnico(id_cliente)
            asigna['data_vehiculo'] = await  vehiculos.vehiculoUnico(id_vehiculo)
            return asigna
        })
        resultados = await Promise.all(promesas);
        return resultados
    }
    function consultaCotizacion(id_cotizacion){
        return db.consultaCotizacion(id_cotizacion)
    }
    async function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function no_cotizacion(body){
        return db.no_cotizacion(body)
    }
    function cotizacionesCliente(id_cliente){
        return db.cotizacionesCliente(id_cliente)
    }

    function patchDataCotizacion(id_cotizacion, data){
        return db.patchDataCotizacion(id_cotizacion, data)
    }
    function cotizacionesBasicas(data){
        return db.cotizacionesBasicas(data)
    }
    function cotizacionesBasicasContador(data){
        return db.cotizacionesBasicasContador(data)
    }
    function pagCotCliente(data){
        return db.cotizacinesCliente(data)
    }
    function cotizacionesCliente(id_cliente, start, end, ids){
        return db.cotizacionesClienteX(id_cliente, start, end, ids)
    }
    function pagCotClienteContador(data){
        return db.cotizacinesClienteContador(data)
    }
    function cotizacionesVehiculo(id_vehiculo){
        return db.cotizacionesVehiculo(id_vehiculo)
    }
    function cotizacionesClienteBasic(id_cliente, id_taller){
        return db.sp_cotizacionesClienteBasic(id_cliente, id_taller)
    }


    return {
        todos,
        agregar,
        eliminar,
        no_cotizacion,
        consultaCotizacion,
        cotizacionesCliente,
        patchDataCotizacion,
        cotizacionesBasicas,
        cotizacionesBasicasContador,
        pagCotCliente,
        pagCotClienteContador,
        cotizacionesVehiculo,
        cotizacionesClienteBasic
    }
    
}