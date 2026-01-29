import pool from "../db/db.js";
import bcrypt from "bcrypt";


//admin can create or register new students
export const createStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;


        // now checking for existing user with same email
        const existingUser = await pool.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hashing password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        //insert studnts into db
        const { hostel_name, block_name, room_number } = req.body;
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role, hostel_name, block_name, room_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, email, role, hostel_name, block_name, room_number`,
            [name, email, hashedPassword, "student", hostel_name, block_name, room_number]
        );

        res.status(201).json({
            message: "Student created successfully",
            student: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create student" });
    }
};