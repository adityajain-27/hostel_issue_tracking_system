import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction || process.env.DATABASE_URL ? {
        rejectUnauthorized: false
    } : false
};

// Fallback for local development if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
    connectionConfig.user = process.env.DB_USER;
    connectionConfig.password = process.env.DB_PASSWORD;
    connectionConfig.host = process.env.DB_HOST;
    connectionConfig.port = process.env.DB_PORT;
    connectionConfig.database = process.env.DB_NAME;
    delete connectionConfig.connectionString; // Remove if empty
}

const pool = new Pool(connectionConfig);

// pool.on('connect', () => {
//     console.log('Connected to the PostgreSQL database');
// });

(async () => {
    try {
        await pool.query('SELECT 1');
        console.log('Connected to the PostgreSQL database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();

export default pool;