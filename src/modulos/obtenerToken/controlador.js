const auth = require('../../auth')
module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/postgres')
    }
    async function obtenerToken(correo, password) {
        const token = await auth.asignaToken({correo, password})
        return token
    }
    async function verificarTok(token) {
        const esValido = await auth.verificarToken(token)
        return esValido
    }

    return {
        obtenerToken,
        verificarTok
    }
    
}