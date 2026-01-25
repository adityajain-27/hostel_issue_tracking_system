import express from "express";
import { createissue } from "../controllers/issueController.js";
import { getAllIssues } from "../controllers/issueController.js";
import { getPublicIssues } from "../controllers/issueController.js";
import { updateIssueStatus } from "../controllers/issueController.js";
import { openIssue } from "../controllers/issueController.js";
import { resolveIssue } from "../controllers/issueController.js";
const router =  express.Router();

//get /api/issues/public
router.get("/public", getPublicIssues);

//post /api/issues
router.post("/", createissue);

//get /api/issues
router.get("/", getAllIssues);

// put /api/issues/:id/status
router.put("/:id/status", updateIssueStatus);

// put /api/issues/:id/open
router.put("/:id/open", openIssue);

// put /api/issues/:id/resolve
router.put("/:id/resolve", resolveIssue);   

export default router;

