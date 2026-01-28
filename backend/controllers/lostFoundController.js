import pool from "../db/db.js";

// Create a new lost/found item
export const createItem = async (req, res) => {
    try {
        const { title, description, category, contact_info } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `INSERT INTO lost_and_found_items 
            (user_id, title, description, category, contact_info) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [userId, title, description, category, contact_info]
        );

        res.status(201).json({
            message: "Item reported successfully",
            item: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to report item" });
    }
};

// Get all items (Open items)
export const getAllItems = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT l.*, u.name as reported_by
            FROM lost_and_found_items l
            JOIN users u ON l.user_id = u.id
            WHERE l.status = 'Open'
            ORDER BY l.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
};

// Mark item as claimed/found
export const markAsClaimed = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check if item exists and belongs to user (or user is admin)
        const check = await pool.query('SELECT * FROM lost_and_found_items WHERE id = $1', [id]);

        if (check.rows.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        const item = check.rows[0];

        if (item.user_id !== userId && userRole !== 'admin') {
            return res.status(403).json({ error: "Unauthorized to modify this item" });
        }

        const result = await pool.query(
            `UPDATE lost_and_found_items 
            SET status = 'Claimed' 
            WHERE id = $1 
            RETURNING *`,
            [id]
        );

        res.json({
            message: "Item marked as claimed",
            item: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update item" });
    }
};
