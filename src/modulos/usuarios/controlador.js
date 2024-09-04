const TABLA = 'usuarios'

const auth = require('../auth')

module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }
    function todos(){
        return db.usuariosRol()
    }
    function uno(id){
        return db.uno(TABLA, id)
    }
    async function agregar(body, passwordUpdate){
        const usuario = {
            id_usuario: body.id_usuario,
            id_taller: body.id_taller,
            id_sucursal: body.id_sucursal,
            usuario: body.usuario,
            id_rol: body.id_rol,
            create_at: body.create_at,
            update_at: body.update_at,
            correo: body.correo,
            activo: body.activo
        }
        const respuesta = await db.agregar(TABLA, usuario)

        const insertId = (body.id_usuario === 0) ? respuesta.insertId : body.id_usuario
        
        let respuesta2 = ''
        if ((body.usuario || body.password) || passwordUpdate) {
            respuesta2 = await auth.agregar({
                id_usuario: insertId,
                correo: body.correo,
                password: body.password
            })
        }
        
        return insertId

    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function listaTecnicos( id_sucursal){
        return db.listaTecnicos( id_sucursal)
    }
    function consultacorreo(correo){
        return db.consultacorreo(correo)
    }

    function updateData(id_usuario, data){
        return db.updateDataUsuario(id_usuario, data)
    }
    function updateDataUsuarioIDcliente(id_cliente, data){
        return db.updateDataUsuarioIDclienteUsuario(id_cliente, data)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        updateData,
        updateDataUsuarioIDcliente,
        listaTecnicos,
        consultacorreo
    }
    
}