import pool from "../db/db.js";

export const createAnnouncement = async (req, res) => {
    try {
        const { title, message } = req.body;    
        const result = await pool.query(
            `INSERT INTO announcements (title, message)
            VALUES ($1, $2)
            RETURNING *`,
            [title, message]
        );

        res.status(201).json({
            message: "Announcement created",
            announcement: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create announcement" });
    }   
};

export const getAllAnnouncements = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM announcements ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch announcements" });
    }   
};