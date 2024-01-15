require('dotenv').config()

module.exports = {
    app:{
        port: process.env.PORT || 3000,
    },
    jwt:{
        secret: process.env.JET_SECRET || 'notaSecreta'
    },
    mysql:{
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'gers312',
        db: process.env.MYSQL_DB || 'speed',
    }
}