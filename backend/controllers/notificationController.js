import pool from "../db/db.js";

// Create a notification (helper function used by other controllers)
export const createNotification = async (userId, type, title, content, referenceId = null, referenceType = null) => {
    try {
        const result = await pool.query(
            `INSERT INTO notifications (user_id, type, title, content, reference_id, reference_type) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [userId, type, title, content, referenceId, referenceType]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// Get user's notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const result = await pool.query(
            `SELECT * FROM notifications 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            "SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false",
            [userId]
        );

        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        res.status(500).json({ error: "Failed to fetch unread count" });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            `UPDATE notifications 
             SET is_read = true 
             WHERE id = $1 AND user_id = $2 
             RETURNING *`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ error: "Failed to mark notification as read" });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await pool.query(
            "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false",
            [userId]
        );

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
};
