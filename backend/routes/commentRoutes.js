import express from "express";
import { addComment, getCommentsByIssueId } from "../controllers/commentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get comments for an issue
router.get("/:issue_id", authenticate, getCommentsByIssueId);

// Add a comment to an issue
router.post("/:issue_id", authenticate, addComment);

export default router;
