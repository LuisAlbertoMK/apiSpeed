
const TABLA = 'anios'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }
    function contador(tabla){
        return db.contador(tabla)
    }

    return {
        contador
    }
    
}