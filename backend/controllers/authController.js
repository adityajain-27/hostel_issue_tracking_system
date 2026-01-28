import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //checking usr exists - step 1
        const userResult = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invaild Credentials" });
        }
        const user = userResult.rows[0];


        // now we compare password - step 2
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invaild Credentials" });
        };

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
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
};
