const jwt = require('jsonwebtoken')
const config = require('../config')
const error = require('../middlaware/errors')
const secret = config.jwt.secret

function asignaToken(data) {
    return jwt.sign(data, secret)
}
function verificarToken(token) {
    jwt.verify(token, secret)
}

const chequearToken =  {
    confirmarToken: function (req) {
        const decodificado = decodificarCabecera(req)
        // if (decodificado.id !== id) throw new Error('No puedes hacer esto')
    }
}
function obtenerToken(autorizacion){
    if (!autorizacion) throw error('No viene token', 401)
    if (autorizacion.indexOf('Bearer') === -1 ) throw error('Formato invalido', 401)
    let token = autorizacion.replace('Bearer ', '')
    return token
}

function decodificarCabecera(req) {
    const autorizacion = req.headers.authorization || ''
    const token = obtenerToken(autorizacion)
    const decodificado = verificarToken(token)

    req.user = decodificado

    return decodificado
}
module.exports = {
    asignaToken,
    chequearToken
}