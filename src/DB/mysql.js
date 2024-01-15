const  mysql = require('mysql')
const config = require('../config')



const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.db,
}

let conexion;

function conMysql() {
    conexion = mysql.createConnection(dbconfig)

    conexion.connect((err)=>{
        if (err) {
            console.log('[db err]', err);
            setTimeout(conMysql(), 200);
        }else{
            console.log('DB conectada');
        }
    })

    conexion.on('error', err =>{
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql()
        }else{
            throw err
        }
    })
}

conMysql()

function Todos(tabla){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}

function uno(tabla, id){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE id = ${id}`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function eliminar(tabla, data){
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, data.id, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function agregar(tabla, data){
    return new Promise((resolve, reject) =>{
        conexion.query(`INSERT INTO  ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function query(tabla, consulta){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}

function consultaModeloMarca(tabla, marca){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE marca = ${marca}`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}



function VehiculosRelacionados(){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT  ma.marca AS marcatxt, mo.modelo AS modelotxt,ca.categoria AS categoriatxt, v.* 
        FROM vehiculos AS v LEFT JOIN (clientes AS c,marcas AS ma, modelos AS mo, categorias AS ca) ON 
        v.cliente = c.id && v.marca = ma.id && v.modelo = mo.id
        && v.categoria = ca.id`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function vehiculosCliente(id){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT vehiculos.* FROM clientes LEFT JOIN vehiculos
        ON vehiculos.cliente = clientes.id  WHERE clientes.id = ${id}`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function cotizacionesCliente(id){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        SELECT cotizaciones.* FROM cotizaciones LEFT JOIN ( clientes) ON 
        (clientes.id = cotizaciones.cliente)  WHERE clientes.id = ${id}`
        , (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function elementos_cotizaciones(id){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        SELECT elementos_cotizacion.* FROM cotizaciones LEFT JOIN (elementos_cotizacion, clientes) ON 
        (clientes.id = cotizaciones.cliente AND cotizaciones.id = elementos_cotizacion.cotizacion)  WHERE clientes.id = ${id}`
        , (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}



module.exports = {
    Todos,
    uno,
    agregar,
    eliminar,
    query,
    vehiculosCliente,
    consultaModeloMarca,
    VehiculosRelacionados
}