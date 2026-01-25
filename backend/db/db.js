import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

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