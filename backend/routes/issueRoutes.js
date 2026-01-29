import express from "express";
import { createissue } from "../controllers/issueController.js";
import { getAllIssues } from "../controllers/issueController.js";
import { getPublicIssues } from "../controllers/issueController.js";
import { updateIssueStatus } from "../controllers/issueController.js";
import { openIssue, getStaff } from "../controllers/issueController.js";
import { resolveIssue } from "../controllers/issueController.js";
import { getMyIssues } from "../controllers/issueController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin, isStudent } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

// get /api/issues/staff
router.get("/staff", authenticate, isAdmin, getStaff);

//get /api/issues/public
router.get("/public", getPublicIssues);

//post /api/issues
router.post("/", authenticate, isStudent, (req, res, next) => {
    console.log("Entering upload middleware");
    upload.single("image")(req, res, (err) => {
        if (err) {
            console.error("Multer Error:", err);
            return res.status(400).json({ error: err.message });
        }
        console.log("Multer finished. Body:", req.body, "File:", req.file);
        next();
    });
}, createissue);// added autherization for student omly create issue

//get /api/issues
router.get("/", getAllIssues);

// get /api/issues/myissues
router.get("/my", authenticate, isStudent, getMyIssues); // added authentication and authorization for student only 

// put /api/issues/:id/status
router.put("/:id/status", updateIssueStatus);

// put /api/issues/:id/open
router.put("/:id/open", authenticate, isAdmin, openIssue); // added authentication and authorization for admin only

// put /api/issues/:id/resolve
router.put("/:id/resolve", authenticate, isAdmin, resolveIssue);   //added authentication and authorization for admin only



export default router;

