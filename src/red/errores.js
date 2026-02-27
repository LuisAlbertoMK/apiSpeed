const respuesta = require('./respuestas')


function errors(err, req, res, mext){
    console.error('[error]', err);

    const message = err.message || 'Error interno';
    const status = err.statusCode || 500;
    // Incluir detalles de Supabase (details, hint, code) para diagnóstico
    const body = (err.details || err.hint || err.code)
        ? { message, details: err.details, hint: err.hint, code: err.code }
        : message;

    respuesta.error(req, res, body, status);
}

module.exports = errors;