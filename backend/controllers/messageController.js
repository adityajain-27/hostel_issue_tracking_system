import pool from "../db/db.js";
import { createNotification } from "./notificationController.js";

// Get chat history between two users
export const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const result = await pool.query(
            `SELECT m.*, 
                    sender.name as sender_name,
                    receiver.name as receiver_name
             FROM messages m
             JOIN users sender ON m.sender_id = sender.id
             JOIN users receiver ON m.receiver_id = receiver.id
             WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
                OR (m.sender_id = $2 AND m.receiver_id = $1)
             ORDER BY m.created_at ASC`,
            [currentUserId, userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        const sender_id = req.user.id;

        if (!receiver_id || !content) {
            return res.status(400).json({ error: "Receiver ID and content are required" });
        }

        // Insert message
        const result = await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, content) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [sender_id, receiver_id, content]
        );

        const message = result.rows[0];

        // Create notification for receiver
        const senderInfo = await pool.query("SELECT name, role FROM users WHERE id = $1", [sender_id]);
        const senderName = senderInfo.rows[0].name;
        const senderRole = senderInfo.rows[0].role;

        await createNotification(
            receiver_id,
            'message',
            senderRole === 'admin' ? 'New message from Admin' : `New message from ${senderName}`,
            `${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
            message.id,
            'message'
        );

        // Emit socket event (will be handled by Socket.io in index.js)
        if (req.app.get('io')) {
            req.app.get('io').to(`user_${receiver_id}`).emit('new_message', message);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            `UPDATE messages 
             SET is_read = true 
             WHERE id = $1 AND receiver_id = $2 
             RETURNING *`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Message not found or unauthorized" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ error: "Failed to mark message as read" });
    }
};

// Get unread message count
export const getUnreadMessageCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            "SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = false",
            [userId]
        );

        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error("Error fetching unread message count:", error);
        res.status(500).json({ error: "Failed to fetch unread message count" });
    }
};
