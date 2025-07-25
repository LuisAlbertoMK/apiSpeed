const  mysql = require('mysql')
const config = require('../config')

const dbconfigmysql = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.db,
}
const dbconfigMariaDB = {
    host: config.mariadb.host,
    user: config.mariadb.user,
    password: config.mariadb.password,
    database: config.mariadb.db,
}

let conexion;


function conMysql() {
    conexion = mysql.createConnection(dbconfigMariaDB)

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

const escapeMySQL=(dato) =>{
    return mysql.escape(dato)
}

function Todos(tabla){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function sucursalQuery(tabla,campos, campo, ID){
    return new Promise(async (resolve, reject) =>{
        conexion.query(await regresaquery(tabla,campos, campo, ID), (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function regresaquery(tabla, campos, campo, ID){
    let datosSelect = `id_sucursal, id_taller`
    if( `${campos}`.length) datosSelect += `,${campos}`
    return `SELECT ${datosSelect} FROM ${tabla} where ${campo} = ${ID}`
}
function uno(tabla, id){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE id = ${id}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function uno2(tabla, [clave, valor]){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE ${clave} = '${valor}'`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
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
function eliminarQuery(tabla, consulta){
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM ${tabla} WHERE ?`, consulta, (error, result) =>{ 
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
function query(tabla, consulta) {
    const key = Object.keys(consulta)[0];
    const value = consulta[key];
    const query = `SELECT * FROM ${tabla} WHERE ${key} = '${value}'`  
    return new Promise((resolve, reject) => {
      conexion.query(`${query}`, (error, result) => {
        return error ? reject(error) : resolve(result[0]);
      });
    });
  }
function query2(tabla, consulta, id_ocupar) {
    console.log({ tabla, consulta });
    // const key = Object.keys(consulta)[0];
    const value = consulta['id_ocupar'];
    const query = `SELECT * FROM ${tabla} WHERE ${id_ocupar} = ${value}`  
    return new Promise((resolve, reject) => {
      conexion.query(`${query}`, (error, result) => {
        return error ? reject(error) : resolve(result[0]);
      });
    });
  }
// login
function dataUsuario(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_dataUsuario(${id_usuario});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function queryEliminar(tabla, consulta){
    const keys = Object.keys(consulta);
    const key = keys[0]
    const valor = consulta[key]
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM ${tabla} WHERE ${key} = ?`, valor, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function consultaModeloMarca(tabla, id_marca){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE id_marca = ${id_marca}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// VEHICULOS

function VehiculosPaginacionTotales(data){
    const {id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM vehiculos WHERE id_taller = ${id_taller} AND id_sucursal = ${id_sucursal}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function vehiculosPaginacion(data){
    const {id_taller,id_sucursal,limit,offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call spPaginacionVehiculos(${id_taller},${id_sucursal},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function semejantesV(data){
    const {semejantes,id_taller,id_sucursal,limit,offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_likeVehiculosN('${semejantes}', ${id_taller},${id_sucursal},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function clienteVehiculos(data){
    const {id_cliente,limit,offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call spPaginacionVehiculosCliente(${id_cliente},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function vehiculosPlacas(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`call vehiculosPlacas(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function ventaVehiculo(data){
    const {id_cliente,limit,offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call spPaginacionVehiculosCliente(${id_cliente},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_pagVehiculosVenta(data){
    const {limit,offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_pagVehiculosVenta(${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function contadorVehiculosVenta(){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM datosvehiculoventa where activo = 1`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function VehiculosPaginacionTotalesCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM vehiculos WHERE id_cliente = ${id_cliente}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function listaVehiculosClienteUnico(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculosBasicaClienteUnico(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function updateKilometraje(data){
    const {id_vehiculo, kilometraje} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE vehiculos SET kilometraje = ${kilometraje} WHERE id_vehiculo=${id_vehiculo};`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function updateTallerSucursalVehiculos(data){
    const {id_cliente, id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call updateTallerSucursalVehiculos(${id_taller}, ${id_sucursal}, ${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function semejantesVehiculosCliente(data){
    const {id_cliente, id_taller, id_sucursal, semejantes} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call semejantesVehiculosCliente(${semejantes}, ${id_taller}, ${id_sucursal}, ${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function VehiculosRelacionados(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculos(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function vehiculoVenta(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`select * FROM datosvehiculoventa WHERE id_vehiculo = ${id_vehiculo}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function listaTS(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`call talleresCliente(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function update_venta(id_vehiculo, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE datosvehiculoventa SET ? WHERE id_vehiculo = ${id_vehiculo}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function patchVenta(id_vehiculo, enVenta) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE vehiculos SET ? WHERE id_vehiculo = ${id_vehiculo}`, {enVenta}, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function vehiculosCliente(id){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculosCliente(${id})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_vehiculosCliente(id){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculosCliente(${id})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function vehiculo(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_vehiculo(${id_vehiculo})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function cotizacionesCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_dataUsuario(${id_cliente})`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function cotizacionesClienteX(id_cliente, start, end,ids){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL cotizacionesClientes(${id_cliente},'${start}','${end}','${ids}')`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function favoritosCotizaciones(id_cliente, ids){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL cotizacionesFavoritas(${id_cliente},'${ids}')`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function updateFavoritosVehiculos(tabla,data){
    return new Promise((resolve, reject) =>{
        conexion.query(`INSERT INTO  ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function getFavoritos(tabla, id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM  ${tabla} WHERE id_cliente = ${id_cliente}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

function elementos_cotizaciones(id_cotizacion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_elementosCotizaciones(${id_cotizacion})`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

function contador(tabla){
    return new Promise((resolve, reject) =>{
        conexion.query( `SELECT COUNT(*) as total FROM ${tabla}`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function contadorVehiculos(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query( `SELECT COUNT(*) as total FROM vehiculos WHERE id_cliente = ${id_cliente}`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function cotizacinesCliente(data){
    const {id_taller, id_sucursal, id_cliente, limit, offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query( 
            `call sp_pagCotizacionesCliente(${id_taller}, ${id_sucursal}, ${id_cliente}, ${limit},${ offset})`
        , (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}
function cotizacinesClienteContador(data){
    const {id_taller, id_sucursal, id_cliente} = data
    return new Promise((resolve, reject) =>{
        conexion.query( 
            `select count(*) as  total from cotizaciones where id_taller = ${id_taller} and id_sucursal = ${id_sucursal} and 
            id_cliente = ${id_cliente}`
        , (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}

// INFORMACION DE CLIENTES
function semejantesClientes(data){
    const {semejantes,limit, id_taller,id_sucursal, offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL busquedaLikeClientes('${semejantes}',${id_taller},${id_sucursal},${limit},${offset});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function semejantesClientesContador(data){
    const {semejantes, id_taller,id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call busquedaLikeClientesContador('${semejantes}',${id_taller},${id_sucursal});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function onlyDataClientebasica(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_clienteUnicoBasica(${id_cliente})`, (error, result) =>{
            const sendadta = result[0]
            return error ? reject(error) : resolve(sendadta[0])
        })
    })
}
function clientesTallerSucursal(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_clientesTallerSucursal(${id_taller},${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function patchDataCliente(id_cliente, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE clientes SET? WHERE id_cliente = ${id_cliente}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function clienteUnico(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_clienteUnico(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0][0])
        })
    })
}
function historialTallerescliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_tallersCliente(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function tallerActualCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_tallerActualCliente(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
//CONSULTA DE VEHICULOS
function onlyDatavehiculobasica(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculoUnicobasica('${id_vehiculo}')`, (error, result) =>{
            const sendadta = result[0]
            return error ? reject(error) : resolve(sendadta[0])
        })
    })
}
function verificaPlacas(placas){
    return new Promise((resolve, reject) =>{
        conexion.query(`call verificaPlacas('${placas}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function semejantesVehiculos(data){
    const {semejantes, id_taller,id_sucursal, limit, offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL busquedaLikeVehiculos('${semejantes}',${id_taller},${id_sucursal},${limit},${offset});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function likeVehiculosSesionCliente(data){

    const {semejantes, id_cliente, limit, offset, enVenta} = data

    const venta = typeof enVenta === 'boolean' ? enVenta :  enVenta === 'true' 
    
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_likeVehiculosSesionCliente('${semejantes}',${id_cliente},${limit},${offset},${venta});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

function semejantesVehiculosContador(data){
    const {semejantes, id_taller,id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL busquedaLikeVehiculosContador('${semejantes}',${id_taller},${id_sucursal});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function vehiculosTallerSucursal(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculosTallerSucursal(${id_taller},${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function vehiculoUnico(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_vehiculoUnico(${id_vehiculo})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0][0])
        })
    })
}
function cotizacionesVehiculo(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL cotizacionesVehiculo(${id_vehiculo})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function recepcionesVehiculo(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL recepcionesVehiculo(${id_vehiculo})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function recepcionesIDs(id_cliente, ids, startDate, endDate){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL ObtenerRecepcionesPorID(${id_cliente},'${ids}','${startDate}','${endDate}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function favoritosRecepciones(id_cliente, ids){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL recepcionesFavoritos(${id_cliente},'${ids}')`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
//consulta informacion relacionado con clientes
function clientesPaginacionTotales(data){
    const {id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM clientes WHERE id_taller = ${id_taller} AND id_sucursal = ${id_sucursal}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function clientesPaginacionClientes(data){
    const {id_taller, id_sucursal, limit, offset, direction, active} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call ConsultarClientesPorTallerYSucursal(${id_taller},${id_sucursal},${limit},${offset},'${direction}','${active}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function clientes(){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_clientes()`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function clientesSucursal(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_clientes_sucursal(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function contadorClientesUsuario(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_contarClientesUsuario(${id_usuario})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function cliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_clienteUnico(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// consulta elementos compatibles de moRefaccion
function getCompatibles(id_moRefaccion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_getCompatibles(${id_moRefaccion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function semejantesmorefacciones(data){
    const {semejantes, id_taller} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL busquedaLikiMoRefacciones('${semejantes}',${id_taller});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// empreas de la sucursal
function sucursalesEmpresas(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursalesEmpresas(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function contadorEmpresasTaller(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as empTotales FROM empresas WHERE id_taller = ${id_sucursal}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// CONSULTA MARCAS
function contadorMarcasTaller(id_sucursal){

    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as marTotales FROM marcas`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// CONSULTA CATEGORIAS
function contadorCategorias(){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as categTotales FROM categorias`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
//CONSULTA DE COTIZACIONES
function consultaCotizaciones(id_taller, id_sucursal,start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_consultaCotizaciones(${id_taller},${id_sucursal},'${start}','${end}')`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_cotizacionesClienteBasic(id_cliente, id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_cotizacionesClienteBasic(${id_cliente},${id_taller})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_cotizacionesBSC(id_cliente, limite, omitir){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_cotizacionesBSC(${id_cliente},${limite},${omitir})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function sp_cotizacionesBSCFavoritos(id_cliente, limite, omitir,id_vehiculos){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_cotizacionesBSCFavoritos(${id_cliente},${limite},${omitir},'${id_vehiculos}')`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function sp_pagCotizacionesBSC(id_cliente, limite, omitir){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_pagCotizacionesBSC(${id_cliente},${limite},${omitir})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function sp_recepcionesBS(id_cliente, limite, omitir){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesBS(${id_cliente},${limite},${omitir})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function sp_recepcionesBSFavoritos(id_cliente, limite, omitir,id_vehiculos){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesBSFavoritos(${id_cliente},${limite},${omitir},'${id_vehiculos}')`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function cotizacionesBasicas(data) {
    const {id_taller, id_sucursal, start, end, limit, offset} = data
    return new Promise((resolve, reject) => {
      conexion.query(`call sp_cotizacionesTallerBasica(${id_taller},${id_sucursal},'${start}','${end}',${limit},${offset})`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function cotizacionesBasicasContador(data) {
    const {id_taller, id_sucursal, start, end} = data
    return new Promise((resolve, reject) => {
      conexion.query(`select count(*) as total from cotizaciones where id_taller = ${id_taller} and id_sucursal = ${id_sucursal} AND createCotizacion_at BETWEEN  '${start}' AND '${end}' `, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function patchDataCotizacion(id_cotizacion, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE cotizaciones SET? WHERE id_cotizacion = ${id_cotizacion}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function consultaCotizacion(id_cotizacion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_consultaCotizacion(${id_cotizacion})
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0][0])
        })
    })
}
function cotizacionesCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_cotizacionesCliente(${id_cliente})
        `, (error, result) =>{ return error ? reject(error) : resolve(result[0]) }) 
    })
}
// consulta de recepciones
function recepcionesTaller(id_taller, id_sucursal,start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_recepcionesTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function OnlyDataRecepcion(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`call onlydatarecepcion(${id_recepcion})
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function elementosrecepcion(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`call elementosrecepcion(${id_recepcion})
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function elementosrecepcionInternos(id_recepcion, id_paquete){
    return new Promise((resolve, reject) =>{
        conexion.query(`call elementosRecepcionPaquete(${id_recepcion},${id_paquete})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function elementosRecepciones(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`call elementosrecepcion(${id_recepcion})
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function patchRecepcion(id_recepcion, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE recepciones SET? WHERE id_recepcion = ${id_recepcion}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function recepcionesTaller2(data){
    const {id_taller, id_sucursal,start, end, limit, offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_recepcionesTallerBasica(${id_taller}, ${id_sucursal},'${start}','${end}',${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function recepcionesTaller2contador(data){
    const {id_taller, id_sucursal,start, end} = data
    return new Promise((resolve, reject) =>{
        // sp_recepcionesTallerSucursal2
        conexion.query(`select count(*) as total from recepciones where id_taller = ${id_taller} and id_sucursal = ${id_sucursal} AND createRecepciones_at BETWEEN  '${start}' AND '${end}'`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function administracion(data){
    const {id_taller, id_sucursal,start, end,estado} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_recepcionesTallerBasicaAdministracion(${id_taller},${id_sucursal},'${start}','${end}','${estado}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_ordenlike(id_taller, id_sucursal, search){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_ordenlike(${id_taller},${id_sucursal},${search})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function reporteRecepcion(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM reportes WHERE id_recepcion = ${id_recepcion}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_ordenesAbiertas(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_ordenesAbiertas(${id_taller}, ${id_sucursal})`, 
        (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}
function RecepcionConsulta(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionUnica(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0][0])
        })
    })
}
function RecepcionElementos(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_RecepcionElementos(${id_recepcion})`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function RecepcionesVehiculoConsulta(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM recepciones AS recep WHERE recep.id_vehiculo = ${id_vehiculo}
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function seriviciosAceptados(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_serviciosAceptados(${id_taller}, ${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function serviciosEntregado(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesTallerSucursalEntregados(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function recepcionesCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesCliente(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function recepcionesBasicasOtroTaller(id_cliente, id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesOtroTaller(${id_cliente},${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_recepcionesMismoTaller(id_cliente, id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesMismoTaller(${id_cliente},${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function basicasConReporte(id_taller, id_sucursal, start, end) {
    return new Promise((resolve, reject) => {
        const {id_taller, id_sucursal, start, end} = data
      conexion.query(`call sp_cotizacionesTallerBasica(${id_taller},${id_sucursal},'${start}','${end}')`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function pagOdenesCliente(data) {
    const {id_taller, id_sucursal,id_cliente, limit, offset, estadoEntregado} = data
    return new Promise((resolve, reject) => {
      conexion.query(`call sp_pagRecepcionesCliente(${id_taller},${id_sucursal},${id_cliente},${limit},${offset},${estadoEntregado} )`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function pagOdenesClienteContador(data) {
    const {id_taller, id_sucursal, id_cliente} = data
    return new Promise((resolve, reject) => {
      conexion.query(`select count(*) as total from recepciones where id_taller = ${id_taller}
        and id_sucursal = ${id_sucursal} and id_cliente = ${id_cliente}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
// consulta data paquetes
function consultaPaquetes(data){
    const {id_taller, id_sucursal, limit, offset} = data
    
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL spPaginacionPaquetes(${id_taller},${id_sucursal},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function registraElementosPaquetes(data) {
    
    return new Promise((resolve, reject) => {
        const values = data.map(item => [
            item.id_elmenPaquete,
            item.id_paquete,
            item.id_moRefaccion,
            item.activo,
            item.costo,
            item.cantidad
        ]);
        const query = `
            INSERT INTO elementospaquetes (
                id_elmenPaquete,
                id_paquete,
                id_moRefaccion,
                activo,
                costo,
                cantidad
            ) VALUES ? 
            ON DUPLICATE KEY UPDATE
                id_paquete = VALUES(id_paquete),
                id_moRefaccion = VALUES(id_moRefaccion),
                activo = VALUES(activo),
                costo = VALUES(costo),
                cantidad = VALUES(cantidad)
        `;
            conexion.query(query,[values], (error, result) =>{ 
                return error ? reject(error) : resolve(result[0])
            })
    });
  }

    function eliminaelementospaquete(id_paquete, elementos){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL eliminar_elementos_paquetes(${id_paquete}, ${elementos})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
        })
    }

  function patchElementoPaquete(data) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(data) || data.length === 0) {
        return reject(new Error('Data debe ser un array no vacío'));
      }
  
      // Crear las consultas individuales para cada elemento
      const queries = data.map(elemento => {
        const { id_elmenPaquete, id_paquete, id_moRefaccion, activo, costo, cantidad } = elemento;
        
        // Creamos el objeto de actualización excluyendo id_elmenPaquete
        const updateData = { id_paquete, id_moRefaccion, activo, costo, cantidad };
        
        // Generamos los campos y valores para la consulta
        const campos = Object.keys(updateData)
          .map(campo => `${campo} = ?`)
          .join(', ');
        const valores = [...Object.values(updateData), id_elmenPaquete];
        
        return {
          sql: `UPDATE elementospaquetes SET ${campos} WHERE id_elmenPaquete = ?`,
          valores
        };
      });
  
      // Ejecutar todas las consultas en una transacción
      conexion.beginTransaction(err => {
        if (err) return reject(err);
  
        const executeQueries = queries.map(query => {
          return new Promise((resolveQuery, rejectQuery) => {
            conexion.query(query.sql, query.valores, (error, result) => {
              if (error) rejectQuery(error);
              else resolveQuery(result);
            });
          });
        });
  
        Promise.all(executeQueries)
          .then(results => {
            conexion.commit(err => {
              if (err) {
                return conexion.rollback(() => reject(err));
              }
              resolve(results);
            });
          })
          .catch(error => {
            conexion.rollback(() => reject(error));
          });
      });
    });
  }
function totalPaquetes(data){
    const {id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM paquetes WHERE id_taller = ${id_taller} `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function busquedaLikePaquetes(data){
    const {semejantes,id_taller, limit, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call busquedaLikePaquetes('${semejantes}',${id_taller}, ${id_sucursal},${limit})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

function ObtenerDetallePaquete(id_paquete){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_detallesPaquete(${id_paquete})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function ObtenerDetallePaqueteModificado(id_cotizacion, id_paquete){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_paquetesModificados(${id_cotizacion},${id_paquete})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function ObtenerDetallePaqueteModificadoRecep(id_recepcion, id_paquete, id_eleRecepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL ObtenerDetallePaqueteModificadoRecep(${id_recepcion},${id_paquete},${id_eleRecepcion})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function eliminaEleModPaqRecep(id_eleRecepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM elementosmodpaquetesrecep WHERE id_eleRecepcion=${id_eleRecepcion}` , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// GASTOS DE ORDEN
function gastosRecepcionUnica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenRecepcion(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function sp_gastosOrdenEspecifica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenEspecifica(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_gastosOrdenEspecifica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenEspecifica(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_gastosOrdenesTallerSucursal(id_taller, id_sucursal, start,end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenesTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function updateGastoOrden(id_gastoOrden,data){
    console.log(data);
    
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE gastosorden SET ? WHERE id_gastoOrden = ${id_gastoOrden}`, data, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// PAGOS DE ORDEN
function PagosRecepcionUnica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_pagosOrdenRecepcion(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function pagoRecepcion(data){
    return new Promise((resolve, reject) =>{
        conexion.query(`INSERT INTO pagototalorden SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result)  =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}

function sp_pagosTallerSucursal(id_taller, id_sucursal, start,end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_pagosTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')`,
         (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}

function updatepagoOrden(id_pagoOrden,data){
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE pagosorden SET? WHERE id_pagoOrden = ${id_pagoOrden}`, data, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function listaTecnicos(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_listaTecnicos(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function pagoTotal(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT total FROM pagototalorden WHERE id_recepcion = ${id_recepcion} `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function listaTecnicos(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_listaTecnicos(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// planes
function plancliente(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_planCliente(${id_usuario})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// SUCURSALES
function contadorSucursalesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as sucursalesTotales FROM sucursales where id_taller = ${id_taller} and activa`, 
            (error, result) =>{  return error ? reject(error) : resolve(result)
        })
    })
}
function sucursalesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursales(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function sucursalesTaller2(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursales2(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function sucursalesBasicaTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sucursalesBasicaTaller(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function patchDataSucursal(id_sucursal, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE sucursales SET? WHERE id_sucursal = ${id_sucursal}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function sucursalUnica(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursalUnica(${id_taller}, ${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// USUARIOS

function updateDataUsuario(id_usuario,data){
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE usuarios SET? WHERE id_usuario = ${id_usuario}`, data, (error, result) => {
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_usuariosrol(data){
    const {id_taller, rol} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call listausuariosRol(${id_taller},${rol})`, (error, result) => {
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function updateDataUsuarioIDcliente(id_cliente,data){
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE usuarios SET? WHERE id_cliente = ${id_cliente}`, data, (error, result) => {
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function consultacorreo(correo){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * from usuarios WHERE correo = '${correo}'`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function usuariosRol(){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_usuariosRol()`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION DE  TALLER
function informaciontaller(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_informaciontaller(${id_usuario})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function informaciontallerN(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_informaciontallerN(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function UpdateDataParcial(id_taller, data){
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE taller SET? WHERE id_taller = ${id_taller}`, data, (error, result) => {
            return error ? reject(error) : resolve(result)
        })
    })
}
function listaTalleresB(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_consultaTalleres(${id_taller})`, (error, result) => {
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function talleresSemejantes(data){
    const {semejantes, id_taller, limit} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call busquedaLikeTaller('${semejantes}',${id_taller},${limit})`, (error, result) => {
            return error ? reject(error) : resolve(result[0])
        })
    })
}

// INFORMACION DE EMPRESAS
function empresasTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_empresasTaller(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function existeEmpresa(id_taller, empresa){
    return new Promise((resolve, reject) =>{
        conexion.query(`select * from empresas where id_taller = ${id_taller} and empresa = '${empresa}'`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

// INFORMACION MO REFACCIONES
function morefaccionesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_morefaccionesTaller(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function moRefacciones(data){
    const {id_taller, id_sucursal, limit, offset } = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL spPaginacionmorefacciones(${id_taller},${id_sucursal},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function totalMoRefacciones(data){
    const {id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM morefacciones WHERE id_taller = ${id_taller}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

// INFORMACION DE PAQUETES
function paquetesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_paquetes(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION DE PAGOSTALLER
function pagosTaller(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_pagosOrdenesTaller(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION GASTOSORDEN
function gastosOrdenTaller(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenesTaller(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION GASTOSOPERACION TALLER
function gastosOperacionTaller(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOperacionTaller(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION RECEPCIONES TALLER SUCURSAL
function recepcionesTallerSucursal(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION GASTOS OPERACION
function gastosOperacionTallerReporte(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOperacionTallerReporte(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function sp_gastosOperacion(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOperacion(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION GASTOS OPERACION
function depositosTallerSucursal(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_depositosTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}

// CORREOS
function correosClientes(correo){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_correoSearch('${correo}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

// TECNICOS
function sp_tecnicosTallerSucursal(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_tecnicosTallerSucursal(${id_taller}, ${id_sucursal})`
        , (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}
function tecnicoUnico(id_tecnico){
    return new Promise((resolve, reject) =>{
        conexion.query(`select usuario from usuarios where id_usuario = ${id_tecnico}`
        , (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}

function tutoriales(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM tutoriales where id_usuario = ${id_usuario}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function patchTutoriales(id_usuario, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE tutoriales SET? WHERE id_usuario = ${id_usuario}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function usuariosrol() {
    return new Promise((resolve, reject) => {
      conexion.query(`call datausuarios()`, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }


  function clienterequest(tabla, id_cliente, busqueda){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE id_cliente = ${id_cliente} AND request_type = '${busqueda}'`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
  }
  function clienterequestUpdate(tabla, id_request, request_count, busqueda){
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE ${tabla} SET request_count = ${request_count} WHERE id_request=${id_request} and request_type = '${busqueda}';`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
  }
  function historial_cotizaciones(id_cliente, id_vehiculo, limit, offset){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_hitorialVehiculo(${id_cliente}, ${id_vehiculo}, ${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
  }
  function historial_recepciones(id_cliente, id_vehiculo, limit, offset){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_historialRececpiones(${id_cliente}, ${id_vehiculo}, ${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
  }


module.exports = {
    historial_cotizaciones,
    historial_recepciones,
    tutoriales,
    patchTutoriales,
    usuariosrol,
    tecnicoUnico,
    recepcionesCliente,
    recepcionesBasicasOtroTaller,
    sp_recepcionesMismoTaller,
    basicasConReporte,
    correosClientes,
    cotizacionesCliente,
    serviciosEntregado,
    clienteUnico,
    contador,
    clientes,
    historialTallerescliente,
    tallerActualCliente,
    clientesSucursal,
    contadorClientesUsuario,
    cliente,
    Todos,
    sucursalQuery,
    uno,
    agregar,
    eliminar,
    eliminarQuery,
    query,
    query2,
    pagoRecepcion,
    queryEliminar,
    eliminaEleModPaqRecep,
    consultaModeloMarca,
    VehiculosRelacionados,
    vehiculoVenta,
    listaTS,
    update_venta,
    patchVenta,
    vehiculosCliente,
    sp_vehiculosCliente,
    vehiculo,
    getCompatibles,
    sucursalesEmpresas,
    contadorEmpresasTaller,
    contadorMarcasTaller,
    contadorCategorias,
    consultaCotizaciones,
    sp_cotizacionesClienteBasic,
    sp_cotizacionesBSC,
    sp_cotizacionesBSCFavoritos,
    sp_pagCotizacionesBSC,
    sp_recepcionesBS,
    sp_recepcionesBSFavoritos,
    cotizacionesBasicas,
    cotizacionesBasicasContador,
    consultaCotizacion,
    vehiculoUnico,
    cotizacionesVehiculo,
    recepcionesVehiculo,
    recepcionesIDs,
    favoritosRecepciones,
    patchDataCotizacion,
    elementos_cotizaciones,
    cotizacionesClienteX,
    favoritosCotizaciones,
    updateFavoritosVehiculos,
    getFavoritos,
    RecepcionConsulta,
    RecepcionesVehiculoConsulta,
    seriviciosAceptados,
    RecepcionElementos,
    ObtenerDetallePaquete,
    pagOdenesCliente,
    pagOdenesClienteContador,
    consultaPaquetes,
    ObtenerDetallePaqueteModificado,
    ObtenerDetallePaqueteModificadoRecep,
    gastosRecepcionUnica,
    updateGastoOrden,
    PagosRecepcionUnica,
    listaTecnicos,
    plancliente,
    dataUsuario,
    contadorSucursalesTaller,
    sucursalesTaller,
    sucursalesTaller2,
    sucursalesBasicaTaller,
    patchDataSucursal,
    sucursalUnica,
    updateDataUsuario,
    sp_usuariosrol,
    updateDataUsuarioIDcliente,
    consultacorreo,
    usuariosRol,
    informaciontaller,
    informaciontallerN,
    empresasTaller,
    clientesTallerSucursal,
    onlyDataClientebasica,
    patchDataCliente,
    verificaPlacas,
    onlyDatavehiculobasica,
    vehiculosTallerSucursal,
    morefaccionesTaller,
    paquetesTaller,
    pagosTaller,
    gastosOrdenTaller,
    gastosOperacionTaller,
    recepcionesTaller,
    OnlyDataRecepcion,
    elementosrecepcion,
    elementosrecepcionInternos,
    elementosRecepciones,
    patchRecepcion,
    recepcionesTaller2,
    recepcionesTaller2contador,
    sp_ordenlike,
    administracion,
    reporteRecepcion,
    recepcionesTallerSucursal,
    gastosOperacionTallerReporte,
    depositosTallerSucursal,
    sp_gastosOrdenEspecifica,
    sp_ordenesAbiertas,
    sp_pagosTallerSucursal,
    updatepagoOrden,
    sp_gastosOperacion,
    sp_gastosOrdenesTallerSucursal,
    sp_tecnicosTallerSucursal,
    pagoTotal,
    uno2,
    UpdateDataParcial,
    listaTalleresB,
    talleresSemejantes,
    semejantesmorefacciones,
    cotizacinesCliente,
    cotizacinesClienteContador,
    contadorVehiculos,
    semejantesClientes,
    semejantesClientesContador,
    clientesPaginacionTotales,
    clientesPaginacionClientes,
    vehiculosPaginacion,
    semejantesV,
    clienteVehiculos,
    sp_pagVehiculosVenta,
    vehiculosPlacas,
    contadorVehiculosVenta,
    VehiculosPaginacionTotalesCliente,
    listaVehiculosClienteUnico,
    updateKilometraje,
    updateTallerSucursalVehiculos,
    semejantesVehiculosCliente,
    VehiculosPaginacionTotales,
    totalPaquetes,
    busquedaLikePaquetes,
    moRefacciones,
    totalMoRefacciones,
    semejantesVehiculos,
    likeVehiculosSesionCliente,
    semejantesVehiculosContador,
    registraElementosPaquetes,
    eliminaelementospaquete,
    patchElementoPaquete,
    existeEmpresa,
    clienterequest,
    clienterequestUpdate
}