import pool from "../src/db/db.js";

//for creating a new issue by the students
export const createissue = async (req,res)=>{
    try{
        const{
            user_id,
            title,
            category,
            priority,
            description,
            is_public
        } = req.body;

        const result = await pool.query(
            `INSERT INTO issues 
            (user_id, title, category, priority, description, is_public)
            values ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [user_id, title, category, priority, description, is_public]
        );

        res.status(201).json({
            message: "Issue created successfully",
            issue: result.rows[0]
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Failed to create issue" });
    }
};

// for getting all issues on admin dashboard
export const getAllIssues = async(req,res)=>{
    try{
        const result = await pool.query('SELECT * FROM issues ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Failed to fetch issues" });
    }
}
