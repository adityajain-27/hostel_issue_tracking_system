import pool from "../db/db.js";

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


//for showing public issues to all users

export const getPublicIssues = async(req,res)=>{
    try{
        const result = await pool.query('SELECT * FROM issues WHERE is_public = true ORDER BY created_at DESC');
        res.json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Failed to fetch public issues" });   
        
    }
};


// status chnge of issue by admin

export const updateIssueStatus = async (req,res)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;
        const result = await pool.query(
            `UPDATE issues 
            SET status = $1
            WHERE id = $2
            RETURNING *`,
            [status, id]
        );
        
        if (result.rows.length ===0 ){
            return res.status(404).json({error : "Issue not found"})
        }
        res.json({
            message:"Issue status updated successfully",
            issue : result.rows[0]
        });
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Failed to update issue status"
        })
    };
};

// chnging issue status from reported to in progress
export const openIssue = async (req, res) => {
    try {
        const { id } = req.params;  
        const result = await pool.query(
            `UPDATE issues 
            SET status = 'in_progress'
            WHERE id = $1
            RETURNING *`,
            [id]
        );  
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Issue not found" });
        }   
        res.json({
            message: "Issue marked as in progress",
            issue: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to open issue" });
    }   
};


// adding admin note while resolving the issue
export const resolveIssue = async(req,res)=>{
    try{
        const {id} = req.params;
        const {admin_note} = req.body;
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
        console.error(error);
        res.status(500).json({ error: "Failed to resolve issue" });
    }
};