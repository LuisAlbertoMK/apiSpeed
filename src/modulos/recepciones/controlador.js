
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
        
        const {id_taller, id_sucursal, start, end, gastos, conEstado} = dataPeticion

        const newGastos = (gastos && gastos != undefined)
        let respuesta 
        
        if(conEstado === 'entregado' && start && end){ 
            respuesta = await db.serviciosEntregado(id_taller, id_sucursal, start, end) 
        }else if(conEstado === 'todos' && start && end){ 
            respuesta = await db.recepcionesTaller2(id_taller, id_sucursal, start, end) 
        }else if (conEstado === 'cancelado') {
            resultados = await db.sp_ordenesAbiertas(id_taller, id_sucursal)
        }
    
        if(conEstado !== 'cancelado'){
            const promesas = respuesta.map(async element => {
                const { id_recepcion, id_cliente, id_vehiculo } = element;
                // const reporte = await reportes.uno(id_recepcion);
                let asigna ={ ...element };
                if (newGastos) {
                    const gastosOrden = await gastos_orden.todosOrden(id_recepcion)
                    asigna['gastosOrden'] = gastosOrden   
                    const pagosOrden = await pagos_orden.PagosRecepcionUnica(id_recepcion)
                    asigna['pagosOrden'] = pagosOrden   
                }
                const elementos = await elementos_recepcion.uno(id_recepcion)
                const newElementos = await Promise.all(elementos.map(async e => {
                    if (e.id_paquete) {
                        const detallePaqueteResp = await mod_paquetes.ObtenerDetallePaqueteModificadoRecep(id_recepcion, e['id_paquete'],e['id_eleRecepcion'] )
                        e['elementos'] = [...detallePaqueteResp];
                        e.nombre = detallePaqueteResp[0].paquete
                        e['tipo'] = 'paquete'
                    }
                    return e
                }))
                asigna['elementos'] = newElementos
                asigna['data_cliente'] = await  clientes.clienteUnico(id_cliente)
                asigna['data_vehiculo'] = await  vehiculos.vehiculoUnico(id_vehiculo)
                return asigna
                // Retorna el elemento actualizado con el 'reporte' agregado
            });
    
            resultados = await Promise.all(promesas);
        }
        // Transformamos cada elemento de 'respuesta' a una promesa que resuelve con el elemento actualizado
        
        return resultados
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
        recepcionesTallerSucursal
    }
    
}