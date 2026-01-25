import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "../db/db.js";
import issueRoutes from "../routes/issueroutes.js";
dotenv.config();
//express app initialization
const app = express();
const PORT = process.env.PORT || 3000

//middleware
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors());

app.use("/api/issues", issueRoutes);





app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}/`)
})

