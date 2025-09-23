
const TABLA = 'tutoriales'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function tutoriales(id_usuario){
        return db.tutoriales(id_usuario)
    }
    const agregar = (body) => db.agregar(TABLA, body)

    const patchTutoriales = (id_usuario, body) => db.patchTutoriales(id_usuario, body)
   

    return {
        tutoriales,
        agregar,
        patchTutoriales
    }
    
}