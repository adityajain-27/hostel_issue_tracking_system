import express from "express";
import { createissue } from "../controllers/issueController.js";
import { getAllIssues } from "../controllers/issueController.js";
import { getPublicIssues } from "../controllers/issueController.js";
import { updateIssueStatus } from "../controllers/issueController.js";
const router =  express.Router();

//get /api/issues/public
router.get("/public", getPublicIssues);




//post /api/issues
router.post("/", createissue);

//get /api/issues
router.get("/", getAllIssues);

// get /api/issues
router.put("/:id/status", updateIssueStatus);



export default router;

