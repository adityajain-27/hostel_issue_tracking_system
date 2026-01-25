import express from "express";
import { createissue } from "../controllers/issueController.js";
import { getAllIssues } from "../controllers/issueController.js";

const router =  express.Router();

//post /api/issues
router.post("/", createissue);

//get /api/issues
router.get("/", getAllIssues);

export default router;

