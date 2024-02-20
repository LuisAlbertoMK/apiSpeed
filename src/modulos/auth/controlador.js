const TABLA = 'auth'
const bcrypt = require('bcrypt')
const auth = require('../../auth')


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }
    async function login(correo, password) {
        let dataUsuario = {}
        const data = await db.query(TABLA, {correo})
        const token = await bcrypt.compare(password, data.password)
            .then(resultado=>{
                return resultado ? auth.asignaToken({...data}) : false
            })
        if (token) {
            dataUsuario = await db.query('usuarios',{id_usuario: data.id_usuario})
        }
        return {token, data, dataUsuario}
    }

    async function agregar(data){
        const authData = {
            id_usuario: data.id_usuario
        }
        if (data.correo) {
            authData.correo = data.correo
        }
        if (data.password) {
            authData.password = await bcrypt.hash( data.password.toString(), 5 )
        }
        return db.agregar(TABLA, authData)
    }
    return {
        agregar,
        login
    }
    
}