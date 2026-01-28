import pool from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();

const createTableQuery = `
CREATE TABLE IF NOT EXISTS lost_and_found_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Lost', 'Found')),
    contact_info VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'Claimed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

(async () => {
    try {
        await pool.query(createTableQuery);
        console.log("Table 'lost_and_found_items' created successfully.");
    } catch (error) {
        console.error("Error creating table:", error);
    } finally {
        await pool.end();
    }
})();
