require('dotenv').config()

const requiredEnvVars = ['JWT_SECRET', 'MYSQL_PASSWORD']
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`ERROR: Required env var ${envVar} not set`)
        process.exit(1)
    }
}

module.exports = {
    app: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    mariadb: {
        host: process.env.MYSQL_HOST || 'speed-desarrollo.c9uymykace33.us-east-2.rds.amazonaws.com',
        user: process.env.MYSQL_USER || 'admin',
        password: process.env.MYSQL_PASSWORD,
        db: process.env.MYSQL_DB || 'desarrollo',
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD,
        db: process.env.MYSQL_DB || 'desarrollo',
    },
    rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
        max: process.env.RATE_LIMIT_MAX || 100,
    }
}