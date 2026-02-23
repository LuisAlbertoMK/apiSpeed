const app = require('./app.js')

const server = app.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto:`, app.get('port'));
})

process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...')
    server.close(() => {
        console.log('Servidor cerrado correctamente')
        process.exit(0)
    })
})

process.on('SIGINT', () => {
    console.log('SIGINT recibido, cerrando servidor...')
    server.close(() => {
        console.log('Servidor cerrado correctamente')
        process.exit(0)
    })
})

module.exports = app