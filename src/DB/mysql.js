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
// login
function dataUsuario(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT usu.*, rol.rol FROM usuarios AS usu
        LEFT JOIN roles AS rol ON usu.id_rol = rol.id_rol
        WHERE usu.id_usuario = ${id_usuario};`, (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}

function queryEliminar(tabla, consulta){
    console.log({consulta});
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM ${tabla} WHERE ?`, consulta, (error, result) =>{
            return error ? reject(error) : resolve(result[0])
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



function VehiculosRelacionados(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculos(${id_sucursal})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}


function vehiculosCliente(id){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT  * 
        FROM vehiculos AS v LEFT JOIN (clientes AS c,marcas AS ma, modelos AS mo, categorias AS ca) ON 
        v.id_cliente = c.id_cliente && v.id_marca = ma.id_marca && v.id_modelo = mo.id_modelo
        && v.id_categoria = ca.id_categoria WHERE v.id_cliente = ${id}`, (error, result) =>{
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
function elementos_cotizaciones(id_cotizacion){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        SELECT 
            eleCot.* ,
            moref.nombre,
            moref.precio,
            moref.tipo,
            moref.descripcion
        FROM elementoscotizacion AS eleCot
        LEFT JOIN cotizaciones AS coti ON eleCot.id_cotizacion = coti.id_cotizacion
        LEFT JOIN morefacciones AS moref ON eleCot.id_moRefaccion = moref.id_moRefaccion
        WHERE coti.id_cotizacion = ${id_cotizacion}`
        , (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function contador(tabla){
    return new Promise((resolve, reject) =>{
        conexion.query(
            `SELECT COUNT(*) as total FROM ${tabla}`
        , (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION DE CLIENTES
function clientesTallerSucursal(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_clientesTallerSucursal(${id_taller},${id_sucursal})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}


//CONSULTA DE VEHICULOS
function verificaPlacas(placas){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_consultaPlacas('${placas}')`, (error, result) =>{
            return error ? reject(error) : resolve(result)
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
function vehiculosCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_vehiculosCliente(${id_cliente})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
//consulta informacion relacionado con clientes
function clientes(){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_clientes()`, (error, result) =>{
            return error ? reject(error) : resolve(result)
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
        conexion.query(`SELECT * FROM compatibles AS com
        LEFT JOIN (marcas AS ma, modelos AS mo)
        ON ma.id_marca = com.id_marca && mo.id_modelo = com.id_modelo
        WHERE id_moRefaccion = ${id_moRefaccion}`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}

// empreas de la sucursal
function sucursalesEmpresas(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT id_empresa, empresa, id_sucursal FROM empresas WHERE id_sucursal = ${id_sucursal}`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}

//CONSULTA DE COTIZACIONES
function consultaCotizaciones(start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        SELECT 
            coti.*, 
            cli.no_cliente, 
            fp.formaPago, 
            serv.servicio, 
            sucu.sucursal, 
            ve.placas, 
            promo.promocion
        FROM 
            cotizaciones AS coti 
            LEFT JOIN formapago AS fp ON coti.id_formaPago = fp.id_formaPago
            LEFT JOIN promociones AS promo ON coti.id_promocion = promo.id_promocion
            LEFT JOIN clientes AS cli ON coti.id_cliente = cli.id_cliente
            LEFT JOIN vehiculos AS ve ON coti.id_vehiculo = ve.id_vehiculo
            LEFT JOIN servicios AS serv ON coti.id_servicio = serv.id_servicio
            LEFT JOIN sucursales AS sucu ON coti.id_sucursal = sucu.id_sucursal
        WHERE coti.createCotizacion_at
		BETWEEN  ${start} AND ${end}
        `, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function consultaCotizacion(id_cotizacion){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        SELECT 
        coti.*,
        cli.no_cliente,
        sucu.sucursal,
        fp.formaPago,
        ser.servicio,
        promo.promocion,
        veh.placas
    FROM cotizaciones AS coti
    LEFT JOIN clientes AS cli ON coti.id_cliente = cli.id_cliente
    LEFT JOIN sucursales AS sucu ON coti.id_sucursal = sucu.id_sucursal
    LEFT JOIN formapago AS fp ON coti.id_formaPago = fp.id_formaPago
    LEFT JOIN servicios AS ser ON coti.id_servicio = ser.id_servicio
    LEFT JOIN promociones AS promo ON coti.id_promocion = promo.id_promocion
    LEFT JOIN vehiculos AS veh ON coti.id_vehiculo = veh.id_vehiculo
    WHERE coti.id_cotizacion = ${id_cotizacion}
        `, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
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
function RecepcionConsulta(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionUnica(${id_recepcion})`, (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function RecepcionElementos(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        SELECT 
            eleCot.* ,
            moref.nombre,
            moref.precio,
            moref.tipo,
            moref.descripcion
        FROM elementosrecepcion AS eleCot
        LEFT JOIN recepciones AS recep ON eleCot.id_recepcion = recep.id_recepcion
        LEFT JOIN morefacciones AS moref ON eleCot.id_moRefaccion = moref.id_moRefaccion
        WHERE recep.id_recepcion  = ${id_recepcion}`
        , (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function RecepcionesVehiculoConsulta(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        SELECT * FROM recepciones AS recep WHERE recep.id_vehiculo = ${id_vehiculo}
        `, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function seriviciosAceptados(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_serviciosAceptados(${id_taller}, ${id_sucursal})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}


// consulta data paquetes
function consultaPaquetes(){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        CALL sp_paquetes()
        `, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function ObtenerDetallePaquete(id_paquete){
    return new Promise((resolve, reject) =>{
        conexion.query(`
        CALL sp_detallesPaquete(${id_paquete})
        `, (error, result) =>{
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
        conexion.query(`DELETE FROM elementos_mod_paquetes_recep WHERE id_eleRecepcion=${id_eleRecepcion}` , (error, result) =>{
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

// PAGOS DE ORDEN
function PagosRecepcionUnica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_pagosOrdenRecepcion(${id_recepcion})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
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
function sucursalesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursales(${id_taller})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function sucursalUnica(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursalUnica(${id_taller}, ${id_sucursal})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}


// USUARIOS
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


// INFORMACION DE EMPRESAS
function empresasTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_empresasTaller(${id_taller})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}


// INFORMACION MO REFACCIONES
function morefaccionesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_morefaccionesTaller(${id_taller})`, (error, result) =>{
            return error ? reject(error) : resolve(result)
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






module.exports = {
    contador,
    clientes,
    clientesSucursal,
    contadorClientesUsuario,
    cliente,
    Todos,
    uno,
    agregar,
    eliminar,
    query,
    queryEliminar,
    eliminaEleModPaqRecep,
    consultaModeloMarca,
    VehiculosRelacionados,
    vehiculosCliente,
    getCompatibles,
    sucursalesEmpresas,
    consultaCotizaciones,
    consultaCotizacion,
    
    elementos_cotizaciones,
    RecepcionConsulta,
    RecepcionesVehiculoConsulta,
    seriviciosAceptados,
    RecepcionElementos,
    ObtenerDetallePaquete,
    consultaPaquetes,
    ObtenerDetallePaqueteModificado,
    ObtenerDetallePaqueteModificadoRecep,
    gastosRecepcionUnica,
    PagosRecepcionUnica,
    listaTecnicos,
    plancliente,
    dataUsuario,
    sucursalesTaller,
    sucursalUnica,
    usuariosRol,
    informaciontaller,
    empresasTaller,
    clientesTallerSucursal,
    verificaPlacas,
    vehiculosTallerSucursal,
    morefaccionesTaller,
    paquetesTaller,
    pagosTaller,
    gastosOrdenTaller,
    gastosOperacionTaller,
    recepcionesTaller
}