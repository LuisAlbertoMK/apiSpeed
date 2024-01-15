const TABLA = 'auth'
const bcrypt = require('bcrypt')
const auth = require('../../auth')


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }
    async function login(correo, password) {
        const data = await db.query(TABLA, {correo})

        return bcrypt.compare(password, data.password)
            .then(resultado=>{
                if (resultado === true) {
                    // generar token
                    return auth.asignaToken({...data})
                }else{
                    throw new Error('Informacion invalida')
                }
            })
    }

    async function agregar(data){
        const authData = {
            id: data.id
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