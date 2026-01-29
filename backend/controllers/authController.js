import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[LOGIN ATTEMPT] Email: ${email}`);

        //checking usr exists - step 1
        const userResult = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (userResult.rows.length === 0) {
            console.log(`[LOGIN FAILED] User not found for email: ${email}`);
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const user = userResult.rows[0];
        console.log(`[LOGIN INFO] User found: ${user.name} (${user.role})`);

        // now we compare password - step 2
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log(`[LOGIN FAILED] Password mismatch for user: ${email}`);
            return res.status(401).json({ message: "Invalid Credentials" });
        };

        console.log(`[LOGIN SUCCESS] Credentials verified for: ${email}`);

        // now generating jwt token for id and role of user for later autherization- step 3
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        //sending response with token
        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },

        });
    } catch (error) {
        console.error("[LOGIN ERROR] Exception occurred:", error);
        res.status(500).json({ error: "Login failed: " + error.message });
    }
};
