
const TABLA = 'recepciones'

const reportes = require('../reportes')
const gastos_orden = require('../gastos_orden')

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
        console.log(dataPeticion);
        const {id_taller, id_sucursal, start, end, gastos, conEstado} = dataPeticion

        const newGastos = (gastos && gastos != undefined)
        let respuesta 
        
        if(conEstado == 'entregado' && start && end){ 
            respuesta = await db.serviciosEntregado(id_taller, id_sucursal, start, end) 
        }
        if(conEstado == 'todos' && start && end){ 
            respuesta = await db.recepcionesTaller2(id_taller, id_sucursal, start, end) 
        }
        if (conEstado === 'cancelado') {
            respuesta = await db.sp_ordenesAbiertas(id_taller, id_sucursal)
        }
    
        
        // Transformamos cada elemento de 'respuesta' a una promesa que resuelve con el elemento actualizado
        const promesas = respuesta.map(async element => {
            const { id_recepcion } = element;
            const reporte = await reportes.uno(id_recepcion);
            let asigna ={ ...element, reporte };
            if (newGastos) {
                const gastosOrden = await gastos_orden.todosOrden(id_recepcion)
                asigna['gastosOrden'] = gastosOrden   
            }
            return asigna
            // Retorna el elemento actualizado con el 'reporte' agregado
        });

        const resultados = await Promise.all(promesas);
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

    return {
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