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
    async function agregar(body){
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
        if (body.usuario || body.password) {
            respuesta2 = await auth.agregar({
                id_usuario: insertId,
                correo: body.correo,
                password: body.password
            })
        }
        
        return respuesta2

    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function listaTecnicos( id_sucursal){
        return db.listaTecnicos( id_sucursal)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        listaTecnicos
    }
    
}