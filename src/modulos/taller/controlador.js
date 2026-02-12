
const TABLA = 'taller'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }

    function todos(){
        return db.Todos(TABLA)
    }
    function uno(id){
        return db.informaciontaller(id)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function UpdateDataParcial(id_taller, data){
        return db.UpdateDataParcial(id_taller, data)
    }
    function listaTalleresB(id_taller){
        return db.listaTalleresB(id_taller)
    }
    function talleresSemejantes(data){
        return db.talleresSemejantes(data)
    }
    function agregaTallerActual(body){
        return db.agregar('talleractualcliente', body)
    }
    function historialclientetaller(body){
        return db.agregar('historialclientetaller', body)
    }
    informaciontallerN = (id_taller) => db.informaciontallerN(id_taller)
    listaTS = (id_cliente) => db.listaTS(id_cliente)
    nuevoTS = (body) => db.agregar('cliente_taller_sucursal', body)
    eliminaTS = ({id_cliente_taller_sucursal}) => db.eliminarQuery('cliente_taller_sucursal', {id_cliente_taller_sucursal})
    return {
        informaciontallerN,
        todos,
        uno,
        UpdateDataParcial,
        agregar,
        listaTS,
        nuevoTS,
        eliminaTS,
        agregaTallerActual,
        historialclientetaller,
        listaTalleresB,
        talleresSemejantes,
        eliminar
    }
    
}