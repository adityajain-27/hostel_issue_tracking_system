import pool from "../db/db.js";

// Add a new comment to an issue
export const addComment = async (req, res) => {
    try {
        const { issue_id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `INSERT INTO comments (issue_id, user_id, content) 
             VALUES ($1, $2, $3) 
             RETURNING *, (SELECT name FROM users WHERE id = $2) as author_name`,
            [issue_id, userId, content]
        );

        res.status(201).json({
            message: "Comment added",
            comment: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};

// Get all comments for a specific issue
export const getCommentsByIssueId = async (req, res) => {
    try {
        const { issue_id } = req.params;
        const result = await pool.query(`
            SELECT c.*, u.name as author_name, u.role as author_role
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.issue_id = $1
            ORDER BY c.created_at ASC
        `, [issue_id]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};
