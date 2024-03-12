// require('dotenv').config()
module.exports = {
    app:{
        port: process.env.PORT || 3000,
    },
    jwt:{
        secret: process.env.JET_SECRET || 'notaSecreta'
    },
    mariadb:{
        host: process.env.MYSQL_HOST || 'speed-pruebas.czaakkaa6tcs.us-east-2.rds.amazonaws.com',
        user: process.env.MYSQL_USER || 'admin',
        password: process.env.MYSQL_PASSWORD || 'Psw54(03)1_sp3eD_-',
        db: process.env.MYSQL_DB || 'desarrollo',
    },
    mysql:{
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'gers312',
        db: process.env.MYSQL_DB || 'desarrollo',
    }

}