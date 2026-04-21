const validateNumber = (value, fieldName) => {
    if (value === undefined || value === null || value === '') {
        throw new Error(`${fieldName} es requerido`)
    }
    const num = Number(value)
    if (isNaN(num) || num < 0) {
        throw new Error(`${fieldName} debe ser un número válido`)
    }
    return num
}

const validateString = (value, fieldName, maxLength = 255) => {
    if (value === undefined || value === null || value === '') {
        throw new Error(`${fieldName} es requerido`)
    }
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} debe ser texto`)
    }
    if (value.length > maxLength) {
        throw new Error(`${fieldName} excede el máximo de ${maxLength} caracteres`)
    }
    return value.trim()
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new Error('Email inválido')
    }
    return email.toLowerCase().trim()
}

const validateDate = (dateStr, fieldName) => {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
        throw new Error(`${fieldName} debe ser una fecha válida`)
    }
    return dateStr
}

const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.replace(/[<>'";]/g, '')
    }
    return input
}

const validarParams = (schema) => {
    return (req, res, next) => {
        try {
            const params = {}
            for (const [field, rules] of Object.entries(schema)) {
                const value = req.params[field] || req.query[field] || req.body[field]
                
                if (rules.required && (value === undefined || value === null || value === '')) {
                    throw new Error(`${field} es requerido`)
                }
                
                if (value !== undefined && value !== null && value !== '') {
                    switch (rules.type) {
                        case 'number':
                            params[field] = validateNumber(value, field)
                            break
                        case 'string':
                            params[field] = validateString(value, field, rules.maxLength)
                            break
                        case 'email':
                            params[field] = validateEmail(value)
                            break
                        case 'date':
                            params[field] = validateDate(value, field)
                            break
                        default:
                            params[field] = sanitizeInput(value)
                    }
                }
            }
            req.validatedParams = params
            next()
        } catch (error) {
            res.status(400).json({ error: true, message: error.message })
        }
    }
}

module.exports = {
    validateNumber,
    validateString,
    validateEmail,
    validateDate,
    sanitizeInput,
    validarParams
}
