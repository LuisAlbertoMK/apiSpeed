module.exports = {
    app:{
        port: process.env.port || 3000, // Default port if not set in environment variables
    },
    jwt:{
        secret: process.env.JWT_SECRET || 'MtY845@_1gts'
    },
    // Configuración PostgreSQL/Supabase
    postgres: {
        host: process.env.POSTGRES_HOST || 'isqikteedxqtwcdaznwg.supabase.co',
        port: process.env.POSTGRES_PORT || 5432,
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'Des4rroll0_1-+',
        database: process.env.POSTGRES_DB || 'postgres',
        ssl: { rejectUnauthorized: false }, // Requerido para Supabase
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Des4rroll0_1-+@db.isqikteedxqtwcdaznwg.supabase.co:5432/postgres'
    },
    // Mantener MariaDB como fallback durante transición
    mariadb:{
        host: process.env.MYSQL_HOST || 'speed-desarrollo.c9uymykace33.us-east-2.rds.amazonaws.com',
        user: process.env.MYSQL_USER || 'admin',
        password: process.env.MYSQL_PASSWORD || 'Des4rroll0_1-+',
        db: process.env.MYSQL_DB || 'desarrollo',
    }
};