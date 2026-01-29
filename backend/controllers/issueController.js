import pool from "../db/db.js";

//for creating a new issue by the students
export const createissue = async (req, res) => {
    try {
        const {
            title,
            category = 'general',
            priority = 'medium',
            description,
            is_public = false
        } = req.body;

        console.log("Received Issue Submission:", req.body);
        console.log("Received File:", req.file);

        // Convert string 'true'/'false' to boolean (FormData sends strings)
        const isPublicBool = String(is_public) === 'true';

        const userId = req.user.id;
        const image_url = req.file ? req.file.path.replace(/\\/g, "/") : null; // Handle paths for Windows

        // Fetch user's hostel details for auto-tagging
        const userDetails = await pool.query(
            `SELECT hostel_name, block_name, room_number FROM users WHERE id = $1`,
            [userId]
        );
        const { hostel_name, block_name, room_number } = userDetails.rows[0] || {};

        const result = await pool.query(
            `INSERT INTO issues 
            (user_id, title, category, priority, description, is_public, status, image_url, hostel_name, block_name, room_number)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [userId, title, category, priority, description, isPublicBool, 'open', image_url, hostel_name, block_name, room_number]
        );

        res.status(201).json({
            message: "Issue created successfully",
            issue: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create issue" });
    }
};

// for getting all issues on admin dashboard
export const getAllIssues = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT issues.*, users.name as student_name, assigned_users.name as assigned_staff_name
            FROM issues 
            LEFT JOIN users ON issues.user_id = users.id 
            LEFT JOIN users as assigned_users ON issues.assigned_user_id = assigned_users.id
            ORDER BY issues.created_at DESC
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch issues" });
    }
}


//for showing public issues to all users

export const getPublicIssues = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT issues.*, users.name as student_name 
            FROM issues 
            LEFT JOIN users ON issues.user_id = users.id 
            WHERE issues.is_public = true 
            ORDER BY issues.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch public issues" });

    }
};


// status chnge of issue by admin

export const updateIssueStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await pool.query(
            `UPDATE issues 
            SET status = $1
            WHERE id = $2
            RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Issue not found" })
        }
        res.json({
            message: "Issue status updated successfully",
            issue: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update issue status"
        })
    };
};

// chnging issue status from reported to in progress
export const openIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_user_id } = req.body;

        const result = await pool.query(
            `UPDATE issues 
            SET status = 'in_progress', assigned_user_id = $1
            WHERE id = $2
            RETURNING *`,
            [assigned_user_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Issue not found" });
        }
        res.json({
            message: "Issue marked as in progress and assigned",
            issue: result.rows[0]
        });
    } catch (error) {
        console.error("Database Error in openIssue:", error.message);
        res.status(500).json({ error: `Backend Error: ${error.message}` });
    }
};

// Fetch potential staff members/admins for assignment
export const getStaff = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, staff_specialty FROM users WHERE role IN ('admin', 'staff')"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch staff" });
    }
};


// adding admin note while resolving the issue
export const resolveIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_note = 'Resolved by admin' } = req.body || {};
        const result = await pool.query(
            `UPDATE issues 
            SET status = 'resolved', admin_note = $1
            WHERE id = $2
            RETURNING *`,
            [admin_note, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Issue not found" });
        }
        res.json({
            message: "Issue resolved successfully",
            issue: result.rows[0]
        });
    } catch (error) {
        console.error("Database Error in resolveIssue:", error.message);
        res.status(500).json({ error: `Backend Error: ${error.message}` });
    }
};

// showing all private issues of user on student dashboard

export const getMyIssues = async (req, res) => {
    try {
        const userId = req.user.id; // this is from jwt 
        const result = await pool.query(
            `SELECT issues.*, users.name as student_name, assigned_users.name as assigned_staff_name
            FROM issues 
            LEFT JOIN users ON issues.user_id = users.id 
            LEFT JOIN users as assigned_users ON issues.assigned_user_id = assigned_users.id
            WHERE issues.user_id = $1
            ORDER BY issues.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch your issues" });
    }

};