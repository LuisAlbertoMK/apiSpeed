require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'change_me_in_env',
    },
    postgres: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    },
};