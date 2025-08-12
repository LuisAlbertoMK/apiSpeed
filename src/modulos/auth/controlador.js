const TABLA = 'auth'
const bcrypt = require('bcryptjs')
const auth = require('../../auth')


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }
    async function login(correo, password) {
        let dataUsuario = {}
        let taller = {}
        let sucursal = {}

        const data = await db.query(TABLA, {correo})
        const token = await bcrypt.compare(password, data.password)
            .then(resultado=>{
                return resultado ? auth.asignaToken({...data}) : false
            })
        if (token) {
            const newData =  await db.dataUsuario( data.id_usuario)
            dataUsuario = newData[0]
            unico = {...dataUsuario, token}
        }
        return unico
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