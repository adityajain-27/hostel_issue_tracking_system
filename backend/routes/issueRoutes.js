import express from "express";
import { createissue } from "../controllers/issueController.js";
import { getAllIssues } from "../controllers/issueController.js";
import { getPublicIssues } from "../controllers/issueController.js";
import { updateIssueStatus } from "../controllers/issueController.js";
import { openIssue } from "../controllers/issueController.js";
import { resolveIssue } from "../controllers/issueController.js";
import { getMyIssues } from "../controllers/issueController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { isStudent } from "../middlewares/roleMiddleware.js";
const router =  express.Router();

//get /api/issues/public
router.get("/public", getPublicIssues);

//post /api/issues
router.post("/",authenticate,isStudent, createissue);// added autherization for student omly create issue

//get /api/issues
router.get("/", getAllIssues);

// get /api/issues/myissues
router.get("/my",authenticate,isStudent, getMyIssues); // added authentication and authorization for student only 

// put /api/issues/:id/status
router.put("/:id/status", updateIssueStatus);

// put /api/issues/:id/open
router.put("/:id/open",authenticate,isAdmin, openIssue); // added authentication and authorization for admin only

// put /api/issues/:id/resolve
router.put("/:id/resolve",authenticate,isAdmin, resolveIssue);   //added authentication and authorization for admin only



export default router;

