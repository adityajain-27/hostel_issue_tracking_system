import pool from "../db/db.js";

// Get all students (admin only)
export const getAllStudents = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, hostel_name, block_name, room_number, created_at 
             FROM users 
             WHERE role = 'student' AND is_active = true 
             ORDER BY name ASC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
};

// Get student details with issue history (admin only)
export const getStudentDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Get student info
        const studentResult = await pool.query(
            `SELECT id, name, email, hostel_name, block_name, room_number, created_at 
             FROM users 
             WHERE id = $1 AND role = 'student' AND is_active = true`,
            [id]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Get student's issue history
        const issuesResult = await pool.query(
            `SELECT id, title, description, category, priority, status, created_at, admin_note
             FROM issues 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [id]
        );

        const student = studentResult.rows[0];
        student.issues = issuesResult.rows;

        res.json(student);
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ error: "Failed to fetch student details" });
    }
};

// Deactivate/Unregister student (soft delete)
export const deactivateStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if student exists
        const checkResult = await pool.query(
            "SELECT id, name FROM users WHERE id = $1 AND role = 'student'",
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Soft delete by setting is_active to false
        const result = await pool.query(
            "UPDATE users SET is_active = false WHERE id = $1 RETURNING id, name, email",
            [id]
        );

        res.json({
            message: "Student deactivated successfully",
            student: result.rows[0]
        });
    } catch (error) {
        console.error("Error deactivating student:", error);
        res.status(500).json({ error: "Failed to deactivate student" });
    }
};
