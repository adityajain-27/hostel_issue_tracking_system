import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/db.js";
const app = express();
const PORT = process.env.PORT || 3000
dotenv.config();
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors());



app.get("/",async (req,res)=>{
    try{
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    }catch(error){
        console.error(error);
        res.status(500).send('Database connection failed');
    }
})


app.listen(PORT,(req,res)=>{
    
    console.log(`Server is running on http://localhost:${PORT}/`)
})

